import { useMediaQuery } from '@react-hookz/web';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { MEDIA_QUERIES } from 'settings/MediaQueries';
import { Transaction as TransactionType } from 'types/Transaction.interface';
import { Transaction } from './Transaction';

export function TransactionList({
  transactions,
  limit,
}: {
  transactions: TransactionType[];
  limit?: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);

  // Set a minimum width for the container (e.g., 600px)
  const MIN_WIDTH = 600;

  const isSmallDesktop = useMediaQuery(`(max-width:${MEDIA_QUERIES.SMALL_DESKTOPS})`);

  const isMobile = useMediaQuery(`(max-width:${MEDIA_QUERIES.MOBILE})`);

  // useEffect(() => {
  //   if (container.current && isSmallDesktop) {
  //     container.current.style.maxWidth =
  //       window.innerWidth - (isSmallDesktop && !isMobile ? 64 : 0) + "px";
  //   }
  // }, []);

  return (
    <div
      ref={container}
      className={`flex flex-col overflow-x-auto overflow-y-hidden min-[768px]:overflow-x-hidden`}
    >
      {/* Table Header */}
      <div
        ref={title}
        className={`grid min-h-11 w-full min-w-150 grow-1 basis-full grid-cols-[1fr_0.75fr_1.25fr_1fr] self-stretch border-b border-[#EAECF0] bg-[#F9FAFB] pl-4 max-[768px]:pl-6 md:grid-cols-[1.5fr_0.75fr_1.25fr_1fr]`}
      >
        {['Transaction', 'Amount', 'Date', 'Category'].map((title) => (
          <div
            key={title}
            className="text-gray grid items-center text-xs font-medium"
          >
            {title}
          </div>
        ))}
      </div>

      {/* Table Body with animation */}
      <AnimatePresence>
        {transactions.slice(0, limit).map((transaction, i) => (
          <motion.div
            className="min-w-150"
            key={transaction.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
          >
            <Transaction
              even={i % 2 === 0}
              recipientBankId={transaction.recipientBankId}
              id={transaction.id}
              amount={transaction.amount}
              status={transaction.status}
              date={transaction.date}
              category={transaction.category}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
