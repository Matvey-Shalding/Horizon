"use client";

import { useClickOutside, useMediaQuery } from "@react-hookz/web";
import chroma from "chroma-js";
import clsx from "clsx";
import Plus from "components/icons/main/home/plus";
import Arrow from "components/icons/main/transactions/arrow";
import CheckMark from "components/icons/main/transactions/checkmark";
import Card from "components/icons/main/transactions/credit-card";
import Downshift from "downshift";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { MAIN_ROUTES } from "routes";
import { MEDIA_QUERIES } from "settings/MediaQueries";
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

  const isDesktop = useMediaQuery(`(min-width:${MEDIA_QUERIES.DESKTOPS})`);
  const isTablet = useMediaQuery(`(max-width:${MEDIA_QUERIES.TABLETS})`);

  const colors = useMemo(() => {
    return new Array(banks.length - 1).fill(0).map(() => {
      const bg = chroma.random().hex();
      const text = chroma(bg).luminance() > 0.5 ? "#000" : "#fff";
      return { bg, text };
    });
  }, [banks]);

  const menu = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const updateMaxHeight = () => {
      if (menu.current) {
        const rect = menu.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.top - 20;
        menu.current.style.maxHeight = `${spaceBelow}px`;
      }
    };

    if (isOpen) {
      updateMaxHeight();
      window.addEventListener("resize", updateMaxHeight);
    }

    return () => {
      window.removeEventListener("resize", updateMaxHeight);
    };
  }, [isOpen]);

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
            {isDesktop ? (
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
            ) : (
              <div
                className="shadow-main flex cursor-pointer items-center gap-x-2 rounded-lg border border-solid px-2.5 py-1.5 min-[640px]:px-4 min-[640px]:py-2.5"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                <Card width={20} height={20} className="text-dark-gray" />
                <span className="text-dark-gray text-sm font-semibold">
                  {selected.cardholderName}
                </span>
                {!isTablet && (
                  <Arrow
                    className={`${isOpen ? "rotate-180" : ""} transition-transform`}
                  />
                )}
              </div>
            )}

            <div {...getMenuProps()}>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    ref={menu}
                    key="dropdown"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className={clsx(
                      "absolute top-[calc(100%+8px)] right-0 z-50 flex w-60 min-[768px]:w-70 flex-col overflow-y-auto rounded-lg border border-gray-200 bg-white pt-3 shadow-md",
                    )}
                  >
                    <span className="text-blue mb-1.5 inline-block pl-4 font-semibold min-[768px]:text-lg">
                      Select recipient bank:
                    </span>
                    <div className="border-border border-b px-4 pb-2">
                      <Input
                        styles="min-h-8"
                        {...getInputProps({ placeholder: "Search bank" })}
                      />
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
                          .map((bank, index, filteredBanks) => (
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
                              )}
                            >
                              <div className="flex items-center gap-x-2 min-[768px]:gap-x-3">
                                <div
                                  style={{
                                    backgroundColor: colors[index].bg,
                                    color: colors[index].text,
                                  }}
                                  className="grid size-[25px] place-content-center rounded-full text-xs font-medium min-[768px]:size-8 min-[768px]:text-sm"
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
                          ))
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </Downshift>
    </div>
  );
}
