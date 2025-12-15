'use client';

import { ShoppingBag, Zap } from 'lucide-react';

type MarketplaceMode = 'products' | 'services';

interface ModeToggleProps {
  mode: MarketplaceMode;
  onChange: (mode: MarketplaceMode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="md:hidden bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="px-4 py-4">
        <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
          <button
            onClick={() => onChange('products')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold
              transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
              ${mode === 'products'
                ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            <ShoppingBag className={`w-5 h-5 ${mode === 'products' ? 'animate-pulse' : ''}`} />
            <span className="text-base">Products</span>
          </button>
          
          <button
            onClick={() => onChange('services')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold
              transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
              ${mode === 'services'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            <Zap className={`w-5 h-5 ${mode === 'services' ? 'animate-pulse' : ''}`} />
            <span className="text-base">Services</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export type { MarketplaceMode };
