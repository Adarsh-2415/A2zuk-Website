"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

export interface DropdownItem {
  title: string;
  href: string;
  description: string;
  icon?: React.ReactNode;
}

interface NavDropdownProps {
  title: string;
  items: DropdownItem[];
  isScrolled?: boolean;
}

export function NavDropdown({ title, items, isScrolled = false }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Check if any child item is active
  const isAnyChildActive = items.some((item) => pathname === item.href);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseEnter={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          "relative flex items-center gap-1.5 rounded-full transition-all duration-300 font-semibold select-none",
          isScrolled ? "px-3 pt-1 pb-2.5 text-xs" : "px-4 pt-1.5 pb-3 text-sm",
          isAnyChildActive
            ? "text-[#234E3D] bg-white/90 shadow-xs border border-[#234E3D]/20 font-bold"
            : "text-[#1B382B] hover:text-[#234E3D] hover:bg-white/60",
          isOpen && "bg-white text-[#234E3D] shadow-xs ring-1.5 ring-[#234E3D]/25 font-bold"
        )}
      >
        <span className="leading-tight">{title}</span>

        {/* ChevronDown with 180deg smooth rotation */}
        <svg
          className={cn(
            "w-3.5 h-3.5 transition-transform duration-200 text-[#4A5D52]",
            isOpen && "rotate-180 text-[#234E3D]"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>

        {/* Active Dot Indicator */}
        {isAnyChildActive && (
          <span
            className={cn(
              "absolute left-1/2 -translate-x-1/2 rounded-full bg-[#234E3D]",
              isScrolled ? "bottom-0.5 w-1 h-1" : "bottom-1 w-1.5 h-1.5"
            )}
            aria-hidden="true"
          />
        )}
      </button>

      {/* Floating Glassmorphic Dropdown Panel with High-Impact Highlights */}
      <div
        onMouseLeave={() => setIsOpen(false)}
        className={cn(
          "absolute left-1/2 -translate-x-1/2 mt-2 w-80 sm:w-88 rounded-2xl bg-gradient-to-b from-white/98 via-[#FAF8F5]/98 to-[#FDF5EE]/98 backdrop-blur-2xl p-2.5 shadow-[0_20px_50px_-10px_rgba(27,56,43,0.18),0_0_0_1px_rgba(35,78,61,0.08),inset_0_1px_2px_rgba(255,255,255,0.95)] border border-[#EAE0D0] z-50 transition-all duration-200 origin-top",
          isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-2 scale-95 pointer-events-none"
        )}
      >
        {/* Luminous Brand Accent Bar at top of dropdown */}
        <div className="h-1 w-full bg-gradient-to-r from-[#234E3D] via-[#D4E865] to-[#F2653B] rounded-full mb-2 opacity-90 shadow-2xs" />

        <div className="space-y-1.5">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "group flex items-start gap-3 p-2.5 rounded-xl border transition-all duration-200 relative",
                  isActive
                    ? "bg-gradient-to-r from-[#EBF5EA] to-[#F7FAF4] border-[#234E3D]/25 shadow-xs"
                    : "border-transparent hover:bg-gradient-to-r hover:from-[#F4F9F2] hover:to-[#FAF6EE] hover:border-[#234E3D]/20 hover:shadow-xs hover:translate-x-0.5"
                )}
              >
                {/* Highlighted Icon Badge */}
                {item.icon && (
                  <span
                    className={cn(
                      "p-2.5 rounded-xl transition-all duration-200 mt-0.5 shrink-0 flex items-center justify-center",
                      isActive
                        ? "bg-[#234E3D] text-[#D4E865] shadow-xs"
                        : "bg-white border border-[#EAE2D2] text-[#234E3D] shadow-2xs group-hover:bg-[#234E3D] group-hover:text-[#D4E865] group-hover:border-[#234E3D] group-hover:scale-105 group-hover:shadow-xs"
                    )}
                  >
                    {item.icon}
                  </span>
                )}

                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <span
                      className={cn(
                        "text-sm font-semibold transition-colors truncate",
                        isActive
                          ? "text-[#234E3D] font-bold"
                          : "text-[#1B382B] group-hover:text-[#234E3D] group-hover:font-bold"
                      )}
                    >
                      {item.title}
                    </span>

                    {/* Active Pill Badge or Hover Arrow */}
                    {isActive ? (
                      <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#234E3D] text-[#D4E865] shadow-2xs">
                        Active
                      </span>
                    ) : (
                      <span
                        className="shrink-0 text-[#234E3D] opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-xs font-bold"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-xs mt-0.5 leading-snug line-clamp-1 transition-colors",
                      isActive
                        ? "text-[#234E3D]/80 font-medium"
                        : "text-[#5A6D61] group-hover:text-[#234E3D]/85"
                    )}
                  >
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Highlighted Footer Guide */}
        <div className="mt-2.5 pt-2 border-t border-[#EFECE4] flex items-center justify-between px-2 text-[11px] text-[#5A6D61]">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#234E3D]" />
            Littlejoy Contest Guide
          </span>
          <span className="text-[#234E3D] font-semibold flex items-center gap-1">
            Official Rules
            <svg className="w-3 h-3 text-[#234E3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
