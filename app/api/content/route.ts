import { NextResponse } from 'next/server';
import { getAllContent } from '@/lib/db';

export async function GET() {
  try {
    const content = await getAllContent();
    return NextResponse.json(content, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
