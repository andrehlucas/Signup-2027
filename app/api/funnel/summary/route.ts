import { NextResponse } from 'next/server';
import { storage } from '@/server/storage';

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

    const stepOrder = ['your_info', 'pick_plan', 'customize', 'checkout'];
    const stepLabels: Record<string, string> = {
      your_info: 'Your Info',
      pick_plan: 'Pick Your Plan',
      customize: 'Customize',
      checkout: 'Checkout',
    };

    const stepStats = stepOrder.map((step) => {
      const enterEvents = events.filter((e) => e.step === step && e.eventType === 'enter');
      const completeEvents = events.filter((e) => e.step === step && e.eventType === 'complete');
      const uniqueEnterSessions = new Set(enterEvents.map((e) => e.sessionId)).size;
      const uniqueCompleteSessions = new Set(completeEvents.map((e) => e.sessionId)).size;

      const durations = completeEvents
        .filter((e) => e.duration !== null && e.duration !== undefined)
        .map((e) => e.duration as number);
      const avgDuration =
        durations.length > 0
          ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
          : 0;

      return {
        step,
        label: stepLabels[step] || step,
        entered: uniqueEnterSessions,
        completed: uniqueCompleteSessions,
        avgDuration,
      };
    });

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter((s) => s.completed).length;

    const dailyData: Record<string, Record<string, Set<string>>> = {};
    events.forEach((e) => {
      const day = e.timestamp.split('T')[0];
      if (!dailyData[day]) dailyData[day] = {};
      if (!dailyData[day][e.step]) dailyData[day][e.step] = new Set();
      if (e.eventType === 'enter') {
        dailyData[day][e.step].add(e.sessionId);
      }
    });

    const trends = Object.entries(dailyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, steps]) => {
        const row: Record<string, number | string> = { date };
        stepOrder.forEach((step) => {
          row[step] = steps[step] ? steps[step].size : 0;
        });
        return row;
      });

    return NextResponse.json({
      enabled: true,
      steps: stepStats,
      sessions: { total: totalSessions, completed: completedSessions },
      trends,
      recentEvents: events
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 50),
    });
  } catch (error) {
    console.error('Error fetching funnel summary:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
