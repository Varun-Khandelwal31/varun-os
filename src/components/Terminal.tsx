import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { Modal } from "./Modal";
import {
  profile,
  skills,
  projects,
  archive,
  WINS,
  links,
  ui,
  isReady,
} from "../data/content";
import { useMission } from "../store";
export default function Terminal({ onClose }: { onClose: () => void }) {
  const [lines, setLines] = useState<{ text: string; command?: boolean }[]>([
    { text: ui.terminal.intro },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [index, setIndex] = useState(-1);
  const output = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const m = useMission();
  useEffect(() => {
    field.current?.focus();
  }, []);
  useEffect(() => {
    output.current?.scrollTo({ top: output.current.scrollHeight });
  }, [lines]);
  function run(e: FormEvent) {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;
    let answer = "";
    setHistory((h) => [cmd, ...h]);
    setIndex(-1);
    setInput("");
    switch (cmd) {
      case "help":
        answer = ui.terminal.help;
        break;
      case "whoami":
        answer = `${profile.name} / ${profile.degree}\n${profile.university}, ${profile.location} / ${profile.education}\n\n${profile.origin}\n\n“${profile.principle}”`;
        break;
      case "skills":
        answer = Object.entries(skills)
          .map(
            ([tier, list]) =>
              `${tier.toUpperCase()}\n${list.map((s) => `${s.name}${s.evidence.length ? ` → ${s.evidence.join(", ")}` : ""}`).join("\n")}`,
          )
          .join("\n\n");
        break;
      case "projects":
        answer = [...projects, ...archive]
          .map(
            (p) =>
              `${p.name}${isReady(p.status) ? ` [${p.status}]` : ""}${isReady(p.built) ? `\n${p.built}` : ""}`,
          )
          .join("\n\n");
        break;
      case "wins":
        answer = WINS.filter((w) => w.confirmed)
          .map((w) => `${w.place} · ${w.event} · ${w.project}`)
          .join("\n");
        break;
      case "contact":
        answer =
          [
            isReady(links.email) ? `Email: ${links.email}` : "",
            isReady(links.github) ? `GitHub: ${links.github}` : "",
            isReady(links.linkedin) ? `LinkedIn: ${links.linkedin}` : "",
          ]
            .filter(Boolean)
            .join("\n") || ui.terminal.unavailable;
        break;
      case "resume":
        if (isReady(links.resume)) {
          const a = document.createElement("a");
          a.href = links.resume;
          a.download = "Varun-Resume.pdf";
          a.click();
          m.award("resume", ui.game.recruiter, 60);
          answer = links.resume;
        } else answer = ui.terminal.unavailable;
        break;
      case "theme":
        m.set({ theme: m.theme === "space" ? "race" : "space" });
        answer = ui.terminal.theme;
        break;
      case "clear":
        setLines([]);
        return;
      default:
        answer = ui.terminal.unknown;
    }
    setLines((prev) => [
      ...prev.slice(-60),
      { text: `${ui.terminal.prompt} ${cmd}`, command: true },
      { text: answer },
    ]);
  }
  return (
    <Modal
      label={ui.terminal.title}
      onClose={onClose}
      className="terminal-modal"
    >
      <div className="terminal-header">{ui.terminal.title}</div>
      <div
        className="terminal-output"
        ref={output}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
      >
        {lines.map((l, i) => (
          <p key={i} className={l.command ? "terminal-command" : ""}>
            {l.text}
          </p>
        ))}
      </div>
      <form className="terminal-form" onSubmit={run}>
        <label htmlFor="terminal-input">{ui.terminal.prompt}</label>
        <input
          id="terminal-input"
          ref={field}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          placeholder={ui.terminal.placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              const n = Math.min(index + 1, history.length - 1);
              setIndex(n);
              setInput(history[n] || "");
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              const n = Math.max(-1, index - 1);
              setIndex(n);
              setInput(n < 0 ? "" : history[n]);
            }
          }}
        />
        <button aria-label="Run command" type="submit">
          <ArrowRight size={16} />
        </button>
      </form>
    </Modal>
  );
}
