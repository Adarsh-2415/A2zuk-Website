"use client";

import { useState, useMemo } from "react";
import { Contest, ContestStatus } from "@/types/contest";
import { sortContests } from "@/lib/contests/format";
import { ContestCard } from "./ContestCard";
import { FeaturedContestCard } from "./FeaturedContestCard";
import ScrollReveal from "@/components/ScrollReveal";

interface ContestDiscoveryProps {
  contests: Contest[];
}

type FilterOption = "all" | ContestStatus;

export function ContestDiscovery({ contests }: ContestDiscoveryProps) {
  const [selectedStatus, setSelectedStatus] = useState<FilterOption>("all");

  // 1. Identify genuinely featured contest (if any)
  const featuredContest = useMemo(
    () => contests.find((c) => c.isFeatured === true),
    [contests]
  );

  // 2. Filter contests based on selected status
  const filteredContests = useMemo(() => {
    const matches = contests.filter((c) => {
      if (selectedStatus !== "all" && c.status !== selectedStatus) {
        return false;
      }
      return true;
    });

    // Apply approved default sorting order
    return sortContests(matches);
  }, [contests, selectedStatus]);

  // 3. Determine if featured contest should be showcased above the grid
  const showFeaturedSection = useMemo(() => {
    if (!featuredContest) return false;
    return filteredContests.some((c) => c.id === featuredContest.id);
  }, [featuredContest, filteredContests]);

  // Handler to reset filter
  const handleResetFilter = () => {
    setSelectedStatus("all");
  };

  // State A: Overall data source empty
  if (contests.length === 0) {
    return (
      <section id="explore-contests" className="w-full py-12 text-center">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border border-[#EFECE4] shadow-xs">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#234E3D]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#1B382B] mb-2">No contests available yet</h2>
          <p className="text-sm text-[#4A5D52]">Check back soon to discover contests on A2ZUK.</p>
        </div>
      </section>
    );
  }

  const filterTabs: { label: string; value: FilterOption }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Ended", value: "ended" },
  ];

  return (
    <section id="explore-contests" className="w-full py-6 sm:py-10 space-y-8">
      {/* Discovery Controls Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#EFECE4]">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1B382B] tracking-tight">
            Explore All Contests
          </h2>
          <p className="text-sm sm:text-base text-[#5A6D61] mt-1">
            Browse available contests, check current timelines, and discover community entries.
          </p>
        </div>

        {/* Result Count */}
        <div className="text-sm font-semibold text-[#1B382B] whitespace-nowrap bg-white/60 px-3.5 py-1.5 rounded-full border border-[#EFECE4] self-start md:self-auto">
          Showing {filteredContests.length} {filteredContests.length === 1 ? "contest" : "contests"}
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="flex items-center justify-between gap-4">
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0"
          role="tablist"
          aria-label="Filter contests by status"
        >
          {filterTabs.map((tab) => {
            const isSelected = selectedStatus === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedStatus(tab.value)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234E3D] ${isSelected
                    ? "bg-[#234E3D] text-white shadow-xs"
                    : "bg-white text-[#4A5D52] hover:bg-black/5 hover:text-[#1B382B] border border-[#EFECE4]"
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* State B: No Filter Match Found */}
      {filteredContests.length === 0 ? (
        <div className="w-full py-16 text-center">
          <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border border-[#EFECE4] shadow-xs">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#5A6D61]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#1B382B] mb-2">No contests found</h3>
            <p className="text-sm text-[#4A5D52] mb-5">
              There are no contests in this category right now.
            </p>
            <button
              type="button"
              onClick={handleResetFilter}
              className="inline-flex items-center px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#234E3D] hover:bg-[#1A3B2E] transition-colors"
            >
              View all contests
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Section 4: Optional Featured Contest (Conditional) */}
          {showFeaturedSection && featuredContest && (
            <ScrollReveal direction="up">
              <div className="space-y-3">
                <h3 className="text-xs font-bold tracking-wider uppercase text-[#5A6D61]">
                  Featured Spotlight
                </h3>
                <FeaturedContestCard contest={featuredContest} />
              </div>
            </ScrollReveal>
          )}

          {/* Section 5: Main Contest Listing Grid */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-[#1B382B] tracking-tight">
              All Contests
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredContests.map((contest, index) => (
                <ScrollReveal
                  key={contest.id}
                  direction="up"
                  delayMs={index * 80}
                >
                  <ContestCard contest={contest} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
