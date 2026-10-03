/**
 * Scans every built page with @surea11y/core in a real browser, the way a
 * reader gets it: rendered by Chromium, at each viewport width below, once
 * the web fonts have loaded (text measured in a fallback font is a different
 * width, and layout rules such as text-spacing-content-loss can flip on it).
 *
 * Target: WCAG 2.2 Level AA (the `wcag22-aa` profile), the level the
 * accessibility statement claims. Any `fail` fails the run. `cantTell` is
 * reported, never failing, as in the engine's own exit-code convention.
 *
 * Writes a11y-results/ (gitignored):
 *   summary.md                     also appended to $GITHUB_STEP_SUMMARY
 *   reports/<width>/<route>.html   core's HTML report, one per page with a
 *                                  `fail` or a `cantTell` other than the
 *                                  per-page manual-review
 *
 * Usage: npm run build && npm run check:a11y
 *   --widths=375,1280   viewport widths (CSS px), default 375,1280; CI runs
 *                       one job per width
 *   --pages=/,/rules/   only these routes, for a quick local look
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const { A11yCoreBuilder } = require("@surea11y/playwright");
const { renderHtmlReport } = require("@surea11y/core/report");

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const OUT = path.join(ROOT, "a11y-results");
const PROFILE = "wcag22-aa";
const HEIGHT = 900;
const PARALLEL = 8;

const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const widths = (arg("widths") ?? "375,1280").split(",").map(Number);
const onlyPages = arg("pages")?.split(",");

if (!fs.existsSync(DIST)) {
	console.error("No dist/ — run `npm run build` first.");
	process.exit(2);
}

// Every built page except the referral redirects under /from/, which are a
// meta refresh and nothing else.
function builtRoutes() {
	const routes = [];
	(function walk(dir) {
		for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) walk(full);
			else if (entry.name === "index.html") {
				const rel = path.relative(DIST, dir).split(path.sep).join("/");
				routes.push(rel ? `/${rel}/` : "/");
			}
		}
	})(DIST);
	return routes.filter((r) => !/^\/(?:[a-z]{2}\/)?from\//.test(r)).sort();
}

const TYPES = {
	".html": "text/html; charset=utf-8",
	".css": "text/css",
	".js": "text/javascript",
	".svg": "image/svg+xml",
	".png": "image/png",
	".ico": "image/x-icon",
	".woff2": "font/woff2",
	".xml": "application/xml",
	".txt": "text/plain",
	".json": "application/json",
};

function serve() {
	const server = http.createServer((req, res) => {
		const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
		let file = path.join(DIST, urlPath);
		if (!file.startsWith(DIST)) {
			res.writeHead(403);
			return res.end();
		}
		if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
		if (!fs.existsSync(file)) {
			res.writeHead(404);
			return res.end();
		}
		res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
		fs.createReadStream(file).pipe(res);
	});
	return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

// manual-review asks a person to check keyboard order on every page; it is
// counted, not listed.
const listedCantTell = (c) => c.outcome === "cantTell" && c.ruleId !== "manual-review";

async function scanWidth(browser, origin, routes, width) {
	const context = await browser.newContext({ viewport: { width, height: HEIGHT } });
	const results = [];
	let next = 0;
	async function worker() {
		const page = await context.newPage();
		while (next < routes.length) {
			const route = routes[next++];
			try {
				await page.goto(origin + route, { waitUntil: "load" });
				await page.evaluate(() => document.fonts.ready);
				const result = await new A11yCoreBuilder({ page }).options({ profile: PROFILE }).analyze();
				results.push({ route, result });
			} catch (error) {
				results.push({ route, error: String(error).slice(0, 500) });
			}
		}
		await page.close();
	}
	await Promise.all(Array.from({ length: PARALLEL }, worker));
	await context.close();
	return results.sort((a, b) => a.route.localeCompare(b.route));
}

const slug = (route) => (route === "/" ? "index" : route.replace(/^\/|\/$/g, "").replace(/\//g, "__"));

function summarize(width, results) {
	const counts = { pass: 0, fail: 0, cantTell: 0, notApplicable: 0 };
	const findings = new Map(); // `${outcome} ${ruleId}` -> routes
	let manualReview = 0;
	const errors = [];
	for (const { route, result, error } of results) {
		if (error) {
			errors.push({ route, error });
			continue;
		}
		for (const c of result.checksResults) {
			counts[c.outcome] = (counts[c.outcome] ?? 0) + 1;
			if (c.ruleId === "manual-review" && c.outcome === "cantTell") manualReview++;
			if (c.outcome === "fail" || listedCantTell(c)) {
				const key = `${c.outcome} ${c.ruleId}`;
				if (!findings.has(key)) findings.set(key, []);
				findings.get(key).push(route);
			}
		}
		if (result.checksResults.some((c) => c.outcome === "fail" || listedCantTell(c))) {
			const file = path.join(OUT, "reports", String(width), `${slug(route)}.html`);
			fs.mkdirSync(path.dirname(file), { recursive: true });
			fs.writeFileSync(file, renderHtmlReport(result, { title: `${route} at ${width}px` }));
		}
	}
	return { width, pages: results.length, counts, findings, manualReview, errors };
}

function markdown(summaries, environment) {
	const lines = [`## Accessibility scan (WCAG 2.2 AA, \`${PROFILE}\`)`, ""];
	if (environment) lines.push(`@surea11y/core ${environment.version} · Chromium · fonts loaded before each scan`, "");
	lines.push("| Width | Pages | fail | cantTell | pass | Page errors |", "|---|---|---|---|---|---|");
	for (const s of summaries) {
		lines.push(`| ${s.width}px | ${s.pages} | ${s.counts.fail} | ${s.counts.cantTell} | ${s.counts.pass} | ${s.errors.length} |`);
	}
	lines.push("");
	for (const s of summaries) {
		const failing = [...s.findings].filter(([k]) => k.startsWith("fail "));
		const asking = [...s.findings].filter(([k]) => k.startsWith("cantTell "));
		lines.push(`### ${s.width}px`, "");
		if (!failing.length && !asking.length && !s.errors.length) {
			lines.push(`No failures. The only \`cantTell\` is \`manual-review\` on each page (${s.manualReview}), the keyboard check a person does.`, "");
			continue;
		}
		for (const [title, list] of [["Failures", failing], ["Needs review (besides manual-review)", asking]]) {
			if (!list.length) continue;
			lines.push(`**${title}**`, "");
			for (const [key, routes] of list) {
				const shown = routes.slice(0, 10).map((r) => `\`${r}\``).join(", ");
				lines.push(`- \`${key.split(" ")[1]}\` on ${routes.length} page(s): ${shown}${routes.length > 10 ? ", …" : ""}`);
			}
			lines.push("");
		}
		if (s.errors.length) {
			lines.push("**Pages that could not be scanned**", "");
			for (const e of s.errors) lines.push(`- \`${e.route}\`: ${e.error.split("\n")[0]}`);
			lines.push("");
		}
	}
	if (summaries.some((s) => s.findings.size)) {
		const artifact = summaries.length === 1 ? `a11y-results-${summaries[0].width}` : "a11y-results";
		lines.push(`HTML reports for each page with findings are in the \`${artifact}\` artifact.`, "");
	}
	return lines.join("\n");
}

const allRoutes = builtRoutes();
const routes = onlyPages ? allRoutes.filter((r) => onlyPages.includes(r)) : allRoutes;
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const server = await serve();
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const summaries = [];
let engine = null;
try {
	for (const width of widths) {
		const started = Date.now();
		const results = await scanWidth(browser, origin, routes, width);
		engine ??= results.find((r) => r.result)?.result.engine ?? null;
		const s = summarize(width, results);
		summaries.push(s);
		console.log(
			`${width}px: ${s.pages} pages in ${Math.round((Date.now() - started) / 1000)}s — ` +
				`${s.counts.fail} fail, ${s.counts.cantTell} cantTell (${s.manualReview} manual-review), ${s.errors.length} page errors`
		);
	}
} finally {
	await browser.close();
	server.close();
}

const coreVersion = require("@surea11y/core/package.json").version;
const md = markdown(summaries, engine && { version: coreVersion });
fs.writeFileSync(path.join(OUT, "summary.md"), md + "\n");
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + "\n");

const failed = summaries.some((s) => s.counts.fail > 0 || s.errors.length > 0);
for (const s of summaries) {
	for (const [key, list] of s.findings) if (key.startsWith("fail ")) console.log(`  ${s.width}px fail ${key.split(" ")[1]}: ${list.length} page(s)`);
	for (const e of s.errors) console.log(`  ${s.width}px could not scan ${e.route}: ${e.error.split("\n")[0]}`);
}
process.exit(failed ? 1 : 0);
