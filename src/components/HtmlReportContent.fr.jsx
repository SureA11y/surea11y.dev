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
					note de dépassement au-delà.
				</li>
				<li>
					<strong>Agrégation WCAG</strong> : regroupée par niveau de conformité (A / AA / AAA),
					issue directement des agrégations composites <code>rulesResults[]</code> du moteur
					lui-même (voir <a href="/conformance/wcag-mapping/">Conformité</a>) : une ligne par
					critère de succès (avec la clause d’EN 301 549 qui le reprend, quand il y en a une et que
					l’analyse a demandé les clauses d’EN 301 549), avec son résultat, une ventilation réussite/échec/à
					examiner/non applicable, et les règles atomiques qui y ont contribué. Ce sont de vraies
					données du moteur, pas un regroupement inventé : la même agrégation que celle du champ{" "}
					<code>rulesResults</code> du JSON brut.
				</li>
				<li>
					<strong>Agrégation propre à une norme</strong> : seulement quand l’analyse a exécuté les
					règles d’une norme qui a ses propres agrégations (son profil, ou{" "}
					<code>engineOptions.optInRules</code>), une ligne par agrégation, avec la formulation de la
					norme, la ventilation et les règles qui y ont contribué.
				</li>
				<li>
					<strong>Données techniques complètes</strong> (repliées par défaut) : un tableau de
					scores (une tuile par résultat) et un tableau paginé, consultable et filtrable (par
					résultat), de chaque occurrence de toute l’analyse.
				</li>
			</ul>
			<p>
				La barre de métadonnées sous l’en-tête indique le nombre de règles, le nombre
				d’occurrences, le tag du moteur, la version du schéma, la version de WCAG visée par
				l’analyse, le <code>engineOptions.profile</code> utilisé (s’il y en a un), les tags de règles
				optionnelles ajoutés par <code>engineOptions.optInRules</code> (s’il en a ajouté) et la
				langue retenue pour l’analyse. Le repli de langue se fait chaîne par chaîne et ne se voit pas dans le texte
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
				<code>renderHtmlReport(result, options)</code> est une fonction pure : elle renvoie une
				chaîne et <strong>ne touche jamais elle-même au système de fichiers</strong> (c’est le
				flag <code>--html</code> de la CLI qui se charge de l’écriture).{" "}
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
