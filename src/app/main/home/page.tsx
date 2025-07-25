"use client";

import { useMediaQuery } from "@react-hookz/web";
import Plus from "components/icons/main/home/plus";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MAIN_ROUTES } from "routes";
import { MEDIA_QUERIES } from "settings/MediaQueries";
import { RootState } from "state/store";
import { Button } from "ui/Button";
import { Label } from "ui/Label";
import PieChart from "ui/PieChart";
import { Title } from "ui/Title";
import { TransactionList } from "ui/TransactionList";
import { shortenString } from "utils/shortenTitle";
import { BankTabs } from "./BankTabs";
import RightSidebar from "./RightSidebar";
import { ShowMoreButton } from "./ShowMoreButton";

const TRANSACTIONS_PER_PAGE = 10;

export default function Home({}: {}) {
  const user = useSelector((state: RootState) => state.user.user);
  const banks = useSelector((state: RootState) => state.bank.banks);

  const moneyData = useMemo(() => banks.map((bank) => bank.balance), [banks]);
  const [activeTab, setActiveTab] = useState(0);
  const [visibleTransactions, setVisibleTransactions] = useState(
    TRANSACTIONS_PER_PAGE,
  );

  const router = useRouter();

  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sort transactions by date (most recent first)
  const sortedTransactions = useMemo(() => {
    return [...(banks[activeTab]?.transactions || [])].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [banks, activeTab]);

  const handleShowMore = () => {
    setVisibleTransactions((prev) => prev + TRANSACTIONS_PER_PAGE);
  };

  const handleShowLess = () => {
    setVisibleTransactions((prev) => Math.max(5, prev - TRANSACTIONS_PER_PAGE));
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.maxHeight = window.innerHeight + "px";
    }
  }, []);

  const isSmallLaptop = useMediaQuery(
    `(max-width:${MEDIA_QUERIES.SMALL_DESKTOPS})`,
  );

  const isNotTablet = useMediaQuery(`(min-width:${MEDIA_QUERIES.TABLETS})`);

  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tabsRef.current && isSmallLaptop) {
      tabsRef.current.style.maxWidth = window.innerWidth - 120 + "px";
    }
  }, [isSmallLaptop]);

  const isMobile = useMediaQuery(`(max-width:${MEDIA_QUERIES.MOBILE})`);

  if (banks.length) {
    return (
      <div className="bg-gray-bg flex basis-full overflow-x-hidden">
        <div className="border-border flex grow-1 basis-full flex-col gap-y-4 overflow-x-hidden overflow-y-scroll border-r border-solid py-8 transition-[width] min-[450px]:gap-y-5 min-[450px]:px-8 md:gap-y-8">
          <div className="flex justify-between px-3">
            <Title
              title={`Welcome, ${user?.firstName.trim()}`}
              subtitle="Access & manage your account and transactions efficiently."
            />
          </div>

          <div className="shadow-main mx-3 flex items-start justify-between border px-1 py-4 min-[450px]:mr-0 min-[450px]:px-4 min-[450px]:py-6 sm:p-8">
            <div className="flex items-center gap-x-3 gap-y-2 min-[450px]:flex-row min-[450px]:gap-x-6">
              <PieChart data={moneyData.map((i) => Number(i))} />
              <div className="flex flex-col gap-y-1.5 md:gap-y-6">
                <span className="text-blue font-semibold">
                  {banks.length} Bank Accounts
                </span>
                <div className="flex flex-col gap-y-1.5 min-[450px]:gap-y-2">
                  <span className="text-gray text-sm min-[450px]:text-base font-medium">
                    Total Current Balance
                  </span>
                  <span className="text-blue text-2xl/tight font-semibold min-[450px]:text-3xl/snug">
                    $
                    {banks.reduce((acc, item) => acc + Number(item.balance), 0)}
                  </span>
                </div>
              </div>
            </div>
            {isNotTablet && (
              <Label
                content="Add bank"
                onClick={() => router.push("/main/connect-bank")}
              >
                <Plus className="stroke-light-blue" />
              </Label>
            )}
          </div>

          {/* Bank tabs with local horizontal scroll */}
          <BankTabs
            banks={banks}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <div className="flex items-center justify-between">
            <span className="text-blue -mt-1 -mb-2 inline-block px-3 text-xl font-semibold min-[450px]:px-0 min-[450px]:text-2xl">
              Recent transactions
            </span>
            {!isMobile && (
              <button
                onClick={() => void router.push(MAIN_ROUTES.TRANSACTIONS)}
                className="shadow-main text-dark-gray border px-4 py-2.5 text-sm font-semibold"
              >
                View all
              </button>
            )}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col min-[450px]:gap-y-5"
            >
              <div className="bg-light-white rounded-main flex items-start justify-between px-6 py-5">
                <div className="flex items-center gap-x-4.5">
                  <div className="gradient grid h-10 w-10 place-content-center rounded-full font-medium text-white">
                    {shortenString(banks[activeTab].cardholderName)}
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <span className="text-xl font-semibold text-[#194185]">
                      {banks[activeTab].cardholderName}
                    </span>
                    <span className="text-lg font-semibold text-[#1570EF]">
                      ${banks[activeTab].balance}
                    </span>
                  </div>
                </div>
                {isNotTablet && (
                  <button className="rounded-main text-green bg-[#dafeea] px-2.5 py-0.5 text-sm font-medium">
                    savings
                  </button>
                )}
              </div>
              <div className="flex w-full basis-full flex-col gap-y-5">
                <div className="min-w-150 overflow-x-auto">
                  <TransactionList
                    limit={visibleTransactions}
                    transactions={sortedTransactions}
                  />
                </div>
                  <ShowMoreButton
                    sortedTransactions={sortedTransactions}
                    visibleTransactions={visibleTransactions}
                    handleShowMore={handleShowMore}
                    handleShowLess={handleShowLess}
                  />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <RightSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          activeTab={activeTab}
        />
      </div>
    );
  } else {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-y-4"
        >
          <motion.span
            animate={{ y: [0, -5, 0] }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5,
            }}
            className="text-dark-gray text-2xl font-semibold"
          >
            You have no banks yet
          </motion.span>
          <motion.div
            className="w-full basis-full"
            animate={{ y: [0, -5, 0] }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5,
            }}
          >
            <Button
              onClick={() => void router.push(MAIN_ROUTES.CONNECT_BANK)}
              content="Connect bank"
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }
}
