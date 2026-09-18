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
		reason: "No integration to write — a single command against a file, URL, or CI step.",
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
					"surea11y scan: file:///path/to/index.html",
					"  pass: 6   fail: 2   cantTell: 3   notApplicable: 114",
					"",
					"  occurrences by tier: fail: 2   cantTell: 4",
					"",
					"FAIL (2 rule(s)):",
					"",
					"  contrast-enhanced  (serious, 1 fail occurrence(s))",
					"    - html > body > main > p",
					"      Element has insufficient color contrast (AAA) of 2.85:1 (foreground: #999999,",
					"      background: #ffffff, font size: 0px, font weight: normal). Expected contrast",
					"      ratio of 7:1 (normal text).",
					"",
					"  contrast-minimum  (serious, 1 fail occurrence(s))",
					"    - html > body > main > p",
					"      Element has insufficient color contrast of 2.85:1 (foreground: #999999,",
					"      background: #ffffff, font size: 0px, font weight: normal). Expected contrast",
					"      ratio of 4.5:1 (normal text).",
					"",
					"cantTell — needs human review (3 rule(s)): contrast-computable, link-name-quality,",
					"manual-review",
				]}
			/>
			<p>
				One <code>fail</code> the engine is certain about (contrast), a <code>cantTell</code> list
				for a human to review (is "Click here" a good link name, does that same low-contrast text
				pass a different check, is there something here needing a manual look), and, among the 114{" "}
				<code>notApplicable</code> results, <code>target-size-minimum</code> — it can't run without
				real CSS layout, which a static-HTML scan doesn't have. See{" "}
				<a href="/results-reports/output-schema/">Results &amp; Reports</a> for what each field in a
				full result means.
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
					<strong>Static HTML from a terminal or CI pipeline:</strong> the{" "}
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
