"use client";

import { useState } from "react";

interface WhatsAppShareCardProps {
  babyName: string;
  isPending?: boolean;
}

export default function WhatsAppShareCard({
  babyName,
  isPending = false,
}: WhatsAppShareCardProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [instagramToast, setInstagramToast] = useState(false);

  const getShareUrl = () => {
    return typeof window !== "undefined" ? window.location.href : "";
  };

  const getShareText = () => {
    const url = getShareUrl();
    if (isPending) {
      return `🌟 Meet our little one ${babyName} in the A2ZUK Baby Contest! Our photo is currently being reviewed, bookmark this link to vote once live: ${url}`;
    }
    return `🌟 Please support our little one ${babyName} in the A2ZUK Baby Photo Contest! Tap this link to cast your official vote (takes 10 seconds): ${url}`;
  };

  const handleWhatsAppClick = () => {
    const text = encodeURIComponent(getShareText());
    const whatsappUrl = `https://api.whatsapp.com/send?text=${text}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleFacebookClick = () => {
    const url = encodeURIComponent(getShareUrl());
    const quote = encodeURIComponent(getShareText());
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`;
    window.open(fbUrl, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const handleInstagramClick = async () => {
    // Copy the voting link to clipboard first
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback
    }
    setInstagramToast(true);
    setTimeout(() => {
      window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    }, 1200);
    setTimeout(() => setInstagramToast(false), 4000);
  };

  const handleCopyVotingLink = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(false);
    }
  };

  const handleCopyMessage = async () => {
    const text = getShareText();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      setCopiedMessage(false);
    }
  };

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="w-full rounded-2xl sm:rounded-3xl bg-[#FAF8F5] border border-[#EFECE4] p-5 sm:p-6 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center font-bold text-sm shrink-0">
            📢
          </span>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[#1B382B]">
              Share &amp; Gather Votes
            </h4>
            <p className="text-[11px] text-[#5A6D61]">
              Every verified Google account gets 1 official vote in the contest
            </p>
          </div>
        </div>

        {isPending ? (
          <span className="text-[10px] font-bold text-[#92400E] bg-[#FEF3C7] border border-[#FCD34D] px-2.5 py-1 rounded-full flex items-center gap-1">
            <span>🔒</span>
            <span>Under Review</span>
          </span>
        ) : (
          <span className="text-[10px] font-bold text-[#234E3D] bg-[#234E3D]/10 border border-[#234E3D]/20 px-2.5 py-1 rounded-full flex items-center gap-1">
            <span>✓</span>
            <span>Ready to Share</span>
          </span>
        )}
      </div>

      {isPending ? (
        <div className="p-3.5 rounded-xl bg-[#FEF3C7]/40 border border-[#FCD34D]/60 text-xs text-[#92400E] leading-relaxed flex items-start gap-2">
          <span className="shrink-0 mt-0.5">ℹ️</span>
          <span>
            <strong>Sharing Locked During Review:</strong> This entry is currently undergoing moderation. Social sharing and link copying will unlock automatically once our team verifies and approves the entry.
          </span>
        </div>
      ) : (
        <>
          {/* Direct Voting Link Bar with 1-Click Copy */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5A6D61]">
              Baby&apos;s Direct Voting Link
            </label>
            <div className="flex items-center gap-2 bg-white rounded-xl border border-[#EFECE4] p-1.5 pl-3 shadow-2xs">
              <span className="text-xs text-[#1B382B] truncate select-all flex-1 font-mono text-[11px] sm:text-xs">
                {currentUrl || "https://a2zuk.com/contests/..."}
              </span>
              <button
                type="button"
                disabled={isPending}
                onClick={handleCopyVotingLink}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  copiedLink
                    ? "bg-[#234E3D] text-white"
                    : "bg-[#234E3D]/10 text-[#234E3D] hover:bg-[#234E3D]/20"
                }`}
                title="Copy Direct Link"
              >
                {copiedLink ? "Copied! ✓" : "Copy Link"}
              </button>
            </div>
          </div>

          {/* Message Quote Box */}
          <div className="p-3 rounded-xl bg-white border border-[#EFECE4] text-xs text-[#1B382B] leading-relaxed italic relative">
            &ldquo;Please support our little one {babyName} in the A2ZUK Baby Photo Contest! Tap to cast your official vote…&rdquo;
          </div>

          {/* Instagram Toast Feedback */}
          {instagramToast && (
            <div className="p-2.5 rounded-xl bg-[#FDF2F8] border border-[#FBCFE8] text-xs font-semibold text-[#9D174D] flex items-center gap-2 animate-fade-in">
              <span>📸</span>
              <span>Voting link copied! Opening Instagram so you can paste it in your Story or Bio...</span>
            </div>
          )}

          {/* Social Sharing Buttons: WhatsApp, Facebook, Instagram */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            {/* WhatsApp */}
            <button
              type="button"
              disabled={isPending}
              onClick={handleWhatsAppClick}
              className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20BD5A] transition-all shadow-2xs cursor-pointer active:scale-98"
              title="Share on WhatsApp"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>WhatsApp</span>
            </button>

            {/* Facebook */}
            <button
              type="button"
              disabled={isPending}
              onClick={handleFacebookClick}
              className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1877F2] hover:bg-[#166FE5] transition-all shadow-2xs cursor-pointer active:scale-98"
              title="Share on Facebook"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </button>

            {/* Instagram */}
            <button
              type="button"
              disabled={isPending}
              onClick={handleInstagramClick}
              className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] hover:opacity-95 transition-all shadow-2xs cursor-pointer active:scale-98"
              title="Share on Instagram (Copies link & opens Instagram)"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>Instagram</span>
            </button>
          </div>

          {/* Secondary Action: Copy Full Invitation Message */}
          <div className="pt-1">
            <button
              type="button"
              disabled={isPending}
              onClick={handleCopyMessage}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-white border border-[#EFECE4] text-[#1B382B] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            >
              <span>{copiedMessage ? "Invitation Message Copied! ✓" : "Copy Full Invitation Message"}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

