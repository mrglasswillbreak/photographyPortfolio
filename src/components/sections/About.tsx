import { memo } from 'react';
import { motion } from 'framer-motion';
import { fadeIn, fadeInUp } from '../../utils/animations';

const ABOUT_IMAGE_URL = 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=800&q=80';

const stats = [
  { number: '10+', label: 'Years Experience' },
  { number: '500+', label: 'Projects Completed' },
  { number: '50+', label: 'Awards Won' },
] as const;

function About() {
  return (
    <section id="about" className="py-20 md:py-32 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
                src={ABOUT_IMAGE_URL}
                alt="Photographer portrait"
                width={800}
                height={1000}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            {/* Decorative frame */}
            <div 
              className="absolute -bottom-4 -right-4 w-full h-full border-2 border-neutral-300 dark:border-neutral-700 -z-10" 
              aria-hidden="true"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="lg:pl-8"
          >
            <span className="text-sm tracking-[0.3em] text-neutral-500 dark:text-neutral-400 uppercase">
              About Me
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-light text-neutral-900 dark:text-white">
              The Story <span className="italic font-semibold">Behind the Lens</span>
            </h2>
            <div className="mt-8 space-y-6 text-neutral-600 dark:text-neutral-400">
              <p className="leading-relaxed">
                With over a decade of experience in photography, I've dedicated my life to
                capturing the extraordinary in the ordinary. My journey began with a simple
                film camera and has evolved into a passion for visual storytelling.
              </p>
              <p className="leading-relaxed">
                I believe every photograph tells a story – a moment frozen in time, waiting
                to be remembered. Whether it's the tender glance between newlyweds or the
                majestic beauty of a mountain sunrise, I strive to capture the emotion and
                essence of every scene.
              </p>
              <p className="leading-relaxed">
                My work has been featured in numerous publications and exhibitions
                worldwide. But my greatest reward is seeing the joy on my clients' faces
                when they relive their precious moments through my images.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
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
