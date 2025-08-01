import { useMediaQuery } from '@react-hookz/web';
import clsx from 'clsx';
import router from 'next/router';
import { useMemo } from 'react';
import { MAIN_ROUTES } from 'routes';
import { MEDIA_QUERIES } from 'settings/MediaQueries';
import { Transaction } from 'types/Transaction.interface';
import { CancelButton } from 'ui/CancelButton';

export function ShowMoreButton({
  sortedTransactions,
  visibleTransactions,
  handleShowMore,
  handleShowLess,
}: {
  sortedTransactions: Transaction[];
  visibleTransactions: number;
  handleShowMore: () => void;
  handleShowLess: () => void;
}) {
  const isMobile = useMediaQuery(`(max-width:${MEDIA_QUERIES.MOBILE})`);

  const MIN_TRANSACTIONS = useMemo(() => 5, []);

  return sortedTransactions.length > visibleTransactions ? (
    <div
      className={clsx('flex w-full items-center justify-center gap-2 px-3', isMobile && 'grid grid-cols-2')}
    >
      <CancelButton
        onClick={handleShowMore}
        content="Show More"
        className={`self-start`}
      />
      {visibleTransactions > MIN_TRANSACTIONS && (
        <CancelButton
          onClick={handleShowLess}
          content="Show Less"
          className={`self-start`}
        />
      )}
      {isMobile && (
        <CancelButton
          className="col-span-2"
          content="View all"
          onClick={() => void router.push(MAIN_ROUTES.TRANSACTIONS)}
        />
      )}
    </div>
  ) : null;
}
