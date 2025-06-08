import { motion, AnimatePresence } from "framer-motion";
import { Transaction as TransactionType } from "types/Transaction.interface";
import { Transaction } from "./Transaction";

export function TransactionList({
  transactions,
}: {
  transactions: TransactionType[];
}) {
  return (
    <div className="flex flex-col">
      {/* Table Header */}
      <div className="grid h-11 grid-cols-[1.5fr_0.75fr_1.25fr_1fr] border-b border-[#EAECF0] bg-[#F9FAFB] px-4">
        {["Transaction", "Amount", "Date", "Category"].map((title) => (
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
        {transactions.map((transaction, i) => (
          <motion.div
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
