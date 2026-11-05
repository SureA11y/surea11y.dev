import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const sarifLevelRows = [
	{ id: "fail", outcome: <code>fail</code>, level: <code>error</code>, meaning: "Deterministischer Verstoß: der Fall, an dem die CI scheitern soll." },
	{ id: "cantTell", outcome: <code>cantTell</code>, level: <code>warning</code>, meaning: "Erfordert manuelle Prüfung: wird angezeigt, sollte aber allein keinen Build blockieren." },
	{ id: "leanFail", outcome: <><code>cantTell</code> mit Tendenz zu <code>fail</code>, mit <code>leanFailAs: 'error'</code></>, level: <code>error</code>, meaning: <>Offen, aber die Anhaltspunkte der Seite weisen auf einen Fehler (<a href="/results-reports/output-schema/#leans"><code>lean</code></a>); zählt für eine Schranke auf <code>error</code>.</> },
];

const sarifFieldRows = [
	{ id: "ruleId", field: <code>results[].ruleId</code>, source: <code>checksResults[i].ruleId</code> },
	{ id: "message", field: <code>results[].message.text</code>, source: <><code>occurrence.summary</code> + <code>occurrence.hint</code>. Ein Vorkommen ohne Zusammenfassung (etwa das einer eigenen Regel) verwendet den Titel der Regel oder ihre ID, da GitHub ein Ergebnis mit leerem Text ablehnt. Bei einem offenen Befund folgen nach einer Leerzeile seine Schritte: <code>How to check:</code>, die nummerierten Schritte, dann <code>Passes when:</code> und <code>Fails when:</code>, sodass ein Alert sagt, wie er sich beantworten lässt.</> },
	{ id: "howToCheck", field: <code>results[].properties.howToCheck</code>, source: <>Die Schritte eines offenen Befunds, <code>{"{ steps, passWhen, failWhen }"}</code>, wie <a href="/results-reports/output-schema/#how-to-check"><code>occurrence.howToCheck</code></a> sie liefert. Ein Ergebnis, das ohne sie kommt, wie das eines Bindings, erhält sie in Node; <code>packs</code> (die Packs, die der Scan ausgeführt hat) fügt die eigenen einer Pack-Regel hinzu. Wie die Tendenz nicht Teil der Identität des Befunds.</> },
	{ id: "uri", field: <code>results[].locations[].physicalLocation.artifactLocation.uri</code>, source: <>Das gescannte Ziel; siehe <a href="#sarif-locations">Fundorte</a> weiter unten.</> },
	{ id: "fqn", field: <code>results[].locations[].logicalLocations[].fullyQualifiedName</code>,source: <>Der Fundort des Elements, mit <code>kind: "element"</code>, wenn <code>occurrence.selector</code> ein nicht leerer String ist. Außerhalb eines Shadow Trees ist es der Selektor. Bei einem Element in einem Shadow Tree sind es die Selektoren der Shadow Hosts und dann der eigene des Elements, verbunden mit <code>{" >>> "}</code>: <code>{"html > body > main > x-card >>> button"}</code>. Die <code>selector:</code>-Zeile von JUnit und der HTML-Bericht zeigen denselben Text.</> },
	{
		id: "fingerprint",
		field: <code>results[].partialFingerprints["surea11y/violation/v2"]</code>,
		source: (
			<>
				Der SHA-256-Digest, 64 Hexadezimalziffern, desselben Identitätsschlüssels{" "}
				<code>ruleId + reasonCode + html</code>, den{" "}
				<a href="/conformance/baseline/">Baseline / Allowlist</a> (<code>computeBaselineKey</code>)
				verwendet: ein stabiler, inhaltsbasierter Fingerprint statt eines positionsbasierten, für
				Konsumenten, die ihn auslesen. Derselbe Befund erhält in jedem Bericht denselben Digest. Vor
				1.11 enthielt <code>surea11y/violation/v1</code> den Schlüssel selbst, daher sieht ein Tool,
				das <code>v1</code> gelesen hat, jeden Befund einmalig als neu.{" "}
				<strong>Ein Befund, dessen Reason-Code sich ändert, erhält einen anderen Digest</strong>:
				in 1.14 die Befunde der siebzehn Regeln, die jetzt einen Code angeben, und die der Codes,
				die nach Ursache aufgeteilt wurden; ihre Code-Scanning-Alerts werden also einmal
				geschlossen, und die Befunde kommen als neu zurück (siehe{" "}
				<a href="/conformance/baseline/">Baseline / Allowlist</a>).
			</>
		),
	},
	{
		id: "lineHash",
		field: <code>results[].partialFingerprints.primaryLocationLineHash</code>,
		source: (
			<>
				Die ersten 16 Hexadezimalziffern des Digests und eine Zählung,{" "}
				<code>&lt;16 hex digits&gt;:&lt;n&gt;</code> (unverändert gegenüber der Zeit vor{" "}
				<code>v2</code>), wobei{" "}
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
	{ id: "tags", field: <code>tool.driver.rules[].properties.tags</code>, source: <><code>accessibility</code>, <code>automatic</code>/<code>manual</code> und ein <code>wcag-&lt;SC&gt;</code>-Tagpro WCAG-Erfolgskriterium in <code>meta.normativeMappings</code>, das WCAG-Stufe und -Version des Scans behalten. Ein Kriterium, das der Scan ihretwegen aus <code>rulesResults</code> ausgelassen hat, erhält kein Tag: ein AAA-Kriterium unter <code>engineOptions.wcagLevel: 'AA'</code> oder 4.1.1, wenn <code>{"includeRuleIds: ['duplicate-id']"}</code> unter WCAG 2.2 lief. Ein Kriterium, das der Scan meldet, etwa eine per ID genannte Zusammenfassung oberhalb der Stufe, behält sein Tag, ebenso jedes Kriterium eines Ergebnisses, das weder <code>engine.wcagLevel</code> noch <code>engine.wcagVersion</code> festhält. Die Regel bleibt, und ihre Ergebnisse auch, als Notes, wenn jedes Kriterium, dem sie zugeordnet ist, ausgelassen wird (siehe <a href="#outside-the-target">oben</a>). Einträge zu Understanding-Dokumenten erhalten kein Tag. Jede EN-301-549-Klausel, die das Ergebnis trägt (nur wenn der Scan sie angefordert hat, siehe <a href="/configuration/engine-options/#other-standards-mappings">Andere Normen</a>), erhält ein Tag <code>en301549-&lt;Klausel&gt;</code>, z. B. <code>en301549-9.1.1.1</code>: Klauselnummern sind in jeder Version, die sie enthält, gleich, daher trägt das Tag keine Version, und die Norm oder Checkliste eines Packs wird auf dieselbe Weise unter ihrem eigenen Schlüssel getaggt (die id eines Checklistenpunkts, <code>acme-images</code>, ist sein eigenes Tag). Danach folgen die eigenen <code>meta.tags</code> der Regel (auch bei einer eigenen Regel), ohne die internen Verwaltungs-Tags der Engine und ohne die Kriterien-Tags, die die <code>wcag-&lt;SC&gt;</code>-Tags bereits liefern.</> },
	{ id: "helpUri", field: <code>tool.driver.rules[].helpUri</code>, source: <><code>meta.helpUrl</code>, der Hilfelink der Regel, wenn er eine absolute <code>http(s)</code>-URL ist; sonst das Understanding-Dokument des ersten WCAG-Kriteriums, dem sie zugeordnet ist; fehlt bei einer Regel ohne beides, was auf keine eingebaute Regel zutrifft: Eine Regel ohne Kriterium verlinkt ihren Abschnitt im Regelkatalog.</> },
	{ id: "toolVersion", field: <code>tool.driver.version</code>, source: <>Die Option <code>toolVersion</code>, falls angegeben (ein Tool, das die Engine einbettet, übergibt seine eigene); sonst <code>engine.version</code>, das Engine-Release, das das Ergebnis erzeugt hat.<code>"0.0.0"</code> nur bei einem Ergebnis ohne diesen Wert, aus einem Release vor 1.10.0, oder dessen <code>engine.version</code> kein String ist.</> },
	{ id: "category", field: <code>runs[0].automationDetails.id</code>, source: <>Die Option <code>category</code>, mit angehängtem <code>/</code>, falls sie keinen hat (GitHub liest alles bis zum letzten Schrägstrich als Kategorie). Fehlt, wenn keine Kategorie angegeben ist. Siehe <a href="#scanning-at-several-viewport-widths">Scannen bei mehreren Viewport-Breiten</a>.</> },
	{ id: "runProps", field: <code>runs[0].properties</code>,source: <><code>wcagVersion</code>, <code>wcagLevel</code> (wenn der Scan eine Stufe hatte: <code>engineOptions.wcagLevel</code> oder die, die sich aus seiner Auswahl ergibt), <code>profile</code> (bei einem Scan mehrerer Profile das erste), <code>profiles</code> (nur bei einem Scan mehrerer Profile: jedes Profil, das er ausgeführt hat, <code>engine.profiles</code>), <code>optInRules</code> und <code>environment</code> (eine Kopie von <code>engine.environment</code>) aus der <code>engine</code> des Ergebnisses: das Konformitätsziel des Laufs, damit ein Dashboard einen WCAG-2.1-Lauf von einem 2.2-Lauf unterscheiden kann und einen AA-Lauf von einem über alle Stufen, die Tags der Opt-in-Regeln, die er über dieses Ziel hinaus hinzugefügt hat, falls vorhanden, und die Bedingungen, unter denen die Seite dargestellt wurde (<code>layout</code>, <code>viewport</code>, <code>devicePixelRatio</code>, <code>colorScheme</code>, <code>forcedColors</code>, <code>fonts</code> und jedes weitere Feld, das sie hat, die der Hooks eingeschlossen; siehe <a href="/results-reports/output-schema/#top-level-result">Ausgabeschema</a>). Fehlt bei Ergebnissen aus Releases, die diese Felder noch nicht kennen.</> },
];

const sarifOptionRows = [
	{ id: "toolVersion", option: <code>toolVersion</code>, def: <code>engine.version</code>, effect: <><code>tool.driver.version</code>, für ein Tool, das die Engine einbettet.</> },
	{ id: "informationUri", option: <code>informationUri</code>, def: <code>'https://github.com/SureA11y/core'</code>, effect: <><code>tool.driver.informationUri</code>, die Startseite des Tools.</> },
	{ id: "baselineEntries", option: <code>baselineEntries</code>, def: "keine", effect: <>Die Baseline-Datei wie gespeichert (<code>JSON.parse</code> davon) oder ihre <code>entries</code>-Liste, siehe <a href="/conformance/baseline/#file-format">Dateiformat</a>. Dort erfasste <code>fail</code>-Vorkommen werden weggelassen, wie es <code>--baseline</code> tut (siehe unten). Ein Eintrag, den das vorherige Minor-Release unter einem Reason-Code geschrieben hat, der sich seitdem geändert hat, passt weiterhin zum Befund unter seinem neuen Code (siehe <a href="/conformance/baseline/#upgrading">Upgrade</a>).</> },
	{ id: "allowProfilesNotRun", option: <code>allowProfilesNotRun</code>, def: <code>false</code>, effect: <>Ein Scan <a href="/configuration/engine-options/#several-profiles">mehrerer Profile</a>, der weniger ausgeführt hat, als er angefordert hat (<code>engine.profilesNotRun</code>), hat weniger gezählt, als von ihm verlangt war: Jedes nicht ausgeführte Profil ist eine <code>error</code>-Benachrichtigung, und der Aufruf ist nicht <code>executionSuccessful</code>. <code>true</code> macht daraus Warnungen. Ein anderer Wert als <code>true</code> oder <code>false</code> wirft einen <code>TypeError</code>. Ab core 1.15.0.</> },
	{ id: "category", option: <code>category</code>, def: "keine", effect: <><code>runs[0].automationDetails.id</code>, siehe <a href="#scanning-at-several-viewport-widths">Scannen bei mehreren Viewport-Breiten</a>.</> },
	{ id: "leanFailAs", option: <code>leanFailAs</code>, def: <code>'warning'</code>, effect: <><code>'error'</code> meldet einen <code>cantTell</code>-Befund, dessen Tendenz zu <code>fail</code> weist, als <code>error</code>, sodass ein Build, der auf Fehler prüft, auch bei wahrscheinlichen Fehlern scheitert. Groß- und Kleinschreibung spielt keine Rolle; ein anderer Wert wirft einen <code>TypeError</code>. Das gilt auch für eine Best-Practice-Regel: Eine solche Regel, keinem WCAG-Kriterium zugeordnet, ergibt nie <code>fail</code>, und die Fakten, die sie feststellt, tendieren ohne Bedingung zu <code>fail</code>; eine übersprungene Überschriftenebene (<code>heading-order</code>) ist also ein <code>error</code>. Ein Befund einer Regel, deren Kriterien alle außerhalb des Ziels des Scans liegen, bleibt ein <code>note</code>. Ein Befund, der zu <code>fail</code> tendiert und in <code>baselineEntries</code> einen mit <code>lean: 'fail'</code> gekennzeichneten Eintrag hat, bleibt ein <code>warning</code>.</> },
	{ id: "leanFailWcagOnly", option: <code>leanFailWcagOnly</code>, def: <code>false</code>, effect: <>Mit <code>leanFailAs: 'error'</code> hebt <code>true</code> nur die Befunde von Regeln an, die einem WCAG-Kriterium im Ziel des Scans zugeordnet sind, und lässt die Tendenzen der Best-Practice-Regeln bei <code>warning</code>. Ein anderer Wert als <code>true</code> oder <code>false</code> wirft einen <code>TypeError</code>. <code>leaningFailures(result, {"{ wcagOnly }"})</code> aus <code>@surea11y/core</code> listet die Befunde, die diese beiden Optionen anheben, vor Anwendung der Baseline.</> },
	{ id: "packs", option: <code>packs</code>, def: "keine", effect: <>Die Packs, die der Scan ausgeführt hat (<code>engineOptions.packs</code>): In Node führen die offenen Befunde einer Pack-Regel die Schritte ihres eigenen <code>meta.review</code> mit (<code>properties.howToCheck</code>).</> },
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
				<a href="/results-reports/html-report/">HTML-Bericht</a>).{" "}
				<strong>Ein Log ohne Ergebnisse sagt also, dass unter den gelaufenen Prüfungen nichts{" "}
				<code>fail</code> ergab oder eine Prüfung braucht</strong>; es sagt nicht, was geprüft
				wurde, und es ist keine Konformitätsaussage. Dafür bewahren Sie das JSON-Ergebnis auf.
			</p>
			<p>
				Eine <code>notApplicable</code>-Prüfung ist nicht immer leer: Eine Regel kann ein
				Vorkommen anhängen, das erklärt, warum sie nichts zu beurteilen hatte; die Kontrastregeln
				tun das, wenn kein Text einen berechenbaren Hintergrund hatte. Diese Vorkommen werden nie
				zu Ergebnissen (ein Konsument behandelt jedes Ergebnis als Alarm, und „wurde nicht
				ausgewertet“ ist keiner), aber sie werden auch nicht verworfen. Sie stehen als Einträge
				der Stufe <code>note</code> in{" "}
				<code>runs[0].invocations[0].toolExecutionNotifications</code>, jeweils mit der Regel, aus der
				sie stammen, in <code>associatedRule.id</code>:
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
				<strong>So liest eine Pipeline, die nur SARIF auswertet, Stille nicht als
				Unbedenklichkeitsbescheinigung</strong>: Keine Kontrast-Alarme können bedeuten, dass die
				Seite in Ordnung ist, oder dass der Kontrast nie berechenbar war, und nur der Hinweis
				unterscheidet die beiden Fälle. Der Block wird nur ausgegeben, wenn es etwas zu sagen gibt;
				ein Lauf ohne Meldungen hat also gar keinen <code>invocations</code>-Schlüssel. Eine Regel,
				die bestanden hat, schreibt keinen Hinweis.
			</p>
			<p>
				Eine Regel, die nicht abgeschlossen wurde (sie hat eine Ausnahme geworfen:{" "}
				<code>cantTell</code> ohne Vorkommen und mit einem <code>error</code>), hat nichts beurteilt
				und ist daher ebenfalls kein Ergebnis. Sie ist ein Hinweis der Stufe <code>error</code> in
				derselben Liste,{" "}
				<code>"The rule &lt;id&gt; did not complete: &lt;error&gt;"</code>, mit der Regel in{" "}
				<code>associatedRule.id</code>, sodass die Lücke in der Abdeckung nicht wie ein Bestehen
				aussieht.
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
				Ein offener Befund mit Tendenz führt sie in <code>properties.lean</code>:{" "}
				<code>{'{ "toward": "fail", "why": "The heading skips a level after the one before it." }'}</code>,
				unabhängig von der Stufe, mit der er gemeldet wird. Wo die Tendenz sie hat, führt er auch{" "}
				<code>caution</code>, was sie falsch machen könnte (
				<code>"A layout table can also hold numbers."</code>), und <code>measured</code>, wie oft
				sie richtig lag (<code>{'{ "agreed": 47, "cases": 50, "corpus": "…", "coreVersion": "…" }'}</code>,
				sobald eine Tendenz an fünf Fällen gezählt wurde, was bisher bei keiner der Fall ist),
				sodass ein Alert zeigt, was der <a href="/results-reports/html-report/">HTML-Bericht</a>{" "}
				neben der Tendenz zeigt. Ihre <code>signals</code> und <code>i18n</code>-Schlüssel bleiben
				im Scan-Ergebnis.
			</p>
			<p id="outside-the-target">
				Eine Regel, deren sämtliche WCAG-Kriterien außerhalb des Ziels des Scans liegen (eine
				AAA-Regel unter <code>engineOptions.wcagLevel: 'AA'</code> oder <code>duplicate-id</code>{" "}
				unter WCAG 2.2: die Kriterien, die der Scan aus <code>rulesResults</code> ausgelassen hat,
				wie bei den <code>wcag-&lt;SC&gt;</code>-Tags unten), ist trotzdem gelaufen, und ihre{" "}
				<code>fail</code>- und <code>cantTell</code>-Befunde sind weiterhin Ergebnisse, auf der
				Stufe <code>note</code>: So sind sie sichtbar, ohne einen auf das Ziel begrenzten Build
				scheitern zu lassen. Jedes nennt den Grund in <code>properties.outsideTarget</code>:{" "}
				<code>{'{ "criteria": ["1.4.6"], "target": "WCAG 2.2 AA" }'}</code>.
			</p>
			<p>
				Jede ausgeführte Regel (unabhängig davon, ob sie ein Ergebnis erzeugt hat) wird einmal in{" "}
				<code>runs[0].tool.driver.rules</code> aufgeführt, wobei{" "}
				<code>defaultConfiguration.level</code> aus dem <code>type</code> der Regel abgeleitet
				wird: <code>automatic</code> (kann <code>fail</code> melden) → <code>error</code>,{" "}
				<code>manual</code> (nie <code>fail</code>) → <code>warning</code>. Eine Regel-ID, die in
				einem gespeicherten Ergebnis kein String ist, wird als ihr Text geschrieben; eine Prüfung
				ohne Regel-ID nennt keine Regel und wird weggelassen, wie JUnit und EARL sie weglassen.
			</p>

			<h2 id="field-mapping">Feldzuordnung</h2>
			<DataTable
				label="SARIF-Feldzuordnung"
				rowKey="id"
				columns={[
					{ key: "field", label: "SARIF-Feld", width: "36%", wrap: true },
					{ key: "source", label: "Quelle", wrap: true },
				]}
				rows={sarifFieldRows}
			/>
			<p>
				Ein kompaktes Ergebnis (<code>engineOptions.output.detail: 'findings'</code>, siehe{" "}
				<a href="/results-reports/output-schema/#top-level-result">Ausgabeschema</a>) wird als das
				vollständige Ergebnis gelesen, für das es steht, und daher genauso gemeldet. Ein Ergebnis,
				dessen <code>standards</code>-Liste fehlt oder beschädigt ist, taggt trotzdem jede Norm, die
				seine Regeln nennen.
			</p>

			<h2 id="sarif-locations">Fundorte</h2>
			<p>
				Ein DOM-basierter Scan hat keine Zeile oder Spalte zu melden, deshalb ist{" "}
				<code>physicalLocation.artifactLocation.uri</code> das gescannte Ziel selbst, keine
				Position in einer Quelldatei:
			</p>
			<ul>
				<li>
					<strong>Scans lokaler Dateien</strong>: Eine Datei im aktuellen Arbeitsverzeichnis wird zu
					einem Pfad relativ dazu, mit Schrägstrichen und prozentkodierten Segmenten (
					<code>build%20out/index.html</code>). Entspricht er einer echten Datei in Ihrem Repository,
					kann <span lang="en">GitHub Code Scanning</span> den Befund als Inline-Annotation anzeigen.
					Eine Datei außerhalb des Arbeitsverzeichnisses wird zu einer absoluten{" "}
					<code>file:</code>-URL, nicht zu einem relativen Pfad, der mit <code>../</code> aus dem
					Repository hinausführt und den ein Consumer nicht auflösen könnte.
				</li>
				<li>
					<strong>URL-Scans</strong>: die gescannte URL selbst. <span lang="en">GitHub Code Scanning</span> listet den
					Befund trotzdem auf, kann aber keine Inline-Annotation an eine URL hängen, die keine
					Datei im Repository ist. Das liegt daran, wie SARIF und <span lang="en">Code Scanning</span> Befunde mit dem
					Quellcode verknüpfen, und ist keine Einschränkung von surea11y. Wenn Sie
					Inline-Annotationen brauchen, scannen Sie die gerenderte HTML-Datei (z. B. ein
					Build-Artefakt) statt einer Live-URL. Die URL wird so geschrieben, wie ein URL-Parser sie
					serialisiert; was ein URI nicht aufnehmen kann, wird also prozentkodiert (
					<code>https://example.test/a%20b</code>).
				</li>
				<li>
					<strong>Andere Ziele</strong>: Ein Ergebnis, dessen <code>url</code> keine URL ist, etwa
					der Pfad, unter dem eine Seite gescannt wurde (
					<code>runDomRulesInPage('dist/my page.html', …)</code>), wird zu einem relativen Pfad mit
					Schrägstrichen und prozentkodierten Segmenten (<code>dist/my%20page.html</code>); ein
					Windows-Pfad wird zu einer absoluten <code>file:</code>-URL. Ein Ergebnis ohne{" "}
					<code>url</code> oder mit einer, die kein String ist, wird bei <code>about:blank</code>{" "}
					verortet.
				</li>
			</ul>
			<p>
				Der Fundort des Elements (sein Selektor, bei einem Element in einem Shadow Tree mit den
				Selektoren seiner Shadow Hosts und <code>{" >>> "}</code> davor) wird zusätzlich als{" "}
				<code>logicalLocations[].fullyQualifiedName</code> mitgeführt, sodass ein Konsument, der
				logische Fundorte liest, auch ohne brauchbaren physischen Fundort erfährt, um welches
				Element es geht.
			</p>

			<h2 id="cross-frame-results">Frame-übergreifende Ergebnisse</h2>
			<p>
				Ein Ergebnis von <code>runa11yCoreAcrossFrames</code> oder aus einem Scan mit{" "}
				<code>.frames(true)</code> eines Bindings (siehe{" "}
				<a href="/results-reports/output-schema/#cross-frame-result">Ausgabeschema</a>) ist ein
				einziger Lauf: Die Befunde jedes Frames sind Ergebnisse darin. Ein Befund in einem Frame
				wird im Dokument dieses Frames verortet (<code>artifactLocation.uri</code> ist die URL des
				Frames) und trägt den Pfad des Frames in <code>properties.frame</code>:
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
				Der Pfad ist auch Teil der Identität des Befunds (<code>partialFingerprints</code>), sodass
				derselbe Mangel in der Seite und in einem Frame, oder in zwei Frames, zwei Alerts sind. Ein
				Frame, der nicht geantwortet hat (kein Responder, oder eine Zeitüberschreitung), ist ein
				Hinweis der Stufe <code>warning</code>,{" "}
				<code>"The frame #ads (https://ads.example/) was not scanned: &lt;error&gt;"</code>, da
				darin nichts geprüft wurde.
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

			<h2 id="options">Optionen</h2>
			<p>
				<code>renderSarifReport(result, options)</code> aus <code>@surea11y/core/sarif</code>{" "}
				gibt das Log als JSON-Text zurück. Es nimmt:
			</p>
			<DataTable
				label="Optionen von renderSarifReport"
				rowKey="id"
				columns={[
					{ key: "option", label: "Option", width: "22%" },
					{ key: "def", label: "Standard", width: "30%", wrap: true },
					{ key: "effect", label: "Wirkung", wrap: true },
				]}
				rows={sarifOptionRows}
			/>

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
				<code>cantTell</code>-Vorkommen werden nie durch eine Baseline weggelassen. Eine Baseline, die
				mit <code>{"buildBaselineEntries(result, { leanFail: true })"}</code> geschrieben wurde,
				erfasst auch die Befunde, die zu <code>fail</code> tendieren, als mit{" "}
				<code>lean: 'fail'</code> gekennzeichnete Einträge (siehe{" "}
				<a href="/conformance/baseline/#findings-that-lean-fail">Baseline / Allowlist</a>); unter{" "}
				<code>leanFailAs: 'error'</code> bleibt ein solcher Befund ein <code>warning</code>, statt
				zu <code>error</code> angehoben zu werden. So kann ein Team die wahrscheinlichen Fehler, die
				es schon hat, akzeptieren und trotzdem bei neuen scheitern lassen.{" "}
				<code>--write-baseline</code> erfasst nur <code>fail</code>-Vorkommen.
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
