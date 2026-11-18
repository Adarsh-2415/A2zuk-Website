"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PublicContestantEntry } from "@/types/entry";
import BabyIllustration from "./BabyIllustration";
import ScrollReveal from "./ScrollReveal";
import { PhotoLightboxModal } from "@/components/ui/PhotoLightboxModal";

interface ContestantsSectionProps {
  entries?: PublicContestantEntry[];
}

const CARD_VARIANTS: Array<"peach" | "lavender" | "sage"> = [
  "peach",
  "lavender",
  "sage",
];

export default function ContestantsSection({
  entries = [],
}: ContestantsSectionProps) {
  const [activeLightboxEntry, setActiveLightboxEntry] = useState<PublicContestantEntry | null>(null);

  return (
    <section aria-labelledby="contestants-heading" className="w-full my-10">
      {/* Section Header with ScrollReveal */}
      <ScrollReveal direction="up">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2
              id="contestants-heading"
              className="text-2xl sm:text-3xl font-bold text-[#1B382B] tracking-tight"
            >
              Meet the little stars
            </h2>
            <p className="text-[#5A6D61] text-sm sm:text-base mt-1">
              Big smiles. Tiny humans. A whole lot of love.
            </p>
          </div>

          <div>
            <Link
              href="/contests"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#234E3D] hover:bg-[#1A3B2E] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              <span>View all entries</span>
              <svg
                className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
          </div>
        </div>
      </ScrollReveal>

      {/* Published Contestant Cards or Honest Empty State */}
      {entries.length === 0 ? (
        <div className="w-full rounded-[24px] bg-white border border-[#EFECE4] p-8 sm:p-10 text-center shadow-xs">
          <p className="text-base sm:text-lg font-bold text-[#1B382B] mb-1.5">
            Entries opening soon
          </p>
          <p className="text-sm text-[#5A6D61] max-w-md mx-auto mb-5">
            Approved little stars will appear here once submissions are reviewed and published.
          </p>
          <Link
            href="/contests"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-[#1B382B] bg-[#D4E865] hover:bg-[#C7DC58] transition-colors shadow-xs"
          >
            Explore active contests
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((child, index) => {
            const variant = CARD_VARIANTS[index % CARD_VARIANTS.length];
            const voteLabel =
              child.voteCount === 1
                ? "1 vote"
                : `${child.voteCount ?? 0} votes`;

            return (
              <ScrollReveal
                key={child.slug}
                direction="up"
                delayMs={index * 110}
                className="h-full"
              >
                <article className="h-full bg-white rounded-[24px] p-4 border border-[#EFECE4] shadow-xs hover:shadow-xl hover:shadow-emerald-950/[0.04] hover:border-[#E2DCCE] hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col group cursor-default">
                  {/* Profile Card Frame */}
                  <div
                    onClick={() => child.photoUrl && setActiveLightboxEntry(child)}
                    role={child.photoUrl ? "button" : undefined}
                    tabIndex={child.photoUrl ? 0 : undefined}
                    onKeyDown={(e) => {
                      if (child.photoUrl && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        setActiveLightboxEntry(child);
                      }
                    }}
                    className={`w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 relative bg-[#FAF8F5] shadow-inner ${
                      child.photoUrl
                        ? "cursor-zoom-in group/photo focus:outline-none focus:ring-2 focus:ring-[#1B382B]"
                        : ""
                    }`}
                    aria-label={child.photoUrl ? `View high resolution photo of ${child.displayName}` : undefined}
                  >
                    {child.photoUrl ? (
                      <>
                        <Image
                          src={child.photoUrl}
                          alt={child.photoAlt || `Photo of ${child.displayName}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                          quality={90}
                          className="object-cover object-center group-hover/photo:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/photo:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                          <span className="opacity-0 group-hover/photo:opacity-100 transition-opacity bg-black/60 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-sm flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                            </svg>
                            Zoom
                          </span>
                        </div>
                      </>
                    ) : (
                      <BabyIllustration variant={variant} />
                    )}
                  </div>

                  {/* Child Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-[#1B382B] group-hover:text-[#234E3D] transition-colors duration-200">
                      {child.displayName}
                    </h3>
                    {child.publicDescription && (
                      <p className="text-xs text-[#5A6D61] mt-0.5 line-clamp-2">
                        {child.publicDescription}
                      </p>
                    )}
                  </div>

                  {/* Bottom Row: Votes & CTA */}
                  <div className="mt-auto pt-3 border-t border-[#F5F2EA] flex items-center justify-between">
                    <span className="text-sm font-bold text-[#1B382B]">
                      {voteLabel}
                    </span>
                    <Link
                      href={`/contests/${child.contestSlug}/entries/${child.slug}`}
                      className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold text-[#1B382B] bg-[#D4E865] hover:bg-[#C7DC58] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-xs hover:shadow-sm"
                    >
                      View profile
                    </Link>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      )}

      {activeLightboxEntry?.photoUrl && (
        <PhotoLightboxModal
          isOpen={true}
          onClose={() => setActiveLightboxEntry(null)}
          photoUrl={activeLightboxEntry.photoUrl}
          photoAlt={activeLightboxEntry.photoAlt || `Photo of ${activeLightboxEntry.displayName}`}
          displayName={activeLightboxEntry.displayName}
          ageCategory={activeLightboxEntry.ageCategory}
        />
      )}
    </section>
  );
}
