import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

// The example pack each binding ships as examples/acme-policy-pack.js.
const examplePack = [
	"'use strict';",
	"",
	"// A small pack: one house rule, a checklist profile and two checklist items.",
	"// A real pack is a package of its own; `npx surea11y-pack new <folder>` writes one.",
	"",
	"const { definePack, wcagTags } = require('@surea11y/core/pack');",
	"",
	"module.exports = definePack({",
	"  name: '@acme/a11y-policy',",
	"  title: 'Acme web policy',",
	"  version: '1.0.0',",
	"  namespace: 'acme',",
	"  core: '^1.11.1',",
	"  rules: [",
	"    {",
	"      id: 'acme-no-autoplay',",
	"      meta: {",
	"        title: 'Videos do not play sound on their own',",
	"        description: 'A video that starts with sound talks over a screen reader.',",
	"        tags: ['acme'],",
	"        defaultSeverity: 'serious'",
	"      },",
	"      runInPage(ctx) {",
	"        // defaultMuted reflects the muted attribute where muted isn't set from it yet (jsdom).",
	"        const loud = [...ctx.document.querySelectorAll('video[autoplay]')].filter((v) => !(v.muted || v.defaultMuted));",
	"        return loud.length",
	"          ? {",
	"              outcome: 'fail',",
	"              occurrences: loud.map((v) =>",
	"                ctx.helpers.reportOccurrence(v, { summary: 'This video plays with sound as the page opens.', hint: 'Remove autoplay, or add muted.' })",
	"              )",
	"            }",
	"          : { outcome: 'pass', occurrences: [] };",
	"      }",
	"    }",
	"  ],",
	"  profiles: {",
	"    'acme-web-2026': { tags: wcagTags('2.2', ['A', 'AA']), rules: ['region', 'acme-no-autoplay'] }",
	"  },",
	"  rollups: [",
	"    { id: 'acme-images', title: 'Images have a text alternative', checksIds: ['img-alt-present'] },",
	"    { id: 'acme-media', title: 'Media stays quiet until asked', checksIds: ['acme-no-autoplay'] }",
	"  ]",
	"});",
];

const kindRows = [
	{
		id: "checklist",
		have: "La politique d’accessibilité d’une organisation : « WCAG 2.2 AA, plus ces règles, moins celle-là, avec ces points dans notre rapport »",
		kind: <><strong>liste de contrôle</strong> (<code>checklist</code>)</>,
		holds: "Des profils qui choisissent parmi les règles de core et les vôtres, et des agrégations qui sont les points de la liste de contrôle.",
	},
	{
		id: "standard",
		have: "Une norme qui a ses propres exigences (une norme nationale comme le RGAA, celle d’un secteur) : des exigences numérotées, chacune vérifiée par certaines règles",
		kind: <><strong>norme</strong> (<code>standard</code>)</>,
		holds: "Un tableau d’exigences, les règles qui vérifient chaque exigence, un résultat par exigence, et des profils.",
	},
	{
		id: "rules",
		have: "Quelques règles à ajouter à chaque analyse, sans profil",
		kind: "règles seules",
		holds: "Des règles, et des variantes ou des surcharges de celles de core. Partez d’une liste de contrôle et supprimez ses profils et ses agrégations.",
	},
];

const fileRows = [
	{ id: "index", file: <code>index.js</code>, what: <>Le pack, écrit avec <code>definePack()</code> de <code>@surea11y/core/pack</code>.</> },
	{ id: "auto", file: <code>rules/automatic/&lt;ns&gt;-link-text-specific.js</code>, what: "Une règle qui tranche, à l’aide des helpers de core." },
	{ id: "variant", file: <code>rules/automatic/&lt;ns&gt;-contrast-enhanced.js</code>, what: <>Une variante de <code>contrast-minimum</code> de core à 7:1.</> },
	{ id: "manual", file: <code>rules/manual/&lt;ns&gt;-new-window-review.js</code>, what: "Une règle manuelle qui demande une revue humaine." },
	{ id: "i18n", file: <code>i18n/en.json</code>, what: "Les messages." },
	{ id: "tests", file: <><code>tests/rules/*.test.js</code>, <code>tests/profiles.test.js</code></>, what: "Un test par règle, et ce qu’exécute chaque profil." },
	{ id: "examples", file: <code>docs/RULE_EXAMPLES.md</code>, what: "Des exemples des résultats de chaque règle." },
	{ id: "eslint", file: <code>eslint.config.js</code>, what: "Les règles de lint de core pour les règles." },
	{ id: "standard", file: <><code>requirements.js</code>, <code>rule-map.js</code></>, what: "Norme seulement : les exigences et les règles qui vérifient chacune d’elles." },
];

const profileFieldRows = [
	{ id: "tags", field: <code>tags</code>, what: <>Les règles qui portent l’un de ces tags. <code>wcagTags(version, levels)</code> de <code>@surea11y/core/pack</code> donne les tags WCAG de core (<code>wcagTags('2.1')</code> correspond à 2.0 et 2.1, A et AA).</> },
	{ id: "rules", field: <code>rules</code>, what: <>Des règles par identifiant, de core ou du pack : une règle de bonnes pratiques qu’aucun tag WCAG ne sélectionne, ou, avec <code>tags: []</code>, les règles de core qu’exécute le profil en plus de celles du pack.</> },
	{ id: "exclude", field: <code>exclude</code>, what: <><code>{"{ rules: [...] }"}</code> écarte des règles de l’analyse ; <code>{"{ criteria: ['2.5.8'] }"}</code> dispense de ces critères : leurs agrégations disparaissent, ainsi que chaque règle dont tous les critères sont dispensés ; une règle qui vérifie aussi un critère que le profil conserve s’exécute toujours. Cela restreint ce que l’analyse vérifie : les exigences de WCAG restent les mêmes.</> },
	{ id: "severity", field: <code>severity</code>, what: <><code>{"{ ruleId: level }"}</code> : une autre gravité sous le profil. Les résultats l’affichent et gardent celle de la règle dans <code>ruleSeverity</code> ; les baselines et les identifiants de constats ne changent pas.</> },
	{ id: "wcagVersion", field: <code>wcagVersion</code>, what: <><code>'2.0'</code>, <code>'2.1'</code> ou <code>'2.2'</code> : la version de WCAG selon laquelle les analyses du profil sont jugées (<code>engine.wcagVersion</code>). Sans elle, les tags WCAG de <code>tags</code> impliquent la version, et un profil qui n’en a aucun est jugé selon 2.2. Le <code>engineOptions.wcagVersion</code> propre à une analyse l’emporte toujours. Core 1.12.0 et versions ultérieures.</> },
	{ id: "version", field: <><code>version</code>, <code>mappedRules</code></>, what: <>Profil d’une norme seulement : la version de la norme qu’il vise, et <code>mappedRules: true</code> pour exécuter toutes les règles que la norme associe à cette version.</> },
];

export function PacksContent() {
	return (
		<>
			<p>
				Un <strong>pack</strong> apporte à <code>@surea11y/core</code> des règles, des variantes
				des règles de core, une norme ou une liste de contrôle, avec leurs profils et leurs
				messages, depuis un paquet qui lui est propre, sans fork ni build de core. Une norme
				nationale comme le RGAA peut être un pack, tout comme la politique d’accessibilité de votre
				organisation. Une analyse reçoit les packs dans <code>engineOptions.packs</code>, et les
				exécute comme elle exécute les règles et les normes propres à core : dans Node et dans un
				navigateur, depuis la CLI, les bindings et test-matchers, avec des résultats, des
				agrégations et des entrées de rapport au même format que ceux de core. Les packs
				nécessitent <code>@surea11y/core</code> 1.11.1 ou une version ultérieure.
			</p>

			<h2 id="which-kind-of-pack">Quel type de pack</h2>
			<DataTable
				label="Types de pack"
				rowKey="id"
				columns={[
					{ key: "have", label: "Vous avez", wrap: true },
					{ key: "kind", label: "Type", width: "16%" },
					{ key: "holds", label: "Ce qu’il contient", wrap: true },
				]}
				rows={kindRows}
			/>
			<p>
				Les règles et les profils d’un pack peuvent utiliser n’importe quelle règle de core : une
				liste de contrôle ou une norme est surtout faite de règles de core, choisies et regroupées,
				plus les quelques règles que core n’a pas. Les exemples de cette page utilisent{" "}
				<code>acme-policy-pack.js</code>, le petit pack que chaque binding livre dans son dossier{" "}
				<code>examples/</code> : une règle maison, un profil de liste de contrôle (WCAG 2.2 A et
				AA, <code>region</code> et la règle maison) et deux points de liste de contrôle.{" "}
				<a href="#start-from-the-example">Son code source</a> figure plus bas.
			</p>

			<h2 id="using-a-pack">Utiliser un pack</h2>

			<h3 id="from-node">Depuis Node</h3>
			<CodeBlock
				lang="js"
				lines={[
					"const { runDomRulesInPage, getChecksCatalog } = require('@surea11y/core');",
					"const acmePolicy = require('./acme-policy-pack');",
					"",
					"const result = runDomRulesInPage(url, null, { packs: [acmePolicy], profile: 'acme-web-2026' }, null);",
					"result.engine.packs;   // ['@acme/a11y-policy@1.0.0']",
					"getChecksCatalog({ packs: [acmePolicy] }); // core's rules and the pack's",
				]}
			/>
			<p>
				Le pack est préparé une fois et conservé pour la prochaine analyse avec le même objet pack :
				un crawl qui passe les mêmes packs à chaque page ne les prépare donc qu’une fois. {" "}
				<code>definePack</code> fige l’objet pack : traitez-le comme immuable, et réutilisez le
				même objet d’une analyse à l’autre. Passer un pack l’enregistre pour l’analyse ; cela ne
				sélectionne pas ses règles. Une règle de pack qui porte le tag de l’espace de noms du pack
				est optionnelle : sans l’un des profils du pack, elle ne s’exécute que si elle est
				sélectionnée par identifiant ou par ce tag (voir <a href="#names">Noms</a>). Une règle de
				pack sans ce tag est sélectionnée comme les règles de core, si bien qu’une analyse par
				défaut avec le pack l’exécute. Ajoutez{" "}
				<code>{"runOnly: { bestPractices: true }"}</code> à côté du profil pour exécuter aussi les
				bonnes pratiques.
			</p>

			<h3 id="with-a-browser-binding">Avec un binding navigateur</h3>
			<p>
				Playwright, Puppeteer, Selenium et WebdriverIO acceptent l’objet pack dans{" "}
				<code>.withPacks()</code>, et l’enregistrent dans la page, ainsi que dans chaque frame avec{" "}
				<code>.frames(true)</code>, avant l’analyse :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { A11yCoreBuilder, getScanGaps } = require('@surea11y/playwright');",
					"const acmePolicy = require('./acme-policy-pack');",
					"",
					"const results = await new A11yCoreBuilder({ page })",
					"  .withPacks(acmePolicy)",
					"  .options({ profile: 'acme-web-2026' })",
					"  .analyze();",
					"",
					"results.engine.packs;   // ['@acme/a11y-policy@1.0.0']",
					"",
					"// A checklist's items, each one result, beside core's WCAG rollups:",
					"results.rulesResults.filter((r) => r.meta && r.meta.standard === 'Acme web policy');",
				]}
			/>
			<p>
				Passez un tableau, ou appelez de nouveau <code>.withPacks()</code>, pour analyser avec
				plusieurs packs. Les bindings partagent <code>.withPacks()</code>, mais chaque builder
				prend son propre objet de pilotage (<code>{"{ page }"}</code>, <code>{"{ driver }"}</code>{" "}
				ou <code>{"{ browser }"}</code>) et demande sa propre mise en place : voir{" "}
				<a href="/getting-started/playwright/">Playwright</a>,{" "}
				<a href="/getting-started/puppeteer/">Puppeteer</a>,{" "}
				<a href="/getting-started/selenium/">Selenium</a> et{" "}
				<a href="/getting-started/webdriverio/">WebdriverIO</a>.
			</p>

			<h3 id="with-cypress">Avec Cypress</h3>
			<p>
				Un pack se prépare dans Node, et un test Cypress s’exécute dans le navigateur. Dans
				Cypress, <code>.withPacks()</code> prend donc le nom de module de chaque pack (un nom de
				paquet, ou un chemin depuis la racine du projet), et le plugin du binding prépare le pack
				dans Node. Enregistrez le plugin une fois :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// cypress.config.js",
					"const { defineConfig } = require('cypress');",
					"const surea11y = require('@surea11y/cypress/plugin');",
					"",
					"module.exports = defineConfig({",
					"  e2e: {",
					"    setupNodeEvents(on, config) {",
					"      surea11y(on, config);",
					"    }",
					"  }",
					"});",
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"new A11yCoreBuilder()",
					"  .withPacks('./examples/acme-policy-pack.js') // or a package name, '@acme/a11y-policy'",
					"  .options({ profile: 'acme-web-2026' })",
					"  .analyze()",
					"  .then((results) => {",
					"    expect(results.engine.packs).to.deep.equal(['@acme/a11y-policy@1.0.0']);",
					"  });",
				]}
			/>
			<p>
				<code>.analyze()</code> demande au plugin, via <code>cy.task</code>, le script qui
				enregistre les packs, et l’exécute dans la page, ainsi que dans chaque frame de même
				origine avec <code>.frames(true)</code>. Le plugin conserve un pack pour le reste de
				l’exécution : une modification du fichier d’un pack apparaît donc au{" "}
				<code>cypress run</code> suivant, ou après un redémarrage de <code>cypress open</code>. Un
				objet pack, tel que l’acceptent les autres bindings, lève une erreur dans{" "}
				<code>.withPacks()</code> : il ne peut pas être préparé dans le navigateur.
			</p>

			<h3 id="with-the-test-matchers">Avec test-matchers</h3>
			<p>
				<code>@surea11y/test-matchers</code> analyse dans Node : un pack est donc passé sous forme
				d’objet :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const acmePolicy = require('./acme-policy-pack');",
					"const policy = { packs: [acmePolicy], profile: 'acme-web-2026' };",
					"",
					"test(\"a page that breaks the pack's house rule fails the assertion\", () => {",
					"  document.body.innerHTML = '<main><h1>Welcome</h1><video autoplay src=\"intro.mp4\"></video></main>';",
					"  expect(document).not.toHaveNoA11yViolations(policy);",
					"});",
				]}
			/>
			<p>
				Gardez les objets pack en un seul endroit (un fichier de setup ou un module), pour que
				chaque test passe les mêmes. Un pack qui ne s’est pas exécuté fait échouer l’assertion.
				Voir <a href="/getting-started/test-matchers/#packs">test-matchers</a>.
			</p>

			<h3 id="from-the-cli">Depuis la CLI</h3>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --pack ./acme-policy-pack.js --profile acme-web-2026", command: true },
					{ text: "surea11y scan ./dist/index.html --pack @acme/a11y-policy --profile acme-web-2026", command: true },
				]}
			/>
			<p>
				<code>--pack</code> prend un nom de paquet, résolu depuis le projet du répertoire de
				travail, ou un chemin, et se répète pour plusieurs packs. Le pack charge{" "}
				<code>@surea11y/core/pack</code>, qui est installé à côté de la CLI quand vous installez{" "}
				<code>@surea11y/cli</code> dans le projet. Voir{" "}
				<a href="/getting-started/cli/#packs">CLI</a>.
			</p>

			<h3 id="in-a-page-of-your-own">Dans votre propre page</h3>
			<p>
				Pour une extension de navigateur ou votre propre <code>page.evaluate</code>, injectez{" "}
				<code>packScript([acmePolicy])</code> de <code>@surea11y/core/pack</code> après le bundle
				navigateur de core, ou livrez un seul fichier construit avec{" "}
				<code>buildBrowserBundle({"{ packs: [acmePolicy] }"})</code>, et nommez le pack sous la
				forme <code>name@version</code>. Voir{" "}
				<a href="/getting-started/standalone/#packs-in-a-page">Autonome</a>.
			</p>

			<h2 id="what-a-scan-reports">Ce que rapporte une analyse</h2>
			<ul>
				<li>
					<code>engine.packs</code> nomme chaque pack qui s’est exécuté, sous la forme{" "}
					<code>name@version</code>, et <code>engine.profile</code> le profil qui s’est appliqué.
				</li>
				<li>
					Les règles d’un pack apparaissent dans <code>checksResults</code> comme celles de core,
					avec des identifiants qui commencent par son espace de noms (<code>acme-no-autoplay</code>).
					Une règle de pack associée à un critère WCAG compte dans l’agrégation de ce critère, sauf
					si elle porte le tag optionnel de l’espace de noms du pack : ces règles vérifient ce que
					WCAG n’exige pas, et ne comptent donc que dans les agrégations propres au pack. Leur{" "}
					<code>wcagSc</code> nomme tout de même les critères WCAG qu’elles vérifient, pour les
					rapports, et aucune autre norme (EN 301 549, qui associe chaque règle par ses critères
					WCAG) ne les revendique. Une
					surcharge compte à la place de la règle de core qu’elle remplace, là où sa propre
					correspondance la place.
				</li>
				<li>
					Les points d’une liste de contrôle, ou les exigences d’une norme, sont des agrégations
					dans <code>rulesResults</code>, avec le nom de la liste de contrôle ou de la norme comme{" "}
					<code>meta.standard</code>. Le <a href="/results-reports/html-report/">rapport HTML</a>{" "}
					les affiche dans une section à part, le{" "}
					<a href="/results-reports/sarif-report/">rapport SARIF</a> attribue à chaque règle les
					tags des points auxquels elle appartient (<code>acme-images</code>), et le{" "}
					<a href="/results-reports/junit-report/">rapport JUnit</a> les liste comme propriétés. Le
					champ <code>standards</code> du résultat nomme la liste de contrôle, si bien qu’un résultat
					enregistré s’affiche de la même façon où qu’il soit rendu.
				</li>
				<li>
					La gravité définie par un profil apparaît sur les résultats qu’elle modifie, celle de la
					règle étant conservée dans <code>ruleSeverity</code>.
				</li>
			</ul>

			<h2 id="when-a-pack-doesnt-run">Quand un pack ne s’exécute pas</h2>
			<p>
				Un pack dont la plage <code>core</code> exclut la version de core installée, qui n’est pas
				valide, ou qui n’est pas compatible avec core (un identifiant de règle hors de son espace de
				noms, une clé de dictionnaire que core possède déjà, une variante d’une règle qui n’existe
				pas) est ignoré : l’analyse s’exécute sans lui, affiche un avertissement et le liste dans{" "}
				<code>skippedPacks</code> sous la forme <code>{"{ name, reason }"}</code>. Avec{" "}
				<code>strictOptions</code>, elle lève une erreur, avec{" "}
				<code>code: 'INVALID_ENGINE_OPTIONS'</code>, comme toute erreur dans{" "}
				<code>engineOptions.packs</code>. Deux packs en conflit (une clé de
				dictionnaire que les deux définissent, deux normes avec une même clé) lèvent une erreur,
				puisque toute façon de choisir entre eux dépendrait de l’ordre dans lequel ils ont été
				passés. Dans une page, un pack nommé dans <code>engineOptions.packs</code> qu’aucun appel à{" "}
				<code>packScript</code> n’a enregistré, ou qui a été enregistré avec une autre version de
				core, est listé de la même façon. Une analyse peut donc se terminer sans les vérifications
				pour lesquelles vous avez ajouté le pack : un outil qui dépend d’un pack devrait consulter{" "}
				<code>skippedPacks</code> avant de considérer l’analyse comme complète.
			</p>
			<p>Chaque outil transforme un pack ignoré en un échec visible :</p>
			<ul>
				<li>
					Les bindings navigateur vérifient chaque pack quand vous appelez{" "}
					<code>.withPacks()</code>, et lèvent une erreur avant l’analyse pour un pack que core ne
					peut pas exécuter. Un pack que la page n’exécute ensuite pas est une lacune{" "}
					<code>'pack-skipped'</code> dans <code>getScanGaps(results)</code>, et{" "}
					<code>.analyze()</code> l’annonce par un avertissement : un test qui vérifie les lacunes
					échoue donc.
				</li>
				<li>test-matchers fait échouer l’assertion, en nommant le pack et la raison.</li>
				<li>
					La CLI se termine avec le code <code>2</code>, sans écrire de rapport ni de baseline, pour
					un pack qu’elle ne trouve pas ou ne peut pas charger, ou que le moteur ignore.
				</li>
			</ul>
			<p>
				Installez le pack à côté de <code>@surea11y/core</code> et du paquet qui l’exécute, pour
				que les trois partagent une seule copie de core.
			</p>

			<h2 id="writing-a-pack">Écrire un pack</h2>

			<h3 id="start-from-the-example">Partir de l’exemple</h3>
			<p>
				Un pack est un objet créé avec <code>definePack</code> de <code>@surea11y/core/pack</code>.
				Voici <code>acme-policy-pack.js</code>, l’exemple que livrent les bindings :
			</p>
			<CodeBlock lang="js" lines={examplePack} />
			<p>
				Son profil, <code>acme-web-2026</code>, exécute les règles WCAG 2.2 A et AA de core, la
				règle de bonnes pratiques <code>region</code>, qu’aucun tag WCAG ne sélectionne, et la
				règle maison. Ses deux agrégations sont les points de la liste de contrôle : chacune
				regroupe des règles, de core ou du pack, en un seul résultat.
			</p>

			<h3 id="create-one">En créer un avec <code>surea11y-pack new</code></h3>
			<p>Pour votre propre pack, partez d’un paquet généré :</p>
			<CodeBlock
				lines={[
					{ text: "npx -p @surea11y/core surea11y-pack new acme-a11y --name @acme/a11y-pack", command: true },
					"# or, for a standard:",
					{ text: "npx -p @surea11y/core surea11y-pack new city-standard --name @city/a11y-standard --kind standard --title \"City Standard\"", command: true },
					"",
					{ text: "cd acme-a11y", command: true },
					{ text: "npm install", command: true },
					{ text: "npx playwright install chromium   # once, for npm run docs", command: true },
					{ text: "npm test && npm run lint && npm run docs", command: true },
				]}
			/>
			<p>
				Le pack fonctionne tel qu’il est généré : ses tests réussissent, ses règles passent le lint
				sans erreur, ses exemples concordent avec ses règles. <code>surea11y-pack new</code> vérifie
				le pack comme le ferait une analyse avant d’écrire quoi que ce soit, et refuse un nom, un
				espace de noms ou un titre qui le rendrait invalide (un titre <code>WCAG</code> désigne sa
				norme comme l’une de celles de core), en expliquant pourquoi. Modifiez-le ensuite pas à pas, en
				lançant <code>npm test</code> au fur et à mesure. Son README présente chaque fichier :
			</p>
			<DataTable
				label="Fichiers d’un pack généré"
				rowKey="id"
				columns={[
					{ key: "file", label: "Fichier", width: "40%", wrap: true },
					{ key: "what", label: "Ce qu’il contient", wrap: true },
				]}
				rows={fileRows}
			/>

			<h3 id="names">Noms</h3>
			<ul>
				<li>
					<strong>Le nom et la version du paquet</strong> sont un nom de paquet npm et une version
					complète (<code>1.0.0</code>). Une analyse les rapporte dans <code>engine.packs</code>.
				</li>
				<li>
					<strong>L’espace de noms</strong> (<code>namespace: 'acme'</code>) sépare les
					identifiants du pack de ceux de core et des autres packs : chaque identifiant de règle,
					d’agrégation et de profil commence par lui suivi de <code>-</code>. Il ne peut pas
					être un préfixe des identifiants de règle de core (<code>img</code>,{" "}
					<code>aria</code> ou <code>link</code> le seraient, comme dans{" "}
					<code>img-alt-present</code>), ni commencer par <code>wcag</code>, et deux packs d’une même analyse ne peuvent pas le partager. C’est
					aussi le tag qui rend optionnelles les règles propres au pack : une règle qui le porte ne
					s’exécute que sous l’un des profils du pack, par son identifiant, ou par le tag (
					<code>optInRules: ['acme']</code>). Par défaut, une analyse qui vise WCAG ne l’exécute donc
					pas. Débloquer le tag avec <code>optInRules</code> ne retire pas le profil ni les filtres
					de l’analyse : sous un profil WCAG, une règle débloquée ne s’exécute que si ses tags
					correspondent aussi à ce profil.
					Omettez le tag sur une règle qui devrait s’exécuter dans chaque analyse avec le pack : elle
					est alors sélectionnée comme les règles de core, et une analyse qui vise WCAG peut
					l’exécuter et signaler ses échecs quand ses tags correspondent.
				</li>
				<li>
					<strong><code>core</code></strong> est la plage des versions de core avec lesquelles le
					pack fonctionne (<code>'^1.11.1'</code>), lue comme npm lit les plages. Faites partir les
					nouveaux packs de 1.11.1 : le paquet 1.11.0 omettait un fichier dont les packs ont besoin
					dans Node. Une analyse avec
					une version de core hors de cette plage ignore le pack, avec la raison dans{" "}
					<code>skippedPacks</code>.
				</li>
				<li>
					<strong><code>title</code></strong> est le nom que les résultats et les rapports donnent
					à une liste de contrôle, et <strong><code>description</code></strong> une phrase sur ce
					que vérifie le pack, pour les outils qui laissent leurs utilisateurs choisir des packs (
					<code>describePacks</code> la renvoie).
				</li>
			</ul>

			<h3 id="profiles">Profils</h3>
			<p>
				Un profil est une sélection nommée, exécutée avec <code>engineOptions.profile</code>. Une
				règle s’exécute sous un profil quand elle porte l’un de ses <code>tags</code> ou que son
				identifiant figure dans <code>rules</code>, et qu’elle n’est pas dans <code>exclude</code> ;
				les règles du pack qui portent le tag de son espace de noms s’exécutent sous chaque profil
				du pack.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"profiles: {",
					"  'acme-policy': {",
					"    tags: wcagTags('2.2', ['A', 'AA']),               // core's WCAG 2.2 A and AA rules",
					"    rules: ['region', 'heading-order'],               // and these, by id",
					"    exclude: { rules: ['contrast-minimum'] },         // but not this one",
					"    severity: { 'img-alt-present': 'critical' }       // and this one is critical here",
					"  },",
					"  'acme-quick': {",
					"    tags: [],",
					"    rules: ['img-alt-present', 'link-name-present', 'page-title-present']",
					"  }",
					"}",
				]}
			/>
			<DataTable
				label="Champs d’un profil"
				rowKey="id"
				columns={[
					{ key: "field", label: "Champ", width: "22%" },
					{ key: "what", label: "Ce qu’il fait", wrap: true },
				]}
				rows={profileFieldRows}
			/>
			<p>
				<strong>Un profil qui n’exécute que ce que demande sa norme.</strong> Le profil d’une norme
				avec <code>{"tags: [<ns>]"}</code> et <code>mappedRules: true</code> exécute les règles
				propres au pack et les règles de core que sa table associe à une exigence, et rien d’autre :
				aucune règle ne vérifie ce que la norme ne demande pas, et les résultats ne contiennent
				aucun critère WCAG. Sans tag WCAG, en revanche, rien ne dit sur quelle version de WCAG la
				norme est fondée, et l’exécution est jugée selon 2.2. Pour une norme fondée sur 2.1, c’est
				faux : 4.1.1 Analyse syntaxique n’existe plus en 2.2, si bien que{" "}
				<code>duplicate-id</code> renvoie <code>cantTell</code> au lieu d’échouer. Donnez la version. Le{" "}
				<code>index.js</code> généré la lit dans <code>requirements.js</code>, où chaque version de
				la norme nomme la version de WCAG sur laquelle elle est fondée (
				<code>{"{ version: '1.0', wcagVersion: '2.2' }"}</code>) :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"'city-1.0': {",
					"  version: '1.0',",
					"  tags: ['city'],                      // the pack's own rules",
					"  mappedRules: true,                   // and the core rules its map links to a requirement",
					"  wcagVersion: wcagVersionOf('1.0')    // judged by the WCAG version requirements.js gives for 1.0",
					"}",
				]}
			/>
			<p>
				Les règles de core, avec leurs identifiants et leurs tags, figurent dans le{" "}
				<a href="/rules/">catalogue des règles</a>.
			</p>

			<h3 id="checklist-items-and-requirements">Points de liste de contrôle et exigences</h3>
			<p>
				<strong>Les points d’une liste de contrôle</strong> sont ses <code>rollups</code> :{" "}
				<code>{"{ id, title, checksIds }"}</code>, chacun regroupant des règles en un seul résultat.
				Un point échoue quand l’une de ses règles échoue, et réussit quand elles réussissent.
				Quand aucune n’échoue mais que l’une renvoie <code>cantTell</code>, le point est{" "}
				<code>cantTell</code> lui aussi : il demande une revue humaine. Un pack fournit soit des{" "}
				<code>profiles</code> et des <code>rollups</code>, une liste de contrôle, soit une norme{" "}
				(<code>standard</code>), pas les deux.
			</p>
			<p>
				<strong>Les exigences d’une norme</strong> viennent de deux tableaux qu’écrit le
				générateur, <code>requirements.js</code> (par version, le numéro, la formulation et les
				critères WCAG de chaque exigence) et <code>rule-map.js</code> (les exigences que vérifie
				chaque règle, et pourquoi). <code>ruleMappedStandard()</code> de{" "}
				<code>@surea11y/core/pack</code> en fait la norme : une agrégation par exigence, les
				exigences que nomme le résultat de chaque règle, et des vérifications des deux tableaux
				quand le pack est préparé.
			</p>

			<h3 id="rules">Règles</h3>
			<p>
				Une règle a la forme des modules de règle de core : <code>{"{ id, meta, runInPage }"}</code>,
				plus <code>applicability</code> quand elle ne s’applique que dans certains cas, avec le même{" "}
				<code>ctx</code>. <code>runInPage(ctx)</code> s’exécute dans la page : elle n’utilise donc
				que <code>ctx</code>, jamais une variable ou un module extérieur, et se contente de lire :
				les règles d’un pack s’exécutent après celles de core, et les helpers et options qu’elles
				reçoivent sont en lecture seule. La lecture seule est une règle, pas un bac à sable : rien
				n’empêche le code d’une règle d’en faire davantage, alors ne chargez que des packs en
				lesquels vous avez confiance (voir la{" "}
				<a href={`${core}/SECURITY.md`}>politique de sécurité</a> de core sur GitHub). Trois
				raccourcis demandent peu ou pas de code :{" "}
				<strong>une variante</strong> exécute une règle de core avec d’autres réglages (
				<code>{"{ id, from: 'contrast-minimum', config: { normalTextRatio: 7 }, meta }"}</code> ;
				chaque réglage est un seuil, un nombre fini supérieur à 0, et <code>definePack</code>{" "}
				refuse toute autre valeur),{" "}
				<strong>une surcharge</strong> remplace une règle de core (listée dans{" "}
				<code>overrides</code>, et dans le <code>overriddenBuiltinIds</code> des résultats), et{" "}
				<strong>une règle de core telle quelle</strong> ne demande que son identifiant dans un
				profil ou une agrégation. L’écriture d’une règle est décrite dans le{" "}
				<a href={`${core}/docs/RULE_AUTHORING.md`}>guide d’écriture de règles</a> de core sur
				GitHub.
			</p>

			<h3 id="messages">Messages et langues</h3>
			<p>
				Chaque texte qu’affiche une règle a une clé, conservée par langue dans{" "}
				<code>i18n/&lt;locale&gt;.json</code> et listée dans les <code>dictionaries</code> du pack.
				Une analyse avec <code>engineOptions.locale: 'fr'</code> affiche les textes français ; dans
				une langue pour laquelle le pack n’a pas de dictionnaire, ils s’affichent en anglais. Les
				clés d’un pack lui sont propres et commencent par son espace de noms : un pack ne peut pas
				modifier un message de core dans une langue que core fournit.
			</p>

			<h3 id="test-lint-document">Le tester, le linter et le documenter</h3>
			<ul>
				<li>
					<strong>Les tests</strong> utilisent <code>@surea11y/core/testing</code>, ce
					qu’utilisent les tests des règles de core :{" "}
					<code>runa11yCoreOnHtml(html, {"{ engineOptions }"})</code> analyse du HTML dans jsdom, et{" "}
					<code>assertRule(result, ruleId, outcome)</code> vérifie une règle. Avec des packs,
					l’analyse les exécute à la fois depuis les objets pack et tels qu’une page les reçoit, si
					bien qu’une règle qui lit une variable extérieure à sa fonction échoue à son test. jsdom
					doit être installé comme dépendance de développement.
				</li>
				<li>
					<strong>Le lint</strong> (<code>npm run lint</code>,{" "}
					<code>@surea11y/core/eslint-plugin</code>) soumet les règles du pack aux règles de lint
					auxquelles sont soumises celles de core.
				</li>
				<li>
					<strong>La documentation</strong> (<code>npm run docs</code>,{" "}
					<code>surea11y-pack docs</code>) écrit le <code>docs/RULE_CATALOG.md</code> du pack et
					exécute chaque exemple de son <code>docs/RULE_EXAMPLES.md</code> dans Chromium (
					<code>CHROMIUM_EXECUTABLE_PATH</code> désigne une autre version de Chromium) ;{" "}
					<code>--check</code> échoue quand l’un ou l’autre n’est plus à jour, pour la CI du pack.
				</li>
			</ul>

			<h3 id="publish">Le publier</h3>
			<p>
				Le paquet généré est <code>private</code>. Choisissez sa licence, définissez{" "}
				<code>license</code> et retirez <code>private</code> dans <code>package.json</code>, puis
				lancez <code>npm publish</code>. Gardez <code>@surea11y/core</code> comme dépendance peer,
				avec la plage indiquée dans <code>core</code>. Le semver couvre ce sur quoi s’appuie un
				pack : un pack écrit pour core 1.11 continue de fonctionner avec les versions 1.x
				ultérieures. Pour vos propres utilisateurs, l’identifiant d’une règle et ses codes de raison
				sont ce que contiennent leurs baselines : ne renommez ou ne supprimez l’un d’eux que dans
				une version majeure du pack.
			</p>
			<p>
				Le guide complet, d’un dossier vide à un pack publié, est le{" "}
				<a href={`${core}/docs/PACKS.md`}>
					<code>PACKS.md</code>
				</a>{" "}
				de core sur GitHub, et chaque champ figure dans la référence des packs de{" "}
				<a href={`${core}/docs/ENGINE_OPTIONS.md#packs--rules-and-standards-from-outside-core`}>
					<code>ENGINE_OPTIONS.md</code>
				</a>
				.
			</p>
		</>
	);
}
