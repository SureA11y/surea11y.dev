import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

export function HtmlReportContent() {
	return (
		<>
			<p>
				Ein eigenständiger HTML-Bericht, den Sie nach einem Scan im Browser öffnen können — ohne
				Server, ohne externe Ressourcen, ohne Netzwerkanfragen. Gedacht für Personen in QA und
				manueller Prüfung, die die Ergebnisse eines Scans durchblättern möchten, statt rohes JSON oder eine
				Zusammenfassung im Terminal zu lesen.
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --html report.html", command: true }]} />
			<p>
				Öffnen Sie <code>report.html</code> direkt von der Festplatte. Funktioniert zusammen mit
				jedem anderen Ausgabemodus — <code>--html</code> ersetzt weder <code>--json</code> noch
				die Standardzusammenfassung, sondern ist ein zusätzliches Artefakt, das unter dem
				angegebenen Pfad geschrieben wird.
			</p>

			<h2>Was er zeigt</h2>
			<ul>
				<li>
					<strong>Kopfbereich</strong>: eine Schlagzeile in einfacher Sprache („N von M
					anwendbaren Prüfungen bestanden“) plus ein gestapelter Balken mit Legende (Icon +
					Bezeichnung + Anzahl — der Status wird nie nur über Farbe vermittelt), aufgeschlüsselt
					nach Ergebnis (<code>fail</code>/<code>cantTell</code>/<code>pass</code>/
					<code>notApplicable</code>).
				</li>
				<li>
					<strong>Prüfenswert</strong>: eine Karte pro Regel mit <code>fail</code>-/
					<code>cantTell</code>-Vorkommen (nicht eine pro Vorkommen — eine Regel mit vielen
					identischen Vorkommen ist eine Sache, die Aufmerksamkeit verdient, nicht viele), jeweils
					mit Schweregrad, Chip(s) für das WCAG-Erfolgskriterium, einem repräsentativen Vorkommen
					und der Gesamtzahl der Vorkommen. Begrenzt auf die 24 Regeln mit der höchsten Priorität,
					darüber hinaus mit einem Hinweis auf weitere.
				</li>
				<li>
					<strong>WCAG-Zusammenfassung</strong>: gruppiert nach Konformitätsstufe (A / AA / AAA),
					direkt aus den zusammengesetzten Zusammenfassungen der Engine in{" "}
					<code>rulesResults[]</code> (siehe <a href="/conformance/wcag-mapping/">Konformität</a>)
					— eine Zeile pro Erfolgskriterium (mit der EN-301-549-Klausel, die es wiedergibt, sofern es
					eine gibt und der Scan EN-301-549-Klauseln angefordert hat) mit seinem Ergebnis, einer Aufschlüsselung nach
					bestanden/nicht bestanden/zu prüfen/nicht anwendbar und den atomaren Regeln, die dazu
					beigetragen haben. Das sind echte Engine-Daten, keine erfundene Gruppierung — dieselbe
					Zusammenfassung, die Sie auch aus <code>rulesResults</code> im rohen JSON erhalten.
				</li>
				<li>
					<strong>Eigene Zusammenfassung einer Norm</strong>: nur wenn der Scan die Regeln einer
					Norm mit eigenen Zusammenfassungen ausgeführt hat (über ihr Profil oder{" "}
					<code>engineOptions.optInRules</code>), eine Zeile pro Zusammenfassung, mit dem Wortlaut der
					Norm, der Aufschlüsselung und den beitragenden Regeln.
				</li>
				<li>
					<strong>Vollständige technische Daten</strong> (standardmäßig eingeklappt): eine
					Übersicht (Kacheln pro Ergebnis) und eine durchsuchbare, (nach Ergebnis) filterbare,
					paginierte Tabelle aller einzelnen Vorkommen des gesamten Scans.
				</li>
			</ul>
			<p>
				Die Meta-Leiste unter dem Kopf enthält die Anzahl der Regeln, die Anzahl der Vorkommen,
				das Engine-Tag, die Schema-Version, die WCAG-Version, auf die der Scan zielte, das
				verwendete <code>engineOptions.profile</code> (falls es eines gab), die Tags der Opt-in-Regeln,
				die <code>engineOptions.optInRules</code> hinzugefügt hat (falls welche), und die Locale, auf
				die der Scan aufgelöst wurde. Der
				Fallback der Locale erfolgt pro String und ist im Text selbst nicht sichtbar, daher{" "}
				<strong>liest sich ein Bericht, der in einer Sprache angefordert wurde, die die Engine
				nicht mitbringt, wie ein gewöhnlicher englischer</strong> — der Chip nennt die
				angeforderte Locale neben der aufgelösten, wenn sich beide unterscheiden. Siehe{" "}
				<a href="/configuration/locales/">Locales</a>.
			</p>
			<p>
				Die ganze Seite ist in der Locale geschrieben, auf die der Scan aufgelöst wurde:
				Überschriften, Tabellenspalten, Namen von Ergebnissen und Schweregraden, die Kopfzeile, die
				Seitennavigation und das Datumsformat. <code>&lt;html lang&gt;</code> nennt diese Locale. Die
				Ergebniscodes in den Filtern für Vorkommen (<code>fail</code>, <code>cantTell</code>, …)
				bleiben unverändert, da es die Werte sind, nach denen man im JSON-Ergebnis sucht.
			</p>
			<p>
				Ein Fall behält englische Beschriftungen: ein Scan in einer Sprache, die die Engine nicht
				mitbringt, mit einem selbst bereitgestellten Wörterbuch in <code>engineOptions.messages</code>.
				Dieses Wörterbuch ist nicht Teil des Ergebnisses, daher kann der Bericht keine
				Beschriftungen daraus lesen; seine Befunde werden dann mit ihrer eigenen Sprache
				ausgezeichnet (zum Beispiel <code>lang="nl"</code>), damit ein Screenreader sie mit der
				richtigen Stimme vorliest.
			</p>

			<h2>Verwendung als Bibliothek</h2>
			<CodeBlock
				lang="js"
				lines={[
					"const { renderHtmlReport } = require('@surea11y/core/report');",
					"const { runDomRulesInPage } = require('@surea11y/core');",
					"",
					"const result = runDomRulesInPage(url, null, {}, null);",
					"const html = renderHtmlReport(result, { title: 'My scan report' });",
					"",
					"require('fs').writeFileSync('report.html', html);",
				]}
			/>
			<p>
				<code>renderHtmlReport(result, options)</code> ist eine reine Funktion — sie gibt einen
				String zurück und <strong>greift selbst nie auf das Dateisystem zu</strong> (das Schreiben
				übernimmt das CLI-Flag <code>--html</code>). <code>options.title</code> ist optional
				(Standardwert <code>"surea11y scan report"</code>).
			</p>

			<h2>Umfang</h2>
			<p>
				<strong>Das ist ein Bericht über einen einzelnen Scan — eine Momentaufnahme, kein
				Dashboard, das Ergebnisse über viele Scans hinweg verfolgt.</strong> Ergebnisse über viele
				Läufe hinweg zu verfolgen ist ein eigenes, größeres Thema und nicht Teil dieses Werkzeugs:
				Bewahren Sie das JSON jedes Scans auf und vergleichen Sie es selbst, oder speisen Sie
				SARIF in ein Dashboard ein, das bereits eine Historie führt (siehe{" "}
				<a href="/results-reports/sarif-report/">SARIF-Bericht</a> unten).
			</p>
		</>
	);
}
