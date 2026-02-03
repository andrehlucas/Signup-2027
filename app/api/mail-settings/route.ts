import { NextResponse } from 'next/server';
import { storage } from '@/server/storage';

export async function GET() {
  try {
    const settings = await storage.getMailSettings("1");
    return NextResponse.json(settings || { defaultAction: "keep" });
  } catch (error) {
    console.error("Error fetching mail settings:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { defaultAction } = await request.json() as { defaultAction: string };
    const validActions = ['scan', 'forward', 'keep', 'shred'];
    
    if (!validActions.includes(defaultAction)) {
      return NextResponse.json({ message: "Invalid default action" }, { status: 400 });
    }

    const settings = await storage.updateMailSettings("1", defaultAction);
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating mail settings:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
