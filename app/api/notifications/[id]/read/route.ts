import { NextResponse } from 'next/server';
import { storage } from '@/server/storage';

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updated = await storage.markNotificationRead(id);
    if (!updated) {
      return NextResponse.json({ message: "Notification not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error marking notification read:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
