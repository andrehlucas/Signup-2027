import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from '@/app/components/ui/toaster';
import { Navbar } from '@/app/components/Navbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Opus Virtual Offices - Professional Business Solutions',
  description: 'Discover premium virtual office solutions with Opus VO. Get a prestigious business address, professional live call answering, and more.',
  openGraph: {
    title: 'Opus Virtual Offices - Professional Business Solutions',
    description: 'Discover premium virtual office solutions with Opus VO. Get a prestigious business address, professional live call answering, and more.',
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
          <Navbar />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
