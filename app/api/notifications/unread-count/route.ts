import { NextResponse } from 'next/server';
import { storage } from '@/server/storage';

export async function GET() {
  try {
    const count = await storage.getUnreadNotificationCount("1");
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
