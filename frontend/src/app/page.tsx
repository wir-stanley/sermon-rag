"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronRight, MessageSquare } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <main className="relative flex min-h-dvh flex-col items-center justify-center bg-[#E5DCD5] text-[#2C2A29] selection:bg-[#2C2A29] selection:text-[#E5DCD5] overflow-hidden">

      {/* Ambient Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="absolute w-[60vh] h-[60vh] rounded-full bg-white/20 animate-glow-pulse mix-blend-overlay"></div>
        {mounted && Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="particle backdrop-blur-sm"
            style={{
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              "--duration": `${Math.random() * 8 + 6}s`,
              "--delay": `${Math.random() * 5}s`,
              "--drift-y": `${(Math.random() - 0.5) * 150}px`,
              "--drift-x": `${(Math.random() - 0.5) * 100}px`,
              "--drift-r": `${(Math.random() - 0.5) * 180}deg`
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Header */}
      <header className="absolute top-0 w-full p-8 z-20 flex justify-end items-center animate-fade-in-down duration-1000">
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal" fallbackRedirectUrl="/chat" forceRedirectUrl="/chat">
              <button className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#2C2A29]/60 hover:text-[#2C2A29] hover:scale-105 transition-all">
                Masuk
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/chat"
              className="group flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#2C2A29]/50 hover:text-[#2C2A29] transition-colors relative overflow-hidden"
            >
              <MessageSquare className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
              Riwayat
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#2C2A29] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <div className="hover:scale-105 transition-transform">
              <UserButton appearance={{ elements: { userButtonAvatarBox: "h-8 w-8 shadow-sm" } }} />
            </div>
          </SignedIn>
        </div>
      </header>

      {/* Main Content */}
      <div className="z-10 flex w-full max-w-3xl flex-col items-center px-6 text-center">
        {/* Logo container with float animation */}
        <div className="animate-float" style={{ animationDuration: '8s' }}>
          <div className="relative h-24 w-72 mb-10 brightness-0 opacity-85 hover:opacity-100 transition-opacity duration-500 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Image
              src="/images/logo.png"
              alt="GRII Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Text content */}
        <h1 className="font-sans font-bold text-sm tracking-tight uppercase shimmer-text mb-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 fill-mode-both">
          REFORMED.AI®
        </h1>

        <p className="font-sans font-semibold text-[14px] leading-[1.4] tracking-tight text-[#2C2A29]/80 mb-14 max-w-[420px] animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both">
          Sebuah arsitektur kecerdasan buatan komprehensif yang dirancang
          secara khusus untuk menemukan jawaban mendalam dari
          ribuan khotbah Gereja Reformed Injili Indonesia.
        </p>

        {/* Chatbox Input */}
        <div className="w-full max-w-lg group animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both">
          <div className="relative flex items-center bg-white/20 backdrop-blur-md border border-[#2C2A29]/20 rounded-full group-focus-within:border-[#2C2A29]/60 group-focus-within:bg-white/40 transition-all duration-500 py-3 px-6 shadow-[0_8px_32px_rgba(44,42,41,0.05)] hover:border-[#2C2A29]/40 hover:shadow-[0_12px_40px_rgba(44,42,41,0.08)]">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tuliskan pertanyaan Anda di sini..."
              className="w-full bg-transparent text-[15px] font-medium tracking-wide text-[#2C2A29] placeholder:text-[#2C2A29]/40 outline-none pr-4"
            />
            <button
              onClick={handleSearch}
              className="p-2 -mr-3 text-[#E5DCD5] bg-[#2C2A29] rounded-full hover:scale-105 active:scale-95 transition-all duration-300 outline-none shadow-[0_4px_12px_rgba(44,42,41,0.2)] flex items-center justify-center group/btn relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 rounded-full translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
              <ChevronRight className="h-5 w-5 relative z-10 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

      </div>

      {/* Footer scroll indicator */}
      <div className="absolute bottom-12 text-[#2C2A29]/40 opacity-50 flex flex-col items-center justify-center animate-in fade-in duration-1000 delay-1000 fill-mode-both">
        <svg className="animate-bounce" width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4L12 20M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </main>
  );
}
