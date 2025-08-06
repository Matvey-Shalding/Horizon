import { useClickOutside } from '@react-hookz/web';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MAIN_ROUTES } from 'routes';
import { authorizationService } from 'services/Authorization.service';
import { setBanks } from 'state/main/bankSlice';
import { RootState } from 'state/store';
import { createSlug } from 'utils/createSlug';

/**
 * Hook for managing state and logic in the Banks component.
 * @returns Object containing state, refs, selectors, and handlers for the Banks component.
 */
export const useBanksState = () => {
  const router = useRouter();
  const banks = useSelector((state: RootState) => state.bank.banks);
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [status, setStatus] = useState<'default' | 'delete'>('default');
  const [selectedBanks, setSelectedBanks] = useState<Set<string>>(new Set());
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useClickOutside(menuRef, () => setIsMenuOpen(false));

  /**
   * Toggles between default and delete modes, resetting selected banks.
   */
  const handleToggle = () => {
    setStatus((prev) => (prev === 'default' ? 'delete' : 'default'));
    setSelectedBanks(new Set());
  };

  /**
   * Toggles selection of a specific bank by cardId.
   * @param cardId - The ID of the bank to select or deselect.
   */
  const handleSelect = (cardId: string) => {
    setSelectedBanks((prev) => {
      const newSet = new Set(prev);
      newSet.has(cardId) ? newSet.delete(cardId) : newSet.add(cardId);
      return newSet;
    });
  };

  /**
   * Selects or deselects all banks.
   */
  const handleSelectAll = () => {
    if (selectedBanks.size === banks.length) {
      setSelectedBanks(new Set());
    } else {
      setSelectedBanks(new Set(banks.map((bank) => bank.cardId)));
    }
  };

  /**
   * Deletes selected banks and resets state.
   */
  const handleDelete = async () => {
    const updatedBanks = banks.filter((bank) => !selectedBanks.has(bank.cardId));
    dispatch(setBanks(updatedBanks));
    setSelectedBanks(new Set());
    setStatus('default');
    authorizationService.handleSaveData(user, banks);
  };

  /**
   * Navigates to the bank details page for a given bank.
   * @param cardholderName - Name of the cardholder to create a slug.
   */
  const navigateToBank = (cardholderName: string) => {
    const slug = createSlug(cardholderName);
    router.push(`${MAIN_ROUTES.BANKS}/${slug}`);
  };

  return {
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
  };
};
