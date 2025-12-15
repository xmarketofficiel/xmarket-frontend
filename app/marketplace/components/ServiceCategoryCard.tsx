'use client';

import { memo, useMemo } from 'react';
import { ChevronRight, Timer } from 'lucide-react';
import Image from 'next/image';

interface ServiceCategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: string;
    backgroundImage?: string;
    urgencyBadge?: {
      icon: string;
      label: string;
      color: string;
    };
  };
  serviceCount: number;
  onClick: () => void;
}

/**
 * Transform backend image URL to use the frontend proxy
 * This ensures images work from any device, not just localhost
 */
function getProxiedImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  
  // If it's a relative path starting with /images/, proxy through /api/images/
  if (url.startsWith('/images/')) {
    return `/api${url}`;
  }
  
  // If it contains localhost or backend URL, extract the path and proxy it
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    const match = url.match(/\/images\/.+$/);
    if (match) {
      return `/api${match[0]}`;
    }
  }
  
  // Return as-is for external URLs (e.g., Cloudinary)
  return url;
}

const ServiceCategoryCard = memo(function ServiceCategoryCard({ category, serviceCount, onClick }: ServiceCategoryCardProps) {
  // Transform the background image URL to use the proxy
  const backgroundImageUrl = useMemo(
    () => getProxiedImageUrl(category.backgroundImage),
    [category.backgroundImage]
  );
  const urgencyColorClasses = {
    red: 'bg-gradient-to-r from-red-500 to-red-600',
    orange: 'bg-gradient-to-r from-orange-500 to-orange-600',
    yellow: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    green: 'bg-gradient-to-r from-green-500 to-green-600',
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
  };

  return (
    <button
      onClick={onClick}
      className="group rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 transform hover:-translate-y-1 hover:border-purple-300 text-left relative h-64"
      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
    >
      {/* Background Image with Overlay */}
      {backgroundImageUrl && (
        <div className="absolute inset-0">
          <Image
            src={backgroundImageUrl}
            alt={category.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            quality={75}
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" style={{ willChange: 'opacity' }} />
        </div>
      )}

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-6">
        <div>
          {/* Urgency Badge */}
          {category.urgencyBadge && (
            <div className={`absolute top-3 right-3 ${urgencyColorClasses[category.urgencyBadge.color as keyof typeof urgencyColorClasses]} text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse`}>
              <Timer className="w-3 h-3" />
              {category.urgencyBadge.label}
            </div>
          )}

          {/* Category Icon */}
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
            {category.icon}
          </div>
        </div>

        <div>
          {/* Category Name */}
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors drop-shadow-md">
            {category.name}
          </h3>

          {/* Service Count */}
          <p className="text-sm text-white/90 mb-4">
            {serviceCount} service{serviceCount !== 1 ? 's' : ''} available
          </p>

          {/* View Button */}
          <div className="flex items-center justify-between pt-3 border-t border-white/20">
            <span className="text-sm font-medium text-white group-hover:text-purple-300">
              View Services
            </span>
            <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </button>
  );
});

export { ServiceCategoryCard };
