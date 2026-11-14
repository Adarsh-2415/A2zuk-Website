import { Contest } from "@/types/contest";

interface ContestCoverImageProps {
  contest: Contest;
  className?: string;
}

export function ContestCoverImage({ contest, className = "" }: ContestCoverImageProps) {
  const bgVariants = {
    peach: "bg-[#FAD5C0]",
    lavender: "bg-[#D4DCF9]",
    sage: "bg-[#E2E8D5]",
    hero: "bg-[#F8D5C4]",
  };

  const sunColors = {
    peach: "#F0653F",
    lavender: "#234E3D",
    sage: "#234E3D",
    hero: "#D4E865",
  };

  const bg = bgVariants[contest.coverVariant] || "bg-[#FAD5C0]";
  const sun = sunColors[contest.coverVariant] || "#F0653F";

  return (
    <div
      className={`relative w-full aspect-[16/9] overflow-hidden rounded-2xl ${bg} flex items-center justify-center select-none group-hover:scale-[1.02] transition-transform duration-300 ease-out ${className}`}
      role="img"
      aria-label={`Cover art for ${contest.title}`}
    >
      {/* Decorative Warm Geometric Graphic Motif */}
      <svg
        viewBox="0 0 320 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover opacity-90"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* Soft Background Arc / Sun */}
        <circle cx="260" cy="50" r="38" fill={sun} fillOpacity="0.25" />
        <circle cx="260" cy="50" r="22" fill={sun} fillOpacity="0.8" />

        {/* Floating Twinkle Star */}
        <path
          d="M60 40L62.5 48L70 50L64 54.5L66 62L60 57.5L54 62L56 54.5L50 50L57.5 48L60 40Z"
          fill="#1B382B"
          fillOpacity="0.2"
        />

        {/* Abstract Baby Silhouette / Heart Arch Motif */}
        <path
          d="M160 140C120 140 100 180 100 180H220C220 180 200 140 160 140Z"
          fill="#1B382B"
          fillOpacity="0.12"
        />
        <circle cx="160" cy="115" r="24" fill="#1B382B" fillOpacity="0.15" />

        {/* Camera / Moment Capture Symbol */}
        <g opacity="0.35">
          <rect x="25" y="115" width="46" height="34" rx="7" stroke="#1B382B" strokeWidth="3" />
          <circle cx="48" cy="132" r="8" stroke="#1B382B" strokeWidth="2.5" />
          <path d="M38 115L41 110H55L58 115" stroke="#1B382B" strokeWidth="2.5" strokeLinejoin="round" />
        </g>
      </svg>

      {/* Subtle Inner Border Overlay */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 pointer-events-none" />
    </div>
  );
}
