"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "@clerk/nextjs";
import { getConversation } from "@/lib/api";
import { useChat } from "@/hooks/useChat";
import { motion, AnimatePresence } from "framer-motion";
import MessageList from "@/components/chat/MessageList";
import ChatInput from "@/components/chat/ChatInput";
import MessageSkeleton from "@/components/chat/MessageSkeleton";
import LottieAnimation from "@/components/ui/lottie-animation";
import { scrollLoading } from "@/lib/animations";
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

  return (
    <motion.div
      className="flex flex-1 flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            className="flex flex-1 flex-col items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* Cinematic scroll loading Lottie */}
            <LottieAnimation
              animationData={scrollLoading}
              className="h-[120px] w-[120px] opacity-60"
            />
            {/* Staggered message skeletons */}
            <MessageSkeleton count={3} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            className="flex flex-1 flex-col overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              staggerChildren: 0.08,
            }}
          >
            <MessageList messages={messages} isStreaming={isStreaming} />
          </motion.div>
        )}
      </AnimatePresence>
      {!loading && (
        <ChatInput
          onSend={sendMessage}
          onStop={stopStreaming}
          isStreaming={isStreaming}
        />
      )}
    </motion.div>
  );
}
