import { motion } from "motion/react";
import { PortableTextRenderer } from "../../../components/PortableTextRenderer";
import type { PortableTextBlock } from "../../../lib/sanity-types";

export function GrantSection({ content }: { content: PortableTextBlock[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <PortableTextRenderer value={content} />
    </motion.div>
  );
}
