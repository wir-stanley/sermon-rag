"use client";

import { useState } from "react";
import { FileText, Youtube, Calendar, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import LottieAnimation from "@/components/ui/lottie-animation";
import { citationGlow, chainLinks } from "@/lib/animations";
import type { SourceCitation } from "@/types";

interface CitationCardProps {
  citation: SourceCitation;
  index: number;
}

export default function CitationCard({ citation, index }: CitationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showChainLinks, setShowChainLinks] = useState(false);

  const isYoutube = citation.source_type === "youtube";
  const Icon = isYoutube ? Youtube : FileText;
  const typeLabel = isYoutube
    ? "YouTube"
    : citation.source_type === "pdf_morning"
      ? "Morning Service"
      : "Afternoon Service";

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <motion.div
      onClick={handleToggle}
      className={cn(
        "group rounded-lg border bg-card/50 p-3 shadow-sm backdrop-blur-sm cursor-pointer transition-all duration-300 ease-in-out relative overflow-hidden",
        expanded
          ? "border-gold-500/30 bg-card/70 shadow-[0_0_12px_hsl(43_74%_49%/0.08)]"
          : "border-border hover:border-foreground/20"
      )}
      layout
      transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
    >
      {/* Citation glow overlay on expand */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LottieAnimation
              animationData={citationGlow}
              loop={false}
              className="w-full h-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start gap-2 relative z-10">
        {/* Index badge with pop-in */}
        <motion.span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-foreground/10 text-[10px] font-bold text-foreground"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 15,
            delay: index * 0.05,
          }}
        >
          {index + 1}
        </motion.span>

        <div className="min-w-0 flex-1 space-y-1.5 pt-0.5">
          {/* Title */}
          <p className={cn(
            "text-[13px] font-semibold text-foreground leading-snug transition-all duration-300",
            !expanded && "truncate"
          )}>
            {citation.title}
          </p>

          {/* Metadata row with chain-links hover */}
          <div
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-muted-foreground relative"
            onMouseEnter={() => setShowChainLinks(true)}
            onMouseLeave={() => setShowChainLinks(false)}
          >
            {showChainLinks && (
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <LottieAnimation
                  animationData={chainLinks}
                  loop={false}
                  className="h-full w-10"
                />
              </div>
            )}
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
              <span className="text-foreground font-semibold">{citation.sermon_number}</span>
            )}
            {citation.page_or_timestamp && (
              <span>{citation.page_or_timestamp}</span>
            )}
          </div>

          {/* Excerpt with Framer AnimatePresence height animation */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  opacity: { duration: 0.2 },
                }}
                className="overflow-hidden"
              >
                <p className="text-[12px] font-medium text-foreground/70 leading-relaxed mt-2 italic">
                  &ldquo;{citation.excerpt}&rdquo;
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapsed excerpt preview */}
          {!expanded && (
            <p className="text-[12px] font-medium text-foreground/70 leading-relaxed mt-1 italic line-clamp-2">
              &ldquo;{citation.excerpt}&rdquo;
            </p>
          )}
        </div>

        {/* Expand indicator */}
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
        </motion.div>
      </div>
    </motion.div>
  );
}
