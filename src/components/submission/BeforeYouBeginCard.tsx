export function BeforeYouBeginCard() {
  return (
    <div className="flex flex-col items-start space-y-6">
      {/* Lime Eyebrow Pill */}
      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#D4E865] text-[#1B382B] shadow-2xs">
        Your little star, our little joy
      </span>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1B382B] leading-[1.12]">
        Let’s meet your
        <br />
        little one.
      </h1>

      {/* Subtitle */}
      <p className="text-[#4A5D52] text-base sm:text-lg leading-relaxed max-w-md">
        A few details, one favourite photo, and a little permission to share the joy.
      </p>

      {/* Dark Green Guidance Card */}
      <div className="w-full rounded-3xl bg-[#234E3D] text-white p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Before you begin
        </h2>

        <div className="space-y-5">
          {/* Step 01 */}
          <div className="flex items-start gap-4">
            <span className="font-bold text-sm text-[#D4E865] shrink-0 mt-0.5">
              01
            </span>
            <p className="text-sm sm:text-base font-semibold text-white/95">
              Choose a clear photo
            </p>
          </div>

          {/* Step 02 */}
          <div className="flex items-start gap-4">
            <span className="font-bold text-sm text-[#D4E865] shrink-0 mt-0.5">
              02
            </span>
            <p className="text-sm sm:text-base font-semibold text-white/95">
              A parent or guardian submits
            </p>
          </div>

          {/* Step 03 - Safety & Quality Review Wording */}
          <div className="flex items-start gap-4">
            <span className="font-bold text-sm text-[#D4E865] shrink-0 mt-0.5">
              03
            </span>
            <p className="text-sm sm:text-base font-semibold text-white/95">
              Fast safety &amp; quality review
            </p>
          </div>
        </div>

        {/* Card Footer Microcopy */}
        <p className="pt-4 border-t border-white/10 text-xs text-white/70 leading-relaxed">
          Entries go live on the leaderboard as soon as our team completes safety &amp; quality review.
        </p>
      </div>
    </div>
  );
}
