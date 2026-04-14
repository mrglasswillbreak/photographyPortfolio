'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  getTypographyCssVariables,
  parseTypographySettings,
  toStyleContentMap,
  TYPOGRAPHY_DEFAULTS,
  typographySettingsToContentMap,
  TYPOGRAPHY_UPDATED_EVENT,
} from '@/lib/typography';
import type { TypographyCssVariables, TypographySettings } from '@/lib/typography';

function mergeTypographySettings(
  currentSettings: TypographySettings,
  updateDetail: Record<string, string>,
): TypographySettings {
  const mergedContent = {
    ...typographySettingsToContentMap(currentSettings),
    ...toStyleContentMap(updateDetail),
  };
  return parseTypographySettings(mergedContent);
}

export default function useTypographyStyles() {
  const [settings, setSettings] = useState<TypographySettings>(TYPOGRAPHY_DEFAULTS);

  useEffect(() => {
    let isMounted = true;

    const loadTypography = async () => {
      try {
        const response = await fetch('/api/content', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Failed to load typography settings: ${response.status}`);
        }

        const content = (await response.json()) as Record<string, unknown>;
        if (!isMounted) return;

        setSettings(parseTypographySettings(content));
      } catch (error) {
        console.error('Failed to load typography settings', error);
      }
    };

    const handleTypographyUpdate = (event: Event) => {
      const detail = (event as CustomEvent<Record<string, string>>).detail;
      if (!detail || typeof detail !== 'object') return;
      setSettings((current) => mergeTypographySettings(current, detail));
    };

    window.addEventListener(TYPOGRAPHY_UPDATED_EVENT, handleTypographyUpdate);
    void loadTypography();

    return () => {
      isMounted = false;
      window.removeEventListener(TYPOGRAPHY_UPDATED_EVENT, handleTypographyUpdate);
    };
  }, []);

  const style = useMemo<TypographyCssVariables>(
    () => getTypographyCssVariables(settings),
    [settings],
  );

  return { settings, style };
}

