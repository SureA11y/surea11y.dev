import React from "react";
import { Callout } from "./design-system/feedback/Callout.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const choiceRows = [
	{
		need: "Analyze a real web application",
		recommended: <a href="/getting-started/playwright/">Playwright</a>,
		reason: "Drives a real browser and an integration modern test suites already use, so results reflect actual layout and rendering.",
	},
	{
		need: "Analyze static HTML",
		recommended: <a href="/getting-started/cli/">CLI</a>,
		reason: (
			<>
				No integration to write — a single command against files, URLs, a sitemap, or a CI step;
				with <code>--browser</code>, it scans pages their JavaScript renders too.
			</>
		),
	},
	{
		need: "Already use Cypress, Selenium, Puppeteer, or WebdriverIO",
		recommended: "The matching binding",
		reason: "Fits directly into the test environment you already have.",
	},
	{
		need: "Unit or component tests",
		recommended: <a href="/getting-started/test-matchers/">test-matchers</a>,
		reason: "Direct Jest/Vitest integration against jsdom.",
	},
	{
		need: "Your own integration, or direct engine access",
		recommended: <a href="/getting-started/standalone/"><code>@surea11y/core</code></a>,
		reason: "Maximum control over execution and results.",
	},
];

export function GettingStartedContent() {
	return (
		<>
			<h2>Installation</h2>
			<p>
				There's no single install command — surea11y is a core engine plus a family of
				separately-published bindings, so which package(s) you install depends on how you already
				run tests or scripts. Pick your stack:
			</p>
			<Callout tone="note" title="Not sure where to start?">
				<p>
					Use <a href="/getting-started/playwright/">Playwright</a> to scan a real web
					application, or the <a href="/getting-started/cli/">CLI</a> to check static HTML
					from a terminal or CI pipeline.
				</p>
			</Callout>
			<DataTable
				label="Which option to choose"
				rowKey="need"
				columns={[
					{ key: "need", label: "Need", wrap: true },
					{ key: "recommended", label: "Recommended option" },
					{ key: "reason", label: "Reason", wrap: true },
				]}
				rows={choiceRows}
			/>

			<h2>A 5-minute example</h2>
			<p>
				The CLI is the fastest way to see a real result — no browser setup, no test framework.
				Scan a minimal page:
			</p>
			<CodeBlock lang="html" lines={[
				"<html lang=\"en\">",
				"  <body>",
				"    <main>",
				"      <h1>Welcome</h1>",
				"      <p style=\"color: #999999; background-color: #ffffff;\">This text has low contrast.</p>",
				"      <a href=\"/details\">Click here</a>",
				"    </main>",
				"  </body>",
				"</html>",
			]} />
			<CodeBlock
				lines={[
					{ text: "npm install -g @surea11y/cli", command: true },
					{ text: "surea11y scan ./index.html", command: true },
				]}
			/>
			<CodeBlock
				lines={[
					"",
					"surea11y scan: file:///path/to/index.html",
					"  engine: @surea11y/core 1.16.1",
					"  pass: 14   fail: 3   cantTell: 2   notApplicable: 126",
					"",
					"  occurrences by tier: fail: 3   cantTell: 2",
					"  needs review: likely fail: 0   likely pass: 0   needs a person: 2",
					"",
					"FAIL (3 rule(s)):",
					"",
					"  contrast-enhanced  (serious, 1 fail occurrence(s))",
					"    - html > body > main > p",
					"      Element has insufficient color contrast (AAA) of 2.85:1 (foreground:",
					"      #999999, background: #ffffff, font size: 16px, font weight: normal).",
					"      Expected contrast ratio of 7:1 (normal text).",
					"      hint: Change the text color, the background color, or both, so the",
					"      contrast ratio reaches at least 7:1.",
					"",
					"  contrast-minimum  (serious, 1 fail occurrence(s))",
					"    - html > body > main > p",
					"      Element has insufficient color contrast of 2.85:1 (foreground:",
					"      #999999, background: #ffffff, font size: 16px, font weight: normal).",
					"      Expected contrast ratio of 4.5:1 (normal text).",
					"      hint: Change the text color, the background color, or both, so the",
					"      contrast ratio reaches at least 4.5:1.",
					"",
					"  page-title-present  (serious, 1 fail occurrence(s))",
					"    - html > head",
					"      This page has no <title> element.",
					"      hint: Add a <title> that says what the page is about or what it is for.",
					"",
					"cantTell — needs human review (2 rule(s)): link-name-quality,",
					"manual-review",
					"",
					"criteria (WCAG 2.2):",
					"  fail       1.4.3 Contrast: minimum; 1.4.6 Contrast: enhanced; 2.4.2 Page",
					"             titled",
					"  cantTell   1.1.1 Non-text content: text alternatives; 1.2.1 Audio-only",
					"             and video-only (prerecorded): transcript; 1.2.2 Captions",
					"             (Prerecorded); 1.3.1 Info and Relationships; 1.3.4",
					"             Orientation; 1.3.5 Identify Input Purpose; 1.4.1 Use of",
					"             Color; 1.4.2 Audio Control; 1.4.4 Resize Text; 1.4.5 Images",
					"             of Text; 1.4.12 Text Spacing; 2.1.1 Keyboard; 2.1.3 Keyboard",
					"             (No Exception); 2.2.1 Timing Adjustable; 2.2.2 Pause, Stop,",
					"             Hide; 2.2.4 Interruptions; 2.4.1 Bypass Blocks; 2.4.3 Focus",
					"             order; 2.4.4 Link Purpose (In Context); 2.4.6 Headings and",
					"             Labels; 2.4.7 Focus visible; 2.4.9 Link Purpose (Link Only);",
					"             2.5.8 Target size: minimum; 3.1.1 Language of page; 3.1.2",
					"             Language of Parts; 3.2.5 Change on Request; 3.3.1 Error",
					"             Identification; 3.3.2 Labels or Instructions; 3.3.8",
					"             Accessible Authentication (Minimum); 4.1.2 Name, role, value:",
					"             accessible name; 4.1.2 Name, role, value: ARIA validity;",
					"             4.1.3 Status Messages",
					"  notApplicable: 2",
					"  A criterion that passes here means the checks that ran found nothing in",
					"  it, not that the page conforms.",
				]}
			/>
			<p>
				Two problems the engine is certain about, so they <code>fail</code>: the low-contrast text,
				failed at both the AA and AAA ratios, and the missing <code>&lt;title&gt;</code>. Then a{" "}
				<code>cantTell</code> list for a human to review (is "Click here" a good link name, is there
				something here needing a manual look); the <code>needs review</code> line says neither
				question leans either way, so both need a person. Among the 126 <code>notApplicable</code>{" "}
				results is <code>target-size-minimum</code>: it can't run without real CSS layout, which a
				static-HTML scan doesn't have (<code>--browser</code> gives it one).
			</p>
			<p>
				The last block reads the same result by WCAG 2.2 criterion: 1.4.3, 1.4.6 and 2.4.2{" "}
				<code>fail</code>; every other criterion the scan checks is <code>cantTell</code>, left for
				a person; and the 2 with nothing to judge are only counted. None is listed as{" "}
				<code>pass</code>: since <code>@surea11y/core</code> 1.14, a criterion passes only when its
				rules check everything it asks, and none does yet, so where they all pass, the rest is
				still a person's to check. See <a href="/results-reports/output-schema/">Results &amp; Reports</a>{" "}
				for what each field in a full result means.
			</p>
			<ul>
				<li>
					<strong>End-to-end tests, driving a real or headless browser:</strong>{" "}
					<a href="/getting-started/cypress/">Cypress</a>,{" "}
					<a href="/getting-started/playwright/">Playwright</a>,{" "}
					<a href="/getting-started/puppeteer/">Puppeteer</a>,{" "}
					<a href="/getting-started/selenium/">Selenium</a>, or{" "}
					<a href="/getting-started/webdriverio/">WebdriverIO</a>.
				</li>
				<li>
					<strong>Unit and component tests, against jsdom:</strong>{" "}
					<a href="/getting-started/test-matchers/">test-matchers</a>, for Jest or Vitest.
				</li>
				<li>
					<strong>Pages from a terminal or CI pipeline, as static HTML or in a browser:</strong> the{" "}
					<a href="/getting-started/cli/">CLI</a>.
				</li>
				<li>
					<strong>No test framework or build step:</strong>{" "}
					<a href="/getting-started/standalone/">standalone</a> — install{" "}
					<code>@surea11y/core</code> directly, or drop in the browser bundle.
				</li>
			</ul>

			<h2>Usage</h2>
			<p>
				However you run a scan — jsdom, a real browser, any binding, the CLI — it returns the
				same native result shape: <code>checksResults</code> (one entry per rule, including
				every <code>pass</code>/<code>notApplicable</code> — not a "violations only" list) and{" "}
				<code>rulesResults</code> (WCAG-SC rollups). This is <strong>not</strong> the{" "}
				<code>violations</code>/<code>passes</code>/<code>incomplete</code>/<code>inapplicable</code>{" "}
				shape used by other popular accessibility testing tools — each binding's method names are
				modeled on common conventions in this space for migration familiarity, but the richer
				result schema is kept as-is. See <a href="/results-reports/output-schema/">Results &amp; Reports</a> for
				the full schema.
			</p>
		</>
	);
}
