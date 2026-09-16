import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function TroubleshootingContent() {
	return (
		<>
			<h2>FAQ</h2>

			<article>
				<h3>"I passed <code>runOnly: ['some-rule-id']</code> but every rule still ran"</h3>
				<p>
					<code>runOnly</code> must be an object, not a bare array —{" "}
					<code>runOnly: ['img-alt-present']</code> is silently ignored (the engine falls
					through to "run everything"), because that shape has none of the fields the engine
					actually checks (<code>includeRuleIds</code>, <code>tags</code>, etc.). A bare array is
					easy to reach for, so this is worth checking first.
				</p>
				<p>Fix:</p>
				<CodeBlock lines={["runOnly: { includeRuleIds: ['img-alt-present'] }"]} />
				<p>
					See <a href="/configuration/"><code>ENGINE_OPTIONS.md</code></a> for the full shape.
				</p>
			</article>

			<article>
				<h3>"My custom rule always returns <code>cantTell</code> with no clear reason"</h3>
				<p>
					Check the result's <code>error</code> field first — if it says{" "}
					<code>"&lt;something&gt; is not defined"</code>, your <code>runInPage</code> references
					a variable from outside the function body (a module-scope <code>const</code>, an
					imported helper, anything not reached through <code>ctx.*</code>). This is a real,
					common footgun: <code>runInPage</code> is serialized to source text and re-evaluated
					later in the page context, so <strong>the build never catches this — only running the
					rule does</strong>, and the failure looks like a normal (if uninformative) result, not a
					crash. See <a href={`${core}/docs/RULE_AUTHORING.md`}><code>RULE_AUTHORING.md</code></a>{" "}
					§1.1 for the full explanation and the fix (move the value inside <code>runInPage</code>,
					or route it through <code>ctx.rule</code>/<code>ctx.helpers</code>).
				</p>
			</article>

			<article>
				<h3>
					"A geometry-dependent rule (e.g. <code>target-size-minimum</code>) always says{" "}
					<code>notApplicable</code>"
				</h3>
				<p>
					Plain jsdom (no real browser) doesn't implement CSS layout —{" "}
					<code>getBoundingClientRect()</code> always returns zero geometry. Rules that need real
					layout report <code>notApplicable</code> under jsdom rather than guess. Run through a
					real browser instead (Puppeteer/Playwright — see{" "}
					<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a> Pattern 2) to
					get real findings from these rules. See{" "}
					<a href="#known-limitations"><code>LIMITATIONS.md</code></a>.
				</p>
			</article>

			<article>
				<h3>
					"I only see <code>fail</code>/<code>cantTell</code> occurrences — where's the list of
					elements that passed?"
				</h3>
				<p>
					By design, this engine never enumerates the elements a rule <em>passed</em> — only the
					ones it flagged. A rule's overall <code>outcome: 'pass'</code> means "applicable
					target(s) existed and none were flagged," but <code>occurrences</code> is{" "}
					<code>[]</code> either way. If you need to know which specific elements were checked and
					considered fine, that's not currently exposed — see{" "}
					<a href="/results-reports/"><code>OUTPUT_SCHEMA.md</code></a>.
				</p>
			</article>

			<article>
				<h3>
					"A rule I expected to fire returned <code>notApplicable</code> / found nothing on a page
					I know has the issue"
				</h3>
				<p>Two common causes, in order of likelihood:</p>
				<ol>
					<li>
						<strong>The element is excluded from the accessibility tree</strong> —{" "}
						<code>aria-hidden="true"</code>, <code>display: none</code>,{" "}
						<code>visibility: hidden</code>, <code>hidden</code>, or an <code>inert</code>{" "}
						ancestor. Most rules skip content that's already invisible to assistive technology,
						since checking a hidden element would be meaningless and could produce a misleading{" "}
						<code>fail</code> on content no user encounters. Some rules explicitly opt out of
						this gating when it wouldn't make sense to (e.g. <code>no-autoplay-audio</code> —
						hidden audio still plays sound) — check the specific rule's file header comment (
						<code>@applicability</code>) in <code>src/checks/</code>.
					</li>
					<li>
						<strong><code>excludeSelectors</code></strong> — if you've configured this (directly
						or inherited from a shared config), confirm the element in question isn't matched by
						it. Remember this can also be scoped to a single rule via{" "}
						<code>engineOptions.rules[ruleId].excludeSelectors</code> (see{" "}
						<a href="/configuration/"><code>ENGINE_OPTIONS.md</code></a>) — if a rule you expect
						to fire keeps coming back <code>notApplicable</code>/<code>pass</code> for one
						element only, check whether that rule specifically has its own exclude list
						configured, not just the global one.
					</li>
				</ol>
			</article>

			<article>
				<h3>"Does a clean scan (<code>pass</code> everywhere) mean the page is WCAG conformant?"</h3>
				<p>
					No — see <a href="/conformance/"><code>WCAG_CONFORMANCE.md</code></a>. A{" "}
					<code>pass</code> means every <em>automatable</em> check came back clean. A meaningful
					fraction of WCAG requires human judgment (accurate alt text, understandable error
					messages) or dynamic testing this engine's architecture can't do at all (keyboard traps,
					reflow at zoom) — see <a href="#known-limitations"><code>LIMITATIONS.md</code></a> for
					the explicit, non-exhaustive-on-purpose list.
				</p>
			</article>

			<article>
				<h3>"Should I treat <code>cantTell</code> as a failure?"</h3>
				<p>
					Treat it as "needs a human to look" — it's neither pass nor fail by design. Most teams
					log <code>cantTell</code> findings without failing CI on them, since failing a build on
					something the engine explicitly couldn't determine tends to train people to ignore the
					gate. See <a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a> if you want to
					reshape this behavior (e.g. via a custom policy contract), and{" "}
					<a href={`${core}/docs/INTEGRATION.md#ci-gating-a-build-on-the-result`}>
						<code>INTEGRATION.md</code>
					</a>{" "}
					for a concrete CI-gating example.
				</p>
			</article>

			<article>
				<h3>"What happens if a locale is only partially translated?"</h3>
				<p>
					Missing keys fall back to English per-string (never a blank or broken result), so a
					partial locale degrades gracefully rather than failing outright — see{" "}
					<a href="/configuration/"><code>I18N.md</code></a> for the mechanism and current
					coverage. Key parity is enforced rather than hoped for: <code>npm run i18n:sync</code>{" "}
					carries any new or renamed <code>en.json</code> key into every other locale file, and
					the build fails if one is out of step. A key it adds holds the English text until
					someone translates it, so a locale can be behind on wording without ever being behind
					on keys.
				</p>
			</article>

			<article>
				<h3>
					"<code>runDomRulesInPage</code> vs <code>runa11yCoreInPage</code> — which one do I want?"
				</h3>
				<p>
					<code>runDomRulesInPage</code> if you're calling it directly in the same Node process
					(jsdom, browser-extension content script). <code>runa11yCoreInPage</code> if you're
					handing the <em>function itself</em> to a different JS realm — almost always{" "}
					<code>page.evaluate</code> in Puppeteer/Playwright, which serializes the function to
					source text and re-runs it inside the browser tab (which has no access to your Node
					module scope). See <a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>{" "}
					for both patterns worked out in full.
				</p>
			</article>

			<h2 id="known-limitations">Known limitations</h2>
			<p>
				Stated plainly and upfront, not left for you to discover. Every item here is a
				deliberate, reasoned decision, not an oversight — but "deliberate" doesn't mean
				"unimportant to know before you rely on this tool."
			</p>

			<h3>Structural — this architecture cannot do these at all</h3>
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

			<h3>Environment-dependent — depends on how you run it</h3>
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
					a dialog ever opens. See <a href="/configuration/"><code>ENGINE_OPTIONS.md</code></a>{" "}
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
			</ul>

			<h3>Not attempted: judgment calls that aren't automatable safely</h3>
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
					<strong><code>img-alt-decorative</code>'s two ACT e88epe edge cases</strong> — an{" "}
					<code>&lt;img&gt;</code> whose current network request state isn't "completely
					available" (still loading, or broken), and a <code>&lt;canvas&gt;</code> that is fully
					transparent (nothing actually drawn on it), are both exempt from ACT's own
					applicability. Neither is decidable from a static DOM scan (no image decoding, no
					canvas pixel readback), so both are left in scope rather than exempted — a rare false
					positive a human reviewer dismisses at a glance, safer than silently under-reporting a
					real excluded/undecorative element.
				</li>
			</ul>

			<h3>What this means in practice</h3>
			<p>
				None of the above is unique to surea11y — every static-analysis accessibility tool (other
				established engines included) shares the structural limitations, and most share the
				judgment-call ones too. The reason to state it explicitly here: a <code>pass</code> from
				this engine (or any automated tool) is never a substitute for the manual review WCAG
				itself requires for the criteria above. See{" "}
				<a href="/conformance/"><code>WCAG_CONFORMANCE.md</code></a> for exactly what a{" "}
				<code>pass</code>/composite <code>pass</code> does and doesn't claim.
			</p>
		</>
	);
}
