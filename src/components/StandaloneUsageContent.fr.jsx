import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function StandaloneUsageContent() {
	return (
		<>
			<h2>Quand l’utiliser</h2>
			<p>
				Pour une vérification manuelle d’une page ouverte dans un vrai navigateur, un
				bookmarklet, ou tout autre contexte sans pilote d’automatisation ni étape de build à
				disposition.
			</p>

			<h2>Utilisation</h2>
			<p>
				<code>@surea11y/core</code> fournit <code>surea11y.browser.js</code> à la racine du
				paquet, un bundle généré à partir des mêmes sources de règles que le paquet Node. Le
				charger directement définit une seule variable globale, <code>a11ycore</code> :
			</p>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="node_modules/@surea11y/core/surea11y.browser.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(location.href, null, {}, null);",
					"  console.log(result.checksResults.filter((r) => r.outcome === 'fail'));",
					"</script>",
				]}
			/>
			<p>
				<code>a11ycore.runa11yCoreInPage</code> est exactement la même fonction que celle
				qu’appellent les bindings en interne : le bundle sert uniquement à la <em>charger</em>{" "}
				sans <code>require</code> ni système de modules, pas à ajouter une API distincte.
				Les arguments sont les mêmes que partout ailleurs. Une analyse limitée à une
				région et à WCAG 2.2 A et AA, qui laisse de côté deux widgets bruyants :
			</p>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="node_modules/@surea11y/core/surea11y.browser.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(",
					"    location.href,",
					"    '#main', // contextSelector: scan only this region",
					"    {",
					"      excludeSelectors: ['#cookie-banner', '.intercom-launcher'],",
					"      contrast: { mode: 'auditorAssist' } // trade some false-positive protection for more findings",
					"    },",
					"    { wcag: { version: '2.2', level: 'AA' } } // runOnly",
					"  );",
					"</script>",
				]}
			/>
			<p>
				<strong>Le bundle ne contient que l’anglais.</strong> Chaque autre langue est fournie à
				côté, dans son propre fichier : chargez ce fichier après le bundle et la langue devient
				disponible :
			</p>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="node_modules/@surea11y/core/surea11y.browser.js"></script>',
					'<script src="node_modules/@surea11y/core/surea11y.i18n.de.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(location.href, null, { locale: 'de' }, null);",
					"</script>",
				]}
			/>
			<p>
				Si vous demandez une langue dont vous n’avez pas chargé le fichier, vous obtenez
				l’anglais, pas une erreur. Voir <a href="/configuration/locales/">Langues</a>.
			</p>
			<p>
				Le bundle se charge aussi comme un module : <code>import a11ycore from '@surea11y/core/browser'</code>,
				un import nommé de <code>runa11yCoreInPage</code> et <code>require()</code> donnent tous
				accès à son API, et la variable globale reste définie.
			</p>
			<p>
				<strong>Délibérément exclus du bundle</strong> :{" "}
				<code>runa11yCoreAcrossFrames</code>/<code>a11yCoreEnableFrameResponder</code> (l’analyse
				entre frames exige que la frame intégrée charge elle aussi le moteur et donne son accord,
				ce qui ne convient pas à une simple balise script ajoutée à la page). Utilisez directement
				le paquet npm si vous en avez besoin : voir{" "}
				<a href={`${core}/docs/INTEGRATION.md#cross-frame-scanning-including-cross-origin`}>
					<code>INTEGRATION.md</code>
				</a>
				.
			</p>
			<p>
				Appeler directement <code>require('@surea11y/core')</code>, sans aucun binding, est
				l’autre voie autonome : ce sont les <span lang="en">Pattern 1</span> et <span lang="en">Pattern 2</span> de{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>, à savoir jsdom
				dans Node sans vrai navigateur, ou piloter vous-même Puppeteer/Playwright au lieu de
				passer par un binding.
				Pour les tests, <code>runa11yCoreOnHtml(html, options)</code> de{" "}
				<code>@surea11y/core/testing</code> analyse une chaîne HTML dans jsdom et
				prépare le document pour vous ; depuis core 1.12, son option{" "}
				<code>contentType</code> lit un document SVG ou XHTML comme ce qu’il est.
			</p>

			<h2 id="from-the-browser-console">Depuis la console du navigateur</h2>
			<p>
				Pour une analyse à la main, le bundle offre quelques outils. Chargez-le dans n’importe
				quelle page ouverte depuis la console du navigateur (l’onglet Console des outils de
				développement), puis analysez, listez les constats, encadrez-les sur la page ou ouvrez le
				rapport HTML :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// Pasted into the console of the page to check.",
					"const s = document.createElement('script');",
					"s.src = 'https://cdn.jsdelivr.net/npm/@surea11y/core/surea11y.browser.js';",
					"document.head.append(s);",
					"",
					"// Once it has loaded:",
					"a11ycore.version; // the engine's version",
					"const result = await a11ycore.run(); // scan the page",
					"a11ycore.table(result); // the findings, worst first",
					"a11ycore.highlight(result); // box each one on the page",
					"await a11ycore.openReport(result); // the HTML report, in a new tab",
					"await a11ycore.inspect('headings'); // what a person checks by hand",
				]}
			/>
			<p>
				<code>run(options)</code> accepte les options du moteur et deux qui lui sont propres,{" "}
				<code>context</code> (un sélecteur, pour n’analyser qu’une partie de la page) et{" "}
				<code>runOnly</code>, et récupère avant l’analyse les feuilles de style que la page ne peut
				pas lire elle-même. <code>table()</code> affiche une ligne par constat : d’abord les échecs,
				puis les questions qui penchent vers l’échec, celles qui penchent vers la réussite, et
				celles que seule une personne peut juger. <code>highlight()</code> encadre chaque élément
				que nomme un <code>fail</code> (rouge plein) ou un <code>cantTell</code> (ambre en
				pointillés), dans une couche à part qui ne touche pas aux éléments de la page ;{" "}
				<code>clearHighlights()</code> la retire. <code>inspect()</code> dessine ce qu’une personne
				vérifie à la main, et ne juge rien : <code>'headings'</code>, <code>'landmarks'</code>,{" "}
				<code>'names'</code> ou <code>'focus-order'</code>. <code>openReport()</code> récupère{" "}
				<code>surea11y.report.js</code> à côté du bundle la première fois, et le rapport montre
				comment vérifier chaque question. La Content Security Policy d’une page peut bloquer un
				script venant d’un CDN : chargez alors les fichiers depuis l’origine de la page, ou
				analysez avec un driver. Toutes les options sont dans la{" "}
				<a href={`${core}/docs/INTEGRATION.md#from-the-browser-console`}>
					section sur la console du navigateur d’<code>INTEGRATION.md</code>
				</a>
				, le guide d’intégration sur GitHub.
			</p>

			<h2 id="packs-in-a-page">Packs dans une page</h2>
			<p>
				Un <a href="/configuration/packs/">pack</a> est préparé dans Node : il parvient donc à une
				page sous forme de script. Pour une page qui charge ses scripts sous forme de fichiers (une
				balise <code>&lt;script&gt;</code>, un bookmarklet, une extension), construisez un seul
				fichier dans Node : <code>buildBrowserBundle({"{ packs }"})</code>, de{" "}
				<code>@surea11y/core/pack</code>, est le bundle suivi des packs enregistrés. Nommez ensuite
				les packs dans <code>engineOptions.packs</code> sous la forme <code>name@version</code>. Le
				code des règles est écrit dans le script sous forme de fonctions, il s’exécute donc là où
				une Content Security Policy interdit <code>eval</code>.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// In Node, once per release of core or of a pack.",
					"const fs = require('node:fs');",
					"const { buildBrowserBundle } = require('@surea11y/core/pack');",
					"const acmePolicy = require('./acme-policy-pack');",
					"fs.writeFileSync('surea11y-acme.js', buildBrowserBundle({ packs: [acmePolicy] }));",
				]}
			/>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="surea11y-acme.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(location.href, null, {",
					"    packs: ['@acme/a11y-policy@1.0.0'],",
					"    profile: 'acme-web-2026'",
					"  }, null);",
					"</script>",
				]}
			/>
			<p>
				Le script d’un pack ne s’exécute qu’avec la version de core qui l’a écrit : il contient le
				catalogue que forment core et les packs, vérifié dans Node. Une page dont le bundle est
				d’une autre version de core lance l’analyse sans les packs et les liste chacun dans{" "}
				<code>skippedPacks</code>, en nommant les deux versions. Un seul fichier contient les deux :
				ils ne peuvent donc pas se désynchroniser. Reconstruisez-le quand vous mettez à jour core
				ou un pack, et mettez à jour le <code>name@version</code> que nomme la page.
			</p>
			<p>
				Si le bundle de core est déjà dans la page, écrivez <code>packScript(packs)</code> dans un
				fichier avec la même version de core, et chargez-le après le bundle (et dans chaque frame
				que vous analysez) :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// In Node, with the core whose bundle the page loads.",
					"const fs = require('node:fs');",
					"const { packScript } = require('@surea11y/core/pack');",
					"const acmePolicy = require('./acme-policy-pack');",
					"fs.writeFileSync('acme-pack.js', packScript([acmePolicy]));",
				]}
			/>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="node_modules/@surea11y/core/surea11y.browser.js"></script>',
					'<script src="acme-pack.js"></script>',
				]}
			/>
			<p>
				La page exécute exactement l’ensemble de packs qu’un appel à <code>packScript</code> a
				enregistré, avec la version de core avec laquelle il a été préparé : passez à un seul
				appel tous les packs dont une analyse a besoin. Les packs nommés que la page n’exécute pas
				sont listés dans <code>skippedPacks</code> avec la raison. Les bindings font tout cela pour
				vous avec <code>.withPacks()</code>.
			</p>

			<h2 id="waiting-for-the-page">Attendre la page avant une analyse</h2>
			<p>
				Une analyse lit la page telle qu’elle est à cet instant. Sur une page qui vient de
				s’ouvrir, les polices web peuvent encore se charger et les images ne pas être arrivées :
				la même page analysée une seconde plus tard peut donner un autre résultat. L’analyse le
				consigne dans <code>engine.environment.fonts</code> et <code>.images</code> (voir{" "}
				<a href="/results-reports/output-schema/">le schéma de sortie</a>), mais le mieux est de
				ne pas analyser avant que la page se soit stabilisée.
			</p>
			<p>
				<code>waitForPageReady(options)</code> se charge de cette attente, et le bundle la place
				sur le même global. L’analyse ne l’appelle jamais elle-même ; appelez-la juste avant
				d’analyser. Elle attend l’évènement <code>load</code> de la fenêtre,{" "}
				<code>document.fonts.ready</code> et chaque image encore en cours de chargement (sauf
				celles en <code>loading="lazy"</code>), pendant au plus <code>timeoutMs</code> (par
				défaut <code>5000</code>). Elle ne rejette jamais : quand le temps est écoulé, elle se
				résout quand même avec <code>ready: false</code> et indique ce qui était encore en
				attente.
				Analyser quand même, attendre plus longtemps ou s’arrêter, c’est à vous de
				choisir ; si vous analysez, conservez avec le résultat ce qui était encore en
				attente.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const ready = await a11ycore.waitForPageReady({ timeoutMs: 3000 });",
					"const result = a11ycore.runa11yCoreInPage(location.href, null, {}, null);",
				]}
			/>
			<p>
				Un driver que vous pilotez vous-même peut l’envoyer dans la page comme{" "}
				<code>runa11yCoreInPage</code> :{" "}
				<code>page.evaluate(waitForPageReady, {"{ timeoutMs: 5000 }"})</code>. Sous jsdom, il n’y
				a rien à attendre : elle se résout aussitôt avec <code>ready: true</code>. Les autres
				options (<code>quietMs</code>, <code>document</code>) et la valeur de retour complète
				sont dans{" "}
				<a href={`${core}/docs/INTEGRATION.md#waiting-for-the-page-before-a-scan`}>
					<code>INTEGRATION.md</code>
				</a>
				, le guide d’intégration sur GitHub.
			</p>

			<h2 id="style-sheets-from-another-origin">Feuilles de style d’une autre origine</h2>
			<p>
				Le script d’une page ne peut pas lire les règles d’une feuille de style servie depuis une
				autre origine (un CDN, un service de polices), si bien qu’une règle qui cherche quelque
				chose dans le CSS, comme <code>css-orientation-lock</code>, ne peut pas savoir s’il y est, et
				pose une question. Donnez leur texte à l’analyse dans{" "}
				<code>engineOptions.styleSheetTexts</code> (<code>{"[{ href, text }]"}</code>) et{" "}
				<code>css-orientation-lock</code>, <code>css-hidden-focus</code> et{" "}
				<code>css-focus-indicator-suppressed</code> le lisent. Dans le bundle,{" "}
				<code>runa11yCoreInPageAsync</code> prend les quatre mêmes arguments que{" "}
				<code>runa11yCoreInPage</code>, récupère avec <code>preloadStyleSheets()</code> les feuilles
				que leur serveur partage (CORS), puis analyse :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const result = await a11ycore.runa11yCoreInPageAsync(location.href, null, {}, null);",
				]}
			/>
			<p>
				Une feuille que son serveur ne partage pas ne peut pas du tout être lue depuis la page. Un
				outil qui pilote le navigateur peut la récupérer hors de la page, où CORS ne s’applique pas,
				et la passer dans la même option ; les bindings le font.
			</p>

			<h2 id="a-time-limit-on-a-scan">Une limite de temps pour une analyse</h2>
			<p>
				Une analyse s’exécute d’un seul tenant dans la page, et rien dans la page ne peut
				l’arrêter une fois lancée : un getter de la page ou une règle qui ne rend jamais la main
				bloque cet onglet définitivement. Limitez la durée depuis l’endroit où vous lancez
				l’analyse, et abandonnez l’onglet quand la limite est dépassée : votre limite de temps arrête l’attente, pas le script qui s’exécute dans la page. 60 secondes, c’est bien
				plus que ce que prend une page normale : seules les pages défaillantes sont donc
				concernées :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// Playwright or Puppeteer: page.evaluate has no time limit of its own.",
					"async function scanWithin(page, ms, scan) {",
					"  let timer;",
					"  const late = new Promise((_, reject) => {",
					"    timer = setTimeout(() => reject(new Error(`the scan took longer than ${ms} ms`)), ms);",
					"  });",
					"  try {",
					"    return await Promise.race([scan(), late]);",
					"  } catch (err) {",
					"    // The tab may still be busy with the scan: close it, and use a new one.",
					"    await page.close().catch(() => {});",
					"    throw err;",
					"  } finally {",
					"    clearTimeout(timer);",
					"  }",
					"}",
					"",
					"const fs = require('node:fs');",
					"await page.evaluate(fs.readFileSync(require.resolve('@surea11y/core/browser'), 'utf8'));",
					"const result = await scanWithin(page, 60_000, () =>",
					"  page.evaluate(() => window.a11ycore.runa11yCoreInPage(location.href, null, {}, null))",
					");",
				]}
			/>
			<p>
				Dans jsdom, l’analyse s’exécute sur le thread même de Node : un minuteur ne peut donc pas
				s’y déclencher avant qu’elle se termine. Exécutez l’analyse dans un worker thread ou un
				processus enfant, et arrêtez-le quand la limite est dépassée. La limite de temps propre au
				job de CI reste le dernier recours dans les deux cas.
			</p>

			<h2 id="internals-hook">Composants web aux internals privés</h2>
			<p>
				Un élément personnalisé peut se nommer, fixer ses états et se donner un rôle par
				ses <code>ElementInternals</code>. Beaucoup gardent leurs internals dans un
				champ privé, où aucun script ne peut les relire : l’analyse pose donc la
				question pour un tel élément (<code>cantTell</code>) au lieu de le juger, et ne
				voit pas du tout un rôle donné ainsi.
			</p>
			<p>
				<code>internalsHookScript()</code>, de <code>@surea11y/core</code> (pas du
				bundle), renvoie un script qui enregistre les internals de chaque élément à
				mesure que la page les attache, pour que l’analyse puisse les lire. Il est
				facultatif : core ne l’installe jamais. Installez-le avant les scripts de la
				page, dans chaque frame que vous analysez : avec l’API de scripts
				d’initialisation de votre driver, ou, sur une page que vous construisez
				vous-même, comme premier <code>&lt;script&gt;</code> du{" "}
				<code>&lt;head&gt;</code>. Dans un fichier de setup jsdom, qui s’exécute une
				fois le document chargé mais avant la définition de tout composant, passez{" "}
				<code>{"{ early: true }"}</code> :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { internalsHookScript } = require('@surea11y/core');",
					"",
					"// Playwright",
					"await page.addInitScript({ content: internalsHookScript() });",
					"",
					"// Puppeteer",
					"await page.evaluateOnNewDocument(internalsHookScript());",
					"",
					"// jest.setup.js or vitest.setup.js, before any component is imported",
					"window.eval(internalsHookScript({ early: true }));",
				]}
			/>
			<p>
				Le résultat indique s’il était là, dans{" "}
				<code>engine.environment.internalsHook</code> : <code>'early'</code> s’il a été
				installé avant les scripts de la page, <code>'late'</code> s’il l’a été après,
				auquel cas il ne voit que ce que la page attache ensuite. Tout script de la page
				peut lire ce que le hook enregistre, si bien que les internals privés d’un
				composant ne le sont plus : installez-le pour des exécutions de test et d’audit,
				pas dans des pages servies aux utilisateurs. Les autres façons de l’installer,
				et ce qu’une page peut remarquer, sont dans{" "}
				<a href={`${core}/docs/INTEGRATION.md#reading-private-elementinternals-the-internals-hook`}><code>INTEGRATION.md</code></a>.
			</p>

			<h2 id="listener-and-live-region-hooks">Gestionnaires de clic et régions live</h2>
			<p>
				Deux autres hooks facultatifs, depuis core 1.14, s’installent comme le hook d’internals,
				avant les scripts de la page elle-même. <code>listenerHookScript()</code> enregistre les
				écouteurs de clic, de clavier, de focus, de souris et de collage qu’une page ajoute depuis
				un script, pour que les règles de clavier les jugent : un{" "}
				<code>&lt;div role="button"&gt;</code> doté d’un écouteur de clic, sans écouteur de clavier
				là où va un événement clavier venant de lui, échoue (
				<code>CLICK_HANDLER_NO_KEY_LISTENER</code>). <code>liveRegionHookScript()</code> enregistre
				ce que reçoivent les régions live : <code>live-region-announcements</code> pose alors une
				question sur une région ajoutée avec son texte déjà dedans, ou affichée et remplie d’un
				coup, que les lecteurs d’écran n’annoncent souvent pas, et <code>getAnnouncements()</code>{" "}
				renvoie ce que la page a mis à disposition pour être annoncé :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { listenerHookScript, liveRegionHookScript, getAnnouncements } = require('@surea11y/core');",
					"",
					"// Playwright: before the page's own scripts",
					"await page.addInitScript({ content: listenerHookScript() });",
					"await page.addInitScript({ content: liveRegionHookScript() });",
					"await page.goto('https://example.com/settings');",
					"",
					"await page.click('text=Save');",
					"const said = await page.evaluate(getAnnouncements, { selectors: true });",
					"// [{ text: 'Saved', politeness: 'polite', time: 1234.5, order: 7, behindModal: false, selector: '#status' }]",
				]}
			/>
			<p>
				<code>engine.environment.listenerHook</code> et <code>.liveRegionHook</code> indiquent si une
				analyse les a vus. Seul un hook d’écouteurs installé avant les scripts de la page (
				<code>'early'</code>) prouve qu’un écouteur manque ; installé plus tard, les règles ne font
				que poser une question. Dans le bundle, <code>a11ycore.getAnnouncements()</code> les lit
				dans la page. Comme le hook d’internals, tous deux gardent ce qu’ils enregistrent là où
				n’importe quel script de la page peut le lire : installez-les pour les exécutions de test et
				d’audit. Dans un fichier de configuration jsdom, passez <code>{"{ early: true }"}</code> et,
				pour le hook d’écouteurs, exécutez d’abord un sélecteur (
				<code>document.querySelector('*')</code>), car jsdom ajoute ses propres écouteurs de clavier
				la première fois qu’un sélecteur s’exécute. Un test jsdom qui remplace{" "}
				<code>showModal()</code> en définissant <code>open</code> et <code>aria-modal="true"</code>{" "}
				sur une boîte de dialogue installe le hook de régions live avec{" "}
				<code>{"{ early: true, assumeModal: true }"}</code> et analyse avec{" "}
				<code>engineOptions.assumeModal: true</code> (core 1.16.0 et ultérieur).
			</p>
			<p>
				<strong>Le <code>setContent()</code> de Playwright n’est pas une navigation.</strong> Il
				écrit le balisage dans le document courant de la page, qui est déjà chargé, si bien qu’un
				script d’initialisation ne s’exécute pas pendant le chargement de ce document. Un script
				ajouté au contexte avant l’ouverture de la page s’exécute dans le premier document de la
				page, vide : le hook est là quand <code>setContent()</code> écrit la page, mais il est
				enregistré comme <code>'late'</code>, et <code>click-handler-keyboard-operable</code> pose
				une question là où un hook précoce aurait fait échouer l’élément. Un script ajouté à une
				page déjà ouverte attend son document suivant, et <code>setContent()</code> n’en crée pas :
				l’analyse s’exécute donc sans hook. Pour une capture précoce, chargez la page par une vraie
				navigation : <code>page.goto()</code> vers un serveur ou une URL <code>file://</code>, ou{" "}
				<code>page.route()</code> pour répondre à une URL avec le balisage. Il en va de même pour
				le hook d’internals :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"await context.addInitScript({ content: listenerHookScript() });",
					"const page = await context.newPage();",
					"await page.route('https://test.local/', (route) =>",
					"  route.fulfill({ body: html, contentType: 'text/html' })",
					");",
					"await page.goto('https://test.local/'); // listenerHook: 'early'",
				]}
			/>
			<p>
				Les sections du{" "}
				<a href={`${core}/docs/INTEGRATION.md#seeing-listeners-added-from-script-the-listener-hook`}>
					hook d’écouteurs
				</a>{" "}
				et du{" "}
				<a href={`${core}/docs/INTEGRATION.md#seeing-what-live-regions-are-given-the-live-region-hook`}>
					hook de régions live
				</a>{" "}
				d’<code>INTEGRATION.md</code>, le guide d’intégration sur GitHub, donnent le reste.
			</p>

			<h2 id="questions-and-steps">Tendances et étapes des questions</h2>
			<p>
				Depuis core 1.14, une occurrence <code>cantTell</code> peut porter un <code>lean</code> :
				le sens dans lequel vont les éléments de la page (<code>toward: 'fail'</code> ou{" "}
				<code>'pass'</code>), pourquoi, et ce qui pourrait le contredire. Le résultat reste{" "}
				<code>cantTell</code>. Chaque question d’une règle de core porte aussi{" "}
				<code>howToCheck</code>, les étapes qu’une personne suit pour y répondre, dans la langue de
				l’analyse. Elles sont ajoutées dans Node, pas par le moteur dans la page :{" "}
				<code>runDomRulesInPage</code> les ajoute, et pour un résultat qui revient d’une page,{" "}
				<code>addHowToCheck(result)</code> en renvoie une copie qui les contient.{" "}
				<code>leaningFailures(result)</code> liste les constats qui penchent vers l’échec, pour un
				seuil à vous :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { runa11yCoreInPage, addHowToCheck, leaningFailures } = require('@surea11y/core');",
					"",
					"const raw = await page.evaluate(runa11yCoreInPage, page.url(), null, {}, null);",
					"const result = addHowToCheck(raw); // a copy, with each question's steps",
					"const likelyFailures = leaningFailures(result);",
				]}
			/>
			<p>
				Qu’un constat penche, et ses textes, peuvent changer dans une version mineure de core ; la
				forme de <code>lean</code> est stable. Voir{" "}
				<a href="/results-reports/output-schema/#leans">le schéma de sortie</a> pour ces deux champs.
			</p>

			<h2 id="procedures-in-a-browser">Les procédures dans un navigateur</h2>
			<p>
				Depuis core 1.15, les <a href="/conformance/procedures/">procédures de test</a>, la façon
				dont une personne évalue chaque critère à la main, sont aussi disponibles pour du code qui
				s’exécute dans un navigateur, depuis <code>@surea11y/core/procedures</code> : il n’a besoin
				d’aucun système de fichiers et n’atteint aucune des règles, si bien qu’une extension de
				navigateur ou une page à vous peut les afficher, ou ouvrir une liste de travail, avec les
				dictionnaires qu’elle importe :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"import { procedureChecklistFrom, renderProceduresFrom } from '@surea11y/core/procedures';",
					"import en from '@surea11y/core/procedures/en';",
					"import fr from '@surea11y/core/procedures/fr';",
					"",
					"const dictionaries = { en, fr };",
					"const checklist = procedureChecklistFrom(dictionaries, { levels: ['A', 'AA'], locale: 'fr' });",
					"const html = renderProceduresFrom(dictionaries, checklist);",
					"window.open(URL.createObjectURL(new Blob([html], { type: 'text/html' })));",
				]}
			/>

			<h2 id="what-a-scan-covers">Savoir ce que couvre une analyse</h2>
			<p>
				Un outil qui rapporte par critère WCAG et laisse ses utilisateurs choisir des
				vérifications peut dire à quelle cible l’analyse correspond :{" "}
				<code>engineOptions.wcagLevel</code>, à côté de <code>wcagVersion</code>, laisse
				de côté les critères au-dessus de ce niveau sans changer les vérifications
				exécutées. <code>getRulesForRunOnly(runOnly, engineOptions)</code> liste les
				critères que rapporte une analyse avec cette sélection, avant de la lancer, avec
				la logique même de l’analyse :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { getRulesForRunOnly, runDomRulesInPage } = require('@surea11y/core');",
					"",
					"const engineOptions = { wcagVersion: '2.2', wcagLevel: 'AA' };",
					"const runOnly = { includeRuleIds: ['contrast-computable'] };",
					"",
					"getRulesForRunOnly(runOnly, engineOptions).map((r) => r.id); // before the scan",
					"const result = runDomRulesInPage(url, null, engineOptions, runOnly);",
				]}
			/>
			<p>
				Un critère dont seules certaines vérifications ont été exécutées revient en{" "}
				<code>cantTell</code>, chaque vérification non exécutée étant marquée{" "}
				<code>notSelected: true</code> : affichez-le comme vérifié en partie, jamais
				comme réussi. Depuis core 1.14, aucun critère n’est rapporté comme réussi : un critère ne
				réussit que si ses règles vérifient tout ce qu’il demande, et aucun n’est encore recensé
				comme entièrement vérifié. Construire votre propre outil sur core (une CLI, une intégration
				CI, un tableau de bord, un générateur de rapports de conformité) est traité dans{" "}
				<a href={`${core}/docs/BUILDING_ON_CORE.md`}><code>BUILDING_ON_CORE.md</code></a>,
				sur GitHub : ce sur quoi vous pouvez compter, lancer des analyses, choisir des
				vérifications, présenter les résultats honnêtement et comparer des exécutions.
			</p>
		</>
	);
}
