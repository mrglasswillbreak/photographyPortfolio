import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { get } from '@vercel/blob';
import { getContent } from '@/lib/db';

// Short TTL so a newly-uploaded favicon is visible within minutes.
const CACHE_CONTROL = 'public, max-age=600, stale-while-revalidate=3600';

export async function GET(): Promise<Response> {
  const customUrl = await getContent('site', 'favicon_url', '');

  if (customUrl) {
    // Custom favicon is stored as a relative proxy path: /api/images/uploads/<file>
    // Strip the leading /api/images/ prefix to get the blob pathname.
    const blobPathMatch = customUrl.match(/^\/api\/images\/(.+)$/);

    if (blobPathMatch) {
      const blobPathname = blobPathMatch[1];

      // Only allow blobs under the uploads/ directory.
      if (blobPathname.startsWith('uploads/')) {
        try {
          const result = await get(blobPathname, { access: 'private' });
          if (result) {
            const headers: Record<string, string> = {
              'Content-Type': result.blob.contentType ?? 'image/png',
              'Cache-Control': CACHE_CONTROL,
            };
            if (result.blob.etag) headers['ETag'] = result.blob.etag;
            if (result.blob.size) headers['Content-Length'] = String(result.blob.size);
            return new NextResponse(result.stream, { status: 200, headers });
          }
        } catch {
          // Fall through to default if blob retrieval fails.
        }
      }
    }
  }

  // No custom favicon — serve the default SVG from the public directory.
  try {
    const svgPath = path.join(process.cwd(), 'public', 'favicon.svg');
    const svgContent = await readFile(svgPath);
    return new NextResponse(svgContent, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': CACHE_CONTROL,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Favicon not found' }, { status: 404 });
  }
}
