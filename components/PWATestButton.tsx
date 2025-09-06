/**
 * PWA Test Component - For testing PWA installation on mobile
 * This component provides manual install triggers for testing
 */

'use client';

import { useState, useEffect } from 'react';
import { Download, Smartphone, Check, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWATestButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showTestPanel, setShowTestPanel] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
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
    if (!deferredPrompt) {
      alert('Install prompt not available. Try:\n1. Open in Chrome/Safari\n2. Make sure PWA requirements are met\n3. Check if already installed');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        alert('Install successful!');
      } else {
        alert('Install dismissed by user');
      }
      
      setDeferredPrompt(null);
      setCanInstall(false);
    } catch (error) {
      console.error('Install error:', error);
      alert('Install failed: ' + error);
    }
  };

  const getInstallStatus = () => {
    if (isInstalled) return 'Already Installed ✓';
    if (canInstall) return 'Ready to Install';
    return 'Waiting for Install Prompt...';
  };

  return (
    <>
      {/* Floating Test Button */}
      <button
        onClick={() => setShowTestPanel(!showTestPanel)}
        className="fixed top-4 right-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700"
        title="PWA Test Panel"
      >
        <Smartphone className="w-5 h-5" />
      </button>

      {/* Test Panel */}
      {showTestPanel && (
        <div className="fixed top-16 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-w-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">PWA Test Panel</h3>
            <button 
              onClick={() => setShowTestPanel(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3 text-xs">
            <div>
              <strong>Status:</strong><br />
              <span className={`px-2 py-1 rounded text-xs ${
                isInstalled ? 'bg-green-100 text-green-800' : 
                canInstall ? 'bg-blue-100 text-blue-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {getInstallStatus()}
              </span>
            </div>
            
            <div>
              <strong>Device Info:</strong><br />
              <span className="text-gray-600">
                UA: {navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}<br />
                Standalone: {(window.navigator as any).standalone ? 'Yes' : 'No'}<br />
                Display Mode: {window.matchMedia('(display-mode: standalone)').matches ? 'Standalone' : 'Browser'}
              </span>
            </div>

            <button
              onClick={handleInstallClick}
              disabled={!canInstall}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-sm font-medium ${
                canInstall 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Download className="w-4 h-4" />
              {isInstalled ? 'Already Installed' : 'Install App'}
            </button>

            <div className="text-xs text-gray-500">
              <strong>How to test:</strong><br />
              1. Open on mobile Chrome/Safari<br />
              2. Wait for install prompt<br />
              3. Try manual install button<br />
              4. Check browser menu for Install App
            </div>
          </div>
        </div>
      )}
    </>
  );
}
