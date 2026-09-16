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

export function ConformanceContent() {
	return (
		<>
			<h2>WCAG conformance mapping</h2>
			<p>
				How individual rule results relate to a WCAG Success Criterion (SC), and what surea11y
				can and cannot tell you about overall conformance.
			</p>

			<h3>The three layers</h3>
			<ol>
				<li>
					<strong>Atomic rules</strong> (<code>checksResults[]</code>) — one normative decision
					each, e.g. "does this <code>&lt;img&gt;</code> have an <code>alt</code> attribute." See{" "}
					<a href="/rules/">the rule catalog</a> for all 130.
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
					(e.g. <code>wcag-1.1.1-non-text-content</code> rolls up 22 atomic rules).
				</li>
			</ol>

			<h3>How a composite's outcome is computed</h3>
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
				<a href="/results-reports/">the output schema</a>) lists every atomic rule and its
				individual outcome — use this to see exactly which facet(s) drove a{" "}
				<code>fail</code>/<code>cantTell</code>, rather than treating the composite as a black
				box.
			</p>

			<h3>Targeting a conformance level (A / AA / AAA)</h3>
			<p>
				Pass <code>runOnly.tags</code> (or <code>engineOptions.tags.include</code>) with the
				level tags you want:
			</p>
			<CodeBlock
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
				<a href="/configuration/">the engine options guide</a> for the ready-made sets per
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

			<h3>What this engine cannot tell you</h3>
			<p>
				No automated tool — this one included — can certify full WCAG conformance. That's not a
				limitation specific to surea11y; it's inherent to WCAG itself; a meaningful fraction of
				Success Criteria require human judgment (is this alt text <em>accurate</em>, not just{" "}
				<em>present</em>; is this error message <em>understandable</em>) or dynamic testing this
				engine's static-DOM-scan architecture cannot do at all (keyboard-trap detection, real
				layout/reflow at zoom). See{" "}
				<a href="/troubleshooting/#known-limitations">the known limitations</a> for the full,
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

			<h2 id="baseline">Baseline / allowlist</h2>
			<p>
				A strict CI gate ("fail the build on any <code>fail</code> outcome") is an adoption
				blocker for a team scanning an existing, imperfect site for the first time — they can't
				ship anything until every pre-existing violation is fixed. A baseline lets a team say
				"these N are already known — don't gate on them, but fail the moment a genuinely new one
				appears."
			</p>
			<CodeBlock
				lines={[
					"# Once: record every current fail occurrence, does not fail the build.",
					{ text: "surea11y scan ./dist/index.html --write-baseline baseline.json", command: true },
					"",
					"# Commit baseline.json to git.",
					"",
					"# From then on, in CI: only a NEW (not-yet-baselined) fail occurrence gates the build.",
					{ text: "surea11y scan ./dist/index.html --baseline baseline.json", command: true },
				]}
			/>
			<p>
				The baseline file is meant to be committed to git, so accepting more accessibility debt
				becomes an explicit, reviewable decision — a new violation shows up as a new row in the
				file's diff in a PR, not a silent change in a count.
			</p>

			<h3>When this is useful</h3>
			<ul>
				<li>
					<strong>Adopting scanning on an existing site.</strong> The motivating case above: a
					first scan on a mature site can turn up hundreds of pre-existing violations.
					Baselining them once unblocks gating immediately instead of requiring "fix everything
					first."
				</li>
				<li>
					<strong>Incremental remediation with a visible burn-down.</strong> Fix violations in
					batches, then periodically regenerate the baseline with <code>--write-baseline</code>.
					Each regeneration's git diff <em>shrinks</em> as entries disappear — the file itself
					becomes a progress tracker, and a PR that fixes a batch of issues shows exactly what
					got cleaned up.
				</li>
				<li>
					<strong>Third-party/vendor content you don't control.</strong> A page embeds a widget
					(chat bubble, ad unit, payment iframe) with known, unfixable-by-you violations.
					Baselining just those specific occurrences is more precise than excluding the whole
					subtree via <code>excludeSelectors</code> (see{" "}
					<a href="/configuration/">the engine options guide</a>) — new issues introduced
					anywhere else near it, including inside your own code, still gate normally.
				</li>
				<li>
					<strong>Regression safety net during a large refactor.</strong> Mid-migration, some
					rules may legitimately fail temporarily in ways already tracked and being fixed across
					many PRs. Baselining the known-in-progress set still catches <em>unrelated</em> new
					regressions from other PRs during the same window, instead of turning the gate off
					entirely or blocking every PR on it.
				</li>
				<li>
					<strong>Staged rollout of a new or stricter rule.</strong> Turning on a rule (or a
					whole WCAG level) the codebase isn't clean against yet: baseline the existing gaps,
					enable gating immediately, and prevent any <em>new</em> violations of that rule while
					the backlog is cleaned up separately — rather than waiting to enable the rule until the
					codebase is already compliant.
				</li>
			</ul>

			<h3>How matching works</h3>
			<p>
				Nothing in an occurrence's shape is a perfect, page-position-independent identity (see{" "}
				<a href="/results-reports/">the output schema</a>): <code>selector</code> and{" "}
				<code>structuralPath</code> are both derived from the element's position in the DOM, so
				either can shift when <em>unrelated</em> markup changes elsewhere on the page, even though
				the flagged element itself never changed.
			</p>
			<p>Instead, a baseline entry's identity is:</p>
			<CodeBlock lines={["ruleId + reasonCode + html"]} />
			<p>
				where <code>reasonCode</code> is the rule-specific code from{" "}
				<code>occurrence.data.details.reasonCode</code> (defaulting to <code>"DEFAULT"</code>{" "}
				when a rule doesn't set one), and <code>html</code> is the occurrence's outer-HTML
				snippet. This is content-based rather than position-based: it survives the flagged
				element moving around the page (a reorder, an unrelated sibling added/removed) as long as
				the flagged element's own markup doesn't change. <code>selector</code> is still recorded
				in the baseline file, but purely for human context when reading a diff — it is never used
				for matching.
			</p>
			<p>
				<strong>Known limitation</strong>: an element whose <em>own</em> markup includes dynamic
				content (a timestamp, a live counter, a randomly-generated id) will never match itself
				across two scans, since its <code>html</code> snippet differs every time. If your pages
				hit this case, the baseline mechanism won't help for those specific rules/elements — see
				"Alternative" below.
			</p>
			<p>
				Matching counts occurrences, not just presence: if a page has 3 elements that produce
				byte-identical <code>ruleId</code>+<code>reasonCode</code>+<code>html</code> (e.g. the
				same broken component repeated 3 times) and the baseline recorded only 1 of them, a fresh
				scan reports 1 known and 2 new — not all 3 as known.
			</p>
			<p>
				Baseline entries that don't match anything in a fresh scan are reported as{" "}
				<strong>stale</strong> (the violation was presumably fixed) — this is informational only
				and never gates the build; regenerate the baseline with <code>--write-baseline</code>{" "}
				periodically to clean these up.
			</p>

			<h3>File format</h3>
			<CodeBlock
				lines={[
					"{",
					'  "version": 1,',
					'  "generatedAt": "2026-07-30T12:00:00.000Z",',
					'  "entries": [',
					'    { "ruleId": "img-alt-present", "reasonCode": "DEFAULT", "selector": "html > body > img", "html": "<img src=\\"logo.png\\">" }',
					"  ]",
					"}",
				]}
			/>
			<p>
				<code>--baseline &lt;path&gt;</code> rejects a file that isn't{" "}
				<code>{"{ version: 1, entries: [...] }"}</code> with a clear exit-2 error rather than
				guessing at an older/different format.
			</p>

			<h3>Combining with <code>--json</code></h3>
			<p>
				When <code>--baseline</code> or <code>--write-baseline</code> is used together with{" "}
				<code>--json</code>, the printed object gains a <code>baseline</code> key alongside the
				normal engine result (this is CLI-output-only — it is not part of the engine's own result
				contract described in the output schema):
			</p>
			<ul>
				<li>
					<code>--write-baseline</code>:{" "}
					<code>{'{ mode: "write", path, entries: <number written> }'}</code>
				</li>
				<li>
					<code>--baseline</code>:{" "}
					<code>
						{'{ mode: "check", totalFail, knownCount, newCount, staleCount, newOccurrences: [...] }'}
					</code>
				</li>
			</ul>

			<h3>Alternative: diff two scans yourself</h3>
			<p>
				If your pages don't fit this model (heavy dynamic content inside the flagged elements
				themselves), the always-available fallback is to diff two full <code>--json</code> outputs
				yourself — see{" "}
				<a href={`${core}/docs/INTEGRATION.md#ci-gating-a-build-on-the-result`}>
					<code>INTEGRATION.md</code>
				</a>
				. That gives you full control over the identity/matching logic at the cost of writing it
				yourself.
			</p>
		</>
	);
}
