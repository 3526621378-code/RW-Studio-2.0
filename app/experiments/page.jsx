import Link from "next/link";
import { ArtLab } from "@/app/components/lab/ArtLab";
import { PageFrame } from "@/app/components/PageFrame";
import { PhaseSection } from "@/app/components/timescape/PhaseSection";
import { experiment } from "@/app/data/site-content";

export const metadata = {
  title: "Experiments",
  description: "RW Studio 的可交互数字艺术实验空间。",
};

export default function ExperimentsPage() {
  return (
    <PageFrame className="content-page experiments-page">
      <PhaseSection phase="dusk" className="lab-page-section">
        <div className="section-shell">
          <header className="lab-page-heading">
            <div>
              <p className="page-eyebrow">Experiments / 实验空间</p>
              <h1>RW Lab</h1>
            </div>
            <div>
              <p>
                An open workbench for motion, atmosphere and generative
                landscapes.
              </p>
              <span>Real-time / In browser / No upload</span>
            </div>
          </header>
          <ArtLab />
        </div>
      </PhaseSection>

      <PhaseSection phase="mist" className="featured-study-section">
        <div className="section-shell featured-study-layout">
          <p className="section-index">Featured study</p>
          <div className="featured-study-number">001</div>
          <div className="featured-study-title">
            <p>{experiment.status}</p>
            <h2>{experiment.title}</h2>
            <span>{experiment.titleZh}</span>
          </div>
          <div className="featured-study-copy">
            <p>{experiment.description}</p>
            <p>{experiment.descriptionZh}</p>
            <Link
              className="primary-action"
              href="/experiments/first-mist-realm"
            >
              <span>Open project study</span>
              <small>进入若雾初境</small>
            </Link>
          </div>
        </div>
      </PhaseSection>
    </PageFrame>
  );
}
