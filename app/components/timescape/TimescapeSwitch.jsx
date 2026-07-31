"use client";

import { timescapePhases } from "@/app/data/site-content";
import { useTimescape } from "./TimescapeProvider";

export function TimescapeSwitch() {
  const { phase, setPhase } = useTimescape();

  return (
    <div className="timescape-switch" aria-label="选择山水时境">
      <span className="timescape-switch-label">Timescape</span>
      <div className="timescape-options" role="group">
        {timescapePhases.map((item) => (
          <button
            type="button"
            key={item.id}
            className={phase === item.id ? "is-active" : ""}
            aria-pressed={phase === item.id}
            aria-label={`${item.label} ${item.labelZh}`}
            onClick={() => setPhase(item.id)}
          >
            <span>{item.label}</span>
            <small>{item.labelZh}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
