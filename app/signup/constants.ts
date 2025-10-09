// Signup Page Constants
export const SIGNUP_CONFIG = {
  // Animation settings
  ANIMATION_DURATION: 0.6,
  FLOATING_ELEMENTS_COUNT: 15,
  REDIRECT_DELAY: 1500,
  
  // Timer settings
  RESEND_TIMER: 60,
  OTP_RESEND_COOLDOWN: 30,
  
  // Validation patterns
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s-()]{10,}$/,
  PASSWORD_MIN_LENGTH: 8,
  
  // Default values
  DEFAULT_SIGNUP_MODE: 'signup' as const,
  
  // Form step types
  STEPS: {
    EMAIL: 'email',
    OTP: 'otp', 
    DETAILS: 'details',
    COMPLETE: 'complete',
    REQUEST_ACCESS: 'request-access'
  } as const
};

// Brand messaging and features
export const BRAND_FEATURES = {
  MAIN_TITLE: "Join the Future of Student Commerce",
  SUBTITLE: "Connect with students, trade textbooks, gadgets, and more",
  
  FEATURES: [
    {
      icon: "🎓",
      title: "Student Community",
      description: "Verified college students only"
    },
    {
      icon: "🛡️", 
      title: "Secure Trading",
      description: "Safe transactions with trusted peers"
    },
    {
      icon: "💡",
      title: "Smart Marketplace",
      description: "AI-powered recommendations"
    },
    {
      icon: "🚀",
      title: "Fast & Easy",
      description: "List items in seconds"
    }
  ],

  // Request access messaging
  REQUEST_ACCESS: {
    TITLE: "Request Early Access",
    SUBTITLE: "Be among the first to experience our student marketplace",
    DESCRIPTION: "We're launching soon! Join our waitlist to get early access and exclusive benefits."
  }
};

// Error messages
export const ERROR_MESSAGES = {
  // Email validation
  INVALID_EMAIL: "Please enter a valid email address",
  EMAIL_REQUIRED: "Email address is required",
  EMAIL_NOT_AUTHORIZED: "This email is not authorized. Please contact admin or request access.",
  EMAIL_ALREADY_EXISTS: "This email is already registered. Please login or use a different email address.",
  
  // OTP validation
  INVALID_OTP: "Please enter a valid 6-digit verification code",
  OTP_REQUIRED: "Verification code is required",
  OTP_EXPIRED: "Verification code has expired. Please request a new one.",
  OTP_INCORRECT: "Invalid verification code. Please try again.",
  
  // Password validation
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_TOO_SHORT: `Password must be at least ${SIGNUP_CONFIG.PASSWORD_MIN_LENGTH} characters long`,
  PASSWORD_MISMATCH: "Passwords do not match",
  
  // Personal details validation
  NAME_REQUIRED: "Full name is required",
  PHONE_REQUIRED: "WhatsApp number is required",
  PHONE_INVALID: "Please enter a valid phone number",
  
  // Network and server errors
  NETWORK_ERROR: "Network connection failed. Please check your internet and try again.",
  SERVER_ERROR: "Something went wrong on our end. Please try again later.",
  SIGNUP_FAILED: "Signup failed. Please try again.",
  
  // General errors
  GENERIC_ERROR: "An unexpected error occurred. Please try again.",
  RATE_LIMIT: "Too many attempts. Please wait before trying again."
};

// Success messages
export const SUCCESS_MESSAGES = {
  OTP_SENT: "Verification code sent to your email! Please check your Junk/Spam folder if you don't see it.",
  OTP_VERIFIED: "Email verified successfully!",
  SIGNUP_SUCCESS: "Welcome to XMarket! Redirecting to marketplace...",
  REQUEST_SUBMITTED: "Access request submitted! We'll notify you when your account is ready.",
  RESEND_SUCCESS: "Verification code resent successfully!"
};

// Step configuration
export const STEP_CONFIG = {
  USER_TYPE: {
    title: "Choose Your Access Type",
    subtitle: "",
    buttonText: "Continue",
    loadingText: "Loading..."
  },

  EMAIL: {
    title: "Welcome to XMarket",
    subtitle: "Enter your student email to get started",
    buttonText: "Send Verification Code",
    loadingText: "Sending code..."
  },
  
  OTP: {
    title: "Check Your Email",
    subtitle: "Enter the 6-digit code we sent to your email",
    buttonText: "Verify Code",
    loadingText: "Verifying..."
  },
  
  DETAILS: {
    title: "Complete Your Profile",
    subtitle: "Tell us a bit about yourself",
    buttonText: "Create Account",
    loadingText: "Creating account..."
  },
  
  COMPLETE: {
    title: "Welcome Aboard!",
    subtitle: "Your account has been created successfully",
    redirectText: "Redirecting to marketplace..."
  },

  "1337_STUDENT": {
    title: "1337 Student Registration",
    subtitle: "Connect with Discord to verify your 1337 membership and complete your registration.",
    buttonText: "Continue",
    loadingText: "Processing..."
  },
  
  REQUEST_ACCESS: {
    title: "Request Access",
    subtitle: "Get notified when we launch",
    buttonText: "Submit Request",
    loadingText: "Submitting..."
  },

  REQUEST_SUCCESS: {
    title: "Request Submitted!",
    subtitle: "We'll notify you once your access is approved"
  }
};

// Animation variants
export const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  
  slideIn: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  },
  
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  }
};
