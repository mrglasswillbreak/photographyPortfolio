'use client';
import { memo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Award, Clock, Sparkles, Heart } from 'lucide-react';
import { fadeIn } from '@/utils/animations';

const reasons = [
  {
    icon: Sparkles,
    number: '01',
    title: 'Artisanal Craft',
    description: 'Every frame is composed with intention. We approach photography as a fine art — meticulous, deliberate, and deeply personal.',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=900&q=80',
  },
  {
    icon: Award,
    number: '02',
    title: 'Award-Winning Excellence',
    description: 'Recognised internationally with 50+ awards and published works across major publications and galleries worldwide.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&q=80',
  },
  {
    icon: Clock,
    number: '03',
    title: 'A Decade of Mastery',
    description: 'Ten years and 500+ sessions have refined our eye and technique. Experience that translates into images you will treasure forever.',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=900&q=80',
  },
  {
    icon: Heart,
    number: '04',
    title: 'Your Vision, Our Focus',
    description: 'Every session is tailored entirely around you — your story, your moments, your emotion. Nothing generic, ever.',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=80',
  },
];

function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="py-20 md:py-32 bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-3 text-sm tracking-[0.3em] text-neutral-500 dark:text-neutral-400 uppercase">
            <span className="w-8 h-px bg-neutral-400 dark:bg-neutral-600" aria-hidden="true" />
            The Difference
            <span className="w-8 h-px bg-neutral-400 dark:bg-neutral-600" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-light text-neutral-900 dark:text-white">
            Why Choose <span className="italic font-semibold">Us</span>
          </h2>
          <p className="mt-4 text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
            We don&apos;t just take photographs — we craft visual legacies that outlast a lifetime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.article
                key={reason.number}
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                tabIndex={0}
                className="group relative h-[440px] overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              >
                {/* Background image — zooms on hover */}
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
                  <Image
                    src={reason.image}
                    alt={reason.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                {/* Permanent dark gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
                {/* Hover scrim */}
                <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Decorative number — top right */}
                <div className="absolute top-6 right-6 text-5xl font-light text-white/10 leading-none select-none transition-colors duration-500 group-hover:text-white/20">
                  {reason.number}
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-7">
                  {/* Icon */}
                  <div className="mb-5 w-11 h-11 flex items-center justify-center border border-white/25 bg-black/20 backdrop-blur-sm transition-all duration-500 group-hover:border-white/55 group-hover:bg-white/10">
                    <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>

                  <h3 className="text-xl font-medium text-white mb-2 leading-snug">{reason.title}</h3>

                  {/* Description fades in on hover or focus */}
                  <p className="text-sm text-white/0 leading-relaxed transition-all duration-500 group-hover:text-white/70 group-focus-within:text-white/70">
                    {reason.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default memo(WhyChooseUs);
