"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import MessageList from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import EmptyChat from "@/components/chat/EmptyChat";

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q");
  const { messages, isStreaming, sendMessage, stopStreaming, conversationId } = useChat();
  const sentInitial = useRef(false);

  // Auto-send query from landing page search bar
  useEffect(() => {
    if (initialQuery && !sentInitial.current) {
      sentInitial.current = true;
      sendMessage(initialQuery);
    }
  }, [initialQuery, sendMessage]);

  // Redirect to /chat/[id] once conversation is created (clears ?q= param)
  useEffect(() => {
    if (conversationId && initialQuery) {
      router.replace(`/chat/${conversationId}`);
    }
  }, [conversationId, initialQuery, router]);

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
