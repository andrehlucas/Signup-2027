import { NextResponse } from 'next/server';
import { storage } from '@/server/storage';
import { NotificationType } from '@/shared/schema';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as NotificationType | null;
    const validTypes: NotificationType[] = ['mail', 'billing', 'account', 'service', 'location'];
    
    if (type && !validTypes.includes(type)) {
      return NextResponse.json({ message: "Invalid notification type" }, { status: 400 });
    }

    const notifications = await storage.getNotifications("1", type || undefined);
    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
