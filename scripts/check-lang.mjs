#!/usr/bin/env node
/**
 * Lists English phrases in translated pages that aren't marked lang="en"
 * (WCAG 3.1.2, Language of Parts), so screen readers would read them with
 * the page language's voice. Run after `npm run build`.
 *
 * Heuristic, so it reports candidates rather than failing the build:
 * - Japanese: any run of two or more Latin-script words.
 * - Other languages: a run of Latin words containing at least two common
 *   English words ("the", "is", "more", …).
 * Skipped: <code>/<pre>, anything inside lang="en" or translate="no",
 * product and package names, and the site chrome outside <main>.
 *
 * Usage: node scripts/check-lang.mjs [distDir] [--locale=fr] [--all]
 *   --all prints every candidate instead of the first 20 per locale.
 */
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const DIST = path.resolve(args.find((a) => !a.startsWith("--")) ?? "dist");
const only = args.find((a) => a.startsWith("--locale="))?.split("=")[1];
const all = args.includes("--all");

const LOCALES = ["es", "fr", "de", "ja"];
// Words that are unambiguously English: short words shared with Spanish,
// French or German ("a", "no", "on", "in", "was", "will", "name", "page")
// are left out so ordinary translated prose doesn't match.
const ENGLISH = new Set(
	"the and is are this that these those with without you your has have had can't cannot don't doesn't isn't should would must not more click here read save changes submit of to for from which when there it its be been by at only if then than who how why where we our they their my welcome continue learn about contact search previous".split(" ")
);
const IGNORE = /^(surea11y|@surea11y\/\S+|Playwright|Cypress|Puppeteer|Selenium|WebdriverIO|Jest|Vitest|GitHub|GitLab|npm|Node\.js|WCAG|ACT|W3C|WAI-ARIA|ARIA|SARIF|EARL|HTML|CSS|JSON|CLI|CI|DOM|URL|API|MPL-2\.0|LinkedIn|Jorge Rumoroso|Chrome|Firefox|Safari|axe-core|Deque|Siteimprove|Alfa|BiDi|WebDriver|TypeScript|JavaScript)$/i;

function walk(dir) {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
		const full = path.join(dir, e.name);
		return e.isDirectory() ? walk(full) : e.name === "index.html" ? [full] : [];
	});
}

function textOf(html, locale) {
	const main = html.match(/<main[\s\S]*<\/main>/)?.[0] ?? "";
	let s = main
		.replace(/<(pre|code|script|style)\b[\s\S]*?<\/\1>/g, " ¦ ")
		.replace(/<!--[\s\S]*?-->/g, "");
	// Drop elements marked as another language or untranslatable, innermost first.
	const marked = new RegExp(
		`<(\\w+)\\b[^>]*\\s(?:lang="(?!${locale}")[a-z]{2,3}"|translate="no")[^>]*>(?:(?!<\\1\\b)[\\s\\S])*?<\\/\\1>`,
		"g"
	);
	for (let i = 0; i < 5; i++) {
		s = s.replace(marked, " ¦ ");
	}
	return s
		.replace(/<\/?(p|div|li|h\d|td|th|caption|summary|dt|dd|blockquote|figcaption)\b[^>]*>/g, "\n")
		.replace(/<[^>]+>/g, "")
		.replace(/&amp;/g, "&")
		.replace(/&#x27;|&#39;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/&[a-z#0-9]+;/gi, " ");
}

// A "run" is consecutive whitespace-separated tokens made only of ASCII
// letters (plus ' ’ - and trailing punctuation). A token with an accented or
// non-Latin letter ends the run, so "análisis" never splits into English-
// looking pieces.
const ASCII_TOKEN = /^[("'«„「]*([A-Za-z][A-Za-z'’-]*)[)"'»“」.,:;!?]*$/;
function candidates(line, locale) {
	const out = [];
	let run = [];
	const flush = () => {
		const words = run.filter((w) => !IGNORE.test(w));
		const english = run.filter((w) => ENGLISH.has(w.toLowerCase().replace(/’/g, "'")));
		const phrase = run.join(" ");
		if (words.length >= 2 && !IGNORE.test(phrase) && (locale === "ja" || english.length >= 2)) out.push(phrase);
		run = [];
	};
	// Japanese has no spaces, so split Latin runs out of it first.
	const text = locale === "ja" ? line.replace(/[^\x00-\x7F’]+/g, " | ") : line;
	for (const token of text.split(/\s+/)) {
		const m = token.match(ASCII_TOKEN);
		if (m) run.push(m[1]);
		else flush();
		if (m && /[.,:;!?)»“」]$/.test(token)) flush();
	}
	flush();
	return out;
}

let total = 0;
for (const locale of LOCALES) {
	if (only && only !== locale) continue;
	const root = path.join(DIST, locale);
	if (!fs.existsSync(root)) continue;
	const found = new Map();
	for (const file of walk(root)) {
		const route = "/" + path.relative(DIST, path.dirname(file)).split(path.sep).join("/") + "/";
		for (const line of textOf(fs.readFileSync(file, "utf8"), locale).split("\n")) {
			for (const c of candidates(line, locale)) {
				if (!found.has(c)) found.set(c, new Set());
				found.get(c).add(route);
			}
		}
	}
	total += found.size;
	console.log(`\n${locale}: ${found.size} unmarked English-looking phrase(s)`);
	[...found].slice(0, all ? Infinity : 20).forEach(([c, routes]) => {
		console.log(`  "${c}"  (${[...routes][0]}${routes.size > 1 ? ` +${routes.size - 1}` : ""})`);
	});
}
console.log(`\n${total} candidate(s). Mark real English with lang="en" (JSX) or [[en:…]] (rule text); product names and loanwords stay unmarked.`);
