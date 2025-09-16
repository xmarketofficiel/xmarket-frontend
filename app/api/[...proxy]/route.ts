import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// Generic proxy for all backend routes
export async function GET(
  request: NextRequest,
  { params }: { params: { proxy: string[] } }
) {
  return handleRequest(request, params.proxy, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: { proxy: string[] } }
) {
  return handleRequest(request, params.proxy, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { proxy: string[] } }
) {
  return handleRequest(request, params.proxy, 'PUT');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { proxy: string[] } }
) {
  return handleRequest(request, params.proxy, 'PATCH');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { proxy: string[] } }
) {
  return handleRequest(request, params.proxy, 'DELETE');
}

async function handleRequest(
  request: NextRequest,
  proxyPath: string[],
  method: string
) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const path = proxyPath.join('/');
    
    const authHeader = request.headers.get('authorization');
    const contentType = request.headers.get('content-type');
    
    let body;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      if (contentType?.includes('application/json')) {
        body = JSON.stringify(await request.json());
      } else if (contentType?.includes('multipart/form-data')) {
        body = await request.formData();
      } else {
        body = await request.text();
      }
    }

    const headers: HeadersInit = {
      ...(contentType && { 'Content-Type': contentType }),
      ...(authHeader && { 'Authorization': authHeader }),
    };

    // Remove Content-Type for FormData (let fetch set it with boundary)
    if (body instanceof FormData) {
      delete headers['Content-Type'];
    }
    
    const response = await fetch(
      `${BACKEND_URL}/${path}${queryString ? `?${queryString}` : ''}`,
      {
        method,
        headers,
        ...(body && { body }),
      }
    );

    let data;
    const responseContentType = response.headers.get('content-type');
    
    if (responseContentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return new NextResponse(
      typeof data === 'string' ? data : JSON.stringify(data),
      {
        status: response.status,
        headers: {
          'Content-Type': responseContentType || 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (error) {
    console.error('Proxy error:', error);
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
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
