import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";

const formatRows = [
	{ format: <code>JSON</code>, use: "Intégration, stockage et traitements propres", audience: "Développeurs et plateformes" },
	{ format: "HTML", use: "Revue humaine d’une analyse précise", audience: "QA et audit" },
	{ format: "SARIF", use: "Intégration avec les outils d’analyse de code", audience: "Équipes de développement et de sécurité" },
	{ format: "JUnit", use: "Vues de tests des tableaux de bord de CI", audience: "Équipes de développement et QA" },
	{ format: "EARL", use: "Interopérabilité et rapport d’implémentation ACT", audience: "Normes, recherche et conformité" },
];

export function ResultsReportsContent() {
	return (
		<>
			<p>
				Chaque analyse renvoie un unique objet JSON. Les quatre formats de rapport ci-dessous sont
				générés à partir de ce même objet, chacun pensé pour un
				lecteur différent : une personne qui parcourt un onglet de navigateur, un tableau de bord
				d’analyse de code qui ne comprend que SARIF, une vue de tests de CI qui lit JUnit, ou le format de rapport d’implémentation du W3C lui-même.
				Choisissez la forme adaptée à la personne qui va réellement le lire.
			</p>
			<DataTable
				label="Formats de sortie"
				rowKey="format"
				columns={[
					{ key: "format", label: "Format" },
					{ key: "use", label: "Usage principal", wrap: true },
					{ key: "audience", label: "Public" },
				]}
				rows={formatRows}
			/>

			<h2>Schéma de sortie</h2>
			<p>
				Le contrat exact que renvoie chaque runner, et celui dont dérive chaque autre format de
				rapport : une enveloppe de résultat de premier niveau, une entrée par règle (y compris
				chaque <code>pass</code> et <code>notApplicable</code>, jamais une simple liste de
				violations), le détail de chaque occurrence jusqu’à l’élément signalé, des codes
				d’incertitude explicites pour tout ce qu’une règle n’a pas pu trancher, et les agrégations
				composites par critère de succès WCAG. À lire une fois si vous construisez quoi que ce soit
				sur un résultat brut. Voir <a href="/results-reports/output-schema/">Schéma de sortie</a>{" "}
				pour la structure complète.
			</p>

			<h2>Rapport HTML</h2>
			<p>
				Un seul fichier HTML qui s’ouvre dans n’importe quel navigateur, sans serveur ni étape de
				build. Un résumé en langage clair en haut, une agrégation WCAG regroupée par niveau de
				conformité, issue des résultats composites du moteur lui-même, et un tableau complet
				consultable en dessous pour qui veut creuser. C’est le rapport à remettre à un relecteur qui
				ne veut pas lire la sortie brute. Voir{" "}
				<a href="/results-reports/html-report/">Rapport HTML</a>.
			</p>

			<h2>Rapport SARIF</h2>
			<p>
				Envoyez une analyse directement dans <span lang="en">GitHub Code Scanning</span> ou tout autre tableau de bord
				compatible SARIF, sans écrire de convertisseur vous-même. Les violations deviennent des
				résultats SARIF avec une empreinte stable, fondée sur le contenu, si bien qu’une{" "}
				<a href="/conformance/baseline/">baseline / allowlist</a>{" "}
				filtre toujours de façon fiable et qu’un tableau de bord peut suivre un constat d’un commit à
				l’autre au lieu de le perdre dès qu’un numéro de ligne change. Un journal sans résultat
				signifie que rien n’a échoué ni ne demande de revue parmi les vérifications exécutées ;
				ce n’est pas une déclaration de conformité. Voir{" "}
				<a href="/results-reports/sarif-report/">Rapport SARIF</a>.
			</p>

			<h2>Rapport JUnit</h2>
			<p>
				Affichez les résultats d’accessibilité dans la vue de tests dont votre CI dispose déjà (le
				widget de merge request de GitLab, l’onglet Tests d’Azure DevOps, Jenkins, CircleCI), à côté
				de vos tests unitaires. Chaque critère WCAG est une suite et chaque règle un test : un défaut
				répété sur une page est un seul test en échec, et les décomptes restent stables d’une
				exécution à l’autre. <code>cantTell</code> arrive sous forme de test ignoré, visible sans
				faire passer le build au rouge. Les noms des suites sont les mêmes dans toutes les
				langues : l’historique des tests ne repart pas de zéro quand la langue de l’analyse
				change. Une suite verte signifie que les règles exécutées pour un critère n’ont rien
				trouvé, pas que le critère est satisfait. Voir{" "}
				<a href="/results-reports/junit-report/">Rapport JUnit</a>.
			</p>

			<h2>Rapport EARL</h2>
			<p>
				Un rapport d’implémentation W3C EARL/JSON-LD, lisible par machine, <strong>qui atteste le
				résultat de chaque règle, pas seulement les échecs</strong>. C’est le format que le groupe
				communautaire <span lang="en">ACT Rules</span> accepte comme rapport d’implémentation :
				exécuté sur les cas de test ACT, il consigne le résultat obtenu pour chacun, ce qui permet
				de vérifier comment le moteur applique chaque règle plutôt que de simplement l’affirmer. Il
				ne s’agit ni d’une certification ni d’une preuve de conformité WCAG : figurer parmi les
				implémentations ACT n’est pas une validation par le W3C. Voir <a href="/results-reports/earl-report/">Rapport EARL</a>.
			</p>
		</>
	);
}
