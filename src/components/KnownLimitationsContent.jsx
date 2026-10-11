import React from "react";

const core = "https://github.com/SureA11y/core/blob/main";

export function KnownLimitationsContent() {
	return (
		<>
			<p>
				What the engine doesn't evaluate, what depends on the environment it runs in, and what
				needs a person to review. Read this before you rely on a clean result.
			</p>

			<h2>Aspects the scan does not evaluate</h2>
			<p>
				surea11y checks the page in its current state. Some rules briefly change focus or styles to
				measure a specific condition, and in a real browser rules can measure layout (in jsdom there
				is none), but the scan does not systematically explore user interactions, asynchronous
				states or different viewport sizes. The following therefore need separate testing, with
				browser automation and human review as appropriate:
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
					to. A few checks change the page briefly to measure it (<code>aria-hidden-focus</code>{" "}
					tries to focus elements, <code>text-spacing-content-loss</code> applies test spacing),
					but none drives focus through the page the way trap detection would. Nothing in static markup
					stands in for it in the meantime.
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
					The walk stops there (Chrome gives no name from content 100 levels down), so a button or
					link whose only name is deeper is asked about (<code>name_contentTooDeep</code>) by{" "}
					<a href="/rules/button-name-present/"><code>button-name-present</code></a> and{" "}
					<a href="/rules/link-name-present/"><code>link-name-present</code></a>; other rules that
					name from content read such content as empty.
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
					failed.
				</li>
				<li>
					<strong>A scan taken while a modal dialog is open sees the dialog, not the page.</strong>{" "}
					A <code>&lt;dialog&gt;</code> opened with <code>showModal()</code> (or an open{" "}
					<code>&lt;dialog aria-modal="true"&gt;</code>) makes the rest of the document inert, and
					browsers give assistive technology only the dialog. The engine follows that: content
					behind the dialog is left out of every rule, as other hidden content is, and the rules
					about the page's own structure (<a href="/rules/page-has-heading-one/"><code>page-has-heading-one</code></a>,{" "}
					<a href="/rules/landmark-one-main/"><code>landmark-one-main</code></a>,{" "}
					<a href="/rules/bypass-blocks-present/"><code>bypass-blocks-present</code></a>,{" "}
					<a href="/rules/region/"><code>region</code></a>) report <code>notApplicable</code>, since
					the scan cannot see that structure. Scan the page again with the dialog closed to judge
					what is behind it. Two limits: a modal <code>&lt;dialog&gt;</code> inside a shadow root
					is not detected, and a custom modal built from a <code>role="dialog"</code> element with{" "}
					<code>inert</code> or <code>aria-hidden</code> on the rest of the page is handled only
					through those attributes, which hide the page but do not tell the structure rules a
					dialog is open. Other engines differ here: some do the same, others judge the page behind
					the dialog as if nothing were open.
				</li>
				<li>
					<strong>
						<code>&lt;dialog&gt;</code> and other elements hidden by the default UA stylesheet
					</strong>{" "}
					(no <code>open</code> attribute, <code>display: none</code> by spec), along with any
					other subtree hidden via <code>display:none</code>, <code>visibility:hidden</code>,{" "}
					<code>[hidden]</code>, or closed <code>&lt;details&gt;</code>, are{" "}
					<strong>excluded from rule evaluation by default</strong> — matching the
					visibility-aware behavior of other established engines. This is a deliberate default (
					<code>engineOptions.includeHiddenElements: false</code>), not an oversight: hidden
					content isn't reachable by assistive technology or keyboard until it's shown, so
					flagging a markup defect inside it by default would often be noise. Set{" "}
					<code>engineOptions.includeHiddenElements: true</code> to evaluate hidden/collapsed
					subtrees anyway — e.g. to catch a markup defect (like a broken ARIA ID reference) before
					a dialog ever opens. See <a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a>{" "}
					for the option and exactly which hiding mechanisms it covers.
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
					<strong>
						In a real browser, some rules change the page for the time of their check, and the
						page's own scripts can react.
					</strong>{" "}
					To measure what the browser draws, <code>css-hidden-focus</code> focuses elements as the
					keyboard would, and switches transitions off on the element it measures;{" "}
					<code>aria-hidden-focus</code> focuses an element inside an <code>aria-hidden</code>{" "}
					subtree to see whether the page moves focus away at once (a focus-trap sentinel);{" "}
					<code>text-spacing-content-loss</code> adds a style sheet with the WCAG 1.4.12 spacing.
					All of this is put back before the rule returns: focus, scroll position, style attributes
					and the added style sheet. What cannot be put back is what the page's scripts do in
					response, since focusing an element fires its <code>focus</code> and <code>focusin</code>{" "}
					handlers: a carousel may move to the focused slide, moving <code>aria-hidden</code> with
					it, or enable a button. The findings of that scan are those of the page as it was found:{" "}
					<code>aria-hidden-focus</code> reads which subtrees are hidden, and the markup it reports,
					before it focuses anything. But the page is left as its scripts made it, so a second scan
					of the same page can find something else: if you scan a page you go on using, or scan one
					page twice, reload it in between.
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
					<strong>In a browser, the contrast rules measure text against what is painted under it,
					in CSS's painting order.</strong>{" "}
					Text positioned over a sibling, over an <code>&lt;img&gt;</code> hero, over a{" "}
					<code>::before</code> overlay, or pulled over another block by a negative margin sits on
					paint none of its ancestors own, and text that overflows an ancestor's box, or has a
					negative <code>z-index</code>, isn't over that ancestor's background. In a browser the
					engine measures the text's line boxes, finds the elements that paint there (a background
					color or image, replaced content such as <code>img</code>, <code>video</code>,{" "}
					<code>canvas</code>, <code>iframe</code>, SVG shapes), and orders them with the text and
					its ancestors' backgrounds by the CSS painting order: stacking contexts,{" "}
					<code>z-index</code>, positioned boxes and floats, then document order. When everything
					between the text and the first opaque layer is a solid color covering all of the text,
					the ratio is measured against that; when an image, a gradient, paint covering only part of
					the text, or paint drawn over the text is involved,{" "}
					<a href="/rules/contrast-computable/"><code>contrast-computable</code></a> asks about the
					text with reason code <code>BACKGROUND_OVERLAP</code> and the ratio rules leave it out.
					Text that a box clipping its overflow keeps out of view, such as the options further down
					a scrolled list, is measured as it is once scrolled into that box. Text a box with{" "}
					<code>overflow: hidden</code> keeps wholly out of view, such as a carousel slide off its
					track, is not measured at all: from its styles alone, such a box can't be told from one
					that hides that text for good, so the text is left out rather than guessed at. Scan the
					page in that state (the slide shown) to check it. Limits: a fixed or sticky box over the
					text is left out, since it covers it only at the scroll position the scan was taken at; a
					gradient under the text is not sampled, so faint text on a faint gradient is asked about
					rather than failed; and a group effect (<code>opacity</code>, a filter, a blend mode) on
					an ancestor leaves the overlap to a coarser check. Under jsdom there is no layout, so text
					is measured against its ancestors alone.
				</li>
				<li>
					<strong>A form field's text is measured as the field draws it.</strong> The value of an{" "}
					<code>&lt;input&gt;</code> that shows text (text, search, email, url, tel, password,
					number, the date and time types) and the current value of a{" "}
					<code>&lt;textarea&gt;</code> are measured in the field's color against its background;
					while the value is empty, the placeholder is measured in the <code>::placeholder</code>{" "}
					color and font, faded by its <code>opacity</code>. Not measured: the text the browser draws
					when a date or time field is empty (<code>mm/dd/yyyy</code>), a file input's button and
					file name, and a <code>&lt;select&gt;</code>'s shown option. Under jsdom there is no{" "}
					<code>::placeholder</code> style, so placeholders are not measured there; values are. A
					placeholder below its ratio is <code>cantTell</code> rather than a fail (
					<code>PLACEHOLDER_BELOW_THRESHOLD</code>): WCAG holds placeholder text to the ratio, but
					counts colours the page left entirely to the browser as meeting it (technique G148), and
					telling the browser's colours from the page's on real pages is not settled yet, so a
					person decides for now.
				</li>
				<li>
					<strong>
						<code>target-size-minimum</code> measures the region a pointer can hit, worked out from
						the layout.
					</strong>{" "}
					A target is its border box with its rounded corners and 2D transforms, clipped by{" "}
					<code>clip</code> and <code>clip-path: inset()</code> on its containing-block chain and
					no larger than a box there that clips its <code>overflow</code>, with content sticking out
					of it, less the boxes painted over it that take pointer events; it is large enough when a
					24 by 24 square aligned to the page fits inside (Understanding 2.5.8). Because the region
					comes from the layout rather than from hit-testing, targets below the fold are measured
					as those in view, and so are targets in a box that clips its overflow, as scrolled into
					it. Rounded corners are measured as drawn. Fixed and sticky boxes over a target are left
					out; a target before the start of the page, where scrolling can't reach (a skip link at{" "}
					<code>left: -9999px</code>), is no target. Left as their bounding box: 3D transforms,
					other <code>clip-path</code> shapes, and an ancestor's rounded clipping. Its inline
					exception covers a link in a sentence, which it reads as text with a letter or a digit
					outside any target in the stretch of the link's block between line breaks; links between
					separators alone ("Edit | Delete") that crowd each other are asked about rather than
					exempted. Under jsdom, which has no layout, the rule is <code>notApplicable</code>.
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
					<strong>Fine-grained time-based-media sub-checks</strong> (WCAG 1.2.x has ~8 distinct
					ACT-rule-level cases beyond what's built) — audio/video content itself is fundamentally
					unverifiable from static markup; the two broadest, safest cases are covered (
					<code>media-alternative-transcript-evidence</code>, <code>video-caption</code>), the
					narrower ones are not, by design.
				</li>
				<li>
					<strong>Images-of-text content analysis</strong> (WCAG 1.4.5/1.4.9) — would need
					OCR-equivalent image understanding; out of scope for a static-markup engine.
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
				None of the above is unique to surea11y — every static-analysis accessibility tool (other
				established engines included) shares the structural limitations, and most share the
				judgment-call ones too. The reason to state it explicitly here: <strong>a <code>pass</code> from
				this engine (or any automated tool) is never a substitute for the manual review WCAG
				itself requires for the criteria above.</strong> See{" "}
				<a href="/conformance/wcag-mapping/"><code>WCAG_CONFORMANCE.md</code></a> for exactly what a{" "}
				<code>pass</code>/composite <code>pass</code> does and doesn't claim.
			</p>
		</>
	);
}
