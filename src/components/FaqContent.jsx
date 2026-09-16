import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function FaqContent() {
	return (
		<>
			<article>
				<h2>"I passed <code>runOnly: ['some-rule-id']</code> but every rule still ran"</h2>
				<p>
					<strong><code>runOnly</code> must be an object, not a bare array.</strong>{" "}
					<code>runOnly: ['img-alt-present']</code> is silently ignored (the engine falls
					through to "run everything"), because that shape has none of the fields the engine
					actually checks (<code>includeRuleIds</code>, <code>tags</code>, etc.). A bare array is
					easy to reach for, so this is worth checking first.
				</p>
				<p>Fix:</p>
				<CodeBlock lang="js" lines={["runOnly: { includeRuleIds: ['img-alt-present'] }"]} />
				<p>
					See <a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a> for the full shape.
				</p>
			</article>

			<article>
				<h2>"My custom rule always returns <code>cantTell</code> with no clear reason"</h2>
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
				<h2>
					"A geometry-dependent rule (e.g. <code>target-size-minimum</code>) always says{" "}
					<code>notApplicable</code>"
				</h2>
				<p>
					Plain jsdom (no real browser) doesn't implement CSS layout —{" "}
					<code>getBoundingClientRect()</code> always returns zero geometry. <strong>Rules that need real
					layout report <code>notApplicable</code> under jsdom rather than guess.</strong> Run through a
					real browser instead (Puppeteer/Playwright — see{" "}
					<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a> Pattern 2) to
					get real findings from these rules. See{" "}
					<a href="/troubleshooting/known-limitations/"><code>LIMITATIONS.md</code></a>.
				</p>
			</article>

			<article>
				<h2>
					"I only see <code>fail</code>/<code>cantTell</code> occurrences — where's the list of
					elements that passed?"
				</h2>
				<p>
					<strong>By design, this engine never enumerates the elements a rule <em>passed</em> — only the
					ones it flagged.</strong> A rule's overall <code>outcome: 'pass'</code> means "applicable
					target(s) existed and none were flagged," but <code>occurrences</code> is{" "}
					<code>[]</code> either way. If you need to know which specific elements were checked and
					considered fine, that's not currently exposed — see{" "}
					<a href="/results-reports/output-schema/"><code>OUTPUT_SCHEMA.md</code></a>.
				</p>
			</article>

			<article>
				<h2>
					"A rule I expected to fire returned <code>notApplicable</code> / found nothing on a page
					I know has the issue"
				</h2>
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
						<a href="/configuration/engine-options/#rule-scoped-excludeselectors"><code>ENGINE_OPTIONS.md</code></a>) — if a rule you expect
						to fire keeps coming back <code>notApplicable</code>/<code>pass</code> for one
						element only, check whether that rule specifically has its own exclude list
						configured, not just the global one.
					</li>
				</ol>
			</article>

			<article>
				<h2>"Does a clean scan (<code>pass</code> everywhere) mean the page is WCAG conformant?"</h2>
				<p>
					No — see <a href="/conformance/wcag-mapping/"><code>WCAG_CONFORMANCE.md</code></a>.{" "}
					<strong>A <code>pass</code> means every <em>automatable</em> check came back clean.</strong> A meaningful
					fraction of WCAG requires human judgment (accurate alt text, understandable error
					messages) or dynamic testing this engine's architecture can't do at all (keyboard traps,
					reflow at zoom) — see <a href="/troubleshooting/known-limitations/"><code>LIMITATIONS.md</code></a> for
					the explicit, non-exhaustive-on-purpose list.
				</p>
			</article>

			<article>
				<h2>"Should I treat <code>cantTell</code> as a failure?"</h2>
				<p>
					<strong>Treat it as "needs a human to look" — it's neither pass nor fail by design.</strong> Most teams
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
				<h2>"What happens if a locale is only partially translated?"</h2>
				<p>
					<strong>Missing keys fall back to English per-string (never a blank or broken result), so a
					partial locale degrades gracefully rather than failing outright.</strong> See{" "}
					<a href="/configuration/locales/"><code>I18N.md</code></a> for the mechanism and current
					coverage. Key parity is enforced rather than hoped for: <code>npm run i18n:sync</code>{" "}
					carries any new or renamed <code>en.json</code> key into every other locale file, and
					the build fails if one is out of step. A key it adds holds the English text until
					someone translates it, so a locale can be behind on wording without ever being behind
					on keys.
				</p>
			</article>

			<article>
				<h2>
					"<code>runDomRulesInPage</code> vs <code>runa11yCoreInPage</code> — which one do I want?"
				</h2>
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
		</>
	);
}
