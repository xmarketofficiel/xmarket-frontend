'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Star, MapPin, Clock, Timer, Zap, MessageCircle, ArrowRight } from 'lucide-react';
import { Service } from '@/lib/api/services';
import { getHoursUntilDeparture, getUrgencyBadge, formatTimeLeft } from '@/lib/serviceUtils';

interface ServiceDetailModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  categoryBackgroundImage?: string;
}

const urgencyColorClasses = {
  red: 'bg-gradient-to-r from-red-500 to-red-600',
  orange: 'bg-gradient-to-r from-orange-500 to-amber-500',
  yellow: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
  green: 'bg-gradient-to-r from-green-500 to-emerald-500',
};

/**
 * Transform backend image URL to use the frontend proxy
 * Matches the logic used in ServiceCard for consistency
 */
function getProxiedImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  
  // Handle relative paths starting with /images/
  if (url.startsWith('/images/')) {
    return `/api${url}`;
  }
  
  // Handle localhost/development URLs - extract /images/ path
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    const match = url.match(/\/images\/.+$/);
    if (match) {
      return `/api${match[0]}`;
    }
  }
  
  // Return full URLs (CDN, etc.) as-is
  return url;
}

export default function ServiceDetailModal({ 
  service, 
  isOpen, 
  onClose,
  categoryBackgroundImage 
}: ServiceDetailModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Small delay to trigger animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isVisible || !service) return null;

  const isTimeBased = service.type === 'time-based';
  
  // Use service's own image first, fallback to category background
  const serviceImageUrl = getProxiedImageUrl(service.imageUrl) || getProxiedImageUrl(categoryBackgroundImage);
  
  // Get seller profile photo URL - uses same proxy pattern as SellerCard
  const getSellerPhotoUrl = () => {
    const photoUrl = service.user?.profileImageUrl || service.user?.profilePicture;
    if (!photoUrl) return null;
    
    // Handle localhost/development URLs - extract path after domain
    if (photoUrl.includes('localhost') || photoUrl.includes('127.0.0.1')) {
      // For profile images, extract /profile/... path
      const profileMatch = photoUrl.match(/\/profile\/.+$/);
      if (profileMatch) {
        return photoUrl; // CDN URLs work directly
      }
    }
    
    // Full CDN URLs work as-is
    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      return photoUrl;
    }
    
    // Relative paths - prepend API base
    if (photoUrl.startsWith('/')) {
      return photoUrl;
    }
    
    return photoUrl;
  };
  
  const sellerPhotoUrl = getSellerPhotoUrl();
  
  // Compute urgency info for time-based services
  let urgencyInfo: { color: string; label: string; icon: string } | null = null;
  let timeLeft: string | null = null;
  
  if (isTimeBased && service.departureTime) {
    const departureDate = new Date(service.departureTime);
    const hours = getHoursUntilDeparture(departureDate);
    timeLeft = formatTimeLeft(departureDate);
    urgencyInfo = getUrgencyBadge(hours);
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isAnimating ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-out ${
          isAnimating 
            ? 'scale-100 opacity-100' 
            : 'scale-75 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Service Image */}
        <div className="relative h-48 overflow-hidden">
          {serviceImageUrl ? (
            <>
              <Image
                src={serviceImageUrl}
                alt={service.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 512px"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-600" />
          )}
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {service.featured && (
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                ⭐ Featured
              </div>
            )}
            
            {urgencyInfo && (
              <div className={`${urgencyColorClasses[urgencyInfo.color as keyof typeof urgencyColorClasses]} text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-pulse`}>
                <Timer className="w-3 h-3" />
                {timeLeft} left
              </div>
            )}
            
            {!isTimeBased && service.availability === 'instant' && (
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Available Now
              </div>
            )}
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h2 
              className="font-black text-white text-2xl drop-shadow-lg"
              style={{ fontFamily: 'HelveticaNow, Helvetica, Roboto Condensed, Arial, sans-serif' }}
            >
              {service.title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Price and Rating Row */}
          <div className="flex items-center justify-between mb-4">
            <div
              className="text-3xl font-bold"
              style={{
                color: 'rgb(0, 159, 159)',
                textShadow: '0 0 14px rgba(0, 159, 159, 0.4)'
              }}
            >
              {service.priceFrom} <span className="text-base font-normal text-gray-500">DH</span>
            </div>
            
            <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-lg">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-gray-900">{service.averageRating || 0}</span>
            </div>
          </div>

          {/* Info Row */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              {service.fromLocation && service.toLocation ? (
                <span className="flex items-center gap-1.5 font-medium">
                  <span>{service.fromLocation}</span>
                  <ArrowRight className="w-4 h-4 flex-shrink-0 text-teal-600" />
                  <span>{service.toLocation}</span>
                </span>
              ) : (
                <span>{service.location || 'UM6P'}</span>
              )}
            </div>
            {service.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{service.duration}</span>
              </div>
            )}
          </div>

          {/* Provider */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold overflow-hidden relative">
              {sellerPhotoUrl ? (
                <Image
                  src={sellerPhotoUrl}
                  alt={service.user?.fullName || 'Provider'}
                  fill
                  className="object-cover"
                  sizes="40px"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : null}
              <span className={sellerPhotoUrl ? 'opacity-0' : ''}>
                {(service.user?.fullName || 'P').charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{service.user?.fullName || 'Service Provider'}</p>
              <p className="text-xs text-gray-500">Service Provider</p>
            </div>
          </div>

          {/* Description */}
          {service.description && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          )}

          {/* Contact Button */}
          <button
            className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Contact Seller
          </button>
        </div>
      </div>
    </div>
  );
}
