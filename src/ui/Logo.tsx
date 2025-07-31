import LogoImg from 'components/icons/auth/Logo';

export function Logo({}: {}) {
  return (
    <div className="flex items-center gap-x-1">
      <LogoImg className="h-6.75 w-6.75" />
      <span className="laptop:text-3xl text-blue text-[1.75rem] font-bold">Horizon</span>
    </div>
  );
}
