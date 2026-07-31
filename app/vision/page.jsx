import Link from "next/link";
import { PageFrame } from "@/app/components/PageFrame";
import { PhaseSection } from "@/app/components/timescape/PhaseSection";
import { visionContent } from "@/app/data/site-content";

export const metadata = {
  title: "Vision",
  description: "RW Studio 关于东方美学、数字艺术与未来技术的创作理念。",
};

const principles = [
  {
    title: "Tradition as material",
    titleZh: "传统作为材料",
    copy: "We study rhythm, distance, emptiness and atmosphere, then translate them rather than imitate their surface.",
  },
  {
    title: "Technology as medium",
    titleZh: "技术作为媒介",
    copy: "Code, algorithms and AI are treated as artistic materials whose limits can become part of the work.",
  },
  {
    title: "Interaction as encounter",
    titleZh: "交互作为相遇",
    copy: "A digital work becomes alive when it can notice time, movement and the person standing before it.",
  },
];

export default function VisionPage() {
  return (
    <PageFrame className="content-page vision-page">
      <PhaseSection phase="mist" className="inner-hero">
        <div className="section-shell inner-hero-layout">
          <p className="page-eyebrow">{visionContent.eyebrow}</p>
          <h1>
            {visionContent.title.split("\n").map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="inner-hero-zh">{visionContent.titleZh}</p>
          <div className="inner-hero-note">
            <p>{visionContent.lead}</p>
            <span>Scroll to read the manifesto</span>
          </div>
        </div>
      </PhaseSection>

      <PhaseSection phase="dawn" className="belief-section">
        <div className="section-shell belief-layout">
          <p className="section-index">Belief / 相信</p>
          <blockquote>
            <p>{visionContent.statement}</p>
            <footer>
              The past does not disappear. It changes its way of being present.
            </footer>
          </blockquote>
        </div>
      </PhaseSection>

      <PhaseSection phase="dusk" className="principles-section">
        <div className="section-shell">
          <div className="section-heading split-heading">
            <div>
              <p className="section-index">Working principles</p>
              <h2>Three materials. One continuous practice.</h2>
            </div>
            <p>
              Our process moves between looking, testing and making. The result
              may be a webpage, a generated image or a future spatial work.
            </p>
          </div>
          <div className="principles-grid">
            {principles.map((principle) => (
              <article key={principle.title}>
                <span aria-hidden="true" />
                <h3>{principle.title}</h3>
                <p className="principle-zh">{principle.titleZh}</p>
                <p>{principle.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </PhaseSection>

      <PhaseSection phase="night" className="intersection-section">
        <div className="section-shell intersection-layout">
          <p className="section-index">The studio / 工作室</p>
          <div className="discipline discipline-tech">
            <span>Technology exploration</span>
            <h2>Systems that can sense, respond and evolve.</h2>
            <p>Automation / AI / Web interaction / Creative technology</p>
          </div>
          <strong className="intersection-mark" aria-hidden="true">
            ×
          </strong>
          <div className="discipline discipline-art">
            <span>Artistic expression</span>
            <h2>Images that preserve breath, distance and ambiguity.</h2>
            <p>Digital media / Visual design / Eastern aesthetics</p>
          </div>
          <div className="intersection-action">
            <Link className="primary-action primary-action-light" href="/experiments">
              <span>Enter the experiments</span>
              <small>进入实验空间</small>
            </Link>
          </div>
        </div>
      </PhaseSection>
    </PageFrame>
  );
}
