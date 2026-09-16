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
				is one matcher, <code>toHaveNoA11yViolations()</code>,
				that plugs into either framework's <code>expect.extend()</code> unmodified — it has no
				framework-specific code of its own. It scans whatever jsdom-based environment your test
				already runs under; it doesn't depend on <code>jsdom</code> itself or set one up for you.
				surea11y's engine is synchronous, so this matcher is too — no <code>await</code>, no
				forgetting one and silently passing on a resolved promise.
			</p>
			<CodeBlock lines={[{ text: "npm install --save-dev @surea11y/test-matchers", command: true }]} />

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
				]}
			/>

			<h2>API</h2>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "param", label: "Param", width: "18%" },
					{ key: "type", label: "Type", width: "26%" },
					{ key: "meaning", label: "Meaning", wrap: true },
				]}
				rows={apiRows}
			/>
			<p>
				Returns the <code>{"{ pass, message }"}</code> shape both frameworks' <code>expect.extend()</code>{" "}
				expect — you never call this directly; it's wired up once via <code>expect.extend()</code> as
				shown in Setup above.
			</p>

			<h2>What it checks and doesn't</h2>
			<p>
				Only <code>fail</code> outcomes gate the assertion — matching every other surea11y binding's
				convention that <code>cantTell</code> results are advisory, not failures. A vague link like{" "}
				<code>&lt;a href="/pricing"&gt;Click here&lt;/a&gt;</code> is <code>cantTell</code>, not{" "}
				<code>fail</code>, so it never breaks a passing test on its own — though when an assertion{" "}
				<em>does</em> fail for other reasons, any <code>cantTell</code> results are appended to the
				failure message as a separate note, so they stay visible. See{" "}
				<a href="/troubleshooting/known-limitations/">Known limitations</a> for what this engine
				won't automate at all.
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

			<h2>Failure messages</h2>
			<p>
				Lists every occurrence, not just every rule — one rule can flag several elements — with the
				rule ID, severity, a human-readable summary, the failing element's selector, and a fix hint
				where available:
			</p>
			<CodeBlock
				lines={[
					"expected no accessibility violations, but found 1:",
					"",
					"1) img-alt-present (serious): Missing alt attribute on <img>.",
					"   at html > body > img",
					"   Add an alt attribute or use alt=\"\" for decorative images.",
				]}
			/>
			<p>
				Any <code>cantTell</code> results alongside the failures are appended as a separate note, so
				they stay visible without affecting <code>pass</code>/<code>fail</code>:
			</p>
			<CodeBlock lines={["2 rule(s) need manual review (cantTell, not counted as failures): link-name-quality-manual, color-contrast-computable"]} />

			<p>
				Runnable, side-by-side examples for both frameworks:{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/basic.test.js">Jest</a>{" "}
				and{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/basic.vitest.test.js">
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
