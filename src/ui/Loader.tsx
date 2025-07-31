// components/Loader.tsx
import { m} from 'framer-motion';
import 'styles/assets/loader.css';

type LoaderProps = {
  visible: boolean;
};

function Loader({ visible }: LoaderProps) {
  return (
    <m.div
      className="loader_bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 0.5 : 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <m.div
        className="loader"
        initial={{ scale: 0, rotate: 0 }}
        animate={{
          scale: visible ? 1 : 0,
          rotate: visible ? 360 : 0,
        }}
        transition={{
          duration: 1.2,
          ease: 'easeInOut',
          delay: 0.2,
        }}
      />
    </m.div>
  );
}

export default Loader;
