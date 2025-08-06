import clsx from 'clsx';
import { TRANSACTION_TABLE_HEADERS } from 'constant/transactionHeaders';
import { AnimatePresence, m } from 'framer-motion';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Transaction as TransactionType } from 'types/Transaction.interface';
import { Transaction } from './Transaction';

interface TransactionListProps {
  transactions: TransactionType[];
  limit?: number;
}

// Expose a shared ref to the bottom sentinel
export const bottomRef = React.createRef<HTMLDivElement>();

const TransactionListComponent: React.FC<TransactionListProps> = ({ transactions, limit }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  const visibleTransactions = useMemo(
    () => (limit != null ? transactions.slice(0, limit) : transactions),
    [transactions, limit]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      ref={listRef}
      className={clsx('flex flex-col', 'overflow-x-auto overflow-y-hidden', 'min-[768px]:overflow-x-hidden')}
    >
      {/* Table Header */}
      <div
        className={clsx(
          'grid min-h-11 w-full min-w-150 grow-1 basis-full self-stretch',
          'border-b border-[#EAECF0] bg-[#F9FAFB]',
          'pl-4 max-[768px]:pl-6',
          'md:grid-cols-[1.5fr_0.75fr_1.25fr_1fr]',
          'grid-cols-[1fr_0.75fr_1.25fr_1fr]'
        )}
      >
        {TRANSACTION_TABLE_HEADERS.map((title) => (
          <div
            key={title}
            className="text-gray grid items-center text-xs font-medium"
          >
            {title}
          </div>
        ))}
      </div>

      {/* Table Body */}
      <AnimatePresence>
        {visibleTransactions.map((tx, i) => (
          <m.div
            key={tx.id}
            className="min-w-150"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, delay: i * 0.01 }}
          >
            <Transaction
              even={i % 2 === 0}
              recipientBankId={tx.recipientBankId}
              id={tx.id}
              amount={tx.amount}
              status={tx.status}
              date={tx.date}
              category={tx.category}
            />
          </m.div>
        ))}
      </AnimatePresence>

      {/* bottom sentinel */}
      <div ref={bottomRef} />
    </div>
  );
};

export const TransactionList = React.memo(TransactionListComponent);
