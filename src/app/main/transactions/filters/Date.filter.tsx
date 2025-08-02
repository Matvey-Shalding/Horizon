'use client';

import { useMediaQuery } from '@react-hookz/web';
import clsx from 'clsx';
import Arrow from 'components/icons/main/transactions/arrow';
import Custom from 'components/icons/main/transactions/calendar/custom';
import { AnimatePresence, m } from 'framer-motion';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import 'react-day-picker/dist/style.css';
import { MEDIA_QUERIES } from 'settings/MediaQueries';
import 'styles/lib/calendar.css';
import CalendarPortal from './Calendar';
import { dateFilterPresets } from 'data/dateFilterPresets';

/**
 * Props for the DateFilter component.
 */
interface DateFilterProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  datePreset: 'today' | 'last7' | 'last30Days' | null;
  dateRange: { from: Date; to: Date } | undefined;
  setDatePreset: (preset: 'today' | 'last7' | 'last30Days') => void;
  setDateRange: (range: { from: Date; to: Date } | undefined) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: Dispatch<SetStateAction<boolean>>;
}

export function DateFilter({
  isOpen,
  setIsOpen,
  datePreset,
  dateRange,
  setDatePreset,
  setDateRange,
  isCalendarOpen,
  setIsCalendarOpen,
}: DateFilterProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const isSmallLaptop = useMediaQuery(`(max-width:${MEDIA_QUERIES.SMALL_DESKTOPS})`);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, [setIsOpen]);

  const handleCloseCalendar = useCallback(() => {
    setIsCalendarOpen(false);
  }, [setIsCalendarOpen]);

  const handleSelectDateRange = useCallback(
    (range: { from?: Date; to?: Date }) => {
      if (range?.from && range?.to) {
        setDateRange({ from: range.from, to: range.to });
        setIsCalendarOpen(false);
      }
    },
    [setDateRange, setIsCalendarOpen]
  );

  const handleSetDatePreset = useCallback(
    (preset: 'today' | 'last7' | 'last30Days') => {
      setDatePreset(preset);
      setIsCalendarOpen(false);
    },
    [setDatePreset, setIsCalendarOpen]
  );

  const handleToggleCalendar = useCallback(() => {
    setIsCalendarOpen((prev) => !prev);
  }, [setIsCalendarOpen]);

  useEffect(() => {
    if (isOpen) {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect) {
        setPosition({
          top: rect.bottom - (isSmallLaptop ? rect.height : 0),
          left: rect.left,
        });
      }
    }
  }, [isOpen, isSmallLaptop]);

  return (
    <div className="flex flex-col gap-y-2">
      <CalendarPortal
        isOpen={isCalendarOpen}
        onClose={handleCloseCalendar}
        dateRange={dateRange}
        onSelect={handleSelectDateRange}
        position={position}
      />
      <label
        className={clsx(
          'flex cursor-pointer items-center justify-between select-none',
          'border-border border-t pt-2.5',
          isOpen && 'border-b pb-1'
        )}
        onClick={handleToggleOpen}
      >
        <span className="text-blue font-semibold">Date</span>
        <Arrow className={clsx('transition-transform', isOpen ? 'rotate-180' : 'rotate-0')} />
      </label>
      <AnimatePresence>
        {isOpen && (
          <m.div
            layout
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="flex flex-col gap-y-1">
              {dateFilterPresets.map(({ label, preset, icon }) => (
                <button
                  key={preset}
                  className={clsx(
                    'preset-button -ml-2 flex items-center gap-x-1 rounded p-1 pl-2 hover:bg-gray-100',
                    datePreset === preset && 'bg-blue-100'
                  )}
                  onClick={() => handleSetDatePreset(preset)}
                >
                  {icon}
                  <span className="text-gray font-medium">{label}</span>
                </button>
              ))}
              <button
                ref={buttonRef}
                onClick={handleToggleCalendar}
                className={clsx(
                  '_custom_preset relative -ml-2 flex items-center gap-x-1 rounded p-1 pl-2 hover:bg-gray-100'
                )}
              >
                <Custom
                  width={20}
                  height={20}
                />
                <span className="text-gray font-medium">Custom range</span>
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
