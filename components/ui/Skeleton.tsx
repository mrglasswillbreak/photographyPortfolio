import { memo } from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = memo(function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <motion.div
      className={`bg-neutral-200 dark:bg-neutral-800 rounded ${className}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
});

export const TextSkeleton = memo(function TextSkeleton({ width = 'w-full', height = 'h-4' }: { width?: string; height?: string }) {
  return <Skeleton className={`${width} ${height}`} />;
});

export const ImageSkeleton = memo(function ImageSkeleton({ className = 'w-full h-64' }: SkeletonProps) {
  return <Skeleton className={className} />;
});

export const HeroSkeleton = memo(function HeroSkeleton() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-900">
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <TextSkeleton width="w-48" height="h-4" />
        <div className="mt-6"><TextSkeleton width="w-96 mx-auto" height="h-12" /></div>
        <div className="mt-4"><TextSkeleton width="w-80 mx-auto" height="h-12" /></div>
        <div className="mt-8"><TextSkeleton width="w-2/3 mx-auto" height="h-6" /></div>
        <div className="mt-10 flex justify-center gap-4">
          <Skeleton className="w-32 h-12" />
          <Skeleton className="w-32 h-12" />
        </div>
      </div>
    </section>
  );
});

export const GallerySkeleton = memo(function GallerySkeleton() {
  return (
    <section className="py-20 md:py-32 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <TextSkeleton width="w-24 mx-auto" height="h-4" />
          <div className="mt-4"><TextSkeleton width="w-64 mx-auto" height="h-10" /></div>
          <div className="mt-4"><TextSkeleton width="w-96 mx-auto" height="h-5" /></div>
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <ImageSkeleton key={i} className={`w-full break-inside-avoid ${['h-80', 'h-96', 'h-72'][i % 3]}`} />
          ))}
        </div>
      </div>
    </section>
  );
});

export const AboutSkeleton = memo(function AboutSkeleton() {
  return (
    <section className="py-20 md:py-32 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <ImageSkeleton className="aspect-[4/5] w-full" />
          <div className="lg:pl-8">
            <TextSkeleton width="w-24" height="h-4" />
            <div className="mt-4"><TextSkeleton width="w-80" height="h-10" /></div>
            <div className="mt-8 space-y-4">
              <TextSkeleton width="w-full" height="h-20" />
              <TextSkeleton width="w-full" height="h-20" />
              <TextSkeleton width="w-3/4" height="h-20" />
            </div>
            <div className="mt-12 grid grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <TextSkeleton width="w-16" height="h-8" />
                  <TextSkeleton width="w-24" height="h-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export const ServicesSkeleton = memo(function ServicesSkeleton() {
  return (
    <section className="py-20 md:py-32 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <TextSkeleton width="w-24 mx-auto" height="h-4" />
          <div className="mt-4"><TextSkeleton width="w-64 mx-auto" height="h-10" /></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[420px]" />
          ))}
        </div>
      </div>
    </section>
  );
});

export const WhyChooseUsSkeleton = memo(function WhyChooseUsSkeleton() {
  return (
    <section className="py-20 md:py-32 bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <TextSkeleton width="w-24 mx-auto" height="h-4" />
          <div className="mt-4"><TextSkeleton width="w-64 mx-auto" height="h-10" /></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[440px]" />
          ))}
        </div>
      </div>
    </section>
  );
});

export const ContactSkeleton = memo(function ContactSkeleton() {
  return (
    <section className="py-20 md:py-32 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <TextSkeleton width="w-24 mx-auto" height="h-4" />
          <div className="mt-4"><TextSkeleton width="w-48 mx-auto" height="h-10" /></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div><TextSkeleton width="w-16" height="h-4" /><TextSkeleton width="w-32" height="h-5" /></div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-6"><Skeleton className="h-12" /><Skeleton className="h-12" /></div>
            <Skeleton className="h-12" />
            <Skeleton className="h-32" />
            <Skeleton className="w-40 h-12" />
          </div>
        </div>
      </div>
    </section>
  );
});
