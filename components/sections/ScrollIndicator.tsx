"use client";

import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function ScrollIndicator() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY < 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
      <FiChevronDown size={24} className="text-text-muted" />
    </div>
  );
}
