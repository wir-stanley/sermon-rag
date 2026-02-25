"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import MessageList from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import EmptyChat from "@/components/chat/EmptyChat";

function ChatContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");
  const { messages, isStreaming, sendMessage, stopStreaming } = useChat();
  const sentInitial = useRef(false);

  // Auto-send query from landing page search bar
  useEffect(() => {
    if (initialQuery && !sentInitial.current) {
      sentInitial.current = true;
      sendMessage(initialQuery);
    }
  }, [initialQuery, sendMessage]);

  return (
    <>
      {messages.length === 0 && !initialQuery ? (
        <EmptyChat onSuggestionClick={sendMessage} />
      ) : (
        <MessageList messages={messages} />
      )}
      <ChatInput
        onSend={sendMessage}
        onStop={stopStreaming}
        isStreaming={isStreaming}
      />
    </>
  );
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatContent />
    </Suspense>
  );
}
