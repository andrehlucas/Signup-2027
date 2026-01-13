import { PortalSidebar } from './portal/components/PortalSidebar';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <PortalSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
