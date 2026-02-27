"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";
import type { Message } from "@/types";

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 min-w-0 w-full">
      <div className="mx-auto w-full max-w-4xl py-4 sm:px-4">
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
