"use client";

import { BabyAgeCategory } from "@/types/entry";

interface AgeCategoryOption {
  value: BabyAgeCategory;
  title: string;
  ageRange: string;
  description: string;
  iconBg: string;
}

const CATEGORIES: AgeCategoryOption[] = [
  {
    value: "under-6-months",
    title: "Under 6 Months",
    ageRange: "0 – 6 months",
    description: "Newborn smiles, yawns & sweet sleepy moments",
    iconBg: "bg-[#FAD5C0]",
  },
  {
    value: "under-12-months",
    title: "Under 12 Months",
    ageRange: "6 – 12 months",
    description: "Sitting, rolling, first teeth & playful chuckles",
    iconBg: "bg-[#D4DCF9]",
  },
  {
    value: "up-to-24-months",
    title: "Up to 24 Months",
    ageRange: "12 – 24 months",
    description: "First steps, boundless curiosity & big giggles",
    iconBg: "bg-[#E2E8D5]",
  },
];

interface AgeCategorySelectorProps {
  selected: BabyAgeCategory | "";
  onChange: (cat: BabyAgeCategory) => void;
  error?: string;
}

export function AgeCategorySelector({
  selected,
  onChange,
  error,
}: AgeCategorySelectorProps) {
  return (
    <div className="w-full space-y-3">
      {/* Label and Helper Text */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-[#1B382B]">
          Baby’s Age Category <span className="text-[#F2653B]">*</span>
        </label>
        <p className="text-xs text-[#5A6D61] mt-0.5">
          Choose the age category that best fits your baby.
        </p>
      </div>

      {/* Selectable Cards Grid */}
      <div
        role="radiogroup"
        aria-label="Baby age category options"
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selected === cat.value;

          return (
            <div
              key={cat.value}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onChange(cat.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onChange(cat.value);
                }
              }}
              className={`relative rounded-2xl p-4 cursor-pointer transition-all duration-200 select-none flex flex-col justify-between border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234E3D] group ${
                isSelected
                  ? "border-[#234E3D] bg-[#234E3D]/5 shadow-sm scale-[1.01]"
                  : "border-[#EFECE4] bg-[#FAF8F5] hover:border-[#D4E865] hover:bg-white"
              }`}
            >
              {/* Header: Age Tag + Radio Indicator */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-[#234E3D] text-white"
                      : "bg-white text-[#5A6D61] border border-[#EFECE4]"
                  }`}
                >
                  {cat.ageRange}
                </span>

                {/* Radio Circle */}
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-[#234E3D] bg-[#234E3D]"
                      : "border-[#5A6D61]/40 bg-white group-hover:border-[#234E3D]"
                  }`}
                  aria-hidden="true"
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h4
                  className={`text-sm font-bold transition-colors leading-tight mb-1 ${
                    isSelected ? "text-[#234E3D]" : "text-[#1B382B] group-hover:text-[#234E3D]"
                  }`}
                >
                  {cat.title}
                </h4>
                <p className="text-[11px] text-[#5A6D61] leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Selected Bottom Indicator Line */}
              {isSelected && (
                <div
                  className="absolute -bottom-0.5 left-4 right-4 h-0.5 rounded-full bg-[#D4E865]"
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs font-medium text-red-600 flex items-center gap-1 pt-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
