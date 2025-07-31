import clsx from 'clsx';
import { InputHTMLAttributes, memo } from 'react';
import { RegisterOptions, UseFormRegister } from 'react-hook-form';
import { SingUp } from 'types/Auth.types';

import 'styles/assets/input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder: string;
  register?: any;
  fieldRegister?: string;
  options?: RegisterOptions<SingUp, keyof SingUp>;
  styles?: string;
}

function InputComponent({
  label,
  placeholder,
  register,
  fieldRegister,
  options,
  styles = '',
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-y-1.5">
      {label && <span className="text-dark-gray text-sm/snug font-semibold">{label}</span>}
      <div className="border_container">
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            rx="8"
            ry="8"
            className="line"
            width="100%"
            height="100%"
            strokeLinejoin="round"
          />
        </svg>
        <input
          {...props}
          {...(register && fieldRegister ? register(fieldRegister, options) : {})}
          placeholder={placeholder}
          className={clsx(
            'shadow-main text-dark-gray min-h-11 w-full basis-full',
            'border bg-white pr-3.5 pl-3.5 text-base/normal outline-none',
            styles
          )}
        />
      </div>
    </div>
  );
}

export const Input = memo(InputComponent);
