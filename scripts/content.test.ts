import { test } from "node:test";
import assert from "node:assert/strict";
import {
  WINS,
  projects,
  archive,
  hackathons,
  experience,
  isReady,
  todos,
  config,
  profile,
} from "../src/data/content.ts";
test("only one confirmed win; two slots remain unconfirmed", () => {
  assert.equal(WINS.filter((w) => w.confirmed).length, 1);
  assert.equal(WINS[0].project, "RecoverX");
  assert.equal(WINS.length, 3);
  assert.equal(hackathons.filter((h) => h.outcome === "WON").length, 1);
});
test("19 projects have explicit missing-field markers and valid supplied URLs", () => {
  assert.equal(projects.length, 6);
  assert.equal(archive.length, 13);
  for (const p of [...projects, ...archive]) {
    for (const k of [
      "problem",
      "built",
      "role",
      "status",
      "demo",
      "github",
    ] as const)
      assert.ok(p[k]);
    for (const url of [p.demo, p.github])
      if (isReady(url)) assert.match(url, /^https:\/\//);
  }
});
test("research accuracy stays qualified and FastAPI attribution is gated", () => {
  assert.match(experience[0].detail!, /Not deployed/);
  assert.equal(config.USED_FASTAPI_AT_INFOSYS, false);
  assert.equal(experience[0].additional, null);
});
test("unknowns cannot become links or visible facts", () => {
  assert.equal(isReady("TODO:demo"), false);
  assert.equal(isReady(null), false);
  assert.equal(isReady(""), false);
  assert.ok(todos.length > 100);
  assert.equal(profile.showCGPA, false);
});
