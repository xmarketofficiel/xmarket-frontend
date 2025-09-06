'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { usePerformanceMonitoring, PerformanceMetrics } from '../hooks/usePerformanceMonitoring';

interface PerformanceContextType {
  metrics: PerformanceMetrics;
  reportMetrics: () => void;
  getCoreWebVitalsScore: () => Record<string, string>;
  isSupported: boolean;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const performanceData = usePerformanceMonitoring();

  // Auto-report metrics in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && performanceData.isSupported) {
      const timer = setTimeout(() => {
        performanceData.reportMetrics();
      }, 3000); // Report after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [performanceData]);

  // Add performance data to window for debugging
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      (window as any).__XMARKET_PERFORMANCE__ = {
        metrics: performanceData.metrics,
        report: performanceData.reportMetrics,
        scores: performanceData.getCoreWebVitalsScore,
      };
    }
  }, [performanceData]);

  return (
    <PerformanceContext.Provider value={performanceData}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = (): PerformanceContextType => {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

// Development-only component for performance debugging
export const PerformanceDebugger: React.FC = () => {
  const { metrics, getCoreWebVitalsScore, reportMetrics } = usePerformance();
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const scores = getCoreWebVitalsScore();

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-gray-700">Performance</h3>
        <button
          onClick={reportMetrics}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Report
        </button>
      </div>
      
      <div className="space-y-1">
        {Object.entries(scores).map(([metric, score]) => (
          <div key={metric} className="flex justify-between items-center">
            <span className="text-xs text-gray-600 uppercase">{metric}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${getScoreColor(score)}`}>
              {score}
            </span>
          </div>
        ))}
      </div>
      
      {metrics.fcp && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            FCP: {Math.round(metrics.fcp)}ms
            {metrics.lcp && ` | LCP: ${Math.round(metrics.lcp)}ms`}
          </div>
        </div>
      )}
    </div>
  );
};
