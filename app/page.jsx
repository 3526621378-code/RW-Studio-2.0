import Link from "next/link";
import { ArtLab } from "@/app/components/lab/ArtLab";
import { PageFrame } from "@/app/components/PageFrame";
import { SiteCompliance } from "@/app/components/SiteCompliance";
import { PhaseSection } from "@/app/components/timescape/PhaseSection";
import {
  experiment,
  homeContent,
  practices,
} from "@/app/data/site-content";

export default function HomePage() {
  return (
    <PageFrame className="home-page">
      <PhaseSection
        phase="dawn"
        className="hero-section"
        aria-labelledby="studio-title"
      >
        <div className="section-shell hero-layout">
          <div className="hero-meta">
            <p>Independent digital art studio</p>
            <span>Shanghai / Digital realm</span>
          </div>

          <div className="hero-copy">
            <p className="hero-kicker">Eastern Digital Art</p>
            <h1 id="studio-title">{homeContent.studioName}</h1>
            <p className="hero-name-zh">{homeContent.studioNameZh}</p>
            <p className="hero-discipline">
              {homeContent.discipline.split("\n").map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <p className="hero-statement">{homeContent.statement}</p>
          </div>

          <div className="hero-actions">
            <a className="primary-action" href="#manifesto">
              <span>Enter the timescape</span>
              <small>进入时境</small>
            </a>
            <Link className="text-action" href="/experiments">
              Open RW Lab
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <p className="scroll-cue">
            <span />
            Scroll to shift the hour
          </p>
        </div>
      </PhaseSection>

      <PhaseSection
        phase="mist"
        className="manifesto-section"
        id="manifesto"
        aria-labelledby="manifesto-title"
      >
        <div className="section-shell manifesto-layout">
          <p className="section-index">01 / Manifesto</p>
          <div className="manifesto-heading">
            <h2 id="manifesto-title">
              Tradition is not a style to repeat.
              <span>It is a way of seeing.</span>
            </h2>
            <p>传统不是被重复的风格，而是一种观看世界的方法。</p>
          </div>

          <div className="manifesto-notes">
            <p>
              RW Studio explores the relationship between Eastern aesthetics
              and emerging technologies.
            </p>
            <p lang="zh-CN">
              我们把山水的层次、空白与气韵，转译为运动、算法与可被感知的数字空间。
            </p>
          </div>

          <div className="practice-axis" aria-label="工作室的双重实践">
            <div>
              <span>Technology exploration</span>
              <small>Automation / AI / Web interaction</small>
            </div>
            <strong aria-hidden="true">×</strong>
            <div>
              <span>Artistic expression</span>
              <small>Digital media / Visual design / Eastern aesthetics</small>
            </div>
          </div>
        </div>
      </PhaseSection>

      <PhaseSection
        phase="dusk"
        className="lab-preview-section"
        aria-labelledby="lab-preview-title"
      >
        <div className="section-shell">
          <div className="section-heading split-heading">
            <div>
              <p className="section-index">02 / Live study</p>
              <h2 id="lab-preview-title">A landscape that listens.</h2>
            </div>
            <div>
              <p>
                Change the field, then move through it. Each setting creates a
                temporary atmosphere rather than a final image.
              </p>
              <Link className="text-action" href="/experiments">
                Enter full experiment
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
          <ArtLab compact />
        </div>
      </PhaseSection>

      <PhaseSection
        phase="dusk"
        className="project-section"
        aria-labelledby="project-title"
      >
        <div className="section-shell project-layout">
          <div className="project-number">
            <span>Project</span>
            <strong>001</strong>
          </div>

          <div className="project-title-block">
            <p className="section-index">{experiment.status}</p>
            <h2 id="project-title">{experiment.title}</h2>
            <p>{experiment.titleZh}</p>
          </div>

          <div className="project-summary">
            <p>{experiment.description}</p>
            <p lang="zh-CN">{experiment.descriptionZh}</p>
            <Link
              className="primary-action primary-action-dark"
              href="/experiments/first-mist-realm"
            >
              <span>View the study</span>
              <small>查看实验</small>
            </Link>
          </div>
        </div>
      </PhaseSection>

      <PhaseSection
        phase="night"
        className="practices-section"
        aria-labelledby="practices-title"
      >
        <div className="section-shell">
          <div className="section-heading practices-heading">
            <p className="section-index">03 / Fields of practice</p>
            <h2 id="practices-title">
              From the browser
              <span>into space.</span>
            </h2>
          </div>

          <ol className="practices-list">
            {practices.map((practice, index) => (
              <li key={practice.title}>
                <span className="practice-count">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{practice.title}</h3>
                  <p>{practice.titleZh}</p>
                </div>
                <p>{practice.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </PhaseSection>

      <PhaseSection
        phase="night"
        className="closing-section"
        aria-labelledby="closing-title"
      >
        <div className="section-shell closing-layout">
          <p className="section-index">04 / Horizon</p>
          <div>
            <p className="closing-overline">The realm is still forming.</p>
            <h2 id="closing-title">
              Between ancient ways of seeing and futures not yet named.
            </h2>
            <p>
              在尚未被命名的未来里，让技术成为感知的延伸，而不是喧闹的答案。
            </p>
          </div>
          <div className="closing-actions">
            <Link className="primary-action primary-action-light" href="/future">
              <span>See what comes next</span>
              <small>未来方向</small>
            </Link>
            <Link className="text-action" href="/vision">
              Read our vision
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <footer className="site-footer">
            <span>RW Studio / 若雾工作室</span>
            <span>Eastern Digital Art &amp; Creative Technology</span>
            <span>© {new Date().getFullYear()}</span>
            <SiteCompliance />
          </footer>
        </div>
      </PhaseSection>
    </PageFrame>
  );
}
