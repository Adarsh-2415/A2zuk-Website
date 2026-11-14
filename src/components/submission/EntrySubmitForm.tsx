"use client";

import { useState, useMemo, useEffect, FormEvent } from "react";
import { SubmissionFormData, SubmissionFormErrors, BabyAgeCategory } from "@/types/entry";
import { createClient } from "@/lib/supabase/client";
import { GoogleSignInButton } from "../auth/GoogleSignInButton";
import { PhotoDropzone } from "./PhotoDropzone";
import { DatePickerCalendar } from "./DatePickerCalendar";
import { AgeCategorySelector } from "./AgeCategorySelector";
import { CheckingSequence } from "./CheckingSequence";
import { CelebrationScreen } from "./CelebrationScreen";
import { BeforeYouBeginCard } from "./BeforeYouBeginCard";

interface EntrySubmitFormProps {
  contestSlug?: string;
}

export function EntrySubmitForm({
  contestSlug = "baby-photo-contest-1",
}: EntrySubmitFormProps) {
  const [formData, setFormData] = useState<SubmissionFormData>({
    guardianName: "",
    email: "",
    phone: "",
    childDisplayName: "",
    childDateOfBirth: "",
    ageCategory: "",
    photo: null,
    consentGuardian: false,
    consentSharing: false,
    consentRules: false,
  });

  const [errors, setErrors] = useState<SubmissionFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [isCheckingAnimDone, setIsCheckingAnimDone] = useState(false);
  const [showIntegrationNotice, setShowIntegrationNotice] = useState(false);
  const [flowState, setFlowState] = useState<"form" | "checking" | "celebrating">("form");
  const [authUser, setAuthUser] = useState<{ email?: string; name?: string } | null>(null);

  // Pre-fill parent details if already signed in with Google
  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          const email = data.user.email ?? "";
          const name =
            (data.user.user_metadata?.full_name as string | undefined) ??
            (data.user.user_metadata?.name as string | undefined) ??
            "";
          setAuthUser({ email, name });
          setFormData((prev) => ({
            ...prev,
            guardianName: prev.guardianName || name,
            email: prev.email || email,
          }));
        }
      });
    } catch {
      // Ignore client auth detection error
    }
  }, []);

  // Dynamic progress calculation across 5 sections
  const progressPercent = useMemo(() => {
    let completedSteps = 0;
    // Step 1: Guardian Details
    if (formData.guardianName.trim() && formData.email.trim() && formData.phone.trim()) {
      completedSteps += 1;
    }
    // Step 2: Baby Details (Display Name & DOB)
    if (formData.childDisplayName.trim() && formData.childDateOfBirth.trim()) {
      completedSteps += 1;
    }
    // Step 3: Age Category
    if (formData.ageCategory) {
      completedSteps += 1;
    }
    // Step 4: Photo
    if (formData.photo) {
      completedSteps += 1;
    }
    // Step 5: Consents
    if (formData.consentGuardian && formData.consentSharing && formData.consentRules) {
      completedSteps += 1;
    }

    return {
      completedSteps,
      percentage: Math.round((completedSteps / 5) * 100),
    };
  }, [formData]);

  // Field change handler
  const handleTextChange = (field: keyof SubmissionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCheckboxChange = (field: keyof SubmissionFormData, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: checked }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Client-side validation logic
  const validateForm = (): boolean => {
    const newErrors: SubmissionFormErrors = {};

    // 1. Guardian Full Name
    if (!formData.guardianName.trim()) {
      newErrors.guardianName = "Please enter the parent or legal guardian's full name.";
    } else if (formData.guardianName.trim().length < 2) {
      newErrors.guardianName = "Please enter a valid full name.";
    }

    // 2. Email Address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Please enter an email address.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address (e.g. name@example.com).";
    }

    // 3. Phone Number
    const phoneClean = formData.phone.replace(/[\s\-\(\)\+]/g, "");
    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter a contact phone number.";
    } else if (phoneClean.length < 10) {
      newErrors.phone = "Please enter a valid phone number (at least 10 digits).";
    }

    // 4. Baby Display Name
    if (!formData.childDisplayName.trim()) {
      newErrors.childDisplayName = "Please enter your baby's display name for the contest page.";
    }

    // 5. Baby Date of Birth
    if (!formData.childDateOfBirth.trim()) {
      newErrors.childDateOfBirth = "Please select your baby's date of birth from the calendar.";
    }

    // 6. Baby Age Category
    if (!formData.ageCategory) {
      newErrors.ageCategory = "Please choose the age category that best fits your baby.";
    }

    // 7. Photo File
    if (!formData.photo) {
      newErrors.photo = "Please upload a photo of your baby (Max 1 MB).";
    }

    // 8. Mandatory Consents
    if (!formData.consentGuardian) {
      newErrors.consentGuardian = "You must confirm you are the child's parent or legal guardian.";
    }
    if (!formData.consentSharing) {
      newErrors.consentSharing = "You must confirm permission to submit and share this photo.";
    }
    if (!formData.consentRules) {
      newErrors.consentRules = "You must agree to the contest rules and privacy notice.";
    }

    setErrors(newErrors);
    const errorKeys = Object.keys(newErrors);
    if (errorKeys.length > 0) {
      const firstErrorKey = errorKeys[0];
      const el = document.getElementById(firstErrorKey);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !formData.photo) {
      return;
    }

    setSubmitError(null);
    setSubmittedCode(null);
    setIsCheckingAnimDone(false);
    setFlowState("checking");

    try {
      const payload = new FormData();
      payload.set("contestSlug", contestSlug);
      payload.set("guardianName", formData.guardianName.trim());
      payload.set("email", formData.email.trim());
      payload.set("phone", formData.phone.trim());
      payload.set("childDisplayName", formData.childDisplayName.trim());
      payload.set("childDateOfBirth", formData.childDateOfBirth);
      payload.set("ageCategory", formData.ageCategory);
      payload.set("consentGuardian", String(formData.consentGuardian));
      payload.set("consentSharing", String(formData.consentSharing));
      payload.set("consentRules", String(formData.consentRules));
      payload.set("photo", formData.photo);

      const response = await fetch("/api/submissions", {
        method: "POST",
        body: payload,
      });

      const result = (await response.json()) as {
        ok?: boolean;
        publicCode?: string;
        error?: string;
      };

      if (!response.ok || !result.ok || !result.publicCode) {
        setSubmitError(
          result.error || "Unable to submit your entry right now. Please try again.",
        );
        setFlowState("form");
        return;
      }

      setSubmittedCode(result.publicCode);
    } catch {
      setSubmitError(
        "Network error while submitting your entry. Please check your connection and try again.",
      );
      setFlowState("form");
    }
  };

  const handleResetForm = () => {
    setFormData({
      guardianName: "",
      email: "",
      phone: "",
      childDisplayName: "",
      childDateOfBirth: "",
      ageCategory: "",
      photo: null,
      consentGuardian: false,
      consentSharing: false,
      consentRules: false,
    });
    setErrors({});
    setSubmitError(null);
    setSubmittedCode(null);
    setIsCheckingAnimDone(false);
    setShowIntegrationNotice(false);
    setFlowState("form");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isCelebrating =
    flowState === "celebrating" ||
    (flowState === "checking" && isCheckingAnimDone && Boolean(submittedCode));

  if (isCelebrating) {
    return (
      <div className="w-full max-w-2xl mx-auto py-4">
        <CelebrationScreen
          babyName={formData.childDisplayName}
          ageCategory={formData.ageCategory}
          photoFile={formData.photo}
          publicCode={submittedCode}
          contestSlug={contestSlug}
          onReset={handleResetForm}
        />
      </div>
    );
  }

  if (flowState === "checking") {
    return (
      <div className="w-full max-w-xl mx-auto py-4">
        <CheckingSequence
          babyName={formData.childDisplayName}
          onComplete={() => {
            setIsCheckingAnimDone(true);
          }}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Left Column: Guidance Card ("Let's meet your little one") */}
      <div className="lg:col-span-5">
        <BeforeYouBeginCard />
      </div>

      {/* Right Column: Entry Form */}
      <div className="lg:col-span-7">
        <div className="w-full rounded-[28px] sm:rounded-[36px] bg-white border border-[#EFECE4] p-6 sm:p-10 shadow-xs">
          {/* Card Header & Dynamic Progress Indicator */}
          <div className="mb-8 pb-6 border-b border-[#F5F2EA]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1B382B] tracking-tight">
                  Entry details
                </h2>
                <p className="text-xs text-[#5A6D61] mt-0.5">
                  Fields below are a draft; confirm required data with the company.
                </p>
              </div>

              {/* Progress Pill */}
              <div className="self-start sm:self-auto flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#EFECE4] text-xs font-semibold text-[#1B382B]">
                <span className="w-2 h-2 rounded-full bg-[#234E3D]" />
                <span>{progressPercent.completedSteps} of 5 completed ({progressPercent.percentage}%)</span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-[#FAF8F5] overflow-hidden mt-3">
              <div
                className="h-full bg-[#234E3D] transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progressPercent.percentage}%` }}
              />
            </div>
          </div>

          {/* Honest Backend Integration Notice Modal / Banner */}
          {showIntegrationNotice && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-8 p-5 sm:p-6 rounded-2xl bg-[#FAF8F5] border-2 border-[#234E3D] text-[#1B382B] space-y-3 animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#234E3D] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  i
                </span>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-[#1B382B]">
                    Frontend Validated — Backend Integration Pending
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4A5D52] leading-relaxed mt-1">
                    All 5 entry sections have passed client-side validation requirements (format supported, photo size under 1 MB, age category selected, mandatory consents accepted).
                  </p>
                  <p className="text-xs sm:text-sm text-[#4A5D52] leading-relaxed mt-2 font-medium">
                    Live database storage, secure image uploading to cloud storage, and automated moderation filters are not yet connected to a live backend. No real records or personal photos were stored.
                  </p>
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowIntegrationNotice(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#1B382B] bg-white border border-[#EFECE4] hover:bg-black/5 transition-colors"
                >
                  Dismiss notice
                </button>
              </div>
            </div>
          )}

          {/* Submission Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            {/* SECTION 1: Parent / Guardian Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F5F2EA]">
                <span className="w-6 h-6 rounded-full bg-[#234E3D]/10 text-[#234E3D] flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <h3 className="text-sm font-bold text-[#1B382B] uppercase tracking-wide">
                  Parent / Guardian Details
                </h3>
              </div>

              {/* 1-Click Google Sign-In Status / Banner */}
              {authUser ? (
                <div className="p-3.5 rounded-2xl bg-[#234E3D]/5 border border-[#234E3D]/15 flex items-center justify-between text-xs text-[#1B382B]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#234E3D]" />
                    <span>
                      Signed in as <strong>{authUser.email}</strong> (Verified parent)
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#234E3D] bg-white px-2.5 py-0.5 rounded-full border border-[#234E3D]/20">
                    Auto-filled ✓
                  </span>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EFECE4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#1B382B]">
                      ⚡ Fast Submission
                    </p>
                    <p className="text-[11px] text-[#5A6D61]">
                      Sign in with Google to auto-fill your name & email.
                    </p>
                  </div>
                  <GoogleSignInButton
                    redirectTo={`/contests/${contestSlug}/submit`}
                    label="Sign in with Google"
                    className="text-xs py-2 px-4 shadow-none"
                  />
                </div>
              )}

              {/* Guardian Name */}
              <div className="space-y-1.5" id="guardianName">
                <label htmlFor="guardian-name" className="block text-xs sm:text-sm font-semibold text-[#1B382B]">
                  Parent / guardian full name <span className="text-[#F2653B]">*</span>
                </label>
                <input
                  id="guardian-name"
                  type="text"
                  value={formData.guardianName}
                  onChange={(e) => handleTextChange("guardianName", e.target.value)}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 rounded-xl text-sm bg-[#FAF8F5] border text-[#1B382B] placeholder:text-[#5A6D61]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#234E3D] transition-all ${errors.guardianName ? "border-red-400 bg-red-50/20" : "border-[#EFECE4]"
                    }`}
                />
                {errors.guardianName && (
                  <p className="text-xs font-medium text-red-600">{errors.guardianName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Address */}
                <div className="space-y-1.5" id="email">
                  <label htmlFor="guardian-email" className="block text-xs sm:text-sm font-semibold text-[#1B382B]">
                    Email address <span className="text-[#F2653B]">*</span>
                  </label>
                  <input
                    id="guardian-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleTextChange("email", e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full px-4 py-3 rounded-xl text-sm bg-[#FAF8F5] border text-[#1B382B] placeholder:text-[#5A6D61]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#234E3D] transition-all ${errors.email ? "border-red-400 bg-red-50/20" : "border-[#EFECE4]"
                      }`}
                  />
                  {errors.email && (
                    <p className="text-xs font-medium text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5" id="phone">
                  <label htmlFor="guardian-phone" className="block text-xs sm:text-sm font-semibold text-[#1B382B]">
                    Phone number <span className="text-[#F2653B]">*</span>
                  </label>
                  <input
                    id="guardian-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleTextChange("phone", e.target.value)}
                    placeholder="+91 00000 00000"
                    className={`w-full px-4 py-3 rounded-xl text-sm bg-[#FAF8F5] border text-[#1B382B] placeholder:text-[#5A6D61]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#234E3D] transition-all ${errors.phone ? "border-red-400 bg-red-50/20" : "border-[#EFECE4]"
                      }`}
                  />
                  {errors.phone && (
                    <p className="text-xs font-medium text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 2: Baby's Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F5F2EA]">
                <span className="w-6 h-6 rounded-full bg-[#234E3D]/10 text-[#234E3D] flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <h3 className="text-sm font-bold text-[#1B382B] uppercase tracking-wide">
                  Baby’s Details
                </h3>
              </div>

              {/* Baby Display Name */}
              <div className="space-y-1.5" id="childDisplayName">
                <label htmlFor="child-name" className="block text-xs sm:text-sm font-semibold text-[#1B382B]">
                  Baby’s display name <span className="text-[#F2653B]">*</span>
                </label>
                <input
                  id="child-name"
                  type="text"
                  value={formData.childDisplayName}
                  onChange={(e) => handleTextChange("childDisplayName", e.target.value)}
                  placeholder="Name shown on the contest page"
                  className={`w-full px-4 py-3 rounded-xl text-sm bg-[#FAF8F5] border text-[#1B382B] placeholder:text-[#5A6D61]/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#234E3D] transition-all ${errors.childDisplayName ? "border-red-400 bg-red-50/20" : "border-[#EFECE4]"
                    }`}
                />
                {errors.childDisplayName && (
                  <p className="text-xs font-medium text-red-600">{errors.childDisplayName}</p>
                )}
              </div>

              {/* Baby Date of Birth with Usable Calendar */}
              <div className="space-y-1.5" id="childDateOfBirth">
                <div className="flex items-center justify-between">
                  <label className="block text-xs sm:text-sm font-semibold text-[#1B382B]">
                    Baby’s date of birth <span className="text-[#F2653B]">*</span>
                  </label>
                  <span className="text-[11px] text-[#5A6D61] font-medium">Never shown publicly</span>
                </div>

                <DatePickerCalendar
                  value={formData.childDateOfBirth}
                  onChange={(dateStr) => handleTextChange("childDateOfBirth", dateStr)}
                  error={errors.childDateOfBirth}
                />

                <p className="text-[11px] text-[#5A6D61]">
                  Used strictly for category verification. Future dates are disabled.
                </p>
                {errors.childDateOfBirth && (
                  <p className="text-xs font-medium text-red-600">{errors.childDateOfBirth}</p>
                )}
              </div>
            </div>

            {/* SECTION 3: Baby's Age Category (Selectable Cards) */}
            <div className="space-y-4" id="ageCategory">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F5F2EA]">
                <span className="w-6 h-6 rounded-full bg-[#234E3D]/10 text-[#234E3D] flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <h3 className="text-sm font-bold text-[#1B382B] uppercase tracking-wide">
                  Baby’s Age Category
                </h3>
              </div>

              <AgeCategorySelector
                selected={formData.ageCategory}
                onChange={(cat: BabyAgeCategory) => {
                  setFormData((prev) => ({ ...prev, ageCategory: cat }));
                  if (errors.ageCategory) {
                    setErrors((prev) => ({ ...prev, ageCategory: undefined }));
                  }
                }}
                error={errors.ageCategory}
              />
            </div>

            {/* SECTION 4: Upload a Photo */}
            <div className="space-y-4" id="photo">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F5F2EA]">
                <span className="w-6 h-6 rounded-full bg-[#234E3D]/10 text-[#234E3D] flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <h3 className="text-sm font-bold text-[#1B382B] uppercase tracking-wide">
                  Upload a Photo
                </h3>
              </div>

              <PhotoDropzone
                onPhotoSelected={(file) => {
                  setFormData((prev) => ({ ...prev, photo: file }));
                  if (errors.photo) {
                    setErrors((prev) => ({ ...prev, photo: undefined }));
                  }
                }}
                error={errors.photo}
              />
            </div>

            {/* SECTION 5: Consent and Confirmation */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-[#F5F2EA]">
                <span className="w-6 h-6 rounded-full bg-[#234E3D]/10 text-[#234E3D] flex items-center justify-center text-xs font-bold">
                  5
                </span>
                <h3 className="text-sm font-bold text-[#1B382B] uppercase tracking-wide">
                  Consent & Confirmation
                </h3>
              </div>

              <div className="space-y-3 pt-1">
                {/* Consent 1 */}
                <label className="flex items-start gap-3 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    checked={formData.consentGuardian}
                    onChange={(e) => handleCheckboxChange("consentGuardian", e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#234E3D] focus:ring-[#234E3D] border-[#EFECE4]"
                  />
                  <span className="text-xs sm:text-sm text-[#4A5D52] group-hover:text-[#1B382B] leading-snug">
                    I confirm I am the child’s parent or legal guardian. <span className="text-[#F2653B]">*</span>
                  </span>
                </label>
                {errors.consentGuardian && (
                  <p className="text-xs font-medium text-red-600 pl-7">{errors.consentGuardian}</p>
                )}

                {/* Consent 2 */}
                <label className="flex items-start gap-3 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    checked={formData.consentSharing}
                    onChange={(e) => handleCheckboxChange("consentSharing", e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#234E3D] focus:ring-[#234E3D] border-[#EFECE4]"
                  />
                  <span className="text-xs sm:text-sm text-[#4A5D52] group-hover:text-[#1B382B] leading-snug">
                    I have permission to submit and share this photo. <span className="text-[#F2653B]">*</span>
                  </span>
                </label>
                {errors.consentSharing && (
                  <p className="text-xs font-medium text-red-600 pl-7">{errors.consentSharing}</p>
                )}

                {/* Consent 3 */}
                <label className="flex items-start gap-3 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    checked={formData.consentRules}
                    onChange={(e) => handleCheckboxChange("consentRules", e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#234E3D] focus:ring-[#234E3D] border-[#EFECE4]"
                  />
                  <span className="text-xs sm:text-sm text-[#4A5D52] group-hover:text-[#1B382B] leading-snug">
                    I have read and agree to the contest rules and privacy notice. <span className="text-[#F2653B]">*</span>
                  </span>
                </label>
                {errors.consentRules && (
                  <p className="text-xs font-medium text-red-600 pl-7">{errors.consentRules}</p>
                )}
              </div>
            </div>

            {/* Server Error Feedback */}
            {submitError && (
              <div
                role="alert"
                className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm font-medium text-red-700"
              >
                {submitError}
              </div>
            )}

            {/* Primary Submit Action Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-full text-sm sm:text-base font-semibold text-white bg-[#234E3D] hover:bg-[#1A3B2E] active:scale-[0.99] transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
              >
                <span>Submit your entry</span>
                <span className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">
                  ↗
                </span>
              </button>
            </div>

            {/* Microcopy below button */}
            <p className="text-center text-[11px] text-[#5A6D61] leading-relaxed pt-1">
              Your entry is not public until automated checks pass. Final consent wording needs legal review.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
