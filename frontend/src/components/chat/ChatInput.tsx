"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    // Reset textarea height
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
        <div className="relative flex w-full items-center bg-transparent border border-[#2C2A29]/20 rounded-full focus-within:border-[#2C2A29]/60 focus-within:bg-white/30 transition-all duration-500 py-2 px-6 shadow-sm hover:border-[#2C2A29]/40 hover:shadow-md">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              handleInput();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Tanyakan tentang kebenaran teologis..."
            disabled={disabled}
            rows={1}
            className="min-h-[44px] max-h-[200px] w-full resize-none border-none bg-transparent text-[15px] font-medium tracking-wide text-[#2C2A29] placeholder:text-[#2C2A29]/40 focus-visible:ring-0 px-0 py-3 font-sans outline-none"
          />
          {isStreaming ? (
            <Button
              onClick={onStop}
              size="icon"
              variant="ghost"
              className="shrink-0 text-[#2C2A29]/50 hover:text-red-500 hover:bg-transparent h-[40px] w-[40px] rounded-full absolute right-3 bottom-2.5"
            >
              <Square className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              size="icon"
              disabled={!value.trim() || disabled}
              className="shrink-0 bg-[#2C2A29] text-[#E5DCD5] hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-40 disabled:hover:scale-100 h-[40px] w-[40px] rounded-full absolute right-3 bottom-2.5 shadow-sm"
            >
              <Send className="h-4 w-4 ml-0.5" />
            </Button>
          )}
        </div>
      </div>
      <p className="mx-auto mt-4 max-w-3xl text-center text-[10px] uppercase tracking-[0.2em] text-[#2C2A29]/30 font-semibold">
        Respons AI dihasilkan dari indeks khotbah GRII dan mungkin tidak sepenuhnya akurat.
      </p>
    </div>
  );
}
