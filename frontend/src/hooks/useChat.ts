"use client";

import { useState, useCallback, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { streamChat } from "@/lib/sse";
import type { Message, SourceCitation } from "@/types";

export function useChat(initialConversationId?: number) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<number | undefined>(
    initialConversationId
  );
  const { getToken } = useAuth();
  const abortRef = useRef(false);

  const sendMessage = useCallback(
    async (question: string) => {
      if (!question.trim() || isStreaming) return;

      // Add user message
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: question.trim(),
      };

      // Add placeholder assistant message
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "",
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);
      abortRef.current = false;

      let accumulatedContent = "";
      let citations: SourceCitation[] = [];
      let serverMessageId: number | undefined;

      try {
        const token = await getToken();
        const stream = streamChat({
          question: question.trim(),
          conversation_id: conversationId,
        }, token || undefined);

        for await (const event of stream) {
          if (abortRef.current) break;

          switch (event.type) {
            case "conversation":
              setConversationId(event.conversation_id);
              break;

            case "token":
              accumulatedContent += event.content;
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    content: accumulatedContent,
                  };
                }
                return updated;
              });
              break;

            case "citations":
              citations = event.data;
              break;

            case "message_id":
              serverMessageId = event.id;
              break;

            case "done":
              break;
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        accumulatedContent = accumulatedContent || `Error: ${errorMessage}`;
      } finally {
        // Finalize the assistant message
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "assistant") {
            updated[updated.length - 1] = {
              ...last,
              content: accumulatedContent,
              citations: citations.length > 0 ? citations : undefined,
              isStreaming: false,
              serverMessageId,
            };
          }
          return updated;
        });
        setIsStreaming(false);
      }
    },
    [conversationId, isStreaming]
  );

  const stopStreaming = useCallback(() => {
    abortRef.current = true;
  }, []);

  const resetChat = useCallback(() => {
    setMessages([]);
    setConversationId(undefined);
    setIsStreaming(false);
    abortRef.current = false;
  }, []);

  return {
    messages,
    setMessages,
    isStreaming,
    conversationId,
    setConversationId,
    sendMessage,
    stopStreaming,
    resetChat,
  };
}
