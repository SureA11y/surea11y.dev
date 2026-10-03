import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const sarifLevelRows = [
	{ id: "fail", outcome: <code>fail</code>, level: <code>error</code>, meaning: "Deterministischer Verstoß: der Fall, an dem die CI scheitern soll." },
	{ id: "cantTell", outcome: <code>cantTell</code>, level: <code>warning</code>, meaning: "Erfordert manuelle Prüfung: wird angezeigt, sollte aber allein keinen Build blockieren." },
];

const sarifFieldRows = [
	{ id: "ruleId", field: <code>results[].ruleId</code>, source: <code>checksResults[i].ruleId</code> },
	{ id: "message", field: <code>results[].message.text</code>, source: <><code>occurrence.summary</code> + <code>occurrence.hint</code></> },
	{ id: "uri", field: <code>results[].locations[].physicalLocation.artifactLocation.uri</code>, source: <>Das gescannte Ziel; siehe <a href="#sarif-locations">Fundorte</a> weiter unten.</> },
	{ id: "fqn", field: <code>results[].locations[].logicalLocations[].fullyQualifiedName</code>, source: <><code>occurrence.selector</code>, sofern vorhanden.</> },
	{
		id: "fingerprint",
		field: <code>results[].partialFingerprints["surea11y/violation/v1"]</code>,
		source: (
			<>
				Derselbe Identitätsschlüssel <code>ruleId + reasonCode + html</code>, den{" "}
				<a href="/conformance/baseline/">Baseline / Allowlist</a> (<code>computeBaselineKey</code>)
				verwendet: ein stabiler, inhaltsbasierter Fingerprint statt eines positionsbasierten, für
				Konsumenten, die ihn auslesen.
			</>
		),
	},
	{
		id: "lineHash",
		field: <code>results[].partialFingerprints.primaryLocationLineHash</code>,
		source: (
			<>
				Ein Hash dieses Schlüssels, <code>&lt;16 hex digits&gt;:&lt;n&gt;</code>, wobei{" "}
				<code>n</code> einen auf der Seite wiederholten Befund zählt (dieselbe fehlerhafte
				Komponente zweimal). <span lang="en">GitHub Code Scanning</span> ordnet Alerts zwischen
				Uploads allein über dieses Feld zu. Ein DOM-Befund hat keine Zeile, die die Upload-Action
				von GitHub hashen könnte; ohne das Feld wurden Alerts daher nach Position zugeordnet, und
				das Beheben eines Befunds konnte den Alert eines anderen schließen. Wer von core 1.8 oder
				älter kommt, sieht beim ersten Upload einmalig, dass die bestehenden Alerts geschlossen und
				als neue wieder geöffnet werden; ein in GitHub verworfener Alert muss erneut verworfen werden.
			</>
		),
	},
	{ id: "props", field: <><code>results[].properties.severity</code> / <code>.confidence</code> / <code>.reasonCode</code> / <code>.html</code></>, source: <><code>severity</code>/<code>confidence</code> des Ergebnisses selbst, dazu derselbe <code>reasonCode</code> und dasselbe <code>html</code>-Snippet, auf denen der Fingerprint oben beruht. Rein informativ, nicht Teil des SARIF-Schemas selbst.</> },
	{ id: "tags", field: <code>tool.driver.rules[].properties.tags</code>, source: <><code>accessibility</code>, <code>automatic</code>/<code>manual</code> und ein <code>wcag-&lt;SC&gt;</code>-Tag pro WCAG-Erfolgskriterium in <code>meta.normativeMappings</code>. Einträge zu Understanding-Dokumenten erhalten kein Tag. Jede EN-301-549-Klausel, die das Ergebnis trägt (nur wenn der Scan sie angefordert hat, siehe <a href="/configuration/engine-options/#other-standards-mappings">Andere Normen</a>), erhält ein Tag <code>en301549-&lt;Klausel&gt;</code>, z. B. <code>en301549-9.1.1.1</code>: Klauselnummern sind in jeder Version, die sie enthält, gleich, daher trägt das Tag keine Version.</> },
	{ id: "category", field: <code>runs[0].automationDetails.id</code>, source: <>Die Option <code>category</code>, mit angehängtem <code>/</code>, falls sie keinen hat (GitHub liest alles bis zum letzten Schrägstrich als Kategorie). Fehlt, wenn keine Kategorie angegeben ist. Siehe <a href="#scanning-at-several-viewport-widths">Scannen bei mehreren Viewport-Breiten</a>.</> },
	{ id: "runProps", field: <code>runs[0].properties</code>, source: <><code>wcagVersion</code>, <code>profile</code>, <code>optInRules</code> und <code>environment</code> aus der <code>engine</code> des Ergebnisses: das Konformitätsziel des Laufs, damit ein Dashboard einen WCAG-2.1-Lauf von einem 2.2-Lauf unterscheiden kann, die Tags der Opt-in-Regeln, die er über dieses Ziel hinaus hinzugefügt hat, falls vorhanden, und die Bedingungen, unter denen die Seite dargestellt wurde (<code>layout</code>, <code>viewport</code>, <code>devicePixelRatio</code>, <code>colorScheme</code>, <code>fonts</code>; siehe <a href="/results-reports/output-schema/">Ausgabeschema</a>). Fehlt bei Ergebnissen von Engines, die diese Felder noch nicht kennen.</> },
];

export function SarifReportContent() {
	return (
		<>
			<p>
				<code>--sarif &lt;path&gt;</code> schreibt ein Log im Format{" "}
				<a href="https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html">SARIF 2.1.0</a>,
				dem Standardformat, das <span lang="en">GitHub Code Scanning</span> (und andere Dashboards, die SARIF lesen)
				erwartet, statt oder zusätzlich zum rohen Engine-Ergebnis von <code>--json</code>.
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --sarif results.sarif", command: true }]} />
			<p>
				Unter <a href="/configuration/ci-integration/">CI-Integration</a> finden Sie einen
				GitHub-Actions-Workflow zum direkten Einfügen, der einen Scan ausführt und{" "}
				<code>results.sarif</code> in den Tab „<span lang="en">Security</span>“ hochlädt.
			</p>

			<h2>Warum ein eigenes Format neben <code>--json</code></h2>
			<p>
				Das rohe Ergebnis von <code>--json</code> (siehe <a href="/results-reports/output-schema/">Ausgabeschema</a>)
				ist der eigene Vertrag dieser Engine, versioniert und stabil gemäß{" "}
				<a href={`${core}/docs/API_STABILITY.md`}><code>API_STABILITY.md</code></a>. SARIF ist ein
				anderer, extern definierter Vertrag, eigens für Code-Scanning-Dashboards gebaut. Ein
				Eintrag in <code>checksResults[]</code> und ein SARIF-<code>result</code> entsprechen sich
				nicht 1:1, deshalb <strong>ist das eine echte Umwandlung, keine erneute
				Serialisierung</strong>.
			</p>

			<h2>Was zu einem SARIF-Ergebnis wird</h2>
			<p>
				<strong>Nur <code>fail</code>- und <code>cantTell</code>-Vorkommen erzeugen SARIF-Ergebnisse</strong>{" "}
				(derselbe Ansatz „nur Verstöße“ wie beim{" "}
				<a href="/results-reports/html-report/">HTML-Bericht</a>).
			</p>
			<p>
				Eine <code>notApplicable</code>-Prüfung ist nicht immer leer: Eine Regel kann ein
				Vorkommen anhängen, das erklärt, warum sie nichts zu beurteilen hatte; die Kontrastregeln
				tun das, wenn kein Text einen berechenbaren Hintergrund hatte. Diese Vorkommen werden nie
				zu Ergebnissen (ein Konsument behandelt jedes Ergebnis als Alarm, und „wurde nicht
				ausgewertet“ ist keiner), aber sie werden auch nicht verworfen. Sie stehen als Einträge
				der Stufe <code>note</code> in{" "}
				<code>runs[0].invocations[0].toolExecutionNotices</code>, jeweils mit der Regel, aus der
				sie stammen, in <code>associatedRule.id</code>:
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
				<strong>So liest eine Pipeline, die nur SARIF auswertet, Stille nicht als
				Unbedenklichkeitsbescheinigung</strong>: Keine Kontrast-Alarme können bedeuten, dass die
				Seite in Ordnung ist, oder dass der Kontrast nie berechenbar war, und nur der Hinweis
				unterscheidet die beiden Fälle. Der Block wird nur ausgegeben, wenn es etwas zu sagen gibt;
				ein Lauf ohne Meldungen hat also gar keinen <code>invocations</code>-Schlüssel.
			</p>
			<DataTable
				label="Engine-Ergebnisse als SARIF-Stufen"
				rowKey="id"
				columns={[
					{ key: "outcome", label: "Engine-Ergebnis", width: "22%" },
					{ key: "level", label: "SARIF-Stufe", width: "18%" },
					{ key: "meaning", label: "Bedeutung", wrap: true },
				]}
				rows={sarifLevelRows}
			/>
			<p>
				Jede ausgeführte Regel (unabhängig davon, ob sie ein Ergebnis erzeugt hat) wird einmal in{" "}
				<code>runs[0].tool.driver.rules</code> aufgeführt, wobei{" "}
				<code>defaultConfiguration.level</code> aus dem <code>type</code> der Regel abgeleitet
				wird: <code>automatic</code> (kann <code>fail</code> melden) → <code>error</code>,{" "}
				<code>manual</code> (begrenzt auf <code>cantTell</code>) → <code>warning</code>.
			</p>

			<h2>Feldzuordnung</h2>
			<DataTable
				label="SARIF-Feldzuordnung"
				rowKey="id"
				columns={[
					{ key: "field", label: "SARIF-Feld", width: "36%", wrap: true },
					{ key: "source", label: "Quelle", wrap: true },
				]}
				rows={sarifFieldRows}
			/>

			<h2 id="sarif-locations">Fundorte</h2>
			<p>
				Ein DOM-basierter Scan hat keine Zeile oder Spalte zu melden, deshalb ist{" "}
				<code>physicalLocation.artifactLocation.uri</code> das gescannte Ziel selbst, keine
				Position in einer Quelldatei:
			</p>
			<ul>
				<li>
					<strong>Scans lokaler Dateien</strong>: ein Pfad relativ zum aktuellen Arbeitsverzeichnis
					(mit Schrägstrichen). Entspricht er einer echten Datei in Ihrem Repository, kann{" "}
					<span lang="en">GitHub Code Scanning</span> den Befund als Inline-Annotation anzeigen.
				</li>
				<li>
					<strong>URL-Scans</strong>: die gescannte URL selbst. <span lang="en">GitHub Code Scanning</span> listet den
					Befund trotzdem auf, kann aber keine Inline-Annotation an eine URL hängen, die keine
					Datei im Repository ist. Das liegt daran, wie SARIF und <span lang="en">Code Scanning</span> Befunde mit dem
					Quellcode verknüpfen, und ist keine Einschränkung von surea11y. Wenn Sie
					Inline-Annotationen brauchen, scannen Sie die gerenderte HTML-Datei (z. B. ein
					Build-Artefakt) statt einer Live-URL.
				</li>
			</ul>
			<p>
				<code>occurrence.selector</code> wird zusätzlich als{" "}
				<code>logicalLocations[].fullyQualifiedName</code> mitgeführt, sodass ein Konsument, der
				logische Fundorte liest, auch ohne brauchbaren physischen Fundort erfährt, um welches
				Element es geht.
			</p>

			<h2 id="scanning-at-several-viewport-widths">Scannen bei mehreren Viewport-Breiten</h2>
			<p>
				Eine layoutabhängige Regel kann bei einer Viewport-Breite fehlschlagen und bei einer anderen
				bestehen (siehe{" "}
				<a href="/help/known-limitations/">Bekannte Einschränkungen</a>), daher sind zwei Breiten
				einer Seite zwei Analysen, nicht eine. Geben Sie jeder ihre eigene Kategorie:
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
				und laden Sie jede Datei einzeln hoch. <span lang="en">GitHub Code Scanning</span> behandelt
				jede Kategorie als eigene Analyse. Innerhalb einer Kategorie ersetzt ein späterer Upload den
				früheren, und ein Alert, der darin fehlt, wird geschlossen; zwei Breiten, die unter derselben
				Kategorie hochgeladen werden, würden einen breitenspezifischen Alert also bei jedem Lauf
				öffnen und wieder schließen. GitHub lehnt außerdem eine einzelne SARIF-Datei ab, die zwei
				Runs desselben Tools und derselben Kategorie enthält.{" "}
				<code>github/codeql-action/upload-sarif</code> hat einen Input <code>category</code>, der
				dieselbe Aufgabe übernimmt, wenn die Datei keine Kategorie trägt.
			</p>
			<p>
				Die Identität eines Befunds enthält den Viewport nicht und muss es auch nicht: Dasselbe
				Element mit demselben Mangel ist bei jeder Breite derselbe Befund, und die Kategorie hält die
				Analysen auseinander. <code>runs[0].properties.environment</code> hält den Viewport fest,
				den jeder Lauf verwendet hat.
			</p>

			<h2>Kombination mit <code>--baseline</code></h2>
			<p>
				Ein generischer SARIF-Konsument kennt kein eigenes Konzept für „bekannt, nicht daran
				scheitern“. Die einzige getreue Art, eine Baseline in der SARIF-Ausgabe zu berücksichtigen,
				ist daher,{" "}
				<strong>bereits bekannte <code>fail</code>-Vorkommen ganz wegzulassen, statt sie auf{" "}
				<code>warning</code> herabzustufen</strong>:
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --baseline baseline.json --sarif results.sarif", command: true }]} />
			<p>
				<code>cantTell</code>-Vorkommen werden nie durch eine Baseline gefiltert: Der
				Baseline-Mechanismus erfasst ausschließlich <code>fail</code>-Vorkommen (passend zu{" "}
				<code>--write-baseline</code>, siehe{" "}
				<a href="/conformance/baseline/">Baseline / Allowlist</a>).
			</p>

			<h2>Kombination mit <code>--html</code>/<code>--json</code></h2>
			<p>
				<code>--sarif</code>, <code>--html</code> und <code>--json</code> sind unabhängige
				Ausgabe-Flags: Übergeben Sie in einem Lauf jede beliebige Kombination; jedes schreibt bzw.
				gibt seinen eigenen Bericht aus demselben einzelnen Scan aus.
			</p>
		</>
	);
}
