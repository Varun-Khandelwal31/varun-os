import { readFile, writeFile } from "node:fs/promises";
import { createServer } from "vite";
const server = await createServer({
  mode: "production",
  server: { middlewareMode: true },
  appType: "custom",
});
try {
  const { render } = await server.ssrLoadModule("/src/entry-server.tsx");
  const { profile, todos } = await server.ssrLoadModule("/src/data/content.ts");
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: profile.siteURL,
    description: profile.description,
    affiliation: { "@type": "CollegeOrUniversity", name: profile.university },
  };
  const html = await readFile("dist/index.html", "utf8");
  await writeFile(
    "dist/index.html",
    html
      .replace('<div id="root"></div>', `<div id="root">${render()}</div>`)
      .replace(
        "</head>",
        `<script type="application/ld+json">${JSON.stringify(schema)}</script></head>`,
      ),
  );
  await writeFile(
    "TODO.md",
    "# Content to confirm\n\nEvery TODO is hidden from visitors. Edit src/data/content.ts.\n\n" +
      todos.map((x) => "- [ ] " + x).join("\n") +
      "\n\n- [ ] Confirm shipped-project count (currently hidden; six featured builds shown).\n- [ ] Supply dated GitHub activity snapshot.\n- [ ] Confirm implementation stacks for archive projects without provided details.\n- [ ] Review unconfirmed competition results before changing TODO_WIN_CONFIRMED flags.\n",
  );
} finally {
  await server.close();
}
