"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const DEFAULT_TRIGGER_CLASSES =
  "inline-flex items-center gap-2 rounded-full bg-[#0B4B31] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0B4B31]/90";

export default function ActionMenu({
  triggerLabel = "Actions",
  triggerClassName = DEFAULT_TRIGGER_CLASSES,
  triggerPrefix,
  align = "right",
  items = [],
  menuClassName = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const containerRef = useRef(null);

  const closeMenu = () => setIsOpen(false);

  const toggleMenu = (event) => {
    event?.stopPropagation();
    const buttonRect = event?.currentTarget?.getBoundingClientRect();
    if (buttonRect) {
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      const estimatedHeight = Math.max(items.length * 56, 160);
      
      // Check if button is in the bottom 40% of viewport to catch last 2 rows (last and 2nd last)
      // This ensures both the last row and 2nd last row open upward
      const isInBottomArea = buttonRect.bottom > window.innerHeight * 0.60;
      
      // Always open upward if:
      // 1. Not enough space below, OR
      // 2. Button is in bottom area (last 2 rows near pagination) - force upward
      const shouldOpenUp = spaceBelow < estimatedHeight || isInBottomArea;
      setOpenUp(shouldOpenUp);
    }
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleItemClick = (handler) => (event) => {
    event.stopPropagation();
    closeMenu();
    handler?.(event);
  };

  const alignmentClass = align === "left" ? "left-0" : "right-0";

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button type="button" onClick={toggleMenu} className={triggerClassName}>
        {triggerPrefix}
        <span>{triggerLabel}</span>
        <ChevronDown size={14} className="opacity-80" />
      </button>

      {isOpen && (
        <div
          className={`absolute ${alignmentClass} ${openUp ? "bottom-full mb-3" : "top-full mt-2"} z-50 min-w-[180px] rounded-xl border border-[#00000040] bg-white shadow-[0_8px_24px_-8px_rgba(11,75,49,0.25)] overflow-hidden ${menuClassName}`}
          onClick={(event) => event.stopPropagation()}
        >
          {items.map((item, index) => {
            const Icon = item.icon;
            const borderClass = index > 0 && item.addDivider !== false ? "border-t border-[#00000040]" : "";
            return (
              <button
                key={item.label ?? index}
                type="button"
                disabled={item.disabled}
                onClick={handleItemClick(item.onClick)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-normal text-[#1e1e1e] transition-all duration-150 hover:bg-[#E5EFEB] disabled:cursor-not-allowed disabled:opacity-60 ${borderClass} ${item.className || ""}`}
              >
                {Icon && <Icon size={16} className={item.iconClassName || "text-[#0B4B31]"} />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}