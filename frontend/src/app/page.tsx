"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronRight, MessageSquare } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { SUGGESTED_QUESTIONS } from "@/lib/constants";
import LottieAnimation from "@/components/ui/lottie-animation";
import ThemeToggle from "@/components/ui/theme-toggle";
import { heroLightRays, particlesAmbient } from "@/lib/animations";

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    if (query) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SUGGESTED_QUESTIONS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [query]);

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
    <main className="relative flex min-h-dvh flex-col items-center justify-center bg-background text-foreground overflow-hidden">
      {/* Ambient particles background */}
      <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20">
        <LottieAnimation
          animationData={particlesAmbient}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Header */}
      <header className="absolute top-0 w-full p-8 z-20 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ThemeToggle />
        </motion.div>
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SignedOut>
            <SignInButton mode="modal" fallbackRedirectUrl="/chat" forceRedirectUrl="/chat">
              <button className="text-[11px] font-medium uppercase tracking-[0.15em] text-foreground/60 hover:text-foreground transition-colors">
                Masuk
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/chat"
              className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground/50 hover:text-foreground transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Riwayat
            </Link>
            <UserButton appearance={{ elements: { userButtonAvatarBox: "h-8 w-8" } }} />
          </SignedIn>
        </motion.div>
      </header>

      {/* Main Content */}
      <div className="z-10 flex w-full max-w-3xl flex-col items-center px-6 text-center mt-[-5vh]">

        {/* Logo with light rays */}
        <motion.div
          className="relative mb-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Light rays behind logo */}
          <div className="absolute inset-0 -inset-x-16 -inset-y-8 pointer-events-none">
            <LottieAnimation
              animationData={heroLightRays}
              className="w-full h-full opacity-40 dark:opacity-25"
            />
          </div>
          <div className="relative h-24 w-72 brightness-0 dark:brightness-0 dark:invert opacity-85 hover:opacity-100 transition-opacity duration-500">
            <Image
              src="/images/logo.png"
              alt="GRII Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-cinzel font-bold text-sm tracking-tight uppercase shimmer-text mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          REFORMED.AI<sup className="text-[8px] align-super">®</sup>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="font-sans font-semibold text-[14px] leading-[1.4] tracking-tight text-muted-foreground mb-14 max-w-[420px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Sebuah arsitektur kecerdasan buatan komprehensif yang dirancang
          secara khusus untuk menemukan jawaban mendalam dari
          ribuan khotbah Gereja Reformed Injili Indonesia.
        </motion.p>

        {/* Chatbox */}
        <motion.div
          className="w-full max-w-lg group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="relative flex items-center bg-transparent border border-foreground/20 rounded-full group-focus-within:border-gold-500/60 group-focus-within:bg-card/50 group-focus-within:shadow-[0_0_20px_hsl(43_74%_49%/0.1)] transition-all duration-500 py-3 px-6 shadow-sm hover:border-foreground/40 hover:shadow-md">
            <div className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder=""
                className="w-full bg-transparent text-[15px] font-medium tracking-wide text-foreground outline-none pr-4 relative z-10"
              />
              {!query && (
                <div className="absolute inset-0 flex items-center pointer-events-none">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={placeholderIndex}
                      className="text-[15px] font-medium tracking-wide text-foreground/40"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                    >
                      {SUGGESTED_QUESTIONS[placeholderIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              )}
            </div>
            <motion.button
              onClick={handleSearch}
              className="p-2 -mr-3 text-primary-foreground bg-foreground dark:bg-primary rounded-full transition-all duration-300 outline-none shadow-sm flex items-center justify-center"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>

      </div>

      {/* Footer arrow */}
      <motion.div
        className="absolute bottom-12 text-foreground/30"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 20L12 4M12 20L18 14M12 20L6 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </main>
  );
}
