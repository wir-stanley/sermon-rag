"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { submitFeedback } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { FeedbackOut } from "@/types";

interface FeedbackButtonsProps {
  messageId?: number;
  initialFeedback?: FeedbackOut | null;
}

export default function FeedbackButtons({
  messageId,
  initialFeedback,
}: FeedbackButtonsProps) {
  const [feedback, setFeedback] = useState<boolean | null>(
    initialFeedback?.is_positive ?? null
  );
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleFeedback(isPositive: boolean) {
    if (!messageId || isSubmitting) return;

    // Toggle off if clicking same button
    if (feedback === isPositive) {
      setFeedback(null);
      return;
    }

    setIsSubmitting(true);
    setFeedback(isPositive);

    try {
      const token = await getToken();
      await submitFeedback({ message_id: messageId, is_positive: isPositive }, token || undefined);
    } catch {
      // Revert on error
      setFeedback(initialFeedback?.is_positive ?? null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleFeedback(true)}
        disabled={!messageId || isSubmitting}
        className={cn(
          "rounded p-1.5 transition-colors",
          feedback === true
            ? "text-gold-400 bg-gold-900/20"
            : "text-muted-foreground hover:text-foreground hover:bg-muted",
          (!messageId || isSubmitting) && "opacity-40 cursor-not-allowed"
        )}
        title="Helpful"
      >
        <ThumbsUp className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => handleFeedback(false)}
        disabled={!messageId || isSubmitting}
        className={cn(
          "rounded p-1.5 transition-colors",
          feedback === false
            ? "text-red-400 bg-red-900/20"
            : "text-muted-foreground hover:text-foreground hover:bg-muted",
          (!messageId || isSubmitting) && "opacity-40 cursor-not-allowed"
        )}
        title="Not helpful"
      >
        <ThumbsDown className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
