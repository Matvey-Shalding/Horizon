import { useClickOutside } from '@react-hookz/web';
import clsx from 'clsx';
import Log_out from 'components/icons/sidebar/Log_out';
import SidebarIcon from 'components/icons/sidebar/Sidebar';
import { menuItems } from 'data/menuItems';
import { AnimatePresence, motion } from 'framer-motion';
import { signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AUTH_ROUTES } from 'routes';
import { RootState } from 'state/store';
import { Logo } from 'ui/Logo';
import { Input } from './Input';

export const FullSidebar = ({ isOpen, onClose }: { isOpen: boolean | undefined; onClose: () => void }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.user);
  const banks = useSelector((state: RootState) => state.bank.banks);

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePageHide = (event: PageTransitionEvent) => {
      const dataToSend = { userData: user, userBanks: banks };
      const blob = new Blob([JSON.stringify(dataToSend)], {
        type: 'application/json',
      });
      const success = navigator.sendBeacon('/api/home', blob);

      if (!success) {
        console.warn('sendBeacon failed to queue the data for sending.');
      }
    };

    window.addEventListener('pagehide', handlePageHide);
    return () => window.removeEventListener('pagehide', handlePageHide);
  }, [user, banks]);

  useClickOutside(sidebarRef, () => {
    if (isOpen) {
      onClose();
    }
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={sidebarRef}
          className="border-border fixed z-30 h-screen w-80 shrink-0 flex-col justify-between overflow-hidden border-r bg-white pt-8 pb-5"
          initial={{ x: '-100%' }}
          animate={{ x: 80 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <div className="flex basis-full flex-col items-center">
            <div className="flex w-full flex-col gap-y-6">
              <div className="flex items-end justify-between self-stretch px-6">
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Logo />
                  </motion.div>
                </AnimatePresence>
                <button onClick={onClose}>
                  <SidebarIcon
                    width={24}
                    height={24}
                    className="text-light-gray fill-light-gray cursor-pointer"
                  />
                </button>
              </div>
              <div className="w-full px-4">
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <Input placeholder="Search..." />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <nav
              className={clsx(
                'text-dark-gray fill-light-gray mt-4 mb-6 flex basis-full flex-col self-stretch px-4 font-semibold'
              )}
            >
              {menuItems.map((item, index) => {
                const isActive = pathname.startsWith(item.path);
                return (
                  <motion.button
                    key={index}
                    onClick={() => router.push(item.path)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={clsx(
                      'rounded-main flex items-center gap-x-2 px-4 py-4 transition-colors duration-500 hover:text-white',
                      isActive && 'bg-[linear-gradient(90deg,#0179fe_0%,#4893ff_100%)] fill-white text-white',
                      'hover:bg-light-blue hover:fill-white'
                    )}
                  >
                    <item.icon />
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  </motion.button>
                );
              })}
            </nav>
            <div className="border-border flex items-center justify-center gap-x-4 self-stretch border-t px-2 pt-4">
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col gap-y-0.5">
                    <span className="text-dark-gray text-sm font-semibold">
                      {user ? `${user.firstName?.trim()} ${user.lastName?.trim()}` : 'Loading...'}
                    </span>
                    <span className="text-sm">{user ? user.email?.trim() : ''}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
              <Log_out
                onClick={() => signOut({ callbackUrl: AUTH_ROUTES.LOGIN })}
                width={20}
                height={20}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
