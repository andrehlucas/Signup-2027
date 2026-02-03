import { NextResponse } from 'next/server';
import { storage } from '@/server/storage';

export async function GET() {
  try {
    const pendingMail = await storage.getPendingMail();
    return NextResponse.json(pendingMail);
  } catch (error) {
    console.error("Error fetching mail:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
