import { AnimatePresence, motion } from 'framer-motion';
import Log_out from 'components/icons/sidebar/Log_out';
import { signOut } from 'next-auth/react';
import { AUTH_ROUTES } from 'routes';

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface UserSectionProps {
  user: User | null;
  showInfo: boolean;
  onLogout: () => void;
}

const UserSection = ({ user, showInfo, onLogout }: UserSectionProps) => (
  <div className="border-border flex items-center justify-center gap-x-4 self-stretch border-t px-2 pt-4">
    <AnimatePresence>
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col gap-y-0.5">
            <span className="text-dark-gray text-sm font-semibold">
              {user ? `${user.firstName?.trim()} ${user.lastName?.trim()}` : 'Loading...'}
            </span>
            <span className="text-sm">{user ? user.email?.trim() : ''}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    <Log_out
      onClick={onLogout}
      width={20}
      height={20}
    />
  </div>
);

export default UserSection;
