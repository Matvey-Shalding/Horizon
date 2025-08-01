import React, { useMemo } from 'react';
import { m } from 'framer-motion';
import clsx from 'clsx';
import { useMediaQuery } from '@react-hookz/web';
import randomcolor from 'randomcolor';
import tinycolor from 'tinycolor2';
import { useSelector } from 'react-redux';

import { Category } from 'app/main/home/Category';
import { MEDIA_QUERIES } from 'settings/MediaQueries';
import { RootState } from 'state/store';
import { Transaction as TransactionType } from 'types/Transaction.interface';
import { shortenString } from 'utils/shortenTitle';

interface Props extends TransactionType {
  even?: boolean;
}

const TransactionComponent: React.FC<Props> = ({
  id,
  amount,
  status,
  date,
  category,
  even,
  recipientBankId,
}) => {
  const banks = useSelector((state: RootState) => state.bank.banks);

  const bgColor = useMemo(() => randomcolor(), []);
  const textColor = useMemo(() => (tinycolor(bgColor).isLight() ? '#000000' : '#FFFFFF'), [bgColor]);

  const title = useMemo(() => {
    return banks.find((bank) => bank.cardId === recipientBankId)?.cardholderName ?? '';
  }, [banks, recipientBankId]);

  const isNotSmallScreen = useMediaQuery(`(min-width:${MEDIA_QUERIES.SMALL_DESKTOPS})`);

  const formattedAmount = useMemo(() => {
    const trimmed = amount.trim();
    return amount.startsWith('-') ? `- $${trimmed}` : `+ $${trimmed}`;
  }, [amount]);


  return (
    <m.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className={clsx(
        even ? 'bg-white' : 'bg-[#f6fef9]',
        'grid min-h-18 w-full basis-full',
        'grid-cols-[1fr_0.75fr_1.25fr_1fr]',
        'items-center overflow-y-hidden border-b border-[#EAECF0]',
        'px-4 py-3 max-[768px]:pl-6',
        'md:grid-cols-[1.5fr_0.75fr_1.25fr_1fr]'
      )}
    >
      {/* Transaction Column (Avatar + Name) */}
      <div className="flex items-center gap-x-3">
        {isNotSmallScreen && (
          <div
            style={{ backgroundColor: bgColor, color: textColor }}
            className="grid h-10 w-10 place-content-center rounded-full text-sm font-semibold"
          >
            {shortenString(title)}
          </div>
        )}
        <span className="text-blue text-sm font-medium">{title}</span>
      </div>

      {/* Amount */}
      <div className={clsx('text-sm font-semibold', amount.startsWith('-') ? 'text-red' : 'text-green')}>
        {formattedAmount}
      </div>

      {/* Date */}
      <div className="text-gray text-sm">{date}</div>

      {/* Category */}
      <div>
        <Category category={category} />
      </div>
    </m.div>
  );
};

export const Transaction = React.memo(TransactionComponent);
