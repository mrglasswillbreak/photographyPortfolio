'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Users, Eye, Clock, Globe, Monitor, RefreshCw, Loader2 } from 'lucide-react';

/* ─────────────────────────────── types ────────────────────────────────── */
interface DataPoint {
  label: string;
  count: number;
}
interface Analytics {
  overview: {
    total_views: number;
    unique_sessions: number;
    avg_duration: number | null;
  };
  views_over_time: { date: string; count: number }[];
  devices: DataPoint[];
  browsers: DataPoint[];
  os: DataPoint[];
  referrers: DataPoint[];
  countries: DataPoint[];
}

/* ─────────────────────────────── helpers ───────────────────────────────── */
function fmtDuration(seconds: number | null) {
  if (!seconds || seconds <= 0) return '—';
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function fmtDate(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* ─────────────────────────────── chart colours ─────────────────────────── */
const PALETTE = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
  '#06b6d4', '#f97316', '#6366f1', '#84cc16', '#ef4444',
];

const MAX_X_LABELS = 7;

/* ─────────────────────────────── StatCard ──────────────────────────────── */
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            {label}
          </p>
          <p className="mt-1.5 text-2xl font-bold text-neutral-900 dark:text-white">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-neutral-400">{sub}</p>}
        </div>
        <div className="p-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
          <Icon className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────── HorizontalBar ─────────────────────────── */
function HorizontalBar({ data, total }: { data: DataPoint[]; total: number }) {
  if (data.length === 0) return <EmptyState />;
  return (
    <div className="space-y-2.5">
      {data.map(({ label, count }, i) => {
        const pct = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={label} className="flex items-center gap-3 text-sm">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: PALETTE[i % PALETTE.length] }}
            />
            <span className="w-28 truncate text-neutral-600 dark:text-neutral-400 text-xs">
              {label}
            </span>
            <div className="flex-1 bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: PALETTE[i % PALETTE.length] }}
              />
            </div>
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 w-8 text-right tabular-nums">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────── DonutChart ────────────────────────────── */
function DonutChart({ data }: { data: DataPoint[] }) {
  if (data.length === 0) return <EmptyState />;
  const total = data.reduce((s, d) => s + d.count, 0);
  const r = 36;
  const circ = 2 * Math.PI * r;
  let cumulative = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <svg viewBox="0 0 100 100" className="w-28 h-28 flex-shrink-0 -rotate-90">
        {data.map(({ label, count }, i) => {
          const fraction = count / (total || 1);
          const dash = fraction * circ;
          const offset = circ * (1 - cumulative);
          cumulative += fraction;
          return (
            <circle
              key={label}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={PALETTE[i % PALETTE.length]}
              strokeWidth="22"
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-circ + offset}
            />
          );
        })}
        {/* centre cutout */}
        <circle cx="50" cy="50" r="25" className="fill-white dark:fill-neutral-900" />
      </svg>
      <div className="flex-1 space-y-2 w-full">
        {data.map(({ label, count }, i) => (
          <div key={label} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: PALETTE[i % PALETTE.length] }}
              />
              <span className="text-neutral-600 dark:text-neutral-400 truncate">{label}</span>
            </div>
            <span className="font-semibold text-neutral-900 dark:text-white ml-2 tabular-nums">
              {total > 0 ? Math.round((count / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────── LineChart ─────────────────────────────── */
function LineChart({ data }: { data: { date: string; count: number }[] }) {
  if (data.length === 0) return <EmptyState />;

  const W = 600;
  const H = 120;
  const pad = { top: 10, right: 10, bottom: 24, left: 28 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const maxVal = Math.max(...data.map((d) => d.count), 1);
  const xScale = (i: number) => pad.left + (i / Math.max(data.length - 1, 1)) * innerW;
  const yScale = (v: number) => pad.top + innerH - (v / maxVal) * innerH;

  const points = data.map((d, i) => `${xScale(i)},${yScale(d.count)}`).join(' ');
  const areaPoints =
    `${xScale(0)},${pad.top + innerH} ` +
    points +
    ` ${xScale(data.length - 1)},${pad.top + innerH}`;

  // Y-axis ticks
  const yTicks = [0, Math.round(maxVal / 2), maxVal];
  // X-axis: pick up to MAX_X_LABELS evenly spaced indices
  const step = Math.max(1, Math.ceil(data.length / MAX_X_LABELS));
  const xLabels = data.filter((_, i) => i % step === 0);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Views over time">
      {/* Grid */}
      {yTicks.map((v) => (
        <g key={v}>
          <line
            x1={pad.left}
            x2={pad.left + innerW}
            y1={yScale(v)}
            y2={yScale(v)}
            className="stroke-neutral-200 dark:stroke-neutral-700"
            strokeDasharray="4 4"
          />
          <text
            x={pad.left - 4}
            y={yScale(v) + 4}
            textAnchor="end"
            className="fill-neutral-400 dark:fill-neutral-500"
            style={{ fontSize: 9 }}
          >
            {v}
          </text>
        </g>
      ))}
      {/* Area fill */}
      <polygon points={areaPoints} fill="#3b82f620" />
      {/* Line */}
      <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" />
      {/* Dots */}
      {data.map((d, i) => (
        <circle key={i} cx={xScale(i)} cy={yScale(d.count)} r="2.5" fill="#3b82f6" />
      ))}
      {/* X labels */}
      {xLabels.map((d) => {
        const i = data.indexOf(d);
        return (
          <text
            key={d.date}
            x={xScale(i)}
            y={H - 6}
            textAnchor="middle"
            className="fill-neutral-400 dark:fill-neutral-500"
            style={{ fontSize: 9 }}
          >
            {fmtDate(d.date)}
          </text>
        );
      })}
    </svg>
  );
}

/* ─────────────────────────────── Section ───────────────────────────────── */
function Section({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5"
    >
      <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4">{title}</h2>
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────── EmptyState ────────────────────────────── */
function EmptyState() {
  return (
    <p className="text-center text-xs text-neutral-400 dark:text-neutral-600 py-6">
      No data yet
    </p>
  );
}

/* ─────────────────────────────── Country flag helper ───────────────────── */
function countryName(code: string) {
  if (code === 'Unknown' || !code) return 'Unknown';
  try {
    const name = new Intl.DisplayNames(['en'], { type: 'region' }).of(code);
    return name ?? code;
  } catch {
    return code;
  }
}

/* ─────────────────────────────── Main Page ─────────────────────────────── */
export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState(30);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/analytics?days=${days}`);
      if (res.status === 401) {
        throw new Error('Session expired — please sign in again.');
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? 'Failed to load analytics');
      }
      const data = await res.json();
      setAnalytics(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error loading analytics');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => { load(); }, [load]);

  const totalViews = analytics?.overview.total_views ?? 0;
  const referrerTotal = analytics?.referrers.reduce((s, r) => s + r.count, 0) ?? 0;
  const countryTotal = analytics?.countries.reduce((s, c) => s + c.count, 0) ?? 0;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Analytics</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Site visitor insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Day range selector */}
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-400"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
          <p className="font-medium">{error}</p>
          {(error.toLowerCase().includes('database') || error.toLowerCase().includes('failed to fetch analytics')) && (
            <p className="mt-1 text-xs">
              If this is a fresh deployment, visit{' '}
              <a href="/api/seed" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                /api/seed
              </a>{' '}
              once to initialize the database tables, then refresh this page.
            </p>
          )}
        </div>
      )}

      {loading && !analytics ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={Eye}
              label="Page Views"
              value={totalViews.toLocaleString()}
              sub={`last ${days} days`}
            />
            <StatCard
              icon={Users}
              label="Unique Sessions"
              value={(analytics?.overview.unique_sessions ?? 0).toLocaleString()}
              sub="distinct visitors"
            />
            <StatCard
              icon={Clock}
              label="Avg. Time on Site"
              value={fmtDuration(analytics?.overview.avg_duration ?? null)}
              sub="per page visit"
            />
          </div>

          {/* Views over time */}
          <Section title={`Page Views — Last ${days} Days`}>
            <LineChart data={analytics?.views_over_time ?? []} />
          </Section>

          {/* Devices + Browsers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Devices">
              <DonutChart data={analytics?.devices ?? []} />
            </Section>
            <Section title="Browsers">
              <HorizontalBar data={analytics?.browsers ?? []} total={totalViews} />
            </Section>
          </div>

          {/* OS + Referrers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Operating Systems">
              <HorizontalBar data={analytics?.os ?? []} total={totalViews} />
            </Section>
            <Section title="Traffic Sources">
              <HorizontalBar data={analytics?.referrers ?? []} total={referrerTotal} />
            </Section>
          </div>

          {/* Countries */}
          <Section title={<span className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" />Locations (Countries)</span>}>
            {(analytics?.countries ?? []).length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                {(analytics?.countries ?? []).map(({ label, count }, i) => {
                  const pct = countryTotal > 0 ? (count / countryTotal) * 100 : 0;
                  return (
                    <div key={label} className="flex items-center gap-3 text-sm">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: PALETTE[i % PALETTE.length] }}
                      />
                      <span className="flex-1 text-xs text-neutral-600 dark:text-neutral-400 truncate">
                        {countryName(label)}
                      </span>
                      <div className="w-16 bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${pct}%`, background: PALETTE[i % PALETTE.length] }}
                        />
                      </div>
                      <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 w-6 text-right tabular-nums">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>

          {/* Devices + OS summary icons */}
          <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-600">
            <Monitor className="w-3.5 h-3.5" />
            <span>
              Analytics are collected from real visitors. Data resets if the{' '}
              <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">page_views</code> table is cleared.
            </span>
            <BarChart2 className="w-3.5 h-3.5 ml-auto" />
          </div>
        </div>
      )}
    </div>
  );
}
