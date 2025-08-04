'use client';

import clsx from 'clsx';
import { memo, useCallback, useEffect, useState } from 'react';
import { UseFormRegister } from 'react-hook-form';

interface CheckboxProps {
  register?: UseFormRegister<any>;
  name?: string;
  checkBoxStyles?: string;
  checkMarkStyles?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  defaultChecked?: boolean;
  styles?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

const CheckboxComponent = ({
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

  useEffect(() => {
    if (typeof checked === 'boolean') {
      setInternalChecked(checked);
    }
  }, [checked]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (checked === undefined) {
        setInternalChecked(e.target.checked);
      }
      onChange?.(e);
    },
    [checked, onChange]
  );

  return (
    <label className={clsx('relative inline-flex items-center', styles)}>
      <input
        type="checkbox"
        className="peer absolute h-0 w-0 bg-transparent! opacity-0"
        {...(register && register(String(name)))}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={handleChange}
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
        style={style}
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

export const Checkbox = memo(CheckboxComponent);
