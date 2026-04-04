'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem('_analytics_sid');
    if (!id) {
      id = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      sessionStorage.setItem('_analytics_sid', id);
    }
    return id;
  } catch {
    return (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : Date.now().toString(36);
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

    function sendDuration() {
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
        // Prevent double-sending
        recordIdRef.current = null;
      }
    }

    // Send duration when tab is hidden (covers tab close and navigation in SPAs)
    function onVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        sendDuration();
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Also send on React cleanup (handles client-side navigation)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      sendDuration();
    };
  }, [pathname]);

  return null;
}
