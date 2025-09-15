/**
 * Smart Loading Utilities
 * Centralized loading state management to reduce excessive loading indicators
 */

// Minimum time to show a loading state (prevents flashing)
const MIN_LOADING_TIME = 300;

// Debounce time for search operations
const SEARCH_DEBOUNCE_TIME = 500;

interface LoadingState {
  isLoading: boolean;
  startTime: number;
  minTimeElapsed: boolean;
}

const loadingStates = new Map<string, LoadingState>();

/**
 * Smart loading manager that prevents flash loading states
 */
export class SmartLoading {
  private static instance: SmartLoading;
  private timeouts = new Map<string, NodeJS.Timeout>();

  static getInstance() {
    if (!SmartLoading.instance) {
      SmartLoading.instance = new SmartLoading();
    }
    return SmartLoading.instance;
  }

  /**
   * Start loading state with minimum duration
   */
  startLoading(key: string): void {
    // Clear any existing timeout
    this.clearTimeout(key);

    const now = Date.now();
    loadingStates.set(key, {
      isLoading: true,
      startTime: now,
      minTimeElapsed: false
    });

    // Set minimum time flag
    const timeout = setTimeout(() => {
      const state = loadingStates.get(key);
      if (state) {
        state.minTimeElapsed = true;
        loadingStates.set(key, state);
      }
    }, MIN_LOADING_TIME);

    this.timeouts.set(key, timeout);
  }

  /**
   * End loading state, respecting minimum duration
   */
  async endLoading(key: string): Promise<void> {
    const state = loadingStates.get(key);
    if (!state) return;

    const elapsed = Date.now() - state.startTime;
    
    if (elapsed < MIN_LOADING_TIME) {
      // Wait for minimum time to elapse
      await new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME - elapsed));
    }

    loadingStates.delete(key);
    this.clearTimeout(key);
  }

  /**
   * Check if currently loading
   */
  isLoading(key: string): boolean {
    return loadingStates.has(key);
  }

  /**
   * Force end loading (for errors or immediate stops)
   */
  forceEndLoading(key: string): void {
    loadingStates.delete(key);
    this.clearTimeout(key);
  }

  private clearTimeout(key: string): void {
    const timeout = this.timeouts.get(key);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(key);
    }
  }
}

/**
 * Debounced loading for search operations
 */
export class DebouncedLoading {
  private static timeouts = new Map<string, NodeJS.Timeout>();

  static start(key: string, callback: () => void, delay: number = SEARCH_DEBOUNCE_TIME): void {
    // Clear existing timeout
    const existingTimeout = this.timeouts.get(key);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      callback();
      this.timeouts.delete(key);
    }, delay);

    this.timeouts.set(key, timeout);
  }

  static cancel(key: string): void {
    const timeout = this.timeouts.get(key);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(key);
    }
  }
}

/**
 * Loading indicator component props
 */
export interface SmartLoadingProps {
  show: boolean;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  minimal?: boolean;
}

/**
 * Determine if loading should be shown based on data state
 */
export function shouldShowLoading(loading: boolean, hasData: boolean, isInitial: boolean = false): boolean {
  // Only show loading for initial loads or when no data exists
  return loading && (!hasData || isInitial);
}

/**
 * Get appropriate skeleton count based on viewport and data
 */
export function getSkeletonCount(viewport: 'mobile' | 'desktop', existing: number = 0): number {
  if (existing > 0) return 0; // Don't show skeletons if we have data
  
  return viewport === 'mobile' ? 3 : 6;
}

/**
 * Navigation loading helper
 */
export function createNavigationHandler(router: any, path: string, instant: boolean = true) {
  return (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (instant) {
      // Instant navigation for better UX
      router.push(path);
    } else {
      // Use smart loading for slower operations
      const smart = SmartLoading.getInstance();
      smart.startLoading(`nav-${path}`);
      
      router.push(path).finally(() => {
        smart.endLoading(`nav-${path}`);
      });
    }
  };
}

// Export singleton instance
export const smartLoading = SmartLoading.getInstance();