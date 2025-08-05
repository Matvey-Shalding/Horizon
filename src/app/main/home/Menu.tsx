import clsx from 'clsx';
import Delete from 'components/icons/main/home/delete';
import Edit from 'components/icons/main/home/edit';
import { MENU_STATUSES, MenuStatus } from 'constants/menuStatuses';
import { AnimatePresence, m } from 'framer-motion';
import { SetStateAction, useEffect, useRef } from 'react';

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
  const menuRef = useRef<HTMLDivElement>(null);

  // close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !(event.target as Element).classList.contains('_dropdown')
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          ref={menuRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={clsx(
            'absolute right-0 z-10 mt-2 w-44 overflow-hidden',
            'flex flex-col rounded-lg border border-gray-200 bg-white shadow-lg'
          )}
        >
          <span className="text-dark border-border inline-block border-b pt-1.5 pb-1 pl-2.5 font-medium">
            Actions:
          </span>
          <div className="flex flex-col">
            <m.button
              onClick={() => {
                setStatus(MENU_STATUSES.EDIT);
                setOpen(false);
              }}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              className={clsx(
                'flex items-center gap-2 px-4 py-2.5 text-sm',
                'font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100'
              )}
            >
              <m.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <Edit
                  width={16}
                  height={16}
                  className="stroke-gray-600"
                />
              </m.div>
              Edit
            </m.button>
            <m.button
              onClick={() => {
                setStatus(MENU_STATUSES.DELETE);
                setOpen(false);
              }}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 text-sm',
                'font-medium text-red-600 transition-all duration-200 hover:bg-red-100'
              )}
            >
              <m.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <Delete
                  width={16}
                  height={16}
                  className="stroke-red-600"
                />
              </m.div>
              Delete
            </m.button>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
