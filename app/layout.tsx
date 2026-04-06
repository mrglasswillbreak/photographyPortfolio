import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import AnalyticsTracker from '@/components/ui/AnalyticsTracker';
import VercelAnalytics from '@/components/ui/VercelAnalytics';
import './globals.css';

export const metadata: Metadata = {
  title: 'LensCraft Photography',
  description: 'Professional photography portfolio – capturing life\'s beautiful moments.',
  manifest: '/site.webmanifest',
  icons: {
    icon: '/api/favicon',
    shortcut: '/api/favicon',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon.svg' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AnalyticsTracker />
          {children}
          <VercelAnalytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
