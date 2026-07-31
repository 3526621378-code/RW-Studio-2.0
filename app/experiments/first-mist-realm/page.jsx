import Link from "next/link";
import { ArtLab } from "@/app/components/lab/ArtLab";
import { PageFrame } from "@/app/components/PageFrame";
import { PhaseSection } from "@/app/components/timescape/PhaseSection";
import { experiment } from "@/app/data/site-content";

export const metadata = {
  title: "The First Mist Realm",
  description: "若雾初境，RW Studio 的第一项数字山水实验。",
};

const process = [
  ["Field", "A layered terrain establishes distance without fixing a single point of view."],
  ["Breath", "Slow procedural movement gives mist its own rhythm and pauses."],
  ["Trace", "The visitor’s movement leaves a temporary luminous response in the field."],
];

export default function FirstMistRealmPage() {
  return (
    <PageFrame className="content-page project-detail-page">
      <PhaseSection phase="mist" className="project-detail-hero">
        <div className="section-shell project-detail-heading">
          <p className="page-eyebrow">{experiment.index} / Ongoing study</p>
          <div>
            <h1>{experiment.title}</h1>
            <p>{experiment.titleZh}</p>
          </div>
          <p className="project-detail-lead">{experiment.description}</p>
          <a className="text-action" href="#live-study">
            Enter the live field
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </PhaseSection>

      <PhaseSection
        phase="dusk"
        className="project-live-section"
        id="live-study"
      >
        <div className="section-shell">
          <div className="project-live-intro">
            <p className="section-index">Live study / 实时实验</p>
            <p>
              This browser version is a living sketch. Adjust its atmosphere,
              move across the field and save a temporary state.
            </p>
          </div>
          <ArtLab />
        </div>
      </PhaseSection>

      <PhaseSection phase="night" className="project-process-section">
        <div className="section-shell project-process-layout">
          <div>
            <p className="section-index">Process notes</p>
            <h2>A scene assembled from distance, breath and trace.</h2>
            <p>{experiment.descriptionZh}</p>
          </div>
          <ol>
            {process.map(([title, copy], index) => (
              <li key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </li>
            ))}
          </ol>
          <Link className="text-action" href="/experiments">
            Back to RW Lab
            <span aria-hidden="true">←</span>
          </Link>
        </div>
      </PhaseSection>
    </PageFrame>
  );
}
