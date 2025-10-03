/**
 * Offline Status Component
 * Shows network status and queued actions
 */

'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Clock, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export default function OfflineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [queuedActions, setQueuedActions] = useState(0);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Check for service worker messages about queued actions
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'BACKGROUND_SYNC_QUEUED') {
          setQueuedActions(prev => prev + 1);
        } else if (event.data.type === 'BACKGROUND_SYNC_COMPLETED') {
          setQueuedActions(prev => Math.max(0, prev - 1));
        }
      });
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Show online status briefly when coming back online
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
      setShowOnlineMessage(false);
    } else if (isOnline && wasOffline) {
      setShowOnlineMessage(true);
      setWasOffline(false);
      const timer = setTimeout(() => {
        setShowOnlineMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (isOnline && !queuedActions && !showOnlineMessage) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-sm mx-auto">
      {!isOnline && (
        // @ts-ignore - Alert component children prop conflict
        <Alert className="bg-orange-50 border-orange-200">
          <WifiOff className="h-4 w-4 text-orange-600" />
          {/* @ts-ignore - AlertDescription children prop conflict */}
          <AlertDescription className="text-orange-800">
            You&apos;re offline. Actions will sync when you&apos;re back online.
            {queuedActions > 0 && (
              <div className="flex items-center gap-1 mt-1 text-sm">
                <Clock className="h-3 w-3" />
                <span>{queuedActions} action{queuedActions > 1 ? 's' : ''} queued</span>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {isOnline && showOnlineMessage && (
        // @ts-ignore - Alert component children prop conflict
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          {/* @ts-ignore - AlertDescription children prop conflict */}
          <AlertDescription className="text-green-800">
            Back online! 
            {queuedActions > 0 && ' Syncing queued actions...'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
