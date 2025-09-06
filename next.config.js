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
  
  // Remove deprecated swcMinify - SWC is enabled by default in Next.js 15+
  
  // Experimental features - minimal configuration for stability
  experimental: {
    // Ensure client components work properly
    optimizePackageImports: ['lucide-react', 'framer-motion']
  },
  
  // Compiler optimizations using SWC (automatically enabled in Next.js 15+)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Simplified webpack configuration for Next.js 15+
  webpack: (config, { isServer }) => {
    // Only apply fallbacks for client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.xmarket.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
  },
  
  // Ensure proper module resolution
  transpilePackages: [],
  
  // PoweredByHeader
  poweredByHeader: false,
};

module.exports = withBundleAnalyzer(nextConfig);
