import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface MenuProps {
  items: MenuItem[];
  showLabels: boolean;
  pathname: string;
  router: ReturnType<typeof useRouter>;
}

const Menu = ({ items, showLabels, pathname, router }: MenuProps) => (
  <nav
    className={clsx(
      'text-dark-gray fill-light-gray mb-6 flex h-full basis-full flex-col self-stretch px-4 font-semibold',
      !showLabels ? 'items-center justify-center px-0' : 'mt-4'
    )}
  >
    {items.map((item, index) => {
      const isActive = pathname.startsWith(item.path);
      return (
        <motion.button
          key={index}
          onClick={() => router.push(item.path)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={clsx(
            'rounded-main flex items-center gap-x-2 px-4 py-4 transition-colors duration-500 hover:text-white',
            !showLabels && 'justify-center',
            !showLabels && !isActive && 'hover:fill-blue',
            showLabels && 'hover:bg-light-blue hover:fill-white',
            isActive && 'bg-[linear-gradient(90deg,#0179fe_0%,#4893ff_100%)] fill-white text-white'
          )}
        >
          <item.icon />
          <AnimatePresence>
            {showLabels && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      );
    })}
  </nav>
);

export default Menu;
