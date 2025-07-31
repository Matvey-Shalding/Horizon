import clsx from 'clsx';
import { m } from 'framer-motion';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import React, { memo } from 'react';
import { SingUp } from 'types/Auth.types';
import MenuItem from 'types/MenuItem.interface';
import Menu from './Menu';
import SearchInput from './SearchInput';
import SidebarHeader from './SidebarHeader';
import UserSection from './UserSection';

interface StaticTogglingSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  items: MenuItem[];
  pathname: string;
  router: AppRouterInstance;
  user: SingUp | null | undefined;
  onLogout: () => void;
}

const TogglingSidebar = React.forwardRef(
  (
    { isOpen, onToggle, items, pathname, router, user, onLogout }: StaticTogglingSidebarProps,
    ref: React.Ref<HTMLDivElement>
  ) => (
    <m.div
      ref={ref}
      className={clsx(
        'border-border z-30 flex h-screen shrink-0 grow-1',
        'flex-col justify-between overflow-hidden border-r bg-white pt-8 pb-5'
      )}
      initial={{ width: 280 }}
      animate={{ width: isOpen ? 280 : 80 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="flex basis-full flex-col items-center">
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

export default memo(TogglingSidebar);
