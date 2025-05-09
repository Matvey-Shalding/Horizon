"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import chroma from "chroma-js";
import { AnimatePresence, motion } from "framer-motion";
import { cloneDeep } from "lodash";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state/store";
import { Bank } from "types/Bank.interface";
import { z } from "zod";

import Plus from "components/icons/main/home/plus";
import Arrow from "components/icons/main/transactions/arrow";
import CheckMark from "components/icons/main/transactions/checkmark";
import CreditCard from "components/icons/main/transactions/credit-card";
import { MAIN_ROUTES } from "routes";
import { setBanks } from "state/main/bankSlice";
import { Transaction } from "types/Transaction.interface";
import { Button } from "ui/Button";
import { CancelButton } from "ui/CancelButton";
import { ErrorMessage } from "ui/Error";
import { Input } from "ui/Input";
import { Title } from "ui/Title";
import { shortenString } from "utils/shortenTitle";
import { SectionTitle } from "./SectionTitle";
import { Subtitle } from "./SubTitle";

const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { delay } },
});

export default function PaymentTransferPage() {
  const [selectedBank, setSelectedBank] = useState<string>("");
  // Schema and type
  const paymentTransferSchema = z
    .object({
      sourceBank: z.string().min(1, "Please select a source bank"),
      recipientAccount: z
        .string()
        .regex(/^\d{12}$/, "Account ID must be a 12-digit number"),
      balance: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount")
        .refine(
          (data) => {
            if (!selectedBank) return true;
            const currentAmount = parseFloat(data);
            const currentBalance =
              Number(
                banks.find((bank) => bank.cardId === selectedBank)?.balance,
              ) ?? 0;
            return currentBalance > currentAmount;
          },
          { message: "Insufficient balance in the selected bank" },
        ),
      note: z.string().optional(),
      category: z.string().min(1, "Please select a category").optional(),
    })
    .refine((data) => data.sourceBank !== data.recipientAccount, {
      path: ["recipientAccount"],
      message: "Recipient bank must be different from the source bank",
    })
    .refine(
      (data) => {
        const recipientExists = banks.some(
          (b) => b.cardId === data.recipientAccount,
        );
        return recipientExists;
      },
      {
        path: ["recipientAccount"],
        message: "Recipient bank must exist",
      },
    );

  type PaymentTransferSchemaType = z.infer<typeof paymentTransferSchema>;
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<PaymentTransferSchemaType>({
    resolver: zodResolver(paymentTransferSchema),
    mode: "onChange",
    context: { selectedBank },
  });

  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const onSubmit = (data: PaymentTransferSchemaType) => {
    const copy = cloneDeep(banks);

    const sourceBankIndex = copy.findIndex(
      (bank) => bank.cardId === data.sourceBank,
    );
    const recipientBankIndex = copy.findIndex(
      (bank) => bank.cardId === data.recipientAccount,
    );

    if (sourceBankIndex === -1 || recipientBankIndex === -1) return;

    const transactionId = crypto.randomUUID();
    const now = new Date().toISOString();

    const transaction: Transaction = {
      transaction: transactionId,
      amount: data.balance,
      status: "SUCCESS",
      date: now,
      category: data.category,
      message: data.note,
    };

    copy[sourceBankIndex].balance = String(
      Number(copy[sourceBankIndex].balance) - Number(data.balance),
    );
    copy[recipientBankIndex].balance = String(
      Number(copy[recipientBankIndex].balance) + Number(data.balance),
    );

    copy[sourceBankIndex].transactions.push({ ...transaction });
    copy[recipientBankIndex].transactions.push({ ...transaction });

    dispatch(setBanks(copy));
  };

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setValue("category", categoryName);
    setTimeout(() => {
      setIsCategoryDropdownOpen(false);
    }, 0);
  };

  const router = useRouter();
  const banks: Bank[] = useSelector((state: RootState) => state.bank.banks);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sourceBank = watch("sourceBank");
  const amount = watch("balance");

  useEffect(() => {
    if (sourceBank) {
      clearErrors("sourceBank");
    }
  }, [sourceBank, clearErrors]);

  const handleSelectBank = (cardId: string) => {
    setSelectedBank(cardId);
    setValue("sourceBank", cardId);
    setTimeout(() => {
      setIsDropdownOpen(false);
    }, 0);
  };

  const handleCancel = () => {
    reset();
    setSelectedBank("");
  };

  const bankColors = useMemo(() => {
    const colorMap: Record<string, string> = {};
    banks.forEach((bank) => {
      colorMap[bank.cardId] = chroma.random().hex();
    });
    return colorMap;
  }, [banks]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="bg-gray-bg flex w-full flex-col overflow-y-auto px-8 pt-12 pb-14"
    >
      <Title
        title="Payment Transfer"
        subtitle="Select source bank and enter details"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 mb-5 flex flex-col gap-y-6"
      >
        <SectionTitle
          title="Transfer details"
          subtitle="Enter the details of the recipient"
        />

        <div className="border-border flex gap-x-8 border-b pb-5">
          <Subtitle
            title="Select Source Bank"
            subtitle="Select the bank account you want to transfer funds from"
          />
          <div className="flex flex-col gap-y-1">
            {" "}
            <div
              ref={dropdownRef}
              className="relative flex min-h-11 w-128 cursor-pointer items-center justify-between rounded-lg border bg-white px-4.5"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              <div className="flex items-center gap-x-1">
                <CreditCard />
                <span className="text-dark-gray text-sm font-medium">
                  {selectedBank
                    ? banks.find((b) => b.cardId === selectedBank)
                        ?.cardholderName
                    : "Select Account"}
                </span>
              </div>
              <Arrow
                className={`${isDropdownOpen ? "rotate-180" : ""} transition-transform`}
              />

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    key="dropdown"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: isDropdownOpen ? 1 : 0, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="shadow-main absolute top-[calc(100%+10px)] right-0 z-10 flex w-100 flex-col rounded-lg bg-white"
                  >
                    {banks.map((bank) => {
                      const bg = bankColors[bank.cardId];
                      const textColor =
                        chroma(bg).luminance() > 0.5 ? "#000" : "#fff";

                      return (
                        <div
                          key={bank.cardId}
                          onClick={() => handleSelectBank(bank.cardId)}
                          className="border-border flex min-h-19 w-full items-center justify-between gap-x-3 border-b border-solid px-4 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-x-3">
                            <div
                              style={{ backgroundColor: bg, color: textColor }}
                              className="grid h-10 w-10 place-content-center rounded-full font-medium"
                            >
                              {shortenString(bank.cardholderName)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-dark-gray font-semibold">
                                {bank.cardholderName}
                              </span>
                              <span className="text-light-blue text-sm font-medium">
                                ${bank.balance}
                              </span>
                            </div>
                          </div>
                          {bank.cardId === selectedBank && <CheckMark />}
                        </div>
                      );
                    })}
                    <div
                      onClick={() => void router.push(MAIN_ROUTES.CONNECT_BANK)}
                      className="flex min-h-12.5 w-full items-center gap-x-2 pl-2.5 hover:bg-gray-50"
                    >
                      <Plus
                        className="stroke-dark-gray"
                        width={20}
                        height={20}
                      />
                      <span className="text-dark-gray text-sm font-medium">
                        Add new bank
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <ErrorMessage message={errors.sourceBank?.message} />
          </div>
        </div>

        <div className="border-border flex gap-x-8 border-b pb-5">
          <Subtitle
            title="Transfer Note (Optional)"
            subtitle="Please provide any additional information or instructions related to the transfer "
          />
          <textarea
            placeholder="Enter your message here"
            className="text-dark no-res min-h-35 w-128 resize-none border bg-white p-3"
            {...register("note")}
          />
        </div>

        <SectionTitle
          title="Bank account details"
          subtitle="Enter the bank account details of the recipient"
        />
        <div className="border-border flex gap-x-8 border-b pb-5">
          <Subtitle title="Recipient's Bank Account Number" />
          <div className="flex w-128 flex-col gap-y-1">
            <Input
              placeholder="Enter the account number"
              register={register}
              fieldRegister="recipientAccount"
              {...{ type: "number" }}
            />
            <ErrorMessage message={errors.recipientAccount?.message} />
          </div>
        </div>
        <div className="border-border flex gap-x-8 border-b pb-5">
          <Subtitle title="Amount" />
          <div className="flex w-128 flex-col gap-y-1">
            <Input
              placeholder="40000"
              register={register}
              fieldRegister="balance"
              {...{ type: "number" }}
            />
            <ErrorMessage message={errors.balance?.message} />
          </div>
        </div>
        <div className="border-border flex gap-x-8 border-b pb-5">
          <Subtitle
            title="Select Category"
            subtitle="Select a category for this transaction"
          />
          <div className="flex flex-col gap-y-1">
            <div
              ref={dropdownRef}
              className="relative flex min-h-11 w-128 cursor-pointer items-center justify-between rounded-lg border bg-white px-4.5"
              onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
            >
              <div className="flex items-center gap-x-1">
                <CreditCard />
                <span className="text-dark-gray text-sm font-medium">
                  {selectedCategory || "Select Category"}
                </span>
              </div>
              <Arrow
                className={`${
                  isCategoryDropdownOpen ? "rotate-180" : ""
                } transition-transform`}
              />

              <AnimatePresence>
                {isCategoryDropdownOpen && (
                  <motion.div
                    key="category-dropdown"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="shadow-main absolute top-[calc(100%+10px)] right-0 z-10 flex w-100 flex-col rounded-lg bg-white"
                  >
                    {banks
                      .find((bank) => bank.cardId === selectedBank)
                      ?.categories.map((category) => (
                        <div
                          key={category.name}
                          onClick={() => handleSelectCategory(category.name)}
                          className="border-border flex min-h-19 w-full items-center justify-between gap-x-3 border-b border-solid px-4 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-x-3">
                            <div
                              className="grid h-10 w-10 place-content-center rounded-full font-medium"
                              style={{
                                backgroundColor: category.color,
                                color:
                                  chroma(category.color).luminance() > 0.5
                                    ? "#000"
                                    : "#fff",
                              }}
                            >
                              {shortenString(category.name)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-dark-gray font-semibold">
                                {category.name}
                              </span>
                              <span className="text-light-blue text-sm font-medium">
                                Budget: ${category.budget}
                              </span>
                            </div>
                          </div>
                          {category.name === selectedCategory && <CheckMark />}
                        </div>
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <ErrorMessage message={errors.category?.message} />
          </div>
        </div>

        <div className="flex gap-3">
          <Button styles="basis-1/2" content="Transfer Funds" />
          <CancelButton className="basis-1/2" onClick={handleCancel} />
        </div>
      </form>
    </motion.div>
  );
}
