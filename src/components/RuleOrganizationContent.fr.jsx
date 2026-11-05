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
					ici, dans les situations suivantes : une violation réelle existe mais n’établit pas à elle seule
					l’échec du critère WCAG associé (une exigence d’auteur ARIA, ou le modèle de contenu HTML,
					dont le nom, le rôle ou la valeur exposés restent valables : depuis core 1.15, incertitude{" "}
					<code>spec-only</code>, dans les règles de structure ARIA et HTML) ; la règle établit de façon déterministe qu’une bonne
					pratique n’est pas respectée, ne revendique aucun critère de succès, et ce qu’elle a
					trouvé ne gêne pas forcément qui que ce soit, puisque le rôle ou l’élément parvient tel
					quel aux technologies d’assistance (<code>aria-allowed-role</code>,{" "}
					<code>landmark-role-name-present</code>, marquées comme bonne pratique) ; ou la règle peut seulement confirmer qu’un mécanisme est <em>présent</em>,
					tandis que la validité de ce qui est présent relève d’une règle sœur
					(<code>aria-required-children</code>, associée à{" "}
					<code>aria-prohibited-children</code>) ; ou la règle ne peut pas trancher sans supposer,
					et pose donc la question au lieu d’échouer : un nom qui peut provenir d’une shadow root
					fermée, d’un <code>ElementInternals</code> que le moteur ne peut pas lire, ou d’un contenu imbriqué trop profondément pour être lu (les règles{" "}
					<code>*-name-present</code>), un texte qui peut être tronqué ou se chevaucher une fois
					espacé (<code>text-spacing-content-loss</code>), un bloc de media query d’orientation qui
					fait pivoter un autre élément que le contenu de la page (
					<code>css-orientation-lock</code>), un texte de placeholder sous son rapport dont on ne
					peut pas dire si les couleurs sont celles de la page ou du navigateur, ou un caractère
					isolé qui tient lieu de nom à son contrôle sous son rapport (<code>contrast-minimum</code>), ou une couleur ou une taille impossible à calculer (les
					règles de contraste, <code>target-size-minimum</code>). Une règle qui lève une exception
					est également signalée comme <code>cantTell</code>, par sécurité.
				</li>
				<li>
					<strong>manuelle</strong> : signale qu’une personne doit trancher ; la règle ne peut pas
					trancher si ce qu’elle a trouvé pose problème. Rapporte <code>cantTell</code> ou{" "}
					<code>notApplicable</code>, et <code>pass</code> seulement lorsque la réponse qui ne
					demande aucun jugement est celle qui a été trouvée ; jamais <code>fail</code>.{" "}
					<a href="/rules/landmark-unique/"><code>landmark-unique</code></a> ne peut pas trancher si
					deux landmarks qui partagent un nom posent problème (l’APG l’admet quand leur contenu est
					identique), c’est donc <code>cantTell</code> ; mais « tous les noms diffèrent » est un
					fait, c’est donc <code>pass</code>. Une règle qui demande à une personne de juger chaque
					cible qu’elle trouve, par exemple si l’alternative textuelle d’une image est exacte, ne
					rapporte jamais <code>pass</code>. Une règle manuelle qui ne pose la question que là où
					une heuristique trouve un indice, et n’en trouve aucun, rapporte{" "}
					<code>notApplicable</code>, pas <code>pass</code> : elle ne s’applique qu’à ce que son
					heuristique signale, et ne rien y trouver ne montre pas que tout va bien.{" "}
					<a href="/rules/image-redundant-alt/"><code>image-redundant-alt</code></a> cherche une alternative textuelle qui répète le texte
					voisin de l’image ; n’en trouver aucune ne dit rien de la justesse de l’alternative.{" "}
					<a href="/rules/form-control-label-quality/"><code>form-control-label-quality</code></a>, <a href="/rules/password-paste-enabled/"><code>password-paste-enabled</code></a>,{" "}
					<a href="/rules/scrollable-region-focusable/"><code>scrollable-region-focusable</code></a> et <a href="/rules/image-of-text/"><code>image-of-text</code></a> font de même.
				</li>
			</ul>
			<p>
				Une règle marquée comme bonne pratique ne revendique aucun critère de succès, et rapporte
				pourtant <code>fail</code> quand ce qu’elle établit est en soi un obstacle : un titre vide
				est annoncé comme un titre sans rien dedans (
				<a href="/rules/empty-heading/"><code>empty-heading</code></a>, comme le rapporte la règle
				ACT du W3C correspondante). Son <code>fail</code> dit que l’attente propre à la règle n’est
				pas remplie, pas celle d’un critère : aucune agrégation WCAG n’en tient compte. Là où le
				constat ne gêne peut-être personne, elle rapporte <code>cantTell</code> à la place, comme
				ci-dessus.
			</p>
			<p>
				<strong>Une règle manuelle qui rapporte <code>cantTell</code> ne correspond pas au même
				événement qu’une règle automatique qui rapporte <code>cantTell</code>, même si la valeur
				est identique</strong> : la règle automatique a tranché et vous dit ce qu’elle a trouvé ;
				la règle manuelle vous dit que la question ne peut pas du tout être tranchée à partir du
				balisage. Dans les deux cas, le <code>cantTell</code> d’une règle de core dit comment y
				répondre (<code>howToCheck</code>), et certains disent vers où pointent les indices de la
				page (<code>lean</code>, voir le{" "}
				<a href="/results-reports/output-schema/#leans">schéma de sortie</a>). Voir{" "}
				<a href="/results-reports/output-schema/">Résultats et rapports</a> pour la
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
				un composite ne réussit que si ses règles vérifient tout ce que demande le critère, et
				aucun ne le fait encore. Là où chaque vérification automatisée d’un critère revient sans
				erreur, le composite est donc{" "}
				<ResultBadge lang="en" state="unknown" size="sm" />, vérifié en partie :{" "}
				<strong>les facettes que couvrent ses règles sont respectées, et une personne vérifie le
				reste</strong>. Voir{" "}
				<a href="/conformance/wcag-mapping/">Conformité</a> pour les trois couches (règles
				atomiques, facettes, composites) et la façon dont le résultat d’un composite est
				réellement calculé. Chaque facette d’un critère qu’évalue une règle a une procédure,
				la façon dont une personne la vérifie à la main (voir{" "}
				<a href="/conformance/procedures/">Procédures de test</a>).
			</p>
		</>
	);
}
