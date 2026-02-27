"use client";

import { useState } from "react";
import { User, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import CitationList from "./CitationList";
import FeedbackButtons from "./FeedbackButtons";
import LottieAnimation from "@/components/ui/lottie-animation";
import { crossGlow, thinkingDove } from "@/lib/animations";
import type { Message } from "@/types";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = message.content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      className={cn(
        "flex gap-2 sm:gap-3 px-3 sm:px-4 py-4",
        isUser ? "justify-end" : "justify-start"
      )}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {!isUser && (
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card/80 border border-border text-foreground backdrop-blur-md shadow-sm overflow-hidden">
          <LottieAnimation
            animationData={crossGlow}
            className="h-10 w-10"
          />
        </div>
      )}

      <div
        className={cn(
          "max-w-3xl space-y-3 min-w-0",
          isUser ? "max-w-xl" : "flex-1"
        )}
      >
        {/* Message content */}
        <div
          className={cn(
            "rounded-3xl px-5 sm:px-7 py-5 shadow-sm backdrop-blur-md transition-all duration-300 overflow-hidden break-words",
            isUser
              ? "bg-[hsl(var(--message-user-bg))] text-[hsl(var(--message-user-text))] font-medium tracking-wide"
              : "bg-[hsl(var(--message-assistant-bg))] text-foreground border border-border/50"
          )}
        >
          {isUser ? (
            <p className="text-[15px] leading-relaxed">{message.content}</p>
          ) : (
            <div
              className={cn(
                "prose-chat text-[15px] leading-relaxed tracking-wide font-sans text-inherit",
                message.isStreaming && !message.content && "text-foreground/40"
              )}
            >
              {message.content ? (
                <div
                  className={message.isStreaming ? "streaming-cursor" : ""}
                  dangerouslySetInnerHTML={{
                    __html: formatMarkdown(message.content),
                  }}
                />
              ) : (
                <span className="flex items-center gap-2 h-8 px-1">
                  <LottieAnimation
                    animationData={thinkingDove}
                    className="h-8 w-12"
                  />
                </span>
              )}
            </div>
          )}
        </div>

        {/* Citations */}
        {!isUser && message.citations && message.citations.length > 0 && (
          <CitationList citations={message.citations} />
        )}

        {/* Action bar: Copy + Feedback */}
        {!isUser && !message.isStreaming && message.content && (
          <div className="flex items-center gap-1">
            <motion.button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all duration-200"
              title={copied ? "Copied!" : "Copy answer"}
              whileTap={{ scale: 0.9 }}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-green-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </motion.button>
            <FeedbackButtons
              messageId={message.serverMessageId}
              initialFeedback={message.feedback}
            />
          </div>
        )}
      </div>

      {isUser && (
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background shadow-sm dark:bg-primary dark:text-primary-foreground">
          <User className="h-4 w-4" />
        </div>
      )}
    </motion.div>
  );
}

/** Simple markdown to HTML for assistant messages */
function formatMarkdown(text: string): string {
  return text
    .replace(/```(\w*)\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^[*-] (.+)$/gm, "<li>$1</li>")
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    .replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>")
    .replace(/^(.+)$/, "<p>$1</p>");
}
