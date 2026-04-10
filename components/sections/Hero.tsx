'use client';
import { memo, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeIn, fadeInUp } from '@/utils/animations';
import { HeroSkeleton } from '@/components/ui/Skeleton';

const DEFAULT_HERO_IMAGE = 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1920&q=80';

interface HeroContent {
  image: string;
  tagline: string;
  title: string;
  title_highlight: string;
  subtitle: string;
  primary_button: string;
  secondary_button: string;
}

const DEFAULTS: HeroContent = {
  image: DEFAULT_HERO_IMAGE,
  tagline: 'Professional Photography',
  title: "Capturing Life's",
  title_highlight: 'Beautiful Moments',
  subtitle: 'Transforming fleeting moments into timeless memories through the art of photography',
  primary_button: 'View Gallery',
  secondary_button: 'Get in Touch',
};

function Hero() {
  const [content, setContent] = useState<HeroContent>(DEFAULTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((data) => {
        setContent({
          image: data.hero_image || DEFAULTS.image,
          tagline: data.hero_tagline || DEFAULTS.tagline,
          title: data.hero_title || DEFAULTS.title,
          title_highlight: data.hero_title_highlight || DEFAULTS.title_highlight,
          subtitle: data.hero_subtitle || DEFAULTS.subtitle,
          primary_button: data.hero_primary_button || DEFAULTS.primary_button,
          secondary_button: data.hero_secondary_button || DEFAULTS.secondary_button,
        });
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <HeroSkeleton />;

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-0"
      >
        <Image src={content.image} alt="Hero background" fill priority className="object-cover object-center" sizes="100vw" />
        {/* Multi-layer overlay for depth and luxury feel */}
        <div className="absolute inset-0 bg-black/45 dark:bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </motion.div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.span
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-4 text-sm md:text-base tracking-[0.3em] text-white/75 mb-8 uppercase"
        >
          <span className="w-8 h-px bg-white/40 inline-block" aria-hidden="true" />
          {content.tagline}
          <span className="w-8 h-px bg-white/40 inline-block" aria-hidden="true" />
        </motion.span>
        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white mb-6 leading-[1.05] tracking-tight"
        >
          {content.title}
          <br />
          <span className="font-semibold italic">{content.title_highlight}</span>
        </motion.h1>
        <motion.p
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="text-base md:text-lg text-white/70 mb-12 max-w-xl mx-auto font-light leading-relaxed tracking-wide"
        >
          {content.subtitle}
        </motion.p>
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="#gallery"
            className="px-10 py-4 bg-white text-neutral-900 font-medium hover:bg-neutral-100 transition-colors duration-300 tracking-widest text-xs uppercase"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {content.primary_button}
          </motion.a>
          <motion.a
            href="#contact"
            className="px-10 py-4 border border-white/40 text-white font-medium hover:bg-white/10 hover:border-white/70 transition-all duration-300 tracking-widest text-xs uppercase"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {content.secondary_button}
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Scroll</span>
        <motion.a
          href="#gallery"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent block"
          aria-label="Scroll to gallery"
        />
      </motion.div>
    </section>
  );
}

export default memo(Hero);
