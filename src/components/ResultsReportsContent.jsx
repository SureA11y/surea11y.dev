import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const topLevelRows = [
	{ id: "engine.tag", field: <code>engine.tag</code>, meaning: <>The engine's own identity tag, currently <code>"a11ycore"</code>. Every rule (built-in or custom) carries it in <code>meta.tags</code> — rule <code>ruleId</code>s themselves are bare (no prefix).</> },
	{
		id: "engine.schemaVersion",
		field: <code>engine.schemaVersion</code>,
		meaning: (
			<>
				The result-schema version (<code>"1.0.0"</code>). Bump-worthy if this document's shape
				ever changes incompatibly — pin to it if you're parsing output programmatically. See{" "}
				<a href={`${core}/docs/API_STABILITY.md`}><code>API_STABILITY.md</code></a> for the full
				stable/unstable field list and version-bump policy.
			</>
		),
	},
	{
		id: "engine.locale",
		field: <code>engine.locale</code>,
		meaning: (
			<>
				Which dictionary the run actually used. <code>requested</code> is your{" "}
				<code>engineOptions.locale</code> after trimming (<code>"en"</code> if you passed nothing
				or a non-string); <code>resolved</code> is the locale whose dictionary was used;{" "}
				<code>reason</code> explains the pairing. Because locale fallback is graceful and
				per-string, asking for a language the build does not carry produces English text rather
				than an error — this field is how you find that out without reading the strings. Reported
				once per result: a run uses one dictionary throughout.
			</>
		),
	},
	{
		id: "engine.locale.reason",
		field: <code>engine.locale.reason</code>,
		meaning: (
			<>
				<code>"ok"</code> — you got the dictionary you asked for, and it carries every key.{" "}
				<code>"primary-subtag"</code> — your code had a subtag with no dictionary of its own, so
				its base language was used: <code>"de-DE"</code> resolves to <code>"de"</code>.{" "}
				<code>"dictionary-not-loaded"</code> — the project ships that language, but this build
				does not carry it and none was supplied (the standalone browser bundle, without its
				locale side file). <code>"unknown-locale"</code> — the project has no such translation at
				all. <code>"partial-dictionary"</code> — the dictionary was used but is missing keys
				English has, so those strings fell back to English. Treat the set as open; later releases
				can add to it.
			</>
		),
	},
	{
		id: "engine.wcagVersion",
		field: <code>engine.wcagVersion</code>,
		meaning: (
			<>
				Which version of WCAG this run was conformance-tested against: your{" "}
				<code>engineOptions.wcagVersion</code>, or what your version-origin tags implied, or the
				default <code>"2.2"</code>. It affects one thing today — a rule mapped only to SC 4.1.1
				Parsing cannot <code>fail</code> under a 2.2 target (see{" "}
				<code>checksResults[i].wcagVersionScope</code> below). Reported once per result: a run has
				one target throughout.
			</>
		),
	},
	{ id: "url", field: <code>url</code>, meaning: <>The <code>pageUrl</code> argument you passed in, or <code>document.location.href</code> if you passed <code>null</code>/omitted it, or <code>null</code> if neither is available.</> },
	{ id: "title", field: <code>title</code>, meaning: <><code>document.title</code> at scan time, or <code>null</code>.</> },
	{
		id: "timestamp",
		field: <code>timestamp</code>,
		meaning: (
			<>
				<strong>Not auto-generated.</strong> Only set if you pass{" "}
				<code>engineOptions.timestamp</code> as a non-empty string — the engine has no built-in
				clock (deterministic-by-design). If you want a scan timestamp in the result, supply it
				yourself.
			</>
		),
	},
	{
		id: "perfStats",
		field: <code>perfStats</code>,
		meaning: <><code>null</code> unless <code>engineOptions.perfStats: true</code>. Internal timing/counters — shape not covered by this document, treat as debug-only.</>,
	},
	{
		id: "contextSelector",
		field: <code>contextSelector</code>,
		meaning: (
			<>
				The (trimmed) <code>contextSelector</code> argument you passed — a string, an array of
				strings (multi-region scanning, see <a href="/configuration/">Engine options</a>), or{" "}
				<code>null</code> if none/empty.
			</>
		),
	},
	{
		id: "checksResults",
		field: <code>checksResults</code>,
		meaning: (
			<>
				One entry per <strong>atomic rule</strong> that ran (every rule not filtered out by{" "}
				<code>runOnly</code> — see <a href="/configuration/">Engine options</a>).{" "}
				<strong>Every loaded rule produces an entry, even ones that outcome{" "}
				<code>notApplicable</code></strong> — this is not a "violations only" list.
			</>
		),
	},
	{
		id: "rulesResults",
		field: <code>rulesResults</code>,
		meaning: (
			<>
				One entry per <strong>composite (WCAG-SC rollup) rule</strong> that ran — see{" "}
				<a href="#composite-result">A composite result</a> and{" "}
				<a href="/conformance/">Conformance</a>. Empty array if no composite matched the current{" "}
				<code>runOnly</code>/tag filter.
			</>
		),
	},
	{
		id: "overriddenBuiltinIds",
		field: <code>overriddenBuiltinIds</code>,
		meaning: (
			<>
				Rule ids where an <code>engineOptions.customRules</code> entry shared its <code>id</code>{" "}
				with a built-in rule, so the custom implementation replaced the built-in one for this scan
				(see <a href="/configuration/">Engine options</a>). Always an array; empty when no
				collision occurred. Also logged via <code>console.warn</code> at scan time, since a
				same-named custom rule is as likely to be an accidental collision as a deliberate
				override.
			</>
		),
	},
];

const occurrenceRows = [
	{
		id: "selector",
		field: <code>selector</code>,
		meaning: (
			<>
				A best-effort CSS selector built to resolve back to the flagged element (see{" "}
				<code>helpers.buildSelector</code> in <code>RULE_AUTHORING.md</code>). Not guaranteed
				unique in adversarial DOM shapes, but the engine actively verifies it resolves to the
				reported element before using it. The exception is a rule whose finding <em>is</em> an
				absent element: <code>page-title-present</code> reports <code>head &gt; title</code> with
				an <code>html</code> of <code>&lt;title&gt;(missing)&lt;/title&gt;</code>, neither of which
				is on the page. Both are constants, so the fingerprint they feed stays stable, but do not
				treat <code>selector</code> as resolvable or <code>html</code> as real markup without
				checking the rule reported something that exists.
			</>
		),
	},
	{
		id: "html",
		field: <code>html</code>,
		meaning: (
			<>
				An outer-HTML snippet of the flagged element — use this as your primary "which element"
				signal when <code>includeShadowDom: true</code> (selectors don't pierce shadow
				boundaries).
			</>
		),
	},
	{
		id: "structuralPath",
		field: <code>structuralPath</code>,
		meaning: (
			<>
				The flagged element's sibling-index path from <code>documentElement</code> down to it
				(e.g. <code>[1, 0, 2]</code>) — <code>[]</code> if the element <em>is</em>{" "}
				<code>documentElement</code>, <code>null</code> if it couldn't be determined. A more
				robust element-identity mechanism than <code>selector</code> alone: it survives DOM
				changes a selector string wouldn't (an id/class rename, for instance), at the cost of not
				being usable as an actual CSS selector.
			</>
		),
	},
	{ id: "summary", field: <code>summary</code>, meaning: 'Human-readable, already localized ("This button has no accessible name.").' },
	{ id: "hint", field: <code>hint</code>, meaning: "Human-readable remediation guidance, already localized." },
	{
		id: "i18n",
		field: <code>i18n</code>,
		meaning: (
			<>
				The raw translation keys behind <code>summary</code>/<code>hint</code>, if you want to
				re-render them in a different locale yourself without re-running the scan. <code>null</code>{" "}
				if the occurrence didn't use key-based i18n.
			</>
		),
	},
	{
		id: "data.visibilityFilter",
		field: <code>data.visibilityFilter</code>,
		meaning: (
			<>
				Present on most occurrences: why the engine considered this element eligible (or not)
				under whichever eligibility model the rule used. <code>eligible</code> is that result;{" "}
				<code>targetSet</code> says which model produced it (<code>'dom'</code>: raw DOM/CSS
				visibility — most rules; <code>'acc'</code>: accessibility-tree eligibility).{" "}
				<code>accEligible</code> mirrors <code>eligible</code> only when <code>targetSet</code> is{" "}
				<code>'acc'</code>, otherwise <code>null</code>. <code>reasons</code> is a list of
				machine-readable exclusion codes when <code>eligible: false</code>.
			</>
		),
	},
	{
		id: "data.details",
		field: <code>data.details</code>,
		meaning: (
			<>
				Rule-specific structured data (computed metrics, resolved references) —{" "}
				<strong>non-normative</strong>: useful for building richer UI or debugging, but never
				changes what <code>outcome</code>/<code>severity</code> mean. Shape varies per rule; treat
				as best-effort extra context, not a stable contract. The one exception is{" "}
				<code>data.details.reasonCode</code>, which <strong>is</strong> stable: it identifies{" "}
				<em>which</em> of a rule's findings this is, and together with <code>ruleId</code> and{" "}
				<code>html</code> forms the fingerprint baselines and SARIF are keyed on. See{" "}
				<a href={`${core}/docs/API_STABILITY.md#finding-identity`}>
					<code>API_STABILITY.md</code>
				</a>
				.
			</>
		),
	},
	{
		id: "occurrenceOutcome",
		field: <code>occurrenceOutcome</code>,
		meaning: (
			<>
				Which tier this occurrence belongs to, on a rule that graded its findings into a
				confident <code>fail</code> tier and a needs-review <code>cantTell</code> tier. A rule
				reporting one tier only omits it, in which case the result's own <code>outcome</code> is
				the occurrence's tier.
			</>
		),
	},
	{ id: "uncertainty", field: <code>uncertainty</code>, meaning: <>Why this finding could not be decided — see <a href="#uncertainty-codes">Uncertainty codes</a> below.</> },
];

const uncertaintyRows = [
	{ id: "not-computable", code: <code>not-computable</code>, meaning: "The evidence the rule needed could not be read in this environment.", shape: "A cross-origin stylesheet, a background colour that resolves to no value, an src that will not resolve." },
	{ id: "runtime-dependent", code: <code>runtime-dependent</code>, meaning: "The markup cannot settle it because script decides at runtime.", shape: "An aria-controls naming an element the widget builds when it opens." },
	{ id: "spec-only", code: <code>spec-only</code>, meaning: "A real specification violation, but the exposed name, role and value survive it, so no Success Criterion is established as failed.", shape: "An ARIA attribute whose absence the specification supplies a default for." },
	{ id: "equivalence-unknown", code: <code>equivalence-unknown</code>, meaning: "Two things may or may not serve the same purpose, and neither the markup nor the content settles it.", shape: "Two frames sharing an accessible name but embedding different resources." },
	{ id: "judgement-required", code: <code>judgement-required</code>, meaning: "The question is inherently a human call.", shape: "Whether an undersized target is essential; every type: \"manual\" rule." },
	{ id: "out-of-scope", code: <code>out-of-scope</code>, meaning: "The finding is real but falls outside the standard this run targets.", shape: "A rule mapped only to a criterion the target WCAG version removed." },
];

const outcomeRows = [
	{ id: "fail", outcome: <code>fail</code>, meaning: "Deterministic, normative violation — the decision procedure guesses at nothing.", manual: "No (coerced to cantTell)" },
	{ id: "pass", outcome: <code>pass</code>, meaning: "The rule's applicable target(s) exist and none were flagged.", manual: "Yes" },
	{ id: "cantTell", outcome: <code>cantTell</code>, meaning: "Requires human judgment — either genuinely ambiguous, or a manual rule's advisory finding.", manual: "Yes" },
	{ id: "notApplicable", outcome: <code>notApplicable</code>, meaning: "The rule found no elements it applies to on this page/scope.", manual: "Yes" },
];

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
				<a href="/conformance/#baseline">Baseline / allowlist</a> (<code>computeBaselineKey</code>)
				— a stable, content-based fingerprint rather than a position-based one.
			</>
		),
	},
	{ id: "props", field: <><code>results[].properties.severity</code> / <code>.confidence</code></>, source: <><code>checksResults[i].severity</code> / <code>.confidence</code> — informational, not part of SARIF's own schema.</> },
	{ id: "tags", field: <code>tool.driver.rules[].properties.tags</code>, source: <><code>accessibility</code>, <code>automatic</code>/<code>manual</code>, and a <code>wcag-&lt;SC&gt;</code> tag per <code>meta.normativeMappings[].requirement</code>.</> },
];

const earlOutcomeRows = [
	{ id: "pass", engine: <code>pass</code>, earl: <code>earl:passed</code> },
	{ id: "fail", engine: <code>fail</code>, earl: <code>earl:failed</code> },
	{ id: "cantTell", engine: <code>cantTell</code>, earl: <code>earl:cantTell</code> },
	{ id: "notApplicable", engine: <code>notApplicable</code>, earl: <code>earl:inapplicable</code> },
];

export function ResultsReportsContent() {
	return (
		<>
			<h2 id="output-schema">Output schema</h2>
			<p>
				This is the exact shape of the object returned by <code>runDomRulesInPage(...)</code> /{" "}
				<code>runa11yCoreInPage(...)</code> (see{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a> for which one to
				call). Every example on this page is real output from the current engine (
				<code>schemaVersion: "1.0.0"</code>), not hand-written. <code>runa11yCoreAcrossFrames</code>{" "}
				returns a different, recursive shape wrapping this one — see{" "}
				<a href="#cross-frame-result">Cross-frame result</a> below.
			</p>

			<h3 id="top-level-result">Top-level result</h3>
			<CodeBlock
				lines={[
					"{",
					"  engine: {",
					"    tag: string,",
					"    schemaVersion: string,",
					"    locale: { requested: string, resolved: string, reason: string },",
					'    wcagVersion: "2.0" | "2.1" | "2.2"',
					"  },",
					"  url: string | null,",
					"  title: string | null,",
					"  timestamp: string | null,",
					"  perfStats: object | null,",
					"  contextSelector: string | string[] | null,",
					"  checksResults: CheckResult[],",
					"  rulesResults: CompositeResult[],",
					"  overriddenBuiltinIds: string[]",
					"}",
				]}
			/>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "field", label: "Field", width: "22%" },
					{ key: "meaning", label: "Meaning", wrap: true },
				]}
				rows={topLevelRows}
			/>

			<h3 id="cross-frame-result">Cross-frame result (<code>runa11yCoreAcrossFrames</code>)</h3>
			<p>
				<code>runa11yCoreAcrossFrames</code> (see{" "}
				<a href={`${core}/docs/INTEGRATION.md#cross-frame-scanning-including-cross-origin`}>
					<code>INTEGRATION.md</code>
				</a>
				) returns a different, recursive shape instead of a plain top-level result:
			</p>
			<CodeBlock
				lines={[
					"{",
					"  topFrame: <the normal top-level result shape above>,",
					"  frames: Array<",
					"    | { url: string | null, topFrame: <top-level result>, frames: [...same shape, recursively] }",
					"    | { url: string | null, error: string }",
					"  >",
					"}",
				]}
			/>
			<ul>
				<li>
					<code>topFrame</code> is exactly the <a href="#top-level-result">top-level result</a>{" "}
					shape, for the frame the function was called in.
				</li>
				<li>
					<code>frames</code> has one entry per direct child <code>&lt;iframe&gt;</code>/
					<code>&lt;frame&gt;</code> in the scanned scope. A reachable child (one that called{" "}
					<code>a11yCoreEnableFrameResponder()</code>) contributes its own complete{" "}
					<code>{"{ url, topFrame, frames }"}</code> — including <em>its own</em> nested{" "}
					<code>frames</code>, recursively, since a further-nested grandchild is only reachable
					through its immediate parent. An unreachable child (the common case for most
					third-party embeds — no cooperating responder, or it timed out) contributes{" "}
					<code>{"{ url, error }"}</code> instead, and does not abort the rest of the scan.
				</li>
				<li>
					This is a <strong>tree, not a flat list</strong> — a deliberate difference from the{" "}
					<code>@surea11y/playwright</code> binding's <code>.frames(true)</code>, which{" "}
					<em>can</em> flatten because Playwright's <code>page.frames()</code> already gives
					every frame regardless of nesting depth; a <code>postMessage</code> relay has no such
					global view, so nesting is expressed structurally instead.
				</li>
			</ul>

			<h3>A check result (<code>checksResults[i]</code>)</h3>
			<CodeBlock
				lines={[
					"{",
					"  ruleId: string,",
					'  outcome: "pass" | "fail" | "cantTell" | "notApplicable",',
					'  outcomeNormalized: "pass" | "fail" | "cantTell" | "inapplicable",',
					'  severity: "minor" | "moderate" | "serious" | "critical",',
					'  confidence: "high" | "medium" | "low",',
					'  type: "automatic" | "manual",',
					"  occurrences: Occurrence[],",
					"  title: string,",
					"  description: string,",
					"  i18n: { titleKey: string, descriptionKey: string } | null,",
					"  meta: {",
					"    ruleId: string,",
					"    ruleInterfaceVersion: string,",
					"    ruleVersion: string,",
					"    normative: boolean,",
					"    atomic: boolean,",
					'    category: "perceivable" | "operable" | "understandable" | "robust" | null,',
					"    normativeMappings: Array<{ standard: string, version: string, requirement: string, title: string, conformanceLevel: string }>,",
					"    standard: string | null,",
					"    applicability: string,",
					"    expectation: string,",
					"    references: string[],",
					"    requirements: object | null,",
					"    mappings: object | null",
					"  },",
					"  engineOptions: object,   // the resolved engineOptions this rule actually ran under",
					"  schemaVersion: string,",
					"  wcagVersionScope?: {     // present only when the target WCAG version changed this outcome",
					'    target: "2.0" | "2.1" | "2.2",',
					"    removedSc: string[],",
					'    coercedFrom: "fail"',
					"  },",
					"  error?: string           // present only if the rule threw — see below",
					"}",
				]}
			/>
			<p>Notes:</p>
			<ul>
				<li>
					<strong><code>outcome</code> vs <code>outcomeNormalized</code></strong>: identical except{" "}
					<code>notApplicable</code> becomes <code>"inapplicable"</code> in{" "}
					<code>outcomeNormalized</code>. Both are provided so you can match either your own
					vocabulary or the engine's internal one.
				</li>
				<li>
					<strong><code>type: "manual"</code> rules can never report <code>outcome: "fail"</code>.</strong>{" "}
					If a manual rule's own logic would have said <code>fail</code>, the engine coerces it
					to <code>cantTell</code> and appends an explanatory note to <code>error</code> — this is
					enforced centrally (<code>policy.coerceManualFailToCantTell</code>, on by default under
					the <code>a11y</code> policy contract; see{" "}
					<a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a>), not something each rule
					has to remember. <code>fail</code> is reserved for deterministic,{" "}
					<code>type: "automatic"</code> findings only.
				</li>
				<li>
					<strong><code>meta.normativeMappings</code></strong> is how a check result ties back to
					a WCAG Success Criterion — <code>[]</code> for rules with no formal WCAG mapping (this
					engine calls them advisory <code>type: "manual"</code> rules). See{" "}
					<a href="/conformance/">Conformance</a> for how these roll up.
				</li>
				<li>
					<strong><code>wcagVersionScope</code></strong>: only present when the run's target WCAG
					version turned this rule's <code>fail</code> into a <code>cantTell</code> — today that
					means a rule mapped to SC 4.1.1 Parsing (<code>duplicate-id</code>) under the default
					2.2 target, since 2.2 removed that criterion. <code>removedSc</code> lists the criteria
					that stopped existing, <code>target</code> is the version that removed them, and{" "}
					<code>coercedFrom</code> is the outcome the rule itself reported. The occurrences are
					the rule's own, unchanged — nothing was dropped, only the conformance verdict was.
					Absent on every other result, and <strong>never</strong> reported through{" "}
					<code>error</code>: nothing went wrong. See{" "}
					<a href="/configuration/#filtering-by-wcag-version">Filtering by WCAG version</a>.
				</li>
				<li>
					<strong><code>error</code></strong>: only present if the rule implementation threw an
					uncaught exception, or if the manual-fail coercion above fired. A thrown rule always
					surfaces as <code>outcome: "cantTell"</code> with <code>occurrences: []</code> and{" "}
					<code>error</code> set to the exception message — the engine never lets one broken rule
					crash the whole scan.
				</li>
				<li>
					<strong><code>engineOptions</code></strong> on each result is the <em>resolved</em>{" "}
					options object (after locale/contrast defaults were applied), not literally what you
					passed in — useful for confirming what a given rule actually saw, especially the
					resolved <code>locale</code> and <code>contrast.mode</code>/
					<code>contrast.rootCanvasFallback</code>.
				</li>
			</ul>

			<h3>An occurrence (<code>occurrences[i]</code>)</h3>
			<p>
				Normally present only when <code>outcome</code> is <code>fail</code> or{" "}
				<code>cantTell</code>: a <code>pass</code> result has <code>occurrences: []</code>, since
				this engine does not enumerate the elements it passed, only the ones it flagged.
			</p>
			<p>
				<code>notApplicable</code> is the one exception. A rule that had nothing to judge may
				attach a single occurrence saying why, and the contrast rules do exactly that when no text
				had a computable background — the difference between "checked, nothing to flag" and
				"could not check" is one this engine reports rather than hides. Such an occurrence
				describes the scan, not an element, so its <code>selector</code> is empty. Do not read{" "}
				<code>occurrences.length</code> as a violation count without checking <code>outcome</code>{" "}
				first.
			</p>
			<CodeBlock
				lines={[
					"{",
					"  selector: string,",
					"  html: string,",
					"  structuralPath: number[] | null,",
					"  summary: string,",
					"  hint: string,",
					"  i18n: { summaryKey: string, hintKey: string, params: object } | null,",
					'  occurrenceOutcome?: "fail" | "cantTell",   // present when the rule graded its findings into tiers',
					"  uncertainty?: {          // present only on a cantTell-tier occurrence",
					'    code: "not-computable" | "runtime-dependent" | "spec-only"',
					'        | "equivalence-unknown" | "judgement-required" | "out-of-scope",',
					"    needed?: string,       // what would settle the question",
					"    evidence?: object      // what the rule did establish, rule-specific",
					"  },",
					"  data: {",
					"    visibilityFilter?: { eligible: boolean, targetSet: string, accEligible: boolean | null, reasons: string[] },",
					"    details?: object   // rule-specific, non-normative — see below",
					"  }",
					"}",
				]}
			/>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "field", label: "Field", width: "22%" },
					{ key: "meaning", label: "Meaning", wrap: true },
				]}
				rows={occurrenceRows}
			/>

			<h4 id="uncertainty-codes">Uncertainty codes</h4>
			<p>
				A <code>cantTell</code> says the engine did not decide. <code>uncertainty</code> says{" "}
				<strong>why</strong>, from a closed vocabulary, so a consumer can branch on the reason
				rather than parse a summary string. It is present only on a <code>cantTell</code>-tier
				occurrence: a <code>fail</code>-tier one would be claiming the rule both decided and did
				not, so the engine drops it.
			</p>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "code", label: "code", width: "20%" },
					{ key: "meaning", label: "Meaning", wrap: true, width: "40%" },
					{ key: "shape", label: "Typical shape", wrap: true },
				]}
				rows={uncertaintyRows}
			/>
			<p>
				<code>needed</code> states, in one sentence, what would settle the question — the thing a
				reviewer has to go and check. <code>evidence</code> carries what the rule <em>did</em>{" "}
				establish, so the reviewer starts from the engine's work rather than repeating it; its
				shape is rule-specific and, like <code>data.details</code>, not a stable contract. The{" "}
				<code>code</code> is: new codes may be added in a minor release, but an existing one does
				not change meaning, so branch on the codes you know and treat an unrecognised one as
				"needs review" rather than an error.
			</p>
			<p>
				Every automatic rule that can report <code>cantTell</code> carries this, and a test holds
				that line so a new one cannot arrive without it. The <code>out-of-scope</code> code is
				attached by the engine rather than by a rule, on the same occurrences that produce a
				result-level <code>wcagVersionScope</code>. Manual rules do not carry it:{" "}
				<code>judgement-required</code> is what <code>type: "manual"</code> already means, so
				repeating it per occurrence would say nothing the result does not.
			</p>

			<h3 id="composite-result">A composite result (<code>rulesResults[i]</code>)</h3>
			<p>
				Composites roll multiple atomic rules up to one WCAG Success Criterion (e.g.{" "}
				<code>wcag-1.1.1-non-text-content</code> rolls up 22 atomic rules). Shape is the same
				envelope as a check result, with composite-specific <code>data.details</code>:
			</p>
			<CodeBlock
				lines={[
					"{",
					'  ruleId: string,              // e.g. "wcag-1.1.1-non-text-content"',
					'  outcome: "pass" | "fail" | "cantTell" | "notApplicable",',
					"  severity, confidence, type, title, description, meta, engineOptions, schemaVersion,  // same as a check result",
					"  occurrences: [],              // always empty — composites are rollups, not element-level findings",
					"  data: {",
					"    details: {",
					'      reasonCode: string,       // e.g. "composite.rollup.fail.anyFail"',
					"      checksIds: string[],      // every atomic ruleId this composite rolls up",
					"      contributors: Array<{ testId: string, outcome: string, severity: string | null }>,",
					"      metrics: { failCount, cantTellCount, notApplicableCount, passCount, missingCount }",
					"    }",
					"  }",
					"}",
				]}
			/>
			<p>
				Rollup precedence (deterministic, in this order): <strong>any contributor{" "}
				<code>fail</code> → composite <code>fail</code></strong>; else{" "}
				<strong>any <code>cantTell</code> (or a contributor rule that didn't run at all,{" "}
				<code>missingCount &gt; 0</code>) → composite <code>cantTell</code></strong>; else{" "}
				<strong>all contributors <code>notApplicable</code> → composite{" "}
				<code>notApplicable</code></strong>; else <strong><code>pass</code></strong>. See{" "}
				<a href="/conformance/">Conformance</a> for what this means for an overall conformance
				claim.
			</p>

			<h3>Outcome values</h3>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "outcome", label: "Outcome", width: "16%" },
					{ key: "meaning", label: "Meaning", wrap: true },
					{ key: "manual", label: 'Can appear on type: "manual"?', width: "22%" },
				]}
				rows={outcomeRows}
			/>
			<p>
				<code>fail</code> is intentionally the narrowest, highest-bar outcome in this engine:
				reserved for deterministic, normative violations; chasing rule coverage must never dilute
				this.
			</p>

			<h3>Severity and confidence values</h3>
			<ul>
				<li>
					<code>severity</code>: <code>minor</code> &lt; <code>moderate</code> &lt;{" "}
					<code>serious</code> &lt; <code>critical</code> — the rule author's assessment of user
					impact, independent of <code>confidence</code>.
				</li>
				<li>
					<code>confidence</code>: <code>low</code> &lt; <code>medium</code> &lt;{" "}
					<code>high</code> — how certain the engine is that a <code>fail</code>/<code>cantTell</code>{" "}
					verdict is correct. Both are informational metadata for prioritization; neither changes{" "}
					<code>outcome</code>'s meaning.
				</li>
			</ul>
			<p>
				A <code>fail</code> is not always <code>confidence: "high"</code>, and that is not a
				contradiction. The outcome describes the decision procedure — it resolved the question
				without guessing — while <code>confidence</code> describes the model that decision was
				made against. A handful of automatic rules decide deterministically against something that
				is itself an approximation (the curated WAI-ARIA role tables, the native-role mappings, an
				accessibility tree inferred from static markup) and report <code>medium</code>:{" "}
				<code>aria-required-children</code>, <code>aria-prohibited-children</code>,{" "}
				<code>aria-required-parent</code>, <code>aria-allowed-attr</code>,{" "}
				<code>form-control-programmatic-label-present</code>,{" "}
				<code>svg-image-text-alternative-present</code>,{" "}
				<code>video-poster-text-alternative-present</code> and <code>target-size-minimum</code>.{" "}
				<code>confidence</code> is on every result, so a consumer that wants only the most certain
				failures can gate on it directly; <code>policy.allowedConfidence</code> will not do it for
				you, since a disallowed value is replaced with the rule's own <code>defaultConfidence</code>{" "}
				rather than changing the outcome (see{" "}
				<a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a>).
			</p>

			<h3>Worked example</h3>
			<p>
				Scanning <code>&lt;img src="logo.png"&gt;</code> (no <code>alt</code>) and{" "}
				<code>&lt;button&gt;&lt;/button&gt;</code> (no accessible name), scoped to just those two
				rules via <code>runOnly: {"{ includeRuleIds: [...] }"}</code> (see{" "}
				<a href="/configuration/">Engine options</a> — this is <strong>not</strong> a bare array):
			</p>
			<CodeBlock
				lines={[
					"const result = runDomRulesInPage(",
					"  'https://example.test/',",
					"  null,",
					"  {},",
					"  { includeRuleIds: ['img-alt-present', 'button-name-present'] }",
					");",
				]}
			/>
			<CodeBlock
				lines={[
					"{",
					'  "engine": {',
					'    "tag": "a11ycore",',
					'    "schemaVersion": "1.0.0",',
					'    "locale": { "requested": "en", "resolved": "en", "reason": "ok" }',
					"  },",
					'  "url": "https://example.test/",',
					'  "title": "Example",',
					'  "timestamp": null,',
					'  "perfStats": null,',
					'  "contextSelector": null,',
					'  "checksResults": [',
					"    {",
					'      "ruleId": "button-name-present",',
					'      "outcome": "fail",',
					'      "severity": "serious",',
					'      "confidence": "high",',
					'      "type": "automatic",',
					'      "occurrences": [',
					"        {",
					'          "selector": "html > body > button",',
					'          "html": "<button></button>",',
					'          "structuralPath": [1, 1],',
					'          "summary": "This button has no accessible name.",',
					'          "hint": "Provide visible button text or a programmatic accessible-name mechanism (for example aria-label) so assistive technologies can identify the button.",',
					'          "data": {',
					'            "visibilityFilter": { "eligible": true, "reasons": [], "targetSet": "acc", "accEligible": true },',
					'            "details": { "reasonCode": "name_missing" }',
					"          }",
					"        }",
					"      ]",
					"    },",
					"    {",
					'      "ruleId": "img-alt-present",',
					'      "outcome": "fail",',
					'      "severity": "serious",',
					'      "confidence": "high",',
					'      "type": "automatic",',
					'      "occurrences": [',
					"        {",
					'          "selector": "html > body > img",',
					'          "html": "<img src=\\"logo.png\\">",',
					'          "structuralPath": [1, 0],',
					'          "summary": "Missing alt attribute on <img>.",',
					'          "hint": "Add an alt attribute (use alt=\\"\\" only for decorative images)."',
					"        }",
					"      ]",
					"    }",
					"  ],",
					'  "rulesResults": [],',
					'  "overriddenBuiltinIds": []',
					"}",
				]}
			/>
			<p>
				(Trimmed for readability — the real result also includes{" "}
				<code>title</code>/<code>description</code>/<code>i18n</code>/<code>meta</code>/
				<code>engineOptions</code>/<code>schemaVersion</code> on every entry, per the full shape
				above. <code>rulesResults</code> is empty here because{" "}
				<code>runOnly.includeRuleIds</code> scoped the scan to two atomic rules and no composite's
				own ID was included.)
			</p>

			<h2 id="html-report">HTML report</h2>
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

			<h3>What it shows</h3>
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
					<a href="/conformance/">Conformance</a>) — one row per Success Criterion, its outcome, a
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
				when the two differ. See <a href="/configuration/#locales">Locales</a>.
			</p>

			<h3>Library usage</h3>
			<CodeBlock
				lines={[
					"const { renderHtmlReport } = require('@surea11y/core/report');",
					"const { runDomRulesInPage } = require('@surea11y/core');",
					"",
					"const result = runDomRulesInPage(url, null, {}, null);",
					"const html = renderHtmlReport(result, { title: 'My scan report' });",
					"require('fs').writeFileSync('report.html', html);",
				]}
			/>
			<p>
				<code>renderHtmlReport(result, options)</code> is a pure function — it returns a string, it
				never touches the filesystem itself (the CLI's <code>--html</code> flag does the writing).{" "}
				<code>options.title</code> is optional (defaults to <code>"surea11y scan report"</code>).
			</p>

			<h3>Scope</h3>
			<p>
				This is a single-scan report — one point-in-time snapshot, not a dashboard tracking
				results across many scans over time. Tracking results across many runs is a separate,
				larger concern and isn't part of this tool: keep the JSON from each scan and diff it
				yourself, or feed SARIF to a dashboard that already does history (see{" "}
				<a href="#sarif-report">SARIF report</a> below).
			</p>

			<h2 id="sarif-report">SARIF report</h2>
			<p>
				<code>--sarif &lt;path&gt;</code> writes a{" "}
				<a href="https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html">SARIF 2.1.0</a>{" "}
				log — the standard format GitHub Code Scanning (and other SARIF-consuming dashboards)
				expect — instead of, or alongside, <code>--json</code>'s raw engine result.
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --sarif results.sarif", command: true }]} />
			<p>
				See <a href="/configuration/">CI integration</a> for a ready-to-paste GitHub Actions
				workflow that runs a scan and uploads <code>results.sarif</code> to the "Security" tab.
			</p>

			<h3>Why a separate format from <code>--json</code></h3>
			<p>
				<code>--json</code>'s raw result (see <a href="#output-schema">Output schema</a> above) is
				this engine's own contract, versioned and stable per{" "}
				<a href={`${core}/docs/API_STABILITY.md`}><code>API_STABILITY.md</code></a>. SARIF is a
				different, externally-defined contract purpose-built for code-scanning dashboards — a{" "}
				<code>checksResults[]</code> entry and a SARIF <code>result</code> don't map 1:1, so this
				is a real conversion, not a re-serialization.
			</p>

			<h3>What becomes a SARIF result</h3>
			<p>
				Only <code>fail</code>/<code>cantTell</code> occurrences produce SARIF results (same
				"violations only" framing as the <a href="#html-report">HTML report</a> above).
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
				That keeps a SARIF-only pipeline from reading silence as a clean bill of health: no
				contrast alerts can mean the page is fine, or that contrast was never computable, and only
				the notice separates the two. The block is emitted only when there is something to say, so
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

			<h3>Field mapping</h3>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "field", label: "SARIF field", width: "36%", wrap: true },
					{ key: "source", label: "Source", wrap: true },
				]}
				rows={sarifFieldRows}
			/>

			<h3 id="sarif-locations">Locations</h3>
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

			<h3>Combining with <code>--baseline</code></h3>
			<p>
				A generic SARIF consumer has no "known, don't gate on this" concept of its own — the only
				faithful way to honor a baseline in SARIF output is to omit already-known <code>fail</code>{" "}
				occurrences entirely, rather than downgrade them to <code>warning</code>:
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --baseline baseline.json --sarif results.sarif", command: true }]} />
			<p>
				<code>cantTell</code> occurrences are never filtered by a baseline — the baseline mechanism
				only ever tracks <code>fail</code> occurrences (matching <code>--write-baseline</code>, see{" "}
				<a href="/conformance/#baseline">Baseline / allowlist</a>).
			</p>

			<h3>Combining with <code>--html</code>/<code>--json</code></h3>
			<p>
				<code>--sarif</code>, <code>--html</code>, and <code>--json</code> are independent output
				flags — pass any combination in one run; each writes/prints its own report from the same
				single scan.
			</p>

			<h2 id="earl-report">EARL report</h2>
			<p>
				<code>@surea11y/core/earl</code> renders scan results as{" "}
				<a href="https://www.w3.org/TR/EARL10-Schema/">EARL 1.0</a> in JSON-LD — the vocabulary the
				W3C publishes for stating "this tool tested this thing and got this result," and the
				format the <a href="https://act-rules.github.io/">ACT Rules</a> community group accepts as
				an implementation report.
			</p>
			<CodeBlock
				lines={[
					"const { renderEarlReport } = require('@surea11y/core/earl');",
					"",
					"const report = renderEarlReport(result, {",
					"  assertor: { name: 'surea11y', version: '1.7.0' },",
					"  mode: 'earl:automatic'",
					"});",
					"",
					"fs.writeFileSync('earl.jsonld', JSON.stringify(report, null, 2));",
				]}
			/>

			<h3>What it is for</h3>
			<p>Two audiences, and they want the same document for different reasons.</p>
			<p>
				An <strong>implementation report</strong> tells the ACT Rules community group how this
				engine behaves against their test cases, which is what gets an engine listed alongside the
				other implementations. Listing is not endorsement and the W3C does not verify the data —
				the accurate phrasing is <em>"listed as an ACT implementation,"</em> never{" "}
				<em>"W3C certified."</em> This engine's own report is published at{" "}
				<a href="https://surea11y.github.io/act-report/act-report.jsonld">
					https://surea11y.github.io/act-report/act-report.jsonld
				</a>{" "}
				and regenerated by <code>scripts/act-report.js</code>.
			</p>
			<p>
				A <strong>consumer</strong> gets an interchange format. EARL is what accessibility tooling
				reads when it has to combine results from more than one source — an automated scan and a
				manual audit, say, or several engines — because every assertion carries who asserted it and
				how. That is worth having whether or not anything is ever submitted anywhere.
			</p>

			<h3>How it differs from the other reporters</h3>
			<p>
				<a href="#sarif-report">SARIF report</a> and <a href="#html-report">HTML report</a> both
				carry <strong>violations only</strong>: they report <code>fail</code> and{" "}
				<code>cantTell</code> occurrences and drop everything else. EARL is the opposite. Every
				rule that ran becomes an assertion, <code>pass</code> and <code>inapplicable</code>{" "}
				included, because an implementation report is a claim about what the engine decided{" "}
				<em>everywhere</em>. A rule that stayed silent because it found nothing applicable is
				evidence, not noise — it is how a reader distinguishes "this engine checked and found
				nothing to check" from "this engine does not implement that rule at all."
			</p>

			<h3>Shape</h3>
			<p>The graph groups by subject rather than being a flat list of assertions:</p>
			<CodeBlock
				lines={[
					"{",
					'  "@context": "https://www.w3.org/WAI/content-assets/wcag-act-rules/earl-context.json",',
					'  "@graph": [',
					"    {",
					'      "@type": "TestSubject",',
					'      "source": "https://example.test/",',
					'      "assertions": [',
					"        {",
					'          "@type": "Assertion",',
					'          "test": { "title": "img-alt-present", "isPartOf": ["WCAG2:non-text-content"] },',
					'          "result": { "outcome": "earl:failed" },',
					'          "assertedBy": {',
					'            "@type": "Assertor",',
					'            "name": "surea11y",',
					'            "release": { "@type": "Version", "revision": "1.7.0" }',
					"          },",
					'          "mode": "earl:automatic"',
					"        }",
					"      ]",
					"    }",
					"  ]",
					"}",
				]}
			/>
			<ul>
				<li>
					<strong><code>source</code></strong> is the scanned URL, or <code>about:blank</code>{" "}
					when a result carries none.
				</li>
				<li>
					<strong><code>test.title</code></strong> is the engine's own rule id. In ACT terms a rule
					is the <em>procedure</em> the implementation ran, which is exactly what a rule id names.
				</li>
				<li>
					<strong><code>test.isPartOf</code></strong> lists the Success Criteria that rule maps
					to, as <code>WCAG2:&lt;criterion-id&gt;</code>. Omitted entirely for a rule claiming no
					criterion — <code>aria-allowed-role</code> is the engine's one automatic rule in that
					position, and asserting an empty list would read as "maps to nothing we could find"
					rather than "deliberately maps to none."
				</li>
				<li>
					<strong><code>assertedBy</code></strong> and <strong><code>mode</code></strong> appear
					only when you supply them.
				</li>
			</ul>
			<p>
				Criterion ids are derived from the criterion's own title (<code>Non-text Content</code> →{" "}
				<code>non-text-content</code>). <code>normativeMappings</code> also carries
				Understanding-document references and non-WCAG standards, which share{" "}
				<code>standard: "WCAG"</code> and a <code>requirement</code> with the real thing; a Success
				Criterion is the entry that states a conformance level and claims no other document type,
				and only those are read.
			</p>

			<h3>Outcomes</h3>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "engine", label: "Engine", width: "30%" },
					{ key: "earl", label: "EARL", wrap: true },
				]}
				rows={earlOutcomeRows}
			/>
			<p>
				<code>earl:untested</code> has no counterpart: a rule that did not run produces no result
				to assert on, so it contributes no assertion rather than an untested one.
			</p>
			<p>
				<strong><code>cantTell</code> does not cost conformance credit.</strong> ACT's own
				consistency rules allow an automated implementation to report "cannot tell" on some —
				though not all — examples and still count as consistent. What a partially consistent
				implementation may <em>not</em> do is produce a false positive: failing an example the rule
				says should pass, or that is inapplicable. That is the gate worth watching, and it is a
				property of the rules rather than of this reporter. As of the last full run the engine
				produces <strong>zero false positives</strong> across the 798 ACT examples covering its 58
				matched rules — see{" "}
				<a href={`${core}/docs/ACT_RULE_MAPPING.md`}><code>ACT_RULE_MAPPING.md</code></a>, and
				re-run <code>scripts/act-testcase-check.js</code> for the live figure rather than trusting
				this one indefinitely.
			</p>

			<h3>Several results, one report</h3>
			<p>
				<code>renderEarlReport</code> takes an array as readily as a single result, because a
				report covering many pages is the normal case:
			</p>
			<CodeBlock lines={["renderEarlReport([homeResult, checkoutResult, searchResult], { assertor });"]} />
			<p>
				Results sharing a URL merge into one subject — a caller scanning the same page under
				different <code>engineOptions</code> is still describing one resource, and the context has
				no way to express two subjects with the same source. Where two results assert on the same
				rule for the same URL, the last one wins.
			</p>
			<p>
				Output is deterministic: subjects sort by source, assertions by rule id, and the same
				inputs produce byte-identical output in any order. That is what makes a diff between two
				engine versions meaningful.
			</p>

			<h3>Options</h3>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "option", label: "Option", width: "22%" },
					{ key: "meaning", label: "Meaning", wrap: true },
				]}
				rows={[
					{ id: "assertor", option: <code>assertor</code>, meaning: <><code>{"{ name, version }"}</code>. Defaults the name to <code>surea11y</code>; pass <code>null</code> to omit <code>assertedBy</code> entirely.</> },
					{ id: "mode", option: <code>mode</code>, meaning: <>An EARL test mode such as <code>'earl:automatic'</code>. Omitted when not supplied.</> },
				]}
			/>

			<h3>See also</h3>
			<ul>
				<li><a href="#output-schema">Output schema</a> — the result this reads</li>
				<li>
					<a href={`${core}/docs/ACT_RULE_MAPPING.md`}><code>ACT_RULE_MAPPING.md</code></a> — which
					ACT rules the engine's rules correspond to
				</li>
				<li>
					<a href={`${core}/docs/API_STABILITY.md`}><code>API_STABILITY.md</code></a> — what is
					covered by semver
				</li>
			</ul>
		</>
	);
}
