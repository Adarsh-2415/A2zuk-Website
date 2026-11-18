"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DesktopNav } from "./layout/DesktopNav";
import { MobileNav } from "./layout/MobileNav";
import { TopBar } from "./layout/TopBar";
import { cn } from "@/lib/utils/cn";
import { createClient } from "@/lib/supabase/client";
import { LanguageTranslator } from "./LanguageTranslator";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<{ email?: string; name?: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial scroll position
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          const email = data.user.email ?? "";
          const name =
            (data.user.user_metadata?.full_name as string | undefined) ??
            (data.user.user_metadata?.name as string | undefined) ??
            email.split("@")[0] ??
            "User";
          setUser({ email, name });
        } else {
          setUser(null);
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const email = session.user.email ?? "";
          const name =
            (session.user.user_metadata?.full_name as string | undefined) ??
            (session.user.user_metadata?.name as string | undefined) ??
            email.split("@")[0] ??
            "User";
          setUser({ email, name });
        } else {
          setUser(null);
        }
      });

      return () => {
        authListener?.subscription.unsubscribe();
      };
    } catch {
      // Ignore client auth detection error
    }
  }, []);

  return (
    <header className="sticky top-2 sm:top-3 z-40 w-full pt-1 pb-2 mb-4 sm:mb-6 lg:mb-8 transition-all duration-300">
      {/* Top Announcement Bar (Emergency / Contest Status Info) */}
      <div
        className={cn(
          "transition-all duration-300 overflow-hidden",
          isScrolled
            ? "max-h-0 opacity-0 mb-0 pointer-events-none"
            : "max-h-16 opacity-100 mb-1"
        )}
      >
        <TopBar />
      </div>

      {/* Dynamic Scroll Morphing Navbar (Floating Glassmorphic Island with Brand Gradient) */}
      <div
        className={cn(
          "w-full transition-all duration-300 ease-out",
          isScrolled
            ? "max-w-[840px] mx-auto rounded-full bg-gradient-to-r from-[#EBF4E8]/95 via-[#FAF6EE]/95 to-[#FCE6D8]/95 dark:from-[#112218]/95 dark:via-[#14281D]/95 dark:to-[#183123]/95 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_16px_36px_-12px_rgba(27,56,43,0.14)] px-3 sm:px-4 py-1.5 scale-[0.98]"
            : "max-w-full rounded-2xl sm:rounded-full bg-gradient-to-r from-[#EBF4E8]/90 via-[#FAF6EE]/90 to-[#FCE6D8]/90 dark:from-[#112218]/90 dark:via-[#14281D]/90 dark:to-[#183123]/90 backdrop-blur-xl border border-[#E8DFC8]/80 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_8px_24px_-8px_rgba(27,56,43,0.06)] px-4 sm:px-6 py-2 sm:py-2.5 scale-100"
        )}
      >
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Logo with micro-interaction */}
          <Link
            href="/"
            className="group flex items-center gap-2 p-1 rounded-full transition-transform duration-200 active:scale-95 shrink-0"
            aria-label="littlejoy by A2ZUK — Home"
          >
            <span
              className={cn(
                "rounded-sm bg-[#F2653B] inline-block shadow-sm group-hover:rotate-6 transition-transform duration-300",
                isScrolled ? "w-3 h-3" : "w-3.5 h-3.5"
              )}
              aria-hidden="true"
            />
            <span
              className={cn(
                "font-bold tracking-tight text-[#1B382B] dark:text-[#E2ECE5] group-hover:text-[#234E3D] dark:group-hover:text-[#D4E865] transition-all duration-300",
                isScrolled ? "text-lg sm:text-xl" : "text-xl sm:text-[22px]"
              )}
            >
              littlejoy
            </span>
          </Link>

          {/* Desktop Nav with active indicator dot and dynamic collapse */}
          <DesktopNav isScrolled={isScrolled} />

          {/* Desktop Action Controls: Language, Theme, User Status & CTA Button */}
          <div className="hidden md:flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Free Google Website Translator */}
            <LanguageTranslator variant="header" />

            {/* Dark/Light Theme Toggle */}
            <ThemeToggle />

            {user ? (
              <Link
                href="/profile"
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full font-semibold text-[#1B382B] dark:text-[#E2ECE5] bg-[#FAF8F5] dark:bg-[#1A2820] hover:bg-[#F0ECE1] dark:hover:bg-[#23352B] border border-[#E8DFC8] dark:border-white/15 transition-all duration-200 shadow-2xs whitespace-nowrap",
                  isScrolled ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-xs sm:text-sm"
                )}
                title="View your contestant profile & votes"
              >
                <span className="w-5 h-5 rounded-full bg-[#234E3D] text-white flex items-center justify-center text-[10px] font-bold">
                  {user.name ? user.name[0]?.toUpperCase() : "👤"}
                </span>
                <span>My Profile</span>
              </Link>
            ) : (
              <Link
                href="/profile"
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full font-semibold text-[#1B382B] dark:text-[#E2ECE5] hover:text-[#234E3D] dark:hover:text-[#D4E865] hover:bg-[#234E3D]/8 dark:hover:bg-white/10 transition-all duration-200 whitespace-nowrap",
                  isScrolled ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-xs sm:text-sm"
                )}
              >
                Sign In
              </Link>
            )}

            <Link
              href="/contests/baby-photo-contest-1/submit"
              className={cn(
                "inline-flex items-center justify-center rounded-full font-semibold text-white bg-[#234E3D] hover:bg-[#1A3B2E] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap",
                isScrolled ? "px-3.5 py-1.5 text-xs" : "px-4.5 py-2 text-xs sm:text-sm"
              )}
            >
              Participate Now
            </Link>
          </div>

          {/* Mobile Nav Trigger and Drawer */}
          <MobileNav user={user} />
        </div>
      </div>
    </header>
  );
}
