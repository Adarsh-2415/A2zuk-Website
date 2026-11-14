"use client";

import { useState, useRef, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import BabyIllustration from "@/components/BabyIllustration";

interface ContestantChallengeStudioProps {
  challengerName: string; // The current entry's name, e.g. "Mia Sharma"
  contestSlug: string;
}

type AgeCategory = "under-6-months" | "under-12-months" | "up-to-24-months";

export default function ContestantChallengeStudio({
  challengerName,
  contestSlug,
}: ContestantChallengeStudioProps) {
  const [babyName, setBabyName] = useState("");
  const [ageCategory, setAgeCategory] = useState<AgeCategory>("under-6-months");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<"peach" | "sage" | "lavender">("peach");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  const handleClearPhoto = () => {
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getCategoryLabel = (category: AgeCategory) => {
    switch (category) {
      case "under-6-months":
        return "Under 6 Months";
      case "under-12-months":
        return "Under 12 Months";
      case "up-to-24-months":
        return "Up to 24 Months";
    }
  };

  const displayName = babyName.trim() ? babyName.trim() : "Your Baby";

  return (
    <section className="w-full rounded-[28px] sm:rounded-[36px] bg-gradient-to-br from-[#F8D5C4]/35 via-white to-[#FAF8F5] border border-[#F8D5C4]/80 p-6 sm:p-10 lg:p-12 shadow-xs relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div
        className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#D4E865]/25 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[#F8D5C4]/40 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full">
        {/* Header: Friendly Family Challenge Hook */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#234E3D]/10 text-[#234E3D] border border-[#234E3D]/15 mb-3">
            <span>🏆</span>
            <span>Friendly Family Challenge</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1B382B] tracking-tight leading-[1.2] mb-3">
            Think your little one can match {challengerName}&apos;s sweet smile?
          </h2>
          <p className="text-sm sm:text-base text-[#5A6D61] leading-relaxed">
            Create your baby&apos;s live contest card in 10 seconds. See how adorable they look, then enter 100% free to rally family & friends!
          </p>
        </div>

        {/* 2-Column Interactive Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Creator Controls */}
          <div className="lg:col-span-7 bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#EFECE4] shadow-xs flex flex-col gap-5">
            <div>
              <label htmlFor="baby-name-input" className="block text-xs font-bold text-[#1B382B] uppercase tracking-wider mb-2">
                1. Baby&apos;s Name
              </label>
              <input
                id="baby-name-input"
                type="text"
                maxLength={30}
                placeholder="e.g. Leo, Aria, Vivaan"
                value={babyName}
                onChange={(e) => setBabyName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E0DCCE] text-sm sm:text-base font-semibold text-[#1B382B] placeholder-[#9AA59D] focus:outline-none focus:border-[#234E3D] focus:ring-2 focus:ring-[#234E3D]/20 transition-all"
              />
            </div>

            <div>
              <span className="block text-xs font-bold text-[#1B382B] uppercase tracking-wider mb-2">
                2. Age Category
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(["under-6-months", "under-12-months", "up-to-24-months"] as AgeCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setAgeCategory(cat)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border text-center ${
                      ageCategory === cat
                        ? "bg-[#234E3D] text-white border-[#234E3D] shadow-2xs"
                        : "bg-[#FAF8F5] text-[#5A6D61] border-[#E0DCCE] hover:border-[#234E3D]/40"
                    }`}
                  >
                    {getCategoryLabel(cat)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#1B382B] uppercase tracking-wider">
                  3. Baby&apos;s Photo (Instant Preview)
                </span>
                {photoPreview && (
                  <button
                    type="button"
                    onClick={handleClearPhoto}
                    className="text-[11px] font-semibold text-[#F2653B] hover:underline"
                  >
                    Reset Photo
                  </button>
                )}
              </div>

              {/* Upload Button & Avatar Presets */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="studio-photo-upload"
                />
                <label
                  htmlFor="studio-photo-upload"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#FAF8F5] hover:bg-[#F2EFE9] border border-[#E0DCCE] text-xs font-bold text-[#1B382B] cursor-pointer transition-colors shadow-2xs group flex-1"
                >
                  <svg className="w-4 h-4 text-[#234E3D] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{photoPreview ? "Change Photo" : "Upload from Phone / PC"}</span>
                </label>

                {!photoPreview && (
                  <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-2xl bg-[#FAF8F5] border border-[#E0DCCE]">
                    <span className="text-[11px] font-semibold text-[#5A6D61]">Presets:</span>
                    <button
                      type="button"
                      onClick={() => setSelectedPreset("peach")}
                      aria-label="Preset Warm Peach"
                      className={`w-6 h-6 rounded-full bg-[#F8D5C4] border-2 transition-transform ${selectedPreset === "peach" ? "border-[#1B382B] scale-110" : "border-white"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedPreset("sage")}
                      aria-label="Preset Soft Sage"
                      className={`w-6 h-6 rounded-full bg-[#E2E8D5] border-2 transition-transform ${selectedPreset === "sage" ? "border-[#1B382B] scale-110" : "border-white"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedPreset("lavender")}
                      aria-label="Preset Gentle Lavender"
                      className={`w-6 h-6 rounded-full bg-[#D4DCF9] border-2 transition-transform ${selectedPreset === "lavender" ? "border-[#1B382B] scale-110" : "border-white"}`}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Quick Submit CTA directly from Left Studio */}
            <div className="pt-2 border-t border-[#EFECE4]">
              <Link
                href={`/contests/${contestSlug}/submit`}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm sm:text-base font-bold bg-[#D4E865] hover:bg-[#C7DC58] text-[#1B382B] shadow-2xs hover:-translate-y-0.5 active:scale-95 transition-all group"
              >
                <span>Enter {displayName} in Contest — Free</span>
                <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
              <p className="text-[11px] text-[#5A6D61] text-center mt-2">
                100% Free to enter • Family-Safe • Ready in 60 seconds
              </p>
            </div>
          </div>

          {/* Right Column: Real-Time Rendered Contestant Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="text-xs font-bold text-[#5A6D61] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D4E865] animate-ping" />
              <span>Live Card Preview</span>
            </div>

            {/* Simulated Live Littlejoy Entry Card */}
            <div className="w-full max-w-[340px] rounded-3xl bg-white border border-[#EFECE4] p-4 shadow-md transition-all duration-300 hover:shadow-lg relative">
              {/* Star Ribbon */}
              <div className="absolute -top-3 -right-3 z-20 w-8 h-8 flex items-center justify-center animate-star-twinkle pointer-events-none select-none">
                <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[#D4E865] drop-shadow-sm">
                  <path
                    d="M12 2L14.4 8.6L21.5 9.1L16 13.8L17.8 20.8L12 17L6.2 20.8L8 13.8L2.5 9.1L9.6 8.6L12 2Z"
                    fill="currentColor"
                    stroke="#1B382B"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Photo Frame */}
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#EFECE4] relative">
                {photoPreview ? (
                  <Image
                    src={photoPreview}
                    alt={displayName}
                    fill
                    className="object-cover object-center"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full">
                    <BabyIllustration variant={selectedPreset} />
                  </div>
                )}

                {/* Floating Challenger Badge */}
                <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B382B]/85 backdrop-blur-md text-white text-[10px] font-semibold border border-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4E865] animate-pulse" />
                  <span>Challenger Entry</span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="mt-3.5 px-1 pb-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#234E3D]/10 text-[#234E3D]">
                    {getCategoryLabel(ageCategory)}
                  </span>
                  <span className="text-[11px] font-bold text-[#F2653B] flex items-center gap-1">
                    <span>❤️</span>
                    <span>Ready for cheers</span>
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1B382B] truncate tracking-tight">
                  {displayName}
                </h3>
                <p className="text-[11px] text-[#5A6D61] mt-0.5 truncate">
                  Ready to compete with {challengerName}!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
