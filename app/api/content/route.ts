import { NextResponse } from 'next/server';
import { getAllContent } from '@/lib/db';

export async function GET() {
  try {
    const content = await getAllContent();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
