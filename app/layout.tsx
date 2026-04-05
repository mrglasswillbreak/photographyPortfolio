import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import AnalyticsTracker from '@/components/ui/AnalyticsTracker';
import VercelAnalytics from '@/components/ui/VercelAnalytics';
import './globals.css';

export const metadata: Metadata = {
  title: 'LensCraft Photography',
  description: 'Professional photography portfolio – capturing life\'s beautiful moments.',
  icons: {
    icon: '/api/favicon',
    shortcut: '/api/favicon',
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
