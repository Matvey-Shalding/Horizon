import { useMediaQuery } from '@react-hookz/web';
import clsx from 'clsx';
import { m } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MEDIA_QUERIES } from 'settings/MediaQueries';
import 'styles/assets/BankTabs.css'

interface BankTabProps {
  banks: { cardholderName: string }[];
  activeTab: number;
  setActiveTab: (index: number) => void;
}

export function BankTabs({ banks, activeTab, setActiveTab }: BankTabProps) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const isMobile = useMediaQuery(`(max-width:${MEDIA_QUERIES.MOBILE})`);

  const calculateWidth = useCallback(() => {
    const parentWidth = tabsRef.current?.parentElement?.getBoundingClientRect().width || 0;
    setContainerWidth(isMobile ? parentWidth - 24 : parentWidth);
  }, []);

  useEffect(() => {
    if (tabsRef.current) {
      calculateWidth();
      window.addEventListener('resize', calculateWidth);
      return () => window.removeEventListener('resize', calculateWidth);
    }
  }, [banks]);

  return (
    <div
      ref={tabsRef}
      className={clsx(
        'border-border bank-tabs-container relative mb-2 flex',
        'min-h-fit w-full basis-full items-start gap-x-3.5 self-center',
        'overflow-x-auto border-b px-3 pb-1.5 min-[450px]:mb-0 min-[450px]:px-0'
      )}
      style={{ maxWidth: containerWidth ? `${containerWidth}px` : '100%' }}
    >
      <div className="flex w-full items-center gap-3.5">
        {banks.map((bank, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`relative font-semibold whitespace-nowrap ${
              activeTab === index ? 'text-light-blue' : 'text-light-gray'
            }`}
          >
            {bank.cardholderName}
            {activeTab === index && (
              <m.div
                layoutId="underline"
                className="bg-light-blue absolute bottom-[-2px] left-0 h-[3px] w-full"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
