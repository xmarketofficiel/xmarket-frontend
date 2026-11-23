import { NextResponse } from 'next/server';

// External access requests are retired for the student and staff marketplace.
function retired() {
  return NextResponse.json(
    { message: 'External access requests are no longer available.' },
    { status: 410 },
  );
}

export const GET = retired;
export const POST = retired;
