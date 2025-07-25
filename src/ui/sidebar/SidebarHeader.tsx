import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "ui/Logo";
import ToggleButton from "./ToggleButton";

interface SidebarHeaderProps {
  isSidebarOpen: boolean;
  onToggle: () => void;
}

const SidebarHeader = ({ isSidebarOpen, onToggle }: SidebarHeaderProps) => (
  <div
    className={clsx(
      "flex items-center justify-between self-stretch px-6",
      !isSidebarOpen &&
        "border-border justify-center border-b border-solid px-0 pb-4",
    )}
  >
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mb-4" // Added 16px margin-bottom
        >
          <Logo />
        </motion.div>
      )}
    </AnimatePresence>
    <ToggleButton onClick={onToggle} />
  </div>
);

export default SidebarHeader;
