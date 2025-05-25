"use client";

import Plus from "components/icons/main/home/plus";
import { MENU_STATUSES, MenuStatus } from "constants/MenuStatuses";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { MAIN_ROUTES } from "routes";
import { RootState } from "state/store";
import { Button } from "ui/Button";
import { Label } from "ui/Label";
import PieChart from "ui/PieChart";
import { Transaction } from "ui/Transaction";
import { shortenString } from "utils/shortenTitle";
import { CardList } from "../connect-bank/CardList";
import { CategorySection } from "./section/CategorySection";

export default function Home({}: {}) {
  const user = useSelector((state: RootState) => state.user.user);
  const banks = useSelector((state: RootState) => state.bank.banks);

  const moneyData = useMemo(() => banks.map((bank) => bank.balance), [banks]);
  const [activeTab, setActiveTab] = useState(0);

  const router = useRouter();

  const [menuStatus, setMenuStatus] = useState<MenuStatus>(
    MENU_STATUSES.DEFAULT,
  );

  if (banks.length) {
    return (
      <div className="flex basis-full bg-gray-bg">
        <div className="border-border flex grow-1 basis-full flex-col gap-y-8 overflow-y-scroll border-r border-solid px-8 py-12">
          <div className="flex flex-col gap-y-3.5">
            <span className="text-3xl/snug font-semibold">
              Welcome,
              <span className="text-light-blue">
                {" " + user?.firstName.trim()}
              </span>
            </span>
            <span className="text-gray">
              Access & manage your account and transactions efficiently.
            </span>
          </div>

          <div className="shadow-main flex items-start justify-between border p-8">
            <div className="flex items-center gap-x-6">
              <PieChart data={moneyData.map((i) => Number(i))} />
              <div className="flex flex-col gap-y-6">
                <span className="text-blue font-semibold">
                  {banks.length} Bank Accounts
                </span>
                <div className="flex flex-col gap-y-2">
                  <span className="text-gray font-medium">
                    Total Current Balance
                  </span>
                  <span className="text-blue text-3xl/snug font-semibold">
                    $
                    {banks.reduce((acc, item) => acc + Number(item.balance), 0)}
                  </span>
                </div>
              </div>
            </div>
            <Label
              content="Add bank"
              onClick={() => router.push("/main/connect-bank")}
            >
              <Plus className="stroke-light-blue" />
            </Label>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-blue text-2xl font-semibold">
              Recent transactions
            </span>
            <button className="shadow-main text-dark-gray border px-4 py-2.5 text-sm font-semibold">
              View all
            </button>
          </div>

          {/* Tabs */}
          <div className="border-border relative flex items-start gap-x-3.5 border-b pb-1.5">
            {banks.map((bank, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`relative font-semibold ${
                  activeTab === index ? "text-light-blue" : "text-light-gray"
                }`}
              >
                {bank.cardholderName}
                {activeTab === index && (
                  <motion.div
                    layoutId="underline"
                    className="bg-light-blue absolute bottom-[-2px] left-0 h-[3px] w-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Animated Bank Info & Transactions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-y-5"
            >
              <div className="bg-light-white rounded-main flex items-start justify-between px-6 py-5">
                <div className="flex gap-x-4.5">
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
                <button className="rounded-main text-green bg-[#dafeea] px-2.5 py-0.5 text-sm font-medium">
                  savings
                </button>
              </div>

              {/* Transactions */}
              <div className="flex flex-col">
                <div className="grid h-11 grid-cols-[1.5fr_0.75fr_1.25fr_1fr] border-b border-[#EAECF0] bg-[#F9FAFB] px-4">
                  {["Transaction", "Amount", "Date", "Category"].map(
                    (title) => (
                      <div
                        key={title}
                        className="text-gray grid items-center text-xs font-medium"
                      >
                        {title}
                      </div>
                    ),
                  )}
                </div>
                {banks[activeTab].transactions.map((transaction, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                  >
                    <Transaction
                      even={i % 2 === 0}
                      currentBank={banks[activeTab]}
                      recipientBankId={transaction.recipientBankId}
                      id={transaction.id}
                      amount={transaction.amount}
                      status={transaction.status}
                      date={transaction.date}
                      category={transaction.category}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex h-screen w-150 flex-col overflow-y-scroll">
          <div className="h-30">
            <img src="/img/main/bg.jpg" alt="" />
          </div>
          <div className="basis-full px-6 pt-5">
            <div className="flex h-full basis-full flex-col gap-y-8">
              <div className="flex flex-col gap-y-1">
                <span className="text-dark text-2xl font-semibold">
                  {user?.firstName + " " + user?.lastName}
                </span>
                <span className="text-gray">{user?.email}</span>
              </div>
              <div className="flex flex-col gap-y-6">
                <div className="border-border flex justify-between border-b border-solid pb-1.5">
                  <span className="text-dark text-lg font-semibold">
                    My banks
                  </span>
                  <div
                    onClick={() => void router.push(MAIN_ROUTES.CONNECT_BANK)}
                    className="text-gray flex cursor-pointer items-center gap-x-2"
                  >
                    <Plus className="fill-gray stroke-gray" />
                    <span className="text-sm font-semibold">Add bank</span>
                  </div>
                </div>
                <CardList banks={banks} user={user} activeTab={activeTab} />
              </div>
              <CategorySection
                status={menuStatus}
                setStatus={setMenuStatus}
                activeTab={activeTab}
              />
            </div>
          </div>
        </div>
        {/* <div className='p-6'>
          {banks.length && <Card {...banks[0]} firstName={user?.firstName} lastName={user?.lastName} />}
        </div> */}
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
          {/* Floating effect on text */}
          <motion.span
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5,
            }}
            className="text-dark-gray text-2xl font-semibold"
          >
            You have no banks yet
          </motion.span>

          {/* Floating effect on button */}
          <motion.div
            className="w-full basis-full"
            animate={{
              y: [0, -5, 0],
            }}
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
