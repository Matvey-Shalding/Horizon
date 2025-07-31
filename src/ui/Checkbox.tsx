'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface CheckboxProps {
  register?: UseFormRegister<any>;
  name?: string;
  checkBoxStyles?: string;
  checkMarkStyles?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean; // allow controlled use
  defaultChecked?: boolean; // also allow uncontrolled use
  [key: string]: any;
}

export const Checkbox = ({
  register,
  name,
  styles = '',
  style,
  onChange,
  checked,
  defaultChecked,
  checkBoxStyles,
  checkMarkStyles,
  ...props
}: CheckboxProps) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked || false);

  // Sync internal state with controlled checked prop (if provided)
  useEffect(() => {
    if (typeof checked === 'boolean') {
      setInternalChecked(checked);
    }
  }, [checked]);

  return (
    <label
      className={clsx('relative inline-flex items-center', styles)}
      style={style}
    >
      <input
        type="checkbox"
        className="peer absolute h-0 w-0 opacity-0"
        {...(register && register(String(name)))}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={(e) => {
          if (checked === undefined) {
            setInternalChecked(e.target.checked); // only update internal state in uncontrolled mode
          }
          onChange?.(e);
        }}
        {...props}
      />

      <span
        className={clsx(
          'border-border mt-0.5 flex h-4 w-4 items-center justify-center rounded-[4.5px] border-1 border-solid bg-white transition-all duration-300 ease-in-out',
          'peer-hover:border-light-blue',
          'peer-checked:bg-light-blue peer-checked:border-none',
          'peer-checked:scale-105 peer-active:scale-95',
          checkBoxStyles
        )}
      >
        <svg
          className={clsx(
            'h-3.5 w-3.5 transition-all duration-300 ease-in-out',
            internalChecked ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
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
