'use client';

import { ShoppingBag, Car } from 'lucide-react';

type MarketplaceMode = 'products' | 'services';

interface ModeToggleProps {
  mode: MarketplaceMode;
  onChange: (mode: MarketplaceMode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="md:hidden bg-white">
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

export type { MarketplaceMode };
