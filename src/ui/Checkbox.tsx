"use client";

import clsx from "clsx";
import { useState } from "react";
import { UseFormRegister } from "react-hook-form";

interface CheckboxProps {
  register?: UseFormRegister<any>;
  name?: string;
  checkBoxStyles?: string;
  checkMarkStyles?: React.CSSProperties;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}

export const Checkbox = ({
  register,
  name,
  styles = "",
  style,
  onChange,
  checkBoxStyles,
  checkMarkStyles,
  ...props
}: CheckboxProps) => {
  const [checked, setChecked] = useState(false);

  return (
    <label
      className={clsx("relative inline-flex items-center", styles)}
      style={style}
    >
      <input
        type="checkbox"
        className="peer absolute h-0 w-0 opacity-0"
        {...(register && register(String(name)))}

        
        onChange={(e) => {
          setChecked(e.target.checked);
          onChange?.(e);
        }}
        {...props}
      />

      <span
        className={clsx(
          `border-border n mt-0.5 flex h-4 w-4 items-center justify-center rounded-[4.5px] border-1 border-solid`,
          "border-border bg-white transition-all duration-300 ease-in-out",
          "peer-hover:border-light-blue",
          "peer-checked:bg-light-blue peer-checked:border-none",
          "peer-checked:scale-105 peer-active:scale-95",
          checkBoxStyles
        )}
      >
        <svg
          className={clsx(
            "h-3.5 w-3.5 transition-all duration-300 ease-in-out",
            checked ? "scale-100 opacity-100" : "scale-50 opacity-0",
            checkMarkStyles
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    </label>
  );
};
