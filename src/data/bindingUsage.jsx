import React from "react";

/** Opens each binding's internals-hook passage; the snippet and its binding-specific note follow. */
const webComponents = (
	<p>
		<strong>Web components.</strong> A component that keeps its <code>ElementInternals</code> in a
		private field, and names itself, sets its states or gives itself a role through it, can't be
		read back by any page script. By default the scan asks about such a component
		(<code>cantTell</code>) instead of judging it, and a role set only that way isn't checked at
		all. If you build or test a component library, install the binding's opt-in internals hook
		before the page's own scripts run, and those components are judged like any other control:
	</p>
);

const hookCaveat = (repo) => (
	<p>
		The hook is for test and audit runs: it keeps what it records where any script on the page can
		read it, which is why it's opt-in. Without it, the scan says once when it asked about such
		components. The{" "}
		<a href={`https://github.com/SureA11y/${repo}#web-components-the-internals-hook`}>README's internals hook section</a>{" "}
		has the details.
	</p>
);

/** Opens each binding's listener- and live-region-hook passage; the snippet and its note follow. */
const moreHooks = (
	<p>
		<strong>Click handlers and live regions.</strong> Since core 1.14 there are two more opt-in
		hooks. Most pages add their click handlers from script, where no page script can list them
		afterwards, so the scan can't see that a <code>&lt;div role="button"&gt;</code> with a click
		listener does nothing from the keyboard; with the listener hook, such a button fails
		(<code>CLICK_HANDLER_NO_KEY_LISTENER</code>). The live-region hook records what the page's
		live regions are given: the scan then asks about a status message added with its text already
		in it, which screen readers commonly don't announce, and <code>announcements()</code> returns
		what the page made available to announce, so a test can check that an action told the user
		something. Install them before the page's own scripts run, like the internals hook:
	</p>
);

const moreHooksCaveat = (repo) => (
	<p>
		Like the internals hook, both are for test and audit runs: any script on the page can read
		what they record. <code>announcements()</code> is what the page made available to announce,
		not what a screen reader said, and <code>null</code> without the live-region hook. Without
		either hook, <code>getScanNotes()</code> says when findings it would have decided were judged
		without it. The README's sections on the{" "}
		<a href={`https://github.com/SureA11y/${repo}#click-handlers-added-from-script-the-listener-hook`}>listener hook</a>{" "}
		and the{" "}
		<a href={`https://github.com/SureA11y/${repo}#live-regions-the-live-region-hook-and-announcements`}>live-region hook</a>{" "}
		have the details.
	</p>
);

/**
 * Conditions, the severity gate and leaning questions (binding 1.5.0), then a pointer to the
 * builder methods this page leaves to the binding's README.
 */
const alsoAvailable = (repo, { logger = true, conditions = null, cypress = false } = {}) => (
	<>
		<p>
			<strong>Dark mode, phone widths and a severity gate.</strong>{" "}
			<code>{".conditions([{ colorScheme: 'dark' }, { width: 320 }])"}</code> scans the page as it
			is, then again under each condition, and returns one result: a rule's outcome is its worst
			across the scans, and each finding lists the conditions it was seen under. Each condition is
			a full scan, and <code>.frames(true)</code> can't be combined with it yet. {conditions}{" "}
			<code>{"getGatingFailures(results, { failOnSeverity: 'serious' })"}</code> returns the
			failing rules at that severity or above, so a test can block on serious and critical
			problems first while the rest are still reported; <code>formatFailures()</code> takes the
			same option.
		</p>
		<p>
			<strong>Questions that lean, with steps.</strong> Since core 1.14, a <code>cantTell</code>{" "}
			finding can lean toward <code>fail</code> or <code>pass</code>, saying why, and carries{" "}
			<code>howToCheck</code>, the steps a person follows to answer it.{" "}
			<code>formatFailures()</code> lists the questions that likely fail right after the
			failures, and prints the steps with <code>{"{ howToCheck: true }"}</code>. To fail a test on
			the likely failures too, add core's <code>leaningFailures(results)</code> to the gate.
			{cypress ? (
				<>
					{" "}
					In Cypress the steps come from the plugin: <code>setupNodeEvents</code> has to return
					what <code>surea11y(on, config)</code> returns. Without that, the result has no steps,
					and nothing fails.
				</>
			) : null}
		</p>
		<p>
			The builder also has <code>.wcagLevel()</code>, which keeps the reported criteria to a WCAG
			level without changing which rules run; <code>.includeMode('or')</code>, which runs a tag's
			rules plus rules you name; <code>.plannedChecks()</code> and <code>.plannedCriteria()</code>,
			which list what a scan will check before it runs, so a selection that runs nothing can't pass
			as a clean scan;{" "}
			{logger ? (
				<>
					<code>.logger()</code>, which sends scan-gap warnings to your own log;{" "}
				</>
			) : null}
			<code>.fetchStyleSheets(false)</code>, which stops <code>.analyze()</code> fetching the style
			sheets from other origins that the page can't read itself, for the rules that read CSS; and{" "}
			<code>getScanNotes(results)</code>, which says how the page was scanned. The{" "}
			<a href={`https://github.com/SureA11y/${repo}#readme`}>binding's README</a> covers each.
		</p>
	</>
);

export const bindingUsage = {
	cypress: {
		intro: (
			<p>
				<a href="https://www.cypress.io/">Cypress</a> is a JavaScript end-to-end testing framework
				that runs your tests inside the browser itself, alongside the app under test. surea11y
				integrates through the{" "}
				<a href="https://github.com/SureA11y/cypress"><code>@surea11y/cypress</code></a> binding.
			</p>
		),
		install: ["npm install @surea11y/core @surea11y/cypress cypress"],
		installNote: (
			<p>
				<code>cypress</code> is a <code>peerDependencies</code> entry — you need your own Cypress
				install for the types/runtime to resolve, same as writing any Cypress spec.
			</p>
		),
		usage: [
			"// cypress/e2e/my-page.cy.js",
			"const { A11yCoreBuilder } = require('@surea11y/cypress');",
			"",
			"it('has no accessibility violations', () => {",
			"  cy.visit('https://example.com/');",
			"",
			"  new A11yCoreBuilder()",
			"    .include('#main')            // optional -- call multiple times for multi-region scans",
			"    .exclude('.cookie-banner')    // optional",
			"    .withWcag('2.2', 'AA')         // the rules for WCAG 2.2's A and AA criteria",
			"    .disableRules(['meta-refresh-no-exceptions'])",
			"    .analyze()",
			"    .then((results) => {",
			"      const fails = results.checksResults.filter((r) => r.outcome === 'fail');",
			"      expect(fails).to.have.length(0);",
			"    });",
			"});",
		],
		note: (
			<p>
				No <code>{"{ page }"}</code>/<code>{"{ browser }"}</code>/<code>{"{ driver }"}</code>{" "}
				constructor argument, unlike the driver-based bindings — there's no such handle in
				Cypress. <code>cy</code> is ambient in every spec file and <em>is</em> the driver.{" "}
				<strong><code>analyze()</code> returns a Cypress chainable, not a Promise — don't{" "}
				<code>await</code> it</strong>; call <code>.then()</code> as shown.
			</p>
		),
		packs: (
			<p>
				A <a href="/configuration/packs/">pack</a> is prepared in Node, and a Cypress spec runs in
				the browser, so in Cypress <code>.withPacks()</code> takes each pack's module name (a
				package name, or a path from the project root), and the binding's plugin,{" "}
				<code>@surea11y/cypress/plugin</code>, prepares it in Node: register it by returning{" "}
				<code>surea11y(on, config)</code> from <code>setupNodeEvents</code>.{" "}
				<code>{".options({ profile })"}</code> chooses the pack's profile. A pack that doesn't run
				is reported as a <code>'pack-skipped'</code> scan gap.
			</p>
		),
		internals: {
			intro: webComponents,
			code: [
				"// cypress/support/e2e.js",
				"import { installInternalsHook } from '@surea11y/cypress';",
				"",
				"installInternalsHook();",
			],
			note: (
				<p>
					Called once in the support file, it runs on every visit, through Cypress's{" "}
					<code>window:before:load</code>. For a single visit, pass it to <code>cy.visit()</code> as{" "}
					<code>{"{ onBeforeLoad: installInternalsHook }"}</code>. It runs with the app window's{" "}
					<code>eval</code>, which works because Cypress strips the app's Content Security Policy by
					default, and frames inside the app don't get it.
				</p>
			),
			caveat: hookCaveat("cypress"),
		},
		hooks: {
			intro: moreHooks,
			code: [
				"// cypress/support/e2e.js",
				"import { installListenerHook, installLiveRegionHook } from '@surea11y/cypress';",
				"",
				"installListenerHook();",
				"installLiveRegionHook();",
				"",
				"// in a spec",
				"cy.get('#save').click();",
				"A11yCoreBuilder.announcements().then((said) => {",
				"  expect(said.map((a) => a.text)).to.include('Saved');",
				"});",
			],
			note: (
				<p>
					As with the internals hook, the support file covers every visit, and only the app's own
					window gets them, not the frames inside it. <code>announcements()</code> reads the app's
					window and returns a chainable, like <code>.analyze()</code>.
				</p>
			),
			caveat: moreHooksCaveat("cypress"),
		},
		more: alsoAvailable("cypress", {
			logger: false,
			cypress: true,
			conditions: (
				<>
					A width goes through <code>cy.viewport()</code>; a color scheme needs a Chromium-family
					browser (Chrome, Edge, Electron), and in Firefox <code>.analyze()</code> fails before any scan.
				</>
			),
		}),
		exampleHref: "https://github.com/SureA11y/cypress/blob/main/examples/basic-scan.cy.js",
	},

	playwright: {
		intro: (
			<p>
				<a href="https://playwright.dev/">Playwright</a> is a cross-browser end-to-end testing
				framework from Microsoft, driving real Chromium, Firefox, and WebKit engines from Node.js.
				surea11y integrates through the{" "}
				<a href="https://github.com/SureA11y/playwright"><code>@surea11y/playwright</code></a>{" "}
				binding.
			</p>
		),
		install: [
			"npm install @surea11y/core @surea11y/playwright playwright",
			"npx playwright install chromium",
		],
		installNote: (
			<p>
				The second command matters — every test launches a real browser, and{" "}
				<code>npm install</code> alone doesn't fetch it.
			</p>
		),
		usage: [
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
			"  .withWcag('2.2', 'AA')         // the rules for WCAG 2.2's A and AA criteria",
			"  .disableRules(['meta-refresh-no-exceptions'])",
			"  .analyze();",
			"",
			"console.log(results.checksResults.filter(r => r.outcome === 'fail'));",
			"await browser.close();",
		],
		note: (
			<p>
				Works against all three Playwright engines, not just Chromium — verified with real
				Firefox and WebKit runs.
			</p>
		),
		internals: {
			intro: webComponents,
			code: [
				"const context = await browser.newContext();",
				"await A11yCoreBuilder.installInternalsHook(context); // before any page navigates",
				"const page = await context.newPage();",
				"await page.goto('https://example.com/');",
			],
			note: (
				<p>
					Call it before <code>page.goto()</code>, on the page or on its browser context. It runs
					through <code>addInitScript()</code>, so one call covers every frame and every navigation of
					the page, or of every page the context opens, in Chromium, Firefox and WebKit. With{" "}
					<code>@playwright/test</code>, call it in a <code>beforeEach</code> on the{" "}
					<code>context</code> fixture.
				</p>
			),
			caveat: hookCaveat("playwright"),
		},
		hooks: {
			intro: moreHooks,
			code: [
				"const context = await browser.newContext();",
				"await A11yCoreBuilder.installListenerHook(context); // before any page navigates",
				"await A11yCoreBuilder.installLiveRegionHook(context);",
				"const page = await context.newPage();",
				"await page.goto('https://example.com/settings');",
				"await page.getByRole('button', { name: 'Save' }).click();",
				"",
				"const said = await A11yCoreBuilder.announcements(page);",
				"// [{ text: 'Saved', politeness: 'polite', ..., selector: '#status' }]",
			],
			note: (
				<p>
					Both install as the internals hook does, on the page or on its browser context, before it
					navigates. With <code>@playwright/test</code>, install them in a <code>beforeEach</code> on
					the <code>context</code> fixture.
				</p>
			),
			caveat: moreHooksCaveat("playwright"),
		},
		more: alsoAvailable("playwright", {
			conditions: (
				<>
					It works in Chromium, Firefox and WebKit.
				</>
			),
		}),
		exampleHref: "https://github.com/SureA11y/playwright/blob/main/examples/basic-scan.js",
	},

	puppeteer: {
		intro: (
			<p>
				<a href="https://pptr.dev/">Puppeteer</a> is a Node.js library for driving headless or full
				Chrome/Chromium via the DevTools protocol — browser automation and scripting, often used
				for testing but not a test framework on its own. surea11y integrates through the{" "}
				<a href="https://github.com/SureA11y/puppeteer"><code>@surea11y/puppeteer</code></a>{" "}
				binding.
			</p>
		),
		install: ["npm install @surea11y/core @surea11y/puppeteer puppeteer"],
		installNote: (
			<p>
				Puppeteer downloads its own bundled Chrome as part of <code>npm install</code> — unlike
				Playwright, there's no separate browser-install step.
			</p>
		),
		usage: [
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
			"  .withWcag('2.2', 'AA')         // the rules for WCAG 2.2's A and AA criteria",
			"  .disableRules(['meta-refresh-no-exceptions'])",
			"  .analyze();",
			"",
			"console.log(results.checksResults.filter(r => r.outcome === 'fail'));",
			"await browser.close();",
		],
		note: null,
		internals: {
			intro: webComponents,
			code: [
				"const page = await browser.newPage();",
				"await A11yCoreBuilder.installInternalsHook(page); // before goto",
				"await page.goto('https://example.com/');",
			],
			note: (
				<p>
					Call it before <code>page.goto()</code>. It runs through{" "}
					<code>page.evaluateOnNewDocument()</code>, so one call covers the page's frames and
					navigations for its lifetime, in Chrome and Firefox; a new tab the page opens itself doesn't
					get it.
				</p>
			),
			caveat: hookCaveat("puppeteer"),
		},
		hooks: {
			intro: moreHooks,
			code: [
				"const page = await browser.newPage();",
				"await A11yCoreBuilder.installListenerHook(page); // before goto",
				"await A11yCoreBuilder.installLiveRegionHook(page);",
				"await page.goto('https://example.com/settings');",
				"await page.click('#save');",
				"",
				"const said = await A11yCoreBuilder.announcements(page);",
				"// [{ text: 'Saved', politeness: 'polite', ..., selector: '#status' }]",
			],
			note: (
				<p>
					Both install as the internals hook does, through <code>page.evaluateOnNewDocument()</code>,
					before <code>page.goto()</code>.
				</p>
			),
			caveat: moreHooksCaveat("puppeteer"),
		},
		more: alsoAvailable("puppeteer", {
			conditions: (
				<>
					In Firefox, widths work, but a color scheme needs the DevTools protocol, which Puppeteer
					has only in Chrome, so <code>.analyze()</code> rejects there before any scan.
				</>
			),
		}),
		exampleHref: "https://github.com/SureA11y/puppeteer/blob/main/examples/basic-scan.js",
	},

	selenium: {
		intro: (
			<p>
				<a href="https://www.selenium.dev/">Selenium WebDriver</a> is the long-standing standard
				for driving real browsers from any language — the most established cross-browser
				automation tool, commonly used for end-to-end testing. surea11y integrates through the{" "}
				<a href="https://github.com/SureA11y/selenium"><code>@surea11y/selenium</code></a>{" "}
				binding.
			</p>
		),
		install: ["npm install @surea11y/core @surea11y/selenium selenium-webdriver"],
		installNote: (
			<p>
				<code>selenium-webdriver</code> bundles Selenium Manager, which auto-downloads and
				manages the matching <code>chromedriver</code> the first time you build a driver — no
				separate Selenium server, no manual driver install (Chrome itself must already be on the
				machine).
			</p>
		),
		usage: [
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
			"  .withWcag('2.2', 'AA')         // the rules for WCAG 2.2's A and AA criteria",
			"  .disableRules(['meta-refresh-no-exceptions'])",
			"  .analyze();",
			"",
			"console.log(results.checksResults.filter(r => r.outcome === 'fail'));",
			"await driver.quit();",
		],
		note: (
			<p>
				The builder takes <code>{"{ driver }"}</code> (a Selenium <code>WebDriver</code>), where
				Puppeteer/Playwright take <code>{"{ page }"}</code> — that's the one construction
				difference. Everything downstream is identical.
			</p>
		),
		internals: {
			intro: webComponents,
			code: [
				"const options = new chrome.Options().enableBidi(); // the webSocketUrl: true capability",
				"const driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();",
				"",
				"await A11yCoreBuilder.installInternalsHook(driver); // 'bidi' (or 'cdp' without BiDi on Chrome)",
				"await driver.get('https://example.com/');",
			],
			note: (
				<p>
					Call it before <code>driver.get()</code>. Classic WebDriver can't run a script before
					the page's own, so the hook uses WebDriver BiDi when the session has it (Chrome, Edge and
					Firefox, with BiDi enabled when the driver is built, as above), and otherwise the DevTools
					protocol on Chrome and Edge; it resolves to <code>'bidi'</code> or <code>'cdp'</code>. On a
					classic session in Safari, or in Firefox without BiDi, the call rejects.
				</p>
			),
			caveat: hookCaveat("selenium"),
		},
		hooks: {
			intro: moreHooks,
			code: [
				"await A11yCoreBuilder.installListenerHook(driver); // before driver.get()",
				"await A11yCoreBuilder.installLiveRegionHook(driver);",
				"await driver.get('https://example.com/settings');",
				"await driver.findElement(By.css('#save')).click();",
				"",
				"const said = await A11yCoreBuilder.announcements(driver);",
				"// [{ text: 'Saved', politeness: 'polite', ..., selector: '#status' }]",
			],
			note: (
				<p>
					Both install as the internals hook does, before <code>driver.get()</code>: through WebDriver
					BiDi when the session has it, otherwise the DevTools protocol on Chrome and Edge. Each
					resolves to <code>'bidi'</code> or <code>'cdp'</code>. <code>By</code> comes from{" "}
					<code>selenium-webdriver</code>.
				</p>
			),
			caveat: moreHooksCaveat("selenium"),
		},
		more: alsoAvailable("selenium", {
			conditions: (
				<>
					On Chrome and Edge both go through the DevTools protocol; in other browsers a width resizes
					the window, and a color scheme makes <code>.analyze()</code> reject before any scan.
				</>
			),
		}),
		exampleHref: "https://github.com/SureA11y/selenium/blob/main/examples/basic-scan.js",
	},

	webdriverio: {
		intro: (
			<p>
				<a href="https://webdriver.io/">WebdriverIO</a> is a Node.js test automation framework
				built on the WebDriver protocol, supporting both end-to-end and component testing.
				surea11y integrates through the{" "}
				<a href="https://github.com/SureA11y/webdriverio"><code>@surea11y/webdriverio</code></a>{" "}
				binding.
			</p>
		),
		install: ["npm install @surea11y/core @surea11y/webdriverio webdriverio"],
		installNote: (
			<p>
				WebdriverIO v9 auto-manages a local <code>chromedriver</code> the first time it launches
				Chrome — a fresh install is enough to launch a real headless Chrome on its own.
			</p>
		),
		usage: [
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
			"  .withWcag('2.2', 'AA')         // the rules for WCAG 2.2's A and AA criteria",
			"  .disableRules(['meta-refresh-no-exceptions'])",
			"  .analyze();",
			"",
			"console.log(results.checksResults.filter(r => r.outcome === 'fail'));",
			"await browser.deleteSession();",
		],
		note: (
			<p>
				<strong>Force classic WebDriver, not BiDi, for this workload.</strong> WebdriverIO v9
				defaults to the BiDi protocol; a long-lived session issuing many{" "}
				<code>browser.execute()</code> calls (exactly what a scan does) degraded badly over BiDi
				in testing — per-scan latency climbed from ~2s into the minutes. Forcing classic
				WebDriver with <code>'wdio:enforceWebDriverClassic': true</code>, as shown above, gave a
				steady ~150ms per scan.
			</p>
		),
		internals: {
			intro: webComponents,
			code: [
				"await A11yCoreBuilder.installInternalsHook(browser); // 'bidi' or 'cdp'",
				"await browser.url('https://example.com/');",
			],
			note: (
				<p>
					Call it before <code>browser.url()</code>; in the WDIO testrunner, in a{" "}
					<code>before</code> hook. It uses <code>browser.addInitScript()</code> in a BiDi session,
					and otherwise the DevTools protocol through chromedriver on Chrome and Edge, which covers the
					classic session recommended above. On a classic session in Firefox or Safari, the call
					rejects.
				</p>
			),
			caveat: hookCaveat("webdriverio"),
		},
		hooks: {
			intro: moreHooks,
			code: [
				"await A11yCoreBuilder.installListenerHook(browser); // before browser.url()",
				"await A11yCoreBuilder.installLiveRegionHook(browser);",
				"await browser.url('https://example.com/settings');",
				"await $('#save').click();",
				"",
				"const said = await A11yCoreBuilder.announcements(browser);",
				"// [{ text: 'Saved', politeness: 'polite', ..., selector: '#status' }]",
			],
			note: (
				<p>
					Both install as the internals hook does, in the same sessions, before{" "}
					<code>browser.url()</code> (in the WDIO testrunner, in a <code>before</code> hook), and
					resolve to <code>'bidi'</code> or <code>'cdp'</code>.
				</p>
			),
			caveat: moreHooksCaveat("webdriverio"),
		},
		more: alsoAvailable("webdriverio", {
			conditions: (
				<>
					On Chrome and Edge both go through the DevTools protocol, in classic and BiDi sessions; in
					other browsers a width resizes the window, and a color scheme makes <code>.analyze()</code>{" "}
					reject before any scan.
				</>
			),
		}),
		exampleHref: "https://github.com/SureA11y/webdriverio/blob/main/examples/basic-scan.js",
	},
};
