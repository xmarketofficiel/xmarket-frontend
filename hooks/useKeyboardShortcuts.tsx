'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const KEYBOARD_SHORTCUTS = {
  'KeyH': '/',           // Home
  'KeyF': '/favorites',  // Favorites  
  'KeyA': '/add-item',   // Add item
  'KeyM': '/messages',   // Messages
  'KeyP': '/profile',    // Profile
  'KeyS': '/settings',   // Settings
  'Escape': 'back',      // Go back
  'Slash': 'search',     // Focus search
} as const;

export function useKeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement) {
        return;
      }

      // Check for Ctrl/Cmd + key combinations
      const isModifierPressed = event.ctrlKey || event.metaKey;
      
      if (isModifierPressed) {
        const shortcut = KEYBOARD_SHORTCUTS[event.code as keyof typeof KEYBOARD_SHORTCUTS];
        
        if (shortcut) {
          event.preventDefault();
          
          if (shortcut === 'back') {
            router.back();
          } else if (shortcut === 'search') {
            const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
            searchInput?.focus();
          } else {
            router.push(shortcut);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router]);
}

export function KeyboardShortcutsHelp() {
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-3 rounded-lg max-w-xs opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none hover:pointer-events-auto z-50">
      <h4 className="font-semibold mb-2">Keyboard Shortcuts</h4>
      <div className="space-y-1">
        <div>Ctrl+H: Home</div>
        <div>Ctrl+F: Favorites</div>  
        <div>Ctrl+A: Add Item</div>
        <div>Ctrl+M: Messages</div>
        <div>Ctrl+P: Profile</div>
        <div>Ctrl+/: Search</div>
        <div>Esc: Go Back</div>
      </div>
    </div>
  );
}
