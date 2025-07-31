import { AnimatePresence, motion } from 'framer-motion';
import { Input } from 'ui/Input';

interface SearchInputProps {
  isSidebarOpen: boolean;
}

const SearchInput = ({ isSidebarOpen }: SearchInputProps) => (
  <div className="w-full px-4">
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <Input placeholder="Search..." />
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default SearchInput;
