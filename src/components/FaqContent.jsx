import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function FaqContent() {
	return (
		<>
			<article>
				<h2 id="results-changed-1-18">"My results changed after upgrading to core 1.18"</h2>
				<p>
					1.18 adds five rules that ask, turns a few failures into questions where the page's
					evidence can't settle them, and measures more of what a browser draws. The changes most
					likely to show in a pipeline:
				</p>
				<ul>
					<li>
						<strong>New questions, never new failures.</strong>{" "}
						<a href="/rules/form-group-name-present/">
							<code>form-group-name-present</code>
						</a>{" "}
						(1.3.1) asks about radio buttons and checkboxes that share a name but sit in no named
						group, and{" "}
						<a href="/rules/symbol-graphic-contrast/">
							<code>symbol-graphic-contrast</code>
						</a>{" "}
						(1.4.11) about symbols such as ★ under 3:1; both run in a WCAG 2.2 AA scan.{" "}
						<a href="/rules/reflow-horizontal-scroll/">
							<code>reflow-horizontal-scroll</code>
						</a>{" "}
						(1.4.10) and{" "}
						<a href="/rules/resize-text-content-loss/">
							<code>resize-text-content-loss</code>
						</a>{" "}
						(1.4.4) apply only to a page laid out 320 or 640 CSS pixels wide or less, in a browser,
						so a scan at a usual width is unchanged (see{" "}
						<a href="/help/known-limitations/">Known limitations</a>).{" "}
						<a href="/rules/link-name-quality-link-only/">
							<code>link-name-quality-link-only</code>
						</a>{" "}
						(2.4.9) runs only in a scan that targets AAA. All five report <code>cantTell</code>,
						some with a lean to fail.
					</li>
					<li>
						<strong>A few failures ask instead.</strong> An unnamed video with a poster (
						<a href="/rules/video-poster-text-alternative-present/">
							<code>video-poster-text-alternative-present</code>
						</a>
						, whose message keys move from <code>_fail</code> to <code>_cantTell</code>), and a list
						item whose list has a landmark or structure role that replaces list, such as{" "}
						<code>&lt;ul role="navigation"&gt;</code> (
						<a href="/rules/listitem-parent-valid/">
							<code>listitem-parent-valid</code>
						</a>
						, still a failure under a widget role such as <code>tablist</code> or{" "}
						<code>menu</code>). Both lean fail.
					</li>
					<li>
						<strong>Target size measures more, and exempts native controls as browsers draw
						them.</strong>{" "}
						<a href="/rules/target-size-minimum/">
							<code>target-size-minimum</code>
						</a>{" "}
						and{" "}
						<a href="/rules/target-size-enhanced/">
							<code>target-size-enhanced</code>
						</a>{" "}
						measure every interactive widget (checkbox, combobox, option, slider, tab and the like),
						not only buttons and links, so new failures can appear. An unstyled native control has
						the user agent exception, so common resets (normalize.css, <code>{"* { padding: 0 }"}</code>,
						Bootstrap Reboot) no longer fail checkbox and radio lists; a text input given its own
						height, or a checkbox resized outside 12 to 16 pixels, still can. A fixed or sticky
						target is spaced only against the targets that move with it.
					</li>
					<li>
						<strong>Contrast changes in three places.</strong> A currency sign beside its digits (
						<code>&lt;span&gt;€&lt;/span&gt;45,00</code>) is judged as text, at 4.5:1, by{" "}
						<code>contrast-minimum</code>. <code>aria-disabled</code> exempts text only on a
						control, a widget role or a focusable element, or inside one; on a plain{" "}
						<code>&lt;span&gt;</code> or <code>&lt;div&gt;</code> it exempts nothing. Under jsdom,
						SVG text after a drawn shape, and text under a positioned <code>::before</code> or{" "}
						<code>::after</code> with a background, are asked about (<code>contrast-computable</code>
						, <code>BACKGROUND_OVERLAP</code>) instead of measured from a guessed geometry; Chromium
						is unchanged.
					</li>
					<li>
						<strong>Smaller tables are checked.</strong>{" "}
						<a href="/rules/td-has-header/">
							<code>td-has-header</code>
						</a>{" "}
						checks tables from 2 by 2 cells, where it looked only at 4 by 4 or more: a small table
						with no header cell is asked about, and a data cell left without a header in one that
						has some fails.
					</li>
					<li>
						<strong>Some findings move to another rule or code.</strong>{" "}
						<code>button-name-present</code> leaves a <code>&lt;button role="tab"&gt;</code>, or
						another named role, to that role's rule, so it is reported once.{" "}
						<code>aria-prohibited-attr</code> names the role of a <code>&lt;p&gt;</code>,{" "}
						<code>&lt;strong&gt;</code> and the like (<code>ARIA_ATTR_PROHIBITED</code>, with no
						lean), so a baseline entry written with <code>leanFail: true</code> for the old code is
						stale. Two codes are split by cause (<code>deprecated-elements-not-used</code>'s{" "}
						<code>MARQUEE_STOPS_ONLY_ON_HOVER</code>, <code>page-title-patterns</code>'{" "}
						<code>placeholderTitle</code>), and a 1.17 baseline still matches the moved findings
						(see <a href="#baseline-after-upgrade">the entry below</a>).
					</li>
					<li>
						<strong>Excluded areas are context.</strong> <code>heading-order</code>,{" "}
						<code>page-has-heading-one</code>, <code>landmark-one-main</code> and{" "}
						<code>bypass-blocks-present</code> read the headings and main landmark of an area left
						out with <code>excludeSelectors</code>, so excluding a site header no longer invents a
						missing <code>&lt;h1&gt;</code> or a skipped level.
					</li>
					<li>
						<strong>An occurrence marked <code>pass</code> counts as one.</strong>{" "}
						<code>occurrenceOutcome()</code> gives <code>'pass'</code> for it, also inside a failing
						check, so SARIF, JUnit, the HTML report and baselines no longer count it as a failure.
						An exhaustive <code>switch</code> on it needs a <code>'pass'</code> case.
					</li>
					<li>
						<strong>Packs built for 1.17 may be skipped.</strong> A pack whose <code>core</code>{" "}
						range leaves out 1.18, such as <code>~1.17.0</code>, is skipped, and{" "}
						<code>skippedPacks</code> says why (see{" "}
						<a href="#pack-did-not-run">the entry below</a>): the{" "}
						<a href="/configuration/packs/#en-301-549-pack">EN 301 549 pack</a> needs 1.5.0. The
						pack APIs that were experimental since 1.16 are stable now, so a pack can widen its
						range to <code>^1.18.0</code>.
					</li>
					<li>
						<strong>Frames get longer to answer.</strong> <code>runa11yCoreAcrossFrames</code>{" "}
						waits 2 seconds for a child frame's ping, not 500 ms, so a busy frame is no longer
						skipped as unreachable; a page with an embed that never answers takes up to 1.5 s more
						per level of frames. Set <code>engineOptions.pingWaitTime</code> to keep the old wait.
					</li>
					<li>
						<strong>Messages write decimals as their language does</strong>: "2,85:1" in French,
						German and Spanish, "2.85:1" in English and Japanese. A test that compares message
						text needs updating; <code>data.details</code> and <code>i18n.params</code> keep the
						numbers as they were (see <a href="/configuration/locales/">Locales</a>).
					</li>
					<li>
						<strong>Options are checked more closely.</strong> An empty <code>runOnly</code> list,
						a <code>rules</code> or <code>tags</code> filter beside <code>runOnly</code>, or a{" "}
						<code>timestamp</code> that isn't an ISO 8601 date is warned about, and refused under{" "}
						<code>strictOptions</code> (see <a href="#invalid-engine-options">the entry below</a>).
						Values 1.17 accepted still work.
					</li>
					<li>
						<strong>1.18.1 changes two rules.</strong>{" "}
						<a href="/rules/p-as-heading/">
							<code>p-as-heading</code>
						</a>{" "}
						also asks about a bold line on a page whose body text is 18px or more, when the line is
						no larger than the text after it, only heavier, as some themes set{" "}
						<code>&lt;strong&gt;</code>; 1.18.0 asked only below 18px.{" "}
						<a href="/rules/link-in-text-block/">
							<code>link-in-text-block</code>
						</a>{" "}
						compares a link with its text block, the nearest ancestor laid out as a block, not with
						an inline element beside it. An underlined link beside an underlined{" "}
						<code>&lt;abbr&gt;</code> no longer fails; a plain link beside a bold label or a span of
						another color is no longer set apart by it, so where that was the only difference it now
						fails, or asks at 3:1 or more, where it passed before.
					</li>
				</ul>
				<p>
					New, and changing nothing unless you use it: a time budget for a scan (
					<code>engineOptions.timeBudgetMs</code>, which lists what it didn't run in{" "}
					<code>notRun</code> and never reads as a pass) and a cap on the occurrences kept per rule (
					<code>engineOptions.output.maxOccurrencesPerRule</code>, which changes no outcome), both
					in <a href="/configuration/engine-options/#a-time-budget-timebudgetms">Engine options</a>. A page that puts values on{" "}
					<code>Object.prototype</code> no longer changes a scan (see{" "}
					<a href="#page-builtins-broken">the entry below</a>). A full scan in Chromium is about 9%
					slower than with 1.17.0, the cost of the new checks, and the browser bundle grows from
					1,829 to 2,088 KB. The full list is in core's{" "}
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
					others, or a getter on <code>Object.prototype</code>), so a scan of it could give a result
					that reads well and is wrong. The error's message and its <code>broken</code> list name
					each one; the list is empty when a built-in is broken so badly that the check itself
					threw. Scan the page before its scripts change them (inject the bundle earlier, or scan a
					build without the script that does it). See{" "}
					<a href="/help/known-limitations/">Known limitations</a>.
				</p>
				<p>
					A plain value a script put on <code>Object.prototype</code> (
					<code>Object.prototype.type = 'x'</code>, read-only or not) doesn't stop the scan, since
					core 1.18: the engine defines the keys it sets on its own objects rather than assigning
					them, and reads its options, rule results and the records outcomes depend on as their own
					keys, so such a value doesn't change them. Not every internal record is read that way
					yet, so a value of such a name can still change a result; the names known to have changed
					one are tested in jsdom and in Chromium. A value on a property the page's own DOM objects
					inherit (<code>disabled</code>, <code>getAttribute</code>) changes those objects, and the
					engine reads them as the page left them. The scan never changes{" "}
					<code>Object.prototype</code> either, so the page's own code that runs during it sees it as
					the page left it. A getter put there that throws or gives a value still stops the scan,
					as above.
				</p>
				<p>
					When <code>broken</code> is only <code>Array.from</code>, the page replaced it
					(Prototype and MooTools do) and a pack's or custom rule in the scan uses it: core's own
					rules don't, since 1.16. Write that rule with spread (<code>[...x]</code>,{" "}
					<code>[...x].map(f)</code>), or leave it out of the selection. The{" "}
					<a href="/configuration/packs/#wai-aria-pack">WAI-ARIA pack</a> did this until its 1.0.2
					release: update it.
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
				<p>
					A scan of several profiles at once (<code>profile: ['wcag22-aa', 'wai-aria-1.2']</code>)
					scans the page once per profile, so it takes about as long as that many scans.
				</p>
			</article>

			<article>
				<h2 id="profile-not-run">
					"A profile did not run", or <code>engine.profilesNotRun</code> is not empty
				</h2>
				<p>
					In a scan of several profiles, a profile that couldn't run is listed in{" "}
					<code>engine.profilesNotRun</code> with its reason, and the others still run:{" "}
					<code>unknown-profile</code> (no such profile: a pack's profile needs its pack in{" "}
					<code>packs</code>), <code>pack-skipped</code> (its pack didn't run, see{" "}
					<a href="#pack-did-not-run">the entry below</a>) or{" "}
					<code>overridden-by-selection</code> (a <code>runOnly</code> include, or rule ids or tags
					in <code>engineOptions</code>, chose the rules instead, for every profile). Such a scan
					judged less than it was asked to, so SARIF and JUnit report an error unless{" "}
					<code>allowProfilesNotRun: true</code>, the CLI exits <code>2</code> unless{" "}
					<code>--allow-profiles-not-run</code>, the bindings report a{" "}
					<code>'profile-not-run'</code> gap, and the test matchers fail the assertion. See{" "}
					<a href="/configuration/engine-options/#several-profiles">Engine options</a>.
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
				<h2 id="framed-page-rules">
					"The title, language and landmark rules are <code>notApplicable</code> in a frame"
				</h2>
				<p>
					Since 1.15, a document shown in a frame is no page of its own:{" "}
					<code>page-title-present</code>, <code>page-title-patterns</code>,{" "}
					<code>html-lang-attr-present</code>, <code>meta-viewport-zoom-enabled</code>,{" "}
					<code>meta-viewport-large</code>, <code>region</code>,{" "}
					<code>bypass-blocks-present</code>, <code>landmark-one-main</code> and{" "}
					<code>page-has-heading-one</code> are <code>notApplicable</code> in it. The page around
					the frame is what has the title, language and landmarks people use, and a browser ignores
					a framed document's viewport <code>&lt;meta&gt;</code>. A test runner that shows the page
					under test in a frame of its own sets <code>engineOptions.topLevelDocument: true</code>;{" "}
					<a href="/getting-started/cypress/">@surea11y/cypress</a> 1.6.0 does it for you. See{" "}
					<a href="/configuration/engine-options/">Engine options</a>.
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
					the explicit, non-exhaustive-on-purpose list. What's left is a person's to check, and
					core's <a href="/conformance/procedures/">test procedures</a> say how, criterion by
					criterion.
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
					those findings under 1.14.x, through <code>src/baseline-moves.json</code>, but not under
					1.15, which dropped those moves: there an entry under an old code is stale and its finding
					is new. Rewrite the file's codes under 1.14.x with <code>migrateBaselineEntries</code>{" "}
					from <code>@surea11y/core/baseline</code>, then upgrade, or regenerate it under 1.15 and
					review the diff. 1.15, 1.16 and 1.17 moved no code, so a baseline written by 1.14 keeps
					matching up to 1.17. 1.18 splits two codes by cause (
					<code>deprecated-elements-not-used</code>'s <code>MARQUEE_STOPS_ONLY_ON_HOVER</code>,{" "}
					<code>page-title-patterns</code>' <code>placeholderTitle</code>): a baseline written by
					1.17 keeps matching those findings under 1.18.x, and 1.19 drops the moves, so rewrite or
					regenerate it under 1.18 before going further. A finding whose outcome changed with the
					upgrade is new or gone all the same, and the changelog says why. See{" "}
					<a href="/conformance/baseline/#upgrading">Baseline / allowlist</a>.
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

			<article>
				<h2 id="results-changed-1-17">"My results changed after upgrading to core 1.17"</h2>
				<p>
					1.17 adds four rules, maps some rules to more criteria, and makes messages name the cause
					of a finding. Outcomes and reason codes of the existing rules are otherwise unchanged. The
					changes most likely to show in a pipeline:
				</p>
				<ul>
					<li>
						<strong>A WCAG 2.2 AA scan in a browser asks about 2.4.11.</strong>{" "}
						<a href="/rules/focus-not-obscured-minimum/">
							<code>focus-not-obscured-minimum</code>
						</a>{" "}
						asks (<code>cantTell</code>) about a fixed or sticky box, such as a header, footer or
						banner, that elements in the tab order can take focus hidden behind, and{" "}
						<a href="/rules/focus-not-obscured-enhanced/">
							<code>focus-not-obscured-enhanced</code>
						</a>{" "}
						does the same for 2.4.12 (AAA). Under jsdom both are <code>notApplicable</code>. Such
						a scan takes about 4% longer in Chromium (see{" "}
						<a href="/help/known-limitations/">Known limitations</a> for what they leave out).
					</li>
					<li>
						<strong>A scan that runs AAA rules fails targets under 44 px.</strong>{" "}
						<a href="/rules/target-size-enhanced/">
							<code>target-size-enhanced</code>
						</a>{" "}
						(2.5.5) runs in a full scan, one with no WCAG target, and under a AAA target. A
						pipeline that fails on any <code>fail</code> of a full scan can see new failures:
						scan with a target, such as the <code>wcag22-aa</code> profile, to judge by A and AA
						only (see <a href="/configuration/engine-options/">Engine options</a>). With best
						practices,{" "}
						<a href="/rules/page-zones-landmark/">
							<code>page-zones-landmark</code>
						</a>{" "}
						asks about a header, navigation, search or footer that isn't its landmark.
					</li>
					<li>
						<strong>Some rules count toward more criteria.</strong>{" "}
						<code>css-focus-indicator-suppressed</code> maps to 1.4.11 and 2.4.13 too, so its
						findings now show in 1.4.11's result; <code>focus-not-removed-by-script</code> maps
						to 2.4.13, and four rules that map to 2.1.1 map to 2.1.3 too.
					</li>
					<li>
						<strong>Messages name the root cause</strong> the rules find: why an element has no
						name (<code>data.details.nameCause</code>), a likely typo in a role, attribute or{" "}
						<code>autocomplete</code> value, what hides an element, the contrast in a{" "}
						<code>link-in-text-block</code> fail, how far a target is from passing{" "}
						<code>target-size-minimum</code>. A test that compares message text, or{" "}
						<code>target-size-minimum</code>'s hint key (now <code>_centerDistance</code> or{" "}
						<code>_regionDistance</code>), needs updating.
					</li>
					<li>
						<strong>A few findings move.</strong> <code>css-hidden-focus</code> leans fail when
						the element is out of view and nothing is known to bring it into view;{" "}
						<code>aria-hidden-focus</code> fails a focusable element set back to{" "}
						<code>visibility: visible</code> inside a hidden <code>aria-hidden</code> root;{" "}
						<code>aria-conditional-attr</code> passes an <code>aria-invalid</code> value outside
						its tokens; <code>link-in-text-block</code> counts only text on the link's own line.
					</li>
					<li>
						<strong>Packs built for 1.16 may be skipped.</strong> A pack that uses core's
						experimental APIs takes no later minor, so a scan with 1.17 skips it until it has a
						release for 1.17: the{" "}
						<a href="/configuration/packs/#en-301-549-pack">EN 301 549 pack</a> needs 1.4.0. And
						1.17 removed four fields of a standard's laws, which a pack that still has them is
						refused for (see <a href="/configuration/packs/#laws">Packs</a>).
					</li>
				</ul>
				<p>
					New, and changing nothing unless you use it: a pack built on another pack (
					<code>uses</code>, <code>surea11y-pack new --kind derived</code>), experimental until
					1.19.0 (<a href="/configuration/packs/#a-pack-built-on-another-pack">Packs</a>). The
					browser bundle grows from 1,565 to 1,829 KB, mostly the new messages. The full list is in
					core's{" "}
					<a href={`${core}/CHANGELOG.md`}>
						<code>CHANGELOG.md</code>
					</a>
					.
				</p>
			</article>

			<article>
				<h2 id="results-changed-1-15">"My results changed after upgrading to core 1.15"</h2>
				<p>
					1.15 fails a WCAG criterion only where WCAG fails, and reads frames as the browser shows
					them. The changes most likely to show in a pipeline:
				</p>
				<ul>
					<li>
						<strong>Fewer ARIA and HTML structure failures.</strong> Eight ARIA rules and the HTML
						structure rules no longer fail a criterion where only WAI-ARIA or the HTML content
						model is broken: those findings are <code>cantTell</code>, with uncertainty{" "}
						<code>spec-only</code> and steps to check. Affected:{" "}
						<a href="/rules/aria-role-name-present/"><code>aria-role-name-present</code></a> (grid,
						tree, radiogroup, meter, progressbar),{" "}
						<a href="/rules/dialog-name-present/"><code>dialog-name-present</code></a>,{" "}
						<a href="/rules/tooltip-name-present/"><code>tooltip-name-present</code></a>,{" "}
						<a href="/rules/aria-allowed-attr/"><code>aria-allowed-attr</code></a>,{" "}
						<a href="/rules/aria-valid-attr-value/"><code>aria-valid-attr-value</code></a> (except
						for a control's state, value or focus),{" "}
						<a href="/rules/aria-prohibited-attr/"><code>aria-prohibited-attr</code></a>,{" "}
						<a href="/rules/aria-roles-valid/"><code>aria-roles-valid</code></a> (except on a
						focusable element), <a href="/rules/aria-owns-valid/"><code>aria-owns-valid</code></a>{" "}
						(an ancestor; it maps to 1.3.1 only now),{" "}
						<a href="/rules/list-children-valid/"><code>list-children-valid</code></a> and{" "}
						<a href="/rules/listitem-parent-valid/"><code>listitem-parent-valid</code></a> (except
						where the page draws the broken item),{" "}
						<a href="/rules/definition-list-children-valid/"><code>definition-list-children-valid</code></a>,{" "}
						<a href="/rules/dlitem-parent-valid/"><code>dlitem-parent-valid</code></a> and{" "}
						<a href="/rules/nested-interactive-controls-absent/"><code>nested-interactive-controls-absent</code></a>{" "}
						(except inside a control with presentational children). Every finding keeps its reason
						code, so baselines still match, but a gate or a rollup that only these failed now
						passes or is <code>cantTell</code>. To judge the same findings by WAI-ARIA, where they
						fail, add the <a href="/configuration/packs/#wai-aria-pack">WAI-ARIA pack</a>.
					</li>
					<li>
						<strong>A framed document is no page of its own.</strong> In a frame,{" "}
						<code>page-title-present</code>, <code>html-lang-attr-present</code>, the viewport,
						bypass and landmark rules are <code>notApplicable</code> (see{" "}
						<a href="#framed-page-rules">the entry above</a>). A frame under{" "}
						<code>aria-hidden</code> or <code>inert</code> is read as such, and one behind an open
						modal dialog is left out.
					</li>
					<li>
						<strong>Roles follow WAI-ARIA more closely.</strong> <code>role="text"</code> names no
						valid role; an image with a presentational role and a global ARIA attribute keeps its
						role, and fails <a href="/rules/img-alt-present/"><code>img-alt-present</code></a>{" "}
						without <code>alt</code>; the four globals WAI-ARIA 1.2 deprecates no longer give a
						presentational element its role back.
					</li>
					<li>
						<strong>A skipped heading level is a best practice issue</strong>, not a 1.3.1 failure,
						in the reviewed <a href="/conformance/procedures/">test procedures</a>, which also give
						the "How to check" steps of six new questions.
					</li>
					<li>
						<strong>A baseline from 1.13 needs updating first.</strong> 1.15 moved no reason code,
						and dropped the moves from 1.13 to 1.14 (see{" "}
						<a href="#baseline-after-upgrade">the entry above</a>).
					</li>
				</ul>
				<p>
					New, and changing nothing unless you use it: scans of several profiles at once (
					<a href="/configuration/engine-options/#several-profiles">Engine options</a>), the{" "}
					<code>wcag22-a</code> and <code>wcag22-aaa</code> profiles, test procedures for assessing
					by hand, and the HTML report's "What's left for a person". The full list is in core's{" "}
					<a href={`${core}/CHANGELOG.md`}>
						<code>CHANGELOG.md</code>
					</a>
					.
				</p>
			</article>
		</>
	);
}
