"use client";

import { BookOpen } from "lucide-react";
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
      {/* Gold divider line */}
      <svg width="100%" height="2" className="overflow-visible">
        <motion.line
          x1="0"
          y1="1"
          x2="100%"
          y2="1"
          stroke="hsl(43 74% 49%)"
          strokeWidth="1"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
      </svg>

      {/* Sources label with icon + slide-in */}
      <motion.div
        className="flex items-center gap-1.5"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <BookOpen className="h-3.5 w-3.5 text-gold-600/70" />
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Sources
        </p>
      </motion.div>

      <div className="grid gap-2 sm:grid-cols-2 items-start">
        {citations.map((citation, i) => (
          <motion.div
            key={citation.source_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <CitationCard citation={citation} index={i} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
