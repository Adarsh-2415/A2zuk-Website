"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { UserProfilePayload } from "@/lib/queries/profile";

interface ProfileDashboardProps {
  initialData: UserProfilePayload;
}

function formatAgeCategory(category: string): string {
  switch (category) {
    case "under-6-months":
      return "Under 6 Months";
    case "under-12-months":
      return "Under 12 Months";
    case "up-to-24-months":
      return "Up to 24 Months";
    default:
      return category;
  }
}

export default function ProfileDashboard({ initialData }: ProfileDashboardProps) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const { user, privateDetails, entries } = initialData;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* 1. Profile Header Card */}
      <section className="w-full rounded-[28px] sm:rounded-[36px] bg-white border border-[#EFECE4] p-6 sm:p-10 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Avatar or Initials */}
          {user.avatarUrl && !avatarError ? (
            <img
              src={user.avatarUrl}
              alt=""
              onError={() => setAvatarError(true)}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#EFECE4] object-cover shadow-2xs"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#234E3D] text-white flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-2xs select-none">
              {(user.name || "P").charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B382B] tracking-tight">
              {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6D61] mt-0.5">
              {user.email}
            </p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          type="button"
          disabled={isSigningOut}
          onClick={handleSignOut}
          className="self-start sm:self-auto px-4 py-2 rounded-full text-xs font-semibold text-[#5A6D61] hover:text-[#1B382B] bg-[#FAF8F5] border border-[#EFECE4] hover:bg-[#EFECE4]/60 transition-colors cursor-pointer"
        >
          {isSigningOut ? "Signing Out…" : "Sign Out"}
        </button>
      </section>

      {/* 2. Registered Communication & Delivery Address (if submitted) */}
      {privateDetails && (privateDetails.addressStreet || privateDetails.phone) && (
        <section className="w-full rounded-2xl sm:rounded-3xl bg-[#FAF8F5] border border-[#EFECE4] p-5 sm:p-7 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">📍</span>
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1B382B]">
              Registered Delivery &amp; Contact Details
            </h2>
            <span className="text-[10px] text-[#5A6D61] bg-white px-2 py-0.5 rounded-full border border-[#EFECE4]">
              Private to You
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#4A5D52] pt-1">
            {privateDetails.phone && (
              <div>
                <span className="font-semibold text-[#1B382B] block">Contact Phone:</span>
                <span>{privateDetails.phone}</span>
              </div>
            )}
            {privateDetails.addressStreet && (
              <div>
                <span className="font-semibold text-[#1B382B] block">Address:</span>
                <span>
                  {privateDetails.addressStreet}
                  {privateDetails.city && `, ${privateDetails.city}`}
                  {privateDetails.state && `, ${privateDetails.state}`}
                  {privateDetails.pincode && ` - ${privateDetails.pincode}`}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. Contest Entries Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#EFECE4]">
          <h2 className="text-lg sm:text-xl font-bold text-[#1B382B] tracking-tight">
            Contest Submissions
          </h2>
          <span className="text-xs font-semibold text-[#5A6D61]">
            {entries.length === 1 ? "1 Entry" : `${entries.length} Entries`}
          </span>
        </div>

        {/* Zero State: No entries yet */}
        {entries.length === 0 ? (
          <div className="w-full rounded-[28px] bg-white border border-[#EFECE4] p-8 sm:p-12 text-center shadow-xs space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF8F5] border border-[#EFECE4] flex items-center justify-center text-3xl shadow-2xs">
              🌟
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1B382B]">
                No contest entries submitted yet
              </h3>
              <p className="text-xs sm:text-sm text-[#5A6D61] mt-1 max-w-md mx-auto leading-relaxed">
                You have not registered an entry for Baby Photo Contest Season 1 yet. Registration is 100% free and takes less than a minute!
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/contests/baby-photo-contest-1/submit"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-[#234E3D] hover:bg-[#1A3B2E] text-white transition-all shadow-sm"
              >
                <span>Participate in Contest</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ) : (
          /* List of entries */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-3xl bg-white border border-[#EFECE4] p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#FAF8F5] border border-[#EFECE4] overflow-hidden shrink-0">
                    {entry.photoUrl ? (
                      <img
                        src={entry.photoUrl}
                        alt={entry.babyName}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl text-[#5A6D61]">
                        👶
                      </div>
                    )}
                  </div>

                  {/* Baby Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {entry.status === "pending" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                          In Review
                        </span>
                      ) : entry.status === "published" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#234E3D]/10 text-[#234E3D]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#234E3D]" />
                          Live on Leaderboard
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 capitalize">
                          {entry.status}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#1B382B] truncate">
                      {entry.babyName}
                    </h3>
                    <p className="text-xs text-[#5A6D61] mt-0.5">
                      {formatAgeCategory(entry.ageCategory)}
                    </p>
                    {entry.city && (
                      <p className="text-[11px] text-[#5A6D61] mt-0.5">
                        📍 {entry.city}{entry.state ? `, ${entry.state}` : ""}
                      </p>
                    )}
                  </div>
                </div>

                {/* Vote Counter Pill & Actions */}
                <div className="pt-3 border-t border-[#F5F2EA] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#5A6D61]">Votes:</span>
                    <span className="text-xs font-bold text-[#1B382B] bg-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#EFECE4]">
                      {entry.voteCount}
                    </span>
                  </div>

                  <Link
                    href={`/contests/${entry.contestSlug}/entries/${entry.publicCode}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#234E3D] hover:underline"
                  >
                    <span>View Page</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

