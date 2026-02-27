"use client";

import { SUGGESTED_QUESTIONS } from "@/lib/constants";
import { motion } from "framer-motion";
import LottieAnimation from "@/components/ui/lottie-animation";
import { openBible } from "@/lib/animations";

interface EmptyChatProps {
  onSuggestionClick: (question: string) => void;
}

export default function EmptyChat({ onSuggestionClick }: EmptyChatProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <LottieAnimation
          animationData={openBible}
          className="h-[120px] w-[120px]"
        />
      </motion.div>

      <motion.h2
        className="mt-8 font-cinzel text-[2.5rem] font-medium leading-[1.1] text-foreground tracking-tight text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Tanyakan seputar Khotbah GRII
      </motion.h2>
      <motion.p
        className="mt-4 max-w-md text-center text-[13px] tracking-wide text-muted-foreground leading-relaxed font-medium"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Telusuri puluhan tahun khotbah Reformed. Ajukan pertanyaan teologis dan dapatkan jawaban yang berakar pada firman Tuhan.
      </motion.p>

      <div className="mt-12 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
        {SUGGESTED_QUESTIONS.map((q, i) => (
          <motion.button
            key={q}
            onClick={() => onSuggestionClick(q)}
            className="rounded-2xl border border-border bg-card/50 px-5 py-4 text-left text-[13px] text-foreground/80 font-medium transition-all hover:bg-card hover:text-foreground shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {q}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
