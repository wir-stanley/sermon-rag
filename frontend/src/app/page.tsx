"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronRight, MessageSquare } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion, useScroll, useTransform, useMotionValue, AnimatePresence } from "framer-motion";
import LottieAnimation from "@/components/ui/lottie-animation";
import ThemeToggle from "@/components/ui/theme-toggle";
import { heroLightRays, particlesAmbient, welcomeCross, sendArrow, inkRipple, featherFloat } from "@/lib/animations";

const CYCLING_PLACEHOLDERS = [
  "Apa kata Alkitab tentang kedaulatan Allah?",
  "Jelaskan tentang pembenaran oleh iman",
  "Bagaimana orang Kristen memandang penderitaan?",
  "Apa makna dari Perjamuan Kudus?",
];

const subtitleText = "Sebuah arsitektur kecerdasan buatan komprehensif yang dirancang secara khusus untuk menemukan jawaban mendalam dari ribuan khotbah Gereja Reformed Injili Indonesia.";

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showRipple, setShowRipple] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Parallax scroll
  const { scrollY } = useScroll();
  const particlesY = useTransform(scrollY, [0, 500], [0, -150]);
  const lightRaysY = useTransform(scrollY, [0, 500], [0, -250]);

  // Magnetic cursor
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const dist = Math.sqrt(distX * distX + distY * distY);

    if (dist < 80) {
      const pull = (80 - dist) / 80;
      mx.set(distX * pull * 0.3);
      my.set(distY * pull * 0.3);
    } else {
      mx.set(0);
      my.set(0);
    }
  }, [mx, my]);

  const handleMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  // Cycling placeholders
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % CYCLING_PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 1000);
    if (sendRef.current) {
      sendRef.current.goToAndPlay(0, true);
    }
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
    <main
      ref={containerRef}
      className="relative flex min-h-dvh flex-col items-center justify-center bg-background text-foreground overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Parallax Layer 1: Ambient particles (0.3x scroll) */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20"
        style={{ y: particlesY }}
      >
        <LottieAnimation
          animationData={particlesAmbient}
          className="absolute inset-0 w-full h-full lottie-ambient"
        />
      </motion.div>

      {/* Parallax Layer 2: Light rays (0.5x scroll) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: lightRaysY }}
      >
        {/* welcomeCross Lottie as bg element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.15] pointer-events-none">
          <LottieAnimation
            animationData={welcomeCross}
            className="h-[300px] w-[300px] lottie-ambient"
          />
        </div>
      </motion.div>

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
              <motion.button
                className="text-[11px] font-medium uppercase tracking-[0.15em] text-foreground/60 hover:text-foreground transition-colors relative"
                whileHover={{ y: -2 }}
              >
                Masuk
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-px bg-foreground origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/chat">
              <motion.span
                className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground/50 hover:text-foreground transition-colors relative"
                whileHover={{ y: -2 }}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Riwayat
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-px bg-foreground origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.span>
            </Link>
            <UserButton appearance={{ elements: { userButtonAvatarBox: "h-8 w-8" } }} />
          </SignedIn>
        </motion.div>
      </header>

      {/* Main Content */}
      <div className="z-10 flex w-full max-w-3xl flex-col items-center px-6 text-center mt-[-5vh]">

        {/* Logo with light rays + gentle float */}
        <motion.div
          className="relative mb-10 animate-float-gentle"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-0 -inset-x-16 -inset-y-8 pointer-events-none">
            <LottieAnimation
              animationData={heroLightRays}
              className="w-full h-full opacity-40 dark:opacity-25 lottie-ambient"
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

        {/* Typewriter subtitle */}
        <motion.p
          className="font-sans font-semibold text-[14px] leading-[1.4] tracking-tight text-muted-foreground mb-14 max-w-[420px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {subtitleText.split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.02, delay: 0.5 + i * 0.02 }}
            >
              {char}
            </motion.span>
          ))}
        </motion.p>

        {/* Chatbox */}
        <motion.div
          className="w-full max-w-lg group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="relative flex items-center bg-transparent border border-foreground/20 rounded-full group-focus-within:border-gold-500/60 group-focus-within:bg-card/50 group-focus-within:shadow-[0_0_20px_hsl(43_74%_49%/0.1)] transition-all duration-500 py-3 px-6 shadow-sm hover:border-foreground/40 hover:shadow-md">
            {/* Ink ripple effect on submit */}
            {showRipple && (
              <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
                <LottieAnimation
                  animationData={inkRipple}
                  loop={false}
                  className="w-full h-full opacity-30"
                />
              </div>
            )}
            <div className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder=""
                className="w-full bg-transparent text-[15px] font-medium tracking-wide text-foreground placeholder:text-foreground/40 outline-none pr-4 relative z-10"
              />
              {/* Cycling placeholder with crossfade */}
              {!query && (
                <div className="absolute inset-0 flex items-center pointer-events-none">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={placeholderIndex}
                      className="text-[15px] font-medium tracking-wide text-foreground/40"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {CYCLING_PLACEHOLDERS[placeholderIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              )}
            </div>
            {/* Magnetic send button */}
            <motion.button
              ref={buttonRef}
              onClick={handleSearch}
              className="p-2 -mr-3 text-primary-foreground bg-foreground dark:bg-primary rounded-full transition-all duration-300 outline-none shadow-sm flex items-center justify-center relative z-10"
              style={{ x: mx, y: my }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <div className="relative h-5 w-5 flex items-center justify-center">
                <ChevronRight className="h-5 w-5" />
                <div className="absolute inset-0 pointer-events-none">
                  <LottieAnimation
                    animationData={sendArrow}
                    loop={false}
                    autoplay={false}
                    lottieRef={sendRef}
                    className="h-5 w-5 opacity-80"
                  />
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>

      </div>

      {/* Footer feather float */}
      <motion.div
        className="absolute bottom-8 text-foreground/30 pointer-events-none"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <LottieAnimation
          animationData={featherFloat}
          className="h-8 w-8 opacity-40 lottie-ambient"
        />
      </motion.div>
    </main>
  );
}
