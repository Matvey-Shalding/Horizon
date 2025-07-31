import Error from 'components/icons/auth/Error';
import { m } from 'framer-motion';

export function ErrorMessage({ message }: { message: string | undefined }) {
  return (
    <m.div
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: message ? 'auto' : 0,
        opacity: message ? 1 : 0,
      }}
      transition={{
        opacity: { duration: 0.3, ease: 'easeInOut' },
        height: { duration: 0.3, ease: 'easeInOut' },
      }}
      className="text-red flex items-center gap-x-1 text-sm/tight"
    >
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: message ? 1 : 0 }}
        transition={{
          delay: 0.1, 
          duration: 0.3,
        }}
      >
        <Error
          width={16}
          height={16}
        />
      </m.div>
      <span>{message}</span>
    </m.div>
  );
}
