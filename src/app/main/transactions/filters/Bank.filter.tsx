import clsx from 'clsx';
import Arrow from 'components/icons/main/transactions/arrow';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { transactionFilterService } from 'services/Transactions.service';
import { Bank } from 'types/Bank.interface';
import { Checkbox } from 'ui/Checkbox';
import { Input } from 'ui/Input';

interface BankFilterProps {
  isOpen: boolean;
  setIsOpen: () => void;
  banks: Bank[];
  selectedBanks: Bank[];
  toggleBank: (bank: Bank) => void;
}

export function BankFilter({ isOpen, setIsOpen, banks, selectedBanks, toggleBank }: BankFilterProps) {
  const [bankSearch, setBankSearch] = useState('');
  const [showAllBanks, setShowAllBanks] = useState(false);
  const bankListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bankListRef.current) {
      const maxHeight = window.innerHeight - 80 - bankListRef.current.getBoundingClientRect().top;
      bankListRef.current.style.maxHeight = `${maxHeight}px`;
      bankListRef.current.style.overflowY = 'auto';
    }
  }, [isOpen]);

  const filteredBanks = transactionFilterService.getFilteredBanks(banks, bankSearch);

  return (
    <div className="flex flex-col gap-y-2">
      <label
        className={clsx(
          'flex cursor-pointer items-center justify-between select-none',
          'border-border border-t pt-2.5',
          isOpen && 'border-b pb-1'
        )}
        onClick={setIsOpen}
      >
        <span className="text-blue font-semibold">Recipient Bank</span>
        <Arrow className={clsx('transition-transform', isOpen ? 'rotate-180' : 'rotate-0')} />
      </label>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: {
                height: { duration: 0.4 },
                opacity: { duration: 0.25, delay: 0.15 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.4 },
                opacity: { duration: 0.25 },
              },
            }}
          >
            <div className="flex flex-col gap-y-1">
              <Input
                placeholder="Search banks"
                value={bankSearch}
                onChange={(e) => setBankSearch(e.target.value)}
              />
              <div className="flex max-h-35.5 flex-col gap-y-2 overflow-y-auto">
                {filteredBanks.length > 0 ? (
                  filteredBanks.slice(0, showAllBanks ? undefined : 3).map((bank) => (
                    <label
                      key={bank.cardId}
                      className={clsx('text-gray flex items-center gap-2 py-[4.25px] pl-1 font-medium')}
                    >
                      <Checkbox
                        checkBoxStyles="w-5 h-5"
                        checked={selectedBanks.some((b) => b.cardId === bank.cardId)}
                        onChange={() => toggleBank(bank)}
                      />
                      <span className="text-gray-700">{bank.cardholderName}</span>
                    </label>
                  ))
                ) : (
                  <label className="px-4 py-2 text-center text-sm text-gray-500 italic">
                    No matching banks
                  </label>
                )}
                {filteredBanks.length > 3 && (
                  <button
                    className="text-light-blue flex justify-start px-1 text-sm font-medium hover:bg-gray-100"
                    onClick={() => setShowAllBanks((prev) => !prev)}
                  >
                    {showAllBanks ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
