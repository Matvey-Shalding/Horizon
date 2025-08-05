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

  // Recalculate underline position after layout is complete
  useLayoutEffect(() => {
    const updateUnderline = () => {
      const btn = buttonRefs.current[activeTab];
      const container = containerRef.current;
      if (btn && container) {
        const btnRect = btn.getBoundingClientRect();
        const parentRect = container.getBoundingClientRect();
        setUnderlinePos({
          left: btnRect.left - parentRect.left - (Number(isMobile) && 12),
          width: btnRect.width,
        });
      }
    };

    // Defer measurement to ensure styles are applied
    const timeoutId = setTimeout(updateUnderline, 0);
    return () => clearTimeout(timeoutId);
  }, [activeTab, isMobile, banks.length]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        'border-border bank-tabs-container relative mb-2 flex max-w-full',
        'min-h-fit w-full basis-full items-start gap-x-3.5 self-center',
        'overflow-x-auto border-b px-3 pb-1.5 min-[450px]:mb-0 min-[450px]:px-0'
      )}
    >
      <div className="relative flex w-full items-center gap-3.5">
        <AnimatePresence initial={false}>
          {banks.map((bank, index) => (
            <button
              key={index}
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
