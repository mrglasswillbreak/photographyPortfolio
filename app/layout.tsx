import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from 'next-themes';
import AnalyticsTracker from '@/components/ui/AnalyticsTracker';
import VercelAnalytics from '@/components/ui/VercelAnalytics';
import './globals.css';

export const metadata: Metadata = {
  title: 'LensCraft Photography',
  description: 'Professional photography portfolio – capturing life\'s beautiful moments.',
  applicationName: 'LensCraft Photography',
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LensCraft',
  },
  icons: {
    icon: [
      { url: '/api/pwa-icon?size=32', sizes: '32x32', type: 'image/png' },
      { url: '/api/pwa-icon?size=16', sizes: '16x16', type: 'image/png' },
      { url: '/api/favicon' },
    ],
    shortcut: '/api/pwa-icon?size=32',
    apple: [
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon.svg', color: '#111111' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#111111',
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
