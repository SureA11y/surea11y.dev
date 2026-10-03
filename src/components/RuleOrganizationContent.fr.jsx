import React from "react";
import rules from "../data/rules.generated.json";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { ResultBadge } from "./design-system/results/ResultBadge.jsx";

const familyRows = [
	{ id: "present", ruleId: <code>img-alt-present</code>, family: <code>img</code>, intent: <code>present</code>, type: "automatique" },
	{ id: "quality", ruleId: <code>img-alt-quality</code>, family: <code>img</code>, intent: <code>quality</code>, type: "manuelle" },
	{ id: "decorative", ruleId: <code>img-alt-decorative</code>, family: <code>img</code>, intent: <code>decorative</code>, type: "manuelle" },
];

export function RuleOrganizationContent() {
	return (
		<>
			<p>
				Cette page décrit la structure des {rules.length} règles du <a href="/rules/">catalogue</a>, ce qui
				aide à interpréter un résultat ou à trouver la règle que vous cherchez. Elle reflète ce qui
				existe déjà dans le jeu de règles, pas une conception abstraite.
			</p>

			<h2>Automatique ou manuelle</h2>
			<p>
				Le <code>type</code> de chaque règle prend l’une de deux valeurs, et la différence tient à
				ce que la règle est <em>capable de trancher</em>, pas au résultat qu’elle renvoie dans un
				cas donné :
			</p>
			<ul>
				<li>
					<strong>automatique</strong> : tranche de façon déterministe, sans heuristique ni
					supposition. Peut rapporter <code>fail</code>. <code>cantTell</code> apparaît quand même
					ici, dans trois situations : une violation réelle existe mais n’établit pas à elle seule
					l’échec du critère WCAG associé (une exigence d’auteur ARIA dont le nom, le rôle ou la
					valeur exposés restent valables) ; la règle tranche de façon déterministe mais ne
					revendique aucun critère de succès (<code>aria-allowed-role</code>, marquée comme bonne
					pratique) ; ou la règle peut seulement confirmer qu’un mécanisme est <em>présent</em>,
					tandis que la validité de ce qui est présent relève d’une règle sœur
					(<code>aria-required-children</code>, associée à{" "}
					<code>aria-prohibited-children</code>).
				</li>
				<li>
					<strong>manuelle</strong> : signale qu’une personne doit trancher ; la règle ne peut pas
					du tout résoudre la question à partir du balisage. Limitée à{" "}
					<code>cantTell</code>/<code>notApplicable</code>, jamais <code>fail</code>.
				</li>
			</ul>
			<p>
				<strong>Une règle manuelle qui rapporte <code>cantTell</code> ne correspond pas au même
				événement qu’une règle automatique qui rapporte <code>cantTell</code>, même si la valeur
				est identique</strong> : la règle automatique a tranché et vous dit ce qu’elle a trouvé ;
				la règle manuelle vous dit que la question ne peut pas du tout être tranchée à partir du
				balisage. Voir <a href="/results-reports/output-schema/">Résultats et rapports</a> pour la
				référence complète sur les résultats, la sévérité et la confiance.
			</p>

			<h2>Structure des identifiants de règle</h2>
			<p>
				Un identifiant de règle suit généralement la forme{" "}
				<code>&lt;family&gt;-&lt;intent&gt;</code> : les éléments ou le mécanisme ciblés par la
				règle, puis la question qu’elle pose à leur sujet. La famille des alternatives aux images
				(WCAG 1.1.1) en est l’exemple le plus clair :
			</p>
			<DataTable
				label="Exemples d’identifiants de règle"
				rowKey="id"
				columns={[
					{ key: "ruleId", label: "Identifiant de règle", mono: true },
					{ key: "family", label: "Famille", mono: true },
					{ key: "intent", label: "Intention", mono: true },
					{ key: "type", label: "Type" },
				]}
				rows={familyRows}
			/>
			<ul>
				<li><code>present</code> : vérifie qu’un mécanisme requis existe. Généralement automatique.</li>
				<li><code>quality</code> : vérifie la pertinence, l’exactitude ou le sens. Toujours manuelle.</li>
				<li><code>decorative</code> : vérifie le traitement correct d’un contenu purement décoratif. Toujours manuelle.</li>
			</ul>
			<p>
				L’intention détermine si une règle <em>peut</em> être automatique : « quelque chose est-il
				présent ? » peut souvent se trancher à partir du seul balisage, alors que « est-ce
				pertinent ? » ne le peut presque jamais. C’est aussi la logique des liens{" "}
				<strong>Règles associées</strong> sur chaque page de règle : les règles qui partagent une
				famille (tout ce qui précède le dernier segment <code>-</code> de l’identifiant) y sont
				regroupées. Le jeu de règles couvre des dizaines de familles au-delà de <code>img</code>{" "}
				(<code>aria-*</code>, <code>contrast-*</code>, <code>dialog-*</code>,{" "}
				<code>iframe-*</code>, <code>label-*</code>, <code>link-*</code>, <code>list-*</code>,{" "}
				<code>landmark-*</code> et d’autres) ; le <a href="/rules/">catalogue</a> en est la liste
				actuelle, générée automatiquement.
			</p>
			<p>
				Les règles ne mélangent jamais les familles : chacune interroge un seul type d’élément,
				avec les helpers adaptés. C’est aussi pourquoi le jeu compte {rules.length} règles ciblées plutôt
				qu’une douzaine de règles larges : deux vérifications qui diffèrent par ce qu’elles
				tranchent, ce qu’elles ciblent ou la facette WCAG qu’elles couvrent restent des règles
				distinctes au lieu d’être fusionnées, pour qu’un résultat n’ait jamais à être démêlé après
				coup pour savoir ce qui a été trouvé précisément.
			</p>

			<h2>Facettes WCAG</h2>
			<p>
				Un critère de succès WCAG est généralement plus large que ce qu’une seule règle peut
				trancher de façon déterministe. En interne, chaque critère est découpé en « facettes »
				nommées : pour le 1.1.1 Contenu non textuel, il s’agit par exemple de savoir si un
				attribut <code>alt</code> est présent, si son texte a du sens, et si les images
				décoratives sont correctement marquées par un attribut <code>alt</code> vide. Une règle correspond à une ou
				plusieurs facettes, et plusieurs règles couvrent souvent différentes facettes du même
				critère, ce que fait exactement la famille img-alt ci-dessus pour le 1.1.1.
			</p>
			<p>
				C’est important pour lire un résultat composite (agrégation par critère de succès WCAG) :
				un <ResultBadge lang="en" state="pass" size="sm" /> composite signifie que chaque vérification
				automatisée de ce critère est revenue sans erreur, mais{" "}
				<strong>si une facette n’a aucune couverture automatisée, le composite ne dit rien de
				cette facette au lieu d’affirmer qu’elle est correcte</strong>. Voir{" "}
				<a href="/conformance/wcag-mapping/">Conformité</a> pour les trois couches (règles
				atomiques, facettes, composites) et la façon dont le résultat d’un composite est
				réellement calculé.
			</p>
		</>
	);
}
