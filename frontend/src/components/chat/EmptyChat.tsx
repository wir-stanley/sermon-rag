"use client";

import { BookOpen } from "lucide-react";
import { SUGGESTED_QUESTIONS } from "@/lib/constants";

interface EmptyChatProps {
  onSuggestionClick: (question: string) => void;
}

export default function EmptyChat({ onSuggestionClick }: EmptyChatProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2C2A29]/5 text-[#2C2A29] border border-[#2C2A29]/10 shadow-sm">
        <BookOpen className="h-8 w-8" />
      </div>

      <h2 className="mt-8 font-serif text-[2.5rem] font-medium leading-[1.1] text-[#2C2A29] tracking-tight text-center">
        Tanyakan seputar Khotbah GRII
      </h2>
      <p className="mt-4 max-w-md text-center text-[13px] tracking-wide text-[#2C2A29]/70 leading-relaxed font-medium">
        Telusuri puluhan tahun khotbah Reformed. Ajukan pertanyaan teologis dan dapatkan jawaban yang berakar pada firman Tuhan.
      </p>

      <div className="mt-12 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onSuggestionClick(q)}
            className="rounded-2xl border border-[#2C2A29]/10 bg-[#2C2A29]/5 px-5 py-4 text-left text-[13px] text-[#2C2A29]/80 font-medium transition-all hover:bg-[#2C2A29]/10 hover:text-[#2C2A29] hover:scale-[1.02] shadow-sm"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
