"use client";

import clsx from "clsx";
import Arrow from "components/icons/main/transactions/arrow";
import Custom from "components/icons/main/transactions/calendar/custom";
import Month from "components/icons/main/transactions/calendar/month";
import Today from "components/icons/main/transactions/calendar/today";
import Week from "components/icons/main/transactions/calendar/week";
import { AnimatePresence, motion } from "framer-motion";
import { CSSProperties, RefObject, SetStateAction } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "styles/lib/calendar.css";

interface DateFilterProps {
  isOpen: boolean;
  setIsOpen: () => void;
  datePreset: "today" | "last7" | "last30Days" | null;
  dateRange: { from: Date; to: Date } | undefined;
  setDatePreset: (preset: "today" | "last7" | "last30Days") => void;
  setDateRange: (range: { from: Date; to: Date } | undefined) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: React.Dispatch<SetStateAction<boolean>>;
  setRef: ((node: HTMLElement | null) => void) &
    ((node: HTMLElement | null) => void);
  styles: CSSProperties;
  calendarRef: RefObject<HTMLDivElement>;
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
  setRef,
  styles,
  calendarRef,
}: DateFilterProps) {
  return (
    <div className="flex flex-col gap-y-2">
      {isCalendarOpen && (
        <div
          ref={setRef}
          style={styles}
          className={clsx(
            "z-50 w-72 rounded-lg bg-white px-4 pb-2 shadow-lg",
            "transition-opacity duration-150",
            isCalendarOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <div ref={calendarRef}>
            <DayPicker
              disabled={{ after: new Date() }}
              mode="range"
              selected={dateRange}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  setDateRange({ from: range.from, to: range.to });
                  setIsCalendarOpen(false);
                }
              }}
              defaultMonth={dateRange?.from || undefined}
            />
          </div>
        </div>
      )}
      <label
        className={clsx(
          "flex cursor-pointer items-center justify-between select-none",
          "border-border border-t pt-2.5",
          isOpen && "border-b pb-1",
        )}
        onClick={setIsOpen}
      >
        <span className="text-blue font-semibold">Date</span>
        <Arrow
          className={clsx(
            "transition-transform",
            isOpen ? "rotate-180" : "rotate-0",
          )}
        />
      </label>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layout
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex flex-col gap-y-2">
              <span className="text-blue text-lg font-bold">Presets:</span>
              <div className="flex flex-col gap-y-1">
                {[
                  {
                    label: "Today",
                    preset: "today",
                    icon: <Today width={20} height={20} />,
                  },
                  {
                    label: "The last 7 days",
                    preset: "last7",
                    icon: <Week width={20} height={20} />,
                  },
                  {
                    label: "The last 30 days",
                    preset: "last30Days",
                    icon: <Month width={20} height={20} />,
                  },
                ].map(({ label, preset, icon }) => (
                  <button
                    key={preset}
                    className={clsx(
                      "preset-button flex items-center gap-x-1 rounded p-1 pl-1.5 hover:bg-gray-100",
                      datePreset === preset && "bg-blue-100",
                    )}
                    onClick={() => {
                      setDatePreset(preset as "today" | "last7" | "last30Days");
                      setIsCalendarOpen(false);
                    }}
                  >
                    {icon}
                    <span className="text-gray font-medium">{label}</span>
                  </button>
                ))}
                <button
                  onClick={() => setIsCalendarOpen((o) => !o)}
                  className={clsx(
                    "flex items-center gap-x-1 rounded p-1 pl-1.5 hover:bg-gray-100",
                  )}
                >
                  <Custom width={20} height={20} />
                  <span className="text-gray font-medium">Custom range</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
