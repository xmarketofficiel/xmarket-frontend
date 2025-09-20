/**
 * Application Configuration
 * Separates client-side and server-side configurations
 */

// ======================
// CLIENT-SIDE CONFIG (Safe to expose to browser)
// ======================

export const CLIENT_CONFIG = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'XMarket',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  },
  
  // API Configuration - Always use SSR routes to hide backend
  api: {
    baseUrl: '/api', // Always use local API routes
    timeout: 10000,
    retries: 3,
  },
  
  features: {
    pwaEnabled: process.env.PWA_ENABLED === 'true',
    performanceMonitoring: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true',
    debugLogging: process.env.NEXT_PUBLIC_ENABLE_DEBUG_LOGGING === 'true',
    consoleLogsEnabled: process.env.NEXT_PUBLIC_ENABLE_CONSOLE_LOGS === 'true',
  },
  
  // External Services (only public keys/IDs)
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID,
  },
  
  sentry: {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
} as const;

// ======================
// RUNTIME ENVIRONMENT DETECTION
// ======================

export const ENV = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  
  // Build-time environment
  isBrowser: typeof window !== 'undefined',
  isServer: typeof window === 'undefined',
} as const;

// ======================
// VALIDATION HELPERS
// ======================

export function validateClientConfig() {
  // Validate that sensitive information is not exposed
  const exposedKeys = Object.keys(process.env).filter(key => 
    key.includes('SECRET') || 
    key.includes('PRIVATE') || 
    key.includes('DATABASE') ||
    key.includes('BACKEND_URL')
  );
  
  if (ENV.isBrowser && exposedKeys.length > 0) {
    console.warn('⚠️ Potentially sensitive environment variables detected in browser:', exposedKeys);
  }
  
  return {
    valid: true,
    warnings: exposedKeys.length > 0 ? [`${exposedKeys.length} potentially sensitive env vars detected`] : [],
  };
}

// ======================
// FEATURE FLAGS
// ======================

export function isFeatureEnabled(feature: keyof typeof CLIENT_CONFIG.features): boolean {
  return CLIENT_CONFIG.features[feature] === true;
}

// ======================
// DEVELOPMENT HELPERS
// ======================

export function getDebugInfo() {
  if (!ENV.isDevelopment) {
    return null;
  }
  
  return {
    environment: process.env.NODE_ENV,
    buildTime: new Date().toISOString(),
    config: CLIENT_CONFIG,
    validation: validateClientConfig(),
  };
}
