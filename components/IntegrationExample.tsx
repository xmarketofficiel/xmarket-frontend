'use client';

import React, { useState } from 'react';
import { api } from '../lib/apiEndpoints';
import { useUser } from '../contexts/UserContext';

/**
 * Example component demonstrating the integrated backend APIs
 * This shows how to use the new authentication, items, services, and interests APIs
 */
export default function IntegrationExample() {
  const { user, login, logout, loading } = useUser();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Example: Login
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await login('test@example.com', 'password123');
      setMessage('Login successful!');
    } catch (error: any) {
      setMessage(`Login failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Example: Get Items
  const handleGetItems = async () => {
    try {
      setIsLoading(true);
      const response = await api.items.getItems({ search: 'laptop', limit: 5 });
      setMessage(`Found ${response.data.total} items`);
      console.log('Items:', response.data.items);
    } catch (error: any) {
      setMessage(`Failed to get items: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Example: Get Categories
  const handleGetCategories = async () => {
    try {
      setIsLoading(true);
      const response = await api.items.getCategories();
      setMessage(`Found ${response.data.length} categories`);
      console.log('Categories:', response.data);
    } catch (error: any) {
      setMessage(`Failed to get categories: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Example: Get Services
  const handleGetServices = async () => {
    try {
      setIsLoading(true);
      const response = await api.services.getServices({ limit: 5 });
      setMessage(`Found ${response.data.total} services`);
      console.log('Services:', response.data.items);
    } catch (error: any) {
      setMessage(`Failed to get services: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Example: Show Interest in Item
  const handleShowInterest = async () => {
    try {
      setIsLoading(true);
      const response = await api.interests.showInterest({
        itemId: 1,
        message: 'I am interested in this item!'
      });
      setMessage('Interest shown successfully!');
      console.log('Interest:', response.data);
    } catch (error: any) {
      setMessage(`Failed to show interest: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Example: Get Conversations
  const handleGetConversations = async () => {
    try {
      setIsLoading(true);
      const response = await api.messages.getConversations();
      setMessage(`Found ${response.data.length} conversations`);
      console.log('Conversations:', response.data);
    } catch (error: any) {
      setMessage(`Failed to get conversations: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading user session...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Backend Integration Test</h1>
      
      {/* User Status */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold">User Status</h2>
        {user ? (
          <div>
            <p>Logged in as: <strong>{user.name}</strong></p>
            <p>Name: {user.name}</p>
            <button 
              onClick={logout} 
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <p>Not logged in</p>
            <button 
              onClick={handleLogin}
              disabled={isLoading}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Test Login
            </button>
          </div>
        )}
      </div>

      {/* API Test Buttons */}
      <div className="space-y-4 mb-6">
        <h2 className="text-lg font-semibold">API Tests</h2>
        
        <button 
          onClick={handleGetItems}
          disabled={isLoading}
          className="block w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Get Items (Public API)
        </button>

        <button 
          onClick={handleGetCategories}
          disabled={isLoading}
          className="block w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Get Categories (Public API)
        </button>

        <button 
          onClick={handleGetServices}
          disabled={isLoading}
          className="block w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Get Services (New API)
        </button>

        {user && (
          <>
            <button 
              onClick={handleShowInterest}
              disabled={isLoading}
              className="block w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
            >
              Show Interest (Requires Auth)
            </button>

            <button 
              onClick={handleGetConversations}
              disabled={isLoading}
              className="block w-full px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
            >
              Get Conversations (Requires Auth)
            </button>
          </>
        )}
      </div>

      {/* Message Display */}
      {message && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold">API Response:</h3>
          <p>{message}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold">Setup Instructions:</h3>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>Make sure backend is running: <code className="bg-gray-100 px-1 rounded">cd project && npm run start:dev</code></li>
          <li>Backend should be accessible at: <a href="http://localhost:3001" className="text-blue-600">http://localhost:3001</a></li>
          <li>API documentation: <a href="http://localhost:3001/api" className="text-blue-600">http://localhost:3001/api</a></li>
          <li>Check browser console for detailed API responses</li>
        </ol>
      </div>
    </div>
  );
}
