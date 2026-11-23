const path = require('path');

// Conditionally load bundle analyzer
let withBundleAnalyzer = (config) => config;
if (process.env.ANALYZE === 'true') {
  try {
    withBundleAnalyzer = require('@next/bundle-analyzer')({
      enabled: true,
    });
  } catch (error) {
    console.log('Bundle analyzer not available, skipping...');
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better error detection
  reactStrictMode: true,
  
  // Set output file tracing root to silence workspace warnings
  outputFileTracingRoot: path.join(__dirname),
  
  // Experimental features - minimal configuration for stability
  experimental: {
    // Ensure client components work properly
    optimizePackageImports: ['lucide-react', 'framer-motion']
  },
  
  // Turbopack configuration for Next.js 16
  turbopack: {},
  
  // Compiler optimizations using SWC (automatically enabled in Next.js 15+)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Simplified webpack configuration for Next.js 15+
  webpack: (config, { isServer, dev }) => {
    // Only apply fallbacks for client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Production optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    
    return config;
  },
  
  // Image optimization (disabled to prevent Vercel from using Next.js optimizer)
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xmarket-images-prod.ams3.cdn.digitaloceanspaces.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'xmarket-images-prod.ams3.digitaloceanspaces.com',
        pathname: '/**',
      },
    ],
  },
  
  // Ensure proper module resolution
  transpilePackages: [],
  
  // Remove powered by header
  poweredByHeader: false,
  
  // Compression
  compress: true,
  
  // Generate static pages where possible
  output: 'standalone',
  
  // Performance optimizations
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
