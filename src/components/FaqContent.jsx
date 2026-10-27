import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function FaqContent() {
	return (
		<>
			<article>
				<h2 id="results-changed-1-14">"My results changed after upgrading to core 1.14"</h2>
				<p>
					1.14 reports more <code>cantTell</code> and claims less, on purpose. The changes most
					likely to show in a pipeline:
				</p>
				<ul>
					<li>
						<strong>No WCAG rollup passes.</strong> A criterion passes only when its rules check all
						it asks, and none is listed as checked in full yet, so a criterion whose rules all pass
						is <code>cantTell</code> (<code>composite.rollup.cantTell.partialCheck</code>). One
						whose rules all found nothing is <code>notApplicable</code> only for 2.4.3, 2.4.4,
						2.4.7, 2.4.9, 2.5.3 and 4.1.1, and <code>cantTell</code> otherwise (
						<code>composite.rollup.cantTell.partialCoverage</code>). A failing rule still fails its
						criterion. A dashboard or gate that counts passed criteria sees none; see{" "}
						<a href="#why-criterion-canttell">the entry below</a> and{" "}
						<a href="/conformance/wcag-mapping/#when-a-criterion-passes">WCAG conformance mapping</a>.
					</li>
					<li>
						<strong>Two rules ask more.</strong>{" "}
						<a href="/rules/page-title-patterns/"><code>page-title-patterns</code></a> asks about
						every page title, not only generic or templated ones, since whether a title describes
						its page is for a person (G88).{" "}
						<a href="/rules/duplicate-id/"><code>duplicate-id</code></a> asks about 4.1.1 under WCAG
						2.0 and 2.1 too, as the 2023 errata count it satisfied, unless a profile says{" "}
						<code>keepsParsing: true</code>, as <code>en301549-v3.2.1</code> does.
					</li>
					<li>
						<strong>Eleven new rules</strong>, among them the first for 3.3.1 (
						<a href="/rules/invalid-field-error-message/"><code>invalid-field-error-message</code></a>),
						4.1.3 (<a href="/rules/live-region-announcements/"><code>live-region-announcements</code></a>)
						and 1.4.5 (<a href="/rules/image-of-text/"><code>image-of-text</code></a>). Most ask;{" "}
						<a href="/rules/click-handler-keyboard-operable/"><code>click-handler-keyboard-operable</code></a>,{" "}
						<a href="/rules/focus-not-removed-by-script/"><code>focus-not-removed-by-script</code></a>{" "}
						and <a href="/rules/aria-owns-valid/"><code>aria-owns-valid</code></a> can fail, and so
						can <a href="/rules/aria-valid-attr-value/"><code>aria-valid-attr-value</code></a>, which
						now checks the constraints between attributes (<code>aria-valuemin</code> above{" "}
						<code>aria-valuemax</code>, say). See <a href="/rules/">the rule catalog</a>.
					</li>
					<li>
						<strong>Some failures became questions, and some new failures appear.</strong>{" "}
						<code>td-has-header</code> asks once about a large table with no header cell instead of
						failing every cell, and <code>form-control-single-label</code> asks about a field with
						two labels. Contrast is measured on more of what the page draws (text on the page's
						canvas in each color scheme, <code>::first-line</code>, <code>font-size-adjust</code>, a
						placeholder whose colors the page chose), so new contrast failures can appear.
					</li>
					<li>
						<strong>Some findings have a new reason code.</strong> Seventeen rules that gave none
						now do, and a few codes are split by cause. A baseline written by 1.13 still matches
						them until 1.15; rewrite it with <code>migrateBaselineEntries</code> (see{" "}
						<a href="#baseline-after-upgrade">the entry below</a>). A Code Scanning alert for such a
						finding closes and comes back as new.
					</li>
					<li>
						<strong>Every <code>cantTell</code> says how to answer it.</strong> A core rule's
						finding carries <code>howToCheck</code> steps, and some carry a <code>lean</code>, which
						way the page's evidence points. The outcome stays <code>cantTell</code>, and nothing
						gates on a lean unless you ask (<code>leanFailAs</code>). The{" "}
						<a href="/results-reports/html-report/">HTML report</a> groups these findings into
						likely fails, likely passes and those that need a person. See{" "}
						<a href="/results-reports/output-schema/#leans">Leans</a>.
					</li>
					<li>
						<strong>1.14.1 fails less on text spacing.</strong>{" "}
						<a href="/rules/text-spacing-content-loss/"><code>text-spacing-content-loss</code></a>{" "}
						no longer fails text the page doesn't lose. A page scroll-locked with{" "}
						<code>{"body { position: fixed }"}</code>, as many are behind a consent banner, and a
						fixed box taller than the viewport are asked about as{" "}
						<code>VIEWPORT_SCROLL_LOCKED</code>; text cut off by a box the page's script sizes to
						fit it, such as an Angular Material form field's floating label, as{" "}
						<code>TEXT_CLIPPED_SCRIPT_SIZED</code>. A baseline entry or Code Scanning alert for one
						of those closes as a fixed bug does. The steps of 36 questions also ask whether
						another way on the page does the same before they lead to a fail.
					</li>
				</ul>
				<p>
					The full list is in core's{" "}
					<a href={`${core}/CHANGELOG.md`}>
						<code>CHANGELOG.md</code>
					</a>
					.
				</p>
			</article>

			<article>
				<h2 id="runonly-threw">
					"<code>runOnly</code> threw: no rule or tag named …, or either rule ids or tags"
				</h2>
				<p>
					Since 1.10.0, <code>runOnly</code> given as a bare array or string is read as rule ids or
					as tags (see{" "}
					<a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a>). It throws
					in two cases:
				</p>
				<ul>
					<li>
						<strong>A value that names no rule and no tag</strong>, usually a typo:{" "}
						<code>runOnly: ['img-alt-presnt']</code>. Check the id against{" "}
						<code>getChecksCatalog()</code>. Case is not the cause: rule ids and tags are matched
						in any case, so <code>IMG-ALT-PRESENT</code> selects <code>img-alt-present</code>.
					</li>
					<li>
						<strong>Rule ids and tags in one array</strong>:{" "}
						<code>runOnly: ['img-alt-present', 'wcag2a']</code>. Use the object form to combine
						them:
					</li>
				</ul>
				<CodeBlock
					lang="js"
					lines={[
						"runOnly: {",
						"  includeRuleIds: ['img-alt-present'],",
						"  tags: ['wcag2a'],",
						"  includeMode: 'or',",
						"}",
					]}
				/>
				<p>Before 1.10.0, a bare array was ignored and every rule ran.</p>
				<p>
					The object form, <code>{"{ includeRuleIds }"}</code>, <code>{"{ tags }"}</code> or{" "}
					<code>{"{ type: 'tag', values }"}</code>, and <code>engineOptions.rules.include</code> /{" "}
					<code>.tags.include</code> throw too, with <code>code: 'INVALID_RUN_ONLY'</code>, when no
					value in the list names a rule or a tag (
					<code>runOnly.tags: no tag named "wcag2.2aa".</code>). They used to run no rule at all,
					which reads as a clean pass. A single unknown value beside known ones, or in an exclude
					list, only logs a <code>console.warn</code>.
				</p>
			</article>

			<article>
				<h2 id="tags-and-rules-run-nothing">
					"I selected tags and rule ids, and the scan ran no rule but looks clean"
				</h2>
				<p>
					Under the default <code>includeMode: 'and'</code>, a selection with both tags and rule ids
					runs only the rules that match both. <code>.withTags('wcag2a').withRules('region')</code>{" "}
					runs nothing, since <code>region</code> is a best practice with no <code>wcag2a</code>{" "}
					tag, and a scan of no rules has no failures. The engine warns in the page's console,
					which a test run doesn't show, and throws <code>INVALID_RUN_ONLY</code> only under{" "}
					<code>strictOptions</code>. To run either, ask for it: <code>.includeMode('or')</code> in
					the bindings, <code>includeMode: 'or'</code> in <code>runOnly</code> (above), or{" "}
					<code>--include-mode or</code> in the <a href="/getting-started/cli/">CLI</a>. From version
					1.3.0, the CLI exits <code>2</code> with that hint when the two have no rule in common.
				</p>
				<p>
					To catch a selection that picks nothing before it runs, check the builder's{" "}
					<code>plannedChecks()</code>, the rules the scan will run, worked out without a page (a
					chainable in Cypress):
				</p>
				<CodeBlock
					lang="js"
					lines={[
						"const builder = new A11yCoreBuilder({ page })",
						"  .withTags('wcag2a')",
						"  .withRules('region')",
						"  .includeMode('or'); // the wcag2a rules, plus region",
						"",
						"if (builder.plannedChecks().length === 0) {",
						"  throw new Error('This selection runs no rule.');",
						"}",
					]}
				/>
				<p>
					See <a href="/configuration/engine-options/#via-runonly-4th-argument">Engine options</a>{" "}
					for how the parts of a selection combine.
				</p>
			</article>

			<article>
				<h2 id="untested-wcag-tag">
					"<code>runOnly.tags: no rules for WCAG 2.2 Level A ("wcag22a")</code>"
				</h2>
				<p>
					The nine WCAG version/level tags, <code>wcag2a</code> to <code>wcag22aaa</code>, are
					always known, but three carry no rule: <code>wcag21aaa</code>, <code>wcag22a</code> and{" "}
					<code>wcag22aaa</code>, whose criteria have no automated check. Naming one beside other
					tags logs that line with <code>console.info</code>: the rest of the list runs, and those
					criteria need manual review. Pass <code>engineOptions.logUntestedWcag: false</code> to
					leave it out, or select by target instead, which names no tag:{" "}
					<code>{"runOnly: { wcag: { version: '2.2', level: 'AA' } }"}</code> (see{" "}
					<a href="/configuration/engine-options/#selecting-by-wcag-target-runonlywcag">
						Selecting by WCAG target
					</a>
					). A list of only such tags would run nothing, so it throws{" "}
					<code>INVALID_RUN_ONLY</code> with the same explanation.
				</p>
			</article>

			<article>
				<h2 id="invalid-wcag-target">
					"<code>runOnly.wcag.version must be …</code>" or "
					<code>runOnly.bestPractices must be true or false …</code>"
				</h2>
				<p>
					<code>runOnly.wcag</code> takes <code>{"{ version, level }"}</code>, with{" "}
					<code>version</code> one of <code>'2.0'</code>, <code>'2.1'</code>, <code>'2.2'</code> (a
					string: <code>2.2</code> as a number is refused) and <code>level</code> one of{" "}
					<code>'A'</code>, <code>'AA'</code>, <code>'AAA'</code>; <code>runOnly.bestPractices</code>{" "}
					takes <code>true</code> or <code>false</code>. Anything else throws{" "}
					<code>INVALID_RUN_ONLY</code> naming the field and the value, rather than running a
					selection you did not mean.
				</p>
			</article>

			<article>
				<h2 id="invalid-engine-options">
					"<code>engineOptions: unknown option "lcoale" (did you mean "locale"?)</code>", or a scan
					threw <code>INVALID_ENGINE_OPTIONS</code>
				</h2>
				<p>
					An option key one or two letters from a known one, in any case, is warned about and
					ignored: the scan runs as if it weren't there, so fix the spelling. Other unknown keys
					stay silent, since a custom rule can read settings of its own from{" "}
					<code>ctx.engineOptions</code>. With <code>engineOptions.strictOptions: true</code>, the
					scan instead throws, with <code>code: 'INVALID_ENGINE_OPTIONS'</code>, on any key the
					engine doesn't read (nested ones included) and on a value of the wrong type or outside
					its set, naming each with the closest known key; the error's <code>problems</code> lists
					them. See{" "}
					<a href="/configuration/engine-options/#catching-mistakes-in-the-options-strictoptions">
						Catching mistakes in the options
					</a>
					.
				</p>
			</article>

			<article>
				<h2 id="custom-rule-rollup">
					"My custom rule fails, but the WCAG rollup doesn't"
				</h2>
				<p>
					A custom rule counts toward the WCAG rollup (<code>rulesResults</code>) of each criterion
					it maps to: give it <code>meta.wcagSc: ['1.1.1']</code>, or a WCAG entry in{" "}
					<code>meta.normativeMappings</code>. With neither, it is in no rollup. A custom rule that
					didn't run (listed in <code>skippedCustomRules</code>) doesn't count either. An override
					of a built-in counts only where its own mapping says, so one that declares none leaves
					the rollups its built-in counted toward, and a warning (
					<code>customRules: "…" overrides a built-in rule but maps to none of the criteria of …</code>
					) names them; give it the built-in's criteria to keep it there.
				</p>
			</article>

			<article>
				<h2 id="contextselector-matched-nothing">
					"My scoped scan reports everything as <code>notApplicable</code>", or "
					<code>contextSelector</code> threw: … is not a valid CSS selector"
				</h2>
				<p>
					Since 1.10.0, a <code>contextSelector</code> that matches no element scans nothing, and
					one the browser can't parse throws (see{" "}
					<a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a>).
				</p>
				<ul>
					<li>
						<strong>Everything is <code>notApplicable</code></strong>: look at{" "}
						<code>result.contextMatch</code>. <code>elementCount: 0</code> means the selector
						matched nothing, so nothing was scanned: that is not a clean result.{" "}
						<code>unmatchedSelectors</code> names the selector. Check it for a typo, or
						whether the element is on the page yet when you scan (content rendered by a script
						after load, say).
					</li>
					<li>
						<strong>
							The scan threw with <code>code: 'INVALID_CONTEXT_SELECTOR'</code>
						</strong>
						: the selector in the message, and in the error's <code>selector</code>, isn't valid
						CSS, for example <code>'#main['</code> or a <code>&gt;&gt;&gt;</code> combinator. Or the
						scope isn't a selector at all, such as an element or an{" "}
						<code>{"{ include, exclude }"}</code> object, and the message says what was passed: pass a
						selector that matches the element, and exclusions in{" "}
						<code>engineOptions.excludeSelectors</code>.
					</li>
				</ul>
				<p>
					Each of these used to scan the whole page instead: a selector that matched nothing or
					couldn't be parsed until 1.10.0, and a scope that isn't a selector in 1.10.0 too.
				</p>
			</article>

			<article>
				<h2 id="page-builtins-broken">"A scan threw <code>PAGE_BUILTINS_BROKEN</code>"</h2>
				<p>
					The page's own scripts changed a JavaScript built-in the engine relies on (
					<code>Array.prototype.filter</code>, <code>Map</code>, <code>JSON.stringify</code> and
					others), so a scan of it could give a result that reads well and is wrong. The error's
					message and its <code>broken</code> list name each one. Scan the page before its scripts
					change them (inject the bundle earlier, or scan a build without the script that does
					it). See <a href="/help/known-limitations/">Known limitations</a>.
				</p>
			</article>

			<article>
				<h2 id="scan-never-returns">"My scan never returns"</h2>
				<p>
					Something in the page blocks the scan: a getter or a script that never returns, or a
					pack's or custom rule's loop. Nothing inside the page can stop a scan once it has
					started, so put the time limit where you start it, and give up on the tab when it
					passes. <a href="/getting-started/standalone/#a-time-limit-on-a-scan">Standalone</a>{" "}
					shows how for Playwright and Puppeteer; in jsdom, run the scan in a worker thread or a
					child process.
				</p>
			</article>

			<article>
				<h2 id="scan-time">"A scan takes longer after upgrading"</h2>
				<p>
					Most of a scan's time is style and layout work in the browser, so it depends on the page,
					the machine and the browser as much as on the engine. A release can still change it: a rule
					that now checks more of the page costs more, and core's <a href={`${core}/CHANGELOG.md`}><code>CHANGELOG.md</code></a>{" "}
					says when a release changes what a rule costs. <a href={`${core}/docs/PERFORMANCE.md`}><code>PERFORMANCE.md</code></a>, on GitHub, records how long a scan
					takes release by release, as a ratio to an earlier release on the same pages, and how that
					is measured. A rule that is slower and finds more may be paying for what it now finds; one
					that is slower with the same results is a regression worth <a href="https://github.com/SureA11y/core/issues">reporting</a>.
				</p>
			</article>

			<article>
				<h2 id="pack-did-not-run">"A pack did not run", or <code>skippedPacks</code> is not empty</h2>
				<p>
					A pack whose <code>core</code> range leaves out the installed core, that isn't valid, or
					that doesn't fit with core (a rule id outside its namespace, a dictionary key core has)
					is skipped: the scan runs without it, warns, and lists it in{" "}
					<code>result.skippedPacks</code> with the reason; under <code>strictOptions</code> it
					throws. In a page, a pack named in <code>engineOptions.packs</code> that no{" "}
					<code>packScript</code> call registered, or registered with another core version, is
					listed the same way. The bindings report it as a <code>'pack-skipped'</code> gap, the
					test matchers fail the assertion, and the CLI exits <code>2</code>. Install the pack
					beside <code>@surea11y/core</code> and the package that runs it, so all three share one
					copy of core. See <a href="/configuration/packs/#when-a-pack-doesnt-run">Packs</a>.
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
					<a href="/help/known-limitations/"><code>LIMITATIONS.md</code></a>.
				</p>
			</article>

			<article>
				<h2 id="web-component-canttell">
					"A web component comes back <code>cantTell</code> (<code>name_internals</code>)"
				</h2>
				<p>
					A custom element that names itself, sets its states or gives itself a role through an{" "}
					<code>ElementInternals</code> kept in a private field (<code>#internals</code>) is
					exposed by the browser, but no page script can read that back. Since 1.12 the engine
					reads internals kept on a property (<code>_internals</code>, <code>internals</code>, …),
					and asks about any other defined custom element with no readable name or required state
					(<code>name_internals</code>, <code>state_internals</code>) instead of failing it.
				</p>
				<p>
					To let the scan judge such elements, install the internals hook before the page's
					scripts run: <code>installInternalsHook()</code> in each binding (on the page or context
					in <a href="/getting-started/playwright/">Playwright</a>, the page in{" "}
					<a href="/getting-started/puppeteer/">Puppeteer</a>, the driver in{" "}
					<a href="/getting-started/selenium/">Selenium</a>, the browser in{" "}
					<a href="/getting-started/webdriverio/">WebdriverIO</a>, the support file or{" "}
					<code>onBeforeLoad</code> in <a href="/getting-started/cypress/">Cypress</a>) and in{" "}
					<a href="/getting-started/test-matchers/">test-matchers</a>' setup file, or core's{" "}
					<code>internalsHookScript()</code> for a page of your own. The result's{" "}
					<code>engine.environment.internalsHook</code> says whether it ran (<code>'early'</code>{" "}
					or <code>'late'</code>). The hook lets any script on the page read every component's
					internals, so it is meant for test and audit runs. See{" "}
					<a href="/help/known-limitations/">Known limitations</a>.
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
					target(s) existed and none were flagged," and <code>occurrences</code> is{" "}
					<code>[]</code>. The contrast rules are the exception: their <code>pass</code> carries
					one occurrence with an empty <code>selector</code> that describes the scan (how much
					text was eligible and computable), not an element. If you need to know which specific elements were checked and
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
				<h2 id="why-criterion-canttell">
					"Every check passed, so why is each WCAG criterion <code>cantTell</code>?"
				</h2>
				<p>
					Since 1.14, a WCAG rollup in <code>rulesResults</code> passes only for a criterion whose
					rules check all it asks, and no criterion is listed as such yet (<code>COMPLETE_CHECK</code>{" "}
					in <code>src/coverage/complete-applicability.js</code>). Where every rule of a criterion
					passes, its rollup is <code>cantTell</code> with <code>reasonCode</code>{" "}
					<code>composite.rollup.cantTell.partialCheck</code>: the parts the rules check are met, and
					a person checks the rest.{" "}
					<a href="/rules/html-lang-attr-present/"><code>html-lang-attr-present</code></a> finds that{" "}
					<code>{'<html lang="fr">'}</code> names a language, not that the page is in French.
					Likewise, a criterion whose rules all found nothing is <code>notApplicable</code> only where
					they find every case it applies to, and otherwise <code>cantTell</code> with{" "}
					<code>composite.rollup.cantTell.partialCoverage</code>. A failing rule still fails its
					criterion. Show these as "checks passed, needs review" and "nothing found to check", never
					as passed; see{" "}
					<a href="/conformance/wcag-mapping/#when-a-criterion-passes">WCAG conformance mapping</a>.
				</p>
			</article>

			<article>
				<h2>"Does a clean scan (no failures) mean the page is WCAG conformant?"</h2>
				<p>
					No — see <a href="/conformance/wcag-mapping/"><code>WCAG_CONFORMANCE.md</code></a>.{" "}
					<strong>
						A rule's <code>pass</code> means the checks that ran came back clean on the part of the page
						they scanned.
					</strong>{" "}
					A scan scoped to part of a page, limited to some rules, or run under jsdom checks less
					than it could. A meaningful
					fraction of WCAG requires human judgment (accurate alt text, understandable error
					messages) or dynamic testing this engine's architecture can't do at all (keyboard traps,
					reflow at zoom) — see <a href="/help/known-limitations/"><code>LIMITATIONS.md</code></a> for
					the explicit, non-exhaustive-on-purpose list.
				</p>
			</article>

			<article>
				<h2>"Should I treat <code>cantTell</code> as a failure?"</h2>
				<p>
					<strong>Treat it as "needs a human to look" — it's neither pass nor fail by design.</strong> A
					common choice is to log <code>cantTell</code> findings without failing CI on them, since
					failing a build on something the engine explicitly couldn't determine tends to train
					people to ignore the gate. A team that wants every one reviewed before a merge can gate
					on them instead; either way, keep them apart from failures. In between, a build can gate
					only on the findings that lean fail, where the page's evidence points to a failure:{" "}
					<code>leanFailAs</code> in the <a href="/results-reports/junit-report/#options">JUnit</a>{" "}
					and <a href="/results-reports/sarif-report/#options">SARIF</a> reporters, or{" "}
					<code>leaningFailures(result)</code> (see <a href="/results-reports/output-schema/#leans">Leans</a>).
					Each <code>cantTell</code> finding of a core rule says how to answer it in{" "}
					<code>howToCheck</code>. See <a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a> if you want to
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
					coverage. Key parity is enforced in core's own build rather than hoped for: every new
					or renamed English key is carried into every other locale file, holding the English
					text until someone translates it, so a locale can be behind on wording without ever
					being behind on keys.
				</p>
			</article>

			<article>
				<h2>
					"<code>runDomRulesInPage</code> vs <code>runa11yCoreInPage</code> — which one do I want?"
				</h2>
				<p>
					<code>runDomRulesInPage</code> if you're calling it directly in the same Node process
					(jsdom). <code>runa11yCoreInPage</code> if you're
					handing the <em>function itself</em> to a different JS realm — almost always{" "}
					<code>page.evaluate</code> in Puppeteer/Playwright, which serializes the function to
					source text and re-runs it inside the browser tab (which has no access to your Node
					module scope). See <a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>{" "}
					for both patterns worked out in full.
				</p>
			</article>

			<article>
				<h2 id="baseline-after-upgrade">
					"After upgrading, my baseline reports known findings as new and their entries as stale"
				</h2>
				<p>
					A finding's identity includes its reason code, and 1.14 gave codes to seventeen rules
					that had none and split a few codes by cause. A baseline written by 1.13 keeps matching
					those findings under 1.14.x, through <code>src/baseline-moves.json</code>; a finding whose
					outcome changed with the upgrade is new or gone all the same, and the changelog says why.
					Rewrite the file's codes with <code>migrateBaselineEntries</code> from{" "}
					<code>@surea11y/core/baseline</code>, or regenerate it and review the diff, before 1.15.
					See <a href="/conformance/baseline/#upgrading">Baseline / allowlist</a>.
				</p>
			</article>

			<article>
				<h2 id="stylesheets-not-readable">
					"<code>css-orientation-lock</code> asks about <code>STYLESHEETS_NOT_READABLE</code>"
				</h2>
				<p>
					A page's script can't read a style sheet another origin serves (a CDN, a fonts service),
					so the rules that read CSS can't tell what it holds. Give the scan its text in{" "}
					<code>engineOptions.styleSheetTexts</code>: <code>preloadStyleSheets()</code>, or{" "}
					<code>runa11yCoreInPageAsync</code> on the browser bundle, fetches those the server
					shares, and a tool driving the browser can fetch the others from outside the page. See
					"Style sheets from another origin" in{" "}
					<a href={`${core}/docs/INTEGRATION.md#style-sheets-from-another-origin`}>
						<code>INTEGRATION.md</code>
					</a>
					, the integration guide on GitHub.
				</p>
			</article>
		</>
	);
}
