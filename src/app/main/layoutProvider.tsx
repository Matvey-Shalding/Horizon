'use client';

import { memo } from 'react';
import ClientLayout from './ClientLayout';
import { ClientProvider } from './clientProvider';

function Layout({ children, isLoading }: { children: React.ReactNode; isLoading: boolean }) {
  return (
    <div>
      <ClientProvider />
      <ClientLayout isLoading={isLoading}>{children}</ClientLayout>
    </div>
  );
}

export const LayoutProvider = memo(Layout);
