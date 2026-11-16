"use client";

import { useState, useMemo } from "react";

export type FaqCategory =
  | "General"
  | "Participation"
  | "Photo submissions"
  | "Voting"
  | "Privacy & Safety";

interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
  isPendingDecision?: boolean;
}

const FAQS_DATA: FaqItem[] = [
  // Category: General
  {
    id: "gen-1",
    category: "General",
    question: "What is A2ZUK?",
    answer:
      "A2ZUK is a joyful, family-first contest platform where parents can celebrate their little ones in a safe environment, share memories, and gather genuine support from relatives, friends, and the community.",
  },
  {
    id: "gen-2",
    category: "General",
    question: "Is it free to participate?",
    answer:
      "Yes, 100% Free! There are no entry fees, no hidden registration charges, and no paid votes. Every child participates with equal standing.",
  },
  {
    id: "gen-3",
    category: "General",
    question: "Do I need an account to vote?",
    answer:
      "No lengthy registration is required. To ensure 100% fair voting and eliminate automated bot voting, voters simply click 'Verify with Google' to cast their 1 official vote per contestant.",
  },
  {
    id: "gen-4",
    category: "General",
    question: "Where can I find a contest's rules and deadlines?",
    answer:
      "Open any contest's page or visit our 'How It Works' guide to review full eligibility requirements, category ranges, and voting guidelines.",
  },

  // Category: Participation
  {
    id: "part-1",
    category: "Participation",
    question: "What is the age limit for baby photo contests?",
    answer:
      "Children must be between 0 and 24 months (up to 2 years old) at the time of entry. We have 3 fair age brackets: Under 6 Months, Under 12 Months, and Up to 24 Months, auto-matched from the baby's date of birth.",
  },
  {
    id: "part-2",
    category: "Participation",
    question: "How do I submit an entry?",
    answer:
      "Click 'Participate Now' on the contest page, enter your baby's display name and date of birth, fill in your guardian contact info, upload your favourite clear photo, check the guardian declarations, and submit.",
  },
  {
    id: "part-3",
    category: "Participation",
    question: "When will my baby's entry appear on the leaderboard?",
    answer:
      "Every entry undergoes a safety and quality review by our moderation team (usually within 2 to 24 hours). You will receive an immediate confirmation email upon submission, and a live celebration email with your link as soon as it is approved!",
  },
  {
    id: "part-4",
    category: "Participation",
    question: "Can I update or withdraw my submitted entry?",
    answer:
      "Yes. Parents and legal guardians retain full control over their content. You can request a photo update, detail correction, or complete withdrawal at any time by contacting our support team at support@a2zuk.in with your entry reference code.",
  },

  // Category: Photo submissions
  {
    id: "photo-1",
    category: "Photo submissions",
    question: "What kind of photo should I submit?",
    answer:
      "Upload a clear, authentic, high-quality picture of your baby (JPG, PNG, or WebP up to 10 MB). The child's face should be clearly visible in good lighting. Avoid heavy digital filters, borders, commercial watermarks, or studio logos.",
  },
  {
    id: "photo-2",
    category: "Photo submissions",
    question: "Who is allowed to submit a photo?",
    answer:
      "Only the parent or legal guardian may submit a photo of their child. You must have full legal authority and parental consent to submit and share the photograph for contest participation.",
  },
  {
    id: "photo-3",
    category: "Photo submissions",
    question: "Why would a photo be rejected?",
    answer:
      "Submissions may be rejected if the photo is extremely blurry, contains inappropriate content, displays prominent commercial advertising, or violates child safety standards. If rejected, you will receive an email letting you submit a fresh, eligible photo.",
  },

  // Category: Voting
  {
    id: "vote-1",
    category: "Voting",
    question: "How does the voting system work?",
    answer:
      "To ensure fairness and prevent spam, each verified Google account receives 1 official vote per contestant. You are welcome to vote for multiple different babies you admire, but you can only vote once per baby. Once cast, your vote for that baby is permanent.",
  },
  {
    id: "vote-2",
    category: "Voting",
    question: "Can parents vote for their own child?",
    answer:
      "To uphold fair election principles, parents cannot vote for their own child. Instead, parents receive an instant WhatsApp, Facebook, and Instagram share card to easily invite family, friends, and colleagues to support their baby.",
  },
  {
    id: "vote-3",
    category: "Voting",
    question: "If I cast a vote for a baby, can I also enter my own baby into the contest?",
    answer:
      "Yes, absolutely! Voting and participating are completely open. You can support other contestants and submit your own baby's entry using the same verified Google account.",
  },
  {
    id: "vote-4",
    category: "Voting",
    question: "How are winners determined?",
    answer:
      "Winners are determined by verified community vote tallies at the close of the contest period. All votes undergo automated cryptographic and velocity integrity checks to ensure all tallies represent genuine, fair human choices.",
  },

  // Category: Privacy & Safety
  {
    id: "priv-1",
    category: "Privacy & Safety",
    question: "What information is visible to the public?",
    answer:
      "Only your baby's display name, age category, city, and submitted photo are displayed on the public contest page. Guardian phone numbers, email addresses, and street addresses remain strictly confidential and are never shared publicly or sold.",
  },
  {
    id: "priv-2",
    category: "Privacy & Safety",
    question: "What should I do if I suspect fraudulent voting or see inappropriate content?",
    answer:
      "Please contact our integrity team right away at support@a2zuk.in with the contestant's public page link. We review all reports promptly and take immediate action against any policy violations.",
  },
];

const CATEGORIES: FaqCategory[] = [
  "General",
  "Participation",
  "Photo submissions",
  "Voting",
  "Privacy & Safety",
];

export default function FaqExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory | "All">("All");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();
      const questionMatch = item.question.toLowerCase().includes(query);
      const answerMatch = item.answer.toLowerCase().includes(query);

      return questionMatch || answerMatch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Search Input Box */}
      <div className="w-full max-w-xl mx-auto">
        <label htmlFor="faq-search" className="sr-only">
          Search for a question
        </label>
        <div className="relative">
          <input
            id="faq-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a question..."
            className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white border border-[#EFECE4] text-[#1B382B] placeholder:text-[#8C9C92] text-sm focus:outline-none focus:ring-2 focus:ring-[#234E3D] shadow-xs transition-all"
          />
          <svg
            className="w-5 h-5 text-[#7B8D82] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#7B8D82] hover:text-[#1B382B] bg-[#FAF8F5] px-2 py-1 rounded-md"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div
        role="tablist"
        aria-label="FAQ Categories"
        className="flex flex-wrap items-center justify-center gap-2"
      >
        <button
          type="button"
          role="tab"
          aria-selected={selectedCategory === "All"}
          onClick={() => setSelectedCategory("All")}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${selectedCategory === "All"
              ? "bg-[#234E3D] text-white shadow-xs"
              : "bg-white text-[#4A5D52] hover:bg-black/5 border border-[#EFECE4]"
            }`}
        >
          All Questions
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${selectedCategory === category
                ? "bg-[#234E3D] text-white shadow-xs"
                : "bg-white text-[#4A5D52] hover:bg-black/5 border border-[#EFECE4]"
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* FAQs Accordion List */}
      <div className="max-w-3xl mx-auto space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isOpen = !!openItems[faq.id];
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-[#EFECE4] shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  id={`accordion-btn-${faq.id}`}
                  aria-expanded={isOpen}
                  aria-controls={`accordion-panel-${faq.id}`}
                  onClick={() => toggleItem(faq.id)}
                  className="w-full text-left px-6 py-4.5 flex items-center justify-between gap-4 hover:bg-[#FAF8F5]/60 transition-colors"
                >
                  <span className="font-bold text-base sm:text-lg text-[#1B382B] leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center bg-[#FAF8F5] text-[#1B382B] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 bg-[#EFECE4]" : ""
                      }`}
                    aria-hidden="true"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={`accordion-panel-${faq.id}`}
                    role="region"
                    aria-labelledby={`accordion-btn-${faq.id}`}
                    className="px-6 pb-5 pt-1 text-sm sm:text-base text-[#4A5D52] leading-relaxed border-t border-[#F5F2EA]"
                  >
                    <p>{faq.answer}</p>
                    {/* Marked clearly when pending confirmation per prompt rule */}
                    {faq.isPendingDecision && (
                      <span className="inline-block mt-3 px-3 py-1 rounded-md text-xs font-semibold bg-[#F8D7C8]/50 text-[#1B382B] border border-[#F8D7C8]">
                        Note: Official policy pending final confirmation before launch.
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-[#EFECE4] p-8 text-center text-[#5A6D61]">
            <p className="text-base font-semibold text-[#1B382B] mb-1">
              No matching questions found
            </p>
            <p className="text-sm">
              We couldn&apos;t find any questions matching &ldquo;{searchQuery}&rdquo;.
              Try adjusting your search terms or selecting another category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
