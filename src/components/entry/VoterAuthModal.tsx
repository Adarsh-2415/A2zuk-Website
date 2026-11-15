"use client";

import { useEffect, useRef } from "react";
import { GoogleSignInButton } from "../auth/GoogleSignInButton";

interface VoterAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  contestantName: string;
  redirectTo: string;
}

export function VoterAuthModal({
  isOpen,
  onClose,
  contestantName,
  redirectTo,
}: VoterAuthModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="voter-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-[#EFECE4] shadow-2xl space-y-6 animate-scale-in text-center relative"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF8F5] text-[#5A6D61] hover:text-[#1B382B] hover:bg-[#EFECE4]/60 flex items-center justify-center text-sm font-bold transition-colors"
        >
          ✕
        </button>

        {/* Heart/Vote Icon */}
        <div className="w-14 h-14 mx-auto rounded-full bg-[#D4E865]/40 border border-[#D4E865] flex items-center justify-center text-2xl shadow-xs">
          🌟
        </div>

        <div>
          <h2 id="voter-modal-title" className="text-xl sm:text-2xl font-bold text-[#1B382B] tracking-tight">
            Cast Your Official Vote for {contestantName}
          </h2>
          <p className="text-xs sm:text-sm text-[#5A6D61] mt-2 leading-relaxed">
            Quick 1-click Google verification ensures free, fair election voting. No passwords or lengthy registration needed.
          </p>
        </div>

        {/* 1-Click Google Button */}
        <div className="pt-2 flex flex-col items-center">
          <GoogleSignInButton
            redirectTo={redirectTo}
            label="Verify with Google to Cast Vote"
            className="w-full shadow-sm"
          />
        </div>

        <div className="pt-2 border-t border-[#EFECE4]">
          <p className="text-[11px] text-[#5A6D61] leading-relaxed">
            🔒 <strong>Election Voting Rule:</strong> Each verified Google account receives <strong>1 official vote for the entire contest</strong>. Once submitted, your ballot is sealed and permanent.
          </p>
        </div>
      </div>
    </div>
  );
}

