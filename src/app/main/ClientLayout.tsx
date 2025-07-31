'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  const dispatch = useDispatch();

  useEffect(() => {
    const handlePageHide = (event: PageTransitionEvent) => {
      const dataToSend = { userData: user, userBanks: banks };
      const blob = new Blob([JSON.stringify(dataToSend)], {
        type: 'application/json',
      });

      const success = navigator.sendBeacon('/api/home', blob);

      if (!success) {
        console.warn('sendBeacon failed to queue the data for sending.');
      }

      const start = Date.now();
      while (Date.now() - start < 300) {} // 300ms delay
    };

    window.addEventListener('pagehide', handlePageHide);
    return () => window.removeEventListener('pagehide', handlePageHide);
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
