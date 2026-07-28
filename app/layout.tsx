import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from '@/app/components/ui/toaster';
import { MobileZoomReset } from '@/app/components/MobileZoomReset';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Opus Virtual Offices - Sign Up',
  description: 'Get your virtual office solution in just 3 easy steps. Professional business address, live call answering, and more.',
  openGraph: {
    title: 'Opus Virtual Offices - Sign Up',
    description: 'Get your virtual office solution in just 3 easy steps. Professional business address, live call answering, and more.',
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
          <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-100 py-5 px-6 shadow-sm">
              <div className="max-w-4xl mx-auto flex items-center justify-center">
                <img src="/opus-vo-main-logo.svg" alt="Opus Virtual Offices" className="h-11" data-testid="img-logo" />
              </div>
            </header>
            <main>
              {children}
            </main>
          </div>
          <Toaster />
          <MobileZoomReset />
        </Providers>
      </body>
    </html>
  );
}
