import ReactPaginate from 'react-paginate';
import { Arrow } from 'app/main/transactions/Arrow';

/**
 * Props for the Pagination component.
 */
interface PaginationProps {
  /** Total number of pages. */
  pageCount: number;
  /** Current page index (0-based). */
  currentPage: number;
  /** Whether the view is on a tablet or smaller device. */
  isTablet: boolean;
  /** Callback for page change events. */
  onPageChange: (data: { selected: number }) => void;
}

/**
 * Pagination component for navigating through pages of transactions.
 * @param props - Component props including pageCount, currentPage, isTablet, and onPageChange.
 * @returns JSX.Element
 */
export function Pagination({ pageCount, currentPage, isTablet, onPageChange }: PaginationProps) {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel={<Arrow type="next" />}
      previousLabel={<Arrow type="prev" />}
      onPageChange={onPageChange}
      pageCount={pageCount}
      forcePage={currentPage}
      pageRangeDisplayed={isTablet ? 1 : 3}
      marginPagesDisplayed={1}
      renderOnZeroPageCount={null}
      containerClassName="pagination"
      activeClassName="active"
      previousClassName="arrow"
      nextClassName="arrow"
      disabledClassName="disabled"
      breakClassName="break"
      key={pageCount}
    />
  );
}
