'use client';
import { memo, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, User, Mountain, Camera, Image as ImageIcon, Video, Star, Award, Calendar, Users, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { fadeIn } from '@/utils/animations';
import { ServicesSkeleton } from '@/components/ui/Skeleton';
import type { Service } from '@/lib/types';

const iconMap: Record<string, LucideIcon> = { Heart, User, Mountain, Camera, Image: ImageIcon, Video, Star, Award, Calendar, Users };

// Curated Unsplash images matched to each service icon / photography category
const serviceImages: Record<string, string> = {
  Heart: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
  User: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80',
  Mountain: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  Camera: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80',
  Image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
  Video: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80',
  Star: 'https://images.unsplash.com/photo-1502209524164-acea936639a2?w=800&q=80',
  Award: 'https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?w=800&q=80',
  Calendar: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
  Users: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
};

const DEFAULT_SERVICE_IMAGE = 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80';

function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then((r) => {
        if (!r.ok) throw new Error(`Request failed with status ${r.status}`);
        return r.json();
      })
      .then((data) => { if (Array.isArray(data)) setServices(data); })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <ServicesSkeleton />;

  return (
    <section id="services" className="py-20 md:py-32 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="text-center mb-16">
          <span className="inline-flex items-center gap-3 text-sm tracking-[0.3em] text-neutral-400 uppercase">
            <span className="w-8 h-px bg-neutral-600" aria-hidden="true" />
            What I Offer
            <span className="w-8 h-px bg-neutral-600" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-light text-white">
            Photography <span className="italic font-semibold">Services</span>
          </h2>
          <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">Professional photography services tailored to capture your unique story</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Camera;
            const bgImage = serviceImages[service.icon] || DEFAULT_SERVICE_IMAGE;
            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                tabIndex={0}
                className="group relative h-[420px] overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                {/* Background image — zooms on hover via CSS transform */}
                <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
                  <Image
                    src={bgImage}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                {/* Permanent dark gradient — bottom emphasis */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
                {/* Hover scrim — deepens the whole card slightly */}
                <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-7">
                  {/* Icon frame */}
                  <div className="mb-5 w-11 h-11 flex items-center justify-center border border-white/25 bg-black/20 backdrop-blur-sm transition-all duration-500 group-hover:border-white/55 group-hover:bg-white/10">
                    <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>

                  <h3 className="text-xl font-medium text-white mb-2 leading-snug">{service.title}</h3>

                  {/* Description fades up on hover or focus */}
                  <p className="text-sm text-white/0 leading-relaxed transition-all duration-500 group-hover:text-white/70 group-focus-within:text-white/70">
                    {service.description}
                  </p>

                  {/* Explore link */}
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs tracking-widest uppercase text-white/0 transition-all duration-500 group-hover:text-white/55 group-focus-within:text-white/55">
                      Explore
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-white/0 transition-all duration-500 group-hover:text-white/55 group-hover:translate-x-1 group-focus-within:text-white/55 group-focus-within:translate-x-1" aria-hidden="true" />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default memo(Services);
