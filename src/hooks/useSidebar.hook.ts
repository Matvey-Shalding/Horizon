import { useMediaQuery } from '@react-hookz/web';
import { menuItems } from 'data/menuItems';
import { signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { AUTH_ROUTES } from 'routes';
import { MEDIA_QUERIES } from 'settings/MediaQueries';
import { RootState } from 'state/store';
import { SingUp } from 'types/Auth.types';
import MenuItem from 'types/MenuItem.interface';

interface UseSidebarLogicProps {
  isLoading: boolean;
}

interface SidebarLogicReturn {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  sidebarRef: React.RefObject<HTMLDivElement>;
  commonProps: {
    isOpen: boolean;
    onToggle: () => void;
    items: MenuItem[];
    pathname: string;
    router: ReturnType<typeof useRouter>;
    user: SingUp | null | undefined;
    onLogout: () => void;
  };
  isLargeScreen: boolean | undefined;
  isSmallScreen: boolean | undefined;
}

function useClickOutsideExcept(
  ref: React.RefObject<HTMLElement>,
  onClickOutside: () => void,
  exceptSelector: string
) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (ref.current && !ref.current.contains(target) && !target.closest(exceptSelector)) {
        onClickOutside();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, onClickOutside, exceptSelector]);
}

export function useSidebar({ isLoading }: UseSidebarLogicProps): SidebarLogicReturn {
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user.user);
  const isLargeScreen = useMediaQuery(`(min-width:${MEDIA_QUERIES.LARGE_DESKTOPS})`);
  const isSmallScreen = useMediaQuery(`(max-width:${MEDIA_QUERIES.SMALL_DESKTOPS})`);

  const [isSidebarOpen, setIsSidebarOpen] = useState(!!isLargeScreen);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);

  // Update sidebar open state on screen size change (optional, depending on UX)
  useEffect(() => {
    setIsSidebarOpen(!!isLargeScreen);
  }, [isLargeScreen]);

  // Close sidebar on outside click except toggle button div, only on small screens
  useClickOutsideExcept(
    sidebarRef,
    () => {
      if (isSmallScreen) setIsSidebarOpen(false);
    },
    '.toggle'
  );

  const commonProps = useMemo(
    () => ({
      isOpen: isSidebarOpen,
      onToggle: toggleSidebar,
      items: menuItems,
      pathname,
      router,
      user,
      onLogout: () => signOut({ callbackUrl: AUTH_ROUTES.LOGIN }),
    }),
    [isSidebarOpen, pathname, router, user, toggleSidebar]
  );

  return { isSidebarOpen, toggleSidebar, sidebarRef, commonProps, isLargeScreen, isSmallScreen };
}
