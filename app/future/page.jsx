import Link from "next/link";
import { PageFrame } from "@/app/components/PageFrame";
import { PhaseSection } from "@/app/components/timescape/PhaseSection";
import { futureDirections } from "@/app/data/site-content";

export const metadata = {
  title: "Future",
  description: "RW Studio 从交互数字实验走向 AI 共创与空间艺术的未来方向。",
};

const phases = ["dawn", "dusk", "night"];

export default function FuturePage() {
  return (
    <PageFrame className="content-page future-page">
      <PhaseSection phase="mist" className="future-hero">
        <div className="section-shell future-hero-layout">
          <p className="page-eyebrow">Future / 未来方向</p>
          <h1>
            Fields yet
            <span>to take form.</span>
          </h1>
          <div>
            <p>
              We are building a path from intimate browser experiments to
              creative intelligence and responsive physical space.
            </p>
            <p>尚未成形的边界，正等待被感知。</p>
          </div>
        </div>
      </PhaseSection>

      {futureDirections.map((direction, index) => (
        <PhaseSection
          phase={phases[index]}
          className="future-direction-section"
          key={direction.index}
        >
          <article className="section-shell future-direction">
            <div className="future-direction-index">
              <span>{direction.index}</span>
              <small>{String(index + 1).padStart(2, "0")}</small>
            </div>
            <div className="future-direction-title">
              <p>Field of possibility</p>
              <h2>{direction.title}</h2>
              <span>{direction.titleZh}</span>
            </div>
            <div className="future-direction-copy">
              <p>{direction.description}</p>
              <div className="future-status">
                <span />
                In development
              </div>
            </div>
          </article>
        </PhaseSection>
      ))}

      <PhaseSection phase="night" className="future-closing">
        <div className="section-shell">
          <p>The next medium may not have a name yet.</p>
          <h2>We are preparing the conditions for it to appear.</h2>
          <Link className="primary-action primary-action-light" href="/experiments">
            <span>Explore what exists now</span>
            <small>回到实验空间</small>
          </Link>
        </div>
      </PhaseSection>
    </PageFrame>
  );
}
