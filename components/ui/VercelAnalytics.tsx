'use client';
import { usePathname } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';

export default function VercelAnalytics() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return <Analytics />;
}
