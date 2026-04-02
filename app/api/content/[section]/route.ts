import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ section: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { section } = await params;

  try {
    const updates: Record<string, string> = await request.json();

    for (const [key, value] of Object.entries(updates)) {
      await sql`
        INSERT INTO site_content (section, key, value, updated_at)
        VALUES (${section}, ${key}, ${String(value)}, NOW())
        ON CONFLICT (section, key) DO UPDATE
        SET value = EXCLUDED.value, updated_at = NOW()
      `;
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
