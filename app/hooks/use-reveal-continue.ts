'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** Reveal the next action after an explicit selection, not on page load. */
export function useRevealContinue() {
  const continueRef = useRef<HTMLButtonElement>(null);
  const [request, setRequest] = useState(0);
  const revealContinue = useCallback(() => setRequest(value => value + 1), []);

  useEffect(() => {
    if (request === 0) return;

    // Wait for the selection and enabled button to be committed to the DOM.
    const frame = requestAnimationFrame(() => {
      const button = continueRef.current;
      if (!button || button.disabled) return;
      const bounds = button.getBoundingClientRect();
      const viewportTop = window.visualViewport?.offsetTop ?? 0;
      const viewportBottom = viewportTop + (window.visualViewport?.height ?? window.innerHeight);
      if (bounds.top >= viewportTop + 16 && bounds.bottom <= viewportBottom - 16) return;

      button.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [request]);

  return { continueRef, revealContinue };
}