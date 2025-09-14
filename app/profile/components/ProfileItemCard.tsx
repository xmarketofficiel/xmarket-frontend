'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Edit,
  Trash2,
  Eye,
  Heart,
  HeartOff,
  Clock,
  MapPin,
  Tag,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { getSafeImageUrl } from '../../../utils/imageUtils';
import { PROFILE_CONSTANTS } from './constants';
import type { ProfileItemCardProps } from './types';

const ProfileItemCard: React.FC<ProfileItemCardProps> = ({
  item,
  onClick,
  onAction,
  showActions = true,
  compact = false
}) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getStatusBadge = () => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      sold: { color: 'bg-blue-100 text-blue-800', label: 'Sold' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      expired: { color: 'bg-red-100 text-red-800', label: 'Expired' }
    };

    const config = statusConfig[item.status] || statusConfig.active;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    onAction?.(action, item);
  };

  const handleItemClick = () => {
    onClick?.(item);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      onClick={handleItemClick}
      className={`
        bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 
        cursor-pointer group overflow-hidden
        ${compact ? 'p-3' : 'p-4'}
      `}
    >
      {/* Image Section */}
      <div className={`relative ${compact ? 'h-32' : 'h-48'} bg-gray-100 rounded-lg overflow-hidden mb-3`}>
        {item.images && item.images.length > 0 ? (
          <img
            src={getSafeImageUrl(item.images[0].imageUrl || item.images[0].cloudinaryUrl || item.images[0].spacesUrl)}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = PROFILE_CONSTANTS.IMAGE_SETTINGS.PLACEHOLDER_ITEM;
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <Tag className="w-8 h-8 text-gray-400" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          {getStatusBadge()}
        </div>

        {/* Featured Badge */}
        {item.featured && (
          <div className="absolute top-2 right-2">
            <div className="bg-yellow-500 text-white px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Featured
            </div>
          </div>
        )}

        {/* Stats Overlay */}
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          {item.viewsCount !== undefined && (
            <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 text-xs rounded-full flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {item.viewsCount}
            </div>
          )}
          {item.savesCount !== undefined && item.savesCount > 0 && (
            <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 text-xs rounded-full flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {item.savesCount}
            </div>
          )}
        </div>

        {/* Action Buttons Overlay */}
        {showActions && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleAction(e, 'edit')}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              title="Edit item"
            >
              <Edit className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleAction(e, 'delete')}
              className="w-10 h-10 bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
              title="Delete item"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`font-semibold text-gray-900 line-clamp-2 group-hover:text-[#009F9C] transition-colors ${compact ? 'text-sm' : 'text-base'}`}>
            {item.title}
          </h3>
          <div className={`text-right flex-shrink-0 ${compact ? 'text-sm' : 'text-base'}`}>
            <p className="font-bold text-[#009F9C]">
              {formatPrice(item.price)}
            </p>
            {item.negotiable && (
              <p className="text-xs text-gray-500">Negotiable</p>
            )}
          </div>
        </div>

        {!compact && item.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Item Details */}
        <div className={`flex items-center justify-between text-xs text-gray-500 ${compact ? 'gap-2' : 'gap-4'}`}>
          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span className="truncate">{item.category}</span>
          </div>
          
          {item.condition && (
            <div className="flex items-center gap-1">
              <span className="truncate">{item.condition}</span>
            </div>
          )}
        </div>

        {item.location && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{item.location}</span>
          </div>
        )}

        {/* Date and Additional Info */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(item.createdAt)}</span>
          </div>
          
          {item.interestedBuyers !== undefined && item.interestedBuyers > 0 && (
            <div className="flex items-center gap-1 text-[#009F9C]">
              <Clock className="w-3 h-3" />
              <span>{item.interestedBuyers} interested</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileItemCard;
