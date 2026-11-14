# VARUN//OS — PLAYER ONE

A cinematic applied-AI portfolio for Varun, GLA University (2024–2028), built around a neural galaxy, evidence-backed project case studies, and a fast Recruiter Mode.

## Run

```sh
npm ci
npm run dev
npm test
npm run build
npx vite preview
```

The build typechecks, bundles, and pre-renders all portfolio sections into HTML. The Three.js scene loads afterward. Production does not make GitHub API calls.

## Content

Edit `src/data/content.ts`. It supplies the UI, terminal, and Recruiter Mode. `TODO:` values never render as facts or links. The build generates [TODO.md](TODO.md), the complete missing-content inventory. Only one win is confirmed. The 81% Infosys result is explicitly labeled an undeployed research prototype. MLH is described as an application selection. Shipped-project counts and CGPA are hidden until confirmed.

The portrait, resume, email, LinkedIn, verification links, project URLs, and several contribution/status fields still require input. The current monogram and social image are intentional fallbacks, not a generated likeness. Add `/public/images/varun.webp` (maximum 900px), a 400px variant, and update the portrait fields. Set the resume field only after a real PDF is provided.

## Experience

- Natural scrolling moves the camera on a GSAP spline; arrow keys and swipes retain normal browser behavior.
- A single persistent R3F Canvas contains procedural star shaders, a neural globe, skill instances, and a spacecraft.
- The skills graph connects tools through projects; the plain list and selected-skill evidence use the same source data.
- Recruiter Mode removes flight, tilt effects, decorative project art, and the game HUD. All skill tiers become visible together.
- XP and visitor achievements use guarded localStorage. Press `~` or the terminal icon for `help`, `whoami`, `skills`, `projects`, `wins`, `contact`, `resume`, `theme`, and `clear`.
- The Konami sequence switches to the amber night-race palette.
- Fullscreen native dialogs trap focus, close with Escape, and restore focus to their trigger.
- Reduced motion disables flight, smooth scrolling, tilt, and custom cursor. WebGL failure selects Recruiter Mode.
- DPR is capped at 1.5 desktop / 1.25 mobile. Low-end devices reduce particle counts and disable bloom. Hidden or offscreen canvases switch to demand rendering.

## Stack

Vite, React, TypeScript, Tailwind CSS, Three.js, React Three Fiber, Drei, postprocessing, GSAP/ScrollTrigger, Lenis, Framer Motion, anime.js, Zustand, Lucide. Space Grotesk and JetBrains Mono are self-hosted through Fontsource with swap behavior.

## Verification

`npm test` protects the truth ledger. `scripts/verify-html.mjs` verifies complete pre-rendering, no public TODO leaks, one H1, Person schema, and no eager Three.js preload. The quality workflow runs the same checks plus Lighthouse desktop and 360px mobile audits. See [docs/VERIFICATION.md](docs/VERIFICATION.md) for measured results and limitations.

## Deployment

The static output is `dist/`. It can be hosted on Cloudflare Pages, Vercel, or Netlify with build command `npm run build`. The managed hosting identity is in `.openai/hosting.json`. Public source: https://github.com/Varun-Khandelwal31/varun-os.
