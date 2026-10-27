import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const sarifLevelRows = [
	{ id: "fail", outcome: <code>fail</code>, level: <code>error</code>, meaning: "Deterministic violation — the CI-gating case." },
	{ id: "cantTell", outcome: <code>cantTell</code>, level: <code>warning</code>, meaning: "Needs human review — surfaced, but shouldn't block a build on its own." },
	{ id: "leanFail", outcome: <><code>cantTell</code> leaning <code>fail</code>, with <code>leanFailAs: 'error'</code></>, level: <code>error</code>, meaning: <>Undecided, but the page's evidence points to a failure (<a href="/results-reports/output-schema/#leans"><code>lean</code></a>); counted by a gate on errors.</> },
];

const sarifFieldRows = [
	{ id: "ruleId", field: <code>results[].ruleId</code>, source: <code>checksResults[i].ruleId</code> },
	{ id: "message", field: <code>results[].message.text</code>, source: <><code>occurrence.summary</code> + <code>occurrence.hint</code>. An occurrence with no summary (a custom rule's, say) uses the rule's title, or its id, since GitHub rejects a result with empty text. An undecided finding's steps follow, after a blank line: <code>How to check:</code>, the numbered steps, then <code>Passes when:</code> and <code>Fails when:</code>, so an alert says how to answer it.</> },
	{ id: "howToCheck", field: <code>results[].properties.howToCheck</code>, source: <>An undecided finding's steps, <code>{"{ steps, passWhen, failWhen }"}</code>, as <a href="/results-reports/output-schema/#how-to-check"><code>occurrence.howToCheck</code></a> gives them. A result that comes without them, as a binding's does, gains them in Node; <code>packs</code> (the packs the scan ran) adds a pack rule's own. Like the lean, not part of the finding's identity.</> },
	{ id: "uri", field: <code>results[].locations[].physicalLocation.artifactLocation.uri</code>, source: <>The scanned target — see <a href="#sarif-locations">Locations</a> below.</> },
	{ id: "fqn", field: <code>results[].locations[].logicalLocations[].fullyQualifiedName</code>, source: <>The element's location, with <code>kind: "element"</code>, when <code>occurrence.selector</code> is a string that isn't empty. Outside a shadow tree it is the selector. For an element inside a shadow tree it is the shadow hosts' selectors, then the element's own, joined with <code>{" >>> "}</code>: <code>{"html > body > main > x-card >>> button"}</code>. JUnit's <code>selector:</code> line and the HTML report show the same text.</> },
	{
		id: "fingerprint",
		field: <code>results[].partialFingerprints["surea11y/violation/v2"]</code>,
		source: (
			<>
				The SHA-256 digest, 64 hex digits, of the same <code>ruleId + reasonCode + html</code>{" "}
				identity key used by <a href="/conformance/baseline/">Baseline / allowlist</a> (
				<code>computeBaselineKey</code>) — a stable, content-based fingerprint rather than a
				position-based one, for consumers that read it: the same finding gets the same digest in
				every report. Before 1.11, <code>surea11y/violation/v1</code> held the key itself, so a
				tool that read <code>v1</code> sees each finding as new once.{" "}
				<strong>A finding whose reason code changes gets another digest</strong>: in 1.14, the
				findings of the seventeen rules that now give a code, and those of the codes split by
				cause, so their Code Scanning alerts close once and the findings come back as new (see{" "}
				<a href="/conformance/baseline/">Baseline / allowlist</a>).
			</>
		),
	},
	{
		id: "lineHash",
		field: <code>results[].partialFingerprints.primaryLocationLineHash</code>,
		source: (
			<>
				The digest's first 16 hex digits and a count, <code>&lt;16 hex digits&gt;:&lt;n&gt;</code>{" "}
				(unchanged from before <code>v2</code>), where <code>n</code> counts a
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
	{ id: "tags", field: <code>tool.driver.rules[].properties.tags</code>, source: <><code>accessibility</code>, <code>automatic</code>/<code>manual</code>,and a <code>wcag-&lt;SC&gt;</code> tag per WCAG Success Criterion in <code>meta.normativeMappings</code> that the scan's WCAG level and version keep. A criterion the scan left out of <code>rulesResults</code> because of them gets no tag: an AAA criterion under <code>engineOptions.wcagLevel: 'AA'</code>, or 4.1.1 when <code>{"includeRuleIds: ['duplicate-id']"}</code> ran under WCAG 2.2. A criterion the scan reports, such as a rollup named by id above the level, keeps its tag, and so does every criterion of a result that records neither <code>engine.wcagLevel</code> nor <code>engine.wcagVersion</code>. The rule stays, and its results too, as notes when every criterion it maps to is left out (see <a href="#outside-the-target">above</a>). Understanding-document entries get no tag. Each EN 301 549 clause the result carries (only when the scan asked for them, see <a href="/configuration/engine-options/#other-standards-mappings">Other standards</a>) gets an <code>en301549-&lt;clause&gt;</code> tag, e.g. <code>en301549-9.1.1.1</code>: clause numbers are the same in every version that has them, so the tag carries no version, and a pack's standard or checklist is tagged the same way under its own key (a checklist item's id, <code>acme-images</code>, is its own tag). Then the rule's own <code>meta.tags</code> (a custom rule's included), without the engine's bookkeeping tags and the criterion tags the <code>wcag-&lt;SC&gt;</code> tags already give.</> },
	{ id: "helpUri", field: <code>tool.driver.rules[].helpUri</code>, source: <><code>meta.helpUrl</code>, the rule's help link, when it is an absolute <code>http(s)</code> URL; otherwise the Understanding document of the first WCAG criterion it maps to; absent for a rule with neither, which no built-in rule is: one mapped to no criterion links its section of the rule catalog.</> },
	{ id: "toolVersion", field: <code>tool.driver.version</code>, source: <>The <code>toolVersion</code> option, if given (a tool wrapping the engine passes its own); otherwise <code>engine.version</code>, the engine release that produced the result.<code>"0.0.0"</code> only for a result without one, from a release before 1.10.0, or whose <code>engine.version</code> is not a string.</> },
	{ id: "category", field: <code>runs[0].automationDetails.id</code>, source: <>The <code>category</code> option, with a trailing <code>/</code> added if it has none (GitHub reads everything up to the last slash as the category). Absent when no category is given. See <a href="#scanning-at-several-viewport-widths">Scanning at several viewport widths</a>.</> },
	{ id: "runProps", field: <code>runs[0].properties</code>,source: <><code>wcagVersion</code>, <code>wcagLevel</code> (when the scan had a level: <code>engineOptions.wcagLevel</code>, or the one its selection gives), <code>profile</code>, <code>optInRules</code> and <code>environment</code> (a copy of <code>engine.environment</code>) from the result's <code>engine</code>: the conformance target the run used, so a dashboard can tell a WCAG 2.1 run from a 2.2 one, and an AA run from one at every level, the opt-in rule tags it added beyond that target when it added any, and the conditions the page was rendered under (<code>layout</code>, <code>viewport</code>, <code>devicePixelRatio</code>, <code>colorScheme</code>, <code>forcedColors</code>, <code>fonts</code> and every other field it has, the hooks' included; see <a href="/results-reports/output-schema/#top-level-result">Output schema</a>). Omitted for results from releases that predate those fields.</> },
];

const sarifOptionRows = [
	{ id: "toolVersion", option: <code>toolVersion</code>, def: <code>engine.version</code>, effect: <><code>tool.driver.version</code>, for a tool wrapping the engine.</> },
	{ id: "informationUri", option: <code>informationUri</code>, def: <code>'https://github.com/SureA11y/core'</code>, effect: <><code>tool.driver.informationUri</code>, the tool's home page.</> },
	{ id: "baselineEntries", option: <code>baselineEntries</code>, def: "none", effect: <>The baseline file as saved (<code>JSON.parse</code> of it) or its <code>entries</code> list, see <a href="/conformance/baseline/#file-format">File format</a>. Fail occurrences recorded there are left out, as <code>--baseline</code> does (see below). An entry written by 1.13 under a reason code that changed in 1.14 still matches the finding under its new one.</> },
	{ id: "category", option: <code>category</code>, def: "none", effect: <><code>runs[0].automationDetails.id</code>, see <a href="#scanning-at-several-viewport-widths">Scanning at several viewport widths</a>.</> },
	{ id: "leanFailAs", option: <code>leanFailAs</code>, def: <code>'warning'</code>, effect: <><code>'error'</code> reports a <code>cantTell</code> finding whose lean points to fail at <code>error</code>, so a build gated on errors fails on likely failures too. Read in any case; another value throws a <code>TypeError</code>. A best-practice rule's too: such a rule, mapped to no WCAG criterion, never fails, and the facts it states lean fail without condition, so a skipped heading level (<code>heading-order</code>) is an <code>error</code>. A finding of a rule whose every criterion is outside the scan's target stays a <code>note</code>. A finding that leans fail and has an entry marked <code>lean: 'fail'</code> in <code>baselineEntries</code> stays a <code>warning</code>.</> },
	{ id: "leanFailWcagOnly", option: <code>leanFailWcagOnly</code>, def: <code>false</code>, effect: <>With <code>leanFailAs: 'error'</code>, <code>true</code> raises only the findings of rules mapped to a WCAG criterion in the scan's target, leaving the best-practice rules' leans at <code>warning</code>. A value other than <code>true</code> or <code>false</code> throws a <code>TypeError</code>. <code>leaningFailures(result, {"{ wcagOnly }"})</code>, from <code>@surea11y/core</code>, lists the findings these two options raise, before the baseline.</> },
	{ id: "packs", option: <code>packs</code>, def: "none", effect: <>The packs the scan ran (<code>engineOptions.packs</code>): in Node, a pack rule's undecided findings carry the steps of its own <code>meta.review</code> (<code>properties.howToCheck</code>).</> },
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
				<a href="/results-reports/html-report/">HTML report</a>).{" "}
				<strong>So a log with no results says nothing failed or needs review among the checks
				that ran</strong>; it doesn't say what was checked, and it is not a conformance claim. Keep
				the JSON result for that.
			</p>
			<p>
				A <code>notApplicable</code> check is not always empty: a rule may attach one occurrence
				explaining why it had nothing to judge, which the contrast rules do when no text had a
				computable background. Those never become results — a consumer treats every result as an
				alert, and "this was not evaluated" is not one — but they are not dropped either. They are
				carried as <code>note</code>-level entries in{" "}
				<code>runs[0].invocations[0].toolExecutionNotifications</code>, each naming the rule it came
				from via <code>associatedRule.id</code>:
			</p>
			<CodeBlock
				lang="json"
				lines={[
					'"invocations": [',
					"  {",
					'    "executionSuccessful": true,',
					'    "toolExecutionNotifications": [',
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
				a run with nothing to report has no <code>invocations</code> key at all. A rule that
				passed writes no notification.
			</p>
			<p>
				A rule that did not complete (it threw: <code>cantTell</code> with no occurrences and an{" "}
				<code>error</code>) judged nothing, so it is no result either. It is an{" "}
				<code>error</code>-level notification in the same list,{" "}
				<code>"The rule &lt;id&gt; did not complete: &lt;error&gt;"</code>, naming the rule in{" "}
				<code>associatedRule.id</code>, so the gap in coverage doesn't read as a pass.
			</p>
			<DataTable
				label="Engine outcomes as SARIF levels"
				rowKey="id"
				columns={[
					{ key: "outcome", label: "Engine outcome", width: "22%" },
					{ key: "level", label: "SARIF level", width: "18%" },
					{ key: "meaning", label: "Meaning", wrap: true },
				]}
				rows={sarifLevelRows}
			/>
			<p>
				An undecided finding with a lean carries it in <code>properties.lean</code>:{" "}
				<code>{'{ "toward": "fail", "why": "The heading skips a level after the one before it." }'}</code>,
				whichever level it is reported at. Where the lean has them, it also carries{" "}
				<code>caution</code>, what could make it wrong (
				<code>"A layout table can also hold numbers."</code>), and <code>measured</code>, how
				often it has been right (<code>{'{ "agreed": 47, "cases": 50, "corpus": "…", "coreVersion": "…" }'}</code>,
				once a lean has been counted on five cases, which none has yet), so an alert shows what
				the <a href="/results-reports/html-report/">HTML report</a> shows beside the lean. Its{" "}
				<code>signals</code> and <code>i18n</code> keys stay in the scan result.
			</p>
			<p id="outside-the-target">
				A rule whose every WCAG criterion is outside the scan's target (an AAA rule under{" "}
				<code>engineOptions.wcagLevel: 'AA'</code>, or <code>duplicate-id</code> under WCAG 2.2:
				the criteria the scan left out of <code>rulesResults</code>, as for the{" "}
				<code>wcag-&lt;SC&gt;</code> tags below) still ran, and its <code>fail</code> and{" "}
				<code>cantTell</code> findings are still results, at level <code>note</code>, so they are
				seen without failing a build scoped to the target. Each says why in{" "}
				<code>properties.outsideTarget</code>:{" "}
				<code>{'{ "criteria": ["1.4.6"], "target": "WCAG 2.2 AA" }'}</code>.
			</p>
			<p>
				Every rule that ran (regardless of whether it produced a result) is listed once in{" "}
				<code>runs[0].tool.driver.rules</code>, with <code>defaultConfiguration.level</code> set
				from the rule's <code>type</code>: <code>automatic</code> (fail-capable) →{" "}
				<code>error</code>, <code>manual</code> (never <code>fail</code>) →{" "}
				<code>warning</code>. A rule id that is not a string, in a stored result, is written as
				its text; a check with no rule id names no rule, and is left out, as JUnit and EARL leave
				it.
			</p>

			<h2 id="field-mapping">Field mapping</h2>
			<DataTable
				label="SARIF field mapping"
				rowKey="id"
				columns={[
					{ key: "field", label: "SARIF field", width: "36%", wrap: true },
					{ key: "source", label: "Source", wrap: true },
				]}
				rows={sarifFieldRows}
			/>
			<p>
				A compact result (<code>engineOptions.output.detail: 'findings'</code>, see{" "}
				<a href="/results-reports/output-schema/#top-level-result">Output schema</a>) is read as
				the full result it stands for, so it is reported the same. A result whose{" "}
				<code>standards</code> list is missing or damaged still tags every standard its rules name.
			</p>

			<h2 id="sarif-locations">Locations</h2>
			<p>
				DOM-based scanning has no line/column to report, so{" "}
				<code>physicalLocation.artifactLocation.uri</code> is the scanned target itself, not a
				source-file position:
			</p>
			<ul>
				<li>
					<strong>Local file scans</strong>: a file inside the current working directory is a path
					relative to it, forward-slashed, with each segment percent-encoded (
					<code>build%20out/index.html</code>). If this matches a real file in your repository,
					GitHub Code Scanning can render the finding as an inline annotation. A file outside the
					working directory is an absolute <code>file:</code> URL, not a relative path climbing out of
					the repository with <code>../</code>, which a consumer could not resolve.
				</li>
				<li>
					<strong>URL scans</strong>: the scanned URL itself. GitHub Code Scanning will still list
					the finding, but can't attach an inline annotation to a URL that isn't a file in the
					repository — this is inherent to how SARIF/Code Scanning associate findings with
					source, not a surea11y limitation. If you need inline annotations, scan the rendered
					HTML file (e.g. a build output artifact) rather than a live URL. The URL is written as a
					URL parser serializes it, so what a URI can't hold is percent-encoded (
					<code>https://example.test/a%20b</code>).
				</li>
				<li>
					<strong>Other targets</strong>: a result whose <code>url</code> is not a URL, such as the
					path a page was scanned under (<code>runDomRulesInPage('dist/my page.html', …)</code>), is
					a relative path, forward-slashed, with each segment percent-encoded (
					<code>dist/my%20page.html</code>); a Windows path is an absolute <code>file:</code> URL. A
					result with no <code>url</code>, or one that is not a string, is located at{" "}
					<code>about:blank</code>.
				</li>
			</ul>
			<p>
				The element's location (its selector, prefixed with its shadow hosts' selectors and{" "}
				<code>{" >>> "}</code> when it is inside a shadow tree) is additionally carried as a{" "}
				<code>logicalLocations[].fullyQualifiedName</code>, so a consumer that reads logical
				locations still gets the "which element" signal even without a usable physical location.
			</p>

			<h2 id="cross-frame-results">Cross-frame results</h2>
			<p>
				A result from <code>runa11yCoreAcrossFrames</code>, or a binding's{" "}
				<code>.frames(true)</code> scan (see{" "}
				<a href="/results-reports/output-schema/#cross-frame-result">Output schema</a>), is one run:
				every frame's findings are results in it. A finding in a frame is located in that frame's
				document (<code>artifactLocation.uri</code> is the frame's URL), and carries the frame's
				path in <code>properties.frame</code>:
			</p>
			<CodeBlock
				lang="json"
				lines={[
					'"properties": {',
					'  "severity": "serious",',
					'  "confidence": "high",',
					'  "reasonCode": "DEFAULT",',
					'  "html": "<img src=\\"card.png\\">",',
					'  "frame": ["#checkout"]',
					"}",
				]}
			/>
			<p>
				The path is part of the finding's identity too (<code>partialFingerprints</code>), so the
				same defect in the page and in a frame, or in two frames, are two alerts. A frame that did
				not answer (no responder, or it timed out) is a <code>warning</code>-level notification,{" "}
				<code>"The frame #ads (https://ads.example/) was not scanned: &lt;error&gt;"</code>, since
				nothing in it was checked.
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

			<h2 id="options">Options</h2>
			<p>
				<code>renderSarifReport(result, options)</code> from <code>@surea11y/core/sarif</code>{" "}
				returns the log as JSON text. It takes:
			</p>
			<DataTable
				label="renderSarifReport options"
				rowKey="id"
				columns={[
					{ key: "option", label: "Option", width: "22%" },
					{ key: "def", label: "Default", width: "30%", wrap: true },
					{ key: "effect", label: "Effect", wrap: true },
				]}
				rows={sarifOptionRows}
			/>

			<h2>Combining with <code>--baseline</code></h2>
			<p>
				A generic SARIF consumer has no "known, don't gate on this" concept of its own — the only
				faithful way to honor a baseline in SARIF output is to{" "}
				<strong>omit already-known <code>fail</code> occurrences entirely, rather than downgrade
				them to <code>warning</code></strong>:
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --baseline baseline.json --sarif results.sarif", command: true }]} />
			<p>
				<code>cantTell</code> occurrences are never left out by a baseline. A baseline written with{" "}
				<code>{"buildBaselineEntries(result, { leanFail: true })"}</code> also records the findings
				that lean fail, as entries marked <code>lean: 'fail'</code> (see{" "}
				<a href="/conformance/baseline/#findings-that-lean-fail">Baseline / allowlist</a>); under{" "}
				<code>leanFailAs: 'error'</code> such a finding stays a <code>warning</code> instead of
				being raised to <code>error</code>, so a team can accept the likely failures it already has
				and still gate on new ones. <code>--write-baseline</code> records <code>fail</code>{" "}
				occurrences only.
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
