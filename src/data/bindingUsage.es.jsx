import React from "react";

/** Opens each binding's internals-hook passage; the snippet and its binding-specific note follow. */
const webComponents = (
	<p>
		<strong>Componentes web.</strong> Un componente que guarda su <code>ElementInternals</code> en
		un campo privado, y se da un nombre, fija sus estados o se asigna un rol a través de él, no
		puede leerse desde ningún script de la página. Por defecto, el análisis pregunta por ese
		componente (<code>cantTell</code>) en lugar de juzgarlo, y un rol asignado solo de esa forma
		no se comprueba en absoluto. Si construyes o pruebas una biblioteca de componentes, instala el
		hook de internals opcional de la integración antes de que se ejecuten los scripts de la propia
		página, y esos componentes se juzgan como cualquier otro control:
	</p>
);

const hookCaveat = (repo) => (
	<p>
		El hook está pensado para ejecuciones de pruebas y auditorías: guarda lo que registra donde
		cualquier script de la página puede leerlo, y por eso es opcional. Sin él, el análisis avisa
		una vez cuando ha preguntado por esos componentes. La{" "}
		<a href={`https://github.com/SureA11y/${repo}#web-components-the-internals-hook`}>sección del README sobre el hook de internals</a>{" "}
		tiene los detalles.
	</p>
);

/** Opens each binding's listener- and live-region-hook passage; the snippet and its note follow. */
const moreHooks = (
	<p>
		<strong>Manejadores de clic y regiones vivas.</strong> Desde core 1.14 hay dos hooks
		opcionales más. La mayoría de las páginas añaden sus manejadores de clic desde un script, donde
		ningún script de la página puede enumerarlos después, así que el análisis no ve que un{" "}
		<code>&lt;div role="button"&gt;</code> con un listener de clic no hace nada desde el teclado;
		con el hook de listeners, ese botón falla (<code>CLICK_HANDLER_NO_KEY_LISTENER</code>). El hook
		de regiones vivas registra lo que reciben las regiones vivas de la página: el análisis pregunta
		entonces por un mensaje de estado añadido con su texto ya dentro, que los lectores de pantalla
		no suelen anunciar, y <code>announcements()</code> devuelve lo que la página puso a
		disposición para anunciar, para que una prueba compruebe que una acción le dijo algo al
		usuario. Instálalos antes de que se ejecuten los scripts de la propia página, como el hook de
		internals:
	</p>
);

const moreHooksCaveat = (repo) => (
	<p>
		Como el hook de internals, ambos son para ejecuciones de pruebas y auditorías: cualquier script
		de la página puede leer lo que registran. <code>announcements()</code> es lo que la página puso
		a disposición para anunciar, no lo que dijo un lector de pantalla, y es <code>null</code> sin
		el hook de regiones vivas. Sin alguno de los dos hooks, <code>getScanNotes()</code> avisa
		cuando se juzgaron sin él hallazgos que el hook habría decidido. Las secciones del README sobre
		el{" "}
		<a href={`https://github.com/SureA11y/${repo}#click-handlers-added-from-script-the-listener-hook`}>hook de listeners</a>{" "}
		y el{" "}
		<a href={`https://github.com/SureA11y/${repo}#live-regions-the-live-region-hook-and-announcements`}>hook de regiones vivas</a>{" "}
		tienen los detalles.
	</p>
);

/**
 * Conditions, the severity gate and leaning questions (binding 1.5.0), then a pointer to the
 * builder methods this page leaves to the binding's README.
 */
const alsoAvailable = (repo, { logger = true, conditions = null, cypress = false } = {}) => (
	<>
		<p>
			<strong>Modo oscuro, anchos de móvil y un umbral de gravedad.</strong>{" "}
			<code>{".conditions([{ colorScheme: 'dark' }, { width: 320 }])"}</code> analiza la página tal
			como está y de nuevo bajo cada condición, y devuelve un único resultado: el resultado de una
			regla es el peor de todos los análisis, y cada hallazgo indica las condiciones en las que se
			vio. Cada condición es un análisis completo, y <code>.frames(true)</code> todavía no se
			puede combinar con ella. {conditions}{" "}
			<code>{"getGatingFailures(results, { failOnSeverity: 'serious' })"}</code> devuelve las
			reglas que fallan con esa gravedad o más, para que una prueba bloquee primero los problemas
			graves y críticos mientras el resto se sigue informando; <code>formatFailures()</code> admite
			la misma opción.
		</p>
		<p>
			<strong>Preguntas con tendencia, y sus pasos.</strong> Desde core 1.14, un hallazgo{" "}
			<code>cantTell</code> puede tener una tendencia hacia <code>fail</code> o <code>pass</code>,
			explicando por qué, y lleva <code>howToCheck</code>, los pasos que sigue una persona para
			responderlo. <code>formatFailures()</code> enumera los probables fallos justo después de los
			fallos, e imprime los pasos con <code>{"{ howToCheck: true }"}</code>. Para que una prueba
			falle también con los probables fallos, añade al umbral <code>leaningFailures(results)</code>{" "}
			de core.
			{cypress ? (
				<>
					{" "}
					En Cypress los pasos vienen del plugin: <code>setupNodeEvents</code> tiene que devolver
					lo que devuelve <code>surea11y(on, config)</code>. Sin eso, el resultado no tiene pasos,
					y no falla nada.
				</>
			) : null}
		</p>
		<p>
			<code>A11yCoreBuilder</code> también tiene <code>.wcagLevel()</code>, que limita los criterios
			del informe a un nivel de WCAG sin cambiar qué reglas se ejecutan;{" "}
			<code>.includeMode('or')</code>, que ejecuta las reglas de una etiqueta más las reglas que
			nombres; <code>.plannedChecks()</code> y <code>.plannedCriteria()</code>, que enumeran lo que
			comprobará un análisis antes de ejecutarlo, para que una selección que no ejecuta nada no pase
			por un análisis limpio;{" "}
			{logger ? (
				<>
					<code>.logger()</code>, que envía los avisos de carencias del análisis a tu propio log;{" "}
				</>
			) : null}
			<code>.fetchStyleSheets(false)</code>, que evita que <code>.analyze()</code> descargue las
			hojas de estilo de otros orígenes que la página no puede leer por sí misma, para las reglas
			que leen el CSS; y <code>getScanNotes(results)</code>, que dice cómo se analizó la página. El{" "}
			<a href={`https://github.com/SureA11y/${repo}#readme`}>README de la integración</a> explica cada uno.
		</p>
	</>
);

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
		install: ["npm install @surea11y/core @surea11y/cypress cypress"],
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
				Sin argumento de constructor <code>{"{ page }"}</code>/<code>{"{ browser }"}</code>/
				<code>{"{ driver }"}</code>{" "}
				, a diferencia de las integraciones basadas en driver: en Cypress no existe ese tipo de
				referencia.{" "}
				<code>cy</code> está disponible de forma ambiental en cada archivo de prueba y <em>es</em> el driver.{" "}
				<strong><code>analyze()</code> devuelve un objeto encadenable de Cypress, no una Promise: no le hagas{" "}
				<code>await</code></strong>; llama a <code>.then()</code> como se muestra arriba.
			</p>
		),
		packs: (
			<p>
				Un <a href="/configuration/packs/">pack</a> se prepara en Node, y una prueba de Cypress se
				ejecuta en el navegador, así que en Cypress <code>.withPacks()</code> recibe el nombre del
				módulo de cada pack (un nombre de paquete, o una ruta desde la raíz del proyecto), y el
				plugin del binding, <code>@surea11y/cypress/plugin</code>, lo prepara en Node: regístralo
				devolviendo <code>surea11y(on, config)</code> desde <code>setupNodeEvents</code>.{" "}
				<code>{".options({ profile })"}</code> elige el perfil del pack. Un pack que no se ejecuta
				se informa como una carencia del análisis de tipo <code>'pack-skipped'</code>.
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
					Llamado una vez en el archivo de soporte, se ejecuta en cada visita, a través del evento{" "}
					<code>window:before:load</code> de Cypress. Para una sola visita, pásalo a{" "}
					<code>cy.visit()</code> como <code>{"{ onBeforeLoad: installInternalsHook }"}</code>. Se
					ejecuta con el <code>eval</code> de la ventana de la aplicación, lo que funciona porque Cypress
					elimina por defecto la Content Security Policy de la aplicación, y los frames dentro de la
					aplicación no lo reciben.
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
					Como con el hook de internals, el archivo de soporte cubre todas las visitas, y solo los
					recibe la ventana de la propia aplicación, no los frames que contiene.{" "}
					<code>announcements()</code> lee la ventana de la aplicación y devuelve un chainable, como{" "}
					<code>.analyze()</code>.
				</p>
			),
			caveat: moreHooksCaveat("cypress"),
		},
		more: alsoAvailable("cypress", {
			logger: false,
			cypress: true,
			conditions: (
				<>
					Un ancho pasa por <code>cy.viewport()</code>; un esquema de color necesita un navegador de
					la familia Chromium (Chrome, Edge, Electron), y en Firefox <code>.analyze()</code> falla antes
					de analizar nada.
				</>
			),
		}),
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
			"npm install @surea11y/core @surea11y/playwright playwright",
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
			"  .withWcag('2.2', 'AA')         // the rules for WCAG 2.2's A and AA criteria",
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
					Llámalo antes de <code>page.goto()</code>, sobre la página o sobre su contexto de
					navegador. Se ejecuta mediante <code>addInitScript()</code>, así que una sola llamada cubre cada
					frame y cada navegación de la página, o de cada página que abra el contexto, en Chromium,
					Firefox y WebKit. Con <code>@playwright/test</code>, llámalo en un <code>beforeEach</code>{" "}
					sobre el fixture <code>context</code>.
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
					Ambos se instalan como el hook de internals, en la página o en su contexto de navegador, antes
					de que navegue. Con <code>@playwright/test</code>, instálalos en un <code>beforeEach</code>{" "}
					sobre el fixture <code>context</code>.
				</p>
			),
			caveat: moreHooksCaveat("playwright"),
		},
		more: alsoAvailable("playwright", {
			conditions: (
				<>
					Funciona en Chromium, Firefox y WebKit.
				</>
			),
		}),
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
		install: ["npm install @surea11y/core @surea11y/puppeteer puppeteer"],
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
					Llámalo antes de <code>page.goto()</code>. Se ejecuta mediante{" "}
					<code>page.evaluateOnNewDocument()</code>, así que una sola llamada cubre los frames y las
					navegaciones de la página durante toda su vida, en Chrome y Firefox; una pestaña nueva que abra
					la propia página no lo recibe.
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
					Ambos se instalan como el hook de internals, mediante{" "}
					<code>page.evaluateOnNewDocument()</code>, antes de <code>page.goto()</code>.
				</p>
			),
			caveat: moreHooksCaveat("puppeteer"),
		},
		more: alsoAvailable("puppeteer", {
			conditions: (
				<>
					En Firefox los anchos funcionan, pero un esquema de color necesita el protocolo DevTools,
					que Puppeteer solo tiene en Chrome, así que allí <code>.analyze()</code> se rechaza antes de
					analizar nada.
				</>
			),
		}),
		exampleHref: "https://github.com/SureA11y/puppeteer/blob/main/examples/basic-scan.js",
	},

	selenium: {
		intro: (
			<p>
				<a href="https://www.selenium.dev/"><span lang="en">Selenium WebDriver</span></a> es el estándar histórico para
				controlar navegadores reales desde cualquier lenguaje: la herramienta de automatización
				multinavegador más consolidada, usada habitualmente para pruebas end-to-end. surea11y se
				integra mediante la integración (<code>binding</code>){" "}
				<a href="https://github.com/SureA11y/selenium"><code>@surea11y/selenium</code></a>.
			</p>
		),
		install: ["npm install @surea11y/core @surea11y/selenium selenium-webdriver"],
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
			"  .withWcag('2.2', 'AA')         // the rules for WCAG 2.2's A and AA criteria",
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
					Llámalo antes de <code>driver.get()</code>. El WebDriver clásico no puede ejecutar un
					script antes de los de la página, así que el hook usa WebDriver BiDi cuando la sesión lo tiene
					(Chrome, Edge y Firefox, con BiDi activado al construir el driver, como arriba) y, si no, el
					protocolo DevTools en Chrome y Edge; se resuelve con <code>'bidi'</code> o <code>'cdp'</code>.
					En una sesión clásica en Safari, o en Firefox sin BiDi, la llamada se rechaza.
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
					Ambos se instalan como el hook de internals, antes de <code>driver.get()</code>: mediante
					WebDriver BiDi cuando la sesión lo tiene y, si no, mediante el protocolo DevTools en Chrome y
					Edge. Cada uno se resuelve en <code>'bidi'</code> o <code>'cdp'</code>. <code>By</code> viene
					de <code>selenium-webdriver</code>.
				</p>
			),
			caveat: moreHooksCaveat("selenium"),
		},
		more: alsoAvailable("selenium", {
			conditions: (
				<>
					En Chrome y Edge ambos pasan por el protocolo DevTools; en otros navegadores un ancho
					redimensiona la ventana, y un esquema de color hace que <code>.analyze()</code> se rechace
					antes de analizar nada.
				</>
			),
		}),
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
		install: ["npm install @surea11y/core @surea11y/webdriverio webdriverio"],
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
			"  .withWcag('2.2', 'AA')         // the rules for WCAG 2.2's A and AA criteria",
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
		internals: {
			intro: webComponents,
			code: [
				"await A11yCoreBuilder.installInternalsHook(browser); // 'bidi' or 'cdp'",
				"await browser.url('https://example.com/');",
			],
			note: (
				<p>
					Llámalo antes de <code>browser.url()</code>; en el testrunner de WDIO, en un hook{" "}
					<code>before</code>. Usa <code>browser.addInitScript()</code> en una sesión BiDi y, si no, el
					protocolo DevTools a través de chromedriver en Chrome y Edge, lo que cubre la sesión clásica
					recomendada arriba. En una sesión clásica en Firefox o Safari, la llamada se rechaza.
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
					Ambos se instalan como el hook de internals, en las mismas sesiones, antes de{" "}
					<code>browser.url()</code> (en el testrunner de WDIO, en un hook <code>before</code>), y se
					resuelven en <code>'bidi'</code> o <code>'cdp'</code>.
				</p>
			),
			caveat: moreHooksCaveat("webdriverio"),
		},
		more: alsoAvailable("webdriverio", {
			conditions: (
				<>
					En Chrome y Edge ambos pasan por el protocolo DevTools, en sesiones clásicas y BiDi; en otros
					navegadores un ancho redimensiona la ventana, y un esquema de color hace que{" "}
					<code>.analyze()</code> se rechace antes de analizar nada.
				</>
			),
		}),
		exampleHref: "https://github.com/SureA11y/webdriverio/blob/main/examples/basic-scan.js",
	},
};
