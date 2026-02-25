"use client";

import CitationCard from "./CitationCard";
import type { SourceCitation } from "@/types";

interface CitationListProps {
  citations: SourceCitation[];
}

export default function CitationList({ citations }: CitationListProps) {
  if (!citations.length) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-[#2C2A29]/50 uppercase tracking-wider">
        Sources
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {citations.map((citation, i) => (
          <CitationCard key={citation.source_id} citation={citation} index={i} />
        ))}
      </div>
    </div>
  );
}
