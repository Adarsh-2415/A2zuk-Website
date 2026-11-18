"use client";

import { useEffect, useState, useRef } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages?: string;
            autoDisplay?: boolean;
            layout?: unknown;
          },
          elementId: string,
        ) => void;
      };
    };
  }
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
];

interface LanguageTranslatorProps {
  className?: string;
  variant?: "header" | "footer";
}

export function LanguageTranslator({
  className = "",
  variant = "header",
}: LanguageTranslatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<string>("en");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Read current language from Google Translate cookie if present
    const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
    if (match && match[1]) {
      const parts = match[1].split("/");
      const lang = parts[parts.length - 1];
      if (lang) {
        setCurrentLang(lang);
      }
    }

    // Initialize Google Translate script once globally
    if (!document.getElementById("google-translate-script")) {
      window.googleTranslateElementInit = () => {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,hi,bn,te,mr,ta,gu,kn,ml,pa,or,ur",
              autoDisplay: false,
            },
            "google_translate_element",
          );
        }
      };

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    // Close on click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectLanguage = (code: string) => {
    setCurrentLang(code);
    setIsOpen(false);

    // Set Google translate cookie for current domain and root path
    const domain = window.location.hostname;
    const cookieValue = `/en/${code}`;
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain};`;

    // Attempt to trigger the select box directly if available, else reload cleanly
    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
  };

  const activeLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Hidden container for Google Translate Widget */}
      <div id="google_translate_element" className="hidden" aria-hidden="true" />

      {/* Language Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select website language"
        className={`inline-flex items-center gap-1.5 rounded-full font-semibold transition-all duration-200 active:scale-95 cursor-pointer shadow-2xs ${
          variant === "footer"
            ? "px-3 py-1.5 text-xs bg-white dark:bg-[#1A2820] text-[#1B382B] dark:text-[#E2ECE5] border border-[#E8DFC8] dark:border-white/15 hover:bg-[#FAF8F5] dark:hover:bg-[#23352B]"
            : "px-2.5 sm:px-3 py-1.5 text-xs bg-white/80 dark:bg-[#1A2820] hover:bg-white dark:hover:bg-[#23352B] border border-[#E8DFC8] dark:border-white/15 text-[#1B382B] dark:text-[#E2ECE5]"
        }`}
      >
        <svg
          className="w-3.5 h-3.5 text-[#234E3D] dark:text-[#D4E865] shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
        <span className="truncate max-w-[85px] sm:max-w-none">
          {activeLangObj.nativeName}
        </span>
        <svg
          className={`w-3 h-3 text-[#5A6D61] dark:text-[#A0B3A7] transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Languages"
          className={`absolute z-50 mt-2 w-48 sm:w-56 rounded-2xl bg-white dark:bg-[#16241C] border border-[#EFECE4] dark:border-[#283C30] shadow-xl p-1.5 focus:outline-none animate-scale-in text-left ${
            variant === "footer" ? "bottom-full mb-2 left-0 sm:left-auto sm:right-0" : "right-0"
          }`}
        >
          <div className="px-3 py-1.5 border-b border-[#F5F2EA] dark:border-white/10 mb-1">
            <p className="text-[11px] font-bold text-[#1B382B] dark:text-[#E2ECE5] uppercase tracking-wider">
              Translate Website
            </p>
            <p className="text-[10px] text-[#5A6D61] dark:text-[#95A59B]">
              Powered by Google Translate
            </p>
          </div>

          <div className="max-h-60 overflow-y-auto scrollbar-thin space-y-0.5">
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors duration-150 ${
                    isSelected
                      ? "bg-[#234E3D] text-white"
                      : "text-[#1B382B] dark:text-[#E2ECE5] hover:bg-[#FAF8F5] dark:hover:bg-[#1E3025]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{lang.nativeName}</span>
                    <span
                      className={`text-[10px] ${
                        isSelected ? "text-white/80" : "text-[#5A6D61] dark:text-[#95A59B]"
                      }`}
                    >
                      ({lang.name})
                    </span>
                  </span>
                  {isSelected && <span aria-hidden="true">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
