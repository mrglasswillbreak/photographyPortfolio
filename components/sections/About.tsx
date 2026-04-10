'use client';
import { memo, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeInLeft, fadeInRight, cardFadeIn, imageFadeIn } from '@/utils/animations';
import { AboutSkeleton } from '@/components/ui/Skeleton';

const DEFAULT_ABOUT_IMAGE = 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=800&q=80';

interface AboutContent {
  image: string;
  section_title: string;
  bio_1: string;
  bio_2: string;
  bio_3: string;
  stat_1_number: string;
  stat_1_label: string;
  stat_2_number: string;
  stat_2_label: string;
  stat_3_number: string;
  stat_3_label: string;
}

const DEFAULTS: AboutContent = {
  image: DEFAULT_ABOUT_IMAGE,
  section_title: 'The Story Behind the Lens',
  bio_1: "With over a decade of experience in photography, I've dedicated my life to capturing the extraordinary in the ordinary.",
  bio_2: "I believe every photograph tells a story – a moment frozen in time, waiting to be remembered.",
  bio_3: "My work has been featured in numerous publications and exhibitions worldwide.",
  stat_1_number: '10+', stat_1_label: 'Years Experience',
  stat_2_number: '500+', stat_2_label: 'Projects Completed',
  stat_3_number: '50+', stat_3_label: 'Awards Won',
};

function About() {
  const [content, setContent] = useState<AboutContent>(DEFAULTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((data) => {
        setContent({
          image: data.about_image || DEFAULTS.image,
          section_title: data.about_section_title || DEFAULTS.section_title,
          bio_1: data.about_bio_1 || DEFAULTS.bio_1,
          bio_2: data.about_bio_2 || DEFAULTS.bio_2,
          bio_3: data.about_bio_3 || DEFAULTS.bio_3,
          stat_1_number: data.about_stat_1_number || DEFAULTS.stat_1_number,
          stat_1_label: data.about_stat_1_label || DEFAULTS.stat_1_label,
          stat_2_number: data.about_stat_2_number || DEFAULTS.stat_2_number,
          stat_2_label: data.about_stat_2_label || DEFAULTS.stat_2_label,
          stat_3_number: data.about_stat_3_number || DEFAULTS.stat_3_number,
          stat_3_label: data.about_stat_3_label || DEFAULTS.stat_3_label,
        });
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const titleWords = content.section_title.split(' ');
  const stats = [
    { number: content.stat_1_number, label: content.stat_1_label },
    { number: content.stat_2_number, label: content.stat_2_label },
    { number: content.stat_3_number, label: content.stat_3_label },
  ];

  if (isLoading) return <AboutSkeleton />;

  return (
    <section id="about" className="py-20 md:py-32 bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div variants={imageFadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="relative">
            <motion.div className="aspect-[4/5] overflow-hidden relative" variants={fadeInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="relative w-full h-full">
                <Image src={content.image} alt="Photographer portrait" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </motion.div>
            </motion.div>
            <motion.div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-neutral-300 dark:border-neutral-700 -z-10" aria-hidden="true" initial={{ opacity: 0, x: 20, y: 20 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
          </motion.div>

          <motion.div variants={fadeInRight} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="lg:pl-8">
            <motion.span className="inline-flex items-center gap-3 text-sm tracking-[0.3em] text-neutral-500 dark:text-neutral-400 uppercase" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
              <span className="w-6 h-px bg-neutral-400 dark:bg-neutral-600" aria-hidden="true" />
              About Me
            </motion.span>
            <motion.h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-light text-neutral-900 dark:text-white" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
              {titleWords.slice(0, 2).join(' ')}{' '}
              <span className="italic font-semibold">{titleWords.slice(2).join(' ')}</span>
            </motion.h2>
            <div className="mt-8 space-y-6 text-neutral-600 dark:text-neutral-400">
              {[content.bio_1, content.bio_2, content.bio_3].filter(Boolean).map((text, i) => (
                <motion.p key={i} className="leading-relaxed" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}>{text}</motion.p>
              ))}
            </div>
            <div className="mt-12 grid grid-cols-3 gap-8">
              {stats.map((stat, i) => (
                <motion.div key={stat.label} variants={cardFadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} transition={{ delay: 0.5 + i * 0.15 }}>
                  <div className="text-3xl md:text-4xl font-light text-neutral-900 dark:text-white">{stat.number}</div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{stat.label}</div>
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
