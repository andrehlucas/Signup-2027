import { NextResponse } from 'next/server';
import { storage } from '@/server/storage';
import { completeSignup } from '@/server/signup';

export async function POST(request: Request) {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ message: 'Please provide a valid JSON signup request.' }, { status: 400 });
  }

  try {
    const result = await completeSignup(storage, input);
    return NextResponse.json(result.body, { status: result.status });
  } catch {
    // Never include request data or exception details in signup logs.
    console.error('Unable to complete signup.');
    return NextResponse.json(
      { message: 'Unable to complete signup right now. Please try again.' },
      { status: 500 },
    );
  }
}