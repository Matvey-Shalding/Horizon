"use client";

import { motion } from "framer-motion"; // Import framer-motion

export function Button({
  content,
  props,
  styles,
  onClick
}: {
  content: string;
  props?: any;
  styles?: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      {...props}
      onClick={onClick}
      className={` ${String(styles)} rounded-main gradient min-h-11 w-full text-base/normal text-white disabled:cursor-not-allowed`}
      initial={{ scale: 1, boxShadow: "0 0 0 rgba(0, 0, 0, 0)" }} // Initial state
      whileHover={{
        scale: 1.1, // Increase scale more on hover for emphasis
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)", // Larger and more intense shadow on hover
        backgroundColor: "#ff5500", // More vibrant hover background color
        transition: { duration: 0.3 }, // Smooth and quick transition on hover
      }}
      whileTap={{
        scale: 0.95, // Slightly scale down on click
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Less intense shadow on tap
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.3, // Smooth transition for scale and shadow
      }}
    >
      {content}
    </motion.button>
  );
}
