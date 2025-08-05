import { m, AnimatePresence, Variants } from 'framer-motion';
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
  const OVERLAP = 31;
  const SHIFT = 28;

  // clamp activeTab
  const idx = useMemo(() => Math.min(activeTab, banks.length - 1), [activeTab, banks]);

  // build [newTop, ...rest]
  const display = useMemo(() => {
    const top = banks[idx];
    const rest = banks.filter((_, i) => i !== idx).slice(0, (cardsToShow ?? banks.length) - 1);
    return [top, ...rest];
  }, [banks, idx, cardsToShow]);

  // only top two animate: include z-axis movement
  const twoCardVars: Variants = {
    initial: (i: number) => ({
      // new card starts off-screen below & deeper
      y: i === 0 ? OVERLAP * display.length : 0,
      x: i * SHIFT,
      z: i === 0 ? -50 : 0,
    }),
    animate: (i: number) => ({
      // new card jumps to top front, old top moves down & back
      y: i === 0 ? 0 : OVERLAP,
      x: i * SHIFT,
      z: i === 0 ? 0 : -50,
      transition: { duration: 0.5, ease: 'easeInOut' },
    }),
  };

  return (
    <div
      className="relative flex flex-col items-center"
      style={{
        perspective: '1000px',
        minWidth: '316px',
        minHeight: 180 + OVERLAP * (display.length - 1),
      }}
    >
      <AnimatePresence
        initial={false}
        mode="wait"
      >
        {display.map((bank, i) => {
          const key = `${bank.cardId}-${activeTab}-${i}`;
          if (i < 2) {
            // top two get the jump/slide with z-axis
            return (
              <m.div
                key={key}
                custom={i}
                variants={twoCardVars}
                initial="initial"
                animate="animate"
                className="absolute top-0 left-0 w-full max-w-[316px]"
                style={{ zIndex: display.length - i }}
              >
                <Card
                  {...bank}
                  firstName={user?.firstName}
                  lastName={user?.lastName}
                />
              </m.div>
            );
          }
          // rest snap into place
          return (
            <div
              key={key}
              className="absolute top-0 left-0 w-full max-w-[316px]"
              style={{
                transform: `translateY(${i * OVERLAP}px) translateX(${i * SHIFT}px) translateZ(${(i - 1) * -50}px)`,
                zIndex: display.length - i,
              }}
            >
              <Card
                {...bank}
                firstName={user?.firstName}
                lastName={user?.lastName}
              />
            </div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
