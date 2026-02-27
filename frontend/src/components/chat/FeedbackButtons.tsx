"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { submitFeedback } from "@/lib/api";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import LottieAnimation from "@/components/ui/lottie-animation";
import { successBurst } from "@/lib/animations";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const [shakeDown, setShakeDown] = useState(false);

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
    } else {
      setShakeDown(true);
      setTimeout(() => setShakeDown(false), 400);
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
    <TooltipProvider>
      <div className="flex items-center gap-1 relative">
        {/* Success burst overlay */}
        <AnimatePresence>
          {showBurst && (
            <motion.div
              className="absolute -top-4 -left-2 pointer-events-none z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LottieAnimation
                animationData={successBurst}
                loop={false}
                className="h-[60px] w-[60px]"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Thumbs Up */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              onClick={() => handleFeedback(true)}
              disabled={!messageId || isSubmitting}
              className={cn(
                "rounded-md p-1.5 transition-all duration-300",
                (!messageId || isSubmitting) && "opacity-40 cursor-not-allowed"
              )}
              animate={{
                color: feedback === true ? "hsl(43 74% 49%)" : undefined,
                backgroundColor: feedback === true ? "hsl(43 74% 49% / 0.1)" : "transparent",
              }}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Helpful</p>
          </TooltipContent>
        </Tooltip>

        {/* Thumbs Down with shake */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              onClick={() => handleFeedback(false)}
              disabled={!messageId || isSubmitting}
              className={cn(
                "rounded-md p-1.5 transition-all duration-300",
                (!messageId || isSubmitting) && "opacity-40 cursor-not-allowed"
              )}
              animate={
                shakeDown
                  ? { x: [0, -4, 4, -4, 4, 0] }
                  : {
                      color: feedback === false ? "hsl(0 72% 51%)" : undefined,
                      backgroundColor: feedback === false ? "hsl(0 72% 51% / 0.1)" : "transparent",
                    }
              }
              transition={shakeDown ? { duration: 0.4 } : { duration: 0.3 }}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Not helpful</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
