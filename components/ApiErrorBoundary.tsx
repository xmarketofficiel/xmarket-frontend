'use client';

import React, { Component, ReactNode } from 'react';
import { ApiError } from '../lib/api';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ApiErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Only log unexpected errors
    if (error instanceof ApiError) {
      // Don't spam console with expected user errors
      if (error.name === 'AuthenticationError' || error.name === 'ClientError') {
        return;
      }
    }
    
    console.error('ApiErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      const { error } = this.state;
      
      // Handle API errors gracefully
      if (error instanceof ApiError) {
        if (error.name === 'AuthenticationError') {
          // For auth errors, just reset the boundary and let parent components handle
          this.setState({ hasError: false, error: undefined });
          return this.props.children;
        }
        
        if (error.name === 'ClientError') {
          // For client errors, show a gentle message
          return (
            this.props.fallback || (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="text-yellow-800">
                  <h3 className="font-medium">Request Error</h3>
                  <p className="text-sm mt-1">
                    There was an issue with your request. Please try again.
                  </p>
                  <button
                    onClick={() => this.setState({ hasError: false, error: undefined })}
                    className="mt-2 text-sm text-yellow-700 hover:text-yellow-900 underline"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )
          );
        }
      }
      
      // For other errors, use the provided fallback or default
      return (
        this.props.fallback || (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="text-red-800">
              <h3 className="font-medium">Something went wrong</h3>
              <p className="text-sm mt-1">
                Please refresh the page or try again later.
              </p>
              <button
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Hook for functional components
export function useErrorHandler() {
  return React.useCallback((error: Error) => {
    if (error instanceof ApiError) {
      // Don't let authentication errors bubble up
      if (error.name === 'AuthenticationError' || error.name === 'ClientError') {
        return;
      }
    }
    // For other errors, let them bubble up normally
    throw error;
  }, []);
}
