// Login page constants and configuration
export const LOGIN_CONFIG = {
  DEFAULT_EMAIL: 'test@example.com',
  DEFAULT_PASSWORD: 'password123',
  ANIMATION_DURATION: 0.6,
  REDIRECT_DELAY: 1000,
  FLOATING_ELEMENTS_COUNT: 12
} as const;

export const BRAND_FEATURES = [
  {
    icon: 'Shield',
    text: 'University verified community'
  },
  {
    icon: 'Heart', 
    text: 'Trusted by thousands of students'
  },
  {
    icon: 'Sparkles',
    text: 'Smart interest matching'
  }
] as const;

export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  NETWORK_ERROR: 'Unable to connect to server. Please check your connection and try again.',
  GENERIC_ERROR: 'Login failed. Please try again.'
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful! Redirecting...'
} as const;
