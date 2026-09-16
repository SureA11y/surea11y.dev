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
				per-string, <strong>asking for a language the build does not carry produces English text
				rather than an error</strong> — this field is how you find that out without reading the
				strings. Reported
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
				default <code>"2.2"</code>. It affects one thing today — <strong>a rule mapped only to SC
				4.1.1 Parsing cannot <code>fail</code> under a 2.2 target</strong> (see{" "}
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
				strings (multi-region scanning, see <a href="/configuration/engine-options/">Engine options</a>), or{" "}
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
				<code>runOnly</code> — see <a href="/configuration/engine-options/">Engine options</a>).{" "}
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
				<a href="/conformance/wcag-mapping/">Conformance</a>. Empty array if no composite matched the current{" "}
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
				(see <a href="/configuration/engine-options/">Engine options</a>). Always an array; empty when no
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
				is on the page. Both are constants, so the fingerprint they feed stays stable, but{" "}
				<strong>do not treat <code>selector</code> as resolvable or <code>html</code> as real
				markup without checking the rule reported something that exists</strong>.
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
				changes a selector string wouldn't (an id/class rename, for instance), at{" "}
				<strong>the cost of not being usable as an actual CSS selector</strong>.
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

export function OutputSchemaContent() {
	return (
		<>
			<p>
				This is the exact shape of the object returned by <code>runDomRulesInPage(...)</code> /{" "}
				<code>runa11yCoreInPage(...)</code> (see{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a> for which one to
				call). Every example on this page is real output from the current engine (
				<code>schemaVersion: "1.0.0"</code>), not hand-written. <code>runa11yCoreAcrossFrames</code>{" "}
				returns a different, recursive shape wrapping this one — see{" "}
				<a href="#cross-frame-result">Cross-frame result</a> below.
			</p>

			<h2 id="top-level-result">Top-level result</h2>
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

			<h2 id="cross-frame-result">Cross-frame result (<code>runa11yCoreAcrossFrames</code>)</h2>
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

			<h2>A check result (<code>checksResults[i]</code>)</h2>
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
					"    deprecated: boolean,",
					"    deprecation: object | null,",
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
					<a href="/conformance/wcag-mapping/">Conformance</a> for how these roll up.
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
					<a href="/configuration/engine-options/#filtering-by-wcag-version">Filtering by WCAG version</a>.
				</li>
				<li>
					<strong><code>error</code></strong>: only present in three cases — the rule implementation
					threw an uncaught exception, the manual-fail coercion above fired, or every occurrence
					of a <code>fail</code> result had its ancestor walk hit an internal depth limit (so the
					engine couldn't confirm the flagged content is actually exposed) and the whole result
					was coerced to <code>cantTell</code> the same way. A thrown rule always surfaces as{" "}
					<code>outcome: "cantTell"</code> with <code>occurrences: []</code> and <code>error</code>{" "}
					set to the exception message — the engine never lets one broken rule crash the whole
					scan.
				</li>
				<li>
					<strong><code>engineOptions</code></strong> on each result is the <em>resolved</em>{" "}
					options object (after locale/contrast defaults were applied), not literally what you
					passed in — useful for confirming what a given rule actually saw, especially the
					resolved <code>locale</code> and <code>contrast.mode</code>/
					<code>contrast.rootCanvasFallback</code>.
				</li>
			</ul>

			<h2>An occurrence (<code>occurrences[i]</code>)</h2>
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
				describes the scan, not an element, so its <code>selector</code> is empty.{" "}
				<strong>Do not read <code>occurrences.length</code> as a violation count without checking{" "}
				<code>outcome</code> first.</strong>
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

			<h3 id="uncertainty-codes">Uncertainty codes</h3>
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
				not change meaning, so branch on the codes you know and{" "}
				<strong>treat an unrecognised one as "needs review" rather than an error</strong>.
			</p>
			<p>
				Every automatic rule that can report <code>cantTell</code> carries this, and a test holds
				that line so a new one cannot arrive without it. The <code>out-of-scope</code> code is
				attached by the engine rather than by a rule, on the same occurrences that produce a
				result-level <code>wcagVersionScope</code>. Manual rules do not carry it:{" "}
				<code>judgement-required</code> is what <code>type: "manual"</code> already means, so
				repeating it per occurrence would say nothing the result does not.
			</p>

			<h2 id="composite-result">A composite result (<code>rulesResults[i]</code>)</h2>
			<p>
				Composites roll multiple atomic rules up to one WCAG Success Criterion (e.g.{" "}
				<code>wcag-1.1.1-non-text-content</code> rolls up 21 atomic rules). Shape is the same
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
				<a href="/conformance/wcag-mapping/">Conformance</a> for what this means for an overall conformance
				claim.
			</p>

			<h2>Outcome values</h2>
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
				reserved for deterministic, normative violations;{" "}
				<strong>chasing rule coverage must never dilute this</strong>.
			</p>

			<h2>Severity and confidence values</h2>
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
				<strong>A <code>fail</code> is not always <code>confidence: "high"</code>, and that is not
				a contradiction.</strong> The outcome describes the decision procedure — it resolved the question
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

			<h2>Worked example</h2>
			<p>
				Scanning <code>&lt;img src="logo.png"&gt;</code> (no <code>alt</code>) and{" "}
				<code>&lt;button&gt;&lt;/button&gt;</code> (no accessible name), scoped to just those two
				rules via <code>runOnly: {"{ includeRuleIds: [...] }"}</code> (see{" "}
				<a href="/configuration/engine-options/">Engine options</a> — this is <strong>not</strong> a bare array):
			</p>
			<CodeBlock
				lang="js"
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
				lang="json"
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
		</>
	);
}
