/**
 * Development Console Error Suppression
 * Helps reduce noise in development console while preserving important errors
 */

// Store original console methods
const originalError = console.error;
const originalWarn = console.warn;

// Patterns to suppress (case-insensitive)
const SUPPRESS_PATTERNS = [
  'Warning: Extra attributes from the server',
  'Warning: Prop.*did not match',
  'Warning: validateDOMNesting',
  'Failed to fetch unread count',
  'Messages system not implemented',
  'Warning: Function components cannot be given refs',
  'Warning: useLayoutEffect does nothing on the server',
  'chunk-',
  'hydration',
  'Warning: Each child in a list should have a unique "key" prop'
];

/**
 * Check if a console message should be suppressed
 */
function shouldSuppress(message: string): boolean {
  return SUPPRESS_PATTERNS.some(pattern => 
    message.toLowerCase().includes(pattern.toLowerCase())
  );
}

/**
 * Install console filters for development
 */
export function installConsoleFilters() {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return;
  }

  // Override console.error
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    if (!shouldSuppress(message)) {
      originalError(...args);
    }
  };

  // Override console.warn
  console.warn = (...args: any[]) => {
    const message = args.join(' ');
    if (!shouldSuppress(message)) {
      originalWarn(...args);
    }
  };
}

/**
 * Restore original console methods
 */
export function restoreConsole() {
  console.error = originalError;
  console.warn = originalWarn;
}

// Auto-install in development client-side
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  installConsoleFilters();
}
