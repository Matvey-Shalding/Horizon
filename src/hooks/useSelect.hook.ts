import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useClickOutside, useMediaQuery } from '@react-hookz/web';
import chroma from 'chroma-js';
import { RootState } from 'state/store';
import { Bank } from 'types/Bank.interface';
import { MAIN_ROUTES } from 'routes';
import { MEDIA_QUERIES } from 'settings/MediaQueries';

/**
 * Props for the useSelectState hook.
 */
interface SelectStateProps {
  /** The currently selected bank. */
  selected: Bank;
  /** Function to update the selected bank. */
  setSelected: Dispatch<SetStateAction<Bank>>;
}

/**
 * Hook for managing state, logic, and event handlers in the Select component.
 * @param props - Props containing the selected bank and setSelected function.
 * @returns Object containing state, refs, media queries, memoized values, and event handlers for the Select component.
 */
export const useSelectState = ({ selected, setSelected }: SelectStateProps) => {
  const router = useRouter();
  const banks = useSelector((state: RootState) => state.bank.banks);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Media queries
  const isDesktop = useMediaQuery(`(min-width:${MEDIA_QUERIES.DESKTOPS})`);
  const isTablet = useMediaQuery(`(max-width:${MEDIA_QUERIES.TABLETS})`);

  // Close dropdown on outside click
  useClickOutside(dropdownRef, () => setIsOpen(false));

  // Dynamic max-height for dropdown menu
  useEffect(() => {
    const updateMaxHeight = () => {
      if (menuRef.current) {
        const rect = menuRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.top - 20;
        menuRef.current.style.maxHeight = `${spaceBelow}px`;
      }
    };
    if (isOpen) {
      updateMaxHeight();
      window.addEventListener('resize', updateMaxHeight);
    }
    return () => window.removeEventListener('resize', updateMaxHeight);
  }, [isOpen]);

  // Memoized colors for avatars
  const colors = useMemo(
    () =>
      new Array(banks.length - 1).fill(0).map(() => {
        const bg = chroma.random().hex();
        const text = chroma(bg).luminance() > 0.5 ? '#000' : '#fff';
        return { bg, text };
      }),
    [banks]
  );

  /**
   * Handles selection of a bank from the dropdown.
   * @param item - The selected bank.
   */
  const handleSelectBank = (item: Bank | null) => {
    if (item) {
      setSelected(item);
      setTimeout(() => setIsOpen(false), 0);
    }
  };

  /**
   * Toggles the dropdown open/closed state.
   */
  const handleToggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  /**
   * Navigates to the connect bank page and closes the dropdown.
   */
  const handleAddBank = () => {
    router.push(MAIN_ROUTES.CONNECT_BANK);
    setIsOpen(false);
  };

  return {
    banks,
    isOpen,
    dropdownRef,
    menuRef,
    isDesktop,
    isTablet,
    colors,
    handleSelectBank,
    handleToggleOpen,
    handleAddBank,
  };
};