"use client";

import { useClickOutside } from "@react-hookz/web";
import Filter from "components/icons/main/transactions/filter";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import "styles/lib/pagination.css";
import { Bank } from "types/Bank.interface";
import { Category } from "types/Category.interface";
import { Transaction } from "types/Transaction.interface";
import { Title } from "ui/Title";
import { TransactionList } from "ui/TransactionList";
import { Arrow } from "./Arrow";
import { FiltersMenu } from "./FilterMenu";
import { Select } from "./Select";

interface CategoryWithBank extends Category {
  bank: { cardId: string; cardholderName: string };
}

export default function TransactionsHistoryPage({}: {}) {
  const banks = useSelector((state: RootState) => state.bank.banks);
  const [selected, setSelected] = useState<Bank>(banks[0]);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);

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
        const availableHeight =
          containerHeight - listTop - paginationHeight - 40;
        const maxItems = Math.floor(availableHeight / itemHeight);
        setItemsPerPage(Math.max(1, maxItems));
      }
    };

    calculateItemsPerPage();
    window.addEventListener("resize", calculateItemsPerPage);
    return () => window.removeEventListener("resize", calculateItemsPerPage);
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
  const currentItems = filteredTransactions.slice(
    offset,
    offset + itemsPerPage,
  );
  const pageCount = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return (
    <div
      className="bg-gray-bg flex h-screen w-full flex-col overflow-y-hidden px-8 pt-12 pb-4"
      ref={containerRef}
    >
      <div className="mb-8 flex justify-between">
        <Title
          title="Transaction history"
          subtitle="Gain Insights and Track Your Transactions Over Time"
        />
        <Select selected={selected} setSelected={setSelected} />
      </div>

      <div className="bg-dark-blue shadow-main mb-8 flex min-h-36 w-full items-center justify-between rounded-xl p-6">
        <div className="flex flex-col gap-y-4">
          <span className="text-[1.75rem] font-bold text-white">
            {selected?.cardholderName || "N/A"}
          </span>
          <div className="flex items-center gap-x-2">
            <div className="flex items-center gap-x-0.75">
              {new Array(4).fill(0).map((_, index) => (
                <div
                  key={index}
                  className="block size-[11px] rounded-full bg-white"
                />
              ))}
            </div>
            <div className="flex gap-x-0.75">
              {new Array(4).fill(0).map((_, index) => (
                <div
                  key={index}
                  className="block size-[11px] rounded-full bg-white"
                />
              ))}
            </div>
            <span className="text-sm text-white">
              {selected?.cardId.slice(-4) || "****"}
            </span>
          </div>
        </div>
        <div className="flex h-22 w-41 flex-col justify-center gap-y-1 rounded-lg border border-solid border-white bg-white/50 p-4">
          <span className="self-start text-sm font-medium text-white">
            Current Balance
          </span>
          <span className="text-2xl font-semibold text-white">
            {selected ? "$" + Number(selected.balance).toFixed(2) : "$0.00"}
          </span>
        </div>
      </div>

      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-dark text-lg font-semibold">
          Transaction history
        </span>
        <div ref={filterMenuRef} className="relative">
          <div
            className="shadow-main flex cursor-pointer items-center gap-x-2 rounded-lg border border-solid px-4 py-2.5"
            onClick={() => setIsFilterMenuOpen((prev) => !prev)}
          >
            <Filter />
            <span className="text-dark-gray text-sm font-semibold">
              Apply filter
            </span>
          </div>
          {isFilterMenuOpen && (
            <div className="menu">
              <FiltersMenu
                isCalendarOpen={isCalendarOpen}
                setIsCalendarOpen={setIsCalendarOpen}
                categories={categories}
                banks={banks}
                transactions={transactions}
                setTransactions={setFilteredTransactions}
              />
            </div>
          )}
        </div>
      </div>

      <div className="basis-full" ref={listRef}>
        <TransactionList transactions={currentItems} />
      </div>

      {filteredTransactions.length > 0 && (
        <ReactPaginate
          breakLabel="..."
          nextLabel={<Arrow type="next" />}
          previousLabel={<Arrow type="prev" />}
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          activeClassName="active"
          previousClassName="arrow"
          nextClassName="arrow"
          disabledClassName="disabled"
        />
      )}
    </div>
  );
}
