// Test file to debug the favorites API issue
// This can be run to test the API endpoint

import apiClient from './api';

export const testFavoritesAPI = async () => {
  try {
    console.log('Testing favorites API...');
    
    // Test without parameters
    console.log('1. Testing without parameters...');
    const response1 = await apiClient.get("/items/favorites");
    console.log('Success without params:', response1);
    
    // Test with parameters
    console.log('2. Testing with parameters...');
    const response2 = await apiClient.get("/items/favorites", { page: "1", limit: "20" });
    console.log('Success with params:', response2);
    
  } catch (error) {
    console.error('API Test Error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
};

// Debug function to test API structure
export const debugAPICall = async () => {
  try {
    const response = await fetch('/api/items/favorites', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Raw response status:', response.status);
    console.log('Raw response headers:', response.headers);
    
    const text = await response.text();
    console.log('Raw response text:', text);
    
    if (text) {
      try {
        const json = JSON.parse(text);
        console.log('Parsed JSON:', json);
      } catch (e) {
        console.log('Failed to parse as JSON:', e);
      }
    }
    
  } catch (error) {
    console.error('Debug API call error:', error);
  }
};
