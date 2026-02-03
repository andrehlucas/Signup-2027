import { NextResponse } from 'next/server';
import { storage } from '@/server/storage';
import { MailAction } from '@/shared/schema';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action } = await request.json() as { action: MailAction };
    const validActions: MailAction[] = ['scan', 'forward', 'keep', 'shred', 'not_my_mail'];
    
    if (!validActions.includes(action)) {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    const updatedMail = await storage.updateMailStatus(id, action);
    if (!updatedMail) {
      return NextResponse.json({ message: "Mail not found" }, { status: 404 });
    }
    return NextResponse.json(updatedMail);
  } catch (error) {
    console.error("Error updating mail:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
