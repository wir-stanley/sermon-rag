"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronRight, MessageSquare } from "lucide-react";
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
    <main className="relative flex min-h-dvh flex-col items-center justify-center bg-[#E5DCD5] text-[#2C2A29] selection:bg-[#2C2A29] selection:text-[#E5DCD5] overflow-hidden">

      {/* Header */}
      <header className="absolute top-0 w-full p-8 z-20 flex justify-end items-center animate-fade-in-down duration-1000">
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal" fallbackRedirectUrl="/chat" forceRedirectUrl="/chat">
              <button className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#2C2A29]/60 hover:text-[#2C2A29] transition-colors">
                Masuk
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/chat"
              className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#2C2A29]/50 hover:text-[#2C2A29] transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Riwayat
            </Link>
            <UserButton appearance={{ elements: { userButtonAvatarBox: "h-8 w-8" } }} />
          </SignedIn>
        </div>
      </header>

      {/* Main Content */}
      <div className="z-10 flex w-full max-w-3xl flex-col items-center px-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-[-5vh]">

        {/* Logo */}
        <div className="relative h-24 w-72 mb-10 brightness-0 opacity-85 hover:opacity-100 transition-opacity duration-500">
          <Image
            src="/images/logo.png"
            alt="GRII Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Studio Name equivalent */}
        <h1 className="font-sans font-bold text-sm tracking-tight uppercase text-[#2C2A29] mb-4">
          REFORMED.AI®
        </h1>

        {/* Paragraph equivalent */}
        <p className="font-sans font-semibold text-[14px] leading-[1.4] tracking-tight text-[#2C2A29]/80 mb-14 max-w-[420px]">
          Sebuah arsitektur kecerdasan buatan komprehensif yang dirancang
          secara khusus untuk menemukan jawaban mendalam dari
          ribuan khotbah Gereja Reformed Injili Indonesia.
        </p>

        {/* Chatbox */}
        <div className="w-full max-w-lg group">
          <div className="relative flex items-center bg-transparent border border-[#2C2A29]/20 rounded-full group-focus-within:border-[#2C2A29]/60 group-focus-within:bg-white/30 transition-all duration-500 py-3 px-6 shadow-sm hover:border-[#2C2A29]/40 hover:shadow-md">
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
              className="p-2 -mr-3 text-[#E5DCD5] bg-[#2C2A29] rounded-full hover:scale-105 active:scale-95 transition-all duration-300 outline-none shadow-sm flex items-center justify-center"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

      </div>

      {/* Footer cursor / arrow optional */}
      <div className="absolute bottom-12 animate-pulse text-[#2C2A29]/40 opacity-50">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 20L12 4M12 20L18 14M12 20L6 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </main>
  );
}
