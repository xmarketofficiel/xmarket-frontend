import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import ConditionalLayout from '../components/ConditionalLayout';
import { UserProvider } from '../contexts/UserContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import { ToastProvider } from '../contexts/ToastContext';
import ToastContainer from '../components/ToastProvider';
import { UIProvider } from '../contexts/UIContext';
import KeyboardShortcutsProvider from '../components/KeyboardShortcutsProvider';
import { PerformanceProvider, PerformanceDebugger } from '../contexts/PerformanceContext';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import PWATestButton from '../components/PWATestButton';
import OfflineStatus from '../components/OfflineStatus';
import ErrorBoundary from '../components/ErrorBoundary';
import '../utils/consoleFilters';

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
      </head>
      <body suppressHydrationWarning className={`${inter.variable} ${inter.className} antialiased`}>
        <ErrorBoundary>
          <UserProvider>
            <ToastProvider>
              <FavoritesProvider>
                <UIProvider>
                  <PerformanceProvider>
                    <KeyboardShortcutsProvider>
                      <ConditionalLayout>
                        {children}
                      </ConditionalLayout>
                      <ToastContainer />
                      <PWAInstallPrompt />
                      {/* <PWATestButton /> */}
                      <OfflineStatus />
                      {/* <PerformanceDebugger /> */}
                    </KeyboardShortcutsProvider>
                  </PerformanceProvider>
                </UIProvider>
              </FavoritesProvider>
            </ToastProvider>
          </UserProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}