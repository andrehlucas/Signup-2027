'use client';

import { OrderProvider } from './context';

export default function AddLocationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrderProvider>
      {children}
    </OrderProvider>
  );
}
