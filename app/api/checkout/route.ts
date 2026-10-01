import { NextResponse } from 'next/server';
import { storage } from '@/server/storage';
import { prepareCheckout } from '@/server/checkout';

export async function POST(request: Request) {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ message: 'Please provide a valid JSON checkout request.' }, { status: 400 });
  }

  try {
    const result = await prepareCheckout(storage, input);
    return NextResponse.json(result.body, { status: result.status });
  } catch {
    // Never include request data, destination URLs, or exception details in logs.
    console.error('Unable to prepare checkout.');
    return NextResponse.json(
      { message: 'Unable to prepare checkout right now. Please try again.' },
      { status: 500 },
    );
  }
}