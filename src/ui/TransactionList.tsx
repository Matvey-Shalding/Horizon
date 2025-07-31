import React, { useMemo } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import clsx from 'clsx';
import { Transaction as TransactionType } from 'types/Transaction.interface';
import { Transaction } from './Transaction';
import { TRANSACTION_TABLE_HEADERS } from 'constants/transactionHeaders';

interface TransactionListProps {
  transactions: TransactionType[];
  limit?: number;
}

const TransactionListComponent: React.FC<TransactionListProps> = ({ transactions, limit }) => {
  const visibleTransactions = useMemo(() => {
    if (limit !== undefined) {
      return transactions.slice(0, limit);
    }
    return transactions;
  }, [transactions, limit]);

  return (
    <div
      className={clsx('flex flex-col', 'overflow-x-auto overflow-y-hidden', 'min-[768px]:overflow-x-hidden')}
    >
      {/* Table Header */}
      <div
        className={clsx(
          'grid min-h-11 w-full min-w-150 grow-1 basis-full self-stretch border-b border-[#EAECF0] bg-[#F9FAFB] pl-4',
          'max-[768px]:pl-6',
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

      {/* Table Body with animation */}
      <AnimatePresence>
        {visibleTransactions.map((transaction, i) => (
          <m.div
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
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const TransactionList = React.memo(TransactionListComponent);
