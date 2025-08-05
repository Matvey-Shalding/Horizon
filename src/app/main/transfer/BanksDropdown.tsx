import { useClickOutside } from '@react-hookz/web';
import clsx from 'clsx';
import Plus from 'components/icons/main/home/plus';
import Arrow from 'components/icons/main/transactions/arrow';
import CheckMark from 'components/icons/main/transactions/checkmark';
import Card from 'components/icons/main/transactions/credit-card';
import { AnimatePresence, motion } from 'framer-motion';
import { useBanksDropdownState } from 'hooks/useBanksDropdownState.hook';
import { useEffect } from 'react';
import { UseFormSetError, UseFormSetValue } from 'react-hook-form';
import { MAIN_ROUTES } from 'routes';
import { PaymentTransferSchemaType } from 'schemas/paymentTransfer.schema';
import { ErrorMessage } from 'ui/Error';
import { shortenString } from 'utils/shortenTitle';
import { Subtitle } from './SubTitle';

export function BanksDropdown<T>({
  title,
  subtitle,
  errorMessage,
  setValue,
  currentBankId,
  isSubmitted,
  setError,
  isSourceBank,
  resetCounter,
}: {
  title: string;
  subtitle: string;
  errorMessage?: string;
  setValue: UseFormSetValue<PaymentTransferSchemaType>;
  setError: UseFormSetError<PaymentTransferSchemaType>;
  currentBankId?: string;
  isSubmitted: boolean;
  isSourceBank?: boolean;
  resetCounter: number;
}) {
  const {
    router,
    banks,
    dropdownRef,
    menuRef,
    isOpen,
    setIsOpen,
    selected,
    isDesktop,
    isTablet,
    colors,
    currentBank,
    filteredBanks,
    onSelect,
    setSelected,
  } = useBanksDropdownState({ currentBankId, isSourceBank, resetCounter, setValue, setError });

  useEffect(() => {
    setSelected('');
    setIsOpen(false);
  }, [resetCounter]);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  useEffect(() => {
    const updateMaxHeight = () => {
      if (menuRef.current) {
        const rect = menuRef.current.getBoundingClientRect();
        const space = window.innerHeight - rect.top - 20;
        menuRef.current.style.maxHeight = `${space}px`;
      }
    };
    if (isOpen) {
      updateMaxHeight();
      window.addEventListener('resize', updateMaxHeight);
    }
    return () => window.removeEventListener('resize', updateMaxHeight);
  }, [isOpen]);

  return (
    <div
      className={clsx(
        'border-border flex min-[640px]:border-b',
        'min-[640px]:pb-4 min-[768px]:gap-x-8 min-[768px]:pb-5'
      )}
    >
      {!isTablet && (
        <Subtitle
          title={title}
          subtitle={subtitle}
        />
      )}

      <div className="relative basis-full min-[640px]:max-w-128">
        <div className="flex flex-col gap-y-1">
          <div className="flex flex-col gap-y-1.5">
            {isTablet && <span className="text-dark-gray text-sm/snug font-semibold">{subtitle}</span>}
            <div
              ref={dropdownRef}
              className={clsx(
                'flex min-h-11 cursor-pointer items-center justify-between rounded-lg border bg-white',
                isDesktop ? 'px-4.5' : 'shadow-main px-2.5 py-1.5 min-[640px]:px-4 min-[640px]:py-2.5'
              )}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <div className="flex items-center gap-x-2 min-[768px]:gap-x-3">
                <Card
                  width={isDesktop ? 24 : 20}
                  height={isDesktop ? 24 : 20}
                  className="text-dark-gray"
                />
                <span className="text-dark-gray text-sm font-medium">{currentBank}</span>
              </div>
              <Arrow className={clsx('transition-transform', isOpen && 'rotate-180')} />
            </div>
          </div>
          {errorMessage && <ErrorMessage message={errorMessage} />}
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              key="banks-dropdown"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className={clsx(
                'absolute top-[calc(100%+10px)] right-0 z-10 flex w-60 flex-col',
                'overflow-y-auto rounded-lg border border-gray-200 bg-white',
                'shadow-md min-[768px]:w-70'
              )}
            >
              {filteredBanks.map((bank, index) => {
                return (
                  <div
                    key={bank.cardId}
                    onClick={() => {
                      onSelect(bank);
                    }}
                    className={clsx(
                      'border-border cursor-pointer border-b px-4 py-2 text-sm font-medium',
                      'transition-colors duration-150 ease-in-out',
                      selected === bank.cardId
                        ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700'
                        : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-x-2 min-[768px]:gap-x-3">
                        <div
                          style={{
                            backgroundColor: colors[index].bg,
                            color: colors[index].text,
                          }}
                          className="grid size-[25px] place-content-center rounded-full text-xs font-medium min-[768px]:size-8 min-[768px]:text-sm"
                        >
                          {shortenString(bank.cardholderName)}
                        </div>
                        <span className="text-dark-gray font-semibold">{bank.cardholderName}</span>
                      </div>
                      {bank.cardId === selected && (
                        <CheckMark
                          width={16}
                          height={16}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
              <div
                onClick={() => {
                  router.push(MAIN_ROUTES.CONNECT_BANK);
                  setTimeout(() => setIsOpen(false), 0);
                }}
                className="flex h-10 items-center gap-x-2 px-4 hover:bg-gray-50"
              >
                <Plus
                  width={16}
                  height={16}
                />
                <span className="text-gray text-sm font-medium">Add new bank</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
