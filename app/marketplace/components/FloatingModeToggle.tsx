'use client';

import { ShoppingBag, Car } from 'lucide-react';
import { useEffect, useState } from 'react';

type MarketplaceMode = 'products' | 'services';

interface FloatingModeToggleProps {
  mode: MarketplaceMode;
  onChange: (mode: MarketplaceMode) => void;
  /** Ref to the original ModeToggle element to detect when it's scrolled out of view */
  triggerRef: React.RefObject<HTMLDivElement>;
  /** Force hide the toggle (used during mode changes to prevent lag) */
  forceHide?: boolean;
}

/**
 * FloatingModeToggle - A fixed header that slides down when the original toggle is scrolled out of view
 * 
 * This is completely isolated from the original ModeToggle component.
 * It uses IntersectionObserver to detect when to show/hide.
 */
export function FloatingModeToggle({ mode, onChange, triggerRef, forceHide = false }: FloatingModeToggleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // Handle force hide for smooth transition during mode changes
  useEffect(() => {
    if (forceHide && isVisible) {
      // Trigger fade-out animation
      setIsAnimatingOut(true);
      // Hide completely after animation
      const timeout = setTimeout(() => {
        setIsVisible(false);
        setIsAnimatingOut(false);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [forceHide, isVisible]);

  useEffect(() => {
    const triggerElement = triggerRef.current;
    if (!triggerElement) return;

    // Create IntersectionObserver to detect when original toggle leaves viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show floating toggle when original is NOT visible (scrolled past)
        // But not if we're in force hide mode
        if (!forceHide) {
          setIsVisible(!entry.isIntersecting);
          setIsAnimatingOut(false);
        }
      },
      {
        // Trigger when the element is completely out of the viewport
        threshold: 0,
        rootMargin: '0px',
      }
    );

    observer.observe(triggerElement);

    return () => {
      observer.disconnect();
    };
  }, [triggerRef, forceHide]);

  // Don't render at all when not visible to avoid any visual artifacts
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-md"
      style={{
        animation: isAnimatingOut ? 'slideUp 200ms ease-in forwards' : 'slideDown 250ms ease-out forwards',
      }}
    >
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(-100%); opacity: 0; }
        }
      `}</style>
      <div className="px-4 py-3">
        <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
          <button
            onClick={() => onChange('products')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold
              transition-colors duration-200
              ${mode === 'products'
                ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-sm">Products</span>
          </button>
          
          <button
            onClick={() => onChange('services')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold
              transition-colors duration-200
              ${mode === 'services'
                ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            <Car className="w-5 h-5" />
            <span className="text-sm">Services</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default FloatingModeToggle;
