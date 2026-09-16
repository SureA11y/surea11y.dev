import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const optionRows = [
	{
		id: "locale",
		option: <code>locale</code>,
		meaning: (
			<>
				Any string. A code with a subtag falls back to its base language first, so{" "}
				<code>de-DE</code> uses <code>de</code>; failing that, English. Individual strings then
				fall back the same way (chosen locale → <code>en</code> → the rule's literal English
				text), so a partly-translated locale never produces missing text. All of that is silent
				in the strings themselves, so the result reports what actually happened in{" "}
				<code>engine.locale</code> — check it if you need to know whether you got the language
				you asked for. See <a href="/configuration/locales/">Locales</a>.
			</>
		),
	},
	{
		id: "wcagVersion",
		option: <code>wcagVersion</code>,
		meaning: (
			<>
				<code>'2.0'</code>, <code>'2.1'</code> or <code>'2.2'</code> — which version of WCAG the
				run is conformance-testing against. Defaults to whatever your version-origin tags imply,
				and to <code>'2.2'</code> when they imply nothing. The only thing it currently changes is
				SC 4.1.1 Parsing, removed in 2.2: under a 2.2 target a rule tagged{" "}
				<code>wcag22-removed</code> still runs and still reports its occurrences, but cannot{" "}
				<code>fail</code> — see{" "}
				<a href="#filtering-by-wcag-version">"Filtering by WCAG version"</a> above. Any other
				value is ignored and the default applies.
			</>
		),
	},
	{
		id: "messages",
		option: <code>messages</code>,
		meaning: (
			<>
				Optional <code>{"{ [locale]: { key: text } }"}</code>. Checked before the engine's own
				tables, so it can override individual strings or supply a language the build does not
				carry. Keys you omit fall back normally, so a partial override is fine. This is how the
				standalone browser bundle receives a locale side file, and it is the only way to get a
				dictionary into a page context, since the in-page runner is serialized and cannot read
				files. See <a href="/configuration/locales/">Locales</a>.
			</>
		),
	},
	{
		id: "includeHiddenElements",
		option: <code>includeHiddenElements</code>,
		meaning: (
			<>
				Default <code>false</code>: helper queries exclude elements hidden by structural/CSS
				mechanisms such as <code>display:none</code>, <code>[hidden]</code>, closed{" "}
				<code>&lt;details&gt;</code>, and hidden rendering-only host elements (with descendants
				excluded too). Set <code>true</code> to include those hidden/collapsed subtrees in
				evaluation (legacy/static-markup behavior).
			</>
		),
	},
	{
		id: "includeShadowDom",
		option: <code>includeShadowDom</code>,
		meaning: (
			<>
				Default <code>true</code>: rules using <code>helpers.queryAllSmart</code> traverse into
				open shadow roots. Set <code>false</code> to scan only the light DOM. Closed shadow roots
				are never reachable either way (no DOM API exposes them).
			</>
		),
	},
	{
		id: "fragment",
		option: <code>fragment</code>,
		meaning: (
			<>
				Default <code>false</code>. A handful of rules check for the presence of a property that
				exists once per real page — <code>page-title-present</code>,{" "}
				<code>html-lang-attr-present</code>, <code>html-xml-lang-mismatch</code>,{" "}
				<code>aria-hidden-body</code>, <code>css-orientation-lock</code>,{" "}
				<code>meta-refresh-no-exceptions</code>, <code>meta-refresh-timing-absent</code>,{" "}
				<code>meta-viewport-zoom-enabled</code>, <code>meta-viewport-large</code>,{" "}
				<code>page-title-patterns</code>, <code>region</code>,{" "}
				<code>bypass-blocks-present</code>, <code>landmark-one-main</code>,{" "}
				<code>page-has-heading-one</code> — and correctly report <code>notApplicable</code> for
				these once <code>contextSelector</code> has scoped a run narrower than the whole document
				(<code>document.documentElement</code> no longer among the resolved roots), since a
				scoped subtree was never expected to carry its own{" "}
				<code>&lt;title&gt;</code>/<code>&lt;html lang&gt;</code>/etc. Set{" "}
				<code>fragment: true</code> for the case that scoping alone can't detect: a scan target
				that's the <em>whole</em> given document but was never meant to represent a real page at
				all (e.g. a raw component snippet parsed on its own) — this forces the same{" "}
				<code>notApplicable</code> gating even when unscoped.
			</>
		),
	},
	{
		id: "excludeSelectors",
		option: <code>excludeSelectors</code>,
		meaning: (
			<>
				Elements matching any of these selectors (and their descendants) are skipped entirely,
				for <strong>every</strong> rule — useful for cookie banners, third-party embeds, or
				known-noisy widgets you don't control. To exclude something from just one specific rule
				instead, use <code>rules[ruleId].excludeSelectors</code> below.
			</>
		),
	},
	{
		id: "timestamp",
		option: <code>timestamp</code>,
		meaning: (
			<>
				Passed straight through to the result's top-level <code>timestamp</code> field; the
				engine does not generate one itself (deterministic-by-design).
			</>
		),
	},
	{
		id: "contrast-mode",
		option: <code>contrast.mode</code>,
		meaning: (
			<>
				<code>strictConformance</code> (default): contrast rules stay silent (
				<code>notApplicable</code>/skip) whenever the true rendered background isn't confidently
				computable, to protect against false <code>fail</code>s. <code>auditorAssist</code>:
				trades some of that safety margin for more findings, intended for a human auditor who
				will double-check flagged cases, not for unattended CI gating.
			</>
		),
	},
	{
		id: "contrast-fallback",
		option: <code>contrast.rootCanvasFallback</code>,
		meaning: (
			<>
				The assumed page background color when it's not computable at all — only matters in{" "}
				<code>auditorAssist</code> mode.
			</>
		),
	},
	{
		id: "visibilityMode",
		option: <code>visibilityMode</code>,
		meaning: (
			<>
				Controls how strict the three contrast rules (<code>contrast-minimum</code>,{" "}
				<code>contrast-enhanced</code>, <code>contrast-computable</code>) are about deciding a
				text node is actually eligible to check. <strong>Not read by any other rule.</strong>{" "}
				<code>'styleOnly'</code> (default): eligibility is CSS-only — <code>display</code>,{" "}
				<code>visibility</code>, <code>opacity</code>, ancestor-hiding, etc.{" "}
				<code>'styleAndGeometry'</code>: adds real layout checks (
				<code>getClientRects()</code>/<code>getBoundingClientRect()</code>) on top of that — text
				with no client rects, or zero width/height, is excluded too. Reach for{" "}
				<code>'styleAndGeometry'</code> when running under a real browser/Playwright-Puppeteer (
				<code>runa11yCoreInPage</code>) and you want contrast findings to reflect actual rendered
				layout rather than just computed style; under plain jsdom (<code>runDomRulesInPage</code>
				) there's no real layout engine, so <code>'styleAndGeometry'</code> mostly just adds{" "}
				<code>getBoundingClientRect()</code> zero-size checks, not true clipping/overflow
				detection — see <a href="/troubleshooting/known-limitations/">known limitations</a>.
			</>
		),
	},
	{
		id: "policyContract",
		option: <code>policyContract</code> ,
		meaning: (
			<>
				See <a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a> — controls which
				outcomes/confidence values are allowed and whether manual rules' would-be <code>fail</code>
				s get coerced to <code>cantTell</code>.
			</>
		),
	},
	{
		id: "output",
		option: (
			<>
				<code>output.includeSelector</code> / <code>.includeHtml</code>
			</>
		),
		meaning: (
			<>
				Suppresses the engine's automatic <code>selector</code>/<code>html</code> fill-in. Since
				every rule was migrated to report its element rather than build occurrences by hand
				(1.5.0), that fill-in is the path almost all of them take: setting{" "}
				<code>includeSelector: false</code> strips selectors from 117 of the 130 rules, and{" "}
				<code>includeHtml: false</code> strips HTML snippets from 122. The remainder still
				assemble those fields themselves inside <code>runInPage</code> and are unaffected — among
				them <code>contrast-minimum</code>/<code>contrast-enhanced</code> (whose findings are text
				runs, not elements), <code>page-title-present</code> and{" "}
				<code>identical-links-same-purpose</code>. So this narrows output substantially but is
				still not a guarantee of <em>no</em> selectors or HTML anywhere in the result.
			</>
		),
	},
	{
		id: "rules-ruleId",
		option: <code>rules[ruleId]</code>,
		meaning: (
			<>
				Passed through to that rule as <code>ctx.config</code>, and — for{" "}
				<code>excludeSelectors</code> specifically — read by the engine itself before the rule
				ever runs. See{" "}
				<a href="#rule-scoped-excludeselectors">"Rule-scoped excludeSelectors"</a> below. Any
				other key is passthrough only: <strong>no shipped rule currently reads{" "}
				<code>ctx.config</code></strong> for anything besides <code>excludeSelectors</code>.
			</>
		),
	},
	{
		id: "probes",
		option: <code>probes</code>,
		meaning: (
			<>
				An optional, JSON-safe evidence object your host application can supply (depth- and
				size-capped by the engine before rules see it, via <code>ctx.inputs.probes</code>) — for
				future rules that might accept externally-supplied signals (e.g. real layout measurements
				a static DOM scan can't compute itself). Not consumed by any current rule.
			</>
		),
	},
	{
		id: "perfStats",
		option: (
			<>
				<code>perfStats</code> / <code>profileRules</code>
			</>
		),
		meaning: (
			<>
				Debug-only. <code>perfStats: true</code> returns internal counters on the result's{" "}
				<code>perfStats</code> field; <code>profileRules: true</code> <strong>additionally</strong>{" "}
				adds a per-rule timing breakdown there. <code>profileRules</code> on its own does nothing
				— <code>perfStats</code> is what creates the object the breakdown lives in. Shape is not
				part of the stable output contract — don't build on it. Note also that{" "}
				<code>profileRules</code> is the one option that makes output non-deterministic: counters
				are stable across identical runs, wall-clock timings are not. Leave it off if you diff
				results between runs.
			</>
		),
	},
	{
		id: "frameWaitTime",
		option: (
			<>
				<code>pingWaitTime</code> / <code>frameWaitTime</code>
			</>
		),
		meaning: (
			<>
				Only read by <code>runa11yCoreAcrossFrames</code> (see{" "}
				<a href={`${core}/docs/INTEGRATION.md#cross-frame-scanning-including-cross-origin`}>
					<code>INTEGRATION.md</code>
				</a>
				) — how long to wait for a child frame to answer a ping (default <code>500</code>ms) and
				a full run request (default <code>60000</code>ms) before treating it as unreachable.
				Ignored by <code>runDomRulesInPage</code>/<code>runa11yCoreInPage</code>.
			</>
		),
	},
];

export function EngineOptionsContent() {
	return (
		<>
			<p>
				Every runner (<code>runDomRulesInPage</code>, <code>runa11yCoreInPage</code>) takes the
				same four arguments: <code>(pageUrl, contextSelector, engineOptions, runOnly)</code>.
				This page documents <code>engineOptions</code> and <code>runOnly</code> in full.
			</p>

			<h2>Selecting which rules run</h2>
			<p>
				There are <strong>two independent ways</strong> to select rules — the 4th argument (
				<code>runOnly</code>), or <code>engineOptions.rules</code>/<code>.tags</code>/
				<code>.tests</code>/<code>.includeMode</code>. If <code>runOnly</code> contains any
				filter, it wins outright; otherwise the engine falls back to <code>engineOptions</code>.
				Don't mix them expecting both to apply — pick one.
			</p>

			<h3>Via <code>runOnly</code> (4th argument)</h3>
			<CodeBlock
				lines={[
					"runDomRulesInPage(url, null, {}, {",
					"  includeRuleIds: ['img-alt-present', 'button-name-present'],",
					"  excludeRuleIds: ['region'],",
					"  tags: ['wcag412'],",
					"  excludeTags: ['best-practice'],",
					"  includeMode: 'and'   // 'and' (default) | 'or' — see below",
					"});",
				]}
			/>
			<p>
				<strong><code>runOnly</code> must be this object shape, not a bare array.</strong>{" "}
				<code>runOnly: ['img-alt-present']</code> (a plain array) is{" "}
				<strong>silently ignored</strong>; the engine runs every rule instead. This is the single
				most common integration mistake — see <a href="/troubleshooting/faq/">the FAQ</a>.
			</p>
			<DataTable
				rowKey="field"
				columns={[
					{ key: "field", label: "Field", width: "22%" },
					{ key: "type", label: "Type", width: "16%" },
					{ key: "meaning", label: "Meaning", wrap: true },
				]}
				rows={[
					{ field: <code>includeRuleIds</code>, type: <code>string[]</code>, meaning: "Only run these rule IDs (plus, for a composite ID, its child atomic rules)." },
					{ field: <code>excludeRuleIds</code>, type: <code>string[]</code>, meaning: "Never run these, applied after include." },
					{
						field: (
							<>
								<code>includeTestIds</code> / <code>excludeTestIds</code>
							</>
						),
						type: <code>string[]</code>,
						meaning: 'Same matching as above — kept as a separate field because rules are internally called "tests" (the atomic executable unit); functionally identical to includeRuleIds/excludeRuleIds today.',
					},
					{ field: <code>tags</code>, type: <code>string[]</code>, meaning: "Only run rules carrying at least one of these tags (e.g. wcag412, wcag2aa, best-practice)." },
					{ field: <code>excludeTags</code>, type: <code>string[]</code>, meaning: "Never run rules carrying any of these tags, applied after include." },
					{
						field: <code>includeMode</code>,
						type: (
							<>
								<code>'and'</code> | <code>'or'</code>
							</>
						),
						meaning: "When both an ID include and a tag include are given: 'and' (default) requires a rule to satisfy both; 'or' runs a rule if it satisfies either. Irrelevant if you only use one dimension.",
					},
				]}
			/>
			<p>
				Each of these accepts either an array or a comma-separated string, matching the{" "}
				<code>engineOptions</code> form below — <code>includeRuleIds: 'img-alt-present, button-name-present'</code>{" "}
				and <code>includeRuleIds: ['img-alt-present', 'button-name-present']</code> are
				equivalent.
			</p>
			<p>
				Rule IDs are bare (no engine prefix), e.g. <code>'img-alt-present'</code>. For backward
				compatibility, matching also accepts a legacy <code>a11ycore-</code>-prefixed form of the
				same id (<code>'a11ycore-img-alt-present'</code>).
			</p>
			<p>
				A <strong>legacy tag-filter shape</strong> is also accepted as the whole{" "}
				<code>runOnly</code> value: <code>{"{ type: 'tag', values: ['wcag2a', 'wcag2aa'] }"}</code>{" "}
				— equivalent to <code>{"{ tags: ['wcag2a', 'wcag2aa'] }"}</code>.
			</p>

			<h3 id="filtering-by-wcag-version">Filtering by WCAG version (2.0, 2.1, 2.2)</h3>
			<p>
				Every rule and composite carries exactly one WCAG-version-origin level tag:{" "}
				<code>wcag2a</code>/<code>wcag2aa</code>/<code>wcag2aaa</code> for a Success Criterion
				that's WCAG 2.0 baseline, <code>wcag21a</code>/<code>wcag21aa</code>/<code>wcag21aaa</code>{" "}
				for one newly introduced in WCAG 2.1 (e.g. <code>1.3.5</code> Identify Input Purpose),{" "}
				<code>wcag22a</code>/<code>wcag22aa</code>/<code>wcag22aaa</code> for one newly
				introduced in WCAG 2.2 (e.g. <code>2.5.8</code> Target Size Minimum). A rule gets{" "}
				<strong>only</strong> the tag for its SC's actual origin version — a 2.1-introduced SC is
				never also tagged <code>wcag2aa</code>, since it doesn't exist under a WCAG 2.0
				conformance target.
			</p>
			<p>
				Since versions are cumulative (2.1 = 2.0 + new; 2.2 = 2.0 + 2.1 + new), select a
				WCAG-version conformance target by combining tag sets — the engine's OR-matching on{" "}
				<code>tags</code> (any one match includes the rule) does the rest:
			</p>
			<CodeBlock
				lines={[
					"// WCAG 2.0 AA only (excludes every 2.1/2.2-introduced SC, even at level AA):",
					"{ tags: ['wcag2a', 'wcag2aa'] }",
					"",
					"// WCAG 2.1 AA conformance (2.0 baseline + everything 2.1 added, both at A and AA):",
					"{ tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }",
					"",
					"// WCAG 2.2 AA conformance (2.0 baseline + 2.1 additions + 2.2 additions):",
					"{ tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'] }",
					"",
					"// Just the SCs 2.2 introduced, nothing else:",
					"{ tags: ['wcag22a', 'wcag22aa', 'wcag22aaa'] }",
				]}
			/>
			<p>
				<strong>One SC goes the other way.</strong> WCAG 2.2 removed SC 4.1.1 Parsing — the only
				criterion ever dropped rather than added. A rule mapped to it carries its 2.0-origin tag (
				<code>wcag2a</code>) like any other baseline rule, plus <code>wcag22-removed</code>, and
				the version tag sets above therefore include it under a 2.2 target, where it does not
				belong.
			</p>
			<p>
				You do not have to do anything about that. The engine resolves a{" "}
				<strong>target WCAG version</strong> for every run and, when that target is 2.2, a{" "}
				<code>wcag22-removed</code> rule cannot report <code>fail</code>: it still runs, still
				reports every occurrence it found, but its outcome is coerced to <code>cantTell</code> and
				the result carries a <code>wcagVersionScope</code> field saying why (see{" "}
				<a href="/results-reports/output-schema/">the output schema</a>). Nothing is silently dropped, and a 2.2
				run is not gated by a criterion 2.2 does not contain.
			</p>
			<p>The target version is resolved in this order:</p>
			<ol>
				<li>
					<code>engineOptions.wcagVersion</code> — <code>'2.0'</code>, <code>'2.1'</code> or{" "}
					<code>'2.2'</code>, if you set it.
				</li>
				<li>
					The version-origin tags in your own filter: a set topping out at{" "}
					<code>wcag21a</code>/<code>wcag21aa</code> reads as a 2.1 target, one containing any{" "}
					<code>wcag22*</code> tag as 2.2, one with only <code>wcag2*</code> tags as 2.0. Only
					those nine tags count — an SC tag (<code>wcag411</code>) or <code>best-practice</code>{" "}
					says nothing about a version.
				</li>
				<li>
					Otherwise <code>'2.2'</code>, this engine's default target.
				</li>
			</ol>
			<CodeBlock
				lines={[
					"// Nothing to declare: a plain run already targets 2.2, so a duplicate id",
					"// comes back cantTell rather than fail.",
					"runDomRulesInPage(url, null, {}, null);",
					"",
					"// Conformance-testing against 2.1, where SC 4.1.1 still exists:",
					"runDomRulesInPage(url, null, { wcagVersion: '2.1' }, null);",
					"",
					"// Same thing, implied by the tag set — no extra option needed:",
					"runDomRulesInPage(url, null, {}, { tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] });",
				]}
			/>
			<p>
				The resolved target is reported back on every result as <code>engine.wcagVersion</code>,
				so you can confirm which one a run actually used.
			</p>
			<p>
				If you would rather not see the rule at all under 2.2, exclude it outright — the tag is
				still there for exactly that:
			</p>
			<CodeBlock
				lines={[
					"// WCAG 2.2 AA conformance, with the removed criterion left out entirely:",
					"{",
					"  tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'],",
					"  excludeTags: ['wcag22-removed']",
					"}",
				]}
			/>
			<p>
				<code>duplicate-id</code> is the only rule carrying that tag today. Left in, it still
				reports something real — a duplicate id breaks <code>&lt;label for&gt;</code>, fragment
				links and <code>getElementById</code> whatever the standard says — it just is not a 2.2
				conformance failure.
			</p>

			<h3>Via <code>engineOptions</code> (no <code>runOnly</code>)</h3>
			<p>Same filtering, expressed as comma-separated strings (or arrays) nested in <code>engineOptions</code>:</p>
			<CodeBlock
				lines={[
					"runDomRulesInPage(url, null, {",
					"  rules: { include: 'img-alt-present, button-name-present', exclude: 'region' },",
					"  tags: { include: 'wcag412', exclude: 'best-practice' },",
					"  includeMode: 'and'",
					"}, null);",
				]}
			/>
			<p>
				<code>rules.include</code>/<code>.exclude</code>, <code>tags.include</code>/
				<code>.exclude</code>, <code>tests.include</code>/<code>.exclude</code> (alias of{" "}
				<code>rules</code>), and top-level <code>includeMode</code> mirror the <code>runOnly</code>{" "}
				fields above exactly. Comma-separated strings are trimmed, de-duplicated, and empty
				tokens dropped automatically.
			</p>

			<h2><code>engineOptions</code> — the rest</h2>
			<CodeBlock
				lines={[
					"const engineOptions = {",
					"  locale: 'en',                    // default 'en'; de-DE falls back to de, then to en per string",
					"  wcagVersion: '2.2',              // default '2.2' — the conformance target",
					"  messages: { de: { /* key: text */ } },  // optional caller-supplied dictionaries; win over built-in ones",
					"  includeHiddenElements: false,    // default false — set true to evaluate hidden/collapsed subtrees too",
					"  includeShadowDom: true,          // default true — opt OUT with false to skip open shadow roots",
					"  fragment: false,                 // default false — set true when the scan target isn't a real page",
					"  excludeSelectors: ['#cookie-banner', '.third-party-widget'],  // array or comma-separated string",
					"  timestamp: '2026-07-20T12:00:00Z',  // optional — engine has no built-in clock",
					"  perfStats: false,                // default false — internal timing counters, debug-only shape",
					"  profileRules: false,             // default false — per-rule timings; needs perfStats",
					"",
					"  contrast: {",
					"    mode: 'strictConformance',     // 'strictConformance' (default) | 'auditorAssist'",
					"    rootCanvasFallback: '#ffffff'  // background assumed when the true root background isn't computable",
					"  },",
					"  visibilityMode: 'styleOnly',     // 'styleOnly' (default) | 'styleAndGeometry' — scoped to the contrast rules only",
					"",
					"  policyContract: 'a11y',          // 'a11y' (default) | 'generic' | inline contract object",
					"  policy: {                        // optional overrides on top of policyContract",
					"    coerceManualFailToCantTell: true",
					"  },",
					"",
					"  output: {",
					"    includeSelector: true,         // set false to suppress auto-filled selectors",
					"    includeHtml: true",
					"  },",
					"",
					"  rules: {",
					"    'some-rule-id': {",
					"      excludeSelectors: ['.some-noisy-widget']  // narrows candidates for THIS rule only",
					"    }",
					"  },",
					"",
					"  probes: { /* optional host-supplied evidence */ },",
					"",
					"  customRules: [ /* runtime-registered rules, see below */ ],",
					"",
					"  // Only read by runa11yCoreAcrossFrames. Ignored by runDomRulesInPage/runa11yCoreInPage.",
					"  pingWaitTime: 500,               // ms to wait for a child frame to answer a ping",
					"  frameWaitTime: 60000             // ms to wait for a child frame's full scan result",
					"};",
				]}
			/>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "option", label: "Option", width: "22%" },
					{ key: "meaning", label: "Meaning", wrap: true },
				]}
				rows={optionRows}
			/>

			<h3 id="rule-scoped-excludeselectors">Rule-scoped <code>excludeSelectors</code></h3>
			<p>
				The top-level <code>excludeSelectors</code> applies to <em>every</em> rule — there's no
				way to exclude an element from just one rule while still running every other rule against
				it. <code>rules[ruleId].excludeSelectors</code> fills that gap: it narrows candidates for{" "}
				<strong>that one rule only</strong>, on top of (never instead of) the global list.
			</p>
			<CodeBlock
				lines={[
					"const engineOptions = {",
					"  excludeSelectors: ['#cookie-banner'],   // applies to every rule, as always",
					"  rules: {",
					"    'aria-required-children': {",
					"      excludeSelectors: ['mat-select', 'mat-stepper', 'mat-horizontal-stepper', 'mat-vertical-stepper']",
					"    },",
					"    'aria-allowed-attr': {",
					"      excludeSelectors: ['mat-progress-spinner']",
					"    }",
					"  }",
					"};",
				]}
			/>
			<p>
				Why you'd want this: Angular Material's <code>&lt;mat-select&gt;</code> builds its
				internal ARIA structure in a way that trips a false positive on{" "}
				<code>aria-required-children</code> specifically, even though the component is otherwise
				fine. With only the global <code>excludeSelectors</code>, the only way to silence that
				false positive is <code>excludeSelectors: ['mat-select']</code> — which also hides{" "}
				<code>mat-select</code> from <em>every other rule</em>, including{" "}
				<code>contrast-minimum</code> and <code>aria-allowed-attr</code>, silently dropping real
				coverage those checks never had a problem with. The example above keeps{" "}
				<code>mat-select</code> fully visible to every rule except the one that misfires on it.
			</p>
			<p>
				Effective exclusions for a given rule are the <strong>union</strong> of the global list
				and that rule's own list — an element matching either is dropped from that rule's
				candidates. A rule whose only would-be-failing elements are all excluded this way reports{" "}
				<code>outcome: 'pass'</code> or <code>'notApplicable'</code> (matching that rule's own
				no-candidates convention), with <code>occurrences: []</code> — never{" "}
				<code>outcome: 'fail'</code> with an empty <code>occurrences</code> array, since that
				exact shape is reserved elsewhere in the schema to mean "this rule threw" (see{" "}
				<a href="/results-reports/output-schema/">the output schema</a>).
			</p>
			<p>
				Accepts the same forms as the global option: an array (
				<code>['mat-select', 'mat-stepper']</code>) or a comma-separated string (
				<code>'mat-select, mat-stepper'</code>).
			</p>
			<p>
				If you're using a binding package (<code>@surea11y/binding-base</code> and its
				Playwright/Puppeteer wrappers), check that binding's own README for whether its{" "}
				<code>.exclude()</code> builder method has a rule-scoped form yet — this is an{" "}
				<code>engineOptions</code> shape documented here at the engine level; not every binding
				has picked it up.
			</p>

			<h2>Recipes — composing options for real scenarios</h2>
			<p>
				<strong>CI gate: WCAG 2.2 AA only, ignore a third-party widget you don't control</strong>
			</p>
			<CodeBlock
				lines={[
					"runDomRulesInPage(url, null, {",
					"  excludeSelectors: ['#cookie-banner', '.intercom-launcher'],",
					"  tags: { include: 'wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22a,wcag22aa' }",
					"}, null);",
				]}
			/>
			<p>
				<strong>Human auditor doing a deep contrast pass in a real browser</strong> — trade some
				false-positive protection for more findings, and check real layout (not just computed
				style) since a real page is being driven. Shown with Puppeteer's{" "}
				<code>page.evaluate</code> (accepts multiple args); if you're on Playwright, wrap the
				four positional args into a single object first — see{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>:
			</p>
			<CodeBlock
				lines={[
					"const result = await page.evaluate(runa11yCoreInPage, url, null, {",
					"  contrast: { mode: 'auditorAssist' },",
					"  visibilityMode: 'styleAndGeometry'",
					"}, null);",
				]}
			/>
			<p>
				<strong>Scoped re-scan of one region after a UI change, skipping shadow DOM</strong> —
				useful in a component-level test where you only care about the widget you just changed:
			</p>
			<CodeBlock
				lines={[
					"runDomRulesInPage(url, '#checkout-form', {",
					"  includeShadowDom: false",
					"}, { includeRuleIds: ['form-control-programmatic-label-present', 'button-name-present'] });",
				]}
			/>
			<p>
				<strong>Reproducible output for snapshot testing</strong> — pin a <code>timestamp</code>{" "}
				so two runs of the same HTML produce byte-identical JSON, and request the debug timing
				breakdown:
			</p>
			<CodeBlock
				lines={[
					"runDomRulesInPage(url, null, {",
					"  timestamp: '2026-01-01T00:00:00Z',",
					"  perfStats: true,",
					"  profileRules: true",
					"}, null);",
				]}
			/>
			<p>
				<strong>A custom, org-specific rule alongside the built-ins</strong>, only for this one
				call:
			</p>
			<CodeBlock
				lines={[
					"runDomRulesInPage(url, null, {",
					"  customRules: [{",
					"    id: 'org-no-inline-onclick',",
					"    meta: { title: 'No inline onclick handlers', defaultSeverity: 'moderate' },",
					"    runInPage(ctx) {",
					"      const els = ctx.helpers.queryAll('[onclick]');",
					"      const occurrences = els.map((el) => ({",
					"        selector: ctx.helpers.buildSelector(el),",
					"        html: el.outerHTML,",
					"        summary: 'Inline onclick handler found.',",
					"        hint: 'Move event handling into an external script.'",
					"      }));",
					"      return { ruleId: ctx.rule.ruleId, outcome: occurrences.length ? 'fail' : 'pass', severity: 'moderate', occurrences };",
					"    }",
					"  }]",
					"}, null);",
				]}
			/>

			<h2><code>customRules</code> — runtime-registered rules</h2>
			<p>
				Every shipped rule is baked into <code>src/core.js</code> at build time.{" "}
				<code>engineOptions.customRules</code> is the runtime escape hatch: an array of rule
				descriptors registered for that one call only — nothing is added to the static catalog,
				and nothing persists between calls. This is deliberate, not a limitation to work around:
				surea11y already takes fresh <code>engineOptions</code> per call with no mutable global
				config (unlike some other engines, which need a <code>configure()</code>/<code>reset()</code>{" "}
				step against a shared runtime), and custom rules follow that same per-call model.
			</p>
			<p>
				Calling the library directly is one way in; the CLI also exposes this via{" "}
				<code>--custom-rules &lt;path&gt;</code> (a local file, loaded once per scan) — see{" "}
				<a href="https://github.com/SureA11y/cli/blob/main/docs/CLI.md#custom-rules">
					the CLI docs
				</a>
				.
			</p>
			<p>
				A descriptor has the <em>same shape as an internal rule module's own export</em> — if you
				already know how to write a rule file for this engine, you already know this API:
			</p>
			<CodeBlock
				lines={[
					"{",
					"  id: 'my-org-custom-rule',          // required",
					"  meta: { title, description, tags, defaultSeverity, defaultConfidence, /* same fields as a rule module's meta */ },",
					"  runInPage(ctx) { /* same ctx shape and same return contract as any built-in rule */ },",
					"  applicability(ctx) { return true; }, // optional, same contract as a built-in rule's applicability",
					"  data: { /* optional, JSON-serializable */ }",
					"}",
				]}
			/>
			<ul>
				<li>
					<code>runInPage</code>/<code>applicability</code> may be a <strong>real function</strong>{" "}
					or a <strong>function-source string</strong> (i.e. <code>fn.toString()</code>). Pass a
					real function when <code>engineOptions</code> never leaves the current JS realm (plain
					Node/jsdom use). Pass a string when it does — e.g. a Playwright{" "}
					<code>page.evaluate(runa11yCoreInPage, {"{ engineOptions }"})</code> call, where{" "}
					<code>engineOptions</code> crosses a JSON/structured-clone boundary that cannot carry a
					live <code>Function</code> reference but can carry a string. The engine reconstructs a
					string via <code>new Function</code>, the same mechanism the build uses to embed every
					built-in rule's source into the in-page runner.
				</li>
				<li>
					<code>meta</code> gets identical defaulting/validation to a build-time rule — omit
					anything you don't need; <code>severity</code> defaults to <code>moderate</code>,{" "}
					<code>confidence</code> to <code>medium</code>, <code>type</code> to{" "}
					<code>automatic</code>, etc.
				</li>
				<li>
					A custom rule whose <code>id</code> collides with a built-in one{" "}
					<strong>overrides it for that scan</strong>, rather than running both. Since a
					same-named custom rule is just as likely to be an accidental collision as a deliberate
					override, every collision is surfaced two ways: a <code>console.warn</code> naming the
					id(s), and a top-level <code>overriddenBuiltinIds</code> array on the result (empty
					when there's no collision) — see <a href="/results-reports/output-schema/">the output schema</a>.
				</li>
				<li>
					An invalid descriptor (missing/non-string <code>id</code>, or a <code>runInPage</code>{" "}
					that isn't a function and isn't a reconstructable source string) is silently skipped —
					the rest of the scan, including every built-in rule, still runs normally. This isn't a
					validation gap to fix: a custom rule is arbitrary caller-supplied code, so "fail this
					one entry closed, don't abort the scan" is the safer default, mirroring how a{" "}
					<em>built-in</em> rule that throws is contained to a <code>cantTell</code> for that rule
					rather than crashing the run.
				</li>
				<li>
					Results appear in <code>checksResults</code> exactly like any other rule's, including
					automatic <code>selector</code>/<code>html</code>/<code>structuralPath</code> fill-in
					for <code>fail</code>/<code>cantTell</code> occurrences that only attach{" "}
					<code>{"{ __node }"}</code> (see <a href="/results-reports/output-schema/">the output schema</a>).
				</li>
			</ul>

			<h2><code>contextSelector</code> (2nd runner argument, not an <code>engineOptions</code> field)</h2>
			<p>
				A CSS selector (or array of selectors) scoping the scan to one or more subtrees, resolved
				via <code>document.querySelectorAll</code> (all matches, not just the first), falling
				back to <code>document.documentElement</code>/<code>document.body</code> if nothing
				matches. Pass <code>null</code> to scan the whole document.
			</p>
			<ul>
				<li>
					<strong>A single string</strong> may itself be a comma-separated selector list
					(ordinary CSS union semantics) — <code>'#a, #b'</code> scans both <code>#a</code> and{" "}
					<code>#b</code>.
				</li>
				<li>
					<strong>An array of strings</strong> scans the union of every selector's matches —{" "}
					<code>['#a', '.card']</code> behaves the same as <code>'#a, .card'</code>; the array
					form exists for callers building the list programmatically.
				</li>
				<li>
					Overlapping/nested regions are deduped automatically — an element reachable from more
					than one matched root is only ever reported once, not once per region.
				</li>
			</ul>
		</>
	);
}
