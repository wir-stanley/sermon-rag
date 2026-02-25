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
          "rounded-md p-1.5 transition-all duration-300",
          feedback === true
            ? "text-[#2C2A29] bg-[#2C2A29]/10 shadow-sm border border-[#2C2A29]/10"
            : "text-[#2C2A29]/40 hover:text-[#2C2A29] hover:bg-[#2C2A29]/5 border border-transparent",
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
          "rounded-md p-1.5 transition-all duration-300",
          feedback === false
            ? "text-red-600 bg-red-500/10 shadow-sm border border-red-500/10"
            : "text-[#2C2A29]/40 hover:text-[#red-600] hover:bg-red-500/5 border border-transparent hover:text-red-500",
          (!messageId || isSubmitting) && "opacity-40 cursor-not-allowed"
        )}
        title="Not helpful"
      >
        <ThumbsDown className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
