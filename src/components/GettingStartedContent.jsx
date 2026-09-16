import React from "react";

export function GettingStartedContent() {
	return (
		<>
			<h2>Installation</h2>
			<p>
				There's no single install command — surea11y is a core engine plus a family of
				separately-published bindings, so which package(s) you install depends on how you already
				run tests or scripts. Pick your stack below: Cypress, Playwright, Puppeteer, Selenium,
				WebdriverIO, the CLI, or standalone (installing <code>@surea11y/core</code> directly, or
				the browser bundle).
			</p>

			<h2>Usage</h2>
			<p>
				However you run a scan — jsdom, a real browser, any binding, the CLI — it returns the
				same native result shape: <code>checksResults</code> (one entry per rule, including
				every <code>pass</code>/<code>notApplicable</code> — not a "violations only" list) and{" "}
				<code>rulesResults</code> (WCAG-SC rollups). This is <strong>not</strong> the{" "}
				<code>violations</code>/<code>passes</code>/<code>incomplete</code>/<code>inapplicable</code>{" "}
				shape used by other popular accessibility testing tools — each binding's method names are
				modeled on common conventions in this space for migration familiarity, but the richer
				result schema is kept as-is. See <a href="/results-reports/">Results &amp; Reports</a> for
				the full schema.
			</p>
		</>
	);
}
