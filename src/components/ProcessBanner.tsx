import ScrollReveal from "./ScrollReveal";

export default function ProcessBanner() {
  const steps = [
    { number: "01", label: "Upload a photo" },
    { number: "02", label: "Share your page" },
    { number: "03", label: "Collect votes" },
  ];

  return (
    <ScrollReveal direction="up" delayMs={60}>
      <section
        aria-label="How the contest works"
        className="w-full my-6 bg-white rounded-[22px] sm:rounded-[28px] border border-[#EFECE4] shadow-xs hover:shadow-sm transition-shadow duration-300 p-5 sm:p-7"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 md:divide-x md:divide-[#EFECE4]">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex items-center gap-3 sm:gap-4 md:px-8 first:md:pl-2 last:md:pr-2 group cursor-default"
            >
              <span className="text-[#F2653B] font-bold text-lg sm:text-xl tracking-tight group-hover:scale-110 transition-transform duration-200">
                {step.number}
              </span>
              <span className="text-[#1B382B] font-bold text-sm sm:text-base group-hover:text-[#234E3D] transition-colors duration-200">
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}
