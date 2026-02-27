"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import LottieAnimation from "@/components/ui/lottie-animation";
import { SUGGESTED_QUESTIONS } from "@/lib/constants";
import {
  sendArrow,
  inkRipple,
  hourglassSand,
  pulseRing,
  typingQuill,
} from "@/lib/animations";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
}

const CYCLING_QUESTIONS = SUGGESTED_QUESTIONS.slice(0, 3);

export default function ChatInput({
  onSend,
  onStop,
  isStreaming,
  disabled,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendRef = useRef<any>(null);
  const { isSignedIn } = useUser();
  const { redirectToSignIn } = useClerk();

  // Cycling placeholder for empty state
  useEffect(() => {
    if (value) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % CYCLING_QUESTIONS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [value]);

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    if (!isSignedIn) {
      redirectToSignIn();
      return;
    }

    // Trigger animations
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 800);
    if (sendRef.current) {
      sendRef.current.goToAndPlay(0, true);
    }

    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isStreaming) return;
      handleSubmit();
    }
  }

  function handleInput() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }

  return (
    <div className="w-full p-6 pb-8 bg-transparent">
      <div className="mx-auto flex max-w-3xl items-end gap-2 relative">
        <div className="relative flex w-full items-center bg-transparent border border-border rounded-full focus-within:border-gold-500/60 focus-within:bg-card/50 focus-within:shadow-[0_0_20px_hsl(43_74%_49%/0.08)] transition-all duration-500 py-2 px-6 shadow-sm hover:border-foreground/30 hover:shadow-md">
          {/* Pulse ring on focus */}
          {isFocused && (
            <div className="absolute inset-0 -inset-1 pointer-events-none z-0 opacity-20 rounded-full overflow-hidden">
              <LottieAnimation
                animationData={pulseRing}
                className="w-full h-full lottie-ambient"
              />
            </div>
          )}

          {/* Ink ripple on submit */}
          {showRipple && (
            <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center rounded-full overflow-hidden">
              <LottieAnimation
                animationData={inkRipple}
                loop={false}
                className="w-full h-full opacity-30"
              />
            </div>
          )}

          {/* Typing quill in empty unfocused state */}
          {!value && !isFocused && (
            <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-20">
              <LottieAnimation
                animationData={typingQuill}
                className="h-8 w-12 lottie-ambient"
              />
            </div>
          )}

          <div className="relative w-full z-10">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                handleInput();
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder=""
              disabled={disabled}
              rows={1}
              className="min-h-[44px] max-h-[200px] w-full resize-none border-none bg-transparent text-[15px] font-medium tracking-wide text-foreground placeholder:text-muted-foreground focus-visible:ring-0 px-0 py-3 font-sans outline-none"
            />
            {/* Cycling placeholder with crossfade */}
            {!value && (
              <div className="absolute inset-0 flex items-center pointer-events-none py-3">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={placeholderIndex}
                    className="text-[15px] font-medium tracking-wide text-muted-foreground"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                  >
                    {CYCLING_QUESTIONS[placeholderIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            )}
          </div>

          {isStreaming ? (
            <motion.div
              className="absolute right-3 bottom-2.5"
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Button
                onClick={onStop}
                size="icon"
                variant="ghost"
                className="shrink-0 text-muted-foreground hover:text-red-500 hover:bg-transparent h-[40px] w-[40px] rounded-full overflow-hidden"
              >
                <LottieAnimation
                  animationData={hourglassSand}
                  className="h-6 w-6"
                />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              className="absolute right-3 bottom-2.5"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <Button
                onClick={handleSubmit}
                size="icon"
                disabled={!value.trim() || disabled}
                className="shrink-0 bg-foreground text-background dark:bg-primary dark:text-primary-foreground hover:opacity-90 transition-all duration-300 disabled:opacity-40 h-[40px] w-[40px] rounded-full shadow-sm relative overflow-hidden"
              >
                <Send className="h-4 w-4 ml-0.5 relative z-10" />
                {/* Send arrow overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <LottieAnimation
                    animationData={sendArrow}
                    loop={false}
                    autoplay={false}
                    lottieRef={sendRef}
                    className="h-5 w-5 opacity-70"
                  />
                </div>
              </Button>
            </motion.div>
          )}

          {/* Character counter */}
          <AnimatePresence>
            {value.length > 100 && (
              <motion.span
                className="absolute -bottom-5 right-4 text-[10px] text-muted-foreground/60 font-medium"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {value.length}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Disclaimer with fade-in delay */}
      <motion.p
        className="mx-auto mt-4 max-w-3xl text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        Respons AI dihasilkan dari indeks khotbah GRII dan mungkin tidak sepenuhnya akurat.
      </motion.p>
    </div>
  );
}
