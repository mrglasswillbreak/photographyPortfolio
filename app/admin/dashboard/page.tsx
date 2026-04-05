'use client';
import { useState, useEffect } from 'react';
import { Images, Layers, Type, ArrowRight, Eye, Users, TrendingUp, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Stats {
  galleryCount: number;
  servicesCount: number;
  contentItems: number;
}

interface AnalyticsSummary {
  total_views: number;
  unique_sessions: number;
  views_over_time: { date: string; count: number }[];
}

/* ── helpers ────────────────────────────────────────────────────────────── */
function fmtDate(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const MAX_X_LABELS = 7;

function smoothLinePath(pts: [number, number][]): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0][0]},${pts[0][1]}`;
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const cp1x = px + (cx - px) / 3;
    const cp2x = cx - (cx - px) / 3;
    d += ` C ${cp1x},${py} ${cp2x},${cy} ${cx},${cy}`;
  }
  return d;
}

/* ── Line chart (mirrors the one on the analytics page) ─────────────────── */
function LineChart({ data }: { data: { date: string; count: number }[] }) {
  const [tooltip, setTooltip] = useState<{ idx: number } | null>(null);
  if (data.length === 0) {
    return (
      <p className="text-xs text-neutral-400 dark:text-neutral-600 text-center py-2">
        No data yet
      </p>
    );
  }

  const W = 600;
  const H = 150;
  const pad = { top: 16, right: 16, bottom: 28, left: 36 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;

  const maxVal = Math.max(...data.map((d) => d.count), 1);
  const xScale = (i: number) => pad.left + (i / Math.max(data.length - 1, 1)) * innerW;
  const yScale = (v: number) => pad.top + innerH - (v / maxVal) * innerH;

  const pts: [number, number][] = data.map((d, i) => [xScale(i), yScale(d.count)]);
  const linePD = smoothLinePath(pts);
  const areaPD =
    linePD +
    ` L ${pts[pts.length - 1][0]},${pad.top + innerH} L ${pts[0][0]},${pad.top + innerH} Z`;

  const yTicks = Array.from({ length: 5 }, (_, k) => Math.round((maxVal / 4) * k));
  const step = Math.max(1, Math.ceil(data.length / MAX_X_LABELS));
  const xLabelIdxs = data.map((_, i) => i).filter((i) => i % step === 0);

  const ttIdx = tooltip?.idx ?? -1;
  const ttX = ttIdx >= 0 ? pts[ttIdx][0] : 0;
  const ttY = ttIdx >= 0 ? pts[ttIdx][1] : 0;
  const ttBoxW = 84;
  const ttBoxH = 36;
  const ttBoxX = Math.min(Math.max(ttX - ttBoxW / 2, pad.left), pad.left + innerW - ttBoxW);
  const ttBoxY = Math.max(ttY - ttBoxH - 8, pad.top);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      aria-label="Views over time"
      onMouseLeave={() => setTooltip(null)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * W;
        let closest = 0;
        let minDist = Infinity;
        pts.forEach(([px], i) => {
          const dist = Math.abs(px - mx);
          if (dist < minDist) { minDist = dist; closest = i; }
        });
        const threshold = (innerW / Math.max(data.length, 1)) * 1.5;
        setTooltip(minDist < threshold ? { idx: closest } : null);
      }}
    >
      <defs>
        <linearGradient id="overviewLineAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map((v) => (
        <g key={v}>
          <line
            x1={pad.left} x2={pad.left + innerW}
            y1={yScale(v)} y2={yScale(v)}
            className="stroke-neutral-200 dark:stroke-neutral-700"
            strokeDasharray="4 3"
          />
          <text
            x={pad.left - 5} y={yScale(v) + 3.5}
            textAnchor="end"
            className="fill-neutral-400 dark:fill-neutral-500"
            style={{ fontSize: 9 }}
          >
            {v}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaPD} fill="url(#overviewLineAreaGrad)" />
      {/* Smooth line */}
      <path d={linePD} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Tooltip vertical guide */}
      {ttIdx >= 0 && (
        <line
          x1={ttX} x2={ttX}
          y1={pad.top} y2={pad.top + innerH}
          stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 3" opacity="0.45"
        />
      )}

      {/* Dots */}
      {pts.map(([px, py], i) => (
        <circle
          key={i} cx={px} cy={py} r={i === ttIdx ? 4.5 : 3}
          fill={i === ttIdx ? '#3b82f6' : 'white'}
          stroke="#3b82f6" strokeWidth="2"
          className={i === ttIdx ? '' : 'dark:[fill:theme(colors.neutral.900)]'}
        />
      ))}

      {/* Tooltip box */}
      {ttIdx >= 0 && (
        <g>
          <rect x={ttBoxX} y={ttBoxY} width={ttBoxW} height={ttBoxH} rx="4" fill="#171717" opacity="0.88" className="dark:fill-white dark:opacity-90" />
          <text
            x={ttBoxX + ttBoxW / 2} y={ttBoxY + 13}
            textAnchor="middle" style={{ fontSize: 9, fontWeight: 600 }}
            fill="white" className="dark:fill-neutral-900"
          >
            {fmtDate(data[ttIdx].date)}
          </text>
          <text
            x={ttBoxX + ttBoxW / 2} y={ttBoxY + 26}
            textAnchor="middle" style={{ fontSize: 9 }}
            fill="#a3a3a3" className="dark:fill-neutral-500"
          >
            {data[ttIdx].count.toLocaleString()} views
          </text>
        </g>
      )}

      {/* X-axis labels */}
      {xLabelIdxs.map((i) => (
        <text
          key={data[i].date}
          x={xScale(i)} y={H - 6}
          textAnchor="middle"
          className="fill-neutral-400 dark:fill-neutral-500"
          style={{ fontSize: 9 }}
        >
          {fmtDate(data[i].date)}
        </text>
      ))}
    </svg>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ galleryCount: 0, servicesCount: 0, contentItems: 0 });
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/gallery').then((r) => r.json()),
      fetch('/api/services').then((r) => r.json()),
      fetch('/api/content').then((r) => r.json()),
      fetch('/api/analytics?days=7').then((r) => (r.ok ? r.json() : null)).catch(() => null),
    ])
      .then(([gallery, services, content, analyticsData]) => {
        setStats({
          galleryCount: Array.isArray(gallery) ? gallery.length : 0,
          servicesCount: Array.isArray(services) ? services.length : 0,
          contentItems: typeof content === 'object' ? Object.keys(content).length : 0,
        });
        if (analyticsData?.overview) {
          setAnalytics({
            total_views: analyticsData.overview.total_views ?? 0,
            unique_sessions: analyticsData.overview.unique_sessions ?? 0,
            views_over_time: analyticsData.views_over_time ?? [],
          });
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const cards = [
    { label: 'Gallery Images', value: stats.galleryCount, icon: Images, href: '/admin/dashboard/gallery', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
    { label: 'Services', value: stats.servicesCount, icon: Layers, href: '/admin/dashboard/services', color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' },
    { label: 'Content Fields', value: stats.contentItems, icon: Type, href: '/admin/dashboard/content', color: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400' },
  ];

  const quickActions = [
    { label: 'Upload a new photo', href: '/admin/dashboard/gallery', icon: Images },
    { label: 'Edit hero text', href: '/admin/dashboard/content', icon: Type },
    { label: 'Manage services', href: '/admin/dashboard/services', icon: Layers },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Overview</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Manage your portfolio content</p>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoading ? 0.5 : 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={card.href} className="block bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{card.label}</p>
                  <p className="text-3xl font-light text-neutral-900 dark:text-white mt-1">
                    {isLoading ? '–' : card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <card.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200 transition-colors">
                Manage <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Analytics Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              <h2 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Visitor Analytics — Last 7 Days
              </h2>
            </div>
            <Link
              href="/admin/dashboard/analytics"
              className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Full analytics
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-3.5 h-3.5 text-blue-500" />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Page Views</p>
              </div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white tabular-nums">
                {isLoading ? '–' : (analytics?.total_views ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-3.5 h-3.5 text-purple-500" />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Unique Sessions</p>
              </div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white tabular-nums">
                {isLoading ? '–' : (analytics?.unique_sessions ?? 0).toLocaleString()}
              </p>
            </div>
          </div>

          <LineChart data={analytics?.views_over_time ?? []} />
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
        <h2 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">Quick Actions</h2>
        <div className="space-y-2">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group"
            >
              <action.icon className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
              <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">{action.label}</span>
              <ArrowRight className="w-3 h-3 ml-auto text-neutral-300 group-hover:text-neutral-500 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* First-time setup hint — only shown when the database has no content yet */}
      {!isLoading &&
        (stats.contentItems === 0 ||
          (stats.galleryCount === 0 && stats.servicesCount === 0 && stats.contentItems === 1)) && (
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">First-time setup</p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            Run database initialization by visiting{' '}
            <a href="/api/seed" target="_blank" rel="noopener noreferrer" className="underline font-medium">/api/seed</a>{' '}
            once after deployment to create tables and seed initial data.
          </p>
        </div>
      )}
    </div>
  );
}
