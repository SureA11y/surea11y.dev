import React from "react";

export const bindingUsage = {
	cypress: {
		intro: (
			<p>
				<a href="https://www.cypress.io/">Cypress</a> ist ein JavaScript-Framework für
				End-to-End-Tests, das Ihre Tests direkt im Browser ausführt, neben der zu testenden
				Anwendung. surea11y wird über das Binding{" "}
				<a href="https://github.com/SureA11y/cypress"><code>@surea11y/cypress</code></a>{" "}
				eingebunden.
			</p>
		),
		install: ["npm install @surea11y/cypress cypress"],
		installNote: (
			<p>
				<code>cypress</code> ist ein Eintrag in <code>peerDependencies</code> — Sie brauchen eine
				eigene Cypress-Installation, damit Typen und Laufzeit aufgelöst werden, genau wie beim
				Schreiben jeder anderen Cypress-Spec.
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
				Anders als bei den treiberbasierten Bindings gibt es kein Konstruktorargument{" "}
				<code>{"{ page }"}</code>/<code>{"{ browser }"}</code>/<code>{"{ driver }"}</code> — ein
				solches Handle gibt es in Cypress nicht. <code>cy</code> ist in jeder Spec-Datei
				verfügbar und <em>ist</em> der Treiber.{" "}
				<strong><code>analyze()</code> gibt ein Cypress-Chainable zurück, kein Promise —
				verwenden Sie kein <code>await</code></strong>; rufen Sie <code>.then()</code> wie
				gezeigt auf.
			</p>
		),
		packs: (
			<p>
				Ein <a href="/configuration/packs/">Pack</a> wird in Node vorbereitet, und ein Cypress-Test
				läuft im Browser. Deshalb nimmt <code>.withPacks()</code> in Cypress den Modulnamen jedes
				Packs (einen Paketnamen oder einen Pfad ab dem Projektstamm), und das Plugin des Bindings,{" "}
				<code>@surea11y/cypress/plugin</code>, bereitet es in Node vor: Registrieren Sie es in{" "}
				<code>setupNodeEvents</code> mit <code>surea11y(on, config)</code>.{" "}
				<code>{".options({ profile })"}</code> wählt das Profil des Packs. Ein Pack, das nicht
				läuft, wird als Scan-Lücke <code>'pack-skipped'</code> gemeldet.
			</p>
		),
		exampleHref: "https://github.com/SureA11y/cypress/blob/main/examples/basic-scan.cy.js",
	},

	playwright: {
		intro: (
			<p>
				<a href="https://playwright.dev/">Playwright</a> ist ein browserübergreifendes
				Framework für End-to-End-Tests von Microsoft, das echte Chromium-, Firefox- und
				WebKit-Engines aus Node.js heraus steuert. surea11y wird über das Binding{" "}
				<a href="https://github.com/SureA11y/playwright"><code>@surea11y/playwright</code></a>{" "}
				eingebunden.
			</p>
		),
		install: [
			"npm install @surea11y/playwright playwright",
			"npx playwright install chromium",
		],
		installNote: (
			<p>
				Der zweite Befehl ist wichtig — jeder Test startet einen echten Browser, und{" "}
				<code>npm install</code> allein lädt ihn nicht herunter.
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
				Funktioniert mit allen drei Playwright-Engines, nicht nur mit Chromium — überprüft mit
				echten Läufen in Firefox und WebKit.
			</p>
		),
		exampleHref: "https://github.com/SureA11y/playwright/blob/main/examples/basic-scan.js",
	},

	puppeteer: {
		intro: (
			<p>
				<a href="https://pptr.dev/">Puppeteer</a> ist eine Node.js-Bibliothek, die Chrome/Chromium
				headless oder mit Oberfläche über das DevTools-Protokoll steuert — Browserautomatisierung
				und Skripting, oft für Tests verwendet, aber selbst kein Test-Framework. surea11y wird
				über das Binding{" "}
				<a href="https://github.com/SureA11y/puppeteer"><code>@surea11y/puppeteer</code></a>{" "}
				eingebunden.
			</p>
		),
		install: ["npm install @surea11y/puppeteer puppeteer"],
		installNote: (
			<p>
				Puppeteer lädt bei <code>npm install</code> sein eigenes mitgeliefertes Chrome herunter —
				anders als bei Playwright gibt es keinen separaten Schritt zur Browserinstallation.
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
		exampleHref: "https://github.com/SureA11y/puppeteer/blob/main/examples/basic-scan.js",
	},

	selenium: {
		intro: (
			<p>
				<a href="https://www.selenium.dev/"><span lang="en">Selenium WebDriver</span></a> ist der langjährige Standard,
				um echte Browser aus jeder Sprache heraus zu steuern — das etablierteste
				browserübergreifende Automatisierungswerkzeug, häufig für End-to-End-Tests eingesetzt.
				surea11y wird über das Binding{" "}
				<a href="https://github.com/SureA11y/selenium"><code>@surea11y/selenium</code></a>{" "}
				eingebunden.
			</p>
		),
		install: ["npm install @surea11y/selenium selenium-webdriver"],
		installNote: (
			<p>
				<code>selenium-webdriver</code> enthält den Selenium Manager, der beim ersten Erstellen
				eines Treibers den passenden <code>chromedriver</code> automatisch herunterlädt und
				verwaltet — kein separater Selenium-Server, keine manuelle Treiberinstallation (Chrome
				selbst muss bereits auf dem Rechner installiert sein).
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
				Der Builder nimmt <code>{"{ driver }"}</code> (einen Selenium-<code>WebDriver</code>)
				entgegen, wo Puppeteer/Playwright <code>{"{ page }"}</code> erwarten — das ist der
				einzige Unterschied bei der Erstellung. Alles Weitere ist identisch.
			</p>
		),
		exampleHref: "https://github.com/SureA11y/selenium/blob/main/examples/basic-scan.js",
	},

	webdriverio: {
		intro: (
			<p>
				<a href="https://webdriver.io/">WebdriverIO</a> ist ein Node.js-Framework zur
				Testautomatisierung auf Basis des WebDriver-Protokolls, das sowohl End-to-End- als auch
				Komponententests unterstützt. surea11y wird über das Binding{" "}
				<a href="https://github.com/SureA11y/webdriverio"><code>@surea11y/webdriverio</code></a>{" "}
				eingebunden.
			</p>
		),
		install: ["npm install @surea11y/webdriverio webdriverio"],
		installNote: (
			<p>
				WebdriverIO v9 verwaltet beim ersten Start von Chrome automatisch einen lokalen{" "}
				<code>chromedriver</code> — eine frische Installation reicht aus, um ein echtes
				Headless-Chrome zu starten.
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
				<strong>Erzwingen Sie für diese Art von Last klassisches WebDriver, nicht BiDi.</strong>{" "}
				WebdriverIO v9 verwendet standardmäßig das BiDi-Protokoll; eine langlebige Session mit
				vielen <code>browser.execute()</code>-Aufrufen (genau das, was ein Scan tut) wurde in
				Tests über BiDi stark langsamer — die Latenz pro Scan stieg von ~2 s auf mehrere Minuten.
				Mit erzwungenem klassischem WebDriver über{" "}
				<code>'wdio:enforceWebDriverClassic': true</code>, wie oben gezeigt, lag sie konstant bei
				~150 ms pro Scan.
			</p>
		),
		exampleHref: "https://github.com/SureA11y/webdriverio/blob/main/examples/basic-scan.js",
	},
};
