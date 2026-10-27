#!/usr/bin/env node
/**
 * Audits the built site (dist/) for broken internal links: every root-relative
 * or same-page <a href> must point at a built route, and a #fragment must
 * match an id on the target page. Run after `npm run build`.
 *
 * Also flags a localized page linking out of its own locale (an /es/ page
 * linking to an unprefixed English route), which usually means a link that
 * bypassed localizeLinks().
 *
 * Usage: node scripts/check-links.mjs [distDir]
 */
import fs from "node:fs";
import path from "node:path";

const DIST = path.resolve(process.argv[2] ?? "dist");
const SKIP_PREFIXES = ["/from/"]; // referral redirect stubs, not content

function walk(dir) {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) return walk(full);
		return entry.name === "index.html" ? [full] : [];
	});
}

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');

const pages = new Map();
for (const file of walk(DIST)) {
	const route = "/" + path.relative(DIST, path.dirname(file)).split(path.sep).filter(Boolean).join("/");
	const normalized = route === "/" ? "/" : `${route}/`;
	const html = fs.readFileSync(file, "utf8");
	const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => decode(m[1])));
	const links = [...html.matchAll(/<a\b[^>]*>/g)].map((m) => m[0]);
	const hrefs = links
		.map((tag) => ({ href: tag.match(/\shref="([^"]+)"/)?.[1], hreflang: /\shreflang=/.test(tag) }))
		.filter((l) => l.href)
		.map((l) => ({ ...l, href: decode(l.href) }));
	const lang = html.match(/<html[^>]*\slang="([^"]+)"/)?.[1] ?? "";
	pages.set(normalized, { ids, hrefs, lang });
}

const locales = new Set([...pages.values()].map((p) => p.lang).filter(Boolean));
const localePrefix = (route) => {
	const first = route.split("/")[1];
	return locales.has(first) ? first : null;
};

const problems = [];
for (const [route, page] of pages) {
	if (SKIP_PREFIXES.some((p) => route.startsWith(p))) continue;
	for (const { href, hreflang } of page.hrefs) {
		if (!href.startsWith("/") && !href.startsWith("#")) continue;
		if (href.startsWith("//")) continue;
		const [rawPath, fragment] = href.split("#");
		const targetRoute = rawPath === "" ? route : rawPath.endsWith("/") ? rawPath : `${rawPath}/`;
		const target = pages.get(targetRoute);
		// A static file from public/ (a sample report) isn't a route; it only
		// has to exist, and has no ids to check.
		if (!target && /\.[a-z]+$/.test(rawPath) && fs.existsSync(path.join(DIST, rawPath))) continue;
		if (!target) {
			problems.push(`${route}: link to missing page ${href}`);
			continue;
		}
		if (fragment && !target.ids.has(decodeURIComponent(fragment))) {
			problems.push(`${route}: link to missing anchor ${href}`);
		}
		const fromLocale = localePrefix(route);
		// Language-switcher links cross locales on purpose and say so with hreflang.
		if (rawPath && fromLocale && !hreflang && localePrefix(targetRoute) === null) {
			problems.push(`${route}: leaves its locale via ${href}`);
		}
	}
}

console.log(`Checked ${pages.size} pages.`);
if (problems.length) {
	console.error(problems.join("\n"));
	console.error(`\n${problems.length} problem(s).`);
	process.exit(1);
}
console.log("No broken internal links or anchors.");
