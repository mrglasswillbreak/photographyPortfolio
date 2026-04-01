import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Mail, Globe, Camera, Share2 } from 'lucide-react';
import { fadeIn } from '../../utils/animations';

const socialLinks = [
  { icon: Camera, href: '#', label: 'Portfolio' },
  { icon: Globe, href: '#', label: 'Website' },
  { icon: Mail, href: '#', label: 'Email' },
  { icon: Share2, href: '#', label: 'Share' },
] as const;

function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <motion.footer
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="py-12 bg-neutral-100 dark:bg-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <motion.a
            href="#home"
            className="text-2xl font-light tracking-wider text-neutral-900 dark:text-white"
            whileHover={{ scale: 1.02 }}
          >
            LENS<span className="font-semibold">CRAFT</span>
          </motion.a>

          {/* Social Links */}
          <nav className="flex items-center gap-4" aria-label="Social media links">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 flex items-center justify-center rounded-full
                           bg-neutral-200 dark:bg-neutral-800 
                           text-neutral-700 dark:text-neutral-300
                           hover:bg-neutral-900 hover:text-white 
                           dark:hover:bg-white dark:hover:text-neutral-900
                           transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <social.icon className="w-5 h-5" aria-hidden="true" />
              </motion.a>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            © {currentYear} LensCraft. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}

export default memo(Footer);
