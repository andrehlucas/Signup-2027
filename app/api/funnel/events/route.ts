import { NextResponse } from 'next/server';
import { storage } from '@/server/storage';

const FUNNEL_TRACKING_ENABLED = process.env.NEXT_PUBLIC_ENABLE_FUNNEL_TRACKING === 'true';

export async function POST(request: Request) {
  if (!FUNNEL_TRACKING_ENABLED) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    const body = await request.json();
    const { sessionId, step, eventType, timestamp, duration, metadata, userAgent, referrer } = body;

    if (!sessionId || !step || !eventType || !timestamp) {
      return NextResponse.json(
        { message: 'sessionId, step, eventType, and timestamp are required' },
        { status: 400 }
      );
    }

    let session = await storage.getFunnelSession(sessionId);
    if (!session) {
      session = await storage.createFunnelSession({
        id: Math.random().toString(36).substr(2, 9),
        sessionId,
        startedAt: timestamp,
        lastSeenAt: timestamp,
        userAgent: userAgent || null,
        referrer: referrer || null,
        completed: false,
      });
    } else {
      await storage.updateFunnelSession(sessionId, { lastSeenAt: timestamp });
    }

    if (step === 'thank_you' && eventType === 'enter') {
      await storage.updateFunnelSession(sessionId, { completed: true, lastSeenAt: timestamp });
    }

    const event = await storage.createFunnelEvent({
      id: Math.random().toString(36).substr(2, 9),
      sessionId,
      step,
      eventType,
      timestamp,
      duration: duration || null,
      metadata: metadata ? JSON.stringify(metadata) : null,
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error logging funnel event:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
