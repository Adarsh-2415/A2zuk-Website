"use client";

import { useState, useEffect, useSyncExternalStore } from "react";

interface CheckingSequenceProps {
  onComplete: () => void;
  babyName?: string;
}

const CHECKING_STEPS = [
  {
    id: 1,
    title: "Checking your form details…",
    subtitle: "Validating parent contact & baby age category",
  },
  {
    id: 2,
    title: "Checking photo requirements…",
    subtitle: "Verifying file format, resolution, and < 1 MB limit",
  },
  {
    id: 3,
    title: "Preparing your Littlejoy preview…",
    subtitle: "Formatting entry preview for submission review",
  },
];

const subscribeReducedMotion = (callback: () => void) => {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
};

const getReducedMotionSnapshot = () => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const getReducedMotionServerSnapshot = () => false;

export function CheckingSequence({ onComplete, babyName }: CheckingSequenceProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(15);

  // Check prefers-reduced-motion safely via useSyncExternalStore
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  // Sequence timer lifecycle (~2.4s total, 800ms per step)
  useEffect(() => {
    if (reducedMotion) {
      // Immediate transition when reduced-motion is requested
      const t = setTimeout(() => {
        setProgress(100);
        setCurrentStep(2);
        onComplete();
      }, 350);
      return () => clearTimeout(t);
    }

    // Step 1: 0ms -> 800ms (progress 15% -> 45%)
    const t1 = setTimeout(() => {
      setCurrentStep(1);
      setProgress(50);
    }, 800);

    // Step 2: 800ms -> 1600ms (progress 50% -> 85%)
    const t2 = setTimeout(() => {
      setCurrentStep(2);
      setProgress(90);
    }, 1600);

    // Step 3: 1600ms -> 2400ms (progress 90% -> 100%, then complete)
    const t3 = setTimeout(() => {
      setProgress(100);
    }, 2100);

    const t4 = setTimeout(() => {
      onComplete();
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [reducedMotion, onComplete]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full rounded-[28px] sm:rounded-[36px] bg-white border border-[#EFECE4] p-6 sm:p-12 shadow-xs max-w-xl mx-auto text-center relative overflow-hidden transition-all duration-300"
    >
      {/* Decorative Brand Sparkles (Subtle floating icons) */}
      <div className="absolute top-6 left-8 text-[#D4E865] opacity-75 pointer-events-none select-none animate-pulse" aria-hidden="true">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>

      <div className="absolute top-10 right-10 text-[#F2653B]/50 pointer-events-none select-none" aria-hidden="true">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>

      <div className="absolute bottom-8 left-12 text-[#F8D5C4] pointer-events-none select-none" aria-hidden="true">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="6" />
        </svg>
      </div>

      <div className="absolute bottom-10 right-12 text-[#234E3D]/30 pointer-events-none select-none" aria-hidden="true">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>

      {/* Main Central Icon: Playful Pulsing Badge */}
      <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-[#FAF8F5] border-2 border-[#EFECE4] flex items-center justify-center relative shadow-xs">
        <div className="absolute inset-0 rounded-3xl bg-[#D4E865]/20 animate-ping opacity-60" style={{ animationDuration: "2.5s" }} />
        
        {/* Animated Littlejoy Star / Lens Icon */}
        <div className="w-12 h-12 rounded-2xl bg-[#234E3D] text-[#D4E865] flex items-center justify-center shadow-xs">
          <svg className="w-6 h-6 animate-spin" style={{ animationDuration: "4s" }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      </div>

      {/* Primary Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold text-[#1B382B] tracking-tight">
        {babyName ? `Reviewing ${babyName}’s entry` : "Reviewing your entry"}
      </h2>

      {/* Subtitle with Honest Prototype Notice */}
      <p className="text-xs sm:text-sm text-[#5A6D61] mt-1.5 max-w-sm mx-auto">
        Simulated preview verification in progress. Preparing your Littlejoy contest entry.
      </p>

      {/* Progress Bar Container */}
      <div className="mt-8 mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-[#1B382B] mb-2 px-1">
          <span className="text-[#5A6D61]">Verification progress</span>
          <span className="font-bold text-[#234E3D]">{progress}%</span>
        </div>

        <div className="w-full h-2 rounded-full bg-[#FAF8F5] border border-[#EFECE4] overflow-hidden p-0.5">
          <div
            className="h-full bg-[#234E3D] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Sequential Status Steps */}
      <div className="space-y-3 max-w-md mx-auto text-left">
        {CHECKING_STEPS.map((step, idx) => {
          const isDone = currentStep > idx;
          const isActive = currentStep === idx;

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center gap-3.5 ${
                isActive
                  ? "bg-[#FAF8F5] border-[#234E3D] shadow-xs"
                  : isDone
                  ? "bg-white border-[#EFECE4]"
                  : "bg-white/50 border-transparent opacity-40"
              }`}
            >
              {/* Step Status Icon */}
              <div className="shrink-0">
                {isDone ? (
                  <div className="w-7 h-7 rounded-full bg-[#234E3D] text-[#D4E865] flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : isActive ? (
                  <div className="w-7 h-7 rounded-full border-2 border-[#234E3D] border-t-transparent animate-spin flex items-center justify-center" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#FAF8F5] border border-[#EFECE4] flex items-center justify-center text-xs font-semibold text-[#5A6D61]">
                    {step.id}
                  </div>
                )}
              </div>

              {/* Step Text */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs sm:text-sm font-semibold truncate ${
                    isActive ? "text-[#1B382B]" : isDone ? "text-[#234E3D]" : "text-[#5A6D61]"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[11px] text-[#5A6D61] truncate mt-0.5">
                  {step.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prototype Transparency Notice */}
      <div className="mt-8 pt-4 border-t border-[#F5F2EA]">
        <p className="text-[11px] text-[#5A6D61]/80 max-w-xs mx-auto leading-relaxed">
          Simulated visual sequence for demonstration purposes. Contest backend, photo storage, and moderation are in development.
        </p>
      </div>
    </div>
  );
}
