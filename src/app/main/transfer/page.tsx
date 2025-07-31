"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "state/store";
import { Bank } from "types/Bank.interface";

import { useMediaQuery } from "@react-hookz/web";
import {
  getPaymentTransferSchema,
  PaymentTransferSchemaType,
} from "schemas/paymentTransfer.schema";
import { paymentTransferService } from "services/paymentTransfer.service";
import { MEDIA_QUERIES } from "settings/MediaQueries";
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

  const isTablet = useMediaQuery(`(max-width:${MEDIA_QUERIES.TABLETS})`);

  const onSubmit = (data: PaymentTransferSchemaType) => {
    setResetCounter((prev) => prev + 1);
    alert("hello");
    paymentTransferService.transferFunds({
      sourceBank: data.sourceBank,
      recipientAccount: data.recipientAccount,
      balance: data.balance,
      categoryId: data.categoryId,
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
      className="bg-gray-bg flex w-full flex-col overflow-y-auto px-3 min-[450px]:px-6 pt-10 pb-8 min-[768px]:px-8 min-[768px]:pt-12 min-[768px]:pb-14"
    >
        <Title
          title="Payment Transfer"
          subtitle="Select source bank and enter details"
        />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-[640px]:mt-5 mt-3.5 mb-5 flex flex-col gap-y-2.5 min-[640px]:gap-y-4 min-[768px]:mt-8 min-[768px]:gap-y-6"
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
        {!isTablet ? (
          <div className="border-border flex border-b pb-4 min-[768px]:gap-x-8 min-[768px]:pb-5">
            <Subtitle
              title="Transfer Note (Optional)"
              subtitle="Instructions or memo"
            />
            <textarea
              placeholder="Enter your message here"
              className="text-dark no-res min-h-25 w-128 resize-none border bg-white p-2 text-sm min-[768px]:min-h-35 min-[768px]:p-3"
              {...register("note")}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-y-1.5">
            <span className="text-dark-gray text-sm/snug font-semibold">
              Transfer Note (Optional)
            </span>
            <textarea
              placeholder="Enter your message here"
              className="text-dark no-res min-h-30 basis-full resize-none border bg-white p-3"
              {...register("note")}
            />
          </div>
        )}

        {/* Amount & Category */}
        <div className="border-border flex min-[640px]:border-b min-[640px]:pb-4 min-[768px]:gap-x-8 min-[768px]:pb-5">
          {!isTablet && (
            <Subtitle title="Amount" subtitle="Enter transfer amount" />
          )}
          <div className="flex flex-col gap-y-1 max-[640px]:basis-full min-[640px]:w-128">
            <Input
              label={isTablet ? "Enter transfer amount" : ""}
              placeholder="0.00"
              register={register}
              fieldRegister="balance"
              type="number"
            />
            <ErrorMessage message={errors.balance?.message} />
          </div>
        </div>

        <CategoryDropdown
          errorMessage={errors.categoryId?.message}
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
