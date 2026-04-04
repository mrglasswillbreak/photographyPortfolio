import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// Column size limits (must match lib/db.ts schema)
const MAX_SESSION_ID = 64;
const MAX_PAGE_URL = 255;
const MAX_REFERRER_SOURCE = 100;
const MAX_DURATION_SECONDS = 86_400; // 24 hours — sanity cap

function parseUserAgent(ua: string): { device_type: string; browser: string; os: string } {
  const isTablet = /ipad|tablet|kindle|playbook/i.test(ua);
  const isMobile = !isTablet && /mobile|android|iphone|ipod/i.test(ua);
  const device_type = isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop';

  let browser = 'Other';
  if (/edg\//i.test(ua)) browser = 'Edge';
  else if (/opr\/|opera/i.test(ua)) browser = 'Opera';
  else if (/chrome\/\d/i.test(ua) && !/chromium/i.test(ua)) browser = 'Chrome';
  else if (/firefox\/\d/i.test(ua)) browser = 'Firefox';
  else if (/safari\/\d/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/msie|trident/i.test(ua)) browser = 'IE';

  let os = 'Other';
  if (/windows nt/i.test(ua)) os = 'Windows';
  else if (/ipad/i.test(ua)) os = 'iPadOS';
  else if (/iphone|ipod/i.test(ua)) os = 'iOS';
  else if (/mac os x/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/linux/i.test(ua)) os = 'Linux';
  else if (/cros/i.test(ua)) os = 'ChromeOS';

  return { device_type, browser, os };
}

function parseReferrer(referrer: string): string {
  if (!referrer) return 'Direct';
  try {
    const url = new URL(referrer);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    if (/google\./i.test(host)) return 'Google';
    if (/bing\./i.test(host)) return 'Bing';
    if (/yahoo\./i.test(host)) return 'Yahoo';
    if (/duckduckgo\./i.test(host)) return 'DuckDuckGo';
    if (/facebook\.com|fb\.com/i.test(host)) return 'Facebook';
    if (/twitter\.com|t\.co|x\.com/i.test(host)) return 'Twitter/X';
    if (/instagram\.com/i.test(host)) return 'Instagram';
    if (/linkedin\.com/i.test(host)) return 'LinkedIn';
    if (/pinterest\.com/i.test(host)) return 'Pinterest';
    if (/reddit\.com/i.test(host)) return 'Reddit';
    if (/tiktok\.com/i.test(host)) return 'TikTok';
    if (/youtube\.com/i.test(host)) return 'YouTube';
    // Unknown host — truncate to column limit before returning
    return (host || 'Other').slice(0, MAX_REFERRER_SOURCE);
  } catch {
    return 'Other';
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Duration update for existing record
    if (body.id !== undefined && body.duration_seconds !== undefined) {
      const id = typeof body.id === 'number' ? body.id : null;
      const rawDuration = typeof body.duration_seconds === 'number' ? body.duration_seconds : null;
      const session_id = typeof body.session_id === 'string' ? body.session_id.slice(0, MAX_SESSION_ID) : null;

      if (
        id === null ||
        rawDuration === null ||
        !Number.isFinite(rawDuration) ||
        rawDuration < 0 ||
        session_id === null
      ) {
        return NextResponse.json({ error: 'Invalid duration update payload' }, { status: 400 });
      }

      const duration = Math.min(Math.round(rawDuration), MAX_DURATION_SECONDS);

      // Require session_id to match so clients cannot overwrite arbitrary rows
      await sql`
        UPDATE page_views
        SET duration_seconds = ${duration}
        WHERE id = ${id} AND session_id = ${session_id}
      `;
      return NextResponse.json({ ok: true });
    }

    // New page view
    const session_id =
      typeof body.session_id === 'string' ? body.session_id.slice(0, MAX_SESSION_ID) : null;
    if (!session_id) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    const page_url =
      typeof body.page_url === 'string' ? body.page_url.slice(0, MAX_PAGE_URL) || '/' : '/';
    const referrer_source = parseReferrer(
      typeof body.referrer === 'string' ? body.referrer : ''
    );
    const user_agent = typeof body.user_agent === 'string' ? body.user_agent : '';
    const { device_type, browser, os } = parseUserAgent(user_agent);

    // Country from Vercel's edge header (available when deployed on Vercel)
    // x-vercel-ip-country returns ISO 3166-1 alpha-2 codes (2 characters)
    const country = (request.headers.get('x-vercel-ip-country') ?? '').toUpperCase().slice(0, 2);

    const result = await sql<{ id: number }>`
      INSERT INTO page_views (session_id, page_url, referrer_source, device_type, browser, os, country)
      VALUES (
        ${session_id},
        ${page_url},
        ${referrer_source},
        ${device_type},
        ${browser},
        ${os},
        ${country}
      )
      RETURNING id
    `;

    return NextResponse.json({ id: result.rows[0]?.id }, { status: 201 });
  } catch (error) {
    console.error('Analytics track error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
