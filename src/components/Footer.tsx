import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

export default function Footer() {
  return (
    <ScrollReveal direction="fade" delayMs={50}>
      <footer className="w-full pt-4 pb-12 mt-6 border-t border-[#EFECE4]/80 text-xs text-[#6B7D72]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Policy & Help Links with smooth hover transitions */}
          <nav
            aria-label="Footer Navigation"
            className="flex flex-wrap items-center gap-x-2 gap-y-1 font-medium"
          >
            <Link
              href="/how-it-works"
              className="hover:text-[#1B382B] hover:underline underline-offset-4 transition-all duration-200 py-1"
            >
              How It Works
            </Link>
            <span aria-hidden="true" className="text-[#A2B1A8]">
              ·
            </span>
            <Link
              href="/help"
              className="hover:text-[#1B382B] hover:underline underline-offset-4 transition-all duration-200 py-1"
            >
              Help &amp; FAQs
            </Link>
            <span aria-hidden="true" className="text-[#A2B1A8]">
              ·
            </span>
            <Link
              href="/privacy-policy"
              className="hover:text-[#1B382B] hover:underline underline-offset-4 transition-all duration-200 py-1"
            >
              Privacy Policy
            </Link>
            <span aria-hidden="true" className="text-[#A2B1A8]">
              ·
            </span>
            <Link
              href="/terms"
              className="hover:text-[#1B382B] hover:underline underline-offset-4 transition-all duration-200 py-1"
            >
              Terms &amp; Conditions
            </Link>
          </nav>

          {/* Copyright & Credit */}
          <p className="text-center sm:text-right text-[#6B7D72]">
            &copy; 2026 A2ZUK. All rights reserved. Powered by{" "}
            <a
              href="https://fsir.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#1B382B] hover:text-[#234E3D] hover:underline underline-offset-2 transition-colors duration-200"
            >
              FutureSoft India
            </a>
          </p>
        </div>
      </footer>
    </ScrollReveal>
  );
}
