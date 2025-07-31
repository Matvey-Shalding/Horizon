'use client';

import { useMediaQuery } from '@react-hookz/web';
import clsx from 'clsx';
import { m } from 'framer-motion';
import { MEDIA_QUERIES } from 'settings/MediaQueries';

interface CancelButtonProps {
  onClick?: () => void;
  className?: string;
  content?: string;
  props?: any;
}

export function CancelButton({ onClick, className, content, props }: CancelButtonProps) {
  const isMobile = useMediaQuery(`(max-width: ${MEDIA_QUERIES.MOBILE})`);

  return (
    <m.button
      type="button"
      onClick={onClick}
      className={clsx(
 ${className || ''} hover:bg-gray-100`,
        className
      )}
      initial={{ scale: 1 }}
      whileHover={
        !isMobile
          ? {
              scale: 1.05,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              transition: { duration: 0.2 },
            }
          : {}
      }
      whileTap={{
        scale: 0.95,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      {...props}
    >
      {content ?? 'Cancel'}
    </m.button>
  );
}
