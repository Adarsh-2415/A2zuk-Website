import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { getUserProfileData } from "@/lib/queries/profile";
import ProfileDashboard from "@/components/profile/ProfileDashboard";

export const metadata: Metadata = {
  title: "My Profile | A2ZUK Baby Photo Contest",
  description: "View your verified account details, contest entry status, and live vote counts.",
  robots: { index: false, follow: false },
};

async function ProfilePageContent() {
  await connection();
  const profileData = await getUserProfileData();

  if (!profileData) {
    return (
      <div className="w-full max-w-md mx-auto rounded-[28px] sm:rounded-[36px] bg-white border border-[#EFECE4] p-8 sm:p-12 text-center shadow-xs space-y-6 my-10">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF8F5] border border-[#EFECE4] flex items-center justify-center text-3xl shadow-2xs">
          👤
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1B382B] tracking-tight">
            Parent Profile
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6D61] mt-2 leading-relaxed">
            Please sign in with your Google account to view your registered profile, submission status, and live vote counts.
          </p>
        </div>

        <div className="pt-2 flex flex-col items-center">
          <GoogleSignInButton
            redirectTo="/profile"
            label="Sign in with Google"
            className="w-full shadow-sm"
          />
        </div>

        <div className="pt-4 border-t border-[#F5F2EA] text-[11px] text-[#5A6D61]">
          🔒 Zero passwords required • 100% Secure Google authentication
        </div>
      </div>
    );
  }

  return <ProfileDashboard initialData={profileData} />;
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        <Suspense fallback={<div className="h-[72px]" />}>
          <Header />
        </Suspense>

        <main className="flex-1 py-6 sm:py-10">
          <Suspense
            fallback={
              <div className="w-full max-w-4xl mx-auto space-y-6 animate-pulse">
                <div className="h-28 rounded-3xl bg-white border border-[#EFECE4]" />
                <div className="h-64 rounded-3xl bg-white border border-[#EFECE4]" />
              </div>
            }
          >
            <ProfilePageContent />
          </Suspense>
        </main>

        <Footer />
      </div>
    </div>
  );
}

