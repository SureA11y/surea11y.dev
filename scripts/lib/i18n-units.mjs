/**
 * Shared by check-i18n.mjs and i18n-mark.mjs: what the site translates, and
 * a fingerprint of the English each translation is based on.
 *
 * A "unit" is one translatable piece, identified the same way everywhere:
 *   content:components/FaqContent   a content file (Name.jsx -> Name.<code>.jsx)
 *   content:data/bindingUsage       the binding install/usage data
 *   string:footer.about             an interface string (en.json key), or a
 *   string:nav:/help/               nav label / page title from site data
 *   rule:accesskeys                 one rule's prose (title, description,
 *                                   applicability, expectation, examples,
 *                                   deprecation reason)
 *
 * src/i18n/translation-sources.json records, per locale and unit, the
 * fingerprint of the English source when that translation was written or
 * last reviewed. A current fingerprint that differs means the English has
 * changed since, and the translation may be out of date.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
export const rel = (...p) => path.join(ROOT, ...p);
export const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
export const MANIFEST = rel("src/i18n/translation-sources.json");

export const { locales, DEFAULT_LOCALE } = await import(rel("src/i18n/locales.ts"));
const { contentPages } = await import(rel("src/data/pages.ts"));
const { sections } = await import(rel("src/data/sections.ts"));
const navFiles = [
	["gettingStartedSections", "gettingStartedSections.ts"],
	["rulesSections", "rulesSections.ts"],
	["configurationSections", "configurationSections.ts"],
	["resultsReportsSections", "resultsReportsSections.ts"],
	["conformanceSections", "conformanceSections.ts"],
	["helpSections", "helpSections.ts"],
];
const navEntries = [...sections];
for (const [name, file] of navFiles) {
	navEntries.push(...(await import(rel("src/data", file)))[name]);
}

// Content modules the site renders per locale: every page's component, the
// shared binding data, and the two route-specific components.
export const contentModules = [
	...new Set(
		[
			...contentPages.filter((p) => p.content).map((p) => ["components", p.content]),
			["data", "bindingUsage"],
			["components", "OverviewContent"],
			["components", "RulesIntroContent"],
		].map(JSON.stringify)
	),
].map(JSON.parse);

export const english = readJson(rel("src/i18n", `${DEFAULT_LOCALE}.json`));
export const rules = readJson(rel("src/data/rules.generated.json"));

// Keys a locale dictionary may carry beyond en.json's: translations of
// English that lives in site data (nav labels, page titles/descriptions).
export const dataKeys = new Map();
for (const e of navEntries) {
	dataKeys.set(`nav:${e.href}`, e.label);
	if (e.description) dataKeys.set(`nav:${e.href}:description`, e.description);
}
for (const p of contentPages) {
	dataKeys.set(`page:${p.href}:title`, p.title);
	if (p.description) dataKeys.set(`page:${p.href}:description`, p.description);
}

// Whitespace-only edits (reindenting, rewrapping) don't count as changes.
const fingerprint = (text) =>
	crypto.createHash("sha256").update(text.replace(/\s+/g, " ").trim()).digest("hex").slice(0, 12);

const ruleText = (r) =>
	[
		r.title,
		r.description,
		r.applicability,
		r.expectation,
		...r.examples.map((e) => e.explanation),
		...(r.deprecation?.reason ? [r.deprecation.reason] : []),
	].join("\n");

/** Current fingerprint of the English source of every unit. */
export function englishFingerprints() {
	const out = new Map();
	for (const [dir, mod] of contentModules) {
		out.set(`content:${dir}/${mod}`, fingerprint(fs.readFileSync(rel("src", dir, `${mod}.jsx`), "utf8")));
	}
	for (const [key, value] of Object.entries(english)) out.set(`string:${key}`, fingerprint(value));
	for (const [key, value] of dataKeys) out.set(`string:${key}`, fingerprint(value));
	for (const r of rules) out.set(`rule:${r.ruleId}`, fingerprint(ruleText(r)));
	return out;
}

/** The units a locale has actually translated (a file, key or overlay entry exists). */
export function translatedUnits(code) {
	const units = [];
	for (const [dir, mod] of contentModules) {
		if (fs.existsSync(rel("src", dir, `${mod}.${code}.jsx`))) units.push(`content:${dir}/${mod}`);
	}
	const dictFile = rel("src/i18n", `${code}.json`);
	const dict = fs.existsSync(dictFile) ? readJson(dictFile) : {};
	for (const key of Object.keys(dict)) {
		if (key in english || dataKeys.has(key)) units.push(`string:${key}`);
	}
	const overlayFile = rel("src/data", `rules.i18n.${code}.json`);
	const overlay = fs.existsSync(overlayFile) ? readJson(overlayFile) : {};
	for (const r of rules) if (overlay[r.ruleId]) units.push(`rule:${r.ruleId}`);
	return units;
}

export function loadManifest() {
	return fs.existsSync(MANIFEST) ? readJson(MANIFEST) : {};
}

export function saveManifest(manifest) {
	const sorted = {};
	for (const code of Object.keys(manifest).sort()) {
		sorted[code] = Object.fromEntries(Object.entries(manifest[code]).sort(([a], [b]) => a.localeCompare(b)));
	}
	fs.writeFileSync(MANIFEST, JSON.stringify(sorted, null, "\t") + "\n");
}

/** Units whose English has changed since the translation was recorded, or that were never recorded. */
export function staleUnits(code, manifest = loadManifest(), current = englishFingerprints()) {
	const recorded = manifest[code] ?? {};
	const stale = [];
	const untracked = [];
	for (const unit of translatedUnits(code)) {
		if (!(unit in recorded)) untracked.push(unit);
		else if (recorded[unit] !== current.get(unit)) stale.push(unit);
	}
	return { stale, untracked };
}
