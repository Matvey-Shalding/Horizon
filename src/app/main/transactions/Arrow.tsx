'use client';

import NextArrow from 'components/icons/main/transactions/nextArrow';
import { memo } from 'react';
import { useMediaQuery } from '@react-hookz/web';
import { MEDIA_QUERIES } from 'settings/MediaQueries';

interface ArrowProps {
  type: 'prev' | 'next';
}

function ArrowComponent({ type }: ArrowProps) {
  const isSmallLaptop = useMediaQuery(`(max-width:${MEDIA_QUERIES.SMALL_DESKTOPS})`);

  return isSmallLaptop ? (
    <div className="grid size-10 place-content-center rounded-lg bg-slate-100 font-medium text-slate-800 max-[640px]:w-8">
      <NextArrow className={`size-4 stroke-[#334155] ${type === 'next' && 'rotate-180'}`} />
    </div>
  ) : type === 'prev' ? (
    <div className="flex grow-1 gap-x-1">
      <div className="flex h-10 items-center justify-center gap-x-1 rounded-lg px-5">
        <NextArrow className="size-4 stroke-slate-800" />
        <span className="text-gray text-sm font-semibold">Previous</span>
      </div>
    </div>
  ) : (
    <div className="flex grow-1 justify-end gap-x-1">
      <div className="flex h-10 items-center justify-center gap-x-1 rounded-lg px-5">
        <span className="text-gray text-sm font-semibold">Next</span>
        <NextArrow className="size-4 rotate-180" />
      </div>
    </div>
  );
}

export const Arrow = memo(ArrowComponent);
