import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";
import engine from "../data/engine.generated.json";

const core = "https://github.com/SureA11y/core/blob/main";

const earlOutcomeRows = [
	{ id: "pass", engine: <code>pass</code>, earl: <code>earl:passed</code> },
	{ id: "fail", engine: <code>fail</code>, earl: <code>earl:failed</code> },
	{ id: "cantTell", engine: <code>cantTell</code>, earl: <code>earl:cantTell</code> },
	{ id: "notApplicable", engine: <code>notApplicable</code>, earl: <code>earl:inapplicable</code> },
];

export function EarlReportContent() {
	return (
		<>
			<p>
				<code>@surea11y/core/earl</code> produit les résultats d’analyse au format{" "}
				<a href="https://www.w3.org/TR/EARL10-Schema/">EARL 1.0</a> en JSON-LD : le vocabulaire
				publié par le W3C pour affirmer « cet outil a testé tel élément et obtenu tel résultat »,
				et le format que le groupe communautaire <a href="https://act-rules.github.io/"><span lang="en">ACT Rules</span></a>{" "}
				accepte comme rapport d’implémentation.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { renderEarlReport } = require('@surea11y/core/earl');",
					"",
					"const report = renderEarlReport(result, {",
					`  assertor: { name: 'surea11y', version: '${engine.version}' },`,
					"  mode: 'earl:automatic'",
					"});",
					"",
					"fs.writeFileSync('earl.jsonld', JSON.stringify(report, null, 2));",
				]}
			/>

			<h2>À quoi il sert</h2>
			<p>Deux publics, qui veulent le même document pour des raisons différentes.</p>
			<p>
				Un <strong>rapport d’implémentation</strong> indique au groupe communautaire <span lang="en">ACT Rules</span>{" "}
				comment ce moteur se comporte sur ses cas de test, et c’est ce qui permet à un moteur
				d’être listé aux côtés des autres implémentations. Être listé ne vaut pas approbation, et
				le W3C ne vérifie pas les données : la formulation exacte est{" "}
				<em>« listé comme implémentation ACT »</em>, jamais <em>« certifié W3C »</em>. Le rapport
				de ce moteur est publié à l’adresse{" "}
				<a href="https://surea11y.github.io/act-report/act-report.jsonld">
					https://surea11y.github.io/act-report/act-report.jsonld
				</a>{" "}
				et régénéré par <code>scripts/act-report.js</code>. <code>--runner=chromium</code>{" "}
				génère le même rapport à partir d’une analyse dans Chromium, comme les bindings pour
				navigateur exécutent le moteur, avec l’assertor nommé « SureA11y in a browser » et la
				version de Chromium dans la description du rapport.
			</p>
			<p>
				Un <strong>utilisateur</strong> y gagne un format d’échange. EARL est ce que lisent les
				outils d’accessibilité lorsqu’ils doivent combiner des résultats de plusieurs sources (par
				exemple une analyse automatisée et un audit manuel, ou plusieurs moteurs), car chaque
				assertion indique qui l’a émise et comment. C’est utile, que quelque chose soit un jour
				soumis quelque part ou non.
			</p>

			<h2>En quoi il diffère des autres rapports</h2>
			<p>
				Le <a href="/results-reports/sarif-report/">rapport SARIF</a> et le <a href="/results-reports/html-report/">rapport HTML</a>{" "}
				ne contiennent <strong>que les violations</strong> : ils rapportent les occurrences{" "}
				<code>fail</code> et <code>cantTell</code> et écartent tout le reste. EARL fait l’inverse.{" "}
				<strong>Chaque règle exécutée devient une assertion, <code>pass</code> et{" "}
				<code>inapplicable</code> compris</strong>, car un rapport d’implémentation affirme ce que
				le moteur a décidé <em>partout</em>. Une règle restée muette parce qu’elle n’a rien trouvé
				d’applicable est une information, pas du bruit : c’est ce qui permet au lecteur de
				distinguer « ce moteur a vérifié et n’a rien trouvé à vérifier » de « ce moteur
				n’implémente pas du tout cette règle ».{" "}
				<strong>Chaque assertion porte sur une règle et un sujet</strong> : le{" "}
				<code>passed</code> d’une règle n’est pas un verdict sur le critère WCAG auquel elle est
				associée, dont la plupart ont des parties qu’aucune règle ne couvre (voir{" "}
				<a href="/conformance/wcag-mapping/">Correspondance de conformité WCAG</a>).
			</p>

			<h2>Structure</h2>
			<p>Le graphe est regroupé par sujet plutôt que d’être une liste plate d’assertions :</p>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					'  "@context": "https://www.w3.org/WAI/content-assets/wcag-act-rules/earl-context.json",',
					'  "@graph": [',
					"    {",
					'      "@type": "TestSubject",',
					'      "source": "https://example.test/",',
					'      "assertions": [',
					"        {",
					'          "@type": "Assertion",',
					'          "test": { "title": "img-alt-present", "isPartOf": ["WCAG2:non-text-content"] },',
					'          "result": { "outcome": "earl:failed" },',
					'          "assertedBy": {',
					'            "@type": "Assertor",',
					'            "name": "surea11y",',
					`            "release": { "@type": "Version", "revision": "${engine.version}" }`,
					"          },",
					'          "mode": "earl:automatic"',
					"        }",
					"      ]",
					"    }",
					"  ]",
					"}",
				]}
			/>
			<ul>
				<li>
					<strong><code>source</code></strong> est l’URL analysée, ou <code>about:blank</code>{" "}
					lorsqu’un résultat n’en contient pas. Lorsque plusieurs résultats n’en contiennent pas,
					chacun devient un sujet à part entière, <code>about:blank#result-&lt;n&gt;</code> selon sa
					position dans la liste (à partir de 1), au lieu de tous fusionner en un seul.
				</li>
				<li>
					<strong><code>test.title</code></strong> est l’id de règle du moteur lui-même. Au sens
					d’ACT, une règle est la <em>procédure</em> exécutée par l’implémentation, et c’est
					exactement ce que désigne un id de règle.
				</li>
				<li>
					<strong><code>test.isPartOf</code></strong> liste les critères de succès auxquels cette
					règle correspond, sous la forme <code>WCAG2:&lt;criterion-id&gt;</code> : chaque entrée
					de <code>normativeMappings</code> dont le <code>standard</code> est <code>WCAG</code> ou
					absent (comme dans SARIF) et qui n’a pas de <code>type</code>. Entièrement omis pour une
					règle qui ne revendique aucun critère : <code>aria-allowed-role</code>,{" "}
					<code>empty-heading</code> et <code>landmark-role-name-present</code> sont les règles
					automatiques du moteur dans ce cas, et une liste vide se lirait comme « ne correspond à
					rien que nous ayons trouvé » plutôt que « ne correspond volontairement à aucun ». Une
					telle règle peut tout de même renvoyer <code>fail</code> (<code>empty-heading</code>{" "}
					fait échouer un titre sans nom) : son assertion est alors <code>earl:failed</code> sans{" "}
					<code>isPartOf</code>, l’échec d’une règle qui ne revendique aucun critère WCAG.
				</li>
				<li>
					<strong><code>isPartOf</code> suit le niveau et la version WCAG de l’analyse.</strong>{" "}
					Un critère que l’analyse a écarté de <code>rulesResults</code> à cause d’eux n’est pas
					listé, comme 1.4.6 (AAA) sous <code>engineOptions.wcagLevel: 'AA'</code>, ou 4.1.1 quand{" "}
					<code>{"includeRuleIds: ['duplicate-id']"}</code> s’est exécuté sous WCAG 2.2, qui l’a
					supprimé ; une règle dont chaque critère est écarté n’a pas d’<code>isPartOf</code>.
					L’assertion elle-même reste, puisqu’elle porte sur la règle. Un critère que l’analyse
					signale est listé, comme une agrégation nommée par son id au-dessus du niveau, ou 4.1.1
					dans une analyse 2.2 qui l’a sélectionné, tout comme chaque critère d’un résultat qui
					n’enregistre ni <code>engine.wcagLevel</code> ni <code>engine.wcagVersion</code>.
				</li>
				<li>
					<strong><code>assertedBy</code></strong> est toujours présent, sauf si vous passez{" "}
					<code>assertor: null</code> : il vaut par défaut <code>surea11y</code> et la version du
					moteur que portent les résultats. <strong><code>mode</code></strong> n’apparaît que si
					vous le fournissez.
				</li>
			</ul>
			<p>
				Les id de critères sont dérivés du titre du critère lui-même (<code>Non-text Content</code> →{" "}
				<code>non-text-content</code>). <code>normativeMappings</code> contient aussi des références
				aux documents <span lang="en">Understanding</span>, qui ont un <code>type</code>, et des
				entrées d’autres normes (clauses d’EN 301 549, exigences ou points de la liste de contrôle
				d’un pack), qui nomment leur propre <code>standard</code> ; les unes comme les autres
				peuvent partager un numéro de <code>requirement</code> avec un critère. Seules les entrées
				dont le <code>standard</code> est <code>WCAG</code> ou absent et qui n’ont pas de{" "}
				<code>type</code> sont lues comme des critères de succès. Aucun niveau de conformité
				n’est nécessaire. <code>isPartOf</code> ne liste que des critères WCAG ; les entrées des
				autres normes en sont écartées.
			</p>
			<p>
				Un résultat compact (<code>engineOptions.output.detail: 'findings'</code>, voir{" "}
				<a href="/results-reports/output-schema/#top-level-result">Schéma de sortie</a>) est lu
				comme le résultat complet qu’il représente ; il est donc rapporté de la même façon.
			</p>

			<h2>Résultats</h2>
			<DataTable
				label="Résultats du moteur dans EARL"
				rowKey="id"
				columns={[
					{ key: "engine", label: "Moteur", width: "30%" },
					{ key: "earl", label: "EARL", wrap: true },
				]}
				rows={earlOutcomeRows}
			/>
			<p>
				<code>earl:untested</code> n’a pas d’équivalent : une règle qui ne s’est pas exécutée ne
				produit aucun résultat sur lequel se prononcer, elle ne donne donc lieu à aucune assertion
				plutôt qu’à une assertion « non testé ».
			</p>
			<p>
				<strong><code>cantTell</code> ne pénalise pas l’implémentation au regard d’ACT.</strong> Les règles
				de cohérence d’ACT permettent à une implémentation automatisée de répondre « impossible à
				déterminer » sur certains exemples (mais pas tous) tout en restant considérée comme
				cohérente. Ce qu’une implémentation partiellement cohérente ne peut <em>pas</em> faire,
				c’est produire un faux positif : échouer sur un exemple censé réussir selon la règle,
				ou censé être inapplicable. C’est ce seuil qu’il faut surveiller, et il dépend des
				règles, pas de ce rapport. Lors de la dernière exécution complète, le moteur a produit{" "}
				<strong>zéro faux positif</strong> sur les 957 exemples que le W3C publie pour ses 60
				règles correspondantes ; voir{" "}
				<a href={`${core}/docs/ACT_RULE_MAPPING.md`}><code>ACT_RULE_MAPPING.md</code></a>, et
				relancez <code>scripts/act-testcase-check.js</code> pour obtenir le chiffre à jour plutôt
				que de vous fier indéfiniment à celui-ci.
			</p>

			<h2>Plusieurs résultats, un seul rapport</h2>
			<p>
				<code>renderEarlReport</code> accepte un tableau aussi bien qu’un résultat unique, car un
				rapport couvrant de nombreuses pages est le cas normal :
			</p>
			<CodeBlock lang="js" lines={["renderEarlReport([homeResult, checkoutResult, searchResult], { assertor });"]} />
			<p>
				Un résultat multi-frames de <a href="/results-reports/output-schema/#cross-frame-result"><code>runa11yCoreAcrossFrames</code></a> est accepté tel
				quel, seul ou dans le tableau : chaque frame qui a répondu est un résultat de plus et
				devient un sujet sous sa propre URL. Un frame sous le premier niveau dont l’URL ne le
				distingue pas, parce qu’elle vaut <code>about:srcdoc</code> ou <code>about:blank</code>{" "}
				ou qu’un autre frame du résultat a la même, est nommé par son URL et son chemin, les
				sélecteurs par lesquels SARIF et JUnit le nomment, chacun encodé et joints par{" "}
				<code>/</code> : <code>about:srcdoc#frame=%23pay</code>,{" "}
				<code>about:srcdoc#frame=%23widget/%23inner</code>. Là où même le chemin est partagé,
				comme pour les frames d’un binding, qui ne portent pas de sélecteur, sa place parmi les
				frames du résultat est ajoutée, à partir de 1 :{" "}
				<code>about:srcdoc#frame=iframe&amp;n=3</code>. Tout le reste qui n’est pas un résultat
				d’analyse, comme <code>null</code> ou une chaîne, lève une <code>TypeError</code>.
			</p>
			<p>
				Les résultats qui partagent une URL sont fusionnés en un seul sujet : un appelant qui
				analyse la même page avec des <code>engineOptions</code> différents décrit toujours une
				seule ressource, et le contexte n’a aucun moyen d’exprimer deux sujets ayant la même
				source.{" "}
				<strong>Lorsque deux résultats portent sur la même règle pour la même URL, le pire
				résultat est conservé</strong> : <code>earl:failed</code>, puis <code>earl:cantTell</code>,
				puis <code>earl:passed</code>, puis <code>earl:inapplicable</code>, si bien qu’aucun ordre
				des entrées ne peut masquer un échec. Cela vaut aussi pour la même page analysée à deux
				largeurs de viewport : EARL n’a aucun terme pour les conditions dans lesquelles une page a
				été rendue, si bien qu’un rapport construit à partir de plusieurs largeurs garde, pour
				chaque règle, un échec survenu à n’importe quelle largeur. Produisez un rapport par
				largeur si les largeurs elles-mêmes comptent.
			</p>
			<p>
				La sortie est déterministe : les sujets sont triés par source, les assertions par id de
				règle, et les mêmes entrées produisent une sortie identique à l’octet près, quel que soit
				leur ordre. La seule exception concerne les résultats sans URL, qui se distinguent par
				leur position dans la liste (<code>about:blank#result-2</code>) ; donnez à chaque résultat
				son URL quand l’ordre ne doit pas compter. C’est ce qui rend significatif un diff entre deux versions du moteur.
			</p>

			<h2>Options</h2>
			<DataTable
				label="Options du rapport EARL"
				rowKey="id"
				columns={[
					{ key: "option", label: "Option", width: "22%" },
					{ key: "meaning", label: "Signification", wrap: true },
				]}
				rows={[
					{ id: "assertor", option: <code>assertor</code>, meaning: <><code>{"{ name, version }"}</code>. Le nom vaut <code>surea11y</code> par défaut, et la version, donnée comme <code>release</code> de l’assertor, vaut par défaut l’<code>engine.version</code> que portent les résultats lorsqu’ils portent tous la même ; des résultats issus de versions différentes n’ont pas de <code>release</code>, sauf si vous en indiquez une. Passez <code>null</code> pour omettre entièrement <code>assertedBy</code>.</> },
					{ id: "mode", option: <code>mode</code>, meaning: <>Un mode de test EARL, par exemple <code>'earl:automatic'</code>. Omis s’il n’est pas fourni.</> },
				]}
			/>

			<h2>Voir aussi</h2>
			<ul>
				<li><a href="/results-reports/output-schema/">Schéma de sortie</a> : le résultat que ce rapport lit</li>
				<li>
					<a href={`${core}/docs/ACT_RULE_MAPPING.md`}><code>ACT_RULE_MAPPING.md</code></a> : les
					règles ACT auxquelles correspondent les règles du moteur
				</li>
				<li>
					<a href={`${core}/docs/API_STABILITY.md`}><code>API_STABILITY.md</code></a> : ce qui est
					couvert par semver
				</li>
			</ul>
		</>
	);
}
