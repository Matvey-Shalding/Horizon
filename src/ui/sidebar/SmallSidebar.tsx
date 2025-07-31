import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import MenuItem from 'types/MenuItem.interface';
import Menu from './Menu';
import ToggleButton from './ToggleButton';
import UserSection from './UserSection';
import clsx from 'clsx';
import { memo } from 'react';

interface StaticSmallSidebarProps {
  onToggle: () => void;
  items: MenuItem[]; // Adjust type based on menuItems structure
  pathname: string;
  router: AppRouterInstance; // Adjust type based on useRouter return
  onLogout: () => void;
}

const SmallSidebar = ({ onToggle, items, pathname, router, onLogout }: StaticSmallSidebarProps) => (
  <div
    className={clsx(
      'border-border static z-30 flex h-screen w-20 shrink-0 grow-1 flex-col',
      'justify-between overflow-hidden border-r bg-white pt-8 pb-5'
    )}
  >
    <div className="flex basis-full flex-col items-center">
      <div className="flex w-full flex-col gap-y-4">
        <div className="border-border flex items-center justify-center self-stretch border-b px-0 pb-4">
          <ToggleButton onClick={onToggle} />
        </div>
      </div>
      <Menu
        items={items}
        showLabels={false}
        pathname={pathname}
        router={router}
      />
      <UserSection
        user={null}
        showInfo={false}
        onLogout={onLogout}
      />
    </div>
  </div>
);

export default memo(SmallSidebar);
