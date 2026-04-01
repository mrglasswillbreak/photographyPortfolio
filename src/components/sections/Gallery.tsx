import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { galleryImages } from '../../data';
import { fadeIn, staggerContainer, imageFadeIn, imageHover, overlayHover } from '../../utils/animations';

const getImageHeight = (index: number) => {
  const heights = ['h-80', 'h-96', 'h-72'];
  return heights[index % 3];
};

function Gallery() {
  const images = useMemo(() => galleryImages, []);

  return (
    <section id="gallery" className="py-20 md:py-32 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <span className="text-sm tracking-[0.3em] text-neutral-500 dark:text-neutral-400 uppercase">
            Portfolio
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-light text-neutral-900 dark:text-white">
            Selected <span className="italic font-semibold">Works</span>
          </h2>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            A curated collection of my finest photographs, showcasing the beauty in
            every frame
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
        >
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              variants={imageFadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="break-inside-avoid group relative overflow-hidden"
              whileHover="hover"
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
      </div>
    </section>
  );
}

export default memo(Gallery);
