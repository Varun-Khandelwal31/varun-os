import { useId } from "react";
import { ui } from "../data/content";
export function Orbital() {
  const id = useId();
  return (
    <svg className="orbital" viewBox="0 0 660 600" aria-hidden="true">
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor="#123638" />
          <stop offset=".75" stopColor="#08191c" />
          <stop offset="1" stopColor="#050b10" />
        </radialGradient>
      </defs>
      <g transform="translate(340 290)">
        <circle
          r="182"
          fill={`url(#${id})`}
          stroke="var(--cyan)"
          strokeOpacity=".35"
        />
        {[0, 30, 60, 90, 120, 150].map((a) => (
          <ellipse
            key={a}
            rx="182"
            ry="54"
            transform={`rotate(${a})`}
            fill="none"
            stroke="var(--cyan)"
            strokeOpacity=".18"
          />
        ))}
        {[70, 120, 160, 222, 248].map((r, i) => (
          <circle
            key={r}
            r={r}
            fill="none"
            stroke="var(--cyan)"
            strokeOpacity={i > 2 ? ".16" : ".08"}
            strokeDasharray={i > 2 ? "2 8" : undefined}
          />
        ))}
        <ellipse
          rx="304"
          ry="76"
          transform="rotate(-28)"
          fill="none"
          stroke="var(--cyan)"
          strokeOpacity=".5"
        />
        <ellipse
          rx="270"
          ry="94"
          transform="rotate(35)"
          fill="none"
          stroke="var(--cyan)"
          strokeOpacity=".19"
        />
        {Array.from({ length: 32 }, (_, i) => {
          const a = i * 2.399,
            r = 70 + ((i * 41) % 120);
          return (
            <circle
              key={i}
              cx={Math.cos(a) * r}
              cy={Math.sin(a) * r}
              r={i % 5 === 0 ? 3 : 1.5}
              fill="var(--cyan)"
              opacity={0.25 + (i % 4) * 0.2}
            />
          );
        })}
        <circle cx="247" cy="-143" r="5" fill="var(--amber)" />
        <path
          d="M-49-47h25L0 20 24-47h25L12 48h-24z"
          fill="var(--cyan)"
          opacity=".92"
        />
      </g>
      <path
        d="M462 104h54l30-30h53M136 408H80l-28 28H15"
        stroke="var(--cyan)"
        strokeOpacity=".3"
        fill="none"
      />
    </svg>
  );
}
export function ProjectArt({ id }: { id: string }) {
  return (
    <div className={`project-art art-${id}`} aria-hidden="true">
      <div className="art-grid" />
      {id === "recoverx" ? (
        <svg viewBox="0 0 360 200">
          <g fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M145 52l-10 33 42 20 30-34M135 85l-35 35-22-5M135 85l4 58-27 41M139 143l44-5 24 42" />
            <circle cx="150" cy="36" r="15" />
            {[
              [145, 52],
              [135, 85],
              [177, 105],
              [207, 71],
              [100, 120],
              [78, 115],
              [139, 143],
              [112, 184],
              [183, 138],
              [207, 180],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="3" fill="var(--ink)" />
            ))}
            <path
              d="M65 22h-15v20m0 123v15h17M225 22h15v20m0 123v15h-17M260 72h48m-48 14h30m-30 37h48m-48 14h38"
              opacity=".4"
            />
          </g>
          <text
            x="260"
            y="58"
            fill="currentColor"
            fontSize="8"
            fontFamily="monospace"
          >
            {ui.art.pose}
          </text>
          <text
            x="260"
            y="109"
            fill="currentColor"
            fontSize="8"
            fontFamily="monospace"
          >
            {ui.art.feedback}
          </text>
        </svg>
      ) : id === "neural-pit" ? (
        <>
          <div className="radio-wave">
            {Array.from({ length: 42 }, (_, i) => (
              <i
                key={i}
                style={{
                  height: `${12 + Math.abs(Math.sin(i * 1.8)) * 70 * (Math.sin(i / 8) ** 2 + 0.2)}%`,
                }}
              />
            ))}
          </div>
          <span className="art-label">{ui.art.radio}</span>
        </>
      ) : id === "merchantforge" ? (
        <div className="policy-flow">
          <span>{"{ proposal }"}</span>
          <b>◇</b>
          <span>{ui.art.gate}</span>
          <b>→</b>
          <span>{ui.art.audit}</span>
        </div>
      ) : id === "nutriforge" ? (
        <div className="agent-art">
          <span>{ui.art.local}</span>
          <div>
            <i>01</i>
            <i>02</i>
            <i>03</i>
          </div>
          <b>{ui.art.offline}</b>
        </div>
      ) : id === "sanketai" ? (
        <svg viewBox="0 0 360 200">
          <g fill="none" stroke="currentColor">
            <path
              d="M125 165l-24-36-10-29q-2-12 8-12l19 30-10-64q0-15 10-10l14 57 3-73q3-12 12-6l3 74 12-59q5-10 12-3l-6 67 15-41q7-9 12 0l-17 77-28 28z"
              strokeWidth="2"
            />
            <path d="M216 75h65m-16-14 16 14-16 14M281 122h-65m16-14-16 14 16 14" />
            <circle cx="145" cy="118" r="4" />
            <path
              d="M145 118l-27-74m27 74 2-96m-2 96 29-81m-29 81 50-58m-50 58-46-30"
              opacity=".35"
            />
          </g>
        </svg>
      ) : (
        <svg viewBox="0 0 360 200">
          <g stroke="currentColor" fill="none" opacity=".65">
            <path d="M58 100l54-45 65 40 62-53 60 70-67 48-55-65-65 65-54-60m54-45v105m65-65 122 17m-60-70-7 118" />
            {[
              [58, 100],
              [112, 55],
              [177, 95],
              [239, 42],
              [299, 112],
              [232, 160],
              [112, 160],
            ].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r={i === 2 ? 13 : 5} fill="var(--ink)" />
                <circle cx={x} cy={y} r="2" fill="currentColor" />
              </g>
            ))}
          </g>
        </svg>
      )}
    </div>
  );
}
