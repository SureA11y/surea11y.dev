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
		id: "leanFailAs",
		option: <code>leanFailAs</code>,
		default: <code>'skipped'</code>,
		effect: (
			<>
				<code>'failure'</code> signale une règle dont les constats non tranchés en comptent un qui
				penche vers l’échec (son{" "}
				<a href="/results-reports/output-schema/#leans"><code>lean</code></a>) sous forme de{" "}
				<code>&lt;failure type="leanFail"&gt;</code>, en listant ces constats, chacun avec la
				raison pour laquelle il échoue probablement (<code>likely fails:</code>), la mise en garde
				de la tendance quand elle en a une, et la façon dont une personne le confirme (
				<code>how to check:</code>, les étapes{" "}
				<a href="/results-reports/output-schema/#how-to-check"><code>howToCheck</code></a> du
				constat, puis <code>fails when:</code>), que le rapport ajoute dans Node à un résultat qui
				arrive sans elles ; ses autres constats non tranchés restent tels que le dit{" "}
				<code>cantTellAs</code>. Pour un pipeline qui bloque sur les échecs probables sans
				bloquer sur chaque question. Y compris pour une règle de bonne pratique : une telle
				règle, associée à aucun critère WCAG, n’échoue jamais, et les faits qu’elle constate
				penchent vers l’échec sans condition, si bien qu’un niveau de titre sauté (
				<code>heading-order</code>, un <code>&lt;h1&gt;</code> puis un <code>&lt;h3&gt;</code>)
				devient un <code>&lt;failure type="leanFail"&gt;</code> dans <code>Other checks</code>.
				Une règle dont chaque critère est hors de la cible de l’analyse ne bloque pas, comme pour
				un échec. Lue quelle que soit la casse ; toute autre valeur lève une{" "}
				<code>TypeError</code>. <code>leaningFailures(result, {"{ wcagOnly }"})</code>, de{" "}
				<code>@surea11y/core</code>, liste les constats sur lesquels elle bloque, avant la
				baseline.
			</>
		),
	},
	{
		id: "leanFailWcagOnly",
		option: <code>leanFailWcagOnly</code>,
		default: <code>false</code>,
		effect: (
			<>
				Avec <code>leanFailAs: 'failure'</code>, <code>true</code> ne bloque que sur les constats
				des règles associées à un critère WCAG de la cible de l’analyse, en laissant de côté les
				tendances des règles de bonne pratique. Une valeur autre que <code>true</code> ou{" "}
				<code>false</code> lève une <code>TypeError</code>.
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
				test réussi : elle n’a pas réussi. Une entrée écrite par la version mineure précédente,
				sous un code de raison qui a changé depuis,{" "}
				<a href="/conformance/baseline/#upgrading">correspond toujours au constat sous son nouveau code</a>. Avec{" "}
				<code>leanFailAs: 'failure'</code>, un constat qui penche vers l’échec et a une entrée
				marquée <code>lean: 'fail'</code> (
				<code>{"buildBaselineEntries(result, { leanFail: true })"}</code>) ne bloque pas non plus,
				et le message <code>&lt;skipped&gt;</code> le compte parmi les{" "}
				<code>known likely failures recorded in the baseline</code>.
			</>
		),
	},
	{
		id: "packs",
		option: <code>packs</code>,
		default: "aucune",
		effect: (
			<>
				Les packs que l’analyse a exécutés (<code>engineOptions.packs</code>) : avec{" "}
				<code>leanFailAs: 'failure'</code>, les échecs probables d’une règle de pack donnent les
				étapes de son propre <code>meta.review</code>, comme dans le{" "}
				<a href="/results-reports/html-report/">rapport HTML</a>.
			</>
		),
	},
	{
		id: "allowProfilesNotRun",
		option: <code>allowProfilesNotRun</code>,
		default: <code>false</code>,
		effect: (
			<>
				Une analyse de <a href="/configuration/engine-options/#several-profiles">plusieurs profils</a>{" "}
				qui en a exécuté moins qu’elle n’en demandait (<code>engine.profilesNotRun</code>) a compté
				moins que ce qui lui était demandé : chaque profil non exécuté est une{" "}
				<code>&lt;error&gt;</code> dans une suite <code>Profiles</code>. <code>true</code> en fait
				des tests ignorés. Une valeur autre que <code>true</code> ou <code>false</code> lève une{" "}
				<code>TypeError</code>. Core 1.15.0 et ultérieur.
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
				. En ligne de commande, inutile de l’appeler :{" "}
				<code>surea11y scan &lt;target&gt; --junit a11y.junit.xml</code> (CLI 1.1.0 ou ultérieure)
				écrit le rapport lui-même, avec les options par défaut plus les{" "}
				<code>baselineEntries</code> de son fichier <code>--baseline</code>. Voir{" "}
				<a href="/configuration/ci-integration/#junit-test-reports">Intégration CI</a> pour des
				recettes GitLab et Azure DevOps.
			</p>

			<h2>Structure</h2>
			<p>
				Un <code>&lt;testsuite&gt;</code> par critère de succès WCAG, un{" "}
				<code>&lt;testcase&gt;</code> par règle qui y est associée. En analysant cette page avec
				l’appel ci-dessus :
			</p>
			<CodeBlock
				lang="html"
				lines={[
					"<!doctype html>",
					'<html lang="en">',
					"<head><title>Home</title></head>",
					'<body><main><h1>Welcome</h1><img src="a.png"></main></body>',
					"</html>",
				]}
			/>
			<p>on obtient :</p>
			<CodeBlock
				lang="html"
				lines={[
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<testsuites name="surea11y" tests="14" failures="1" errors="0" skipped="4" time="0">',
					'  <testsuite name="WCAG 1.1.1" tests="1" failures="1" errors="0" skipped="0" time="0">',
					"    <properties>",
					'      <property name="wcagCriterion" value="1.1.1"/>',
					'      <property name="title" value="Non-text content: text alternatives"/>',
					'      <property name="wcagLevel" value="A"/>',
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
					'      <failure type="fail" message="1 failing occurrence: This &lt;img&gt; has no alt attribute.">- This &lt;img&gt; has no alt attribute. Add an alt attribute that says what the image shows, or alt=&quot;&quot; if the image is purely decorative.',
					"  selector: html &gt; body &gt; main &gt; img",
					"  html: &lt;img src=&quot;a.png&quot;&gt;",
					"help: https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html</failure>",
					"    </testcase>",
					"  </testsuite>",
					"  <!-- 10 more suites trimmed: 13 tests, 4 of them skipped (manual review) -->",
					"</testsuites>",
				]}
			/>
			<ul>
				<li>
					<strong>Une suite verte nommée d’après un critère</strong> signifie que les règles
					exécutées pour lui n’ont signalé aucun échec. Cela ne signifie pas que le critère a été
					entièrement vérifié, ni qu’il est satisfait : la plupart des critères ont des parties
					qu’aucune règle ne couvre (voir{" "}
					<a href="/conformance/wcag-mapping/">Correspondance de conformité WCAG</a>). Sa
					propriété <code>criterionOutcome</code> le dit : <code>cantTell</code> lorsque les
					règles ont réussi mais ne vérifient qu’une partie du critère, ce qui est aujourd’hui le
					cas de chaque critère.
				</li>
				<li>
					<strong>Les suites suivent le critère</strong>, parce que c’est ce que l’on suit, et{" "}
					<strong>les testcases suivent la règle</strong> plutôt que l’occurrence : un défaut répété
					quarante fois sur une page est un seul test en échec dont le corps liste les quarante, et
					le nombre de tests reste stable d’une exécution à l’autre.
				</li>
				<li id="names-in-every-locale">
					<strong>Les noms sont les mêmes dans toutes les langues.</strong> Une suite est nommée{" "}
					<code>WCAG &lt;criterion&gt;</code> (<code>WCAG 1.4.3</code>), la suite des règles
					associées à aucun critère <code>Other checks</code>, un testcase d’après son id de règle,
					et son <code>classname</code> vaut <code>wcag-&lt;criterion&gt;</code> ou{" "}
					<code>other</code>, quelle que soit la <code>engineOptions.locale</code> de l’analyse.
					L’historique des tests en CI (GitLab, Jenkins, les rapporteurs de tests de GitHub) repose
					sur ces noms : une analyse lue en français donne donc les mêmes tests qu’une analyse lue
					en anglais. Le titre du critère, qui est traduit, est la propriété <code>title</code> de
					la suite (<code>Contrast: minimum</code>, <code>Contraste (minimum)</code>). Le texte des
					constats eux-mêmes (le message et l’indication de chaque occurrence) est dans la langue de
					l’analyse ; les mots que le rapport ajoute autour sont en anglais dans toutes les langues :
					le compte qui ouvre un <code>message</code> (
					<code>1 failing occurrence: Cet élément &lt;img&gt; n’a pas d’attribut alt.</code>), les
					libellés <code>selector:</code>, <code>html:</code> et <code>help:</code>, et les messages{" "}
					<code>&lt;skipped&gt;</code>.{" "}
					<strong>Avant core 1.12, le nom d’une suite portait le titre du critère</strong> (
					<code>WCAG 1.1.1 Non-text content: text alternatives</code>) : le premier rapport après
					la mise à jour affiche donc chaque test une fois comme nouveau dans un tableau de bord qui
					suivait les anciens noms, et leur historique repart de là.
				</li>
				<li>
					Les suites proviennent des correspondances WCAG de chaque règle, pas des composites :
					chaque règle exécutée est donc signalée même si les composites ont été exclus. Le composite,
					s’il s’est exécuté, fournit la propriété <code>title</code> de la suite et la propriété{" "}
					<code>criterionOutcome</code>, qui compte les règles personnalisées associées au critère
					comme il compte les règles intégrées. Un critère vérifié par plusieurs composites (4.1.2 :
					son nom accessible et sa validité ARIA) prend le pire de leurs résultats, puisqu’une
					partie en échec fait échouer le critère, et le titre que partagent leurs titres (
					<code>Name, role, value</code>). Une règle associée à deux critères apparaît dans les deux
					suites. Une règle sans critère va dans une suite finale <code>Other checks</code> avec{" "}
					<code>classname="other"</code>.
				</li>
				<li>
					<strong>Les suites suivent le niveau et la version WCAG de l’analyse.</strong> Un critère
					que l’analyse a écarté de <code>rulesResults</code> à cause d’eux n’a pas de suite : un
					critère AAA sous <code>engineOptions.wcagLevel: 'AA'</code> (
					<code>engine.wcagLevel</code>), ou 4.1.1 Analyse syntaxique quand{" "}
					<code>{"includeRuleIds: ['duplicate-id']"}</code> s’est exécuté sous WCAG 2.2 (
					<code>engine.wcagVersion</code>), qui l’a supprimé. Un critère que l’analyse signale
					est conservé, comme une agrégation nommée par son id au-dessus du niveau, un critère{" "}
					<a href="/results-reports/output-schema/#partly-checked">partiellement vérifié</a>, ou
					4.1.1 dans une analyse 2.2 qui l’a sélectionné. Une règle associée seulement à des
					critères écartés va dans <code>Other checks</code>, et ses échecs sont{" "}
					<code>
						&lt;skipped message="Not counted: WCAG 1.4.6 is outside the scan's target, WCAG 2.2
						AA; 1 failing occurrence"&gt;
					</code>
					, avec les occurrences dans <code>&lt;system-out&gt;</code> : la règle s’est exécutée et
					a échoué, ce que le rapport montre, mais un build AA n’échoue pas sur un critère AAA. Une
					règle qui ne s’est pas terminée reste une <code>&lt;error&gt;</code>. Un niveau que
					donne la sélection (<code>runOnly.wcag.level</code>, ou des tags de niveau) est lui aussi
					enregistré comme <code>engine.wcagLevel</code>, et filtre les suites de la même façon. Un
					résultat qui n’enregistre ni <code>engine.wcagLevel</code> ni{" "}
					<code>engine.wcagVersion</code>, comme celui d’un moteur plus ancien, garde tous les
					critères.
				</li>
				<li>
					<code>engine</code>, <code>schemaVersion</code>, <code>wcagVersion</code>,{" "}
					<code>profile</code> (le premier profil, pour une analyse de plusieurs),{" "}
					<code>profiles</code> (une analyse de plusieurs profils uniquement : chaque profil
					qu’elle a exécuté, séparés par des virgules), <code>optInRules</code>, les conditions de
					rendu issues de{" "}
					<a href="/results-reports/output-schema/">
						<code>engine.environment</code>
					</a>{" "}
					(<code>layout</code> et, dans un navigateur, <code>viewport</code> sous la forme{" "}
					<code>1280x720</code>, <code>devicePixelRatio</code>, <code>colorScheme</code>,{" "}
					<code>forcedColors</code> et{" "}
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
				frame (<code>Frame #checkout: WCAG 1.1.1</code>, le même dans toutes les langues) et avec
				une propriété <code>frame</code> qui le contient, et le <code>classname</code> de leurs
				testcases commence par lui (<code>frame #checkout wcag-1.1.1</code>), si bien qu’un échec
				dans un frame n’est pas fusionné avec ceux de la page par une CI qui identifie les tests
				par nom de suite ou par <code>classname</code> et <code>name</code>. Un frame qui n’a pas répondu est une suite{" "}
				<code>Frame &lt;path&gt;</code> avec un seul testcase ignoré,{" "}
				<code>Not scanned: &lt;error&gt;</code> : le frame n’a pas été vérifié, ce qui n’est pas
				une réussite. Les totaux de <code>&lt;testsuites&gt;</code> comptent chaque frame.
			</p>

			<h2 id="outcomes">Résultats</h2>
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
			<p>
				La ligne <code>selector:</code> d’un élément situé dans un arbre shadow nomme d’abord les
				shadow hosts, puis l’élément, joints par <code>{" >>> "}</code> :{" "}
				<code>{"html > body > main > x-card >>> button"}</code>. C’est le même emplacement que
				donnent <a href="/results-reports/sarif-report/#field-mapping">SARIF</a> et le{" "}
				<a href="/results-reports/html-report/">rapport HTML</a>.
			</p>

			<h2 id="options">Options</h2>
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
