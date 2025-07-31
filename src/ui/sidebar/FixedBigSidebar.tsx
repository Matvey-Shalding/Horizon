import clsx from 'clsx';
import { m } from 'framer-motion';
import React, { memo } from 'react';
import { Input } from 'ui/Input';
import { Logo } from 'ui/Logo';
import Menu from './Menu';
import ToggleButton from './ToggleButton';
import UserSection from './UserSection';
import MenuItem from 'types/MenuItem.interface';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { SingUp } from 'types/Auth.types';

interface FixedSlidingBigSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  items: MenuItem[];
  pathname: string;
  router: AppRouterInstance;
  user: SingUp | null | undefined;
  onLogout: () => void;
}

const FixedSlidingBigSidebar = React.forwardRef(
  (
    { isOpen, onToggle, items, pathname, router, user, onLogout }: FixedSlidingBigSidebarProps,
    ref: React.Ref<HTMLDivElement>
  ) => (
    <m.div
      ref={ref}
      className={clsx(
        'border-border fixed z-30 flex h-screen w-70 shrink-0 grow-1 -translate-x-full transition-transform',
        'flex-col justify-between overflow-hidden border-r bg-white pt-8 pb-5 duration-500',
        isOpen && 'translate-x-0'
      )}
    >
      <div className="flex h-full basis-full flex-col items-center">
        <div className="flex w-full flex-col gap-y-4">
          <div className="flex items-center justify-between self-stretch px-6">
            <Logo />
            <ToggleButton onClick={onToggle} />
          </div>
          <div className="w-full px-4">
            <m.div className="w-full">
              <Input placeholder="Search..." />
            </m.div>
          </div>
        </div>
        <Menu
          items={items}
          showLabels={true}
          pathname={pathname}
          router={router}
        />
        <UserSection
          user={user}
          showInfo={true}
          onLogout={onLogout}
        />
      </div>
    </m.div>
  )
);

export default memo(FixedSlidingBigSidebar);
