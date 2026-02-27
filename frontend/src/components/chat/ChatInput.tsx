"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { SUGGESTED_QUESTIONS } from "@/lib/constants";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  onStop,
  isStreaming,
  disabled,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isSignedIn } = useUser();
  const { redirectToSignIn } = useClerk();

  // Cycle through suggested questions as placeholder
  useEffect(() => {
    if (value) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SUGGESTED_QUESTIONS.length);
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
          <div className="relative w-full">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                handleInput();
              }}
              onKeyDown={handleKeyDown}
              placeholder=""
              disabled={disabled}
              rows={1}
              className="min-h-[44px] max-h-[200px] w-full resize-none border-none bg-transparent text-[15px] font-medium tracking-wide text-foreground placeholder:text-muted-foreground focus-visible:ring-0 px-0 py-3 font-sans outline-none relative z-10"
            />
            {/* Cycling placeholder */}
            {!value && (
              <div className="absolute inset-0 flex items-center pointer-events-none py-3">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={placeholderIndex}
                    className="text-[15px] font-medium tracking-wide text-muted-foreground"
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
          {isStreaming ? (
            <Button
              onClick={onStop}
              size="icon"
              variant="ghost"
              className="shrink-0 text-muted-foreground hover:text-red-500 hover:bg-transparent h-[40px] w-[40px] rounded-full absolute right-3 bottom-2.5"
            >
              <Square className="h-5 w-5" />
            </Button>
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
                className="shrink-0 bg-foreground text-background dark:bg-primary dark:text-primary-foreground hover:opacity-90 transition-all duration-300 disabled:opacity-40 h-[40px] w-[40px] rounded-full shadow-sm"
              >
                <Send className="h-4 w-4 ml-0.5" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
      <p className="mx-auto mt-4 max-w-3xl text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-semibold">
        Respons AI dihasilkan dari indeks khotbah GRII dan mungkin tidak sepenuhnya akurat.
      </p>
    </div>
  );
}
