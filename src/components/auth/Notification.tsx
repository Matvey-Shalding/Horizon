import Error from 'components/icons/auth/Error';
import Success from 'components/icons/auth/Success';
import { motion } from 'framer-motion';
export function Notification({ message, type }: { message: string | undefined; type: 'success' | 'error' }) {
  return (
    <motion.div
      initial={{ height: !message ? '0' : '2.75rem' }}
      animate={{ height: !message ? '0' : '2.75rem' }}
      className={`rounded-main flex items-center gap-x-1 overflow-hidden pl-3.5 ${
        type === 'success' ? 'bg-[#D1FADF]' : 'bg-[#fde6e7]'
      }`}
    >
      {type === 'error' ? (
        <Error
          width={18}
          height={18}
        />
      ) : (
        <Success
          width={18}
          height={18}
        />
      )}
      <span className={type === 'error' ? 'text-red' : 'text-green'}>{message}</span>
    </motion.div>
  );
}
