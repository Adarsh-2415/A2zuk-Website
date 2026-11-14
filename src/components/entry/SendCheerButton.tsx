"use client";

import { useState } from "react";
import Link from "next/link";

interface SendCheerButtonProps {
  displayName: string;
  contestSlug: string;
  className?: string;
}

export default function SendCheerButton({
  displayName,
  contestSlug,
  className = "",
}: SendCheerButtonProps) {
  const [cheered, setCheered] = useState(false);
  const [cheerCount, setCheerCount] = useState(0);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; left: number }[]>([]);

  const handleCheer = () => {
    setCheered(true);
    setCheerCount((prev) => prev + 1);

    // Create a new floating heart with randomized trajectory
    const newId = Date.now() + Math.random();
    const randomLeft = Math.floor(Math.random() * 40) + 30; // 30% to 70%
    setFloatingHearts((prev) => [...prev.slice(-4), { id: newId, left: randomLeft }]);

    // Remove floating heart after 1200ms
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newId));
    }, 1200);
  };

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      {/* Inline Keyframes for Floating Hearts */}
      <style>{`
        @keyframes floatCheerHeart {
          0% {
            opacity: 1;
            transform: translateY(0) scale(0.8) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: translateY(-30px) scale(1.2) rotate(-8deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-60px) scale(1) rotate(12deg);
          }
        }
        .animate-cheer-heart {
          animation: floatCheerHeart 1.1s cubic-bezier(0.2, 0.8, 0.4, 1) forwards;
        }
      `}</style>

      {/* Cheer Button Row */}
      <div className="relative inline-flex items-center w-full">
        <button
          type="button"
          onClick={handleCheer}
          aria-label={`Send cheer for ${displayName}`}
          className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer active:scale-95 shadow-xs ${
            cheered
              ? "bg-[#F8D7C8]/50 text-[#1B382B] border-2 border-[#F2653B]/50 hover:bg-[#F8D7C8]"
              : "bg-gradient-to-r from-[#FAF8F5] to-white text-[#1B382B] border border-[#E0DCCE] hover:border-[#F2653B]/60 hover:bg-white hover:-translate-y-0.5"
          }`}
        >
          <span className="text-base select-none transition-transform duration-200 group-hover:scale-125">
            ❤️
          </span>
          <span>
            {cheerCount === 0
              ? `Send a cheer for ${displayName}`
              : `Cheered for ${displayName}! (${cheerCount})`}
          </span>
        </button>

        {/* Floating Heart Particles */}
        <div className="absolute inset-x-0 bottom-full pointer-events-none overflow-visible h-14" aria-hidden="true">
          {floatingHearts.map((heart) => (
            <span
              key={heart.id}
              className="absolute bottom-0 text-xl animate-cheer-heart select-none"
              style={{ left: `${heart.left}%` }}
            >
              💖
            </span>
          ))}
        </div>
      </div>

      {/* Post-Cheer Voter-to-Contestant Bridge Hook */}
      {cheered && (
        <div className="p-3 rounded-2xl bg-[#D4E865]/20 border border-[#D4E865]/60 flex items-center justify-between gap-2.5 animate-hero-badge">
          <p className="text-xs text-[#1B382B] font-semibold">
            ✨ Have a little star at home too?
          </p>
          <Link
            href={`/contests/${contestSlug}/submit`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1B382B] hover:text-[#234E3D] hover:underline shrink-0"
          >
            <span>Enter contest</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
