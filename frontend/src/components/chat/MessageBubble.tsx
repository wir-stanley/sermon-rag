"use client";

import { useState } from "react";
import { User, BookOpen, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import CitationList from "./CitationList";
import FeedbackButtons from "./FeedbackButtons";
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
      // Fallback for older browsers
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
    <div
      className={cn(
        "flex gap-2 sm:gap-3 px-3 sm:px-4 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/60 border border-[#2C2A29]/10 text-[#2C2A29] backdrop-blur-md shadow-sm">
          <BookOpen className="h-4 w-4" />
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
              ? "bg-[#2C2A29] text-[#E5DCD5] font-medium tracking-wide"
              : "bg-white/40 text-[#2C2A29] border border-[#2C2A29]/10"
          )}
        >
          {isUser ? (
            <p className="text-[15px] leading-relaxed">{message.content}</p>
          ) : (
            <div
              className={cn(
                "prose-chat text-[15px] leading-relaxed tracking-wide font-sans text-inherit",
                message.isStreaming && !message.content && "text-[#2C2A29]/40"
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
                <span className="flex items-center gap-1 h-6 px-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2C2A29]/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2C2A29]/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2C2A29]/50 animate-bounce" style={{ animationDelay: "300ms" }} />
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
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-[#2C2A29]/50 hover:text-[#2C2A29] hover:bg-[#2C2A29]/5 transition-all duration-200"
              title={copied ? "Copied!" : "Copy answer"}
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
            </button>
            <FeedbackButtons
              messageId={message.serverMessageId}
              initialFeedback={message.feedback}
            />
          </div>
        )}
      </div>

      {isUser && (
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2C2A29] text-[#E5DCD5] shadow-sm">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

/** Simple markdown to HTML for assistant messages */
function formatMarkdown(text: string): string {
  return text
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>")
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Headers
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Blockquotes
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // Unordered lists
    .replace(/^[*-] (.+)$/gm, "<li>$1</li>")
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Wrap consecutive <li> in <ul>
    .replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // Paragraphs (double newlines)
    .replace(/\n\n/g, "</p><p>")
    // Single newlines to <br>
    .replace(/\n/g, "<br>")
    // Wrap in <p>
    .replace(/^(.+)$/, "<p>$1</p>");
}
