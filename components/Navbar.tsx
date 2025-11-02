'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, Plus, MessageCircle, User } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/favorites', icon: Heart, label: 'Favorites' },
  { href: '/add-item', icon: Plus, label: 'Add' },
  { href: '/messages', icon: MessageCircle, label: 'Messages' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function Navbar() {
  const pathname = usePathname();

  // Hide navbar on add-item page and item detail pages
  if (pathname === '/add-item' || pathname.startsWith('/item/')) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50 shadow-lg">
      <div className="flex items-center justify-around max-w-lg mx-auto min-h-[4rem]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
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