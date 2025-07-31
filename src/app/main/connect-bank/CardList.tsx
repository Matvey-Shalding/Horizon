import { motion } from 'framer-motion';
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
  // Ensure activeTab is within bounds
  const validActiveTab = Math.min(activeTab, banks.length - 1);

  // Always show the card corresponding to activeTab at the front, and the next 2 cards.
  const cardsToDisplay = useMemo(() => {
    return [
      banks[validActiveTab], // The active card goes to the front
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
        const overlapStep = 31; // 47% of card width (136px)
        const shiftLeftStep = 28; // 5% of card width (15.8px)
        const depth = index * -50; // Moves each card further back in 3D space

        return (
          <motion.div
            key={bank.cardId}
            className="absolute top-0 left-0 w-full max-w-[316px]"
            style={{
              zIndex: cardsToDisplay.length - index, // Ensures first card is on top
            }}
            initial={{
              opacity: 0,
              transform: `translateY(${index * overlapStep}px) translateX(${index * shiftLeftStep}px) translateZ(${depth}px)`,
            }}
            animate={{
              opacity: 1,
              transform: `translateY(${index * overlapStep}px) translateX(${index * shiftLeftStep}px) translateZ(${depth}px)`,
            }}
            transition={{
              duration: 0.5, // Duration for the transition
              ease: 'easeInOut', // Smooth easing
            }}
          >
            <Card
              {...bank}
              firstName={user?.firstName}
              lastName={user?.lastName}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
