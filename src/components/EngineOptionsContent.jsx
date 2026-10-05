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
				and to <code>'2.2'</code> when they imply nothing.{" "}
				<strong>The only thing it currently changes is SC 4.1.1 Parsing, removed in 2.2</strong>:
				under a 2.2 target a rule tagged{" "}
				<code>wcag22-removed</code> still runs and still reports its occurrences, but cannot{" "}
				<code>fail</code> — see{" "}
				<a href="#filtering-by-wcag-version">"Filtering by WCAG version"</a> above. Any other
				value is ignored and the default applies.
			</>
		),
	},
	{
		id: "profile",
		option: <code>profile</code>,
		meaning: (
			<>
				Optional named conformance target: <code>'wcag22-aa'</code>, <code>'en301549-v4.1.1'</code>,{" "}
				<code>'en301549-v3.2.1'</code> or <code>'section508'</code>. Selects rules by the matching
				tag set when nothing else includes any, and the WCAG target follows from those tags.
				Reported back as <code>engine.profile</code> when it took effect; otherwise ignored with a
				console warning. See <a href="#conformance-profiles">"Conformance profiles"</a> above.
			</>
		),
	},
	{
		id: "mappings",
		option: <code>mappings</code>,
		meaning: (
			<>
				Optional standards besides WCAG whose requirements <code>meta.normativeMappings</code>{" "}
				names: <code>'en301549'</code>, <code>'en301549:V3.2.1'</code> or{" "}
				<code>'en301549:V4.1.1'</code>, as an array or comma-separated string. Default none, so
				results name WCAG only; an EN 301 549 profile adds its own version. Reported back as{" "}
				<code>engine.mappings</code> when any applies. See{" "}
				<a href="#other-standards-mappings">"Other standards"</a> above.
			</>
		),
	},
	{
		id: "optInRules",
		option: <code>optInRules</code>,
		meaning: (
			<>
				Optional: <code>'all'</code>, or a list of opt-in rule tags, as an array or comma-separated
				string. Unlocks those rules outside their standard's profile; the rest of the selection
				still decides what runs. Reported back as <code>engine.optInRules</code> when it ran a rule
				the selection would not have run otherwise; unknown tags are ignored with a console
				warning. See <a href="#running-every-rule-optinrules">"Running every rule"</a> above.
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
				files. It is not echoed back on each result's <code>engineOptions</code>, unlike the
				other options; <code>engine.locale</code> reports the dictionary used. See{" "}
				<a href="/configuration/locales/">Locales</a>.
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
				evaluation (legacy/static-markup behavior). It widens what the shared queries return;
				most rules then judge only what is in the accessibility tree, since a hidden element has
				no name or role to check, so for them it changes nothing. It matters for rules about
				markup itself, such as a broken ID reference.
			</>
		),
	},
	{
		id: "includeShadowDom",
		option: <code>includeShadowDom</code>,
		meaning: (
			<>
				Default <code>true</code>: rules using <code>helpers.queryAllSmart</code> traverse into
				open shadow roots. Set <code>false</code> to scan only the light DOM.{" "}
				<strong>Closed shadow roots are never reachable either way</strong> — no DOM API exposes
				them.
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
				with no client rects, or zero width/height, is excluded too, and so is text entirely
				above or left of the page, where no scrolling reaches (the <code>left: -9999px</code>{" "}
				technique), and text an ancestor with <code>overflow: hidden</code> or{" "}
				<code>clip</code> cuts off completely (<code>height: 0; overflow: hidden</code>, a
				carousel slide out of view). A box that scrolls (<code>auto</code>,{" "}
				<code>scroll</code>) does not exclude its text, since a reader can reach it. In both
				modes, text with a font size of 0 or a fully transparent color is excluded, since nothing
				is drawn; transparent text that lets a background show through its glyphs (
				<code>background-clip: text</code>) is not, and is asked about instead. Reach for{" "}
				<code>'styleAndGeometry'</code> when running under a real browser/Playwright-Puppeteer (
				<code>runa11yCoreInPage</code>) and you want contrast findings to reflect actual rendered
				layout rather than just computed style; under plain jsdom (<code>runDomRulesInPage</code>
				) there's no real layout engine, so <code>'styleAndGeometry'</code> mostly just adds{" "}
				<code>getBoundingClientRect()</code> zero-size checks, not true clipping/overflow
				detection — see <a href="/help/known-limitations/">known limitations</a>.
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
				(1.5.0), that fill-in is the path almost all rules take: setting{" "}
				<code>includeSelector: false</code> / <code>includeHtml: false</code> strips selectors and
				HTML snippets from nearly every rule. A handful still assemble those fields
				themselves inside <code>runInPage</code> and are unaffected — among them{" "}
				<code>contrast-minimum</code>/<code>contrast-enhanced</code> (whose findings are text
				runs, not elements), <code>page-title-present</code> and{" "}
				<code>identical-links-same-purpose</code>.{" "}
				<strong>So this narrows output substantially but is still not a guarantee of <em>no</em>{" "}
				selectors or HTML anywhere in the result.</strong>
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
				other key is passthrough only: <strong>no shipped rule takes anything else from it.</strong>{" "}
				A rule's declared settings, such as <code>contrast-minimum</code>'s thresholds, are its
				standard's, so a caller's value for one is dropped: a result naming WCAG 1.4.3 is always
				decided at 4.5:1.
			</>
		),
	},
	{
		id: "probes",
		option: <code>probes</code>,
		meaning: (
			<>
				An optional, JSON-safe evidence object your host application supplies, for what a scan of
				one page cannot see, such as the site's other pages. The engine caps it before rules read
				it (<code>ctx.inputs.probes</code>): six levels deep, 200 items per array, 50 keys per
				object, 2,000 characters per string. <code>crawl.pageTitles</code> (
				<code>{"{ pages: [{ url, title }] }"}</code>) is read by <code>page-title-patterns</code>,
				to look for generic and templated titles across a site.
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
				— <code>perfStats</code> is what creates the object the breakdown lives in.{" "}
				<strong>Shape is not part of the stable output contract — don't build on it.</strong> Note
				also that{" "}
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
				filter, it wins outright; otherwise the engine falls back to <code>engineOptions</code>.{" "}
				<strong>Don't mix them expecting both to apply — pick one.</strong>
			</p>

			<h3>Via <code>runOnly</code> (4th argument)</h3>
			<CodeBlock
				lang="js"
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
				A bare array or string works as shorthand, the way axe-core takes it:{" "}
				<code>runOnly: ['img-alt-present', 'button-name-present']</code> runs those rules (a
				composite id brings in its rules), and <code>runOnly: ['wcag2a', 'wcag2aa']</code> is the
				same as <code>{"{ tags: ['wcag2a', 'wcag2aa'] }"}</code>. An array can't mix rule ids and
				tags, and every value has to name a rule (built-in, composite or one of{" "}
				<code>engineOptions.customRules</code>) or a tag: anything else throws, so a typo can't
				quietly run every rule or none. Use the object form to combine ids and tags or to
				exclude. Before 1.10.0 a bare array was ignored and every rule ran.
			</p>
			<DataTable
				label="runOnly fields"
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
				Names are checked, here and in <code>engineOptions.rules</code>/<code>.tags</code> below.
				An include list (<code>includeRuleIds</code>, <code>tags</code>, the legacy{" "}
				<code>values</code>, <code>rules.include</code>, <code>tags.include</code>) in which no
				value names a rule or a tag throws, with <code>code: 'INVALID_RUN_ONLY'</code> and a
				message naming the field and the values, since it would select nothing and a run of no
				rules reads as a clean pass. A value that names nothing beside ones that do, or in an
				exclude list, is ignored with a <code>console.warn</code>. Before 1.10.0 every such value
				was ignored silently. <code>includeTestIds</code>/<code>excludeTestIds</code> are not
				checked.
			</p>
			<p>
				Rule IDs are bare (no engine prefix), e.g. <code>'img-alt-present'</code>. For backward
				compatibility, matching also accepts a legacy <code>a11ycore-</code>-prefixed form of the
				same id (<code>'a11ycore-img-alt-present'</code>).
			</p>
			<p>
				axe-core's <strong><code>{"{ type, values }"}</code> shape</strong> is also accepted as
				the whole <code>runOnly</code> value:{" "}
				<code>{"{ type: 'tag', values: ['wcag2a', 'wcag2aa'] }"}</code> is{" "}
				<code>{"{ tags: ['wcag2a', 'wcag2aa'] }"}</code>, and{" "}
				<code>{"{ type: 'rule', values: ['img-alt-present'] }"}</code> is{" "}
				<code>{"{ includeRuleIds: ['img-alt-present'] }"}</code> (<code>'tags'</code> and{" "}
				<code>'rules'</code> work too). Any other <code>type</code> throws{" "}
				<code>INVALID_RUN_ONLY</code>, and so does a <code>runOnly</code> that is a number or a
				boolean, or an object none of whose keys the engine reads (
				<code>{"{ includeRuleId: [...] }"}</code>): each used to run every rule. An empty array,
				string or object still means every rule.
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
				lang="js"
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
				lang="js"
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
				lang="js"
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

			<h3 id="conformance-profiles">Conformance profiles</h3>
			<p>
				<code>engineOptions.profile</code> names a conformance target instead of spelling out its
				tag set:
			</p>
			<DataTable
				label="Conformance profiles"
				rowKey="profile"
				columns={[
					{ key: "profile", label: "Profile", width: "20%" },
					{ key: "tags", label: "Runs the rules tagged", wrap: true },
					{ key: "target", label: "WCAG target", width: "12%" },
					{ key: "why", label: "Why", wrap: true },
				]}
				rows={[
					{
						profile: <code>wcag22-aa</code>,
						tags: (
							<>
								<code>wcag2a</code>, <code>wcag2aa</code>, <code>wcag21a</code>, <code>wcag21aa</code>,{" "}
								<code>wcag22a</code>, <code>wcag22aa</code>
							</>
						),
						target: "2.2",
						why: "WCAG 2.2 Level A and AA",
					},
					{
						profile: <code>en301549-v4.1.1</code>,
						tags: (
							<>
								same as <code>wcag22-aa</code>
							</>
						),
						target: "2.2",
						why: "EN 301 549 V4.1.1 chapter 9 restates WCAG 2.2 A and AA",
					},
					{
						profile: <code>en301549-v3.2.1</code>,
						tags: (
							<>
								<code>wcag2a</code>, <code>wcag2aa</code>, <code>wcag21a</code>, <code>wcag21aa</code>
							</>
						),
						target: "2.1",
						why: "EN 301 549 V3.2.1 chapter 9 restates WCAG 2.1 A and AA, including 4.1.1 Parsing",
					},
					{
						profile: <code>section508</code>,
						tags: (
							<>
								<code>wcag2a</code>, <code>wcag2aa</code>
							</>
						),
						target: "2.0",
						why: "The Revised 508 Standards incorporate WCAG 2.0 A and AA",
					},
				]}
			/>
			<CodeBlock lang="js" lines={["runDomRulesInPage(url, null, { profile: 'en301549-v3.2.1' }, null);"]} />
			<p>
				The WCAG target follows from the tags the same way it does for a hand-written set (see{" "}
				<a href="#filtering-by-wcag-version">"Filtering by WCAG version"</a> above), so under{" "}
				<code>en301549-v3.2.1</code> a duplicate id can still <code>fail</code>, and under{" "}
				<code>en301549-v4.1.1</code> it cannot. Names are matched case-insensitively. A run that
				used a profile reports it back as <code>engine.profile</code>.
			</p>
			<p>
				Precedence: anything that <em>includes</em> rules selects them instead of the profile — a{" "}
				<code>runOnly</code> with <code>tags</code>, <code>includeRuleIds</code> or{" "}
				<code>includeTestIds</code>, or an <code>include</code> in{" "}
				<code>engineOptions.rules</code>/<code>.tags</code>/<code>.tests</code>. Excludes still
				apply on top of the profile, whether they come from <code>runOnly</code> (
				<code>excludeTags</code>, <code>excludeRuleIds</code>, <code>excludeTestIds</code>, so a
				binding's <code>disableTags()</code> narrows the profile rather than replacing it) or, when
				there is no <code>runOnly</code> filter, from <code>engineOptions</code> (
				<code>tags.exclude</code>, <code>rules.exclude</code>, <code>tests.exclude</code>), and an
				explicit <code>engineOptions.wcagVersion</code> still wins over the version the profile
				implies. A profile that does not take effect — an unknown name, or one overridden as above
				— is not an error: the run proceeds as if none was given, logs a{" "}
				<code>console.warn</code> saying why, and carries no <code>engine.profile</code>.
			</p>
			<p>
				<strong>A profile only chooses which rules run.</strong> It says nothing about whether
				passing them meets the standard it is named after: most Success Criteria need human
				judgement no automated rule covers (see{" "}
				<a href="/conformance/wcag-mapping/#what-this-engine-cannot-tell-you">
					what this engine cannot tell you
				</a>
				).
			</p>
			<p>
				An EN 301 549 profile also switches on the EN 301 549 clauses of the version it targets, as
				if <code>mappings: ['en301549:V4.1.1']</code> (or <code>V3.2.1</code>) had been passed; see{" "}
				<a href="#other-standards-mappings">"Other standards"</a> below. A standard with
				requirements of its own can also be added to the engine as a profile, bringing its own
				profile names, rules and rollups; how that works is in{" "}
				<a href={`${core}/docs/WCAG_CONFORMANCE.md#adding-another-standard`}>
					<code>WCAG_CONFORMANCE.md</code>
				</a>
				, the contributor guide for registering a standard. The engine ships no such standard
				today.
			</p>

			<h3 id="opt-in-rules">Opt-in rules</h3>
			<p>
				Some rules check a standard's own requirements, ones WCAG does not make: a national
				standard may require a doctype, or forbid presentational attributes such as{" "}
				<code>bgcolor</code>. A <code>fail</code> from such a rule is a failure of that standard,
				not of WCAG, so these rules are <strong>off by default</strong>. Each carries its
				standard's rule tag and runs only when the selection asks for it:
			</p>
			<ul>
				<li>through the standard's profile, which lists the tag,</li>
				<li>
					by that tag (<code>{"tags: { include: '<tag>' }"}</code>, alone or with others),
				</li>
				<li>
					by its id (<code>{"rules: { include: '<rule id>' }"}</code>, or{" "}
					<code>runOnly.includeRuleIds</code>),
				</li>
				<li>
					by the id of one of its standard's own rollups that groups it, or
				</li>
				<li>
					by unlocking it with <code>engineOptions.optInRules</code>, below.
				</li>
			</ul>
			<p>
				Nothing else selects one: not a default run, not a WCAG tag set, not a WCAG or EN 301 549
				profile, not a WCAG rollup id. Excludes apply to them as to any rule. Selecting the tag
				alone runs that standard's own rules, not the WCAG rules it is also mapped to, so it answers
				"what does the standard require beyond WCAG" and is not an audit against it. For an audit,
				use the standard's profile. None of the engine's built-in standards has opt-in rules today.
			</p>

			<h3 id="running-every-rule-optinrules">Running every rule (<code>optInRules</code>)</h3>
			<p>
				To run every rule the engine has, whatever standard it belongs to, leave out the profile
				and unlock the opt-in rules:
			</p>
			<CodeBlock lang="js" lines={["runDomRulesInPage(url, null, { optInRules: 'all' }, null);"]} />
			<p>
				<code>'all'</code> unlocks every standard's opt-in rules; a list of tags unlocks only those.
				It lifts the gate and nothing else: the rest of the selection still decides which rules
				run. So with no filter and no profile, as above, the run covers every rule and every
				standard's rollups; under <code>profile: 'wcag22-aa'</code> it still runs the WCAG rules
				only, since opt-in rules carry no WCAG tag. Excludes apply as usual. A tag that is not an
				opt-in tag is ignored with a <code>console.warn</code>.
			</p>
			<p>
				This is for seeing everything the engine can report, during development or when exploring
				a site. <strong>It is not a conformance target</strong>: such a run fails a page for things
				WCAG allows and only another standard forbids. The result says so:{" "}
				<code>engine.optInRules</code> lists the tags whose rules ran, and the HTML report, SARIF
				and JUnit show it next to the profile.
			</p>

			<h3 id="other-standards-mappings">Other standards (<code>mappings</code>)</h3>
			<p>
				Every result's <code>meta.normativeMappings</code> names the WCAG Success Criteria it tests.{" "}
				<code>engineOptions.mappings</code> adds the requirement of another standard that
				corresponds to each one. By default it adds none: a clause of a standard you do not audit
				against is noise in every SARIF tag, JUnit property and report.
			</p>
			<DataTable
				label="mappings values"
				rowKey="value"
				columns={[
					{ key: "value", label: "Value", width: "34%" },
					{ key: "adds", label: "Adds", wrap: true },
				]}
				rows={[
					{
						value: <code>'en301549'</code>,
						adds: "The EN 301 549 chapter 9 clause for each criterion, in every version that has it (V3.2.1 and V4.1.1)",
					},
					{
						value: (
							<>
								<code>'en301549:V3.2.1'</code>, <code>'en301549:V4.1.1'</code>
							</>
						),
						adds: "The same, for that version only",
					},
				]}
			/>
			<CodeBlock lang="js" lines={["runDomRulesInPage(url, null, { mappings: ['en301549:V3.2.1'] }, null);"]} />
			<p>
				It takes an array or a comma-separated string, names and versions matched
				case-insensitively. Under <code>profile: 'en301549-v4.1.1'</code> the V4.1.1 clauses are
				there without asking, and <code>mappings</code> can add more. A name or version the engine
				has no table for is ignored with a <code>console.warn</code>. A run that carries any other
				standard reports which in <code>engine.mappings</code>, canonically spelled (
				<code>["en301549:V3.2.1"]</code>, or <code>["en301549"]</code> for every version).
			</p>
			<p>
				It changes only what a result names, never which rules run or their outcomes. The rule
				catalog follows the same option: <code>getChecksCatalog(engineOptions)</code>,{" "}
				<code>getCheckDefById(ruleId, engineOptions)</code>,{" "}
				<code>getChecksForRunOnly(runOnly, engineOptions)</code>,{" "}
				<code>getRulesCatalog(engineOptions)</code> and{" "}
				<code>getCompositeRuleById(id, engineOptions)</code> name the standards a scan with those
				options would, so a catalog entry and a result always agree. A rule added through{" "}
				<code>customRules</code> keeps exactly the mappings it declares. What the clauses are and
				how the two versions differ is on{" "}
				<a href="/conformance/wcag-mapping/#en-301-549">WCAG mapping</a>.
			</p>

			<h3>Via <code>engineOptions</code> (no <code>runOnly</code>)</h3>
			<p>Same filtering, expressed as comma-separated strings (or arrays) nested in <code>engineOptions</code>:</p>
			<CodeBlock
				lang="js"
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
				lang="js"
				lines={[
					"const engineOptions = {",
					"  locale: 'en',                    // default 'en'; de-DE falls back to de, then to en per string",
					"  wcagVersion: '2.2',              // default '2.2' — the conformance target",
					"  profile: 'en301549-v4.1.1',      // optional — a named conformance target",
					"  mappings: ['en301549'],          // optional — standards besides WCAG to name on each result",
					"  optInRules: 'all',               // optional — also run rules other standards add beyond WCAG",
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
				label="Other engineOptions"
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
				lang="js"
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
				<code>outcome: 'fail'</code> with an empty <code>occurrences</code> array, since a
				built-in rule's <code>fail</code> always names what failed. (A rule that throws is a
				different case: it reports <code>cantTell</code> with <code>error</code> set, see{" "}
				<a href="/results-reports/output-schema/">the output schema</a>.)
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
				lang="js"
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
				lang="js"
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
				lang="js"
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
				lang="js"
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
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
					"  customRules: [{",
					"    id: 'org-no-inline-onclick',",
					"    meta: { title: 'No inline onclick handlers', defaultSeverity: 'moderate' },",
					"    runInPage(ctx) {",
					"      // queryAllSmart applies excludeSelectors, the scope's shadow roots and",
					"      // the hidden-content filter; queryAll is the plain light-DOM query.",
					"      const els = ctx.helpers.queryAllSmart('[onclick]');",
					"      const occurrences = els.map((el) => ({",
					"        selector: ctx.helpers.buildSelector(el),",
					"        html: el.outerHTML,",
					"        summary: 'Inline onclick handler found.',",
					"        hint: 'Move event handling into an external script.'",
					"      }));",
					"",
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
				lang="js"
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
					built-in rule's source into the in-page runner. Any function's source works: an arrow
					function, a <code>function</code> declaration, or a method written in shorthand as in
					the example above (<code>{"runInPage(ctx) {…}"}</code>, <code>async</code> too), whose{" "}
					<code>toString()</code> is not an expression on its own. Reconstruction needs{" "}
					<code>eval</code> to be allowed, so a page whose Content Security Policy forbids{" "}
					<code>'unsafe-eval'</code> skips a rule given as a string; pass a real function there.
				</li>
				<li>
					<code>meta</code> gets identical defaulting/validation to a build-time rule — omit
					anything you don't need; <code>defaultSeverity</code> defaults to{" "}
					<code>moderate</code>, <code>defaultConfidence</code> to <code>medium</code>,{" "}
					<code>type</code> to <code>automatic</code>, etc. A value outside its set (
					<code>minor</code>/<code>moderate</code>/<code>serious</code>/<code>critical</code>;{" "}
					<code>high</code>/<code>medium</code>/<code>low</code>; <code>automatic</code>/
					<code>manual</code>, any case) is a meta that fails validation, and the rule is skipped.
					A <code>severity</code> a rule returns outside the set is replaced by its default, with
					a note in <code>error</code>.
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
					A custom rule can report a margin as a built-in rule does: declare{" "}
					<code>meta.margin</code> (<code>{"{ measure, unit, limit }"}</code>) and return{" "}
					<code>marginCandidates</code> (see{" "}
					<a href={`${core}/docs/RULE_AUTHORING.md#metamargin`}>
						<code>RULE_AUTHORING.md</code>, <code>meta.margin</code>
					</a>
					, the rule-authoring guide on GitHub). A malformed <code>meta.margin</code> is ignored,
					so that rule reports no margin; the scan carries on.
				</li>
				<li>
					An invalid descriptor (missing/non-string <code>id</code>, a <code>runInPage</code>{" "}
					that isn't a function and isn't a reconstructable source string, a <code>meta</code>{" "}
					that fails validation, such as <code>deprecated: true</code> without{" "}
					<code>deprecation</code>, an id another custom rule in the list already has, or the id
					of a composite rule) is skipped with a <code>console.warn</code> naming the rule and the
					reason, and listed in the result's <code>skippedCustomRules</code> — the rest of the scan, including every built-in rule, still runs normally. This isn't a
					validation gap to fix: a custom rule is arbitrary caller-supplied code, so "fail this
					one entry closed, don't abort the scan" is the safer default, mirroring how a{" "}
					<em>built-in</em> rule that throws is contained to a <code>cantTell</code> for that rule
					rather than crashing the run.
				</li>
				<li>
					Rules run synchronously. A <code>runInPage</code> or <code>applicability</code> that
					returns a Promise (an <code>async</code> function) is reported as <code>cantTell</code>{" "}
					with an <code>error</code> saying so, as is a <code>runInPage</code> that returns
					anything but a result object. An <code>outcome</code> outside <code>pass</code>,{" "}
					<code>fail</code>, <code>cantTell</code> and <code>notApplicable</code> (such as{" "}
					<code>'failed'</code>) becomes <code>cantTell</code>, and <code>error</code> names the
					value returned.
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
				via <code>document.querySelectorAll</code> (all matches, not just the first). Pass{" "}
				<code>null</code> to scan the whole document.
			</p>
			<ul>
				<li>
					<strong>A selector that matches nothing scans nothing.</strong> Every rule reports{" "}
					<code>notApplicable</code>, the page-level rules included, and the result's{" "}
					<code>contextMatch</code> says so:{" "}
					<code>{"{ elementCount: 0, unmatchedSelectors: ['#mian'] }"}</code> (see{" "}
					<a href="/results-reports/output-schema/#top-level-result">the output schema</a>). The
					run also logs a <code>console.warn</code>. A scope the page doesn't have is not widened
					to the whole page: a result for content you never asked about, a whole-page{" "}
					<code>pass</code> among it, would read as a result for the part you did. In an array, a
					selector that matches nothing is listed in <code>unmatchedSelectors</code> while the
					others are scanned as usual, so content that is only sometimes on the page, such as a
					cookie banner, can sit in the list. Before 1.10.0 a scope that matched nothing fell
					back to the whole document, without a word in the result.
				</li>
				<li>
					<strong>A selector the browser can't parse throws</strong>, alone or in an array,
					before any rule runs:{" "}
					<code>contextSelector: "#main[" is not a valid CSS selector.</code> The error carries{" "}
					<code>code: 'INVALID_CONTEXT_SELECTOR'</code> and <code>selector</code>, the selector
					that failed. Unlike a selector that matches nothing, it is always a mistake in the call.{" "}
					<code>runa11yCoreAcrossFrames</code> rejects with the same error. An error crossing{" "}
					<code>page.evaluate</code> (Playwright, Puppeteer) keeps only its message, which is why
					the message names the option and the selector. Before 1.10.0 an invalid selector was
					skipped, so on its own it scanned the whole document.
				</li>
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
					<strong>Shadow DOM.</strong> With <code>includeShadowDom</code> (the default), a scope
					includes the shadow roots inside it, and a scope that is itself a shadow host includes
					its own shadow root. The selector is matched against the document, so it can't select
					an element <em>inside</em> a shadow root; scope to its host instead.
				</li>
				<li>
					Overlapping/nested regions are deduped automatically — an element reachable from more
					than one matched root is only ever reported once, not once per region.
				</li>
				<li>
					<strong>What a scoped result means.</strong> Most rules judge each element on its own,
					and judge the elements in scope exactly as in a whole-page scan. Two kinds of rule
					depend on the page around them. Whole-page rules (<code>page-title-present</code>,{" "}
					<code>landmark-one-main</code> and the rest listed under <code>fragment</code> above)
					report <code>notApplicable</code>. Rules that compare elements across the page (
					<code>landmark-unique</code>, <code>landmark-no-duplicate-banner</code>,{" "}
					<code>-contentinfo</code> and <code>-main</code>,{" "}
					<code>landmark-banner-is-top-level</code>, <code>-complementary-</code>,{" "}
					<code>-contentinfo-</code> and <code>-main-is-top-level</code>,{" "}
					<code>accesskeys</code>, <code>heading-order</code>,{" "}
					<code>identical-links-same-purpose</code>, <code>identical-iframes-same-purpose</code>)
					still report what they find inside the scope, since two landmarks there sharing a name
					share it on any page, but report <code>notApplicable</code> instead of{" "}
					<code>pass</code>: the scan saw only part of the page, so it cannot say the page is
					fine. <code>duplicate-id</code> and <code>duplicate-id-aria</code> compare each element
					in scope with the whole document, since its duplicate can sit outside the scope, and
					report an element in scope whose id appears anywhere else. Their <code>pass</code>{" "}
					means no element in the scope shares its id with another element on the page; a
					duplicate pair entirely outside the scope is not reported, as with every rule, so it
					does not say the whole page is free of duplicates. <code>target-size-minimum</code>{" "}
					judges the targets in scope against neighbours anywhere in the document, since the
					spacing exception depends on what the page puts next to a target.{" "}
					<code>text-spacing-content-loss</code> judges the text in scope, and checks whether it
					comes to overlap text anywhere on the page.
				</li>
			</ul>
		</>
	);
}
