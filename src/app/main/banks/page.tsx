'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';

import Dropdown from 'components/icons/main/home/dropdown';
import Edit from 'components/icons/main/home/edit';
import { useBanksState } from 'hooks/useBanksState.hook';
import { useRouter } from 'next/navigation';
import { MAIN_ROUTES } from 'routes';
import { Button } from 'ui/Button';
import { CancelButton } from 'ui/CancelButton';
import { Card } from 'ui/Card';
import { Checkbox } from 'ui/Checkbox';
import { Title } from 'ui/Title';
import { createSlug } from 'utils/createSlug';

export default function Banks() {
  const {
    isMenuOpen,
    setIsMenuOpen,
    banks,
    user,
    dispatch,
    status,
    setStatus,
    selectedBanks,
    setSelectedBanks,
    menuRef,
    handleToggle,
    handleSelect,
    handleSelectAll,
    handleDelete,
    navigateToBank,
  } = useBanksState();

  const router = useRouter();

  const menu = useRef<HTMLDivElement | null>(null);

  return (
    <div className="bg-gray-bg flex w-full flex-col gap-y-2 overflow-y-auto px-0 py-12 min-[450px]:px-5 min-[640px]:gap-y-4 min-[640px]:px-8 min-[900px]:gap-y-8">
      <div className="max-[450px]:px-5">
        <Title
          title="My Bank Accounts"
          subtitle="Effortlessly Manage Your Banking Activities"
        />
      </div>

      <div className="flex flex-col gap-y-5">
        <div className="border-border flex items-center justify-between border-b pb-2 max-[450px]:px-5">
          <h2 className="font-blue text-xl font-semibold">
            {status === 'delete' ? `${selectedBanks.size} selected` : 'Your cards'}
          </h2>

          <div className="flex items-center gap-x-4">
            <div
              ref={menu}
              className="relative cursor-pointer"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <Dropdown
                width={20}
                height={20}
              />

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="absolute right-0 z-10 mt-2 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
                  >
                    <button
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={status === 'default'}
                      onClick={handleSelectAll}
                    >
                      <Checkbox
                        checked={selectedBanks.size === banks.length}
                      />
                      <span className="text-light-gray text-sm font-medium">
                        {selectedBanks.size === banks.length ? 'Unselect All' : 'Select All'}
                      </span>
                    </button>
                    <button
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100"
                      onClick={() => {
                        setStatus((status) => (status === 'default' ? 'delete' : 'default'));
                        setIsMenuOpen(false);
                      }}
                    >
                      <Edit
                        width={16}
                        height={16}
                      />
                      <span className="text-light-gray text-sm font-medium">Edit</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <motion.div
          layout
          className="flex flex-wrap items-center gap-10 max-[768px]:justify-center"
          transition={{ layout: { duration: 0.4, ease: 'easeInOut' } }}
        >
          {banks.map((bank) => {
            const isChecked = selectedBanks.has(bank.cardId);

            const slug = createSlug(bank.cardholderName);

            return (
              <motion.div
                key={bank.cardId}
                className="flex w-fit flex-col gap-y-2"
                layout
              >
                <motion.div
                  className="flex items-center gap-x-3 min-[450px]:gap-x-5"
                  layout
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <AnimatePresence mode="sync">
                    {status === 'delete' && (
                      <motion.div
                        key={`checkbox-${bank.cardId}`}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        layout
                      >
                        <Checkbox
                          checkBoxStyles="w-6 h-6"
                          checkMarkStyles="w-5 h-5"
                          checked={isChecked}
                          onChange={() => handleSelect(bank.cardId)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    onClick={() => void router.push(MAIN_ROUTES.BANKS + '/' + slug)}
                    layout
                  >
                    <Card
                      {...bank}
                      firstName={user?.firstName}
                      lastName={user?.lastName}
                    />
                  </motion.div>
                </motion.div>

                <motion.div
                  className="flex w-65 justify-end self-end min-[900px]:w-75"
                  layout
                >
                  <div className="flex w-full flex-col gap-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-dark-gray text-sm font-medium">Spending this month</span>
                      <span className="text-gray text-sm">$500</span>
                    </div>
                    <div className="h-2 w-full rounded-sm bg-[#EAECF0]">
                      <motion.div
                        className="bg-dark-gray h-full rounded-sm"
                        animate={{
                          width: `${(200 / Number(bank.monthlyBudget)) * 100}%`,
                        }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <AnimatePresence>
        {status === 'delete' && (
          <motion.div
            className="border-border mt-3 flex justify-end gap-x-4 border-t pt-3 max-[450px]:px-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <CancelButton
              className="max-[640px]:basis-1/2"
              onClick={() => {
                setSelectedBanks(new Set());
                setStatus('default');
              }}
            />
            <Button
              className="!w-auto basis-22 max-[640px]:basis-1/2"
              content="Delete"
              onClick={handleDelete}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
