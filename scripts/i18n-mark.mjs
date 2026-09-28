#!/usr/bin/env node
/**
 * Records translations as up to date with the current English, in
 * src/i18n/translation-sources.json. Run it after updating (or reviewing and
 * confirming) a translation that `npm run i18n:check` listed as outdated.
 *
 * Usage:
 *   node scripts/i18n-mark.mjs --locale=fr content:components/FaqContent rule:accesskeys
 *   node scripts/i18n-mark.mjs --locale=fr --stale      every outdated or untracked unit of fr
 *   node scripts/i18n-mark.mjs --all                    every translated unit of every locale
 *
 * --stale and --all are for after a review pass: they record what's there
 * now as current, so only use them once the translations really match the
 * English. Unit ids are the ones i18n:check prints.
 */
import { DEFAULT_LOCALE, englishFingerprints, loadManifest, locales, saveManifest, staleUnits, translatedUnits } from "./lib/i18n-units.mjs";

const args = process.argv.slice(2);
const locale = args.find((a) => a.startsWith("--locale="))?.split("=")[1];
const all = args.includes("--all");
const stale = args.includes("--stale");
const units = args.filter((a) => !a.startsWith("--"));

const codes = locales.map((l) => l.code).filter((c) => c !== DEFAULT_LOCALE);
if (!all && !codes.includes(locale)) {
	console.error(`Pass --locale=<${codes.join("|")}> (or --all).`);
	process.exit(1);
}
if (!all && !stale && units.length === 0) {
	console.error("Name the units to mark current, or pass --stale.");
	process.exit(1);
}

const manifest = loadManifest();
const current = englishFingerprints();
let marked = 0;

for (const code of all ? codes : [locale]) {
	const translated = new Set(translatedUnits(code));
	let targets;
	if (all) targets = [...translated];
	else if (stale) {
		const s = staleUnits(code, manifest, current);
		targets = [...s.stale, ...s.untracked];
	} else targets = units;

	manifest[code] ??= {};
	for (const unit of targets) {
		if (!translated.has(unit)) {
			console.error(`${code}: ${unit} has no translation to mark (typo, or not translated yet).`);
			process.exitCode = 1;
			continue;
		}
		manifest[code][unit] = current.get(unit);
		marked++;
	}
	// Drop entries for units that no longer exist or are no longer translated.
	for (const unit of Object.keys(manifest[code])) if (!translated.has(unit)) delete manifest[code][unit];
}

saveManifest(manifest);
console.log(`Marked ${marked} unit(s) as current.`);
