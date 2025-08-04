import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import { AnimatePresence, m } from 'framer-motion';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { memo, useCallback } from 'react';
import 'styles/lib/tooltip.css';
import 'tippy.js/dist/tippy.css'; // basic styling
import MenuItem from 'types/MenuItem.interface';

interface MenuProps {
  items: MenuItem[];
  showLabels: boolean;
  pathname: string;
  router: AppRouterInstance;
}

const Menu = ({ items, showLabels, pathname, router }: MenuProps) => {
  const handleClick = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  return (
    <nav
      className={clsx(
        'text-dark-gray fill-light-gray mb-6 flex h-full',
        'basis-full flex-col self-stretch px-4 font-semibold',
        {
          'items-center justify-center px-0': !showLabels,
          'mt-4': showLabels,
        }
      )}
    >
      {items.map((item) => {
        const isActive = pathname.startsWith(item.path);

        return (
          <m.button
            key={item.path}
            onClick={() => handleClick(item.path)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={clsx(
              'rounded-main flex items-center gap-x-2 px-4 py-4',
              'transition-colors duration-500 hover:text-white',
              {
                'justify-center': !showLabels,
                'hover:fill-blue': !showLabels && !isActive,
                'hover:bg-light-blue hover:fill-white': showLabels,
                'bg-[linear-gradient(90deg,#0179fe_0%,#4893ff_100%)] fill-white text-white': isActive,
              }
            )}
          >
            {showLabels ? (
              <item.icon
                width={24}
                height={24}
              />
            ) : (
              <Tippy
                content={item.label}
                placement="top"
                delay={100}
              >
                <span className="inline-flex">
                  <item.icon
                    width={24}
                    height={24}
                  />
                </span>
              </Tippy>
            )}

            <AnimatePresence>
              {showLabels && (
                <m.span
                  layout
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {item.label}
                </m.span>
              )}
            </AnimatePresence>
          </m.button>
        );
      })}
    </nav>
  );
};

export default memo(Menu);
