#!/usr/bin/env node
/**
 * Writes public/og-image.png (1200×630), the picture shown when a link to the
 * site is shared, from the site's own tokens, fonts and Logo component, so it
 * follows the brand when they change. One image for every page and language:
 * the tagline is the homepage's English one. Uses the brand's light surface
 * and no green, which the site keeps for `pass`.
 *
 * Usage: npm run docs:og-image (needs network access for the Google Fonts)
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const esbuild = require("esbuild");

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const en = JSON.parse(fs.readFileSync(path.join(ROOT, "src/i18n/en.json"), "utf8"));
const rules = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/rules.generated.json"), "utf8"));

// Render the Logo the way the site does: bundle a tiny entry with esbuild,
// then renderToStaticMarkup.
const bundle = await esbuild.build({
	stdin: {
		contents: `
			import React from "react";
			import { renderToStaticMarkup } from "react-dom/server";
			import { Logo } from "./src/components/design-system/brand/Logo.jsx";
			export const logo = renderToStaticMarkup(React.createElement(Logo, { variant: "lockup", size: 72 }));
		`,
		resolveDir: ROOT,
		loader: "jsx",
	},
	bundle: true,
	format: "cjs",
	platform: "node",
	write: false,
	jsx: "automatic",
	logLevel: "error",
});
const mod = { exports: {} };
new Function("module", "exports", "require", bundle.outputFiles[0].text)(mod, mod.exports, require);
const { logo } = mod.exports;

const css = ["fonts", "colors", "typography", "spacing"]
	.map((name) => fs.readFileSync(path.join(ROOT, `src/styles/tokens/${name}.css`), "utf8"))
	.join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
${css}
html, body { margin: 0; }
body {
	width: 1200px; height: 630px; box-sizing: border-box;
	padding: 88px 96px; display: flex; flex-direction: column; justify-content: space-between;
	background: var(--surface); color: var(--text-strong); font-family: var(--font-body);
	border-top: 12px solid var(--accent-2);
}
h1 { font-family: var(--font-display); font-weight: 700; font-size: 68px; line-height: 1.08;
	letter-spacing: -0.02em; margin: 0; max-width: 980px; }
p { font-family: var(--font-mono); font-size: 26px; color: var(--text-muted); margin: 0; }
</style></head><body>
<div>${logo}</div>
<h1>${en["homepage.tagline"]}</h1>
<p>${rules.length} rules · WCAG 2.2 · surea11y.dev</p>
</body></html>`;

const browser = await chromium.launch();
try {
	const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
	await page.setContent(html, { waitUntil: "networkidle" });
	await page.evaluate(() => document.fonts.ready);
	const out = path.join(ROOT, "public/og-image.png");
	await page.screenshot({ path: out });
	console.log(`[og-image] wrote ${path.relative(ROOT, out)}`);
} finally {
	await browser.close();
}
