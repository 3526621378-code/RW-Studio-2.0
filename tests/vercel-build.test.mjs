import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function read(path) {
  return readFile(new URL(path, root), "utf8");
}

test("uses the Vercel-native Next.js build pipeline", async () => {
  const packageJson = JSON.parse(await read("package.json"));

  assert.equal(packageJson.scripts.dev, "next dev");
  assert.match(packageJson.scripts.build, /^next build(?:\s|$)/);
  assert.equal(packageJson.scripts.start, "next start");
  assert.equal(packageJson.dependencies.vinext, undefined);
  assert.equal(packageJson.devDependencies.vinext, undefined);
  assert.equal(packageJson.devDependencies.wrangler, undefined);
  assert.equal(packageJson.devDependencies["@cloudflare/vite-plugin"], undefined);
});

test("Next.js emits every public RW Studio route", async () => {
  const manifest = JSON.parse(
    await read(".next/server/app-paths-manifest.json"),
  );
  const routes = [
    "/page",
    "/vision/page",
    "/experiments/page",
    "/experiments/first-mist-realm/page",
    "/future/page",
  ];

  for (const route of routes) {
    assert.ok(manifest[route], `${route} should exist in the Next.js output`);
  }
});

test("keeps the finished brand, artwork and accessibility details", async () => {
  const [layout, home, styles] = await Promise.all([
    read("app/layout.jsx"),
    read("app/page.jsx"),
    read("app/globals.css"),
  ]);

  assert.match(layout, /RW Studio \| 若雾工作室/);
  assert.match(layout, /className="skip-link"/);
  assert.match(layout, /og\.png/);
  assert.match(home, /PhaseSection/);
  assert.match(home, /ArtLab/);
  assert.match(styles, /\.timescape-stage\s*\{[\s\S]*?z-index:\s*0;/);
  assert.match(styles, /\.route-transition-shell\s*\{[\s\S]*?z-index:\s*10;/);

  await assert.doesNotReject(stat(new URL("public/og.png", root)));
  await assert.doesNotReject(
    stat(new URL("public/timescape/dawn-desktop.jpg", root)),
  );
});
