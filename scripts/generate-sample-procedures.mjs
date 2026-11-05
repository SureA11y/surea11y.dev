#!/usr/bin/env node
/**
 * Writes core's test procedures for WCAG 2.2 Level A and AA as pages for the
 * site to link to, one set per site language, from the pinned
 * @surea11y/core's renderProcedures:
 *
 *   public/procedures/wcag-22-aa.html            the reference: every criterion's procedures
 *   public/procedures/wcag-22-aa-checklist.html  the worksheet: each check once, with results to record
 *
 * and the same under public/<locale>/procedures/, which localizeLinks'
 * prefixing finds. Each is the page core makes, unchanged: self-contained,
 * in the locale's language, and the same for the same core, so CI can check
 * them (--check) as it checks the rule data.
 *
 * Usage: npm run docs:sample-procedures [-- --check]
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { DEFAULT_LOCALE, localeCodes } from "../src/i18n/locales.ts";

const require = createRequire(import.meta.url);
const { listProcedures, procedureChecklist, renderProcedures } = require("@surea11y/core");

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
const options = { version: "2.2", levels: ["A", "AA"] };

let stale = 0;
for (const locale of localeCodes) {
	const dir = locale === DEFAULT_LOCALE ? path.join(ROOT, "public/procedures") : path.join(ROOT, `public/${locale}/procedures`);
	const pages = {
		"wcag-22-aa.html": renderProcedures(listProcedures({ ...options, locale })),
		"wcag-22-aa-checklist.html": renderProcedures(procedureChecklist({ ...options, locale })),
	};
	for (const [name, html] of Object.entries(pages)) {
		const out = path.join(dir, name);
		const rel = path.relative(ROOT, out);
		if (check) {
			const current = fs.existsSync(out) ? fs.readFileSync(out, "utf8") : null;
			if (current !== html) {
				console.error(`[sample-procedures] ${rel} is out of date: run npm run docs:sample-procedures`);
				stale++;
			}
			continue;
		}
		fs.mkdirSync(dir, { recursive: true });
		fs.writeFileSync(out, html);
		console.log(`[sample-procedures] wrote ${rel}`);
	}
}
if (stale) process.exit(1);
