'use client';

import { Package, Car } from 'lucide-react';

interface TypeSelectionScreenProps {
  onSelectProduct: () => void;
  onSelectService: () => void;
}

export default function TypeSelectionScreen({ 
  onSelectProduct, 
  onSelectService 
}: TypeSelectionScreenProps) {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-teal-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Option */}
          <button
            onClick={onSelectProduct}
            className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent"
            style={{ '--hover-border': 'rgb(0, 159, 159)' } as React.CSSProperties}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgb(0, 159, 159)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-50" style={{ background: 'linear-gradient(to bottom right, rgba(0, 159, 159, 0.2), rgba(0, 159, 159, 0.1))' }} />
            
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg" style={{ background: 'linear-gradient(to bottom right, rgb(0, 159, 159), rgb(0, 139, 139))' }}>
                <Package className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Sell a Product
              </h2>
              
              <p className="text-gray-600 mb-6">
                List physical items like electronics, books, furniture, clothing, and more for sale
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'rgba(0, 159, 159, 0.15)', color: 'rgb(0, 139, 139)' }}>
                  Electronics
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'rgba(0, 159, 159, 0.15)', color: 'rgb(0, 139, 139)' }}>
                  Books
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'rgba(0, 159, 159, 0.15)', color: 'rgb(0, 139, 139)' }}>
                  Furniture
                </span>
              </div>
            </div>
          </button>

          {/* Service Option */}
          <button
            onClick={onSelectService}
            className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent"
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgb(0, 159, 159)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-50" style={{ background: 'linear-gradient(to bottom right, rgba(0, 159, 159, 0.2), rgba(0, 159, 159, 0.1))' }} />
            
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg" style={{ background: 'linear-gradient(to bottom right, rgb(0, 159, 159), rgb(0, 139, 139))' }}>
                <Car className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Offer a Service
              </h2>
              
              <p className="text-gray-600 mb-6">
                Provide services like carpooling, laundry, tutoring, delivery, and more to the community
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'rgba(0, 159, 159, 0.15)', color: 'rgb(0, 139, 139)' }}>
                  Carpooling
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'rgba(0, 159, 159, 0.15)', color: 'rgb(0, 139, 139)' }}>
                  Laundry
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'rgba(0, 159, 159, 0.15)', color: 'rgb(0, 139, 139)' }}>
                  Taxi
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
