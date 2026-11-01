import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const topLevelRows = [
	{ id: "engine.tag", field: <code>engine.tag</code>, meaning: <>The engine's own identity tag, currently <code>"a11ycore"</code>. Every rule (built-in or custom) carries it in <code>meta.tags</code> — rule <code>ruleId</code>s themselves are bare (no prefix).</> },
	{
		id: "engine.version",
		field: <code>engine.version</code>,
		meaning: (
			<>
				The <code>@surea11y/core</code> release that produced the result, such as{" "}
				<code>"1.11.1"</code>: what to quote in a bug report, and how to tell results from two
				releases apart. A result can change between releases without its shape changing, so this
				is not <code>schemaVersion</code>. The <a href="/results-reports/sarif-report/">SARIF</a>{" "}
				and <a href="/results-reports/earl-report/">EARL</a> reporters use it as the tool version
				when you give none.
			</>
		),
	},
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
				Which version of WCAG this run checked against: your{" "}
				<code>engineOptions.wcagVersion</code>, or the <code>wcagVersion</code> of the pack
				profile the run applied, or what your version-origin tags implied, or the default{" "}
				<code>"2.2"</code>. For SC 4.1.1 Parsing it says why{" "}
				<strong>a rule mapped only to it cannot <code>fail</code></strong>: 2.2 removed it, and the
				2023 errata to 2.0 and 2.1 count it as always satisfied (see{" "}
				<code>checksResults[i].wcagVersionScope</code> below). Reported once per result: a run has
				one target throughout.
				</>
				),
				},
				{
					id: "engine.wcagLevel",
					field: <code>engine.wcagLevel</code>,
					meaning: (
						<>
							The WCAG level the reported criteria were gated by, <code>"A"</code>,{" "}
							<code>"AA"</code> or <code>"AAA"</code>: <code>engineOptions.wcagLevel</code> when it
							was given and valid, or else the level the selection gives (
							<code>runOnly.wcag.level</code>, or the highest level its version/level tags name, a
							profile's tags included). WCAG rollups above it are not in <code>rulesResults</code>,
							though their rules ran and are in <code>checksResults</code>; a rollup the selection
							named by id is reported whatever <code>engineOptions.wcagLevel</code> says. Absent when
							the scan had no level, as a full scan or one that names rules only, which reports every
							level. The reporters gate the criteria they name by it. See{" "}
							<a href="/configuration/engine-options/#giving-the-level-of-a-scan-that-names-checks-wcaglevel">
								Giving the level of a scan that names checks
							</a>
							.
						</>
					),
				},
{
					id: "engine.profile",
					field: <code>engine.profile</code>,
					meaning: (
						<>
							Present only when an <code>engineOptions.profile</code> selected this run's rules, and
							names the profile, lowercased. Absent when none was asked for, and also when one was asked
							for but did not apply (unknown name, or an include in <code>runOnly</code> or{" "}
							<code>engineOptions</code> chose the rules instead), so its presence is how you confirm a
							run really targeted that profile. See{" "}
							<a href="/configuration/engine-options/#conformance-profiles">Conformance profiles</a>.
						</>
					),
				},
				{
					id: "engine.profileExcludes",
					field: <code>engine.profileExcludes</code>,
					meaning: (
						<>
							Present only when the applied profile leaves rules out: <code>{"{ rules, criteria }"}</code>,
							the rules it names and the WCAG criteria it leaves out. The rules it names, the rules
							whose every criterion it leaves out, and those criteria's WCAG rollups did not run; a
							rule that also checks a criterion the profile keeps ran, and counts toward that
							criterion. This narrows the scan without changing what WCAG requires. No built-in profile leaves anything out.
						</>
					),
				},
				{
					id: "engine.optInRules",
					field: <code>engine.optInRules</code>,
					meaning: (
						<>
							Present only when <code>engineOptions.optInRules</code> ran at least one opt-in rule that
							the rest of the selection would not have run. Lists their tags. Its presence means the
							result includes rules for requirements beyond the targeted standard, so a failure may not
							be a WCAG failure. See{" "}
							<a href="/configuration/engine-options/#running-every-rule-optinrules">Running every rule</a>.
						</>
					),
				},
				{
					id: "engine.mappings",
					field: <code>engine.mappings</code>,
					meaning: (
						<>
							Present only when the run names a standard besides WCAG in{" "}
							<code>meta.normativeMappings</code>, through <code>engineOptions.mappings</code> or a
							standard's profile. Lists them canonically: <code>"en301549"</code> for every version,{" "}
							<code>"en301549:V3.2.1"</code> for one. Absent means every result names WCAG only. See{" "}
							<a href="/configuration/engine-options/#other-standards-mappings">Other standards</a>.
						</>
					),
				},
				{
					id: "engine.packs",
					field: <code>engine.packs</code>,
					meaning: (
						<>
							Present only when the scan ran with <code>engineOptions.packs</code>: each pack that
							ran, as <code>name@version</code>, sorted by name. See{" "}
							<a href="/configuration/packs/">Packs</a>.
						</>
					),
				},
				{
					id: "engine.outputDetail",
					field: <code>engine.outputDetail</code>,
					meaning: (
						<>
							Present only when <code>engineOptions.output.detail</code> is{" "}
							<code>'findings'</code>, as <code>"findings"</code>: each <code>pass</code> or{" "}
							<code>notApplicable</code> check result that lists no occurrences is compact,{" "}
							<code>{"{ ruleId, outcome, type }"}</code> and its <code>margin</code> or{" "}
							<code>error</code> when it has one, without the title, description and{" "}
							<code>meta</code>, which are the catalog's and the same on every page.{" "}
							<code>fail</code> and <code>cantTell</code> results, the rollups and{" "}
							<code>engine</code> are whole, so no verdict changes. The reporters (SARIF, JUnit, the
							HTML report, EARL, the baseline functions) read a compact result as the full one,
							filling in from core's catalog. A result that catalog couldn't fill in stays whole:
							every check result of a scan with <code>packs</code>, a custom rule's, and one whose
							title or description the scan's <code>messages</code> changed. An empty page's result
							goes from about 263 KB to 90 KB.
						</>
					),
				},
				{
					id: "engine.environment",
					field: <code>engine.environment</code>,
					meaning: (
						<>
							The conditions the page was rendered under, read from the page when the scan starts,
							before any rule runs. Rules that measure the layout, such as{" "}
							<a href="/rules/text-spacing-content-loss/">
								<code>text-spacing-content-loss</code>
							</a>
							, can give another outcome for the same markup at another viewport width or while web
							fonts are still loading, so this is what you need to reproduce a run.{" "}
							<code>layout</code> is whether the page had one: <code>false</code> in jsdom and other
							DOM emulators, and then the viewport and the other rendering fields are left out, since
							they describe nothing that was measured; only <code>internalsHook</code>,{" "}
							<code>listenerHook</code> and <code>liveRegionHook</code> can sit beside it, where the
							page runs them. In a browser, <code>viewport</code> is{" "}
							<code>innerWidth</code>/<code>innerHeight</code> in CSS pixels,{" "}
							<code>devicePixelRatio</code> the page's (browser zoom shows here too),{" "}
							<code>colorScheme</code> what <code>prefers-color-scheme</code> matches,{" "}
							<code>forcedColors</code> whether <code>forced-colors: active</code> matches (
							<code>"active"</code> under Windows high contrast or Chromium's emulated forced colors,{" "}
							<code>"none"</code> otherwise; the rules measure the page's own colors either way, see{" "}
							<a href={`${core}/docs/LAYOUT_MEASUREMENT.md#forced-colors`}>Forced colors</a>),{" "}
							<code>forcedColorsCss</code> is <code>true</code> under forced colors when the page's own
							CSS reacts to them in a way the scan can't hold off (a <code>forced-colors</code> media
							query, which still matches, or a system color such as <code>GrayText</code>, which still
							takes the forced palette's), so the contrast results can differ from a scan with forced
							colors off, and <code>fonts</code> is <code>"loading"</code> while any of the page's font faces is still
							loading, <code>"loaded"</code> otherwise. A field the page can't report is left out.
							Reading these adds no nondeterminism: like the DOM, they are input. For results you can
							compare between runs, wait for <code>document.fonts.ready</code> before scanning.{" "}
							<code>images</code> is <code>"loading"</code> while any image is still loading,{" "}
							<code>"loaded"</code> otherwise: an image that arrives later can move what layout rules
							measured, so for comparable results scan after the page's <code>load</code> event. An
							image with <code>loading="lazy"</code> is left out, since it waits for the reader to
							scroll. <code>animationsSettled</code> is how many running animations and transitions
							the scan held still: for the scan, a finite one (a fade-in) is read at its end and one
							that repeats for ever (a marquee, a spinner) at its start, and each is put back exactly
							where it was afterwards, so a page scanned during a fade-in gets the same result as one
							scanned after it. The browser never paints the held state, since the scan is one
							synchronous task. <code>contentVisibilitySkipped</code> is how many elements with <code>content-visibility: auto</code> had their content skipped by the browser, as it does off screen: the scan lays that content out as it is once near the viewport, and lets the browser skip it again afterwards (see <a href={`${core}/docs/LAYOUT_MEASUREMENT.md#skipped-content`}><code>LAYOUT_MEASUREMENT.md</code></a> on GitHub); absent when there were none. <code>internalsHook</code> is there only where the page runs the
							opt-in internals hook (<code>internalsHookScript()</code>, see{" "}
							<a href={`${core}/docs/INTEGRATION.md#reading-private-elementinternals-the-internals-hook`}>
								<code>INTEGRATION.md</code>
							</a>
							) in the scanned document, with or without a layout: <code>"early"</code> when it was
							installed before the page's scripts and is still the page's{" "}
							<code>attachInternals</code>, so the scan read every custom element's{" "}
							<code>ElementInternals</code> and an element with none is no question;{" "}
							<code>"late"</code> when it was installed after them, or the page replaced{" "}
							<code>attachInternals</code> after it, so only internals attached after it were read.
							Without a hook the field is absent and the result is as before.{" "}
							<code>listenerHook</code> is the same for the opt-in listener hook (
							<code>listenerHookScript()</code>, see{" "}
							<a href={`${core}/docs/INTEGRATION.md#seeing-listeners-added-from-script-the-listener-hook`}>
								<code>INTEGRATION.md</code>
							</a>
							): <code>"early"</code> when it was installed before the page's scripts and is still the
							page's <code>addEventListener</code>, so the keyboard rules saw every listener the page
							added from script and a missing one proves there is none; <code>"late"</code> when it
							was installed after them, or the page replaced <code>addEventListener</code> after it.{" "}
							<code>liveRegionHook</code> is there only where the page runs the opt-in live-region hook
							(<code>liveRegionHookScript()</code>, see{" "}
							<a href={`${core}/docs/INTEGRATION.md#seeing-what-live-regions-are-given-the-live-region-hook`}>
								<code>INTEGRATION.md</code>
							</a>
							): <code>"early"</code> when it was installed before the document finished loading, so
							it saw every change to the page's live regions since; <code>"late"</code> otherwise. Each
							frame in a{" "}
							<a href="#cross-frame-result">cross-frame result</a> carries its own.
						</>
					),
				},
	{ id: "url", field: <code>url</code>, meaning: <>The <code>pageUrl</code> argument you passed in, or <code>document.location.href</code> if you passed <code>null</code>/omitted it (or passed something other than a string, which also logs a <code>console.warn</code>), or <code>null</code> if neither is available.</> },
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
				id: "contextMatch",
				field: <code>contextMatch</code>,
				meaning: (
					<>
						How the <code>contextSelector</code> resolved, or <code>null</code> when none was given.{" "}
						<code>elementCount</code> is how many distinct elements it matched, the roots of the scan.{" "}
						<code>unmatchedSelectors</code> lists each selector, as you gave it, that matched no
						element; a comma-separated string is one selector here, as it is one{" "}
						<code>querySelectorAll</code> call.{" "}
						<strong>An <code>elementCount</code> of 0 means nothing was scanned</strong>: the page has
						no such scope, every entry in <code>checksResults</code> and <code>rulesResults</code> is{" "}
						<code>notApplicable</code>, and the result says nothing about the page. Report it as a
						scope that wasn't found, not as a clean scan. A selector the browser can't parse never
						reaches a result: the scan throws with <code>code: 'INVALID_CONTEXT_SELECTOR'</code> (see{" "}
						<a href="/configuration/engine-options/">Engine options</a>).
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
				One entry per <strong>composite (rollup) rule</strong> that ran — see{" "}
				<a href="#composite-result">A composite result</a> and{" "}
				<a href="/conformance/wcag-mapping/">Conformance</a>. Normally one per WCAG Success
				Criterion; a run under the profile of a standard with rollups of its own also gets those (
				<code>meta.standard</code> set). It holds the rollups the selection selects, and the
				rollups of the criteria checked by a rule the selection named on its own (by id, say),
				which may be <a href="#partly-checked">partly checked</a> (see{" "}
				<a href="/configuration/engine-options/#which-criteria-a-scan-reports">Which criteria a scan reports</a>
				). Empty array when neither gives any.
			</>
		),
	},
	{
		id: "standards",
		field: <code>standards</code>,
		meaning: (
			<>
				Present only when the result names a standard besides WCAG in a{" "}
				<code>meta.normativeMappings</code> entry or a rollup's <code>meta.standard</code>: one{" "}
				<code>{"{ key, standard, titleLang?, note? }"}</code> per registered standard it names, a
				pack's included, in registry order. <code>key</code> is the standard's key (
				<code>"en301549"</code>), <code>standard</code> the name its entries carry (
				<code>"EN 301 549"</code>), <code>titleLang</code> the language its own rollups' titles are
				written in when not the scan's, and <code>note</code> the text above its own rollups in the
				HTML report, in the scan's language. The reporters read it instead of the registry, so a
				stored result renders the same wherever it is rendered, whether or not that installation
				knows the standard. A standard that only a custom rule names is not listed.
			</>
		),
	},
	{
		id: "skippedPacks",
		field: <code>skippedPacks</code>,
		meaning: (
			<>
				Present only when a pack in <code>engineOptions.packs</code> was not run: each{" "}
				<code>{"{ name, reason }"}</code>, <code>name</code> being <code>null</code> when the pack
				had none. In a page (<code>runa11yCoreInPage</code>), <code>name</code> is the{" "}
				<code>name@version</code> given, and the reason says why the page didn't run it: no{" "}
				<code>packScript</code> call registered exactly the named set, or the script was prepared
				with another core version. Each is also logged with <code>console.warn</code>.
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
				{
				id: "skippedCustomRules",
				field: <code>skippedCustomRules</code>,
				meaning: (
					<>
						The <code>engineOptions.customRules</code> entries that were not run, each{" "}
						<code>{"{ id, reason }"}</code> (<code>id</code> is <code>null</code> when the entry had
						none): no id, a <code>runInPage</code> that is not a function or can't be rebuilt from its
						source, a <code>meta</code> that fails validation, an id another custom rule already has,
						or a composite rule's id; or a valid rule the run's selection does not select (under a
						profile or a WCAG target, a rule tagged <code>best-practice</code> or with no WCAG tag),
						whose <code>reason</code> says how to select it; or a rule the selection's excludes leave
						out (<code>excludeRuleIds</code>, <code>excludeTestIds</code>, <code>excludeTags</code>,{" "}
						<code>rules.exclude</code>…), whose <code>reason</code> is{" "}
						<code>excluded by the selection.</code> and which also has <code>excluded: true</code>, so
						a tool can tell the caller's choice from a gap without reading the reason. Always an
						array; empty when every custom rule ran. Each is also logged with{" "}
						<code>console.warn</code>, except an excluded rule, which the caller asked to leave out. A rule listed here is in no result, so a scan that
						leaves one out can be told apart from one where it passed.
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
				<code>helpers.buildSelector</code> in <code>RULE_AUTHORING.md</code>). An id, test id,{" "}
				<code>name</code> or <code>aria-label</code> is used as the anchor only when no other
				element in the document has it, hidden, excluded and out-of-scope elements included, since{" "}
				<code>querySelector</code> resolves it against the whole document; otherwise the selector
				is a path. Not guaranteed unique in every DOM shape: an element in a shadow root is named
				within its own tree (<code>structuralPath</code> places it), and a very deep element's
				path is shortened from the top. On 255 test and real pages, 15 of 39,857 selectors did not
				name exactly their element, all of those kinds. The exception is a rule whose finding <em>is</em> an
				absent element: <code>page-title-present</code> reports <code>head &gt; title</code> with
				an <code>html</code> of <code>&lt;title&gt;(missing)&lt;/title&gt;</code>, neither of which
				is on the page. Both are constants, so the fingerprint they feed stays stable, but{" "}
				<strong>do not treat <code>selector</code> as resolvable or <code>html</code> as real
				markup without checking the rule reported something that exists</strong>. For an element
				in a shadow tree, <code>selector</code> resolves inside its shadow root, and{" "}
				<code>shadowHostSelectors</code> says how to get there.
				</>
				),
				},
				{
				id: "shadowHostSelectors",
				field: <code>shadowHostSelectors</code>,
				meaning: (
					<>
						Present only for an element inside a shadow tree: the selectors of the shadow hosts that
						lead to it, outermost first, each resolved in the tree that holds it, so{" "}
						<code>document.querySelector(s[0]).shadowRoot.querySelector(s[1])…shadowRoot.querySelector(selector)</code>{" "}
						finds the element. Two components with the same content give the same{" "}
						<code>selector</code> and differ here. Like <code>selector</code>, it is not part of a
						finding's identity. The <a href="/results-reports/html-report/">HTML report</a>,{" "}
						<a href="/results-reports/sarif-report/">SARIF</a> (<code>logicalLocations</code>),{" "}
						<a href="/results-reports/junit-report/">JUnit</a> and baseline entries show the two as
						one location, the hosts and then the selector joined with <code>{" >>> "}</code> (
						<code>{"#card >>> img"}</code>).
					</>
				),
				},
	{
		id: "html",
		field: <code>html</code>,
		meaning: (
			<>
				An outer-HTML snippet of the flagged element, cut at 2,000 characters — useful to show the
				element, and for an element in a shadow tree read beside{" "}
				<code>shadowHostSelectors</code>. For <code>&lt;html&gt;</code>,{" "}
				<code>&lt;head&gt;</code> and <code>&lt;body&gt;</code>, which hold the whole page, it is
				the start tag alone (<code>&lt;html class="x"&gt;</code>), so a page-level finding keeps
				its identity when other content changes.
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
				<code>documentElement</code>, <code>null</code> if it couldn't be determined, which
				includes every element inside a shadow tree (use <code>shadowHostSelectors</code> and{" "}
				<code>selector</code> there). A more
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
				under whichever eligibility model the rule used. <code>eligible</code> is that result
				(absent on the page-level findings of <code>bypass-blocks-present</code>,{" "}
				<code>html-lang-attr-present</code> and <code>page-title-present</code>);{" "}
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
				<code>html</code> forms the fingerprint baselines and SARIF are keyed on. A rule may gain
				a new reason code in a minor release, or split one by cause; see{" "}
				<a href={`${core}/docs/API_STABILITY.md#finding-identity`}>
					<code>API_STABILITY.md</code>
				</a>
				. The size and ratio fields of a contrast failure (<code>metrics.ratio</code>,{" "}
				<code>metrics.threshold</code>, and <code>typography</code>'s <code>fontSizePx</code>,{" "}
				<code>fontSizePt</code>, <code>fontWeight</code>, <code>isBold</code> and{" "}
				<code>isLargeText</code>) are stable too, so a report or pack can tell which kind of text
				failed, and so are <code>element</code> in <code>list-children-valid</code> findings,{" "}
				<code>parentElement</code> in <code>listitem-parent-valid</code> findings and{" "}
				<code>role</code> in <code>aria-role-name-present</code> findings, which say which kind of
				list or widget failed. Each rule's page lists the fields its findings carry, under “What a finding reports”.
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
				the occurrence's tier. <code>occurrenceOutcome(check, occurrence)</code>, from{" "}
				<code>@surea11y/core</code>, gives the tier as every reporter reads it, either way. The
				outcome always agrees with the tiers: any{" "}
				<code>fail</code>-tier occurrence makes it <code>fail</code>, and a <code>fail</code> whose
				occurrences are all <code>cantTell</code>-tier is <code>cantTell</code>, so SARIF, JUnit,
				EARL and baselines give one answer. The engine settles a custom or pack rule that returns
				them at odds; under the default policy, a manual rule is never <code>fail</code>. The
				reporters read a result stored before the engine did this by the same rule, under the
				policy its <code>engineOptions</code> record, and roll its WCAG rollups up again from what
				they read.
			</>
		),
	},
	{ id: "uncertainty", field: <code>uncertainty</code>, meaning: <>Why this finding could not be decided — see <a href="#uncertainty-codes">Uncertainty codes</a> below.</> },
	{ id: "lean", field: <code>lean</code>, meaning: <>Which way this undecided finding points, when the page gives evidence for one — see <a href="#leans">Leans</a> below.</> },
	{ id: "howToCheck", field: <code>howToCheck</code>, meaning: <>How a person answers this undecided finding — see <a href="#how-to-check">How to check</a> below.</> },
];

const uncertaintyRows = [
	{ id: "not-computable", code: <code>not-computable</code>, meaning: "The evidence the rule needed could not be read in this environment.", shape: "A cross-origin stylesheet, a background color that resolves to no value, an src that will not resolve." },
	{ id: "runtime-dependent", code: <code>runtime-dependent</code>, meaning: "The markup cannot settle it because script decides at runtime.", shape: "An aria-controls naming an element the widget builds when it opens." },
	{ id: "spec-only", code: <code>spec-only</code>, meaning: "A real specification violation, but the exposed name, role and value survive it, so no Success Criterion is established as failed.", shape: "An ARIA attribute whose absence the specification supplies a default for." },
	{ id: "equivalence-unknown", code: <code>equivalence-unknown</code>, meaning: "Two things may or may not serve the same purpose, and neither the markup nor the content settles it.", shape: "Two frames sharing an accessible name but embedding different resources." },
	{ id: "judgement-required", code: <code>judgement-required</code>, meaning: "The question is inherently a human call.", shape: "Whether an undersized target is essential; every type: \"manual\" rule." },
	{ id: "out-of-scope", code: <code>out-of-scope</code>, meaning: "The finding is real but falls outside the standard this run targets.", shape: "A rule mapped only to a criterion the target WCAG version removed." },
];

const rollupReasonRows = [
	{ id: "anyFail", code: <code>composite.rollup.fail.anyFail</code>, outcome: <code>fail</code>, when: "A contributor failed." },
	{ id: "anyCantTell", code: <code>composite.rollup.cantTell.anyCantTell</code>, outcome: <code>cantTell</code>, when: <>None failed, and one is <code>cantTell</code>.</> },
	{ id: "notSelectedChild", code: <code>composite.rollup.cantTell.notSelectedChild</code>, outcome: <code>cantTell</code>, when: <>None failed or is <code>cantTell</code>, and some didn't run because the scan didn't select them: partly checked.</> },
	{ id: "missingChild", code: <code>composite.rollup.cantTell.missingChild</code>, outcome: <code>cantTell</code>, when: <>None failed or is <code>cantTell</code>, and some didn't run for another reason.</> },
	{ id: "allInapplicable", code: <code>composite.rollup.notApplicable.allInapplicable</code>, outcome: <code>notApplicable</code>, when: <>Every contributor is <code>notApplicable</code>, and they find every case the criterion applies to.</> },
	{ id: "partialCoverage", code: <code>composite.rollup.cantTell.partialCoverage</code>, outcome: <code>cantTell</code>, when: <>Every contributor is <code>notApplicable</code>, but the criterion (or a standard's requirement marked <code>partial</code>) can apply to content they don't look for, so the page was not shown to have none.</> },
	{ id: "emptyComposite", code: <code>composite.rollup.cantTell.emptyComposite</code>, outcome: <code>cantTell</code>, when: "The rollup has no rules." },
	{ id: "partialCheck", code: <code>composite.rollup.cantTell.partialCheck</code>, outcome: <code>cantTell</code>, when: <>None failed or is <code>cantTell</code>, and not all are <code>notApplicable</code>, but the rules check only part of what the criterion (or a standard's requirement marked <code>partial</code>) asks: a person checks the rest.</> },
	{ id: "otherwise", code: <code>composite.rollup.pass.otherwise</code>, outcome: <code>pass</code>, when: "Otherwise." },
];

const outcomeRows = [
	{ id: "fail", outcome: <code>fail</code>, meaning: "The rule reports that the requirement it checks is not met. Read its mapping, confidence and occurrences to interpret the finding.", manual: "No, under the default policy (coerced to cantTell)" },
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
					"    version: string,       // the @surea11y/core release that produced the result",
					"    schemaVersion: string,",
					"    locale: { requested: string, resolved: string, reason: string },",
					'    wcagVersion: "2.0" | "2.1" | "2.2",',
					'    wcagLevel?: "A" | "AA" | "AAA",',
'    profile?: string,      // "wcag22-aa", "en301549-v4.1.1", "en301549-v3.2.1", "section508", or a registered standard\'s own',
					'    mappings?: string[],   // e.g. ["en301549"] or ["en301549:V3.2.1"]',
					"    profileExcludes?: { rules: string[], criteria: string[] },",
					"    optInRules?: string[],",
					'    outputDetail?: "findings",',
					"    packs?: string[],      // name@version",
					"    environment: {",
					"      layout: boolean,",
					"      viewport?: { width: number, height: number },  // CSS px",
					"      devicePixelRatio?: number,",
					'      colorScheme?: "light" | "dark",',
					'      forcedColors?: "active" | "none",',
					"      forcedColorsCss?: true,          // under forced colors, when the page's own CSS reacts to them",
					'      fonts?: "loaded" | "loading",',
					'      images?: "loaded" | "loading",',
					"      animationsSettled?: number,",
					"      contentVisibilitySkipped?: number, // elements whose content-visibility: auto content was skipped",
					'      internalsHook?: "early" | "late",  // only where the page runs the internals hook',
					'      listenerHook?: "early" | "late",   // only where the page runs the listener hook',
					'      liveRegionHook?: "early" | "late"  // only where the page runs the live-region hook',
					"    }",
					"  },",
					"  url: string | null,",
					"  title: string | null,",
					"  timestamp: string | null,",
					"  perfStats: object | null,",
					"  contextSelector: string | string[] | null,",
					"  contextMatch: { elementCount: number, unmatchedSelectors: string[] } | null,",
					"  checksResults: CheckResult[],",
					"  rulesResults: CompositeResult[],",
					"  standards?: Array<{ key: string, standard: string, titleLang?: string, note?: string }>,",
					"  overriddenBuiltinIds: string[],",
					"  skippedCustomRules: Array<{ id: string | null, reason: string, excluded?: true }>,",
					"  skippedPacks?: Array<{ name: string | null, reason: string }>",
					"}",
				]}
			/>
			<DataTable
				label="Top-level result fields"
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
					"    | { url: string | null, selector: string | null, title: string | null,",
					"        topFrame: <top-level result>, frames: [...same shape, recursively] }",
					"    | { url: string | null, selector: string | null, title: string | null, error: string }",
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
					<code>&lt;frame&gt;</code> in the scanned scope (open shadow roots included, and the scope
					itself when it is a frame), except a frame the page doesn't show and a frame{" "}
					<code>excludeSelectors</code> excludes, which are left out with their whole document. Each
					entry names its frame element: <code>selector</code> is a CSS selector for the{" "}
					<code>&lt;iframe&gt;</code>/<code>&lt;frame&gt;</code> in the parent's document, and{" "}
					<code>title</code> is the element's <code>title</code> attribute, or <code>null</code>, so
					frames loading the same document can be told apart. <code>url</code> is the document the
					frame shows, or, for a frame that hasn't navigated yet, its <code>src</code>. A reachable
					child (one that called{" "}
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
					<li>
						<strong>The reporters take the tree as it is.</strong> <code>renderHtmlReport</code>,{" "}
						<code>renderSarifReport</code>, <code>renderJunitReport</code>,{" "}
						<code>buildBaselineEntries</code>, <code>matchBaseline</code> and{" "}
						<code>renderEarlReport</code> report every frame of it: each frame that answered with
						its own findings, located in its own document, and each frame that did not as not
						scanned, so a gap in coverage doesn't read as a pass. A frame is named by its{" "}
						<strong>path</strong>, the <code>selector</code>s of the frame elements leading to it
						from the page, outermost first (<code>#checkout → iframe:nth-of-type(2)</code>). They
						throw a <code>TypeError</code> for anything that is neither a scan result nor a
						cross-frame result (an array, <code>null</code> or <code>undefined</code> from a scan
						that broke), rather than render it as a scan that found nothing.
					</li>
					<li>
						<strong>They take a binding's frame scan too.</strong> The browser bindings'{" "}
						<code>.frames(true)</code> returns <code>{"{ topFrame, frames }"}</code> with each frame
						a plain result (or <code>{"{ url, error }"}</code>) rather than a nested entry; the
						reporters, <code>getMargins</code> and <code>flattenCrossFrameResult</code> read each
						such frame as scanned, named by the path <code>['iframe']</code>, since it carries no{" "}
						<code>selector</code>.
					</li>
					<li>
						<code>flattenCrossFrameResult(result)</code>, from <code>@surea11y/core</code>, lists the
						frames as the reporters read them: <code>{"[{ frame: { path, title, url }, result }]"}</code>,
						or <code>error</code> in place of <code>result</code> for a frame that did not answer, the
						page first and each frame before the frames inside it. The page's <code>path</code> is{" "}
						<code>[]</code>. A plain scan result is one entry.
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
					'  ruleSeverity?: "minor" | "moderate" | "serious" | "critical", // the rule\'s own, when a profile gave it another',
					'  policyOutcome?: "pass" | "fail" | "cantTell" | "notApplicable", // what the rule found, when the policy made it cantTell',
					'  confidence: "high" | "medium" | "low",',
					'  type: "automatic" | "manual",',
					"  occurrences: Occurrence[],",
					"  title: string,",
					"  description: string,",
					"  i18n: { titleKey: string, descriptionKey: string, variantOfTitleKey?: string } | null,",
					"  meta: {",
					"    ruleId: string,",
					"    ruleInterfaceVersion: string,",
					"    ruleVersion: string,",
					"    normative: boolean,",
					"    atomic: boolean,",
					"    deprecated: boolean,",
					"    deprecation: object | null,",
					'    category: "perceivable" | "operable" | "understandable" | "robust" | null,',
					"    helpUrl: string,       // where to read how to fix it; \"\" when there is none",
					"    tags: string[],        // the rule's tags, its own and the engine's",
					"    normativeMappings: Array<{ standard: string, version: string, requirement: string, title: string,",
					"      conformanceLevel?: string, wcagSc?: string[], url?: string, understandingUrl?: string }>,",
					"    standard: string | null,",
					"    applicability: string,",
					"    expectation: string,",
					"    references: string[],",
					"    requirements: object | null,",
					"    mappings: object | null",
					"  },",
					"  engineOptions: object,   // the resolved engineOptions this rule actually ran under",
					"  schemaVersion: string,",
					"  rollupIds: string[],     // the rulesResults entries that group this rule in this run; [] if none",
					"  variantOf?: string,      // a pack's variant only: the id of the rule it runs at other settings; i18n.variantOfTitleKey is that rule's titleKey",
					"  data?: object,           // page-level data a rule reports whatever its outcome; see below",
					"  margin?: {               // the closest a measurement came to its threshold while meeting it; see below",
					'    measure: string,       // "contrast-ratio" | "overflow-px" | "target-size-px" | ... (open set)',
					'    unit: "px" | "ratio",  // open set',
					'    limit: "min" | "max",',
					"    threshold: number,",
					"    value: number,",
					"    headroom: number,      // >= 0",
					"    measuredCount: number,",
					"    selector?: string,",
					"    shadowHostSelectors?: string[],  // as on an occurrence",
					"    structuralPath?: number[],",
					"    context?: object       // rule-specific; not a stable contract",
					"  },",
					"  wcagVersionScope?: {     // present only when the target WCAG version changed this outcome",
					'    target: "2.0" | "2.1" | "2.2",',
					"    removedSc: string[],",
					'    coercedFrom: "fail",',
					'    by?: "errata"         // 2.0 or 2.1: their errata count the criterion as always satisfied',
					"  },",
					"  error?: string           // present when the rule did not complete, or the engine noted a change — see below",
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
					<strong>Under the default <code>a11y</code> policy, <code>type: "manual"</code> rules report{" "}
					<code>cantTell</code> rather than <code>fail</code>.</strong>{" "}
					If a manual rule's own logic would have said <code>fail</code>, the engine coerces it
					to <code>cantTell</code> and appends an explanatory note to <code>error</code> — this is
					enforced centrally (<code>policy.coerceManualFailToCantTell</code>, on by default under
					the <code>a11y</code> policy contract; see{" "}
					<a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a>), not something each rule
					has to remember. Under this policy, <code>fail</code> is reserved for deterministic,{" "}
					<code>type: "automatic"</code> findings only.
				</li>
				<li>
					<strong><code>meta.normativeMappings</code></strong> is how a check result ties back to
					a WCAG Success Criterion. An empty list means the rule has no formal mapping in this
					result. That doesn't say whether the rule is automatic or manual: read <code>type</code>{" "}
					for that (<code>aria-allowed-role</code>, for one, is automatic and has no WCAG mapping).
					See{" "}
					<a href="/conformance/wcag-mapping/">Conformance</a> for how these roll up.{" "}
					<strong>The list is not WCAG-only.</strong> When the scan asks for another standard (
					<code>engineOptions.mappings</code>, or a standard's profile), each WCAG criterion is
					followed by that standard's corresponding requirement, such as the EN 301 549 clause
					that restates it (
					<code>{'{ standard: "EN 301 549", version: "V3.2.1" | "V4.1.1", requirement: "9.1.1.1", title, wcagSc: ["1.1.1"] }'}</code>
					, one entry per version that includes the criterion); and a rule may also cite WCAG's
					Understanding documents (<code>type: "Understanding"</code>). Filter on{" "}
					<code>standard</code> (and on the absence of <code>type</code>) before reading{" "}
					<code>requirement</code> as a Success Criterion. A composite's WCAG entry is always
					first. See <a href="/conformance/wcag-mapping/#en-301-549">EN 301 549</a>.
					</li>
					<li>
						<strong><code>rollupIds</code></strong> lists the composites in{" "}
						<code>rulesResults</code> that group this rule in this run, those reported because the
						selection named the rule on its own included. An empty list means the
						rule's findings appear in no rollup, so a consumer that reads only{" "}
						<code>rulesResults</code> never sees them; <code>heading-order</code>, for instance,
						belongs to no WCAG rollup.
					</li>
				<li>
					<strong><code>wcagVersionScope</code></strong>: only present when the run's target WCAG
					version turned this rule's <code>fail</code> into a <code>cantTell</code> — today that
					means a rule mapped to SC 4.1.1 Parsing (<code>duplicate-id</code>): under 2.2, which
					removed that criterion, and under 2.0 and 2.1, whose 2023 errata count it as always
					satisfied for HTML and XML (<code>by: "errata"</code>). A profile whose standard keeps
					4.1.1's text (<code>en301549-v3.2.1</code>, or a pack's profile with{" "}
					<code>keepsParsing</code>) is not coerced. <code>removedSc</code> lists the criteria
					concerned, <code>target</code> is the run's version, and{" "}
					<code>coercedFrom</code> is the outcome the rule itself reported. The occurrences are
					the rule's own, unchanged — nothing was dropped, only the conformance verdict was.
					Absent on every other result, and <strong>never</strong> reported through{" "}
					<code>error</code>: nothing went wrong. See{" "}
					<a href="/configuration/engine-options/#filtering-by-wcag-version">Filtering by WCAG version</a>.
					</li>
					<li>
						<strong><code>data</code></strong>: present only on a rule that reports something about
						the whole page, whatever its outcome. No core rule does today. Like{" "}
						<code>data.details</code> on an occurrence, it is not a stable contract.
						</li>
						<li id="margin">
							<strong><code>margin</code></strong>: present only on a rule that declares one in the
							catalog (<code>getChecksCatalog()[i].margin</code>,{" "}
							<code>{"{ measure, unit, limit, band? }"}</code>), when at least one element met the
							rule's threshold and, if the declaration has a <code>band</code>, came within it.{" "}
							<code>band.relative</code> is a fraction of the threshold: <code>contrast-minimum</code>,{" "}
							<code>contrast-enhanced</code> and <code>link-in-text-block</code>, with{" "}
							<code>0.1</code>, report a margin only for a ratio within 10% of the one it needed (4.5
							to 4.95 against 4.5:1, 3 to 3.3 against 3:1). <code>band.absolute</code> is an amount in{" "}
							<code>unit</code>: <code>target-size-minimum</code>, with <code>6</code>, reports a
							target only up to 30 px, and <code>text-spacing-content-loss</code>, with{" "}
							<code>8</code>, a line only from 6 px inside its box's edge. Text at 21:1 or a 48 px
							button is not close to anything, and no margin says so. It names the element that came closest to the threshold while meeting it, so
							a pass at 4.52:1 against 4.5:1, or 0.4 px from cutting off text, can be told apart from
							a comfortable one. It sits beside the outcome and is not a finding: it never adds,
							removes or changes an occurrence, and baselines, SARIF, JUnit and EARL ignore it. It is
							reported on <code>fail</code> and <code>cantTell</code> results too when some elements
							passed. <code>limit</code> is <code>min</code> when the value must reach the threshold
							(contrast, size) and <code>max</code> when it must stay under it (overflow);{" "}
							<code>headroom</code> is how far inside, in <code>unit</code>, so{" "}
							<code>value - threshold</code> for <code>min</code> and <code>threshold - value</code>{" "}
							for <code>max</code>, never negative. <code>threshold</code> is the one that element was
							judged against, which can differ between elements (3:1 for large text). Pixels are given
							to one decimal: CSS pixels and thresholds such as half a 15px font are fractional, and a
							display rounds them for people. A ratio is not rounded, as WCAG does not round contrast.
							A tie goes to the element first in document order, so a page gives the same margin every
							time. <code>measure</code> and <code>unit</code> are open sets that may grow in a minor
							release; <code>context</code> is rule-specific and, like <code>data.details</code>, not a
							stable contract. <code>getMargins(result)</code> returns every margin in a result as{" "}
							<code>{"[{ ruleId, ...margin }]"}</code>, sorted by <code>ruleId</code>; of a cross-frame
							result, every frame's, a child frame's with <code>frame</code>, the path to it.
						</li>
				<li>
					<strong><code>error</code></strong>: present when the rule did not complete, or when the
					engine changed or ignored part of what the rule returned. A rule that threw (or returned
					something that is not a result) always surfaces as <code>outcome: "cantTell"</code> with{" "}
					<code>occurrences: []</code> and <code>error</code> set to the exception message, so{" "}
					<code>cantTell</code> with no occurrences and an <code>error</code> is how to tell a rule
					that did not complete; the engine never lets one broken rule crash the whole scan.
					Otherwise <code>error</code> holds the engine's notes, joined by <code>|</code> after any{" "}
					<code>error</code> the rule returned itself: the manual-fail coercion above, an{" "}
					<code>outcome</code> or <code>severity</code> outside its set, a <code>type</code> that
					differs from its meta's, occurrences that are not objects (left out), a{" "}
					<code>policyOutcome</code> or <code>ruleSeverity</code> the rule returned (not taken: the
					engine sets both), an <code>uncertainty.code</code> outside the closed set, and a{" "}
					<code>fail</code> downgraded to <code>cantTell</code> because the 200-step ancestor walk
					stopped short of every reported element. Those results keep their occurrences: the rule
					completed.
				</li>
				<li>
					<strong><code>policyOutcome</code></strong>: present when the policy's{" "}
					<code>allowedOutcomes</code> doesn't allow the outcome the rule found. The result is then{" "}
					<code>cantTell</code>, with the rule's own outcome here and no <code>error</code>, so the
					reporters don't read it as a rule that did not complete.
				</li>
				<li>
					<strong><code>engineOptions</code></strong> on each result is the <em>resolved</em>{" "}
					options object (after locale/contrast defaults were applied), not literally what you
					passed in — useful for confirming what a given rule actually saw, especially the
					resolved <code>locale</code> and <code>contrast.mode</code>/
					<code>contrast.rootCanvasFallback</code>. <code>contrast.rootCanvasFallback</code> is
						white when the caller gave none, and <code>contrast.rootCanvasFallbackSet</code> says
						which: <code>true</code> for a color the caller gave, <code>false</code> for the
						default. It leaves out <code>messages</code>, the
					dictionaries the run translated with (a locale side file in the browser bundle, or your
					own strings): they are data, not a setting, and a copy on every result made a scan tens
					of megabytes. <code>engine.locale</code> says which dictionary was used. Three more
						options are echoed as the rules saw them, so the result stays plain data that{" "}
						<code>JSON.stringify</code> and <code>structuredClone</code> (<code>postMessage</code>)
						can carry: <code>probes</code> as the capped copy rules read, <code>customRules</code>{" "}
						as <code>{"[{ id }]"}</code>, one entry per custom rule with an id, without its
						functions, and <code>styleSheetTexts</code> as <code>{"[{ href }]"}</code>, one entry
						per sheet given, without its text, since a page's CSS repeated on every result
						multiplied it by the number of rules.
					</li>
			</ul>

			<h2 id="occurrence">An occurrence (<code>occurrences[i]</code>)</h2>
			<p>
				A <code>fail</code> always has at least one: a custom rule's <code>fail</code> that names
				no element gets one on the document element (<code>selector: "html"</code>, reason code{" "}
				<code>FAIL_WITHOUT_OCCURRENCE</code>). Normally present only when <code>outcome</code> is{" "}
				<code>fail</code> or{" "}
				<code>cantTell</code>: a <code>pass</code> result has <code>occurrences: []</code>, since
				this engine does not enumerate the elements it passed, only the ones it flagged. The
				contrast rules are the exception: their <code>pass</code> carries one occurrence
				describing the scan (how much text was eligible and computable), with an empty{" "}
				<code>selector</code>, so a pass over no text can be told apart from a pass over a page of
				it.
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
					"  shadowHostSelectors?: string[],",
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
					"  lean?: {                 // present only on a cantTell-tier occurrence, and only with evidence",
					'    toward: "pass" | "fail",',
					"    why: string,           // localized: what in the page points that way",
					"    signals: { signal: string, value: string | number | boolean | null }[],",
					"    caution?: string,      // localized: what could make it wrong",
					"    measured?: { agreed: number, cases: number, corpus?: string, coreVersion?: string },",
					"    i18n?: { whyKey?: string, cautionKey?: string, params?: object }",
					"  },",
					"  howToCheck?: {           // present only on a cantTell-tier occurrence, when the rule says",
					"    steps: string[],       // localized: what a person does, in order",
					"    passWhen: string,      // localized: what they see if it passes",
					"    failWhen: string       // localized: what they see if it fails",
					"  },",
					"  data?: {               // absent on manual-review's page-level finding",
					"    visibilityFilter?: { eligible?: boolean, targetSet: string, accEligible: boolean | null, reasons: string[] },",
					"    details?: object   // rule-specific, non-normative — see below",
					"  }",
					"}",
				]}
			/>
			<DataTable
				label="Occurrence fields"
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
				not, so the engine drops it. An uncertainty whose <code>code</code> is not one of the codes
				below is left out too, and the rule's <code>error</code> names the code.
			</p>
			<DataTable
				label="Uncertainty codes"
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

			<h3 id="leans">Leans</h3>
			<p>
				A <code>cantTell</code> can still point one way. <code>lean</code> says which, when the
				page gives evidence for it: <code>toward</code> is the answer that evidence makes likely,{" "}
				<code>why</code> says what the evidence is, and <code>signals</code> lists the facts the
				rule read, each a kebab-case name and a plain value, so a tool can show or weigh them.{" "}
				<code>caution</code> says what could make the lean wrong, when that isn't plain from{" "}
				<code>uncertainty.needed</code>. <strong>The outcome stays <code>cantTell</code></strong>:
				a lean is advice, not a verdict, and nothing that reads outcomes or tiers changes because
				of it. <a href={`${core}/docs/LEANS.md`}><code>LEANS.md</code></a> is the guide for
				people who read reports and build tools: which findings lean and why, how a lean is
				measured, and how far to trust one.
			</p>
			<p>
				<code>lean</code> is present only where the rule has evidence.{" "}
				<strong>Its absence is information too</strong>: only a person can judge this one. It is
				present only on a <code>cantTell</code>-tier occurrence, as <code>uncertainty</code> is;
				the engine drops one on a decided occurrence, and drops a malformed one (a{" "}
				<code>toward</code> other than <code>pass</code> or <code>fail</code>, or no{" "}
				<code>why</code>) without touching the finding. <code>measured</code> appears once a lean
				has been counted against at least five cases with known answers: how many times it was
				right (<code>agreed</code>) out of how many (<code>cases</code>), which corpus they came
				from (<code>corpus</code>, with the date it was read) and which core counted them (
				<code>coreVersion</code>). The counts are per rule, reason code and direction, from the
				W3C ACT Rules test cases, and the engine carries them, so a result from any entry point
				has them. A lean never counted, or counted on fewer cases, has none; there is no
				confidence number. None has yet: the first count, in jsdom, saw 9 leans, none on five
				cases.
			</p>
			<p>
				<code>why</code> and <code>caution</code> are in the scan's locale; <code>i18n</code>{" "}
				holds their keys and parameters, as an occurrence's <code>i18n</code> does for{" "}
				<code>summary</code> and <code>hint</code>. The engine itself leans one finding: a rule
				mapped only to a criterion the target WCAG version removed, or that the 2023 errata count
				as satisfied, leans <code>pass</code> beside its <code>out-of-scope</code> uncertainty.
			</p>
			<p>
				<code>reviewGroupOf(check, occurrence)</code>, from <code>@surea11y/core</code>, says where
				an occurrence goes in a review: <code>'fail'</code>, <code>'leanFail'</code>,{" "}
				<code>'leanPass'</code> or <code>'open'</code> (only a person can judge), the groups of
				the <a href="/results-reports/html-report/">HTML report</a>.{" "}
				<code>leaningFailures(result, {"{ wcagOnly }"})</code> lists the findings that lean fail,
				those a gate with <code>leanFailAs</code> counts (
				<a href="/results-reports/junit-report/#options">JUnit</a>,{" "}
				<a href="/results-reports/sarif-report/#options">SARIF</a>).
			</p>
			<p>
				New leans arrive in minor releases, rule by rule, and a lean may be removed if measuring
				shows it is wrong too often: treat a lean as present-or-absent advice,{" "}
				<strong>never as part of a finding's identity</strong>. It does not enter the fingerprint.
			</p>

			<h3 id="how-to-check">How to check</h3>
			<p>
				A <code>cantTell</code> hands a question to a person. <code>howToCheck</code> tells them
				how to answer it: <code>steps</code>, a few actions in order, starting from the element the
				finding names (“Tab to the element.”, “Watch whether the focus indicator stays on it.”),
				then <code>passWhen</code> and <code>failWhen</code>, what they see if it passes and if it
				fails, naming the criterion it fails. Every core rule that can report{" "}
				<code>cantTell</code> writes these for each of its reason codes (its{" "}
				<code>meta.review</code>), and each <code>cantTell</code>-tier occurrence gets its code's
				entry, in the scan's locale. A variant's finding (<code>variantOf</code>) gets its base
				rule's where it has none of its own. A pack rule may write them too, in English (see{" "}
				<a href="/configuration/packs/#rules">Packs</a>); its findings get them when the packs are
				known, as <code>runDomRulesInPage</code> with <code>engineOptions.packs</code> and{" "}
				<code>addHowToCheck(result, {"{ packs }"})</code> know them. It is absent on a decided
				occurrence, on a custom rule's finding, on an override's (a custom or pack rule in{" "}
				<code>overriddenBuiltinIds</code>), and on a pack rule's that writes none.
			</p>
			<p>
				<strong>The steps are added after the scan, in Node, not by the engine in the page</strong>:
				the engine is injected into every page and frame a scan opens, and has no use for a
				thousand sentences no rule reads. <code>runDomRulesInPage</code> adds them to its result. A
				result from <code>runa11yCoreInPage</code> run in a page (a binding's, an extension's)
				comes back without them; <code>addHowToCheck(result)</code> returns a copy with them, and{" "}
				<code>howToCheckFor(ruleId, reasonCode, locale)</code> gives one finding's. Both read
				core's review dictionaries from disk, so they need Node; a binding whose code runs in a
				browser (Cypress) calls <code>applyHowToCheck(result, {"{ en, fr }"})</code> from{" "}
				<code>@surea11y/core/how-to-check</code> with the dictionaries it imports from{" "}
				<code>{"@surea11y/core/review/<locale>"}</code>, and gets the same steps (
				<a href={`${core}/docs/BINDING_AUTHORS_GUIDE.md`}><code>BINDING_AUTHORS_GUIDE.md</code></a>{" "}
				shows how a binding does it). The <a href="/results-reports/html-report/">HTML report</a>{" "}
				(<code>renderHtmlReport</code>) adds them in Node to a result that comes without them; in
				the browser (<code>surea11y.report.js</code>) it shows those the result carries. A tool
				that shows a result in another language than the scan's passes <code>{"{ locale }"}</code>{" "}
				to <code>addHowToCheck</code> or <code>applyHowToCheck</code> (
				<code>{"addHowToCheck(result, { locale: 'de' })"}</code>, or a list of locales, most wanted
				first; <code>renderHtmlReport</code> takes none): the steps are given in it, those already
				there included, with English for any step the locale lacks.
			</p>
			<p>
				The steps assume a browser, its developer tools (the accessibility tree), a keyboard and,
				for some, a screen reader. Unlike <code>uncertainty.needed</code>, which says in one
				sentence what would settle the question, they say how to settle it. Like a lean, they are
				guidance, not part of a finding's identity, and their wording may improve in any release.
			</p>

			<h2 id="composite-result">A composite result (<code>rulesResults[i]</code>)</h2>
			<p>
				Composites roll multiple atomic rules up to one WCAG Success Criterion (e.g.{" "}
				<code>wcag-1.1.1-non-text-content</code> rolls up 21 atomic rules). Under the profile of a
				standard with rollups of its own, there are also those, with the standard's wording as{" "}
				<code>title</code> and its name as <code>meta.standard</code>. Shape is the same envelope
				as a check result, with composite-specific <code>data.details</code>:
			</p>
			<CodeBlock
				lines={[
					"{",
					'  ruleId: string,              // e.g. "wcag-1.1.1-non-text-content"',
					'  outcome: "pass" | "fail" | "cantTell" | "notApplicable",',
					"  severity, confidence, type, title, description, meta, engineOptions, schemaVersion,  // as on a check result, except that",
					"                                // meta.normativeMappings names the criterion in a shorter form:",
					"                                // { standard, requirement, level }",
					"  occurrences: [],              // always empty — composites are rollups, not element-level findings",
					"  data: {",
					"    details: {",
					'      reasonCode: string,       // e.g. "composite.rollup.fail.anyFail"',
					"      standard?: string,        // a standard's own rollup only, with version and criterion",
					"      version?: string,",
					"      criterion?: string,",
					"      checksIds: string[],      // every atomic ruleId it rolls up, custom rules mapped to its criteria included",
					"      customChecksIds?: string[], // the custom rules among them; absent when none",
					"      restatesWcag?: string[],  // a standard's rollup that restates WCAG criteria (applicability: 'wcag'): those criteria",
					"      partial?: true,           // a standard's requirement its rules don't check in full (partial: true)",
					"      contributors: Array<{ testId: string, outcome: string, severity?: string | null, custom?: true, notSelected?: true,",
					"                            byReasonCode?: true, checkOutcome?: string, requirements?: string[] }>,",
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
				<code>notApplicable</code></strong>, where the rules find every case the criterion applies
				to, and <code>cantTell</code> (<code>partialCoverage</code>) otherwise; else{" "}
				<strong><code>pass</code></strong>, where the rules check all the criterion asks, and{" "}
				<code>cantTell</code> (<code>partialCheck</code>) otherwise.{" "}
				<strong>No WCAG criterion is yet listed as checked in full, so no WCAG rollup passes
				today.</strong> See <a href="/conformance/wcag-mapping/">Conformance</a> for what this
				means for an overall conformance claim.
			</p>
			<p>
				A standard's own rollup can judge a rule by its findings rather than whole (see{" "}
				<a href="/configuration/packs/">Packs</a>): its contributor then says{" "}
				<code>byReasonCode: true</code>, <code>outcome</code> is the rule's outcome in this rollup
				(a <code>fail</code> whose findings all belong elsewhere is a <code>pass</code> here) and{" "}
				<code>checkOutcome</code> the rule's own. When the findings that count toward the rollup
				name which of its requirements they belong to, <code>requirements</code> lists them, and
				the rollup's <code>meta.normativeMappings</code> names those for that rule, not every
				requirement the rule checks.
			</p>
			<p>
				A WCAG rollup's rules are its own list and every rule of <code>engineOptions.customRules</code>{" "}
				that ran and maps to one of its criteria (through <code>meta.wcagSc</code> or a WCAG entry
				in <code>meta.normativeMappings</code>), marked <code>custom: true</code> among the
				contributors and listed in <code>customChecksIds</code>, so a reader sees when a custom
				rule decided the outcome. A standard's own rollups keep their lists.
			</p>
			<p id="partly-checked">
				<strong>A partly checked criterion.</strong> A scan that names rules rather than
				criteria (<code>{"includeRuleIds: ['link-name-present']"}</code>) also gets the rollups of
				the criteria those rules check, when the selection doesn't select them itself (see{" "}
				<a href="/configuration/engine-options/#which-criteria-a-scan-reports">Which criteria a scan reports</a>
				). The precedence above decides them as any other, so a failing rule fails the criterion,
				and rules the scan didn't select keep it from passing. Each of those is a contributor with{" "}
				<code>outcome: "missing"</code> and <code>notSelected: true</code>, counted in{" "}
				<code>missingCount</code> as before. When they are what makes the rollup{" "}
				<code>cantTell</code>, its <code>reasonCode</code> is{" "}
				<code>composite.rollup.cantTell.notSelectedChild</code>, and the{" "}
				<a href="/results-reports/html-report/">HTML report</a> says “Partly checked: 1 of 2 checks was not selected for this scan”.{" "}
				<code>composite.rollup.cantTell.missingChild</code> keeps meaning a rule that didn't run
				for another reason, such as one the profile excludes (<code>engine.profileExcludes</code>),
				which is never marked <code>notSelected</code>.
			</p>
			<DataTable
				label="Rollup reason codes"
				rowKey="id"
				columns={[
					{ key: "code", label: "reasonCode", width: "40%" },
					{ key: "outcome", label: "Outcome", width: "16%" },
					{ key: "when", label: "When", wrap: true },
				]}
				rows={rollupReasonRows}
			/>

			<h2>Outcome values</h2>
			<DataTable
				label="Outcome values"
				rowKey="id"
				columns={[
					{ key: "outcome", label: "Outcome", width: "16%" },
					{ key: "meaning", label: "Meaning", wrap: true },
					{ key: "manual", label: 'Can appear on type: "manual"?', width: "22%" },
				]}
				rows={outcomeRows}
			/>
			<p>
				In core's built-in rules, <code>fail</code> is intentionally the narrowest, highest-bar
				outcome: reserved for deterministic, normative violations;{" "}
				<strong>chasing rule coverage must never dilute this</strong>.
			</p>

			<h2>Severity and confidence values</h2>
			<ul>
				<li>
					<code>severity</code>: <code>minor</code> &lt; <code>moderate</code> &lt;{" "}
					<code>serious</code> &lt; <code>critical</code> — the rule author's assessment of user
					impact, independent of <code>confidence</code>. A profile can give a rule another severity
					(a profile's <code>severity</code> in a standard or a pack's checklist): under it the
					result shows the profile's, keeps the rule's own as <code>ruleSeverity</code> (present
					only then), and the rollups take the profile's.
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
				<code>identical-iframes-same-purpose</code>,{" "}
				<code>svg-image-text-alternative-present</code>,{" "}
				<code>video-poster-text-alternative-present</code>, <code>target-size-minimum</code> and{" "}
				<code>text-spacing-content-loss</code>.{" "}
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
				<a href="/configuration/engine-options/">Engine options</a>; since 1.10.0 a bare array of
				rule ids does the same):
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
					'    "version": "1.14.0",',
					'    "schemaVersion": "1.0.0",',
					'    "locale": { "requested": "en", "resolved": "en", "reason": "ok" },',
					'    "wcagVersion": "2.2",',
					'    "environment": { "layout": false }',
					"  },",
					'  "url": "https://example.test/",',
					'  "title": "Example",',
					'  "timestamp": null,',
					'  "perfStats": null,',
					'  "contextSelector": null,',
					'  "contextMatch": null,',
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
					'          "hint": "Give the button visible text, or name it with aria-label, so screen reader users know what it does.",',
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
					'          "summary": "This <img> has no alt attribute.",',
					'          "hint": "Add an alt attribute that says what the image shows, or alt=\\"\\" if the image is purely decorative.",',
					'          "data": {',
					'            "details": { "reasonCode": "TEXT_ALTERNATIVE_MISSING" },',
					'            "visibilityFilter": { "eligible": true, "reasons": [], "targetSet": "acc", "accEligible": true }',
					"          }",
					"        }",
					"      ]",
					"    }",
					"  ],",
					'  "rulesResults": [',
					"    {",
					'      "ruleId": "wcag-1.1.1-non-text-content",',
					'      "outcome": "fail",',
					'      "severity": "serious",',
					'      "title": "Non-text content: text alternatives",',
					'      "occurrences": [],',
					'      "data": {',
					'        "details": {',
					'          "reasonCode": "composite.rollup.fail.anyFail",',
					'          "checksIds": ["area-alt-present", "img-alt-decorative", "img-alt-quality", "..."],',
					'          "contributors": [',
					'            { "testId": "area-alt-present", "outcome": "missing", "notSelected": true },',
					'            "...",',
					'            { "testId": "img-alt-present", "outcome": "fail", "severity": "serious" },',
					'            "..."',
					"          ],",
					'          "metrics": { "failCount": 1, "cantTellCount": 0, "notApplicableCount": 0, "passCount": 0, "missingCount": 20 }',
					"        }",
					"      }",
					"    },",
					"    {",
					'      "ruleId": "wcag-4.1.2-name",',
					'      "outcome": "fail",',
					'      "severity": "serious",',
					'      "title": "Name, role, value: accessible name",',
					'      "occurrences": [],',
					'      "data": {',
					'        "details": {',
					'          "reasonCode": "composite.rollup.fail.anyFail",',
					'          "metrics": { "failCount": 1, "cantTellCount": 0, "notApplicableCount": 0, "passCount": 0, "missingCount": 23 }',
					"        }",
					"      }",
					"    }",
					"  ],",
'  "overriddenBuiltinIds": [],',
					'  "skippedCustomRules": []',
					"}",
				]}
			/>
			<p>
				(Trimmed for readability — the real result also includes{" "}
				<code>title</code>/<code>description</code>/<code>i18n</code>/<code>meta</code>/
				<code>engineOptions</code>/<code>schemaVersion</code> on every entry, per the full shape
				above, and every contributor of each rollup. <code>rulesResults</code> holds the criteria
				the two named rules check: 1.1.1 for <code>img-alt-present</code> and 4.1.2 for{" "}
				<code>button-name-present</code>, each <code>fail</code> because its rule failed. The other
				rules of those criteria weren't selected, so they are <code>missing</code> with{" "}
				<code>notSelected: true</code>; with no failing rule, the criteria would be{" "}
				<code>cantTell</code> (<code>notSelectedChild</code>),{" "}
				<a href="#partly-checked">partly checked</a>. Each check result's{" "}
				<code>rollupIds</code> names its rollup.)
			</p>
		</>
	);
}
