import clsx from 'clsx';
import { m } from 'framer-motion';
import { useCallback, useState } from 'react';

interface FilterChipProps {
  label: string;
  value: string;
  onRemove: () => void;
}

export function FilterChip({ label, value, onRemove }: FilterChipProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleRemove = useCallback(() => {
    setIsVisible(false);
    setTimeout(onRemove, 200);
  },[]);

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className={clsx(
        'rounded-main border-border text-gray flex items-center',
        'gap-x-2 border px-2.5 py-1.25 text-sm font-medium'
      )}
      style={{ display: isVisible ? 'flex' : 'none' }}
    >
      {label}: {value}
      <button
        className="text-gray text-sm font-bold"
        onClick={handleRemove}
      >
        ✕
      </button>
    </m.div>
  );
}
