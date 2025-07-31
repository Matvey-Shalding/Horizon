import { useClickOutside, useMediaQuery } from '@react-hookz/web';
import { menuItems } from 'data/menuItems';
import { signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { AUTH_ROUTES } from 'routes';
import { MEDIA_QUERIES } from 'settings/MediaQueries';
import { RootState } from 'state/store';
import BigSidebar from './BigSidebar';
import FixedSlidingBigSidebar from './FixedBigSidebar';
import FixedSmallSidebar from './FixedSmallSidebar';
import SmallSidebar from './SmallSidebar';
import TogglingSidebar from './TogglingSidebar';

interface SidebarProps {
  isLoading: boolean;
}

const Sidebar = ({ isLoading }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user.user);
  const banks = useSelector((state: RootState) => state.bank.banks);

  const isLargeScreen = useMediaQuery(`(min-width:${MEDIA_QUERIES.LARGE_DESKTOPS})`);
  const isSmallScreen = useMediaQuery(`(max-width:${MEDIA_QUERIES.SMALL_DESKTOPS})`);

  const [isSidebarOpen, setIsSidebarOpen] = useState(Boolean(isLargeScreen));
  const sidebarRef = useRef<HTMLDivElement>(null);

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
    };
    window.addEventListener('pagehide', handlePageHide);
    return () => window.removeEventListener('pagehide', handlePageHide);
  }, [user, banks]);

  if (isLoading) return null;

  useClickOutside(sidebarRef, () => {
    if (isSmallScreen) {
      setIsSidebarOpen(false);
    }
  });

  const onToggle = () => setIsSidebarOpen(!isSidebarOpen);
  const onLogout = () => signOut({ callbackUrl: AUTH_ROUTES.LOGIN });

  if (isSmallScreen) {
    return (
      <Fragment>
        <div
          className="fixed top-4 left-0 z-40 flex gap-x-1 p-2 pl-0"
          onClick={onToggle}
        >
          <div className="bg-border rounded-r-main h-10 w-1"></div>
        </div>
        {!isSmallScreen && (
          <FixedSmallSidebar
            items={menuItems}
            pathname={pathname}
            router={router}
            onLogout={onLogout}
          />
        )}
        <BigSidebar
          isOpen={isSidebarOpen}
          onToggle={onToggle}
          items={menuItems}
          pathname={pathname}
          router={router}
          user={user}
          onLogout={onLogout}
          ref={sidebarRef}
        />
      </Fragment>
    );
  }

  if (isLargeScreen) {
    return (
      <TogglingSidebar
        isOpen={isSidebarOpen}
        onToggle={onToggle}
        items={menuItems}
        pathname={pathname}
        router={router}
        user={user}
        onLogout={onLogout}
        ref={sidebarRef}
      />
    );
  }

  return (
    <>
      <SmallSidebar
        onToggle={onToggle}
        items={menuItems}
        pathname={pathname}
        router={router}
        onLogout={onLogout}
      />
      <FixedSlidingBigSidebar
        isOpen={isSidebarOpen}
        onToggle={onToggle}
        items={menuItems}
        pathname={pathname}
        router={router}
        user={user}
        onLogout={onLogout}
        ref={sidebarRef}
      />
    </>
  );
};

export default React.memo(Sidebar);
