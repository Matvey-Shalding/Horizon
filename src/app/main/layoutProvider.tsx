'use client';

import ClientLayout from './ClientLayout';
import { ClientProvider } from './clientProvider';

export function LayoutProvider({ children, isLoading }: { children: React.ReactNode; isLoading: boolean }) {
  return (
    <div>
      <ClientProvider />
      <ClientLayout isLoading={isLoading}>{children}</ClientLayout>
    </div>
  );
}
