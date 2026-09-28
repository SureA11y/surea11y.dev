import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";

const formatRows = [
	{ format: <code>JSON</code>, use: "Intégration, stockage et traitements propres", audience: "Développeurs et plateformes" },
	{ format: "HTML", use: "Revue humaine d’une analyse précise", audience: "QA et audit" },
	{ format: "SARIF", use: "Intégration avec les outils d’analyse de code", audience: "Équipes de développement et de sécurité" },
	{ format: "EARL", use: "Interopérabilité et preuve de conformité ACT", audience: "Normes, recherche et conformité" },
];

export function ResultsReportsContent() {
	return (
		<>
			<p>
				Chaque analyse renvoie un unique objet JSON : rien de caché, rien à reconstituer. Les trois
				formats de rapport ci-dessous reposent directement sur ce même objet, chacun pensé pour un
				lecteur différent : une personne qui parcourt un onglet de navigateur, un tableau de bord de
				CI qui ne comprend que SARIF, ou le format de rapport d’implémentation du W3C lui-même.
				Choisissez la forme adaptée à qui va réellement le lire.
			</p>
			<DataTable
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
				Vous l’ouvrez, vous le comprenez : pas de serveur, pas d’étape de build, pas de JSON à
				déchiffrer. Un résumé en langage clair en haut, une agrégation WCAG regroupée par niveau de
				conformité, issue des résultats composites du moteur lui-même, et un tableau complet
				consultable en dessous pour qui veut creuser. C’est le rapport à remettre à un relecteur qui
				ne veut pas lire la sortie brute. Voir{" "}
				<a href="/results-reports/html-report/">Rapport HTML</a>.
			</p>

			<h2>Rapport SARIF</h2>
			<p>
				Envoyez une analyse directement dans GitHub Code Scanning ou tout autre tableau de bord
				compatible SARIF, sans écrire de convertisseur vous-même. Les violations deviennent des
				résultats SARIF avec une empreinte stable, fondée sur le contenu, si bien qu’une{" "}
				<a href="/conformance/baseline/">baseline / allowlist</a>{" "}
				filtre toujours proprement et qu’un tableau de bord peut suivre un résultat d’un commit à
				l’autre au lieu de le perdre dès qu’un numéro de ligne change. Voir{" "}
				<a href="/results-reports/sarif-report/">Rapport SARIF</a>.
			</p>

			<h2>Rapport EARL</h2>
			<p>
				Un rapport d’implémentation W3C EARL/JSON-LD <strong>qui atteste le résultat de chaque
				règle, pas seulement les échecs</strong>, le format que le groupe communautaire ACT Rules
				accepte comme preuve qu’un moteur implémente réellement ce qu’il annonce. Une preuve utile
				quand une déclaration de conformité ACT doit être vérifiable, et pas seulement affirmée.
				Voir <a href="/results-reports/earl-report/">Rapport EARL</a>.
			</p>
		</>
	);
}
