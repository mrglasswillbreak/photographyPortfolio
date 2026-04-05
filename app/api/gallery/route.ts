import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM gallery_images ORDER BY display_order ASC, created_at ASC
    `;
    return NextResponse.json(result.rows, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, alt, category, url, featured, display_order } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO gallery_images (title, alt, category, url, featured, display_order)
      VALUES (${title ?? ''}, ${alt ?? ''}, ${category ?? 'Other'}, ${url}, ${featured ?? false}, ${display_order ?? 0})
      RETURNING *
    `;
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create image' }, { status: 500 });
  }
}
