"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/chat?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/chat");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-black text-white selection:bg-white/20">

      {/* Full Screen Premium Image Background */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/images/1_upscayl_2x.jpg"
          alt="Premium Cinematic Background"
          fill
          className="object-cover opacity-60"
          priority
        />
        {/* Subtle Vignette / Gradient Overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
      </div>

      <header className="absolute top-0 left-0 w-full p-6 md:p-10 z-20 flex justify-between items-center animate-fade-in-down duration-1000">
        <Image
          src="/images/logo.png"
          alt="GRII Logo"
          width={300}
          height={100}
          className="h-12 md:h-16 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
          priority
        />
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal" fallbackRedirectUrl="/chat" forceRedirectUrl="/chat">
              <button className="text-sm uppercase tracking-widest text-white/70 hover:text-white transition-colors font-semibold">
                Masuk / Daftar
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton appearance={{ elements: { userButtonAvatarBox: "h-10 w-10" } }} />
          </SignedIn>
        </div>
      </header>

      <div className="z-10 flex w-full max-w-5xl flex-col items-center px-4 text-center mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="font-sans font-bold text-[5rem] md:text-[9.5rem] leading-[0.9] tracking-tight mix-blend-overlay text-white mb-6">
          REFORMED.AI
        </h1>

        <p className="font-sans font-medium text-lg md:text-2xl tracking-tight text-white/70 mb-16">
          Temukan jawaban dari khotbah GRII.
        </p>

        {/* Premium Glass Search Interface */}
        <div className="premium-glass group focus-within:ring-1 focus-within:ring-white/30 focus-within:bg-black/60 w-full max-w-2xl rounded-2xl p-2 flex flex-col sm:flex-row items-center gap-2 transition-all duration-700 hover:bg-black/50 shadow-2xl">
          <div className="relative w-full flex items-center">
            <Search className="absolute left-6 h-5 w-5 text-white/50 transition-colors group-focus-within:text-white" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ajukan pertanyaan mendalam..."
              className="w-full bg-transparent py-5 pl-16 pr-6 text-lg text-white placeholder:text-white/40 placeholder:font-sans font-sans outline-none"
            />
          </div>

          <button onClick={handleSearch} className="shrink-0 w-full sm:w-auto outline-none">
            <div className="group/btn relative overflow-hidden flex px-10 py-5 items-center justify-center gap-3 rounded-xl bg-white text-black font-semibold tracking-wide transition-all duration-500 hover:bg-white hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              <span className="uppercase tracking-widest text-sm relative z-10 transition-transform duration-500 group-hover/btn:-translate-x-1">Masuk</span>
              <ChevronRight className="h-4 w-4 relative z-10 transition-transform duration-500 group-hover/btn:translate-x-1" />
            </div>
          </button>
        </div>
      </div>

      <footer className="absolute bottom-8 z-10 w-full text-center text-xs tracking-[0.2em] uppercase text-white/30">
        Arsitektur Kecerdasan Khotbah GRII
      </footer>
    </main>
  );
}
