import { NextResponse } from 'next/server';
import { get } from '@vercel/blob';

// Public image proxy for privately-stored Vercel Blob uploads.
// Blobs are stored with access:'private' to support private stores;
// this route fetches them server-side (using the token) and serves
// them with aggressive caching so browsers only fetch each image once.

const CACHE_CONTROL = 'public, max-age=31536000, immutable';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<Response> {
  const { path } = await params;
  const pathname = path.join('/');

  // Only allow access to files under the uploads/ directory.
  if (!pathname.startsWith('uploads/')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const ifNoneMatch = request.headers.get('if-none-match') ?? undefined;
    const result = await get(pathname, {
      access: 'private',
      ...(ifNoneMatch ? { ifNoneMatch } : {}),
    });

    if (!result) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Blob hasn't changed since the client last fetched it — skip the body.
    if (result.statusCode === 304) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          'Cache-Control': CACHE_CONTROL,
          ...(result.blob.etag ? { ETag: result.blob.etag } : {}),
        },
      });
    }

    const headers: Record<string, string> = {
      'Content-Type': result.blob.contentType,
      'Cache-Control': CACHE_CONTROL,
    };
    if (result.blob.etag) {
      headers['ETag'] = result.blob.etag;
    }
    if (result.blob.size) {
      headers['Content-Length'] = String(result.blob.size);
    }

    return new NextResponse(result.stream, { status: 200, headers });
  } catch (error) {
    console.error('Failed to retrieve image:', error);
    return NextResponse.json({ error: 'Failed to retrieve image' }, { status: 500 });
  }
}
