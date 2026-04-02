'use client';
import { memo, useMemo, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer, imageFadeIn, imageHover, overlayHover } from '@/utils/animations';
import { GallerySkeleton } from '@/components/ui/Skeleton';
import ImageLightbox from '@/components/ui/ImageLightbox';
import type { GalleryImage } from '@/lib/types';

const getImageHeight = (index: number) => ['h-80', 'h-96', 'h-72'][index % 3];

interface SelectedImage { src: string; alt: string; }

interface GalleryHeader { title: string; subtitle: string; }

function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [header, setHeader] = useState<GalleryHeader>({ title: 'Selected Works', subtitle: 'A curated collection of my finest photographs, showcasing the beauty in every frame' });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);

  useEffect(() => {
    const fetchJson = async (input: RequestInfo) => {
      const r = await fetch(input);
      if (!r.ok) throw new Error(`Request failed with status ${r.status}`);
      return r.json();
    };

    Promise.all([fetchJson('/api/gallery'), fetchJson('/api/content')])
      .then(([imgs, content]) => {
        if (Array.isArray(imgs)) setImages(imgs as GalleryImage[]);
        const c = content && typeof content === 'object' ? (content as Record<string, string>) : {};
        setHeader({
          title: c.gallery_title || 'Selected Works',
          subtitle: c.gallery_subtitle || 'A curated collection of my finest photographs, showcasing the beauty in every frame',
        });
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const openLightbox = useCallback((image: SelectedImage) => setSelectedImage(image), []);
  const closeLightbox = useCallback(() => setSelectedImage(null), []);

  const titleWords = useMemo(() => header.title.split(' '), [header.title]);

  if (isLoading) return <GallerySkeleton />;

  return (
    <section id="gallery" className="py-20 md:py-32 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ amount: 0.3 }} className="text-center mb-16">
          <span className="text-sm tracking-[0.3em] text-neutral-500 dark:text-neutral-400 uppercase">Portfolio</span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-light text-neutral-900 dark:text-white">
            {titleWords.slice(0, -1).join(' ')}{' '}
            <span className="italic font-semibold">{titleWords.slice(-1)}</span>
          </h2>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">{header.subtitle}</p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ amount: 0.1 }} className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              variants={imageFadeIn} initial="hidden" whileInView="visible" viewport={{ amount: 0.2 }}
              className="break-inside-avoid group relative overflow-hidden cursor-pointer"
              whileHover="hover"
              onClick={() => openLightbox({ src: image.url, alt: image.alt })}
            >
              <motion.div variants={imageHover} initial="rest" className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt={image.alt} className={`w-full object-cover ${getImageHeight(index)}`} loading="lazy" decoding="async" />
                <motion.div variants={overlayHover} className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <span className="text-xs tracking-[0.2em] text-white/70 uppercase mb-2">{image.category}</span>
                  <h3 className="text-lg font-light text-white">{image.alt}</h3>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <ImageLightbox src={selectedImage?.src ?? ''} alt={selectedImage?.alt ?? ''} isOpen={selectedImage !== null} onClose={closeLightbox} />
      </div>
    </section>
  );
}

export default memo(Gallery);
