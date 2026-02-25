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
      <div className="flex items-center justify-center px-6 py-8">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="GRII Logo"
            width={300}
            height={100}
            className="h-16 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
            priority
          />
        </Link>
      </div>

      <div className="px-4">
        <Button
          onClick={onNewChat}
          variant="outline"
          className="w-full justify-start gap-2 border border-white/20 text-white font-medium tracking-wide hover:text-black hover:bg-white hover:border-white transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          <Plus className="h-4 w-4" />
          Percakapan Baru
        </Button>
      </div>

      <Separator className="my-3 border-white/10" />

      {/* Conversation list */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 pb-4">
          {conversations.length === 0 ? (
            <p className="px-2 py-4 text-center text-xs text-white/40 font-medium tracking-widest uppercase">
              Belum ada percakapan
            </p>
          ) : (
            conversations.map((conv) => {
              const isActive = pathname === `/chat/${conv.id}`;
              return (
                <div
                  key={conv.id}
                  className={cn(
                    "group flex items-center gap-2 rounded-xl px-3 py-3 text-sm transition-all duration-300 font-medium",
                    isActive
                      ? "bg-white text-black shadow-lg shadow-white/10"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <MessageSquare className={cn("h-4 w-4 shrink-0", isActive ? "text-black" : "text-white/40 group-hover:text-white/80")} />
                  {editingId === conv.id ? (
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => submitEdit(conv.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submitEdit(conv.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="flex-1 bg-transparent outline-none text-foreground"
                      autoFocus
                    />
                  ) : (
                    <Link
                      href={`/chat/${conv.id}`}
                      className="flex-1 truncate"
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
                      className="p-1 hover:text-gold-400"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onDelete(conv.id);
                      }}
                      className="p-1 hover:text-red-400"
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
      <div className="border-t border-white/10 px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors font-semibold"
        >
          Beranda
        </Link>
        <div className="flex items-center">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors font-semibold">
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
