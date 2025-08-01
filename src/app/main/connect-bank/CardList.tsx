import { m } from 'framer-motion';
import { useMemo } from 'react';
import { SingUp } from 'types/Auth.types';
import { Bank } from 'types/Bank.interface';
import { Card } from 'ui/Card';

export function CardList({
  banks,
  user,
  activeTab,
  cardsToShow,
}: {
  banks: Bank[];
  user: SingUp | null | undefined;
  activeTab: number;
  cardsToShow?: number;
}) {
  // Styling settings

  const OVERLAP_STEP = useMemo(() => 31,[]);
  const SHIFT_LEFT_STEP = useMemo(() => 28, []);

  const validActiveTab = useMemo(() => {
    return Math.min(activeTab, banks.length - 1);
  }, [activeTab, banks]);

  const cardsToDisplay = useMemo(() => {
    return [
      ...banks.filter((_, index) => index !== validActiveTab).slice(0, cardsToShow ? cardsToShow - 1 : 2), // The other two cards
    ];
  }, [banks, activeTab, cardsToShow]);

  return (
    <div
      className="relative flex min-w-79 flex-col items-center"
      style={{
        perspective: '1000px',
        minHeight: 180 + 31 * (cardsToDisplay.length - 1) + 'px',
      }}
    >
      {cardsToDisplay.map((bank, index) => {
        const depth = index * -50;

        return (
          <m.div
            key={bank.cardId}
            className="absolute top-0 left-0 w-full max-w-[316px]"
            style={{
              zIndex: cardsToDisplay.length - index,
            }}
            initial={{
              opacity: 0,
              transform: `translateY(${index * OVERLAP_STEP}px) translateX(${index * SHIFT_LEFT_STEP}px) translateZ(${depth}px)`,
            }}
            animate={{
              opacity: 1,
              transform: `translateY(${index * OVERLAP_STEP}px) translateX(${index * SHIFT_LEFT_STEP}px) translateZ(${depth}px)`,
            }}
            transition={{
              duration: 0.5,
              ease: 'easeInOut',
            }}
          >
            <Card
              {...bank}
              firstName={user?.firstName}
              lastName={user?.lastName}
            />
          </m.div>
        );
      })}
    </div>
  );
}
