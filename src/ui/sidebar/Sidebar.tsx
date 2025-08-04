import { useSidebar } from 'hooks/useSidebar.hook';
import { memo } from 'react';
import BigSidebar from './BigSidebar';
import FixedSlidingBigSidebar from './FixedBigSidebar';
import SmallSidebar from './SmallSidebar';
import TogglingSidebar from './TogglingSidebar';

const Sidebar = ({ isLoading }: { isLoading: boolean }) => {
  const { isSidebarOpen, toggleSidebar, sidebarRef, commonProps, isLargeScreen, isSmallScreen } = useSidebar({
    isLoading,
  });

  if (isLoading) return null;

  if (isSmallScreen) {
    return (
      <>
        <div
          className="fixed top-4 left-0 z-40 flex gap-x-1 p-2 pl-0 toggle"
          onClick={toggleSidebar}
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
