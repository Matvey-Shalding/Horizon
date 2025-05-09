import { motion } from "framer-motion";
import "styles/assets/loader.css";

function Loader({ visible }: { visible: boolean }) {
  return (
    <motion.div
      className="loader_bg"
      initial={{ opacity: 0 }} // Initial state (invisible)
      animate={{ opacity: visible ? 0.5 : 0 }} // Fade in/out for background
      transition={{ duration: 0.5, ease: "easeInOut" }} // Smoother transition
    >
      <motion.div
        className="loader"
        initial={{ scale: 0, rotate: 0 }} // Start with no scaling and no rotation
        animate={{
          scale: visible ? 1 : 0, // Scale loader to full size
          rotate: visible ? 360 : 0, // Full rotation while scaling
        }}
        transition={{
          duration: 1.2, // Duration of scaling and rotation
          ease: "easeInOut", // Smooth scaling and rotation
          delay: 0.2, // Slight delay to make entrance feel more natural
        }}
      />
    </motion.div>
  );
}

export default Loader;
