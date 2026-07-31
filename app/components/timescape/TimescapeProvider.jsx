"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { timescapePhases } from "@/app/data/site-content";

const TimescapeContext = createContext(null);
const PHASE_IDS = new Set(timescapePhases.map((phase) => phase.id));

export function TimescapeProvider({ children }) {
  const [phase, setPhaseState] = useState("dawn");
  const setPhase = useCallback((nextPhase) => {
    if (PHASE_IDS.has(nextPhase)) setPhaseState(nextPhase);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.timescape = phase;
    window.localStorage.setItem("rw-timescape", phase);
  }, [phase]);

  const value = useMemo(
    () => ({ phase, setPhase }),
    [phase, setPhase],
  );

  return (
    <TimescapeContext.Provider value={value}>
      {children}
    </TimescapeContext.Provider>
  );
}

export function useTimescape() {
  const context = useContext(TimescapeContext);

  if (!context) {
    throw new Error("useTimescape must be used inside TimescapeProvider.");
  }

  return context;
}
