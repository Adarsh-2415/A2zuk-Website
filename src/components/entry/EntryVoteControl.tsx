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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasVotedInContest, setHasVotedInContest] = useState(false);
  const [hasVotedForThisEntry, setHasVotedForThisEntry] = useState(false);
  const [votedForBabyName, setVotedForBabyName] = useState<string | null>(null);
  const [isParentOwner, setIsParentOwner] = useState(false);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
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
    async function loadElectionStatus() {
      try {
        const res = await fetch(
          `/api/votes/status?contestSlug=${encodeURIComponent(
            contestSlug,
          )}&entryCode=${encodeURIComponent(entryCode)}`,
          { cache: "no-store" },
        );
        if (!res.ok) return;
        const data = (await res.json()) as {
          ok?: boolean;
          isAuthenticated?: boolean;
          hasVotedInContest?: boolean;
          hasVotedForThisEntry?: boolean;
          votedForBabyName?: string | null;
          isParentOwner?: boolean;
        };
        if (!cancelled && data.ok) {
          if (typeof data.isAuthenticated === "boolean") {
            setIsAuthenticated(data.isAuthenticated);
          }
          if (typeof data.hasVotedInContest === "boolean") {
            setHasVotedInContest(data.hasVotedInContest);
          }
          if (typeof data.hasVotedForThisEntry === "boolean") {
            setHasVotedForThisEntry(data.hasVotedForThisEntry);
          }
          if (data.votedForBabyName) {
            setVotedForBabyName(data.votedForBabyName);
          }
          if (typeof data.isParentOwner === "boolean") {
            setIsParentOwner(data.isParentOwner);
          }
        }
      } catch {
        // Fallback: POST /api/votes authoritatively enforces rules
      } finally {
        if (!cancelled) {
          setIsLoadingStatus(false);
        }
      }
    }

    loadElectionStatus();
    return () => {
      cancelled = true;
    };
  }, [contestSlug, entryCode, isVotingOpen]);

  function handleInitiateVote() {
    if (!isVotingOpen || isSubmitting || hasVotedInContest || isParentOwner) {
      return;
    }

    // Step 1: Require Google authentication
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    // Step 2: Show Election Confirmation modal before permanently sealing ballot
    setIsConfirmModalOpen(true);
  }

  async function handleConfirmCastVote() {
    setIsConfirmModalOpen(false);
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
      };

      if (!res.ok || !data.ok) {
        if (data.requiresAuth || res.status === 401) {
          setIsAuthenticated(false);
          setIsAuthModalOpen(true);
          return;
        }

        if (res.status === 409) {
          setHasVotedInContest(true);
          setHasVotedForThisEntry(true);
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
      setHasVotedInContest(true);
      setHasVotedForThisEntry(true);
      setVotedForBabyName(displayName);
      setFeedback({
        type: "success",
        message: `Your 1 official vote has been cast and recorded for ${displayName}!`,
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
    hasVotedInContest ||
    isParentOwner;

  let buttonLabel = `Cast Vote for ${displayName}`;
  if (!isVotingOpen) {
    buttonLabel = "Voting Closed";
  } else if (isSubmitting) {
    buttonLabel = "Sealing Ballot…";
  } else if (hasVotedForThisEntry) {
    buttonLabel = "Ballot Cast for " + displayName + " ✓";
  } else if (hasVotedInContest) {
    buttonLabel = votedForBabyName
      ? `Voted for ${votedForBabyName}`
      : "Ballot Already Cast";
  } else if (isParentOwner) {
    buttonLabel = "Parent View (Cannot Self-Vote)";
  }

  return (
    <>
      {/* Live Public Vote Count */}
      <div className="animate-hero-desc w-full max-w-md p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFECE4] flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isVotingOpen ? "bg-[#234E3D]" : "bg-[#5A6D61]/40"
            }`}
            aria-hidden="true"
          />
          <span className="text-xs sm:text-sm font-semibold text-[#1B382B]">
            Verified Vote Tally
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
            onClick={handleInitiateVote}
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

        {/* Status feedback & Election helper microcopy */}
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
          <p className="text-xs font-medium text-[#5A6D61] leading-relaxed">
            {!isVotingOpen ? (
              "Voting is only open while the contest is active."
            ) : isLoadingStatus ? (
              "Checking election ballot status…"
            ) : isParentOwner ? (
              "🔒 Parents cannot vote for their own child. Share this entry to gather votes from family and friends!"
            ) : hasVotedForThisEntry ? (
              "✅ Your official ballot is sealed for this contestant."
            ) : hasVotedInContest ? (
              `🔒 You have already cast your 1 official vote in this contest${
                votedForBabyName ? ` for ${votedForBabyName}` : ""
              }. Ballots cannot be changed.`
            ) : (
              "🗳️ Election Rule: 1 official vote per verified Google account for the entire contest."
            )}
          </p>
        )}
      </div>

      {/* Google Authentication Modal for Visitors */}
      <VoterAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        contestantName={displayName}
        redirectTo={currentPath}
      />

      {/* Election Ballot Confirmation Modal */}
      {isConfirmModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-vote-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in"
        >
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-[#EFECE4] shadow-2xl space-y-5 animate-scale-in text-center relative">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#234E3D]/10 text-[#234E3D] flex items-center justify-center text-2xl font-bold">
              🗳️
            </div>

            <div>
              <h2
                id="confirm-vote-title"
                className="text-xl sm:text-2xl font-bold text-[#1B382B] tracking-tight"
              >
                Confirm Your 1 Official Vote
              </h2>
              <p className="text-xs sm:text-sm text-[#4A5D52] mt-2 leading-relaxed">
                You are casting your official vote for <strong>{displayName}</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EFECE4] text-xs text-[#5A6D61] text-left space-y-1.5">
              <p className="font-bold text-[#1B382B]">
                ⚖️ Official Election Rule:
              </p>
              <p>
                Each verified Google account gets <strong>exactly 1 vote per contest</strong>. Once cast, your ballot is permanently sealed and cannot be changed or transferred to another child.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={handleConfirmCastVote}
                className="w-full sm:flex-1 py-3 px-5 rounded-full text-xs sm:text-sm font-bold text-white bg-[#234E3D] hover:bg-[#1A3B2E] transition-all shadow-sm cursor-pointer"
              >
                Yes, Seal My Vote
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="w-full sm:w-auto py-3 px-5 rounded-full text-xs font-semibold text-[#5A6D61] bg-[#FAF8F5] hover:bg-[#EFECE4] border border-[#EFECE4] transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
