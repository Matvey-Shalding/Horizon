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
  const user = useSelector((state: RootState) => state.user.user);
  const banks = useSelector((state: RootState) => state.bank.banks);

  useEffect(() => {
    const handlePageHideWithParams = (e: PageTransitionEvent) => {
      authorizationService.handlePageHide(user, banks);
    };
    window.addEventListener('pagehide', handlePageHideWithParams);
    return () => window.removeEventListener('pagehide', handlePageHideWithParams);
  }, [user, banks]);

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
