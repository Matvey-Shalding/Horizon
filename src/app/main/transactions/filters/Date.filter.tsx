'use client';

import { useMediaQuery } from '@react-hookz/web';
import clsx from 'clsx';
import Arrow from 'components/icons/main/transactions/arrow';
import Custom from 'components/icons/main/transactions/calendar/custom';
import Month from 'components/icons/main/transactions/calendar/month';
import Today from 'components/icons/main/transactions/calendar/today';
import Week from 'components/icons/main/transactions/calendar/week';
import { AnimatePresence, motion } from 'framer-motion';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import 'react-day-picker/dist/style.css';
import { MEDIA_QUERIES } from 'settings/MediaQueries';
import 'styles/lib/calendar.css';
import CalendarPortal from './Calendar';

interface DateFilterProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  datePreset: 'today' | 'last7' | 'last30Days' | null;
  dateRange: { from: Date; to: Date } | undefined;
  setDatePreset: (preset: 'today' | 'last7' | 'last30Days') => void;
  setDateRange: (range: { from: Date; to: Date } | undefined) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: React.Dispatch<SetStateAction<boolean>>;
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

  console.log(position);
  const isSmallLaptop = useMediaQuery(`(max-width:${MEDIA_QUERIES.SMALL_DESKTOPS})`);

  const buttonRef = useRef<HTMLButtonElement>(null);

  // // Required for outside click detection
  // const handleClickOutside = (event: MouseEvent) => {
  //   if (
  //     calendarRef.current &&
  //     !calendarRef.current.contains(event.target as Node) &&
  //     !buttonRef.current?.contains(event.target as Node)
  //   ) {
  //     setIsOpen(false);
  //   }
  // };

  useEffect(() => {
    if (isOpen) {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect) {
        setPosition({
          top: rect.bottom - (Number(isSmallLaptop) && rect.height),
          left: rect.left,
        });
      }
      // document.addEventListener("mousedown", handleClickOutside);
    } else {
      // document.removeEventListener("mousedown", handleClickOutside);
    }

    // return () => {
    //   document.removeEventListener("mousedown", handleClickOutside);
    // };
  }, [isOpen]);

  return (
    <div className="flex flex-col gap-y-2">
      <CalendarPortal
        isOpen={isCalendarOpen}
        onClose={() => void setIsCalendarOpen(false)}
        dateRange={dateRange}
        onSelect={(range) => {
          if (range?.from && range?.to) {
            setDateRange({ from: range.from, to: range.to });
            setIsCalendarOpen(false);
          }
        }}
        position={position}
      />
      <label
        className={clsx(
          'flex cursor-pointer items-center justify-between select-none',
          'border-border border-t pt-2.5',
          isOpen && 'border-b pb-1'
        )}
        onClick={() => void setIsOpen(true)}
      >
        <span className="text-blue font-semibold">Date</span>
        <Arrow className={clsx('transition-transform', isOpen ? 'rotate-180' : 'rotate-0')} />
      </label>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layout
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="flex flex-col gap-y-1">
              {[
                {
                  label: 'Today',
                  preset: 'today',
                  icon: (
                    <Today
                      width={20}
                      height={20}
                    />
                  ),
                },
                {
                  label: 'The last 7 days',
                  preset: 'last7',
                  icon: (
                    <Week
                      width={20}
                      height={20}
                    />
                  ),
                },
                {
                  label: 'The last 30 days',
                  preset: 'last30Days',
                  icon: (
                    <Month
                      width={20}
                      height={20}
                    />
                  ),
                },
              ].map(({ label, preset, icon }) => (
                <button
                  key={preset}
                  className={clsx(
                    'preset-button -ml-2 flex items-center gap-x-1 rounded p-1 pl-2 hover:bg-gray-100',
                    datePreset === preset && 'bg-blue-100'
                  )}
                  onClick={() => {
                    setDatePreset(preset as 'today' | 'last7' | 'last30Days');
                    setIsCalendarOpen(false);
                  }}
                >
                  {icon}
                  <span className="text-gray font-medium">{label}</span>
                </button>
              ))}
              <button
                ref={buttonRef}
                onClick={() => setIsCalendarOpen((o) => !o)}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
