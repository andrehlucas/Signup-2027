'use client';

import { usePathname } from 'next/navigation';
import { PortalSidebar } from '../portal-components/PortalSidebar';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith('/auth');

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <PortalSidebar />
      <main className="flex-1 overflow-auto pt-16 lg:pt-0 px-0">
        {children}
      </main>
    </div>
  );
}
