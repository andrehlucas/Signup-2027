'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start loading animation
    setIsLoading(true);
    setProgress(0);

    // Simulate progress with faster initial movement
    const timer1 = setTimeout(() => setProgress(40), 100);
    const timer2 = setTimeout(() => setProgress(70), 300);
    const timer3 = setTimeout(() => setProgress(90), 600);

    // Complete loading after minimum visibility time
    const completeTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 300);
    }, 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(completeTimer);
    };
  }, [pathname, searchParams]);

  if (!isLoading && progress === 0) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[3px] bg-blue-light400 transition-all duration-200 ease-out z-[9999]"
      data-testid="navigation-progress-bar"
      style={{
        width: `${progress}%`,
        boxShadow: '0 0 10px rgba(54, 191, 249, 0.8), 0 0 5px rgba(54, 191, 249, 0.6)',
      }}
    />
  );
}
