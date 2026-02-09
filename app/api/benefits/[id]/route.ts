import { NextResponse } from 'next/server';
import { storage } from '@/server/storage';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const benefit = await storage.getBenefit(id);
    if (!benefit) {
      return NextResponse.json({ message: "Benefit not found" }, { status: 404 });
    }
    return NextResponse.json(benefit);
  } catch (error) {
    console.error("Error fetching benefit:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
