'use client';

import { motion } from 'framer-motion';
import { Calendar, Eye, MapPin, Package, Star, Tag } from 'lucide-react';
import { CONDITION_CONFIG } from '../constants';

interface ItemInfoProps {
  item: {
    id: string;
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`p-6 space-y-6 ${className}`}
    >
      {/* Price and Title */}
      <div className="space-y-3">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-[#006666]"
        >
          {formatPrice(item.price)} DH
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl font-bold text-gray-900 leading-tight"
        >
          {item.title}
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
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
        </motion.div>
      </div>

      {/* Condition Badge */}
      {conditionConfig && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="inline-flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium"
          style={{ 
            backgroundColor: conditionConfig.bgColor,
            color: conditionConfig.color 
          }}
        >
          <span>{conditionConfig.icon}</span>
          <span>{item.condition}</span>
          <span className="text-xs opacity-75">• {conditionConfig.description}</span>
        </motion.div>
      )}

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-2"
        >
          <h3 className="text-sm font-semibold text-gray-700">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Specifications */}
      {item.specifications && Object.keys(item.specifications).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
            <Package size={18} />
            <span>Specifications</span>
          </h3>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            {Object.entries(item.specifications).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="flex justify-between items-center py-1"
              >
                <span className="text-gray-600 text-sm font-medium">{key}</span>
                <span className="text-gray-900 text-sm">{value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="space-y-3"
      >
        <h3 className="font-semibold text-gray-900">Description</h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {item.description}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="flex items-center space-x-6 pt-4 border-t border-gray-100"
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
      </motion.div>
    </motion.div>
  );
}
