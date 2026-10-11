import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

export function HtmlReportContent() {
	return (
		<>
			<p>
				Un rapport HTML autonome à ouvrir dans un navigateur après une analyse : pas de serveur,
				pas de ressources externes, pas de requêtes réseau. Pensé pour les testeurs QA et manuels
				qui veulent parcourir les résultats d’une analyse plutôt que du JSON brut ou un résumé dans
				le terminal.
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
					<code>notApplicable</code>).
				</li>
				<li>
					<strong>À examiner</strong> : une carte par règle ayant des occurrences{" "}
					<code>fail</code>/<code>cantTell</code> (et non une par occurrence : une règle avec de
					nombreuses occurrences identiques est un seul point d’attention, pas plusieurs), chacune
					indiquant la sévérité, le ou les critères de succès WCAG, une occurrence représentative
					et le nombre total d’occurrences. Limité aux 24 règles les plus prioritaires, avec une
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
						Une ligne par règle qui mesure par rapport à un seuil : sa valeur conforme la plus proche,
						la limite, la marge restante et l’élément. Les pixels sont arrondis à l’entier, avec
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
					applicable, et les règles atomiques qui y ont contribué, y compris une règle
					personnalisée associée au critère. Ce sont de vraies
					données du moteur, pas un regroupement inventé : la même agrégation que celle du champ{" "}
					<code>rulesResults</code> du JSON brut.
				</li>
				<li>
					<strong>Agrégation propre à une norme</strong> : seulement quand l’analyse a exécuté les
					règles d’une norme qui a ses propres agrégations (son profil, ou{" "}
					<code>engineOptions.optInRules</code>), une ligne par agrégation, avec la formulation de la
					norme, les exigences des règles qui ont déterminé le résultat, la ventilation et les
					règles qui y ont contribué. Cela couvre la norme d’un{" "}
					<a href="/configuration/packs/">pack</a> et la liste de contrôle d’un pack, dont les points sont
					ses agrégations. Chacune de ces normes figure dans le champ <code>standards</code> du
					résultat, si bien qu’un résultat enregistré s’affiche de la même façon où qu’il soit
					rendu ; quand cette liste est absente ou endommagée, le rapport le signale au-dessus de
					l’agrégation WCAG.
				</li>
				<li>
					<strong>Données techniques complètes</strong> (repliées par défaut) : un tableau de
					scores (une tuile par résultat) et un tableau paginé, consultable et filtrable (par
					résultat), de chaque occurrence de toute l’analyse.
				</li>
			</ul>
			<p>
				Le rapport suit le schéma de couleurs du lecteur, et son propre texte respecte WCAG 1.4.3
				dans les deux : chaque couleur d’état atteint au moins 4,5:1 sur sa pastille et sa tuile,
				et les règles de contraste du moteur lui-même réussissent sur le rapport rendu, en mode
				clair comme en mode sombre.
			</p>
			<p>
				La barre de métadonnées sous l’en-tête indique le nombre de règles, le nombre
				d’occurrences, le tag du moteur, la version du schéma, la version de WCAG visée par
				l’analyse, le <code>engineOptions.profile</code> utilisé (s’il y en a un), les tags de règles
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
				<code>options.title</code> est facultatif (par défaut <code>"surea11y scan report"</code>).
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
