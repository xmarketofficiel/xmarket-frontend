'use client';

import type { Service } from '@/lib/api/services';
import { getHoursUntilDeparture, getUrgencyBadge, formatTimeLeft } from '@/lib/serviceUtils';
import { Clock, MapPin, Star, Zap, Timer, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, useMemo } from 'react';

/**
 * Transform backend image URL to use the frontend proxy
 */
function getProxiedImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  
  if (url.startsWith('/images/')) {
    return `/api${url}`;
  }
  
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    const match = url.match(/\/images\/.+$/);
    if (match) {
      return `/api${match[0]}`;
    }
  }
  
  return url;
}

interface ServiceCardProps {
  service: Service;
  categoryBackgroundImage?: string;
  onClick?: () => void;
}

export function ServiceCard({ service, categoryBackgroundImage, onClick }: ServiceCardProps) {
  const [mounted, setMounted] = useState(false);
  
  // Get category background image - use prop first, then fallback to service.serviceCategory
  const categoryBackgroundUrl = useMemo(
    () => getProxiedImageUrl(categoryBackgroundImage || service.serviceCategory?.backgroundImage),
    [categoryBackgroundImage, service.serviceCategory?.backgroundImage]
  );
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [urgencyInfo, setUrgencyInfo] = useState<{ color: string; label: string; icon: string } | null>(null);
  const isTimeBased = service.type === 'time-based';
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (mounted && isTimeBased && service.departureTime) {
      const updateTime = () => {
        const departureDate = new Date(service.departureTime!);
        const hours = getHoursUntilDeparture(departureDate);
        setTimeLeft(formatTimeLeft(departureDate));
        setUrgencyInfo(getUrgencyBadge(hours));
      };
      
      updateTime();
      const interval = setInterval(updateTime, 60000); // Update every minute
      
      return () => clearInterval(interval);
    }
  }, [mounted, isTimeBased, service.departureTime]);
  
  const urgencyColorClasses = {
    red: 'bg-gradient-to-r from-red-500 to-red-600',
    orange: 'bg-gradient-to-r from-orange-500 to-orange-600',
    yellow: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    green: 'bg-gradient-to-r from-green-500 to-green-600',
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
  };
  
  return (
    <>
      {/* Mobile Layout - Horizontal Card */}
      <div 
        className="md:hidden group rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 bg-white relative cursor-pointer"
        onClick={onClick}
      >
        {/* Urgency badge - Top Right Corner */}
        {urgencyInfo && (
          <div className={`absolute top-2 right-2 ${urgencyColorClasses[urgencyInfo.color as keyof typeof urgencyColorClasses]} text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-0.5 z-10`}>
            <Timer className="w-2.5 h-2.5" />
            {timeLeft}
          </div>
        )}
        
        {/* Available Now badge - Top Right Corner */}
        {!isTimeBased && service.availability === 'instant' && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-0.5 z-10">
            <Zap className="w-2.5 h-2.5" />
            Now
          </div>
        )}
        
        <div className="flex h-28">
          {/* Left: Category Background */}
          <div className="w-20 relative border-r border-gray-100 overflow-hidden">
            {/* Category Background Image */}
            {categoryBackgroundUrl ? (
              <>
                <Image
                  src={categoryBackgroundUrl}
                  alt={service.serviceCategory?.name || 'Category'}
                  fill
                  className="object-cover blur-sm scale-110"
                  sizes="80px"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/40" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white" />
            )}
          </div>
          
          {/* Right: Content */}
          <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
            <div>
              <h3 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-teal-600 transition-colors">
                {service.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5 text-[11px] text-gray-600">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  {service.fromLocation && service.toLocation ? (
                    <span className="flex items-center gap-1">
                      <span className="truncate">{service.fromLocation}</span>
                      <ArrowRight className="w-2.5 h-2.5 flex-shrink-0" />
                      <span className="truncate">{service.toLocation}</span>
                    </span>
                  ) : (
                    <span>{service.location || 'UM6P'}</span>
                  )}
                </div>
                <span className="text-gray-300">•</span>
                <span className="text-[12px] text-gray-600 truncate">{service.user?.fullName || 'Provider'}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="text-lg font-bold" style={{ color: 'rgb(0, 159, 159)' }}>
                {service.priceFrom} <span className="text-xs font-normal text-gray-500">DH</span>
              </div>
              <div className="flex items-center gap-2">
                {service.duration && (
                  <div className="flex items-center gap-0.5 text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{service.duration}</span>
                  </div>
                )}
                <div className="flex items-center gap-0.5 text-[10px] text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-gray-900">{service.averageRating || 0}</span>
                  <span className="text-gray-500">({service.totalReviews || 0})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Original Vertical Card */}
      <div 
        className="hidden md:block group rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1 relative h-64 cursor-pointer"
        onClick={onClick}
      >
        {/* Category Background Image (Blurred) */}
        {categoryBackgroundUrl && (
          <div className="absolute inset-0">
            <Image
              src={categoryBackgroundUrl}
              alt={service.serviceCategory?.name || 'Category'}
              fill
              className="object-cover blur-md scale-110"
              sizes="(max-width: 1024px) 50vw, 25vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-black/30" />
          </div>
        )}

        {/* Optional service image overlay (kept subtle so category background is visible) */}
        {service.imageUrl && (
          <div className="absolute inset-0">
            <Image
              src={service.imageUrl}
              alt={service.title}
              fill
              className="object-cover opacity-30"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-4">
          {/* Top section: Badges + Title */}
          <div>
            {/* Badges */}
            <div className="flex flex-col gap-2 mb-2">
              {service.featured && (
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg inline-block w-fit">
                  ⭐ Featured
                </div>
              )}
              
              {/* Urgency badge for time-based services */}
              {urgencyInfo && (
                <div className={`${urgencyColorClasses[urgencyInfo.color as keyof typeof urgencyColorClasses]} text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse w-fit`}>
                  <Timer className="w-3 h-3" />
                  {timeLeft} left
                </div>
              )}
              
              {/* Available Now badge for ongoing services */}
              {!isTimeBased && service.availability === 'instant' && (
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 w-fit">
                  <Zap className="w-3 h-3" />
                  Available Now
                </div>
              )}
            </div>
            
            {/* Title - directly below badges */}
            <h3 className="font-black text-white text-2xl line-clamp-2 group-hover:text-teal-300 transition-colors drop-shadow-lg" style={{ fontFamily: 'HelveticaNow, Helvetica, Roboto Condensed, Arial, sans-serif' }}>
              {service.title}
            </h3>
          </div>
          
          <div>
            
            <div className="flex items-center justify-between mb-3">
              <div
                className="text-2xl font-bold drop-shadow-sm"
                style={{
                  color: 'rgb(0, 159, 159)',
                  textShadow: '0 0 14px rgba(0, 159, 159, 0.65)'
                }}
              >
                {service.priceFrom} <span className="text-sm font-normal text-white/80">DH</span>
              </div>

              <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm mt-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-white">{service.averageRating || 0}</span>
              </div>
            </div>
            
            {service.duration && (
              <div className="flex items-center gap-1 text-xs text-white/80 bg-white/15 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm inline-flex mb-3">
                <Clock className="w-3.5 h-3.5" />
                <span>{service.duration}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs text-white/85 pt-3 border-t border-white/20">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                {service.fromLocation && service.toLocation ? (
                  <span className="flex items-center gap-1 font-medium text-white">
                    <span className="truncate">{service.fromLocation}</span>
                    <ArrowRight className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{service.toLocation}</span>
                  </span>
                ) : (
                  <span className="font-medium text-white">{service.location || 'UM6P'}</span>
                )}
              </div>
              <span className="font-semibold text-white">{service.user?.fullName || 'Service Provider'}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
