import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const outcomeRows = [
	{
		id: "fail",
		outcome: <code>fail</code>,
		junit: (
			<>
				<code>&lt;failure type="fail"&gt;</code>, une ligne par occurrence en échec (message,
				indication, sélecteur, balisage), puis <code>help: &lt;url&gt;</code> quand la règle a un
				lien d’aide <code>http(s)</code> (<code>meta.helpUrl</code>), sinon le document
				Understanding de son premier critère WCAG
			</>
		),
		why: "Le cas déterministe, celui qui bloque.",
	},
	{
		id: "cantTell",
		outcome: <code>cantTell</code>,
		junit: (
			<>
				<code>&lt;skipped&gt;</code> indiquant combien d’occurrences demandent une revue manuelle
			</>
		),
		why: (
			<>
				JUnit n’a pas de « impossible à déterminer ». « Ignoré » le fait apparaître sans faire
				passer le build au rouge, la même ligne que trace <a href="/results-reports/sarif-report/">SARIF</a>{" "}
				avec <code>warning</code>.
			</>
		),
	},
	{ id: "pass", outcome: <code>pass</code>, junit: <>un simple <code>&lt;testcase&gt;</code></>, why: "" },
	{
		id: "notApplicable",
		outcome: <code>notApplicable</code>,
		junit: "omis",
		why: (
			<>
				Une page en compte des centaines, et aucun ne dit rien. <code>includeNotApplicable: true</code>{" "}
				les ajoute sous forme de <code>&lt;skipped message="Not applicable"&gt;</code>.
			</>
		),
	},
	{
		id: "ruleError",
		outcome: <>une règle qui ne s’est pas terminée (<code>cantTell</code> sans occurrence et avec une <code>error</code> : elle a levé une exception)</>,
		junit: <><code>&lt;error type="ruleError"&gt;</code> avec l’erreur, comptée dans <code>errors</code></>,
		why: "L’élément JUnit pour un test qui n’a pas pu s’exécuter. La page n’a pas été vérifiée au regard de la règle, ce qui n’est ni une réussite ni un point à examiner.",
	},
];

const optionRows = [
	{
		id: "cantTellAs",
		option: <code>cantTellAs</code>,
		default: <code>'skipped'</code>,
		effect: (
			<>
				<code>'failure'</code> signale les règles <code>cantTell</code> sous forme de{" "}
				<code>&lt;failure type="cantTell"&gt;</code>, pour un pipeline qui ne doit pas réussir tant
				que quelque chose reste indécis. Lue quelle que soit la casse ; toute autre valeur lève une{" "}
				<code>TypeError</code>, car une valeur mal orthographiée ne bloquerait rien, sans le dire.
			</>
		),
	},
	{
		id: "includeNotApplicable",
		option: <code>includeNotApplicable</code>,
		default: <code>false</code>,
		effect: <>Inclut les règles <code>notApplicable</code> comme tests ignorés.</>,
	},
	{
		id: "baselineEntries",
		option: <code>baselineEntries</code>,
		default: "aucune",
		effect: (
			<>
				Entrées issues de <code>buildBaselineEntries()</code> de{" "}
				<a href="/conformance/baseline/">la baseline</a>. Les occurrences en échec qui y sont
				enregistrées sont retirées, exactement comme dans SARIF. L’option accepte le fichier de
				baseline tel qu’il est enregistré (son <code>JSON.parse</code>) ou sa liste{" "}
				<code>entries</code>. Une règle dont tous les échecs sont
				déjà connus devient{" "}
				<code>&lt;skipped message="N known failures recorded in the baseline"&gt;</code>, et non un
				test réussi : elle n’a pas réussi.
			</>
		),
	},
	{
		id: "name",
		option: <code>name</code>,
		default: <code>'surea11y'</code>,
		effect: (
			<>
				Le <code>name</code> du <code>&lt;testsuites&gt;</code> racine, pour distinguer les rapports
				de plusieurs pages dans un même tableau de bord.
			</>
		),
	},
];

export function JunitReportContent() {
	return (
		<>
			<p>
				<code>@surea11y/core/junit</code> produit un résultat d’analyse au format JUnit XML, le format
				de rapport de tests que les tableaux de bord de CI lisent nativement : le widget de tests des
				merge requests de GitLab, l’onglet Tests d’Azure DevOps, Jenkins et CircleCI.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { renderJunitReport } = require('@surea11y/core/junit');",
					"const { runDomRulesInPage } = require('@surea11y/core');",
					"",
					"const result = runDomRulesInPage(url, null, { profile: 'wcag22-aa' }, null);",
					"require('fs').writeFileSync('surea11y.junit.xml', renderJunitReport(result));",
				]}
			/>
			<p>
				<code>renderJunitReport(result, options)</code> est une fonction pure : elle renvoie le XML
				sous forme de chaîne et ne touche jamais au système de fichiers. Elle fonctionne aussi bien
				sur un résultat enregistré auparavant en JSON, comme la sortie de{" "}
				<code>surea11y scan &lt;target&gt; --json</code> de{" "}
				<a href="https://github.com/SureA11y/cli#readme">
					<code>@surea11y/cli</code>
				</a>
				. Voir <a href="/configuration/ci-integration/#junit-test-reports">Intégration CI</a> pour des
				recettes GitLab et Azure DevOps.
			</p>

			<h2>Structure</h2>
			<p>
				Un <code>&lt;testsuite&gt;</code> par critère de succès WCAG, un{" "}
				<code>&lt;testcase&gt;</code> par règle qui y est associée :
			</p>
			<CodeBlock
				lang="html"
				lines={[
					'<testsuites name="surea11y" tests="14" failures="2" errors="0" skipped="4" time="0">',
					'  <testsuite name="WCAG 1.1.1 Non-text content: text alternatives" tests="1" failures="1" errors="0" skipped="0" time="0">',
					"    <properties>",
					'      <property name="wcagCriterion" value="1.1.1"/>',
					'      <property name="wcagLevel" value="A"/>',
					'      <property name="en301549" value="9.1.1.1"/>',
					'      <property name="criterionOutcome" value="fail"/>',
					'      <property name="engine" value="a11ycore"/>',
					'      <property name="schemaVersion" value="1.0.0"/>',
					'      <property name="wcagVersion" value="2.2"/>',
					'      <property name="profile" value="wcag22-aa"/>',
					'      <property name="layout" value="false"/>',
					'      <property name="locale" value="en"/>',
					'      <property name="url" value="https://example.test/"/>',
					"    </properties>",
					'    <testcase classname="wcag-1.1.1" name="img-alt-present" time="0">',
					'      <failure type="fail" message="1 failing occurrence: Missing alt attribute on &lt;img&gt;.">- Missing alt attribute on &lt;img&gt;. Add an alt attribute (use alt=&quot;&quot; only for decorative images).',
					"  selector: html &gt; body &gt; main &gt; img",
					"  html: &lt;img src=&quot;a.png&quot;&gt;</failure>",
					"    </testcase>",
					"  </testsuite>",
					"</testsuites>",
				]}
			/>
			<ul>
				<li>
					<strong>Les suites suivent le critère</strong>, parce que c’est ce que l’on suit, et{" "}
					<strong>les testcases suivent la règle</strong> plutôt que l’occurrence : un défaut répété
					quarante fois sur une page est un seul test en échec dont le corps liste les quarante, et
					le nombre de tests reste stable d’une exécution à l’autre.
				</li>
				<li>
					Les suites proviennent des correspondances WCAG de chaque règle, pas des composites :
					chaque règle exécutée est donc signalée même si les composites ont été exclus. Le composite,
					s’il s’est exécuté, fournit le titre de la suite et la propriété{" "}
					<code>criterionOutcome</code>, qui compte les règles personnalisées associées au critère
					comme il compte les règles intégrées. Un critère vérifié par plusieurs composites (4.1.2 :
					son nom accessible et sa validité ARIA) prend le pire de leurs résultats, et le nom que
					partagent leurs titres (<code>WCAG 4.1.2 Name, role, value</code>). Une règle associée à deux critères apparaît dans les deux
					suites. Une règle sans critère va dans une suite finale <code>Other checks</code> avec{" "}
					<code>classname="other"</code>.
				</li>
				<li>
					<code>engine</code>, <code>schemaVersion</code>, <code>wcagVersion</code>,{" "}
					<code>profile</code>, <code>optInRules</code>, les conditions de rendu issues de{" "}
					<a href="/results-reports/output-schema/">
						<code>engine.environment</code>
					</a>{" "}
					(<code>layout</code> et, dans un navigateur, <code>viewport</code> sous la forme{" "}
					<code>1280x720</code>, <code>devicePixelRatio</code>, <code>colorScheme</code> et{" "}
					<code>fonts</code>), <code>locale</code> et <code>url</code> de l’exécution sont répétés
					comme propriétés sur chaque suite, chacun seulement quand le résultat le contient. Un échec
					qui apparaît ou disparaît selon la largeur du viewport peut ainsi être rattaché à la
					largeur utilisée par l’exécution. L’exemple ci-dessus est une analyse jsdom, qui n’a pas
					de mise en page.
				</li>
				<li>
					Une page analysée à plusieurs largeurs de viewport donne les mêmes noms de suites et de
					tests à chaque largeur, et la vue des tests d’une CI peut les fusionner. Écrivez un
					fichier par largeur, et nommez ou regroupez les fichiers par largeur dans les réglages de
					rapport de la CI ; la propriété <code>viewport</code> enregistre la largeur que décrit
					un fichier.
				</li>
				<li>
					Les suites sont triées par critère, numériquement (1.4.3 avant 1.4.10), et les testcases
					par id de règle.
				</li>
				<li>
					Les propriétés <code>en301549</code> nomment la clause d’EN 301 549 qui reprend le critère,
					quand il y en a une et que l’analyse a demandé les clauses d’EN 301 549 (voir{" "}
					<a href="/conformance/wcag-mapping/#en-301-549">EN 301 549</a>). Chaque autre norme
					listée dans le champ <code>standards</code> du résultat ajoute des propriétés nommées
					d’après sa clé, une par exigence de cette norme à laquelle les règles de la suite sont
					associées : un point de la liste de contrôle d’un{" "}
					<a href="/configuration/packs/">pack</a> qui regroupe la règle est listé par son id,{" "}
					<code>&lt;property name="acme" value="acme-images"/&gt;</code>. Une norme que seule une
					règle personnalisée nomme n’ajoute aucune propriété.
				</li>
			</ul>
			<p>
				Un résultat compact (<code>engineOptions.output.detail: 'findings'</code>) est lu comme le
				résultat complet qu’il représente ; il est donc rapporté de la même façon.
			</p>

			<h2 id="cross-frame-results">Résultats multi-frames</h2>
			<p>
				Un résultat multi-frames (voir{" "}
				<a href="/results-reports/output-schema/#cross-frame-result">Schéma de sortie</a>) donne
				d’abord les suites de la page, puis celles de chaque frame, nommées d’après le chemin du
				frame (<code>Frame #checkout: WCAG 1.1.1 Non-text content: text alternatives</code>) et
				avec une propriété <code>frame</code> qui le contient, si bien qu’un échec dans un frame
				n’est pas fusionné avec ceux de la page. Un frame qui n’a pas répondu est une suite{" "}
				<code>Frame &lt;path&gt;</code> avec un seul testcase ignoré,{" "}
				<code>Not scanned: &lt;error&gt;</code> : le frame n’a pas été vérifié, ce qui n’est pas
				une réussite. Les totaux de <code>&lt;testsuites&gt;</code> comptent chaque frame.
			</p>

			<h2>Résultats</h2>
			<DataTable
				label="Résultats des règles dans JUnit"
				rowKey="id"
				columns={[
					{ key: "outcome", label: "Résultat de la règle", width: "18%" },
					{ key: "junit", label: "JUnit", wrap: true },
					{ key: "why", label: "Pourquoi", wrap: true },
				]}
				rows={outcomeRows}
			/>
			<p>
				Une règle <code>fail</code> qui a aussi des occurrences <code>cantTell</code> signale les
				échecs dans <code>&lt;failure&gt;</code> et les cas indécis dans{" "}
				<code>&lt;system-out&gt;</code>, où les tableaux de bord affichent la sortie des tests. Une
				règle <code>cantTell</code> ignorée fait de même.
			</p>

			<h2>Options</h2>
			<DataTable
				label="Options du rapport JUnit"
				rowKey="id"
				columns={[
					{ key: "option", label: "Option", width: "22%" },
					{ key: "default", label: "Par défaut", width: "14%" },
					{ key: "effect", label: "Effet", wrap: true },
				]}
				rows={optionRows}
			/>

			<h2>Déterminisme</h2>
			<p>
				Le moteur n’a pas d’horloge, et ce rapport n’en invente pas : chaque <code>time</code> vaut{" "}
				<code>"0"</code>, et un attribut <code>timestamp</code> n’apparaît sur chaque suite que si le
				résultat en porte un (<code>engineOptions.timestamp</code>). La même analyse produit toujours
				un XML identique octet pour octet : un rapport peut donc être versionné ou comparé.
			</p>
			<p>
				Le texte est échappé pour XML, et les caractères que XML 1.0 interdit même échappés (la
				plupart des caractères de contrôle, les surrogates isolés) sont supprimés, car le balisage
				capturé dans une page peut en contenir.
			</p>
		</>
	);
}
