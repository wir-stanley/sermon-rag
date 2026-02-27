"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Plus,
  MessageSquare,
  Trash2,
  Pencil,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { ConversationSummary } from "@/types";
import { useState } from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

interface ChatSidebarProps {
  conversations: ConversationSummary[];
  onNewChat: () => void;
  onDelete: (id: number) => void;
  onRename: (id: number, title: string) => void;
}

export default function ChatSidebar({
  conversations,
  onNewChat,
  onDelete,
  onRename,
}: ChatSidebarProps) {
  const pathname = usePathname();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  function startEdit(conv: ConversationSummary) {
    setEditingId(conv.id);
    setEditTitle(conv.title);
  }

  function submitEdit(id: number) {
    if (editTitle.trim()) {
      onRename(id, editTitle.trim());
    }
    setEditingId(null);
  }

  return (
    <div className="flex h-full w-full flex-col bg-transparent">
      {/* Brand */}
      <div className="flex items-center justify-center px-6 py-10">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="GRII Logo"
            width={300}
            height={100}
            className="h-16 w-auto object-contain brightness-0 opacity-85 hover:opacity-100 transition-opacity cursor-pointer"
            priority
          />
        </Link>
      </div>

      <div className="px-6 mb-4">
        <Button
          onClick={onNewChat}
          variant="outline"
          className="w-full justify-start gap-2 bg-transparent border border-[#2C2A29]/20 text-[#2C2A29] font-semibold tracking-wide hover:text-[#E5DCD5] hover:bg-[#2C2A29] hover:border-[#2C2A29] transition-all duration-300 shadow-sm rounded-full"
        >
          <Plus className="h-4 w-4" />
          Percakapan Baru
        </Button>
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1 px-4 mt-2">
        <div className="space-y-1 pb-4">
          {conversations.length === 0 ? (
            <p className="px-2 py-6 text-center text-[10px] text-[#2C2A29]/40 font-semibold tracking-widest uppercase mt-4">
              Belum ada percakapan
            </p>
          ) : (
            conversations.map((conv, idx) => {
              const isActive = pathname === `/chat/${conv.id}`;
              return (
                <div
                  key={conv.id}
                  className={cn(
                    "group flex items-center gap-2 rounded-xl px-4 py-3 text-sm transition-all duration-300 font-medium animate-in slide-in-from-left-4 fade-in fill-mode-both",
                    isActive
                      ? "bg-[#2C2A29]/5 text-[#2C2A29] shadow-sm border border-[#2C2A29]/10"
                      : "text-[#2C2A29]/60 hover:bg-[#2C2A29]/5 hover:text-[#2C2A29]"
                  )}
                  style={{ animationDelay: `${idx * 50}ms`, animationDuration: "500ms" }}
                >
                  <MessageSquare className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-[#2C2A29]" : "text-[#2C2A29]/40 group-hover:text-[#2C2A29]")} />
                  {editingId === conv.id ? (
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => submitEdit(conv.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submitEdit(conv.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="flex-1 bg-transparent border-b border-[#2C2A29]/30 outline-none text-[#2C2A29] px-1"
                      autoFocus
                    />
                  ) : (
                    <Link
                      href={`/chat/${conv.id}`}
                      className="flex-1 truncate tracking-tight"
                    >
                      {conv.title}
                    </Link>
                  )}
                  <div className="flex shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        startEdit(conv);
                      }}
                      className="p-1.5 text-[#2C2A29]/40 hover:text-[#2C2A29] transition-colors"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onDelete(conv.id);
                      }}
                      className="p-1.5 text-[#2C2A29]/40 hover:text-red-500/80 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-[#2C2A29]/10 px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-[10px] uppercase tracking-widest text-[#2C2A29]/40 hover:text-[#2C2A29] transition-colors font-semibold"
        >
          Beranda
        </Link>
        <div className="flex items-center">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-[10px] uppercase tracking-widest text-[#2C2A29]/40 hover:text-[#2C2A29] transition-colors font-semibold">
                Masuk
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton appearance={{ elements: { userButtonAvatarBox: "h-8 w-8" } }} />
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
