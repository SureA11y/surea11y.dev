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

/** Opens each binding's listener- and live-region-hook passage; the snippet and its note follow. */
const moreHooks = (
	<p>
		<strong>Klick-Handler und Live-Regionen.</strong> Seit core 1.14 gibt es zwei weitere
		optionale Hooks. Die meisten Seiten fügen ihre Klick-Handler per Skript hinzu, wo kein Skript
		der Seite sie danach auflisten kann. Der Scan sieht daher nicht, dass ein{" "}
		<code>&lt;div role="button"&gt;</code> mit einem Klick-Listener per Tastatur nichts tut; mit
		dem Listener-Hook ergibt ein solcher Button <code>fail</code>{" "}
		(<code>CLICK_HANDLER_NO_KEY_LISTENER</code>). Der Live-Region-Hook zeichnet auf, was die
		Live-Regionen der Seite erhalten: Der Scan stellt dann eine Frage zu einer Statusmeldung, die
		schon mit ihrem Text eingefügt wurde und die Screenreader oft nicht ansagen, und{" "}
		<code>announcements()</code> gibt zurück, was die Seite zur Ansage bereitgestellt hat, damit
		ein Test prüfen kann, ob eine Aktion den Nutzenden etwas mitgeteilt hat. Installieren Sie sie,
		bevor die eigenen Skripte der Seite laufen, wie den Internals-Hook:
	</p>
);

const moreHooksCaveat = (repo) => (
	<p>
		Wie der Internals-Hook sind beide für Test- und Audit-Läufe gedacht: Jedes Skript der Seite
		kann lesen, was sie aufzeichnen. <code>announcements()</code> ist das, was die Seite zur
		Ansage bereitgestellt hat, nicht das, was ein Screenreader gesagt hat, und ohne den
		Live-Region-Hook <code>null</code>. Fehlt einer der beiden Hooks, meldet{" "}
		<code>getScanNotes()</code>, wenn Befunde, die er entschieden hätte, ohne ihn beurteilt
		wurden. Die Abschnitte der README zum{" "}
		<a href={`https://github.com/SureA11y/${repo}#click-handlers-added-from-script-the-listener-hook`}>Listener-Hook</a>{" "}
		und zum{" "}
		<a href={`https://github.com/SureA11y/${repo}#live-regions-the-live-region-hook-and-announcements`}>Live-Region-Hook</a>{" "}
		enthalten die Details.
	</p>
);

/**
 * Several profiles and frames (binding 1.6.0), conditions, the severity gate and leaning
 * questions (binding 1.5.0), then a pointer to the
 * builder methods this page leaves to the binding's README.
 */
const alsoAvailable = (repo, { logger = true, conditions = null, cypress = false } = {}) => (
	<>
		<p>
			<strong>Mehrere Profile zugleich.</strong> Mit core 1.15 (Binding 1.6.0) nimmt{" "}
			<code>.options({"{ profile }"})</code> auch eine Liste, das Profil eines Packs neben dem von
			WCAG oder dem eines anderen Packs:{" "}
			{cypress ? (
				<code>{".withPacks('@surea11y/pack-wai-aria').options({ profile: ['wcag22-aa', 'wai-aria-1.2'] })"}</code>
			) : (
				<code>{".withPacks(waiAria).options({ profile: ['wcag22-aa', 'wai-aria-1.2'] })"}</code>
			)}{" "}
			beurteilt die Seite in einem Scan nach WCAG und nach WAI-ARIA. Eine Regel, die beide
			ausführen, ist eine Prüfung: Ihr Ergebnis ist das schlechteste, und ihre{" "}
			<code>verdicts</code> sagen, was jedes Profil daraus macht (siehe{" "}
			<a href="/configuration/engine-options/#several-profiles">Engine-Optionen</a>). Ein Profil,
			das nicht gelaufen ist, steht in <code>results.engine.profilesNotRun</code>, und{" "}
			<code>getScanGaps()</code> meldet es als <code>'profile-not-run'</code>.
		</p>
		<p>
			<strong>Frames, gelesen wie der Browser sie liest.</strong> Seit core 1.15 ist ein Dokument in
			einem Frame keine eigene Seite, daher sind seine Regeln zu Titel, Sprache, Viewport und
			Landmarks <code>notApplicable</code>; ein Frame unter <code>aria-hidden</code> oder{" "}
			<code>inert</code> wird als solcher gelesen, einer hinter einem offenen modalen Dialog wird
			weggelassen, und einer in einem Shadow Root wird über seinen Host gelesen.
			{cypress ? (
				<>
					{" "}
					Cypress zeigt die getestete App in einem Frame seines Runners, daher übergibt{" "}
					<code>.analyze()</code> dafür <code>engineOptions.topLevelDocument: true</code>, und die
					App wird weiterhin als die Seite beurteilt; die Frames darin werden als Frames gelesen.
				</>
			) : null}{" "}
			Und wo nur WAI-ARIA oder das HTML-Inhaltsmodell verletzt ist, fragen die ARIA- und
			HTML-Strukturregeln jetzt, statt fehlzuschlagen (
			<a href="/help/faq/#results-changed-1-15">was sich geändert hat</a>); die Befunde behalten
			ihre Reason-Codes, sodass Baselines weiterhin passen. Ein Befund von{" "}
			<code>text-spacing-content-loss</code> wird mit <code>.screenshots()</code> außerdem mit dem
			angewendeten Abstand abgebildet.
		</p>
		<p>
			<strong>Dunkler Modus, Smartphone-Breiten und eine Schwelle nach Schweregrad.</strong>{" "}
			<code>{".conditions([{ colorScheme: 'dark' }, { width: 320 }])"}</code> scannt die Seite so,
			wie sie ist, und dann erneut unter jeder Bedingung, und gibt ein einziges Ergebnis zurück:
			Das Ergebnis einer Regel ist ihr schlechtestes über alle Scans, und jeder Befund nennt die
			Bedingungen, unter denen er auftrat. Jede Bedingung ist ein vollständiger Scan, und{" "}
			<code>.frames(true)</code> lässt sich noch nicht damit kombinieren. {conditions}{" "}
			<code>{"getGatingFailures(results, { failOnSeverity: 'serious' })"}</code> gibt die
			fehlschlagenden Regeln ab diesem Schweregrad zurück, sodass ein Test zuerst bei
			schwerwiegenden und kritischen Problemen blockiert, während der Rest weiter gemeldet wird;{" "}
			<code>formatFailures()</code> nimmt dieselbe Option.
		</p>
		<p>
			<strong>Fragen mit Tendenz und Prüfschritten.</strong> Seit core 1.14 kann ein{" "}
			<code>cantTell</code>-Befund zu <code>fail</code> oder <code>pass</code> tendieren, mit
			Begründung, und er enthält <code>howToCheck</code>: die Schritte, mit denen eine Person ihn
			beantwortet. <code>formatFailures()</code> listet die wahrscheinlich nicht erfüllten Fragen
			direkt nach den Fehlschlägen und gibt mit <code>{"{ howToCheck: true }"}</code> die Schritte
			aus. Soll ein Test auch bei wahrscheinlichen Fehlschlägen scheitern, nehmen Sie{" "}
			<code>leaningFailures(results)</code> aus core in die Schwelle auf.
			{cypress ? (
				<>
					{" "}
					In Cypress kommen die Schritte vom Plugin: <code>setupNodeEvents</code> muss
					zurückgeben, was <code>surea11y(on, config)</code> zurückgibt. Sonst hat das Ergebnis
					keine Schritte, und nichts schlägt fehl.
				</>
			) : null}
		</p>
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
			<code>.fetchStyleSheets(false)</code>, das <code>.analyze()</code> davon abhält, Stylesheets
			anderer Origins, die die Seite selbst nicht lesen kann, für die Regeln abzurufen, die das CSS
			lesen; und <code>getScanNotes(results)</code>, das angibt, wie die Seite gescannt wurde. Die{" "}
			<a href={`https://github.com/SureA11y/${repo}#readme`}>README des Bindings</a> beschreibt
			jede davon.
		</p>
	</>
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
				<code>@surea11y/cypress/plugin</code>, bereitet es in Node vor: Registrieren Sie es, indem{" "}
				<code>setupNodeEvents</code> den Rückgabewert von <code>surea11y(on, config)</code> zurückgibt.{" "}
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
					Wie beim Internals-Hook deckt die Support-Datei jeden Besuch ab, und nur das eigene Fenster
					der Anwendung erhält sie, nicht die Frames darin. <code>announcements()</code> liest das
					Fenster der Anwendung und gibt ein Chainable zurück, wie <code>.analyze()</code>.
				</p>
			),
			caveat: moreHooksCaveat("cypress"),
		},
		more: alsoAvailable("cypress", {
			logger: false,
			cypress: true,
			conditions: (
				<>
					Eine Breite läuft über <code>cy.viewport()</code>; ein Farbschema braucht einen Browser der
					Chromium-Familie (Chrome, Edge, Electron), und in Firefox schlägt <code>.analyze()</code> vor
					jedem Scan fehl.
				</>
			),
		}),
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
					Beide werden wie der Internals-Hook installiert, auf der Seite oder ihrem Browser-Kontext,
					bevor sie navigiert. Mit <code>@playwright/test</code> installieren Sie sie in einem{" "}
					<code>beforeEach</code> auf der Fixture <code>context</code>.
				</p>
			),
			caveat: moreHooksCaveat("playwright"),
		},
		more: alsoAvailable("playwright", {
			conditions: (
				<>
					Das funktioniert in Chromium, Firefox und WebKit.
				</>
			),
		}),
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
					Beide werden wie der Internals-Hook über <code>page.evaluateOnNewDocument()</code>{" "}
					installiert, vor <code>page.goto()</code>.
				</p>
			),
			caveat: moreHooksCaveat("puppeteer"),
		},
		more: alsoAvailable("puppeteer", {
			conditions: (
				<>
					In Firefox funktionieren Breiten, aber ein Farbschema braucht das DevTools-Protokoll, das
					Puppeteer nur in Chrome hat; dort lehnt <code>.analyze()</code> daher vor jedem Scan ab.
				</>
			),
		}),
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
					Beide werden wie der Internals-Hook vor <code>driver.get()</code> installiert: über
					WebDriver BiDi, wenn die Session es hat, sonst über das DevTools-Protokoll in Chrome und Edge.
					Jeder liefert <code>'bidi'</code> oder <code>'cdp'</code>. <code>By</code> stammt aus{" "}
					<code>selenium-webdriver</code>.
				</p>
			),
			caveat: moreHooksCaveat("selenium"),
		},
		more: alsoAvailable("selenium", {
			conditions: (
				<>
					In Chrome und Edge laufen beide über das DevTools-Protokoll; in anderen Browsern ändert eine
					Breite die Fenstergröße, und bei einem Farbschema lehnt <code>.analyze()</code> vor jedem
					Scan ab.
				</>
			),
		}),
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
					Beide werden wie der Internals-Hook in denselben Sessions installiert, vor{" "}
					<code>browser.url()</code> (im WDIO-Testrunner in einem <code>before</code>-Hook), und
					liefern <code>'bidi'</code> oder <code>'cdp'</code>.
				</p>
			),
			caveat: moreHooksCaveat("webdriverio"),
		},
		more: alsoAvailable("webdriverio", {
			conditions: (
				<>
					In Chrome und Edge laufen beide über das DevTools-Protokoll, in klassischen und
					BiDi-Sessions; in anderen Browsern ändert eine Breite die Fenstergröße, und bei einem
					Farbschema lehnt <code>.analyze()</code> vor jedem Scan ab.
				</>
			),
		}),
		exampleHref: "https://github.com/SureA11y/webdriverio/blob/main/examples/basic-scan.js",
	},
};
