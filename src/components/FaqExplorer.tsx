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
      "A2ZUK is a platform where people can discover contests, submit entries and support participating entries through voting.",
  },
  {
    id: "gen-2",
    category: "General",
    question: "Do I need an account to vote?",
    answer:
      "The planned voting experience does not require a separate voter account.",
  },
  {
    id: "gen-3",
    category: "General",
    question: "Where can I find a contest's rules?",
    answer:
      "Open the contest's details page to review its eligibility requirements, dates, submission instructions and voting rules.",
  },

  // Category: Participation
  {
    id: "part-1",
    category: "Participation",
    question: "How do I participate in a contest?",
    answer:
      "Open a contest, review its rules and use the submission form to provide the required information and upload your entry.",
  },
  {
    id: "part-2",
    category: "Participation",
    question: "When will my entry appear publicly?",
    answer:
      "Entries are planned to appear after they pass the platform's automated checks. If a submission fails a check, the exact message and next steps will depend on the final submission flow.",
  },
  {
    id: "part-3",
    category: "Participation",
    question: "Can I edit or delete my submitted entry?",
    answer: "This needs a decision before we publish a definitive answer.",
    isPendingDecision: true,
  },

  // Category: Photo submissions
  {
    id: "photo-1",
    category: "Photo submissions",
    question: "What kind of photo can I submit?",
    answer:
      "Follow the photo and content requirements displayed on the specific contest's submission page. The exact file types, size limits and content restrictions must be finalized.",
  },
  {
    id: "photo-2",
    category: "Photo submissions",
    question: "Can I submit a photo of my child?",
    answer:
      "For a child-focused contest, the submission process should require the appropriate parent or legal guardian authorization. The precise consent wording and verification process must be established before launch.",
  },
  {
    id: "photo-3",
    category: "Photo submissions",
    question: "Why was my submission not published?",
    answer:
      "Automated checks may prevent a submission from being published. The final product should explain the relevant issue and what the participant can do next, where applicable.",
  },

  // Category: Voting
  {
    id: "vote-1",
    category: "Voting",
    question: "How many votes can I cast in the contest?",
    answer:
      "Under our official election voting system, each verified Google account receives exactly 1 official vote in the contest.",
  },
  {
    id: "vote-2",
    category: "Voting",
    question: "Can I change my vote after casting it?",
    answer:
      "No. In accordance with election principles, once you cast your vote for a contestant, your ballot is permanently sealed and cannot be changed or transferred to another child.",
  },
  {
    id: "vote-3",
    category: "Voting",
    question: "Can I see the vote count?",
    answer: "Entry pages are planned to display public vote counts.",
  },
  {
    id: "vote-4",
    category: "Voting",
    question: "How are winners selected?",
    answer:
      "This must be explained in each contest's rules. We should not promise that the highest vote count always wins unless that is the confirmed rule for that contest.",
  },

  // Category: Privacy & Safety
  {
    id: "priv-1",
    category: "Privacy & Safety",
    question: "How is my submitted information used?",
    answer:
      "The Privacy Policy should explain which information is collected, why it is needed, how entries are displayed publicly and how users can raise privacy concerns.",
  },
  {
    id: "priv-2",
    category: "Privacy & Safety",
    question:
      "What should I do if I see inappropriate content or suspect unfair voting?",
    answer:
      "The final support and reporting process needs to be decided before we publish specific instructions.",
    isPendingDecision: true,
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
