import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Log_out from 'components/icons/sidebar/Log_out';
import { menuItems } from 'data/menuItems';
import { Logo } from 'ui/Logo';
import { signOut } from 'next-auth/react';
import clsx from 'clsx';
import { AUTH_ROUTES } from 'routes';

export const SmallSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <motion.div
      className="border-border fixed z-20 h-screen w-20 shrink-0 flex-col justify-between overflow-hidden border-r bg-white pt-8 pb-5"
      initial={{ x: 0 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="flex basis-full flex-col items-center">
        <div className="flex w-full flex-col gap-y-4">
          <div className="border-border flex items-center justify-center self-stretch border-b px-0 pb-4">
            <Logo />
          </div>
        </div>
        <nav className="text-dark-gray fill-light-gray mb-6 flex basis-full flex-col items-center justify-center px-0 font-semibold">
          {menuItems.map((item, index) => {
            const isActive = pathname.startsWith(item.path);
            return (
              <motion.button
                key={index}
                onClick={() => router.push(item.path)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={clsx(
                  'rounded-main flex items-center justify-center gap-x-2 px-4 py-4 transition-colors duration-500 hover:text-white',
                  !isActive && 'hover:fill-blue',
                  isActive && 'bg-[linear-gradient(90deg,#0179fe_0%,#4893ff_100%)] fill-white text-white'
                )}
              >
                <item.icon />
              </motion.button>
            );
          })}
        </nav>
        <div className="border-border flex items-center justify-center gap-x-4 self-stretch border-t px-2 pt-4">
          <Log_out
            onClick={() => signOut({ callbackUrl: AUTH_ROUTES.LOGIN })}
            width={20}
            height={20}
          />
        </div>
      </div>
    </motion.div>
  );
};
