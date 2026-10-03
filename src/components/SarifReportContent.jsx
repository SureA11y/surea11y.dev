import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const sarifLevelRows = [
	{ id: "fail", outcome: <code>fail</code>, level: <code>error</code>, meaning: "Deterministic violation — the CI-gating case." },
	{ id: "cantTell", outcome: <code>cantTell</code>, level: <code>warning</code>, meaning: "Needs human review — surfaced, but shouldn't block a build on its own." },
];

const sarifFieldRows = [
	{ id: "ruleId", field: <code>results[].ruleId</code>, source: <code>checksResults[i].ruleId</code> },
	{ id: "message", field: <code>results[].message.text</code>, source: <><code>occurrence.summary</code> + <code>occurrence.hint</code></> },
	{ id: "uri", field: <code>results[].locations[].physicalLocation.artifactLocation.uri</code>, source: <>The scanned target — see <a href="#sarif-locations">Locations</a> below.</> },
	{ id: "fqn", field: <code>results[].locations[].logicalLocations[].fullyQualifiedName</code>, source: <><code>occurrence.selector</code>, when present.</> },
	{
		id: "fingerprint",
		field: <code>results[].partialFingerprints["surea11y/violation/v1"]</code>,
		source: (
			<>
				The same <code>ruleId + reasonCode + html</code> identity key used by{" "}
				<a href="/conformance/baseline/">Baseline / allowlist</a> (<code>computeBaselineKey</code>)
				— a stable, content-based fingerprint rather than a position-based one, for consumers that
				read it.
			</>
		),
	},
	{
		id: "lineHash",
		field: <code>results[].partialFingerprints.primaryLocationLineHash</code>,
		source: (
			<>
				A hash of that key, <code>&lt;16 hex digits&gt;:&lt;n&gt;</code>, where <code>n</code> counts a
				finding repeated on the page (the same broken component twice). GitHub Code Scanning matches
				alerts between uploads on this field alone. A DOM finding has no line for GitHub's upload
				action to hash, so without it alerts were matched by position, and fixing one finding could
				close another's alert. Coming from core 1.8 or earlier, the first upload closes the existing
				alerts and opens them again as new ones, once; a dismissal made in GitHub has to be made
				again.
			</>
		),
	},
	{ id: "props", field: <><code>results[].properties.severity</code> / <code>.confidence</code> / <code>.reasonCode</code> / <code>.html</code></>, source: <>The result's own <code>severity</code>/<code>confidence</code>, plus the same <code>reasonCode</code> and <code>html</code> snippet the fingerprint above is keyed on — informational, not part of SARIF's own schema.</> },
	{ id: "tags", field: <code>tool.driver.rules[].properties.tags</code>, source: <><code>accessibility</code>, <code>automatic</code>/<code>manual</code>, and a <code>wcag-&lt;SC&gt;</code> tag per WCAG Success Criterion in <code>meta.normativeMappings</code>. Understanding-document entries get no tag. Each EN 301 549 clause the result carries (only when the scan asked for them, see <a href="/configuration/engine-options/#other-standards-mappings">Other standards</a>) gets an <code>en301549-&lt;clause&gt;</code> tag, e.g. <code>en301549-9.1.1.1</code>: clause numbers are the same in every version that has them, so the tag carries no version.</> },
	{ id: "category", field: <code>runs[0].automationDetails.id</code>, source: <>The <code>category</code> option, with a trailing <code>/</code> added if it has none (GitHub reads everything up to the last slash as the category). Absent when no category is given. See <a href="#scanning-at-several-viewport-widths">Scanning at several viewport widths</a>.</> },
	{ id: "runProps", field: <code>runs[0].properties</code>, source: <><code>wcagVersion</code>, <code>profile</code>, <code>optInRules</code> and <code>environment</code> from the result's <code>engine</code>: the conformance target the run used, so a dashboard can tell a WCAG 2.1 run from a 2.2 one, the opt-in rule tags it added beyond that target when it added any, and the conditions the page was rendered under (<code>layout</code>, <code>viewport</code>, <code>devicePixelRatio</code>, <code>colorScheme</code>, <code>fonts</code>; see <a href="/results-reports/output-schema/">Output schema</a>). Omitted for results from engines that predate those fields.</> },
];

export function SarifReportContent() {
	return (
		<>
			<p>
				<code>--sarif &lt;path&gt;</code> writes a{" "}
				<a href="https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html">SARIF 2.1.0</a>{" "}
				log — the standard format GitHub Code Scanning (and other SARIF-consuming dashboards)
				expect — instead of, or alongside, <code>--json</code>'s raw engine result.
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --sarif results.sarif", command: true }]} />
			<p>
				See <a href="/configuration/ci-integration/">CI integration</a> for a ready-to-paste GitHub Actions
				workflow that runs a scan and uploads <code>results.sarif</code> to the "Security" tab.
			</p>

			<h2>Why a separate format from <code>--json</code></h2>
			<p>
				<code>--json</code>'s raw result (see <a href="/results-reports/output-schema/">Output schema</a>) is
				this engine's own contract, versioned and stable per{" "}
				<a href={`${core}/docs/API_STABILITY.md`}><code>API_STABILITY.md</code></a>. SARIF is a
				different, externally-defined contract purpose-built for code-scanning dashboards — a{" "}
				<code>checksResults[]</code> entry and a SARIF <code>result</code> don't map 1:1, so{" "}
				<strong>this is a real conversion, not a re-serialization</strong>.
			</p>

			<h2>What becomes a SARIF result</h2>
			<p>
				<strong>Only <code>fail</code>/<code>cantTell</code> occurrences produce SARIF results</strong>{" "}
				(same "violations only" framing as the{" "}
				<a href="/results-reports/html-report/">HTML report</a>).
			</p>
			<p>
				A <code>notApplicable</code> check is not always empty: a rule may attach one occurrence
				explaining why it had nothing to judge, which the contrast rules do when no text had a
				computable background. Those never become results — a consumer treats every result as an
				alert, and "this was not evaluated" is not one — but they are not dropped either. They are
				carried as <code>note</code>-level entries in{" "}
				<code>runs[0].invocations[0].toolExecutionNotices</code>, each naming the rule it came
				from via <code>associatedRule.id</code>:
			</p>
			<CodeBlock
				lang="json"
				lines={[
					'"invocations": [',
					"  {",
					'    "executionSuccessful": true,',
					'    "toolExecutionNotices": [',
					"      {",
					'        "level": "note",',
					'        "message": { "text": "No eligible text had computable contrast (eligible text nodes: 13). See the contrast computability rule for details." },',
					'        "associatedRule": { "id": "contrast-minimum" }',
					"      }",
					"    ]",
					"  }",
					"]",
				]}
			/>
			<p>
				<strong>That keeps a SARIF-only pipeline from reading silence as a clean bill of
				health</strong>: no contrast alerts can mean the page is fine, or that contrast was never
				computable, and only the notice separates the two. The block is emitted only when there is something to say, so
				a run with nothing to report has no <code>invocations</code> key at all.
			</p>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "outcome", label: "Engine outcome", width: "22%" },
					{ key: "level", label: "SARIF level", width: "18%" },
					{ key: "meaning", label: "Meaning", wrap: true },
				]}
				rows={sarifLevelRows}
			/>
			<p>
				Every rule that ran (regardless of whether it produced a result) is listed once in{" "}
				<code>runs[0].tool.driver.rules</code>, with <code>defaultConfiguration.level</code> set
				from the rule's <code>type</code>: <code>automatic</code> (fail-capable) →{" "}
				<code>error</code>, <code>manual</code> (capped at <code>cantTell</code>) →{" "}
				<code>warning</code>.
			</p>

			<h2>Field mapping</h2>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "field", label: "SARIF field", width: "36%", wrap: true },
					{ key: "source", label: "Source", wrap: true },
				]}
				rows={sarifFieldRows}
			/>

			<h2 id="sarif-locations">Locations</h2>
			<p>
				DOM-based scanning has no line/column to report, so{" "}
				<code>physicalLocation.artifactLocation.uri</code> is the scanned target itself, not a
				source-file position:
			</p>
			<ul>
				<li>
					<strong>Local file scans</strong>: a path relative to the current working directory
					(forward-slashed). If this matches a real file in your repository, GitHub Code Scanning
					can render the finding as an inline annotation.
				</li>
				<li>
					<strong>URL scans</strong>: the scanned URL itself. GitHub Code Scanning will still list
					the finding, but can't attach an inline annotation to a URL that isn't a file in the
					repository — this is inherent to how SARIF/Code Scanning associate findings with
					source, not a surea11y limitation. If you need inline annotations, scan the rendered
					HTML file (e.g. a build output artifact) rather than a live URL.
				</li>
			</ul>
			<p>
				<code>occurrence.selector</code> is additionally carried as a{" "}
				<code>logicalLocations[].fullyQualifiedName</code>, so a consumer that reads logical
				locations still gets the "which element" signal even without a usable physical location.
			</p>

			<h2 id="scanning-at-several-viewport-widths">Scanning at several viewport widths</h2>
			<p>
				A layout-dependent rule can fail at one viewport width and pass at another (see{" "}
				<a href="/help/known-limitations/">Known limitations</a>), so a page scanned at two widths is
				two analyses, not one. Give each its own category:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { renderSarifReport } = require('@surea11y/core/sarif');",
					"",
					"for (const width of [390, 1280]) {",
					"  // ...scan the page at this width into `result`...",
					"  fs.writeFileSync(`a11y-${width}.sarif`, renderSarifReport(result, { category: `a11y-${width}` }));",
					"}",
				]}
			/>
			<p>
				and upload each file separately. GitHub Code Scanning treats each category as its own
				analysis. Within one category, a later upload replaces the earlier one, and an alert missing
				from it is closed, so two widths uploaded under the same category would open and close a
				width-specific alert on every run. GitHub also rejects a single SARIF file holding two runs
				from the same tool and category. <code>github/codeql-action/upload-sarif</code> has a{" "}
				<code>category</code> input that does the same job when the file carries none.
			</p>
			<p>
				The finding's identity doesn't include the viewport, and doesn't need to: the same element
				with the same defect is the same finding at any width, and the category is what keeps the
				analyses apart. <code>runs[0].properties.environment</code> records the viewport each run
				used.
			</p>

			<h2>Combining with <code>--baseline</code></h2>
			<p>
				A generic SARIF consumer has no "known, don't gate on this" concept of its own — the only
				faithful way to honor a baseline in SARIF output is to{" "}
				<strong>omit already-known <code>fail</code> occurrences entirely, rather than downgrade
				them to <code>warning</code></strong>:
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --baseline baseline.json --sarif results.sarif", command: true }]} />
			<p>
				<code>cantTell</code> occurrences are never filtered by a baseline — the baseline mechanism
				only ever tracks <code>fail</code> occurrences (matching <code>--write-baseline</code>, see{" "}
				<a href="/conformance/baseline/">Baseline / allowlist</a>).
			</p>

			<h2>Combining with <code>--html</code>/<code>--json</code></h2>
			<p>
				<code>--sarif</code>, <code>--html</code>, and <code>--json</code> are independent output
				flags — pass any combination in one run; each writes/prints its own report from the same
				single scan.
			</p>
		</>
	);
}
