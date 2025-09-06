'use client';

import { useState } from 'react';
import { api } from '../../lib/apiEndpoints';

export default function TestAuthPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await api.auth.login({
        email: 'admin@xmarket.com',
        password: 'admin123'
      });
      setResult({ success: true, data: response.data });
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.notifications.getNotifications();
      setResult({ success: true, data: response.data });
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testCurrentUser = async () => {
    setLoading(true);
    try {
      const response = await api.auth.getCurrentUser();
      setResult({ success: true, data: response.data });
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Test</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testLogin}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Login
        </button>
        
        <button
          onClick={testCurrentUser}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 ml-2"
        >
          Test Current User
        </button>
        
        <button
          onClick={testNotifications}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 ml-2"
        >
          Test Notifications
        </button>
      </div>

      {loading && <p>Loading...</p>}
      
      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">Result:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
