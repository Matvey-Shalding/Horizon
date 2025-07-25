import { motion } from "framer-motion";

export function Title({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col gap-y-0 min-[450px]:gap-y-1.5 md:gap-y-3">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-dark text-2xl/snug font-semibold min-[450px]:text-3xl/tight md:text-4xl/tight"
      >
        {title}
      </motion.span>
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray text-sm min-[450px]:text-base/normal"
      >
        {subtitle}
      </motion.span>
    </div>
  );
}
