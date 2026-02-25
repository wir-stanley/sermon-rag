"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  getConversations,
  deleteConversation,
  renameConversation,
} from "@/lib/api";
import type { ConversationSummary } from "@/types";

export function useConversations() {
  const { getToken, isLoaded } = useAuth();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchConversations = useCallback(async () => {
    if (!isLoaded) return;
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        setConversations([]);
        return;
      }
      const data = await getConversations(token);
      setConversations(data);
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
      // No auth = no conversations; fail silently
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  }, [getToken, isLoaded]);

  const remove = useCallback(async (id: number) => {
    try {
      const token = await getToken();
      await deleteConversation(id, token || undefined);
      setConversations((prev) => prev.filter((c) => c.id !== id));
    } catch {
      // Ignore errors
    }
  }, [getToken]);

  const rename = useCallback(async (id: number, title: string) => {
    try {
      const token = await getToken();
      const updated = await renameConversation(id, title, token || undefined);
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? updated : c))
      );
    } catch {
      // Ignore errors
    }
  }, [getToken]);

  useEffect(() => {
    fetchConversations();

    const handleRefresh = () => fetchConversations();
    window.addEventListener("refresh-conversations", handleRefresh);
    return () => window.removeEventListener("refresh-conversations", handleRefresh);
  }, [fetchConversations]);

  return {
    conversations,
    isLoading,
    fetchConversations,
    remove,
    rename,
  };
}
