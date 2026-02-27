"use client";

import { motion } from "framer-motion";
import { Button, type ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";

const MotionButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function MotionButton({ className, ...props }, ref) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="inline-flex"
      >
        <Button ref={ref} className={className} {...props} />
      </motion.div>
    );
  }
);

export { MotionButton };
