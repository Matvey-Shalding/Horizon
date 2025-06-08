"use client";

import { useClickOutside } from "@react-hookz/web";
import chroma from "chroma-js";
import clsx from "clsx";
import Plus from "components/icons/main/home/plus";
import Arrow from "components/icons/main/transactions/arrow";
import CheckMark from "components/icons/main/transactions/checkmark";
import Card from "components/icons/main/transactions/credit-card";
import Downshift from "downshift";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MAIN_ROUTES } from "routes";
import { RootState } from "state/store";
import { Bank } from "types/Bank.interface";
import { Input } from "ui/Input";
import { shortenString } from "utils/shortenTitle";
import { v4 } from "uuid";

export function Select({
  selected,
  setSelected,
}: {
  selected: Bank;
  setSelected: Dispatch<SetStateAction<Bank>>;
}) {
  const router = useRouter();
  const banks = useSelector((state: RootState) => state.bank.banks);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    setIsOpen(false);
  });

  const colors = useMemo(() => {
    return new Array(banks.length - 1).fill(0).map((_) => {
      const bg = chroma.random().hex();
      const text = chroma(bg).luminance() > 0.5 ? "#000" : "#fff";
      return { bg, text };
    });
  }, [banks]);

  return (
    <div ref={dropdownRef} className="flex flex-col gap-y-1">
      <Downshift
        onChange={(item) => {
          if (item) {
            setSelected(item);
            setTimeout(() => setIsOpen(false), 0);
          }
        }}
        itemToString={(item) => (item ? item.cardholderName : "")}
        initialIsOpen={isOpen}
      >
        {({
          getInputProps,
          getMenuProps,
          getItemProps,
          inputValue,
          highlightedIndex,
        }) => (
          <div className="input relative">
            <div
              className="relative flex min-h-11 min-w-54 cursor-pointer items-center justify-between gap-x-1 rounded-lg border bg-white px-4.5"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <div className="flex basis-full items-center">
                <Card width={24} height={24} className="stroke-light-blue" />
                <span className="text-dark-gray basis-full text-center text-sm font-medium">
                  {selected.cardholderName}
                </span>
              </div>
              <Arrow
                className={`${isOpen ? "rotate-180" : ""} transition-transform`}
              />
            </div>

            {true && (
              <div {...getMenuProps()}>
                <div
                  className={clsx(
                    "absolute top-[calc(100%+8px)] right-0 z-50 flex max-h-100 w-70 flex-col gap-y-1.5 overflow-y-auto rounded-lg border border-gray-200 bg-white pt-3 shadow-md",
                    isOpen ? "opacity-100" : "pointer-events-none opacity-0",
                  )}
                >
                  <span className="text-blue inline-block pl-4 text-lg font-semibold">
                    Select recipient bank:
                  </span>
                  <div className="border-border border-b px-4 pb-2">
                    <Input {...getInputProps({ placeholder: "Search bank" })} />
                  </div>
                  <ul>
                    {banks.length > 0 ? (
                      banks
                        .filter(
                          (bank) =>
                            bank.cardholderName.toLowerCase().trim() !==
                            (inputValue
                              ? inputValue.toLowerCase().trim()
                              : selected.cardholderName.toLowerCase().trim()),
                        )
                        .map((bank, index, filteredBanks) => {
                          return (
                            <li
                              key={v4()}
                              {...getItemProps({ item: bank, index })}
                              className={clsx(
                                index < filteredBanks.length - 1 &&
                                  "border-b border-gray-200",
                                "cursor-pointer px-4 py-2 text-sm font-medium",
                                "transition-colors duration-150 ease-in-out",
                                highlightedIndex === index
                                  ? "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                                  : "text-gray-700 hover:bg-gray-200 hover:text-gray-900",
                                index === 0 && "rounded-t-lg",
                                index === filteredBanks.length - 1 &&
                                  "rounded-b-lg",
                              )}
                            >
                              <div className="flex items-center gap-x-3">
                                <div
                                  style={{
                                    backgroundColor: colors[index].bg,
                                    color: colors[index].text,
                                  }}
                                  className="grid h-8 w-8 place-content-center rounded-full text-sm font-medium"
                                >
                                  {shortenString(bank.cardholderName)}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-dark-gray font-semibold">
                                    {bank.cardholderName}
                                  </span>
                                </div>
                                {bank.cardId === selected.cardId && (
                                  <CheckMark />
                                )}
                              </div>
                            </li>
                          );
                        })
                    ) : (
                      <li className="px-4 py-2 text-center text-sm text-gray-500 italic">
                        No matching banks
                      </li>
                    )}
                    <li
                      onClick={() => {
                        router.push(MAIN_ROUTES.CONNECT_BANK);
                        setIsOpen(false);
                      }}
                      className="flex h-10 items-center gap-x-2 border-t border-gray-200 pl-4"
                    >
                      <Plus width={16} height={16} />
                      <span className="text-gray text-sm font-medium">
                        Add new bank
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </Downshift>
    </div>
  );
}
