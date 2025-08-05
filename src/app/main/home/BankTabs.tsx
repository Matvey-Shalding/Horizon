'use client';

import { useMediaQuery } from '@react-hookz/web';
import clsx from 'clsx';
import { AnimatePresence, m } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';
import { MEDIA_QUERIES } from 'settings/MediaQueries';
import 'styles/assets/BankTabs.css';

interface BankTabProps {
  banks: { cardholderName: string }[];
  activeTab: number;
  setActiveTab: (index: number) => void;
}

export function BankTabs({ banks, activeTab, setActiveTab }: BankTabProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [underlinePos, setUnderlinePos] = useState({ left: 0, width: 0 });
  const isMobile = useMediaQuery(`(max-width:${MEDIA_QUERIES.MOBILE})`);

  // Recalculate underline position after layout and on scroll
  useLayoutEffect(() => {
    const updateUnderline = () => {
      const container = containerRef.current;
      const btn = buttonRefs.current[activeTab];
      if (!btn || !container) return;

      // Corrected calculation for left position
      const left = btn.offsetLeft;
      setUnderlinePos({
        left,
        width: btn.offsetWidth,
      });
    };

    // Defer once to ensure DOM is painted
    const id = window.setTimeout(updateUnderline, 0);

    // Listen for horizontal scroll to keep underline in sync
    containerRef.current?.addEventListener('scroll', updateUnderline);

    return () => {
      clearTimeout(id);
      containerRef.current?.removeEventListener('scroll', updateUnderline);
    };
  }, [activeTab, banks.length, isMobile]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        'border-border bank-tabs-container relative mb-2 flex max-h-8.5 max-w-full',
        'min-h-fit w-full basis-full items-start gap-x-3.5 self-center',
        'overflow-x-auto border-b px-3 pb-1.5 min-[450px]:mb-0 min-[450px]:px-0'
      )}
    >
      <div className="relative flex w-full items-center gap-3.5">
        <AnimatePresence initial={false}>
          {banks.map((bank, index) => (
            <button
              key={bank.cardholderName + index}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              onClick={() => setActiveTab(index)}
              className={clsx(
                'relative font-semibold whitespace-nowrap',
                activeTab === index ? 'text-light-blue' : 'text-light-gray'
              )}
            >
              {bank.cardholderName}
            </button>
          ))}
        </AnimatePresence>

        {/* Single underline that animates its left & width */}
        <m.div
          className="bg-light-blue absolute bottom-[-2px] h-[3px]"
          initial={false}
          animate={{
            left: underlinePos.left,
            width: underlinePos.width,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
}
