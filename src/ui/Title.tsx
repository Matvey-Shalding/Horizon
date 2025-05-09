import { motion } from "framer-motion";

export function Title({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="max-tablet-small:mb-4.5 max-tablet-small:gap-y-2 mb-8 flex flex-col gap-y-3">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-dark max-laptop:text-3xl/tight text-4xl/tight font-semibold"
      >
        {title}
      </motion.span>
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray text-base/normal"
      >
        {subtitle}
      </motion.span>
    </div>
  );
}
