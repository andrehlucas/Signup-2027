import { NextResponse } from 'next/server';
import { storage } from '@/server/storage';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await storage.deleteNotification(id);
    if (!deleted) {
      return NextResponse.json({ message: "Notification not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
