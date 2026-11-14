import { Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProcessBanner from "@/components/ProcessBanner";
import ContestantsSection from "@/components/ContestantsSection";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import { getFeaturedContest } from "@/lib/queries/contests";
import { getHomepagePublishedEntries } from "@/lib/queries/entries";

async function HeroWithContest() {
  const featuredContest = await getFeaturedContest();
  return <HeroSection featuredContest={featuredContest} />;
}

async function ContestantsWithEntries() {
  const entries = await getHomepagePublishedEntries(3);
  return <ContestantsSection entries={entries} />;
}

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://a2zuk.com/#website",
        "url": "https://a2zuk.com",
        "name": "A2ZUK",
        "description": "Joyful online photo contests for families and communities.",
      },
      {
        "@type": "Organization",
        "@id": "https://a2zuk.com/#organization",
        "name": "A2ZUK",
        "url": "https://a2zuk.com",
        "logo": "https://a2zuk.com/logo.png",
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Main Page Container */}
      <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        {/* Top Navigation */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col pt-2 sm:pt-3">
          {/* Section 1: Hero */}
          <Suspense fallback={<HeroSection />}>
            <HeroWithContest />
          </Suspense>

          {/* Section 2: 3-Step Process Banner */}
          <ProcessBanner />

          {/* Section 3: Meet the little stars */}
          <Suspense
            fallback={
              <section className="w-full my-10" aria-busy="true">
                <div className="h-8 w-56 rounded-full bg-[#EFECE4] animate-pulse mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-72 rounded-[24px] bg-white border border-[#EFECE4] animate-pulse"
                    />
                  ))}
                </div>
              </section>
            }
          >
            <ContestantsWithEntries />
          </Suspense>

          {/* Section 4: Call to Action Banner */}
          <CtaBanner />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
