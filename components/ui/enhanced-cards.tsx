'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { ChevronRight, MoreVertical, Heart, Share2, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ANIMATION_SYSTEM, COLOR_SYSTEM, SPACING_SYSTEM } from '@/lib/design-system';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

// Base Card Component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated' | 'ghost' | 'gradient';
  interactive?: boolean;
  hover?: boolean;
  loading?: boolean;
  asChild?: boolean;
}

const cardVariants = {
  default: 'bg-card text-card-foreground border shadow-sm',
  outlined: 'bg-card text-card-foreground border-2 border-border',
  elevated: 'bg-card text-card-foreground border shadow-lg',
  ghost: 'bg-transparent text-card-foreground',
  gradient: 'bg-gradient-to-br from-white to-gray-50 text-card-foreground border shadow-sm'
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default',
    interactive = false,
    hover = true,
    loading = false,
    asChild = false,
    children,
    ...props 
  }, ref) => {
    const motionProps: HTMLMotionProps<'div'> = interactive ? {
      whileHover: hover ? { 
        y: -2,
        scale: 1.02,
        transition: { 
          duration: ANIMATION_SYSTEM.duration.fast / 1000,
          ease: ANIMATION_SYSTEM.framerEasing.easeOut 
        }
      } : {},
      whileTap: { 
        scale: 0.98,
        transition: { 
          duration: ANIMATION_SYSTEM.duration.fast / 1000,
          ease: ANIMATION_SYSTEM.framerEasing.easeOut 
        }
      },
      animate: {
        transition: {
          duration: ANIMATION_SYSTEM.duration.normal / 1000,
          ease: ANIMATION_SYSTEM.framerEasing.easeOut
        }
      }
    } : {};

    if (loading) {
      return (
        <div 
          ref={ref}
          className={cn(
            'rounded-lg p-6 animate-pulse',
            cardVariants[variant],
            className
          )}
          {...props}
        >
          <div className="space-y-4">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-20 bg-gray-300 rounded"></div>
          </div>
        </div>
      );
    }

    if (interactive) {
      return (
        <motion.div
          ref={ref}
          className={cn(
            'rounded-lg transition-all cursor-pointer',
            cardVariants[variant],
            hover && 'hover:shadow-md',
            className
          )}
          {...(motionProps as any)}
          {...(props as any)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg',
          cardVariants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

// Card Header
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  action?: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, action, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col space-y-1.5 p-6',
        action && 'flex-row items-start justify-between space-y-0',
        className
      )}
      {...props}
    >
      <div className="flex-1">
        {children}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  )
);
CardHeader.displayName = 'CardHeader';

// Card Title
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

// Card Description
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

// Card Content
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

// Card Footer
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// Enhanced Product Card
interface ProductCardProps {
  title: string;
  description?: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  imageUrl: string;
  imageAlt?: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  favorite?: boolean;
  onFavoriteClick?: () => void;
  onShareClick?: () => void;
  onCardClick?: () => void;
  className?: string;
  loading?: boolean;
}

export function ProductCard({
  title,
  description,
  price,
  originalPrice,
  discount,
  imageUrl,
  imageAlt,
  rating,
  reviewCount,
  badge,
  favorite = false,
  onFavoriteClick,
  onShareClick,
  onCardClick,
  className,
  loading = false
}: ProductCardProps) {
  if (loading) {
    return (
      <Card className={cn('overflow-hidden', className)} loading={true} />
    );
  }

  return (
    <Card 
      className={cn('overflow-hidden group', className)}
      interactive={!!onCardClick}
      onClick={onCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={imageAlt || title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        
        {/* Badge */}
        {badge && (
          <div className="absolute top-2 left-2">
            <span className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
              {badge}
            </span>
          </div>
        )}
        
        {/* Discount */}
        {discount && (
          <div className="absolute top-2 right-2">
            <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
              -{discount}
            </span>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onFavoriteClick && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="bg-white/90 hover:bg-white shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteClick();
              }}
            >
              <Heart 
                className={cn(
                  'h-4 w-4',
                  favorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                )}
              />
            </Button>
          )}
          
          {onShareClick && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="bg-white/90 hover:bg-white shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                onShareClick();
              }}
            >
              <Share2 className="h-4 w-4 text-gray-600" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Content */}
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm line-clamp-2">{title}</h3>
          
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
          
          {/* Rating */}
          {rating && (
            <div className="flex items-center space-x-1">
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-xs">
                    {i < rating ? '★' : '☆'}
                  </span>
                ))}
              </div>
              {reviewCount && (
                <span className="text-xs text-muted-foreground">
                  ({reviewCount})
                </span>
              )}
            </div>
          )}
          
          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm">{price}</span>
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {originalPrice}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Feature Card
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: {
    text: string;
    href: string;
  };
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  link,
  className
}: FeatureCardProps) {
  return (
    <Card 
      className={cn('p-6', className)}
      variant="elevated"
      interactive={!!link}
    >
      <div className="space-y-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        
        {link && (
          <div className="pt-2">
            <Button variant="ghost" size="sm" className="p-0 h-auto" asChild>
              <a href={link.href} className="flex items-center space-x-1">
                <span>{link.text}</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

// Stats Card
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  className
}: StatsCardProps) {
  return (
    <Card className={cn('p-6', className)} variant="elevated">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-end space-x-2">
            <span className="text-2xl font-bold">{value}</span>
            {trend && (
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        
        {icon && (
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

// Profile Card
interface ProfileCardProps {
  name: string;
  role?: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  stats?: Array<{
    label: string;
    value: string | number;
  }>;
  actions?: React.ReactNode;
  className?: string;
}

export function ProfileCard({
  name,
  role,
  bio,
  avatarUrl,
  coverUrl,
  stats = [],
  actions,
  className
}: ProfileCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)} variant="elevated">
      {/* Cover Image */}
      {coverUrl && (
        <div className="h-32 bg-gradient-to-r from-primary to-blue-600 relative">
          <img
            src={coverUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardContent className="relative p-6">
        {/* Avatar */}
        <div className={cn(
          'flex items-center space-x-4',
          coverUrl && '-mt-16 mb-4'
        )}>
          <div
            className={cn(
              'rounded-full border-4 border-white shadow-lg',
              coverUrl ? 'w-20 h-20' : 'w-16 h-16'
            )}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold text-lg">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          
          <div className={cn('space-y-1', coverUrl && 'mt-8')}>
            <h3 className="text-lg font-semibold">{name}</h3>
            {role && (
              <p className="text-sm text-muted-foreground">{role}</p>
            )}
          </div>
        </div>
        
        {/* Bio */}
        {bio && (
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {bio}
          </p>
        )}
        
        {/* Stats */}
        {stats.length > 0 && (
          <div className="grid grid-cols-3 gap-4 py-4 border-t border-b">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-semibold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
        
        {/* Actions */}
        {actions && (
          <div className="mt-4">
            {actions}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};