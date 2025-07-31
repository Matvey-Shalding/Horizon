import Error from 'components/icons/auth/Error';
import { motion } from 'framer-motion';

export function ErrorMessage({ message }: { message: string | undefined }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }} // Start with 0 height and opacity 0
      animate={{
        height: message ? 'auto' : 0, // Animate height to auto when the message appears
        opacity: message ? 1 : 0, // Fade in/out based on message existence
      }}
      transition={{
        opacity: { duration: 0.3, ease: 'easeInOut' }, // Smooth opacity transition
        height: { duration: 0.3, ease: 'easeInOut' }, // Smooth height transition
      }}
      className="text-red flex items-center gap-x-1 text-sm/tight"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: message ? 1 : 0 }} // Fade in/out the icon
        transition={{
          delay: 0.1, // Slight delay for the icon fade
          duration: 0.3, // Smooth fade duration
        }}
      >
        <Error
          width={16}
          height={16}
        />
      </motion.div>
      <span>{message}</span>
    </motion.div>
  );
}
