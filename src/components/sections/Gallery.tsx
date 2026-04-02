import { memo, useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGalleryImages, useHomepageContent } from '../../hooks/useSanity';
import { getImageUrl } from '../../lib/sanity';
import { fallbackImageUrls } from '../../data/fallback';
import { fadeIn, staggerContainer, imageFadeIn, imageHover, overlayHover } from '../../utils/animations';
import { GallerySkeleton } from '../ui/Skeleton';
import ImageLightbox from '../ui/ImageLightbox';

const getImageHeight = (index: number) => {
  const heights = ['h-80', 'h-96', 'h-72'];
  return heights[index % 3];
};

interface SelectedImage {
  src: string;
  alt: string;
}

function Gallery() {
  const { data: images, isLoading: imagesLoading } = useGalleryImages();
  const { data: homepage } = useHomepageContent();
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);

  // Process images to get URLs (from CMS or fallback)
  const processedImages = useMemo(() => {
    return images.map((image) => {
      const imageUrl = image.image?.asset?._ref
        ? getImageUrl(image.image, { width: 800, quality: 80 })
        : fallbackImageUrls[image._id] || '';
      
      return {
        ...image,
        src: imageUrl,
      };
    });
  }, [images]);

  const openLightbox = useCallback((image: SelectedImage) => {
    setSelectedImage(image);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
  }, []);

  if (imagesLoading) {
    return <GallerySkeleton />;
  }

  return (
    <section id="gallery" className="py-20 md:py-32 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.3 }}
          className="text-center mb-16"
        >
          <span className="text-sm tracking-[0.3em] text-neutral-500 dark:text-neutral-400 uppercase">
            Portfolio
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-light text-neutral-900 dark:text-white">
            {homepage?.galleryTitle ? (
              <>
                {homepage.galleryTitle.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="italic font-semibold">
                  {homepage.galleryTitle.split(' ').slice(-1)}
                </span>
              </>
            ) : (
              <>Selected <span className="italic font-semibold">Works</span></>
            )}
          </h2>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            {homepage?.gallerySubtitle || 
              'A curated collection of my finest photographs, showcasing the beauty in every frame'}
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.1 }}
          className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
        >
          {processedImages.map((image, index) => (
            <motion.div
              key={image._id}
              variants={imageFadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.2 }}
              className="break-inside-avoid group relative overflow-hidden cursor-pointer"
              whileHover="hover"
              onClick={() => openLightbox({ src: image.src, alt: image.alt })}
            >
              <motion.div 
                variants={imageHover} 
                initial="rest"
                className="relative"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  width={800}
                  height={600}
                  className={`w-full object-cover ${getImageHeight(index)}`}
                  loading="lazy"
                  decoding="async"
                />
                {/* Overlay */}
                <motion.div
                  variants={overlayHover}
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                             flex flex-col justify-end p-6"
                >
                  <span className="text-xs tracking-[0.2em] text-white/70 uppercase mb-2">
                    {image.category}
                  </span>
                  <h3 className="text-lg font-light text-white">{image.alt}</h3>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Lightbox */}
        <ImageLightbox
          src={selectedImage?.src ?? ''}
          alt={selectedImage?.alt ?? ''}
          isOpen={selectedImage !== null}
          onClose={closeLightbox}
        />
      </div>
    </section>
  );
}

export default memo(Gallery);
