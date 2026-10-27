import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";
const cliDocs = "https://github.com/SureA11y/cli/blob/main/docs/CLI.md";

export function CliUsageContent() {
	return (
		<>
			<p>
				Une commande plutôt que du code : pas de framework de test ni de script Node nécessaire,
				idéal pour une étape de pipeline ou une vérification rapide d’un artefact de build.
			</p>

			<h2>Première analyse</h2>
			<CodeBlock
				lines={[
					{ text: "npm install -g @surea11y/cli", command: true },
					{ text: "surea11y scan ./index.html", command: true },
					{ text: "surea11y scan https://example.com/ --wcag 2.2", command: true },
				]}
			/>
			<p>
				Nécessite Node.js <code>^20.19.0 || ^22.13.0 || &gt;=24.0.0</code>. Le résumé nomme la
				version de <code>@surea11y/core</code> qui a exécuté l’analyse :
			</p>
			<CodeBlock
				lines={[
					"$ surea11y scan ./index.html",
					"",
					"surea11y scan: file:///path/to/index.html",
					"  engine: @surea11y/core 1.14.0",
					"  pass: 16   fail: 4   cantTell: 4   notApplicable: 121",
					"",
					"  occurrences by tier: fail: 4   cantTell: 4",
					"  needs review: likely fail: 1   likely pass: 0   needs a person: 3",
					"",
					"FAIL (4 rule(s)):",
					"",
					"  img-alt-present  (serious, 1 fail occurrence(s))",
					"    - html > body > main > img",
					"      This <img> has no alt attribute.",
					"      hint: Add an alt attribute that says what the image shows, or alt=\"\" if",
					"      the image is purely decorative.",
					"",
					"LIKELY FAIL — confirm (1 occurrence(s)):",
					"  - heading-order (minor): html > body > main > h3",
					"    This heading jumps from level 1 to level 3, skipping a level.",
					"    why: The heading skips a level after the one before it.",
					"",
					"cantTell — needs human review (4 rule(s)): heading-order, link-name-quality,",
					"manual-review, page-title-patterns",
					"",
					"criteria (WCAG 2.2):",
					"  fail       1.1.1 Non-text content: text alternatives; 1.4.3 Contrast: minimum;",
					"             1.4.6 Contrast: enhanced; 4.1.2 Name, role, value: accessible name",
					"  cantTell   1.2.1 Audio-only and video-only (prerecorded): transcript; 1.2.2",
					"             Captions (Prerecorded); 1.3.1 Info and Relationships; 1.3.4",
					"             Orientation; 1.3.5 Identify Input Purpose; 1.4.1 Use of Color;",
					"             1.4.2 Audio Control; 1.4.4 Resize Text; 1.4.5 Images of Text;",
					"             1.4.12 Text Spacing; 2.1.1 Keyboard; 2.1.3 Keyboard (No Exception);",
					"             2.2.1 Timing Adjustable; 2.2.2 Pause, Stop, Hide; 2.2.4",
					"             Interruptions; 2.4.1 Bypass Blocks; 2.4.2 Page titled; 2.4.3 Focus",
					"             order; 2.4.4 Link Purpose (In Context); 2.4.6 Headings and Labels;",
					"             2.4.7 Focus visible; 2.4.9 Link Purpose (Link Only); 2.5.8 Target",
					"             size: minimum; 3.1.1 Language of page; 3.1.2 Language of Parts;",
					"             3.2.5 Change on Request; 3.3.1 Error Identification; 3.3.2 Labels",
					"             or Instructions; 3.3.8 Accessible Authentication (Minimum); 4.1.2",
					"             Name, role, value: ARIA validity; 4.1.3 Status Messages",
					"  notApplicable: 2",
					"  A criterion that passes here means the checks that ran found nothing in it,",
					"  not that the page conforms.",
				]}
			/>
			<p>
				La ligne <code>needs review</code> classe les questions selon ce qu’en fait la personne qui
				vérifie : <em lang="en">likely fail</em> (les éléments de la page indiquent un échec, comme
				le saut de niveau de titre de cet exemple), <em lang="en">likely pass</em> et{" "}
				<em lang="en">needs a person</em>. Les échecs probables sont listés avec la raison pour
				laquelle ils penchent de ce côté, et chaque question, dans <code>--json</code> et dans les
				rapports, porte les étapes pour y répondre (<code>howToCheck</code>).
			</p>
			<p>
				Le bloc <code>criteria</code> lit la même analyse par critère WCAG, comme on pose
				généralement la question (« le 1.4.3 échoue-t-il ? ») : <code>fail</code> d’abord, puis{" "}
				<code>cantTell</code>, et un décompte de <code>notApplicable</code>. Depuis{" "}
				<code>@surea11y/core</code> 1.14, aucun critère n’apparaît en <code>pass</code> : un
				critère ne réussit que si ses règles vérifient tout ce qu’il demande, et aucun n’est encore
				recensé comme entièrement vérifié, si bien que, lorsque toutes ses règles réussissent, il
				reste en <code>cantTell</code>, pour qu’une personne vérifie le reste. Le bloc ne change
				jamais le code de sortie, et <code>--compact</code> l’affiche sous forme de décomptes. Sans
				aucune règle en échec, le résumé se termine en précisant que cela ne signifie pas que la
				page est conforme, et nomme ce qu’une personne vérifie encore.
			</p>

			<h2 id="several-pages">Plusieurs pages, ou un sitemap</h2>
			<p>
				Nommez plusieurs pages, listez-les dans un fichier (un chemin ou une URL par ligne, avec des
				commentaires <code>#</code>), ou pointez l’analyse vers un sitemap :
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html ./dist/pricing.html", command: true },
					{ text: "surea11y scan --urls pages.txt", command: true },
					{ text: "surea11y scan --sitemap https://example.com/sitemap.xml   # up to 50 pages; --max-pages to change it", command: true },
				]}
			/>
			<p>
				Chaque page a sa propre section dans le résumé, une dernière ligne compte les pages en
				échec, et l’exécution échoue dès qu’une page échoue. <code>--json</code> affiche un
				tableau, <code>--sarif</code> et <code>--junit</code> écrivent un seul fichier couvrant
				toutes les pages, <code>--html</code> écrit un rapport par page (<code>report.html</code>,{" "}
				<code>report-2.html</code>…), et une baseline retient la page de chaque échec connu. Un
				sitemap peut être une URL ou un fichier local, compressé en gzip ou non, et un index de
				sitemaps est suivi sur un niveau. Une page qui ne peut pas être analysée arrête
				l’exécution avec le code <code>2</code>, en la nommant, avant que rien ne soit écrit.
			</p>

			<h2 id="in-a-real-browser">Dans un vrai navigateur</h2>
			<p>
				Par défaut, la CLI lit du HTML statique. Pour les pages dont le contenu est rendu par leur
				JavaScript, installez Playwright dans votre projet et ajoutez <code>--browser</code> :
				chaque page s’ouvre dans Chromium headless, ses scripts s’exécutent, et l’analyse voit ce
				qui est rendu, avec une vraie mise en page pour les règles qui la mesurent. Le moteur est le
				même <code>@surea11y/core</code>, et toutes les options fonctionnent, y compris les
				rapports, les baselines, les packs et les règles personnalisées.
			</p>
			<CodeBlock
				lines={[
					{ text: "npm install --save-dev playwright", command: true },
					{ text: "npx playwright install chromium", command: true },
					{ text: "surea11y scan https://app.example.com/ https://app.example.com/settings --browser", command: true },
				]}
			/>
			<p>
				Une application qui récupère ses données après le chargement peut faire attendre
				l’analyse, et une page peut être analysée à la largeur d’un téléphone, en mode sombre, ou
				dans toutes les combinaisons de plusieurs valeurs :
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan https://app.example.com/orders --browser --wait-for \"#orders-table\"", command: true },
					{ text: "surea11y scan https://example.com/ --browser --width 320 --color-scheme dark", command: true },
					{ text: "surea11y scan https://example.com/ --browser --width 1280,320 --color-scheme light,dark", command: true },
				]}
			/>
			<p>
				<code>--wait-for</code> attend jusqu’à 30 secondes (<code>--wait-timeout</code> change
				ce délai) et arrête l’exécution avec le code <code>2</code> si l’élément n’apparaît
				jamais. Plusieurs largeurs ou schémas de couleurs chargent la page une fois et fusionnent
				les analyses en un seul résultat par page : le pire résultat de chaque règle, et chaque
				constat une seule fois, avec les combinaisons où il a été vu (<code>seen in:</code>).
			</p>
			<p>
				Avant le chargement de chaque page, la CLI installe les hooks d’internals et d’écouteurs de
				core, si bien que l’analyse juge les noms que les composants web se donnent via{" "}
				<code>ElementInternals</code> et les gestionnaires de clic ajoutés depuis un script : un{" "}
				<code>role="button"</code> qu’Entrée et Espace n’atteignent jamais échoue.{" "}
				<code>--live-regions</code> ajoute le hook de régions live, si bien qu’un message d’état
				ajouté avec son texte déjà dedans, que les lecteurs d’écran n’annoncent souvent pas, fait
				l’objet d’une question ; <code>--no-hooks</code> laisse de côté les deux premiers. Le
				résumé nomme le viewport, le schéma de couleurs et les hooks de chaque analyse. La CLI ne
				clique pas, ne saisit rien et ne se connecte pas : pour un contenu qui n’apparaît qu’après
				cela, pilotez le navigateur avec l’un des bindings. Les frames de la page ne sont pas
				encore analysés.
			</p>

			<h2 id="choosing-what-runs">Choisir ce qui s’exécute</h2>
			<p>
				<code>--wcag</code> sélectionne les règles d’une cible de conformité WCAG, selon le niveau
				de chaque critère dans cette version ; <code>--wcag-level</code> fixe son niveau (
				<code>AA</code> sauf indication contraire). <code>--best-practices</code> ajoute les règles
				qui ne testent aucun critère WCAG, comme <code>region</code> et{" "}
				<code>heading-order</code> ; seule, elle n’exécute que celles-ci. <code>--profile</code>{" "}
				exécute un profil de conformité, comme <code>en301549-v4.1.1</code> ou celui d’un pack.
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --wcag 2.2                    # WCAG 2.2, Level A and AA", command: true },
					{ text: "surea11y scan ./dist/index.html --wcag 2.1 --wcag-level A     # WCAG 2.1, Level A", command: true },
					{ text: "surea11y scan ./dist/index.html --wcag 2.2 --best-practices   # and the best practices", command: true },
				]}
			/>
			<p>
				4.1.1 Analyse syntaxique, que WCAG 2.2 a retiré, fait partie d’une cible <code>2.1</code>{" "}
				et non d’une cible <code>2.2</code>. <code>--rules</code> et <code>--tags</code> s’ajoutent
				aux règles d’une cible, et <code>--exclude-rules</code> s’applique ensuite. À côté de{" "}
				<code>--profile</code>, <code>--best-practices</code> ajoute ses règles et le profil
				s’applique toujours ; <code>--wcag</code>, <code>--rules</code> et <code>--tags</code>{" "}
				choisissent les règles à la place d’un profil : <code>--profile</code> combiné à l’un
				d’eux se termine donc avec le code <code>2</code>. Ces flags correspondent à{" "}
				<code>runOnly.wcag</code>, <code>runOnly.bestPractices</code> et{" "}
				<code>engineOptions.profile</code> (voir{" "}
				<a href="/configuration/engine-options/#selecting-which-rules-run">Options du moteur</a>).
			</p>

			<h2 id="naming-checks">Nommer vous-même les vérifications</h2>
			<p>
				Quand les deux sont donnés, <code>--rules</code> et <code>--tags</code>{" "}
				exécutent les règles qui correspondent aux deux. Pour dire « ce domaine, plus
				ces vérifications », passez <code>--include-mode or</code>, qui exécute les
				règles qui correspondent à l’un ou à l’autre. Sans lui, l’analyse ci-dessous
				n’exécute aucune règle, puisque <code>contrast-computable</code> ne porte pas
				l’étiquette <code>forms</code>, et se termine avec <code>2</code> plutôt que de
				réussir sans rien vérifier.
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/form.html --tags forms --rules contrast-computable --include-mode or", command: true },
				]}
			/>
			<p>
				Une analyse qui nomme des vérifications rapporte les critères WCAG auxquels
				elles appartiennent, à tous les niveaux. <code>contrast-computable</code>{" "}
				vérifie le 1.4.3 (AA) et le 1.4.6 (AAA), si bien qu’un site conforme au niveau
				AA peut afficher en échec un critère AAA qu’il n’a jamais visé. Sans{" "}
				<code>--wcag</code>, <code>--wcag-level</code> fixe le niveau des critères
				rapportés, sans changer les règles exécutées :
			</p>
			<CodeBlock
				lines={[
					"$ surea11y scan ./index.html --rules contrast-computable --wcag-level AA",
					"",
					"surea11y scan: file:///path/to/index.html",
					"  engine: @surea11y/core 1.14.0",
					"  WCAG level reported: AA",
					"  pass: 1   fail: 0   cantTell: 0   notApplicable: 0",
					"",
					"  occurrences by tier: fail: 0   cantTell: 0",
					"",
					"criteria (WCAG 2.2 AA):",
					"  cantTell   1.4.3 Contrast: minimum (partly checked: 1 of 2 checks not selected)",
					"  A criterion that passes here means the checks that ran found nothing in it,",
					"  not that the page conforms.",
					"",
					"No rule failed, which is not a claim that the page conforms: the automated rules",
					"found nothing definite. A person still checks the cantTell findings, keyboard",
					"use, how a screen reader reads the page, and the content itself.",
				]}
			/>
			<p>
				Le 1.4.3 est <em>vérifié en partie</em> : son autre vérification,{" "}
				<code>contrast-minimum</code>, n’a pas été sélectionnée, donc son résultat ne
				couvre que la vérification exécutée, et comme aucune règle n’a échoué, le résumé se
				termine en rappelant que cela ne signifie pas que la page est conforme. Les identifiants de règle et les niveaux
				sont lus sans tenir compte de la casse (<code>--rules IMG-ALT-PRESENT</code>,{" "}
				<code>--wcag-level aa</code>). <code>--include-mode</code> correspond à{" "}
				<code>engineOptions.includeMode</code>, et <code>--wcag-level</code> sans{" "}
				<code>--wcag</code> à <code>engineOptions.wcagLevel</code>.
			</p>

			<h2 id="packs">Packs</h2>
			<p>
				<code>--pack</code> charge un <a href="/configuration/packs/">pack</a> (des règles, une
				norme ou une liste de contrôle, avec leurs profils) par nom de paquet, résolu depuis le
				projet du répertoire de travail, ou par chemin ; <code>--profile</code> exécute l’un de
				ses profils. Répétez <code>--pack</code> pour analyser avec plusieurs packs.
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --pack @acme/a11y-policy --profile acme-web-2026", command: true },
					{ text: "surea11y scan ./dist/index.html --pack ./acme-policy-pack.js --profile acme-web-2026", command: true },
				]}
			/>
			<p>
				Le résumé nomme le profil et les packs qui se sont exécutés, et <code>--json</code> les
				contient sous <code>engine.profile</code> et <code>engine.packs</code>. Un pack
				introuvable ou impossible à charger, ou que le moteur ignore, termine la commande avec le
				code <code>2</code> sans écrire de rapport, si bien qu’une analyse ne réussit jamais sans
				que les vérifications du pack aient été exécutées.
			</p>

			<h2 id="failing-only-on-serious-problems">N’échouer que sur les problèmes graves</h2>
			<p>
				<code>--fail-on-severity</code> (<code>critical</code>, <code>serious</code>,{" "}
				<code>moderate</code> ou <code>minor</code>) ne fait échouer l’exécution que sur les règles
				en échec à cette gravité ou au-dessus ; avec <code>--baseline</code>, que sur les nouvelles.
				Chaque échec reste signalé, et le résumé marque ceux qui sont sous le niveau, pour qu’une
				équipe commence par bloquer les problèmes graves et resserre le seuil à mesure que l’arriéré
				diminue.
			</p>
			<CodeBlock lines={[{ text: "surea11y scan --urls pages.txt --fail-on-severity serious", command: true }]} />

			<h2 id="questions-that-likely-fail">Questions en échec probable</h2>
			<p>
				<code>--fail-on-lean</code> fait aussi échouer l’exécution sur les questions en échec
				probable (<code>leaningFailures()</code> de core), à la gravité de{" "}
				<code>--fail-on-severity</code> ou au-dessus si vous en donnez une ;{" "}
				<code>--lean-fail-wcag-only</code> ne compte que celles des règles associées à un critère
				WCAG, sans les bonnes pratiques. Avec cette option, <code>--junit</code> signale une telle
				règle comme un test en échec et <code>--sarif</code> un tel constat comme une{" "}
				<code>error</code>, et <code>--write-baseline</code> enregistre aussi les échecs probables
				actuels, pour que <code>--baseline</code> ne bloque que les nouveaux. C’est facultatif, car
				une tendance est un indice, pas une preuve : qu’un constat penche, et de quel côté, peut
				changer dans une version mineure de core.
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --fail-on-lean --lean-fail-wcag-only", command: true },
					{ text: "surea11y scan ./dist/index.html --fail-on-lean --write-baseline baseline.json   # once, commit it", command: true },
					{ text: "surea11y scan ./dist/index.html --fail-on-lean --baseline baseline.json         # in CI, from then on", command: true },
				]}
			/>

			<h2 id="compact-results">Résultats compacts</h2>
			<p>
				<code>--compact</code> réduit chaque résultat <code>pass</code> et{" "}
				<code>notApplicable</code> à sa règle, son résultat et son type (
				<code>engineOptions.output.detail: 'findings'</code>) : un <code>--json</code> plus léger,
				pour un résultat conservé comme artefact de CI. Le résumé, le code de sortie, la baseline
				et les rapports HTML, SARIF et JUnit sont les mêmes que sans cette option.
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --compact --json > result.json", command: true }]} />

			<h2>Codes de sortie et limites</h2>
			<p>
				<code>cantTell</code> n’affecte pas le code de sortie, sauf avec{" "}
				<code>--fail-on-lean</code> : <code>0</code> si aucun <code>fail</code>, <code>1</code>{" "}
				s’il y a au moins un <code>fail</code> sur une page (ou, avec <code>--baseline</code>, au
				moins un <code>fail</code> <em>nouveau</em> : c’est le cas du contrôle en CI ;{" "}
				<code>--fail-on-severity</code> ne compte que ceux de son niveau ou au-dessus ; voir{" "}
				<a href="/conformance/baseline/">Baseline / allowlist</a> pour ce qui compte comme
				« connu » ou « nouveau »), <code>2</code> en cas d’erreur d’utilisation ou d’analyse, ou
				pour une analyse qui n’aurait rien vérifié ou moins que demandé : une liste{" "}
				<code>--rules</code>/<code>--tags</code> qui ne nomme aucune règle ni aucun tag connu, un
				sélecteur <code>--context</code> qui ne correspond à rien, une règle personnalisée ou un
				pack qui ne s’est pas exécuté, un <code>--profile</code> qui n’a pas été appliqué. Une
				baseline écrite avec core 1.13 correspond toujours aux constats dont la 1.14 a scindé les
				codes de raison ; <code>--migrate-baseline baseline.json</code> la réécrit avec les
				nouveaux codes.
			</p>
			<p>
				Sans <code>--browser</code>, la CLI lit <strong>uniquement du HTML statique</strong>,
				qu’il s’agisse d’un fichier local ou du corps brut d’une requête HTTP(S) GET, et n’exécute
				jamais le JavaScript de la page. Aucun des deux modes ne clique, ne saisit ni ne se
				connecte : pour un contenu qui n’apparaît qu’après cela, utilisez l’un des bindings, ou
				appelez directement le moteur dans un navigateur que vous pilotez (<span lang="en">Pattern 2</span>{" "}
				dans <a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>, le guide
				d’intégration sur GitHub).
			</p>
			<p>
				Référence complète des flags, contrat des règles personnalisées, packs et recettes de CI :{" "}
				<a href={cliDocs}><code>docs/CLI.md</code></a>. Pour les modèles de pipeline de CI en
				particulier, voir <a href="/configuration/ci-integration/">Intégration CI</a>.
			</p>
		</>
	);
}
