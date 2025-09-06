// Health check endpoint for Docker
// GET /api/health

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "xmarket-frontend",
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "production",
      uptime: process.uptime(),
    };

    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
