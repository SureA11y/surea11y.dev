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
	{ id: "message", field: <code>results[].message.text</code>, source: <><code>occurrence.summary</code> + <code>occurrence.hint</code>. Une occurrence sans résumé (celle d’une règle personnalisée, par exemple) utilise le titre de la règle, ou son id, puisque GitHub rejette un résultat dont le texte est vide.</> },
	{ id: "uri", field: <code>results[].locations[].physicalLocation.artifactLocation.uri</code>, source: <>La cible analysée ; voir <a href="#sarif-locations">Emplacements</a> ci-dessous.</> },
	{ id: "fqn", field: <code>results[].locations[].logicalLocations[].fullyQualifiedName</code>,source: <>L’emplacement de l’élément, avec <code>kind: "element"</code>, lorsque <code>occurrence.selector</code> est une chaîne non vide. Hors d’un arbre shadow, c’est le sélecteur. Pour un élément situé dans un arbre shadow, ce sont les sélecteurs des shadow hosts, puis celui de l’élément, joints par <code>{" >>> "}</code> : <code>{"html > body > main > x-card >>> button"}</code>. La ligne <code>selector:</code> de JUnit et le rapport HTML affichent le même texte.</> },
	{
		id: "fingerprint",
		field: <code>results[].partialFingerprints["surea11y/violation/v2"]</code>,
		source: (
			<>
				Le condensé SHA-256, en 64 chiffres hexadécimaux, de la même clé d’identité{" "}
				<code>ruleId + reasonCode + html</code> que celle utilisée par{" "}
				<a href="/conformance/baseline/">Baseline / allowlist</a> (<code>computeBaselineKey</code>) :
				une empreinte stable fondée sur le contenu plutôt que sur la position, pour les
				consommateurs qui la lisent ; le même constat reçoit le même condensé dans chaque
				rapport. Avant la version 1.11, <code>surea11y/violation/v1</code> contenait la clé
				elle-même : un outil qui lisait <code>v1</code> voit donc chaque constat comme nouveau,
				une seule fois.
			</>
		),
	},
	{
		id: "lineHash",
		field: <code>results[].partialFingerprints.primaryLocationLineHash</code>,
		source: (
			<>
				Les 16 premiers chiffres hexadécimaux du condensé et un compteur,{" "}
				<code>&lt;16 hex digits&gt;:&lt;n&gt;</code> (inchangé par rapport à avant <code>v2</code>), où <code>n</code> compte
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
	{ id: "tags", field: <code>tool.driver.rules[].properties.tags</code>, source: <><code>accessibility</code>, <code>automatic</code>/<code>manual</code>, et un tag <code>wcag-&lt;SC&gt;</code>par critère de succès WCAG présent dans <code>meta.normativeMappings</code> que le niveau et la version WCAG de l’analyse conservent. Un critère que l’analyse a écarté de <code>rulesResults</code> à cause d’eux ne reçoit pas de tag : un critère AAA sous <code>engineOptions.wcagLevel: 'AA'</code>, ou 4.1.1 quand <code>{"includeRuleIds: ['duplicate-id']"}</code> s’est exécuté sous WCAG 2.2. Un critère que l’analyse signale, comme une agrégation nommée par son id au-dessus du niveau, garde son tag, tout comme chaque critère d’un résultat qui n’enregistre ni <code>engine.wcagLevel</code> ni <code>engine.wcagVersion</code>. La règle reste, et ses résultats aussi, en notes quand chaque critère auquel elle est associée est écarté (voir <a href="#outside-the-target">plus haut</a>). Les entrées de documents Understanding n’ont pas de tag. Chaque clause d’EN 301 549 que porte le résultat (seulement quand l’analyse les a demandées, voir <a href="/configuration/engine-options/#other-standards-mappings">Autres normes</a>) reçoit un tag <code>en301549-&lt;clause&gt;</code>, p. ex. <code>en301549-9.1.1.1</code> : les numéros de clause sont les mêmes dans toutes les versions qui les contiennent, le tag ne porte donc pas de version, et la norme ou la liste de contrôle d’un pack reçoit des tags de la même façon, sous sa propre clé (l’id d’un point de la liste de contrôle, <code>acme-images</code>, est son propre tag). Viennent ensuite les <code>meta.tags</code> de la règle elle-même (y compris ceux d’une règle personnalisée), sans les tags internes du moteur ni les tags de critère que les tags <code>wcag-&lt;SC&gt;</code> donnent déjà.</> },
	{ id: "helpUri", field: <code>tool.driver.rules[].helpUri</code>, source: <><code>meta.helpUrl</code>, le lien d’aide de la règle, quand c’est une URL <code>http(s)</code> absolue ; sinon le document Understanding du premier critère WCAG auquel elle est associée ; absent pour une règle qui n’a ni l’un ni l’autre, ce qui n’est le cas d’aucune règle intégrée : une règle associée à aucun critère renvoie à sa section du catalogue des règles.</> },
	{ id: "toolVersion", field: <code>tool.driver.version</code>, source: <>L’option <code>toolVersion</code>, si elle est fournie (un outil qui enveloppe le moteur passe la sienne) ; sinon <code>engine.version</code>, la version du moteur qui a produit le résultat.<code>"0.0.0"</code> seulement pour un résultat qui n’en a pas, issu d’une version antérieure à 1.10.0, ou dont l’<code>engine.version</code> n’est pas une chaîne.</> },
	{ id: "category", field: <code>runs[0].automationDetails.id</code>, source: <>L’option <code>category</code>, avec un <code>/</code> final ajouté s’il n’y en a pas (GitHub lit tout ce qui précède la dernière barre oblique comme la catégorie). Absent lorsqu’aucune catégorie n’est fournie. Voir <a href="#scanning-at-several-viewport-widths">Analyser à plusieurs largeurs de viewport</a>.</> },
	{ id: "runProps", field: <code>runs[0].properties</code>,source: <><code>wcagVersion</code>, <code>wcagLevel</code> (quand l’analyse avait un niveau : <code>engineOptions.wcagLevel</code>, ou celui que donne sa sélection), <code>profile</code>, <code>optInRules</code> et <code>environment</code> issus de l’<code>engine</code> du résultat : la cible de conformité utilisée par l’exécution, pour qu’un tableau de bord distingue une exécution WCAG 2.1 d’une exécution 2.2, et une exécution AA d’une exécution à tous les niveaux, les tags de règles optionnelles qu’elle a ajoutés au-delà de cette cible, s’il y en a, et les conditions dans lesquelles la page a été rendue (<code>layout</code>, <code>viewport</code>, <code>devicePixelRatio</code>,<code>colorScheme</code>, <code>forcedColors</code>, <code>fonts</code> ; voir <a href="/results-reports/output-schema/">Schéma de sortie</a>). Omis pour les résultats de moteurs antérieurs à ces champs.</> },
];

const sarifOptionRows = [
	{ id: "toolVersion", option: <code>toolVersion</code>, def: <code>engine.version</code>, effect: <><code>tool.driver.version</code>, pour un outil qui enveloppe le moteur.</> },
	{ id: "informationUri", option: <code>informationUri</code>, def: <code>'https://github.com/SureA11y/core'</code>, effect: <><code>tool.driver.informationUri</code>, la page d’accueil de l’outil.</> },
	{ id: "baselineEntries", option: <code>baselineEntries</code>, def: "aucune", effect: <>Le fichier de baseline tel qu’enregistré (son <code>JSON.parse</code>) ou sa liste <code>entries</code>, voir <a href="/conformance/baseline/#file-format">Format du fichier</a>. Les occurrences <code>fail</code> qui y sont enregistrées sont omises, comme le fait <code>--baseline</code> (voir ci-dessous).</> },
	{ id: "category", option: <code>category</code>, def: "aucune", effect: <><code>runs[0].automationDetails.id</code>, voir <a href="#scanning-at-several-viewport-widths">Analyser à plusieurs largeurs de viewport</a>.</> },
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
				<a href="/results-reports/html-report/">rapport HTML</a>).{" "}
				<strong>Un journal sans résultat indique donc que rien n’a échoué ni ne demande de revue
				parmi les vérifications exécutées</strong> ; il ne dit pas ce qui a été vérifié, et ce
				n’est pas une déclaration de conformité. Conservez le résultat JSON pour cela.
			</p>
			<p>
				Une vérification <code>notApplicable</code> n’est pas toujours vide : une règle peut
				joindre une occurrence expliquant pourquoi elle n’avait rien à juger, ce que font les
				règles de contraste lorsqu’aucun texte n’avait d’arrière-plan calculable. Ces occurrences
				ne deviennent jamais des résultats (un consommateur traite chaque résultat comme une
				alerte, et « ceci n’a pas été évalué » n’en est pas une), mais elles ne sont pas non plus
				abandonnées. Elles sont transmises comme entrées de niveau <code>note</code> dans{" "}
				<code>runs[0].invocations[0].toolExecutionNotifications</code>, chacune indiquant la règle dont
				elle provient via <code>associatedRule.id</code> :
			</p>
			<CodeBlock
				lang="json"
				lines={[
					'"invocations": [',
					"  {",
					'    "executionSuccessful": true,',
					'    "toolExecutionNotifications": [',
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
				une exécution sans rien à rapporter n’a donc aucune clé <code>invocations</code>. Une
				règle qui a réussi n’écrit aucune notification.
			</p>
			<p>
				Une règle qui ne s’est pas terminée (elle a levé une exception : <code>cantTell</code>{" "}
				sans occurrence et avec une <code>error</code>) n’a rien jugé : ce n’est donc pas non plus
				un résultat. C’est une notification de niveau <code>error</code> dans la même liste,{" "}
				<code>"The rule &lt;id&gt; did not complete: &lt;error&gt;"</code>, qui nomme la règle
				dans <code>associatedRule.id</code>, pour que le trou dans la couverture ne se lise pas
				comme une réussite.
			</p>
			<DataTable
				label="Résultats du moteur en niveaux SARIF"
				rowKey="id"
				columns={[
					{ key: "outcome", label: "Résultat du moteur", width: "22%" },
					{ key: "level", label: "Niveau SARIF", width: "18%" },
					{ key: "meaning", label: "Signification", wrap: true },
				]}
				rows={sarifLevelRows}
			/>
			<p id="outside-the-target">
				Une règle dont chaque critère WCAG est hors de la cible de l’analyse (une règle AAA sous{" "}
				<code>engineOptions.wcagLevel: 'AA'</code>, ou <code>duplicate-id</code> sous WCAG 2.2 :
				les critères que l’analyse a écartés de <code>rulesResults</code>, comme pour les tags{" "}
				<code>wcag-&lt;SC&gt;</code> ci-dessous) s’est quand même exécutée, et ses constats{" "}
				<code>fail</code> et <code>cantTell</code> restent des résultats, au niveau{" "}
				<code>note</code>, pour qu’ils soient visibles sans faire échouer un build limité à la
				cible. Chacun en donne la raison dans <code>properties.outsideTarget</code> :{" "}
				<code>{'{ "criteria": ["1.4.6"], "target": "WCAG 2.2 AA" }'}</code>.
			</p>
			<p>
				Chaque règle exécutée (qu’elle ait produit un résultat ou non) est listée une fois dans{" "}
				<code>runs[0].tool.driver.rules</code>, avec <code>defaultConfiguration.level</code>{" "}
				défini d’après le <code>type</code> de la règle : <code>automatic</code> (peut renvoyer
				fail) → <code>error</code>, <code>manual</code> (jamais <code>fail</code>) →{" "}
				<code>warning</code>. Un id de règle qui n’est pas une chaîne, dans un résultat
				enregistré, est écrit sous forme de texte ; une vérification sans id de règle ne nomme
				aucune règle, et elle est omise, comme JUnit et EARL l’omettent.
			</p>

			<h2 id="field-mapping">Correspondance des champs</h2>
			<DataTable
				label="Correspondance des champs SARIF"
				rowKey="id"
				columns={[
					{ key: "field", label: "Champ SARIF", width: "36%", wrap: true },
					{ key: "source", label: "Source", wrap: true },
				]}
				rows={sarifFieldRows}
			/>
			<p>
				Un résultat compact (<code>engineOptions.output.detail: 'findings'</code>, voir{" "}
				<a href="/results-reports/output-schema/#top-level-result">Schéma de sortie</a>) est lu
				comme le résultat complet qu’il représente ; il est donc rapporté de la même façon. Un
				résultat dont la liste <code>standards</code> est absente ou endommagée reçoit quand même
				un tag pour chaque norme que nomment ses règles.
			</p>

			<h2 id="sarif-locations">Emplacements</h2>
			<p>
				Une analyse fondée sur le DOM n’a pas de ligne ni de colonne à rapporter, donc{" "}
				<code>physicalLocation.artifactLocation.uri</code> est la cible analysée elle-même, et
				non une position dans un fichier source :
			</p>
			<ul>
				<li>
					<strong>Analyse de fichiers locaux</strong> : un fichier situé dans le répertoire de travail
					courant devient un chemin relatif à celui-ci, avec des barres obliques et chaque segment
					encodé en pourcentage (<code>build%20out/index.html</code>). S’il correspond à un vrai
					fichier de votre dépôt, <span lang="en">GitHub Code Scanning</span> peut afficher le résultat
					sous forme d’annotation en ligne. Un fichier situé hors du répertoire de travail devient une
					URL <code>file:</code> absolue, et non un chemin relatif qui sort du dépôt avec{" "}
					<code>../</code>, qu’un consommateur ne pourrait pas résoudre.
				</li>
				<li>
					<strong>Analyse d’URL</strong> : l’URL analysée elle-même. <span lang="en">GitHub Code Scanning</span> listera
					quand même le résultat, mais ne peut pas associer une annotation en ligne à une URL qui
					n’est pas un fichier du dépôt : cela tient à la façon dont SARIF et <span lang="en">Code Scanning</span>{" "}
					rattachent les résultats au code source, ce n’est pas une limite de surea11y. Si vous
					avez besoin d’annotations en ligne, analysez le fichier HTML rendu (par exemple un
					artefact de build) plutôt qu’une URL en direct. L’URL est écrite telle qu’un analyseur
					d’URL la sérialise : ce qu’une URI ne peut pas contenir est encodé en pourcentage (
					<code>https://example.test/a%20b</code>).
				</li>
				<li>
					<strong>Autres cibles</strong> : un résultat dont l’<code>url</code> n’est pas une URL,
					comme le chemin sous lequel une page a été analysée (
					<code>runDomRulesInPage('dist/my page.html', …)</code>), devient un chemin relatif, avec
					des barres obliques et chaque segment encodé en pourcentage (
					<code>dist/my%20page.html</code>) ; un chemin Windows devient une URL <code>file:</code>{" "}
					absolue. Un résultat sans <code>url</code>, ou dont l’<code>url</code> n’est pas une
					chaîne, est situé à <code>about:blank</code>.
				</li>
			</ul>
			<p>
				L’emplacement de l’élément (son sélecteur, précédé des sélecteurs de ses shadow hosts et
				de <code>{" >>> "}</code> lorsqu’il est situé dans un arbre shadow) est également
				transmis comme{" "}
				<code>logicalLocations[].fullyQualifiedName</code>, de sorte qu’un consommateur qui lit les
				emplacements logiques sait tout de même « quel élément » est concerné, même sans
				emplacement physique exploitable.
			</p>

			<h2 id="cross-frame-results">Résultats multi-frames</h2>
			<p>
				Un résultat de <code>runa11yCoreAcrossFrames</code>, ou d’une analyse{" "}
				<code>.frames(true)</code> d’un binding (voir{" "}
				<a href="/results-reports/output-schema/#cross-frame-result">Schéma de sortie</a>), forme
				une seule exécution : les constats de chaque frame en sont des résultats. Un constat
				situé dans un frame est localisé dans le document de ce frame (
				<code>artifactLocation.uri</code> est l’URL du frame), et porte le chemin du frame dans{" "}
				<code>properties.frame</code> :
			</p>
			<CodeBlock
				lang="json"
				lines={[
					'"properties": {',
					'  "severity": "serious",',
					'  "confidence": "high",',
					'  "reasonCode": "DEFAULT",',
					'  "html": "<img src=\\"card.png\\">",',
					'  "frame": ["#checkout"]',
					"}",
				]}
			/>
			<p>
				Le chemin fait aussi partie de l’identité du constat (<code>partialFingerprints</code>) :
				le même défaut dans la page et dans un frame, ou dans deux frames, donne donc deux
				alertes. Un frame qui n’a pas répondu (pas de responder, ou délai dépassé) est une
				notification de niveau <code>warning</code>,{" "}
				<code>"The frame #ads (https://ads.example/) was not scanned: &lt;error&gt;"</code>,
				puisque rien n’y a été vérifié.
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

			<h2>Options</h2>
			<p>
				<code>renderSarifReport(result, options)</code>, de <code>@surea11y/core/sarif</code>,
				renvoie le journal sous forme de texte JSON. Elle accepte :
			</p>
			<DataTable
				label="Options de renderSarifReport"
				rowKey="id"
				columns={[
					{ key: "option", label: "Option", width: "22%" },
					{ key: "def", label: "Par défaut", width: "30%", wrap: true },
					{ key: "effect", label: "Effet", wrap: true },
				]}
				rows={sarifOptionRows}
			/>

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
