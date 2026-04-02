import { NextResponse } from 'next/server';
import { getServices, sql } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
  try {
    const services = await getServices();
    return NextResponse.json(services);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, description, icon, display_order } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO services (title, description, icon, display_order)
      VALUES (${title}, ${description ?? ''}, ${icon ?? 'Camera'}, ${display_order ?? 0})
      RETURNING *
    `;
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
