import { useClickOutside, useMediaQuery } from '@react-hookz/web';
import { menuItems } from 'data/menuItems';
import { signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { AUTH_ROUTES } from 'routes';
import { MEDIA_QUERIES } from 'settings/MediaQueries';
import { RootState } from 'state/store';
import { SingUp } from 'types/Auth.types';
import MenuItem from 'types/MenuItem.interface';
import BigSidebar from './BigSidebar';
import FixedSlidingBigSidebar from './FixedBigSidebar';
import SmallSidebar from './SmallSidebar';
import TogglingSidebar from './TogglingSidebar';

interface CommonSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  items: MenuItem[];
  pathname: string;
  router: ReturnType<typeof useRouter>;
  user: SingUp | null | undefined;
  onLogout: () => void;
}

const Sidebar = ({ isLoading }: { isLoading: boolean }) => {
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user.user);
  const banks = useSelector((state: RootState) => state.bank.banks);

  const isLargeScreen = useMediaQuery(`(min-width:${MEDIA_QUERIES.LARGE_DESKTOPS})`);
  const isSmallScreen = useMediaQuery(`(max-width:${MEDIA_QUERIES.SMALL_DESKTOPS})`);

  const [isSidebarOpen, setIsSidebarOpen] = useState(!!isLargeScreen);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const commonProps = useMemo<CommonSidebarProps>(
    () => ({
      isOpen: isSidebarOpen,
      onToggle: useCallback(() => setIsSidebarOpen((prev) => !prev), []),
      items: menuItems,
      pathname,
      router,
      user,
      onLogout: useCallback(() => signOut({ callbackUrl: AUTH_ROUTES.LOGIN }), []),
    }),
    [isSidebarOpen, pathname, router, user]
  );

  useClickOutside(sidebarRef, () => {
    if (isSmallScreen) {
      setIsSidebarOpen(false);
    }
  });

  if (isLoading) return null;

  if (isSmallScreen) {
    return (
      <>
        <div
          className="fixed top-4 left-0 z-40 flex gap-x-1 p-2 pl-0"
          onClick={commonProps.onToggle}
        >
          <div className="bg-border rounded-r-main h-10 w-1" />
        </div>
        <BigSidebar
          {...commonProps}
          ref={sidebarRef}
        />
      </>
    );
  }

  if (isLargeScreen) {
    return (
      <TogglingSidebar
        {...commonProps}
        ref={sidebarRef}
      />
    );
  }

  return (
    <>
      <SmallSidebar {...commonProps} />
      <FixedSlidingBigSidebar
        {...commonProps}
        ref={sidebarRef}
      />
    </>
  );
};

export default memo(Sidebar);
