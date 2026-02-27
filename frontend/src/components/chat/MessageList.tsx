"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";
import ScrollToBottom from "./ScrollToBottom";
import type { Message } from "@/types";

interface MessageListProps {
  messages: Message[];
  isStreaming?: boolean;
}

export default function MessageList({ messages, isStreaming }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Track scroll position for FAB visibility
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Find the actual scrollable element inside ScrollArea
    const scrollable = container.querySelector("[data-radix-scroll-area-viewport]");
    if (!scrollable) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollable;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      setShowScrollButton(distanceFromBottom > 200);
    };

    scrollable.addEventListener("scroll", handleScroll);
    return () => scrollable.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative flex-1" ref={scrollContainerRef}>
      <ScrollArea className="h-full">
        <div className="mx-auto max-w-4xl py-4">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Scroll-to-bottom FAB */}
      <ScrollToBottom
        visible={showScrollButton && !isStreaming}
        onClick={scrollToBottom}
      />
    </div>
  );
}
