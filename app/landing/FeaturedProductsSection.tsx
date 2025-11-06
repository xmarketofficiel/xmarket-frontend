'use client';

import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { api } from '../../lib/apiEndpoints';

interface FeaturedProduct {
  id: number;
  title: string;
  price: number; // Always number after normalization
  imageUrl: string;
  category: string;
}

interface RawFeaturedProduct {
  id: number;
  title: string;
  price: number | string; // Can be string from database
  imageUrl: string;
  category: string;
}

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.featuredProducts.getFeaturedProducts(6);
      if (Array.isArray(response.data)) {
        // Convert price to number if it's a string
        const normalizedProducts: FeaturedProduct[] = response.data.map((product: RawFeaturedProduct) => ({
          ...product,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price
        }));
        setProducts(normalizedProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4">
              Featured Products
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Loading amazing deals from our community...
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#009F9C]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Section Title and Description */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4">
            Featured Products
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover amazing deals from verified students in your community
          </p>
        </div>

        {/* Products Grid with fade effect */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="group relative"
              >
                {/* Non-clickable card with blur effect */}
                <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-not-allowed">
                  {/* Image */}
                  <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                    
                    {/* Category badge */}
                    {product.category && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-[#009F9C] text-white text-xs font-semibold rounded-full">
                        {product.category}
                      </div>
                    )}

                    {/* Blur overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="text-white text-center px-4">
                        <p className="font-semibold mb-1">Sign up to view</p>
                        <p className="text-xs">Join to unlock all products</p>
                      </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-[#009F9C] transition-colors">
                    {product.title}
                  </h3>
                  
                  <div className="text-2xl font-bold text-[#009F9C]">
                    {product.price.toFixed(2)} DH
                  </div>
                </div>

                {/* Lock icon overlay */}
                <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Fade effect overlay for last products */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
      </div>

      {/* CTA to sign up */}
      <div className="text-center mt-12">
        <button
          onClick={() => window.location.href = '/login'}
          className="px-8 py-4 bg-gradient-to-r from-[#009F9C] to-[#007B78] text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          See More
        </button>
      </div>
    </div>
  </section>
);
}
