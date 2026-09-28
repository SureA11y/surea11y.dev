import React from "react";

export const bindingUsage = {
	cypress: {
		intro: (
			<p>
				<a href="https://www.cypress.io/">Cypress</a> est un framework JavaScript de tests de bout
				en bout qui exécute vos tests dans le navigateur lui-même, à côté de l’application testée.
				surea11y s’y intègre via le binding{" "}
				<a href="https://github.com/SureA11y/cypress"><code>@surea11y/cypress</code></a>.
			</p>
		),
		install: ["npm install @surea11y/cypress cypress"],
		installNote: (
			<p>
				<code>cypress</code> est déclaré dans <code>peerDependencies</code> : il vous faut votre
				propre installation de Cypress pour que les types et le runtime soient résolus, comme pour
				n’importe quelle spec Cypress.
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
				Pas d’argument de constructeur <code>{"{ page }"}</code>/<code>{"{ browser }"}</code>/
				<code>{"{ driver }"}</code>, contrairement aux bindings basés sur un pilote : Cypress
				n’a pas de tel handle. <code>cy</code> est disponible dans chaque fichier de spec et{" "}
				<em>est</em> le pilote.{" "}
				<strong><code>analyze()</code> renvoie un chainable Cypress, pas une Promise : ne faites
				pas de <code>await</code> dessus</strong> ; appelez <code>.then()</code> comme ci-dessus.
			</p>
		),
		exampleHref: "https://github.com/SureA11y/cypress/blob/main/examples/basic-scan.cy.js",
	},

	playwright: {
		intro: (
			<p>
				<a href="https://playwright.dev/">Playwright</a> est un framework de tests de bout en bout
				multinavigateur de Microsoft, qui pilote de vrais moteurs Chromium, Firefox et WebKit
				depuis Node.js. surea11y s’y intègre via le binding{" "}
				<a href="https://github.com/SureA11y/playwright"><code>@surea11y/playwright</code></a>.
			</p>
		),
		install: [
			"npm install @surea11y/playwright playwright",
			"npx playwright install chromium",
		],
		installNote: (
			<p>
				La seconde commande compte : chaque test lance un vrai navigateur, et{" "}
				<code>npm install</code> seul ne le télécharge pas.
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
				Fonctionne avec les trois moteurs de Playwright, pas seulement Chromium : vérifié par de
				vraies exécutions sous Firefox et WebKit.
			</p>
		),
		exampleHref: "https://github.com/SureA11y/playwright/blob/main/examples/basic-scan.js",
	},

	puppeteer: {
		intro: (
			<p>
				<a href="https://pptr.dev/">Puppeteer</a> est une bibliothèque Node.js qui pilote
				Chrome/Chromium, en mode headless ou complet, via le protocole DevTools : de l’automatisation et
				du scripting de navigateur, souvent utilisés pour les tests, mais pas un framework de test
				en soi. surea11y s’y intègre via le binding{" "}
				<a href="https://github.com/SureA11y/puppeteer"><code>@surea11y/puppeteer</code></a>.
			</p>
		),
		install: ["npm install @surea11y/puppeteer puppeteer"],
		installNote: (
			<p>
				Puppeteer télécharge sa propre version de Chrome lors de <code>npm install</code> :
				contrairement à Playwright, il n’y a pas d’étape distincte d’installation du navigateur.
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
				<a href="https://www.selenium.dev/"><span lang="en">Selenium WebDriver</span></a> est la norme historique pour
				piloter de vrais navigateurs depuis n’importe quel langage : l’outil d’automatisation
				multinavigateur le plus établi, couramment utilisé pour les tests de bout en bout.
				surea11y s’y intègre via le binding{" "}
				<a href="https://github.com/SureA11y/selenium"><code>@surea11y/selenium</code></a>.
			</p>
		),
		install: ["npm install @surea11y/selenium selenium-webdriver"],
		installNote: (
			<p>
				<code>selenium-webdriver</code> inclut Selenium Manager, qui télécharge et gère
				automatiquement le <code>chromedriver</code> correspondant la première fois que vous créez
				un pilote : pas de serveur Selenium séparé, pas d’installation manuelle du pilote (Chrome
				lui-même doit déjà être présent sur la machine).
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
				Le builder prend <code>{"{ driver }"}</code> (un <code>WebDriver</code> Selenium), là où
				Puppeteer/Playwright prennent <code>{"{ page }"}</code> : c’est la seule différence de
				construction. Tout le reste est identique.
			</p>
		),
		exampleHref: "https://github.com/SureA11y/selenium/blob/main/examples/basic-scan.js",
	},

	webdriverio: {
		intro: (
			<p>
				<a href="https://webdriver.io/">WebdriverIO</a> est un framework Node.js d’automatisation
				de tests fondé sur le protocole WebDriver, qui prend en charge les tests de bout en bout
				comme les tests de composants. surea11y s’y intègre via le binding{" "}
				<a href="https://github.com/SureA11y/webdriverio"><code>@surea11y/webdriverio</code></a>.
			</p>
		),
		install: ["npm install @surea11y/webdriverio webdriverio"],
		installNote: (
			<p>
				WebdriverIO v9 gère automatiquement un <code>chromedriver</code> local la première fois
				qu’il lance Chrome : une installation neuve suffit pour lancer à elle seule un vrai Chrome
				headless.
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
				<strong>Forcez le WebDriver classique, et non BiDi, pour ce type de charge.</strong>{" "}
				WebdriverIO v9 utilise le protocole BiDi par défaut ; lors des tests, une session de longue
				durée émettant de nombreux appels <code>browser.execute()</code> (exactement ce que fait
				une analyse) se dégradait fortement sous BiDi : la latence par analyse passait d’environ
				2 s à plusieurs minutes. Forcer le WebDriver classique avec{" "}
				<code>'wdio:enforceWebDriverClassic': true</code>, comme ci-dessus, a donné un temps
				stable d’environ 150 ms par analyse.
			</p>
		),
		exampleHref: "https://github.com/SureA11y/webdriverio/blob/main/examples/basic-scan.js",
	},
};
