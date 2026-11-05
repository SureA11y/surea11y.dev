import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

export function HtmlReportContent() {
	return (
		<>
			<p>
				Un rapport HTML autonome à ouvrir dans un navigateur après une analyse : pas de serveur,
				pas de ressources externes, pas de requêtes réseau. Pensé pour les testeurs QA et manuels
				qui veulent parcourir les résultats d’une analyse plutôt que du JSON brut ou un résumé dans
				le terminal. <a href="/sample-report.html">Ouvrez un exemple de rapport</a> : une petite page de paiement
				analysée avec les hooks d’écouteurs et de régions live, avec un constat dans chaque groupe et ce que l’analyse laisse à une personne.
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --html report.html", command: true }]} />
			<p>
				Ouvrez <code>report.html</code> directement depuis le disque. Fonctionne avec n’importe
				quel autre mode de sortie : <code>--html</code> ne remplace pas <code>--json</code> ni le
				résumé par défaut, c’est un artefact supplémentaire écrit au chemin indiqué.
			</p>

			<h2>Ce qu’il affiche</h2>
			<ul>
				<li>
					<strong>En-tête</strong> : un titre en langage clair (« <span lang="en">N of M applicable checks passed</span> »)
					ainsi qu’une barre empilée et sa légende (icône + libellé + nombre :
					l’état n’est jamais indiqué par la seule couleur), ventilées par résultat{" "}
					(<code>fail</code>/<code>cantTell</code>/<code>pass</code>/
					<code>notApplicable</code>). Lorsqu’aucune règle n’a échoué et que certaines
					s’appliquaient, une note sous le titre précise que ce n’est pas une déclaration de
					conformité de la page, et nomme ce qu’une personne vérifie encore : les résultats à
					vérifier, l’utilisation au clavier, la lecture de la page par un lecteur d’écran et le
					contenu lui-même.
				</li>
				<li>
					<strong>À examiner</strong> : une carte par règle ayant des occurrences{" "}
					<code>fail</code>/<code>cantTell</code> (et non une par occurrence : une règle avec de
					nombreuses occurrences identiques est un seul point d’attention, pas plusieurs), chacune
					indiquant la sévérité, le ou les critères de succès WCAG, dans une analyse de plusieurs profils ce
					que chaque profil en conclut (« wai-aria-1.2 : Échec » à côté de « wcag22-aa : À vérifier »,
					ses <code>verdicts</code>), une occurrence représentative
					et le nombre total d’occurrences. Les règles en échec viennent en premier. Les constats à
					vérifier suivent, en trois groupes : ceux dont les indices pointent vers un échec
					(« Échec probable : à confirmer »), ceux dont les indices pointent vers une réussite
					(« Réussite probable : à confirmer ») et ceux que seule une personne peut juger
					(« À examiner par une personne »), tels que les classe{" "}
					<code>reviewGroupOf(check, occurrence)</code> de <code>@surea11y/core</code>, si bien
					qu’un outil qui trie une file de revue la trie de la même façon. Chaque carte des deux
					premiers groupes dit pourquoi elle penche de ce côté (le{" "}
					<a href="/results-reports/output-schema/#leans"><code>lean</code></a> de l’occurrence).
					Chacune de ces cartes a une section « Comment vérifier », repliée par défaut, avec les
					étapes pour répondre à la question et ce qui réussit et ce qui échoue (le{" "}
					<a href="/results-reports/output-schema/#how-to-check"><code>howToCheck</code></a> de
					l’occurrence). Une règle dont les constats penchent de côtés différents a une carte dans
					chaque groupe. Dans chaque groupe, la plus grave d’abord (de critique à mineure) et, à
					gravité égale, celle qui a le plus d’occurrences. Limité aux 24 règles les plus prioritaires, avec une
					note de dépassement au-delà. Une règle qui ne s’est pas terminée (elle a levé une
					exception) a aussi sa carte, qui l’indique avec son erreur, puisque la page n’a pas été
					vérifiée au regard de cette règle. Une règle dotée d’un lien d’aide <code>http(s)</code>{" "}
					(<code>meta.helpUrl</code>, y compris celui d’une règle personnalisée) reçoit sur sa carte
					un lien « <span lang="en">How to fix &lt;rule&gt;</span> » ; une règle qui n’en a pas
					renvoie au document Understanding du critère WCAG qu’elle vérifie (« <span lang="en">Understanding 1.1.1
					Non-text Content</span> »).
					</li>
					<li>
						<strong>Frames</strong> : seulement pour un résultat multi-frames (
						<code>runa11yCoreAcrossFrames</code>, ou le <code>.frames(true)</code> d’un binding).
						Les cartes ci-dessus sont celles de la page elle-même ; cette section a un titre par
						frame, nommé d’après son chemin (les sélecteurs des éléments frame qui y mènent), avec
						le titre et l’URL du frame et ses cartes, ou « <span lang="en">Not scanned</span> » et la
						raison pour un frame qui n’a pas répondu. Le reste du rapport décrit la page elle-même.
					</li>
					<li>
						<strong>Au plus près de la limite</strong> : affiché lorsque l’analyse comporte des marges
						(<a href="/results-reports/output-schema/#margin"><code>margin</code> sur un résultat de vérification</a>).
						Une ligne par règle dont l’élément conforme le plus proche s’est approché de son seuil
						(dans la bande de la règle, par exemple 10 % d’un ratio de contraste), comme le dit la
						note au-dessus du tableau : sa valeur conforme la plus proche, la limite, la marge
						restante et l’élément. Les pixels sont arrondis à l’entier, avec
						« moins de 1 px » en dessous de un ; les rapports affichent deux décimales. Une règle qui
						est passée avec peu de marge est une règle qu’un petit changement peut faire échouer.
					</li>
				<li>
					<strong>Agrégation WCAG</strong> : regroupée par niveau de conformité (A / AA / AAA),
					issue directement des agrégations composites <code>rulesResults[]</code> du moteur
					lui-même (voir <a href="/conformance/wcag-mapping/">Conformité</a>) : une ligne par
					critère de succès (avec les exigences de chaque autre norme du champ{" "}
					<code>standards</code> du résultat auxquelles ses règles sont associées, comme la clause
					d’EN 301 549 qui le reprend, quand il y en a une et que l’analyse a demandé les clauses
					d’EN 301 549), avec son résultat, une ventilation réussite/échec/à examiner/non
					applicable (avec une ligne « Vérifié en partie » quand les règles du critère ne vérifient
					qu’une partie de ce qu’il demande, si bien qu’une personne vérifie le reste, comme
					« Vérifié en partie : ses contrôles ne couvrent qu’une partie de ce critère, et une
					personne vérifie le reste », ou quand l’analyse n’a sélectionné qu’une partie de ses
					règles, comme « Vérifié en partie : 1 contrôle sur 2 n’a pas été sélectionné pour cette analyse », voir{" "}
					<a href="/results-reports/output-schema/#partly-checked">Un critère partiellement
					vérifié</a>), et les règles atomiques qui y ont contribué, y compris une règle
					personnalisée associée au critère. Ce sont de vraies
					données du moteur, pas un regroupement inventé : la même agrégation que celle du champ{" "}
					<code>rulesResults</code> du JSON brut.
				</li>
				<li>
					<strong>Agrégation propre à une norme</strong> : seulement quand l’analyse a exécuté les
					règles d’une norme qui a ses propres agrégations (son profil, ou{" "}
					<code>engineOptions.optInRules</code>), un tableau par norme, et par version de celle-ci
					quand une analyse de plusieurs profils a jugé la page selon deux versions (EN 301 549
					V3.2.1 avec V4.1.1, chacune nommée par sa version), avec une ligne par agrégation, avec la formulation de la
					norme, les exigences des règles qui ont déterminé le résultat, la ventilation et les
					règles qui y ont contribué. Cela couvre la norme d’un{" "}
					<a href="/configuration/packs/">pack</a> et la liste de contrôle d’un pack, dont les points sont
					ses agrégations. Chacune de ces normes figure dans le champ <code>standards</code> du
					résultat, si bien qu’un résultat enregistré s’affiche de la même façon où qu’il soit
					rendu ; quand cette liste est absente ou endommagée, le rapport le signale au-dessus de
					l’agrégation WCAG.
				</li>
					<li id="whats-left-for-a-person">
						<strong>Ce qui reste à vérifier par une personne</strong> (core 1.15.0 et ultérieur) : ce que l’analyse ne peut pas trancher dans les exigences qu’évaluent ses
						règles. Chaque exigence de la norme analysée qui a une vérification qu’aucune règle ne
						tranche entièrement, chacune avec à côté son résultat dans l’analyse (« Analyse :
						Échec », « Analyse : Réussite » ou « Aucune règle ne la teste ») et, en dessous, repliées
						par défaut, ces vérifications : ce que chacune évalue, quelle part en tranchent les
						règles, les outils nécessaires, les étapes, et ce qui réussit et ce qui échoue (les{" "}
						<a href="/conformance/procedures/">procédures de test</a> de core). Une phrase au-dessus
						indique combien il y a de vérifications et d’exigences, et qu’une exigence dont toutes
						les règles réussissent n’est satisfaite que si ses vérifications réussissent aussi. La
						norme est WCAG, à la version visée par l’analyse et aux niveaux qu’elle a rapportés ;
						quand l’analyse a exécuté le profil d’un pack et que le pack, passé dans{" "}
						<code>options.packs</code>, fournit des procédures, c’est la norme de ce pack, sous ses
						propres numéros. Une analyse de plusieurs profils a une partie pour chaque norme et
						chaque version. Une note en dessous indique comment en faire une liste de travail,
						pour noter un résultat pour chacune (<code>renderProcedures</code>, ou{" "}
						<code>--manual-checks</code> de la CLI). Elle est écrite dans Node ; le rapport pour
						navigateur (<code>surea11y.report.js</code>) n’en a pas.
					</li>
				<li>
					<strong>Données techniques complètes</strong> (repliées par défaut) : un tableau de
					scores (une tuile par résultat) et un tableau paginé, consultable et filtrable (par
					résultat), de chaque occurrence de toute l’analyse ; un constat à vérifier qui a une
					tendance l’affiche sous son résumé (« Échec probable : … »), et la recherche la trouve.
					Quand il n’affiche aucune
					occurrence, il contient une ligne qui le dit : l’analyse n’en a enregistré aucune, ou
					les filtres les masquent toutes.
				</li>
			</ul>
			<p>
				Un élément situé dans un arbre shadow est localisé par les sélecteurs des shadow hosts,
				puis par le sien, joints par <code>{" >>> "}</code> :{" "}
				<code>{"html > body > main > x-card >>> button"}</code>. Les cartes, le tableau des marges
				et le tableau des occurrences l’affichent tous ainsi, tout comme{" "}
				<a href="/results-reports/sarif-report/#field-mapping">SARIF</a> et{" "}
				<a href="/results-reports/junit-report/#outcomes">JUnit</a>.
			</p>
			<p>
				Le rapport suit le schéma de couleurs du lecteur, et son propre texte respecte WCAG 1.4.3
				dans les deux : chaque couleur d’état atteint au moins 4,5:1 sur sa pastille et sa tuile,
				et les règles de contraste du moteur lui-même réussissent sur le rapport rendu, en mode
				clair comme en mode sombre.
			</p>
			<p>
				Le rapport se réorganise à 320 px CSS (WCAG 1.4.10) : la page ne défile jamais
				horizontalement. Un tableau plus large que la fenêtre défile dans une zone qui lui est
				propre, une région nommée par le titre du tableau qui reçoit le focus clavier, pour qu’on
				puisse la faire défiler avec les touches fléchées.
			</p>
			<p>
				La barre de métadonnées sous l’en-tête indique le nombre de règles, le nombre
				d’occurrences, le tag du moteur, la version du schéma, la version de WCAG visée par
				l’analyse, le <code>engineOptions.profile</code> utilisé (s’il y en a un ; chaque profil d’une analyse
				de plusieurs, joints par <code>+</code>, et ceux qui ne se sont pas exécutés), les tags de règles
				optionnelles ajoutés par <code>engineOptions.optInRules</code> (s’il en a ajouté), les
				conditions dans lesquelles la page a été rendue et la langue retenue pour l’analyse. Ces
				conditions sont le viewport (avec le ratio de pixels de l’appareil lorsqu’il ne vaut pas 1)
				et le schéma de couleurs, ainsi que les polices web lorsqu’elles étaient encore en cours de
				chargement ; une analyse sans mise en page, dans jsdom, l’indique à la place. Un constat
				qui dépend de la mise en page peut apparaître ou disparaître selon la largeur du viewport :
				la pastille indique donc la largeur que décrit le rapport. Le repli de langue se fait chaîne par chaîne et ne se voit pas dans le texte
				lui-même, donc{" "}
				<strong>un rapport demandé dans une langue que le moteur ne propose pas se lit comme un
				rapport anglais ordinaire</strong> : la pastille indique la langue demandée à côté de la
				langue retenue quand les deux diffèrent. Voir{" "}
				<a href="/configuration/locales/">Langues</a>.
			</p>
			<p>
				Toute la page est rédigée dans la langue retenue pour l’analyse : titres, colonnes des
				tableaux, noms des résultats et des gravités, phrase de synthèse, pagination et format de
				date. <code>&lt;html lang&gt;</code> indique cette langue. Les codes de résultat des filtres
				d’occurrences (<code>fail</code>, <code>cantTell</code>, …) restent tels quels, car ce sont
				les valeurs qu’on recherche dans le résultat JSON.
			</p>
			<p>
				Un cas garde des libellés anglais : une analyse dans une langue que le moteur ne fournit
				pas, exécutée avec un dictionnaire <code>engineOptions.messages</code> fourni par
				l’appelant. Ce dictionnaire ne fait pas partie du résultat, le rapport ne peut donc pas y
				lire de libellés ; ses résultats sont alors marqués avec leur propre langue
				(<code>lang="nl"</code>, par exemple), pour qu’un lecteur d’écran les lise avec la bonne
				voix.
			</p>
			<p>
				Un résultat compact (<code>engineOptions.output.detail: 'findings'</code>, voir{" "}
				<a href="/results-reports/output-schema/#top-level-result">Schéma de sortie</a>) est lu
				comme le résultat complet qu’il représente ; il est donc rapporté de la même façon.
			</p>

			<h2>Utilisation comme bibliothèque</h2>
			<CodeBlock
				lang="js"
				lines={[
					"const { renderHtmlReport } = require('@surea11y/core/report');",
					"const { runDomRulesInPage } = require('@surea11y/core');",
					"",
					"const result = runDomRulesInPage(url, null, {}, null);",
					"const html = renderHtmlReport(result, { title: 'My scan report' });",
					"",
					"require('fs').writeFileSync('report.html', html);",
				]}
			/>
			<p>
				<code>renderHtmlReport(result, options)</code> renvoie une chaîne et{" "}
				<strong>ne touche jamais elle-même au système de fichiers</strong> (c’est le flag{" "}
				<code>--html</code> de la CLI qui se charge de l’écriture). La page est datée par le{" "}
				<code>timestamp</code> du résultat (à définir avec <code>engineOptions.timestamp</code>),
				affiché en UTC, si bien que le même résultat produit toujours la même page ; un résultat qui
				n’en a pas est daté du moment du rendu.{" "}
				<code>options.title</code> est facultatif (par défaut, le titre propre à la langue du
				rapport : <code>"Rapport d’analyse surea11y"</code> en français).{" "}
				<code>options.packs</code> est la liste des packs que l’analyse a exécutés (
				<code>engineOptions.packs</code>), s’il y en a : dans Node, le rapport ajoute les étapes
				« Comment vérifier » aux constats non tranchés qui arrivent sans elles, toujours pour une
				règle de core et pour la règle de base d’une variante, et les étapes propres d’une règle
				de pack (son <code>meta.review</code>, en anglais, ou tel que le traduisent les
				dictionnaires de son pack) seulement quand il reçoit les packs (voir{" "}
				<a href="/configuration/packs/#review-steps">Packs</a>). Dans le navigateur (
				<code>surea11y.report.js</code>), il affiche les étapes que porte déjà le résultat. Avec les
				packs, « Ce qui reste à vérifier par une personne » suit aussi la norme d’un pack quand
				l’analyse a exécuté son profil. <code>options.manualChecks: false</code> retire cette
				section.
			</p>

			<h2>Périmètre</h2>
			<p>
				<strong>Il s’agit d’un rapport pour une seule analyse, un instantané à un moment donné, et
				non d’un tableau de bord qui suit les résultats de nombreuses analyses dans le
				temps.</strong> Suivre les résultats sur de nombreuses exécutions est un sujet distinct et
				plus vaste, qui ne fait pas partie de cet outil : conservez le JSON de chaque analyse et
				comparez-les vous-même, ou envoyez le SARIF vers un tableau de bord qui gère déjà
				l’historique (voir <a href="/results-reports/sarif-report/">Rapport SARIF</a>).
			</p>
		</>
	);
}
