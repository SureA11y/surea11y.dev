import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";

const formatRows = [
	{ format: <code>JSON</code>, use: "Integration, Speicherung und eigene Weiterverarbeitung", audience: "Entwicklungsteams und Plattformen" },
	{ format: "HTML", use: "Menschliche Prüfung eines konkreten Scans", audience: "QA und Audit" },
	{ format: "SARIF", use: "Integration in Werkzeuge zur Codeanalyse", audience: "Entwicklungs- und Security-Teams" },
	{ format: "JUnit", use: "Testansichten von CI-Dashboards", audience: "Entwicklungs- und QA-Teams" },
	{ format: "EARL", use: "Interoperabilität und ACT-Implementierungsberichte", audience: "Standards, Forschung und Konformität" },
];

export function ResultsReportsContent() {
	return (
		<>
			<p>
				Jeder Scan liefert ein einziges, einfaches JSON-Objekt. Die vier Berichtsformate unten
				werden aus genau diesem Objekt erzeugt, und jedes ist für ein anderes Publikum gemacht: einen Menschen, der einen Browser-Tab
				durchsieht, ein Codeanalyse-Dashboard, das nur SARIF versteht, eine CI-Testansicht, die JUnit
				liest, oder das eigene Format des W3C für
				Implementierungsberichte. Wählen Sie die Form, die zu denen passt, die das Ergebnis
				tatsächlich ansehen werden.
			</p>
			<DataTable
				label="Ausgabeformate"
				rowKey="format"
				columns={[
					{ key: "format", label: "Format" },
					{ key: "use", label: "Hauptverwendung", wrap: true },
					{ key: "audience", label: "Zielgruppe" },
				]}
				rows={formatRows}
			/>

			<h2>Ausgabeschema</h2>
			<p>
				Der genaue Vertrag, den jeder Runner zurückgibt und aus dem jedes andere Berichtsformat
				abgeleitet wird: eine Ergebnishülle auf oberster Ebene, ein Eintrag pro Regel
				(einschließlich jedes <code>pass</code> und <code>notApplicable</code> — nie eine Liste nur
				mit Verstößen), Details pro Vorkommen bis hinunter zum gemeldeten Element, explizite
				Unsicherheitscodes für alles, was eine Regel nicht entscheiden konnte, und
				zusammengesetzte Zusammenfassungen pro WCAG-Erfolgskriterium. Jeder offene Befund einer
				core-Regel sagt, wie eine Person ihn beantwortet, und manche sagen, in welche Richtung die Anhaltspunkte der
				Seite weisen (eine <em>Tendenz</em>), sodass eine Prüfung mit den wahrscheinlichen Fehlern
				beginnt statt mit einer flachen Liste. Es lohnt sich, das einmal zu
				lesen, wenn Sie irgendetwas auf einem rohen Ergebnis aufbauen. Die vollständige Form finden
				Sie unter <a href="/results-reports/output-schema/">Ausgabeschema</a>.
			</p>

			<h2>HTML-Bericht</h2>
			<p>
				Eine HTML-Datei, die sich in jedem Browser öffnet, ohne Server oder Build-Schritt. Oben eine Zusammenfassung in einfacher Sprache, dann die
				Fehlschläge, danach die Befunde, die eine Prüfung brauchen, sortiert in wahrscheinlich
				nicht erfüllt, wahrscheinlich erfüllt und solche, die nur eine Person beurteilen kann,
				bei core-Regeln jeweils mit den Schritten zur Prüfung, darunter eine WCAG-Zusammenfassung nach
				Konformitätsstufe, die aus den zusammengesetzten Ergebnissen
				der Engine selbst stammt, und ganz unten eine vollständige, durchsuchbare Tabelle für
				alle, die tiefer einsteigen wollen. Das ist der Bericht für Prüfende, die keine rohe
				Ausgabe lesen möchten. Siehe <a href="/results-reports/html-report/">HTML-Bericht</a>.
			</p>

			<h2>SARIF-Bericht</h2>
			<p>
				Speisen Sie einen Scan direkt in <span lang="en">GitHub Code Scanning</span> oder jedes andere Dashboard ein,
				das SARIF verarbeitet, ohne selbst einen Konverter zu schreiben. Verstöße werden auf
				SARIF-Ergebnisse mit einem stabilen, inhaltsbasierten Fingerprint abgebildet. So filtert
				eine <a href="/conformance/baseline/">Baseline / Allowlist</a> weiterhin zuverlässig, und ein
				Dashboard kann einen Befund über Commits hinweg verfolgen, statt ihn jedes Mal zu
				verlieren, wenn sich eine Zeilennummer verschiebt. Ein Log ohne Ergebnisse bedeutet, dass
				unter den gelaufenen Prüfungen nichts <code>fail</code> ergab oder eine Prüfung braucht;
				es ist keine Konformitätsaussage. Eine Option hebt die Befunde, die wahrscheinlich nicht
				erfüllt sind, zu Fehlern an, für einen Build, der an ihnen scheitern soll, ohne an jeder
				offenen Frage zu scheitern. Siehe{" "}
				<a href="/results-reports/sarif-report/">SARIF-Bericht</a>.
			</p>

			<h2>JUnit-Bericht</h2>
			<p>
				Bringen Sie Barrierefreiheitsergebnisse in die Testansicht, die Ihre CI ohnehin hat — das
				Merge-Request-Widget von GitLab, den Tests-Tab von Azure DevOps, Jenkins, CircleCI —, neben
				Ihre Unit-Tests. Jedes WCAG-Kriterium ist eine Suite und jede Regel ein Test, sodass ein auf
				einer Seite wiederholter Fehler ein einziger fehlgeschlagener Test ist und die Zahlen
				zwischen Läufen stabil bleiben. <code>cantTell</code> erscheint als übersprungener Test,
				sichtbar, ohne den Build rot zu färben, es sei denn, Sie lassen den Build bei denen
				scheitern, die wahrscheinlich nicht erfüllt sind. Die Namen der Suites sind in jeder Locale gleich,
				daher beginnt die Testhistorie nicht von vorn, wenn sich die Sprache des Scans ändert.
				Eine grüne Suite bedeutet, dass die für ein Kriterium gelaufenen Regeln nichts gefunden
				haben, nicht, dass das Kriterium erfüllt ist. Siehe{" "}
				<a href="/results-reports/junit-report/">JUnit-Bericht</a>.
			</p>

			<h2>EARL-Bericht</h2>
			<p>
				Ein W3C-Implementierungsbericht in EARL/JSON-LD, der <strong>das Ergebnis jeder Regel
				festhält, nicht nur die Verstöße</strong> — das Format, das die <span lang="en">ACT Rules</span> Community
				Group für Implementierungsberichte akzeptiert. Auf den ACT-Testfällen ausgeführt, hält er
				das Ergebnis für jeden einzelnen fest, sodass sich prüfen lässt, wie die Engine jede Regel
				umsetzt, statt es ungeprüft zu glauben. Er ist weder eine Zertifizierung noch ein Nachweis
				der WCAG-Konformität: Als ACT-Implementierung gelistet zu sein, ist keine Billigung durch
				das W3C. Siehe{" "}
				<a href="/results-reports/earl-report/">EARL-Bericht</a>.
			</p>
		</>
	);
}
