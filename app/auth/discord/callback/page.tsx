'use client';

import { useEffect } from 'react';

/**
 * Discord OAuth Callback Page
 * Handles the redirect from Discord OAuth for both popup and mobile scenarios
 */
export default function DiscordCallbackPage() {
  useEffect(() => {
    
    const handleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      // Check if this is a popup window (has opener) or mobile redirect
      if (window.opener && !window.opener.closed) {
        // Popup scenario: send message to parent window
        window.opener.postMessage({
          type: 'DISCORD_OAUTH_RESULT',
          code,
          error
        }, window.location.origin);
        
        // Close the popup window
        window.close();
      } else {
        // Mobile scenario: redirect back to signup page with parameters
        const baseUrl = '/signup/1337-student';
        const params = new URLSearchParams();
        
        if (error) {
          params.append('error', error);
        }
        if (code) {
          params.append('code', code);
        }
        
        const redirectUrl = params.toString() 
          ? `${baseUrl}?${params.toString()}` 
          : baseUrl;
          
        window.location.href = redirectUrl;
      }
    };

    // Small delay to ensure the page has loaded
    setTimeout(handleCallback, 100);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5865F2] mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Discord Authentication
        </h2>
        <p className="text-gray-600 mb-4">
          Processing your Discord authentication...
        </p>
        <p className="text-sm text-gray-500">
          {typeof window !== 'undefined' && window.opener 
            ? 'This window will close automatically once complete.'
            : 'Redirecting you back to registration...'
          }
        </p>
      </div>
    </div>
  );
}
