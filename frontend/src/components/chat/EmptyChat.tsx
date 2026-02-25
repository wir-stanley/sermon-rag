"use client";

import { BookOpen } from "lucide-react";
import { SUGGESTED_QUESTIONS } from "@/lib/constants";

interface EmptyChatProps {
  onSuggestionClick: (question: string) => void;
}

export default function EmptyChat({ onSuggestionClick }: EmptyChatProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 backdrop-blur-md text-white border border-white/10 shadow-xl">
        <BookOpen className="h-8 w-8" />
      </div>

      <h2 className="mt-8 font-serif text-[2.5rem] font-medium leading-[1.1] text-white">
        Tanyakan seputar Khotbah GRII
      </h2>
      <p className="mt-4 max-w-md text-center text-sm tracking-[0.05em] text-white/60">
        Telusuri puluhan tahun khotbah Reformed. Ajukan pertanyaan teologis dan dapatkan jawaban yang berakar pada firman Tuhan.
      </p>

      <div className="mt-12 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onSuggestionClick(q)}
            className="rounded-2xl premium-glass px-5 py-4 text-left text-sm text-white/60 transition-all hover:bg-white/10 hover:text-white hover:scale-[1.02]"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
