"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BabyAgeCategory } from "@/types/entry";
import type { GalleryEntryItem } from "@/lib/queries/entries";
import BabyIllustration from "@/components/BabyIllustration";

interface ContestEntriesGalleryProps {
  entries: GalleryEntryItem[];
  contestSlug: string;
  isActiveContest: boolean;
}

type AgeFilter = "all" | BabyAgeCategory;
type SortMode = "votes" | "newest";

const AGE_FILTERS: { label: string; value: AgeFilter }[] = [
  { label: "All Ages", value: "all" },
  { label: "Under 6m", value: "under-6-months" },
  { label: "Under 12m", value: "under-12-months" },
  { label: "Up to 24m", value: "up-to-24-months" },
];

const CARD_VARIANTS: Array<"peach" | "lavender" | "sage"> = [
  "peach",
  "lavender",
  "sage",
];

export function ContestEntriesGallery({
  entries,
  contestSlug,
  isActiveContest,
}: ContestEntriesGalleryProps) {
  const [ageFilter, setAgeFilter] = useState<AgeFilter>("all");
  const [sortBy, setSortBy] = useState<SortMode>("votes");

  const filteredEntries = useMemo(() => {
    const filtered =
      ageFilter === "all"
        ? entries
        : entries.filter((e) => e.ageCategory === ageFilter);

    return [...filtered].sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      const voteDiff = (b.voteCount ?? 0) - (a.voteCount ?? 0);
      if (voteDiff !== 0) return voteDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [entries, ageFilter, sortBy]);

  return (
    <section
      aria-labelledby="contest-entries-heading"
      className="w-full rounded-[28px] sm:rounded-[36px] bg-white border border-[#EFECE4] p-6 sm:p-10 shadow-xs space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2
            id="contest-entries-heading"
            className="text-2xl sm:text-3xl font-bold text-[#1B382B] tracking-tight"
          >
            Contest Entries
          </h2>
          <p className="text-sm text-[#5A6D61] mt-1">
            Browse approved little stars and open their profile to cheer and vote.
          </p>
        </div>

        {entries.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Sort contest entries"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortMode)}
              className="px-3.5 py-2 rounded-full text-xs font-semibold bg-[#FAF8F5] border border-[#EFECE4] text-[#1B382B] focus:outline-none focus:ring-2 focus:ring-[#234E3D]/30"
            >
              <option value="votes">Most Votes</option>
              <option value="newest">Newest Entries</option>
            </select>
          </div>
        )}
      </div>

      {entries.length > 0 && (
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Filter entries by age category"
        >
          {AGE_FILTERS.map((tab) => {
            const active = ageFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setAgeFilter(tab.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  active
                    ? "bg-[#234E3D] text-white"
                    : "bg-[#FAF8F5] text-[#4A5D52] hover:bg-[#EFECE4]/60 border border-[#EFECE4]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {entries.length === 0 ? (
        <div className="rounded-2xl bg-[#FAF8F5] border border-[#EFECE4] p-8 text-center space-y-3">
          <p className="text-base font-bold text-[#1B382B]">
            No published entries yet
          </p>
          <p className="text-xs sm:text-sm text-[#5A6D61] max-w-md mx-auto">
            Approved entries will appear here once reviewed.
          </p>
          {isActiveContest && (
            <div className="pt-1">
              <Link
                href={`/contests/${contestSlug}/submit`}
                className="inline-flex items-center px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-[#1B382B] bg-[#D4E865] hover:bg-[#C7DC58] transition-colors"
              >
                Submit the First Entry
              </Link>
            </div>
          )}
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="rounded-2xl bg-[#FAF8F5] border border-[#EFECE4] p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-[#1B382B]">
            No entries in this age category yet.
          </p>
          <button
            type="button"
            onClick={() => setAgeFilter("all")}
            className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-white border border-[#EFECE4] text-[#1B382B] hover:bg-[#EFECE4]/40 transition-colors"
          >
            Show all entries
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry, index) => {
            const variant = CARD_VARIANTS[index % CARD_VARIANTS.length];
            const voteCount = entry.voteCount ?? 0;

            return (
              <article
                key={entry.slug}
                className="bg-[#FAF8F5] rounded-[24px] p-4 border border-[#EFECE4] hover:border-[#234E3D]/30 transition-all duration-200 flex flex-col"
              >
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3 relative bg-white">
                  {entry.photoUrl ? (
                    <Image
                      src={entry.photoUrl}
                      alt={entry.photoAlt || `Photo of ${entry.displayName}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 340px"
                      className="object-cover object-center"
                    />
                  ) : (
                    <BabyIllustration variant={variant} />
                  )}
                </div>

                <h3 className="text-base font-bold text-[#1B382B] truncate">
                  {entry.displayName}
                </h3>

                <div className="mt-auto pt-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1B382B]">
                    {voteCount === 1 ? "1 vote" : `${voteCount} votes`}
                  </span>
                  <Link
                    href={`/contests/${contestSlug}/entries/${entry.slug}`}
                    className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold text-[#1B382B] bg-[#D4E865] hover:bg-[#C7DC58] transition-colors"
                  >
                    Vote &amp; View
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

