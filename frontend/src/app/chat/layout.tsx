"use client";

import Image from "next/image";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { useConversations } from "@/hooks/useConversations";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { conversations, remove, rename } = useConversations();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleNewChat() {
    window.location.href = "/chat";
  }

  const sidebar = (
    <ChatSidebar
      conversations={conversations}
      onNewChat={handleNewChat}
      onDelete={remove}
      onRename={rename}
    />
  );

  return (
    <div className="relative flex h-dvh overflow-hidden bg-black text-white">
      {/* Premium Cinematic Background */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/images/Gemini_Generated_Image_n81phsn81phsn81p.png" // Use a different cinematic image for chat
          alt="Premium Chat Background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 flex h-full w-full">
        {/* Desktop sidebar */}
        <div className="hidden md:block premium-glass border-r border-white/10">{sidebar}</div>

        {/* Mobile sidebar */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-3 top-3 z-20 md:hidden text-white/70 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 premium-glass border-white/10 text-white">
            {sidebar}
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <main className="flex flex-1 flex-col overflow-hidden bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}
