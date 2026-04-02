import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from '@/components/sections/Footer';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
