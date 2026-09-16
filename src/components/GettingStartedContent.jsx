import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

function BindingSection({ id, title, install, installNote, usage, note, exampleHref }) {
	return (
		<section>
			<h3 id={id}>Usage with {title}</h3>
			<CodeBlock lines={install.map((text) => ({ text, command: true }))} />
			{installNote}
			<CodeBlock lines={usage} />
			{note}
			{exampleHref ? (
				<p>
					Also see <a href={exampleHref}>a runnable example</a> in the package's own repo.
				</p>
			) : null}
		</section>
	);
}

export function GettingStartedContent() {
	return (
		<>
			<h2>Installation</h2>
			<p>
				There's no single install command — surea11y is a core engine plus a family of
				separately-published bindings, so which package(s) you install depends on how you already
				run tests or scripts. Jump to the section below matching your stack: Cypress, Playwright,
				Puppeteer, Selenium, WebdriverIO, the CLI, or standalone (installing{" "}
				<code>@surea11y/core</code> directly, or the browser bundle).
			</p>

			<h2 id="usage">Usage</h2>
			<p>
				However you run a scan — jsdom, a real browser, any binding, the CLI — it returns the
				same native result shape: <code>checksResults</code> (one entry per rule, including
				every <code>pass</code>/<code>notApplicable</code> — not a "violations only" list) and{" "}
				<code>rulesResults</code> (WCAG-SC rollups). This is <strong>not</strong> the{" "}
				<code>violations</code>/<code>passes</code>/<code>incomplete</code>/<code>inapplicable</code>{" "}
				shape used by other popular accessibility testing tools — each binding's method names are
				modeled on common conventions in this space for migration familiarity, but the richer
				result schema is kept as-is. See <a href="/results-reports/">Results &amp; Reports</a> for
				the full schema.
			</p>

			<BindingSection
				id="cypress"
				title="Cypress"
				install={["npm install @surea11y/cypress cypress"]}
				installNote={
					<p>
						<code>cypress</code> is a <code>peerDependencies</code> entry — you need your own
						Cypress install for the types/runtime to resolve, same as writing any Cypress spec.
					</p>
				}
				usage={[
					"// cypress/e2e/my-page.cy.js",
					"const { A11yCoreBuilder } = require('@surea11y/cypress');",
					"",
					"it('has no accessibility violations', () => {",
					"  cy.visit('https://example.com/');",
					"",
					"  new A11yCoreBuilder()",
					"    .include('#main')            // optional -- call multiple times for multi-region scans",
					"    .exclude('.cookie-banner')    // optional",
					"    .withTags(['wcag2a', 'wcag2aa'])",
					"    .disableRules(['meta-refresh-no-exceptions'])",
					"    .analyze()",
					"    .then((results) => {",
					"      const fails = results.checksResults.filter((r) => r.outcome === 'fail');",
					"      expect(fails).to.have.length(0);",
					"    });",
					"});",
				]}
				note={
					<p>
						No <code>{"{ page }"}</code>/<code>{"{ browser }"}</code>/<code>{"{ driver }"}</code>{" "}
						constructor argument, unlike the driver-based bindings below — there's no such handle
						in Cypress. <code>cy</code> is ambient in every spec file and <em>is</em> the driver.
						Note that <code>analyze()</code> returns a Cypress chainable, not a Promise — don't{" "}
						<code>await</code> it; call <code>.then()</code> as shown.
					</p>
				}
				exampleHref="https://github.com/SureA11y/cypress/blob/main/examples/basic-scan.cy.js"
			/>

			<BindingSection
				id="playwright"
				title="Playwright"
				install={[
					"npm install @surea11y/playwright playwright",
					"npx playwright install chromium",
				]}
				installNote={
					<p>
						The second command matters — every test launches a real browser, and{" "}
						<code>npm install</code> alone doesn't fetch it.
					</p>
				}
				usage={[
					"const { chromium } = require('playwright');",
					"const { A11yCoreBuilder } = require('@surea11y/playwright');",
					"",
					"const browser = await chromium.launch();",
					"const page = await browser.newPage();",
					"await page.goto('https://example.com/');",
					"",
					"const results = await new A11yCoreBuilder({ page })",
					"  .include('#main')            // optional -- call multiple times for multi-region scans",
					"  .exclude('.cookie-banner')    // optional",
					"  .withTags(['wcag2a', 'wcag2aa'])",
					"  .disableRules(['meta-refresh-no-exceptions'])",
					"  .analyze();",
					"",
					"console.log(results.checksResults.filter(r => r.outcome === 'fail'));",
					"await browser.close();",
				]}
				note={
					<p>
						Works against all three Playwright engines, not just Chromium — verified with real
						Firefox and WebKit runs.
					</p>
				}
				exampleHref="https://github.com/SureA11y/playwright/blob/main/examples/basic-scan.js"
			/>

			<BindingSection
				id="puppeteer"
				title="Puppeteer"
				install={["npm install @surea11y/puppeteer puppeteer"]}
				installNote={
					<p>
						Puppeteer downloads its own bundled Chrome as part of <code>npm install</code> —
						unlike Playwright, there's no separate browser-install step.
					</p>
				}
				usage={[
					"const puppeteer = require('puppeteer');",
					"const { A11yCoreBuilder } = require('@surea11y/puppeteer');",
					"",
					"const browser = await puppeteer.launch();",
					"const page = await browser.newPage();",
					"await page.goto('https://example.com/');",
					"",
					"const results = await new A11yCoreBuilder({ page })",
					"  .include('#main')            // optional -- call multiple times for multi-region scans",
					"  .exclude('.cookie-banner')    // optional",
					"  .withTags(['wcag2a', 'wcag2aa'])",
					"  .disableRules(['meta-refresh-no-exceptions'])",
					"  .analyze();",
					"",
					"console.log(results.checksResults.filter(r => r.outcome === 'fail'));",
					"await browser.close();",
				]}
				note={null}
				exampleHref="https://github.com/SureA11y/puppeteer/blob/main/examples/basic-scan.js"
			/>

			<BindingSection
				id="selenium"
				title="Selenium"
				install={["npm install @surea11y/selenium selenium-webdriver"]}
				installNote={
					<p>
						<code>selenium-webdriver</code> bundles Selenium Manager, which auto-downloads and
						manages the matching <code>chromedriver</code> the first time you build a driver — no
						separate Selenium server, no manual driver install (Chrome itself must already be on
						the machine).
					</p>
				}
				usage={[
					"const { Builder, Browser } = require('selenium-webdriver');",
					"const chrome = require('selenium-webdriver/chrome');",
					"const { A11yCoreBuilder } = require('@surea11y/selenium');",
					"",
					"const options = new chrome.Options().addArguments('--headless=new');",
					"const driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();",
					"await driver.get('https://example.com/');",
					"",
					"const results = await new A11yCoreBuilder({ driver })",
					"  .include('#main')            // optional -- call multiple times for multi-region scans",
					"  .exclude('.cookie-banner')    // optional",
					"  .withTags(['wcag2a', 'wcag2aa'])",
					"  .disableRules(['meta-refresh-no-exceptions'])",
					"  .analyze();",
					"",
					"console.log(results.checksResults.filter(r => r.outcome === 'fail'));",
					"await driver.quit();",
				]}
				note={
					<p>
						The builder takes <code>{"{ driver }"}</code> (a Selenium <code>WebDriver</code>),
						where Puppeteer/Playwright take <code>{"{ page }"}</code> — that's the one
						construction difference. Everything downstream is identical.
					</p>
				}
				exampleHref="https://github.com/SureA11y/selenium/blob/main/examples/basic-scan.js"
			/>

			<BindingSection
				id="webdriverio"
				title="WebdriverIO"
				install={["npm install @surea11y/webdriverio webdriverio"]}
				installNote={
					<p>
						WebdriverIO v9 auto-manages a local <code>chromedriver</code> the first time it
						launches Chrome — a fresh install is enough to launch a real headless Chrome on its
						own.
					</p>
				}
				usage={[
					"const { remote } = require('webdriverio');",
					"const { A11yCoreBuilder } = require('@surea11y/webdriverio');",
					"",
					"const browser = await remote({",
					"  capabilities: {",
					"    browserName: 'chrome',",
					"    'wdio:enforceWebDriverClassic': true,               // recommended -- see below",
					"    'goog:chromeOptions': { args: ['--headless=new'] }",
					"  }",
					"});",
					"await browser.url('https://example.com/');",
					"",
					"const results = await new A11yCoreBuilder({ browser })",
					"  .include('#main')            // optional -- call multiple times for multi-region scans",
					"  .exclude('.cookie-banner')    // optional",
					"  .withTags(['wcag2a', 'wcag2aa'])",
					"  .disableRules(['meta-refresh-no-exceptions'])",
					"  .analyze();",
					"",
					"console.log(results.checksResults.filter(r => r.outcome === 'fail'));",
					"await browser.deleteSession();",
				]}
				note={
					<p>
						<strong>Force classic WebDriver, not BiDi, for this workload.</strong> WebdriverIO v9
						defaults to the BiDi protocol; a long-lived session issuing many{" "}
						<code>browser.execute()</code> calls (exactly what a scan does) degraded badly over
						BiDi in testing — per-scan latency climbed from ~2s into the minutes. Forcing classic
						WebDriver with <code>'wdio:enforceWebDriverClassic': true</code>, as shown above, gave
						a steady ~150ms per scan.
					</p>
				}
				exampleHref="https://github.com/SureA11y/webdriverio/blob/main/examples/basic-scan.js"
			/>

			<section>
				<h3 id="cli">Usage via CLI</h3>
				<p>
					A command instead of code — no test framework or Node script required, good for a
					pipeline step or a quick check against a build artifact.
				</p>
				<CodeBlock
					lines={[
						{ text: "npm install -g @surea11y/cli", command: true },
						{ text: "surea11y scan ./index.html", command: true },
						{ text: "surea11y scan https://example.com/ --tags wcag2a,wcag2aa", command: true },
					]}
				/>
				<p>Requires Node.js <code>^20.19.0 || ^22.13.0 || &gt;=24.0.0</code>.</p>
				<CodeBlock
					lines={[
						"$ surea11y scan ./index.html",
						"",
						"surea11y scan: file:///path/to/index.html",
						"  pass: 6   fail: 3   cantTell: 4   notApplicable: 112",
						"",
						"  occurrences by tier: fail: 3   cantTell: 5",
						"",
						"FAIL (3 rule(s)):",
						"",
						"  contrast-minimum  (serious, 1 fail occurrence(s))",
						"    - html > body > main > p",
						"      Element has insufficient color contrast of 2.85:1 (foreground: #999999,",
						"      background: #ffffff, font size: 0px, font weight: normal). Expected",
						"      contrast ratio of 4.5:1 (normal text).",
						"",
						"cantTell — needs human review (4 rule(s)): contrast-computable, link-name-quality,",
						"manual-review, page-title-patterns",
					]}
				/>
				<p>
					<code>cantTell</code> never affects the exit code: <code>0</code> clean, <code>1</code>{" "}
					at least one <code>fail</code> (the CI-gating case), <code>2</code> a usage/scan error.
					The CLI reads <strong>static HTML only</strong> — a local file, or the raw body of an
					HTTP(S) GET — and never executes page JavaScript. For client-rendered pages, use one of
					the bindings above instead, or call the engine directly against a real, driven browser
					(see <a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a> Pattern 2).
				</p>
				<p>
					Full flag reference, custom-rule contract, and CI recipes:{" "}
					<a href="https://github.com/SureA11y/cli/blob/main/docs/CLI.md"><code>docs/CLI.md</code></a>.
					For CI-pipeline templates specifically, see{" "}
					<a href="/configuration/">CI integration</a>.
				</p>
			</section>

			<h2 id="standalone">Standalone</h2>
			<p>
				For a manual check against a page open in a real browser, a bookmarklet, or any other
				context with no automation driver and no build step to reach for.
			</p>
			<p>
				<code>@surea11y/core</code> ships <code>surea11y.browser.js</code> at the package root, a
				bundle generated from the same rule sources as the Node package. Loading it directly
				defines one global, <code>a11ycore</code>:
			</p>
			<CodeBlock
				lines={[
					'<script src="node_modules/@surea11y/core/surea11y.browser.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(location.href, null, {}, null);",
					"  console.log(result.checksResults.filter((r) => r.outcome === 'fail'));",
					"</script>",
				]}
			/>
			<p>
				<code>a11ycore.runa11yCoreInPage</code> is the exact same function the bindings above call
				under the hood — the bundle exists only to solve <em>loading</em> it without{" "}
				<code>require</code>/a module system, not to add a separate API surface.
			</p>
			<p>
				The bundle carries English only. Every other locale ships beside it as its own file — load
				one after the bundle and that language becomes available:
			</p>
			<CodeBlock
				lines={[
					'<script src="node_modules/@surea11y/core/surea11y.browser.js"></script>',
					'<script src="node_modules/@surea11y/core/surea11y.i18n.de.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(location.href, null, { locale: 'de' }, null);",
					"</script>",
				]}
			/>
			<p>
				Ask for a locale whose file you haven't loaded and you get English, not an error — see{" "}
				<a href="/configuration/#locales">Locales</a>.
			</p>
			<p>
				Deliberately excluded from the bundle: <code>runa11yCoreAcrossFrames</code>/
				<code>a11yCoreEnableFrameResponder</code> (cross-frame scanning needs the embedded frame to
				load the engine and opt in too — not a fit for a single dropped-in script tag). Use the npm
				package directly if you need it — see{" "}
				<a href={`${core}/docs/INTEGRATION.md#cross-frame-scanning-including-cross-origin`}>
					<code>INTEGRATION.md</code>
				</a>
				.
			</p>
			<p>
				<code>require('@surea11y/core')</code> directly, without any binding, is the other
				standalone path — this is Pattern 1/Pattern 2 in{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>: jsdom in Node with
				no real browser, or driving Puppeteer/Playwright yourself instead of going through a
				binding.
			</p>
		</>
	);
}
