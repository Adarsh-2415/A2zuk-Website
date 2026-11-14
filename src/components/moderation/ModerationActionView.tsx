"use client";

import { useState } from "react";
import Link from "next/link";

interface ModerationActionViewProps {
  token: string;
  action: "approve" | "reject";
  babyName: string;
  ageCategory: string;
  city?: string;
  currentStatus: string;
  photoUrl?: string;
  contestTitle: string;
  contestSlug: string;
  publicCode: string;
}

export default function ModerationActionView({
  token,
  action,
  babyName,
  ageCategory,
  city,
  currentStatus,
  photoUrl,
  contestTitle,
  contestSlug,
  publicCode,
}: ModerationActionViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    publicUrl?: string;
  } | null>(null);

  const isAlreadyProcessed = currentStatus !== "pending";

  const handleConfirm = async () => {
    if (isSubmitting || isAlreadyProcessed) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        message?: string;
        publicUrl?: string;
      };

      if (!res.ok || !data.ok) {
        setResult({
          success: false,
          message: data.error || "Failed to process moderation action.",
        });
        return;
      }

      setResult({
        success: true,
        message: data.message || "Entry updated successfully!",
        publicUrl: data.publicUrl,
      });
    } catch {
      setResult({
        success: false,
        message: "Network error. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl bg-white border border-[#EFECE4] p-6 sm:p-10 shadow-lg text-center space-y-6">
      {/* Status icon & title */}
      <div>
        <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF8F5] border border-[#EFECE4] flex items-center justify-center text-2xl shadow-xs mb-3">
          {action === "approve" ? "✨" : "⚠️"}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1B382B] tracking-tight">
          {action === "approve" ? "Approve Contest Entry" : "Reject Contest Entry"}
        </h1>
        <p className="text-xs sm:text-sm text-[#5A6D61] mt-1">
          {contestTitle}
        </p>
      </div>

      {/* Photo Preview */}
      {photoUrl && (
        <div className="w-full max-w-sm mx-auto overflow-hidden rounded-2xl border border-[#EFECE4] bg-[#FAF8F5]">
          <img
            src={photoUrl}
            alt={babyName}
            className="w-full h-64 object-cover object-center"
          />
        </div>
      )}

      {/* Baby Details Card */}
      <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFECE4] text-xs sm:text-sm text-left space-y-2">
        <div className="flex justify-between border-b border-[#EFECE4] pb-2">
          <span className="text-[#5A6D61]">Baby Name:</span>
          <span className="font-bold text-[#1B382B]">{babyName}</span>
        </div>
        <div className="flex justify-between border-b border-[#EFECE4] pb-2">
          <span className="text-[#5A6D61]">Age Category:</span>
          <span className="font-bold text-[#1B382B]">{ageCategory}</span>
        </div>
        {city && (
          <div className="flex justify-between border-b border-[#EFECE4] pb-2">
            <span className="text-[#5A6D61]">City:</span>
            <span className="font-bold text-[#1B382B]">{city}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-[#5A6D61]">Current Status:</span>
          <span
            className={`font-bold capitalize ${currentStatus === "published"
                ? "text-[#234E3D]"
                : currentStatus === "rejected"
                  ? "text-red-600"
                  : "text-[#D97706]"
              }`}
          >
            {currentStatus}
          </span>
        </div>
      </div>

      {/* Result feedback */}
      {result && (
        <div
          role="alert"
          className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold ${result.success
              ? "bg-[#234E3D]/10 text-[#234E3D] border border-[#234E3D]/20"
              : "bg-red-50 text-red-700 border border-red-200"
            }`}
        >
          {result.message}
        </div>
      )}

      {/* Action Buttons */}
      {!result?.success && !isAlreadyProcessed && (
        <div className="pt-2 flex flex-col gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirm}
            className={`w-full py-3.5 px-6 rounded-full text-sm font-bold text-white transition-all shadow-sm ${action === "approve"
                ? "bg-[#234E3D] hover:bg-[#1A3B2E] active:scale-95"
                : "bg-red-600 hover:bg-red-700 active:scale-95"
              } ${isSubmitting ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {isSubmitting
              ? "Processing…"
              : action === "approve"
                ? "✅ Confirm & Publish to Live Leaderboard"
                : "❌ Confirm Rejection"}
          </button>
        </div>
      )}

      {/* When already processed or approved */}
      {(result?.success || isAlreadyProcessed) && (
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/contests/${contestSlug}/entries/${publicCode}`}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-[#234E3D] text-white hover:bg-[#1A3B2E] transition-all shadow-xs"
          >
            View Live Entry Page →
          </Link>
          <Link
            href={`/contests/${contestSlug}`}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-white border border-[#EFECE4] text-[#1B382B] hover:bg-[#FAF8F5] transition-all"
          >
            Contest Leaderboard
          </Link>
        </div>
      )}

      <div className="pt-3 border-t border-[#F5F2EA] text-[11px] text-[#5A6D61]">
        🛡️ Protected with HMAC-SHA256 single-use verification &amp; crawler defense.
      </div>
    </div>
  );
}

