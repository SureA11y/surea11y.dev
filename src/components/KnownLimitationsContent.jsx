import React from "react";

const core = "https://github.com/SureA11y/core/blob/main";

export function KnownLimitationsContent() {
	return (
		<>
			<p>
				Stated plainly and upfront, not left for you to discover. Every item here is a
				deliberate, reasoned decision, not an oversight — but "deliberate" doesn't mean
				"unimportant to know before you rely on this tool."
			</p>

			<h2>Structural — this architecture cannot do these at all</h2>
			<p>
				surea11y is a <strong>static DOM scan</strong>: it reads the DOM tree and computed styles
				at one instant, with no ability to simulate user interaction, wait for async state
				changes, or measure real layout at arbitrary viewport sizes. These aren't missing rules —
				no rule implementation, however clever, can close them without a fundamentally different
				architecture (real browser automation driving actual keyboard/pointer events over time):
			</p>
			<ul>
				<li>
					<strong>Keyboard-trap detection</strong> (WCAG 2.1.2) — requires driving focus around
					the page and watching where it lands, which no single read of the DOM can do. A
					technique that would work has been scoped out (see the keyboard-trap section of{" "}
					<a href={`${core}/docs/ACT_RULE_MAPPING.md#keyboard-trap-detection-scoping-notes`}>
						<code>ACT_RULE_MAPPING.md</code>
					</a>
					), but it would be this engine's first check to mutate the page it is inspecting, so it
					is not built and would not be part of a normal scan if it were. Nothing in static markup
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
					dialog is open. Behaves like axe-core; IBM Equal Access and Siteimprove Alfa judge the
					page behind the dialog as if nothing were open.
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
					<strong>
						In a real browser, some rules change the page for the time of their check, and the
						page's own scripts can react.
					</strong>{" "}
					To measure what the browser draws, <code>css-hidden-focus</code> focuses elements as the
					keyboard would, and switches transitions off on the element it measures;{" "}
					<code>text-spacing-content-loss</code> adds a style sheet with the WCAG 1.4.12 spacing.
					All of this is put back before the rule returns: focus, scroll position, style attributes
					and the added style sheet. What cannot be put back is what the page's scripts do in
					response, since focusing an element fires its <code>focus</code> handlers: a carousel may
					move to the focused slide or enable a button. The findings are not affected, but if you
					scan a page you go on using, reload it afterwards.
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
						The contrast rules measure text against its ancestors' backgrounds, and in a browser
						check whether anything else paints there.
					</strong>{" "}
					Text positioned over a sibling, over an <code>&lt;img&gt;</code> hero, over a{" "}
					<code>::before</code> overlay, or pulled over another block by a negative margin sits on
					paint none of its ancestors own. In a browser the engine measures the text's line boxes
					and looks for elements that paint a background color, a background image or replaced
					content (<code>img</code>, <code>video</code>, <code>canvas</code>, <code>svg</code>,{" "}
					<code>iframe</code>) and cover at least about a glyph of a line, and for a positioned{" "}
					<code>::before</code> or <code>::after</code> with a color or gradient; when it finds
					one, <a href="/rules/contrast-computable/"><code>contrast-computable</code></a> asks about
					the text with reason code <code>BACKGROUND_OVERLAP</code> and the ratio rules leave it
					out. It does not work out which of two overlapping boxes is painted on top, so it does
					not compute a ratio against the paint it found. Three limits keep the noise down, and
					each can miss a case: only paint inside the text's nearest ancestor with an opaque
					background counts (a white card over a hero image hides the image), fixed and sticky
					boxes are left out (a cookie banner or header covers text rather than sitting behind
					it), and solid paint the same color as the background already measured is ignored.
					Under jsdom there is no layout, so nothing is found and text is measured against its
					ancestors alone.
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
