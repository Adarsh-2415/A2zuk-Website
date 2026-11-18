"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { NavDropdown, DropdownItem } from "./NavDropdown";

interface DesktopNavProps {
  isScrolled?: boolean;
}

export function DesktopNav({ isScrolled = false }: DesktopNavProps) {
  const pathname = usePathname();

  const primaryLinks = [
    { title: "Home", href: "/" },
    { title: "The Contest", href: "/contests" },
    { title: "How It Works", href: "/how-it-works" },
  ];

  const supportDropdownItems: DropdownItem[] = [
    {
      title: "Help & FAQs",
      href: "/help",
      description: "Answers about voting, entries and platform rules",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Contest Rules & Terms",
      href: "/terms",
      description: "Eligibility criteria, contest rules and guidelines",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: "Privacy Policy",
      href: "/privacy-policy",
      description: "How participant photos and data are safeguarded",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
  ];

  return (
    <nav
      className={cn(
        "hidden md:flex items-center transition-all duration-300",
        isScrolled ? "gap-1" : "gap-1.5"
      )}
      aria-label="Desktop Navigation"
    >
      {/* Primary Links */}
      {primaryLinks.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative rounded-full transition-all duration-300 font-semibold inline-flex flex-col items-center justify-center",
              isScrolled ? "px-3 pt-1 pb-2.5 text-xs" : "px-4 pt-1.5 pb-3 text-sm",
              isActive
                ? "text-[#234E3D] dark:text-[#D4E865] bg-[#234E3D]/12 dark:bg-white/10 font-bold shadow-xs"
                : "text-[#1B382B] dark:text-[#E2ECE5] hover:text-[#234E3D] dark:hover:text-[#D4E865] hover:bg-[#234E3D]/8 dark:hover:bg-white/10"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="leading-tight">{item.title}</span>

            {/* Active Dot Indicator */}
            {isActive && (
              <span
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 rounded-full bg-[#234E3D] dark:bg-[#D4E865]",
                  isScrolled ? "bottom-0.5 w-1 h-1" : "bottom-1 w-1.5 h-1.5"
                )}
                aria-hidden="true"
              />
            )}
          </Link>
        );
      })}

      {/* Dropdown Menu */}
      <NavDropdown
        title="Support & Rules"
        items={supportDropdownItems}
        isScrolled={isScrolled}
      />
    </nav>
  );
}
