"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface MessageSkeletonProps {
  count?: number;
}

export default function MessageSkeleton({ count = 3 }: MessageSkeletonProps) {
  return (
    <div className="mx-auto max-w-4xl py-4 space-y-6 px-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="flex gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.15 }}
        >
          {/* Avatar skeleton */}
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          {/* Message content skeleton */}
          <div className="flex-1 space-y-2.5 pt-1">
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-4 w-[65%]" />
            {i % 2 === 0 && <Skeleton className="h-4 w-[45%]" />}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
