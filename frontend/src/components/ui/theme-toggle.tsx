"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import LottieAnimation from "@/components/ui/lottie-animation";
import { themeToggle, successBurst } from "@/lib/animations";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lottieRef = useRef<any>(null);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-9 w-9" />;

  const isDark = theme === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
    setShowBurst(true);
    setTimeout(() => setShowBurst(false), 800);
    if (lottieRef.current) {
      lottieRef.current.setDirection(isDark ? -1 : 1);
      lottieRef.current.play();
    }
  };

  return (
    <motion.button
      onClick={handleToggle}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-background/80 backdrop-blur-sm text-foreground/70 hover:text-foreground hover:border-gold-500/50 transition-colors overflow-hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      {showBurst && (
        <div className="absolute inset-0 -inset-2 pointer-events-none z-10 flex items-center justify-center">
          <LottieAnimation
            animationData={successBurst}
            loop={false}
            className="h-12 w-12"
          />
        </div>
      )}
      <LottieAnimation
        animationData={themeToggle}
        loop={false}
        autoplay={false}
        lottieRef={lottieRef}
        className="h-5 w-5"
      />
    </motion.button>
  );
}
