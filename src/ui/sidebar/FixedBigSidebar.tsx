import clsx from "clsx";
import { motion } from "framer-motion";
import React from "react";
import ToggleButton from "./ToggleButton";
import Menu from "./Menu";
import UserSection from "./UserSection";
import { Logo } from 'ui/Logo';
import { Input } from 'ui/Input';

interface FixedSlidingBigSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  items: any[]; // Adjust type based on menuItems structure
  pathname: string;
  router: any; // Adjust type based on useRouter return
  user: any; // Adjust type based on user state structure
  onLogout: () => void;
}

const FixedSlidingBigSidebar = React.forwardRef(
  (
    {
      isOpen,
      onToggle,
      items,
      pathname,
      router,
      user,
      onLogout,
    }: FixedSlidingBigSidebarProps,
    ref: React.Ref<HTMLDivElement>,
  ) => (
    <motion.div
      ref={ref}
      className={clsx(
        "border-border fixed z-30 flex h-screen w-70 shrink-0 grow-1 -translate-x-full flex-col justify-between overflow-hidden border-r bg-white pt-8 pb-5 transition-transform duration-500",
        isOpen && "translate-x-0",
      )}
    >
      <div className="flex basis-full h-full flex-col items-center">
        <div className="flex w-full flex-col gap-y-4">
          <div className="flex items-center justify-between self-stretch px-6">
            <Logo />
            <ToggleButton onClick={onToggle} />
          </div>
          <div className="w-full px-4">
            <motion.div className="w-full">
              <Input placeholder="Search..." />
            </motion.div>
          </div>
        </div>
        <Menu
          items={items}
          showLabels={true}
          pathname={pathname}
          router={router}
        />
        <UserSection user={user} showInfo={true} onLogout={onLogout} />
      </div>
    </motion.div>
  ),
);

export default FixedSlidingBigSidebar;
