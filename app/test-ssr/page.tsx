/**
 * Test page to demonstrate SSR API functionality
 * This page shows that API calls are made server-side and hidden from browser
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import apiClient from '@/lib/api';

export default function TestSSRPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testHealthCheck = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // This call will go through the SSR proxy
      const response = await fetch('/api/health');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testApiCall = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // This call will go through the SSR proxy to your backend
      const response = await apiClient.get('/items', { page: 1, limit: 5 });
      setResult(response.data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>SSR API Test Page</CardTitle>
          <p className="text-muted-foreground">
            Test the SSR proxy functionality. Open your browser's Network tab and notice that 
            backend API calls are hidden - only calls to Next.js API routes are visible.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={testHealthCheck} 
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Testing...' : 'Test Health Check'}
            </Button>
            
            <Button 
              onClick={testApiCall} 
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Test Items API'}
            </Button>
          </div>

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-red-800">Error</h3>
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          )}

          {result && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-green-800 mb-2">Success</h3>
                <pre className="bg-white p-4 rounded border text-sm overflow-auto max-h-96">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-blue-800 mb-2">How to Test SSR</h3>
              <ol className="list-decimal list-inside space-y-1 text-blue-700">
                <li>Open your browser's Developer Tools (F12)</li>
                <li>Go to the Network tab</li>
                <li>Click one of the test buttons above</li>
                <li>Notice that you only see calls to <code>/api/health</code> or <code>/api/proxy/*</code></li>
                <li>You won't see direct calls to your backend (e.g., <code>localhost:3001</code>)</li>
                <li>This means API calls are hidden from the client-side!</li>
              </ol>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
