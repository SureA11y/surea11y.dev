import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { ResultBadge } from "./design-system/results/ResultBadge.jsx";
import rules from "../data/rules.generated.json";

const core = "https://github.com/SureA11y/core/blob/main";

const packageRows = [
	{ id: "playwright", want: "Ajouter des vérifications d’accessibilité aux tests Playwright", install: <><code>@surea11y/playwright</code> + <code>@surea11y/core</code></> },
	{ id: "puppeteer", want: "…Puppeteer", install: <><code>@surea11y/puppeteer</code> + <code>@surea11y/core</code></> },
	{ id: "selenium", want: "…Selenium", install: <><code>@surea11y/selenium</code> + <code>@surea11y/core</code></> },
	{ id: "cypress", want: "…Cypress", install: <><code>@surea11y/cypress</code> + <code>@surea11y/core</code></> },
	{ id: "webdriverio", want: "…WebdriverIO", install: <><code>@surea11y/webdriverio</code> + <code>@surea11y/core</code></> },
	{ id: "test-matchers", want: "Vérifier l’accessibilité dans des tests unitaires ou de composants Jest/Vitest", install: <><code>@surea11y/test-matchers</code> + <code>@surea11y/core</code></> },
	{ id: "cli", want: "Analyser des pages depuis un terminal ou un pipeline de CI, en HTML statique ou dans Chromium", install: <code>@surea11y/cli</code> },
	{ id: "pack-en301549", want: "Vérifier EN 301 549, la norme européenne, avec n’importe lequel des précédents", install: <><a href="/configuration/packs/#en-301-549-pack"><code>@surea11y/pack-en301549</code></a> + <code>@surea11y/core</code></> },
	{ id: "pack-own", want: "Vérifier mes propres règles, profils ou norme, publics ou internes", install: <>Un pack à moi : voir <a href="/configuration/packs/#writing-a-pack">Écrire un pack</a></> },
	{ id: "core", want: "Exécuter le moteur sur un DOM dont je dispose déjà", install: <code>@surea11y/core</code> },
	{ id: "core-build", want: "Créer mon propre outil sur le moteur : une CLI, une extension, un tableau de bord, un générateur de rapports", install: <code>@surea11y/core</code> },
];

export function OverviewLead() {
	return (
		<>
			<p>
				<a href="https://github.com/SureA11y/core">@surea11y/core</a> est un <strong>moteur de tests d’accessibilité</strong> que vous exécutez dans votre
				propre suite de tests, dans votre pipeline de CI ou en ligne de commande.
			</p>
			<p>
				Ce qui le distingue, c’est ce qu’il fait des cas que les tests automatisés ne peuvent pas
				trancher. Il implémente le format ouvert du W3C,{" "}
				<a href="https://www.w3.org/TR/act-rules-format/">
					<span lang="en">Accessibility Conformance Testing (ACT) Rules Format</span>
				</a>
				, et il est vérifié sur le corpus de tests publié par ACT plutôt que jugé uniquement à
				l’aune de ses propres tests. Il rapporte ce qu’il trouve, ce qu’il ne trouve pas et, chose
				rare, ce dont il n’est pas certain, de sorte que ses résultats sont vérifiables plutôt que
				rassurants.
			</p>
			<p>
				<em><span lang="en">Sure</span></em>, c’est la certitude sur ce que l’on sait, et l’honnêteté sur ce que l’on ne
				sait pas. Il vous dit ce qu’il ne peut pas vous dire.
			</p>
		</>
	);
}

export function OverviewContent() {
	return (
		<>
			<h2>Pas un produit unique</h2>
			<p>
				surea11y est une famille de paquets qui partagent un même moteur, et non un outil unique
				avec une seule commande d’installation. Installez celui qui correspond à votre façon de
				tester actuelle, avec <code>@surea11y/core</code>, le moteur qu’il exécute. Installez core
				seul pour exécuter le moteur sur un DOM dont vous disposez déjà, ou pour bâtir votre
				propre outil dessus :
			</p>
			<DataTable
				label="Quel paquet installer"
				rowKey="id"
				columns={[
					{ key: "want", label: "Je veux…", wrap: true },
					{ key: "install", label: "Installer", width: "26%" },
				]}
				rows={packageRows}
			/>
			<p>
				Voir <a href="/getting-started/">Premiers pas</a> pour l’installation et l’utilisation de
				chaque binding. Si vous construisez un outil,{" "}
				<a href={`${core}/docs/BUILDING_ON_CORE.md`}><code>BUILDING_ON_CORE.md</code></a> (sur
				GitHub, en anglais) présente le contrat stable, l’exécution des analyses, le choix des
				vérifications et la façon de présenter les résultats sans leur faire dire plus qu’ils ne
				disent.
			</p>
			<p>
				Pour un premier aperçu sans suite de tests, chargez le{" "}
				<a href="/getting-started/standalone/">bundle autonome</a> dans une page et analysez-la
				depuis la console du navigateur : <code>await a11ycore.run()</code> analyse la page,{" "}
				<code>a11ycore.table(result)</code> liste les résultats, <code>a11ycore.highlight(result)</code>{" "}
				les encadre dans la page et <code>await a11ycore.openReport(result)</code> ouvre le rapport
				HTML.{" "}
				<a href={`${core}/docs/INTEGRATION.md#from-the-browser-console`}>
					<code>INTEGRATION.md</code>
				</a>{" "}
				(sur GitHub, en anglais) liste les autres fonctions, comme{" "}
				<code>a11ycore.inspect('headings')</code> pour les titres, les landmarks, les noms ou l’ordre
				de focus d’une page.
			</p>

			<h2>En quoi ses résultats diffèrent</h2>
			<p>
				Chaque règle prend une décision déterministe, à partir d’un vocabulaire fixe de quatre
				résultats, et non selon la structure <code>violations</code>/<code>passes</code>/<code>incomplete</code>/
				<code>inapplicable</code> qu’utilisent d’autres outils de test d’accessibilité répandus :
			</p>
			<ul className="outcome-list">
				<li>
					<ResultBadge lang="en" state="fail" /> (<code>fail</code>) : une violation démontrable à partir du
					DOM. Réservé aux cas objectifs et normatifs.
				</li>
				<li>
					<ResultBadge lang="en" state="pass" /> (<code>pass</code>) : la condition précise de cette règle est
					remplie.{" "}
					<strong>Cela ne signifie pas que la page est accessible.</strong>
				</li>
				<li>
					<ResultBadge lang="en" state="unknown" /> (<code>cantTell</code>) : une personne doit trancher, et le
					résultat indique ce qui était ambigu.
				</li>
				<li>
					<ResultBadge lang="en" state="na" /> (<code>notApplicable</code>) : la condition préalable de la
					règle n’est pas présente.
				</li>
			</ul>
			<p>
				<code>cantTell</code> est la raison d’être du projet. Un moteur qui écarte discrètement ce
				qu’il ne peut pas déterminer <strong>produit un rapport plus court et une fausse impression
				de couverture</strong>. Voir{" "}
				<a href="/results-reports/output-schema/">Résultats et rapports</a> pour la structure
				complète du résultat, et <a href="/conformance/wcag-mapping/">Conformité</a> pour la façon
				dont les résultats individuels s’agrègent en un verdict WCAG, y compris la façon dont une
				version WCAG cible (2.0/2.1/2.2) est déterminée et appliquée.
			</p>
			<p>
				Un <code>cantTell</code> ne vous laisse pas seul face à une question. Chacun de ceux que
				renvoie une règle de core indique comment y répondre : quelques étapes à partir de
				l’élément qu’il désigne, et ce que vous verrez s’il réussit et s’il échoue, dans la langue
				de l’analyse. Quand la page fournit des indices, le résultat penche en plus vers{" "}
				<code>pass</code> ou <code>fail</code>, avec les faits qu’il a lus, sa raison et ce qui
				pourrait le rendre faux. Chaque penchant est compté sur les cas de test ACT du W3C et, une
				fois compté sur au moins cinq cas, il indique combien de fois il a vu juste ; d’ici là, il
				ne porte aucun chiffre, jamais une estimation. Le résultat reste <code>cantTell</code> : un
				penchant ordonne les questions, et c’est toujours une personne qui y répond. Voir{" "}
				<a href="/results-reports/output-schema/#how-to-check">Comment vérifier</a> et{" "}
				<a href="/results-reports/output-schema/#leans">Penchants</a> dans le Schéma de sortie, et{" "}
				<a href={`${core}/docs/LEANS.md`}><code>LEANS.md</code></a> (sur GitHub, en anglais) pour
				ce qui vaut un penchant à un résultat et la confiance à lui accorder.
			</p>
			<p>
				Le rapport HTML présente les questions dans l’ordre où une personne les examine :
				« Échec probable : à confirmer », « Réussite probable : à confirmer » et « À examiner
				par une personne ». Chaque carte a ses étapes « Comment vérifier », et celles des deux
				premiers groupes disent pourquoi elles penchent. En CI,
				les rapports JUnit et SARIF peuvent aussi bloquer le build sur les résultats qui penchent
				vers l’échec, option désactivée par défaut, et une baseline peut accepter ceux qu’une page
				a déjà, si bien que seuls les nouveaux font échouer le build. Voir{" "}
				<a href="/results-reports/html-report/">Rapport HTML</a> et{" "}
				<a href="/conformance/baseline/">Baseline / allowlist</a>, ou <a href="/sample-report.html">ouvrez un exemple de rapport</a> sur
				une petite page de paiement.
			</p>
			<p>
				Un <code>pass</code> qui est passé de justesse le dit. Les règles qui mesurent une valeur
				par rapport à un seuil (contraste, taille de cible, espacement du texte) signalent une{" "}
				<code>margin</code> quand la réussite la plus juste s’est approchée de la limite :
				l’élément qui s’en est le plus approché tout en la respectant. Un texte à 4,52:1 pour un minimum de 4,5:1 passe, et la marge le montre :
				vous pouvez le corriger avant qu’un petit changement n’en fasse un <code>fail</code>. Voir
				le <a href="/results-reports/output-schema/#margin">Schéma de sortie</a>.
			</p>
			<p>
				Nommez la norme, et le moteur choisit les règles.{" "}
				<code>{"{ wcag: { version: '2.2', level: 'AA' } }"}</code> exécute les règles des critères A
				et AA de WCAG 2.2, selon le niveau de chaque critère dans cette version, et{" "}
				<code>bestPractices: true</code> ajoute les vérifications que WCAG n’exige pas. Une norme
				au-delà de WCAG, comme une norme nationale ou la politique propre à votre organisation, prend
				la forme d’un pack : ses règles, ses profils et les points de sa liste de contrôle s’exécutent à côté de
				celles de core et apparaissent dans chaque rapport. Voir{" "}
				<a href="/configuration/engine-options/#selecting-which-rules-run">Options du moteur</a> et{" "}
				<a href="/configuration/packs/">Packs</a>.
			</p>
			<p>
				Nommez des vérifications plutôt qu’une norme, et le résultat indique toujours les critères
				WCAG qu’elles concernent. Une analyse qui n’exécute que <code>link-name-present</code>{" "}
				signale aussi 2.4.4 et 4.1.2, plus le critère AAA 2.4.9 si l’analyse ne fixe pas de niveau, et un critère dont l’analyse a laissé de côté les autres
				vérifications ressort en <code>cantTell</code> (« Vérifié en partie » dans le rapport
				HTML), pas en <code>pass</code>. <code>wcagLevel: 'AA'</code> fixe le niveau des critères
				qu’une analyse signale, et les rapports JUnit, SARIF et EARL le suivent : un build AA
				n’échoue pas sur un critère AAA.
			</p>
			<p>
				Aucun critère WCAG n’est déclaré réussi sur la foi de règles qui n’en vérifient qu’une
				partie. Un critère ne réussit que si ses règles vérifient tout ce qu’il demande, et aucun
				n’est encore vérifié aussi complètement : quand toutes les règles d’un critère réussissent,
				le critère ressort en <code>cantTell</code>. Les parties que vérifient les règles sont
				respectées, et une personne vérifie le reste. Un rapport sans échec le dit aussi sous son
				titre : aucune règle n’a échoué, ce qui ne signifie pas que la page est conforme. Déclarer
				ces critères réussis, ce serait donner la fausse impression de couverture que ce moteur est
				conçu pour éviter. Voir{" "}
				<a href="/conformance/wcag-mapping/">Correspondance de conformité WCAG</a>.
			</p>
			<p>
				Les composants web sont jugés sur ce qu’ils exposent. Un élément personnalisé qui se donne
				un nom, des états ou un rôle par <code>ElementInternals</code> est vérifié sur ces valeurs
				quand le moteur peut les lire, et fait l’objet d’une question quand il ne le peut pas. Pour
				les exécutions de test et d’audit, <code>internalsHookScript()</code> est un script
				facultatif qui permet à l’analyse de lire les <code>internals</code> qu’un composant garde
				privés : ces éléments réussissent ou échouent au lieu de ressortir en{" "}
				<code>cantTell</code>.{" "}
				<a href={`${core}/docs/INTEGRATION.md#reading-private-elementinternals-the-internals-hook`}>
					<code>INTEGRATION.md</code>
				</a>{" "}
				(sur GitHub) montre comment l’installer avant les scripts de la page.
			</p>
			<p>
				Les règles atteignent trois critères qu’aucune règle ne couvrait : 3.3.1 « Identification
				des erreurs » (un champ marqué invalide dont le message d’erreur manque, est masqué ou ne
				lui est pas associé), 4.1.3 « Messages d’état » (une région live que les technologies
				d’assistance ne peuvent pas atteindre) et 1.4.5 « Texte sous forme d’image » (du texte
				dessiné dans une image qui pourrait être du vrai texte). Les trois posent une question au
				lieu d’échouer. Les règles du clavier lisent les gestionnaires d’événements dans le
				balisage ; avec <code>listenerHookScript()</code>, un autre script facultatif installé
				avant ceux de la page, elles jugent aussi les écouteurs ajoutés par script : un{" "}
				<code>role="button"</code> dans l’ordre de tabulation avec un écouteur de clic et aucun
				écouteur de touche là où ses touches pourraient en atteindre un (sur lui, à l’intérieur, sur
				ses ancêtres, sur un shadow root qui le contient, le document ou la fenêtre), ni
				d’écouteur de focus qui pourrait en ajouter un, échoue, car Entrée et Espace ne font rien.{" "}
				<a href={`${core}/docs/INTEGRATION.md#seeing-listeners-added-from-script-the-listener-hook`}>
					<code>INTEGRATION.md</code>
				</a>{" "}
				(sur GitHub) montre comment l’installer, ainsi que son équivalent pour les messages d’état,
				le hook des régions live.
			</p>
			<p>
				Dans un navigateur, le contraste est mesuré tel que la page est dessinée : le texte d’une
				page sans arrière-plan propre, sur le canevas que peint le navigateur, clair ou sombre ;
				le texte généré par <code>::before</code>, <code>::after</code> et les marqueurs de liste ;
				et un <code>&lt;select&gt;</code> fermé. Ces cas étaient auparavant ignorés ou faisaient
				l’objet d’une question. Le texte dessiné uniquement par un contour ou une ombre échoue
				désormais là où chaque couleur dans laquelle il est dessiné est sous le ratio. Un caractère isolé qui
				tient lieu du nom d’un contrôle, comme le « X » d’un bouton nommé « Fermer », fait
				l’objet d’une question au lieu d’un échec : savoir s’il s’agit d’une icône ou d’une lettre
				demande une personne.
			</p>

			<h3 id="checked-against-the-act-corpus">Vérifié sur le corpus ACT</h3>
			<p>
				Le moteur comprend {rules.length} règles. Celles qui ont un équivalent
				dans les <a href="https://www.w3.org/WAI/standards-guidelines/act/rules/"><span lang="en">W3C ACT Rules</span></a>{" "}
				sont exécutées sur les cas de test que le W3C publie pour elles, ceux que note la liste
				des implémentations du W3C : 957 exemples répartis sur 60 règles ACT. Le moteur ne renvoie{" "}
				<code>fail</code> sur aucun des exemples qu’ACT marque comme réussis ou inapplicables ; il ne
				produit donc aucun faux positif sur ce corpus. C’est un résultat sur ces exemples, pas une
				garantie pour toute page ; quand le moteur ne peut pas trancher un cas, il renvoie{" "}
				<code>cantTell</code>, ce qu’ACT permet à une implémentation automatisée.
			</p>
			<p>
				Cela vaut dans les deux environnements où le moteur s’exécute : dans jsdom, comme avec
				test-matchers et la CLI par défaut, et dans Chromium, comme avec les bindings de navigateur, chaque cas
				de test étant chargé comme une vraie page, scripts et feuilles de style liées compris.
				Vingt-deux exemples qu’ACT marque en échec ne sont pas signalés dans jsdom, et 18 dans
				Chromium. Ce sont pour la plupart des questions de jugement, comme savoir si un titre décrit
				le contenu qui le suit ; les quatre que le navigateur détecte demandent les scripts ou les
				feuilles de style de la page, que jsdom n’exécute pas. Voir{" "}
				<a href={`${core}/docs/ACT_RULE_MAPPING.md`}><code>ACT_RULE_MAPPING.md</code></a> pour
				chacun d’eux, avec le raisonnement.
			</p>
			<p>
				Deux rapports d’implémentation EARL consignent le résultat de chacun de ces cas, réussites
				et résultats inapplicables compris : une règle restée muette parce que rien ne
				s’appliquait se distingue ainsi d’une règle qui n’est pas implémentée du tout.{" "}
				<a href="https://surea11y.github.io/act-report/act-report.jsonld" lang="en">SureA11y</a>{" "}
				est exécuté dans jsdom, et{" "}
				<a href="https://surea11y.github.io/act-report/act-report-browser.jsonld" lang="en">
					SureA11y in a browser
				</a>{" "}
				dans Chromium. Voir <a href="/results-reports/earl-report/">Rapport EARL</a> pour le format.
			</p>

			<h2>Principes clés</h2>
			<ul>
				<li><strong>Exécution déterministe.</strong> Une même page, rendue dans les mêmes conditions et analysée avec les mêmes options, reçoit les mêmes décisions. Les temps, horodatages et détails d’environnement du résultat peuvent tout de même varier d’une exécution à l’autre. Les animations et transitions en cours sont figées pendant l’analyse, si bien qu’un fondu en cours ne change pas ce que mesurent les règles.</li>
				<li><strong>Prudent par conception.</strong> Les règles de core réservent <code>fail</code> aux violations objectives et normatives, pour que les fausses alertes restent rares.</li>
				<li><strong>Traçabilité vers les normes.</strong> Les règles sont associées au critère de succès WCAG applicable chaque fois que c’est pertinent.</li>
				<li><strong>Sortie stable et lisible par machine.</strong> Les identifiants de règle restent les mêmes quelle que soit la langue.</li>
				<li><strong>Indépendant du framework.</strong> S’exécute dans jsdom ou dans n’importe quel framework d’automatisation de navigateur.</li>
				<li><strong>Extensible.</strong> Ajoutez des règles personnalisées, enregistrez des politiques et filtrez les analyses par ID de règle, tag ou version WCAG.</li>
				<li><strong>Rapports localisés.</strong> Les messages lisibles par un humain peuvent être traduits sans toucher aux données lisibles par machine ; <code>en</code>, <code>fr</code>, <code>de</code>, <code>es</code> et <code>ja</code> sont fournis aujourd’hui.</li>
			</ul>

			<h2>Philosophie</h2>
			<blockquote>
				Automatiser ce qui peut être déterminé objectivement. Ne jamais prétendre automatiser ce qui ne peut pas l’être.
			</blockquote>
			<p>
				Certaines exigences des WCAG peuvent être vérifiées avec une certitude totale. D’autres
				demandent un jugement humain, une connaissance du contexte ou une évaluation de
				l’utilisabilité. Un score unique ou un verdict réussi/échoué gomme cette différence ;
				surea11y la rapporte. C’est pour cela que <code>cantTell</code> et{" "}
				<code>notApplicable</code> existent en tant que résultats, et cela détermine chaque règle
				du moteur.
			</p>

			<h3>Ce que surea11y ne détectera pas</h3>
			<p>Être explicite sur les limites de l’automatisation fait partie de la même philosophie. Par exemple, surea11y ne pourra pas :</p>
			<ul>
				<li>confirmer qu’un texte alternatif a du <em>sens</em>, seulement qu’il est présent (un attribut alt valant <code>"image123.png"</code> passe la vérification objective, et fait l’objet d’une question, penchant vers l’échec, en tant que nom de fichier) ;</li>
				<li>juger si un choix de contraste de couleurs est esthétiquement approprié, seulement s’il atteint le rapport de contraste applicable ;</li>
				<li>déterminer si un message d’erreur <em>explique</em> réellement le problème, car cela dépend d’une logique de validation qu’une analyse statique ne voit pas ;</li>
				<li>détecter un piège au clavier ou un contenu rogné à un zoom de 400 %, car les deux exigent de simuler une véritable interaction utilisateur dans le temps, et pas seulement de lire le DOM à un instant donné.</li>
			</ul>
			<p>
				Certaines vérifications implémentées renvoient <code>cantTell</code> quand une personne
				doit trancher. D’autres aspects, dont les pièges au clavier et la redistribution au zoom,
				ne sont pas du tout vérifiés par le moteur et demandent des tests à part : aucun{" "}
				<code>cantTell</code> ne les remplace, donc un résultat qui n’en contient pas ne signifie
				pas qu’ils ont été couverts. Voir{" "}
				<a href="/help/known-limitations/">Limites connues</a> pour la liste complète.
			</p>
		</>
	);
}

export function OverviewAbout() {
	return (
		<section className="stewardship" aria-labelledby="about-the-project">
			<h2 id="about-the-project" className="stewardship-label">À propos du projet</h2>
			<p className="stewardship-lead">
				surea11y est un projet <span className="stewardship-nowrap">open source</span> indépendant, développé de manière ouverte.
			</p>
			<p className="stewardship-body">
				<code>@surea11y/core</code> et tous les paquets d’intégration sont publiés sur{" "}
				<a href="https://www.npmjs.com/org/surea11y">npm</a>. Les tickets, les discussions et les
				modifications se font publiquement sur <a href="https://github.com/SureA11y">GitHub</a>, et
				les contributions sont bienvenues. Voir{" "}
				<a href="https://github.com/SureA11y/core/blob/main/CONTRIBUTING.md">
					<code>CONTRIBUTING.md</code>
				</a>{" "}
				pour les règles de contribution.
			</p>
			<div className="stewardship-byline">
				<p className="stewardship-credit">
					<span className="stewardship-credit-label">Créé et actuellement maintenu par</span>{" "}
					<span className="stewardship-name">Jorge Rumoroso</span>
				</p>
				<p className="stewardship-role">
					Spécialiste de l’accessibilité numérique, avec une expérience professionnelle de l’audit
					d’accessibilité, des normes et de la gouvernance.
				</p>
				<p className="stewardship-link">
					<a href="https://www.linkedin.com/in/jorgerumoroso/">Profil LinkedIn</a>
				</p>
			</div>
		</section>
	);
}
