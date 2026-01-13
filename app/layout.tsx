import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from '@/app/components/ui/toaster';
import { NavigationProgress } from '@/app/components/NavigationProgress';
import { PortalSidebar } from './portal-components/PortalSidebar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Opus Virtual Offices - Customer Portal',
  description: 'Manage your virtual office services, locations, and account settings in the Opus VO customer portal.',
  openGraph: {
    title: 'Opus Virtual Offices - Customer Portal',
    description: 'Manage your virtual office services, locations, and account settings in the Opus VO customer portal.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          <NavigationProgress />
          <div className="flex min-h-screen bg-gray-50">
            <PortalSidebar />
            <main className="flex-1 overflow-auto pt-16 lg:pt-0">
              {children}
            </main>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
