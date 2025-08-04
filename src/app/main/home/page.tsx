'use client';

import clsx from 'clsx';
import Plus from 'components/icons/main/home/plus';
import { AnimatePresence, m } from 'framer-motion';
import { useHomeState } from 'hooks/useHomeState.hook';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MAIN_ROUTES } from 'routes';
import { Button } from 'ui/Button';
import { CancelButton } from 'ui/CancelButton';
import { Label } from 'ui/Label';
import PieChart from 'ui/PieChart';
import { Title } from 'ui/Title';
import { TransactionList, bottomRef } from 'ui/TransactionList';
import { BankTabs } from './BankTabs';
import RightSidebar from './RightSidebar';
import { ShowMoreButton } from './ShowMoreButton';

export default function Home({}: {}) {
  const {
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
  } = useHomeState();

  const router = useRouter();

  // fix sidebar height
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.maxHeight = window.innerHeight + 'px';
    }
  }, []);

  // fix tabs width
  useEffect(() => {
    if (tabsRef.current && isSmallLaptop) {
      tabsRef.current.style.maxWidth = window.innerWidth - 120 + 'px';
    }
  }, [isSmallLaptop]);

  // scroll helper
  const scrollToBottom = () => {
    setTimeout(() => {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    }, 100);
  };

  // no banks
  if (!banks.length) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-y-4"
        >
          <m.span
            animate={{ y: [0, -5, 0] }}
            transition={{
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 1.5,
            }}
            className="text-dark-gray text-2xl font-semibold"
          >
            You have no banks yet
          </m.span>
          <m.div
            animate={{ y: [0, -5, 0] }}
            transition={{
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 1.5,
            }}
            className="w-full basis-full"
          >
            <Button
              onClick={() => void router.push(MAIN_ROUTES.CONNECT_BANK)}
              content="Connect bank"
            />
          </m.div>
        </m.div>
      </div>
    );
  }

  // main dashboard
  return (
    <div className="bg-gray-bg flex basis-full overflow-x-hidden">
      <div
        className={clsx(
          'border-border flex grow-1 basis-full flex-col gap-y-4',
          'overflow-x-hidden overflow-y-scroll',
          'border-r border-solid py-8',
          'transition-[width]',
          'min-[450px]:gap-y-5 min-[450px]:px-8',
          'md:gap-y-8'
        )}
      >
        {/* Header */}
        <div className="flex justify-between px-3">
          <Title
            title={`Welcome, ${user?.firstName.trim()}`}
            subtitle="Access & manage your account and transactions efficiently."
          />
        </div>

        {/* Overview */}
        <div
          className={clsx(
            'shadow-main mx-3 flex items-start justify-between border',
            'px-1 py-4',
            'min-[450px]:mr-0 min-[450px]:px-4 min-[450px]:py-6',
            'sm:p-8'
          )}
        >
          <div className="flex items-center gap-x-3 gap-y-2 min-[450px]:flex-row min-[450px]:gap-x-6">
            <PieChart data={moneyData.map((i) => Number(i))} />
            <div className="flex flex-col gap-y-1.5 md:gap-y-6">
              <span className="text-blue font-semibold">{banks.length} Bank Accounts</span>
              <div className="flex flex-col gap-y-1.5 min-[450px]:gap-y-2">
                <span className="text-gray text-sm font-medium min-[450px]:text-base">
                  Total Current Balance
                </span>
                <span className="text-blue text-2xl/tight font-semibold min-[450px]:text-3xl/snug">
                  ${totalBalance}
                </span>
              </div>
            </div>
          </div>
          {isNotTablet && (
            <Label
              content="Add bank"
              onClick={() => router.push('/main/connect-bank')}
            >
              <Plus className="stroke-light-blue" />
            </Label>
          )}
        </div>

        {/* Tabs */}
        <BankTabs
          banks={banks}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Transactions header */}
        <div className="flex items-center justify-between px-3">
          <span
            className={clsx(
              'text-blue -mt-1 -mb-2 inline-block px-3 text-xl',
              'font-semibold min-[450px]:px-0 min-[450px]:text-2xl'
            )}
          >
            Recent transactions
          </span>
          {!isMobile && (
            <CancelButton
              content="View all"
              onClick={() => void router.push(MAIN_ROUTES.TRANSACTIONS)}
              className="min-h-10!"
            />
          )}
        </div>

        {/* Transaction List + Show More/Less */}
        <AnimatePresence mode="wait">
          <m.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col"
          >
            {/* Bank summary */}
            <div className="bg-light-white rounded-t-main flex items-start justify-between px-6 py-5 sm:p-8">
              <div className="flex items-center gap-x-4.5">
                <div className="gradient grid h-10 w-10 place-content-center rounded-full font-medium text-white">
                  {shortenTitle}
                </div>
                <div className="flex flex-col gap-y-1">
                  <span className="text-xl font-semibold text-[#194185]">{currentBank}</span>
                  <span className="text-lg font-semibold text-[#1570EF]">${currentBankBalance}</span>
                </div>
              </div>
              {isNotTablet && (
                <button className="rounded-main text-green bg-[#dafeea] px-2.5 py-0.5 text-sm font-medium">
                  savings
                </button>
              )}
            </div>
            <div className="flex w-full basis-full flex-col gap-y-5">
              <TransactionList
                limit={visibleTransactions}
                transactions={sortedTransactions}
              />
              <ShowMoreButton
                sortedTransactions={sortedTransactions}
                visibleTransactions={visibleTransactions}
                handleShowMore={() => {
                  handleShowMore();
                  scrollToBottom();
                }}
                handleShowLess={() => {
                  handleShowLess();
                  scrollToBottom();
                }}
              />
            </div>
          </m.div>
        </AnimatePresence>
      </div>

      {/* Sidebar */}
      <RightSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeTab={activeTab}
      />
    </div>
  );
}
