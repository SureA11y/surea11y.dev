import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function FaqContent() {
	return (
		<>
			<article>
				<h2 id="results-changed-1-12">"My CI results changed after upgrading to core 1.12"</h2>
				<p>
					What the engine finds is mostly the same; where it lands, and a few rules, changed. The
					changes most likely to show in a pipeline:
				</p>
				<ul>
					<li>
						<strong>An empty heading fails.</strong>{" "}
						<a href="/rules/empty-heading/"><code>empty-heading</code></a> fails a heading with no
						accessible name, where it asked about one. It is a best practice, so it runs in a scan
						with no selection or with the best practices added, not under a WCAG target, tags or a
						profile. Fix the heading, or scan a WCAG target.
					</li>
					<li>
						<strong>
							<a href="/rules/label-in-name/"><code>label-in-name</code></a> counts text hidden
							only with <code>aria-hidden</code>
						</strong>
						, since it is still painted:{" "}
						<code>{'Download <span aria-hidden="true">gizmo</span> specification'}</code> named
						"Download specification" now fails 2.5.3.
					</li>
					<li>
						<strong>Scans that name checks report their criteria.</strong> Rule ids, a tag that
						names no WCAG level, or the best practices now fill <code>rulesResults</code> with the
						criteria those rules belong to, where it was empty; a criterion whose other rules
						weren't selected is <code>cantTell</code>, partly checked. Set{" "}
						<code>engineOptions.wcagLevel</code> (<code>.wcagLevel()</code> in the bindings,{" "}
						<code>--wcag-level</code> in the CLI) to keep them to a level. See{" "}
						<a href="/conformance/wcag-mapping/">WCAG conformance mapping</a>.
					</li>
					<li>
						<strong>Five rules count toward more criteria</strong>, as W3C's ACT rules map them:{" "}
						<code>input-image-alt-present</code> adds 4.1.2, <code>aria-roles-valid</code> 1.3.1,{" "}
						<code>link-name-present</code> and <code>link-name-quality</code> 2.4.9 (AAA), and{" "}
						<code>meta-refresh-timing-absent</code> 2.2.4 and 3.2.5 (AAA). The findings don't
						change, but the 1.3.1 and 4.1.2 rollups can now fail where they passed.
					</li>
					<li>
						<strong>JUnit suite names are the same in every locale</strong> (
						<code>WCAG 4.1.2</code>), and the title moves to the suite's <code>title</code>{" "}
						property. A dashboard that tracks tests by suite name shows them once as new. See{" "}
						<a href="/results-reports/junit-report/">JUnit report</a>.
					</li>
					<li>
						<strong>Contrast is measured as the page is drawn.</strong> In a browser, text on a
						page with no background, generated text (<code>::before</code>, <code>::after</code>,{" "}
						<code>::marker</code>) and a closed <code>&lt;select&gt;</code> are measured, where
						they were left out or <code>cantTell</code>, so new contrast failures can appear. A
						lone character standing in for its control's name, such as "X" in a button named
						"Close", is asked about rather than failed below the ratio.
					</li>
					<li>
						<strong>Unnamed web components are questions.</strong> A defined custom element with no
						readable name is <code>cantTell</code> where it failed; see{" "}
						<a href="#web-component-canttell">the entry on web components</a>.
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
				<h2>"Does a clean scan (<code>pass</code> everywhere) mean the page is WCAG conformant?"</h2>
				<p>
					No — see <a href="/conformance/wcag-mapping/"><code>WCAG_CONFORMANCE.md</code></a>.{" "}
					<strong>
						A <code>pass</code> means the checks that ran came back clean on the part of the page
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
					on them instead; either way, keep them apart from failures. See <a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a> if you want to
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
					(jsdom). <code>runa11yCoreInPage</code> if you're
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
