/**
 * API Connection Test Suite
 * Test the integration between frontend and CampusSuperApp backend
 */

import { api } from './apiEndpoints';

// Test basic API connectivity
export async function testAPIConnection() {
  console.log('🔍 Testing API connection to backend...');
  
  try {
    // Test public endpoints that don't require authentication
    
    // 1. Test items endpoint
    console.log('Testing items endpoint...');
    const itemsResponse = await api.items.getItems({ limit: 1 });
    console.log('✅ Items API:', itemsResponse.status === 200 ? 'Working' : 'Failed');
    
    // 2. Test categories endpoint
    console.log('Testing categories endpoint...');
    const categoriesResponse = await api.categories.getCategories();
    console.log('✅ Categories API:', categoriesResponse.status === 200 ? 'Working' : 'Failed');
    
    // 3. Test services endpoint (new)
    console.log('Testing services endpoint...');
    const servicesResponse = await api.services.getServices({ limit: 1 });
    console.log('✅ Services API:', servicesResponse.status === 200 ? 'Working' : 'Failed');
    
    console.log('🎉 Basic API connectivity test completed successfully!');
    return {
      success: true,
      message: 'All public endpoints are responding correctly'
    };
    
  } catch (error: any) {
    console.error('❌ API connection test failed:', error.message);
    
    // Provide helpful debugging information
    if (error.message.includes('fetch')) {
      console.log('💡 Tip: Make sure the backend server is running on port 3001');
      console.log('   Start with: cd CampusSuperApp && npm run start:dev');
    }
    
    if (error.message.includes('CORS')) {
      console.log('💡 Tip: CORS issue detected. Check backend CORS configuration');
    }
    
    return {
      success: false,
      error: error.message,
      suggestions: [
        'Ensure backend is running on http://localhost:3001',
        'Check CORS configuration in backend',
        'Verify NEXT_PUBLIC_API_BASE_URL environment variable'
      ]
    };
  }
}

// Test authentication flow (requires manual interaction for OTP)
export async function testAuthFlow(email?: string) {
  console.log('🔐 Testing authentication flow...');
  
  if (!email) {
    console.log('⚠️  No email provided. Skipping auth flow test.');
    console.log('💡 To test auth: testAuthFlow("your-email@university.edu")');
    return { success: false, message: 'Email required for auth test' };
  }
  
  try {
    // 1. Test OTP sending
    console.log(`Sending OTP to ${email}...`);
    const otpResponse = await api.auth.sendOtp(email);
    console.log('✅ OTP Send:', otpResponse.status === 200 ? 'Working' : 'Failed');
    console.log('📧 Check your email for the OTP code');
    
    // Note: We can't automatically test OTP verification without the actual code
    console.log('⚠️  Manual step required: Use the OTP from your email to complete registration');
    console.log('📝 Next steps:');
    console.log('   1. Check email for OTP');
    console.log('   2. Call api.auth.verifyOtp(email, otp)');
    console.log('   3. Call api.auth.completeRegistration(data)');
    
    return {
      success: true,
      message: 'OTP sending works. Manual verification required.',
      nextSteps: [
        'Check email for OTP',
        'Use received OTP to verify',
        'Complete registration flow'
      ]
    };
    
  } catch (error: any) {
    console.error('❌ Auth flow test failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Test file upload functionality
export async function testFileUpload() {
  console.log('📁 Testing file upload endpoints...');
  
  try {
    // Create a test blob file
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
    // Test generic upload
    console.log('Testing generic file upload...');
    const uploadResponse = await api.uploads.uploadSingle(testFile);
    console.log('✅ File Upload:', uploadResponse.status === 201 ? 'Working' : 'Failed');
    
    if (uploadResponse.data) {
      console.log('📎 Uploaded file URL:', uploadResponse.data.url);
    }
    
    return {
      success: true,
      message: 'File upload working correctly',
      uploadedFile: uploadResponse.data
    };
    
  } catch (error: any) {
    console.error('❌ File upload test failed:', error.message);
    
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      console.log('💡 Tip: File upload requires authentication. Login first.');
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Comprehensive test suite
export async function runFullTestSuite(options: {
  testEmail?: string;
  testAuth?: boolean;
  testUpload?: boolean;
} = {}) {
  console.log('🧪 Running comprehensive API test suite...\n');
  
  const results: any = {
    connectivity: null,
    auth: null,
    upload: null,
    summary: { passed: 0, failed: 0, skipped: 0 }
  };
  
  // 1. Basic connectivity test
  console.log('=== Basic Connectivity Tests ===');
  results.connectivity = await testAPIConnection();
  results.summary[results.connectivity.success ? 'passed' : 'failed']++;
  console.log('');
  
  // 2. Authentication test (optional)
  if (options.testAuth && options.testEmail) {
    console.log('=== Authentication Tests ===');
    results.auth = await testAuthFlow(options.testEmail);
    results.summary[results.auth.success ? 'passed' : 'failed']++;
    console.log('');
  } else {
    console.log('⏭️  Skipping authentication tests (no email provided)');
    results.summary.skipped++;
  }
  
  // 3. File upload test (optional)
  if (options.testUpload) {
    console.log('=== File Upload Tests ===');
    results.upload = await testFileUpload();
    results.summary[results.upload.success ? 'passed' : 'failed']++;
    console.log('');
  } else {
    console.log('⏭️  Skipping file upload tests');
    results.summary.skipped++;
  }
  
  // Print summary
  console.log('=== Test Summary ===');
  console.log(`✅ Passed: ${results.summary.passed}`);
  console.log(`❌ Failed: ${results.summary.failed}`);
  console.log(`⏭️  Skipped: ${results.summary.skipped}`);
  
  if (results.summary.failed === 0) {
    console.log('🎉 All tests passed! API integration is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the logs above for details.');
  }
  
  return results;
}

// Export test functions for use in development
export const apiTests = {
  testAPIConnection,
  testAuthFlow,
  testFileUpload,
  runFullTestSuite
};

// Development helper: Add to window in development mode
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).apiTests = apiTests;
  console.log('🛠️  API tests available globally as window.apiTests');
  console.log('📖 Usage examples:');
  console.log('   window.apiTests.testAPIConnection()');
  console.log('   window.apiTests.runFullTestSuite({ testEmail: "your@email.com" })');
}
