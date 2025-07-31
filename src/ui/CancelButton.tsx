'use client';

import { motion } from 'framer-motion';
import { useMediaQuery } from '@react-hookz/web';
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
    <motion.button
      type="button"
      onClick={onClick}
      className={`rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100 ${className || ''}`}
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
    </motion.button>
  );
}
