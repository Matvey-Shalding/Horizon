"use client";

import React from "react";
import { motion } from "framer-motion";

interface CancelButtonProps {
  onClick?: () => void;
  className?: string;
  content?:string
}

export function CancelButton({ onClick, className,content }: CancelButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100 ${className}`}
      initial={{ scale: 1, boxShadow: "0 0 0 rgba(0, 0, 0, 0)" }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.95,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      {content ?? "Cancel"}
    </motion.button>
  );
}
