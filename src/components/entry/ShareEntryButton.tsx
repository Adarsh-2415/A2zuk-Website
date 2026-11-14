"use client";

import { useState, useRef, useEffect } from "react";

interface ShareEntryButtonProps {
  title: string;
  className?: string;
}

export default function ShareEntryButton({
  title,
  className = "",
}: ShareEntryButtonProps) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const triggerResetTimer = () => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = setTimeout(() => {
      setCopied(false);
      setCopyFailed(false);
    }, 2500);
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    const currentUrl = window.location.href;
    const shareData = {
      title: `${title} | Littlejoy Baby Photo Contest`,
      text: `Support ${title} in the Littlejoy Baby Photo Contest!`,
      url: currentUrl,
    };

    // 1. Try native Web Share API if supported
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return; // Native share dialog was presented and completed
      } catch (err: unknown) {
        // If user cancelled / dismissed the native share sheet, do nothing
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        // Otherwise fall through to clipboard copy
      }
    }

    // 2. Clipboard copy fallback
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      try {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setCopyFailed(false);
        triggerResetTimer();
        return;
      } catch {
        // Clipboard write denied or failed
      }
    }

    // 3. Fallback for environments where clipboard API is unavailable or denied
    try {
      const textArea = document.createElement("textarea");
      textArea.value = currentUrl;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (success) {
        setCopied(true);
        setCopyFailed(false);
        triggerResetTimer();
        return;
      }
    } catch {
      // execCommand failed
    }

    // If all copy methods failed, notify gracefully without fake success
    setCopyFailed(true);
    setCopied(false);
    triggerResetTimer();
  };

  return (
    <div className="relative inline-flex items-center">
      <style>{`
        @keyframes sharePop {
          0% { transform: scale(0.95); }
          50% { transform: scale(1.04); }
          100% { transform: scale(1); }
        }
        .animate-share-pop {
          animation: sharePop 0.25s cubic-bezier(0.2, 0.8, 0.4, 1.2);
        }
      `}</style>
      <button
        type="button"
        onClick={handleShare}
        aria-label={copied ? "Link copied to clipboard" : `Share entry for ${title}`}
        className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm sm:text-base font-bold transition-all duration-200 border cursor-pointer active:scale-95 shadow-xs ${
          copied
            ? "bg-[#234E3D] text-white border-[#234E3D] animate-share-pop"
            : copyFailed
            ? "bg-[#FAF8F5] text-[#F2653B] border-[#F2653B]/40"
            : "bg-[#FAF8F5] text-[#1B382B] border-[#E0DCCE] hover:border-[#234E3D] hover:bg-white hover:-translate-y-0.5"
        } ${className}`}
      >
        {copied ? (
          <>
            <svg
              className="w-4 h-4 text-[#D4E865]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Link Copied!</span>
          </>
        ) : copyFailed ? (
          <>
            <svg
              className="w-4 h-4 text-[#F2653B]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>Copy Unavailable</span>
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 text-[#234E3D]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            <span>Share Entry</span>
          </>
        )}
      </button>

      {/* Screen reader live announcement */}
      <span className="sr-only" aria-live="polite">
        {copied
          ? "Contestant link copied to clipboard"
          : copyFailed
          ? "Could not copy link automatically"
          : ""}
      </span>
    </div>
  );
}
