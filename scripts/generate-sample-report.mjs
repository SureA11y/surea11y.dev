#!/usr/bin/env node
/**
 * Writes a real HTML report from @surea11y/core, one per site language, for
 * pages to link to as an example: public/sample-report.html (English) and
 * public/<locale>/sample-report.html, which localizeLinks' prefixing finds.
 *
 * The scanned page is scripts/sample-report/demo.html, a small checkout page
 * built to give one finding of each kind the report groups: failures, a
 * question that leans fail, one that leans pass, and one only a person can
 * answer. It's scanned in Chromium with @surea11y/playwright and no rule
 * selection, the listener and live-region hooks installed, in each locale
 * (the report follows the scan's locale), served at an example URL so no
 * local path ends up in the report, and dated by a fixed timestamp.
 *
 * Not checked in CI (it needs a browser, and a report carries timings):
 * re-run it when core changes, and look at the reports before committing.
 *
 * Usage: npm run docs:sample-report
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { DEFAULT_LOCALE, localeCodes } from "../src/i18n/locales.ts";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const { A11yCoreBuilder } = require("@surea11y/playwright");
const { renderHtmlReport } = require("@surea11y/core/report");

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = fs.readFileSync(path.join(ROOT, "scripts/sample-report/demo.html"), "utf8");
const URL = "https://shop.example/checkout";
const TIMESTAMP = "2026-10-27T09:00:00.000Z";

const browser = await chromium.launch();
try {
	for (const locale of localeCodes) {
		const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
		await page.route(URL, (route) => route.fulfill({ contentType: "text/html", body: DEMO }));
		await A11yCoreBuilder.installListenerHook(page);
		await A11yCoreBuilder.installLiveRegionHook(page);
		await page.goto(URL);
		// No selection, as a first scan runs: every rule, so duplicate-id's
		// 4.1.1 question (which leans pass) is there for the third group.
		const result = await new A11yCoreBuilder({ page })
			.options({ locale, timestamp: TIMESTAMP })
			.analyze();
		await page.close();

		const out =
			locale === DEFAULT_LOCALE
				? path.join(ROOT, "public/sample-report.html")
				: path.join(ROOT, `public/${locale}/sample-report.html`);
		fs.mkdirSync(path.dirname(out), { recursive: true });
		fs.writeFileSync(out, renderHtmlReport(result));
		console.log(`[sample-report] wrote ${path.relative(ROOT, out)}`);
	}
} finally {
	await browser.close();
}
