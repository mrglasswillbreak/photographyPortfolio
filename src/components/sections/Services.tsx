import { motion } from 'framer-motion';
import { Heart, User, Mountain, Camera } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { services } from '../../data';
import { fadeIn, staggerContainer, staggerItem } from '../../utils/animations';

const iconMap: Record<string, LucideIcon> = {
  Heart,
  User,
  Mountain,
  Camera,
};

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-32 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <span className="text-sm tracking-[0.3em] text-neutral-500 dark:text-neutral-400 uppercase">
            What I Offer
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-light text-neutral-900 dark:text-white">
            Photography <span className="italic font-semibold">Services</span>
          </h2>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Professional photography services tailored to capture your unique story
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => {
            const Icon = iconMap[service.icon];
            return (
              <motion.div
                key={service.id}
                variants={staggerItem}
                whileHover={{ y: -10 }}
                className="group p-8 bg-neutral-50 dark:bg-neutral-900 rounded-sm 
                           hover:bg-neutral-100 dark:hover:bg-neutral-800 
                           transition-colors duration-500 cursor-pointer"
              >
                <motion.div
                  className="w-14 h-14 mb-6 flex items-center justify-center 
                             bg-neutral-200 dark:bg-neutral-800 rounded-full
                             group-hover:bg-neutral-900 dark:group-hover:bg-white
                             transition-colors duration-500"
                >
                  <Icon
                    className="w-6 h-6 text-neutral-700 dark:text-neutral-300
                               group-hover:text-white dark:group-hover:text-neutral-900
                               transition-colors duration-500"
                  />
                </motion.div>
                <h3 className="text-xl font-medium text-neutral-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
