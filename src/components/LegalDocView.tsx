"use client";

import { useState } from "react";
import Link from "next/link";

export interface LegalSection {
  id: string;
  number: string;
  title: string;
  content: React.ReactNode;
  pendingNote?: string;
}

interface LegalDocViewProps {
  title: string;
  intro: string;
  sections: LegalSection[];
  lastUpdatedLabel?: string;
}

export default function LegalDocView({
  title,
  intro,
  sections,
  lastUpdatedLabel = "Pending official legal confirmation prior to public launch",
}: LegalDocViewProps) {
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  return (
    <div className="py-4 sm:py-8 space-y-8">
      {/* Document Header */}
      <div className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#1B382B] mb-4">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-[#4A5D52] leading-relaxed mb-4">
          {intro}
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-black/[0.04] text-[#6B7D72]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F2653B]" aria-hidden="true" />
          <span>Status: {lastUpdatedLabel}</span>
        </div>
      </div>

      {/* Main Grid: Sidebar TOC + Document Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Mobile Collapsible Table of Contents */}
        <div className="lg:hidden w-full">
          <div className="bg-white rounded-2xl border border-[#EFECE4] p-4 shadow-xs">
            <button
              type="button"
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              className="w-full flex items-center justify-between text-sm font-bold text-[#1B382B]"
              aria-expanded={mobileTocOpen}
            >
              <span>Table of Contents ({sections.length} Sections)</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileTocOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {mobileTocOpen && (
              <nav aria-label="Mobile Table of Contents" className="mt-4 pt-3 border-t border-[#F5F2EA] space-y-2">
                {sections.map((sec) => (
                  <Link
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setMobileTocOpen(false)}
                    className="block text-xs text-[#5A6D61] hover:text-[#1B382B] py-1 transition-colors"
                  >
                    <span className="font-semibold text-[#1B382B] mr-2">
                      {sec.number}.
                    </span>
                    {sec.title}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>

        {/* Desktop Sticky Table of Contents Sidebar */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-6">
          <div className="bg-white rounded-[24px] border border-[#EFECE4] p-6 shadow-xs max-h-[calc(100vh-4rem)] overflow-y-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#7B8D82] mb-4">
              Contents
            </h2>
            <nav aria-label="Table of Contents" className="space-y-1.5 text-xs sm:text-sm">
              {sections.map((sec) => (
                <Link
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="block py-1.5 px-2.5 rounded-lg text-[#5A6D61] hover:text-[#1B382B] hover:bg-[#FAF8F5] transition-all leading-snug"
                >
                  <span className="font-semibold text-[#1B382B] mr-1.5">
                    {sec.number}.
                  </span>
                  {sec.title}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Document Body (Comfortable reading width, clean hierarchy) */}
        <div className="lg:col-span-8 space-y-8 max-w-3xl">
          {sections.map((sec) => (
            <article
              key={sec.id}
              id={sec.id}
              className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#EFECE4] shadow-xs scroll-mt-6"
            >
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F2653B]">
                  Section {sec.number}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B382B] tracking-tight mb-4 leading-snug">
                {sec.title}
              </h2>
              <div className="text-sm sm:text-base text-[#4A5D52] leading-relaxed space-y-3 font-normal">
                {sec.content}
              </div>
              {sec.pendingNote && (
                <div className="mt-4 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EFECE4] text-xs text-[#6B7D72]">
                  <span className="font-semibold text-[#1B382B] mr-1">
                    Editorial Note:
                  </span>
                  {sec.pendingNote}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
