import Link from "next/link";

export default function CtaBanner() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="w-full my-8 sm:my-10 bg-[#F8D7C8] rounded-[24px] sm:rounded-[32px] p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-sm"
    >
      <div className="max-w-2xl">
        <h2
          id="cta-heading"
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1B382B] tracking-tight mb-2.5"
        >
          Ready to share your little star?
        </h2>
        <p className="text-[#4A5D52] text-sm sm:text-base mb-7 font-medium leading-relaxed">
          Join the contest, compete for 13 winning positions across our ₹27,500 prize pool, and invite your favourite people to cheer along.
        </p>
        <div>
          <Link
            href="/contests/baby-photo-contest-1/submit"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm sm:text-base font-semibold text-white bg-[#234E3D] hover:bg-[#1A3B2E] transition-all shadow-md hover:shadow-lg active:scale-95 group"
          >
            <span>Submit an entry</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
    </section>
  );
}
