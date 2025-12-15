'use client';

import { Package, Briefcase } from 'lucide-react';

interface TypeSelectionScreenProps {
  onSelectProduct: () => void;
  onSelectService: () => void;
}

export default function TypeSelectionScreen({ 
  onSelectProduct, 
  onSelectService 
}: TypeSelectionScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            What would you like to add?
          </h1>
          <p className="text-lg text-gray-600">
            Choose whether you want to sell a product or offer a service
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Option */}
          <button
            onClick={onSelectProduct}
            className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-500"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-purple-50 rounded-bl-full opacity-50" />
            
            <div className="relative z-10">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Package className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Sell a Product
              </h2>
              
              <p className="text-gray-600 mb-6">
                List physical items like electronics, books, furniture, clothing, and more for sale
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Electronics
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Books
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Furniture
                </span>
              </div>
            </div>
          </button>

          {/* Service Option */}
          <button
            onClick={onSelectService}
            className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-500"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-50 rounded-bl-full opacity-50" />
            
            <div className="relative z-10">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Offer a Service
              </h2>
              
              <p className="text-gray-600 mb-6">
                Provide services like carpooling, laundry, tutoring, delivery, and more to the community
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Carpooling
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Laundry
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
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
