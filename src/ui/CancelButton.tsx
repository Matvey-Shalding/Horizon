'use client';

import { useMediaQuery } from '@react-hookz/web';
import clsx from 'clsx';
import { HTMLMotionProps, m } from 'framer-motion';
import { memo } from 'react';
import { MEDIA_QUERIES } from 'settings/MediaQueries';

interface CancelButtonProps {
  onClick?: () => void;
  className?: string;
  content?: string;
  props?: HTMLMotionProps<'button'>;
}

function Button({ onClick, className, content, props }: CancelButtonProps) {
  const isMobile = useMediaQuery(`(max-width: ${MEDIA_QUERIES.MOBILE})`);

  return (
    <m.button
      type="button"
      onClick={onClick}
      className={clsx(
        'shadow-main text-dark-gray rounded-main border-border min-h-11 border px-3 text-base/normal font-semibold',
        className
      )}
      initial={{ scale: 1 }}
      whileHover={
        !isMobile
          ? {
              scale: 1.05,
              boxShadow: '0 6px 12  px rgba(0, 0, 0, 0.15)',
              transition: { duration: 0.3 },
              background: '#f1f1f1',
            }
          : {}
      }
      whileTap={{
        scale: 0.95,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      {...props}
    >
      {content ?? 'Cancel'}
    </m.button>
  );
}

export const CancelButton = memo(Button);
