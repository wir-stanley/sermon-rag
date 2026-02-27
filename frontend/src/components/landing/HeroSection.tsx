"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { SUGGESTED_QUESTIONS } from "@/lib/constants";

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/chat?q=${encodeURIComponent(q)}`);
  }

  function handleSuggestion(question: string) {
    router.push(`/chat?q=${encodeURIComponent(question)}`);
  }

  return (
    <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
        GRII Sermon Search
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">
        Explore decades of Reformed sermons with AI-powered search.
        Ask any theological question in English or Indonesian.
      </p>

      {/* Glassmorphic search bar */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 w-full max-w-2xl"
      >
        <div className="glass flex items-center gap-3 rounded-xl px-5 py-3 transition-all focus-within:border-gold-600/50 focus-within:ring-1 focus-within:ring-gold-600/30">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about any sermon topic..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="shrink-0 rounded-lg bg-gold-600 px-4 py-1.5 text-sm font-medium text-black transition-colors hover:bg-gold-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Search
          </button>
        </div>
      </form>

      {/* Suggested questions */}
      <div className="mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
        {SUGGESTED_QUESTIONS.slice(0, 4).map((q) => (
          <button
            key={q}
            onClick={() => handleSuggestion(q)}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-gold-700 hover:text-gold-400"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
