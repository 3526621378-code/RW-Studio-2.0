"use client";

import { useEffect, useRef } from "react";
import { useTimescape } from "./TimescapeProvider";

export function PhaseSection({
  phase,
  as: Tag = "section",
  className = "",
  children,
  ...props
}) {
  const sectionRef = useRef(null);
  const { setPhase } = useTimescape();

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPhase(phase);
      },
      {
        rootMargin: "-34% 0px -44% 0px",
        threshold: 0,
      },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [phase, setPhase]);

  return (
    <Tag
      ref={sectionRef}
      className={`phase-section phase-${phase} ${className}`.trim()}
      data-phase={phase}
      {...props}
    >
      {children}
    </Tag>
  );
}
