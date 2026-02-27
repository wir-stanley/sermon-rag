"use client";

import { useEffect, useState } from "react";
import LottiePlayer from "@/components/ui/LottiePlayer";
import { SUGGESTED_QUESTIONS } from "@/lib/constants";

interface EmptyChatProps {
  onSuggestionClick: (question: string) => void;
}

export default function EmptyChat({ onSuggestionClick }: EmptyChatProps) {
  const [bookAnimation, setBookAnimation] = useState<unknown>(null);

  useEffect(() => {
    // Fetch the animation JSON from the public directory
    fetch("/animations/book.json")
      .then((res) => res.json())
      .then((data) => setBookAnimation(data))
      .catch((err) => console.error("Failed to fetch Lottie book animation", err));
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">

      {/* Lottie Animation with Ambient Glow */}
      <div className="relative mb-6 animate-in zoom-in-95 fade-in duration-1000 fill-mode-both">
        <div className="absolute inset-0 bg-[#2C2A29]/10 rounded-full blur-2xl top-4 scale-75 animate-glow-pulse"></div>
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white/40 border border-[#2C2A29]/10 shadow-[0_8px_32px_rgba(44,42,41,0.06)] backdrop-blur-md overflow-hidden">
          {bookAnimation ? (
            <LottiePlayer
              animationData={bookAnimation}
              className="h-24 w-24 scale-125 translate-y-2 opacity-90 mix-blend-multiply"
            />
          ) : (
            // Fallback spinner while loading
            <div className="h-6 w-6 rounded-full border-2 border-[#2C2A29]/20 border-t-[#2C2A29]/80 animate-spin" />
          )}
        </div>
      </div>

      <h2 className="font-serif text-[2.5rem] font-medium leading-[1.1] text-[#2C2A29] tracking-tight text-center animate-in slide-in-from-bottom-6 fade-in duration-1000 delay-150 fill-mode-both">
        Tanyakan seputar Khotbah GRII
      </h2>
      <p className="mt-4 max-w-md text-center text-[13px] tracking-wide text-[#2C2A29]/70 leading-relaxed font-medium animate-in slide-in-from-bottom-4 fade-in duration-1000 delay-300 fill-mode-both">
        Telusuri puluhan tahun khotbah Reformed. Ajukan pertanyaan teologis dan dapatkan jawaban yang berakar pada firman Tuhan.
      </p>

      <div className="mt-12 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={q}
            onClick={() => onSuggestionClick(q)}
            className="group relative overflow-hidden rounded-2xl border border-[#2C2A29]/10 bg-white/40 px-5 py-4 text-left text-[13px] text-[#2C2A29]/80 font-medium transition-all duration-300 hover:bg-white/60 hover:text-[#2C2A29] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(44,42,41,0.06)] animate-in slide-in-from-bottom-4 fade-in fill-mode-both"
            style={{ animationDelay: `${(idx * 150) + 500}ms`, animationDuration: "800ms" }}
          >
            {/* Hover sheen effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_ease-in-out]"></div>
            <span className="relative z-10">{q}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
