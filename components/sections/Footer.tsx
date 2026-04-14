'use client';
import { memo, useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/utils/animations';
import useSiteName from '@/components/hooks/useSiteName';
import { SOCIAL_PLATFORMS } from '@/components/ui/SocialIcons';
import SiteNameWordmark from '@/components/ui/SiteNameWordmark';

function isSafeUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === 'https:' || protocol === 'http:';
  } catch {
    return false;
  }
}

function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const siteName = useSiteName();
  const [footerText, setFooterText] = useState('');
  const [socialUrls, setSocialUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        setFooterText(data.site_footer_text ?? '');
        const urls: Record<string, string> = {};
        for (const platform of SOCIAL_PLATFORMS) {
          urls[platform.id] = data[`footer_${platform.id}_url`] ?? '';
        }
        setSocialUrls(urls);
      })
      .catch(() => {});
  }, []);

  const activeSocials = SOCIAL_PLATFORMS.filter((p) => socialUrls[p.id] && isSafeUrl(socialUrls[p.id]));

  return (
    <motion.footer
      variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}
      className="py-12 bg-neutral-100 dark:bg-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.a href="#home" className="text-2xl font-light tracking-wider text-neutral-900 dark:text-white" whileHover={{ scale: 1.02 }}>
            <SiteNameWordmark siteName={siteName} />
          </motion.a>
          {activeSocials.length > 0 && (
            <nav className="flex items-center gap-4" aria-label="Social media links">
              {activeSocials.map(({ id, label, Icon }) => (
                <motion.a
                  key={id}
                  href={socialUrls[id]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </nav>
          )}
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {footerText || `© ${currentYear} ${siteName}. All rights reserved.`}
          </p>
        </div>
      </div>
    </motion.footer>
  );
}

export default memo(Footer);
