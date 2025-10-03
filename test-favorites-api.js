// Test script to check favorites API
const testFavoritesAPI = async () => {
  try {
    console.log('Testing favorites API...');
    
    // Test 1: Check if we can fetch favorites
    const response = await fetch('/api/items/favorites', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any auth headers if needed
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('Favorites data:', data);
    } else {
      const errorText = await response.text();
      console.error('Error response:', errorText);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// Test 2: Check authentication status
const testAuth = async () => {
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Auth status:', response.status);
    
    if (response.ok) {
      const user = await response.json();
      console.log('Current user:', user);
    } else {
      console.log('Not authenticated');
    }
  } catch (error) {
    console.error('Auth check failed:', error);
  }
};

// Run tests
console.log('=== Testing Favorites API ===');
testAuth().then(() => testFavoritesAPI());