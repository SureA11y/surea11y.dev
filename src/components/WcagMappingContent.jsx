import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const precedenceRows = [
	{
		id: "fail",
		condition: (
			<>
				Any contributor <code>fail</code>
			</>
		),
		outcome: <code>fail</code>,
	},
	{
		id: "canttell",
		condition: (
			<>
				No <code>fail</code>, but any contributor <code>cantTell</code> or a listed contributor
				didn't run at all
			</>
		),
		outcome: <code>cantTell</code>,
	},
	{
		id: "na",
		condition: (
			<>
				Every contributor <code>notApplicable</code>
			</>
		),
		outcome: <code>notApplicable</code>,
	},
	{
		id: "pass",
		condition: "Otherwise (all ran, none failed/cantTell, not all N/A)",
		outcome: <code>pass</code>,
	},
];

export function WcagMappingContent() {
	return (
		<>
			<p>
				How individual rule results relate to a WCAG Success Criterion (SC), and what surea11y
				can and cannot tell you about overall conformance.
			</p>

			<h2>The three layers</h2>
			<ol>
				<li>
					<strong>Atomic rules</strong> (<code>checksResults[]</code>) — one normative decision
					each, e.g. "does this <code>&lt;img&gt;</code> have an <code>alt</code> attribute." See{" "}
					<a href="/rules/">the rule catalog</a> for all 132.
				</li>
				<li>
					<strong>Facets</strong> — a WCAG SC is usually bigger than any one rule can decide
					deterministically. Internally, each SC is broken into named "facets" (e.g. 1.1.1
					Non-text Content has facets like <code>img-alt-attr-present</code>,{" "}
					<code>text-alternative-quality</code>, <code>decorative-null</code>) tracked in{" "}
					<code>src/coverage/wcag-facets.js</code>, each marked <code>full</code> (a rule
					decides it with high confidence), <code>partial</code> (a rule decides <em>part</em>{" "}
					of it — see each rule's own scope notes), or <code>manual</code> (no safe automated
					heuristic exists at all). Run <code>npm run coverage</code> to regenerate{" "}
					<code>coverage/coverage-report.md</code>, the per-SC facet breakdown.
				</li>
				<li>
					<strong>Composite (WCAG-SC rollup) rules</strong> (<code>rulesResults[]</code>) — a
					generated aggregate of every atomic rule mapped to one SC, giving you one
					pass/fail/cantTell/notApplicable verdict per SC instead of having to roll up dozens of
					atomic results yourself. See{" "}
					<a href={`${core}/docs/RULE_CATALOG.md#composite-wcag-sc-rollup-rules-34`}>
						the full list
					</a>{" "}
					(e.g. <code>wcag-1.1.1-non-text-content</code> rolls up 21 atomic rules).
				</li>
			</ol>

			<h2>How a composite's outcome is computed</h2>
			<p>Deterministic precedence, evaluated over that composite's atomic contributors:</p>
			<DataTable
				caption="Composite outcome precedence"
				rowKey="id"
				columns={[
					{ key: "condition", label: "Condition", wrap: true, width: "75%" },
					{ key: "outcome", label: "Composite outcome", width: "25%" },
				]}
				rows={precedenceRows}
			/>
			<p>
				This means: <strong>a composite <code>pass</code> is a real, deterministic "every
				applicable automated check for this SC came back clean" — but it is not a WCAG
				conformance claim on its own.</strong> If any facet of that SC has no automated coverage
				at all (see <code>coverage-report.md</code>), a composite <code>pass</code> is silent
				about that facet, not asserting it's fine. Cross-check the facet table before treating a
				composite <code>pass</code> as "SC fully verified."
			</p>
			<p>
				A composite's <code>data.details.contributors</code> array (see{" "}
				<a href="/results-reports/output-schema/">the output schema</a>) lists every atomic rule and its
				individual outcome — use this to see exactly which facet(s) drove a{" "}
				<code>fail</code>/<code>cantTell</code>, rather than treating the composite as a black
				box.
			</p>

			<h2>Targeting a conformance level (A / AA / AAA)</h2>
			<p>
				Pass <code>runOnly.tags</code> (or <code>engineOptions.tags.include</code>) with the
				level tags you want:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.0 A and AA. Both tags are required: they are not cumulative.",
					"runDomRulesInPage(url, null, {}, { tags: ['wcag2a', 'wcag2aa'] });",
				]}
			/>
			<p>
				<strong>Level tags do not nest, and this is the easiest thing to get wrong here.</strong>{" "}
				A rule carries one level tag per Success Criterion it maps to, and nothing more: a rule
				mapped only to an AA criterion is tagged <code>wcag2aa</code> and <em>not</em>{" "}
				<code>wcag2a</code>. Asking for <code>{"{ tags: ['wcag2aa'] }"}</code> on its own
				therefore runs the 10 rules mapped to a 2.0 AA criterion, not the ~100 that make up an A
				+ AA target. List every level you mean.
			</p>
			<p>
				The same applies across WCAG versions — a criterion introduced in 2.1 or 2.2 carries only
				its own origin tag — so a full conformance target is a union of tag sets. See{" "}
				<a href="/configuration/engine-options/#filtering-by-wcag-version">the engine options guide</a> for the ready-made sets per
				version, including the one criterion WCAG 2.2 removed rather than added.
			</p>
			<p>
				<strong>The removed criterion is handled for you.</strong> Every run resolves a target
				WCAG version (<code>engineOptions.wcagVersion</code>, else whatever your version tags
				imply, else <code>2.2</code>) and reports it back as <code>engine.wcagVersion</code>.
				Under a 2.2 target, a rule mapped only to SC 4.1.1 Parsing cannot report <code>fail</code>{" "}
				— it runs, reports its occurrences, and comes back <code>cantTell</code> with a{" "}
				<code>wcagVersionScope</code> field explaining the coercion. So a default scan never
				gates on a criterion WCAG 2.2 does not contain, and a 2.0/2.1 scan still gets a real
				4.1.1 verdict.
			</p>
			<p>
				Composites, unlike atomic rules, <em>are</em> filtered cumulatively. The runner reads the
				highest level named in <code>tags</code> and drops every composite above it, so
				requesting <code>{"['wcag2a', 'wcag2aa']"}</code> returns no <code>rulesResults</code>{" "}
				entry for an AAA-only SC. That is <code>inferTargetLevelFromRunOnly</code>/
				<code>isAllowedByTargetLevel</code> in <code>src/core/dom-runner.js</code> if you need
				the exact precedence.
			</p>
			<p>
				Omit <code>tags</code> entirely (the default) and every rule at every level runs, with no
				composite suppression.
			</p>

			<h2>What this engine cannot tell you</h2>
			<p>
				No automated tool — this one included — can certify full WCAG conformance. That's not a
				limitation specific to surea11y; it's inherent to WCAG itself; a meaningful fraction of
				Success Criteria require human judgment (is this alt text <em>accurate</em>, not just{" "}
				<em>present</em>; is this error message <em>understandable</em>) or dynamic testing this
				engine's static-DOM-scan architecture cannot do at all (keyboard-trap detection, real
				layout/reflow at zoom). See{" "}
				<a href="/troubleshooting/known-limitations/">the known limitations</a> for the full,
				explicit list of what's out of scope and why.
			</p>
			<p>What surea11y <em>can</em> give you, honestly:</p>
			<ul>
				<li>
					Every <code>fail</code> is a real, deterministic, normative violation under the version
					you targeted — never a guess.
				</li>
				<li>
					Every <code>cantTell</code> is an explicit flag for human review, not a swallowed
					uncertainty.
				</li>
				<li>
					The facet coverage table tells you exactly which parts of which SCs have zero automated
					coverage, so you know where a <code>pass</code> is silent rather than exhaustive.
				</li>
			</ul>
			<p>
				A composite <code>pass</code> across every SC at your target level means: <em>every
				automatable check for that level came back clean.</em> It is the automatable subset of
				conformance, stated precisely — not a substitute for the manual review WCAG itself
				requires.
			</p>
		</>
	);
}
