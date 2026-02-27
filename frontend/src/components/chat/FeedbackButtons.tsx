"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { submitFeedback } from "@/lib/api";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import LottieAnimation from "@/components/ui/lottie-animation";
import { successBurst } from "@/lib/animations";
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
  const [showBurst, setShowBurst] = useState(false);

  const handleFeedback = useCallback(async (isPositive: boolean) => {
    if (!messageId || isSubmitting) return;

    if (feedback === isPositive) {
      setFeedback(null);
      return;
    }

    setIsSubmitting(true);
    setFeedback(isPositive);

    if (isPositive) {
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 1200);
    }

    try {
      const token = await getToken();
      await submitFeedback({ message_id: messageId, is_positive: isPositive }, token || undefined);
    } catch {
      setFeedback(initialFeedback?.is_positive ?? null);
    } finally {
      setIsSubmitting(false);
    }
  }, [messageId, isSubmitting, feedback, getToken, initialFeedback]);

  return (
    <div className="flex items-center gap-1 relative">
      {/* Success burst overlay */}
      {showBurst && (
        <div className="absolute -top-4 -left-2 pointer-events-none z-10">
          <LottieAnimation
            animationData={successBurst}
            loop={false}
            className="h-[60px] w-[60px]"
          />
        </div>
      )}
      <motion.button
        onClick={() => handleFeedback(true)}
        disabled={!messageId || isSubmitting}
        className={cn(
          "rounded-md p-1.5 transition-all duration-300",
          feedback === true
            ? "text-gold-600 bg-gold-500/10 shadow-sm border border-gold-500/20"
            : "text-muted-foreground hover:text-foreground hover:bg-foreground/5 border border-transparent",
          (!messageId || isSubmitting) && "opacity-40 cursor-not-allowed"
        )}
        title="Helpful"
        whileTap={{ scale: 0.9 }}
      >
        <ThumbsUp className="h-3.5 w-3.5" />
      </motion.button>
      <motion.button
        onClick={() => handleFeedback(false)}
        disabled={!messageId || isSubmitting}
        className={cn(
          "rounded-md p-1.5 transition-all duration-300",
          feedback === false
            ? "text-red-600 bg-red-500/10 shadow-sm border border-red-500/10"
            : "text-muted-foreground hover:text-red-500 hover:bg-red-500/5 border border-transparent",
          (!messageId || isSubmitting) && "opacity-40 cursor-not-allowed"
        )}
        title="Not helpful"
        whileTap={{ scale: 0.9 }}
      >
        <ThumbsDown className="h-3.5 w-3.5" />
      </motion.button>
    </div>
  );
}
