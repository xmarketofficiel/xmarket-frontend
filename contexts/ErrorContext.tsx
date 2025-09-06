'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ErrorInfo {
  id: string;
  message: string;
  type: 'api' | 'validation' | 'network' | 'system';
  timestamp: Date;
  resolved: boolean;
  userVisible: boolean;
}

interface ErrorContextType {
  errors: ErrorInfo[];
  addError: (error: Omit<ErrorInfo, 'id' | 'timestamp' | 'resolved'>) => void;
  resolveError: (id: string) => void;
  clearErrors: () => void;
  getVisibleErrors: () => ErrorInfo[];
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function useErrorTracking() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorTracking must be used within an ErrorProvider');
  }
  return context;
}

interface ErrorProviderProps {
  children: ReactNode;
}

export function ErrorProvider({ children }: ErrorProviderProps) {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);

  const addError = (errorData: Omit<ErrorInfo, 'id' | 'timestamp' | 'resolved'>) => {
    const error: ErrorInfo = {
      ...errorData,
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      resolved: false,
    };

    setErrors(prev => [...prev, error]);

    // Auto-resolve non-critical errors after 5 seconds
    if (!error.userVisible) {
      setTimeout(() => {
        resolveError(error.id);
      }, 5000);
    }
  };

  const resolveError = (id: string) => {
    setErrors(prev => 
      prev.map(error => 
        error.id === id ? { ...error, resolved: true } : error
      )
    );
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const getVisibleErrors = () => {
    return errors.filter(error => error.userVisible && !error.resolved);
  };

  // Clean up old resolved errors
  useEffect(() => {
    const interval = setInterval(() => {
      setErrors(prev => 
        prev.filter(error => 
          !error.resolved || 
          (Date.now() - error.timestamp.getTime()) < 60000 // Keep for 1 minute
        )
      );
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Global error handler for unhandled promises
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      addError({
        message: event.reason?.message || 'Unhandled promise rejection',
        type: 'system',
        userVisible: false,
      });
    };

    // Global error handler for JavaScript errors
    const handleError = (event: ErrorEvent) => {
      addError({
        message: event.message || 'JavaScript error occurred',
        type: 'system',
        userVisible: false,
      });
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  const value: ErrorContextType = {
    errors,
    addError,
    resolveError,
    clearErrors,
    getVisibleErrors,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
}

// Error reporting hook for API calls
export function useApiError() {
  const { addError } = useErrorTracking();

  const reportApiError = (error: any, context: string) => {
    if (error?.name === 'ValidationError' || error?.status === 400) {
      addError({
        message: error.message || 'Invalid input provided',
        type: 'validation',
        userVisible: true,
      });
    } else if (error?.name === 'AuthenticationError' || error?.status === 401) {
      addError({
        message: 'Session expired. Please log in again.',
        type: 'api',
        userVisible: true,
      });
    } else if (error?.status >= 500) {
      addError({
        message: 'Server error occurred. Please try again later.',
        type: 'api',
        userVisible: true,
      });
    } else {
      addError({
        message: `Error in ${context}: ${error?.message || 'Unknown error'}`,
        type: 'api',
        userVisible: false,
      });
    }
  };

  return { reportApiError };
}
