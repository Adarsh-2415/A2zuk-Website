interface BabyIllustrationProps {
  variant?: "hero" | "peach" | "lavender" | "sage";
  className?: string;
  hasStar?: boolean;
}

export default function BabyIllustration({
  variant = "peach",
  className = "",
  hasStar = false,
}: BabyIllustrationProps) {
  // Palette mapping based on the Figma cards
  const bgColors = {
    hero: "#F8D5C4",
    peach: "#FAD5C0",
    lavender: "#D4DCF9",
    sage: "#E2E8D5",
  };

  const sunColors = {
    hero: "#F0653F",
    peach: "#F0653F",
    lavender: "#D4E865",
    sage: "#F0653F",
  };

  const bg = bgColors[variant];
  const sun = sunColors[variant];

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none ${className}`}
      style={{ backgroundColor: bg }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Floating Sun / Planet */}
        <circle cx="320" cy="85" r="32" fill={sun} />

        {/* Decorative 5-point rounded star (Hero card only, with gentle twinkle) */}
        {hasStar && (
          <g className="animate-star-twinkle">
            <path
              d="M360 48L363.5 58.5L374.5 58.8L365.8 65.2L369 75.8L360 69.5L351 75.8L354.2 65.2L345.5 58.8L356.5 58.5L360 48Z"
              fill="#D4E865"
              stroke="#D4E865"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          </g>
        )}

        {/* Baby Abstract Torso / Body (Caramel/Terracotta) */}
        <ellipse cx="200" cy="275" rx="66" ry="78" fill="#BA7850" />

        {/* Baby Face (Warm Sand / Peach) */}
        <circle cx="200" cy="155" r="48" fill="#E5BCA0" />

        {/* Baby Cap / Hair (Dark Forest Green) */}
        <path
          d="M142 142 C142 108, 258 108, 258 142 C258 165, 142 165, 142 142 Z"
          fill="#1B382B"
        />
      </svg>
    </div>
  );
}
