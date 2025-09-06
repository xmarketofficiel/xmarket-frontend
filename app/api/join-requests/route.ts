import { NextRequest, NextResponse } from "next/server";

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
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/join-request`, {
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
      throw new Error("Failed to submit request to backend");
    }

    const result = await backendResponse.json();

    return NextResponse.json({
      message: "Join request submitted successfully",
      id: result.id,
    });
  } catch (error) {
    console.error("Error submitting join request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
