'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { FunnelStep, FunnelEventType } from '../../shared/schema';

const TRACKING_ENABLED = process.env.NEXT_PUBLIC_ENABLE_FUNNEL_TRACKING === 'true';

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sessionId = sessionStorage.getItem('funnel_session_id');
  if (!sessionId) {
    sessionId = `fs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('funnel_session_id', sessionId);
  }
  return sessionId;
}

async function sendFunnelEvent(data: {
  sessionId: string;
  step: FunnelStep;
  eventType: FunnelEventType;
  timestamp: string;
  duration?: number;
  metadata?: Record<string, unknown>;
  userAgent?: string;
  referrer?: string;
}) {
  try {
    await fetch('/api/funnel/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {
    // Silently fail - tracking should never break the user experience
  }
}

export function useFunnelTracking(step: FunnelStep) {
  const enterTimeRef = useRef<number>(0);
  const hasSentEnterRef = useRef(false);

  useEffect(() => {
    if (!TRACKING_ENABLED) return;

    const sessionId = getOrCreateSessionId();
    enterTimeRef.current = Date.now();
    hasSentEnterRef.current = true;

    sendFunnelEvent({
      sessionId,
      step,
      eventType: 'enter',
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    });
  }, [step]);

  const trackComplete = useCallback((metadata?: Record<string, unknown>) => {
    if (!TRACKING_ENABLED) return;
    const sessionId = getOrCreateSessionId();
    const duration = Math.round((Date.now() - enterTimeRef.current) / 1000);
    sendFunnelEvent({
      sessionId,
      step,
      eventType: 'complete',
      timestamp: new Date().toISOString(),
      duration,
      metadata,
    });
    hasSentEnterRef.current = false;
  }, [step]);

  return { trackComplete };
}
