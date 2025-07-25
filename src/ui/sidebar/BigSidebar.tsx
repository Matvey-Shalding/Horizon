import { motion } from "framer-motion";
import React from "react";
import Menu from "./Menu";
import SearchInput from "./SearchInput";
import SidebarHeader from "./SidebarHeader";
import UserSection from "./UserSection";

interface SlidingBigSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  items: any[]; // Adjust type based on menuItems structure
  pathname: string;
  router: any; // Adjust type based on useRouter return
  user: any; // Adjust type based on user state structure
  onLogout: () => void;
}

const BigSidebar = React.forwardRef(
  (
    {
      isOpen,
      onToggle,
      items,
      pathname,
      router,
      user,
      onLogout,
    }: SlidingBigSidebarProps,
    ref: React.Ref<HTMLDivElement>,
  ) => (
    <motion.div
      ref={ref}
      className="fixed z-30 h-screen w-70 shrink-0 flex-col justify-between overflow-hidden bg-white pt-8 pb-5"
      initial={{ x: "-100%" }}
      animate={{
        x: isOpen ? 0 : "-100%",
        transition: { duration: 0.4, ease: "easeInOut" },
      }}
      exit={{
        x: "-100%",
        transition: { duration: 0.4, ease: "easeInOut" },
      }}
    >
      <div className="flex basis-full h-full flex-col items-center">
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

export default BigSidebar;
