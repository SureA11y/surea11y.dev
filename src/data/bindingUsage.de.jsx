import React from "react";

/** Opens each binding's internals-hook passage; the snippet and its binding-specific note follow. */
const webComponents = (
	<p>
		<strong>Web Components.</strong> Eine Komponente, die ihre <code>ElementInternals</code> in
		einem privaten Feld hält und sich darüber einen Namen, ihre Zustände oder eine Rolle gibt,
		lässt sich von keinem Skript der Seite auslesen. Standardmäßig stellt der Scan zu einer solchen
		Komponente eine Frage (<code>cantTell</code>), statt sie zu beurteilen, und eine Rolle, die nur
		so gesetzt ist, wird gar nicht geprüft. Wenn Sie eine Komponentenbibliothek bauen oder testen,
		installieren Sie den optionalen Internals-Hook des Bindings, bevor die eigenen Skripte der
		Seite laufen, und diese Komponenten werden wie jedes andere Bedienelement beurteilt:
	</p>
);

const hookCaveat = (repo) => (
	<p>
		Der Hook ist für Test- und Audit-Läufe gedacht: Er legt das, was er aufzeichnet, dort ab, wo
		jedes Skript der Seite es lesen kann, deshalb ist er optional. Ohne ihn meldet der Scan einmal,
		wenn er zu solchen Komponenten Fragen gestellt hat. Der{" "}
		<a href={`https://github.com/SureA11y/${repo}#web-components-the-internals-hook`}>Abschnitt der README zum Internals-Hook</a>{" "}
		enthält die Details.
	</p>
);

/** A pointer to the builder methods this page leaves to the binding's README. */
const alsoAvailable = (repo, { logger = true } = {}) => (
	<p>
		<code>A11yCoreBuilder</code> hat außerdem <code>.wcagLevel()</code>, das die gemeldeten
		Kriterien auf eine WCAG-Stufe begrenzt, ohne zu ändern, welche Regeln laufen;{" "}
		<code>.includeMode('or')</code>, das die Regeln eines Tags plus die Regeln ausführt, die Sie
		nennen; <code>.plannedChecks()</code> und <code>.plannedCriteria()</code>, die auflisten, was
		ein Scan prüfen wird, bevor er läuft, damit eine Auswahl, die nichts ausführt, nicht als Scan
		ohne Befunde durchgeht;{" "}
		{logger ? (
			<>
				<code>.logger()</code>, das Warnungen zu Scan-Lücken an Ihr eigenes Log schickt;{" "}
			</>
		) : null}
		und <code>getScanNotes(results)</code>, das angibt, wie die Seite gescannt wurde. Die{" "}
		<a href={`https://github.com/SureA11y/${repo}#readme`}>README des Bindings</a> beschreibt
		jede davon.
	</p>
);

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
		install: ["npm install @surea11y/core @surea11y/cypress cypress"],
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
					Einmal in der Support-Datei aufgerufen, läuft er bei jedem Besuch, über das Cypress-Ereignis{" "}
					<code>window:before:load</code>. Für einen einzelnen Besuch übergeben Sie ihn an{" "}
					<code>cy.visit()</code> als <code>{"{ onBeforeLoad: installInternalsHook }"}</code>. Er
					läuft mit dem <code>eval</code> des Anwendungsfensters, was funktioniert, weil Cypress die
					Content Security Policy der Anwendung standardmäßig entfernt; Frames innerhalb der Anwendung
					erhalten ihn nicht.
				</p>
			),
			caveat: hookCaveat("cypress"),
		},
		more: alsoAvailable("cypress", { logger: false }),
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
			"npm install @surea11y/core @surea11y/playwright playwright",
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
					Rufen Sie ihn vor <code>page.goto()</code> auf, auf der Seite oder auf ihrem
					Browser-Kontext. Er läuft über <code>addInitScript()</code>, sodass ein Aufruf jeden Frame und
					jede Navigation abdeckt, für die Seite oder für jede Seite, die der Kontext öffnet, in
					Chromium, Firefox und WebKit. Mit <code>@playwright/test</code> rufen Sie ihn in einem{" "}
					<code>beforeEach</code> auf der Fixture <code>context</code> auf.
				</p>
			),
			caveat: hookCaveat("playwright"),
		},
		more: alsoAvailable("playwright"),
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
		install: ["npm install @surea11y/core @surea11y/puppeteer puppeteer"],
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
		internals: {
			intro: webComponents,
			code: [
				"const page = await browser.newPage();",
				"await A11yCoreBuilder.installInternalsHook(page); // before goto",
				"await page.goto('https://example.com/');",
			],
			note: (
				<p>
					Rufen Sie ihn vor <code>page.goto()</code> auf. Er läuft über{" "}
					<code>page.evaluateOnNewDocument()</code>, sodass ein Aufruf die Frames und Navigationen der
					Seite für ihre gesamte Lebensdauer abdeckt, in Chrome und Firefox; ein neuer Tab, den die Seite
					selbst öffnet, erhält ihn nicht.
				</p>
			),
			caveat: hookCaveat("puppeteer"),
		},
		more: alsoAvailable("puppeteer"),
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
		install: ["npm install @surea11y/core @surea11y/selenium selenium-webdriver"],
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
					Rufen Sie ihn vor <code>driver.get()</code> auf. Klassisches WebDriver kann kein Skript
					vor denen der Seite ausführen, deshalb nutzt der Hook WebDriver BiDi, wenn die Session es hat
					(Chrome, Edge und Firefox, mit BiDi beim Bauen des Treibers aktiviert, wie oben), und sonst das
					DevTools-Protokoll in Chrome und Edge; er wird zu <code>'bidi'</code> oder <code>'cdp'</code>{" "}
					aufgelöst. In einer klassischen Session in Safari, oder in Firefox ohne BiDi, wird der Aufruf
					abgelehnt.
				</p>
			),
			caveat: hookCaveat("selenium"),
		},
		more: alsoAvailable("selenium"),
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
		install: ["npm install @surea11y/core @surea11y/webdriverio webdriverio"],
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
		internals: {
			intro: webComponents,
			code: [
				"await A11yCoreBuilder.installInternalsHook(browser); // 'bidi' or 'cdp'",
				"await browser.url('https://example.com/');",
			],
			note: (
				<p>
					Rufen Sie ihn vor <code>browser.url()</code> auf; im WDIO-Testrunner in einem{" "}
					<code>before</code>-Hook. Er nutzt <code>browser.addInitScript()</code> in einer BiDi-Session
					und sonst das DevTools-Protokoll über chromedriver in Chrome und Edge, was die oben empfohlene
					klassische Session abdeckt. In einer klassischen Session in Firefox oder Safari wird der Aufruf
					abgelehnt.
				</p>
			),
			caveat: hookCaveat("webdriverio"),
		},
		more: alsoAvailable("webdriverio"),
		exampleHref: "https://github.com/SureA11y/webdriverio/blob/main/examples/basic-scan.js",
	},
};
