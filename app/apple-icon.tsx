import { ImageResponse } from 'next/og';
import { ICON_CACHE_CONTROL, renderSiteIcon } from '@/lib/site-icon';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default async function AppleIcon() {
  return new ImageResponse(
    await renderSiteIcon(size.width),
    {
      ...size,
      headers: {
        'Cache-Control': ICON_CACHE_CONTROL,
      },
    },
  );
}
