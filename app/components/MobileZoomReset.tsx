'use client';

import { useEffect } from 'react';

export function MobileZoomReset() {
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    let viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      viewportMeta.content = 'width=device-width, initial-scale=1';
      document.head.appendChild(viewportMeta);
    }
    const originalContent = viewportMeta.content;

    function resetZoom() {
      if (!viewportMeta) return;
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (viewportMeta) {
            viewportMeta.setAttribute('content', originalContent);
          }
        }, 200);
      });
    }

    function handleBlur(e: Event) {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        setTimeout(resetZoom, 50);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          (target as HTMLInputElement).blur();
        }
      }
    }

    document.addEventListener('blur', handleBlur, true);
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('blur', handleBlur, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  return null;
}
