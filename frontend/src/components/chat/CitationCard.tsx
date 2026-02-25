"use client";

import { FileText, Youtube, Calendar, User } from "lucide-react";
import type { SourceCitation } from "@/types";

interface CitationCardProps {
  citation: SourceCitation;
  index: number;
}

export default function CitationCard({ citation, index }: CitationCardProps) {
  const isYoutube = citation.source_type === "youtube";
  const Icon = isYoutube ? Youtube : FileText;
  const typeLabel = isYoutube
    ? "YouTube"
    : citation.source_type === "pdf_morning"
      ? "Morning Service"
      : "Afternoon Service";

  return (
    <div className="group rounded-lg border border-border bg-card p-3 transition-colors hover:border-gold-800/50">
      <div className="flex items-start gap-2">
        {/* Index badge */}
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gold-900/40 text-xs font-medium text-gold-400">
          {index + 1}
        </span>

        <div className="min-w-0 flex-1 space-y-1.5">
          {/* Title */}
          <p className="text-sm font-medium text-foreground leading-snug truncate">
            {citation.title}
          </p>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
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
              <span className="text-gold-600">{citation.sermon_number}</span>
            )}
            {citation.page_or_timestamp && (
              <span>{citation.page_or_timestamp}</span>
            )}
          </div>

          {/* Excerpt */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {citation.excerpt}
          </p>
        </div>
      </div>
    </div>
  );
}
