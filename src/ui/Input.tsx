import { InputHTMLAttributes } from "react";
import { RegisterOptions } from "react-hook-form";
import { SingUp } from "types/Auth.types";

import clsx from "clsx";
import "styles/assets/input.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder: string;
  register?: any;
  fieldRegister?: string;
  options?: RegisterOptions<SingUp, keyof SingUp>;
  styles?: string;
}

export function Input({
  label,
  placeholder,
  register,
  fieldRegister,
  options,
  onChange,
  styles = "",
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-y-1.5">
      {label && (
        <span className="text-dark-gray text-sm/snug font-semibold">
          {label}
        </span>
      )}
      <div className="border_container">
        <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
          <rect
            rx="8"
            ry="8"
            className="line"
            height="100%"
            width="100%"
            strokeLinejoin="round"
          />
        </svg>
        <input
          onChange={onChange}
          {...props}
          {...(register ? register(fieldRegister, options) : {})}
          placeholder={placeholder}
          className={clsx(
            "shadow-main text-dark-gray min-h-10 min-[768px]:min-h-11 w-full basis-full border bg-white pr-3.5 pl-3.5 text-base/normal outline-none",
          )}
        />
      </div>
    </div>
  );
}
