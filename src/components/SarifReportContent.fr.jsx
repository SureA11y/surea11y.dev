import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const sarifLevelRows = [
	{ id: "fail", outcome: <code>fail</code>, level: <code>error</code>, meaning: "Violation déterministe : le cas qui bloque la CI." },
	{ id: "cantTell", outcome: <code>cantTell</code>, level: <code>warning</code>, meaning: "Nécessite une revue humaine : signalé, mais ne devrait pas à lui seul bloquer un build." },
];

const sarifFieldRows = [
	{ id: "ruleId", field: <code>results[].ruleId</code>, source: <code>checksResults[i].ruleId</code> },
	{ id: "message", field: <code>results[].message.text</code>, source: <><code>occurrence.summary</code> + <code>occurrence.hint</code></> },
	{ id: "uri", field: <code>results[].locations[].physicalLocation.artifactLocation.uri</code>, source: <>La cible analysée ; voir <a href="#sarif-locations">Emplacements</a> ci-dessous.</> },
	{ id: "fqn", field: <code>results[].locations[].logicalLocations[].fullyQualifiedName</code>, source: <><code>occurrence.selector</code>, lorsqu’il est présent.</> },
	{
		id: "fingerprint",
		field: <code>results[].partialFingerprints["surea11y/violation/v1"]</code>,
		source: (
			<>
				La même clé d’identité <code>ruleId + reasonCode + html</code> que celle utilisée par{" "}
				<a href="/conformance/baseline/">Baseline / allowlist</a> (<code>computeBaselineKey</code>) :
				une empreinte stable fondée sur le contenu plutôt que sur la position, pour les
				consommateurs qui la lisent.
			</>
		),
	},
	{
		id: "lineHash",
		field: <code>results[].partialFingerprints.primaryLocationLineHash</code>,
		source: (
			<>
				Un hachage de cette clé, <code>&lt;16 hex digits&gt;:&lt;n&gt;</code>, où <code>n</code> compte
				un constat répété sur la page (le même composant défectueux deux fois). <span lang="en">GitHub Code Scanning</span>{" "}
				fait correspondre les alertes d’un envoi à l’autre sur ce seul champ. Un constat issu du DOM
				n’a pas de ligne que l’action d’envoi de GitHub pourrait hacher ; sans ce champ, les alertes
				étaient donc mises en correspondance par position, et corriger un constat pouvait fermer
				l’alerte d’un autre. Si vous venez de core 1.8 ou d’une version antérieure, le premier envoi
				ferme les alertes existantes et les rouvre comme nouvelles, une seule fois ; une alerte
				ignorée dans GitHub doit l’être à nouveau.
			</>
		),
	},
	{ id: "props", field: <><code>results[].properties.severity</code> / <code>.confidence</code> / <code>.reasonCode</code> / <code>.html</code></>, source: <>Les <code>severity</code>/<code>confidence</code> du résultat lui-même, plus le même <code>reasonCode</code> et le même extrait <code>html</code> sur lesquels repose l’empreinte ci-dessus ; à titre informatif, hors du schéma propre à SARIF.</> },
	{ id: "tags", field: <code>tool.driver.rules[].properties.tags</code>, source: <><code>accessibility</code>, <code>automatic</code>/<code>manual</code>, et un tag <code>wcag-&lt;SC&gt;</code> par critère de succès WCAG présent dans <code>meta.normativeMappings</code>. Les entrées de documents Understanding n’ont pas de tag. Chaque clause d’EN 301 549 que porte le résultat (seulement quand l’analyse les a demandées, voir <a href="/configuration/engine-options/#other-standards-mappings">Autres normes</a>) reçoit un tag <code>en301549-&lt;clause&gt;</code>, p. ex. <code>en301549-9.1.1.1</code> : les numéros de clause sont les mêmes dans toutes les versions qui les contiennent, le tag ne porte donc pas de version.</> },
	{ id: "category", field: <code>runs[0].automationDetails.id</code>, source: <>L’option <code>category</code>, avec un <code>/</code> final ajouté s’il n’y en a pas (GitHub lit tout ce qui précède la dernière barre oblique comme la catégorie). Absent lorsqu’aucune catégorie n’est fournie. Voir <a href="#scanning-at-several-viewport-widths">Analyser à plusieurs largeurs de viewport</a>.</> },
	{ id: "runProps", field: <code>runs[0].properties</code>, source: <><code>wcagVersion</code>, <code>profile</code>, <code>optInRules</code> et <code>environment</code> issus de l’<code>engine</code> du résultat : la cible de conformité utilisée par l’exécution, pour qu’un tableau de bord distingue une exécution WCAG 2.1 d’une exécution 2.2, les tags de règles optionnelles qu’elle a ajoutés au-delà de cette cible, s’il y en a, et les conditions dans lesquelles la page a été rendue (<code>layout</code>, <code>viewport</code>, <code>devicePixelRatio</code>, <code>colorScheme</code>, <code>fonts</code> ; voir <a href="/results-reports/output-schema/">Schéma de sortie</a>). Omis pour les résultats de moteurs antérieurs à ces champs.</> },
];

export function SarifReportContent() {
	return (
		<>
			<p>
				<code>--sarif &lt;path&gt;</code> écrit un journal{" "}
				<a href="https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html">SARIF 2.1.0</a>{" "}
				(le format standard qu’attendent <span lang="en">GitHub Code Scanning</span> et les autres tableaux de bord
				compatibles SARIF) à la place du résultat brut du moteur produit par <code>--json</code>,
				ou en plus de celui-ci.
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --sarif results.sarif", command: true }]} />
			<p>
				Voir <a href="/configuration/ci-integration/">Intégration CI</a> pour un workflow <span lang="en">GitHub
				Actions</span> prêt à copier qui lance une analyse et envoie <code>results.sarif</code> vers
				l’onglet « <span lang="en">Security</span> ».
			</p>

			<h2>Pourquoi un format distinct de <code>--json</code></h2>
			<p>
				Le résultat brut de <code>--json</code> (voir <a href="/results-reports/output-schema/">Schéma de sortie</a>)
				est le contrat propre à ce moteur, versionné et stable selon{" "}
				<a href={`${core}/docs/API_STABILITY.md`}><code>API_STABILITY.md</code></a>. SARIF est un
				contrat différent, défini à l’extérieur et conçu spécialement pour les tableaux de bord
				d’analyse de code : une entrée de <code>checksResults[]</code> et un <code>result</code>{" "}
				SARIF ne se correspondent pas un à un, donc{" "}
				<strong>il s’agit d’une véritable conversion, pas d’une simple re-sérialisation</strong>.
			</p>

			<h2>Ce qui devient un résultat SARIF</h2>
			<p>
				<strong>Seules les occurrences <code>fail</code>/<code>cantTell</code> produisent des résultats SARIF</strong>{" "}
				(la même approche « violations uniquement » que le{" "}
				<a href="/results-reports/html-report/">rapport HTML</a>).
			</p>
			<p>
				Une vérification <code>notApplicable</code> n’est pas toujours vide : une règle peut
				joindre une occurrence expliquant pourquoi elle n’avait rien à juger, ce que font les
				règles de contraste lorsqu’aucun texte n’avait d’arrière-plan calculable. Ces occurrences
				ne deviennent jamais des résultats (un consommateur traite chaque résultat comme une
				alerte, et « ceci n’a pas été évalué » n’en est pas une), mais elles ne sont pas non plus
				abandonnées. Elles sont transmises comme entrées de niveau <code>note</code> dans{" "}
				<code>runs[0].invocations[0].toolExecutionNotices</code>, chacune indiquant la règle dont
				elle provient via <code>associatedRule.id</code> :
			</p>
			<CodeBlock
				lang="json"
				lines={[
					'"invocations": [',
					"  {",
					'    "executionSuccessful": true,',
					'    "toolExecutionNotices": [',
					"      {",
					'        "level": "note",',
					'        "message": { "text": "No eligible text had computable contrast (eligible text nodes: 13). See the contrast computability rule for details." },',
					'        "associatedRule": { "id": "contrast-minimum" }',
					"      }",
					"    ]",
					"  }",
					"]",
				]}
			/>
			<p>
				<strong>Cela évite qu’un pipeline uniquement SARIF interprète le silence comme un
				certificat de bonne santé</strong> : l’absence d’alerte de contraste peut signifier que la
				page est correcte, ou que le contraste n’a jamais pu être calculé, et seule la notice
				permet de distinguer les deux. Le bloc n’est émis que s’il y a quelque chose à signaler :
				une exécution sans rien à rapporter n’a donc aucune clé <code>invocations</code>.
			</p>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "outcome", label: "Résultat du moteur", width: "22%" },
					{ key: "level", label: "Niveau SARIF", width: "18%" },
					{ key: "meaning", label: "Signification", wrap: true },
				]}
				rows={sarifLevelRows}
			/>
			<p>
				Chaque règle exécutée (qu’elle ait produit un résultat ou non) est listée une fois dans{" "}
				<code>runs[0].tool.driver.rules</code>, avec <code>defaultConfiguration.level</code>{" "}
				défini d’après le <code>type</code> de la règle : <code>automatic</code> (peut renvoyer
				fail) → <code>error</code>, <code>manual</code> (plafonnée à <code>cantTell</code>) →{" "}
				<code>warning</code>.
			</p>

			<h2>Correspondance des champs</h2>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "field", label: "Champ SARIF", width: "36%", wrap: true },
					{ key: "source", label: "Source", wrap: true },
				]}
				rows={sarifFieldRows}
			/>

			<h2 id="sarif-locations">Emplacements</h2>
			<p>
				Une analyse fondée sur le DOM n’a pas de ligne ni de colonne à rapporter, donc{" "}
				<code>physicalLocation.artifactLocation.uri</code> est la cible analysée elle-même, et
				non une position dans un fichier source :
			</p>
			<ul>
				<li>
					<strong>Analyse de fichiers locaux</strong> : un chemin relatif au répertoire de travail
					courant (avec des barres obliques). S’il correspond à un vrai fichier de votre dépôt,{" "}
					<span lang="en">GitHub Code Scanning</span> peut afficher le résultat sous forme d’annotation en ligne.
				</li>
				<li>
					<strong>Analyse d’URL</strong> : l’URL analysée elle-même. <span lang="en">GitHub Code Scanning</span> listera
					quand même le résultat, mais ne peut pas associer une annotation en ligne à une URL qui
					n’est pas un fichier du dépôt : cela tient à la façon dont SARIF et <span lang="en">Code Scanning</span>{" "}
					rattachent les résultats au code source, ce n’est pas une limite de surea11y. Si vous
					avez besoin d’annotations en ligne, analysez le fichier HTML rendu (par exemple un
					artefact de build) plutôt qu’une URL en direct.
				</li>
			</ul>
			<p>
				<code>occurrence.selector</code> est également transmis comme{" "}
				<code>logicalLocations[].fullyQualifiedName</code>, de sorte qu’un consommateur qui lit les
				emplacements logiques sait tout de même « quel élément » est concerné, même sans
				emplacement physique exploitable.
			</p>

			<h2 id="scanning-at-several-viewport-widths">Analyser à plusieurs largeurs de viewport</h2>
			<p>
				Une règle qui dépend de la mise en page peut échouer à une largeur de viewport et réussir à
				une autre (voir{" "}
				<a href="/help/known-limitations/">Limites connues</a>) ; une page analysée à deux largeurs
				correspond donc à deux analyses, pas à une seule. Donnez à chacune sa propre catégorie :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { renderSarifReport } = require('@surea11y/core/sarif');",
					"",
					"for (const width of [390, 1280]) {",
					"  // ...scan the page at this width into `result`...",
					"  fs.writeFileSync(`a11y-${width}.sarif`, renderSarifReport(result, { category: `a11y-${width}` }));",
					"}",
				]}
			/>
			<p>
				puis envoyez chaque fichier séparément. <span lang="en">GitHub Code Scanning</span> traite chaque catégorie comme
				une analyse à part entière. Au sein d’une même catégorie, un envoi ultérieur remplace le
				précédent, et une alerte qui n’y figure plus est fermée : deux largeurs envoyées sous la
				même catégorie ouvriraient et fermeraient donc à chaque exécution une alerte propre à une
				largeur. GitHub rejette aussi un fichier SARIF unique contenant deux exécutions du même
				outil et de la même catégorie. <code>github/codeql-action/upload-sarif</code> a une entrée{" "}
				<code>category</code> qui joue le même rôle lorsque le fichier n’en porte pas.
			</p>
			<p>
				L’identité du constat n’inclut pas le viewport, et n’en a pas besoin : le même élément avec
				le même défaut est le même constat à n’importe quelle largeur, et c’est la catégorie qui
				sépare les analyses. <code>runs[0].properties.environment</code> enregistre le viewport
				utilisé par chaque exécution.
			</p>

			<h2>Combiner avec <code>--baseline</code></h2>
			<p>
				Un consommateur SARIF générique n’a pas de notion propre de « connu, ne pas bloquer
				dessus » : la seule façon fidèle d’appliquer une baseline dans une sortie SARIF est d’
				<strong>omettre entièrement les occurrences <code>fail</code> déjà connues, plutôt que de
				les rétrograder en <code>warning</code></strong> :
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --baseline baseline.json --sarif results.sarif", command: true }]} />
			<p>
				Les occurrences <code>cantTell</code> ne sont jamais filtrées par une baseline : le
				mécanisme de baseline ne suit que les occurrences <code>fail</code> (comme{" "}
				<code>--write-baseline</code>, voir <a href="/conformance/baseline/">Baseline / allowlist</a>).
			</p>

			<h2>Combiner avec <code>--html</code>/<code>--json</code></h2>
			<p>
				<code>--sarif</code>, <code>--html</code> et <code>--json</code> sont des options de sortie
				indépendantes : combinez-les librement dans une même exécution ; chacune écrit ou affiche
				son propre rapport à partir de la même analyse unique.
			</p>
		</>
	);
}
