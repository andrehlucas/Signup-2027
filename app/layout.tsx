import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from '@/app/components/ui/toaster';

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
            <header className="bg-white border-b border-gray-200 py-4 px-6">
              <div className="max-w-4xl mx-auto flex items-center justify-center">
                <img src="/opus-vo-main-logo-white.svg" alt="Opus Virtual Offices" className="h-10 brightness-0" data-testid="img-logo" />
              </div>
            </header>
            <main>
              {children}
            </main>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
