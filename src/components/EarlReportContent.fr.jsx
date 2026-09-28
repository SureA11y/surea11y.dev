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
				et régénéré par <code>scripts/act-report.js</code>.
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
				n’implémente pas du tout cette règle ».
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
					lorsqu’un résultat n’en contient pas.
				</li>
				<li>
					<strong><code>test.title</code></strong> est l’id de règle du moteur lui-même. Au sens
					d’ACT, une règle est la <em>procédure</em> exécutée par l’implémentation, et c’est
					exactement ce que désigne un id de règle.
				</li>
				<li>
					<strong><code>test.isPartOf</code></strong> liste les critères de succès auxquels cette
					règle correspond, sous la forme <code>WCAG2:&lt;criterion-id&gt;</code>. Entièrement
					omis pour une règle qui ne revendique aucun critère : <code>aria-allowed-role</code> est
					la seule règle automatique du moteur dans ce cas, et une liste vide se lirait comme
					« ne correspond à rien que nous ayons trouvé » plutôt que « ne correspond volontairement
					à aucun ».
				</li>
				<li>
					<strong><code>assertedBy</code></strong> et <strong><code>mode</code></strong>{" "}
					n’apparaissent que si vous les fournissez.
				</li>
			</ul>
			<p>
				Les id de critères sont dérivés du titre du critère lui-même (<code>Non-text Content</code> →{" "}
				<code>non-text-content</code>). <code>normativeMappings</code> contient aussi des références
				aux documents <span lang="en">Understanding</span> et à des normes autres que les WCAG, qui partagent{" "}
				<code>standard: "WCAG"</code> et un <code>requirement</code> avec les vrais critères ; un
				critère de succès est l’entrée qui indique un niveau de conformité et ne revendique aucun
				autre type de document, et seules ces entrées sont lues.
			</p>

			<h2>Résultats</h2>
			<DataTable
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
				<strong>zéro faux positif</strong> sur les 798 exemples ACT couvrant ses 58 règles
				correspondantes ; voir{" "}
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
				Les résultats qui partagent une URL sont fusionnés en un seul sujet : un appelant qui
				analyse la même page avec des <code>engineOptions</code> différents décrit toujours une
				seule ressource, et le contexte n’a aucun moyen d’exprimer deux sujets ayant la même
				source.{" "}
				<strong>Lorsque deux résultats portent sur la même règle pour la même URL, le dernier
				l’emporte.</strong>
			</p>
			<p>
				La sortie est déterministe : les sujets sont triés par source, les assertions par id de
				règle, et les mêmes entrées produisent une sortie identique à l’octet près, quel que soit
				leur ordre. C’est ce qui rend significatif un diff entre deux versions du moteur.
			</p>

			<h2>Options</h2>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "option", label: "Option", width: "22%" },
					{ key: "meaning", label: "Signification", wrap: true },
				]}
				rows={[
					{ id: "assertor", option: <code>assertor</code>, meaning: <><code>{"{ name, version }"}</code>. Le nom vaut <code>surea11y</code> par défaut ; passez <code>null</code> pour omettre entièrement <code>assertedBy</code>.</> },
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
