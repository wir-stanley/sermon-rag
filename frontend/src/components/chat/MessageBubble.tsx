"use client";

import { useState, useRef } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import CitationList from "./CitationList";
import FeedbackButtons from "./FeedbackButtons";
import LottieAnimation from "@/components/ui/lottie-animation";
import { crossGlow, thinkingDove, shieldCrest, successBurst } from "@/lib/animations";
import type { Message } from "@/types";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [showCopyBurst, setShowCopyBurst] = useState(false);
  const [codeBlockCopied, setCodeBlockCopied] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setShowCopyBurst(true);
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setShowCopyBurst(false), 1200);
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

  const handleCodeBlockCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCodeBlockCopied(code);
      setTimeout(() => setCodeBlockCopied(null), 2000);
    } catch { /* fallback not needed for code blocks */ }
  };

  return (
    <motion.div
      className={cn(
        "flex gap-2 sm:gap-3 px-3 sm:px-4 py-4",
        isUser ? "justify-end" : "justify-start"
      )}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
    >
      {/* AI avatar with breathing pulse */}
      {!isUser && (
        <motion.div
          className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card/80 border border-border text-foreground backdrop-blur-md shadow-sm overflow-hidden"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <LottieAnimation
            animationData={crossGlow}
            className="h-11 w-11"
          />
        </motion.div>
      )}

      <div
        className={cn(
          "max-w-3xl space-y-3 min-w-0",
          isUser ? "max-w-xl" : "flex-1"
        )}
      >
        {/* Message content with streaming glow */}
        <div
          className={cn(
            "rounded-3xl px-5 sm:px-7 py-5 shadow-sm backdrop-blur-md transition-all duration-300 overflow-hidden break-words",
            isUser
              ? "bg-[hsl(var(--message-user-bg))] text-[hsl(var(--message-user-text))] font-medium tracking-wide"
              : "bg-[hsl(var(--message-assistant-bg))] text-foreground border border-border/50",
            !isUser && message.isStreaming && message.content && "streaming-glow-border"
          )}
        >
          {isUser ? (
            <p className="text-[15px] leading-relaxed">{message.content}</p>
          ) : (
            <div
              ref={contentRef}
              className={cn(
                "prose-chat text-[15px] leading-relaxed tracking-wide font-sans text-inherit relative",
                message.isStreaming && !message.content && "text-foreground/40"
              )}
            >
              {message.content ? (
                <div
                  className={message.isStreaming ? "streaming-cursor" : ""}
                  dangerouslySetInnerHTML={{
                    __html: formatMarkdownWithCopyButtons(message.content),
                  }}
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.classList.contains("code-copy-btn")) {
                      const pre = target.closest("pre");
                      if (pre) {
                        const code = pre.querySelector("code")?.textContent || "";
                        handleCodeBlockCopy(code);
                      }
                    }
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
          <div className="flex items-center gap-1 relative">
            {/* Copy burst */}
            {showCopyBurst && (
              <div className="absolute -top-4 -left-2 pointer-events-none z-10">
                <LottieAnimation
                  animationData={successBurst}
                  loop={false}
                  className="h-[50px] w-[50px]"
                />
              </div>
            )}
            <motion.button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all duration-200"
              title={copied ? "Copied!" : "Copy answer"}
              whileHover={{ scale: 1.1 }}
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

      {/* User avatar with shield-crest Lottie */}
      {isUser && (
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background shadow-sm dark:bg-primary dark:text-primary-foreground overflow-hidden">
          <LottieAnimation
            animationData={shieldCrest}
            className="h-8 w-8"
          />
        </div>
      )}
    </motion.div>
  );
}

/** Simple markdown to HTML with copy buttons on code blocks */
function formatMarkdownWithCopyButtons(text: string): string {
  return text
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="relative group"><button class="code-copy-btn absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] px-2 py-1 rounded bg-foreground/10 hover:bg-foreground/20 text-foreground/70 cursor-pointer">Copy</button><code>$2</code></pre>')
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
