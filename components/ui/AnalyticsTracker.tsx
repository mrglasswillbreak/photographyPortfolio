'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem('_analytics_sid');
    if (!id) {
      id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      sessionStorage.setItem('_analytics_sid', id);
    }
    return id;
  } catch {
    return Math.random().toString(36).slice(2, 10);
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const recordIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    // Skip admin pages and non-browser environments
    if (pathname.startsWith('/admin')) return;
    if (typeof window === 'undefined') return;

    const sessionId = getSessionId();
    startTimeRef.current = Date.now();
    recordIdRef.current = null;

    // Record page view
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        page_url: pathname,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
      }),
    })
      .then((r) => r.json())
      .then((data: { id?: number }) => {
        if (data.id) recordIdRef.current = data.id;
      })
      .catch(() => {});

    // Send duration on navigation away / tab close
    return () => {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      const id = recordIdRef.current;
      if (duration > 0 && id) {
        const payload = JSON.stringify({ id, duration_seconds: duration });
        try {
          navigator.sendBeacon(
            '/api/analytics/track',
            new Blob([payload], { type: 'application/json' })
          );
        } catch {
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      }
    };
  }, [pathname]);

  return null;
}
