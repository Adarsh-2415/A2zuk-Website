"use client";

import { useState, useRef, useEffect, useMemo } from "react";

interface DatePickerCalendarProps {
  value: string; // ISO format "YYYY-MM-DD" or empty
  onChange: (val: string) => void;
  error?: string;
  id?: string;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function DatePickerCalendar({
  value,
  onChange,
  error,
  id = "baby-dob-picker",
}: DatePickerCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Today reference (deferred to useEffect to comply with Next.js 16 Partial Prerendering)
  const [today, setToday] = useState<Date | null>(null);

  // Parse current value or default to null
  const selectedDate = useMemo(() => {
    if (!value) return null;
    const parts = value.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return isNaN(d.getTime()) ? null : d;
    }
    return null;
  }, [value]);

  // Current view month & year (stable SSR defaults)
  const [viewYear, setViewYear] = useState(() => (selectedDate ? selectedDate.getFullYear() : 2026));
  const [viewMonth, setViewMonth] = useState(() => (selectedDate ? selectedDate.getMonth() : 9));


  // Minimum allowable DOB (strictly 24 months / 2 years ago)
  const minDate = useMemo(() => {
    if (!today) return null;
    return new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
  }, [today]);

  // Year choices: strictly up to 2 years ago (matches 24-month contest limit)
  const yearOptions = useMemo(() => {
    const currentYear = today ? today.getFullYear() : 2026;
    return [currentYear, currentYear - 1, currentYear - 2];
  }, [today]);

  // Sync view when value changes externally (React 19 pattern without effect)
  const [prevValue, setPrevValue] = useState<string>(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (selectedDate) {
      setViewYear(selectedDate.getFullYear());
      setViewMonth(selectedDate.getMonth());
    }
  }

  // Close calendar on outside click & Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Calculate calendar days
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const days: {
      day: number;
      isCurrentMonth: boolean;
      isFuture: boolean;
      isTooOld: boolean;
      isDisabled: boolean;
      isSelected: boolean;
      isToday: boolean;
      dateString: string;
    }[] = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
      const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
      const dateObj = new Date(prevYear, prevMonth, dayNum);
      const isFuture = today ? dateObj.getTime() > today.getTime() : false;
      const isTooOld = minDate ? dateObj.getTime() < minDate.getTime() : false;
      const monthStr = String(prevMonth + 1).padStart(2, "0");
      const dayStr = String(dayNum).padStart(2, "0");

      days.push({
        day: dayNum,
        isCurrentMonth: false,
        isFuture,
        isTooOld,
        isDisabled: isFuture || isTooOld,
        isSelected: false,
        isToday: false,
        dateString: `${prevYear}-${monthStr}-${dayStr}`,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const dateObj = new Date(viewYear, viewMonth, day);
      const isFuture = today ? dateObj.getTime() > today.getTime() : false;
      const isTooOld = minDate ? dateObj.getTime() < minDate.getTime() : false;
      const isToday = today ? dateObj.getTime() === today.getTime() : false;
      const isSelected = selectedDate
        ? selectedDate.getFullYear() === viewYear &&
        selectedDate.getMonth() === viewMonth &&
        selectedDate.getDate() === day
        : false;

      const monthStr = String(viewMonth + 1).padStart(2, "0");
      const dayStr = String(day).padStart(2, "0");

      days.push({
        day,
        isCurrentMonth: true,
        isFuture,
        isTooOld,
        isDisabled: isFuture || isTooOld,
        isSelected,
        isToday,
        dateString: `${viewYear}-${monthStr}-${dayStr}`,
      });
    }

    // Next month padding to fill grid to 35 or 42 cells
    const remaining = 42 - days.length;
    for (let day = 1; day <= remaining; day++) {
      const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
      const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
      const dateObj = new Date(nextYear, nextMonth, day);
      const isFuture = today ? dateObj.getTime() > today.getTime() : false;
      const isTooOld = minDate ? dateObj.getTime() < minDate.getTime() : false;
      const monthStr = String(nextMonth + 1).padStart(2, "0");
      const dayStr = String(day).padStart(2, "0");

      days.push({
        day,
        isCurrentMonth: false,
        isFuture,
        isTooOld,
        isDisabled: isFuture || isTooOld,
        isSelected: false,
        isToday: false,
        dateString: `${nextYear}-${monthStr}-${dayStr}`,
      });
    }

    return days;
  }, [viewYear, viewMonth, selectedDate, today, minDate]);

  // Prev navigation guard: prevent navigating prior to minDate (24 months ago)
  const canNavigatePrev = useMemo(() => {
    if (!minDate) return true;
    if (viewYear < minDate.getFullYear()) return false;
    if (viewYear === minDate.getFullYear() && viewMonth <= minDate.getMonth()) return false;
    return true;
  }, [viewYear, viewMonth, minDate]);

  // Navigate months
  const handlePrevMonth = () => {
    if (!canNavigatePrev) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    // Prevent navigating into future months beyond today's year & month
    if (today && viewYear === today.getFullYear() && viewMonth >= today.getMonth()) {
      return;
    }
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Format readable display date (e.g., "14 October 2024")
  const displayFormattedDate = useMemo(() => {
    if (!selectedDate) return "";
    return selectedDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [selectedDate]);

  const canNavigateNext = today
    ? !(viewYear === today.getFullYear() && viewMonth >= today.getMonth())
    : true;

  const handleToggleCalendar = () => {
    if (!isOpen && !today) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      setToday(now);
      if (!selectedDate) {
        setViewYear(now.getFullYear());
        setViewMonth(now.getMonth());
      }
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Date Trigger Field */}
      <div
        onClick={handleToggleCalendar}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm bg-[#FAF8F5] border cursor-pointer hover:bg-white transition-all ${isOpen ? "ring-2 ring-[#234E3D] border-transparent bg-white shadow-xs" : error ? "border-red-400 bg-red-50/20" : "border-[#EFECE4]"
          }`}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label="Select baby date of birth"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleToggleCalendar();
          }
        }}
      >
        <span className={displayFormattedDate ? "text-[#1B382B] font-semibold" : "text-[#5A6D61]/60"}>
          {displayFormattedDate || "Select date of birth (DD / MM / YYYY)"}
        </span>

        {/* Functional Calendar Icon */}
        <div className="flex items-center gap-1.5 text-[#234E3D]">
          <svg className="w-5 h-5 text-[#234E3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* Hidden Accessible Form Input */}
      <input type="hidden" id={id} name="childDateOfBirth" value={value} />

      {/* Calendar Dropdown Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Date of birth calendar"
          className="absolute left-0 top-full mt-2 w-full max-w-sm rounded-2xl bg-white border border-[#EFECE4] shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top"
        >
          {/* Calendar Header with Month/Year Navigation */}
          <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-[#F5F2EA]">
            {/* Prev Month Button */}
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={!canNavigatePrev}
              aria-label="Previous month"
              className={`p-1.5 rounded-lg text-[#1B382B] transition-all ${canNavigatePrev ? "hover:bg-black/5 active:scale-95" : "opacity-25 cursor-not-allowed"
                }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Month & Year Selectors */}
            <div className="flex items-center gap-1.5">
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
                className="px-2 py-1 rounded-lg text-xs font-bold text-[#1B382B] bg-[#FAF8F5] border border-[#EFECE4] focus:outline-none focus:ring-1 focus:ring-[#234E3D]"
                aria-label="Select month"
              >
                {MONTHS.map((m, idx) => {
                  // Disable future months in current year or past months beyond 24 months
                  const isFutureMonth = today
                    ? viewYear === today.getFullYear() && idx > today.getMonth()
                    : false;
                  const isPastMonth = minDate
                    ? viewYear === minDate.getFullYear() && idx < minDate.getMonth()
                    : false;
                  return (
                    <option key={m} value={idx} disabled={isFutureMonth || isPastMonth}>
                      {m}
                    </option>
                  );
                })}
              </select>

              <select
                value={viewYear}
                onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
                className="px-2 py-1 rounded-lg text-xs font-bold text-[#1B382B] bg-[#FAF8F5] border border-[#EFECE4] focus:outline-none focus:ring-1 focus:ring-[#234E3D]"
                aria-label="Select year"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Next Month Button */}
            <button
              type="button"
              onClick={handleNextMonth}
              disabled={!canNavigateNext}
              aria-label="Next month"
              className={`p-1.5 rounded-lg text-[#1B382B] transition-all ${canNavigateNext ? "hover:bg-black/5 active:scale-95" : "opacity-25 cursor-not-allowed"
                }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAYS_OF_WEEK.map((d) => (
              <span key={d} className="text-[11px] font-semibold text-[#5A6D61] py-1">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((cell, idx) => {
              if (cell.isDisabled) {
                return (
                  <div
                    key={idx}
                    className="h-8 flex items-center justify-center text-xs text-black/20 cursor-not-allowed select-none"
                    aria-disabled="true"
                    title={cell.isFuture ? "Future dates not allowed" : "Baby must be 24 months (2 years) or younger"}
                  >
                    {cell.day}
                  </div>
                );
              }

              if (!cell.isCurrentMonth) {
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onChange(cell.dateString);
                      setIsOpen(false);
                    }}
                    className="h-8 flex items-center justify-center text-xs text-black/30 hover:bg-black/5 rounded-lg transition-colors"
                  >
                    {cell.day}
                  </button>
                );
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChange(cell.dateString);
                    setIsOpen(false);
                  }}
                  className={`h-8 w-full flex items-center justify-center text-xs font-semibold rounded-lg transition-all duration-150 ${cell.isSelected
                      ? "bg-[#234E3D] text-white shadow-xs font-bold scale-105"
                      : cell.isToday
                        ? "border border-[#234E3D] text-[#234E3D] font-bold hover:bg-[#234E3D]/10"
                        : "text-[#1B382B] hover:bg-[#D4E865]/40 hover:text-[#1B382B]"
                    }`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {/* Popover Footer with Clear & Close */}
          <div className="mt-3 pt-2.5 border-t border-[#F5F2EA] flex items-center justify-between text-xs">
            <span className="text-[11px] text-[#5A6D61]">Only up to 24 months (2 yrs) allowed</span>
            <div className="flex items-center gap-2">
              {value && (
                <button
                  type="button"
                  onClick={() => {
                    onChange("");
                    setIsOpen(false);
                  }}
                  className="text-[11px] font-semibold text-red-600 hover:underline"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#1B382B] bg-[#FAF8F5] hover:bg-black/5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
