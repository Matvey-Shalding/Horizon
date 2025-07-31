import { Logo } from 'ui/Logo';

const LogoHeader = () => (
  <div className="flex w-full flex-col gap-y-4">
    <div className="border-border flex items-center justify-center self-stretch border-b px-0 pb-4">
      <Logo />
    </div>
  </div>
);

export default LogoHeader;
