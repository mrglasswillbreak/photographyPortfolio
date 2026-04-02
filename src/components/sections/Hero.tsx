import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { fadeIn, fadeInUp } from '../../utils/animations';
import { useHomepageContent } from '../../hooks/useSanity';
import { getImageUrl } from '../../lib/sanity';
import { fallbackImageUrls } from '../../data/fallback';
import { HeroSkeleton } from '../ui/Skeleton';

function Hero() {
  const { data: content, isLoading } = useHomepageContent();

  // Build hero background style with CMS image or fallback
  const heroBgStyle = useMemo(() => {
    const imageUrl = content?.heroImage 
      ? getImageUrl(content.heroImage, { width: 1920, quality: 80 })
      : fallbackImageUrls.hero;
    return { backgroundImage: `url(${imageUrl})` };
  }, [content?.heroImage]);

  if (isLoading) {
    return <HeroSkeleton />;
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={heroBgStyle}
        />
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.span
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="inline-block text-sm md:text-base tracking-[0.3em] text-white/80 mb-6 uppercase"
        >
          {content?.tagline || 'Professional Photography'}
        </motion.span>

        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight"
        >
          {content?.heroTitle || "Capturing Life's"}
          <br />
          <span className="font-semibold italic">
            {content?.heroTitleHighlight || 'Beautiful Moments'}
          </span>
        </motion.h1>

        <motion.p
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-light"
        >
          {content?.heroSubtitle || 
            'Transforming fleeting moments into timeless memories through the art of photography'}
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
            className="px-8 py-4 bg-white text-neutral-900 font-medium 
                       hover:bg-neutral-100 transition-colors duration-300 
                       tracking-wide text-sm uppercase"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {content?.primaryButtonText || 'View Gallery'}
          </motion.a>
          <motion.a
            href="#contact"
            className="px-8 py-4 border border-white/50 text-white font-medium 
                       hover:bg-white/10 transition-colors duration-300 
                       tracking-wide text-sm uppercase"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {content?.secondaryButtonText || 'Get in Touch'}
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.a
          href="#gallery"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/60 hover:text-white transition-colors"
          aria-label="Scroll to gallery"
        >
          <ChevronDown size={32} aria-hidden="true" />
        </motion.a>
      </motion.div>
    </section>
  );
}

export default memo(Hero);
