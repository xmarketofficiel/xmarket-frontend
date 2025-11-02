'use client';

import { Calendar, Eye, MapPin, Package, Star, Tag } from 'lucide-react';
import { CONDITION_CONFIG } from '../constants';

interface ItemInfoProps {
  item: {
    id: string | number;
    title: string;
    description: string;
    price: number | string;
    condition?: string;
    category: string | { icon: string; name: string };
    location?: string;
    createdAt: string;
    views?: number;
    interests?: number;
    tags?: string[];
    specifications?: Record<string, string>;
  };
  className?: string;
}

export default function ItemInfo({ item, className = '' }: ItemInfoProps) {
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US').format(numPrice);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryDisplay = () => {
    if (typeof item.category === 'object') {
      return `${item.category.icon} ${item.category.name}`;
    }
    return item.category;
  };

  const getConditionConfig = () => {
    if (!item.condition) return null;
    return CONDITION_CONFIG[item.condition as keyof typeof CONDITION_CONFIG];
  };

  const conditionConfig = getConditionConfig();

  return (
    <div 
      className={`p-6 pb-8 space-y-6 ${className}`}
    >
      {/* Title and Price - Facebook Marketplace style */}
      <div className="space-y-1.5">
        <h1 
          className="text-2xl font-bold text-gray-900 leading-tight"
        >
          {item.title}
        </h1>
        
        <div 
          className="text-xl font-bold text-[#006666]"
        >
          {formatPrice(item.price)} DH
        </div>
        
        <div 
          className="flex items-center space-x-4 text-sm text-gray-600"
        >
          <div className="flex items-center space-x-1">
            <Tag size={16} />
            <span>{getCategoryDisplay()}</span>
          </div>
          {item.location && (
            <div className="flex items-center space-x-1">
              <MapPin size={16} />
              <span>{item.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Condition Badge */}
      {conditionConfig && (
        <div
          className="inline-flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200"
          style={{ 
            backgroundColor: conditionConfig.bgColor,
            color: conditionConfig.color 
          }}
        >
          <span>{conditionConfig.icon}</span>
          <span>{item.condition}</span>
          <span className="text-xs opacity-75">• {conditionConfig.description}</span>
        </div>
      )}

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div
          className="space-y-2"
        >
          <h3 className="text-sm font-semibold text-gray-700">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag, index) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-xl text-sm hover:bg-gray-200 transition-colors duration-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Specifications */}
      {item.specifications && Object.keys(item.specifications).length > 0 && (
        <div
          className="space-y-3"
        >
          <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
            <Package size={18} />
            <span>Specifications</span>
          </h3>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            {Object.entries(item.specifications).map(([key, value], index) => (
              <div
                key={key}
                className="flex justify-between items-center py-1"
              >
                <span className="text-gray-600 text-sm font-medium">{key}</span>
                <span className="text-gray-900 text-sm">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div
        className="space-y-3"
      >
        <h3 className="font-semibold text-gray-900">Description</h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {item.description}
        </p>
      </div>

      {/* Stats */}
      <div
        className="flex items-center space-x-6 pt-4 pb-2 border-t border-gray-200"
      >
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar size={16} />
          <span>Posted {formatDate(item.createdAt)}</span>
        </div>
        
        {item.views !== undefined && (
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Eye size={16} />
            <span>{item.views} views</span>
          </div>
        )}
        
        {item.interests !== undefined && item.interests > 0 && (
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Star size={16} />
            <span>{item.interests} interested</span>
          </div>
        )}
      </div>
    </div>
  );
}
