/**
 * Health check endpoint to test SSR proxy functionality
 */

import { NextResponse } from 'next/server';
import { serverApiClient } from '@/lib/server-api';

export async function GET() {
  try {
    // Test connection to backend
    const response = await serverApiClient.get('/health');
    
    return NextResponse.json({
      status: 'ok',
      message: 'SSR proxy is working',
      backend: {
        status: response.status,
        data: response.data
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'SSR proxy health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}