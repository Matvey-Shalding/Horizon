'use client';

import clsx from 'clsx';
import Filter from 'components/icons/main/transactions/filter';
import { useTransactionsHistoryState } from 'hooks/useTransactionHistoryPage.hook';
import { memo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'state/store';
import 'styles/lib/pagination.css';
import { FallBackPage } from 'ui/FallbackPage';
import { Pagination } from 'ui/Pagination';
import { Title } from 'ui/Title';
import { TransactionList } from 'ui/TransactionList';
import { shortenString } from 'utils/shortenTitle';
import { FiltersMenu } from './FilterMenu';
import { Select } from './Select';

function TransactionsHistoryPage() {
  const banks = useSelector((state: RootState) => state.bank.banks);
  const listRef = useRef<HTMLDivElement>(null);

  const {
    selected,
    setSelected,
    isFilterMenuOpen,
    filteredTransactions,
    setFilteredTransactions,
    isCalendarOpen,
    setIsCalendarOpen,
    containerRef,
    filterMenuRef,
    isDesktop,
    isTablet,
    showFullAdditionalInfo,
    categories,
    currentItems,
    pageCount,
    currentPage,
    handlePageClick,
    handleToggleFilterMenu,
    transactions,
  } = useTransactionsHistoryState({ listRef });

  // Apply maxHeight style to the list container for scrolling
  useEffect(() => {
    if (listRef.current && containerRef.current) {
      // Fill available height inside the container
      listRef.current.style.height = `${containerRef.current.clientHeight - listRef.current.offsetTop}px`;
    }
  }, [containerRef]);

  if (!banks.length) {
    return <FallBackPage content="No bank accounts found." />;
  }

  return (
    <div
      className="bg-gray-bg flex h-screen w-full flex-col overflow-y-hidden pt-12 pb-2.5 min-[768px]:px-8"
      ref={containerRef}
    >
      <div className="mb-3 flex justify-between max-[768px]:px-6 min-[768px]:mb-5 min-[1024px]:mb-8">
        <Title
          title="Transaction history"
          subtitle="Gain Insights and Track Your Transactions Over Time"
        />
        {isDesktop && transactions.length > 0 && (
          <Select
            selected={selected}
            setSelected={setSelected}
          />
        )}
      </div>

      {showFullAdditionalInfo ? (
        <div className="max-[768px]:mx-6">
          <div
            className={clsx(
              'bg-dark-blue shadow-main mb-5 flex min-h-36 w-full',
              'items-center justify-between rounded-xl p-6 min-[1024px]:mb-8'
            )}
          >
            <div className="flex flex-col">
              <span className="text-[1.75rem] font-bold text-white">{selected?.cardholderName || 'N/A'}</span>
              <span className="text-sm text-white">
                <span className="text-xl">●●●● ●●●● ●●●● </span>
                <span>{selected.cardId.slice(9, 13)}</span>
              </span>
            </div>
            <div
              className={clsx(
                'flex h-22 w-41 flex-col justify-center gap-y-1 rounded-lg',
                'border border-solid border-white bg-white/50 p-4'
              )}
            >
              <span className="self-start text-sm font-medium text-white">Current Balance</span>
              <span className="text-2xl font-semibold text-white">
                {'$' + Number(selected.balance).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-3 min-[450px]:mx-6">
          <div className="bg-light-white rounded-main flex items-start justify-between px-6 py-5">
            <div className="flex items-center gap-x-4.5">
              <div className="gradient grid h-10 w-10 place-content-center rounded-full font-medium text-white">
                {shortenString(selected.cardholderName)}
              </div>
              <div className="flex flex-col gap-y-1">
                <span className="text-xl font-semibold text-[#194185]">{selected.cardholderName}</span>
                <span className="text-lg font-semibold text-[#1570EF]">${selected.balance}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {transactions.length > 0 ? (
        <>
          <div className="mb-5 flex items-center justify-between max-[768px]:px-6 max-[450px]:px-3">
            <span className="text-dark text-xl font-semibold">History</span>
            <div className="flex items-center gap-x-2">
              {!isDesktop && transactions.length > 0 && (
                <Select
                  selected={selected}
                  setSelected={setSelected}
                />
              )}
              <div
                ref={filterMenuRef}
                className="relative"
              >
                <div
                  className={clsx(
                    'shadow-main flex cursor-pointer items-center gap-x-2 rounded-lg',
                    'border border-solid px-2.5 py-1.5 min-[640px]:px-4 min-[640px]:py-2.5'
                  )}
                  onClick={handleToggleFilterMenu}
                >
                  <Filter />
                  <span className="text-dark-gray text-sm font-semibold max-[640px]:hidden">
                    Apply filter
                  </span>
                </div>
                {isFilterMenuOpen && (
                  <FiltersMenu
                    isCalendarOpen={isCalendarOpen}
                    setIsCalendarOpen={setIsCalendarOpen}
                    categories={categories}
                    banks={banks}
                    transactions={transactions}
                    setTransactions={setFilteredTransactions}
                  />
                )}
              </div>
            </div>
          </div>

          <div ref={listRef}>
            <TransactionList transactions={currentItems} />
          </div>

          {filteredTransactions.length > 0 && (
            <Pagination
              pageCount={pageCount}
              currentPage={currentPage}
              isTablet={!!isTablet}
              onPageChange={handlePageClick}
            />
          )}
        </>
      ) : (
        <FallBackPage
          content="You haven’t made any transactions"
          buttonContent="Transfer funds"
        />
      )}
    </div>
  );
}

export default memo(TransactionsHistoryPage);
