import type { FunnelEvent, FunnelSession } from '../shared/schema';

const stepOrder = ['your_info', 'pick_location', 'choose_program'] as const;
const stepLabels: Record<(typeof stepOrder)[number], string> = {
  your_info: 'Your Info',
  pick_location: 'Pick Your Location',
  choose_program: 'Choose Your Program',
};

function currentStep(step: string): (typeof stepOrder)[number] | undefined {
  return stepOrder.find((currentStepName) => currentStepName === step);
}

export function buildFunnelSummary(events: FunnelEvent[], sessions: FunnelSession[]) {
  const stepStats = stepOrder.map((step) => {
    const aliasedEvents = events.filter((event) => currentStep(event.step) === step);
    const enterEvents = aliasedEvents.filter((event) => event.eventType === 'enter');
    const completeEvents = aliasedEvents.filter((event) => event.eventType === 'complete');
    const durations = completeEvents
      .filter((event) => event.duration !== null && event.duration !== undefined)
      .map((event) => event.duration as number);

    return {
      step,
      label: stepLabels[step],
      entered: new Set(enterEvents.map((event) => event.sessionId)).size,
      completed: new Set(completeEvents.map((event) => event.sessionId)).size,
      avgDuration: durations.length > 0
        ? Math.round(durations.reduce((total, duration) => total + duration, 0) / durations.length)
        : 0,
    };
  });

  const completedSessionIds = new Set<string>();
  events.forEach((event) => {
    if (event.step === 'choose_program' && event.eventType === 'complete') {
      completedSessionIds.add(event.sessionId);
    }
  });

  const dailyData: Record<string, Record<string, Set<string>>> = {};
  events.forEach((event) => {
    const step = currentStep(event.step);
    if (!step) return;
    const day = event.timestamp.split('T')[0];
    if (!dailyData[day]) dailyData[day] = {};
    if (!dailyData[day][step]) dailyData[day][step] = new Set();
    if (event.eventType === 'enter') dailyData[day][step].add(event.sessionId);
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

  return {
    steps: stepStats,
    sessions: { total: sessions.length, completed: completedSessionIds.size },
    trends,
    recentEvents: [...events]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50)
      .map((event) => ({ ...event })),
  };
}