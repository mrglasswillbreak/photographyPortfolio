'use client';
import { useState, useEffect, useCallback, useRef, memo } from 'react';
import type { MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ui/ThemeToggle';
import useSiteName from '@/components/hooks/useSiteName';
import { navSlide } from '@/utils/animations';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Services', href: '#services' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

function Navbar() {
  const router = useRouter();
  const siteName = useSiteName();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggeredRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleToggle = useCallback(() => setIsOpen((p) => !p), []);
  const handleClose = useCallback(() => setIsOpen(false), []);
  const clearLogoLongPress = useCallback(() => {
    if (!longPressTimeoutRef.current) return;
    clearTimeout(longPressTimeoutRef.current);
    longPressTimeoutRef.current = null;
  }, []);
  const handleLogoPointerDown = useCallback(() => {
    longPressTriggeredRef.current = false;
    clearLogoLongPress();
    longPressTimeoutRef.current = setTimeout(() => {
      longPressTimeoutRef.current = null;
      longPressTriggeredRef.current = true;
      router.push('/admin/dashboard');
    }, 2300);
  }, [clearLogoLongPress, router]);
  const handleLogoPointerEnd = useCallback(() => {
    clearLogoLongPress();
  }, [clearLogoLongPress]);
  const handleLogoClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    if (!longPressTriggeredRef.current) return;
    event.preventDefault();
    longPressTriggeredRef.current = false;
  }, []);

  useEffect(() => {
    return () => {
      clearLogoLongPress();
    };
  }, [clearLogoLongPress]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.a
            href="#home"
            onPointerDown={handleLogoPointerDown}
            onPointerUp={handleLogoPointerEnd}
            onPointerCancel={handleLogoPointerEnd}
            onPointerLeave={handleLogoPointerEnd}
            onClick={handleLogoClick}
            className="flex items-center gap-2 text-2xl font-light tracking-wider text-neutral-900 dark:text-white"
            whileHover={{ scale: 1.02 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/api/favicon" alt="" aria-hidden="true" className="w-8 h-8 rounded-md flex-shrink-0" />
            {siteName}
          </motion.a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors duration-300 relative group"
                whileHover={{ y: -2 }}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neutral-900 dark:bg-white group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
            <ThemeToggle />
          </div>

          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <motion.button onClick={handleToggle} className="p-2 text-neutral-900 dark:text-white" whileTap={{ scale: 0.95 }} aria-label={isOpen ? 'Close menu' : 'Open menu'} aria-expanded={isOpen}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={navSlide} initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 top-20 bg-white dark:bg-neutral-950 md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={handleClose}
                  className="text-2xl font-light text-neutral-900 dark:text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default memo(Navbar);
