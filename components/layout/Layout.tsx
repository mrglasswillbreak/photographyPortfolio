'use client';

import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from '@/components/sections/Footer';
import useTypographyStyles from '@/components/hooks/useTypographyStyles';

export default function Layout({ children }: { children: ReactNode }) {
  const { style } = useTypographyStyles();

  return (
    <div
      className="typography-scope min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300"
      style={style}
    >
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
