'use client';

import { useEffect, useState, type RefObject } from 'react';

export function useScrollFooterVisibility({
  enabled = true,
  lockedUntilRef,
}: {
  enabled?: boolean;
  lockedUntilRef?: RefObject<number>;
} = {}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    if (!enabled) return;

    let lastScrollY = window.scrollY;
    const cannotScroll = () => document.documentElement.scrollHeight <= window.innerHeight;
    // The only Continue action must remain reachable if the whole page fits.
    if (cannotScroll()) setVisible(true);

    const handleScroll = () => {
      const currentScrollY = Math.max(0, window.scrollY);
      const delta = currentScrollY - lastScrollY;
      if (Math.abs(delta) < 5) return;
      lastScrollY = currentScrollY;
      if (Date.now() < (lockedUntilRef?.current ?? 0)) return;

      const atBottom = window.innerHeight + currentScrollY >= document.documentElement.scrollHeight - 10;
      if (cannotScroll()) setVisible(true);
      else if (currentScrollY <= 50) setVisible(false);
      else if (delta > 0) setVisible(true);
      else if (!atBottom) setVisible(false);
    };
    const handleResize = () => {
      if (cannotScroll()) setVisible(true);
      else if (window.scrollY <= 50) setVisible(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [enabled, lockedUntilRef]);

  return [visible, setVisible] as const;
}
