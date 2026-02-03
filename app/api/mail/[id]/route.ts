import { NextResponse } from 'next/server';
import { storage } from '@/server/storage';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mail = await storage.getMail(id);
    if (!mail) {
      return NextResponse.json({ message: "Mail not found" }, { status: 404 });
    }
    return NextResponse.json(mail);
  } catch (error) {
    console.error("Error fetching mail:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
