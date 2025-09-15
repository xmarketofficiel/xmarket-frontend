import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Join requests API endpoint" });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      fullName,
      email,
      phone,
      affiliation,
      reason,
      university,
      position,
    } = body;

    // Validate required fields
    if (!fullName || !email || !affiliation || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send to backend API
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    const backendResponse = await fetch(`${apiUrl}/auth/join-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        email,
        phone: phone || null,
        affiliation,
        reason,
        university: university || null,
        position: position || null,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to submit request to backend");
    }

    const result = await backendResponse.json();

    return NextResponse.json({
      message: "Join request submitted successfully",
      id: result.id,
    });
  } catch (error: any) {
    console.error("Error submitting join request:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
