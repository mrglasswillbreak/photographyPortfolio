'use client';
import { useState, useEffect } from 'react';
import { Images, Layers, Type, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Stats {
  galleryCount: number;
  servicesCount: number;
  contentItems: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ galleryCount: 0, servicesCount: 0, contentItems: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/gallery').then((r) => r.json()),
      fetch('/api/services').then((r) => r.json()),
      fetch('/api/content').then((r) => r.json()),
    ])
      .then(([gallery, services, content]) => {
        setStats({
          galleryCount: Array.isArray(gallery) ? gallery.length : 0,
          servicesCount: Array.isArray(services) ? services.length : 0,
          contentItems: typeof content === 'object' ? Object.keys(content).length : 0,
        });
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const cards = [
    { label: 'Gallery Images', value: stats.galleryCount, icon: Images, href: '/admin/dashboard/gallery', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
    { label: 'Services', value: stats.servicesCount, icon: Layers, href: '/admin/dashboard/services', color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' },
    { label: 'Content Fields', value: stats.contentItems, icon: Type, href: '/admin/dashboard/content', color: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400' },
  ];

  const quickActions = [
    { label: 'Upload a new photo', href: '/admin/dashboard/gallery', icon: Images },
    { label: 'Edit hero text', href: '/admin/dashboard/content', icon: Type },
    { label: 'Manage services', href: '/admin/dashboard/services', icon: Layers },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">Overview</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Manage your portfolio content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoading ? 0.5 : 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={card.href} className="block bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{card.label}</p>
                  <p className="text-3xl font-light text-neutral-900 dark:text-white mt-1">
                    {isLoading ? '–' : card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <card.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200 transition-colors">
                Manage <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
        <h2 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">Quick Actions</h2>
        <div className="space-y-2">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group"
            >
              <action.icon className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
              <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">{action.label}</span>
              <ArrowRight className="w-3 h-3 ml-auto text-neutral-300 group-hover:text-neutral-500 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* First-time setup hint — only shown when the database has no content yet */}
      {!isLoading && stats.contentItems === 0 && (
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">First-time setup</p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            Run database initialization by visiting{' '}
            <a href="/api/seed" target="_blank" rel="noopener noreferrer" className="underline font-medium">/api/seed</a>{' '}
            once after deployment to create tables and seed initial data.
          </p>
        </div>
      )}
    </div>
  );
}
