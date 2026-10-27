import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const remedyRows = [
	{
		id: "interaction",
		situation: "Content appears only after a click, a hover or a data load",
		remedy: "Bring the page to that state yourself, then scan it. Scan each state that matters.",
	},
	{
		id: "layout",
		situation: "A check needs layout: target size, text spacing, contrast against what is painted under text",
		remedy: (
			<>
				Scan in a real browser. jsdom has no layout (the result's{" "}
				<code>engine.environment.layout</code> is <code>false</code>), so these rules measure less
				there or report <code>notApplicable</code>, as the sections below say.
			</>
		),
	},
	{
		id: "keyboard",
		situation: "A requirement is about keyboard operation, such as a keyboard trap",
		remedy: "Test it with a keyboard. No scan covers it.",
	},
	{
		id: "canttell",
		situation: (
			<>
				A result is <code>cantTell</code>
			</>
		),
		remedy: (
			<>
				Follow the occurrence's <code>howToCheck</code> steps and decide it by hand.{" "}
				<code>uncertainty</code> says what was missing, and <code>lean</code> which way the page's
				evidence points (see <a href="/results-reports/output-schema/#how-to-check">Output schema</a>).
			</>
		),
	},
	{
		id: "responsive",
		situation: "The page is responsive",
		remedy: "Scan at each width you care about.",
	},
	{
		id: "differ",
		situation: "Two runs of the same page differ",
		remedy: (
			<>
				Compare <code>engine.version</code> and <code>engine.environment</code> (viewport, fonts
				and images still loading), and reload the page between scans.
			</>
		),
	},
	{
		id: "no-failures",
		situation: "A scan reports no failures",
		remedy: (
			<>
				That is not a conformance claim. See{" "}
				<a href="/conformance/wcag-mapping/">WCAG conformance mapping</a>.
			</>
		),
	},
];

export function KnownLimitationsContent() {
	return (
		<>
			<p>
				What the engine doesn't evaluate, what depends on where a scan runs (jsdom, a browser, or
				the page's own scripts), and what needs a person to review. Some items are design
				decisions, each with its reasoning; each says what a scan can't establish and, where there
				is one, what to do about it. Read this before you rely on a clean result.
			</p>

			<h2>What to do about them</h2>
			<DataTable
				label="What to do about each limitation"
				rowKey="id"
				columns={[
					{ key: "situation", label: "If…", width: "40%" },
					{ key: "remedy", label: "Then…" },
				]}
				rows={remedyRows}
			/>
			<p>The sections below give the reasons.</p>

			<h2 id="outside-what-one-scan-can-see">Outside what one scan can see</h2>
			<p>
				A scan reads the page at one moment, in one state, at one viewport: the DOM, its computed
				styles and, in a real browser, its layout. It does not use the page as a person does. It
				doesn't move through it with a keyboard, open its menus, wait for its data or resize it.
				(In a browser a few rules focus an element or add a style sheet for the time of their
				check, and put it back; see the next section.) The items here need that kind of
				interaction over time, so another rule can't close them. They need an interaction test or
				a person:
			</p>
			<ul>
				<li>
					<strong>Keyboard-trap detection</strong> (WCAG 2.1.2) — requires driving focus around
					the page and watching where it lands, which no single read of the DOM can do. A
					technique that would work has been scoped out (see the keyboard-trap section of{" "}
					<a href={`${core}/docs/ACT_RULE_MAPPING.md#keyboard-trap-detection-scoping-notes`}>
						<code>ACT_RULE_MAPPING.md</code>
					</a>
					), but it isn't built: a scan doesn't explore user interactions or the states they lead
					to, and none of the checks that change the page briefly drives focus through it the way
					trap detection would. Nothing in static markup stands in for it in the meantime.
				</li>
				<li>
					<strong>Reflow / clipping at zoom</strong> (WCAG 1.4.10) — requires real layout
					measurement (<code>clientWidth</code>/<code>scrollWidth</code>) at a simulated
					320px-equivalent viewport. Unlike some CSS-declaration-based heuristics elsewhere in
					this engine, there is no static markup proxy for "does content get clipped at 400%
					zoom" at all.
				</li>
				<li>
					<strong>Dynamic/post-interaction state</strong> — anything that only exists after a
					click, hover, or async data load (a modal's contents, a dropdown's options,
					form-validation error messages) is invisible to a scan of the page's <em>current</em>{" "}
					DOM. If your framework renders it eagerly (even off-screen/<code>hidden</code>), it's
					scannable; if it only exists after interaction, it isn't, unless you drive that
					interaction yourself before scanning (e.g. click the button, <em>then</em> scan).
					Scanning the opened state checks what is in it, not whether a keyboard or screen-reader
					user can open, use and close it.
				</li>
			</ul>

			<h2>Environment-dependent — depends on how you run it</h2>
			<ul>
				<li>
					<strong>jsdom (Node, no real browser) has no CSS layout engine.</strong> Rules needing
					real geometry — most notably <code>target-size-minimum</code> (WCAG 2.5.8, needs real{" "}
					<code>getBoundingClientRect()</code>) — report <code>notApplicable</code> under plain
					jsdom rather than guess. Run under a real browser (Puppeteer/Playwright — see{" "}
					<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a> Pattern 2) to
					get real findings from these rules.
				</li>
				<li>
					<strong>
						Whether text wraps needs layout, so text-spacing findings on non-wrapping text are
						reported for review.
					</strong>{" "}
					WCAG 1.4.12 and the ACT rules behind it apply only to text containing a soft wrap break,
					which a static scan cannot establish. <code>avoid-inline-spacing</code> treats text as
					wrapping by default, so an ordinary forced value below the metric still fails; where no
					wrap is possible for a reason that <em>is</em> visible without layout — text not allowed
					to wrap, or a fixed-width element inside a horizontally scrolling ancestor — it reports{" "}
					<code>cantTell</code> instead. Text that never wraps for some other reason is still
					reported as a failure.
				</li>
				<li>
					<strong>The engine runs on the page's own JavaScript built-ins.</strong> A page whose
					scripts break one it relies on (<code>Array.prototype.filter</code>, <code>Map</code>,{" "}
					<code>JSON.stringify</code>, <code>String.prototype.toLowerCase</code> and others) stops
					the scan with an error coded <code>PAGE_BUILTINS_BROKEN</code> that names each, rather
					than giving a result that reads well and is wrong; one broken before the bundle is
					injected (<code>Object.keys</code>) stops the bundle loading. A page that adds{" "}
					<code>then</code> to <code>Object.prototype</code> is scanned as any other. DOM methods a
					page replaces (<code>getComputedStyle</code>, <code>querySelectorAll</code>,{" "}
					<code>getBoundingClientRect</code>) are not checked: rules read what they return.
				</li>
				<li>
					<strong>A name is not worked out from content nested more than 256 levels deep.</strong>{" "}
					The walk stops there (Chrome gives no name from content 100 levels down), so an element
					whose only name is deeper is asked about (<code>name_contentTooDeep</code>) by{" "}
					<a href="/rules/button-name-present/"><code>button-name-present</code></a>,{" "}
					<a href="/rules/link-name-present/"><code>link-name-present</code></a>, the menu item,
					option, summary, tab, tooltip and tree item name rules, and{" "}
					<a href="/rules/empty-heading/"><code>empty-heading</code></a>; other rules that name from
					content read such content as empty.
				</li>
				<li>
					<strong>Content in a closed shadow root can't be read.</strong> No script reaches inside{" "}
					<code>{"attachShadow({ mode: 'closed' })"}</code> or a declarative{" "}
					<code>shadowrootmode="closed"</code>, so the engine can't see what a browser names from
					there. <code>button-name-present</code> and <code>link-name-present</code>, and the menu
					item, option, tab, tree item, summary and tooltip name rules, ask about an element whose
					name could come from a custom element that renders but shows no readable content,
					instead of failing it. A closed root on a built-in element (a <code>&lt;span&gt;</code>)
					looks like an empty one, such as an icon drawn by CSS, so a button over one is still
					failed. Check what such a component exposes by hand, for example with a screen reader.
				</li>
				<li>
					<strong>
						A name or state a custom element sets through <code>ElementInternals</code> can't be
						read.
					</strong>{" "}
					<code>{"this.attachInternals().ariaLabel = 'Save'"}</code> names the element in every
					browser, but no script can read it back. Where a component keeps its internals on a
					property (<code>_internals</code>, <code>internals</code>, <code>internals_</code>,{" "}
					<code>__internals</code>), the engine reads them through it, and passes or fails the
					element by what they say. For any other defined custom element with no name (or no
					required state), the name rules and{" "}
					<a href="/rules/aria-required-attr/"><code>aria-required-attr</code></a> ask (
					<code>name_internals</code>, <code>state_internals</code>) instead of failing. Check
					those in the browser's accessibility tree, or install the opt-in internals hook before
					the page's scripts run: <code>installInternalsHook()</code> in each binding (see{" "}
					<a href="/getting-started/">Getting Started</a>) and in test-matchers, or core's{" "}
					<code>internalsHookScript()</code> for a page of your own (see{" "}
					<a href={`${core}/docs/INTEGRATION.md#reading-private-elementinternals-the-internals-hook`}>
						<code>INTEGRATION.md</code>
					</a>
					, which shows where to install it). The hook records every element's internals for the
					scan, so it also tells an element that never attached any. A role set only through
					internals (<code>internals.role</code>) is read where the internals are, through a
					property or the hook, as the element's default role; kept in a private field without
					the hook, it is not seen, and the element is not asked about, since nearly every
					component could have one. Built-in elements, and custom elements that aren't defined,
					are judged as before.
				</li>
				<li>
					<strong>Event listeners added from script can't be listed.</strong> A listener added with{" "}
					<code>addEventListener</code>, or set as a property (<code>el.onclick = fn</code>),
					leaves nothing in the markup and no script can read it back, so the keyboard rules (
					<a href="/rules/click-handler-keyboard-operable/"><code>click-handler-keyboard-operable</code></a>,{" "}
					<a href="/rules/mouse-only-event-handlers/"><code>mouse-only-event-handlers</code></a>)
					judge inline handler attributes only: a focusable <code>role="button"</code> given its
					click listener from script is not reported (one that can't take focus is asked about by{" "}
					<a href="/rules/widget-keyboard-focusable/"><code>widget-keyboard-focusable</code></a> all
					the same), a key listener added from script can't excuse an inline <code>onclick</code>,
					and <code>password-paste-enabled</code> can't tell whether a paste listener added from
					script puts back the text an inline <code>onpaste</code> cancels. Install the opt-in
					listener hook (<code>listenerHookScript()</code>) before the page's scripts run: the rules
					then judge the listeners it records too, and, where it saw no key listener at all, fail a
					control that Enter and Space can't operate. A click listener a framework adds to its root
					element serves elements nothing names, so even with the hook those are judged by their
					markup. Where to install it:{" "}
					<a href={`${core}/docs/INTEGRATION.md#seeing-listeners-added-from-script-the-listener-hook`}>
						<code>INTEGRATION.md</code>
					</a>
					, on GitHub.
				</li>
				<li>
					<strong>How a live region was filled can't be seen afterwards.</strong> A status message is
					announced when a live region changes while assistive technology can reach it (4.1.3), but a
					scan sees the page at one moment. Without help,{" "}
					<a href="/rules/live-region-announcements/"><code>live-region-announcements</code></a>{" "}
					judges only what is there: a live region hidden from assistive technology by{" "}
					<code>aria-hidden</code> or <code>inert</code>, or behind an open modal{" "}
					<code>&lt;dialog&gt;</code>, or left <code>aria-busy</code>. Install the opt-in live-region
					hook (<code>liveRegionHookScript()</code>), and it also asks about a region the page added
					with its text already in it, or showed and filled at once, and{" "}
					<code>getAnnouncements()</code> lists what the page made available to announce. Neither
					says what a screen reader spoke: that depends on the screen reader. The hook doesn't see
					inside shadow roots. Details:{" "}
					<a href={`${core}/docs/INTEGRATION.md#seeing-what-live-regions-are-given-the-live-region-hook`}>
						<code>INTEGRATION.md</code>
					</a>
					, on GitHub.
				</li>
				<li>
					<strong>A scan taken while a modal dialog is open sees the dialog, not the page.</strong>{" "}
					A <code>&lt;dialog&gt;</code> opened with <code>showModal()</code> makes the rest of the
					document inert, and browsers give assistive technology only the dialog. A dialog opened
					with the <code>open</code> attribute or <code>show()</code> is not modal, even with{" "}
					<code>aria-modal="true"</code>: the page behind it stays reachable, and the engine judges
					it. Under jsdom, which has no top layer, an open{" "}
					<code>&lt;dialog aria-modal="true"&gt;</code> is taken as modal instead, the closest the
					engine can tell there. The engine follows that: content behind the dialog is left out of
					every rule, as other hidden content is, and the rules about the page's own structure (
					<a href="/rules/page-has-heading-one/"><code>page-has-heading-one</code></a>,{" "}
					<a href="/rules/landmark-one-main/"><code>landmark-one-main</code></a>,{" "}
					<a href="/rules/bypass-blocks-present/"><code>bypass-blocks-present</code></a>,{" "}
					<a href="/rules/region/"><code>region</code></a>) report <code>notApplicable</code>, since
					the scan cannot see that structure. Scan the page again with the dialog closed to judge
					what is behind it. A custom modal, a shown element with <code>role="dialog"</code> or{" "}
					<code>role="alertdialog"</code> and <code>aria-modal="true"</code>, also makes those
					structure rules <code>notApplicable</code>; <code>aria-modal</code> makes nothing inert,
					so every other rule still judges the page behind it. A modal dialog inside an open shadow
					root counts as one in the document; one in a closed shadow root can't be found. A custom
					modal without <code>aria-modal="true"</code> is handled only through the{" "}
					<code>inert</code> or <code>aria-hidden</code> the page puts on the rest of it, which hide
					the page but don't tell the structure rules a dialog is open.
				</li>
				<li>
					<strong>
						<code>&lt;dialog&gt;</code> and other elements hidden by the default UA stylesheet
					</strong>{" "}
					(no <code>open</code> attribute, <code>display: none</code> by spec), along with any
					other subtree hidden via <code>display:none</code>, <code>visibility:hidden</code>,{" "}
					<code>[hidden]</code>, or closed <code>&lt;details&gt;</code>, and an{" "}
					<code>[inert]</code> subtree (which rules about how content looks, such as contrast and
					text spacing, still judge, since it is drawn), are{" "}
					<strong>excluded from rule evaluation by default</strong>. This is a deliberate default (
					<code>engineOptions.includeHiddenElements: false</code>), not an oversight: hidden
					content isn't reachable by assistive technology or keyboard until it's shown, so
					flagging a markup defect inside it by default would often be noise. Set{" "}
					<code>engineOptions.includeHiddenElements: true</code> to evaluate hidden/collapsed
					subtrees anyway — e.g. to catch a markup defect (like a broken ARIA ID reference) before
					a dialog ever opens. See <a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a>{" "}
					for the option and exactly which hiding mechanisms it covers.
				</li>
				<li>
					<strong>An <code>aria-details</code> that names hidden content is not reported.</strong>{" "}
					<a href="/rules/aria-valid-attr-value/"><code>aria-valid-attr-value</code></a> checks
					that the id names an element, not that the element is shown. Chromium leaves the relation
					out of its accessibility tree while the element is hidden and puts it back once it is
					shown, so details that open on demand are announced when open, and WCAG asks nothing
					more. To check the relation as assistive technology gets it, scan the page with the
					details shown.
				</li>
				<li>
					<strong>jsdom has no popovers.</strong> It ships HTML's rule hiding a closed{" "}
					<code>[popover]</code>, but no <code>showPopover()</code>, and reads{" "}
					<code>:popover-open</code> inconsistently. Where the DOM has no <code>showPopover</code>,
					the engine treats every <code>[popover]</code> other than an open{" "}
					<code>&lt;dialog&gt;</code> as closed and hidden, so its content is not checked; a
					popover the page's own CSS keeps visible is not checked under jsdom either. In a browser
					the engine reads what is displayed. To check a popover's content, scan the page in a
					browser with the popover open.
				</li>
				<li>
					<strong>Under jsdom, text from CSS <code>content</code> names nothing.</strong> jsdom
					computes no style for <code>::before</code> and <code>::after</code>, so a button or link
					whose only text is generated (<code>content: "Save"</code>,{" "}
					<code>content: attr(data-label)</code>) is named in a browser and unnamed under jsdom,
					where <code>button-name-present</code>, <code>link-name-present</code> and the other name
					rules fail it. Scan such pages in a browser.
				</li>
				<li>
					<strong>jsdom keeps a font size as written.</strong> A browser reports a computed font
					size in px; jsdom keeps a keyword or a <code>calc()</code> as written. The engine reads
					the keywords at a browser's sizes for a 16px default (<code>xx-large</code> is 32px) and{" "}
					<code>calc()</code> of lengths and numbers, so large text is told apart as in a browser.{" "}
					<code>larger</code> and <code>smaller</code>, which depend on the parent's size, are not
					resolved under jsdom: such text is held to the normal-text ratio, and its message gives
					its size as 0px. A browser resolves both.
				</li>
				<li>
					<strong>jsdom ignores a shadow root's own style sheets.</strong> Confirmed in jsdom
					29.1.1: neither a <code>&lt;style&gt;</code> inside a shadow root nor its{" "}
					<code>adoptedStyleSheets</code> reaches the computed style of the elements in it, so under
					jsdom colors, sizes, and <code>display: none</code> or <code>visibility: hidden</code> set
					there are not seen. The rules then judge a component's content as if unstyled: contrast is
					measured on default colors, and content its CSS hides is judged as shown. The one
					exception is a link's color, which the contrast helpers work out from the shadow root's
					sheets themselves. Scan pages built from styled web components in a browser.
				</li>
				<li>
					<strong>
						jsdom's computed <code>text-shadow</code> is unreliable on a second read of the same
						element.
					</strong>{" "}
					Confirmed in jsdom 29.1.1: reading a computed <code>text-shadow</code> value a second
					time on the same element — through any accessor, from any freshly-requested{" "}
					<code>CSSStyleDeclaration</code> for that element, regardless of caching — silently
					returns a different, wrong "no shadow" value instead of the real declared one. The first
					read is always correct. This engine works around it internally by reading each element's{" "}
					<code>text-shadow</code> exactly once per run and caching the result (see{" "}
					<code>__textShadowInfoEl</code> in <code>src/core/contrast-helpers.js</code>), so a
					single scan is unaffected. It only surfaces if you read{" "}
					<code>getComputedStyle(el).textShadow</code> yourself, more than once, against the same
					jsdom-parsed element — a real browser has no such bug.
				</li>
				<li>
					<strong>
						A second scan of the same jsdom DOM can lose a style that overrides a shorthand.
					</strong>{" "}
					jsdom keeps an element's computed style once read, until the DOM next changes, and the
					copy it gives back from that cache loses a longhand that overrides a shorthand from a
					less specific rule: with <code>{"*{background:#888}"}</code> and{" "}
					<code>style="background-image:url(hero.png)"</code>, the first read gives the image and
					every later one <code>none</code>. A scan keeps the style it read first, so it is
					unaffected, but a second scan of the same unchanged DOM can miss the image and pass text
					the first asked about (<code>contrast-computable</code>). Scan a fresh parse, or change
					the DOM between scans, which clears jsdom's cache; <code>@surea11y/core/testing</code>{" "}
					does this for its own second scan. A real browser has no such bug.
				</li>
				<li>
					<strong>
						Under jsdom, scan time grows with the square of DOM depth, not with element count.
					</strong>{" "}
					jsdom resolves inherited CSS by walking an element's ancestor chain on every{" "}
					<code>getComputedStyle</code> call, so one call per element costs O(elements x depth).
					Measured on jsdom 29.1.1 with no engine code involved: 4000 elements in one chain take
					8.3s of <code>getComputedStyle</code> alone, against 0.25s for the same 4000 as
					siblings. The engine's own ancestor walks are capped and stay linear, so this is jsdom's
					cost rather than the rules'. It affects <code>runDomRulesInPage</code> and anything
					built on it, including <code>@surea11y/test-matchers</code>; a real browser computes
					inherited style natively and does not have this shape. Component frameworks routinely
					nest 100-300 deep, which is comfortably fast — it becomes noticeable past roughly 1000.
				</li>
				<li>
					<strong>Under jsdom, scan time also grows with the size of the stylesheet.</strong> jsdom
					computes a style by matching every CSS rule against the element. The engine doesn't
					change the DOM during a scan, so each element is computed once, but that once costs
					O(rules): on a saved news page (7,916 elements, 2,683 CSS rules, jsdom 29.1.1), the first
					computation of 5,735 elements takes about 224 s of a 243 s scan. That is jsdom's cost; a
					real browser computes the same page in a fraction of a second. jsdom also leaves custom
					properties unsubstituted, so a color set with <code>var()</code> is unreadable there: the
					text or background is asked about (<code>contrast-computable</code>) rather than
					measured. Run a real browser for large production pages.
				</li>
				<li>
					<strong>Under jsdom, a link's color is worked out from the page's own rules.</strong>{" "}
					jsdom ranks its own <code>{":link { color: #0000EE }"}</code> with the page's rules by
					specificity alone, so a page's <code>{"a { color: #fff }"}</code> loses to it, where a
					browser applies the page's rule. Under jsdom the engine works out the color of a link, and
					of the text inside it, from the page's rules as a browser's cascade does; a link no rule
					of the page colors keeps the browser's link color, and a link is taken as not visited.
					Where that can't be done (a style sheet that can't be read, a <code>var()</code>, a rule
					under <code>@supports</code>, <code>@layer</code>, <code>@container</code> or nested in
					another), the text is asked about (<code>contrast-computable</code>,{" "}
					<code>FOREGROUND_UNPARSABLE</code>) rather than measured in jsdom's blue. In a browser the
					computed color is read as it is.
				</li>
				<li>
					<strong>Under jsdom, text is judged by its computed <code>font-size</code>.</strong> In a
					browser, the contrast rules and <code>p-as-heading</code> judge text by the size it is
					drawn at: CSS <code>zoom</code>, an SVG transform and <code>font-size-adjust</code>{" "}
					included, the last from the font's own metrics (<code>font-size: 24px;
					font-size-adjust: 0.3</code> draws Arial at about 14px, which is not large text). jsdom
					lays nothing out and reads no font, so there <code>font-size</code> is taken as it is.
					Scan in a browser for a page that scales its text so.
				</li>
				<li>
					<strong>
						In a real browser, some rules change the page for the time of their check, and the
						page's own scripts can react.
					</strong>{" "}
					To measure what the browser draws, <code>css-hidden-focus</code> focuses elements as the
					keyboard would, and switches transitions off on the element it measures;{" "}
					<code>aria-hidden-focus</code> focuses an element inside an <code>aria-hidden</code>{" "}
					subtree to see whether the page moves focus away at once (a focus-trap sentinel);{" "}
					<code>text-spacing-content-loss</code> adds a style sheet with the WCAG 1.4.12 spacing;
					the contrast rules add a blank, off-screen frame to read the browser's own colors for a
					placeholder or a drop-down <code>&lt;select&gt;</code>. The scan also moves each running
					animation to a fixed point while the rules run (a finite one to its end, an endless one
					to its start), so a fade-in is measured as it settles. All of this is put back before the
					rule or the scan returns: focus, scroll position, style attributes, animations, the added
					style sheet and the frame. What cannot be put back is what the page's scripts do in
					response, since focusing an element fires its <code>focus</code> and <code>focusin</code>{" "}
					handlers: a carousel may move to the focused slide, moving <code>aria-hidden</code> with
					it, or enable a button. The findings of that scan are those of the page as it was found:{" "}
					<code>aria-hidden-focus</code> reads which subtrees are hidden, and the markup it reports,
					before it focuses anything. But the page is left as its scripts made it, so a second scan
					of the same page can find something else: if you scan a page you go on using, or scan one
					page twice, reload it in between.
				</li>
				<li>
					<strong>A style sheet from another origin can't be read from the page.</strong> A page's
					script can't list the rules of a sheet another origin serves (a CDN, a fonts service), so{" "}
					<code>css-orientation-lock</code> asks about it (<code>STYLESHEETS_NOT_READABLE</code>),
					and <code>css-hidden-focus</code> and <code>css-focus-indicator-suppressed</code> can't see
					a focus rule in it. Pass its text in <code>engineOptions.styleSheetTexts</code>:{" "}
					<code>preloadStyleSheets()</code> fetches those the server shares (CORS), and a tool
					driving the browser can fetch the others from outside the page (see{" "}
					<a href={`${core}/docs/INTEGRATION.md#style-sheets-from-another-origin`}>
						<code>INTEGRATION.md</code>
					</a>
					, on GitHub).
				</li>
				<li>
					<strong>Static markup vs. live/post-hydration DOM state.</strong> The rule logic itself
					is DOM-source-agnostic — it evaluates whatever DOM it's handed, whether that's
					jsdom-parsed static HTML (Pattern 1) or an already-loaded, already-hydrated real browser
					tab (Pattern 2, see <a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>
					). But the CLI (<code>npx @surea11y/cli scan &lt;url&gt;</code>) specifically fetches
					static HTML only, with no JS execution — see{" "}
					<a href="https://github.com/SureA11y/cli/blob/main/docs/CLI.md">the CLI docs</a>. For a
					JS-framework-hydrated widget whose server-rendered markup intentionally ships one state
					before client JS syncs it (e.g.{" "}
					<code>&lt;input type="checkbox" aria-checked="true"&gt;</code> shipped before client JS
					sets the native <code>checked</code> property to match on hydration — an extremely
					common, entirely legitimate pattern), a CLI scan only sees the pre-hydration markup. A
					scan running inside an actual loaded browser tab sees the post-hydration state instead,
					so the two can disagree on exactly this class of element for reasons that have nothing
					to do with rule correctness. That's why <code>aria-checked-state-mismatch</code> is
					capped at <code>manual</code>/<code>cantTell</code> rather than a hard <code>fail</code>.
					If you need live-DOM accuracy for hydration-sensitive checks, run the library directly
					against an already-loaded page via Pattern 2, not the static-fetch CLI.
				</li>
				<li>
					<strong>A layout is measured at one viewport, with the fonts the page has at that
					moment.</strong> Rules that measure what the browser draws,{" "}
					<a href="/rules/text-spacing-content-loss/">
						<code>text-spacing-content-loss</code>
					</a>
					,{" "}
					<a href="/rules/target-size-minimum/">
						<code>target-size-minimum</code>
					</a>{" "}
					and{" "}
					<a href="/rules/skip-link/">
						<code>skip-link</code>
					</a>
					, hold for the viewport the page was scanned at: a responsive page can cut text off, or
					shrink a target, at one width and not at another, and text measured before its web font
					loads is a different width. The result records both in{" "}
					<a href="/results-reports/output-schema/">
						<code>engine.environment</code>
					</a>
					, and the findings of those rules repeat their viewport and say what was measured (how far
					text went past the edge, how big a target is and how close its neighbour), so a finding
					that differs between runs can be traced to the conditions. Scan at each width you care
					about, and wait for the page to settle before scanning: <code>waitForPageReady()</code>{" "}
					waits for the load event, web fonts and images (see{" "}
					<a href={`${core}/docs/INTEGRATION.md#waiting-for-the-page-before-a-scan`}>
						<code>INTEGRATION.md</code>
					</a>
					, which shows how to call it before a scan), and the result records in{" "}
					<code>engine.environment</code> whether fonts or images were still loading.
				</li>
				<li>
					<strong>
						In a browser, contrast is measured against what is painted under the text, as the
						page is at that moment.
					</strong>{" "}
					Text over an image, a gradient, or paint covering only part of it is asked about (
					<a href="/rules/contrast-computable/"><code>contrast-computable</code></a>, reason code{" "}
					<code>BACKGROUND_OVERLAP</code>) rather than measured. Text that a box with{" "}
					<code>overflow: hidden</code> keeps wholly out of view, such as a carousel slide off its
					track, is left out until it is in view, so scan the page in that state to check it.
					Fixed and sticky boxes over text are ignored. Under jsdom, text is measured against its
					ancestors alone. Scanned under forced colors (Windows high contrast, or an emulated{" "}
					<code>forced-colors: active</code>), the page is kept in its own colors while it is
					measured, so the outcomes are those with forced colors off, unless the page's own CSS
					reacts to forced colors (a <code>forced-colors</code> media query, or a system color such
					as <code>GrayText</code>), which the scan reports in{" "}
					<code>engine.environment.forcedColorsCss</code>; where it can't be (a
					Content Security Policy blocking the engine's <code>&lt;style&gt;</code> in a browser
					that can't adopt a style sheet), the colors measured are partly the browser's, and each
					contrast occurrence says so (<code>details.forcedColors</code>). How the measurement
					works, step by step:{" "}
					<a href={`${core}/docs/LAYOUT_MEASUREMENT.md#contrast`}>
						<code>LAYOUT_MEASUREMENT.md</code>
					</a>
					, on GitHub.
				</li>
				<li>
					<strong>
						Text on a page with no background is measured on the canvas of the page's color scheme,
						where that canvas is known.
					</strong>{" "}
					The browser paints its canvas behind a page that paints no opaque background, in the{" "}
					<code>Canvas</code> color of the color scheme the page is drawn in, which the page's own{" "}
					<code>color-scheme</code> decides: white for a page that declares none, whatever the user
					prefers, and the dark canvas for one drawn in dark. The contrast rules measure text there
					in either mode. Not measured, and asked about by <code>contrast-computable</code> (
					<code>BACKGROUND_NOT_OPAQUE_AT_ROOT</code>): text in a frame, whose canvas can let the page
					around it show through, and text under forced colors, where the canvas is the user's
					palette.
				</li>
				<li>
					<strong>
						Under jsdom, text is measured in the colors of the scheme the page is drawn in where
						they can be worked out, and asked about where they can't.
					</strong>{" "}
					jsdom computes the light scheme's colors and applies no{" "}
					<code>prefers-color-scheme</code> rule. On a page drawn in dark (
					<code>color-scheme: dark</code> on the root or in{" "}
					<code>&lt;meta name="color-scheme"&gt;</code>), text the scheme colors takes the dark
					scheme's colors (Chromium's), and a text color given as <code>light-dark()</code> or a
					system color is worked out for dark. Text whose colors in that scheme can't be worked out
					is asked about (<code>contrast-computable</code>, <code>COLOR_SCHEME_NOT_RENDERED</code>;{" "}
					<code>link-in-text-block</code>, <code>COLOR_NOT_COMPUTABLE</code>) rather than measured in
					the light colors. In a browser, the colors are the ones it draws.
				</li>
				<li>
					<strong>
						On a page that supports light and dark, the scheme the scan doesn't see is measured
						only where the text's colors can't change with it.
					</strong>{" "}
					A scan sees the scheme the browser prefers (jsdom: light). Text on the canvas is measured
					in the other scheme too, except where a <code>prefers-color-scheme</code> rule, a{" "}
					<code>light-dark()</code> value or a system color the page sets reaches the text's color or
					a background behind it, or where a style sheet can't be read.{" "}
					<code>data.details.colorSchemesChecked</code> lists the schemes measured; scan again with
					the browser in the other scheme to check it.
				</li>
				<li>
					<strong>Generated text is measured only in a browser, and only where it can be read.</strong>{" "}
					The text a <code>::before</code> or <code>::after</code> <code>content</code> writes and
					a list item's <code>::marker</code> are measured in the pseudo-element's color and font;
					content that can't be read (a counter in a page's own <code>@counter-style</code>), and
					a <code>::before</code> or <code>::after</code> positioned out of the flow with no
					background of its own, are asked about (<code>contrast-computable</code>) instead.
					Markers are looked for only on <code>&lt;li&gt;</code>. Under jsdom, which computes no
					pseudo-element styles, generated text is left out.
				</li>
				<li>
					<strong>
						A form field's text and placeholder are measured as the field draws them, with gaps.
					</strong>{" "}
					The text a browser draws in an empty date or time field, and a file input's button and
					file name, are not measured. A drop-down <code>&lt;select&gt;</code> is measured as the
					closed control draws it, its shown option in the select's own colors; another of its
					options with colors of its own is shown only in the list the platform draws when it
					opens, and is <code>cantTell</code> (<code>SELECT_OPTION_COLOR</code>). A placeholder
					below its ratio fails (<code>PLACEHOLDER_BELOW_THRESHOLD</code>) when the page chose its
					colors, meets the ratio when they are all the browser's own (technique G148), and is{" "}
					<code>cantTell</code> when that can't be told. Under jsdom, placeholders are not measured
					at all. Details:{" "}
					<a href={`${core}/docs/LAYOUT_MEASUREMENT.md#form-fields`}>
						<code>LAYOUT_MEASUREMENT.md</code>
					</a>
					.
				</li>
				<li>
					<strong>
						<a href="/rules/target-size-minimum/"><code>target-size-minimum</code></a> works the
						hit region out from the layout rather than by hit-testing.
					</strong>{" "}
					Targets below the fold or in a scrolling box are measured whole, as if scrolled into
					view; fixed and sticky boxes over a target are ignored; 3D transforms, most{" "}
					<code>clip-path</code> shapes and an ancestor's rounded clipping are measured as a
					bounding box; and links between separators alone ("Edit | Delete") that crowd each other
					are asked about rather than exempted. Under jsdom the rule is{" "}
					<code>notApplicable</code>. Details:{" "}
					<a href={`${core}/docs/LAYOUT_MEASUREMENT.md#target-size`}>
						<code>LAYOUT_MEASUREMENT.md</code>
					</a>
					.
				</li>
				<li>
					<strong>Contrast is computed in sRGB.</strong> Colors given in <code>oklch()</code>,{" "}
					<code>oklab()</code>, <code>lab()</code>, <code>lch()</code> or <code>color()</code>{" "}
					(the computed form of <code>color-mix()</code> and relative colors too) are converted to
					sRGB, as a standard display shows them; one outside sRGB, such as a saturated{" "}
					<code>display-p3</code> red, is clipped to its edge, which is what Chromium draws on an
					sRGB screen. A wide-gamut screen can show that color more saturated than the ratio
					assumes. A background color the engine cannot convert, a <code>color()</code> in a space
					it does not know, is not treated as transparent: <code>contrast-computable</code> asks
					about the text with reason code <code>BACKGROUND_UNPARSABLE</code>, and the other
					contrast rules leave it out.
				</li>
			</ul>

			<h2>Not attempted: judgment calls that aren't automatable safely</h2>
			<p>
				These have no comparably safe heuristic at this engine's bar (<code>fail</code> must stay
				reserved for deterministic violations, full stop). Building them anyway would either catch
				almost nothing (too narrow to be useful) or risk real false positives (too broad to
				trust):
			</p>
			<ul>
				<li>
					<strong>"Is this heading/label text meaningful?"</strong> — real headings and labels are
					enormously varied and legitimately short ("FAQ," "Name," "Overview" are all fine), so
					nothing decides from markup whether a heading describes the section under it or a label
					describes the field beside it. What <em>is</em> decidable is that some strings cannot
					describe anything: <code>heading-quality</code> and{" "}
					<code>form-control-label-quality</code> flag leftover placeholders, numbered template
					slots, filenames and URLs against curated exact-match lists, the same
					precision-over-recall trade-off <code>link-name-quality</code> makes. Both are{" "}
					<code>manual</code> rules capped at <code>cantTell</code> — they raise a candidate for
					review, they never assert the text is wrong.
				</li>
				<li>
					<strong>"Does this error message describe the problem?"</strong> — what triggers a
					validation error and its content are almost always JS/validation-library-driven,
					invisible to a static scan in the first place; not just a heuristic-design problem.
				</li>
				<li>
					<strong>Fine-grained time-based-media sub-checks</strong> (WCAG 1.2.x has 13 ACT rules
					with no rule here; see the gaps section of{" "}
					<a href={`${core}/docs/ACT_RULE_MAPPING.md#gaps-no-corresponding-rule`}>
						<code>ACT_RULE_MAPPING.md</code>
					</a>
					) — audio/video content itself is fundamentally
					unverifiable from static markup; the two broadest, safest cases are covered (
					<code>media-alternative-transcript-evidence</code>, <code>video-caption</code>), the
					narrower ones are not, by design.
				</li>
				<li>
					<strong>Images-of-text content analysis</strong> (WCAG 1.4.5/1.4.9) — whether an image
					holds text is in its pixels, which would need OCR-equivalent image understanding.{" "}
					<a href="/rules/image-of-text/"><code>image-of-text</code></a> asks only where markup shows
					a sign: an <code>&lt;input type="image"&gt;</code>, and an <code>&lt;img&gt;</code> showing
					an SVG data URL whose markup holds <code>&lt;text&gt;</code>. A photo of a sentence, a
					banner with text baked in, or a CSS background image of text gives no sign, and is not
					asked about. 1.4.9, which allows no exceptions, has no rule.
				</li>
				<li>
					<strong>Motion-actuation controls</strong> (WCAG 2.5.4) — niche, low real-world
					incidence; not prioritized, not structurally impossible.
				</li>
				<li>
					<strong><code>img-alt-decorative</code>'s two ACT edge cases</strong> — an{" "}
					<code>&lt;img&gt;</code> whose current network request state isn't "completely
					available" (still loading, or broken), and a <code>&lt;canvas&gt;</code> that is fully
					transparent (nothing actually drawn on it), are both exempt from ACT's own
					applicability. Neither is decidable from a static DOM scan (no image decoding, no
					canvas pixel readback), so both are left in scope rather than exempted — a rare false
					positive a human reviewer dismisses at a glance, safer than silently under-reporting a
					real excluded/undecorative element.
				</li>
			</ul>

			<h2>What this means in practice</h2>
			<p>
				Most of the above is not unique to surea11y. Any tool that judges one state of the DOM
				shares the limits in{" "}
				<a href="#outside-what-one-scan-can-see">Outside what one scan can see</a>, and most automated tools leave the
				judgment calls to a person too, though tools differ in how they run, what they check, and
				how they report what they can't decide. The reason to state it explicitly here: <strong>a <code>pass</code> from
				this engine (or any automated tool) is never a substitute for the manual review WCAG
				itself requires for the criteria above.</strong> See{" "}
					<a href="/conformance/wcag-mapping/"><code>WCAG_CONFORMANCE.md</code></a> for exactly what a
				rule's <code>pass</code> does and doesn't claim, and why a WCAG criterion whose rules all
				pass is still <code>cantTell</code>.
			</p>
		</>
	);
}
