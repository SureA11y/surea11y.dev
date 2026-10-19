import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { Callout } from "./design-system/feedback/Callout.jsx";

const core = "https://github.com/SureA11y/core/blob/main";
const pack = "/configuration/packs/#en-301-549-pack";

const precedenceRows = [
	{
		id: "fail",
		condition: (
			<>
				Au moins un contributeur <code>fail</code>
			</>
		),
		outcome: <code>fail</code>,
	},
	{
		id: "canttell",
		condition: (
			<>
				Aucun <code>fail</code>, mais au moins un contributeur <code>cantTell</code>, ou un
				contributeur listé qui ne s’est pas exécuté du tout
			</>
		),
		outcome: <code>cantTell</code>,
	},
	{
		id: "na",
		condition: (
			<>
				Tous les contributeurs <code>notApplicable</code>
			</>
		),
		outcome: <code>notApplicable</code>,
	},
	{
		id: "pass",
		condition: "Sinon (tous exécutés, aucun fail/cantTell, pas tous N/A)",
		outcome: <code>pass</code>,
	},
];

export function WcagMappingContent() {
	return (
		<>
			<p>
				Comment les résultats de chaque règle se rapportent à un critère de succès (CS) WCAG, et
				ce que surea11y peut et ne peut pas vous dire sur la conformité globale.
			</p>

			<h2>Les trois couches</h2>
			<ol>
				<li>
					<strong>Règles atomiques</strong> (<code>checksResults[]</code>) : chacune porte une
					seule décision normative, par exemple « cet <code>&lt;img&gt;</code> a-t-il un attribut{" "}
					<code>alt</code> ». Voir <a href="/rules/">le catalogue des règles</a> pour toutes les règles.
				</li>
				<li>
					<strong>Facettes</strong> : un CS WCAG est généralement plus vaste que ce qu’une seule
					règle peut trancher de façon déterministe. En interne, chaque CS est découpé en
					« facettes » nommées (par exemple, 1.1.1 Contenu non textuel a des facettes comme{" "}
					<code>img-alt-attr-present</code>, <code>text-alternative-quality</code>,{" "}
					<code>decorative-null</code>) suivies dans <code>src/coverage/wcag-facets.js</code>,
					chacune marquée <code>full</code> (une règle la tranche avec un haut niveau de
					confiance), <code>partial</code> (une règle en tranche <em>une partie</em> ; voir les
					notes de périmètre de chaque règle) ou <code>manual</code> (aucune heuristique
					automatisée sûre n’existe). Lancez <code>npm run coverage</code> pour régénérer{" "}
					<code>coverage/coverage-report.md</code>, le détail des facettes par CS.
				</li>
				<li>
					<strong>Règles composites (agrégation par CS WCAG)</strong> (<code>rulesResults[]</code>) :
					un agrégat généré de toutes les règles atomiques associées à un CS, qui vous donne un
					verdict pass/fail/cantTell/notApplicable par CS au lieu de devoir agréger vous-même des
					dizaines de résultats atomiques. Voir{" "}
					<a href={`${core}/docs/RULE_CATALOG.md#composite-wcag-sc-rollup-rules-34`}>
						la liste complète
					</a>{" "}
					(par exemple, <code>wcag-1.1.1-non-text-content</code> agrège 21 règles atomiques).
				</li>
			</ol>

			<h2>Comment le résultat d’une règle composite est calculé</h2>
			<p>Une priorité déterministe, évaluée sur les contributeurs atomiques de la règle composite :</p>
			<DataTable
				caption="Priorité des résultats composites"
				rowKey="id"
				columns={[
					{ key: "condition", label: "Condition", wrap: true, width: "75%" },
					{ key: "outcome", label: "Résultat composite", width: "25%" },
				]}
				rows={precedenceRows}
			/>
			<p>
				Autrement dit : <strong>un <code>pass</code> composite signifie réellement, de façon
				déterministe, que « toutes les vérifications automatisées applicables à ce CS sont
				revenues sans problème », mais ce n’est pas à lui seul une déclaration de conformité
				WCAG.</strong> Si une facette de ce CS n’a aucune couverture automatisée (voir{" "}
				<code>coverage-report.md</code>), un <code>pass</code> composite ne dit rien de cette
				facette ; il n’affirme pas qu’elle est correcte. Consultez le tableau des facettes avant
				de considérer un <code>pass</code> composite comme « CS entièrement vérifié ».
			</p>
			<p>
				Le tableau <code>data.details.contributors</code> d’une règle composite (voir{" "}
				<a href="/results-reports/output-schema/">le schéma de sortie</a>) liste chaque règle
				atomique et son résultat individuel : servez-vous-en pour voir précisément quelle(s)
				facette(s) ont conduit à un <code>fail</code>/<code>cantTell</code>, plutôt que de traiter
				la règle composite comme une boîte noire.
			</p>
			<p>
				Une règle personnalisée (<code>engineOptions.customRules</code>) ou une règle d’un{" "}
				<a href="/configuration/packs/">pack</a> qui s’est exécutée compte dans la règle composite
				de chaque critère auquel elle est associée, par <code>meta.wcagSc</code> ou par une entrée
				WCAG dans <code>meta.normativeMappings</code>, comme une règle intégrée : si elle échoue,
				la règle composite échoue. La règle composite marque une règle personnalisée{" "}
				<code>custom: true</code> parmi ses contributeurs et la liste dans{" "}
				<code>data.details.customChecksIds</code>, puisque les règles personnalisées ne sont pas
				vérifiées par rapport aux spécifications comme le sont les règles intégrées. Une surcharge
				d’une règle intégrée compte là où sa propre correspondance l’indique : à la place de la
				règle intégrée quand elle est associée à ce critère, nulle part quand elle n’est associée
				à aucun (avec un avertissement).
			</p>
			<p>
				Une analyse qui nomme des règles plutôt que des critères (<code>{"includeRuleIds: ['link-name-present']"}</code>,
				un tag qui ne désigne aucun niveau WCAG, les bonnes pratiques) obtient aussi les règles
				composites des critères que ces règles vérifient (voir{" "}
				<a href="/configuration/engine-options/#which-criteria-a-scan-reports">Options du moteur</a>). Avant la 1.12, une telle
				analyse n’en rapportait aucune. Le tableau ci-dessus les tranche : une règle qui échoue
				fait échouer le critère, et les règles que l’analyse n’a pas sélectionnées sont des
				contributeurs qui ne se sont pas exécutés, si bien que le critère est au mieux{" "}
				<code>cantTell</code>, vérifié en partie (<code>reasonCode</code>{" "}
				<code>composite.rollup.cantTell.notSelectedChild</code>, chacun de ces contributeurs
				marqué <code>notSelected: true</code> ; « Vérifié en partie » dans le{" "}
				<a href="/results-reports/html-report/">rapport HTML</a>).
			</p>

			<h2>Cibler un niveau de conformité (A / AA / AAA)</h2>
			<p>Nommez la version et le niveau WCAG dans <code>runOnly.wcag</code> :</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.2 Level A and AA:",
					"runDomRulesInPage(url, null, {}, { wcag: { version: '2.2', level: 'AA' } });",
					"",
					"// The same, and the best-practice rules, which test no WCAG criterion:",
					"runDomRulesInPage(url, null, {}, { wcag: { version: '2.2', level: 'AA' }, bestPractices: true });",
				]}
			/>
			<p>
				Une cible exécute les règles de chaque critère en vigueur dans cette version à ce niveau
				et en dessous, selon le niveau de chaque critère dans cette version (<code>WCAG_CRITERIA</code>{" "}
				dans <code>@surea11y/core/wcag</code>) : 4.1.1 Analyse syntaxique fait donc partie des
				cibles 2.0 et 2.1, et non des cibles 2.2. Elle fixe aussi la version WCAG de l’exécution et
				le niveau des agrégations rapportées. Voir{" "}
				<a href="/configuration/engine-options/#selecting-by-wcag-target-runonlywcag">Sélectionner par cible WCAG</a>.
			</p>
			<p>
				Chaque entrée de <code>WCAG_CRITERIA</code> a aussi l’<code>id</code> que le W3C donne au
				critère dans WCAG 2.2 (<code>non-text-content</code>). Chaque correspondance WCAG que porte
				une règle renvoie à la section de son critère dans la Recommandation de cette version (
				<code>url</code>) et à son document <span lang="en">Understanding</span> (
				<code>understandingUrl</code>), pour 2.1 et 2.2 : les reporters utilisent le document{" "}
				<span lang="en">Understanding</span> comme lien d’aide d’une règle quand la règle n’en a pas
				de propre.
			</p>

			<h3 id="with-tags">Avec des tags</h3>
			<p>
				Les mêmes cibles peuvent s’écrire avec des tags de niveau, dans <code>runOnly.tags</code>{" "}
				(ou <code>engineOptions.tags.include</code>) :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.0 A and AA. Both tags are required: they are not cumulative.",
					"runDomRulesInPage(url, null, {}, { tags: ['wcag2a', 'wcag2aa'] });",
				]}
			/>
			<p>
				<strong>Les tags de niveau ne s’emboîtent pas, et c’est l’erreur la plus facile à faire ici.</strong>{" "}
				Une règle porte un tag de niveau par critère de succès auquel elle correspond, et rien de
				plus : une règle associée uniquement à un critère AA porte le tag <code>wcag2aa</code> et{" "}
				<em>pas</em> <code>wcag2a</code>. Demander <code>{"{ tags: ['wcag2aa'] }"}</code> seul
				exécute donc les 9 règles associées à un critère AA de la version 2.0, et non la centaine
				qui constitue une cible A + AA. Listez chaque niveau que vous visez, ou utilisez{" "}
				<code>runOnly.wcag</code>, qui n’a pas ce problème. <code>engineOptions.profile</code>{" "}
				(<code>wcag22-aa</code>, <code>en301549-v4.1.1</code>, <code>en301549-v3.2.1</code>,{" "}
				<code>section508</code>) le fait aussi pour vous ; voir{" "}
				<a href="/configuration/engine-options/#conformance-profiles">Profils de conformité</a>.
			</p>
			<p>
				Il en va de même d’une version des WCAG à l’autre (un critère introduit en 2.1 ou 2.2 ne
				porte que le tag de sa version d’origine), donc une cible de conformité complète est une
				union d’ensembles de tags. Voir{" "}
				<a href="/configuration/engine-options/#filtering-by-wcag-version">le guide des options du moteur</a> pour
				les ensembles prêts à l’emploi par version, y compris le seul critère que les WCAG 2.2
				ont retiré plutôt qu’ajouté.
			</p>
			<p>
				<strong>Le critère retiré est géré pour vous.</strong> Chaque exécution détermine une
				version WCAG cible (<code>engineOptions.wcagVersion</code>, sinon la{" "}
				<code>wcagVersion</code> du profil de <a href="/configuration/packs/">pack</a> que
				l’exécution applique, sinon la version de <code>runOnly.wcag</code>, sinon celle qu’impliquent vos tags de version, sinon{" "}
				<code>2.2</code>) et la renvoie dans <code>engine.wcagVersion</code>.
				Avec une cible 2.2, une règle associée uniquement au CS 4.1.1 Analyse syntaxique ne peut
				pas renvoyer <code>fail</code> : elle s’exécute, rapporte ses occurrences et renvoie{" "}
				<code>cantTell</code> avec un champ <code>wcagVersionScope</code> qui explique cette
				conversion. Une analyse par défaut ne bloque donc jamais sur un critère absent des WCAG
				2.2, et une analyse 2.0/2.1 obtient toujours un vrai verdict sur le 4.1.1.
			</p>
			<p>
				Les règles composites, contrairement aux règles atomiques, <em>sont</em> filtrées de façon
				cumulative. Le runner lit <code>engineOptions.wcagLevel</code>, sinon le niveau de{" "}
				<code>runOnly.wcag</code>, ou le niveau le plus élevé indiqué dans <code>tags</code>, et
				écarte toutes les règles composites au-dessus : demander{" "}
				<code>{"['wcag2a', 'wcag2aa']"}</code> ne renvoie donc aucune entrée{" "}
				<code>rulesResults</code> pour un CS de niveau AAA uniquement. <code>wcagLevel</code>{" "}
				(<code>'A'</code>, <code>'AA'</code> ou <code>'AAA'</code>) est l’option à définir pour une
				analyse qui nomme des vérifications plutôt qu’une cible : toutes les règles sélectionnées
				s’exécutent toujours, et seuls les critères rapportés sont limités à ce niveau, si bien
				qu’une analyse de <code>contrast-computable</code> au niveau <code>'AA'</code> rapporte le
				1.4.3 et non le 1.4.6, de niveau AAA. L’exécution l’enregistre dans{" "}
				<code>engine.wcagLevel</code>. Voir <code>targetWcagLevelOf</code>/
				<code>isAllowedByTargetLevel</code> dans <code>src/core/dom-runner.js</code> si vous avez
				besoin de l’ordre de priorité exact.
			</p>
			<p>
				Omettez complètement <code>tags</code> (le comportement par défaut) et toutes les règles
				de tous les niveaux s’exécutent, sans suppression de règles composites.
			</p>

			<h2 id="en-301-549">EN 301 549</h2>
			<Callout tone="note" title="Obsolète">
				<p>
					EN 301 549 passe dans son propre pack, <a href={pack}><code>@surea11y/pack-en301549</code></a>, et quitte core en 2.0.0, avec ses
					profils, sa clé <code>mappings</code> et <code>@surea11y/core/en301549</code>. Tout
					fonctionne comme avant, avec un <code>console.warn</code> par processus. Pour changer,
					passez le pack dans <code>engineOptions.packs</code> : l’analyse prend chez lui les mêmes
					noms, et <code>@surea11y/pack-en301549/public</code> a les exports de la table. Voir{" "}
					<a href={`${core}/docs/API_STABILITY.md#deprecating-a-standard-a-profile-or-an-entry-point`}>comment core rend une norme obsolète</a>.
				</p>
			</Callout>
			<p>
				Le chapitre 9 d’EN 301 549 reprend les critères de succès WCAG de niveau A et AA sous forme
				de clauses numérotées <code>9.</code> suivi du numéro du critère : WCAG 1.4.3 est la clause
				9.1.4.3. Quand une analyse les demande, chaque résultat atomique et composite porte, après
				ses entrées WCAG dans <code>meta.normativeMappings</code>, la clause de chacun de ses
				critères, une fois par version de la norme qui inclut ce critère. Une analyse les demande
				avec <code>engineOptions.mappings: ['en301549']</code> (les deux versions) ou{" "}
				<code>['en301549:V3.2.1']</code> (une seule), ou en ciblant un profil EN 301 549, qui ajoute
				la version qu’il nomme ; par défaut, les résultats ne nomment que WCAG (voir{" "}
				<a href="/configuration/engine-options/#other-standards-mappings">Autres normes</a>).
			</p>
			<DataTable
				label="Versions d’EN 301 549"
				rowKey="version"
				columns={[
					{ key: "version", label: "Version", width: "20%" },
					{ key: "builtOn", label: "Fondée sur", wrap: true },
					{ key: "differs", label: "Diffère de l’autre par", wrap: true },
				]}
				rows={[
					{ version: "V3.2.1 (2021-03)", builtOn: "WCAG 2.1 A et AA, 50 critères", differs: "Inclut 9.4.1.1 Analyse syntaxique" },
					{ version: "V4.1.1 (2026-09)", builtOn: "WCAG 2.2 A et AA, 55 critères", differs: "Ajoute 2.4.11, 2.5.7, 2.5.8, 3.2.6, 3.3.7, 3.3.8 ; 9.4.1.1 est sans objet" },
				]}
			/>
			<p>
				Chaque entrée de clause nomme aussi le critère qu’elle reprend, sous la forme{" "}
				<code>{'wcagSc: ["1.4.3"]'}</code>, pour qu’une vue regroupée par critère (les suites{" "}
				<a href="/results-reports/junit-report/">JUnit</a>, l’agrégation du{" "}
				<a href="/results-reports/html-report/">rapport HTML</a>) la place sous le bon critère, même
				pour une règle associée à plusieurs. Les critères AAA n’ont de clause dans aucune version.
				Les catalogues nomment les clauses avec les mêmes options :{" "}
				<code>{"getChecksCatalog({ mappings: ['en301549'] })"}</code> dans le{" "}
				<code>normativeMappings</code> de chaque entrée, et les entrées composites renvoyées par{" "}
				<code>{"getRulesCatalog({ mappings: ['en301549'] })"}</code> sous{" "}
				<code>meta.standardMappings</code> : on peut donc lire les clauses d’un critère sans lancer
				d’analyse.
			</p>
			<p>
				La table est publique sous <code>@surea11y/core/en301549</code>, pour les outils qui ont
				besoin de la vue inverse, par exemple les critères qu’une version exige et qu’une analyse n’a
				pas couverts :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { EN301549_CLAUSES, en301549ClausesForSc } = require('@surea11y/core/en301549');",
					"",
					"Object.keys(EN301549_CLAUSES['V3.2.1']);  // the 50 WCAG 2.1 A and AA criteria V3.2.1 restates",
					"en301549ClausesForSc('2.5.8');            // [{ version: 'V4.1.1', clause: '9.2.5.8', title: 'Target size (minimum)' }]",
				]}
			/>
			<p>
				<strong>C’est une correspondance entre deux documents publiés, pas une déclaration de
				conformité</strong> : une clause sur un résultat indique quelle exigence d’EN 301 549 est ce
				critère WCAG, rien de plus. Quelle version une loi donnée exige ne relève pas du moteur.
			</p>
			<p>
				EN 301 549 est une entrée d’un registre de normes que lisent l’exécuteur, le catalogue de
				règles et les générateurs de rapports. Une norme qui a ses propres verdicts (des exigences
				que vérifient ses propres règles, par exemple une norme nationale comme le RGAA), ou la
				liste de contrôle d’une organisation, prend la forme d’un{" "}
				<a href="/configuration/packs/">pack</a> : un paquet à part, hors de core, qu’une analyse
				reçoit dans <code>engineOptions.packs</code> et dont l’entrée rejoint le registre pour cette
				analyse, avec ses propres profils, règles et agrégations. Une règle personnalisée peut
				nommer n’importe quelle norme dans ses propres <code>normativeMappings</code>, mais seules
				les normes enregistrées (celles de core et celles des packs de l’analyse) ont un profil, un
				commutateur <code>mappings</code>, des règles optionnelles, des agrégations ou une place
				dans SARIF, JUnit et le rapport HTML. La façon d’intégrer une norme à core lui-même est
				décrite dans{" "}
				<a href={`${core}/docs/WCAG_CONFORMANCE.md#adding-another-standard`}>
					<code>WCAG_CONFORMANCE.md</code>
				</a>
				, le guide des contributeurs sur GitHub.
			</p>

			<h2 id="what-this-engine-cannot-tell-you">Ce que ce moteur ne peut pas vous dire</h2>
			<p>
				<strong>Aucun outil automatisé, celui-ci compris, ne peut certifier une conformité WCAG complète.</strong>{" "}
				Ce n’est pas une limite propre à surea11y ; elle est inhérente aux WCAG elles-mêmes : une
				part importante des critères de succès exige un jugement humain (ce texte alternatif
				est-il <em>exact</em>, et pas seulement <em>présent</em> ; ce message d’erreur est-il{" "}
				<em>compréhensible</em>) ou des tests dynamiques que l’architecture d’analyse statique du
				DOM de ce moteur ne permet pas du tout (détection des pièges au clavier, mise en page et
				redistribution réelles au zoom). Voir{" "}
				<a href="/help/known-limitations/">les limites connues</a> pour la liste complète et
				explicite de ce qui est hors périmètre, et pourquoi.
			</p>
			<p>Ce que surea11y <em>peut</em> vous apporter, honnêtement :</p>
			<ul>
				<li>
					Les règles intégrées à core sont écrites pour ne renvoyer <code>fail</code> que sur une
					violation normative et déterministe de la norme et de la version ciblées, et pour
					renvoyer <code>cantTell</code> quand elles ne peuvent pas être sûres. C’est un objectif de
					conception, pas une garantie : les{" "}
					<a href="/help/known-limitations/">limites connues</a> listent des cas limites où une
					règle peut encore se tromper, les occurrences de chaque constat montrent sur quoi il a
					été décidé, et le <a href="/rules/">catalogue des règles</a> donne la confiance de chaque
					règle. La précision d’une règle personnalisée, d’une règle de pack ou d’une surcharge dépend de la façon dont elle a été implémentée.
					Par défaut, cette norme est WCAG. Une règle portant sur une exigence que seule une autre
					norme impose est optionnelle : par défaut, elle ne s’exécute que si vous ciblez cette
					norme (voir{" "}
					<a href="/configuration/engine-options/#opt-in-rules">Règles optionnelles</a>).{" "}
					<code>engineOptions.optInRules</code> débloque les règles optionnelles sans retirer le
					profil ni les filtres de l’analyse. Avec <code>optInRules: 'all'</code> et sans profil
					ni filtre, l’exécution couvre toutes les règles et ne vise aucune norme en particulier ;
					une liste de tags ne débloque que ces groupes de règles optionnelles.{" "}
					<code>engine.optInRules</code> liste les tags dont les règles se sont exécutées. Sous un profil WCAG, une règle débloquée ne
					s’exécute que si ses tags correspondent à ce profil, et l’exécution vise toujours WCAG.
					Parmi les
					règles de core, une analyse qui vise WCAG n’exécute donc que celles des critères ciblés,
					plus les règles de bonnes pratiques si vous les ajoutez. Une règle de bonne pratique ne
					nomme aucun critère, et peut quand même renvoyer <code>fail</code> là où ce qu’elle
					trouve est en soi un obstacle, comme un titre vide (
					<a href="/rules/empty-heading/"><code>empty-heading</code></a>) ; aucune règle composite
					WCAG n’en tient compte. Une règle personnalisée, une
					surcharge ou une règle de pack sans tag optionnel s’exécute quand la sélection l’inclut, et
					peut alors renvoyer un <code>fail</code> pour une vérification qui lui est propre et que
					WCAG n’exige pas.
				</li>
				<li>
					Chaque <code>cantTell</code> est un signalement explicite pour une revue humaine, pas
					une incertitude passée sous silence.
				</li>
				<li>
					Le tableau de couverture des facettes vous indique exactement quelles parties de quels
					CS n’ont aucune couverture automatisée : vous savez ainsi où un <code>pass</code> ne dit
					rien plutôt que d’être exhaustif.
				</li>
			</ul>
			<p>
				Un <code>pass</code> composite sur tous les CS de votre niveau cible signifie : <em>toutes
				les vérifications automatisables pour ce niveau sont revenues sans problème.</em> C’est la
				part automatisable de la conformité, énoncée précisément, et non un substitut à la revue
				manuelle que les WCAG exigent elles-mêmes.
			</p>
		</>
	);
}
