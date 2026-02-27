"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Plus,
  MessageSquare,
  Trash2,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import LottieAnimation from "@/components/ui/lottie-animation";
import ThemeToggle from "@/components/ui/theme-toggle";
import { crossGlow, sidebarEmpty, crownThorns, bookmarkRibbon } from "@/lib/animations";
import type { ConversationSummary } from "@/types";
import { useState } from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

interface ChatSidebarProps {
  conversations: ConversationSummary[];
  isLoading?: boolean;
  onNewChat: () => void;
  onDelete: (id: number) => void;
  onRename: (id: number, title: string) => void;
}

const sidebarVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: {
    x: -50,
    opacity: 0,
    height: 0,
    marginBottom: 0,
    padding: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25,
      height: { delay: 0.1 },
    },
  },
};

export default function ChatSidebar({
  conversations,
  isLoading,
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
    <motion.div
      className="flex h-full w-full flex-col bg-[hsl(var(--sidebar-bg))]"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Brand with crown-thorns accent */}
      <div className="flex items-center justify-center px-6 py-10 relative">
        {/* Crown of thorns behind logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
          <LottieAnimation
            animationData={crownThorns}
            className="h-24 w-24 lottie-ambient"
          />
        </div>
        {/* Cross glow behind logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
          <LottieAnimation
            animationData={crossGlow}
            className="h-20 w-20"
          />
        </div>
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="GRII Logo"
            width={300}
            height={100}
            className="h-16 w-auto object-contain brightness-0 dark:brightness-0 dark:invert opacity-85 hover:opacity-100 transition-opacity cursor-pointer relative z-10"
            priority
          />
        </Link>
      </div>

      <div className="px-6 mb-4">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onNewChat}
            variant="outline"
            className="w-full justify-start gap-2 bg-transparent border border-border text-foreground font-semibold tracking-wide hover:text-primary-foreground hover:bg-foreground hover:border-foreground dark:hover:bg-primary dark:hover:border-primary dark:hover:text-primary-foreground transition-all duration-300 shadow-sm rounded-full"
          >
            <Plus className="h-4 w-4" />
            Percakapan Baru
          </Button>
        </motion.div>
      </div>

      {/* Conversation list */}
      <ScrollArea className="flex-1 px-4 mt-2">
        <div className="space-y-1 pb-4">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                className="flex items-center gap-2 rounded-xl px-4 py-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Skeleton className="h-4 w-4 rounded" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-[80%]" />
                </div>
              </motion.div>
            ))
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center py-8">
              <LottieAnimation
                animationData={sidebarEmpty}
                className="h-16 w-16 opacity-60"
              />
              <p className="mt-3 text-center text-[10px] text-muted-foreground font-semibold tracking-widest uppercase">
                Belum ada percakapan
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {conversations.map((conv) => {
                const isActive = pathname === `/chat/${conv.id}`;
                return (
                  <motion.div
                    key={conv.id}
                    className={cn(
                      "group flex items-center gap-2 rounded-xl px-4 py-3 text-sm transition-all duration-300 font-medium relative overflow-hidden",
                      isActive
                        ? "bg-gold-500/10 text-foreground shadow-sm border border-gold-500/20"
                        : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground border border-transparent"
                    )}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    whileHover={{ x: 2 }}
                  >
                    {/* Bookmark ribbon for active item */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-4 pointer-events-none -ml-1">
                        <LottieAnimation
                          animationData={bookmarkRibbon}
                          loop={false}
                          className="h-full w-4 opacity-60"
                        />
                      </div>
                    )}
                    <MessageSquare className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-gold-600" : "text-muted-foreground group-hover:text-foreground")} />
                    {editingId === conv.id ? (
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => submitEdit(conv.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") submitEdit(conv.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        className="flex-1 bg-transparent border-b border-foreground/30 outline-none text-foreground px-1"
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
                    <AnimatePresence>
                      <motion.div
                        className="flex shrink-0 opacity-0 group-hover:opacity-100"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            startEdit(conv);
                          }}
                          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            onDelete(conv.id);
                          }}
                          className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-[hsl(var(--sidebar-border))] px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/"
            className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors font-semibold"
          >
            Beranda
          </Link>
        </div>
        <div className="flex items-center">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors font-semibold">
                Masuk
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton appearance={{ elements: { userButtonAvatarBox: "h-8 w-8" } }} />
          </SignedIn>
        </div>
      </div>
    </motion.div>
  );
}
