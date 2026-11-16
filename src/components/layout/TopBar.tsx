"use client";

import Link from "next/link";

export function TopBar() {
  return (
    <div className="w-full py-1.5 px-3.5 mb-2 hidden sm:flex items-center justify-between text-xs text-[#1B382B] bg-gradient-to-r from-[#EEF5EB]/80 via-[#FAF7F0]/80 to-[#FDE8DC]/80 backdrop-blur-md border border-[#EAE2D2]/70 rounded-full transition-all duration-300 shadow-2xs">
      {/* Live Contest Status Badge */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F2653B] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F2653B]"></span>
        </span>
        <span className="font-bold text-[#1B382B]">Contest #1 Live:</span>
        <span className="text-[#4A5D52]">Every little face has a big story — Submissions open!</span>
      </div>

      {/* Quick Info & Support Link */}
      <div className="flex items-center gap-4 text-xs font-medium">
        <span className="text-[#4A5D52]">
          Official Voting: <strong className="text-[#1B382B] font-semibold">1 Vote Per Contestant</strong>
        </span>
        <span className="text-black/15" aria-hidden="true">•</span>
        <Link
          href="/how-it-works"
          className="text-[#234E3D] hover:text-[#1A3B2E] font-semibold hover:underline transition-colors"
        >
          How it works →
        </Link>
      </div>
    </div>
  );
}
