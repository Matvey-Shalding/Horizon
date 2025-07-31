import Search from 'components/icons/sidebar/Search';

import 'styles/assets/input.css';

export function SearchInput({}: {}) {
  return (
    <div className="relative">
      <div className="border_container">
        <svg
          height="100%"
          width="232px"
          xmlns="http://www.w3.org/2000/svg"
        >
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
          placeholder="Search..."
          className="text-light-gray shadow-main min-h-11 w-full border py-2.5 pr-3.5 pl-8.5 outline-none"
        />
      </div>
      <Search className="absolute top-1/2 left-3.5 block size-4 -translate-y-1/2" />
    </div>
  );
}
