"use client";

import { useEffect } from 'react';
import { ApiError } from '../lib/api';

export default function GlobalError({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Only log unexpected errors, not authentication/user errors
    if (error instanceof ApiError) {
      // Don't spam console with expected errors like invalid credentials
      if (error.name === 'AuthenticationError' || error.name === 'ClientError') {
        // These are user errors, don't log them as app errors
        return;
      }
    }
    
    // Log unexpected errors for debugging
    console.error('Unhandled error in app:', error);
  }, [error]);

  // For API errors, don't show the error boundary, let components handle them
  if (error instanceof ApiError) {
    if (error.name === 'AuthenticationError' || error.name === 'ClientError') {
      // Redirect to login or let the component handle it
      reset();
      return null;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-xl w-full bg-white rounded-lg shadow p-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Something went wrong</h1>
        <p className="mt-3 text-gray-600">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        
        <div className="mt-6 space-y-3">
          <button
            onClick={reset}
            className="w-full py-2 px-4 bg-[#006666] text-white rounded-md hover:bg-[#005555] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006666]"
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006666]"
          >
            Go Home
          </button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left text-sm text-gray-500">
            <summary className="cursor-pointer">Error details (Development only)</summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded overflow-auto text-xs">
              {error?.message}
              {error?.stack && `\n\nStack trace:\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
