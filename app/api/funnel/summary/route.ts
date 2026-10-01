import { NextResponse } from 'next/server';
import { storage } from '@/server/storage';
import { buildFunnelSummary } from '@/server/funnel-summary';

const FUNNEL_TRACKING_ENABLED = process.env.NEXT_PUBLIC_ENABLE_FUNNEL_TRACKING === 'true';

export async function GET() {
  if (!FUNNEL_TRACKING_ENABLED) {
    return NextResponse.json({
      enabled: false,
      steps: [],
      sessions: { total: 0, completed: 0 },
      trends: [],
      recentEvents: [],
    });
  }

  try {
    const events = await storage.getFunnelEvents();
    const sessions = await storage.getFunnelSessions();

    return NextResponse.json({
      enabled: true,
      ...buildFunnelSummary(events, sessions),
    });
  } catch (error) {
    console.error('Error fetching funnel summary:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
