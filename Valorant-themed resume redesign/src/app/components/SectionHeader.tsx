import { motion } from "motion/react";

interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
}

export function SectionHeader({ label, title, subtitle }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-[2px] bg-val-red" />
        <span
          className="text-val-red tracking-[0.3em]"
          style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem" }}
        >
          {label}
        </span>
      </div>
      <h2 className="text-val-cream" style={{ fontSize: "1.75rem" }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-val-gray mt-2" style={{ fontSize: "0.95rem" }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
