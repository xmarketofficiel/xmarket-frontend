/**
 * Console utilities for development environment
 * Helps suppress known non-critical warnings while preserving important errors
 */

type ConsoleMethod = 'log' | 'warn' | 'error' | 'info';

interface ConsoleConfig {
  suppressPatterns: {
    [key in ConsoleMethod]?: string[];
  };
}

class ConsoleManager {
  private originalConsole: {
    log: typeof console.log;
    warn: typeof console.warn;
    error: typeof console.error;
    info: typeof console.info;
  };
  private config: ConsoleConfig;

  constructor(config: ConsoleConfig = { suppressPatterns: {} }) {
    this.config = config;
    this.originalConsole = {
      log: console.log.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      info: console.info.bind(console),
    };
  }

  private shouldSuppress(method: ConsoleMethod, message: string): boolean {
    const patterns = this.config.suppressPatterns[method] || [];
    return patterns.some(pattern => message.includes(pattern));
  }

  private createFilteredMethod(method: ConsoleMethod) {
    return (...args: any[]) => {
      const message = args.join(' ');
      
      if (!this.shouldSuppress(method, message)) {
        this.originalConsole[method](...args);
      }
    };
  }

  install() {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log = this.createFilteredMethod('log');
      console.warn = this.createFilteredMethod('warn');
      console.error = this.createFilteredMethod('error');
      console.info = this.createFilteredMethod('info');
    }
  }

  restore() {
    if (typeof window !== 'undefined') {
      console.log = this.originalConsole.log;
      console.warn = this.originalConsole.warn;
      console.error = this.originalConsole.error;
      console.info = this.originalConsole.info;
    }
  }
}

// Default configuration for common React/Next.js development warnings
const defaultConfig: ConsoleConfig = {
  suppressPatterns: {
    warn: [
      'Extra attributes from the server',
      'Prop `%s` did not match',
      'Warning: validateDOMNesting',
      'Warning: Function components cannot be given refs',
    ],
    error: [
      // Suppress known network errors for unimplemented features
      'Failed to fetch unread count',
      'Messages system not implemented',
    ],
  },
};

export const consoleManager = new ConsoleManager(defaultConfig);

// Auto-install in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  consoleManager.install();
}

export default consoleManager;
