"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Dropdown from "components/icons/main/home/dropdown";
import { useRouter } from "next/navigation";
import { MAIN_ROUTES } from "routes";
import { setBanks } from "state/main/bankSlice";
import { RootState } from "state/store";
import { Button } from "ui/Button";
import { CancelButton } from "ui/CancelButton";
import { Card } from "ui/Card";
import { Checkbox } from "ui/Checkbox";
import { Label } from "ui/Label";
import { Title } from "ui/Title";
import { createSlug } from "utils/createSlug";

export default function Banks() {
  const router = useRouter();
  const banks = useSelector((state: RootState) => state.bank.banks);
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  const [status, setStatus] = useState<"default" | "delete">("default");
  const [selectedBanks, setSelectedBanks] = useState<Set<string>>(new Set());

  const handleToggle = () => {
    setStatus((prev) => (prev === "default" ? "delete" : "default"));
    setSelectedBanks(new Set());
  };

  const handleSelect = (cardId: string) => {
    setSelectedBanks((prev) => {
      const newSet = new Set(prev);
      newSet.has(cardId) ? newSet.delete(cardId) : newSet.add(cardId);
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedBanks.size === banks.length) {
      setSelectedBanks(new Set());
    } else {
      setSelectedBanks(new Set(banks.map((bank) => bank.cardId)));
    }
  };

  const handleDelete = async () => {
    const updatedBanks = banks.filter(
      (bank) => !selectedBanks.has(bank.cardId),
    );

    dispatch(setBanks(updatedBanks));
    setSelectedBanks(new Set());
    setStatus("default");
  };

  return (
    <div className="flex w-full flex-col gap-y-8 overflow-y-auto px-8 py-12">
      <Title
        title="My Bank Accounts"
        subtitle="Effortlessly Manage Your Banking Activities"
      />

      <div className="flex flex-col gap-y-5">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b pb-2">
          <h2 className="font-blue text-xl font-semibold">
            {status === "delete"
              ? `${selectedBanks.size} selected`
              : "Your cards"}
          </h2>

          <div className="flex items-center gap-x-4">
            <AnimatePresence mode="wait">
              {status === "delete" && (
                <motion.div
                  key="select-all-checkbox"
                  className="flex items-center gap-x-2"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <Checkbox
                    checked={selectedBanks.size === banks.length}
                    onChange={handleSelectAll}
                    svgStyle="h-4 w-4"
                    styles="w-6 h-6"
                  />
                  <Label
                    onClick={handleSelectAll}
                    content={
                      selectedBanks.size === banks.length
                        ? "Unselect All"
                        : "Select All"
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div onClick={handleToggle} className="cursor-pointer">
              <Dropdown width={20} height={20} />
            </div>
          </div>
        </div>

        {/* Cards List */}
        <motion.div
          layout
          className="flex flex-wrap items-center gap-10"
          transition={{ layout: { duration: 0.4, ease: "easeInOut" } }}
        >
          {banks.map((bank) => {
            const isChecked = selectedBanks.has(bank.cardId);

            const slug = createSlug(bank.cardholderName);

            return (
              <motion.div
                key={bank.cardId}
                className="flex w-fit flex-col gap-y-2"
                layout
              >
                <motion.div
                  className="flex items-center gap-x-5"
                  layout
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <AnimatePresence mode="sync">
                    {status === "delete" && (
                      <motion.div
                        key={`checkbox-${bank.cardId}`}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        layout
                      >
                        <Checkbox
                          svgStyle="h-4 w-4"
                          styles="w-6 h-6"
                          checked={isChecked}
                          onChange={() => handleSelect(bank.cardId)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    onClick={() => void router.push(MAIN_ROUTES.BANKS + "/" + slug)}
                    layout
                  >
                    <Card
                      {...bank}
                      firstName={user?.firstName}
                      lastName={user?.lastName}
                    />
                  </motion.div>
                </motion.div>

                {/* Spending Info */}
                <motion.div className="flex w-75 justify-end self-end" layout>
                  <div className="flex w-full flex-col gap-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-dark-gray text-sm font-medium">
                        Spending this month
                      </span>
                      <span className="text-gray text-sm">$500</span>
                    </div>
                    <div className="h-2 w-full rounded-sm bg-[#EAECF0]">
                      <motion.div
                        className="bg-dark-gray h-full rounded-sm"
                        animate={{
                          width: `${(200 / Number(bank.monthlyBudget)) * 100}%`,
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Delete Footer */}
      <AnimatePresence>
        {status === "delete" && (
          <motion.div
            className="border-border mt-3 flex justify-end gap-x-4 border-t pt-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <CancelButton
              onClick={() => {
                setSelectedBanks(new Set());
                setStatus("default");
              }}
            />
            <Button
              styles="!w-auto basis-22"
              content="Delete"
              onClick={handleDelete}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
