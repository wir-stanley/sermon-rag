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
    <div className="w-full p-6 pb-8 bg-gradient-to-t from-black via-black/80 to-transparent">
      <div className="premium-glass mx-auto flex max-w-3xl items-end gap-2 rounded-3xl p-2 relative shadow-2xl">
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
          className="min-h-[50px] max-h-[200px] resize-none border-none bg-transparent text-white placeholder:text-white/40 focus-visible:ring-0 px-4 py-4 font-sans"
        />
        {isStreaming ? (
          <Button
            onClick={onStop}
            size="icon"
            variant="ghost"
            className="shrink-0 text-white/50 hover:text-red-400 hover:bg-transparent h-[50px] w-[50px] rounded-full"
          >
            <Square className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            size="icon"
            disabled={!value.trim() || disabled}
            className="shrink-0 bg-white text-black hover:bg-white/80 disabled:opacity-40 h-[50px] w-[50px] rounded-full"
          >
            <Send className="h-5 w-5 ml-1" />
          </Button>
        )}
      </div>
      <p className="mx-auto mt-4 max-w-3xl text-center text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium">
        Respons AI dihasilkan dari indeks khotbah GRII dan mungkin tidak sepenuhnya akurat.
      </p>
    </div>
  );
}
