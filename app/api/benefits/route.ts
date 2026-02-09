import { NextResponse } from 'next/server';
import { storage } from '@/server/storage';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const benefits = await storage.getBenefits(category);
    return NextResponse.json(benefits);
  } catch (error) {
    console.error("Error fetching benefits:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
