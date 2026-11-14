import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Terminal as TerminalIcon,
  Menu,
  X,
  Orbit,
  ChevronDown,
  Trophy,
  ScanLine,
  Hexagon,
  Users,
  Timer,
  GitBranch,
  MessageSquare,
  Download,
  Check,
  Command,
} from "lucide-react";
import {
  profile,
  links,
  config,
  WINS,
  projects,
  archive,
  experience,
  hackathons,
  skills,
  traits,
  certifications,
  selections,
  levels,
  ui,
  isReady,
  type Project,
  type Skill,
} from "./data/content";
import { useMission } from "./store";
import { Orbital, ProjectArt } from "./components/Graphics";
import { Modal } from "./components/Modal";
const Scene = lazy(() => import("./components/Scene"));
const Terminal = lazy(() => import("./components/Terminal"));
const Flight = lazy(() => import("./components/Flight"));
function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
}: {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`section ${className}`}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            <span />
            {eyebrow}
          </p>
          <h2>{title}</h2>
        </div>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}
function External({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return isReady(href) ? (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ) : null;
}
function CaseStudy({
  project: p,
  onClose,
  onNext,
}: {
  project: Project;
  onClose: () => void;
  onNext: () => void;
}) {
  return (
    <Modal
      label={`${p.name} case study`}
      onClose={onClose}
      className={`case-modal accent-${p.accent}`}
    >
      <motion.div layoutId={`project-${p.id}`} className="case-heading">
        <span className="eyebrow">{p.category}</span>
        <h2>{p.name}</h2>
        {p.award && (
          <span className="award">
            <Trophy size={14} />
            {p.award}
          </span>
        )}
      </motion.div>
      <ProjectArt id={p.id} />
      <div className="case-content">
        {isReady(p.problem) && (
          <div>
            <h3>{ui.projects.problem}</h3>
            <p>{p.problem}</p>
          </div>
        )}
        {isReady(p.built) && (
          <div>
            <h3>{ui.projects.built}</h3>
            <p>{p.built}</p>
          </div>
        )}
        {!isReady(p.problem) && !isReady(p.built) && <p>{ui.projects.empty}</p>}
        {p.architecture.length > 0 && (
          <div>
            <h3>{ui.projects.architecture}</h3>
            <ol className="flow-steps">
              {p.architecture.map((step, i) => (
                <li key={step}>
                  <span>0{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}
        {p.stack.length > 0 && (
          <div>
            <h3>{ui.projects.stack}</h3>
            <div className="tags">
              {p.stack.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
        )}
        {isReady(p.role) && (
          <div>
            <h3>{ui.projects.role}</h3>
            <p>{p.role}</p>
          </div>
        )}
        {isReady(p.status) && (
          <p className="status-line">
            <span className="dot" />
            {p.status}
          </p>
        )}
        {p.note && <p className="case-note">{p.note}</p>}
        <div className="case-actions">
          {isReady(p.demo) && (
            <External href={p.demo} className="button primary">
              {ui.projects.demo}
              <ArrowUpRight size={16} />
            </External>
          )}
          {isReady(p.github) && (
            <External href={p.github} className="button">
              {ui.projects.source}
              <ArrowUpRight size={16} />
            </External>
          )}
          <button className="text-button" onClick={onNext}>
            {ui.projects.next}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </Modal>
  );
}
function SkillTree() {
  const recruiter = useMission((s) => s.recruiter);
  const award = useMission((s) => s.award);
  const [selected, setSelected] = useState<Skill>(skills.Core[1]);
  const [tab, setTab] = useState<keyof typeof skills>("Core");
  const [list, setList] = useState(false);
  function select(s: Skill) {
    setSelected(s);
    award(`skill-${s.name}`, `${ui.game.skill}: ${s.name}`, 15);
    window.dispatchEvent(
      new CustomEvent("skill-selection", {
        detail: { name: s.name, evidence: s.evidence },
      }),
    );
  }
  const positions = [
    [95, 85],
    [390, 85],
    [100, 280],
    [390, 280],
    [250, 330],
  ];
  return (
    <div className="skill-layout">
      <div className="skill-panel">
        <div
          className="skill-tabs"
          role="tablist"
          aria-label="Skill proficiency"
        >
          {Object.keys(skills).map((t, i) => (
            <button
              key={t}
              id={`tab-${t}`}
              role="tab"
              aria-selected={tab === t}
              aria-controls="skill-options"
              tabIndex={tab === t ? 0 : -1}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                  e.preventDefault();
                  const next = Object.keys(skills)[
                    (i + (e.key === "ArrowRight" ? 1 : 2)) % 3
                  ] as keyof typeof skills;
                  setTab(next);
                  document.getElementById(`tab-${next}`)?.focus();
                }
              }}
              onClick={() => setTab(t as keyof typeof skills)}
            >
              {t}
              <span>
                {skills[t as keyof typeof skills].length
                  .toString()
                  .padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
        <div
          className="skill-options"
          id="skill-options"
          role="tabpanel"
          aria-labelledby={`tab-${tab}`}
        >
          {skills[tab].map((s) => (
            <button
              key={s.name}
              onClick={() => select(s)}
              aria-pressed={selected.name === s.name}
              className={selected.name === s.name ? "selected" : ""}
            >
              <span>{s.name}</span>
              <ArrowUpRight size={15} />
            </button>
          ))}
        </div>
        <div className="evidence-panel" aria-live="polite">
          <span className="micro">
            {ui.skills.evidence} / {selected.name}
          </span>
          {selected.evidence.length ? (
            <div className="tags">
              {selected.evidence.map((p) => (
                <span key={p}>{p}</span>
              ))}
            </div>
          ) : (
            <p>{ui.skills.empty}</p>
          )}
        </div>
        <button
          className="text-button plain-list-toggle"
          onClick={() => setList(!list)}
          aria-expanded={list}
        >
          {ui.skills.list}
          <ChevronDown size={16} />
        </button>
        {(list || recruiter) && (
          <div className="plain-skills">
            {Object.entries(skills).map(([tier, items]) => (
              <div key={tier}>
                <h3>{tier}</h3>
                <ul>
                  {items.map((s) => (
                    <li key={s.name}>
                      {s.name}
                      {s.evidence.length > 0 && ` — ${s.evidence.join(", ")}`}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="constellation" aria-hidden="true">
        <svg viewBox="0 0 500 380">
          <g stroke="var(--cyan)" strokeOpacity=".3" fill="none">
            <circle cx="250" cy="180" r="70" fill="var(--ink)" />
            <circle cx="250" cy="180" r="87" strokeDasharray="2 8" />
            {selected.evidence.map((p, i) => (
              <g key={p}>
                <path d={`M250 180L${positions[i][0]} ${positions[i][1]}`} />
                <circle
                  cx={positions[i][0]}
                  cy={positions[i][1]}
                  r="6"
                  fill="var(--cyan)"
                />
                <circle cx={positions[i][0]} cy={positions[i][1]} r="17" />
              </g>
            ))}
          </g>
          <text
            x="250"
            y="177"
            textAnchor="middle"
            fill="var(--cyan)"
            fontSize="13"
            fontFamily="monospace"
          >
            {selected.name.split(" / ")[0]}
          </text>
          <text
            x="250"
            y="200"
            textAnchor="middle"
            fill="#a0aab4"
            fontSize="8"
            fontFamily="monospace"
          >
            {selected.evidence.length} PROJECT CONNECTIONS
          </text>
          {selected.evidence.map((p, i) => (
            <text
              key={p}
              x={positions[i][0]}
              y={positions[i][1] - 30}
              textAnchor="middle"
              fill="#a0aab4"
              fontSize="10"
              fontFamily="monospace"
            >
              {p.length > 22 ? p.slice(0, 20) + "…" : p}
            </text>
          ))}
        </svg>
        <span className="micro">{ui.art.connected}</span>
      </div>
    </div>
  );
}
export default function App() {
  const m = useMission();
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState(false);
  const [ready, setReady] = useState(false);
  const [menu, setMenu] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [boot, setBoot] = useState(false);
  const all = [...projects, ...archive];
  const wins = WINS.filter((w) => w.confirmed);
  const xp = Math.round(m.maxProgress * 800) + m.bonus;
  useEffect(() => {
    m.hydrate();
    try {
      if (
        !localStorage.getItem("varun-os-boot") &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        setBoot(true);
        localStorage.setItem("varun-os-boot", "1");
      }
    } catch {}
    const timeout = setTimeout(() => setBoot(false), 1600);
    let timer: number | undefined;
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2");
      if (gl) {
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        timer = window.setTimeout(() => setWebgl(true), 1200);
      } else m.set({ recruiter: true });
    } catch {
      m.set({ recruiter: true });
    }
    return () => {
      clearTimeout(timeout);
      clearTimeout(timer);
    };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = m.theme;
    document.documentElement.dataset.recruiter = String(m.recruiter);
  }, [m.theme, m.recruiter]);
  useEffect(() => {
    if (!m.toast) return;
    const t = setTimeout(() => m.set({ toast: "" }), 3500);
    return () => clearTimeout(t);
  }, [m.toast]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const range = document.documentElement.scrollHeight - innerHeight,
          p = range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0;
        let level = 0;
        levels.forEach((l, i) => {
          if (
            (document.getElementById(l.id)?.getBoundingClientRect().top ??
              Infinity) <
            innerHeight * 0.45
          )
            level = i;
        });
        const previous = useMission.getState().level;
        m.set({
          progress: p,
          maxProgress: Math.max(p, useMission.getState().maxProgress),
          level,
        });
        if (level !== previous && level > 0 && !m.recruiter)
          m.award(
            `level-${level}`,
            `Level ${levels[level].label} unlocked: ${levels[level].name}`,
            0,
          );
      });
    };
    addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      removeEventListener("scroll", update);
      cancelAnimationFrame(frame);
    };
  }, [m.recruiter]);
  useEffect(() => {
    const sequence = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    let buffer: string[] = [];
    const handle = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).matches("input,textarea,[contenteditable]"))
        return;
      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        m.set({ terminal: !useMission.getState().terminal });
        m.award("terminal", ui.game.terminal, 25);
      }
      buffer = [...buffer.slice(-9), e.key];
      if (buffer.join("|") === sequence.join("|")) {
        m.set({ theme: "race" });
        m.award("konami", ui.game.race, 100);
      }
      if (e.key === "Escape") setMenu(false);
    };
    addEventListener("keydown", handle);
    return () => removeEventListener("keydown", handle);
  }, []);
  function openProject(p: Project) {
    setProject(p);
    const s = useMission.getState();
    if (!s.visited.includes(`project-${p.id}`)) {
      s.award(`project-${p.id}`, `${p.name} inspected`, 40);
      if (
        useMission.getState().visited.filter((x) => x.startsWith("project-"))
          .length === 3
      )
        s.set({ toast: ui.game.explorer });
    }
  }
  function tilt(e: React.PointerEvent<HTMLElement>) {
    if (reduced || m.recruiter || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.transform = `perspective(900px) rotateX(${-(e.clientY - r.top - r.height / 2) / 70}deg) rotateY(${(e.clientX - r.left - r.width / 2) / 70}deg)`;
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="css-stars" aria-hidden="true" />
      {webgl && !m.recruiter && !reduced && (
        <Suspense fallback={null}>
          <Scene
            onReady={() => setReady(true)}
            onFailure={() => m.set({ recruiter: true })}
          />
          <Flight />
        </Suspense>
      )}
      <header className="header">
        <a className="brand" href="#home" aria-label="Varun OS home">
          <span className="brand-symbol">
            V<span>//</span>
          </span>
          <span>
            {ui.brand}
            <small>{ui.version}</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {["origin", "projects", "contact"].map((id, i) => (
            <a key={id} href={`#${id}`}>
              {ui.nav[i]}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className={`recruiter-toggle ${m.recruiter ? "active" : ""}`}
            aria-pressed={m.recruiter}
            onClick={() => m.set({ recruiter: !m.recruiter })}
          >
            <span className="toggle-track">
              <span />
            </span>
            {ui.recruiter}
          </button>
          <button
            className="icon-button terminal-trigger"
            aria-label={ui.game.terminalLabel}
            onClick={() => {
              m.set({ terminal: true });
              m.award("terminal", ui.game.terminal, 25);
            }}
          >
            <TerminalIcon size={18} />
          </button>
          <button
            className="icon-button menu-trigger"
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
      {menu && (
        <nav className="mobile-menu" aria-label="Mission navigation">
          {levels.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={() => setMenu(false)}>
              <span>{l.label}</span>
              {l.name}
              <ArrowUpRight size={16} />
            </a>
          ))}
        </nav>
      )}
      <aside className="route-rail" aria-label={ui.game.questLog}>
        {levels.map((l, i) => (
          <a
            href={`#${l.id}`}
            key={l.id}
            aria-label={`${l.label} ${l.name}`}
            aria-current={i === m.level ? "location" : undefined}
            className={i === m.level ? "current" : ""}
          >
            <span>{l.label}</span>
            <i />
            <b>{l.name}</b>
          </a>
        ))}
      </aside>
      <main id="main">
        <section id="home" className="hero">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="dot" />
              {ui.mission}
            </p>
            <div className="hero-intro">{ui.nameIntro}</div>
            <h1>
              {profile.name}
              <span>.</span>
            </h1>
            <p className="hero-headline">
              {profile.headline[0]}
              <br />
              <span>{profile.headline[1]}</span>
            </p>
            <p className="hero-description">{profile.description}</p>
            <div className="hero-actions">
              <a className="button primary magnetic" href="#origin">
                {ui.start}
                <ArrowUpRight size={18} />
              </a>
              {isReady(links.resume) && (
                <a
                  className="button"
                  href={links.resume}
                  download
                  onClick={() => m.award("resume", ui.game.recruiter, 60)}
                >
                  {ui.resume}
                  <Download size={15} />
                </a>
              )}
              <a className="text-button" href="#contact">
                {ui.contact}
                <ArrowUpRight size={15} />
              </a>
            </div>
            <div className="hero-metrics">
              {[
                wins.length,
                config.shippedProjects ?? projects.length,
                certifications.length,
              ].map((n, i) => (
                <div key={i}>
                  <b>
                    {n.toString().padStart(2, "0")}
                    {i === 0 && (
                      <span>
                        <ArrowUpRight size={14} />
                      </span>
                    )}
                  </b>
                  <small>
                    {i === 1 && config.shippedProjects !== null
                      ? "PROJECTS SHIPPED"
                      : ui.metrics[i]}
                  </small>
                </div>
              ))}
            </div>
          </div>
          <div
            className={`hero-visual ${ready && !m.recruiter && !reduced ? "scene-ready" : ""}`}
          >
            <div className="visual-cross cross-top">+</div>
            <div className="orbital-fallback">
              <Orbital />
            </div>
            <div className="orbit-label">
              <span className="dot" />
              {ui.online}
              <small>{ui.coords}</small>
            </div>
            <div
              className="player-card"
              onPointerMove={tilt}
              onPointerLeave={(e) => (e.currentTarget.style.transform = "")}
            >
              <div className="player-avatar">
                {isReady(profile.portrait) ? (
                  <img
                    src={profile.portrait}
                    srcSet={
                      isReady(profile.portraitSmall)
                        ? `${profile.portraitSmall} 400w, ${profile.portrait} 900w`
                        : undefined
                    }
                    sizes="72px"
                    alt={profile.portraitAlt}
                    width="72"
                    height="80"
                  />
                ) : (
                  <span aria-label="Varun monogram">
                    V
                    <span>
                      <ArrowUpRight size={17} />
                    </span>
                  </span>
                )}
              </div>
              <div>
                <span className="micro">{ui.player} / 001</span>
                <strong>
                  {profile.name}
                  <span className="dot" />
                </strong>
                <small>{profile.degree}</small>
                <small>
                  {profile.university} · {profile.education}
                </small>
              </div>
              <ScanLine size={18} />
            </div>
            <div className="visual-cross cross-bottom">+</div>
            <span className="visual-caption">{ui.heroAside}</span>
          </div>
          <div className="hero-bottom">
            <a href="#origin">
              <span className="scroll-icon">
                <ArrowDown size={13} />
              </span>
              {ui.scroll}
            </a>
            <span>
              {profile.location.toUpperCase()}
              <i />
              FLIGHT MODE
            </span>
          </div>
        </section>
        <div className="now-strip">
          <span>
            <i className="dot" />
            {ui.now}
          </span>
          <p>{profile.currently}</p>
          <a href="#projects" aria-label="Explore current work">
            <ArrowUpRight size={18} />
          </a>
        </div>
        <Section id="origin" {...ui.origin} className="origin-section">
          <div className="origin-copy">
            <p>{profile.origin}</p>
            <div className="interest-tags">
              {profile.interests.map((s, i) => (
                <span key={s}>
                  {
                    [
                      <ScanLine size={15} />,
                      <Orbit size={15} />,
                      <GitBranch size={15} />,
                    ][i]
                  }
                  {s}
                </span>
              ))}
            </div>
          </div>
          <blockquote>
            <span className="quote-mark">“</span>
            <p>{profile.principle}</p>
            <footer>— {profile.name} / THE OPERATING PRINCIPLE</footer>
          </blockquote>
        </Section>
        <Section id="skills" {...ui.skills}>
          <SkillTree />
        </Section>
        <Section id="experience" {...ui.experience}>
          <div className="timeline">
            {experience.map((e, i) => (
              <article className="timeline-item" key={e.company}>
                <div className="timeline-index">
                  0{i + 1}
                  <i />
                </div>
                <div className="experience-org">
                  <span className="micro">
                    {isReady(e.date) ? e.date : e.status}
                  </span>
                  <h3>{e.company}</h3>
                  <span className="status-pill">{e.status}</span>
                </div>
                <div className="experience-detail">
                  <h4>{e.role}</h4>
                  <p>{e.description}</p>
                  {isReady(e.detail) && (
                    <p className="honesty-note">{e.detail}</p>
                  )}
                  {e.additional && <p>{e.additional}</p>}
                </div>
              </article>
            ))}
          </div>
        </Section>
        <Section id="hackathons" {...ui.hackathons}>
          <div className="win-card">
            <div className="win-art" aria-hidden="true">
              <div>
                <Trophy size={58} strokeWidth={1} />
              </div>
              <i />
              <i />
              <i />
            </div>
            <div className="win-content">
              <p className="eyebrow amber">
                <span className="dot" />
                {ui.hackathons.unlock}
              </p>
              <h3>{ui.hackathons.win}</h3>
              <p>
                {wins[0].project}
                <span> / </span>
                {wins[0].event}
              </p>
              <small>{projects[0].note}</small>
              <button
                className="text-button"
                onClick={() => openProject(projects[0])}
              >
                {ui.hackathons.inspect}
                <ArrowUpRight size={16} />
              </button>
            </div>
            <span className="win-position">
              01<sup>ST</sup>
            </span>
          </div>
          <div className="boss-grid">
            {(showAll ? hackathons.slice(1) : hackathons.slice(1, 5)).map(
              (h) => (
                <article key={h.name}>
                  <span className="micro outcome">{h.outcome}</span>
                  <h3>{isReady(h.project) ? h.project : h.name}</h3>
                  <p>{h.name}</p>
                  {h.detail && <small>{h.detail}</small>}
                </article>
              ),
            )}
          </div>
          <button
            className="text-button expand-encounters"
            onClick={() => setShowAll(!showAll)}
            aria-expanded={showAll}
          >
            {showAll ? ui.hackathons.hide : ui.hackathons.show}
            <span>/{hackathons.length}</span>
            <ChevronDown size={16} />
          </button>
        </Section>
        <Section id="projects" {...ui.projects}>
          <div className="project-grid">
            {projects.map((p, i) => (
              <motion.button
                layoutId={`project-${p.id}`}
                className={`project-card accent-${p.accent}`}
                key={p.id}
                onClick={() => openProject(p)}
                onPointerMove={tilt}
                onPointerLeave={(e) => (e.currentTarget.style.transform = "")}
              >
                <div className="project-topline">
                  <span>BUILD / 0{i + 1}</span>
                  <span>
                    {p.award ? (
                      <>
                        <Trophy size={11} /> HACKATHON WINNER
                      </>
                    ) : (
                      p.category.split(" / ")[0].toUpperCase()
                    )}
                  </span>
                </div>
                <ProjectArt id={p.id} />
                <div className="project-body">
                  <div className="project-title">
                    <h3>{p.name}</h3>
                    <span>
                      <ArrowUpRight size={23} />
                    </span>
                  </div>
                  <p>{p.problem}</p>
                  <div className="tags">
                    {(p.stack.length
                      ? p.stack.slice(0, 3)
                      : p.architecture.slice(0, 2)
                    ).map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
          <div className="archive-heading">
            <h3>{ui.projects.archive}</h3>
            <span className="micro">
              {ui.projects.archiveSub} / {archive.length}
            </span>
          </div>
          <div className="archive-grid">
            {archive.map((p) => (
              <button key={p.id} onClick={() => openProject(p)}>
                <span>
                  {p.name}
                  {isReady(p.status) && <small>{p.status}</small>}
                </span>
                <ArrowUpRight size={16} />
              </button>
            ))}
          </div>
        </Section>
        <Section id="achievements" {...ui.achievements}>
          <div className="cert-grid">
            {certifications.map((c, i) => (
              <article key={c.code}>
                <div className="cert-emblem">
                  {i === 0 ? (
                    <Hexagon size={46} strokeWidth={1} />
                  ) : (
                    <Orbit size={46} strokeWidth={1} />
                  )}
                  <span>{c.code}</span>
                </div>
                <div>
                  <span className="micro">{c.issuer}</span>
                  <h3>{c.name}</h3>
                  <External href={c.verify} className="text-button">
                    {ui.achievements.verify}
                    <ArrowUpRight size={14} />
                  </External>
                </div>
                <Check size={18} />
              </article>
            ))}
          </div>
          <div className="selection-grid">
            {selections.map((s) => (
              <article key={s.name}>
                <span className="micro">{s.code}</span>
                <h3>{s.name}</h3>
                <p>{s.detail}</p>
              </article>
            ))}
          </div>
        </Section>
        <Section id="character" {...ui.character}>
          <div className="traits-grid">
            {traits.map((t, i) => (
              <article key={t.name}>
                <div className="trait-top">
                  {
                    [
                      <Timer />,
                      <Users />,
                      <ScanLine />,
                      <GitBranch />,
                      <MessageSquare />,
                    ][i]
                  }
                  <span>0{i + 1}</span>
                </div>
                <h3>{t.name}</h3>
                <p>{t.receipt}</p>
              </article>
            ))}
          </div>
        </Section>
        <section id="contact" className="contact-section">
          <p className="eyebrow">
            <span />
            {ui.contactSection.eyebrow}
          </p>
          <h2>
            {ui.contactSection.title.map((s, i) => (
              <span key={s} className={i === 1 ? "muted" : ""}>
                {s}
                <br />
              </span>
            ))}
          </h2>
          <p>{ui.contactSection.subtitle}</p>
          <div className="contact-links">
            {isReady(links.email) && (
              <a className="button primary" href={`mailto:${links.email}`}>
                {links.email}
                <ArrowUpRight size={18} />
              </a>
            )}
            <External href={links.github} className="button">
              GitHub
              <ArrowUpRight size={16} />
            </External>
            <External href={links.linkedin} className="button">
              LinkedIn
              <ArrowUpRight size={16} />
            </External>
            {isReady(links.resume) && (
              <a
                className="button"
                href={links.resume}
                download
                onClick={() => m.award("resume", ui.game.recruiter, 60)}
              >
                {ui.resume}
                <Download size={16} />
              </a>
            )}
            <a href="#home" className="text-button">
              {ui.contactSection.home}
              <ArrowUpRight size={17} />
            </a>
          </div>
          {isReady(profile.lookingFor) && <p>{profile.lookingFor}</p>}
          {isReady(config.githubSnapshot.asOf) &&
            config.githubSnapshot.contributions !== null && (
              <p>
                GitHub snapshot · {config.githubSnapshot.contributions}{" "}
                contributions · {config.githubSnapshot.asOf}
              </p>
            )}
          <div className="contact-orbit" aria-hidden="true">
            <Orbit size={170} strokeWidth={0.4} />
          </div>
        </section>
        <footer className="footer">
          <span>{ui.contactSection.copyright}</span>
          <span>{ui.contactSection.credit}</span>
          <External href={links.source}>
            Portfolio source
            <ArrowUpRight size={13} />
          </External>
          <span>
            {ui.contactSection.challenge}
            <ArrowUpRight size={13} />
          </span>
        </footer>
      </main>
      <aside className="bottom-hud" aria-label="Mission status">
        <div className="hud-location">
          <span className="dot" />
          {ui.game.level} {levels[m.level].label}
          <span className="hud-separator">/</span>
          <span>{levels[m.level].name.toUpperCase()}</span>
        </div>
        <div className="hud-progress">
          <div
            role="progressbar"
            aria-label={ui.game.progress}
            aria-valuenow={Math.round(m.progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <i style={{ width: `${m.progress * 100}%` }} />
          </div>
          <span>
            {xp.toString().padStart(4, "0")} {ui.game.xp}
          </span>
        </div>
        <button
          onClick={() => m.set({ terminal: true })}
          aria-label={ui.game.terminalLabel}
        >
          <Command size={13} />
          <span>~ TERMINAL</span>
        </button>
      </aside>
      <AnimatePresence>
        {m.toast && !m.recruiter && (
          <motion.div
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            <Check size={17} />
            {m.toast}
          </motion.div>
        )}
      </AnimatePresence>
      {project && (
        <CaseStudy
          key={project.id}
          project={project}
          onClose={() => setProject(null)}
          onNext={() =>
            openProject(
              all[(all.findIndex((p) => p.id === project.id) + 1) % all.length],
            )
          }
        />
      )}
      {m.terminal && (
        <Suspense fallback={null}>
          <Terminal onClose={() => m.set({ terminal: false })} />
        </Suspense>
      )}
      {boot && (
        <div className="boot-panel" role="status">
          <span className="micro">{ui.boot.title}</span>
          <span>{ui.boot.line}</span>
          <div className="boot-line" />
          <button onClick={() => setBoot(false)}>
            {ui.boot.skip}
            <ArrowRight size={13} />
          </button>
        </div>
      )}
    </>
  );
}
