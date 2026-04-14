import path from 'path';
import type { ReactElement } from 'react';
import { get } from '@vercel/blob';
import { getContent } from '@/lib/db';

export const ICON_CACHE_CONTROL = 'public, max-age=600, stale-while-revalidate=3600';

const SUPPORTED_SIZES = new Set([16, 32, 48, 64, 96, 128, 180, 192, 256, 384, 512]);

export function normalizeIconSize(rawSize: string | null, fallbackSize: number): number {
  const parsed = Number(rawSize);
  if (!Number.isInteger(parsed)) return fallbackSize;
  return SUPPORTED_SIZES.has(parsed) ? parsed : fallbackSize;
}

async function getCustomIconDataUrl(): Promise<string | null> {
  let customUrl = '';
  try {
    customUrl = await getContent('site', 'favicon_url', '');
  } catch (error) {
    console.error('Failed to read favicon setting:', error);
    return null;
  }

  if (!customUrl) return null;

  const blobPathMatch = customUrl.match(/^\/api\/images\/(.+)$/);
  if (!blobPathMatch) return null;

  const normalizedPathname = path.posix.normalize(blobPathMatch[1]);
  if (normalizedPathname.includes('..') || !normalizedPathname.startsWith('uploads/')) {
    return null;
  }

  try {
    const result = await get(normalizedPathname, { access: 'private' });
    if (!result) return null;

    const bytes = await new Response(result.stream).arrayBuffer();
    const contentType = result.blob.contentType ?? 'image/png';
    return `data:${contentType};base64,${Buffer.from(bytes).toString('base64')}`;
  } catch (error) {
    console.error('Failed to load custom icon:', error);
    return null;
  }
}

function renderDefaultIcon(size: number): ReactElement {
  const strokeWidth = Math.max(1.5, size * 0.047);

  return (
    <div
      style={{
        background: '#111111',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size}>
        <circle cx="16" cy="16" r="12" stroke="white" strokeWidth={strokeWidth} fill="none" />
        <path d="M18.8 11.2 L25.7 23.1" stroke="white" strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />
        <path d="M13.2 11.2 L27 11.2" stroke="white" strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />
        <path d="M10.5 16 L17.3 4.1" stroke="white" strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />
        <path d="M13.2 20.8 L6.3 8.9" stroke="white" strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />
        <path d="M18.8 20.8 L5 20.8" stroke="white" strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />
        <path d="M21.5 16 L14.7 27.9" stroke="white" strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

export async function renderSiteIcon(size: number): Promise<ReactElement> {
  const customIconDataUrl = await getCustomIconDataUrl();
  if (!customIconDataUrl) return renderDefaultIcon(size);

  return (
    <div
      style={{
        background: '#111111',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={customIconDataUrl}
        alt=""
        width={size}
        height={size}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
}
