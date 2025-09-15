/**
 * PWA Install Prompt Component
 * Provides custom install prompt for Progressive Web App
 */

'use client';

import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import { Button } from './ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show custom install prompt after some interaction
      setTimeout(() => setShowPrompt(true), 5000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        // User accepted the install prompt
        setDeferredPrompt(null);
        setShowPrompt(false);
      } else {
        // User dismissed the install prompt
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already installed or user dismissed
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  // Don't show if user already dismissed
  if (localStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-w-sm mx-auto">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Smartphone className="w-8 h-8 text-blue-600" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Install XMarket
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            Get faster access and offline capabilities. Install our app for the best experience!
          </p>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleInstallClick}
              size="sm"
              className="flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Install
            </Button>
            <Button 
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="text-gray-500"
            >
              Not now
            </Button>
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          aria-label="Dismiss install prompt"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default PWAInstallPrompt;
