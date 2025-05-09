import Delete from "components/icons/main/home/delete";
import Edit from "components/icons/main/home/edit";
import { MENU_STATUSES, MenuStatus } from "constants/MenuStatuses";
import { AnimatePresence, motion } from "framer-motion";
import { SetStateAction } from "react";

export function Menu({
  status,
  setStatus,
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  status: MenuStatus;
  setStatus: React.Dispatch<SetStateAction<MenuStatus>>;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute right-0 z-10 mt-2 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          <div className="flex flex-col">
            <motion.button
              onClick={() => {
                setStatus(MENU_STATUSES.EDIT);
                setOpen(false);
              }}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100"
            >
              <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <Edit width={16} height={16} className="stroke-gray-600" />
              </motion.div>
              Edit
            </motion.button>
            <motion.button
              onClick={() => {
                setStatus(MENU_STATUSES.DELETE);
                setOpen(false);
              }}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-100"
            >
              <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                <Delete width={16} height={16} className="stroke-red-600" />
              </motion.div>
              Delete
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
