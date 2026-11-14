import Link from "next/link";
import type { Contest } from "@/types/contest";
import BabyIllustration from "./BabyIllustration";

interface HeroSectionProps {
  featuredContest?: Contest | null;
}

export default function HeroSection({ featuredContest }: HeroSectionProps) {
  const prizeSummary = featuredContest?.prizeStructure
    ? `${featuredContest.prizeStructure.formattedTotalPool} Prize Pool (${featuredContest.prizeStructure.totalWinners} Winners)`
    : "₹27,500 Prize Pool (13 Winners)";
  return (
    <section
      aria-labelledby="hero-heading"
      className="w-full bg-[#234E3D] text-white rounded-[28px] sm:rounded-[36px] p-7 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Coordinated Entrance Sequence */}
        <div className="lg:col-span-7 flex flex-col items-start z-10">
          {/* 1. Pill Tag */}
          <span className="animate-hero-badge inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#D4E865] text-[#1B382B] mb-6 sm:mb-8 shadow-sm">
            A LITTLE MOMENT, A BIG MEMORY
          </span>

          {/* 2. Main Headline (H1) */}
          <h1
            id="hero-heading"
            className="animate-hero-title text-3xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-white leading-[1.08] mb-6"
          >
            Every little face
            <br />
            has a big story.
          </h1>

          {/* 3. Supporting Copy */}
          <p className="animate-hero-desc text-white/85 text-base sm:text-lg leading-relaxed max-w-md mb-8 sm:mb-10 font-normal">
            Celebrate your little one. Share a smile.
            <br />
            Let your community cheer them on.
          </p>

          {/* 4. Primary Action Button & Caption */}
          <div className="animate-hero-cta flex flex-col items-start">
            <Link
              href="/contests"
              className="inline-flex items-center gap-2 bg-[#D4E865] hover:bg-[#C7DC58] text-[#1B382B] font-bold text-sm sm:text-base px-6 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-md hover:shadow-lg group"
            >
              <span>Explore the contest</span>
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M7 17L17 7M17 7H7M17 7V17"
                />
              </svg>
            </Link>

            <div className="flex flex-wrap items-center gap-2.5 mt-4">
              <span className="text-xs sm:text-sm text-white/60 font-medium">
                A joyful photo contest for families
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-white/10 text-[#D4E865] border border-white/15">
                <span>🏆</span>
                <span>{prizeSummary}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Coordinated Entrance for Artwork Card */}
        <div className="animate-hero-card lg:col-span-5 w-full flex justify-center">
          <div className="bg-[#EAE4D2] rounded-[24px] sm:rounded-[32px] p-4 sm:p-5 shadow-lg relative w-full aspect-[4/3] sm:aspect-square max-w-[420px] lg:max-w-none flex items-center justify-center transition-transform duration-500 hover:scale-[1.01]">
            {/* Inner Illustration Frame */}
            <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden relative shadow-inner">
              <BabyIllustration variant="hero" hasStar={true} />
            </div>

            {/* Floating Quote Badge with subtle gentle oscillation */}
            <div className="animate-float-badge absolute bottom-6 left-6 bg-white text-[#1B382B] px-5 py-3 rounded-2xl shadow-xl border border-white/90 z-20 max-w-[200px]">
              <p className="font-bold text-xs sm:text-sm leading-snug">
                little moments,
                <br />
                forever memories
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
