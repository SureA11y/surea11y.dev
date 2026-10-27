import React from "react";

/** Opens each binding's internals-hook passage; the snippet and its binding-specific note follow. */
const webComponents = (
	<p>
		<strong>Composants web.</strong> Un composant qui garde ses <code>ElementInternals</code> dans
		un champ privé, et se donne un nom, ses états ou un rôle par ce biais, ne peut être relu par
		aucun script de la page. Par défaut, l’analyse pose donc une question sur ce composant
		(<code>cantTell</code>) au lieu de le juger, et un rôle donné uniquement ainsi n’est pas
		vérifié du tout. Si vous construisez ou testez une bibliothèque de composants, installez le
		hook d’internals facultatif du binding avant que les scripts de la page elle-même ne
		s’exécutent, et ces composants sont jugés comme n’importe quel autre contrôle :
	</p>
);

const hookCaveat = (repo) => (
	<p>
		Le hook est destiné aux exécutions de test et d’audit : il garde ce qu’il enregistre là où
		n’importe quel script de la page peut le lire, c’est pourquoi il est facultatif. Sans lui,
		l’analyse le signale une fois lorsqu’elle a posé une question sur de tels composants. La{" "}
		<a href={`https://github.com/SureA11y/${repo}#web-components-the-internals-hook`}>section du README sur le hook d’internals</a>{" "}
		donne les détails.
	</p>
);

/** Opens each binding's listener- and live-region-hook passage; the snippet and its note follow. */
const moreHooks = (
	<p>
		<strong>Gestionnaires de clic et régions live.</strong> Depuis core 1.14, il existe deux autres
		hooks facultatifs. La plupart des pages ajoutent leurs gestionnaires de clic depuis un script,
		où aucun script de la page ne peut les lister ensuite, si bien que l’analyse ne voit pas qu’un{" "}
		<code>&lt;div role="button"&gt;</code> doté d’un écouteur de clic ne fait rien au clavier ;
		avec le hook d’écouteurs, ce bouton échoue (<code>CLICK_HANDLER_NO_KEY_LISTENER</code>). Le
		hook de régions live enregistre ce que reçoivent les régions live de la page : l’analyse pose
		alors une question sur un message d’état ajouté avec son texte déjà dedans, que les lecteurs
		d’écran n’annoncent souvent pas, et <code>announcements()</code> renvoie ce que la page a mis à
		disposition pour être annoncé, afin qu’un test vérifie qu’une action a bien informé
		l’utilisateur. Installez-les avant que les scripts de la page elle-même ne s’exécutent, comme
		le hook d’internals :
	</p>
);

const moreHooksCaveat = (repo) => (
	<p>
		Comme le hook d’internals, tous deux sont destinés aux exécutions de test et d’audit :
		n’importe quel script de la page peut lire ce qu’ils enregistrent.{" "}
		<code>announcements()</code> est ce que la page a mis à disposition pour être annoncé, pas ce
		qu’un lecteur d’écran a dit, et vaut <code>null</code> sans le hook de régions live. Sans l’un
		ou l’autre hook, <code>getScanNotes()</code> signale quand des constats que ce hook aurait
		tranchés ont été jugés sans lui. Les sections du README sur le{" "}
		<a href={`https://github.com/SureA11y/${repo}#click-handlers-added-from-script-the-listener-hook`}>hook d’écouteurs</a>{" "}
		et le{" "}
		<a href={`https://github.com/SureA11y/${repo}#live-regions-the-live-region-hook-and-announcements`}>hook de régions live</a>{" "}
		donnent les détails.
	</p>
);

/**
 * Conditions, the severity gate and leaning questions (binding 1.5.0), then a pointer to the
 * builder methods this page leaves to the binding's README.
 */
const alsoAvailable = (repo, { logger = true, conditions = null, cypress = false } = {}) => (
	<>
		<p>
			<strong>Mode sombre, largeurs de téléphone et seuil de gravité.</strong>{" "}
			<code>{".conditions([{ colorScheme: 'dark' }, { width: 320 }])"}</code> analyse la page telle
			qu’elle est, puis à nouveau sous chaque condition, et renvoie un seul résultat : le résultat
			d’une règle est le pire de toutes les analyses, et chaque constat indique les conditions
			sous lesquelles il a été vu. Chaque condition est une analyse complète, et{" "}
			<code>.frames(true)</code> ne peut pas encore s’y combiner. {conditions}{" "}
			<code>{"getGatingFailures(results, { failOnSeverity: 'serious' })"}</code> renvoie les règles
			en échec à cette gravité ou au-dessus, pour qu’un test bloque d’abord les problèmes graves et
			critiques pendant que les autres restent signalés ; <code>formatFailures()</code> accepte la
			même option.
		</p>
		<p>
			<strong>Des questions qui penchent, avec des étapes.</strong> Depuis core 1.14, un constat{" "}
			<code>cantTell</code> peut pencher vers <code>fail</code> ou <code>pass</code>, en disant
			pourquoi, et porte <code>howToCheck</code>, les étapes qu’une personne suit pour y répondre.{" "}
			<code>formatFailures()</code> liste les échecs probables juste après les échecs, et affiche
			les étapes avec <code>{"{ howToCheck: true }"}</code>. Pour qu’un test échoue aussi sur les
			échecs probables, ajoutez <code>leaningFailures(results)</code> de core au seuil.
			{cypress ? (
				<>
					{" "}
					Dans Cypress, les étapes viennent du plugin : <code>setupNodeEvents</code> doit renvoyer
					ce que renvoie <code>surea11y(on, config)</code>. Sans cela, le résultat n’a pas
					d’étapes, et rien n’échoue.
				</>
			) : null}
		</p>
		<p>
			<code>A11yCoreBuilder</code> a aussi <code>.wcagLevel()</code>, qui limite les critères
			rapportés à un niveau WCAG sans changer les règles exécutées ;{" "}
			<code>.includeMode('or')</code>, qui exécute les règles d’une étiquette plus les règles que
			vous nommez ; <code>.plannedChecks()</code> et <code>.plannedCriteria()</code>, qui listent
			ce qu’une analyse vérifiera avant qu’elle ne s’exécute, pour qu’une sélection qui n’exécute
			rien ne passe pas pour une analyse sans échec ;{" "}
			{logger ? (
				<>
					<code>.logger()</code>, qui envoie les avertissements de lacunes d’analyse à votre propre
					journal ;{" "}
				</>
			) : null}
			<code>.fetchStyleSheets(false)</code>, qui empêche <code>.analyze()</code> de récupérer les
			feuilles de style d’autres origines que la page ne peut pas lire elle-même, pour les règles
			qui lisent le CSS ; et <code>getScanNotes(results)</code>, qui indique comment la page a été
			analysée. Le{" "}
			<a href={`https://github.com/SureA11y/${repo}#readme`}>README du binding</a> les décrit
			chacun.
		</p>
	</>
);

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
		install: ["npm install @surea11y/core @surea11y/cypress cypress"],
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
				Pas d’argument de constructeur <code>{"{ page }"}</code>/<code>{"{ browser }"}</code>/
				<code>{"{ driver }"}</code>, contrairement aux bindings basés sur un pilote : Cypress
				n’a pas de tel handle. <code>cy</code> est disponible dans chaque fichier de spec et{" "}
				<em>est</em> le pilote.{" "}
				<strong><code>analyze()</code> renvoie un chainable Cypress, pas une Promise : ne faites
				pas de <code>await</code> dessus</strong> ; appelez <code>.then()</code> comme ci-dessus.
			</p>
		),
		packs: (
			<p>
				Un <a href="/configuration/packs/">pack</a> se prépare dans Node, et un test Cypress
				s’exécute dans le navigateur : dans Cypress, <code>.withPacks()</code> prend donc le
				nom de module de chaque pack (un nom de paquet, ou un chemin depuis la racine du projet), et
				le plugin du binding, <code>@surea11y/cypress/plugin</code>, le prépare dans Node :
				enregistrez-le en renvoyant <code>surea11y(on, config)</code> depuis <code>setupNodeEvents</code>.{" "}
				<code>{".options({ profile })"}</code> choisit le profil du pack. Un pack qui ne s’exécute
				pas est signalé comme une lacune d’analyse <code>'pack-skipped'</code>.
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
					Appelé une fois dans le fichier de support, il s’exécute à chaque visite, via l’événement{" "}
					<code>window:before:load</code> de Cypress. Pour une seule visite, passez-le à{" "}
					<code>cy.visit()</code> sous la forme <code>{"{ onBeforeLoad: installInternalsHook }"}</code>.
					Il s’exécute avec l’<code>eval</code> de la fenêtre de l’application, ce qui fonctionne parce
					que Cypress retire par défaut la Content Security Policy de l’application ; les frames à
					l’intérieur de l’application ne le reçoivent pas.
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
					Comme pour le hook d’internals, le fichier de support couvre chaque visite, et seule la
					fenêtre de l’application elle-même les reçoit, pas les frames qu’elle contient.{" "}
					<code>announcements()</code> lit la fenêtre de l’application et renvoie un chainable, comme{" "}
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
					Une largeur passe par <code>cy.viewport()</code> ; un schéma de couleurs exige un
					navigateur de la famille Chromium (Chrome, Edge, Electron), et dans Firefox{" "}
					<code>.analyze()</code> échoue avant toute analyse.
				</>
			),
		}),
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
			"npm install @surea11y/core @surea11y/playwright playwright",
			"npx playwright install chromium",
		],
		installNote: (
			<p>
				La seconde commande est importante : chaque test lance un vrai navigateur, et{" "}
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
			"  .withWcag('2.2', 'AA')         // the rules for WCAG 2.2's A and AA criteria",
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
					Appelez-le avant <code>page.goto()</code>, sur la page ou sur son contexte de
					navigateur. Il s’exécute via <code>addInitScript()</code> : un seul appel couvre chaque frame
					et chaque navigation de la page, ou de chaque page qu’ouvre le contexte, dans Chromium, Firefox
					et WebKit. Avec <code>@playwright/test</code>, appelez-le dans un <code>beforeEach</code> sur
					la fixture <code>context</code>.
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
					Tous deux s’installent comme le hook d’internals, sur la page ou sur son contexte de
					navigateur, avant qu’elle ne navigue. Avec <code>@playwright/test</code>, installez-les dans
					un <code>beforeEach</code> sur la fixture <code>context</code>.
				</p>
			),
			caveat: moreHooksCaveat("playwright"),
		},
		more: alsoAvailable("playwright", {
			conditions: (
				<>
					Cela fonctionne dans Chromium, Firefox et WebKit.
				</>
			),
		}),
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
		install: ["npm install @surea11y/core @surea11y/puppeteer puppeteer"],
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
					Appelez-le avant <code>page.goto()</code>. Il s’exécute via{" "}
					<code>page.evaluateOnNewDocument()</code> : un seul appel couvre les frames et les navigations
					de la page pendant toute sa durée de vie, dans Chrome et Firefox ; un nouvel onglet que la page
					ouvre elle-même ne le reçoit pas.
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
					Tous deux s’installent comme le hook d’internals, via{" "}
					<code>page.evaluateOnNewDocument()</code>, avant <code>page.goto()</code>.
				</p>
			),
			caveat: moreHooksCaveat("puppeteer"),
		},
		more: alsoAvailable("puppeteer", {
			conditions: (
				<>
					Dans Firefox, les largeurs fonctionnent, mais un schéma de couleurs exige le protocole
					DevTools, que Puppeteer n’a que dans Chrome : <code>.analyze()</code> y est donc rejeté avant
					toute analyse.
				</>
			),
		}),
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
		install: ["npm install @surea11y/core @surea11y/selenium selenium-webdriver"],
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
			"  .withWcag('2.2', 'AA')         // the rules for WCAG 2.2's A and AA criteria",
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
					Appelez-le avant <code>driver.get()</code>. Le WebDriver classique ne peut pas exécuter
					un script avant ceux de la page, donc le hook utilise WebDriver BiDi quand la session le prend
					en charge (Chrome, Edge et Firefox, avec BiDi activé à la construction du driver, comme
					ci-dessus), et sinon le protocole DevTools dans Chrome et Edge ; il se résout en{" "}
					<code>'bidi'</code> ou <code>'cdp'</code>. Dans une session classique sous Safari, ou sous
					Firefox sans BiDi, l’appel est rejeté.
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
					Tous deux s’installent comme le hook d’internals, avant <code>driver.get()</code> : via
					WebDriver BiDi quand la session l’a, sinon via le protocole DevTools dans Chrome et Edge.
					Chacun se résout en <code>'bidi'</code> ou <code>'cdp'</code>. <code>By</code> vient de{" "}
					<code>selenium-webdriver</code>.
				</p>
			),
			caveat: moreHooksCaveat("selenium"),
		},
		more: alsoAvailable("selenium", {
			conditions: (
				<>
					Dans Chrome et Edge, les deux passent par le protocole DevTools ; dans les autres
					navigateurs, une largeur redimensionne la fenêtre, et un schéma de couleurs fait rejeter{" "}
					<code>.analyze()</code> avant toute analyse.
				</>
			),
		}),
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
		install: ["npm install @surea11y/core @surea11y/webdriverio webdriverio"],
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
			"  .withWcag('2.2', 'AA')         // the rules for WCAG 2.2's A and AA criteria",
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
		internals: {
			intro: webComponents,
			code: [
				"await A11yCoreBuilder.installInternalsHook(browser); // 'bidi' or 'cdp'",
				"await browser.url('https://example.com/');",
			],
			note: (
				<p>
					Appelez-le avant <code>browser.url()</code> ; dans le testrunner WDIO, dans un hook{" "}
					<code>before</code>. Il utilise <code>browser.addInitScript()</code> dans une session BiDi, et
					sinon le protocole DevTools via chromedriver dans Chrome et Edge, ce qui couvre la session
					classique recommandée ci-dessus. Dans une session classique sous Firefox ou Safari, l’appel est
					rejeté.
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
					Tous deux s’installent comme le hook d’internals, dans les mêmes sessions, avant{" "}
					<code>browser.url()</code> (dans le testrunner WDIO, dans un hook <code>before</code>), et se
					résolvent en <code>'bidi'</code> ou <code>'cdp'</code>.
				</p>
			),
			caveat: moreHooksCaveat("webdriverio"),
		},
		more: alsoAvailable("webdriverio", {
			conditions: (
				<>
					Dans Chrome et Edge, les deux passent par le protocole DevTools, en session classique comme
					BiDi ; dans les autres navigateurs, une largeur redimensionne la fenêtre, et un schéma de
					couleurs fait rejeter <code>.analyze()</code> avant toute analyse.
				</>
			),
		}),
		exampleHref: "https://github.com/SureA11y/webdriverio/blob/main/examples/basic-scan.js",
	},
};
