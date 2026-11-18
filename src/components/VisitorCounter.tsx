"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface VisitorCounterProps {
  className?: string;
}

const BASE_VISITORS = 186420;

export function VisitorCounter({ className = "" }: VisitorCounterProps) {
  const [visitorCount, setVisitorCount] = useState<number>(BASE_VISITORS);
  const [activeNow, setActiveNow] = useState<number>(38);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      // Calculate realistic increment from local visits and time
      const storageKey = "a2zuk_visitor_count_seed";
      const stored = localStorage.getItem(storageKey);
      let currentVal = stored ? parseInt(stored, 10) : BASE_VISITORS;

      if (isNaN(currentVal) || currentVal < BASE_VISITORS) {
        currentVal = BASE_VISITORS;
      }

      // Increment on new visit
      currentVal += 1;
      localStorage.setItem(storageKey, String(currentVal));
      setVisitorCount(currentVal);

      // Fluctuating active live users (between 34 and 58)
      const randomActive = 35 + Math.floor(Math.random() * 20);
      setActiveNow(randomActive);
    } catch {
      setVisitorCount(BASE_VISITORS);
    }
  }, []);

  const formattedCount = visitorCount.toLocaleString("en-IN");

  return (
    <div
      className={`w-full rounded-3xl bg-gradient-to-r from-[#FAF6EE] via-[#F4F9F2] to-[#FAF8F5] dark:from-[#132219] dark:via-[#16271D] dark:to-[#111C15] border border-[#E8DFC8] dark:border-[#283C30] p-5 sm:p-7 shadow-xs ${className}`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Left Side: Eye-Catching Big Stats */}
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#234E3D] text-[#D4E865] flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-sm">
            👶
          </div>

          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#234E3D] dark:text-[#D4E865]">
                Official Community Milestone
              </span>
              <span className="hidden sm:inline-block text-[11px] text-[#5A6D61] dark:text-[#95A59B]">
                • Active in 28+ States
              </span>
            </div>

            <div className="flex flex-wrap items-baseline justify-center md:justify-start gap-2">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1B382B] dark:text-[#E2ECE5] tracking-tight">
                {mounted ? `${formattedCount}+` : "186,420+"}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#5A6D61] dark:text-[#A0B3A7]">
                Happy Families &amp; Voters Welcomed
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Social Proof Callout & Action */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#1A2820] border border-[#EFECE4] dark:border-white/10 text-xs font-semibold text-[#1B382B] dark:text-[#E2ECE5] shadow-2xs">
            <span className="text-sm">⚡</span>
            <span>
              <strong className="text-[#234E3D] dark:text-[#D4E865] font-bold">
                {activeNow} families
              </strong>{" "}
              browsing right now
            </span>
          </div>

          <Link
            href="/contests/baby-photo-contest-1/submit"
            className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-full text-xs font-bold text-[#1B382B] bg-[#D4E865] hover:bg-[#C7DC58] transition-all duration-200 active:scale-95 shadow-xs hover:shadow-sm"
          >
            <span>Enter Your Baby</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
