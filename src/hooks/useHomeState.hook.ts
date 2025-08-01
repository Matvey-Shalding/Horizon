import { useMediaQuery } from '@react-hookz/web';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { MEDIA_QUERIES } from 'settings/MediaQueries';
import { RootState } from 'state/store';
import { shortenString } from 'utils/shortenTitle';

/**
 * Configuration constant for transactions per page.
 */
const TRANSACTIONS_PER_PAGE = 10;

/**
 * Hook for managing state and memoized values in the Home component.
 * @returns Object containing state, memoized values, and refs for the Home component.
 */
export const useHomeState = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const banks = useSelector((state: RootState) => state.bank.banks);

  const [activeTab, setActiveTab] = useState(0);
  const [visibleTransactions, setVisibleTransactions] = useState(TRANSACTIONS_PER_PAGE);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const isSmallLaptop = useMediaQuery(`(max-width:${MEDIA_QUERIES.SMALL_DESKTOPS})`);
  const isNotTablet = useMediaQuery(`(min-width:${MEDIA_QUERIES.TABLETS})`);
  const isMobile = useMediaQuery(`(max-width:${MEDIA_QUERIES.MOBILE})`);

  // Set container max height
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.maxHeight = `${window.innerHeight}px`;
    }
  }, []);

  // Adjust tabs max width for small laptops
  useEffect(() => {
    if (tabsRef.current && isSmallLaptop) {
      tabsRef.current.style.maxWidth = `${window.innerWidth - 120}px`;
    }
  }, [isSmallLaptop]);

  // Memoized values
  const moneyData = useMemo(() => banks.map((bank) => Number(bank.balance)), [banks]);
  const totalBalance = useMemo(() => banks.reduce((acc, item) => acc + Number(item.balance), 0), [banks]);
  const sortedTransactions = useMemo(
    () =>
      [...(banks[activeTab]?.transactions || [])].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [banks, activeTab]
  );
  const shortenTitle = useMemo(
    () => shortenString(banks[activeTab]?.cardholderName || ''),
    [banks, activeTab]
  );
  const currentBank = useMemo(() => banks[activeTab]?.cardholderName || '', [banks, activeTab]);
  const currentBankBalance = useMemo(() => banks[activeTab]?.balance || '0', [banks, activeTab]);

  // Memoized handlers
  const handleShowMore = useCallback(
    () => setVisibleTransactions((prev) => prev + TRANSACTIONS_PER_PAGE),
    []
  );
  const handleShowLess = useCallback(
    () => setVisibleTransactions((prev) => Math.max(5, prev - TRANSACTIONS_PER_PAGE)),
    []
  );

  return {
    user,
    banks,
    activeTab,
    setActiveTab,
    visibleTransactions,
    isCollapsed,
    setIsCollapsed,
    containerRef,
    tabsRef,
    isSmallLaptop,
    isNotTablet,
    isMobile,
    moneyData,
    totalBalance,
    sortedTransactions,
    shortenTitle,
    currentBank,
    currentBankBalance,
    handleShowMore,
    handleShowLess,
  };
};
