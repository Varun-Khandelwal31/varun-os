import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
const html = await readFile("dist/index.html", "utf8");
assert.ok(!html.includes("TODO:"));
assert.ok(!html.includes("3x hackathon"));
assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
for (const id of [
  "home",
  "origin",
  "skills",
  "experience",
  "hackathons",
  "projects",
  "achievements",
  "character",
  "contact",
])
  assert.ok(html.includes(`id="${id}"`));
assert.ok(!/rel="modulepreload"[^>]*three/.test(html));
assert.ok(html.includes("application/ld+json"));
console.log(
  "Production HTML checks passed: complete sections, no TODO leaks, lazy 3D, Person schema.",
);
