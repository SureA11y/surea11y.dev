import React from "react";

export function ResultsReportsContent() {
	return (
		<>
			<p>
				Every scan comes back as one plain JSON object — nothing hidden, nothing you have to
				re-derive. The three report formats below are built directly on top of that same object,
				each one shaped for a different reader: a human scanning a browser tab, a CI dashboard that
				only speaks SARIF, or the W3C's own implementation-reporting format. Pick the shape that
				matches who's actually going to look at it.
			</p>

			<h2>Output schema</h2>
			<p>
				The exact contract every runner returns, and the one every other report format is derived
				from: a top-level result envelope, one entry per rule (including every{" "}
				<code>pass</code> and <code>notApplicable</code> — never a violations-only list), per-occurrence
				detail down to the flagged element, explicit uncertainty codes for anything a rule couldn't
				decide, and composite WCAG-SC rollups. Worth reading once if you're building anything on
				top of a raw result. See <a href="/results-reports/output-schema/">Output schema</a> for
				the full shape.
			</p>

			<h2>HTML report</h2>
			<p>
				Open it, understand it — no server, no build step, no JSON to squint at. A plain-language
				summary up top, a WCAG rollup grouped by conformance level sourced from the engine's own
				composite results, and a full searchable table underneath for anyone who wants to dig in.
				This is the report to hand a reviewer who doesn't want to read raw output. See{" "}
				<a href="/results-reports/html-report/">HTML report</a>.
			</p>

			<h2>SARIF report</h2>
			<p>
				Feed a scan straight into GitHub Code Scanning or any other SARIF-consuming dashboard,
				without writing a converter yourself. Violations map to SARIF results with a stable,
				content-based fingerprint, so a baseline still filters cleanly and a dashboard can track a
				finding across commits instead of losing it every time a line number shifts. See{" "}
				<a href="/results-reports/sarif-report/">SARIF report</a>.
			</p>

			<h2>EARL report</h2>
			<p>
				A W3C EARL/JSON-LD implementation report <strong>asserting every rule's outcome, not
				just the failures</strong> — the format the ACT Rules community group accepts as evidence an engine actually
				implements what it claims to. Useful proof when a claim of ACT conformance needs to be
				checkable, not just stated. See <a href="/results-reports/earl-report/">EARL report</a>.
			</p>
		</>
	);
}
