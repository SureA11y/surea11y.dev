import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";

const formatRows = [
	{ format: <code>JSON</code>, use: "Integration, storage, and your own processing", audience: "Developers and platforms" },
	{ format: "HTML", use: "Human review of one concrete scan", audience: "QA and audit" },
	{ format: "SARIF", use: "Integration with code-analysis tooling", audience: "Development and security teams" },
	{ format: "JUnit", use: "Test views in CI dashboards", audience: "Development and QA teams" },
	{ format: "EARL", use: "Interoperability and ACT implementation reporting", audience: "Standards, research, and conformance" },
];

export function ResultsReportsContent() {
	return (
		<>
			<p>
				Every scan comes back as one plain JSON object. The four report formats below are
				generated from that same object,
				each one shaped for a different reader: a human scanning a browser tab, a code-scanning
				dashboard that only speaks SARIF, a CI test view that reads JUnit, or the W3C's own
				implementation-reporting format. Pick the shape that
				matches who's actually going to look at it.
			</p>
			<DataTable
				label="Output formats"
				rowKey="format"
				columns={[
					{ key: "format", label: "Format" },
					{ key: "use", label: "Primary use", wrap: true },
					{ key: "audience", label: "Audience" },
				]}
				rows={formatRows}
			/>

			<h2>Output schema</h2>
			<p>
				The exact contract every runner returns, and the one every other report format is derived
				from: a top-level result envelope, one entry per rule (including every{" "}
				<code>pass</code> and <code>notApplicable</code> — never a violations-only list), per-occurrence
				detail down to the flagged element, explicit uncertainty codes for anything a rule couldn't
				decide, and composite WCAG-SC rollups. Every undecided finding says how a person answers
				it, and some say which way the page's evidence points (a <em>lean</em>), so a review
				starts with the likely failures rather than a flat list. Worth reading once if you're building anything on
				top of a raw result. See <a href="/results-reports/output-schema/">Output schema</a> for
				the full shape.
			</p>

			<h2>HTML report</h2>
			<p>
				One HTML file that opens in any browser, with no server or build step. A plain-language
				summary up top, the failures, then the findings that need review sorted into likely
				fails, likely passes and the ones only a person can judge, each with the steps to check it,
				a WCAG rollup grouped by conformance level sourced from the engine's own composite results,
				and a full searchable table underneath for anyone who wants to dig in.
				This is the report to hand a reviewer who doesn't want to read raw output. See{" "}
				<a href="/results-reports/html-report/">HTML report</a>.
			</p>

			<h2>SARIF report</h2>
			<p>
				Feed a scan straight into GitHub Code Scanning or any other SARIF-consuming dashboard,
				without writing a converter yourself. Violations map to SARIF results with a stable,
				content-based fingerprint, so a <a href="/conformance/baseline/">baseline / allowlist</a>{" "}
				still filters cleanly and a dashboard can track a
				finding across commits instead of losing it every time a line number shifts. A log with
				no results means nothing failed or needs review among the checks that ran; it is not a
				conformance claim. One option raises the findings that likely fail to errors, for a build
				that gates on them without gating on every question. See <a href="/results-reports/sarif-report/">SARIF report</a>.
			</p>

			<h2>JUnit report</h2>
			<p>
				Put accessibility results in the test view your CI already has — GitLab's merge request
				widget, Azure DevOps' Tests tab, Jenkins, CircleCI — next to your unit tests. Each WCAG
				criterion is a suite and each rule a test, so a defect repeated across a page is one
				failing test, and counts stay stable between runs. <code>cantTell</code> arrives as a
				skipped test, visible without turning the build red, unless you choose to fail the build on
				the ones that likely fail. Suite names are the same in every
				locale, so test history doesn't restart when the scan's language changes. A green suite
				means the rules that ran for a criterion found nothing, not that the criterion is met. See{" "}
				<a href="/results-reports/junit-report/">JUnit report</a>.
			</p>

			<h2>EARL report</h2>
			<p>
				A W3C EARL/JSON-LD implementation report <strong>asserting every rule's outcome, not
				just the failures</strong> — the format the ACT Rules community group accepts for implementation reports. Run
				on the ACT test cases, it records the outcome for each one, so how the engine implements
				each rule can be examined rather than taken on trust. It is neither a certification nor
				evidence of WCAG conformance: being listed as an ACT implementation is not a W3C
				endorsement. See <a href="/results-reports/earl-report/">EARL report</a>.
			</p>
		</>
	);
}
