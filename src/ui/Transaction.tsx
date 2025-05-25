import { Category } from "app/main/home/Category";
import randomcolor from "randomcolor";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "state/store";
import tinycolor from "tinycolor2";
import { Bank } from "types/Bank.interface";
import { Transaction as TransactionType } from "types/Transaction.interface";
import { shortenString } from "utils/shortenTitle";
interface props extends TransactionType {
  even?: boolean; // responsible for bg of table element
  currentBank: Bank;
}

export function Transaction({
  id,
  amount,
  status,
  date,
  category,
  even,
  recipientBankId,
  currentBank,
}: props) {
  const banks = useSelector((state: RootState) => state.bank.banks);
  const bgColor = useMemo(() => {
    return randomcolor();
  }, []);
  const textColor = useMemo(() => {
    return tinycolor(bgColor).isLight() ? "#000000" : "#FFFFFF";
  }, []);
  const title = useMemo(() => {
    if (amount.includes("-")) {
      return (
        banks.find((bank) => bank.cardId === recipientBankId)?.cardholderName ??
        ""
      );
    } else {
      return (
        banks.find((bank) => bank.cardId === recipientBankId)?.cardholderName ??
        ""
      );
    }
  }, [banks]);
  return (
    <div
      className={`${
        even ? "bg-white" : "bg-[#f6fef9]"
      } grid grid-cols-[1.5fr_0.75fr_1.25fr_1fr] items-center border-b border-[#EAECF0] px-4 py-3`}
    >
      {/* Transaction Column (Avatar + Name) */}
      <div className="flex items-center gap-x-3">
        <div
          style={{ backgroundColor: bgColor, color: textColor }}
          className="grid h-10 w-10 place-content-center rounded-full text-sm font-semibold"
        >
          {shortenString(title)}
        </div>
        <span className="text-blue text-sm font-medium">{title}</span>
      </div>

      {/* Amount */}
      <div
        className={`text-sm font-semibold ${
          amount.startsWith("-") ? "text-red" : "text-green"
        }`}
      >
        {amount.startsWith("-")
          ? `- $${amount.slice(1).trim()}`
          : `+ $${amount.slice(1).trim()}`}
      </div>

      {/* Date */}
      <div className="text-gray text-sm">{date}</div>

      {/* Category */}
      <div className="">
        <Category category={category} />
      </div>
    </div>
  );
}
