import { useClickOutside, useMediaQuery } from '@react-hookz/web';
import chroma from 'chroma-js';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { UseFormSetError, UseFormSetValue } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { MAIN_ROUTES } from 'routes';
import { PaymentTransferSchemaType } from 'schemas/paymentTransfer.schema';
import { MEDIA_QUERIES } from 'settings/MediaQueries';
import { RootState } from 'state/store';
import { Bank } from 'types/Bank.interface';

/**
 * Props for the useBanksDropdownState hook.
 */
interface BanksDropdownStateProps {
  currentBankId?: string;
  isSourceBank?: boolean;
  resetCounter: number;
  setValue: UseFormSetValue<PaymentTransferSchemaType>;
  setError: UseFormSetError<PaymentTransferSchemaType>;
}

/**
 * Hook for managing state and logic in the BanksDropdown component.
 * @param props - Props for current bank ID, source bank flag, reset counter, and form methods.
 * @returns Object containing state, refs, media queries, and memoized values for the BanksDropdown component.
 */
export const useBanksDropdownState = ({
  currentBankId,
  isSourceBank,
  resetCounter,
  setValue,
  setError,
}: BanksDropdownStateProps) => {
  const router = useRouter();
  const banks = useSelector((state: RootState) => state.bank.banks);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');

  // Adaptive breakpoints
  const isDesktop = useMediaQuery(`(min-width:${MEDIA_QUERIES.DESKTOPS})`);
  const isTablet = useMediaQuery(`(max-width:${MEDIA_QUERIES.TABLETS})`);

  // Reset on counter change
  useEffect(() => {
    setSelected('');
    setIsOpen(false);
  }, [resetCounter]);

  // Close on outside click
  useClickOutside(dropdownRef, () => setIsOpen(false));

  // Dynamic max-height
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

  // Colors for avatars
  const colors = useMemo(
    () =>
      banks
        .filter((b) => b.cardId !== currentBankId)
        .map(() => {
          const bg = chroma.random().hex();
          const text = chroma(bg).luminance() > 0.5 ? '#000' : '#fff';
          return { bg, text };
        }),
    [banks, currentBankId]
  );

  /**
   * Handles bank selection, updating form value and closing dropdown.
   * @param cardId - ID of the selected bank.
   */
  const handleSelectBank = (cardId: string) => {
    setSelected(cardId);
    setValue(isSourceBank ? 'sourceBank' : 'recipientAccount', cardId, { shouldValidate: true });
    setTimeout(() => setIsOpen(false), 0);
  };

  const currentBank = useMemo(() => {
    return selected ? banks.find((b) => b.cardId === selected)?.cardholderName : 'Select Account';
  }, [selected, banks]);

  const filteredBanks = useMemo(() => {
    return banks.filter((b) => b.cardId !== currentBankId);
  }, [banks, currentBankId]);

  const onSelect = useCallback((bank: Bank) => {
    setSelected(bank.cardId);
    setValue(isSourceBank ? 'sourceBank' : 'recipientAccount', bank.cardId, {
      shouldValidate: true,
    });
    setTimeout(() => setIsOpen(false), 0);
  }, []);

  /**
   * Handles navigation to add a new bank and closes dropdown.
   */
  const handleAddBank = () => {
    router.push(MAIN_ROUTES.CONNECT_BANK);
    setTimeout(() => setIsOpen(false), 0);
  };

  return {
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
    handleSelectBank,
    handleAddBank,
    setSelected,
    currentBank,filteredBanks,onSelect
  };
};
