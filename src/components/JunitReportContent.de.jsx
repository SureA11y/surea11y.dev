import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const outcomeRows = [
	{
		id: "fail",
		outcome: <code>fail</code>,
		junit: (
			<>
				<code>&lt;failure type="fail"&gt;</code>, eine Zeile pro fehlgeschlagenem Vorkommen (Meldung,
				Hinweis, Selektor, Markup), danach <code>help: &lt;url&gt;</code>, wenn die Regel einen{" "}
				<code>http(s)</code>-Hilfelink hat (<code>meta.helpUrl</code>), sonst das
				Understanding-Dokument ihres ersten WCAG-Kriteriums
			</>
		),
		why: "Der deterministische Fall, an dem das Gate scheitert.",
	},
	{
		id: "cantTell",
		outcome: <code>cantTell</code>,
		junit: (
			<>
				<code>&lt;skipped&gt;</code> mit der Anzahl der Vorkommen, die manuell geprüft werden müssen
			</>
		),
		why: (
			<>
				JUnit kennt kein „nicht entscheidbar“. Übersprungen macht es sichtbar, ohne den Build rot
				zu färben — dieselbe Linie, die <a href="/results-reports/sarif-report/">SARIF</a> mit{" "}
				<code>warning</code> zieht.
			</>
		),
	},
	{ id: "pass", outcome: <code>pass</code>, junit: <>ein einfaches <code>&lt;testcase&gt;</code></>, why: "" },
	{
		id: "notApplicable",
		outcome: <code>notApplicable</code>,
		junit: "weggelassen",
		why: (
			<>
				Eine Seite hat Hunderte davon, und keines sagt etwas aus.{" "}
				<code>includeNotApplicable: true</code> fügt sie als{" "}
				<code>&lt;skipped message="Not applicable"&gt;</code> hinzu.
			</>
		),
	},
	{
		id: "ruleError",
		outcome: <>eine Regel, die nicht abgeschlossen wurde (<code>cantTell</code> ohne Vorkommen und mit einem <code>error</code>: Sie hat eine Ausnahme geworfen)</>,
		junit: <><code>&lt;error type="ruleError"&gt;</code> mit dem Fehler, gezählt in <code>errors</code></>,
		why: "Das JUnit-Element für einen Test, der nicht laufen konnte. Die Seite wurde nicht gegen die Regel geprüft, was weder ein Bestehen ist noch etwas, das zu prüfen wäre.",
	},
];

const optionRows = [
	{
		id: "cantTellAs",
		option: <code>cantTellAs</code>,
		default: <code>'skipped'</code>,
		effect: (
			<>
				<code>'failure'</code> meldet <code>cantTell</code>-Regeln als{" "}
				<code>&lt;failure type="cantTell"&gt;</code>, für eine Pipeline, die nicht bestehen darf,
				solange etwas unentschieden ist. Groß- und Kleinschreibung spielt keine Rolle; ein anderer
				Wert wirft einen <code>TypeError</code>, da ein falsch geschriebener stillschweigend nicht
				als Gate wirken würde.
			</>
		),
	},
	{
		id: "includeNotApplicable",
		option: <code>includeNotApplicable</code>,
		default: <code>false</code>,
		effect: <>Nimmt <code>notApplicable</code>-Regeln als übersprungene Tests auf.</>,
	},
	{
		id: "baselineEntries",
		option: <code>baselineEntries</code>,
		default: "keine",
		effect: (
			<>
				Einträge aus <code>buildBaselineEntries()</code> der{" "}
				<a href="/conformance/baseline/">Baseline</a>. Dort erfasste fehlgeschlagene Vorkommen
				werden verworfen, genau wie in SARIF. Die Option nimmt die Baseline-Datei so, wie sie
				gespeichert ist (<code>JSON.parse</code> davon), oder ihre <code>entries</code>-Liste. Eine
				Regel, deren Fehlschläge alle bereits bekannt
				sind, wird zu{" "}
				<code>&lt;skipped message="N known failures recorded in the baseline"&gt;</code>, nicht zu
				einem bestandenen Test: Sie hat nicht bestanden.
			</>
		),
	},
	{
		id: "name",
		option: <code>name</code>,
		default: <code>'surea11y'</code>,
		effect: (
			<>
				Der <code>name</code> des obersten <code>&lt;testsuites&gt;</code>, um die Berichte mehrerer
				Seiten in einem Dashboard auseinanderzuhalten.
			</>
		),
	},
];

export function JunitReportContent() {
	return (
		<>
			<p>
				<code>@surea11y/core/junit</code> gibt ein Scan-Ergebnis als JUnit-XML aus, das
				Testberichtsformat, das CI-Dashboards nativ lesen: das Test-Widget in Merge Requests von
				GitLab, den Tests-Tab von Azure DevOps, Jenkins und CircleCI.
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
				<code>renderJunitReport(result, options)</code> ist eine reine Funktion: Sie gibt das XML als
				String zurück und greift nie auf das Dateisystem zu. Sie funktioniert genauso mit einem
				zuvor als JSON gespeicherten Ergebnis, etwa der Ausgabe von{" "}
				<code>surea11y scan &lt;target&gt; --json</code> aus{" "}
				<a href="https://github.com/SureA11y/cli#readme">
					<code>@surea11y/cli</code>
				</a>
				. Auf der Kommandozeile müssen Sie sie nicht aufrufen:{" "}
				<code>surea11y scan &lt;target&gt; --junit a11y.junit.xml</code> (CLI 1.1.0 oder neuer)
				schreibt den Bericht selbst, mit den Standardoptionen und den{" "}
				<code>baselineEntries</code> seiner <code>--baseline</code>-Datei. Rezepte für GitLab und
				Azure DevOps finden Sie unter{" "}
				<a href="/configuration/ci-integration/#junit-test-reports">CI-Integration</a>.
			</p>

			<h2>Aufbau</h2>
			<p>
				Ein <code>&lt;testsuite&gt;</code> pro WCAG-Erfolgskriterium, ein{" "}
				<code>&lt;testcase&gt;</code> pro zugeordneter Regel. Ein Scan dieser Seite mit dem
				Aufruf oben:
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
			<p>ergibt:</p>
			<CodeBlock
				lang="html"
				lines={[
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<testsuites name="surea11y" tests="13" failures="1" errors="0" skipped="5" time="0">',
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
					"  <!-- 10 more suites trimmed: 12 tests, 5 of them skipped (manual review) -->",
					"</testsuites>",
				]}
			/>
			<ul>
				<li>
					<strong>Eine grüne Suite, die nach einem Kriterium benannt ist</strong>, bedeutet, dass
					die Regeln, die dafür gelaufen sind, keinen Fehlschlag gemeldet haben. Sie bedeutet nicht,
					dass das Kriterium vollständig geprüft oder erfüllt ist: Die meisten Kriterien haben
					Teile, die keine Regel abdeckt (siehe{" "}
					<a href="/conformance/wcag-mapping/">WCAG-Konformitätszuordnung</a>).
				</li>
				<li>
					<strong>Suites folgen dem Kriterium</strong>, weil Menschen danach verfolgen, und{" "}
					<strong>Testcases folgen der Regel</strong> statt dem Vorkommen, sodass ein Fehler, der
					vierzigmal auf einer Seite auftritt, ein einziger fehlgeschlagener Test ist, dessen Inhalt
					alle vierzig auflistet, und die Testzahlen zwischen Läufen stabil bleiben.
				</li>
				<li id="names-in-every-locale">
					<strong>Die Namen sind in jeder Locale gleich.</strong> Eine Suite heißt{" "}
					<code>WCAG &lt;criterion&gt;</code> (<code>WCAG 1.4.3</code>), die Suite der Regeln ohne
					Kriterium <code>Other checks</code>, ein Testcase wie seine Regel-ID, und sein{" "}
					<code>classname</code> ist <code>wcag-&lt;criterion&gt;</code> oder <code>other</code>,
					gleich in welcher <code>engineOptions.locale</code> der Scan lief. Die Testhistorie der CI
					(GitLab, Jenkins, Test-Reporter für GitHub) ist an diese Namen gebunden, daher ergibt ein
					auf Französisch gelesener Scan dieselben Tests wie ein auf Englisch gelesener. Der Titel
					des Kriteriums, der übersetzt wird, ist die Eigenschaft <code>title</code> der Suite (
					<code>Contrast: minimum</code>, <code>Contraste (minimum)</code>). Der Text der Befunde
					selbst (Meldung und Hinweis jedes Vorkommens) steht in der Locale des Scans; die Wörter, die
					der Bericht darum herum hinzufügt, sind in jeder Locale Englisch: die Zählung am Anfang
					einer <code>message</code> (
					<code>1 failing occurrence: Cet élément &lt;img&gt; n’a pas d’attribut alt.</code>), die
					Labels <code>selector:</code>, <code>html:</code> und <code>help:</code> und die
					Meldungen in <code>&lt;skipped&gt;</code>.{" "}
					<strong>Vor core 1.12 enthielt der Name einer Suite den Titel des Kriteriums</strong> (
					<code>WCAG 1.1.1 Non-text content: text alternatives</code>). Ein Dashboard, das die alten
					Namen verfolgt hat, zeigt daher im ersten Bericht nach dem Update jeden Test einmalig als
					neu, und ihre Historie beginnt dort von vorn.
				</li>
				<li>
					Suites entstehen aus den WCAG-Zuordnungen jeder Regel, nicht aus den zusammengesetzten
					Regeln, daher wird jede gelaufene Regel gemeldet, auch wenn zusammengesetzte Regeln
					ausgeschlossen wurden. Die zusammengesetzte Regel liefert, falls sie gelaufen ist, die
					Eigenschaft <code>title</code> der Suite und die Eigenschaft{" "}
					<code>criterionOutcome</code>, die die eigenen Regeln, die
					dem Kriterium zugeordnet sind, genauso zählt wie die eingebauten. Ein Kriterium, das von
					mehreren zusammengesetzten Regeln geprüft wird (4.1.2: sein zugänglicher Name und seine
					ARIA-Gültigkeit), übernimmt das schlechteste ihrer Ergebnisse, da ein fehlgeschlagener
					Teil das Kriterium scheitern lässt, und den Titel, den ihre Titel gemeinsam haben (
					<code>Name, role, value</code>). Eine Regel mit zwei Kriterien
					erscheint in beiden Suites. Eine Regel ohne Kriterium kommt in eine abschließende Suite{" "}
					<code>Other checks</code> mit <code>classname="other"</code>.
				</li>
				<li>
					<strong>Suites folgen der WCAG-Stufe und -Version des Scans.</strong> Ein Kriterium, das
					der Scan ihretwegen aus <code>rulesResults</code> ausgelassen hat, erhält keine Suite: ein
					AAA-Kriterium unter <code>engineOptions.wcagLevel: 'AA'</code> (
					<code>engine.wcagLevel</code>) oder 4.1.1 „Syntaxanalyse“, wenn{" "}
					<code>{"includeRuleIds: ['duplicate-id']"}</code> unter WCAG 2.2 lief (
					<code>engine.wcagVersion</code>), da WCAG 2.2 es gestrichen hat. Ein Kriterium, das der Scan
					meldet, bleibt erhalten, etwa eine per ID genannte Zusammenfassung oberhalb der Stufe, ein{" "}
					<a href="/results-reports/output-schema/#partly-checked">teilweise geprüftes</a>{" "}
					Kriterium oder 4.1.1 in einem 2.2-Scan, der es ausgewählt hat. Eine Regel, die nur
					ausgelassenen Kriterien zugeordnet ist, kommt in <code>Other checks</code>, und ihre
					Fehlschläge sind{" "}
					<code>
						&lt;skipped message="Not counted: WCAG 1.4.6 is outside the scan's target, WCAG 2.2
						AA; 1 failing occurrence"&gt;
					</code>
					, mit den Vorkommen in <code>&lt;system-out&gt;</code>: Die Regel ist gelaufen und hat{" "}
					<code>fail</code> ergeben, was der Bericht zeigt, aber ein AA-Build scheitert nicht an
					einem AAA-Kriterium. Eine Regel, die nicht abgeschlossen wurde, ist weiterhin ein{" "}
					<code>&lt;error&gt;</code>. Eine Stufe, die sich aus der Auswahl ergibt (
					<code>runOnly.wcag.level</code> oder Stufen-Tags), wird ebenfalls als{" "}
					<code>engine.wcagLevel</code> festgehalten und begrenzt die Suites genauso. Ein Ergebnis,
					das weder <code>engine.wcagLevel</code> noch <code>engine.wcagVersion</code> festhält, wie
					das einer älteren Engine, behält jedes Kriterium.
				</li>
				<li>
					<code>engine</code>, <code>schemaVersion</code>, <code>wcagVersion</code>,{" "}
					<code>profile</code>, <code>optInRules</code>, die Darstellungsbedingungen aus{" "}
					<a href="/results-reports/output-schema/">
						<code>engine.environment</code>
					</a>{" "}
					(<code>layout</code> und in einem Browser <code>viewport</code> als <code>1280x720</code>,{" "}
					<code>devicePixelRatio</code>, <code>colorScheme</code>, <code>forcedColors</code> und{" "}
					<code>fonts</code>),{" "}
					<code>locale</code> und <code>url</code> des Laufs werden als Eigenschaften in jeder Suite
					wiederholt, jeweils nur, wenn das Ergebnis sie enthält. Ein Fehlschlag, der je nach
					Viewport-Breite auftaucht oder verschwindet, lässt sich so auf die Breite zurückführen, die
					der Lauf verwendet hat. Das Beispiel oben ist ein jsdom-Scan, der kein Layout hat.
				</li>
				<li>
					Eine bei mehreren Viewport-Breiten gescannte Seite ergibt bei jeder Breite dieselben Namen
					für Suites und Tests, und eine Testansicht in der CI führt sie womöglich zusammen. Schreiben
					Sie eine Datei pro Breite, und benennen oder gruppieren Sie die Dateien in den
					Berichtseinstellungen der CI nach Breite; die Eigenschaft <code>viewport</code> hält fest,
					welche Breite eine Datei beschreibt.
				</li>
				<li>
					Suites sind nach Kriterium numerisch sortiert (1.4.3 vor 1.4.10), Testcases nach Regel-id.
				</li>
				<li>
					<code>en301549</code>-Eigenschaften nennen die EN-301-549-Klausel, die das Kriterium
					wiedergibt, sofern es eine gibt und der Scan EN-301-549-Klauseln angefordert hat (siehe{" "}
					<a href="/conformance/wcag-mapping/#en-301-549">EN 301 549</a>). Jede andere Norm in{" "}
					<code>standards</code> des Ergebnisses fügt Eigenschaften hinzu, die nach ihrem Schlüssel
					benannt sind, eine pro Anforderung dieser Norm, auf die die Regeln der Suite abgebildet
					sind: Ein Checklistenpunkt eines <a href="/configuration/packs/">Packs</a>, der die Regel
					gruppiert, wird mit seiner id aufgeführt,{" "}
					<code>&lt;property name="acme" value="acme-images"/&gt;</code>. Eine Norm, die nur eine
					eigene Regel nennt, fügt keine Eigenschaft hinzu.
				</li>
			</ul>
			<p>
				Ein kompaktes Ergebnis (<code>engineOptions.output.detail: 'findings'</code>) wird als das
				vollständige Ergebnis gelesen, für das es steht, und daher genauso gemeldet.
			</p>

			<h2 id="cross-frame-results">Frame-übergreifende Ergebnisse</h2>
			<p>
				Ein Frame-übergreifendes Ergebnis (siehe{" "}
				<a href="/results-reports/output-schema/#cross-frame-result">Ausgabeschema</a>) liefert
				zuerst die Suites der Seite, dann die jedes Frames, benannt nach dem Pfad des Frames (
				<code>Frame #checkout: WCAG 1.1.1</code>, in jeder Locale gleich) und mit einer Eigenschaft{" "}
				<code>frame</code>, die ihn enthält, und der <code>classname</code> ihrer Testcases beginnt
				mit ihm (<code>frame #checkout wcag-1.1.1</code>), sodass eine CI, die Tests nach
				Suite-Namen oder nach <code>classname</code> und <code>name</code> zuordnet, einen
				Fehlschlag in einem Frame nicht mit denen der Seite zusammenführt. Ein Frame, der nicht geantwortet hat, ist eine
				Suite <code>Frame &lt;path&gt;</code> mit einem übersprungenen Testcase,{" "}
				<code>Not scanned: &lt;error&gt;</code>: Der Frame wurde nicht geprüft, und das ist kein
				Bestehen. Die Summen auf <code>&lt;testsuites&gt;</code> zählen jeden Frame.
			</p>

			<h2 id="outcomes">Ergebnisse</h2>
			<DataTable
				label="Regelergebnisse in JUnit"
				rowKey="id"
				columns={[
					{ key: "outcome", label: "Ergebnis der Regel", width: "18%" },
					{ key: "junit", label: "JUnit", wrap: true },
					{ key: "why", label: "Warum", wrap: true },
				]}
				rows={outcomeRows}
			/>
			<p>
				Eine <code>fail</code>-Regel, die auch <code>cantTell</code>-Vorkommen hat, meldet die
				Fehlschläge in <code>&lt;failure&gt;</code> und die unentschiedenen in{" "}
				<code>&lt;system-out&gt;</code>, wo Dashboards die Testausgabe zeigen. Eine übersprungene{" "}
				<code>cantTell</code>-Regel macht es genauso.
			</p>
			<p>
				Die <code>selector:</code>-Zeile eines Elements in einem Shadow Tree nennt zuerst die
				Shadow Hosts, dann das Element, verbunden mit <code>{" >>> "}</code>:{" "}
				<code>{"html > body > main > x-card >>> button"}</code>. Es ist derselbe Fundort, den{" "}
				<a href="/results-reports/sarif-report/#field-mapping">SARIF</a> und der{" "}
				<a href="/results-reports/html-report/">HTML-Bericht</a> angeben.
			</p>

			<h2>Optionen</h2>
			<DataTable
				label="Optionen des JUnit-Berichts"
				rowKey="id"
				columns={[
					{ key: "option", label: "Option", width: "22%" },
					{ key: "default", label: "Standard", width: "14%" },
					{ key: "effect", label: "Wirkung", wrap: true },
				]}
				rows={optionRows}
			/>

			<h2>Determinismus</h2>
			<p>
				Die Engine hat keine Uhr, und dieser Bericht erfindet keine: Jedes <code>time</code> ist{" "}
				<code>"0"</code>, und ein <code>timestamp</code>-Attribut erscheint an jeder Suite nur, wenn
				das Ergebnis eines trägt (<code>engineOptions.timestamp</code>). Derselbe Scan erzeugt immer
				byte-identisches XML, sodass sich ein Bericht einchecken oder vergleichen lässt.
			</p>
			<p>
				Text wird für XML maskiert, und Zeichen, die XML 1.0 auch maskiert verbietet (die meisten
				Steuerzeichen, einzelne Surrogates), werden entfernt, da von einer Seite erfasstes Markup
				sie enthalten kann.
			</p>
		</>
	);
}
