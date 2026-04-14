import { ImageResponse } from 'next/og';
import { ICON_CACHE_CONTROL, normalizeIconSize, renderSiteIcon } from '@/lib/site-icon';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const size = normalizeIconSize(searchParams.get('size'), 512);

  return new ImageResponse(
    await renderSiteIcon(size),
    {
      width: size,
      height: size,
      headers: {
        'Cache-Control': ICON_CACHE_CONTROL,
      },
    },
  );
}
