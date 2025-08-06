import { useClickOutside, useMediaQuery } from '@react-hookz/web';
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { MEDIA_QUERIES } from 'settings/MediaQueries';
import { RootState } from 'state/store';
import { Bank } from 'types/Bank.interface';
import { Category, CategoryWithBank } from 'types/Category.interface';
import { Transaction } from 'types/Transaction.interface';

/**
 * Hook for managing state, logic, and computed values in the TransactionsHistoryPage component.
 * @returns Object containing state, refs, media queries, memoized values, and event handlers.
 */
export const useTransactionsHistoryState = ({listRef}: { listRef: RefObject<HTMLDivElement> }) => {
  const banks = useSelector((state: RootState) => state.bank.banks);
  const [selected, setSelected] = useState<Bank>(banks[0]);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  // Media queries
  const isDesktop = useMediaQuery(`(min-width:${MEDIA_QUERIES.DESKTOPS})`);
  const isTablet = useMediaQuery(`(max-width:${MEDIA_QUERIES.TABLETS})`);
  const showFullAdditionalInfo = useMediaQuery(`(min-width:600px)`);

  // Memoized transactions and categories
  const transactions = useMemo(() => selected?.transactions || [], [selected]);
  const categories = useMemo<CategoryWithBank[]>(() => {
    return (
      selected?.categories?.map((c: Category) => ({
        ...c,
        bank: {
          cardId: selected.cardId,
          cardholderName: selected.cardholderName,
        },
      })) || []
    );
  }, [selected]);

  // Computed pagination values
  const offset = useMemo(() => currentPage * itemsPerPage, [currentPage, itemsPerPage]);
  const currentItems = useMemo(
    () => filteredTransactions.slice(offset, offset + itemsPerPage),
    [filteredTransactions, offset, itemsPerPage]
  );
  const pageCount = useMemo(
    () => Math.ceil(filteredTransactions.length / itemsPerPage),
    [filteredTransactions, itemsPerPage]
  );

  // Sync filtered transactions with selected bank's transactions
  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  // Calculate items per page based on container height
  useEffect(() => {
    const calculateItemsPerPage = () => {
      if (containerRef.current && listRef.current) {
        const containerHeight = containerRef.current.offsetHeight;
        const listTop = listRef.current.offsetTop;
        const paginationHeight = 60;
        const itemHeight = 72;
        const availableHeight = containerHeight - listTop - paginationHeight - 35;
        const maxItems = Math.floor(availableHeight / itemHeight);
        setItemsPerPage(Math.max(1, maxItems));
      }
    };
    calculateItemsPerPage();
    window.addEventListener('resize', calculateItemsPerPage);
    return () => window.removeEventListener('resize', calculateItemsPerPage);
  }, []);

  // Reset current page when filtered transactions change
  useEffect(() => {
    setCurrentPage(0);
  }, [filteredTransactions]);

  // Close filter menu on outside click if calendar is not open
  useClickOutside(filterMenuRef, () => {
    if (!isCalendarOpen) {
      setIsFilterMenuOpen(false);
    }
  });

  /**
   * Handles page change in pagination.
   * @param data - Object containing the selected page.
   */
  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  /**
   * Toggles the filter menu open/closed state.
   */
  const handleToggleFilterMenu = () => {
    setIsFilterMenuOpen((prev) => !prev);
  };

  return {
    banks,
    selected,
    setSelected,
    isFilterMenuOpen,
    currentPage,
    itemsPerPage,
    filteredTransactions,
    setFilteredTransactions,
    isCalendarOpen,
    setIsCalendarOpen,
    containerRef,
    filterMenuRef,
    isDesktop,
    isTablet,
    showFullAdditionalInfo,
    transactions,
    categories,
    currentItems,
    pageCount,
    handlePageClick,
    handleToggleFilterMenu,
  };
};
