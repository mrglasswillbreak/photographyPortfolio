import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const rawDays = searchParams.get('days');
    const parsedDays = parseInt(rawDays ?? '30', 10);
    const safeDays = Number.isFinite(parsedDays) ? parsedDays : 30;
    const days = Math.max(1, Math.min(safeDays, 365));

    // Overview stats
    const overviewResult = await sql<{ total_views: string; unique_sessions: string; avg_duration: string }>`
      SELECT
        COUNT(*) AS total_views,
        COUNT(DISTINCT session_id) AS unique_sessions,
        ROUND(AVG(duration_seconds) FILTER (WHERE duration_seconds IS NOT NULL AND duration_seconds > 0))::text AS avg_duration
      FROM page_views
      WHERE created_at >= NOW() - INTERVAL '1 day' * ${days}
    `;

    // Views per day (last N days)
    const viewsOverTimeResult = await sql<{ date: string; count: string }>`
      SELECT
        TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') AS date,
        COUNT(*) AS count
      FROM page_views
      WHERE created_at >= NOW() - INTERVAL '1 day' * ${days}
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY DATE_TRUNC('day', created_at) ASC
    `;

    // Devices
    const devicesResult = await sql<{ device_type: string; count: string }>`
      SELECT device_type, COUNT(*) AS count
      FROM page_views
      WHERE created_at >= NOW() - INTERVAL '1 day' * ${days}
      GROUP BY device_type
      ORDER BY COUNT(*) DESC
    `;

    // Browsers
    const browsersResult = await sql<{ browser: string; count: string }>`
      SELECT browser, COUNT(*) AS count
      FROM page_views
      WHERE created_at >= NOW() - INTERVAL '1 day' * ${days}
      GROUP BY browser
      ORDER BY COUNT(*) DESC
      LIMIT 8
    `;

    // Operating systems
    const osResult = await sql<{ os: string; count: string }>`
      SELECT os, COUNT(*) AS count
      FROM page_views
      WHERE created_at >= NOW() - INTERVAL '1 day' * ${days}
      GROUP BY os
      ORDER BY COUNT(*) DESC
      LIMIT 8
    `;

    // Referrers
    const referrersResult = await sql<{ referrer_source: string; count: string }>`
      SELECT referrer_source, COUNT(*) AS count
      FROM page_views
      WHERE created_at >= NOW() - INTERVAL '1 day' * ${days}
      GROUP BY referrer_source
      ORDER BY COUNT(*) DESC
      LIMIT 10
    `;

    // Countries
    const countriesResult = await sql<{ country: string; count: string }>`
      SELECT
        CASE WHEN country = '' THEN 'Unknown' ELSE country END AS country,
        COUNT(*) AS count
      FROM page_views
      WHERE created_at >= NOW() - INTERVAL '1 day' * ${days}
      GROUP BY country
      ORDER BY COUNT(*) DESC
      LIMIT 10
    `;

    const overview = overviewResult.rows[0] ?? { total_views: '0', unique_sessions: '0', avg_duration: null };

    return NextResponse.json({
      overview: {
        total_views: parseInt(overview.total_views, 10),
        unique_sessions: parseInt(overview.unique_sessions, 10),
        avg_duration: overview.avg_duration ? parseInt(overview.avg_duration, 10) : null,
      },
      views_over_time: viewsOverTimeResult.rows.map((r) => ({
        date: r.date,
        count: parseInt(r.count, 10),
      })),
      devices: devicesResult.rows.map((r) => ({
        label: r.device_type,
        count: parseInt(r.count, 10),
      })),
      browsers: browsersResult.rows.map((r) => ({
        label: r.browser,
        count: parseInt(r.count, 10),
      })),
      os: osResult.rows.map((r) => ({
        label: r.os,
        count: parseInt(r.count, 10),
      })),
      referrers: referrersResult.rows.map((r) => ({
        label: r.referrer_source,
        count: parseInt(r.count, 10),
      })),
      countries: countriesResult.rows.map((r) => ({
        label: r.country,
        count: parseInt(r.count, 10),
      })),
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
