"use client";

import { motion } from "framer-motion";
import CitationCard from "./CitationCard";
import type { SourceCitation } from "@/types";

interface CitationListProps {
  citations: SourceCitation[];
}

export default function CitationList({ citations }: CitationListProps) {
  if (!citations.length) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Sources
      </p>
      <div className="grid gap-2 sm:grid-cols-2 items-start w-full min-w-0">
        {citations.map((citation, i) => (
          <motion.div
            key={citation.source_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <CitationCard citation={citation} index={i} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
