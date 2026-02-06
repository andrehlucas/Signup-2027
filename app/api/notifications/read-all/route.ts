import { NextResponse } from 'next/server';
import { storage } from '@/server/storage';

export async function PATCH() {
  try {
    await storage.markAllNotificationsRead("1");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking all notifications read:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
