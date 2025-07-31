import { m } from 'framer-motion';
import { memo, forwardRef } from 'react';
import Menu from './Menu';
import SearchInput from './SearchInput';
import SidebarHeader from './SidebarHeader';
import UserSection from './UserSection';
import MenuItem from 'types/MenuItem.interface';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { SingUp } from 'types/Auth.types';
import clsx from 'clsx';

interface SlidingBigSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  items: MenuItem[];
  pathname: string;
  router: AppRouterInstance;
  user: SingUp | null | undefined;
  onLogout: () => void;
}

const BigSidebar = forwardRef(
  (
    { isOpen, onToggle, items, pathname, router, user, onLogout }: SlidingBigSidebarProps,
    ref: React.Ref<HTMLDivElement>
  ) => (
    <m.div
      ref={ref}
      className={clsx("fixed z-30 h-screen w-70 shrink-0 flex-col justify-between", "overflow-hidden bg-white pt-8 pb-5")}
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div className="flex h-full basis-full flex-col items-center">
        <SidebarHeader
          isSidebarOpen={isOpen}
          onToggle={onToggle}
        />
        <SearchInput isSidebarOpen={isOpen} />
        <Menu
          items={items}
          showLabels={isOpen}
          pathname={pathname}
          router={router}
        />
        <UserSection
          user={user}
          showInfo={isOpen}
          onLogout={onLogout}
        />
      </div>
    </m.div>
  )
);

export default memo(BigSidebar);
