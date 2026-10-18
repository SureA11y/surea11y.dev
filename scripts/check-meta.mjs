#!/usr/bin/env node
/**
 * Audits the built site (dist/) for page descriptions: every page must have a
 * <meta name="description"> of its own, matching its og: and twitter:
 * descriptions, and no two pages in the same locale may share one. A page
 * that falls back to the sitewide default (layout.defaultDescription) fails,
 * since search results and link previews would show the same summary for it
 * as for every other page. Run after `npm run build`.
 *
 * A new page gets its description from `description` in src/data/pages.ts
 * (translated as "page:<href>:description"), its nav entry, or, on a rule
 * page, the rule's own description.
 *
 * Usage: node scripts/check-meta.mjs [distDir]
 */
import fs from "node:fs";
import path from "node:path";
import { DEFAULT_LOCALE, locales } from "./lib/i18n-units.mjs";

const localeCodes = locales.map((l) => l.code);

const DIST = path.resolve(process.argv[2] ?? "dist");
const SKIP_PREFIXES = ["/from/"]; // referral redirect stubs, not content

function walk(dir) {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) return walk(full);
		return entry.name === "index.html" ? [full] : [];
	});
}

const decode = (s) =>
	s
		.replace(/&#x27;|&#39;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&amp;/g, "&");

const meta = (html, attr, name) => {
	const m = html.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`));
	return m ? decode(m[1]) : undefined;
};

const defaults = new Map(
	localeCodes.map((code) => [
		code,
		JSON.parse(fs.readFileSync(new URL(`../src/i18n/${code}.json`, import.meta.url), "utf8"))["layout.defaultDescription"],
	])
);
const localeOf = (route) => localeCodes.find((c) => c !== DEFAULT_LOCALE && route.startsWith(`/${c}/`)) ?? DEFAULT_LOCALE;

const errors = [];
const seen = new Map(); // locale -> description -> first route
let checked = 0;

for (const file of walk(DIST)) {
	const route = "/" + path.relative(DIST, path.dirname(file)).split(path.sep).join("/") + "/";
	const normalized = route.replace(/^\/\.\/$|^\/\/$/, "/");
	if (SKIP_PREFIXES.some((p) => normalized.startsWith(p))) continue;
	const html = fs.readFileSync(file, "utf8");
	if (/<meta name="robots" content="noindex"/.test(html)) continue;
	checked++;

	const description = meta(html, "name", "description");
	if (!description?.trim()) {
		errors.push(`${normalized}: no meta description`);
		continue;
	}
	const locale = localeOf(normalized);
	if ([...defaults.values()].includes(description)) {
		errors.push(`${normalized}: uses the sitewide default description; give the page its own`);
	}
	for (const [attr, name] of [
		["property", "og:description"],
		["name", "twitter:description"],
	]) {
		if (meta(html, attr, name) !== description) errors.push(`${normalized}: ${name} differs from the meta description`);
	}
	const byLocale = seen.get(locale) ?? new Map();
	seen.set(locale, byLocale);
	const first = byLocale.get(description);
	if (first) errors.push(`${normalized}: same description as ${first}`);
	else byLocale.set(description, normalized);
}

if (checked === 0) {
	console.error(`No pages found in ${DIST}; run \`npm run build\` first.`);
	process.exit(1);
}
if (errors.length) {
	console.error(errors.join("\n"));
	console.error(`\n${errors.length} problem(s) in ${checked} pages.`);
	process.exit(1);
}
console.log(`Page descriptions: ${checked} pages, each with its own description.`);
