"use client";

import Copy from "components/icons/main/home/copy";
import PayPass from "components/icons/ui/card/PayPass";
import Visa from "components/icons/ui/card/Visa";
import { motion } from "framer-motion";
import { useState } from "react";

interface DeleteCardFormProps {
  cardId: string;
  cardholderName: string;
  firstName?: string;
  lastName?: string;
  canCopy?: boolean;
}

export function Card({
  cardId,
  cardholderName,
  firstName = "",
  lastName = "",
  canCopy = false,
}: DeleteCardFormProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(cardId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Hide after 2 seconds
    });
  };

  return (
    <div className="flex min-h-45 w-75">
      {/* Card Content */}
      <div className="bg-dark-gray relative flex basis-3/4 flex-col justify-between rounded-tl-[20px] rounded-bl-[20px] p-5 pr-0 text-white shadow-[8px_10px_16px_0px_rgba(0,0,0,0.05)]">
        {/* Copy Button */}

        <div className="flex w-full items-end justify-between pr-3">
          <span className="font-semibold">{cardholderName}</span>
          {canCopy && (
            <div
              onClick={handleCopy}
              className="rounded-main grid h-6 w-6 cursor-pointer place-content-center bg-white/30"
            >
              {copied ? (
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <polyline points="20 6 9 17 4 12" />
                </motion.svg>
              ) : (
                <Copy />
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-y-2">
          <span className="text-xs font-semibold">
            {firstName + " " + lastName}
          </span>
          <span className="font-semibold">
            {cardId.match(/.{1,4}/g)?.join(" ")}
          </span>
        </div>
      </div>

      {/* Card Branding */}
      <div className="flex basis-1/4 flex-col justify-between rounded-tr-[20px] rounded-br-[20px] bg-gradient-to-b from-[#6b48ff] to-[#ff6cae] py-5 pl-7">
        <PayPass className="ml-3" />
        <Visa />
      </div>
    </div>
  );
}
