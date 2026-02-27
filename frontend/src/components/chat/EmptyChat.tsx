"use client";

import { useRef } from "react";
import { SUGGESTED_QUESTIONS } from "@/lib/constants";
import { BookMarked, Cross, Church, Heart, Sparkles, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import LottieAnimation from "@/components/ui/lottie-animation";
import { openBible, starConstellation } from "@/lib/animations";

interface EmptyChatProps {
  onSuggestionClick: (question: string) => void;
}

const CARD_ICONS = [BookMarked, Cross, Church, Heart, Sparkles, BookOpen];

export default function EmptyChat({ onSuggestionClick }: EmptyChatProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bibleRef = useRef<any>(null);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 relative">
      {/* Ambient star constellation */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <LottieAnimation
          animationData={starConstellation}
          className="absolute inset-0 w-full h-full lottie-ambient"
        />
      </div>

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        onMouseEnter={() => {
          if (bibleRef.current) bibleRef.current.setSpeed(2);
        }}
        onMouseLeave={() => {
          if (bibleRef.current) bibleRef.current.setSpeed(1);
        }}
      >
        <LottieAnimation
          animationData={openBible}
          lottieRef={bibleRef}
          className="h-[120px] w-[120px]"
        />
      </motion.div>

      <motion.h2
        className="mt-8 font-cinzel text-[2.5rem] font-medium leading-[1.1] text-foreground tracking-tight text-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Tanyakan seputar Khotbah GRII
      </motion.h2>
      <motion.p
        className="mt-4 max-w-md text-center text-[13px] tracking-wide text-muted-foreground leading-relaxed font-medium relative z-10"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Telusuri puluhan tahun khotbah Reformed. Ajukan pertanyaan teologis dan dapatkan jawaban yang berakar pada firman Tuhan.
      </motion.p>

      {/* Decorative gold separator line */}
      <motion.div
        className="mt-8 mb-4 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <svg width="120" height="2" viewBox="0 0 120 2" className="overflow-visible">
          <motion.line
            x1="0"
            y1="1"
            x2="120"
            y2="1"
            stroke="hsl(43 74% 49%)"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </svg>
      </motion.div>

      {/* Suggestion cards with icons */}
      <div className="mt-4 grid w-full max-w-2xl gap-3 sm:grid-cols-2 relative z-10">
        {SUGGESTED_QUESTIONS.map((q, i) => {
          const Icon = CARD_ICONS[i % CARD_ICONS.length];
          return (
            <motion.button
              key={q}
              onClick={() => onSuggestionClick(q)}
              className="rounded-2xl border border-border bg-card/50 px-5 py-4 text-left text-[13px] text-foreground/80 font-medium transition-all hover:bg-card hover:text-foreground shadow-sm flex items-start gap-3 group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 16px hsl(43 74% 49% / 0.12)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="h-4 w-4 shrink-0 mt-0.5 text-gold-600/60 group-hover:text-gold-600 transition-colors" />
              <span>{q}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
