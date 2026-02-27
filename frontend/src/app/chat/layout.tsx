"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { useConversations } from "@/hooks/useConversations";
import { PageTransition } from "@/components/providers/page-transition";
import { motion } from "framer-motion";
import LottieAnimation from "@/components/ui/lottie-animation";
import { starConstellation, flameCandle } from "@/lib/animations";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { conversations, isLoading, remove, rename } = useConversations();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleNewChat() {
    window.location.href = "/chat";
  }

  const sidebar = (
    <ChatSidebar
      conversations={conversations}
      isLoading={isLoading}
      onNewChat={handleNewChat}
      onDelete={remove}
      onRename={rename}
    />
  );

  return (
    <div className="relative flex h-dvh overflow-hidden bg-background text-foreground">
      {/* Ambient star constellation background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.06] z-0">
        <LottieAnimation
          animationData={starConstellation}
          className="absolute inset-0 w-full h-full lottie-ambient"
        />
      </div>

      {/* Drifting orb */}
      <motion.div
        className="absolute top-1/3 left-1/2 w-[300px] h-[300px] rounded-full bg-gold-500/5 blur-3xl pointer-events-none z-0"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 15, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 flex h-full w-full">
        {/* Desktop sidebar */}
        <div className="hidden md:block bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))]">{sidebar}</div>

        {/* Mobile sidebar */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-3 top-3 z-20 md:hidden text-foreground/70 hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-background border-border text-foreground">
            {sidebar}
          </SheetContent>
        </Sheet>

        {/* Main content with ambient gradient + page transitions */}
        <main className="flex flex-1 flex-col overflow-hidden bg-transparent chat-ambient-gradient relative">
          <PageTransition>{children}</PageTransition>

          {/* Candle accent in bottom-right */}
          <div className="absolute bottom-4 right-4 pointer-events-none opacity-20 z-0">
            <LottieAnimation
              animationData={flameCandle}
              className="h-[80px] w-[60px] lottie-ambient"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
