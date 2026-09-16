import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

export function HtmlReportContent() {
	return (
		<>
			<p>
				A self-contained HTML report you can open in a browser after a scan — no server, no
				external assets, no network requests. Built for QA/manual testers who want a browsable
				view of a scan's results rather than raw JSON or a terminal summary.
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --html report.html", command: true }]} />
			<p>
				Open <code>report.html</code> directly from disk. Works alongside any other output mode —{" "}
				<code>--html</code> doesn't replace <code>--json</code>/the default summary, it's an
				additional artifact written to the given path.
			</p>

			<h2>What it shows</h2>
			<ul>
				<li>
					<strong>Hero</strong>: one plain-language headline ("N of M applicable checks passed")
					plus a stacked bar and legend (icon + label + count — status is never color-only)
					broken down by outcome (<code>fail</code>/<code>cantTell</code>/<code>pass</code>/
					<code>notApplicable</code>).
				</li>
				<li>
					<strong>Worth reviewing</strong>: one card per rule with <code>fail</code>/
					<code>cantTell</code> occurrences (not one per occurrence — a rule with many identical
					occurrences is one thing worth attention, not many), each showing severity, WCAG SC
					chip(s), a representative occurrence, and the total occurrence count. Capped at the 24
					highest-priority rules with an overflow note past that.
				</li>
				<li>
					<strong>WCAG rollup</strong>: grouped by conformance level (A / AA / AAA), sourced
					directly from the engine's own <code>rulesResults[]</code> composite rollups (see{" "}
					<a href="/conformance/wcag-mapping/">Conformance</a>) — one row per Success Criterion, its outcome, a
					pass/fail/needs-review/n/a breakdown, and which atomic rules contributed. This is real
					engine data, not an invented grouping — the same rollup you'd get from the raw JSON's{" "}
					<code>rulesResults</code>.
				</li>
				<li>
					<strong>Full technical data</strong> (collapsed by default): a scorecard (tiles per
					outcome) and a searchable, filterable (by outcome), paginated table of every individual
					occurrence across the whole scan.
				</li>
			</ul>
			<p>
				The meta bar under the header carries the rule count, occurrence count, engine tag, schema
				version, and the locale the scan resolved to. Locale fallback is per-string and invisible
				in the text itself, so a report requested in a language the engine does not carry reads as
				an ordinary English one — the chip names the requested locale alongside the resolved one
				when the two differ. See <a href="/configuration/locales/">Locales</a>.
			</p>

			<h2>Library usage</h2>
			<CodeBlock
				lang="js"
				lines={[
					"const { renderHtmlReport } = require('@surea11y/core/report');",
					"const { runDomRulesInPage } = require('@surea11y/core');",
					"",
					"const result = runDomRulesInPage(url, null, {}, null);",
					"const html = renderHtmlReport(result, { title: 'My scan report' });",
					"",
					"require('fs').writeFileSync('report.html', html);",
				]}
			/>
			<p>
				<code>renderHtmlReport(result, options)</code> is a pure function — it returns a string, it
				never touches the filesystem itself (the CLI's <code>--html</code> flag does the writing).{" "}
				<code>options.title</code> is optional (defaults to <code>"surea11y scan report"</code>).
			</p>

			<h2>Scope</h2>
			<p>
				This is a single-scan report — one point-in-time snapshot, not a dashboard tracking
				results across many scans over time. Tracking results across many runs is a separate,
				larger concern and isn't part of this tool: keep the JSON from each scan and diff it
				yourself, or feed SARIF to a dashboard that already does history (see{" "}
				<a href="/results-reports/sarif-report/">SARIF report</a> below).
			</p>
		</>
	);
}
