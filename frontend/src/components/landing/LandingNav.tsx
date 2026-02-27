"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingNav() {
  return (
    <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-10">
      <Link href="/" className="flex items-center gap-2 group">
        <BookOpen className="h-6 w-6 text-gold-500 group-hover:text-gold-400 transition-colors" />
        <span className="font-serif text-lg font-bold text-foreground">
          GRII Sermons
        </span>
      </Link>
      <Button asChild variant="outline" className="border-gold-700 text-gold-400 hover:bg-gold-900/30 hover:text-gold-300">
        <Link href="/chat">Start Chatting</Link>
      </Button>
    </nav>
  );
}
