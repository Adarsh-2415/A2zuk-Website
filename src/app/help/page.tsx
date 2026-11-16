import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FaqExplorer from "@/components/FaqExplorer";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Help & FAQs — A2ZUK",
  description:
    "Find answers about participating, submitting entries, voting and using A2ZUK.",
  alternates: {
    canonical: "/help",
  },
};

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        {/* Shared Header */}
        <Header />

        <main className="flex-1 flex flex-col py-4 sm:py-6 space-y-10 sm:space-y-14">
          {/* Section 1: Hero */}
          <section
            aria-labelledby="faq-hero-heading"
            className="w-full bg-[#234E3D] text-white rounded-[28px] sm:rounded-[36px] p-8 sm:p-12 text-center relative overflow-hidden shadow-xl"
          >
            <div className="max-w-2xl mx-auto relative z-10">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#D4E865] text-[#1B382B] mb-4 shadow-sm">
                HELP CENTER
              </span>
              <h1
                id="faq-hero-heading"
                className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-white leading-tight mb-3"
              >
                How Can We Help?
              </h1>
              <p className="text-white/85 text-base sm:text-lg leading-relaxed font-normal">
                Find answers about participating, submitting entries, voting and
                using A2ZUK.
              </p>
            </div>
            {/* Subtle decorative background circle */}
            <div
              className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/5 pointer-events-none"
              aria-hidden="true"
            />
          </section>

          {/* Section 2 & 3: Interactive Search, Category Tabs & FAQs */}
          <section aria-label="Frequently Asked Questions">
            <FaqExplorer />
          </section>

          {/* Section 4: Support CTA */}
          <section aria-labelledby="support-cta-heading">
            <ScrollReveal direction="scale">
              <div
                id="contact"
                className="bg-[#FAF8F5] border border-[#EFECE4] rounded-[24px] sm:rounded-[32px] p-8 sm:p-12 text-center max-w-2xl mx-auto my-4 shadow-xs"
              >
                <h2
                  id="support-cta-heading"
                  className="text-2xl sm:text-3xl font-bold text-[#1B382B] tracking-tight mb-2"
                >
                  Still Need Help?
                </h2>
                <p className="text-[#4A5D52] text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-6">
                  Have questions about your entry, photo verification, or voting? Our team is here to help!
                </p>
                <div className="p-5 rounded-2xl bg-white border border-[#EFECE4] text-xs sm:text-sm text-[#5A6D61] max-w-md mx-auto space-y-2 shadow-2xs">
                  <span className="font-bold text-[#1B382B] text-sm block">
                    Contact A2ZUK Support
                  </span>
                  <p className="text-xs text-[#5A6D61]">
                    Email us anytime and we will respond within 24 hours:
                  </p>
                  <a
                    href="mailto:support@a2zuk.in"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#234E3D] hover:bg-[#1A3B2E] transition-all shadow-2xs mt-1"
                  >
                    <span>✉️</span>
                    <span>support@a2zuk.in</span>
                  </a>
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
