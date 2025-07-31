import clsx from 'clsx';
import Log_out from 'components/icons/sidebar/Log_out';
import { AnimatePresence, m } from 'framer-motion';
import { useMemo } from 'react';
import { SingUp } from 'types/Auth.types';

interface UserSectionProps {
  user: SingUp | null | undefined;
  showInfo: boolean;
  onLogout: () => void;
}

const UserSection = ({ user, showInfo, onLogout }: UserSectionProps) => {
  const fullName = useMemo(() => {
    return user ? `${user.firstName?.trim()} ${user.lastName?.trim()}` : 'Loading...';
  }, [user]);

  const formattedEmail = useMemo(() => {
    return user ? user.email?.trim() : '';
  }, [user]);

  return (
    <div
      className={clsx(
        'border-border flex items-center justify-center gap-x-4',
        'self-stretch border-t px-2 pt-4'
      )}
    >
      <AnimatePresence>
        {showInfo && (
          <m.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-y-0.5">
              <span className="text-dark-gray text-sm font-semibold">{fullName}</span>
              <span className="text-sm">{formattedEmail}</span>
            </div>
          </m.div>
        )}
      </AnimatePresence>
      <Log_out
        onClick={onLogout}
        width={20}
        height={20}
      />
    </div>
  );
};

export default UserSection;
