'use client';

import { useState, useEffect } from 'react';
import { api } from '../lib/apiEndpoints';
import { useUser } from '../contexts/UserContext';

/**
 * Simple component to test backend API integration
 * Add this to any page to test the APIs
 */
export default function BackendTestButton() {
  const { user, login, logout, loading } = useUser();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runAPITests = async () => {
    setIsRunning(true);
    setTestResults([]);
    addResult('🧪 Starting API tests...');

    // Test 1: Get Categories
    try {
      const categories = await api.items.getCategories();
      addResult(`✅ Categories: Found ${categories.data.length} categories`);
    } catch (error: any) {
      addResult(`❌ Categories failed: ${error.message}`);
    }

    // Test 2: Get Items  
    try {
      const items = await api.items.getItems({ limit: 5 });
      addResult(`✅ Items: Found ${items.data.items?.length || 0} items`);
    } catch (error: any) {
      addResult(`❌ Items failed: ${error.message}`);
    }

    // Test 3: Get Services
    try {
      const services = await api.services.getServices({ limit: 5 });
      addResult(`✅ Services: Found ${services.data.items?.length || 0} services`);
    } catch (error: any) {
      addResult(`❌ Services failed: ${error.message}`);
    }

    // Test 4: Auth-required tests (if logged in)
    if (user) {
      try {
        const profile = await api.users.getProfile();
        addResult(`✅ Profile: ${profile.data.name}`);
      } catch (error: any) {
        addResult(`❌ Profile failed: ${error.message}`);
      }

      try {
        const conversations = await api.messages.getConversations();
        addResult(`✅ Messages: Found ${conversations.data.length} conversations`);
      } catch (error: any) {
        addResult(`❌ Messages failed: ${error.message}`);
      }
    } else {
      addResult('ℹ️ Not logged in - skipping auth tests');
    }

    addResult('🏁 Test complete!');
    setIsRunning(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">Backend Test</h3>
        <div className="flex gap-1">
          <button
            onClick={runAPITests}
            disabled={isRunning}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isRunning ? 'Testing...' : 'Test APIs'}
          </button>
          <button
            onClick={clearResults}
            className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
      </div>

      {/* User Status */}
      <div className="text-xs mb-2 p-2 bg-gray-50 rounded">
        {user ? (
          <div>
            <div>✅ Logged in: {user.name}</div>
            <button 
              onClick={logout} 
              className="text-red-600 hover:text-red-800 mt-1"
            >
              Logout
            </button>
          </div>
        ) : (
          <div>❌ Not logged in</div>
        )}
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="max-h-48 overflow-y-auto text-xs bg-gray-50 p-2 rounded">
          {testResults.map((result, index) => (
            <div key={index} className="mb-1 font-mono">
              {result}
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-500 mt-2">
        Backend: <span className="font-mono">localhost:3001</span>
      </div>
    </div>
  );
}
