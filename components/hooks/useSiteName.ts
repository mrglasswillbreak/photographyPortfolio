'use client';

import { useEffect, useState } from 'react';

const DEFAULT_SITE_NAME = 'LensCraft';

function normalizeSiteName(value: unknown): string {
  if (typeof value !== 'string') return DEFAULT_SITE_NAME;
  const trimmedValue = value.trim();
  return trimmedValue || DEFAULT_SITE_NAME;
}

export default function useSiteName() {
  const [siteName, setSiteName] = useState(DEFAULT_SITE_NAME);

  useEffect(() => {
    let isMounted = true;

    const loadSiteName = async () => {
      try {
        const response = await fetch('/api/content', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Failed to load site name: ${response.status}`);
        }

        const data = (await response.json()) as Record<string, unknown>;
        if (!isMounted) return;
        setSiteName(normalizeSiteName(data.site_name));
      } catch (error) {
        console.error('Failed to load site name', error);
      }
    };

    const handleSiteNameUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ siteName?: string }>).detail;
      setSiteName(normalizeSiteName(detail?.siteName));
    };

    window.addEventListener('site-name-updated', handleSiteNameUpdate);
    void loadSiteName();

    return () => {
      isMounted = false;
      window.removeEventListener('site-name-updated', handleSiteNameUpdate);
    };
  }, []);

  return siteName;
}
