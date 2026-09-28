#!/usr/bin/env node
/**
 * Translation coverage report for every locale in src/i18n/locales.ts.
 *
 * For each non-default locale, lists what is still missing (and therefore
 * shown in English): interface strings, nav labels, page titles, content
 * components and rule-page prose. Missing translations are expected while a
 * language is in progress and do not fail the run unless --strict is passed.
 *
 * Always fails on things that are wrong rather than unfinished:
 *   - a dictionary key English doesn't have (typo or leftover)
 *   - a {placeholder} that doesn't match the English string's
 *   - a translated content file whose exports differ from the English file's
 *   - a rule overlay entry for a rule that doesn't exist, or with a different
 *     number of examples than the rule has
 *
 * Also lists outdated translations: ones whose English source has changed
 * since the translation was written or last reviewed, per the fingerprints
 * in src/i18n/translation-sources.json (see scripts/lib/i18n-units.mjs and
 * scripts/i18n-mark.mjs).
 *
 * Usage: node scripts/check-i18n.mjs [--strict] [--locale=fr]
 *   --strict also fails on missing or outdated translations.
 */
import fs from "node:fs";
import {
	contentModules,
	dataKeys,
	DEFAULT_LOCALE,
	english,
	loadManifest,
	locales,
	readJson,
	rel,
	rules,
	staleUnits,
	englishFingerprints,
} from "./lib/i18n-units.mjs";

const args = process.argv.slice(2);
const strict = args.includes("--strict");
const only = args.find((a) => a.startsWith("--locale="))?.split("=")[1];

const exportsOf = (file) =>
	[...fs.readFileSync(file, "utf8").matchAll(/^export\s+(?:function|const|let)\s+(\w+)/gm)].map((m) => m[1]).sort();
const placeholders = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");

const ruleIds = new Set(rules.map((r) => r.ruleId));
const manifest = loadManifest();
const fingerprints = englishFingerprints();

let errors = 0;
let missingTotal = 0;
let staleTotal = 0;

for (const { code, name } of locales) {
	if (code === DEFAULT_LOCALE || (only && code !== only)) continue;
	const errs = [];
	const missing = { ui: [], nav: [], content: [], rules: [] };

	const dictFile = rel("src/i18n", `${code}.json`);
	const dict = fs.existsSync(dictFile) ? readJson(dictFile) : {};
	if (!fs.existsSync(dictFile)) errs.push(`src/i18n/${code}.json does not exist`);

	for (const [key, value] of Object.entries(english)) {
		if (!(key in dict)) missing.ui.push(key);
		else if (placeholders(dict[key]) !== placeholders(value)) {
			errs.push(`${code}.json "${key}": placeholders {${placeholders(dict[key])}} ≠ English {${placeholders(value)}}`);
		}
	}
	for (const [key, value] of dataKeys) {
		if (!(key in dict)) missing.nav.push(key);
	}
	for (const key of Object.keys(dict)) {
		if (!(key in english) && !dataKeys.has(key)) errs.push(`${code}.json has unknown key "${key}"`);
	}

	for (const [dir, mod] of contentModules) {
		const base = rel("src", dir, `${mod}.jsx`);
		const translated = rel("src", dir, `${mod}.${code}.jsx`);
		if (!fs.existsSync(translated)) {
			missing.content.push(`src/${dir}/${mod}.${code}.jsx`);
			continue;
		}
		const want = exportsOf(base).join(", ");
		const got = exportsOf(translated).join(", ");
		if (want !== got) errs.push(`src/${dir}/${mod}.${code}.jsx exports [${got}], English exports [${want}]`);
	}

	const overlayFile = rel("src/data", `rules.i18n.${code}.json`);
	const overlay = fs.existsSync(overlayFile) ? readJson(overlayFile) : {};
	for (const rule of rules) {
		const entry = overlay[rule.ruleId];
		if (!entry) {
			missing.rules.push(rule.ruleId);
			continue;
		}
		if ((entry.examples ?? []).length !== rule.examples.length) {
			errs.push(`rules.i18n.${code}.json "${rule.ruleId}": ${entry.examples?.length ?? 0} examples, rule has ${rule.examples.length}`);
		}
	}
	for (const id of Object.keys(overlay)) {
		if (!ruleIds.has(id)) errs.push(`rules.i18n.${code}.json has unknown rule "${id}"`);
	}

	const pct = (have, total) => `${total - have}/${total}`;
	console.log(`\n${name} (${code})`);
	console.log(`  interface strings  ${pct(missing.ui.length, Object.keys(english).length)}`);
	console.log(`  nav + page titles  ${pct(missing.nav.length, dataKeys.size)}`);
	console.log(`  content pages      ${pct(missing.content.length, contentModules.length)}`);
	console.log(`  rule pages         ${pct(missing.rules.length, rules.length)}`);
	for (const [kind, list] of Object.entries(missing)) {
		if (!list.length) continue;
		const shown = list.slice(0, 15).join(", ");
		console.log(`  missing ${kind}: ${shown}${list.length > 15 ? `, … (${list.length - 15} more)` : ""}`);
	}
	const { stale, untracked } = staleUnits(code, manifest, fingerprints);
	const outdated = [...stale, ...untracked];
	if (outdated.length) {
		console.log(`  outdated: ${outdated.length} translation(s) whose English changed since they were written`);
		for (const unit of outdated.slice(0, 25)) console.log(`    ${unit}${untracked.includes(unit) ? "  (never recorded)" : ""}`);
		if (outdated.length > 25) console.log(`    … (${outdated.length - 25} more)`);
	}
	for (const e of errs) console.error(`  ERROR ${e}`);

	errors += errs.length;
	missingTotal += Object.values(missing).reduce((n, l) => n + l.length, 0);
	staleTotal += outdated.length;
}

if (errors) {
	console.error(`\n${errors} error(s).`);
	process.exit(1);
}
if (staleTotal) {
	console.log(
		`\n${staleTotal} outdated translation(s). Update each one to match the current English (git log -p on the English source shows what changed), then record it: npm run i18n:mark -- --locale=<code> <unit…>`
	);
}
if (strict && (missingTotal || staleTotal)) {
	console.error(`\n${missingTotal} missing, ${staleTotal} outdated translation(s) (--strict).`);
	process.exit(1);
}
