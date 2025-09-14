'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, Plus, MessageCircle, User } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useEffect, useState } from 'react';
import { api } from '../lib/apiEndpoints';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/favorites', icon: Heart, label: 'Favorites' },
  { href: '/add-item', icon: Plus, label: 'Add' },
  { href: '/messages', icon: MessageCircle, label: 'Messages' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread messages count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (loading || !user) {
        setUnreadCount(0);
        return;
      }

      try {
        const response = await api.messages.getConversations();
        const conversations = Array.isArray(response.data) ? response.data : [];
        const totalUnread = conversations.reduce((total: number, conv: any) => {
          return total + (typeof conv.unreadCount === 'number' ? conv.unreadCount : 0);
        }, 0);
        setUnreadCount(totalUnread);
      } catch (error: any) {
        setUnreadCount(0);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user, loading]);

  // Hide navbar on add-item page and item detail pages
  if (pathname === '/add-item' || pathname.startsWith('/item/')) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50 shadow-lg">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isMessages = item.href === '/messages';
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center space-y-1 px-3 py-2 transition-all"
              aria-label={item.label}
            >
              <div className="relative">
                <Icon 
                  size={20} 
                  className={`transition-colors ${
                    isActive 
                      ? 'text-[#006666] fill-current' 
                      : 'text-gray-500'
                  }`}
                  fill={isActive ? 'currentColor' : 'none'}
                />
                {isMessages && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span 
                className={`text-xs transition-colors ${
                  isActive 
                    ? 'text-[#006666] font-semibold' 
                    : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}