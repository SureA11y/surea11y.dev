import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const apiRows = [
	{
		id: "received",
		param: <code>received</code>,
		type: (
			<>
				<code>Element</code>, <code>Document</code>, or scan result
			</>
		),
		meaning: (
			<>
				What to check. A DOM <code>Element</code>/<code>Document</code> is scanned automatically;
				an object shaped like <code>{"{ checksResults: [...] }"}</code> is asserted on directly,
				with no scan performed. Anything else throws a <code>TypeError</code>.
			</>
		),
	},
	{
		id: "engineOptions",
		param: <code>engineOptions</code>,
		type: "object (optional)",
		meaning: (
			<>
				Passed straight through to <code>@surea11y/core</code>'s scan — the same options object
				used everywhere else in the ecosystem (see <a href="/configuration/engine-options/">Engine options</a>). Ignored
				when <code>received</code> is already a scan result.
			</>
		),
	},
	{
		id: "runOnly",
		param: <code>runOnly</code>,
		type: "object, string or string[] (optional)",
		meaning: (
			<>
				Passed straight through as the scan's <code>runOnly</code>: a WCAG target (
				<code>{"{ wcag: { version: '2.2', level: 'AA' } }"}</code>), <code>bestPractices</code>,
				rule ids or tags. See <a href="#choosing-a-wcag-target">Choosing a WCAG target</a>. Ignored
				when <code>received</code> is already a scan result.
			</>
		),
	},
	{
		id: "options",
		param: <code>options</code>,
		type: "object (optional)",
		meaning: (
			<>
				<code>{"{ failOnSeverity, leanFail, wcagOnly, howToCheck }"}</code>: see{" "}
				<a href="#failing-only-on-serious-problems">Failing only on serious problems</a> and{" "}
				<a href="#questions-that-likely-fail">Questions that likely fail</a>. Each overrides the
				default <code>configureA11yMatchers()</code> set.
			</>
		),
	},
];

export function TestMatchersUsageContent() {
	return (
		<>
			<p>
				For unit and component tests — assert accessibility inline in a Jest or Vitest suite,
				against whatever DOM the test already has, rather than driving a real or headless browser.
				If you're testing full rendered pages instead, see{" "}
				<a href="/getting-started/">the browser-driven bindings</a>.
			</p>
			<p>
				<a href="https://github.com/SureA11y/test-matchers"><code>@surea11y/test-matchers</code></a>{" "}
				gives you <code>toHaveNoA11yViolations()</code>, plus <code>toHaveAnnounced()</code> for
				live regions. Both plug into either framework's <code>expect.extend()</code> unmodified,
				with no framework-specific code of their own. It scans whatever jsdom-based environment your test
				already runs under; it doesn't depend on <code>jsdom</code> itself or set one up for you.
				surea11y's engine is synchronous, so this matcher is too — no <code>await</code>, no
				forgetting one and silently passing on a resolved promise.
			</p>
			<CodeBlock lines={[{ text: "npm install --save-dev @surea11y/core @surea11y/test-matchers", command: true }]} />
			<p>
				<code>@surea11y/core</code> is the engine the matcher runs; install it with the matcher, as
				above. To check
				built HTML from the terminal or a CI step instead, outside a test runner, see the{" "}
				<a href="/getting-started/cli/">CLI</a>.
			</p>

			<h2>Setup</h2>
			<p>
				Your test environment must already be jsdom-based — this matcher scans whatever{" "}
				<code>document</code>/<code>window</code> it provides. Register the matcher once, in
				whichever setup file your test runner already loads:
			</p>
			<h3>Jest</h3>
			<CodeBlock
				lang="js"
				lines={[
					"// jest.setup.js",
					"expect.extend({",
					"  toHaveNoA11yViolations: require('@surea11y/test-matchers').toHaveNoA11yViolations",
					"});",
					"",
					"// jest.config.js",
					"module.exports = {",
					"  testEnvironment: 'jsdom',   // or the explicit jest-environment-jsdom package, depending on your Jest version",
					"  setupFilesAfterEnv: ['./jest.setup.js']",
					"};",
				]}
			/>
			<h3>Vitest</h3>
			<CodeBlock
				lang="js"
				lines={[
					"// vitest.setup.js",
					"import { expect } from 'vitest';",
					"import { toHaveNoA11yViolations } from '@surea11y/test-matchers';",
					"",
					"expect.extend({ toHaveNoA11yViolations });",
					"",
					"// vitest.config.js",
					"export default {",
					"  test: {",
					"    environment: 'jsdom',   // Vitest doesn't bundle jsdom -- install it as a devDependency too",
					"    setupFiles: ['./vitest.setup.js']",
					"  }",
					"};",
				]}
			/>
			<p>
				The bundled <code>.d.ts</code> augments both Jest's global <code>jest.Matchers</code>{" "}
				interface and Vitest's <code>@vitest/expect</code> interfaces, with no{" "}
				<code>@types/jest</code> or <code>vitest</code> import required to ship it — whichever
				framework is actually installed, only the matching augmentation takes effect.
			</p>

			<h2>Usage</h2>
			<p>Works against a plain DOM node:</p>
			<CodeBlock
				lang="js"
				lines={[
					"test('no accessibility violations', () => {",
					"  document.body.innerHTML = '<img src=\"logo.png\">';",
					"",
					"  expect(document.body).toHaveNoA11yViolations(); // fails: missing alt",
					"});",
				]}
			/>
			<p>
				...or any testing-library <code>container</code> — React Testing Library's, Vue Test
				Utils' <code>wrapper.element</code>, Angular Testing Library's, Svelte Testing Library's —
				since all of them expose a rendered DOM element the same way:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { render } = require('@testing-library/react');",
					"",
					"test('MyComponent has no accessibility violations', () => {",
					"  const { container } = render(<MyComponent />);",
					"",
					"  expect(container).toHaveNoA11yViolations();",
					"});",
				]}
			/>
			<p>
				This is framework-agnostic on the test-runner side too — the snippets above are identical
				whether they run under Jest or Vitest, once the matcher is registered.
			</p>

			<h3>Asserting <code>.not</code></h3>
			<CodeBlock
				lang="js"
				lines={[
					"test('a page with a violation fails the assertion', () => {",
					"  document.body.innerHTML = '<main><img src=\"logo.png\"></main>';",
					"",
					"  expect(document.body).not.toHaveNoA11yViolations();",
					"});",
				]}
			/>

			<h3>Reusing one scan across multiple assertions</h3>
			<p>
				If you're already computing a surea11y scan result yourself — to assert on specific rules
				across several <code>it()</code> blocks without re-scanning each time — pass the result
				object directly instead of a DOM node:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { runDomRulesInPage } = require('@surea11y/core');",
					"",
					"const result = runDomRulesInPage(null, '#main', {}, null);",
					"expect(result).toHaveNoA11yViolations();",
				]}
			/>

			<h2>Filtering and configuring scans</h2>
			<p>
				The second argument accepts anything <code>@surea11y/core</code> accepts — see{" "}
				<a href="/configuration/engine-options/">Engine options</a> for the full surface. A few common cases:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// Only run rules relevant to WCAG 2.0 A",
					"expect(container).toHaveNoA11yViolations({ tags: { include: 'wcag2a' } });",
					"",
					"// Skip a rule you've decided not to enforce yet",
					"expect(container).toHaveNoA11yViolations({ rules: { exclude: 'target-size-minimum' } });",
					"",
					"// Ignore a third-party widget you don't control",
					"expect(container).toHaveNoA11yViolations({ excludeSelectors: ['.intercom-launcher'] });",
					"",
					"// EN 301 549 V4.1.1 (WCAG 2.2 A and AA); 'en301549-v3.2.1' for V3.2.1 (WCAG 2.1 A and AA)",
					"expect(container).toHaveNoA11yViolations({ profile: 'en301549-v4.1.1' });",
				]}
			/>

			<h3 id="choosing-a-wcag-target">Choosing a WCAG target (<code>runOnly</code>)</h3>
			<p>
				The third argument is the scan's <code>runOnly</code>, passed to the engine as it is.{" "}
				<code>runOnly.wcag</code> selects by conformance target:{" "}
				<code>{"{ wcag: { version: '2.2', level: 'AA' } }"}</code> runs the rules for WCAG 2.2's
				Level A and AA criteria, by the level each criterion has in that version.{" "}
				<code>bestPractices: true</code> adds the rules that name no WCAG criterion, such as{" "}
				<code>region</code> and <code>heading-order</code>; on its own it runs only those, and
				beside <code>engineOptions.profile</code> it adds them to the profile's rules.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.2 A and AA",
					"expect(container).toHaveNoA11yViolations({}, { wcag: { version: '2.2', level: 'AA' } });",
					"",
					"// The same, and the best practices",
					"expect(container).toHaveNoA11yViolations({}, { wcag: { version: '2.2', level: 'AA' }, bestPractices: true });",
				]}
			/>
			<p>
				<code>runOnly</code> also takes rule ids and tags (<code>includeRuleIds</code>,{" "}
				<code>tags</code>, <code>excludeRuleIds</code>, ...), which add to a target's rules; the
				excludes apply after. A <code>runOnly</code> that selects anything replaces the selection
				in <code>engineOptions.rules</code>/<code>.tags</code> outright: give a selection one way
				or the other, not both. Pass <code>{"{}"}</code> or <code>null</code> as{" "}
				<code>engineOptions</code> when you only need <code>runOnly</code>. Rule ids are read in
				any case (<code>'IMG-ALT-PRESENT'</code>).
			</p>
			<p>
				A target implies its level. A test that names rules or tags instead can set one with{" "}
				<code>engineOptions.wcagLevel</code> (<code>@surea11y/core</code> 1.12.0 and later): the
				level of the criteria the scan reports, without changing which rules run.{" "}
				<code>contrast-computable</code> checks 1.4.3 (AA) and 1.4.6 (AAA), so the scan below
				reports only 1.4.3. The assertion gates on <code>fail</code> outcomes, so this changes the
				criteria in the result rather than what fails the test.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"expect(container).toHaveNoA11yViolations({ wcagLevel: 'AA' }, { includeRuleIds: ['contrast-computable'] });",
				]}
			/>

			<h2 id="packs">Scanning with packs</h2>
			<p>
				A <a href="/configuration/packs/">pack</a> brings rules, a standard or a checklist, and
				their profiles and messages, from a package of its own. The matcher scans in Node, so a
				pack is passed as the object itself, in <code>engineOptions.packs</code>, and its profile is
				chosen with <code>engineOptions.profile</code>:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const acmePolicy = require('./acme-policy-pack');",
					"const policy = { packs: [acmePolicy], profile: 'acme-web-2026' };",
					"",
					"test(\"a page that breaks the pack's house rule fails the assertion\", () => {",
					"  document.body.innerHTML = '<main><h1>Welcome</h1><video autoplay src=\"intro.mp4\"></video></main>';",
					"  expect(document).not.toHaveNoA11yViolations(policy);",
					"});",
					"",
					"// A pack's checklist profile, and the best practices",
					"expect(container).toHaveNoA11yViolations(policy, { bestPractices: true });",
				]}
			/>
			<p>
				A pack's own rules appear in the result like core's, with ids that start with its
				namespace (<code>acme-no-autoplay</code>). Keep the pack objects in one place (a setup file
				or a module): core prepares an engine for each set of pack objects and keeps it for the
				next scan with the same ones. A pack core can't run (its <code>core</code> range leaves
				out the installed core, it isn't valid, or its namespace clashes with another pack's) is
				listed in the result's <code>skippedPacks</code>, and the assertion fails on it rather than
				passing with the pack's rules never run.
			</p>
			<p id="several-profiles">
				With <code>@surea11y/core</code> 1.15 and test-matchers 1.5.0, <code>profile</code> also
				takes a list, to judge the component by{" "}
				<a href="/configuration/engine-options/#several-profiles">several profiles at once</a>, a
				pack's beside WCAG's: each profile judges it as it would alone, and a failure under any of
				them fails the assertion. A profile in the list that didn't run fails it too, since the scan
				judged less than it was asked to; so does a single profile the scan didn't apply, which
				scans by core's default rules.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const waiAria = require('@surea11y/pack-wai-aria');",
					"",
					"expect(container).toHaveNoA11yViolations({ packs: [waiAria], profile: ['wcag22-aa', 'wai-aria-1.2'] });",
				]}
			/>

			<h2>API</h2>
			<DataTable
				label="Matcher parameters"
				rowKey="id"
				columns={[
					{ key: "param", label: "Param", width: "18%" },
					{ key: "type", label: "Type", width: "26%" },
					{ key: "meaning", label: "Meaning", wrap: true },
				]}
				rows={apiRows}
			/>
			<p>
				The second argument can instead be one object holding them all,{" "}
				<code>{"{ engineOptions, runOnly, failOnSeverity, leanFail, wcagOnly, howToCheck }"}</code>:{" "}
				<code>{"toHaveNoA11yViolations({ leanFail: true })"}</code>. It's read that way when it has
				any of those keys, none of which is an engine option; an object that mixes them with engine
				options throws a <code>TypeError</code>.
			</p>
			<p>
				Returns the <code>{"{ pass, message }"}</code> shape both frameworks' <code>expect.extend()</code>{" "}
				expect — you never call this directly; it's wired up once via <code>expect.extend()</code> as
				shown in Setup above. The package also exports <code>configureA11yMatchers(options)</code>,
				for defaults across the suite; <code>installInternalsHook(win?)</code>, for{" "}
				<a href="#web-components">web components</a>; and <code>installListenerHook(win?)</code>,{" "}
				<code>installLiveRegionHook(win?, options?)</code> and the <code>toHaveAnnounced()</code> matcher, for{" "}
				<a href="#listener-and-live-region-hooks">click handlers and live regions</a>.
			</p>

			<h2>What it checks and doesn't</h2>
			<p>
				<strong>Only failures gate the assertion</strong> — matching every other surea11y binding's
				convention that <code>cantTell</code> results are advisory, not failures. Each finding is
				read by its own outcome, not its rule's: a rule that fails one element can ask about
				another, and that question isn't counted as a failure. A vague link like{" "}
				<code>&lt;a href="/pricing"&gt;Click here&lt;/a&gt;</code> is <code>cantTell</code>, not{" "}
				<code>fail</code>, so it doesn't break a passing test on its own unless you ask for that
				with <code>leanFail</code> (<a href="#questions-that-likely-fail">below</a>) — though when an
				assertion <em>does</em> fail for other reasons, the questions are listed after the failures,
				so they stay visible. See{" "}
				<a href="/help/known-limitations/">Known limitations</a> for what this engine
				won't automate at all.
			</p>
			<p>
				<strong>A scan that could not check what it was asked to fails too</strong>, rather than
				passing on nothing: an element that is not in the document the scan runs in (detached, or
				from another document), a custom rule that did not run (listed in{" "}
				<code>skippedCustomRules</code>), a pack that did not run (listed in{" "}
				<code>skippedPacks</code>), or a profile that did not run (listed in{" "}
				<code>engine.profilesNotRun</code>, or a single profile the scan didn't apply). The message
				names each with the reason. A custom rule the
				test excludes itself is not a gap, and doesn't fail it.
			</p>
			<p>
				<strong>A call with no selection runs the best practices too.</strong> Since{" "}
				<code>@surea11y/core</code> 1.12, one of them, <code>empty-heading</code>, fails a heading
				with no accessible name where it used to ask about it, so a component that renders{" "}
				<code>&lt;h2&gt;&lt;/h2&gt;</code> (often a title prop left empty in the test) fails a
				default call. A screen reader announces that heading with nothing in it: give the test real
				content or fix the component. A call with a WCAG target, which leaves the best practices
				out, doesn't run it.
			</p>
			<p>
				<strong>Since <code>@surea11y/core</code> 1.15, WCAG fails only where WCAG fails.</strong>{" "}
				Where only WAI-ARIA or the HTML content model is broken (an attribute the role doesn't
				support, an unnamed grid or dialog, a heading in a list), the ARIA and HTML structure rules
				ask (<code>cantTell</code>, uncertainty <code>spec-only</code>) instead of failing, so such
				a finding no longer fails the assertion. The failure message lists it with the questions,
				and it keeps its reason code. To fail on it by WAI-ARIA, add the{" "}
				<a href="/configuration/packs/#wai-aria-pack">WAI-ARIA pack</a>'s profile.
			</p>
			<p>
				The scan itself can throw, and the test then fails with the engine's error, which carries
				a <code>code</code>: <code>INVALID_RUN_ONLY</code> (a rule or tag list in which no value
				names a rule or a tag, or a <code>runOnly.wcag</code> target that isn't one),{" "}
				<code>INVALID_ENGINE_OPTIONS</code> (with <code>strictOptions: true</code>, an option the
				engine doesn't read or a value it can't use), or <code>PAGE_BUILTINS_BROKEN</code> (the
				test's or the page's own code broke a JavaScript built-in the engine relies on).
			</p>
			<p>
				<strong>Scoping to an element only reports what's inside it</strong> — a failure elsewhere on
				the page never fails an assertion scoped to one <code>container</code>. Under the hood the
				scanned element is temporarily tagged with a unique attribute and scanned by that selector,
				invisibly to your test.
			</p>
			<p>
				<strong>A handful of rules check a whole-page fact</strong>, not anything in a specific
				subtree — <code>page-title-present</code>, <code>html-lang-attr-present</code>, and a few
				others check <code>document.title</code>/<code>document.documentElement</code> directly,
				since asking whether <em>the page</em> has a title makes no sense for an arbitrary component
				snippet. Passing an <code>Element</code> (a testing-library <code>container</code>,{" "}
				<code>document.body</code>) reports these <code>notApplicable</code> rather than{" "}
				<code>fail</code>, so a missing <code>&lt;title&gt;</code> never breaks a component-level
				test; passing <code>document</code> itself evaluates them for real. If you do scan{" "}
				<code>document</code> directly, set <code>document.title</code>/
				<code>document.documentElement</code>'s <code>lang</code> once in your setup file rather than
				per test.
			</p>

			<h2 id="failing-only-on-serious-problems">Failing only on serious problems</h2>
			<p>
				Every rule result has a severity: <code>critical</code>, <code>serious</code>,{" "}
				<code>moderate</code> or <code>minor</code>. To start by failing tests on serious problems
				while the rest are still reported, set a level for the whole suite in the setup file with{" "}
				<code>configureA11yMatchers()</code>, or for one assertion in its options, which override
				the default (<code>failOnSeverity: null</code> turns it off there):
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// jest.setup.js (vitest.setup.js: the same, with import)",
					"const { toHaveNoA11yViolations, configureA11yMatchers } = require('@surea11y/test-matchers');",
					"",
					"expect.extend({ toHaveNoA11yViolations });",
					"configureA11yMatchers({ failOnSeverity: 'serious' });",
					"",
					"// one assertion",
					"expect(container).toHaveNoA11yViolations({ failOnSeverity: 'critical' });",
				]}
			/>
			<p>
				The failing rules below the level don't fail the test, but when it does fail, the message
				lists every failure and marks those below the level. It's the same gate as{" "}
				<code>surea11y scan --fail-on-severity</code>. A scan that left something out (a scope that
				matched nothing, a custom rule or pack that didn't run) fails the assertion whatever the
				level.
			</p>

			<h2 id="questions-that-likely-fail">Questions that likely fail</h2>
			<p>
				A <code>cantTell</code> is a question for a person. Since <code>@surea11y/core</code> 1.14,
				a question can lean: where the page's evidence points one way, it says which (
				<code>fail</code> or <code>pass</code>) and why, and each question of a core rule carries
				the steps to answer it (<code>howToCheck</code>). A failure message lists the questions
				after the failures: those that likely fail, then those that likely pass, each with its
				reason, then the open ones, by rule. <code>{"{ howToCheck: true }"}</code> lists every
				question in full, with its steps.
			</p>
			<p>
				By default a question never fails the test. <code>{"{ leanFail: true }"}</code> also fails
				it on the questions that likely fail, and <code>wcagOnly: true</code> leaves out those of
				best-practice rules:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"test('the settings page has no failures or likely failures', () => {",
					"  const { container } = render(<Settings />); // an <h1>, then an <h3>",
					"  expect(container).toHaveNoA11yViolations(); // passes: heading-order is a question",
					"  expect(container).toHaveNoA11yViolations({ leanFail: true }); // fails: it leans fail",
					"  expect(container).toHaveNoA11yViolations({ leanFail: true, wcagOnly: true }); // passes: heading-order is a best practice",
					"});",
				]}
			/>
			<p>
				It's opt-in because a lean is evidence, not proof: whether a finding leans, and which way,
				may change in a minor release of core. <code>{"configureA11yMatchers({ leanFail: true })"}</code>{" "}
				turns it on for the whole suite.
			</p>

			<h2 id="web-components">Web components</h2>
			<p>
				Many web components keep their <code>ElementInternals</code> in a private field and name
				themselves, set their states or give themselves a role through it. No script can read those
				back, so by default the scan asks about such an element (<code>cantTell</code>) instead of
				judging it: the test doesn't fail, but nothing is checked either, and a role set this way
				isn't seen at all.
			</p>
			<p>
				<code>installInternalsHook(win?)</code> lets the scan read them. Call it once in the setup
				file, before any component is defined, so it sees every <code>attachInternals()</code>{" "}
				call; <code>win</code> defaults to the global <code>window</code>:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// jest.setup.js",
					"const {",
					"  toHaveNoA11yViolations,",
					"  installInternalsHook",
					"} = require('@surea11y/test-matchers');",
					"",
					"installInternalsHook();",
					"expect.extend({ toHaveNoA11yViolations });",
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"// vitest.setup.js",
					"import { expect } from 'vitest';",
					"import {",
					"  toHaveNoA11yViolations,",
					"  installInternalsHook",
					"} from '@surea11y/test-matchers';",
					"",
					"installInternalsHook();",
					"expect.extend({ toHaveNoA11yViolations });",
				]}
			/>
			<p>
				With it, a component that names itself through its internals passes, one that attaches
				internals but sets no name fails like any unnamed control, and one that is a{" "}
				<code>switch</code> only through its internals is checked as one. A scan result's{" "}
				<code>engine.environment.internalsHook</code> says whether the hook was there. It wraps{" "}
				<code>HTMLElement.prototype.attachInternals</code> in the test window, which is harmless in
				a test and why it's opt-in. One limit: <code>jest-environment-jsdom</code> 30 ships jsdom
				26, where a component that sets an ARIA property on its internals throws, hook or not
				(Vitest with jsdom 29 handles it). Since <code>@surea11y/core</code> 1.14 the hook is
				recorded as <code>'early'</code> under Vitest too, so a component that never attached
				internals is no longer a question there. The{" "}
				<a href="https://github.com/SureA11y/test-matchers#web-components-names-set-through-elementinternals">
					package README
				</a>{" "}
				has the details.
			</p>

			<h2 id="listener-and-live-region-hooks">Click handlers and live regions</h2>
			<p>
				Two more opt-in hooks, from <code>@surea11y/core</code> 1.14, install the same way, in the
				setup file before any of your code runs. <code>installListenerHook()</code> records the
				click, key, focus and mouse listeners added from then on, so the keyboard rules judge them:
				a <code>&lt;div role="button"&gt;</code> that only listens for <code>click</code> fails (
				<code>CLICK_HANDLER_NO_KEY_LISTENER</code>), and passes once it also listens for{" "}
				<code>keydown</code>. <code>installLiveRegionHook()</code> records what the page's live
				regions are given: the scan asks about a region added with its text already in it, which
				screen readers commonly don't announce, and <code>toHaveAnnounced()</code> checks that an
				action told the user something. Install only the ones you want; each is independent:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// jest.setup.js (vitest.setup.js: the same, with import)",
					"const {",
					"  toHaveNoA11yViolations,",
					"  toHaveAnnounced,",
					"  installInternalsHook,",
					"  installListenerHook,",
					"  installLiveRegionHook",
					"} = require('@surea11y/test-matchers');",
					"",
					"installInternalsHook();",
					"installListenerHook();",
					"installLiveRegionHook();",
					"expect.extend({",
					"  toHaveNoA11yViolations,",
					"  toHaveAnnounced",
					"});",
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"test('saving says so', async () => {",
					"  const user = userEvent.setup();",
					"  const { container } = render(<SaveBar />);",
					"  await user.click(screen.getByRole('button', { name: 'Save' }));",
					"",
					"  expect(container).toHaveAnnounced('Saved');",
					"  expect(window).not.toHaveAnnounced(/error/i);",
					"});",
				]}
			/>
			<p>
				A string must be the whole text; a RegExp may match part of it. On an element, only the
				live regions it is or contains count; on <code>window</code> or <code>document</code>,
				every announcement since the hook was installed. It's what the page made available to
				announce, not what a screen reader said, and <code>toHaveAnnounced()</code> throws without
				the hook. Two things to know: React adds its listeners to the root it renders into, not to
				each element, so on a React component the scan sees the root's listeners and judges its
				buttons by their markup, as without the hook; and the live-region hook reads changes in
				batches, so render first and then act, with an <code>await</code> in between (
				<code>await user.click()</code>), as a real user does. The{" "}
				<a href="https://github.com/SureA11y/test-matchers#click-handlers-added-from-script-the-listener-hook">
					package README
				</a>{" "}
				has the details.
			</p>
			<p id="modal-dialogs-in-jsdom">
				<strong>Modal dialogs in jsdom.</strong> A dialog opened with <code>showModal()</code>{" "}
				makes the page behind it inert: the scan doesn't judge it, and a live region there gets no
				announcement through. jsdom has no <code>showModal()</code>, and since{" "}
				<code>@surea11y/core</code> 1.16 an open <code>&lt;dialog aria-modal="true"&gt;</code>{" "}
				isn't taken as modal under jsdom, as it isn't in a browser. A test that stands in for{" "}
				<code>showModal()</code> by setting <code>open</code> and <code>aria-modal="true"</code>{" "}
				says so to both, with test-matchers 1.6.0 and later:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// setup file",
					"installLiveRegionHook(window, { assumeModal: true });",
					"",
					"// in a test",
					"expect(container).toHaveNoA11yViolations({ assumeModal: true });",
				]}
			/>
			<p>
				A text given to a region behind a modal dialog isn't counted by{" "}
				<code>toHaveAnnounced()</code> unless you pass <code>{"{ includeBehindModal: true }"}</code>,
				and the failure message lists it either way. Another option to the hook, or a value that
				isn't a boolean, throws a <code>TypeError</code>.
			</p>

			<h2>Failure messages</h2>
			<p>
				Lists every failing occurrence, not just every rule — one rule can flag several elements —
				with the rule ID, severity, a human-readable summary, the failing element's selector, and a
				fix hint where available. It names the <code>@surea11y/core</code> release that produced the
				result, to quote in a bug report, and then lists the questions, which don't count as
				failures. With a skipped heading level beside the image:
			</p>
			<CodeBlock
				lines={[
					"expected no accessibility violations, but found 1:",
					"",
					"1) img-alt-present (serious): This <img> has no alt attribute.",
					"   at body > main > img",
					"   Add an alt attribute that says what the image shows, or alt=\"\" if the image is purely decorative.",
					"",
					"Scanned with @surea11y/core 1.16.1.",
					"",
					"2 findings need manual review (cantTell, not counted as failures):",
					"",
					"1) heading-order (minor, likely fails): This heading jumps from level 1 to level 3, skipping a level.",
					"   at body > main > h3",
					"   Go down one level at a time, so an <h2> is followed by an <h3> rather than an <h4>, and the outline of the page stays easy to follow.",
					"   Why it likely fails: The heading skips a level after the one before it.",
					"",
					"Open questions, which only a person can answer: manual-review.",
				]}
			/>
			<p>
				Before the version line, the message can carry notes on how the scan ran: when the scan
				asked about custom elements it could have read with the{" "}
				<a href="#web-components">internals hook</a>, or judged findings the{" "}
				<a href="#listener-and-live-region-hooks">listener or live-region hook</a> would have
				decided, a line says how many and to install it. With <code>{"{ leanFail: true }"}</code>,
				the questions that likely fail move up into the failures, and the header counts both (
				<code>found 1 failure and 1 likely failure:</code>).
			</p>
			<p>A pack that did not run is named with the reason:</p>
			<CodeBlock
				lines={[
					"expected no accessibility violations, but the scan left out what it was asked to check:",
					"",
					"No accessibility violations found in what was scanned.",
					"",
					"Pack \"@acme/a11y-policy\" did not run: it supports core ^2.0.0, and this is core 1.16.1.",
					"",
					"Scanned with @surea11y/core 1.16.1.",
				]}
			/>

			<p>
				Runnable, side-by-side examples for both frameworks:{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/basic.test.js">Jest</a>{" "}
				and{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/basic.vitest.test.js">
					Vitest
				</a>
				, and the same with a pack:{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/pack.test.js">Jest</a>{" "}
				and{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/pack.vitest.test.js">
					Vitest
				</a>
				, and a small component checked with the listener and live-region hooks,{" "}
				<code>toHaveAnnounced()</code> and <code>leanFail</code>:{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/hooks.test.js">Jest</a>{" "}
				and{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/hooks.vitest.test.js">
					Vitest
				</a>
				. For the complete <code>engineOptions</code> surface (locale, contrast modes, shadow DOM,
				custom rules, WCAG-version tag combinations), see{" "}
				<a href={`${core}/docs/ENGINE_OPTIONS.md`}><code>ENGINE_OPTIONS.md</code></a> — this package
				forwards whatever you pass rather than duplicating that reference.
			</p>
		</>
	);
}
