"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BabyAgeCategory } from "@/types/entry";

interface CelebrationScreenProps {
  babyName: string;
  ageCategory: BabyAgeCategory | "";
  photoFile: File | null;
  publicCode?: string | null;
  contestSlug?: string;
  onReset: () => void;
}

const AGE_LABELS: Record<BabyAgeCategory, string> = {
  "under-6-months": "Under 6 Months",
  "under-12-months": "Under 12 Months",
  "up-to-24-months": "Up to 24 Months",
};

// 16 artfully placed brand-colored confetti pieces
const CONFETTI_PIECES = [
  // Left side
  { id: 1, color: "bg-[#D4E865]", shape: "rect", left: "6%", top: "4%", size: "w-3 h-2", delay: "0.1s", duration: "3.2s", rotate: "rotate-12" },
  { id: 2, color: "bg-[#F2653B]", shape: "circle", left: "14%", top: "12%", size: "w-2.5 h-2.5", delay: "0.45s", duration: "3.8s", rotate: "rotate-45" },
  { id: 3, color: "bg-[#234E3D]", shape: "ribbon", left: "20%", top: "6%", size: "w-4 h-1.5", delay: "0.2s", duration: "3.4s", rotate: "-rotate-12" },
  { id: 4, color: "bg-[#F8D5C4]", shape: "circle", left: "26%", top: "16%", size: "w-3 h-3", delay: "0.7s", duration: "4.0s", rotate: "rotate-90" },
  { id: 5, color: "bg-[#D4E865]", shape: "rect", left: "10%", top: "22%", size: "w-2 h-2.5", delay: "0.35s", duration: "3.6s", rotate: "-rotate-45" },

  // Center spread
  { id: 6, color: "bg-[#D4E865]", shape: "circle", left: "34%", top: "2%", size: "w-2 h-2", delay: "0.15s", duration: "3.0s", rotate: "rotate-12" },
  { id: 7, color: "bg-[#F2653B]", shape: "ribbon", left: "40%", top: "8%", size: "w-3.5 h-1.5", delay: "0.6s", duration: "3.5s", rotate: "rotate-45" },
  { id: 8, color: "bg-[#234E3D]", shape: "rect", left: "48%", top: "2%", size: "w-2.5 h-2.5", delay: "0.25s", duration: "3.3s", rotate: "-rotate-12" },
  { id: 9, color: "bg-[#F8D5C4]", shape: "rect", left: "54%", top: "10%", size: "w-3 h-2", delay: "0.8s", duration: "3.9s", rotate: "rotate-30" },
  { id: 10, color: "bg-[#D4E865]", shape: "circle", left: "60%", top: "4%", size: "w-2.5 h-2.5", delay: "0.4s", duration: "3.1s", rotate: "-rotate-30" },
  { id: 11, color: "bg-[#234E3D]", shape: "circle", left: "64%", top: "16%", size: "w-2 h-2", delay: "0.9s", duration: "3.7s", rotate: "rotate-60" },

  // Right side
  { id: 12, color: "bg-[#F2653B]", shape: "rect", left: "72%", top: "6%", size: "w-3 h-2", delay: "0.3s", duration: "3.4s", rotate: "-rotate-12" },
  { id: 13, color: "bg-[#D4E865]", shape: "ribbon", left: "78%", top: "14%", size: "w-4 h-1.5", delay: "0.55s", duration: "3.6s", rotate: "rotate-45" },
  { id: 14, color: "bg-[#234E3D]", shape: "circle", left: "84%", top: "4%", size: "w-2.5 h-2.5", delay: "0.15s", duration: "3.2s", rotate: "-rotate-45" },
  { id: 15, color: "bg-[#F8D5C4]", shape: "rect", left: "90%", top: "12%", size: "w-3 h-2.5", delay: "0.75s", duration: "4.1s", rotate: "rotate-12" },
  { id: 16, color: "bg-[#D4E865]", shape: "circle", left: "94%", top: "20%", size: "w-2 h-2", delay: "0.5s", duration: "3.5s", rotate: "rotate-90" },
];

export function CelebrationScreen({
  babyName,
  ageCategory,
  photoFile,
  publicCode,
  contestSlug = "baby-photo-contest-1",
  onReset,
}: CelebrationScreenProps) {
  // Initialize preview URL safely
  const [prevPhotoFile, setPrevPhotoFile] = useState<File | null>(photoFile);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(() => {
    if (typeof window !== "undefined" && photoFile) {
      return URL.createObjectURL(photoFile);
    }
    return null;
  });

  // Adjust state if photoFile prop changes (React 19 pattern)
  if (photoFile !== prevPhotoFile) {
    setPrevPhotoFile(photoFile);
    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl);
    }
    setPhotoPreviewUrl(
      typeof window !== "undefined" && photoFile ? URL.createObjectURL(photoFile) : null
    );
  }

  // Revoke object URL on unmount or URL replacement
  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  const displayAge = ageCategory ? AGE_LABELS[ageCategory] : null;

  return (
    <div
      role="region"
      aria-label="Submission preview celebration"
      className="w-full rounded-[28px] sm:rounded-[36px] bg-white border border-[#EFECE4] p-6 sm:p-12 shadow-xs max-w-2xl mx-auto text-center relative overflow-hidden animate-hero-card"
    >
      {/* Self-contained Confetti Animation Styles */}
      <style>{`
        @keyframes confettiDrift {
          0% {
            opacity: 0;
            transform: translateY(-16px) rotate(0deg) scale(0.85);
          }
          15% {
            opacity: 1;
            transform: translateY(12px) rotate(45deg) scale(1);
          }
          75% {
            opacity: 0.95;
            transform: translateY(140px) rotate(240deg) scale(0.95);
          }
          100% {
            opacity: 0;
            transform: translateY(220px) rotate(360deg) scale(0.8);
          }
        }
        .animate-confetti-drift {
          animation-name: confettiDrift !important;
          animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1) !important;
          animation-iteration-count: infinite !important;
        }
      `}</style>

      {/* 16 Floating Brand Confetti Ribbons & Dots (Aria Hidden) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        {CONFETTI_PIECES.map((piece) => (
          <div
            key={piece.id}
            className={`absolute animate-confetti-drift ${piece.color} ${piece.size} ${piece.rotate} ${piece.shape === "circle" ? "rounded-full" : piece.shape === "ribbon" ? "rounded-xs" : "rounded-xs"
              }`}
            style={{
              left: piece.left,
              top: piece.top,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
            }}
          />
        ))}
      </div>

      {/* Decorative Twinkling Stars */}
      <div className="absolute top-8 left-8 text-[#D4E865] pointer-events-none select-none animate-star-twinkle" aria-hidden="true">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>
      <div className="absolute top-12 right-10 text-[#F2653B]/70 pointer-events-none select-none animate-star-twinkle" aria-hidden="true" style={{ animationDelay: "1.2s" }}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>

      {/* Central Forest Green Emblem with Lime Accent */}
      <div className="mx-auto mb-6 w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#FAF8F5] border-2 border-[#EFECE4] flex items-center justify-center relative shadow-sm animate-celebration-pop">
        <div className="absolute inset-0 rounded-3xl bg-[#D4E865]/30 animate-ping opacity-40 pointer-events-none" style={{ animationDuration: "3s" }} />

        {/* Custom Littlejoy Star & Checkmark Emblem */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#234E3D] text-[#D4E865] flex items-center justify-center shadow-xs relative">
          {/* Subtle Star Backdrop */}
          <svg className="w-10 h-10 text-[#D4E865] opacity-25 absolute" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {/* Bold Checkmark */}
          <svg className="w-7 h-7 text-[#D4E865] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Staggered Main Headline */}
      <div className="space-y-2 mb-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1B382B] tracking-tight">
          Every Little Star Deserves to Shine.
        </h2>
        <p className="text-xs sm:text-sm text-[#4A5D52] max-w-md mx-auto leading-relaxed">
          “A tiny smile, a precious memory, a whole lot of love. Thank you for exploring this Littlejoy entry experience.”
        </p>
      </div>

      {/* Local Preview Area (Baby Details & Selected Photo) */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#EFECE4] max-w-md mx-auto text-left space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#EFECE4]/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#234E3D] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#234E3D]" />
            Local Preview
          </span>
          <span className="text-[11px] font-medium text-[#5A6D61]">
            {publicCode ? `Ref: ${publicCode}` : "Not uploaded to server"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Photo Thumbnail */}
          {photoPreviewUrl ? (
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-black/5 shrink-0 border border-[#EFECE4] shadow-xs">
              <Image
                src={photoPreviewUrl}
                alt={`Local preview for ${babyName || "baby"}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white border border-[#EFECE4] flex items-center justify-center text-[#234E3D] shrink-0">
              <svg className="w-7 h-7 text-[#234E3D]/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          )}

          {/* Baby Display Name & Category */}
          <div className="min-w-0 flex-1">
            <p className="text-base sm:text-lg font-bold text-[#1B382B] truncate">
              {babyName || "Little Explorer"}
            </p>
            {displayAge && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#234E3D]/10 text-[#234E3D] mt-1">
                {displayAge}
              </span>
            )}
            <p className="text-[11px] text-[#5A6D61] mt-1 truncate">
              Photo: {photoFile ? photoFile.name : "Sample preview"}
            </p>
          </div>
        </div>
      </div>

      {/* Tasteful Unmistakable Status Label & Disclosure */}
      <div
        role="status"
        aria-label={publicCode ? "Entry submission status" : "Frontend demonstration notice"}
        className="mb-8 p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border-2 border-[#234E3D] text-left space-y-1.5"
      >
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#234E3D] text-[#D4E865] flex items-center justify-center text-xs font-bold shrink-0">
            {publicCode ? "✓" : "i"}
          </span>
          <h3 className="font-bold text-sm sm:text-base text-[#1B382B]">
            {publicCode
              ? "Entry Received — Pending Review"
              : "Frontend Preview — Entry Not Submitted"}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[#4A5D52] leading-relaxed pl-7">
          {publicCode
            ? `Your entry (Reference: ${publicCode}) and photo have been securely uploaded. It will appear in the public gallery once moderation checks pass.`
            : "This is a demonstration of the submission experience. Real entry submission, photo storage and contest processing will be available once the backend is connected."}
        </p>
      </div>

      {/* Functional Action Buttons */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Primary Action: View Entry Page if code exists, otherwise explore contests */}
          {publicCode ? (
            <Link
              href={`/contests/${contestSlug}/entries/${publicCode}`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full text-sm font-bold text-white bg-[#234E3D] hover:bg-[#1A3B2E] active:scale-[0.99] transition-all duration-200 shadow-xs hover:shadow-md text-center inline-flex items-center justify-center gap-1.5"
            >
              <span>View Baby&apos;s Entry Page</span>
              <span>→</span>
            </Link>
          ) : (
            <Link
              href="/contests"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full text-sm font-semibold text-white bg-[#234E3D] hover:bg-[#1A3B2E] active:scale-[0.99] transition-all duration-200 shadow-xs hover:shadow-md text-center"
            >
              Explore All Contests
            </Link>
          )}

          {/* Secondary Action: Explore All Contests (if code exists) */}
          {publicCode && (
            <Link
              href="/contests"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full text-sm font-semibold text-[#1B382B] bg-white border border-[#EFECE4] hover:bg-black/5 active:scale-[0.99] transition-all duration-200 text-center"
            >
              Explore Contests
            </Link>
          )}

          {/* Tertiary Action: Submit Another Entry */}
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full text-sm font-semibold text-[#5A6D61] bg-transparent hover:bg-black/5 active:scale-[0.99] transition-all duration-200 text-center"
          >
            Submit Another
          </button>
        </div>

        {/* Tertiary Action: Return to Contest Details */}
        <div className="pt-2">
          <Link
            href={`/contests/${contestSlug}`}
            className="text-xs font-medium text-[#5A6D61] hover:text-[#1B382B] hover:underline transition-colors"
          >
            ← Return to Contest Details
          </Link>
        </div>
      </div>
    </div>
  );
}
