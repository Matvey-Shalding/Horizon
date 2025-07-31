'use client';

import { memo } from 'react';
import { useMediaQuery } from '@react-hookz/web';
import clsx from 'clsx';
import { m } from 'framer-motion';
import { MEDIA_QUERIES } from 'settings/MediaQueries';

interface ButtonProps {
  content: string;
  className?: string;
  onClick?: () => void;
}

function Button({ content, className, onClick }: ButtonProps) {
  const isMobile = useMediaQuery(`(max-width: ${MEDIA_QUERIES.MOBILE})`);

  return (
    <m.button
      type="button"
      onClick={onClick}
      className={clsx(
        'rounded-main gradient min-h-11 w-full text-base/normal text-white disabled:cursor-not-allowed',
        className
      )}
      initial={{ scale: 1 }}
      whileHover={
        !isMobile
          ? {
              scale: 1.1,
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
              backgroundColor: '#ff5500',
              transition: { duration: 0.3 },
            }
          : {}
      }
      whileTap={{
        scale: 0.95,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
    >
      {content}
    </m.button>
  );
}

export default memo(Button);
