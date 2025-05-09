import { Category } from "app/main/home/Category";
import randomcolor from "randomcolor";
import { useMemo } from "react";
import tinycolor from "tinycolor2";
import { Transaction as TransactionType } from "types/Transaction.interface";
import { Status } from "./Status";
interface props extends TransactionType {
  even?: boolean; // responsible for bg of table element
}

export function Transaction({
  transaction,
  amount,
  status,
  date,
  category,
  even,
}: props) {
  const bgColor = useMemo(() => {
    return randomcolor();
  }, []);
  const textColor = useMemo(() => {
    return tinycolor(bgColor).isLight() ? "#000000" : "#FFFFFF";
  }, []);
  console.log(bgColor, textColor);
  return (
    <div
      className={`${even ? "bg-white" : "bg-light-white"} grid h-18 grid-cols-5 items-center border-b border-[#EAECF0] *:ml-3.5`}
    >
      <div className="flex items-center gap-x-3">
        <div
          style={{ backgroundColor: bgColor, color: textColor }}
          className={`grid h-10 w-10 place-content-center rounded-full`}
        >
          {transaction[0]}
        </div>
        <span className="text-blue text-sm font-medium">{transaction}</span>
      </div>
      <div
        className={`${amount.toString().startsWith("-") ? "text-red" : "text-green"} text-sm font-semibold`}
      >
        {amount.toString().startsWith("-")
          ? "-" + "$" + amount.toString().slice(1)
          : "$" + amount.toString()}
      </div>
      <Status status={status} />
      <div className="text-gray text-sm">{date}</div>
      <div>
        <Category category={category} />
      </div>
    </div>
  );
}
