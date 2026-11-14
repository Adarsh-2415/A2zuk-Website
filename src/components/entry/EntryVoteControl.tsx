"use client";

import { useEffect, useState } from "react";
import ShareEntryButton from "./ShareEntryButton";
import { VoterAuthModal } from "./VoterAuthModal";

interface EntryVoteControlProps {
  contestSlug: string;
  entryCode: string;
  displayName: string;
  initialVoteCount: number;
  isVotingOpen: boolean;
}

export default function EntryVoteControl({
  contestSlug,
  entryCode,
  displayName,
  initialVoteCount,
  isVotingOpen,
}: EntryVoteControlProps) {
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [votesRemainingToday, setVotesRemainingToday] = useState<number>(5);
  const [hasVotedForEntry, setHasVotedForEntry] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(isVotingOpen);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const currentPath =
    typeof window !== "undefined"
      ? window.location.pathname
      : `/contests/${contestSlug}/entries/${entryCode}`;

  useEffect(() => {
    if (!isVotingOpen) return;

    let cancelled = false;
    async function loadStatus() {
      try {
        const res = await fetch(
          `/api/votes/status?contestSlug=${encodeURIComponent(contestSlug)}&entryCode=${encodeURIComponent(entryCode)}`,
          { cache: "no-store" },
        );
        if (!res.ok) return;
        const data = (await res.json()) as {
          ok?: boolean;
          isAuthenticated?: boolean;
          votesRemainingToday?: number;
          hasVotedForEntry?: boolean;
        };
        if (!cancelled && data.ok) {
          if (typeof data.isAuthenticated === "boolean") {
            setIsAuthenticated(data.isAuthenticated);
          }
          if (typeof data.votesRemainingToday === "number") {
            setVotesRemainingToday(data.votesRemainingToday);
          }
          if (typeof data.hasVotedForEntry === "boolean") {
            setHasVotedForEntry(data.hasVotedForEntry);
          }
        }
      } catch {
        // Ignore transient status fetch failure; POST /api/votes enforces rules authoritatively.
      } finally {
        if (!cancelled) {
          setIsLoadingStatus(false);
        }
      }
    }

    loadStatus();
    return () => {
      cancelled = true;
    };
  }, [contestSlug, entryCode, isVotingOpen]);

  async function handleVote() {
    if (!isVotingOpen || isSubmitting || hasVotedForEntry || votesRemainingToday <= 0) {
      return;
    }

    // If voter is not logged in with Google, prompt 1-click verification immediately
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contestSlug, entryCode }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        requiresAuth?: boolean;
        error?: string;
        newVoteCount?: number;
        votesRemainingToday?: number;
        voteStatus?: "valid" | "quarantined";
      };

      if (!res.ok || !data.ok) {
        if (data.requiresAuth || res.status === 401) {
          setIsAuthenticated(false);
          setIsAuthModalOpen(true);
          return;
        }

        if (res.status === 409) {
          setHasVotedForEntry(true);
        } else if (res.status === 429) {
          setVotesRemainingToday(0);
        }
        setFeedback({
          type: "error",
          message: data.error || "Unable to record your vote right now.",
        });
        return;
      }

      if (typeof data.newVoteCount === "number") {
        setVoteCount(data.newVoteCount);
      }
      if (typeof data.votesRemainingToday === "number") {
        setVotesRemainingToday(data.votesRemainingToday);
      }
      setHasVotedForEntry(true);
      setFeedback({
        type: "success",
        message:
          data.voteStatus === "quarantined"
            ? "Thank you! Your vote has been received for verification."
            : `Thank you for voting for ${displayName}!`,
      });
    } catch {
      setFeedback({
        type: "error",
        message: "Network error while casting vote. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const isDisabled =
    !isVotingOpen ||
    isSubmitting ||
    hasVotedForEntry ||
    votesRemainingToday <= 0;

  let buttonLabel = `Vote for ${displayName}`;
  if (!isVotingOpen) {
    buttonLabel = "Voting Closed";
  } else if (isSubmitting) {
    buttonLabel = "Recording Vote…";
  } else if (hasVotedForEntry) {
    buttonLabel = "Voted Today ✓";
  } else if (votesRemainingToday <= 0) {
    buttonLabel = "Daily Limit Reached (5/5)";
  }

  return (
    <>
      {/* Live Public Vote Count */}
      <div className="animate-hero-desc w-full max-w-md p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFECE4] flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${isVotingOpen ? "bg-[#234E3D]" : "bg-[#5A6D61]/40"}`}
            aria-hidden="true"
          />
          <span className="text-xs sm:text-sm font-semibold text-[#1B382B]">
            Public Vote Count
          </span>
        </div>
        <span className="text-xs sm:text-sm font-bold text-[#1B382B] bg-white px-3 py-1 rounded-full border border-[#EFECE4]">
          {voteCount === 1 ? "1 vote" : `${voteCount} votes`}
        </span>
      </div>

      {/* Primary Vote & Share Action Controls */}
      <div className="w-full flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            disabled={isDisabled}
            aria-disabled={isDisabled}
            onClick={handleVote}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm sm:text-base font-bold transition-all duration-200 select-none ${
              isDisabled
                ? "bg-[#234E3D]/50 text-white/90 cursor-not-allowed shadow-none"
                : "bg-[#234E3D] hover:bg-[#1A3B2E] text-white hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-sm hover:shadow-md cursor-pointer"
            }`}
          >
            <span>{buttonLabel}</span>
          </button>

          <ShareEntryButton title={displayName} />
        </div>

        {/* Remaining daily votes or status feedback */}
        {feedback ? (
          <p
            role={feedback.type === "error" ? "alert" : "status"}
            className={`text-xs font-semibold ${
              feedback.type === "error" ? "text-red-600" : "text-[#234E3D]"
            }`}
          >
            {feedback.message}
          </p>
        ) : (
          <p className="text-xs font-semibold text-[#5A6D61]">
            {!isVotingOpen
              ? "Voting is only open while the contest is active."
              : isLoadingStatus
                ? "Checking your daily vote allowance…"
                : `${votesRemainingToday} of 5 votes remaining today (resets midnight IST).`}
          </p>
        )}
      </div>

      <VoterAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        contestantName={displayName}
        redirectTo={currentPath}
      />
    </>
  );
}

