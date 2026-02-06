import { NextResponse } from 'next/server';
import { storage } from '@/server/storage';

export async function GET() {
  try {
    const prefs = await storage.getNotificationPreferences("1");
    return NextResponse.json(prefs || {
      mailEnabled: true,
      billingEnabled: true,
      accountEnabled: true,
      serviceEnabled: true,
      locationEnabled: true,
      emailDelivery: true,
      inAppDelivery: true,
    });
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const updated = await storage.updateNotificationPreferences("1", body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
