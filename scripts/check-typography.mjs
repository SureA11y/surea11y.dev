#!/usr/bin/env node
/**
 * Checks built pages in languages written without spaces between words
 * (Japanese) for stray spaces in the rendered text. JSX turns a line break
 * inside a paragraph into a space, and English-style `{" "}` joins do the
 * same around links and code, which is invisible in the source and obvious
 * to a Japanese reader.
 *
 * - error: a space between two Japanese characters (always wrong)
 * - warning: a space between Japanese and Latin text; the site's Japanese
 *   style leaves these out (the browser adds the gap via text-autospace)
 *
 * Code blocks, <code>, and English fallback content (lang="en") are skipped.
 *
 * Usage: node scripts/check-typography.mjs [distDir] [--strict]
 */
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const strict = args.includes("--strict");
const DIST = path.resolve(args.find((a) => !a.startsWith("--")) ?? "dist");
const UNSPACED = ["ja"];

const JA = "\\p{Script=Han}\\p{Script=Hiragana}\\p{Script=Katakana}ー々〆、。「」『』（）！？：；・…";
const JA_SPACE_JA = new RegExp(`[${JA}][ \\u00a0]+[${JA}]`, "u");
// \u0000 stands in for an inline <code> element, which counts as Latin text.
const JA_SPACE_LATIN = new RegExp(`[${JA}][ \\u00a0]+[A-Za-z0-9\\u0000]|[A-Za-z0-9\\u0000][ \\u00a0]+[${JA}]`, "u");

function walk(dir) {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
		const full = path.join(dir, e.name);
		return e.isDirectory() ? walk(full) : e.name === "index.html" ? [full] : [];
	});
}

function visibleText(html) {
	return html
		.replace(/<head[\s\S]*?<\/head>/, "")
		.replace(/<(script|style|pre)\b[\s\S]*?<\/\1>/g, "\n")
		.replace(/<code\b[\s\S]*?<\/code>/g, "\u0000") // opaque token, not Latin text
		.replace(/<(\w+)[^>]*\slang="en"[^>]*>[\s\S]*?<\/\1>/g, "\n")
		.replace(/<\/?(p|div|li|ul|ol|h\d|td|th|tr|table|nav|header|footer|section|article|aside|main|summary|details|br|caption)\b[^>]*>/g, "\n")
		.replace(/<[^>]+>/g, "")
		.replace(/&nbsp;|&#160;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&[a-z]+;|&#x?[0-9a-f]+;/gi, "·")
		.split("\n")
		.map((l) => l.replace(/[ \t]+/g, " ").trim())
		.filter(Boolean);
}

let errors = 0;
let warnings = 0;
for (const locale of UNSPACED) {
	const root = path.join(DIST, locale);
	if (!fs.existsSync(root)) continue;
	for (const file of walk(root)) {
		const route = "/" + path.relative(DIST, path.dirname(file)).split(path.sep).join("/") + "/";
		for (const line of visibleText(fs.readFileSync(file, "utf8"))) {
			const bad = line.match(JA_SPACE_JA);
			if (bad) {
				errors++;
				console.error(`${route}: space between Japanese characters: …${context(line, bad.index)}…`);
			}
			if (JA_SPACE_LATIN.test(line)) {
				warnings++;
				if (strict) console.warn(`${route}: space between Japanese and Latin text: ${line.slice(0, 120)}`);
			}
		}
	}
}

function context(line, i) {
	return line.slice(Math.max(0, i - 20), i + 20);
}

console.log(`${errors} error(s), ${warnings} Japanese/Latin spacing warning(s).`);
if (errors || (strict && warnings)) process.exit(1);
