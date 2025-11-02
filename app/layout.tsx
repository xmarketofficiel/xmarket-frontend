import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';
import ConditionalLayout from '../components/ConditionalLayout';
import { UserProvider } from '../contexts/UserContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import { ToastProvider } from '../contexts/ToastContext';
import ToastContainer from '../components/ToastProvider';
import { UIProvider } from '../contexts/UIContext';
import KeyboardShortcutsProvider from '../components/KeyboardShortcutsProvider';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import OfflineStatus from '../components/OfflineStatus';
import ErrorBoundary from '../components/ErrorBoundary';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#3b82f6',
};

export const metadata: Metadata = {
  title: 'XMarket - University Marketplace',
  description: 'Buy and sell items within your university community',
  keywords: 'university, marketplace, students, buy, sell, items',
  authors: [{ name: 'XMarket Team' }],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'XMarket',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#3b82f6" />
        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-1E8HSY14EQ" />
        <Script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-1E8HSY14EQ');
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className={`${inter.variable} ${inter.className} antialiased`}>
        <ErrorBoundary>
          <UserProvider>
            <ToastProvider>
              <FavoritesProvider>
                <UIProvider>
                  <KeyboardShortcutsProvider>
                    <ConditionalLayout>
                      {children}
                    </ConditionalLayout>
                    <ToastContainer />
                    <PWAInstallPrompt />
                    {/* <PWATestButton /> */}
                    <OfflineStatus />
                  </KeyboardShortcutsProvider>
                </UIProvider>
              </FavoritesProvider>
            </ToastProvider>
          </UserProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}