'use client';

import { useClickOutside, useMediaQuery } from '@react-hookz/web';
import Filter from 'components/icons/main/transactions/filter';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';
import { MEDIA_QUERIES } from 'settings/MediaQueries';
import { RootState } from 'state/store';
import 'styles/lib/pagination.css';
import { Bank } from 'types/Bank.interface';
import { Category } from 'types/Category.interface';
import { Transaction } from 'types/Transaction.interface';
import { Title } from 'ui/Title';
import { TransactionList } from 'ui/TransactionList';
import { shortenString } from 'utils/shortenTitle';
import { Arrow } from './Arrow';
import { FiltersMenu } from './FilterMenu';
import { Select } from './Select';

interface CategoryWithBank extends Category {
  bank: { cardId: string; cardholderName: string };
}

export default function TransactionsHistoryPage({}: {}) {
  const banks = useSelector((state: RootState) => state.bank.banks);
  const [selected, setSelected] = useState<Bank>(banks[0]);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  const transactions = useMemo(() => selected?.transactions || [], [selected]);

  const categories = useMemo(() => {
    return (
      selected?.categories?.map((c) => ({
        ...c,
        bank: {
          cardId: selected.cardId,
          cardholderName: selected.cardholderName,
        },
      })) || []
    );
  }, [selected]);

  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

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

  useEffect(() => {
    setCurrentPage(0);
  }, [filteredTransactions]);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useClickOutside(filterMenuRef, () => {
    if (!isCalendarOpen) {
      setIsFilterMenuOpen(false);
    }
  });

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredTransactions.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const isDesktop = useMediaQuery(`(min-width:${MEDIA_QUERIES.DESKTOPS})`);

  const isTablet = useMediaQuery(`(max-width:${MEDIA_QUERIES.TABLETS})`);

  const showFullAdditionalInfo = useMediaQuery(`(min-width:600px)`);

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

        {isDesktop && (
          <Select
            selected={selected}
            setSelected={setSelected}
          />
        )}
      </div>

      {showFullAdditionalInfo ? (
        <div className="max-[768px]:mx-6">
          <div className="bg-dark-blue shadow-main mb-5 flex min-h-36 w-full items-center justify-between rounded-xl p-6 min-[1024px]:mb-8">
            <div className="flex flex-col">
              <span className="text-[1.75rem] font-bold text-white">{selected?.cardholderName || 'N/A'}</span>
              <span className="text-sm text-white">
                <span className="text-xl">●●●● ●●●● ●●●● </span>
                <span>{selected.cardId.slice(9, 13)}</span>
              </span>
            </div>
            <div className="flex h-22 w-41 flex-col justify-center gap-y-1 rounded-lg border border-solid border-white bg-white/50 p-4">
              <span className="self-start text-sm font-medium text-white">Current Balance</span>
              <span className="text-2xl font-semibold text-white">
                {selected ? '$' + Number(selected.balance).toFixed(2) : '$0.00'}
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

      <div className="mb-5 flex items-center justify-between max-[768px]:px-6 max-[450px]:px-3">
        <span className="text-dark text-xl font-semibold">History</span>
        <div className="flex items-center gap-x-2">
          {!isDesktop && (
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
              className="shadow-main flex cursor-pointer items-center gap-x-2 rounded-lg border border-solid px-2.5 py-1.5 min-[640px]:px-4 min-[640px]:py-2.5"
              onClick={() => setIsFilterMenuOpen((prev) => !prev)}
            >
              <Filter />
              <span className="text-dark-gray text-sm font-semibold max-[640px]:hidden">Apply filter</span>
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

      <div
        className="basis-full"
        ref={listRef}
      >
        <TransactionList transactions={currentItems} />
      </div>

      {filteredTransactions.length > 0 && (
        <ReactPaginate
          breakLabel="..."
          nextLabel={<Arrow type="next" />}
          previousLabel={<Arrow type="prev" />}
          onPageChange={handlePageClick}
          pageCount={pageCount}
          forcePage={currentPage}
          //Decrease size of pagination to ~ 30px
          pageRangeDisplayed={isTablet ? 1 : 3} // <-- hide middle pages!
          marginPagesDisplayed={1} // <-- show only 3 at start and end
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          activeClassName="active"
          previousClassName="arrow"
          nextClassName="arrow"
          disabledClassName="disabled"
          breakClassName="break"
          key={pageCount} // <-- prevent ghost pagination items
        />
      )}
    </div>
  );
}
