import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";

const formatRows = [
	{ format: <code>JSON</code>, use: "Integration, Speicherung und eigene Weiterverarbeitung", audience: "Entwickler und Plattformen" },
	{ format: "HTML", use: "Menschliche Prüfung eines konkreten Scans", audience: "QA und Audit" },
	{ format: "SARIF", use: "Integration in Werkzeuge zur Codeanalyse", audience: "Entwicklungs- und Security-Teams" },
	{ format: "EARL", use: "Interoperabilität und Nachweis der ACT-Konformität", audience: "Standards, Forschung und Konformität" },
];

export function ResultsReportsContent() {
	return (
		<>
			<p>
				Jeder Scan liefert ein einziges, einfaches JSON-Objekt — nichts verborgen, nichts, das Sie
				selbst neu herleiten müssen. Die drei Berichtsformate unten bauen direkt auf genau diesem
				Objekt auf, und jedes ist für andere Leser gemacht: einen Menschen, der einen Browser-Tab
				durchsieht, ein CI-Dashboard, das nur SARIF versteht, oder das eigene Format des W3C für
				Implementierungsberichte. Wählen Sie die Form, die zu dem passt, der das Ergebnis
				tatsächlich ansehen wird.
			</p>
			<DataTable
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
				zusammengesetzte Zusammenfassungen pro WCAG-Erfolgskriterium. Es lohnt sich, das einmal zu
				lesen, wenn Sie irgendetwas auf einem rohen Ergebnis aufbauen. Die vollständige Form finden
				Sie unter <a href="/results-reports/output-schema/">Ausgabeschema</a>.
			</p>

			<h2>HTML-Bericht</h2>
			<p>
				Öffnen, verstehen — ohne Server, ohne Build-Schritt, ohne JSON, das man mühsam
				entziffern muss. Oben eine Zusammenfassung in einfacher Sprache, darunter eine
				WCAG-Zusammenfassung nach Konformitätsstufe, die aus den zusammengesetzten Ergebnissen
				der Engine selbst stammt, und ganz unten eine vollständige, durchsuchbare Tabelle für
				alle, die tiefer einsteigen wollen. Das ist der Bericht für Reviewer, die keine rohe
				Ausgabe lesen möchten. Siehe <a href="/results-reports/html-report/">HTML-Bericht</a>.
			</p>

			<h2>SARIF-Bericht</h2>
			<p>
				Speisen Sie einen Scan direkt in <span lang="en">GitHub Code Scanning</span> oder jedes andere Dashboard ein,
				das SARIF verarbeitet, ohne selbst einen Konverter zu schreiben. Verstöße werden auf
				SARIF-Ergebnisse mit einem stabilen, inhaltsbasierten Fingerprint abgebildet. So filtert
				eine <a href="/conformance/baseline/">Baseline / Allowlist</a> weiterhin sauber, und ein
				Dashboard kann einen Befund über Commits hinweg verfolgen, statt ihn jedes Mal zu
				verlieren, wenn sich eine Zeilennummer verschiebt. Siehe{" "}
				<a href="/results-reports/sarif-report/">SARIF-Bericht</a>.
			</p>

			<h2>EARL-Bericht</h2>
			<p>
				Ein W3C-Implementierungsbericht in EARL/JSON-LD, der <strong>das Ergebnis jeder Regel
				festhält, nicht nur die Fehlschläge</strong> — das Format, das die <span lang="en">ACT Rules</span> Community
				Group als Nachweis akzeptiert, dass eine Engine tatsächlich implementiert, was sie
				behauptet. Ein nützlicher Beleg, wenn eine Aussage zur ACT-Konformität überprüfbar sein
				muss und nicht nur behauptet werden soll. Siehe{" "}
				<a href="/results-reports/earl-report/">EARL-Bericht</a>.
			</p>
		</>
	);
}
