import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const apiRows = [
	{
		id: "received",
		param: <code>received</code>,
		type: (
			<>
				<code>Element</code>, <code>Document</code> ou résultat d’analyse
			</>
		),
		meaning: (
			<>
				Ce qu’il faut vérifier. Un <code>Element</code>/<code>Document</code> DOM est analysé
				automatiquement ; un objet de la forme <code>{"{ checksResults: [...] }"}</code> est
				vérifié directement, sans analyse. Toute autre valeur lève une <code>TypeError</code>.
			</>
		),
	},
	{
		id: "engineOptions",
		param: <code>engineOptions</code>,
		type: "objet (facultatif)",
		meaning: (
			<>
				Transmis tel quel à l’analyse de <code>@surea11y/core</code> : le même objet d’options
				que partout ailleurs dans l’écosystème (voir <a href="/configuration/engine-options/">Options du moteur</a>). Ignoré
				lorsque <code>received</code> est déjà un résultat d’analyse.
			</>
		),
	},
	{
		id: "runOnly",
		param: <code>runOnly</code>,
		type: "objet, chaîne ou string[] (facultatif)",
		meaning: (
			<>
				Transmis tel quel comme <code>runOnly</code> de l’analyse : une cible WCAG (
				<code>{"{ wcag: { version: '2.2', level: 'AA' } }"}</code>), <code>bestPractices</code>,
				des identifiants de règles ou des tags. Voir{" "}
				<a href="#choosing-a-wcag-target">Choisir une cible WCAG</a>. Ignoré lorsque{" "}
				<code>received</code> est déjà un résultat d’analyse.
			</>
		),
	},
	{
		id: "options",
		param: <code>options</code>,
		type: "objet (facultatif)",
		meaning: (
			<>
				<code>{"{ failOnSeverity, leanFail, wcagOnly, howToCheck }"}</code> : voir{" "}
				<a href="#failing-only-on-serious-problems">N’échouer que sur les problèmes graves</a> et{" "}
				<a href="#questions-that-likely-fail">Questions en échec probable</a>. Chacune remplace la
				valeur par défaut fixée par <code>configureA11yMatchers()</code>.
			</>
		),
	},
];

export function TestMatchersUsageContent() {
	return (
		<>
			<p>
				Pour les tests unitaires et de composants : vérifiez l’accessibilité directement dans une
				suite Jest ou Vitest, sur le DOM dont le test dispose déjà, plutôt que de piloter un
				navigateur réel ou headless. Si vous testez plutôt des pages entièrement rendues, voir{" "}
				<a href="/getting-started/">les bindings pilotant un navigateur</a>.
			</p>
			<p>
				<a href="https://github.com/SureA11y/test-matchers"><code>@surea11y/test-matchers</code></a>{" "}
				est un unique matcher, <code>toHaveNoA11yViolations()</code>,
				qui se branche tel quel sur le <code>expect.extend()</code> de l’un ou l’autre framework :
				il ne contient aucun code propre à un framework. Il analyse l’environnement basé sur jsdom
				dans lequel votre test tourne déjà ; il ne dépend pas lui-même de <code>jsdom</code> et
				n’en met pas en place pour vous. Le moteur de surea11y est synchrone, donc ce matcher
				l’est aussi : pas de <code>await</code>, et donc pas de risque d’en oublier un et de voir
				le test passer en silence sur une promesse résolue.
			</p>
			<CodeBlock lines={[{ text: "npm install --save-dev @surea11y/core @surea11y/test-matchers", command: true }]} />
			<p>
				<code>@surea11y/core</code> est le moteur qu’exécute le matcher ; installez-le avec
				le matcher, comme ci-dessus. Pour vérifier du HTML compilé depuis le terminal ou une étape de CI,
				hors d’un lanceur de tests, voir la <a href="/getting-started/cli/">CLI</a>.
			</p>

			<h2>Mise en place</h2>
			<p>
				Votre environnement de test doit déjà être basé sur jsdom : ce matcher analyse le{" "}
				<code>document</code>/<code>window</code> qu’il fournit. Enregistrez le matcher une seule
				fois, dans le fichier de setup que votre lanceur de tests charge déjà :
			</p>
			<h3>Jest</h3>
			<CodeBlock
				lang="js"
				lines={[
					"// jest.setup.js",
					"expect.extend({",
					"  toHaveNoA11yViolations: require('@surea11y/test-matchers').toHaveNoA11yViolations",
					"});",
					"",
					"// jest.config.js",
					"module.exports = {",
					"  testEnvironment: 'jsdom',   // or the explicit jest-environment-jsdom package, depending on your Jest version",
					"  setupFilesAfterEnv: ['./jest.setup.js']",
					"};",
				]}
			/>
			<h3>Vitest</h3>
			<CodeBlock
				lang="js"
				lines={[
					"// vitest.setup.js",
					"import { expect } from 'vitest';",
					"import { toHaveNoA11yViolations } from '@surea11y/test-matchers';",
					"",
					"expect.extend({ toHaveNoA11yViolations });",
					"",
					"// vitest.config.js",
					"export default {",
					"  test: {",
					"    environment: 'jsdom',   // Vitest doesn't bundle jsdom -- install it as a devDependency too",
					"    setupFiles: ['./vitest.setup.js']",
					"  }",
					"};",
				]}
			/>
			<p>
				Le <code>.d.ts</code> fourni étend à la fois l’interface globale <code>jest.Matchers</code>{" "}
				de Jest et les interfaces <code>@vitest/expect</code> de Vitest, sans qu’un import de{" "}
				<code>@types/jest</code> ou de <code>vitest</code> soit nécessaire pour le livrer : quel
				que soit le framework réellement installé, seule l’extension correspondante s’applique.
			</p>

			<h2>Utilisation</h2>
			<p>Fonctionne sur un simple nœud DOM :</p>
			<CodeBlock
				lang="js"
				lines={[
					"test('no accessibility violations', () => {",
					"  document.body.innerHTML = '<img src=\"logo.png\">';",
					"",
					"  expect(document.body).toHaveNoA11yViolations(); // fails: missing alt",
					"});",
				]}
			/>
			<p>
				… ou sur n’importe quel <code>container</code> de testing-library (celui de <span lang="en">React Testing
				Library</span>, le <code>wrapper.element</code> de <span lang="en">Vue Test Utils</span>, ceux d’<span lang="en">Angular Testing Library</span>{" "}
				et de <span lang="en">Svelte Testing Library</span>), puisque tous exposent un élément DOM rendu de la même façon :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { render } = require('@testing-library/react');",
					"",
					"test('MyComponent has no accessibility violations', () => {",
					"  const { container } = render(<MyComponent />);",
					"",
					"  expect(container).toHaveNoA11yViolations();",
					"});",
				]}
			/>
			<p>
				Côté lanceur de tests aussi, rien ne dépend du framework : une fois le matcher enregistré,
				les extraits ci-dessus sont identiques sous Jest et sous Vitest.
			</p>

			<h3>Vérifier avec <code>.not</code></h3>
			<CodeBlock
				lang="js"
				lines={[
					"test('a page with a violation fails the assertion', () => {",
					"  document.body.innerHTML = '<main><img src=\"logo.png\"></main>';",
					"",
					"  expect(document.body).not.toHaveNoA11yViolations();",
					"});",
				]}
			/>

			<h3>Réutiliser une analyse pour plusieurs assertions</h3>
			<p>
				Si vous calculez déjà vous-même un résultat d’analyse surea11y (pour vérifier des règles
				précises dans plusieurs blocs <code>it()</code> sans relancer l’analyse à chaque fois),
				passez directement l’objet résultat au lieu d’un nœud DOM :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { runDomRulesInPage } = require('@surea11y/core');",
					"",
					"const result = runDomRulesInPage(null, '#main', {}, null);",
					"expect(result).toHaveNoA11yViolations();",
				]}
			/>

			<h2>Filtrer et configurer les analyses</h2>
			<p>
				Le deuxième argument accepte tout ce qu’accepte <code>@surea11y/core</code> ; voir{" "}
				<a href="/configuration/engine-options/">Options du moteur</a> pour l’ensemble des options. Quelques cas courants :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// Only run rules relevant to WCAG 2.0 A",
					"expect(container).toHaveNoA11yViolations({ tags: { include: 'wcag2a' } });",
					"",
					"// Skip a rule you've decided not to enforce yet",
					"expect(container).toHaveNoA11yViolations({ rules: { exclude: 'target-size-minimum' } });",
					"",
					"// Ignore a third-party widget you don't control",
					"expect(container).toHaveNoA11yViolations({ excludeSelectors: ['.intercom-launcher'] });",
					"",
					"// EN 301 549 V4.1.1 (WCAG 2.2 A and AA); 'en301549-v3.2.1' for V3.2.1 (WCAG 2.1 A and AA)",
					"expect(container).toHaveNoA11yViolations({ profile: 'en301549-v4.1.1' });",
				]}
			/>

			<h3 id="choosing-a-wcag-target">Choisir une cible WCAG (<code>runOnly</code>)</h3>
			<p>
				Le troisième argument est le <code>runOnly</code> de l’analyse, transmis tel quel au
				moteur. <code>runOnly.wcag</code> sélectionne par cible de conformité :{" "}
				<code>{"{ wcag: { version: '2.2', level: 'AA' } }"}</code> exécute les règles des critères
				de niveau A et AA de WCAG 2.2, selon le niveau de chaque critère dans cette version.{" "}
				<code>bestPractices: true</code> ajoute les règles qui ne nomment aucun critère WCAG, comme{" "}
				<code>region</code> et <code>heading-order</code> ; seule, elle n’exécute que celles-ci,
				et à côté d’<code>engineOptions.profile</code>, elle les ajoute aux règles du profil.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.2 A and AA",
					"expect(container).toHaveNoA11yViolations({}, { wcag: { version: '2.2', level: 'AA' } });",
					"",
					"// The same, and the best practices",
					"expect(container).toHaveNoA11yViolations({}, { wcag: { version: '2.2', level: 'AA' }, bestPractices: true });",
				]}
			/>
			<p>
				<code>runOnly</code> accepte aussi des identifiants de règles et des tags (
				<code>includeRuleIds</code>, <code>tags</code>, <code>excludeRuleIds</code>, ...), qui
				s’ajoutent aux règles d’une cible ; les exclusions s’appliquent ensuite. Un{" "}
				<code>runOnly</code> qui sélectionne quoi que ce soit remplace entièrement la sélection de{" "}
				<code>engineOptions.rules</code>/<code>.tags</code> : donnez une sélection d’une façon ou
				de l’autre, pas les deux. Passez <code>{"{}"}</code> ou <code>null</code> comme{" "}
				<code>engineOptions</code> quand vous n’avez besoin que de <code>runOnly</code>.
				Les identifiants de règle sont lus sans tenir compte de la casse
				(<code>'IMG-ALT-PRESENT'</code>).
			</p>
			<p>
				Une cible implique son niveau. Un test qui nomme des règles ou des étiquettes
				peut en fixer un avec <code>engineOptions.wcagLevel</code>{" "}
				(<code>@surea11y/core</code> 1.12.0 et ultérieur) : le niveau des critères que
				l’analyse rapporte, sans changer les règles exécutées.{" "}
				<code>contrast-computable</code> vérifie le 1.4.3 (AA) et le 1.4.6 (AAA), donc
				l’analyse ci-dessous ne rapporte que le 1.4.3. L’assertion dépend des résultats{" "}
				<code>fail</code> : cela change donc les critères du résultat, pas ce qui fait
				échouer le test.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"expect(container).toHaveNoA11yViolations({ wcagLevel: 'AA' }, { includeRuleIds: ['contrast-computable'] });",
				]}
			/>

			<h2 id="packs">Analyser avec des packs</h2>
			<p>
				Un <a href="/configuration/packs/">pack</a> apporte des règles, une norme ou une liste de
				contrôle, avec leurs profils et leurs messages, depuis un paquet qui lui est propre. Le
				matcher analyse dans Node : un pack est donc passé sous forme d’objet, dans{" "}
				<code>engineOptions.packs</code>, et son profil est choisi avec{" "}
				<code>engineOptions.profile</code> :
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
					"",
					"// A pack's checklist profile, and the best practices",
					"expect(container).toHaveNoA11yViolations(policy, { bestPractices: true });",
				]}
			/>
			<p>
				Les règles propres à un pack apparaissent dans le résultat comme celles de core, avec des
				identifiants qui commencent par son espace de noms (<code>acme-no-autoplay</code>). Gardez
				les objets pack en un seul endroit (un fichier de setup ou un module) : core prépare un
				moteur pour chaque ensemble d’objets pack et le conserve pour la prochaine analyse avec les
				mêmes. Un pack que core ne peut pas exécuter (sa plage <code>core</code> exclut la version
				de core installée, il n’est pas valide, ou son espace de noms entre en conflit avec celui
				d’un autre pack) est listé dans le <code>skippedPacks</code> du résultat, et l’assertion
				échoue à cause de lui au lieu de réussir sans que les règles du pack se soient jamais
				exécutées.
			</p>

			<h2>API</h2>
			<DataTable
				label="Paramètres du matcher"
				rowKey="id"
				columns={[
					{ key: "param", label: "Paramètre", width: "18%" },
					{ key: "type", label: "Type", width: "26%" },
					{ key: "meaning", label: "Signification", wrap: true },
				]}
				rows={apiRows}
			/>
			<p>
				Le deuxième argument peut aussi être un seul objet qui les regroupe tous,{" "}
				<code>{"{ engineOptions, runOnly, failOnSeverity, leanFail, wcagOnly, howToCheck }"}</code> :{" "}
				<code>{"toHaveNoA11yViolations({ leanFail: true })"}</code>. Il est lu ainsi dès qu’il a
				l’une de ces clés, dont aucune n’est une option du moteur ; un objet qui les mélange avec
				des options du moteur lève une <code>TypeError</code>.
			</p>
			<p>
				Renvoie la forme <code>{"{ pass, message }"}</code> qu’attend le{" "}
				<code>expect.extend()</code> des deux frameworks — vous ne l’appelez jamais directement ;
				il est branché une fois via <code>expect.extend()</code>, comme indiqué dans la
				configuration ci-dessus. Le paquet exporte aussi <code>configureA11yMatchers(options)</code>,
				pour des valeurs par défaut dans toute la suite ; <code>installInternalsHook(win?)</code>,
				pour les <a href="#web-components">composants web</a> ; et{" "}
				<code>installListenerHook(win?)</code>, <code>installLiveRegionHook(win?)</code> et le
				matcher <code>toHaveAnnounced()</code>, pour les{" "}
				<a href="#listener-and-live-region-hooks">gestionnaires de clic et régions live</a>.
			</p>

			<h2>Ce qu’il vérifie, et ce qu’il ne vérifie pas</h2>
			<p>
				<strong>Seuls les échecs font échouer l’assertion</strong>, conformément à la convention de
				tous les autres bindings surea11y selon laquelle les résultats <code>cantTell</code> sont
				indicatifs, pas des échecs. Chaque constat est lu selon son propre résultat, pas celui de
				sa règle : une règle qui échoue sur un élément peut poser une question sur un autre, et
				cette question ne compte pas comme un échec. Un lien vague comme{" "}
				<code>&lt;a href="/pricing"&gt;Click here&lt;/a&gt;</code> est <code>cantTell</code>, pas{" "}
				<code>fail</code>, il ne fait donc pas échouer à lui seul un test qui réussit, sauf si vous
				le demandez avec <code>leanFail</code> (<a href="#questions-that-likely-fail">plus bas</a>)
				— mais quand une assertion échoue <em>bel et bien</em> pour d’autres raisons, les questions
				sont listées après les échecs, pour rester visibles. Voir{" "}
				<a href="/help/known-limitations/">Limites connues</a> pour ce que ce moteur
				n’automatisera pas du tout.
			</p>
			<p>
				<strong>Une analyse qui n’a pas pu vérifier ce qu’on lui demandait échoue aussi</strong>,
				au lieu de réussir sur rien : un élément qui n’est pas dans le document où s’exécute
				l’analyse (détaché, ou issu d’un autre document), une règle personnalisée qui ne s’est pas
				exécutée (listée dans <code>skippedCustomRules</code>), ou un pack qui ne s’est pas exécuté
				(listé dans <code>skippedPacks</code>). Le message nomme chacun d’eux avec la raison.
				Une règle personnalisée que le test exclut lui-même n’est pas une lacune, et ne
				le fait pas échouer.
			</p>
			<p>
				<strong>Un appel sans sélection exécute aussi les bonnes pratiques.</strong>{" "}
				Depuis <code>@surea11y/core</code> 1.12, l’une d’elles,{" "}
				<code>empty-heading</code>, met en échec un titre sans nom accessible, là où
				elle posait la question, donc un composant qui rend{" "}
				<code>&lt;h2&gt;&lt;/h2&gt;</code> (souvent une prop de titre laissée vide dans
				le test) fait échouer un appel par défaut. Un lecteur d’écran annonce ce titre
				sans rien dedans : donnez au test un vrai contenu ou corrigez le composant. Un
				appel avec une cible WCAG, qui laisse de côté les bonnes pratiques, ne l’exécute
				pas.
			</p>
			<p>
				L’analyse elle-même peut lever une erreur, et le test échoue alors avec l’erreur du
				moteur, qui porte un <code>code</code> : <code>INVALID_RUN_ONLY</code> (une liste de
				règles ou de tags dont aucune valeur ne désigne une règle ou un tag, ou une cible{" "}
				<code>runOnly.wcag</code> qui n’en est pas une), <code>INVALID_ENGINE_OPTIONS</code> (avec{" "}
				<code>strictOptions: true</code>, une option que le moteur ne lit pas ou une valeur qu’il
				ne peut pas utiliser), ou <code>PAGE_BUILTINS_BROKEN</code> (le code du test ou de la page
				a cassé un objet natif JavaScript sur lequel le moteur s’appuie).
			</p>
			<p>
				<strong>Limiter l’analyse à un élément ne rapporte que ce qu’il contient</strong> : un échec
				ailleurs dans la page ne fait jamais échouer une assertion limitée à un{" "}
				<code>container</code>. En interne, l’élément analysé reçoit temporairement un attribut
				unique et est analysé via ce sélecteur, de façon invisible pour votre test.
			</p>
			<p>
				<strong>Quelques règles vérifient une propriété de la page entière</strong>, et non d’un
				sous-arbre précis : <code>page-title-present</code>, <code>html-lang-attr-present</code> et
				quelques autres vérifient directement <code>document.title</code>/<code>document.documentElement</code>,
				car se demander si <em>la page</em> a un titre n’a pas de sens pour un fragment de composant
				quelconque. Si vous passez un <code>Element</code> (un <code>container</code> de
				testing-library, <code>document.body</code>), ces règles renvoient <code>notApplicable</code>{" "}
				plutôt que <code>fail</code>, donc un <code>&lt;title&gt;</code> absent ne fait jamais
				échouer un test de composant ; si vous passez <code>document</code> lui-même, elles sont
				réellement évaluées. Si vous analysez directement <code>document</code>, définissez{" "}
				<code>document.title</code> et le <code>lang</code> de{" "}
				<code>document.documentElement</code> une seule fois dans votre fichier de setup plutôt que
				dans chaque test.
			</p>

			<h2 id="failing-only-on-serious-problems">N’échouer que sur les problèmes graves</h2>
			<p>
				Chaque résultat de règle a une gravité : <code>critical</code>, <code>serious</code>,{" "}
				<code>moderate</code> ou <code>minor</code>. Pour commencer par ne faire échouer les tests
				que sur les problèmes graves pendant que les autres restent signalés, fixez un niveau pour
				toute la suite dans le fichier de configuration avec <code>configureA11yMatchers()</code>,
				ou pour une assertion dans ses options, qui remplacent la valeur par défaut (
				<code>failOnSeverity: null</code> la désactive à cet endroit) :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// jest.setup.js (vitest.setup.js: the same, with import)",
					"const { toHaveNoA11yViolations, configureA11yMatchers } = require('@surea11y/test-matchers');",
					"",
					"expect.extend({ toHaveNoA11yViolations });",
					"configureA11yMatchers({ failOnSeverity: 'serious' });",
					"",
					"// one assertion",
					"expect(container).toHaveNoA11yViolations({ failOnSeverity: 'critical' });",
				]}
			/>
			<p>
				Les règles en échec sous le niveau ne font pas échouer le test, mais quand il échoue, le
				message liste chaque échec et marque ceux qui sont sous le niveau. C’est le même seuil que{" "}
				<code>surea11y scan --fail-on-severity</code>. Une analyse qui a laissé quelque chose de
				côté (une portée qui ne correspond à rien, une règle personnalisée ou un pack qui ne s’est
				pas exécuté) fait échouer l’assertion quel que soit le niveau.
			</p>

			<h2 id="questions-that-likely-fail">Questions en échec probable</h2>
			<p>
				Un <code>cantTell</code> est une question pour une personne. Depuis{" "}
				<code>@surea11y/core</code> 1.14, une question peut pencher : quand les éléments de la page
				vont dans un sens, elle dit lequel (<code>fail</code> ou <code>pass</code>) et pourquoi, et
				chaque question d’une règle de core porte les étapes pour y répondre (
				<code>howToCheck</code>). Un message d’échec liste les questions après les échecs : d’abord
				celles en échec probable, puis celles en réussite probable, chacune avec sa raison, puis
				les questions ouvertes, par règle. <code>{"{ howToCheck: true }"}</code> liste chaque
				question en entier, avec ses étapes.
			</p>
			<p>
				Par défaut, une question ne fait jamais échouer le test. <code>{"{ leanFail: true }"}</code>{" "}
				le fait aussi échouer sur les questions en échec probable, et <code>wcagOnly: true</code>{" "}
				laisse de côté celles des règles de bonnes pratiques :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"test('the settings page has no failures or likely failures', () => {",
					"  const { container } = render(<Settings />); // an <h1>, then an <h3>",
					"  expect(container).toHaveNoA11yViolations(); // passes: heading-order is a question",
					"  expect(container).toHaveNoA11yViolations({ leanFail: true }); // fails: it leans fail",
					"  expect(container).toHaveNoA11yViolations({ leanFail: true, wcagOnly: true }); // passes: heading-order is a best practice",
					"});",
				]}
			/>
			<p>
				C’est facultatif, car une tendance est un indice, pas une preuve : qu’un constat penche, et
				de quel côté, peut changer dans une version mineure de core.{" "}
				<code>{"configureA11yMatchers({ leanFail: true })"}</code> l’active pour toute la suite.
			</p>

			<h2 id="web-components">Composants web</h2>
			<p>
				Beaucoup de composants web gardent leurs <code>ElementInternals</code> dans un
				champ privé, et s’en servent pour se nommer, fixer leurs états ou se donner un
				rôle. Aucun script ne peut les relire, donc par défaut l’analyse pose la
				question pour un tel élément (<code>cantTell</code>) au lieu de le juger : le
				test n’échoue pas, mais rien n’est vérifié non plus, et un rôle donné ainsi
				n’est pas vu du tout.
			</p>
			<p>
				<code>installInternalsHook(win?)</code> permet à l’analyse de les lire.
				Appelez-le une fois dans le fichier de setup, avant la définition de tout
				composant, pour qu’il voie chaque appel à <code>attachInternals()</code> ;{" "}
				<code>win</code> vaut par défaut le <code>window</code> global :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// jest.setup.js",
					"const {",
					"  toHaveNoA11yViolations,",
					"  installInternalsHook",
					"} = require('@surea11y/test-matchers');",
					"",
					"installInternalsHook();",
					"expect.extend({ toHaveNoA11yViolations });",
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"// vitest.setup.js",
					"import { expect } from 'vitest';",
					"import {",
					"  toHaveNoA11yViolations,",
					"  installInternalsHook",
					"} from '@surea11y/test-matchers';",
					"",
					"installInternalsHook();",
					"expect.extend({ toHaveNoA11yViolations });",
				]}
			/>
			<p>
				Avec lui, un composant qui se nomme par ses <code>ElementInternals</code> passe,
				un composant qui les attache sans fixer de nom échoue comme tout contrôle sans
				nom, et un composant qui n’est un <code>switch</code> que par eux est vérifié
				comme tel. Le champ <code>engine.environment.internalsHook</code> d’un résultat
				indique si le hook était là. Il enveloppe{" "}
				<code>HTMLElement.prototype.attachInternals</code> dans la fenêtre du test, ce
				qui est sans danger dans un test, et c’est pourquoi il est facultatif. Une
				limite : <code>jest-environment-jsdom</code> 30 embarque jsdom 26, où un composant qui
				fixe une propriété ARIA sur ses <code>ElementInternals</code> lève une erreur, avec ou
				sans hook (Vitest avec jsdom 29 le gère). Depuis <code>@surea11y/core</code> 1.14, le hook
				est aussi enregistré comme <code>'early'</code> sous Vitest, si bien qu’un composant qui
				n’a jamais attaché d’<code>ElementInternals</code> n’y est plus une question. Le{" "}
				<a href="https://github.com/SureA11y/test-matchers#web-components-names-set-through-elementinternals">README
				du paquet</a> donne les détails.
			</p>

			<h2 id="listener-and-live-region-hooks">Gestionnaires de clic et régions live</h2>
			<p>
				Deux autres hooks facultatifs, depuis <code>@surea11y/core</code> 1.14, s’installent de la
				même façon, dans le fichier de configuration, avant que votre code ne s’exécute.{" "}
				<code>installListenerHook()</code> enregistre les écouteurs de clic, de clavier, de focus
				et de souris ajoutés à partir de là, pour que les règles de clavier les jugent : un{" "}
				<code>&lt;div role="button"&gt;</code> qui n’écoute que <code>click</code> échoue (
				<code>CLICK_HANDLER_NO_KEY_LISTENER</code>), et réussit dès qu’il écoute aussi{" "}
				<code>keydown</code>. <code>installLiveRegionHook()</code> enregistre ce que reçoivent les
				régions live de la page : l’analyse pose une question sur une région ajoutée avec son texte
				déjà dedans, que les lecteurs d’écran n’annoncent souvent pas, et{" "}
				<code>toHaveAnnounced()</code> vérifie qu’une action a bien informé l’utilisateur.
				Installez seulement ceux que vous voulez ; chacun est indépendant :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// jest.setup.js (vitest.setup.js: the same, with import)",
					"const {",
					"  toHaveNoA11yViolations,",
					"  toHaveAnnounced,",
					"  installInternalsHook,",
					"  installListenerHook,",
					"  installLiveRegionHook",
					"} = require('@surea11y/test-matchers');",
					"",
					"installInternalsHook();",
					"installListenerHook();",
					"installLiveRegionHook();",
					"expect.extend({",
					"  toHaveNoA11yViolations,",
					"  toHaveAnnounced",
					"});",
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"test('saving says so', async () => {",
					"  const user = userEvent.setup();",
					"  const { container } = render(<SaveBar />);",
					"  await user.click(screen.getByRole('button', { name: 'Save' }));",
					"",
					"  expect(container).toHaveAnnounced('Saved');",
					"  expect(window).not.toHaveAnnounced(/error/i);",
					"});",
				]}
			/>
			<p>
				Une chaîne doit être le texte entier ; une RegExp peut n’en correspondre qu’à une partie.
				Sur un élément, seules comptent les régions live qu’il est ou qu’il contient ; sur{" "}
				<code>window</code> ou <code>document</code>, toutes les annonces depuis l’installation du
				hook. C’est ce que la page a mis à disposition pour être annoncé, pas ce qu’un lecteur
				d’écran a dit, et <code>toHaveAnnounced()</code> lève une erreur sans le hook. Deux choses
				à savoir : React ajoute ses écouteurs à la racine dans laquelle il effectue le rendu, pas à
				chaque élément, si bien que sur un composant React l’analyse voit les écouteurs de la racine
				et juge ses boutons d’après leur balisage, comme sans le hook ; et le hook de régions live
				lit les changements par lots, donc effectuez le rendu, puis agissez, avec un{" "}
				<code>await</code> entre les deux (<code>await user.click()</code>), comme le fait un vrai
				utilisateur. Le{" "}
				<a href="https://github.com/SureA11y/test-matchers#click-handlers-added-from-script-the-listener-hook">
					README du paquet
				</a>{" "}
				donne les détails.
			</p>

			<h2>Messages d’échec</h2>
			<p>
				Le message liste chaque occurrence en échec, pas seulement chaque règle — une règle peut
				signaler plusieurs éléments —, avec l’identifiant de la règle, sa gravité, un résumé
				lisible, le sélecteur de l’élément en échec et une piste de correction quand il y en a une.
				Il nomme la version de <code>@surea11y/core</code> qui a produit le résultat, à citer dans
				un rapport de bug, puis liste les questions, qui ne comptent pas comme des échecs. Avec un
				saut de niveau de titre à côté de l’image :
			</p>
			<CodeBlock
				lines={[
					"expected no accessibility violations, but found 1:",
					"",
					"1) img-alt-present (serious): This <img> has no alt attribute.",
					"   at body > main > img",
					"   Add an alt attribute that says what the image shows, or alt=\"\" if the image is purely decorative.",
					"",
					"Scanned with @surea11y/core 1.14.0.",
					"",
					"2 findings need manual review (cantTell, not counted as failures):",
					"",
					"1) heading-order (minor, likely fails): This heading jumps from level 1 to level 3, skipping a level.",
					"   at body > main > h3",
					"   Go down one level at a time, so an <h2> is followed by an <h3> rather than an <h4>, and the outline of the page stays easy to follow.",
					"   Why it likely fails: The heading skips a level after the one before it.",
					"",
					"Open questions, which only a person can answer: manual-review.",
				]}
			/>
			<p>
				Avant la ligne de version, le message peut contenir des notes sur la façon dont l’analyse
				s’est déroulée : quand l’analyse a posé des questions sur des éléments personnalisés
				qu’elle aurait pu lire avec le <a href="#web-components">hook d’internals</a>, ou a jugé des
				constats que le{" "}
				<a href="#listener-and-live-region-hooks">hook d’écouteurs ou de régions live</a> aurait
				tranchés, une ligne indique combien et invite à l’installer. Avec{" "}
				<code>{"{ leanFail: true }"}</code>, les questions en échec probable remontent dans les
				échecs, et l’en-tête compte les deux (<code>found 1 failure and 1 likely failure:</code>).
			</p>
			<p>Un pack qui ne s’est pas exécuté est nommé avec la raison :</p>
			<CodeBlock
				lines={[
					"expected no accessibility violations, but the scan left out what it was asked to check:",
					"",
					"No accessibility violations found in what was scanned.",
					"",
					"Pack \"@acme/a11y-policy\" did not run: it supports core ^2.0.0, and this is core 1.14.0.",
					"",
					"Scanned with @surea11y/core 1.14.0.",
				]}
			/>

			<p>
				Des exemples exécutables, côte à côte, pour les deux frameworks :{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/basic.test.js">Jest</a>{" "}
				et{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/basic.vitest.test.js">
					Vitest
				</a>
				, et la même chose avec un pack :{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/pack.test.js">Jest</a>{" "}
				et{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/pack.vitest.test.js">
					Vitest
				</a>
				, et un petit composant vérifié avec les hooks d’écouteurs et de régions live,{" "}
				<code>toHaveAnnounced()</code> et <code>leanFail</code> :{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/hooks.test.js">Jest</a>{" "}
				et{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/hooks.vitest.test.js">
					Vitest
				</a>
				. Pour l’ensemble des <code>engineOptions</code> (locale, modes de contraste, shadow DOM,
				règles personnalisées, combinaisons de tags de version WCAG), voir{" "}
				<a href={`${core}/docs/ENGINE_OPTIONS.md`}><code>ENGINE_OPTIONS.md</code></a> : ce paquet
				transmet tout ce que vous lui passez au lieu de dupliquer cette référence.
			</p>
		</>
	);
}
