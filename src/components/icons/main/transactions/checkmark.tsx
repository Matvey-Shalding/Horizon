const CheckMark = (props?: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M20 6L9 17L4 12"
      stroke="url(#paint0_linear_8_4021)"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_8_4021"
        x1="4"
        y1="11.5"
        x2="20"
        y2="11.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#0179FE" />
        <stop
          offset="1"
          stop-color="#4893FF"
        />
      </linearGradient>
    </defs>
  </svg>
);
export default CheckMark;
