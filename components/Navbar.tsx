'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, Plus, MessageCircle, User } from 'lucide-react';
import { useUI } from '../contexts/UIContext';
import { useUser } from '../contexts/UserContext';
import { useEffect, useState } from 'react';
import { api } from '../lib/apiEndpoints';
import { ANIMATION_SYSTEM } from '../lib/design-system';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/favorites', icon: Heart, label: 'Favorites' },
  { href: '/add-item', icon: Plus, label: 'Add Item' },
  { href: '/messages', icon: MessageCircle, label: 'Messages' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { hideNavbar } = useUI();
  const { user, loading } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread messages count from backend API
  useEffect(() => {
    const fetchUnreadCount = async () => {
      // Don't fetch if still loading user data or user is not authenticated
      if (loading || !user) {
        setUnreadCount(0);
        return;
      }

      try {
        // Fetch unread messages
        const response = await api.messages.getConversations();
        // Ensure response.data is an array before using reduce
        const conversations = Array.isArray(response.data) ? response.data : [];
        const totalUnread = conversations.reduce((total: number, conv: any) => {
          // Use unreadCount from the backend response
          return total + (typeof conv.unreadCount === 'number' ? conv.unreadCount : 0);
        }, 0);
        setUnreadCount(totalUnread);
      } catch (error: any) {
        // Reset counts on error to avoid showing stale data
        setUnreadCount(0);
      }
    };

    fetchUnreadCount();
    
    // Update every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user, loading]);

  // Hide navbar on certain pages - MOVED AFTER ALL HOOKS
  if (hideNavbar || pathname.startsWith('/item/') || pathname === '/add-item') {
    return null;
  }

  return (
    <nav className="design-card fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-[--color-border] px-4 py-2 z-50 shadow-lg">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isMessages = item.href === '/messages';
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all transform ${
                isActive 
                  ? 'bg-[#006666] text-white scale-105 shadow-lg' 
                  : 'text-gray-600 hover:text-[#006666] hover:scale-105 hover:bg-gray-50'
              }`}
              style={{
                transitionDuration: `${ANIMATION_SYSTEM.duration.normal}ms`,
                transitionTimingFunction: ANIMATION_SYSTEM.easing.easeInOut
              }}
              aria-label={item.label}
            >
              <div className="relative">
                <Icon 
                  size={20} 
                  className="transition-all"
                  style={{
                    transitionDuration: `${ANIMATION_SYSTEM.duration.fast}ms`,
                    transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                  }}
                />
                {isMessages && unreadCount > 0 && (
                  <span 
                    className="absolute -top-2 -right-2 bg-[#FF6B35] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse shadow-md"
                    style={{
                      transitionDuration: `${ANIMATION_SYSTEM.duration.normal}ms`,
                      transitionTimingFunction: ANIMATION_SYSTEM.easing.bounce
                    }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span 
                className={`text-xs font-medium transition-all ${isActive ? 'font-bold' : ''}`}
                style={{
                  transitionDuration: `${ANIMATION_SYSTEM.duration.fast}ms`,
                  transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
        
        {/* Login button if no user */}
        {!user && (
          <Link
            href="/login"
            className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all transform text-blue-600 hover:text-blue-800 hover:scale-105 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            style={{
              transitionDuration: `${ANIMATION_SYSTEM.duration.normal}ms`,
              transitionTimingFunction: ANIMATION_SYSTEM.easing.easeInOut
            }}
            aria-label="Login"
          >
            <div className="relative">
              <User 
                size={16}
                className="transition-all"
                style={{
                  transitionDuration: `${ANIMATION_SYSTEM.duration.fast}ms`,
                  transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
                }}
              />
            </div>
            <span 
              className="text-xs font-medium transition-all"
              style={{
                transitionDuration: `${ANIMATION_SYSTEM.duration.fast}ms`,
                transitionTimingFunction: ANIMATION_SYSTEM.easing.easeOut
              }}
            >
              Login
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}