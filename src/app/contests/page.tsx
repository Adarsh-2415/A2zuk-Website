import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { ContestDiscovery } from "@/components/contests/ContestDiscovery";
import { getPublicContests } from "@/lib/queries/contests";

async function ContestsListLoader() {
  const contests = await getPublicContests();
  return <ContestDiscovery contests={contests} />;
}

export const metadata: Metadata = {
  title: "All Contests — Discover & Participate | A2ZUK",
  description:
    "Explore active, upcoming, and past baby photo contests on A2ZUK. Review contest rules, important dates, and participate in joyful community celebrations.",
  alternates: {
    canonical: "/contests",
  },
  openGraph: {
    title: "All Contests — Discover & Participate | A2ZUK",
    description:
      "Explore exciting baby photo contests on A2ZUK. Check rules, submission deadlines, and community voting.",
    url: "/contests",
    siteName: "A2ZUK",
    locale: "en_GB",
    type: "website",
  },
};

export default function ContestsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Centered Main Page Container */}
      <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        {/* Section 1: Shared Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 space-y-8 sm:space-y-12 pb-16 sm:pb-24 pt-2 sm:pt-4">
          {/* Section 2: Hero */}
          <section
            aria-labelledby="contests-hero-heading"
            className="w-full rounded-[28px] sm:rounded-[36px] bg-[#FAF8F5] border border-[#EFECE4] p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-xs"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Text-led Hero Column */}
              <div className="lg:col-span-8 flex flex-col items-start z-10">
                <ScrollReveal direction="up">
                  {/* Eyebrow */}
                  <span className="inline-flex items-center px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#234E3D]/10 text-[#234E3D] mb-4 shadow-2xs">
                    A2ZUK / CONTESTS
                  </span>

                  {/* Heading */}
                  <h1
                    id="contests-hero-heading"
                    className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1B382B] leading-[1.12] mb-4"
                  >
                    Find Your Next Contest.
                  </h1>

                  {/* Supporting text */}
                  <p className="text-[#4A5D52] text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
                    Explore contests, discover new opportunities and find one that
                    interests you. Check the details, dates and participation rules
                    before entering.
                  </p>

                  {/* Primary CTA button scrolling to discovery */}
                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href="#explore-contests"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm sm:text-base font-semibold text-white bg-[#234E3D] hover:bg-[#1A3B2E] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md group"
                    >
                      <span>Explore Contests</span>
                      <svg
                        className="w-4 h-4 transition-transform duration-200 group-hover:translate-y-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </Link>

                    <Link
                      href="/how-it-works"
                      className="inline-flex items-center gap-1.5 px-5 py-3 rounded-full text-sm font-semibold text-[#1B382B] hover:text-[#234E3D] hover:bg-black/[0.04] transition-colors"
                    >
                      <span>How it works</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </ScrollReveal>
              </div>

              {/* Restrained Visual Accent Column */}
              <div className="lg:col-span-4 hidden lg:flex items-center justify-center">
                <ScrollReveal direction="up" delayMs={150}>
                  <div className="relative w-48 h-48 rounded-full bg-[#FAD5C0]/60 border border-[#F2653B]/20 flex items-center justify-center p-6 shadow-inner">
                    <svg
                      viewBox="0 0 160 160"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full text-[#234E3D]"
                      aria-hidden="true"
                    >
                      {/* Stylized Sun */}
                      <circle cx="125" cy="35" r="16" fill="#F0653F" />
                      {/* Floating Camera / Heart Symbolism */}
                      <rect x="35" y="55" width="90" height="65" rx="14" stroke="#234E3D" strokeWidth="6" />
                      <circle cx="80" cy="88" r="18" stroke="#234E3D" strokeWidth="5" />
                      <circle cx="106" cy="70" r="4" fill="#234E3D" />
                      <path d="M58 55L64 45H96L102 55" stroke="#234E3D" strokeWidth="5" strokeLinejoin="round" />
                    </svg>
                    {/* Decorative Star Badge */}
                    <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#D4E865] flex items-center justify-center shadow-xs">
                      <span className="text-xs font-bold text-[#1B382B]">★</span>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>

          {/* Section 3, 4, 5, 6: Interactive Contest Discovery & Listing */}
          <Suspense
            fallback={
              <section className="w-full py-10 space-y-6" aria-busy="true">
                <div className="h-10 w-64 rounded-full bg-[#EFECE4] animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-80 rounded-3xl bg-white border border-[#EFECE4] animate-pulse"
                    />
                  ))}
                </div>
              </section>
            }
          >
            <ContestsListLoader />
          </Suspense>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
