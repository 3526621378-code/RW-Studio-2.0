"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect } from "react";
import { InkParticleField } from "@/app/components/home/InkParticleField";
import { timescapePhases } from "@/app/data/site-content";
import { useTimescape } from "./TimescapeProvider";

const SPRING = { stiffness: 42, damping: 24, mass: 0.7 };

export function TimescapeStage() {
  const { phase } = useTimescape();
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scrollY = useTransform(scrollYProgress, [0, 1], ["0%", "-2.6%"]);
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1.035, 1.095]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, SPRING);
  const smoothY = useSpring(pointerY, SPRING);

  useEffect(() => {
    if (reduceMotion) return undefined;

    function followPointer(event) {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;

      pointerX.set(x * -15);
      pointerY.set(y * -10);
    }

    function resetPointer() {
      pointerX.set(0);
      pointerY.set(0);
    }

    window.addEventListener("pointermove", followPointer, { passive: true });
    document.documentElement.addEventListener("mouseleave", resetPointer);

    return () => {
      window.removeEventListener("pointermove", followPointer);
      document.documentElement.removeEventListener("mouseleave", resetPointer);
    };
  }, [pointerX, pointerY, reduceMotion]);

  return (
    <div className="timescape-stage" aria-hidden="true">
      <motion.div
        className="timescape-scroll-camera"
        style={
          reduceMotion
            ? undefined
            : { y: scrollY, scale: scrollScale }
        }
      >
        <motion.div
          className="timescape-pointer-camera"
          style={reduceMotion ? undefined : { x: smoothX, y: smoothY }}
        >
          {timescapePhases.map((item, index) => (
            <picture
              className={`timescape-image timescape-image-${item.id} ${
                phase === item.id ? "is-active" : ""
              }`}
              key={item.id}
            >
              <source
                media="(max-width: 720px)"
                srcSet={`/timescape/${item.id}-mobile.jpg`}
              />
              <img
                src={`/timescape/${item.id}-desktop.jpg`}
                alt=""
                width="1672"
                height="941"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
              />
            </picture>
          ))}
        </motion.div>
      </motion.div>

      <div className="timescape-wash" />
      <div className="timescape-fog timescape-fog-a" />
      <div className="timescape-fog timescape-fog-b" />
      <div className="timescape-grain" />
      <InkParticleField />
    </div>
  );
}
