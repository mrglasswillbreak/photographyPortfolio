import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

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
    return host || 'Other';
  } catch {
    return 'Other';
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Duration update for existing record
    if (body.id && body.duration_seconds !== undefined) {
      await sql`
        UPDATE page_views
        SET duration_seconds = ${body.duration_seconds}
        WHERE id = ${body.id}
      `;
      return NextResponse.json({ ok: true });
    }

    const { session_id, page_url, referrer, user_agent } = body;
    if (!session_id) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    const { device_type, browser, os } = parseUserAgent(user_agent ?? '');
    const referrer_source = parseReferrer(referrer ?? '');

    // Country from Vercel's edge header (available when deployed on Vercel)
    // x-vercel-ip-country returns ISO 3166-1 alpha-2 codes (2 characters)
    const country = (request.headers.get('x-vercel-ip-country') ?? '').toUpperCase().slice(0, 2);

    const result = await sql<{ id: number }>`
      INSERT INTO page_views (session_id, page_url, referrer_source, device_type, browser, os, country)
      VALUES (
        ${session_id},
        ${(page_url as string).slice(0, 255) || '/'},
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
