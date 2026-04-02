import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { fadeInLeft, fadeInRight, cardFadeIn, imageFadeIn } from '../../utils/animations';
import { useAboutContent } from '../../hooks/useSanity';
import { getImageUrl } from '../../lib/sanity';
import { fallbackImageUrls, fallbackAbout } from '../../data/fallback';
import { AboutSkeleton } from '../ui/Skeleton';

function About() {
  const { data: content, isLoading } = useAboutContent();

  // Get profile image URL from CMS or fallback
  const profileImageUrl = useMemo(() => {
    if (content?.profileImage?.asset?._ref) {
      return getImageUrl(content.profileImage, { width: 800, quality: 80 });
    }
    return fallbackImageUrls.about;
  }, [content?.profileImage]);

  // Get bio paragraphs from CMS or fallback
  const bioParagraphs = useMemo(() => {
    if (content?.bioSimple && content.bioSimple.length > 0) {
      return content.bioSimple;
    }
    return fallbackAbout.bioSimple || [];
  }, [content?.bioSimple]);

  // Get stats from CMS or fallback
  const stats = useMemo(() => {
    if (content?.stats && content.stats.length > 0) {
      return content.stats;
    }
    return fallbackAbout.stats || [];
  }, [content?.stats]);

  if (isLoading) {
    return <AboutSkeleton />;
  }

  return (
    <section id="about" className="py-20 md:py-32 bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            variants={imageFadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.3 }}
            className="relative"
          >
            <motion.div 
              className="aspect-[4/5] overflow-hidden"
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.3 }}
            >
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
                src={profileImageUrl}
                alt="Photographer portrait"
                width={800}
                height={1000}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
            {/* Decorative frame */}
            <motion.div 
              className="absolute -bottom-4 -right-4 w-full h-full border-2 border-neutral-300 dark:border-neutral-700 -z-10" 
              aria-hidden="true"
              initial={{ opacity: 0, x: 20, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
          </motion.div>

          {/* Content */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.3 }}
            className="lg:pl-8"
          >
            <motion.span 
              className="text-sm tracking-[0.3em] text-neutral-500 dark:text-neutral-400 uppercase block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.5 }}
              transition={{ delay: 0.1 }}
            >
              About Me
            </motion.span>
            <motion.h2 
              className="mt-4 text-3xl md:text-4xl lg:text-5xl font-light text-neutral-900 dark:text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.5 }}
              transition={{ delay: 0.2 }}
            >
              {content?.sectionTitle ? (
                <>
                  {content.sectionTitle.split(' ').slice(0, 2).join(' ')}{' '}
                  <span className="italic font-semibold">
                    {content.sectionTitle.split(' ').slice(2).join(' ')}
                  </span>
                </>
              ) : (
                <>The Story <span className="italic font-semibold">Behind the Lens</span></>
              )}
            </motion.h2>
            <div className="mt-8 space-y-6 text-neutral-600 dark:text-neutral-400">
              {bioParagraphs.map((text, index) => (
                <motion.p 
                  key={index}
                  className="leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.5 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {text}
                </motion.p>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={cardFadeIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ amount: 0.5 }}
                  transition={{ delay: 0.5 + index * 0.15 }}
                >
                  <div className="text-3xl md:text-4xl font-light text-neutral-900 dark:text-white">
                    {stat.number}
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default memo(About);
