"use client";

import { motion } from "framer-motion";
import { UseFormRegister } from "react-hook-form";

interface AnimatedCheckboxProps {
  register?: UseFormRegister<any>;
  name?: string;
  styles?: string;
  svgStyle?: string;
  style?: React.CSSProperties;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}

export const Checkbox = ({
  svgStyle,
  styles = "",
  register,
  name,
  style,
  onChange,
  ...props
}: AnimatedCheckboxProps) => {
  return (
    <div className="flex items-center gap-2">
      <label className="group relative flex cursor-pointer items-center">
        <input
          type="checkbox"
          {...(register
            ? register(String(name), {
                required: "You must accept the privacy policy",
              })
            : {})}
          className="peer hidden outline-none"
          {...props}
          onChange={onChange}
        />

        <motion.div
          className={`relative flex h-5 w-5 items-center justify-center rounded-main border border-gray-300 bg-white shadow-sm transition-all duration-300 peer-checked:border-blue-600 peer-checked:bg-light-blue peer-hover:ring-2 peer-hover:ring-blue-300 ${styles}`}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          transition={{
            type: "spring",
            stiffness: 250,
            damping: 20,
          }}
        >
          <motion.svg
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: 1,
            }}
            exit={{ pathLength: 0, opacity: 0 }}
            transition={{
              duration: 0.35,
              ease: "easeInOut",
            }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-3 w-3 ${svgStyle}`}
          >
            <polyline points="20 6 9 17 4 12" />
          </motion.svg>
        </motion.div>
      </label>
    </div>
  );
};
