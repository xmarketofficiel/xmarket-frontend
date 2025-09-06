'use client';

import { useEffect, useState } from 'react';

export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  cls?: number; // Cumulative Layout Shift
  fid?: number; // First Input Delay
  ttfb?: number; // Time to First Byte
  loadTime?: number;
  domContentLoaded?: number;
}

export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if Performance Observer is supported
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      console.warn('Performance Observer not supported');
      return;
    }

    setIsSupported(true);

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
            }
            break;
            
          case 'largest-contentful-paint':
            setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
            break;
            
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              setMetrics(prev => ({ 
                ...prev, 
                cls: (prev.cls || 0) + (entry as any).value 
              }));
            }
            break;
            
          case 'first-input':
            setMetrics(prev => ({ 
              ...prev, 
              fid: (entry as any).processingStart - entry.startTime 
            }));
            break;
        }
      });
    });

    try {
      // Observe paint events
      observer.observe({ entryTypes: ['paint'] });
      
      // Observe LCP
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Observe CLS
      observer.observe({ entryTypes: ['layout-shift'] });
      
      // Observe FID
      observer.observe({ entryTypes: ['first-input'] });
    } catch (error) {
      console.warn('Some performance metrics not available:', error);
    }

    // Get navigation timing
    const updateNavigationMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        setMetrics(prev => ({
          ...prev,
          ttfb: navigation.responseStart - navigation.requestStart,
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        }));
      }
    };

    // Update immediately if available
    if (document.readyState === 'complete') {
      updateNavigationMetrics();
    } else {
      window.addEventListener('load', updateNavigationMetrics);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('load', updateNavigationMetrics);
    };
  }, []);

  const reportMetrics = () => {
    if (Object.keys(metrics).length === 0) {
      console.log('No performance metrics available yet');
      return;
    }

    console.group('🚀 Performance Metrics');
    console.table({
      'First Contentful Paint (FCP)': metrics.fcp ? `${Math.round(metrics.fcp)}ms` : 'N/A',
      'Largest Contentful Paint (LCP)': metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'N/A',
      'Cumulative Layout Shift (CLS)': metrics.cls ? metrics.cls.toFixed(3) : 'N/A',
      'First Input Delay (FID)': metrics.fid ? `${Math.round(metrics.fid)}ms` : 'N/A',
      'Time to First Byte (TTFB)': metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : 'N/A',
      'Load Time': metrics.loadTime ? `${Math.round(metrics.loadTime)}ms` : 'N/A',
      'DOM Content Loaded': metrics.domContentLoaded ? `${Math.round(metrics.domContentLoaded)}ms` : 'N/A',
    });
    console.groupEnd();

    // Performance assessment
    const assessment = [];
    if (metrics.fcp && metrics.fcp > 1800) assessment.push('⚠️ FCP could be improved');
    if (metrics.lcp && metrics.lcp > 2500) assessment.push('⚠️ LCP needs optimization');
    if (metrics.cls && metrics.cls > 0.1) assessment.push('⚠️ CLS needs attention');
    if (metrics.fid && metrics.fid > 100) assessment.push('⚠️ FID could be better');

    if (assessment.length === 0) {
      console.log('✅ All Core Web Vitals are performing well!');
    } else {
      console.warn('Performance recommendations:', assessment.join(', '));
    }
  };

  const getCoreWebVitalsScore = () => {
    const scores = {
      fcp: metrics.fcp ? (metrics.fcp <= 1800 ? 'good' : metrics.fcp <= 3000 ? 'needs-improvement' : 'poor') : 'unknown',
      lcp: metrics.lcp ? (metrics.lcp <= 2500 ? 'good' : metrics.lcp <= 4000 ? 'needs-improvement' : 'poor') : 'unknown',
      cls: metrics.cls ? (metrics.cls <= 0.1 ? 'good' : metrics.cls <= 0.25 ? 'needs-improvement' : 'poor') : 'unknown',
      fid: metrics.fid ? (metrics.fid <= 100 ? 'good' : metrics.fid <= 300 ? 'needs-improvement' : 'poor') : 'unknown',
    };

    return scores;
  };

  return {
    metrics,
    isSupported,
    reportMetrics,
    getCoreWebVitalsScore,
  };
};
