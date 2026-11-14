"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  direction?: "up" | "fade" | "scale";
}

export default function ScrollReveal({
  children,
  className = "",
  delayMs = 0,
  direction = "up",
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
      observer.disconnect();
    };
  }, []);

  const getTransitionStyle = () => {
    if (direction === "up") {
      return isVisible
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-7";
    }
    if (direction === "scale") {
      return isVisible
        ? "opacity-100 scale-100"
        : "opacity-0 scale-[0.97]";
    }
    return isVisible ? "opacity-100" : "opacity-0";
  };

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 ${getTransitionStyle()} ${className}`}
      style={{
        transitionDelay: isVisible && delayMs ? `${delayMs}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
