'use client';

import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import 'styles/lib/calendar.css';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarPortalProps {
  position: { top: number; left: number };
  dateRange: { from: Date; to: Date } | undefined;
  onSelect: (range: { from: Date; to: Date }) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function CalendarPortal({
  position,
  dateRange,
  onSelect,
  onClose,
  isOpen,
}: CalendarPortalProps) {
  const portalRoot = typeof window !== 'undefined' ? document.getElementById('portal-root') : null;
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!menuRef.current?.contains(target) && !target.closest('._custom_preset')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!portalRoot) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -5 }}
          transition={{ duration: 0.15 }}
          style={{
            top: position.top,
            left: position.left,
          }}
          className={clsx(
            'absolute z-50 w-70 -translate-x-2 -translate-y-full rounded-lg bg-white p-2 shadow-lg min-[768px]:-translate-x-[calc(100%+15px)]'
          )}
        >
          <DayPicker
            disabled={{ after: new Date() }}
            mode="range"
            selected={dateRange}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                onSelect({ from: range.from, to: range.to });
              }
            }}
            defaultMonth={dateRange?.from}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot
  );
}
