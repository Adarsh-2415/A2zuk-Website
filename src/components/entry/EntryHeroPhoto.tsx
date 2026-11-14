import Image from "next/image";
import { PublicContestantEntry } from "@/types/entry";
import BabyIllustration from "@/components/BabyIllustration";

interface EntryHeroPhotoProps {
  entry: PublicContestantEntry;
  className?: string;
}

export default function EntryHeroPhoto({
  entry,
  className = "",
}: EntryHeroPhotoProps) {
  const hasApprovedPhoto = Boolean(entry.photoUrl && entry.photoUrl.trim() !== "");

  return (
    <div className={`relative w-full max-w-[480px] mx-auto lg:max-w-none animate-hero-card ${className}`}>
      {/* Decorative Star Accent (Floating outside top-right of portrait) */}
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

      {/* Main Portrait Frame with subtle hover lift on desktop */}
      <div className="w-full aspect-[4/5] rounded-[24px] sm:rounded-[28px] overflow-hidden bg-[#FAF8F5] border border-[#EFECE4] relative shadow-inner group hover:scale-[1.015] transition-all duration-300 ease-out">
        {hasApprovedPhoto ? (
          <Image
            src={entry.photoUrl!}
            alt={entry.photoAlt || `Photo of ${entry.displayName}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 480px"
            className="object-cover object-center"
            priority
          />
        ) : (
          <div className="w-full h-full">
            <BabyIllustration variant="peach" />
          </div>
        )}

        {/* Celebratory Official Entry Pill Badge */}
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1B382B]/85 backdrop-blur-md text-white text-[11px] sm:text-xs font-semibold shadow-md border border-white/20 select-none">
          <span className="w-2 h-2 rounded-full bg-[#D4E865] animate-pulse" aria-hidden="true" />
          <span>Littlejoy Contestant</span>
        </div>
      </div>
    </div>
  );
}
