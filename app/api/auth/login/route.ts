import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL, createServerFetchOptions } from '../../../../lib/server-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/auth/login`, createServerFetchOptions({
      method: 'POST',
      body: JSON.stringify(body),
    }));

    const data = await response.json();

    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Auth login proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
