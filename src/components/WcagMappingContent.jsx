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
					<a href="/rules/">the rule catalog</a> for every one.
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
			<p>
				A custom rule (<code>engineOptions.customRules</code>) or a{" "}
				<a href="/configuration/packs/">pack</a>'s rule that ran counts toward the composite of
				each criterion it maps to, through <code>meta.wcagSc</code> or a WCAG entry in{" "}
				<code>meta.normativeMappings</code>, as a built-in rule does: a failing one fails the
				composite. The composite marks a custom rule <code>custom: true</code> among its
				contributors and lists it in <code>data.details.customChecksIds</code>, since custom rules
				are not checked against the specs as the built-in ones are. An override of a built-in
				counts where its own mapping says: in its built-in's place when it maps to that criterion,
				nowhere when it maps to none (with a warning).
			</p>
			<p>
				A scan that names rules rather than criteria (<code>{"includeRuleIds: ['link-name-present']"}</code>,
				a tag that names no WCAG level, the best practices) gets the composites of the criteria
				those rules check too (see <a href="/configuration/engine-options/#which-criteria-a-scan-reports">Engine options</a>).
				Before 1.12 such a scan reported none. The table above decides them: a failing rule fails
				the criterion, and the rules the scan didn't select are contributors that didn't run, so
				the criterion is at best <code>cantTell</code>, partly checked (<code>reasonCode</code>{" "}
				<code>composite.rollup.cantTell.notSelectedChild</code>, each such contributor marked{" "}
				<code>notSelected: true</code>; "Partly checked" in the{" "}
				<a href="/results-reports/html-report/">HTML report</a>).
			</p>

			<h2>Targeting a conformance level (A / AA / AAA)</h2>
			<p>Name the WCAG version and level in <code>runOnly.wcag</code>:</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.2 Level A and AA:",
					"runDomRulesInPage(url, null, {}, { wcag: { version: '2.2', level: 'AA' } });",
					"",
					"// The same, and the best-practice rules, which test no WCAG criterion:",
					"runDomRulesInPage(url, null, {}, { wcag: { version: '2.2', level: 'AA' }, bestPractices: true });",
				]}
			/>
			<p>
				A target runs the rules for every criterion in force in that version at that level and
				below, by the level each criterion has in that version (<code>WCAG_CRITERIA</code> in{" "}
				<code>@surea11y/core/wcag</code>), so 4.1.1 Parsing is part of 2.0 and 2.1 targets and not
				of 2.2 ones. It also sets the run's WCAG version and the level of the rollups reported.
				See <a href="/configuration/engine-options/#selecting-by-wcag-target-runonlywcag">Selecting by WCAG target</a>.
			</p>
			<p>
				Each entry of <code>WCAG_CRITERIA</code> also has the <code>id</code> W3C gives the
				criterion in WCAG 2.2 (<code>non-text-content</code>). Every WCAG mapping a rule carries
				links its criterion's section in that version's Recommendation (<code>url</code>) and its
				Understanding document (<code>understandingUrl</code>), for 2.1 and 2.2: the reporters use
				the Understanding document as a rule's help link when the rule has none of its own.
			</p>

			<h3 id="with-tags">With tags</h3>
			<p>
				The same targets can be spelled with level tags, in <code>runOnly.tags</code> (or{" "}
				<code>engineOptions.tags.include</code>):
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
				therefore runs the 9 rules mapped to a 2.0 AA criterion, not the ~100 that make up an A
				+ AA target. List every level you mean, or use <code>runOnly.wcag</code>, which does not
				have the problem. <code>engineOptions.profile</code> (<code>wcag22-aa</code>, <code>en301549-v4.1.1</code>,{" "}
				<code>en301549-v3.2.1</code>, <code>section508</code>) does it for you too; see{" "}
				<a href="/configuration/engine-options/#conformance-profiles">Conformance profiles</a>.
				</p>
			<p>
				The same applies across WCAG versions — a criterion introduced in 2.1 or 2.2 carries only
				its own origin tag — so a full conformance target is a union of tag sets. See{" "}
				<a href="/configuration/engine-options/#filtering-by-wcag-version">the engine options guide</a> for the ready-made sets per
				version, including the one criterion WCAG 2.2 removed rather than added.
			</p>
			<p>
				<strong>The removed criterion is handled for you.</strong> Every run resolves a target
				WCAG version (<code>engineOptions.wcagVersion</code>, else the <code>wcagVersion</code>{" "}
				of the <a href="/configuration/packs/">pack</a> profile the run applies, else the version
				of <code>runOnly.wcag</code>, else whatever your version tags imply, else <code>2.2</code>) and reports it back as <code>engine.wcagVersion</code>.
				Under a 2.2 target, a rule mapped only to SC 4.1.1 Parsing cannot report <code>fail</code>{" "}
				— it runs, reports its occurrences, and comes back <code>cantTell</code> with a{" "}
				<code>wcagVersionScope</code> field explaining the coercion. So a default scan never
				gates on a criterion WCAG 2.2 does not contain, and a 2.0/2.1 scan still gets a real
				4.1.1 verdict.
			</p>
			<p>
				Composites, unlike atomic rules, <em>are</em> filtered cumulatively. The runner reads{" "}
				<code>engineOptions.wcagLevel</code>, else the level of <code>runOnly.wcag</code>, or the
				highest level named in <code>tags</code>, and drops every composite above it, so
				requesting <code>{"['wcag2a', 'wcag2aa']"}</code> returns no <code>rulesResults</code>{" "}
				entry for an AAA-only SC. <code>wcagLevel</code> (<code>'A'</code>, <code>'AA'</code> or{" "}
				<code>'AAA'</code>) is the one to set on a scan that names checks rather than a target:
				every selected rule still runs, and only the criteria it reports are kept to that level,
				so a scan of <code>contrast-computable</code> at <code>'AA'</code> reports 1.4.3 and not
				the AAA 1.4.6. The run records it as <code>engine.wcagLevel</code>. That is{" "}
				<code>targetWcagLevelOf</code>/
				<code>isAllowedByTargetLevel</code> in <code>src/core/dom-runner.js</code> if you need
				the exact precedence.
			</p>
			<p>
				Omit <code>tags</code> entirely (the default) and every rule at every level runs, with no
				composite suppression.
			</p>

			<h2 id="en-301-549">EN 301 549</h2>
			<p>
				Chapter 9 of EN 301 549 restates the WCAG Level A and AA Success Criteria as clauses
				numbered <code>9.</code> plus the criterion's own number: WCAG 1.4.3 is clause 9.1.4.3.
				When a scan asks for them, every atomic and composite result carries, after its WCAG
				entries in <code>meta.normativeMappings</code>, the clause for each of its criteria, once
				per version of the standard that includes that criterion. A scan asks with{" "}
				<code>engineOptions.mappings: ['en301549']</code> (both versions) or{" "}
				<code>['en301549:V3.2.1']</code> (one), or by targeting an EN 301 549 profile, which adds
				the version it names; by default results name WCAG only (see{" "}
				<a href="/configuration/engine-options/#other-standards-mappings">Other standards</a>).
			</p>
			<DataTable
				label="EN 301 549 versions"
				rowKey="version"
				columns={[
					{ key: "version", label: "Version", width: "20%" },
					{ key: "builtOn", label: "Built on", wrap: true },
					{ key: "differs", label: "Differs from the other in", wrap: true },
				]}
				rows={[
					{ version: "V3.2.1 (2021-03)", builtOn: "WCAG 2.1 A and AA, 50 criteria", differs: "Includes 9.4.1.1 Parsing" },
					{
						version: "V4.1.1 (2026-09)",
						builtOn: "WCAG 2.2 A and AA, 55 criteria",
						differs: "Adds 2.4.11, 2.5.7, 2.5.8, 3.2.6, 3.3.7, 3.3.8; 9.4.1.1 is void",
					},
				]}
			/>
			<p>
				Each clause entry also names the criterion it restates, as{" "}
				<code>{'wcagSc: ["1.4.3"]'}</code>, so a view grouped by criterion (
				<a href="/results-reports/junit-report/">JUnit</a>'s suites, the{" "}
				<a href="/results-reports/html-report/">HTML report</a>'s rollup) puts it under the right one
				even on a rule mapped to several. AAA criteria have no clause in either version. The catalogs
				name the clauses under the same options: <code>{"getChecksCatalog({ mappings: ['en301549'] })"}</code>{" "}
				in each entry's <code>normativeMappings</code>, and composite entries returned by{" "}
				<code>{"getRulesCatalog({ mappings: ['en301549'] })"}</code> as{" "}
				<code>meta.standardMappings</code>, so the clauses a criterion maps to can be read without
				running a scan.
			</p>
			<p>
				The table is public as <code>@surea11y/core/en301549</code>, for tools that need the reverse
				view, such as which criteria a version requires that a scan did not cover:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { EN301549_CLAUSES, en301549ClausesForSc } = require('@surea11y/core/en301549');",
					"",
					"Object.keys(EN301549_CLAUSES['V3.2.1']);  // the 50 WCAG 2.1 A and AA criteria V3.2.1 restates",
					"en301549ClausesForSc('2.5.8');            // [{ version: 'V4.1.1', clause: '9.2.5.8', title: 'Target size (minimum)' }]",
				]}
			/>
			<p>
				<strong>This is a correspondence between two published documents, not a conformance
				claim</strong>: a clause on a result says which EN 301 549 requirement that WCAG criterion
				is, nothing more. Which version a given law requires is outside the engine.
			</p>
			<p>
				EN 301 549 is one entry in a registry of standards that the runner, the rule catalog and
				the reporters all read. A standard with verdicts of its own (requirements its own rules
				check, a national standard such as RGAA, say), or an organisation's checklist, comes as a{" "}
				<a href="/configuration/packs/">pack</a>: a package of its own outside core, which a scan
				takes in <code>engineOptions.packs</code> and whose entry joins the registry for that scan,
				with its own profiles, rules and rollups. A custom rule can name any standard in its own{" "}
				<code>normativeMappings</code>, but only registered standards (core's and the scan's
				packs') get a profile, a <code>mappings</code> switch, opt-in rules, rollups, or a place in
				SARIF, JUnit and the HTML report. How a standard is built into core itself is in{" "}
				<a href={`${core}/docs/WCAG_CONFORMANCE.md#adding-another-standard`}>
					<code>WCAG_CONFORMANCE.md</code>
				</a>
				, the contributor guide on GitHub.
			</p>

			<h2>What this engine cannot tell you</h2>
			<p>
				<strong>No automated tool — this one included — can certify full WCAG conformance.</strong> That's not a
				limitation specific to surea11y; it's inherent to WCAG itself; a meaningful fraction of
				Success Criteria require human judgment (is this alt text <em>accurate</em>, not just{" "}
				<em>present</em>; is this error message <em>understandable</em>) or dynamic testing this
				engine's static-DOM-scan architecture cannot do at all (keyboard-trap detection, real
				layout/reflow at zoom). See{" "}
				<a href="/help/known-limitations/">the known limitations</a> for the full,
				explicit list of what's out of scope and why.
			</p>
			<p>What surea11y <em>can</em> give you, honestly:</p>
			<ul>
				<li>
					Core's built-in rules are written to <code>fail</code> only on a deterministic, normative
					violation of the standard and version you targeted, and to report <code>cantTell</code>{" "}
					when they can't be sure. That is a design goal, not a guarantee: the{" "}
					<a href="/help/known-limitations/">known limitations</a> list edge cases where a rule can
					still be wrong, each finding's occurrences show what it was decided on, and the{" "}
					<a href="/rules/">rule catalog</a> gives each rule's confidence. How accurate a custom rule, a pack rule or an override is depends on how it was written.
					By default that standard is WCAG. A rule for a requirement only another standard makes is
					opt-in: by default it runs only when you target that standard (see{" "}
					<a href="/configuration/engine-options/#opt-in-rules">Opt-in rules</a>).{" "}
					<code>engineOptions.optInRules</code> unlocks opt-in rules without removing the scan's
					profile or filters. With <code>optInRules: 'all'</code> and no
					profile or filter, the run covers every rule and targets no single standard; a list of tags
					unlocks only those opt-in groups. <code>engine.optInRules</code> lists the tags whose rules
					ran. Under a WCAG profile, an
					unlocked rule runs only when its tags match that profile, and the run still targets WCAG.
					So among core's
					rules, a scan with a WCAG target runs only those for the target's criteria, plus the
					best-practice rules if you add them. A best-practice rule names no criterion, and can still
					report <code>fail</code> where what it finds is itself a barrier, such as an empty heading
					(<a href="/rules/empty-heading/"><code>empty-heading</code></a>); no WCAG composite counts
					it. A custom rule, an override or a pack rule without an
					opt-in tag runs when the selection includes it, and can then report a <code>fail</code>{" "}
					for a check of its own that WCAG doesn't require.
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
