"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state/store";
import { Bank } from "types/Bank.interface";

import {
  getPaymentTransferSchema,
  PaymentTransferSchemaType,
} from "schemas/paymentTransfer.schema";
import { paymentTransferService } from "services/paymentTransfer.service";
import { Button } from "ui/Button";
import { CancelButton } from "ui/CancelButton";
import { ErrorMessage } from "ui/Error";
import { Input } from "ui/Input";
import { Title } from "ui/Title";
import { BanksDropdown } from "./BanksDropdown";
import { CategoryDropdown } from "./CategoryDropdown";
import { SectionTitle } from "./SectionTitle";
import { Subtitle } from "./SubTitle";

export default function PaymentTransferPage() {
  const banks: Bank[] = useSelector((state: RootState) => state.bank.banks);

  const paymentTransferSchema = getPaymentTransferSchema(banks);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    clearErrors,
    setError,
    getValues,
    formState: { errors, isSubmitted },
  } = useForm<PaymentTransferSchemaType>({
    resolver: zodResolver(paymentTransferSchema),
    mode: "onChange",
  });

  const dispatch = useDispatch();

  const sourceBank = watch("sourceBank");

  const [resetCounter, setResetCounter] = useState(0);

  useEffect(() => {
    if (sourceBank) clearErrors("sourceBank");
  }, [sourceBank, clearErrors]);

  console.log("FORM VALUES", getValues());

  const onSubmit = (data: PaymentTransferSchemaType) => {
    setResetCounter((prev) => prev + 1);
    alert("hello");
    paymentTransferService.transferFunds({
      sourceBank: data.sourceBank,
      recipientAccount: data.recipientAccount,
      balance: data.balance,
      category: data.category,
      note: data.note,
      banks,
      dispatch,
      reset,
      clearErrors,
    });
  };

  const handleCancel = () => {
    setResetCounter((prev) => prev + 1);
    paymentTransferService.resetFormState({
      reset,
      clearErrors,
    });
  };

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

        {/* Source Bank BanksDropdown */}
        <BanksDropdown
          isSourceBank
          resetCounter={resetCounter}
          isSubmitted={isSubmitted}
          setError={setError}
          setValue={setValue}
          errorMessage={errors.sourceBank?.message}
          title="Select Source Bank"
          subtitle="Choose account to transfer from"
        />

        {/* Recipient Bank BanksDropdown */}
        <BanksDropdown
          resetCounter={resetCounter}
          isSubmitted={isSubmitted}
          setError={setError}
          currentBankId={sourceBank}
          setValue={setValue}
          errorMessage={errors.recipientAccount?.message}
          title="Select Recipient Bank"
          subtitle="Choose account to receive funds"
        />
        <div className="border-border flex gap-x-8 border-b pb-5">
          <Subtitle
            title="Transfer Note (Optional)"
            subtitle="Instructions or memo"
          />
          <textarea
            placeholder="Enter your message here"
            className="text-dark no-res min-h-35 w-128 resize-none border bg-white p-3"
            {...register("note")}
          />
        </div>

        {/* Amount & Category */}
        <div className="border-border flex gap-x-8 border-b pb-5">
          <Subtitle title="Amount" />
          <div className="flex w-128 flex-col gap-y-1">
            <Input
              placeholder="0.00"
              register={register}
              fieldRegister="balance"
              type="number"
            />
            <ErrorMessage message={errors.balance?.message} />
          </div>
        </div>

        <CategoryDropdown
          errorMessage={errors.category?.message}
          resetCounter={resetCounter}
          title="Select Category"
          subtitle="Assign a category"
          setValue={setValue}
          categories={
            banks.find((b) => b.cardId === sourceBank)?.categories ?? []
          }
        />
        <div className="flex gap-3">
          <Button styles="basis-1/2" content="Transfer Funds" />
          <CancelButton className="basis-1/2" onClick={handleCancel} />
        </div>
      </form>
    </motion.div>
  );
}
