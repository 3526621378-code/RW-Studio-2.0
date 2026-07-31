"use client";

import { useEffect } from "react";
import { useTimescape } from "./TimescapeProvider";

export function PhaseSync({ phase }) {
  const { setPhase } = useTimescape();

  useEffect(() => {
    setPhase(phase);
  }, [phase, setPhase]);

  return null;
}
