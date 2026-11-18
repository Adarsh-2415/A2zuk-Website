"use client";

import { useState } from "react";
import Image from "next/image";
import { PublicContestantEntry } from "@/types/entry";
import BabyIllustration from "@/components/BabyIllustration";
import { PhotoLightboxModal } from "@/components/ui/PhotoLightboxModal";

interface EntryHeroPhotoProps {
  entry: PublicContestantEntry;
  className?: string;
}

export default function EntryHeroPhoto({
  entry,
  className = "",
}: EntryHeroPhotoProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const hasApprovedPhoto = Boolean(entry.photoUrl && entry.photoUrl.trim() !== "");

  return (
    <>
      <div className={`relative w-full max-w-[540px] mx-auto lg:max-w-none animate-hero-card ${className}`}>
        {/* Decorative Star Accent */}
        <div
          className="absolute -top-3.5 -right-3.5 z-20 w-8 h-8 flex items-center justify-center animate-star-twinkle pointer-events-none select-none"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-7 h-7 text-[#D4E865] drop-shadow-sm"
          >
            <path
              d="M12 2L14.4 8.6L21.5 9.1L16 13.8L17.8 20.8L12 17L6.2 20.8L8 13.8L2.5 9.1L9.6 8.6L12 2Z"
              fill="currentColor"
              stroke="#1B382B"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Main Portrait Frame with Click-to-Zoom */}
        <div
          role={hasApprovedPhoto ? "button" : undefined}
          tabIndex={hasApprovedPhoto ? 0 : undefined}
          aria-label={hasApprovedPhoto ? `Click to view full photo of ${entry.displayName}` : undefined}
          onClick={() => hasApprovedPhoto && setIsLightboxOpen(true)}
          onKeyDown={(e) => {
            if (hasApprovedPhoto && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              setIsLightboxOpen(true);
            }
          }}
          className={`w-full aspect-[4/5] rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#FAF8F5] border-2 border-[#EFECE4] relative shadow-md group transition-all duration-300 ease-out ${
            hasApprovedPhoto
              ? "cursor-zoom-in hover:shadow-xl hover:border-[#234E3D]/40 hover:scale-[1.01]"
              : ""
          }`}
        >
          {hasApprovedPhoto ? (
            <>
              <Image
                src={entry.photoUrl!}
                alt={entry.photoAlt || `Photo of ${entry.displayName}`}
                fill
                quality={95}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 800px"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                priority
              />

              {/* Hover Zoom Prompt Badge */}
              <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20 shadow-md">
                <span>🔍</span>
                <span>Click to view full size</span>
              </div>
            </>
          ) : (
            <div className="w-full h-full">
              <BabyIllustration variant="peach" />
            </div>
          )}

          {/* Celebratory Official Entry Pill Badge */}
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1B382B]/85 backdrop-blur-md text-white text-[11px] sm:text-xs font-semibold shadow-md border border-white/20 select-none">
            <span className="w-2 h-2 rounded-full bg-[#D4E865] animate-pulse" aria-hidden="true" />
            <span>Littlejoy Contestant</span>
          </div>
        </div>
      </div>

      {/* Full Size Photo Lightbox */}
      {hasApprovedPhoto && (
        <PhotoLightboxModal
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          photoUrl={entry.photoUrl!}
          displayName={entry.displayName}
          photoAlt={entry.photoAlt}
          categoryLabel={entry.ageCategory}
        />
      )}
    </>
  );
}
