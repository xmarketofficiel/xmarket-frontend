'use client';

import type { Service } from '@/lib/api/services';
import { getHoursUntilDeparture, getUrgencyBadge, formatTimeLeft } from '@/lib/serviceUtils';
import { Clock, MapPin, Star, Zap, Timer } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [mounted, setMounted] = useState(false);
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
    <div className="group rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1 relative h-64">
      {/* Background Image with Blur */}
      {service.imageUrl && (
        <div className="absolute inset-0">
          <Image
            src={service.imageUrl}
            alt={service.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          <div className="absolute inset-0 backdrop-blur-md bg-white/70" />
        </div>
      )}
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-4">
        {/* Badges */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex flex-col gap-2">
            {service.featured && (
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg inline-block">
                ⭐ Featured
              </div>
            )}
            
            {/* Urgency badge for time-based services */}
            {urgencyInfo && (
              <div className={`${urgencyColorClasses[urgencyInfo.color as keyof typeof urgencyColorClasses]} text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse inline-block`}>
                <Timer className="w-3 h-3" />
                {timeLeft} left
              </div>
            )}
            
            {/* Available Now badge for ongoing services */}
            {!isTimeBased && service.availability === 'instant' && (
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 inline-block">
                <Zap className="w-3 h-3" />
                Available Now
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="font-bold text-gray-900 text-base line-clamp-2 mb-2 group-hover:text-purple-600 transition-colors drop-shadow-sm">
            {service.title}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-gray-900">{service.averageRating || 0}</span>
              <span className="text-xs text-gray-600">({service.totalReviews || 0})</span>
            </div>
            
            {service.duration && (
              <div className="flex items-center gap-1 text-xs text-gray-700 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                <Clock className="w-3.5 h-3.5" />
                <span>{service.duration}</span>
              </div>
            )}
          </div>
          
          <div className="text-2xl font-bold text-purple-600 mb-3 drop-shadow-sm">
            From {service.priceFrom} <span className="text-sm font-normal text-gray-700">DH</span>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-700 pt-3 border-t border-gray-300/50">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="font-medium">{service.location || 'UM6P'}</span>
            </div>
            <div className="font-semibold text-gray-900">{service.user?.fullName || 'Service Provider'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
