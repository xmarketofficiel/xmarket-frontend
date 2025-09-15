'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Heart, 
  Plus, 
  MessageCircle, 
  User, 
  Menu,
  X,
  Search,
  Bell,
  Settings,
  ChevronRight,
  LogOut,
  ShoppingBag,
  Star,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { COLOR_SYSTEM, ANIMATION_SYSTEM, SPACING_SYSTEM } from '@/lib/design-system';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from './button';
import { Badge } from './badge';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';

// Navigation item types
interface NavItem {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
  badge?: number;
  external?: boolean;
  requireAuth?: boolean;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

// Main navigation items
const mainNavItems: NavItem[] = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/marketplace', icon: Search, label: 'Browse' },
  { href: '/favorites', icon: Heart, label: 'Favorites', requireAuth: true },
  { href: '/add-item', icon: Plus, label: 'Sell' },
  { href: '/messages', icon: MessageCircle, label: 'Messages', requireAuth: true },
];

// Desktop header navigation
const headerNavItems: NavItem[] = [
  { href: '/marketplace', icon: Search, label: 'Marketplace' },
  { href: '/categories', icon: ShoppingBag, label: 'Categories' },
  { href: '/featured', icon: Star, label: 'Featured' },
  { href: '/help', icon: HelpCircle, label: 'Help' },
];

// User menu items
const userMenuItems: NavItem[] = [
  { href: '/profile', icon: User, label: 'My Profile' },
  { href: '/my-items', icon: ShoppingBag, label: 'My Items' },
  { href: '/purchases', icon: Star, label: 'Purchases' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

// Enhanced Mobile Navigation
interface MobileNavProps {
  className?: string;
}

function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);

  // Filter items based on auth status
  const filteredItems = mainNavItems.filter(item => 
    !item.requireAuth || (item.requireAuth && user)
  );

  return (
    <motion.nav 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-white/95 backdrop-blur-md border-t border-gray-200",
        "shadow-lg px-4 py-2",
        className
      )}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ 
        duration: ANIMATION_SYSTEM.duration.normal / 1000,
        ease: ANIMATION_SYSTEM.framerEasing.easeOut 
      }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isMessages = item.href === '/messages';
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center space-y-1 px-3 py-2 rounded-lg",
                "transition-all transform-gpu will-change-transform",
                isActive 
                  ? "bg-primary text-primary-foreground scale-105 shadow-md" 
                  : "text-gray-600 hover:text-primary hover:scale-105 hover:bg-gray-50"
              )}
              style={{
                transitionDuration: `${ANIMATION_SYSTEM.duration.normal}ms`,
                transitionTimingFunction: ANIMATION_SYSTEM.easing.easeInOut
              }}
            >
              <div className="relative">
                <Icon size={20} />
                {isMessages && unreadCount > 0 && (
                  <Badge 
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs animate-pulse"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </div>
              <span className={cn(
                "text-xs font-medium transition-all",
                isActive && "font-bold"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
        
        {/* Profile/Login Button */}
        {user ? (
          <UserMenu />
        ) : (
          <Link
            href="/login"
            className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all transform text-blue-600 hover:text-blue-800 hover:scale-105 hover:bg-blue-50"
          >
            <User size={20} />
            <span className="text-xs font-medium">Login</span>
          </Link>
        )}
      </div>
    </motion.nav>
  );
}

// Enhanced Desktop Navigation Header
interface DesktopNavProps {
  className?: string;
}

function DesktopNav({ className }: DesktopNavProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <motion.header 
      className={cn(
        "sticky top-0 z-50 w-full",
        "bg-white/95 backdrop-blur-md border-b border-gray-200",
        "shadow-sm",
        className
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ 
        duration: ANIMATION_SYSTEM.duration.normal / 1000,
        ease: ANIMATION_SYSTEM.framerEasing.easeOut 
      }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">X</span>
          </div>
          <span className="font-bold text-xl text-gray-900">XMarket</span>
        </Link>

        {/* Main Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {headerNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-md",
                  "text-sm font-medium transition-all transform-gpu",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                )}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden"
          >
            <Search size={20} />
          </Button>

          {/* Notifications */}
          {user && <NotificationButton />}

          {/* User Menu or Auth Buttons */}
          {user ? (
            <UserMenu />
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 p-4 md:hidden"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search items, categories, or sellers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// User Menu Component
function UserMenu() {
  const { user, logout } = useUser();
  const { addToast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      addToast('Logged out successfully', 'success');
      router.push('/');
    } catch (error) {
      addToast('Error logging out', 'error');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.profileImageUrl} alt={user?.fullName} />
            <AvatarFallback>
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {userMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href} className="flex items-center space-x-2">
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut size={16} className="mr-2" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Notification Button Component
function NotificationButton() {
  const [hasNotifications, setHasNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  return (
    <Button variant="ghost" size="sm" className="relative">
      <Bell size={20} />
      {hasNotifications && (
        <Badge 
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
        >
          {notificationCount > 9 ? '9+' : notificationCount}
        </Badge>
      )}
    </Button>
  );
}

// Breadcrumb Component
interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex", className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
            )}
            {item.href && !item.current ? (
              <Link 
                href={item.href}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span 
                className={cn(
                  "text-sm font-medium",
                  item.current ? "text-gray-900" : "text-gray-500"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Main Navigation Component that handles responsive behavior
interface NavigationProps {
  showMobile?: boolean;
  showDesktop?: boolean;
  className?: string;
}

export function Navigation({ 
  showMobile = true, 
  showDesktop = true, 
  className 
}: NavigationProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return (
    <>
      {showDesktop && !isMobile && <DesktopNav className={className} />}
      {showMobile && isMobile && <MobileNav className={className} />}
    </>
  );
}

export { DesktopNav, MobileNav };