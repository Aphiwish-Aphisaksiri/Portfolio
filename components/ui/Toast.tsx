"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  onClose,
  duration = 5000,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: {
      bg: "bg-success/10",
      border: "border-success/30",
      text: "text-success",
      progress: "bg-success",
    },
    error: {
      bg: "bg-error/10",
      border: "border-error/30",
      text: "text-error",
      progress: "bg-error",
    },
  };

  const c = colors[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-6 right-6 z-[100] max-w-sm ${c.bg} ${c.border} border rounded-xl p-4 shadow-lg`}
        >
          <p className={`${c.text} text-sm font-medium`}>{message}</p>
          {/* Progress bar */}
          <div className="mt-3 h-0.5 w-full bg-border rounded-full overflow-hidden">
            <div
              className={`h-full ${c.progress} rounded-full`}
              style={{
                animation: `toast-progress ${duration}ms linear forwards`,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
