import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';
import { AppProviders } from '../providers/AppProviders';
import AppShell from '../components/AppShell';
import ToastContainer from '../components/ToastProvider';
import KeyboardShortcutsProvider from '../components/KeyboardShortcutsProvider';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import OfflineStatus from '../components/OfflineStatus';

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
  viewportFit: 'cover', // Enable safe area insets for notched devices
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
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5MBLLP46');
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${inter.className} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5MBLLP46"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        <AppProviders>
          <KeyboardShortcutsProvider>
            <AppShell>
              {children}
            </AppShell>
            <ToastContainer />
            <PWAInstallPrompt />
            <OfflineStatus />
          </KeyboardShortcutsProvider>
        </AppProviders>
        <Analytics />
      </body>
    </html>
  );
}