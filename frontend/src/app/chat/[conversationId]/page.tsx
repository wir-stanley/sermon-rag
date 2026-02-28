"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "@clerk/nextjs";
import { getConversation } from "@/lib/api";
import { useChat } from "@/hooks/useChat";
import { motion } from "framer-motion";
import MessageList from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import { Skeleton } from "@/components/ui/skeleton";
import type { Message } from "@/types";

export default function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = use(params);
  const convId = Number(conversationId);
  const [loading, setLoading] = useState(true);
  const { getToken, isLoaded } = useAuth();

  const {
    messages,
    setMessages,
    isStreaming,
    sendMessage,
    stopStreaming,
    setConversationId,
  } = useChat(convId);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!isLoaded) return;
      try {
        const token = await getToken();
        if (!token) {
          if (!cancelled) setLoading(false);
          return;
        }

        const detail = await getConversation(convId, token);
        if (cancelled) return;

        const loaded: Message[] = detail.messages.map((msg) => ({
          id: String(msg.id),
          role: msg.role,
          content: msg.content,
          citations: msg.citations || undefined,
          feedback: msg.feedback,
          serverMessageId: msg.id,
        }));

        setMessages(loaded);
        setConversationId(convId);
      } catch {
        // If the conversation doesn't exist or no auth, show empty
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [convId, setMessages, setConversationId, getToken, isLoaded]);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col min-w-0 w-full gap-4 p-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-1 flex-col min-w-0 w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <MessageList messages={messages} />
      <ChatInput
        onSend={sendMessage}
        onStop={stopStreaming}
        isStreaming={isStreaming}
      />
    </motion.div>
  );
}
