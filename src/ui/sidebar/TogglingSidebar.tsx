import { motion } from "framer-motion";
import React from "react";
import SidebarHeader from "./SidebarHeader";
import SearchInput from "./SearchInput";
import Menu from "./Menu";
import UserSection from "./UserSection";

interface StaticTogglingSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  items: any[]; // Adjust type based on menuItems structure
  pathname: string;
  router: any; // Adjust type based on useRouter return
  user: any; // Adjust type based on user state structure
  onLogout: () => void;
}

const TogglingSidebar = React.forwardRef(
  (
    {
      isOpen,
      onToggle,
      items,
      pathname,
      router,
      user,
      onLogout,
    }: StaticTogglingSidebarProps,
    ref: React.Ref<HTMLDivElement>,
  ) => (
    <motion.div
      ref={ref}
      className="border-border z-30 flex h-screen shrink-0 grow-1 flex-col justify-between overflow-hidden border-r bg-white pt-8 pb-5"
      initial={{ width: 280 }}
      animate={{ width: isOpen ? 280 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex basis-full flex-col items-center">
        <SidebarHeader isSidebarOpen={isOpen} onToggle={onToggle} />
        <SearchInput isSidebarOpen={isOpen} />
        <Menu
          items={items}
          showLabels={isOpen}
          pathname={pathname}
          router={router}
        />
        <UserSection user={user} showInfo={isOpen} onLogout={onLogout} />
      </div>
    </motion.div>
  ),
);

export default TogglingSidebar;
