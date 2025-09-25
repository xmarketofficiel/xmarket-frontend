/**
 * Test page for logout functionality
 * This helps verify that logout works correctly with SSR
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/lib/apiEndpoints';

export default function TestLogoutPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testLogout = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // First, set a fake token to test the logout process
      localStorage.setItem('access_token', 'fake-token-for-testing');
      localStorage.setItem('refresh_token', 'fake-refresh-token');
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Before logout - tokens in localStorage:', {
          access_token: localStorage.getItem('access_token'),
          refresh_token: localStorage.getItem('refresh_token')
        });
      }

      // Test the logout function
      const response = await authApi.logout();
      
      if (process.env.NODE_ENV === 'development') {
        console.log('After logout - tokens in localStorage:', {
          access_token: localStorage.getItem('access_token'),
          refresh_token: localStorage.getItem('refresh_token')
        });
      }
      
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        {/* @ts-ignore */}
        <CardHeader>
          {/* @ts-ignore */}
          <CardTitle>Logout Test Page</CardTitle>
          <p className="text-muted-foreground">
            Test the logout functionality to ensure it works correctly with SSR.
          </p>
        </CardHeader>
        {/* @ts-ignore */}
        <CardContent className="space-y-4">
          <Button 
            onClick={testLogout} 
            disabled={loading}
            variant="destructive"
          >
            {loading ? 'Testing Logout...' : 'Test Logout'}
          </Button>

          {error && (
            <Card className="border-red-200 bg-red-50">
              {/* @ts-ignore */}
              <CardContent className="pt-6">
                <h3 className="font-semibold text-red-800">Error</h3>
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          )}

          {result && (
            <Card className="border-green-200 bg-green-50">
              {/* @ts-ignore */}
              <CardContent className="pt-6">
                <h3 className="font-semibold text-green-800 mb-2">Logout Result</h3>
                <pre className="bg-white p-4 rounded border text-sm overflow-auto max-h-96">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          <Card className="bg-blue-50 border-blue-200">
            {/* @ts-ignore */}
            <CardContent className="pt-6">
              <h3 className="font-semibold text-blue-800 mb-2">Improved Logout Process</h3>
              <ol className="list-decimal list-inside space-y-1 text-blue-700">
                <li><strong>Step 1:</strong> Sets fake tokens in localStorage</li>
                <li><strong>Step 2:</strong> Clears tokens immediately (priority)</li>
                <li><strong>Step 3:</strong> Waits for token removal to complete</li>
                <li><strong>Step 4:</strong> Calls logout API (optional)</li>
                <li><strong>Step 5:</strong> Would redirect to "/" in real app</li>
                <li><strong>Result:</strong> Tokens always cleared, even if API fails</li>
              </ol>
              <div className="mt-3 p-3 bg-white rounded border">
                <p className="text-sm text-blue-600">
                  ✅ <strong>Token removal happens first</strong><br/>
                  ✅ <strong>Redirect happens after token cleanup</strong><br/>
                  ✅ <strong>No console errors for logout failures</strong><br/>
                  ✅ <strong>Silent error handling for server errors</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
