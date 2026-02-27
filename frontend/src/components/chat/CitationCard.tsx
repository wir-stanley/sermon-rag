"use client";

import { useState, useRef, useEffect } from "react";
import { FileText, Youtube, Calendar, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SourceCitation } from "@/types";

interface CitationCardProps {
  citation: SourceCitation;
  index: number;
}

export default function CitationCard({ citation, index }: CitationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const excerptRef = useRef<HTMLParagraphElement>(null);
  const [excerptHeight, setExcerptHeight] = useState<number>(0);

  const isYoutube = citation.source_type === "youtube";
  const Icon = isYoutube ? Youtube : FileText;
  const typeLabel = isYoutube
    ? "YouTube"
    : citation.source_type === "pdf_morning"
      ? "Morning Service"
      : "Afternoon Service";

  // Measure the full height of the excerpt content
  useEffect(() => {
    if (excerptRef.current) {
      setExcerptHeight(excerptRef.current.scrollHeight);
    }
  }, [citation.excerpt]);

  const collapsedHeight = 40; // ~2 lines at 12px font with relaxed leading

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={cn(
        "group rounded-lg border bg-[#E5DCD5]/50 p-3 shadow-sm backdrop-blur-sm cursor-pointer transition-all duration-300 ease-in-out",
        expanded
          ? "border-[#2C2A29]/25 bg-[#E5DCD5]/70"
          : "border-[#2C2A29]/10 hover:border-[#2C2A29]/30"
      )}
    >
      <div className="flex items-start gap-2">
        {/* Index badge */}
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#2C2A29]/10 text-[10px] font-bold text-[#2C2A29]">
          {index + 1}
        </span>

        <div className="min-w-0 flex-1 space-y-1.5 pt-0.5">
          {/* Title */}
          <p className={cn(
            "text-[13px] font-semibold text-[#2C2A29] leading-snug transition-all duration-300",
            !expanded && "truncate"
          )}>
            {citation.title}
          </p>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-[#2C2A29]/60">
            <span className="flex items-center gap-1">
              <Icon className="h-3 w-3" />
              {typeLabel}
            </span>
            {citation.speaker && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {citation.speaker}
              </span>
            )}
            {citation.sermon_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {citation.sermon_date}
              </span>
            )}
            {citation.sermon_number && (
              <span className="text-[#2C2A29] font-semibold">{citation.sermon_number}</span>
            )}
            {citation.page_or_timestamp && (
              <span>{citation.page_or_timestamp}</span>
            )}
          </div>

          {/* Excerpt with smooth height animation */}
          <div
            className="overflow-hidden transition-[max-height] duration-400 ease-in-out"
            style={{
              maxHeight: expanded
                ? `${excerptHeight + 8}px`
                : `${collapsedHeight}px`,
            }}
          >
            <p
              ref={excerptRef}
              className="text-[12px] font-medium text-[#2C2A29]/70 leading-relaxed mt-2 italic"
            >
              &ldquo;{citation.excerpt}&rdquo;
            </p>
          </div>
        </div>

        {/* Expand indicator */}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[#2C2A29]/30 transition-transform duration-300 ease-in-out mt-0.5",
            expanded && "rotate-180"
          )}
        />
      </div>
    </div>
  );
}
