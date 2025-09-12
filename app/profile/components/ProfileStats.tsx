'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package,
  TrendingUp,
  ShoppingBag,
  Heart,
  DollarSign,
  Eye,
  Clock,
  BarChart3
} from 'lucide-react';
import { PROFILE_CONSTANTS } from './constants';
import type { ProfileStatsProps } from './types';

const ProfileStats: React.FC<ProfileStatsProps> = ({
  stats,
  loading = false,
  compact = false
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      Package,
      TrendingUp,
      ShoppingBag,
      Heart,
      DollarSign,
      Eye,
      Clock,
      BarChart3
    };
    return icons[iconName] || Package;
  };

  if (loading) {
    return (
      <div className={`grid ${compact ? 'grid-cols-2 gap-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'}`}>
        {Array.from({ length: compact ? 4 : 8 }).map((_, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl p-${compact ? '4' : '6'} shadow-lg`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-${compact ? '10' : '12'} h-${compact ? '10' : '12'} bg-gray-200 rounded-xl animate-pulse`} />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded w-16 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const primaryStats = [
    {
      id: 'listings',
      label: 'Active Listings',
      value: stats.activeListingsCount,
      icon: 'Package',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      id: 'sold',
      label: 'Items Sold',
      value: stats.soldItemsCount,
      icon: 'TrendingUp',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      id: 'purchased',
      label: 'Items Purchased',
      value: stats.purchaseHistoryCount,
      icon: 'ShoppingBag',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      id: 'saved',
      label: 'Saved Items',
      value: stats.savedItemsCount,
      icon: 'Heart',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600'
    }
  ];

  const secondaryStats = [
    {
      id: 'earnings',
      label: 'Total Earnings',
      value: formatCurrency(stats.totalEarnings || 0),
      icon: 'DollarSign',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      id: 'views',
      label: 'Profile Views',
      value: stats.profileViews || 0,
      icon: 'Eye',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },
    {
      id: 'response',
      label: 'Response Time',
      value: `${stats.responseTime || 0}h`,
      icon: 'Clock',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      id: 'conversion',
      label: 'Conversion Rate',
      value: `${(stats.conversionRate || 0).toFixed(1)}%`,
      icon: 'BarChart3',
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600'
    }
  ];

  const statsToShow = compact ? primaryStats : [...primaryStats, ...secondaryStats];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: PROFILE_CONSTANTS.ANIMATION_DELAYS.STATS }}
      className={`grid ${
        compact 
          ? 'grid-cols-2 gap-3' 
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
      }`}
    >
      {statsToShow.map((stat, index) => {
        const IconComponent = getIconComponent(stat.icon);
        
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: PROFILE_CONSTANTS.ANIMATION_DELAYS.STATS + (index * 0.05),
              type: 'spring',
              stiffness: 200 
            }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            className={`bg-white rounded-2xl p-${compact ? '4' : '6'} shadow-lg hover:shadow-xl transition-all cursor-pointer group`}
          >
            <div className="flex items-center gap-3">
              <div className={`
                w-${compact ? '10' : '12'} 
                h-${compact ? '10' : '12'} 
                ${stat.bgColor} 
                rounded-xl 
                flex 
                items-center 
                justify-center 
                group-hover:scale-110 
                transition-transform
              `}>
                <IconComponent className={`w-${compact ? '5' : '6'} h-${compact ? '5' : '6'} ${stat.iconColor}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`text-${compact ? 'xs' : 'sm'} font-medium text-gray-600 truncate`}>
                  {stat.label}
                </p>
                <p className={`text-${compact ? 'lg' : '2xl'} font-bold text-gray-900 mt-1`}>
                  {typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}
                </p>
              </div>
            </div>

            {!compact && (
              <div className="mt-4">
                <div className={`h-2 bg-gradient-to-r ${stat.color} rounded-full opacity-20`} />
                <div 
                  className={`h-2 bg-gradient-to-r ${stat.color} rounded-full -mt-2 transition-all duration-300 group-hover:opacity-100`}
                  style={{ 
                    width: `${Math.min(100, Math.max(10, (typeof stat.value === 'number' ? stat.value : 50) / 10))}%` 
                  }}
                />
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ProfileStats;
