import chroma from "chroma-js";
import Plus from "components/icons/main/home/plus";
import Arrow from "components/icons/main/transactions/arrow";
import CheckMark from "components/icons/main/transactions/checkmark";
import Card from "components/icons/main/transactions/credit-card";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { UseFormSetError, UseFormSetValue } from "react-hook-form";
import { useSelector } from "react-redux";
import { PaymentTransferSchemaType } from "schemas/paymentTransfer.schema";
import { RootState } from "state/store";
import { ErrorMessage } from "ui/Error";
import { shortenString } from "utils/shortenTitle";
import { v4 } from "uuid";
import { Subtitle } from "./SubTitle";

export function BanksDropdown<T>({
  title,
  subtitle,
  errorMessage,
  setValue,
  currentBankId,
  isSubmitted,
  setError,
  isSourceBank,
  resetCounter,
}: {
  title: string;
  subtitle: string;
  errorMessage?: string;
  setValue: UseFormSetValue<PaymentTransferSchemaType>;
  setError: UseFormSetError<PaymentTransferSchemaType>;
  currentBankId?: string;
  isSubmitted: boolean;
  isSourceBank?: boolean;
  resetCounter: number;
}) {
  const router = useRouter();
  const banks = useSelector((state: RootState) => state.bank.banks);
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  useEffect(() => {
    setSelected("");
    setIsOpen(false);
  }, [resetCounter]);
  return (
    <div className="border-border flex gap-x-8 border-b pb-5">
      <Subtitle title={title} subtitle={subtitle} />
      <div className="flex flex-col gap-y-1">
        <div
          ref={ref}
          className="relative flex min-h-11 w-128 cursor-pointer items-center justify-between rounded-lg border bg-white px-4.5"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <div className="flex items-center gap-x-1">
            <Card width={24} height={24} className="stroke-light-blue" />
            <span className="text-dark-gray text-sm font-medium">
              <span className="text-dark-gray text-sm font-medium">
                {selected
                  ? banks.find((b) => b.cardId === selected)?.cardholderName
                  : "Select Account"}
              </span>
            </span>
          </div>
          <Arrow
            className={`${isOpen ? "rotate-180" : ""} transition-transform`}
          />

          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="source-dropdown"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="shadow-main absolute top-[calc(100%+10px)] right-0 z-10 flex w-100 flex-col rounded-lg bg-white"
              >
                {banks
                  .filter((b) => b.cardId !== currentBankId)
                  .map((bank) => {
                    const bg = chroma.random().hex();
                    const textColor =
                      chroma(bg).luminance() > 0.5 ? "#000" : "#fff";

                    return (
                      <div
                        key={v4()}
                        onClick={() => {
                          setSelected(bank.cardId);
                          setValue(
                            isSourceBank ? "sourceBank" : "recipientAccount",
                            bank.cardId,
                            { shouldValidate: true },
                          );
                          setTimeout(() => setIsOpen(false), 0);
                        }}
                        className="border-border flex min-h-14 w-full items-center justify-between gap-x-3 border-b px-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-x-3">
                          <div
                            style={{ backgroundColor: bg, color: textColor }}
                            className="grid h-8 w-8 place-content-center rounded-full text-sm font-medium"
                          >
                            {shortenString(bank.cardholderName)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-dark-gray font-semibold">
                              {bank.cardholderName}
                            </span>
                          </div>
                        </div>
                        {bank.cardId === selected && <CheckMark />}
                      </div>
                    );
                  })}
                <div className="flex h-10 items-center gap-x-2 pl-4">
                  <Plus width={16} height={16} />
                  <span className="text-gray text-sm font-medium">
                    Add new bank
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <ErrorMessage message={errorMessage} />
      </div>
    </div>
  );
}
