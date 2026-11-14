"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  // Reset menu open state if pathname changed during navigation
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // Close on outside click and Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const navLinks = [
    { title: "Home", href: "/" },
    { title: "The Contest", href: "/contests" },
    { title: "How It Works", href: "/how-it-works" },
    { title: "Help & FAQs", href: "/help" },
    { title: "Contest Rules & Terms", href: "/terms" },
    { title: "Privacy Policy", href: "/privacy-policy" },
  ];

  return (
    <div className="md:hidden relative" ref={menuRef}>
      {/* Mobile Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-[#1B382B] hover:bg-black/5 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234E3D]"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        <div className="w-6 h-6 relative flex flex-col justify-center items-center gap-1.2">
          <span
            className={cn(
              "w-5 h-0.5 bg-[#1B382B] rounded-full transition-all duration-300 transform origin-center",
              isOpen ? "rotate-45 translate-y-[6px]" : ""
            )}
          />
          <span
            className={cn(
              "w-5 h-0.5 bg-[#1B382B] rounded-full transition-all duration-300",
              isOpen ? "opacity-0 scale-x-0" : "opacity-100"
            )}
          />
          <span
            className={cn(
              "w-5 h-0.5 bg-[#1B382B] rounded-full transition-all duration-300 transform origin-center",
              isOpen ? "-rotate-45 -translate-y-[6px]" : ""
            )}
          />
        </div>
      </button>

      {/* Glassmorphic Mobile Drawer */}
      {isOpen && (
        <div
          id="mobile-nav-panel"
          className="absolute right-0 top-12 w-[calc(100vw-2rem)] max-w-sm rounded-3xl bg-gradient-to-b from-[#FAF8F5]/98 via-[#FDF9F4]/98 to-[#FDF2EC]/98 backdrop-blur-2xl border border-[#EAE2D2]/80 shadow-2xl p-5 space-y-4 z-50 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]"
        >
          {/* Navigation Items */}
          <div className="flex flex-col space-y-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-150",
                    isActive
                      ? "text-[#234E3D] bg-[#234E3D]/12 font-bold shadow-xs"
                      : "text-[#1B382B] hover:text-[#234E3D] hover:bg-[#FAF8F5]"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span>{item.title}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#234E3D]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile CTA */}
          <div className="pt-3 border-t border-[#EFECE4]">
            <Link
              href="/contests/baby-photo-contest-1/submit"
              onClick={() => setIsOpen(false)}
              className="w-full inline-flex items-center justify-center px-5 py-3 rounded-full text-sm font-semibold text-white bg-[#234E3D] hover:bg-[#1A3B2E] active:scale-95 transition-all shadow-sm"
            >
              Enter your baby
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
