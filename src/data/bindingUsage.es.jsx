import React from "react";

export const bindingUsage = {
	cypress: {
		intro: (
			<p>
				<a href="https://www.cypress.io/">Cypress</a> es un framework de pruebas end-to-end en
				JavaScript que ejecuta tus pruebas dentro del propio navegador, junto a la aplicación
				sometida a prueba. surea11y se integra mediante la integración (<code>binding</code>){" "}
				<a href="https://github.com/SureA11y/cypress"><code>@surea11y/cypress</code></a>.
			</p>
		),
		install: ["npm install @surea11y/cypress cypress"],
		installNote: (
			<p>
				<code>cypress</code> es una entrada de <code>peerDependencies</code>: necesitas tu propia
				instalación de Cypress para que los tipos/runtime se resuelvan, igual que al escribir
				cualquier archivo de prueba de Cypress.
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
				Sin argumento de constructor <code>{"{ page }"}</code>/<code>{"{ browser }"}</code>/
				<code>{"{ driver }"}</code>{" "}
				, a diferencia de las integraciones basadas en driver: en Cypress no existe ese tipo de
				referencia.{" "}
				<code>cy</code> está disponible de forma ambiental en cada archivo de prueba y <em>es</em> el driver.{" "}
				<strong><code>analyze()</code> devuelve un objeto encadenable de Cypress, no una Promise: no le hagas{" "}
				<code>await</code></strong>; llama a <code>.then()</code> como se muestra arriba.
			</p>
		),
		exampleHref: "https://github.com/SureA11y/cypress/blob/main/examples/basic-scan.cy.js",
	},

	playwright: {
		intro: (
			<p>
				<a href="https://playwright.dev/">Playwright</a> es un framework de pruebas end-to-end
				multinavegador de Microsoft, que controla motores reales de Chromium, Firefox y WebKit desde
				Node.js. surea11y se integra mediante la integración (<code>binding</code>){" "}
				<a href="https://github.com/SureA11y/playwright"><code>@surea11y/playwright</code></a>.
			</p>
		),
		install: [
			"npm install @surea11y/playwright playwright",
			"npx playwright install chromium",
		],
		installNote: (
			<p>
				El segundo comando es importante: cada prueba lanza un navegador real, y{" "}
				<code>npm install</code> por sí solo no lo descarga.
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
				Funciona con los tres motores de Playwright, no solo Chromium: verificado con ejecuciones
				reales en Firefox y WebKit.
			</p>
		),
		exampleHref: "https://github.com/SureA11y/playwright/blob/main/examples/basic-scan.js",
	},

	puppeteer: {
		intro: (
			<p>
				<a href="https://pptr.dev/">Puppeteer</a> es una librería de Node.js para controlar
				Chrome/Chromium en modo headless o completo mediante el protocolo DevTools. Se utiliza
				para automatizar navegadores y ejecutar scripts. A menudo se emplea en pruebas, aunque no
				es en sí mismo un framework de pruebas. surea11y se integra mediante la integración
				(<code>binding</code>){" "}
				<a href="https://github.com/SureA11y/puppeteer"><code>@surea11y/puppeteer</code></a>.
			</p>
		),
		install: ["npm install @surea11y/puppeteer puppeteer"],
		installNote: (
			<p>
				Puppeteer descarga su propio Chrome incluido como parte de <code>npm install</code>: a
				diferencia de Playwright, no hay un paso separado de instalación del navegador.
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
				<a href="https://www.selenium.dev/">Selenium WebDriver</a> es el estándar histórico para
				controlar navegadores reales desde cualquier lenguaje: la herramienta de automatización
				multinavegador más consolidada, usada habitualmente para pruebas end-to-end. surea11y se
				integra mediante la integración (<code>binding</code>){" "}
				<a href="https://github.com/SureA11y/selenium"><code>@surea11y/selenium</code></a>.
			</p>
		),
		install: ["npm install @surea11y/selenium selenium-webdriver"],
		installNote: (
			<p>
				<code>selenium-webdriver</code> incluye Selenium Manager, que descarga y gestiona
				automáticamente la versión correspondiente de ChromeDriver la primera vez que construyes
				un driver: no hace falta un servidor Selenium aparte ni instalar el driver manualmente (Chrome
				sí debe estar ya instalado en la máquina).
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
				El builder recibe <code>{"{ driver }"}</code> (un <code>WebDriver</code> de Selenium),
				mientras que Puppeteer/Playwright reciben <code>{"{ page }"}</code>: esa es la única
				diferencia de construcción. Todo lo demás es idéntico.
			</p>
		),
		exampleHref: "https://github.com/SureA11y/selenium/blob/main/examples/basic-scan.js",
	},

	webdriverio: {
		intro: (
			<p>
				<a href="https://webdriver.io/">WebdriverIO</a> es un framework de automatización de pruebas
				de Node.js construido sobre el protocolo WebDriver, que soporta tanto pruebas end-to-end
				como pruebas de componentes. surea11y se integra mediante la integración (<code>binding</code>){" "}
				<a href="https://github.com/SureA11y/webdriverio"><code>@surea11y/webdriverio</code></a>.
			</p>
		),
		install: ["npm install @surea11y/webdriverio webdriverio"],
		installNote: (
			<p>
				WebdriverIO v9 gestiona automáticamente un <code>chromedriver</code> local la primera vez
				que lanza Chrome: una instalación limpia basta para lanzar un Chrome headless real por sí
				sola.
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
				<strong>Fuerza el WebDriver clásico, no BiDi, para esta carga de trabajo.</strong>{" "}
				WebdriverIO v9 usa el protocolo BiDi por defecto; una sesión de larga duración que emite
				muchas llamadas a <code>browser.execute()</code> (exactamente lo que hace un análisis)
				mostró una degradación grave del rendimiento con BiDi durante las pruebas: la latencia por
				análisis pasó de ~2s a varios minutos. Forzando el WebDriver clásico con{" "}
				<code>'wdio:enforceWebDriverClassic': true</code>, como se muestra arriba, se obtuvo un
				~150ms estable por análisis.
			</p>
		),
		exampleHref: "https://github.com/SureA11y/webdriverio/blob/main/examples/basic-scan.js",
	},
};
