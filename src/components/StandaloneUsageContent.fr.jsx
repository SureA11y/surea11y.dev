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

			<h2 id="packs-in-a-page">Packs dans une page</h2>
			<p>
				Un <a href="/configuration/packs/">pack</a> est préparé dans Node : il parvient donc à une
				page sous forme de script. <code>packScript(packs)</code>, de{" "}
				<code>@surea11y/core/pack</code>, renvoie un script qui enregistre les packs ; chargez-le
				après le bundle (et dans chaque frame que vous analysez), puis nommez les packs dans{" "}
				<code>engineOptions.packs</code> sous la forme <code>name@version</code>. Vous pouvez aussi
				livrer un seul fichier avec <code>buildBrowserBundle({"{ packs }"})</code> : le bundle, suivi
				des packs enregistrés. Le code des règles est écrit dans le script sous forme de fonctions,
				il s’exécute donc là où une Content Security Policy interdit <code>eval</code>.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// In Node: write the script once, beside the bundle.",
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
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(location.href, null, {",
					"    packs: ['@acme/a11y-policy@1.0.0'],",
					"    profile: 'acme-web-2026'",
					"  }, null);",
					"</script>",
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
				comme réussi. Construire votre propre outil sur core (une CLI, une intégration
				CI, un tableau de bord, un générateur de rapports de conformité) est traité dans{" "}
				<a href={`${core}/docs/BUILDING_ON_CORE.md`}><code>BUILDING_ON_CORE.md</code></a>,
				sur GitHub : ce sur quoi vous pouvez compter, lancer des analyses, choisir des
				vérifications, présenter les résultats honnêtement et comparer des exécutions.
			</p>
		</>
	);
}
