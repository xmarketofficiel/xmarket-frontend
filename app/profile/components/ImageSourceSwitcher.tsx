'use client';

import { useState } from 'react';
import { api } from '../../../lib/apiEndpoints';

interface ImageSource {
  cloudinary: { url: string; active: boolean; source: string };
  digitalocean: { url: string; variants: any; active: boolean; source: string };
  canSwitch: boolean;
}

export function ImageSourceSwitcher({ userId }: { userId: number }) {
  const [sources, setSources] = useState<ImageSource | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSources = async () => {
    try {
      setError(null);
      console.log('🔍 Fetching image sources for user:', userId);
      
      // TODO: Implement getProfileImageSources API method
      // const response = await api.users.getProfileImageSources(userId.toString());
      // console.log('✅ Image sources response:', response);
      
      // setSources(response.data);
      console.log('⚠️ getProfileImageSources API not implemented yet');
    } catch (error: any) {
      console.error('❌ Failed to fetch image sources:', error);
      
      // More detailed error information
      if (error.status) {
        console.error('❌ Error status:', error.status);
        console.error('❌ Error message:', error.message);
      }
      
      let errorMessage = 'Failed to fetch image sources';
      if (error.status === 401) {
        errorMessage = 'Please log in to use this feature';
      } else if (error.status === 404) {
        errorMessage = 'User not found';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    }
  };

  const switchSource = async (source: 'cloudinary' | 'digitalocean', variant?: string) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implement switchProfileImageSource API method
      // const response = await api.users.switchProfileImageSource(
      //   userId.toString(), 
      //   { source, variant }
      // );
      
      // console.log('✅ Switched to:', response.data);
      
      // // Refresh the page to see the change
      // window.location.reload();
      console.log('⚠️ switchProfileImageSource API not implemented yet');
    } catch (error: any) {
      console.error('Failed to switch source:', error);
      setError(error.message || 'Failed to switch image source');
    } finally {
      setLoading(false);
    }
  };

  if (!sources) {
    return (
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <button 
          onClick={fetchSources}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          🔍 Check Image Sources
        </button>
        {error && (
          <div className="mt-2 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-3">🖼️ Image Source Tester</h3>
      
      <div className="space-y-3">
        {/* Cloudinary Option */}
        <div className="flex items-center justify-between p-2 bg-white rounded">
          <span>☁️ Cloudinary</span>
          <button 
            onClick={() => switchSource('cloudinary')}
            disabled={loading}
            className="px-3 py-1 bg-orange-500 text-white rounded text-sm"
          >
            Use Cloudinary
          </button>
        </div>

        {/* DigitalOcean Options */}
        {sources.digitalocean.active && (
          <>
            <div className="flex items-center justify-between p-2 bg-white rounded">
              <span>🌊 DO Main</span>
              <button 
                onClick={() => switchSource('digitalocean')}
                disabled={loading}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                Use DO Main
              </button>
            </div>

            {/* DO Variants */}
            {sources.digitalocean.variants && Object.keys(sources.digitalocean.variants).map(variant => (
              <div key={variant} className="flex items-center justify-between p-2 bg-white rounded">
                <span>🌊 DO {variant}</span>
                <button 
                  onClick={() => switchSource('digitalocean', variant)}
                  disabled={loading}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  Use {variant}
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="mt-3 text-xs text-gray-600">
        💡 Switch between image sources to test DigitalOcean Spaces URLs
      </div>
      
      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  );
}