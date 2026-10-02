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
					<a href="/conformance/wcag-mapping/">Conformance</a>) — one row per Success Criterion (with
					the EN 301 549 clause that restates it, where there is one and the scan asked for EN 301
					549 clauses), its outcome, a pass/fail/needs-review/n/a breakdown, and which atomic rules
					contributed. This is real engine data, not an invented grouping — the same rollup you'd
					get from the raw JSON's <code>rulesResults</code>.
					</li>
					<li>
						<strong>A standard's own rollup</strong>: only when the scan ran the rules of a standard
						that has rollups of its own (its profile, or <code>engineOptions.optInRules</code>), one
						row per rollup, with the standard's wording, the breakdown and the contributing rules.
					</li>
				<li>
					<strong>Full technical data</strong> (collapsed by default): a scorecard (tiles per
					outcome) and a searchable, filterable (by outcome), paginated table of every individual
					occurrence across the whole scan.
				</li>
			</ul>
			<p>
				The meta bar under the header carries the rule count, occurrence count, engine tag, schema
				version, the WCAG version the scan targeted, the <code>engineOptions.profile</code> it used
				(when there was one), the opt-in rule tags <code>engineOptions.optInRules</code> added (when
				it added any), and the locale the scan resolved to. Locale fallback is per-string and
				invisible in the text itself, so{" "}
				<strong>a report requested in a language the engine does not carry reads as an ordinary
				English one</strong> — the chip names the requested locale alongside the resolved one
				when the two differ. See <a href="/configuration/locales/">Locales</a>.
				</p>
				<p>
					The whole page is written in the locale the scan resolved to: headings, table columns,
					outcome and severity names, the headline, the pager, and the date format.{" "}
					<code>&lt;html lang&gt;</code> names that locale. The outcome codes in the occurrence
					filters (<code>fail</code>, <code>cantTell</code>, …) stay as they are, because they are the
					values a reader searches for in the JSON result.
				</p>
				<p>
					One case keeps English labels: a scan in a language the engine does not ship, run with a
					caller-supplied <code>engineOptions.messages</code> dictionary. That dictionary is not part
					of the result, so the report cannot read labels from it; its findings are then marked with
					their own language (<code>lang="nl"</code>, for instance), so a screen reader still reads
					them with the right voice.
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
				<code>renderHtmlReport(result, options)</code> is a pure function — it returns a string,{" "}
				<strong>it never touches the filesystem itself</strong> (the CLI's <code>--html</code>{" "}
				flag does the writing).{" "}
				<code>options.title</code> is optional (defaults to <code>"surea11y scan report"</code>).
			</p>

			<h2>Scope</h2>
			<p>
				<strong>This is a single-scan report — one point-in-time snapshot, not a dashboard
				tracking results across many scans over time.</strong> Tracking results across many runs is a separate,
				larger concern and isn't part of this tool: keep the JSON from each scan and diff it
				yourself, or feed SARIF to a dashboard that already does history (see{" "}
				<a href="/results-reports/sarif-report/">SARIF report</a> below).
			</p>
		</>
	);
}
