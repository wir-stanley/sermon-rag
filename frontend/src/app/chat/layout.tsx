"use client";

import { useState } from "react";
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
    <div className="relative flex h-dvh overflow-hidden bg-background text-foreground">
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

        {/* Main content */}
        <main className="flex flex-1 flex-col overflow-hidden bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
}
