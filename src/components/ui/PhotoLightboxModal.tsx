"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";

interface PhotoLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoUrl: string;
  displayName: string;
  photoAlt?: string;
  categoryLabel?: string;
  ageCategory?: string;
  city?: string;
}

export function PhotoLightboxModal({
  isOpen,
  onClose,
  photoUrl,
  displayName,
  photoAlt,
  categoryLabel,
  ageCategory,
  city,
}: PhotoLightboxModalProps) {
  // Close on Escape key press
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;

    // Prevent background scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !photoUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Full screen photo of ${displayName}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      {/* Top Floating Control Bar */}
      <div
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close full size photo"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center text-xl font-bold backdrop-blur-md transition-all cursor-pointer border border-white/20 shadow-lg"
        >
          ✕
        </button>
      </div>

      {/* Main Container - stops backdrop click propagation */}
      <div
        className="relative max-w-5xl max-h-[92vh] w-full flex flex-col items-center justify-center select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Crisp High-Resolution Photo Container */}
        <div className="relative w-full max-h-[80vh] flex items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl">
          <div className="relative w-full aspect-[4/5] sm:aspect-square max-h-[78vh] max-w-[800px]">
            <Image
              src={photoUrl}
              alt={photoAlt || `Full high resolution photo of ${displayName}`}
              fill
              quality={95}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Bottom Metadata & Info Bar */}
        <div className="w-full max-w-[800px] mt-3.5 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between text-white shadow-md">
          <div className="min-w-0 pr-3">
            <h3 className="font-bold text-sm sm:text-base text-white truncate">
              {displayName}
            </h3>
            <p className="text-xs text-white/75 truncate">
              {[categoryLabel || ageCategory, city].filter(Boolean).join(" • ") || "A2ZUK Contestant"}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-[#D4E865] font-semibold bg-[#234E3D]/80 px-2.5 py-1 rounded-full border border-[#D4E865]/30">
              High Definition
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
