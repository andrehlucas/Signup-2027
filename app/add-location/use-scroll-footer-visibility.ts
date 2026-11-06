'use client';

import { useEffect, useState, type MutableRefObject } from 'react';

export function useScrollFooterVisibility({
  enabled = true,
  lockedUntilRef,
}: {
  enabled?: boolean;
  lockedUntilRef?: MutableRefObject<number>;
} = {}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    if (!enabled) return;

    // Safari reports offsets beyond either edge while rubber-banding. The
    // rebound from below the page is not an intentional upward scroll.
    const clampScrollY = (y: number) => Math.min(
      Math.max(0, y),
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight),
    );
    let lastScrollY = clampScrollY(window.scrollY);
    const cannotScroll = () => document.documentElement.scrollHeight <= window.innerHeight;
    // The only Continue action must remain reachable if the whole page fits.
    if (cannotScroll()) setVisible(true);

    const handleScroll = () => {
      const currentScrollY = clampScrollY(window.scrollY);
      // Clamp the previous offset too: Safari's browser toolbar can resize
      // the viewport and change the bottom boundary between scroll events.
      const delta = currentScrollY - clampScrollY(lastScrollY);
      if (Math.abs(delta) < 5) return;
      lastScrollY = currentScrollY;
      if (delta < 0 && lockedUntilRef) lockedUntilRef.current = 0;
      if (cannotScroll()) setVisible(true);
      else if (currentScrollY <= 50) setVisible(false);
      // Intentional upward scrolling takes priority over bundle-total feedback.
      else if (delta < 0) setVisible(false);
      else if (Date.now() >= (lockedUntilRef?.current ?? 0)) setVisible(true);
    };
    const handleResize = () => {
      lastScrollY = clampScrollY(window.scrollY);
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
