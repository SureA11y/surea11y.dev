import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { Callout } from "./design-system/feedback/Callout.jsx";

const core = "https://github.com/SureA11y/core/blob/main";
const pack = "/configuration/packs/#en-301-549-pack";

const optionRows = [
	{
		id: "strictOptions",
		option: <code>strictOptions</code>,
		meaning: (
			<>
				Default <code>false</code>. <code>true</code> checks every option before the scan, and
				throws <code>INVALID_ENGINE_OPTIONS</code> on a key the engine doesn't read or a value of
				the wrong type or outside its set; see{" "}
				<a href="#catching-mistakes-in-the-options-strictoptions">"Catching mistakes in the options"</a>{" "}
				below.
			</>
		),
	},
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
				run is conformance-testing against. Defaults to the version the run's pack profile names
				(its <code>wcagVersion</code>), else to whatever your version-origin tags imply, and to{" "}
				<code>'2.2'</code> when they imply nothing. What it changes is which criteria a scan
				reports and, for SC 4.1.1 Parsing, why a rule tagged <code>wcag22-removed</code> cannot{" "}
				<code>fail</code>: removed in 2.2, and always satisfied in 2.0 and 2.1 by their errata,
				except under a profile whose standard keeps it, such as <code>en301549-v3.2.1</code> — see{" "}
				<a href="#filtering-by-wcag-version">"Filtering by WCAG version"</a> above. Any other
				value, of any type (the number <code>2.1</code>, <code>'3.0'</code>), is ignored with a{" "}
				<code>console.warn</code> naming the version the run targets instead.
			</>
		),
	},
	{
		id: "wcagLevel",
		option: <code>wcagLevel</code>,
		meaning: (
			<>
				Optional: <code>'A'</code>, <code>'AA'</code> or <code>'AAA'</code>, in any case — the
				WCAG level of the criteria a run reports. WCAG rollups above it are left out of{" "}
				<code>rulesResults</code> while their rules still run; it never changes what runs. It wins
				over the level the selection implies; a rollup named by id is reported as named. Reported
				back as <code>engine.wcagLevel</code>, which without the option holds the level the
				selection implies, if any. Any other value is ignored with a <code>console.warn</code>, and
				throws under <code>strictOptions</code>. See{" "}
				<a href="#giving-the-level-of-a-scan-that-names-checks-wcaglevel">
					"Giving the level of a scan that names checks"
				</a>{" "}
				above.
			</>
		),
	},
	{
		id: "profile",
		option: <code>profile</code>,
		meaning: (
			<>
				Optional named conformance target: <code>'wcag22-a'</code>, <code>'wcag22-aa'</code>,{" "}
				<code>'wcag22-aaa'</code>, <code>'en301549-v4.1.1'</code>, <code>'en301549-v3.2.1'</code>,{" "}
				<code>'section508'</code>, or a pack's own; or a list of them, for a scan of several
				profiles at once. Selects rules by the matching tag set when nothing else includes any, and
				the WCAG target follows from those tags. Reported back as <code>engine.profile</code> when
				it took effect (for a list, the first that ran, with every one in{" "}
				<code>engine.profiles</code>); otherwise ignored with a console warning. See{" "}
				<a href="#conformance-profiles">"Conformance profiles"</a> above.
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
				<code>'en301549:V4.1.1'</code>, or a pack's standard's key, as an array or comma-separated
				string. Default none, so
				results name WCAG only; an EN 301 549 profile adds its own version. Reported back as{" "}
				<code>engine.mappings</code> when any applies. See{" "}
				<a href="#other-standards-mappings">"Other standards"</a> above.
			</>
		),
	},
	{
		id: "logUntestedWcag",
		option: <code>logUntestedWcag</code>,
		meaning: (
			<>
				Default <code>true</code>. <code>false</code> leaves out the <code>console.info</code> note
				for a WCAG version/level tag no rule carries (<code>wcag22a</code>), in an include list
				beside others; see <a href="#via-runonly-4th-argument">"Via runOnly"</a> above.
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
				<code>&lt;details&gt;</code> (everything but its first <code>&lt;summary&gt;</code>, at any
				depth), <code>content-visibility:hidden</code> and <code>hidden="until-found"</code>{" "}
				content, content in an <code>[inert]</code> subtree (which rules about how content looks,
				such as contrast and text spacing, still judge, since it is drawn), and hidden
				rendering-only host elements (with descendants excluded too).{" "}
				<code>runa11yCoreAcrossFrames</code> does not scan a frame that is hidden this way. Set{" "}
				<code>true</code> to include those hidden/collapsed subtrees in
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
				them: an element whose name could come from a custom element with no content the engine
				can read (a button, link, menu item, option, tab, tree item, summary or tooltip) is asked
				about (<code>cantTell</code>, <code>name_closedContent</code>), not failed.
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
				<code>notApplicable</code> gating even when unscoped. A document shown in a frame is no
				page of its own either: <code>page-title-present</code>, <code>page-title-patterns</code>,{" "}
				<code>html-lang-attr-present</code>, <code>meta-viewport-zoom-enabled</code>,{" "}
				<code>meta-viewport-large</code>, <code>region</code>, <code>bypass-blocks-present</code>,{" "}
				<code>landmark-one-main</code> and <code>page-has-heading-one</code> are{" "}
				<code>notApplicable</code> in it whatever this option says, unless{" "}
				<code>topLevelDocument: true</code> (below) says it is the page. Core 1.15.0 and later.
			</>
		),
	},
	{
		id: "embeddedAriaHidden",
		option: <code>embeddedAriaHidden</code>,
		meaning: (
			<>
				Default <code>false</code>. <code>true</code> says the document is shown in a frame under{" "}
				<code>aria-hidden="true"</code> (on the <code>&lt;iframe&gt;</code> or an element around
				it): every element is read as aria-hidden content is, out of the accessibility tree but
				for what overrides that. Rules about names and roles (<code>img-alt-present</code>,{" "}
				<code>button-name-present</code>, …) then don't apply, and those about what is seen and
				operated (contrast, focus, keyboard) still do. <code>runa11yCoreAcrossFrames</code> sets it
				for such a frame, and a binding that scans frames itself sets it in that frame's{" "}
				<code>engineOptions</code>. The focus such a frame takes is the top page's{" "}
				<code>aria-hidden-focus</code> finding on the <code>&lt;iframe&gt;</code>. Core 1.15.0 and
				later.
			</>
		),
	},
	{
		id: "embeddedInert",
		option: <code>embeddedInert</code>,
		meaning: (
			<>
				Default <code>false</code>. <code>true</code> says the document is shown in a frame under{" "}
				<code>[inert]</code>: every element is read as inert content is, out of the accessibility
				tree and taking no focus, so only the rules about how content looks (contrast, text
				spacing) judge it. <code>runa11yCoreAcrossFrames</code> sets it for such a frame, and
				leaves out a frame behind an open modal dialog, as it leaves out a hidden one; a binding
				that scans frames itself does the same. Core 1.15.0 and later.
			</>
		),
	},
	{
		id: "topLevelDocument",
		option: <code>topLevelDocument</code>,
		meaning: (
			<>
				Unset by default: whether the document is a page of its own. Unset, it is when it is the
				top window's: a document shown in a frame is no page of its own, and the nine rules about
				the page the <code>fragment</code> row names are <code>notApplicable</code> in it. A test
				runner that shows the page under test in a frame of its own, as Cypress does, sets it to{" "}
				<code>true</code> (<code>@surea11y/cypress</code> does it for you); <code>false</code> reads
				a top-level document as a frame's. <code>runa11yCoreAcrossFrames</code> doesn't pass it
				to the frames it scans. Core 1.15.0 and later.
			</>
		),
	},
	{
		id: "excludeSelectors",
		option: <code>excludeSelectors</code>,
		meaning: (
			<>
				Elements matching any of these selectors (and their descendants, including what is in
				their shadow roots, and the documents of frames among them) are skipped entirely, for{" "}
				<strong>every</strong> rule — useful for cookie banners, third-party embeds, or
				known-noisy widgets you don't control. To exclude something from just one specific rule
				instead, use <code>rules[ruleId].excludeSelectors</code> below. An array of selectors, or
				a string holding a selector list: <code>'#cookie-banner, img:not(.a, .b)'</code> is the
				same as <code>['#cookie-banner', 'img:not(.a, .b)']</code>, since the string is cut only
				at the commas between selectors. Each selector applies on its own: one that isn't valid
				CSS excludes nothing, with a <code>console.warn</code>, and the others still apply.
			</>
		),
	},
	{
		id: "styleSheetTexts",
		option: <code>styleSheetTexts</code>,
		meaning: (
			<>
				The text of style sheets the page can't read, <code>{"[{ href, text }]"}</code>: a sheet
				from another origin, by its URL, and its CSS. The rules that read the CSS (
				<code>css-orientation-lock</code>, <code>css-hidden-focus</code>,{" "}
				<code>css-focus-indicator-suppressed</code>) read it in place of the sheet. Each result's{" "}
				<code>engineOptions</code> echoes it as the sheets' hrefs, <code>{"[{ href }]"}</code>,
				without their text. <code>preloadStyleSheets()</code> fetches the ones a server shares
				from inside the page, and <code>runa11yCoreInPageAsync</code> fetches them before
				scanning; a tool driving the browser can fetch the others from outside it. See{" "}
				<a href={`${core}/docs/INTEGRATION.md#style-sheets-from-another-origin`}>
					"Style sheets from another origin"
				</a>{" "}
				in core's integration guide on GitHub. Core 1.14.0 and later.
			</>
		),
	},
	{
		id: "timestamp",
		option: <code>timestamp</code>,
		meaning: (
			<>
				Passed straight through to the result's top-level <code>timestamp</code> field; the
				engine does not generate one itself (deterministic-by-design). A value that isn't a string
				(a <code>Date</code>, a number) is ignored with a <code>console.warn</code>; pass{" "}
				<code>new Date().toISOString()</code>.
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
				will double-check flagged cases, not for unattended CI gating. A page that paints no
				opaque background is not such a case: the canvas behind it follows from the page's own
				color scheme, so its text is measured in either mode without a guess. Where the page's
				canvas can't be known (in a frame, under forced colors), <code>auditorAssist</code>{" "}
				measures text on <code>contrast.rootCanvasFallback</code>, recorded as{" "}
				<code>ROOT_CANVAS_FALLBACK</code>.
			</>
		),
	},
	{
		id: "contrast-fallback",
		option: <code>contrast.rootCanvasFallback</code>,
		meaning: (
			<>
				A canvas color for a page that paints no opaque background. Unset, the contrast rules
				measure such a page's text on the canvas the browser paints behind it, in either mode: the
				canvas of the color scheme the page is drawn in, which its own <code>color-scheme</code>{" "}
				(on the root, or the <code>&lt;meta&gt;</code> form) decides. A page that declares none is
				drawn in light, on white, whatever the user prefers; <code>light dark</code> is drawn on
				white for a user in light and on the dark canvas for one in dark, and its text is measured
				in both schemes, failing where it fails in either (<code>data.details.colorScheme</code>{" "}
				names the one). Under jsdom, which resolves no system color, the engine uses Chromium's
				colors, and text whose colors it can't work out there is asked about (
				<code>COLOR_SCHEME_NOT_RENDERED</code>). Set, white included, the color stands for the
				page's canvas in every scheme: the text is measured on it once, recorded as an assumption (
				<code>ROOT_CANVAS_FALLBACK</code>). The page's canvas can't be known in a frame, whose
				canvas can let the parent page show through, or under forced colors: there{" "}
				<code>contrast-computable</code> asks and the ratio rules leave the text out, unless{" "}
				<code>auditorAssist</code> measures it on this color. Each result's{" "}
				<code>engineOptions.contrast</code> echoes the color used, white when none was given.
			</>
		),
	},
	{
		id: "contrast-fallback-set",
		option: <code>contrast.rootCanvasFallbackSet</code>,
		meaning: (
			<>
				Echoed on each result: <code>true</code> when <code>contrast.rootCanvasFallback</code> is
				the caller's, <code>false</code> for the default white (also when the given value wasn't a
				usable color). It isn't needed as an input: options passed back from a result's echo are
				read as they were, so <code>false</code> keeps the echoed white the default. A value that
				isn't <code>true</code> or <code>false</code> is warned about and read as not given. Core
				1.14.0 and later.
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
				Unset (the default), it is <code>'styleAndGeometry'</code> where the page has a layout,
				which is any browser scan, and <code>'styleOnly'</code> where it has none (jsdom): a
				reader only sees text that is drawn somewhere visible, which only the layout can tell.{" "}
				<code>'styleOnly'</code>: eligibility is CSS-only — <code>display</code>,{" "}
				<code>visibility</code>, <code>opacity</code>, ancestor-hiding, etc.{" "}
				<code>'styleAndGeometry'</code>: adds real layout checks (
				<code>getClientRects()</code>/<code>getBoundingClientRect()</code>) on top of that — text
				with no client rects, or zero width/height, is excluded too, and so is text entirely
				above or left of the page, where no scrolling reaches (the <code>left: -9999px</code>{" "}
				technique), and text an ancestor with <code>overflow: hidden</code> or{" "}
				<code>clip</code> cuts off completely (<code>height: 0; overflow: hidden</code>, a
				carousel slide out of view). A box that scrolls (<code>auto</code>,{" "}
				<code>scroll</code>) does not exclude its text, since a reader can reach it. The options
				of a <code>&lt;select&gt;</code> are judged by their <code>&lt;select&gt;</code>'s place on
				the page. In both
				modes, text with a font size of 0 or a fully transparent color is excluded, since nothing
				is drawn; transparent text that lets a background show through its glyphs (
				<code>background-clip: text</code>, on it or an ancestor) is not: it is measured in that
				background's color when it is solid, and asked about when it is a gradient or an
				image. Set{" "}
				<code>'styleOnly'</code> in a browser to check text from computed styles alone, as
				earlier releases did; under plain jsdom (<code>runDomRulesInPage</code>) there's no real
				layout engine, so <code>'styleAndGeometry'</code> mostly just adds{" "}
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
			id: "output-detail",
			option: <code>output.detail</code>,
			meaning: (
				<>
					<code>'full'</code> (default) or <code>'findings'</code>: a smaller result, keeping whole
					only the check results that report something (<code>fail</code>, <code>cantTell</code>,
					and any listing occurrences); every other <code>pass</code> and{" "}
					<code>notApplicable</code> keeps its <code>ruleId</code>, <code>outcome</code> and{" "}
					<code>type</code>, and its <code>margin</code> or <code>error</code> if it has one.
					Rollups and verdicts are unchanged, and the reporters read it as a full result. A rule
					core's catalog couldn't fill back in stays whole: every rule of a scan with{" "}
					<code>packs</code>, a custom rule, and one the scan's <code>messages</code> reword. See{" "}
					<a href="/results-reports/output-schema/#top-level-result"><code>engine.outputDetail</code></a>;
					in TypeScript, such a result is a <code>CompactScanResult</code>.
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
				decided at 4.5:1. A standard with other thresholds has its own rule, a variant, which a{" "}
				<a href="/configuration/packs/">pack</a> can bring. A key is matched as a rule id is, in
				any case or with the legacy <code>a11ycore-</code> prefix; one naming no rule of the scan
				is warned about with the closest id.
			</>
		),
	},
	{
		id: "packs",
		option: <code>packs</code>,
		meaning: (
			<>
				Optional packs from <code>@surea11y/core/pack</code>: rules, variants of core's rules, a
				standard or a checklist and messages from outside core, which join the scan. A list: the
				pack objects for <code>runDomRulesInPage</code> and the catalog functions in Node, and for{" "}
				<code>runa11yCoreInPage</code> the <code>name@version</code> of packs a{" "}
				<code>packScript</code> registered in the page. Anything else runs no pack, with a
				warning, and throws under <code>strictOptions</code>, with{" "}
				<code>code: 'INVALID_ENGINE_OPTIONS'</code>. Reported back as <code>engine.packs</code>.
				See <a href="/configuration/packs/">Packs</a>.
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
				to look for generic and templated titles across a site. A pack's rules may read probes of
				their own, which the pack documents.
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
				results between runs. With <code>profileRules</code>, the shared caches (computed styles
				and accessibility-tree eligibility) are filled before the first rule and timed apart as{" "}
				<code>perfStats.warmUpMs</code>, so their cost isn't charged to whichever rule walks the
				page first.
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
				This page documents <code>engineOptions</code> and <code>runOnly</code> in full. To check
				a page against a WCAG version and level, start with{" "}
				<a href="#selecting-by-wcag-target-runonlywcag"><code>runOnly.wcag</code></a>.
			</p>

			<h2 id="selecting-which-rules-run">Selecting which rules run</h2>
			<p>
				Name what you are testing against, and the engine picks the rules. With no selection,
				the default rules run: every rule except the opt-in rules of a standard or a pack, which
				run only once unlocked (see <a href="#opt-in-rules">Opt-in rules</a>).
			</p>
			<DataTable
				label="Choosing what runs"
				rowKey="id"
				columns={[
					{ key: "run", label: "To run", wrap: true },
					{ key: "pass", label: "Pass", wrap: true },
				]}
				rows={[
					{ id: "all", run: "The default rules: every rule except opt-in ones not unlocked", pass: <>nothing: <code>runOnly</code> <code>null</code></> },
					{
						id: "wcag",
						run: "A WCAG conformance target: the rules for the criteria of a version at a level and below",
						pass: <code>{"runOnly: { wcag: { version: '2.2', level: 'AA' } }"}</code>,
					},
					{
						id: "wcag-bp",
						run: "The same, and the best-practice rules, which test no WCAG criterion",
						pass: <code>{"runOnly: { wcag: { version: '2.2', level: 'AA' }, bestPractices: true }"}</code>,
					},
					{ id: "bp", run: "The best-practice rules only", pass: <code>{"runOnly: { bestPractices: true }"}</code> },
					{
						id: "profile",
						run: "A standard built on WCAG (EN 301 549, Section 508)",
						pass: <code>{"engineOptions: { profile: 'en301549-v4.1.1' }"}</code>,
					},
					{
						id: "profile-bp",
						run: "The same, and the best-practice rules",
						pass: (
							<>
								<code>{"engineOptions: { profile: 'en301549-v4.1.1' }"}</code>,{" "}
								<code>{"runOnly: { bestPractices: true }"}</code>
							</>
						),
					},
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.2 AA, with the best practices:",
					"runDomRulesInPage(url, null, {}, {",
					"  wcag: { version: '2.2', level: 'AA' },",
					"  bestPractices: true",
					"});",
				]}
			/>
			<p>
				Every rule either tests WCAG criteria or is a best practice, so{" "}
				<code>{"{ wcag: { version: '2.2', level: 'AAA' }, bestPractices: true }"}</code> runs every
				rule but those for 4.1.1 Parsing, which WCAG 2.2 removed. For anything finer, such as a
				single criterion, a list of rules, or an exclusion, see{" "}
				<a href="#advanced-selection-tags-and-rule-ids">"Advanced selection: tags and rule ids"</a>;
				those fields combine with the ones above. A scan that names rules reports the criteria
				they check too (<a href="#which-criteria-a-scan-reports">"Which criteria a scan reports"</a>).
			</p>

			<h3 id="selecting-by-wcag-target-runonlywcag">Selecting by WCAG target (<code>runOnly.wcag</code>)</h3>
			<p>
				<code>runOnly.wcag</code> names a WCAG version and conformance level, and selects the rules
				for that target's criteria:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.2 Level A and AA:",
					"runDomRulesInPage(url, null, {}, { wcag: { version: '2.2', level: 'AA' } });",
				]}
			/>
			<ul>
				<li>
					<code>version</code> is <code>'2.0'</code>, <code>'2.1'</code> or <code>'2.2'</code>;{" "}
					<code>level</code> is <code>'A'</code>, <code>'AA'</code> or <code>'AAA'</code> (in any
					case).
				</li>
				<li>
					A rule is selected when one of the criteria it names is part of the target: in force in
					that version (introduced in it or before, and not removed in it or before), at the
					target's level or below, by the level the criterion has <strong>in that version</strong>.
					The levels come from <code>WCAG_CRITERIA</code> in <code>@surea11y/core/wcag</code>, which
					has a level per version.
				</li>
				<li>
					So 4.1.1 Parsing, which 2.2 removed, is part of <code>{"{ version: '2.1' }"}</code>{" "}
					targets and not of <code>{"{ version: '2.2' }"}</code> ones: <code>duplicate-id</code>{" "}
					runs for the first and not for the second, where the version tags would run it.
				</li>
				<li>
					A rule that names no criterion (a best-practice rule) is not part of any target. Add those
					with <code>bestPractices: true</code> (next section), or single rules with{" "}
					<code>tags</code> or <code>includeRuleIds</code>: beside <code>wcag</code>, all of them
					select rules <strong>as well</strong>, the union of the target's rules and what the others
					select. <code>excludeTags</code>, <code>excludeRuleIds</code> and{" "}
					<code>excludeTestIds</code> apply after, as always.
				</li>
				<li>
					The target's version is the run's WCAG target (<code>engine.wcagVersion</code>), unless{" "}
					<code>engineOptions.wcagVersion</code> is set; its level decides which WCAG rollups are
					reported, as a level tag does, unless <code>engineOptions.wcagLevel</code> is set (
					<a href="#giving-the-level-of-a-scan-that-names-checks-wcaglevel">
						"Giving the level of a scan that names checks"
					</a>
					).
				</li>
				<li>
					A target includes rules, so it selects them instead of <code>engineOptions.profile</code>,
					as <code>tags</code> do. <code>getProfileWcagTarget(profile)</code> gives the target a
					profile comes to (see <a href="#conformance-profiles">"Conformance profiles"</a>), and{" "}
					<code>getChecksForRunOnly(runOnly, engineOptions)</code> lists the rules a{" "}
					<code>runOnly</code> with <code>wcag</code> runs, and{" "}
					<code>getRulesForRunOnly(runOnly, engineOptions)</code> the rollups it reports.
				</li>
				<li>
					Anything else throws <code>INVALID_RUN_ONLY</code>, naming what is wrong:{" "}
					<code>runOnly.wcag.version must be "2.0", "2.1" or "2.2", not "3.0".</code>
				</li>
			</ul>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.1 AA, plus the best-practice rules, without one of them:",
					"{ wcag: { version: '2.1', level: 'AA' }, tags: ['best-practice'], excludeRuleIds: ['region'] }",
				]}
			/>

			<h3 id="adding-the-best-practices-runonlybestpractices">Adding the best practices (<code>runOnly.bestPractices</code>)</h3>
			<p>
				<code>bestPractices: true</code> selects the best-practice rules: the rules that name no
				WCAG criterion, such as <code>region</code>, <code>landmark-one-main</code>,{" "}
				<code>heading-order</code>, <code>page-has-heading-one</code>, <code>skip-link</code>,{" "}
				<code>tabindex</code> and <code>image-redundant-alt</code>. They are the rules tagged{" "}
				<code>best-practice</code>, so it is the same as adding that tag. A finding from one of them
				is good practice, not a WCAG failure: no WCAG rollup counts it. Most report{" "}
				<code>cantTell</code>; one whose finding is itself a barrier reports <code>fail</code>, as{" "}
				<code>empty-heading</code> does for a heading with no name.
			</p>
			<ul>
				<li>
					Beside <code>wcag</code>, <code>tags</code> or rule ids, it adds those rules to what they
					select; excludes apply after, so <code>excludeRuleIds: ['region']</code> still leaves{" "}
					<code>region</code> out.
				</li>
				<li>On its own it selects the best-practice rules only.</li>
				<li>
					<code>false</code>, or leaving it out, adds nothing. On its own,{" "}
					<code>{"{ bestPractices: false }"}</code> is an empty selection, so the default rules run,
					as with <code>{"{}"}</code>.
				</li>
				<li>
					Any other value throws <code>INVALID_RUN_ONLY</code>:{" "}
					<code>runOnly.bestPractices must be true or false, not "yes".</code>
				</li>
				<li>
					Beside <code>engineOptions.profile</code>, it adds the best-practice rules to the
					profile's, and the profile still applies: its rules, its rollups, its mappings and{" "}
					<code>engine.profile</code>, as without it. <code>{"{ bestPractices: true }"}</code> with{" "}
					<code>profile: 'en301549-v4.1.1'</code> runs that standard and the best practices. The
					best-practice rules count in none of the profile's rollups, as they test no WCAG
					criterion.
				</li>
			</ul>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.1 AA and the best practices, without one of them:",
					"{ wcag: { version: '2.1', level: 'AA' }, bestPractices: true, excludeRuleIds: ['region'] }",
				]}
			/>

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
					{ key: "wcagTarget", label: "getProfileWcagTarget", wrap: true },
					{ key: "why", label: "Why", wrap: true },
				]}
				rows={[
					{
						profile: <code>wcag22-a</code>,
						tags: (
							<>
								<code>wcag2a</code>, <code>wcag21a</code>, <code>wcag22a</code>
							</>
						),
						target: "2.2",
						wcagTarget: <code>{"{ version: '2.2', level: 'A' }"}</code>,
						why: "WCAG 2.2 Level A",
					},
					{
						profile: <code>wcag22-aa</code>,
						tags: (
							<>
								<code>wcag2a</code>, <code>wcag2aa</code>, <code>wcag21a</code>, <code>wcag21aa</code>,{" "}
								<code>wcag22a</code>, <code>wcag22aa</code>
							</>
						),
						target: "2.2",
						wcagTarget: <code>{"{ version: '2.2', level: 'AA' }"}</code>,
						why: "WCAG 2.2 Level A and AA",
					},
					{
						profile: <code>wcag22-aaa</code>,
						tags: (
							<>
								the <code>wcag22-aa</code> tags and <code>wcag2aaa</code>, <code>wcag21aaa</code>,{" "}
								<code>wcag22aaa</code>
							</>
						),
						target: "2.2",
						wcagTarget: <code>{"{ version: '2.2', level: 'AAA' }"}</code>,
						why: "WCAG 2.2 Level A, AA and AAA",
					},
					{
						profile: <code>en301549-v4.1.1</code>,
						tags: (
							<>
								same as <code>wcag22-aa</code>
							</>
						),
						target: "2.2",
						wcagTarget: <code>{"{ version: '2.2', level: 'AA' }"}</code>,
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
						wcagTarget: <code>{"{ version: '2.1', level: 'AA' }"}</code>,
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
						wcagTarget: <code>{"{ version: '2.0', level: 'AA' }"}</code>,
						why: "The Revised 508 Standards incorporate WCAG 2.0 A and AA",
					},
				]}
			/>
			<p>
				<code>getProfileWcagTarget(profile)</code> gives the <code>runOnly.wcag</code> target a
				profile's tag set comes to, or <code>null</code> for a name that is no profile. Each WCAG
				level includes the ones below it, as WCAG's levels do: <code>wcag22-aaa</code> runs every
				rule of <code>wcag22-aa</code> and adds the AAA ones, so a scan names one level, not
				several. <code>wcag22-a</code> and <code>wcag22-aaa</code> are new in core 1.15.0. A profile
				still selects by its tags, as in the table: under <code>wcag22-aa</code> (and{" "}
				<code>wcag22-a</code> and <code>wcag22-aaa</code>), <code>duplicate-id</code> (4.1.1) runs
				and cannot <code>fail</code>, while{" "}
				<code>{"{ wcag: getProfileWcagTarget('wcag22-aa') }"}</code> leaves it out.
			</p>
			<CodeBlock lang="js" lines={["runDomRulesInPage(url, null, { profile: 'en301549-v3.2.1' }, null);"]} />
			<Callout tone="note" title="Deprecated">
				<p>
					<code>en301549-v4.1.1</code> and <code>en301549-v3.2.1</code> move to EN 301 549's pack,{" "}
					<a href={pack}><code>@surea11y/pack-en301549</code></a>, and leave core in 2.0.0. They work as before, with one{" "}
					<code>console.warn</code> per process. Given the pack (<code>{"packs: [en301549]"}</code>), a scan
					takes the same names from it and shows no notice; the pack's profiles report a result per
					clause in place of the WCAG rollups. See <a href={`${core}/docs/API_STABILITY.md#deprecating-a-standard-a-profile-or-an-entry-point`}>how core deprecates a standard</a>.
				</p>
			</Callout>
			<p>
				A <a href="/configuration/packs/">pack</a>'s standard or checklist brings its own profiles
				to this list.
			</p>
			<h4 id="several-profiles">Several profiles at once</h4>
			<p>
				<code>profile</code> also takes a list, with the packs that bring them in{" "}
				<code>packs</code>: one scan then judges the page by WCAG and by WAI-ARIA, by EN 301 549 and
				your own policy, or by two versions of one standard while you move from one to the other.
				Each profile judges the page as a scan of it alone would, and the result reads as one
				profile with the rules of all: a check's <code>outcome</code> is the worst its profiles give
				it, and each finding's <code>verdicts</code> say what each profile makes of it (
				<a href="/results-reports/output-schema/#several-profiles">Output schema</a>). Core 1.15.0
				and later.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const waiAria = require('@surea11y/pack-wai-aria');",
					"",
					"const result = runDomRulesInPage(url, null, {",
					"  packs: [waiAria],",
					"  profile: ['wcag22-aa', 'wai-aria-1.2']",
					"});",
					"// <div role=\"group\" aria-checked=\"true\">: an attribute the role doesn't",
					"// support, a question for WCAG 4.1.2 and a failure of WAI-ARIA.",
					"result.checksResults.find((c) => c.ruleId === 'aria-allowed-attr').verdicts;",
					"// { 'wcag22-aa': 'cantTell', 'wai-aria-1.2': 'fail' }",
				]}
			/>
			<p>
				Each profile is scanned in turn, on the same page, so the scan takes about as long as one
				per profile. A profile that doesn't apply (no such profile, its pack skipped, or a{" "}
				<code>runOnly</code> include choosing the rules instead) is listed in{" "}
				<code>engine.profilesNotRun</code> with the reason, and the others still run; SARIF, JUnit,
				the CLI and the test matchers treat such a scan as an error, since it judged less than it
				was asked to. A list of one is its one name, and scans exactly as before. The{" "}
				<a href="/configuration/packs/#wai-aria-pack">WAI-ARIA pack</a> is the case it was built
				for.
			</p>
			<p>
				The WCAG target follows from the tags the same way it does for a hand-written set (see{" "}
				<a href="#filtering-by-wcag-version">"Filtering by WCAG version"</a> below), so{" "}
				<code>en301549-v3.2.1</code> targets WCAG 2.1 and <code>en301549-v4.1.1</code> WCAG 2.2.
				A duplicate id can still <code>fail</code> under <code>en301549-v3.2.1</code> because its
				profile keeps 4.1.1's text (<code>keepsParsing</code>,{" "}
				<a href="#parsing-errata">see below</a>); under <code>en301549-v4.1.1</code> it cannot. A pack's profile can name its version instead, with{" "}
				<code>wcagVersion</code> (<a href="/configuration/packs/#profiles">Packs</a>): a profile
				that runs only the rules its standard maps has no WCAG tags to imply one. Names are matched
				case-insensitively. A run that used a profile reports it back as{" "}
				<code>engine.profile</code>.
			</p>
			<p>
				Precedence: anything that <em>includes</em> rules selects them instead of the profile — a{" "}
				<code>runOnly</code> with <code>wcag</code>, <code>tags</code>, <code>includeRuleIds</code> or{" "}
				<code>includeTestIds</code>, or an <code>include</code> in{" "}
				<code>engineOptions.rules</code>/<code>.tags</code>/<code>.tests</code>. Excludes still
				apply on top of the profile, whether they come from <code>runOnly</code> (
				<code>excludeTags</code>, <code>excludeRuleIds</code>, <code>excludeTestIds</code>, so a
				binding's <code>disableTags()</code> narrows the profile rather than replacing it) or, when
				there is no <code>runOnly</code> filter, from <code>engineOptions</code> (
				<code>tags.exclude</code>, <code>rules.exclude</code>, <code>tests.exclude</code>), and an
				explicit <code>engineOptions.wcagVersion</code> still wins over the version the profile
				implies or names. A profile that does not take effect — an unknown name, or one overridden as above
				— is not an error: the run proceeds as if none was given, logs a{" "}
				<code>console.warn</code> saying why, and carries no <code>engine.profile</code>.{" "}
				<code>runOnly.bestPractices: true</code> is not an include of that kind: it adds the
				best-practice rules to the profile's, and the profile applies (
				<a href="#adding-the-best-practices-runonlybestpractices">"Adding the best practices"</a>).
			</p>
			<p>
				A standard's profile may also leave rules out, when its standard waives a WCAG criterion or
				replaces a WCAG check with its own: the rules it names, the rules whose every criterion it
				waives, and the waived criteria's WCAG rollups do not run, and the rule catalog leaves them
				out too. A rule that also checks a criterion the profile keeps still runs (
				<code>link-name-present</code>, which checks 2.4.4 and 4.1.2, under a profile waiving
				2.4.4), and <code>engine.profileExcludes</code> names what was left out. No built-in
				profile excludes anything today.
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
				<a href="#other-standards-mappings">"Other standards"</a> below. Any standard's profile
				switches on its own version the same way. A profile with <code>mappedRules</code> also
				runs, whatever their tags, the rules its standard is mapped to: the ones with no WCAG
				mapping, such as <code>heading-order</code> and <code>skip-link</code>, have no WCAG tag to
				be selected by. A standard with requirements of its own, or an organisation's checklist,
				comes to the engine as a <a href="/configuration/packs/">pack</a>, bringing its own profile
				names, rules and rollups. The engine ships no such standard itself.
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
					by the id of one of its standard's own rollups that groups it (
					<code>{"rules: { include: '<rollup id>' }"}</code> runs that rollup's rules, opt-in or
					not), or
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
				use the standard's profile: under a tag alone, its own rollups report <code>cantTell</code>{" "}
				for any requirement whose rules did not run. A rule added through <code>customRules</code>{" "}
				that carries the tag follows the same gate. None of the engine's built-in standards has
				opt-in rules today; a pack's namespace tag works this way.
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
				opt-in tag is ignored with a <code>console.warn</code>. Only this engine option unlocks:{" "}
				<code>runOnly</code> has no <code>optInTags</code> key, so one given there is an unknown
				key, which throws <code>INVALID_RUN_ONLY</code> on its own and is ignored with a warning
				beside keys <code>runOnly</code> reads, the message pointing to{" "}
				<code>engineOptions.optInRules</code>.
			</p>
			<p>
				This is for seeing everything the engine can report, during development or when exploring
				a site. <strong>It is not a conformance target</strong>: such a run fails a page for things
				WCAG allows and only another standard forbids. The result says so:{" "}
				<code>engine.optInRules</code> lists the tags whose rules ran, and the HTML report, SARIF
				and JUnit show it next to the profile. It adds no other standard's numbers to results; pass{" "}
				<code>mappings</code> for that, for example{" "}
				<code>{"{ optInRules: 'all', mappings: ['<key>'] }"}</code>.
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
			<Callout tone="note" title="Deprecated">
				<p>
					The <code>en301549</code> mappings move to EN 301 549's pack, <a href={pack}><code>@surea11y/pack-en301549</code></a>, and leave core in
					2.0.0. They work as before, with one <code>console.warn</code> per process. Given the pack,{" "}
					<code>mappings: ['en301549']</code> takes the same name and gives every result the same
					entries, with no notice.
				</p>
			</Callout>
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
				<code>getRulesCatalog(engineOptions)</code>,{" "}
				<code>getRulesForRunOnly(runOnly, engineOptions)</code> and{" "}
				<code>getCompositeRuleById(id, engineOptions)</code> name the standards a scan with those
				options would, a profile included when it would apply, so a catalog entry and a result
				always agree. With no options they name WCAG only. A rule added through{" "}
				<code>customRules</code> keeps exactly the mappings it declares. What the clauses are and
				how the two versions differ is on{" "}
				<a href="/conformance/wcag-mapping/#en-301-549">WCAG mapping</a>.
			</p>

			<h2 id="advanced-selection-tags-and-rule-ids">Advanced selection: tags and rule ids</h2>
			<p>
				The fields below select by the tags rules carry and by rule ids. Reach for them for what a
				WCAG target and <code>bestPractices</code> don't say: one criterion (
				<code>tags: ['wcag1412']</code>), a list of rules, an exclusion, or a tag set of your
				own. They combine with <code>wcag</code> and <code>bestPractices</code>: what they
				include is added to what those select, and what they exclude is taken away after.
			</p>
			<p>
				There are <strong>two independent ways</strong> to give them — the 4th argument (
				<code>runOnly</code>), or <code>engineOptions.rules</code>/<code>.tags</code>/
				<code>.tests</code>/<code>.includeMode</code>. If <code>runOnly</code> contains any
				filter, it wins outright; otherwise the engine falls back to <code>engineOptions</code>.{" "}
				<strong>Don't mix them expecting both to apply — pick one.</strong>{" "}
				<code>engineOptions.rules</code>, <code>.tags</code> and <code>.tests</code> take{" "}
				<code>{"{ include, exclude }"}</code>; a bare list or string is the include list.
			</p>

			<h3 id="via-runonly-4th-argument">Via <code>runOnly</code> (4th argument)</h3>
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
				A bare array or string works as shorthand:{" "}
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
					{
						field: <code>wcag</code>,
						type: <code>{"{ version, level }"}</code>,
						meaning: "A WCAG conformance target: the rules for the criteria of that version at that level and below. See Selecting by WCAG target, above.",
					},
					{
						field: <code>bestPractices</code>,
						type: <code>boolean</code>,
						meaning: "true adds the best-practice rules. See Adding the best practices, above.",
					},
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
				An include list (<code>includeRuleIds</code>, <code>includeTestIds</code>,{" "}
				<code>tags</code>, the legacy <code>values</code>, <code>rules.include</code>,{" "}
				<code>tags.include</code>) in which no value names a rule or a tag (one a rule or a rollup
				carries, so a standard's tag is known though only its rollups carry it) throws, with <code>code: 'INVALID_RUN_ONLY'</code> and a
				message naming the field and the values, since it would select nothing and a run of no
				rules reads as a clean pass. A selection whose names all exist but whose parts cancel each
				other (a rule both included and excluded, rules and tags with no rule in common under{" "}
				<code>includeMode: 'and'</code>) also runs no rule: the scan warns, naming the parts, and
				throws <code>INVALID_RUN_ONLY</code> under <code>strictOptions</code>.{" "}
				<code>includeMode</code> is <code>'and'</code> or <code>'or'</code>; another value is read as{" "}
				<code>'and'</code>, with a warning, and throws under <code>strictOptions</code>; in a browser
				binding, <code>.includeMode('or')</code> sets it. A value that
				names nothing beside ones that do, or in an exclude list, is ignored with a{" "}
				<code>console.warn</code>. Before 1.10.0 every such value was ignored silently.
			</p>
			<p>
				The nine WCAG version/level tags, <code>wcag2a</code> to <code>wcag22aaa</code>, are always
				known, whether or not a rule carries one. Some carry none today (<code>wcag21aaa</code>,{" "}
				<code>wcag22a</code>, <code>wcag22aaa</code>): their criteria have no automated rule, which
				is not a typo. In an include list beside other values, such a tag is noted with a{" "}
				<code>console.info</code>, not warned about:
			</p>
			<CodeBlock
				lines={['[surea11y] runOnly.tags: no rules for WCAG 2.2 Level A ("wcag22a"); its criteria need manual review.']}
			/>
			<p>
				<code>engineOptions.logUntestedWcag: false</code> leaves that line out. When every value of
				an include list is such a tag, nothing would run, so it still throws{" "}
				<code>INVALID_RUN_ONLY</code>, saying why. Beside a <code>runOnly.wcag</code> target or{" "}
				<code>bestPractices: true</code>, which select rules of their own, it is only noted. In an
				exclude list it is left alone.
			</p>
			<p>
				Rule IDs are bare (no engine prefix), e.g. <code>'img-alt-present'</code>. For backward
				compatibility, matching also accepts a legacy <code>a11ycore-</code>-prefixed form of the
				same id (<code>'a11ycore-img-alt-present'</code>). Ids are matched in any case, as tags
				are: <code>'IMG-ALT-PRESENT'</code> selects <code>img-alt-present</code>, in every list that
				names rules (<code>runOnly</code> in each form, <code>engineOptions.rules</code> and{" "}
				<code>engineOptions.tests</code>, include and exclude). No two rules have ids that differ
				only in case, so this can't select the wrong one.
			</p>
			<p>
				The <strong><code>{"{ type, values }"}</code> shape</strong> is also accepted as
				the whole <code>runOnly</code> value:{" "}
				<code>{"{ type: 'tag', values: ['wcag2a', 'wcag2aa'] }"}</code> is{" "}
				<code>{"{ tags: ['wcag2a', 'wcag2aa'] }"}</code>, and{" "}
				<code>{"{ type: 'rule', values: ['img-alt-present'] }"}</code> is{" "}
				<code>{"{ includeRuleIds: ['img-alt-present'] }"}</code> (<code>'tags'</code> and{" "}
				<code>'rules'</code> work too). <code>values</code> may be a comma-separated string, its
				names are checked like any rule ids or tags, and the other keys beside it (
				<code>excludeTags</code>, <code>excludeRuleIds</code>...) still apply. A <code>Set</code> of
				names is read as the list it holds. A key the object form doesn't read, beside ones it
				does, is ignored with a warning. Any other <code>type</code> throws{" "}
				<code>INVALID_RUN_ONLY</code>, and so does a <code>runOnly</code> that is a number or a
				boolean, or an object none of whose keys the engine reads (
				<code>{"{ includeRuleId: [...] }"}</code>): each used to run every rule. An empty array,
				string or object still means the default selection.
			</p>

			<h3 id="which-criteria-a-scan-reports">Which criteria a scan reports</h3>
			<p>
				A scan reports a criterion's rollup (<code>rulesResults</code>) when the selection selects
				it: a WCAG target or a version/level tag, a profile, the rollup's own id, or no selection at
				all. It also reports the rollup of each criterion that a rule the selection{" "}
				<strong>named on its own</strong> checks, when that rule ran:
			</p>
			<ul>
				<li>
					by its id (<code>includeRuleIds</code>, <code>includeTestIds</code>,{" "}
					<code>rules.include</code>, or a profile's own rule list),
				</li>
				<li>
					by a tag that is not a WCAG tag (a custom rule's, a pack's or a standard's; WCAG's tags
					are the version/level tags, the criterion tags such as <code>wcag244</code>, and{" "}
					<code>wcag22-removed</code>, so a custom tag such as <code>wcagteam</code> is not one),
				</li>
				<li>
					by <code>optInRules</code>, or
				</li>
				<li>
					as a best-practice rule (<code>bestPractices</code>).
				</li>
			</ul>
			<p>
				A rule a standard's profile runs only because its standard maps it (
				<code>mappedRules</code>) is named for that standard, not on its own: it adds the
				standard's requirements and none of its WCAG criteria. So a profile that runs only what its
				standard asks for reports that standard alone (
				<a href="/configuration/packs/#profiles">Packs</a>); a rule its <code>rules</code> list
				names adds its WCAG criteria too. Before 1.12.0, a scan that named rules rather than
				criteria had an empty <code>rulesResults</code>.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// The unnamed link fails link-name-present, and with it 2.4.4 and 4.1.2:",
					"runDomRulesInPage(url, null, {}, { includeRuleIds: ['link-name-present'] });",
					"// rulesResults: wcag-2.4.4-link-purpose-in-context: fail, wcag-4.1.2-name: fail",
				]}
			/>
			<ul>
				<li>
					<strong>The verdict is the rollup's own.</strong> A failing rule fails the criterion. A
					rule that passes doesn't make it pass when the scan left out the criterion's other rules:
					it is <code>cantTell</code>, with <code>reasonCode</code>{" "}
					<code>composite.rollup.cantTell.notSelectedChild</code>, and each rule the scan didn't
					select is listed among the contributors as <code>missing</code> with{" "}
					<code>notSelected: true</code>. With all of them selected and passing, a WCAG criterion
					is still <code>cantTell</code> (<code>composite.rollup.cantTell.partialCheck</code>),
					since no criterion's rules yet check all it asks (see{" "}
					<a href="/conformance/wcag-mapping/">WCAG conformance mapping</a>). The HTML report shows "Partly checked: 1 of 2 checks was
					not selected for this scan" under it. See{" "}
					<a href="/results-reports/output-schema/#partly-checked">the output schema</a>.
				</li>
				<li>
					<strong>A criterion tag names its own criterion.</strong> <code>tags: ['wcag244']</code>{" "}
					reports 2.4.4, and not the other criteria its rules check (4.1.2 for{" "}
					<code>link-name-present</code>). A rule brought in by a rollup's id, a WCAG target, a
					version or level tag, or a WCAG profile adds no criterion: the selection names the
					criteria there. So a scan that selects its criteria reports what it reported before.
				</li>
				<li>
					<strong>The run's WCAG version and level apply.</strong> A criterion is added only if it
					is in force in <code>engine.wcagVersion</code> (<code>duplicate-id</code> alone adds no
					4.1.1 under 2.2, and does under <code>wcagVersion: '2.1'</code>), and at or below the
					run's level, as a target would: <code>engineOptions.wcagLevel</code> when given (next
					section), else the level the selection gives (<code>runOnly.wcag.level</code>, or the
					version/level tags beside the rule ids). With neither, every level is reported.
				</li>
				<li>
					<strong>Excludes apply.</strong> A rollup the selection excludes (
					<code>{"excludeRuleIds: ['wcag-4.1.2-name']"}</code>, or a tag) is not added. A rule the
					caller excluded counts as not selected. A rule a profile excludes narrows the criterion:
					it is <code>missing</code> without <code>notSelected</code>, and a criterion the profile
					waives is never added.
				</li>
				<li>
					<strong>A standard's own rollups</strong> (one per requirement) are added the same way,
					but only while the standard is in play: the applied profile targets it, or the selection
					names its tag or <code>optInRules</code> unlocks it. A WCAG scan never shows the
					requirements of a standard nobody asked for. A profile that didn't apply, and{" "}
					<code>mappings</code> alone, don't put a standard in play. Under its profile, only the
					profile's version is added; unlocked without a profile, every version is, as a scan
					selected by its tag reports them. This holds for a standard or checklist from a pack as
					for one built in: a checklist profile that names its rules (<code>tags: []</code>,{" "}
					<code>{"rules: [...]"}</code>) gets their WCAG criteria and its own items.
				</li>
				<li>
					<strong>The list before the scan.</strong>{" "}
					<code>getRulesForRunOnly(runOnly, engineOptions)</code> lists the rollups a scan with
					that selection and those options reports, the added ones included, as{" "}
					<code>getRulesCatalog</code> entries. It works them out with the scan's own rollup step,
					so the two agree; <code>getChecksForRunOnly</code> lists the rules.{" "}
					<code>getRulesCatalog(engineOptions)</code> lists every rollup the options make
					available, whatever the selection. A tool can record what a scan checks before running
					it; the browser bindings' builders give the same lists as <code>plannedChecks()</code>{" "}
					and <code>plannedCriteria()</code>.
				</li>
			</ul>

			<h3 id="giving-the-level-of-a-scan-that-names-checks-wcaglevel">
				Giving the level of a scan that names checks (<code>wcagLevel</code>)
			</h3>
			<p>
				A scan meant as WCAG 2.2 AA that runs only some checks names them, and gives the version
				in <code>engineOptions.wcagVersion</code>. That says no level, so the criteria of those
				checks are reported at every level: <code>contrast-computable</code> checks 1.4.3 (AA) and
				1.4.6 (AAA), and both are reported. <code>engineOptions.wcagLevel</code> gives the level:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// Only the contrast checks of a WCAG 2.2 AA scan: 1.4.3 is reported, 1.4.6 is not.",
					"runDomRulesInPage(url, null,",
					"  { wcagVersion: '2.2', wcagLevel: 'AA' },",
					"  { includeRuleIds: ['contrast-computable'] });",
				]}
			/>
			<ul>
				<li>
					<strong>Values.</strong> <code>'A'</code>, <code>'AA'</code> or <code>'AAA'</code>, in
					any case. Another value is ignored with a <code>console.warn</code> (
					<code>engineOptions.wcagLevel: ignoring "AA+"; use "A", "AA" or "AAA". ...</code>), and
					throws <code>INVALID_ENGINE_OPTIONS</code> under <code>strictOptions</code>. The run
					reports a valid level as <code>engine.wcagLevel</code>, written <code>'A'</code>,{" "}
					<code>'AA'</code> or <code>'AAA'</code>; without the option, <code>engine.wcagLevel</code>{" "}
					is the level the selection implies, and absent when it implies none.
				</li>
				<li>
					<strong>It decides what is reported, never what runs.</strong> The selection decides
					what runs, as without it. A check above the level that the selection names still runs
					and reports its own result; only its criteria above the level are left out of{" "}
					<code>rulesResults</code>.
				</li>
				<li>
					<strong>It applies to every WCAG rollup, not only the criteria added for named
					checks.</strong> <code>wcagLevel: 'AA'</code> on a full scan, a profile or a tag
					selection leaves the AAA criteria out of <code>rulesResults</code>, while their checks
					still run and report in <code>checksResults</code>. This differs from{" "}
					<code>wcagVersion</code>, which never removes a rollup the selection selects: a 2.2 scan
					still reports 4.1.1, with its rules coerced to <code>cantTell</code>. A scan without the
					option reports what it reported before.
				</li>
				<li>
					<strong>It wins over the level the selection implies</strong> (
					<code>runOnly.wcag.level</code>, or the highest level its version/level tags name), as an
					explicit <code>wcagVersion</code> wins over the version they imply. A conflict between
					the two is not warned about, as one between <code>wcagVersion</code> and a target's
					version isn't; <code>engine.wcagLevel</code> shows the level the criteria were gated by.
				</li>
				<li>
					<strong>A rollup named by id is reported as named.</strong>{" "}
					<code>{"includeRuleIds: ['wcag-1.4.6-contrast-enhanced']"}</code> with{" "}
					<code>wcagLevel: 'AA'</code> reports 1.4.6: the option says which criteria to report,
					not to drop one the caller asked for. A level the selection's own tags imply still gates
					a named rollup, as it does without the option.
				</li>
				<li>
					<strong>A standard's own rollups</strong> have no WCAG level and are not gated by it. A
					pack's profile can't give a level (its tags imply one); its caller can pass{" "}
					<code>wcagLevel</code>.
				</li>
				<li>
					<code>getRulesForRunOnly(runOnly, engineOptions)</code> honors it, so it lists what the
					scan reports, and warns about an invalid one as the scan does, or throws under{" "}
					<code>strictOptions</code>.
				</li>
			</ul>
			<p>
				Without the option, version/level tags beside the rule ids give a level too, since the
				default <code>includeMode: 'and'</code> keeps the named rules that carry one of them:{" "}
				<code>{"{ includeRuleIds: ['contrast-computable'], tags: wcagTags('2.2') }"}</code> runs{" "}
				<code>contrast-computable</code> and reports 1.4.3 alone. But the tags also decide what
				runs: a named rule with no WCAG tag (a best-practice rule such as <code>region</code>, a
				custom rule without WCAG tags), or one that checks only AAA criteria, is left out of the
				run, and a version/level tag no rule carries (<code>wcag22a</code>) is noted with a{" "}
				<code>console.info</code>. <code>wcagLevel</code> gives the level without changing what
				runs. In a browser binding, the builder's <code>.wcagLevel('AA')</code> sets it.
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
				<code>runOnly.wcag</code> selects a conformance target in one field (
				<a href="#selecting-by-wcag-target-runonlywcag">above</a>), and leaves out 4.1.1 under
				2.2. With tags, since versions are cumulative (2.1 = 2.0 + new; 2.2 = 2.0 + 2.1 + new),
				select a WCAG-version conformance target by combining tag sets — the engine's OR-matching on{" "}
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
			<p id="parsing-errata">
				Under a 2.0 or 2.1 target it is the same: W3C's 2023 errata to WCAG 2.0 and 2.1 count
				4.1.1 as always satisfied for content in HTML or XML, so the rule asks rather than fails,
				and <code>wcagVersionScope.by</code> is <code>"errata"</code>. The one exception is a
				profile whose standard keeps 4.1.1's text, such as <code>en301549-v3.2.1</code> (
				<code>keepsParsing</code> in the standard's profile, see{" "}
				<a href="/configuration/packs/#profiles">Packs</a>): a duplicate id can still{" "}
				<code>fail</code> there. Core 1.14.0 and later; before, a 2.0 or 2.1 target let it fail.
			</p>
			<p>The target version is resolved in this order:</p>
			<ol>
				<li>
					<code>engineOptions.wcagVersion</code> — <code>'2.0'</code>, <code>'2.1'</code> or{" "}
					<code>'2.2'</code>, if you set it.
				</li>
				<li>
					The <code>wcagVersion</code> of the pack profile the run applies, if it names one: a
					standard built on WCAG 2.1 whose profile runs only the rules it maps selects no WCAG
					tag, so it says the version itself. It wins over the version the profile's own tags
					imply. A profile that doesn't take effect (overridden by a selection of your own)
					brings no version.
				</li>
				<li>The version of a <code>runOnly.wcag</code> target.</li>
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
				tokens dropped automatically. A bare list or string, such as{" "}
				<code>rules: ['img-alt-present']</code>, is read as the include list.
			</p>

			<h2><code>engineOptions</code> — the rest</h2>
			<CodeBlock
				lang="js"
				lines={[
					"const engineOptions = {",
					"  strictOptions: false,            // default false — true throws on an unknown option or a value of the wrong type",
					"  locale: 'en',                    // default 'en'; de-DE falls back to de, then to en per string",
					"  wcagVersion: '2.2',              // default '2.2' — the conformance target",
					"  wcagLevel: 'AA',                 // optional — the level of the criteria reported",
					"  profile: 'wcag22-aa',            // optional — a named conformance target, or a list of them",
					"  mappings: ['en301549'],          // optional — standards besides WCAG to name on each result",
					"  optInRules: 'all',               // optional — also run rules other standards add beyond WCAG",
					"  messages: { de: { /* key: text */ } },  // optional caller-supplied dictionaries; win over built-in ones",
					"  includeHiddenElements: false,    // default false — set true to evaluate hidden/collapsed subtrees too",
					"  includeShadowDom: true,          // default true — opt OUT with false to skip open shadow roots",
					"  fragment: false,                 // default false — set true when the scan target isn't a real page",
					"  embeddedAriaHidden: false,       // default false — a frame's document shown under aria-hidden=\"true\"",
					"  embeddedInert: false,            // default false — a frame's document shown under [inert]",
					"  topLevelDocument: true,          // optional — unset, a document shown in a frame is no page of its own",
					"  excludeSelectors: ['#cookie-banner', '.third-party-widget'],  // array or comma-separated string",
					"  styleSheetTexts: [{ href: 'https://cdn.example/site.css', text: '/* its CSS */' }],  // sheets the page can't read",
					"  timestamp: '2026-07-20T12:00:00Z',  // optional — engine has no built-in clock",
					"  perfStats: false,                // default false — internal timing counters, debug-only shape",
					"  profileRules: false,             // default false — per-rule timings; needs perfStats",
					"",
					"  contrast: {",
					"    mode: 'strictConformance',     // 'strictConformance' (default) | 'auditorAssist'",
					"    rootCanvasFallback: '#ffffff', // a canvas to measure on in place of the page's own; unset, the page's color scheme gives it",
					"    rootCanvasFallbackSet: true    // echoed on each result: whether rootCanvasFallback was given; read back, false means the default",
					"  },",
					"  visibilityMode: undefined,       // 'styleOnly' | 'styleAndGeometry'; unset: geometry with a layout, else styles",
					"",
					"  policyContract: 'a11y',          // 'a11y' (default) | 'generic' | inline contract object",
					"  policy: {                        // optional overrides on top of policyContract",
					"    coerceManualFailToCantTell: true",
					"  },",
					"",
					"  output: {",
					"    includeSelector: true,         // set false to suppress auto-filled selectors",
					"    includeHtml: true,",
					"    detail: 'full'                 // 'findings': pass/notApplicable results keep only rule, outcome, type",
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
					"  packs: [ /* rules and standards from outside core, see Packs */ ],",
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

			<h3 id="catching-mistakes-in-the-options-strictoptions">Catching mistakes in the options (<code>strictOptions</code>)</h3>
			<p>
				An option the engine doesn't read is passed through: a custom rule can read settings of its
				own from <code>ctx.engineOptions</code>, and an option removed in a later release doesn't
				break a scan. So by default a misspelt option is ignored, and the scan runs as if it
				weren't there. Two things say so:
			</p>
			<ul>
				<li>
					<strong>Always</strong>, a key one or two letters from a known one (in any case) is
					warned about, nested keys included: <code>lcoale</code> gets{" "}
					<code>[surea11y] engineOptions: unknown option "lcoale" (did you mean "locale"?); ignored.</code>
				</li>
				<li>
					<strong>Always</strong>, a value of the wrong type is warned about and read as not given,
					as is an <code>engineOptions</code> that isn't an object. On/off options (
					<code>includeShadowDom</code>, <code>includeHiddenElements</code>, <code>fragment</code>,{" "}
					<code>perfStats</code>, <code>profileRules</code>, <code>output.includeHtml</code>,{" "}
					<code>output.includeSelector</code>) take <code>true</code> or <code>false</code>, or{" "}
					<code>'true'</code>, <code>'false'</code>, <code>'1'</code>, <code>'0'</code>,{" "}
					<code>1</code> and <code>0</code> as a command line spells them:{" "}
					<code>perfStats: 'false'</code> is off.
				</li>
				<li>
					<strong>With <code>strictOptions: true</code></strong> (or <code>'true'</code>,{" "}
					<code>'1'</code> or <code>1</code>), every option is checked before the scan, and any
					mistake throws an error with <code>code: 'INVALID_ENGINE_OPTIONS'</code>, naming each one,
					with <code>problems</code> listing them as{" "}
					<code>{"{ path, kind, message, suggestion }"}</code>: an unknown key (
					<code>kind: 'unknown'</code>), in <code>engineOptions</code> or in one of its objects, and a
					value of the wrong type or outside its set (<code>kind: 'invalid'</code>), such as{" "}
					<code>includeHiddenElements: 'yes'</code> or <code>contrast.mode: 'strict'</code>.
				</li>
			</ul>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, { strictOptions: true, lcoale: 'de' }, null);",
					"// Error: engineOptions: unknown option \"lcoale\" (did you mean \"locale\"?). (strictOptions)",
				]}
			/>
			<p>
				The catalog functions that take <code>engineOptions</code> (<code>getChecksCatalog</code>,{" "}
				<code>getRulesCatalog</code>, <code>getCheckDefById</code>,{" "}
				<code>getCompositeRuleById</code>, <code>getChecksForRunOnly</code>,{" "}
				<code>getRulesForRunOnly</code>, <code>getTestsForRunOnly</code>) check them the same way,
				in the same words: <code>{"getRulesForRunOnly(runOnly, { wcagLevel: 'AA+' })"}</code> warns,
				reads the level as not given, and lists what a scan with those options reports; with{" "}
				<code>strictOptions: true</code> it throws <code>INVALID_ENGINE_OPTIONS</code>, as the scan
				does. A selection that cancels itself (a rule both included and excluded, parts with no
				rule in common) is said so as the scan says it: a warning, and{" "}
				<code>INVALID_RUN_ONLY</code> under <code>strictOptions</code>.
			</p>
			<p>
				Not checked: a rule's own settings (<code>rules[ruleId]</code>), the keys of{" "}
				<code>messages</code>, and <code>probes</code>, which the engine passes on unread; and the
				custom rules, which have checks of their own (<code>skippedCustomRules</code>). In
				TypeScript, <code>StrictEngineOptions</code> is the same set of options without the index
				signature that lets any key compile, so a misspelt option is an error there too.
			</p>

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
						"  excludeSelectors: ['#cookie-banner', '.intercom-launcher']",
						"}, { wcag: { version: '2.2', level: 'AA' } });",
					]}
				/>
				<p>
					Add <code>bestPractices: true</code> beside <code>wcag</code> to also run the
					best-practice rules, which a WCAG gate usually reports without failing on. Some of them
					can <code>fail</code> (<code>empty-heading</code>), so a gate that fails on any{" "}
					<code>fail</code> fails on those too.
				</p>
			<p>
				<strong>Human auditor doing a deep contrast pass in a real browser</strong> — trade some
				false-positive protection for more findings. In a real browser the contrast rules already
				check the layout, not just computed styles, so only the contrast mode needs setting. Shown
				with Puppeteer's{" "}
				<code>page.evaluate</code> (accepts multiple args); if you're on Playwright, wrap the
				four positional args into a single object first — see{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const result = await page.evaluate(runa11yCoreInPage, url, null, {",
					"  contrast: { mode: 'auditorAssist' }",
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
				<strong>Output for snapshot testing</strong> — pin a <code>timestamp</code> so the
				result's own time stamp doesn't change between runs, and leave <code>perfStats</code> and{" "}
				<code>profileRules</code> off: their timings vary, and their shape is not part of the
				stable output. A snapshot also needs the same DOM, the same options, and the same
				rendering conditions (browser, viewport, fonts) on every run; the timestamp alone doesn't
				make two results identical.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
					"  timestamp: '2026-01-01T00:00:00Z'",
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
						"      // ctx.helpers.dom reads the DOM so the page's markup can't redirect it.",
						"      const dom = ctx.helpers.dom;",
						"      const els = ctx.helpers.queryAllSmart('[onclick]');",
					"      const occurrences = els.map((el) => ({",
					"        selector: ctx.helpers.buildSelector(el),",
					"        html: dom.outerHTML(el),",
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
				and nothing persists between calls. The catalog functions take the same{" "}
				<code>engineOptions</code> and list what a scan with them has:{" "}
				<code>getChecksCatalog(engineOptions)</code> lists the valid custom rules, with each
				override in place of its built-in, <code>getCheckDefById(id, engineOptions)</code> finds
				them, <code>getChecksForRunOnly(runOnly, engineOptions)</code> selects them as the scan
				does, and <code>getRulesForRunOnly(runOnly, engineOptions)</code> lists the rollups they
				add. This is deliberate, not a limitation to work around:
				surea11y already takes fresh <code>engineOptions</code> per call with no mutable global
				config, and custom rules follow that same per-call model.
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
					A custom rule, like a pack's, runs after the built-in rules, and the{" "}
					<code>ctx.helpers</code>, <code>ctx.engineOptions</code> and{" "}
					<code>ctx.inputs.probes</code> it is given are read-only: setting or deleting anything on
					them throws (the rule is reported as <code>cantTell</code> with that error), so it can't
					change what other rules see. It must not change the page: one that does is named in a{" "}
					<code>console.warn</code>. Results keep the catalog's order. Whatever it throws or
					returns, the scan returns a result, and the rule's result is made plain data, so the
					scan's result can be written as JSON and cloned.
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
					<code>'unsafe-eval'</code> skips a rule given as a string, and its{" "}
						<code>skippedCustomRules</code> reason says the policy is why; pass a real function
						there.
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
					Ids are matched in any case: a custom rule <code>IMG-ALT-PRESENT</code> overrides{" "}
					<code>img-alt-present</code> and takes its id, and a second warning names both
					spellings.
				</li>
				<li>
					A custom rule that ran counts toward the WCAG rollup (<code>rulesResults</code>) of each
					criterion it maps to, through <code>meta.wcagSc</code> or a WCAG entry in{" "}
					<code>meta.normativeMappings</code>, as a built-in rule does: a failing one fails the
					rollup. The rollup marks it <code>custom: true</code> among its contributors and lists it
					in <code>data.details.customChecksIds</code>. A custom rule the selection names on its
					own (by its id or one of its tags) that ran reports the rollups of its criteria even when
					the selection names none of them (
					<a href="#which-criteria-a-scan-reports">"Which criteria a scan reports"</a>). An
					override counts where its own mapping
					says: in its built-in's place when it maps to that criterion, and in no rollup when it
					maps to none, with a warning naming the rollups it left.
				</li>
				<li>
					A custom rule is selected like a built-in one, by its id and its <code>meta.tags</code>.
					A <code>runOnly</code> that names a custom rule the scan skipped throws{" "}
					<code>INVALID_RUN_ONLY</code>, with the reason it was skipped. <code>customRules</code>{" "}
					is a list: a single rule given on its own is not run, and is listed in{" "}
					<code>skippedCustomRules</code>. Under a profile or a WCAG target, a rule tagged{" "}
					<code>best-practice</code>, or with no WCAG tag, is not part of the run: it is listed in{" "}
					<code>skippedCustomRules</code>, with a <code>console.warn</code>, and runs when you give
					it the tags of the criteria it checks (<code>'wcag111'</code>) or add{" "}
					<code>runOnly.bestPractices: true</code>. A custom rule the selection excludes (
					<code>{"excludeRuleIds: ['org-b']"}</code>, <code>rules.exclude</code>...) is listed there
					too, with the reason <code>excluded by the selection.</code> and{" "}
					<code>excluded: true</code>, and not warned about. An override runs wherever its built-in
					would have.
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
					that isn't a function and isn't a reconstructable source string, an{" "}
						<code>applicability</code> that can't be turned into a function, a <code>meta</code>{" "}
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
						value returned. A rule's <code>type</code> comes from its <code>meta</code>: a{" "}
						<code>type</code> in its return is ignored, with a note in <code>error</code>.
				</li>
				<li>
					Results appear in <code>checksResults</code> exactly like any other rule's, including
					automatic <code>selector</code>/<code>html</code>/<code>structuralPath</code> fill-in
					for <code>fail</code>/<code>cantTell</code> occurrences that only attach{" "}
					<code>{"{ __node }"}</code> (see <a href="/results-reports/output-schema/">the output schema</a>).
					</li>
					<li>
						A <code>fail</code> names what failed. A custom rule's <code>fail</code> with no
						occurrences (a failure of the whole page) is reported with one occurrence on the
						document element (<code>selector: 'html'</code>, reason code{" "}
						<code>FAIL_WITHOUT_OCCURRENCE</code>), so JUnit, SARIF, baselines and the HTML report
						show it as the failure it is.
					</li>
				</ul>

				<h2 id="packs">Packs — rules and standards from outside core</h2>
				<p>
					A pack brings rules, variants of core's rules, a standard or a checklist, and the messages
					they use, from a package of its own, without a build of core. Pass packs to a scan in{" "}
					<code>engineOptions.packs</code>; the scan runs on an engine prepared with them, by the
					steps the build uses for core's own rules, so a pack's standard, profiles, rollups and
					opt-in rules behave as a built-in one's would. The engine is kept for the next scan with
					the same pack objects, so a crawl that passes the same packs to every page prepares them
					once.
				</p>
				<CodeBlock
					lang="js"
					lines={[
						"const { runDomRulesInPage, getChecksCatalog } = require('@surea11y/core');",
						"const acmePolicy = require('./acme-policy-pack');",
						"",
						"const result = runDomRulesInPage(url, null, { packs: [acmePolicy], profile: 'acme-web-2026' });",
						"result.engine.packs; // ['@acme/a11y-policy@1.0.0']",
						"getChecksCatalog({ packs: [acmePolicy] }); // core's rules and the pack's",
					]}
				/>
				<p>
					A pack that does not hold together with core (its <code>core</code> range excludes this
					version, a rule id without the namespace, a dictionary key core has) is skipped with a{" "}
					<code>console.warn</code>, listed in the result's <code>skippedPacks</code> as{" "}
					<code>{"{ name, reason }"}</code>, and the scan runs without it; under{" "}
					<code>strictOptions</code> it throws, with <code>code: 'INVALID_ENGINE_OPTIONS'</code>.
					Packs that clash with each other throw. In a page, a
					pack is registered first with <code>packScript(packs)</code> and named in{" "}
					<code>engineOptions.packs</code> as <code>name@version</code>. What a pack holds, how to
					use one from each binding, the test matchers and the CLI, and how to write one, are on{" "}
					<a href="/configuration/packs/">Packs</a>.
				</p>

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
					<strong>Anything but a selector, an array of selectors or <code>null</code> throws the same
					error</strong>, naming what was passed: an element, a NodeList, an{" "}
					<code>{"{ include, exclude }"}</code> object, a number, or an array item that isn't a
					string (<code>contextSelector[1] must be a CSS selector, not the number 5.</code>). Pass a
					selector that matches the element instead, and put what an <code>exclude</code> would
					leave out in <code>engineOptions.excludeSelectors</code>.
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
