import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { del } from '@vercel/blob';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { title, alt, category, url, featured, display_order } = await request.json();

    const result = await sql`
      UPDATE gallery_images
      SET
        title = COALESCE(${title}, title),
        alt = COALESCE(${alt}, alt),
        category = COALESCE(${category}, category),
        url = COALESCE(${url}, url),
        featured = COALESCE(${featured}, featured),
        display_order = COALESCE(${display_order}, display_order),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch {
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await sql`SELECT url FROM gallery_images WHERE id = ${id}`;
    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const imageUrl = existing.rows[0].url as string;

    // Support both legacy direct blob URLs and the current proxy URL format
    // (/api/images/uploads/...) so that deletes work regardless of when the
    // image was uploaded.
    let blobIdentifier: string | null = null;
    if (imageUrl.includes('blob.vercel-storage.com')) {
      blobIdentifier = imageUrl;
    } else if (imageUrl.startsWith('/api/images/')) {
      // Strip the proxy prefix to get the blob pathname (e.g., "uploads/abc.jpg").
      blobIdentifier = imageUrl.replace('/api/images/', '');
    }

    if (blobIdentifier) {
      try {
        await del(blobIdentifier);
      } catch {
        // Log but don't fail if blob deletion fails
        console.error('Failed to delete blob:', blobIdentifier);
      }
    }

    await sql`DELETE FROM gallery_images WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
