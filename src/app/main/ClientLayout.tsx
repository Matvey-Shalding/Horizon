'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { authorizationService } from 'services/Authorization.service';
import { RootState } from 'state/store';
import Loader from 'ui/Loader';
import Sidebar from 'ui/sidebar/Sidebar';

export default function ClientLayout({
  children,
  isLoading,
}: {
  children: React.ReactNode;
  isLoading: boolean;
}) {

  if (isLoading) {
    return <Loader visible={isLoading} />;
  }

  return (
    <div className="flex h-screen overflow-y-hidden">
      <Sidebar isLoading={isLoading} />
      {children}
    </div>
  );
}
