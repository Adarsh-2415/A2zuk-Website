import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "How It Works — A2ZUK",
  description:
    "Discover exciting contests on A2ZUK, submit your entry and invite others to support your participation.",
  alternates: {
    canonical: "/how-it-works",
  },
};

export default function HowItWorksPage() {
  const participationSteps = [
    {
      number: "01",
      title: "Explore contests",
      description:
        "Browse available contests and check their deadlines, eligibility and rules.",
      accent: "coral",
    },
    {
      number: "02",
      title: "Submit your entry",
      description:
        "Open a contest, complete the submission form and upload the required photo or content.",
      accent: "lime",
    },
    {
      number: "03",
      title: "Complete the checks",
      description:
        "Your submission goes through the platform's automated checks before publication.",
      accent: "forest",
    },
    {
      number: "04",
      title: "Share and participate",
      description:
        "Share your entry and let others discover it. Visitors can vote according to the contest's voting rules.",
      accent: "coral",
    },
  ];

  const votingPoints = [
    {
      index: "1",
      text: "Voters do not need a separate voter account, according to the planned voting experience.",
    },
    {
      index: "2",
      text: "Each verified Google account can cast exactly 1 official vote in the contest.",
    },
    {
      index: "3",
      text: "Public entry pages display vote counts.",
    },
  ];

  const importantNotes = [
    "Read the rules of the specific contest before submitting.",
    "Submissions are published after the automated checks pass; the final error, rejection and retry behavior still needs to be defined.",
    "Contest dates, eligibility and winner selection depend on the rules shown for that contest.",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Main Container */}
      <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        {/* Shared Header */}
        <Header />

        <main className="flex-1 flex flex-col py-4 sm:py-6 space-y-10 sm:space-y-14">
          {/* Section 1: Hero */}
          <section
            aria-labelledby="hero-heading"
            className="w-full bg-[#234E3D] text-white rounded-[28px] sm:rounded-[36px] p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-xl"
          >
            <div className="max-w-2xl relative z-10">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#D4E865] text-[#1B382B] mb-5 shadow-sm">
                A2ZUK GUIDE
              </span>
              <h1
                id="hero-heading"
                className="text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-tight text-white leading-[1.12] mb-4"
              >
                Discover. Participate. Share the Excitement.
              </h1>
              <p className="text-white/85 text-base sm:text-lg leading-relaxed mb-8 max-w-xl font-normal">
                Discover exciting contests on A2ZUK, submit your entry and invite
                others to support your participation.
              </p>
              <div>
                <Link
                  href="/contests"
                  className="inline-flex items-center gap-2 bg-[#D4E865] hover:bg-[#C7DC58] text-[#1B382B] font-bold text-sm sm:text-base px-6 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-md hover:shadow-lg group"
                >
                  <span>Explore Contests</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M7 17L17 7M17 7H7M17 7V17"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Subtle decorative background circle */}
            <div
              className="absolute -right-12 -bottom-12 w-80 h-80 rounded-full bg-white/5 pointer-events-none"
              aria-hidden="true"
            />
          </section>

          {/* Section 2: Participation steps */}
          <section aria-labelledby="steps-heading">
            <ScrollReveal direction="up">
              <div className="mb-6 sm:mb-8">
                <h2
                  id="steps-heading"
                  className="text-2xl sm:text-3xl font-bold text-[#1B382B] tracking-tight"
                >
                  How It Works
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {participationSteps.map((step, idx) => (
                <ScrollReveal
                  key={step.number}
                  direction="up"
                  delayMs={idx * 80}
                  className="h-full"
                >
                  <div className="h-full bg-white rounded-[22px] sm:rounded-[26px] p-6 border border-[#EFECE4] shadow-xs hover:shadow-lg hover:shadow-emerald-950/[0.03] hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#7B8D82]">
                        {`Step ${step.number}`}
                      </span>
                      <span className="text-xl font-bold tracking-tight text-[#F2653B]">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#1B382B] mb-2 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#5A6D61] leading-relaxed mt-auto">
                      {step.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* Section 3: How voting works */}
          <section aria-labelledby="voting-heading">
            <ScrollReveal direction="up">
              <div className="bg-white rounded-[24px] sm:rounded-[30px] p-7 sm:p-10 border border-[#EFECE4] shadow-xs">
                <h2
                  id="voting-heading"
                  className="text-2xl sm:text-3xl font-bold text-[#1B382B] tracking-tight mb-6"
                >
                  How Voting Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {votingPoints.map((point) => (
                    <div
                      key={point.index}
                      className="flex gap-4 p-5 rounded-2xl bg-[#FAF8F5] border border-[#EFECE4]/70"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#234E3D] text-white flex items-center justify-center text-sm font-bold shrink-0">
                        {point.index}
                      </div>
                      <p className="text-sm text-[#4A5D52] leading-relaxed font-medium">
                        {point.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* Section 4: Important to know */}
          <section aria-labelledby="important-heading">
            <ScrollReveal direction="up">
              <div className="bg-[#FAF8F5] border border-[#EFECE4] rounded-[24px] sm:rounded-[30px] p-7 sm:p-10">
                <h2
                  id="important-heading"
                  className="text-2xl sm:text-3xl font-bold text-[#1B382B] tracking-tight mb-5"
                >
                  Important to Know
                </h2>
                <ul className="space-y-3 mb-8">
                  {importantNotes.map((note) => (
                    <li
                      key={note}
                      className="flex items-start gap-3 text-sm sm:text-base text-[#4A5D52] leading-relaxed"
                    >
                      <span
                        className="w-2 h-2 rounded-full bg-[#F2653B] mt-2 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
                <div>
                  <Link
                    href="/terms#section-3"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[#234E3D] hover:bg-[#1A3B2E] transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-sm"
                  >
                    <span>View Contest Rules</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* Section 5: Closing CTA */}
          <section aria-labelledby="closing-heading">
            <ScrollReveal direction="scale">
              <div className="bg-[#F8D7C8] rounded-[24px] sm:rounded-[32px] p-8 sm:p-12 text-center max-w-3xl mx-auto my-4 shadow-xs">
                <h2
                  id="closing-heading"
                  className="text-2xl sm:text-3xl font-bold text-[#1B382B] tracking-tight mb-2"
                >
                  Still Have Questions?
                </h2>
                <p className="text-[#4A5D52] text-sm sm:text-base mb-6 font-medium">
                  Need a little more information?
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/help"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold text-white bg-[#234E3D] hover:bg-[#1A3B2E] transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-sm"
                  >
                    Read FAQs
                  </Link>
                  <Link
                    href="/contests"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-bold text-[#1B382B] bg-[#D4E865] hover:bg-[#C7DC58] transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-xs"
                  >
                    Explore Contests
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </section>
        </main>

        {/* Shared Footer */}
        <Footer />
      </div>
    </div>
  );
}
