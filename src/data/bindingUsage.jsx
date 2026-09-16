import React from "react";

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
		install: ["npm install @surea11y/cypress cypress"],
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
			"    .withTags(['wcag2a', 'wcag2aa'])",
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
			"npm install @surea11y/playwright playwright",
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
			"  .withTags(['wcag2a', 'wcag2aa'])",
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
		install: ["npm install @surea11y/puppeteer puppeteer"],
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
			"  .withTags(['wcag2a', 'wcag2aa'])",
			"  .disableRules(['meta-refresh-no-exceptions'])",
			"  .analyze();",
			"",
			"console.log(results.checksResults.filter(r => r.outcome === 'fail'));",
			"await browser.close();",
		],
		note: null,
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
		install: ["npm install @surea11y/selenium selenium-webdriver"],
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
			"  .withTags(['wcag2a', 'wcag2aa'])",
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
		install: ["npm install @surea11y/webdriverio webdriverio"],
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
			"  .withTags(['wcag2a', 'wcag2aa'])",
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
		exampleHref: "https://github.com/SureA11y/webdriverio/blob/main/examples/basic-scan.js",
	},
};
