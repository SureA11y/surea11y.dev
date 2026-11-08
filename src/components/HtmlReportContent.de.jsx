import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

export function HtmlReportContent() {
	return (
		<>
			<p>
				Ein eigenständiger HTML-Bericht, den Sie nach einem Scan im Browser öffnen können — ohne
				Server, ohne externe Ressourcen, ohne Netzwerkanfragen. Gedacht für Personen in QA und
				manueller Prüfung, die die Ergebnisse eines Scans durchblättern möchten, statt rohes JSON oder eine
				Zusammenfassung im Terminal zu lesen. <a href="/sample-report.html">Öffnen Sie einen Beispielbericht</a>: eine
				kleine Bezahlseite, gescannt mit dem Listener- und dem Live-Region-Hook, mit einem Befund in
				jeder Gruppe und dem, was der Scan einer Person überlässt.
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
					<code>notApplicable</code>). Ist keine Regel fehlgeschlagen und waren einige anwendbar,
					sagt ein Hinweis unter der Schlagzeile, dass das keine Aussage über die Konformität der
					Seite ist, und nennt, was eine Person weiterhin prüft: die Befunde, die eine Prüfung
					brauchen, die Bedienung per Tastatur, wie ein Screenreader die Seite vorliest, und die
					Inhalte selbst.
				</li>
				<li>
					<strong>Prüfenswert</strong>: eine Karte pro Regel mit <code>fail</code>-/
					<code>cantTell</code>-Vorkommen (nicht eine pro Vorkommen — eine Regel mit vielen
					identischen Vorkommen ist eine Sache, die Aufmerksamkeit verdient, nicht viele), jeweils
					mit Schweregrad, Chip(s) für das WCAG-Erfolgskriterium, in einem Scan mehrerer Profile dem,
					was jedes Profil daraus macht („wai-aria-1.2: Nicht bestanden“ neben „wcag22-aa: Prüfung
					nötig“, seine <code>verdicts</code>), einem repräsentativen Vorkommen
					und der Gesamtzahl der Vorkommen. Regeln mit dem Ergebnis <code>fail</code> stehen
					zuerst. Die Befunde, die eine Prüfung brauchen, folgen in drei Gruppen: die, deren
					Anhaltspunkte auf einen Fehler weisen („Wahrscheinlich nicht erfüllt: bitte
					bestätigen“), die, deren Anhaltspunkte auf ein Bestehen weisen („Wahrscheinlich erfüllt:
					bitte bestätigen“), und die, die nur eine Person beurteilen kann („Muss eine Person
					prüfen“), so wie <code>reviewGroupOf(check, occurrence)</code> aus{" "}
					<code>@surea11y/core</code> sie einordnet, damit ein Tool, das eine Prüfliste sortiert,
					sie genauso sortiert. Jede Karte der ersten beiden Gruppen sagt, warum sie in diese
					Richtung tendiert (das{" "}
					<a href="/results-reports/output-schema/#leans"><code>lean</code></a> des Vorkommens).
					Jede dieser Karten hat einen standardmäßig eingeklappten Abschnitt „So prüfen Sie es“ mit
					den Schritten, um die Frage zu beantworten, und was als erfüllt und was als nicht erfüllt
					gilt (das{" "}
					<a href="/results-reports/output-schema/#how-to-check"><code>howToCheck</code></a> des
					Vorkommens). Eine Regel, deren Befunde in verschiedene Richtungen tendieren, hat in jeder
					Gruppe eine Karte. Innerhalb jeder Gruppe steht der höchste Schweregrad zuerst (von
					kritisch bis gering) und bei gleichem Schweregrad die Regel mit mehr Vorkommen. Begrenzt
					auf die 24 Regeln mit der höchsten Priorität,
					darüber hinaus mit einem Hinweis auf weitere. Eine Regel, die nicht abgeschlossen wurde
					(sie hat eine Ausnahme geworfen), erhält ebenfalls eine Karte, die das mit ihrem Fehler
					sagt, da die Seite nicht gegen sie geprüft wurde. Eine Regel mit einem{" "}
					<code>http(s)</code>-Hilfelink (<code>meta.helpUrl</code>, auch bei einer eigenen Regel)
					erhält auf ihrer Karte einen Link „<span lang="en">How to fix &lt;rule&gt;</span>“; eine Regel ohne einen solchen
					verlinkt das Understanding-Dokument des WCAG-Kriteriums, das sie prüft
					(„<span lang="en">Understanding 1.1.1 Non-text Content</span>“).
					</li>
					<li>
						<strong>Frames</strong>: nur bei einem Frame-übergreifenden Ergebnis
						(<code>runa11yCoreAcrossFrames</code> oder <code>.frames(true)</code> eines Bindings).
						Die Karten oben gehören zur Seite selbst; dieser Abschnitt hat eine Überschrift pro
						Frame, benannt nach seinem Pfad (den Selektoren der Frame-Elemente, die zu ihm führen),
						mit Titel und URL des Frames und seinen Karten, oder „Nicht gescannt“ samt Grund bei
						einem Frame, der nicht geantwortet hat. Der Rest des Berichts beschreibt die Seite
						selbst.
					</li>
					<li>
						<strong>Am nächsten an der Grenze</strong>: erscheint, wenn der Scan Abstandswerte enthält
						(<a href="/results-reports/output-schema/#margin"><code>margin</code> bei einem Prüfergebnis</a>).
						Eine Zeile je Regel, deren knappstes bestandenes Element ihrem Schwellenwert nahe kam
						(innerhalb des Bands der Regel, etwa 10 % eines Kontrastverhältnisses), wie der Hinweis
						über der Tabelle sagt: ihr knappster bestandener Wert,
						die Grenze, der verbleibende Abstand und das Element. Pixel werden auf ganze Zahlen
						gerundet, unter einem Pixel steht „weniger als 1 px“; Verhältnisse zeigen zwei
						Nachkommastellen. Eine Regel, die nur knapp bestanden hat, kann schon durch eine kleine
						Änderung scheitern.
					</li>
				<li>
					<strong>WCAG-Zusammenfassung</strong>: gruppiert nach Konformitätsstufe (A / AA / AAA),
					direkt aus den zusammengesetzten Zusammenfassungen der Engine in{" "}
					<code>rulesResults[]</code> (siehe <a href="/conformance/wcag-mapping/">Konformität</a>)
					— eine Zeile pro Erfolgskriterium (mit den Anforderungen jeder anderen Norm in{" "}
					<code>standards</code> des Ergebnisses, auf die seine Regeln abgebildet sind, etwa der
					EN-301-549-Klausel, die es wiedergibt, sofern es eine gibt und der Scan
					EN-301-549-Klauseln angefordert hat) mit seinem Ergebnis, einer Aufschlüsselung nach
					bestanden/nicht bestanden/zu prüfen/nicht anwendbar (mit einer Zeile „Teilweise geprüft“,
					wenn die Regeln des Kriteriums nur einen Teil dessen prüfen, was es verlangt, sodass eine
					Person den Rest prüft, etwa „Teilweise geprüft: Die Prüfungen decken nur einen Teil dieses
					Kriteriums ab, den Rest prüft ein Mensch“, oder wenn der Scan nur einen Teil seiner Regeln
					ausgewählt hat, etwa „Teilweise geprüft: 1 von 2 Prüfungen war für diesen Scan nicht
					ausgewählt“, siehe{" "}
					<a href="/results-reports/output-schema/#partly-checked">Ein teilweise geprüftes
					Kriterium</a>) und den atomaren Regeln, die dazu
					beigetragen haben, einschließlich einer eigenen Regel, die dem Kriterium zugeordnet ist.
					Das sind echte Engine-Daten, keine erfundene Gruppierung — dieselbe
					Zusammenfassung, die Sie auch aus <code>rulesResults</code> im rohen JSON erhalten.
				</li>
				<li>
					<strong>Eigene Zusammenfassung einer Norm</strong>: nur wenn der Scan die Regeln einer
					Norm mit eigenen Zusammenfassungen ausgeführt hat (über ihr Profil oder{" "}
					<code>engineOptions.optInRules</code>), eine Tabelle pro Norm, und pro Version davon, wenn ein
					Scan mehrerer Profile die Seite nach zweien beurteilt hat (EN 301 549 V3.2.1 mit V4.1.1,
					jede nach ihrer Version benannt), mit einer Zeile pro Zusammenfassung, mit dem Wortlaut der
					Norm, den Anforderungen der Regeln, die das Ergebnis entschieden haben, der
					Aufschlüsselung und den beitragenden Regeln. Das umfasst die Norm eines{" "}
					<a href="/configuration/packs/">Packs</a> und die Checkliste eines Packs, deren Punkte
					ihre Zusammenfassungen sind. Jede solche Norm ist in <code>standards</code> des
					Ergebnisses aufgeführt, sodass ein gespeichertes Ergebnis überall gleich dargestellt wird;
					fehlt diese Liste oder ist sie beschädigt, sagt der Bericht das über der
					WCAG-Zusammenfassung.
				</li>
					<li id="whats-left-for-a-person">
						<strong>Was ein Mensch noch prüfen muss</strong> (ab core 1.15.0): was der Scan in den
						Anforderungen, die seine Regeln bewerten, nicht entscheiden kann. Jede Anforderung des
						gescannten Standards mit einer Prüfung, die keine Regel vollständig entscheidet, jeweils
						mit ihrem Ergebnis im Scan daneben („Scan: Nicht bestanden“, „Scan: Bestanden“ oder „Keine
						Regel prüft sie“), und darunter, standardmäßig eingeklappt, diese Prüfungen: was jede
						bewertet, wie viel davon Regeln entscheiden, welche Werkzeuge sie braucht, die Schritte und
						was als bestanden und was als nicht bestanden gilt (die{" "}
						<a href="/conformance/procedures/">Prüfverfahren</a> von core). Ein Satz darüber nennt,
						wie viele Prüfungen und Anforderungen es sind, und dass eine Anforderung, deren Regeln alle{" "}
						<code>pass</code> ergeben, erst erfüllt ist, wenn auch ihre Prüfungen bestanden sind. Der
						Standard ist WCAG, in der Version, auf die der Scan zielte, und mit den Stufen, die er
						gemeldet hat; wo der Scan das Profil eines Packs ausgeführt hat und das Pack, übergeben in{" "}
						<code>options.packs</code>, Prüfverfahren mitbringt, ist es der Standard dieses Packs,
						unter seinen eigenen Nummern. Ein Scan mehrerer Profile hat einen Teil für jeden Standard
						und jede Version. Ein Hinweis darunter sagt, wie sich daraus ein Arbeitsblatt erstellen
						lässt, um für jede ein Ergebnis festzuhalten (<code>renderProcedures</code> oder{" "}
						<code>--manual-checks</code> der CLI). Er wird in Node geschrieben; der Browser-Bericht (
						<code>surea11y.report.js</code>) hat keinen.
					</li>
				<li>
					<strong>Vollständige technische Daten</strong> (standardmäßig eingeklappt): eine
					Übersicht (Kacheln pro Ergebnis) und eine durchsuchbare, (nach Ergebnis) filterbare,
					paginierte Tabelle aller einzelnen Vorkommen des gesamten Scans; ein Befund, der eine
					Prüfung braucht und eine Tendenz hat, zeigt sie unter seiner Zusammenfassung
					(„Wahrscheinlich nicht erfüllt: …“), und die Suche findet sie. Zeigt sie kein
					Vorkommen, enthält sie eine Zeile, die das sagt: Der Scan hat keine erfasst, oder die
					Filter blenden alle aus.
				</li>
			</ul>
			<p>
				Ein Element in einem Shadow Tree wird über die Selektoren der Shadow Hosts und dann seinen
				eigenen verortet, verbunden mit <code>{" >>> "}</code>:{" "}
				<code>{"html > body > main > x-card >>> button"}</code>. Die Karten, die Tabelle der Abstandswerte
				und die Tabelle der Vorkommen zeigen es alle so, ebenso{" "}
				<a href="/results-reports/sarif-report/#field-mapping">SARIF</a> und{" "}
				<a href="/results-reports/junit-report/#outcomes">JUnit</a>.
			</p>
			<p>
				Der Bericht folgt dem Farbschema der lesenden Person, und sein eigener Text erfüllt WCAG
				1.4.3 in beiden: Jede Statusfarbe hat mindestens 4,5:1 auf ihrem Chip und ihrer Kachel, und
				die eigenen Kontrastregeln der Engine bestehen auf dem dargestellten Bericht im hellen und
				im dunklen Modus.
			</p>
			<p>
				Der Bericht bricht bei 320 CSS-Pixeln um (WCAG 1.4.10): Die Seite scrollt nie seitwärts.
				Eine Tabelle, die breiter als das Fenster ist, scrollt in einem eigenen Kasten, einem nach
				der Überschrift der Tabelle benannten Bereich, der den Tastaturfokus annimmt, sodass er
				sich mit den Pfeiltasten scrollen lässt.
			</p>
			<p>
				Die Meta-Leiste unter dem Kopf enthält die Anzahl der Regeln, die Anzahl der Vorkommen,
				das Engine-Tag, die Schema-Version, die WCAG-Version, auf die der Scan zielte, das
				verwendete <code>engineOptions.profile</code> (falls es eines gab; bei einem Scan mehrerer
				jedes Profil, mit <code>+</code> verbunden, und die, die nicht gelaufen sind) und daneben das
				Gesetz, nach dem das Profil bewertet wird, wenn das Profil eines Packs eines nennt (core
				1.16.0, experimentell), die Tags der Opt-in-Regeln,
				die <code>engineOptions.optInRules</code> hinzugefügt hat (falls welche), die Bedingungen,
				unter denen die Seite dargestellt wurde, und die Locale, auf die der Scan aufgelöst wurde.
				Die Bedingungen sind der Viewport (mit dem Gerätepixelverhältnis, wenn es nicht 1 ist) und
				das Farbschema, dazu die Webfonts, wenn sie noch luden; ein Scan ohne Layout, in jsdom,
				sagt stattdessen genau das. Ein layoutabhängiger Befund kann je nach Viewport-Breite
				auftauchen oder verschwinden, daher nennt der Chip die Breite, die der Bericht beschreibt.
				Der Fallback der Locale erfolgt pro String und ist im Text selbst nicht sichtbar, daher{" "}
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
			<p>
				Ein kompaktes Ergebnis (<code>engineOptions.output.detail: 'findings'</code>, siehe{" "}
				<a href="/results-reports/output-schema/#top-level-result">Ausgabeschema</a>) wird als das
				vollständige Ergebnis gelesen, für das es steht, und daher genauso gemeldet.
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
				<code>renderHtmlReport(result, options)</code> gibt einen String zurück und{" "}
				<strong>greift selbst nie auf das Dateisystem zu</strong> (das Schreiben übernimmt das
				CLI-Flag <code>--html</code>). Die Seite trägt das Datum aus dem <code>timestamp</code> des
				Ergebnisses (gesetzt mit <code>engineOptions.timestamp</code>), in UTC angezeigt, sodass
				dasselbe Ergebnis immer dieselbe Seite ergibt; ein Ergebnis ohne Zeitstempel erhält das
				Datum der Erzeugung. <code>options.title</code> ist optional
				(Standardwert ist der Titel in der Sprache des Berichts, auf Deutsch{" "}
				<code>"surea11y-Scanbericht"</code>). <code>options.packs</code> ist die Liste der Packs,
				die der Scan ausgeführt hat (<code>engineOptions.packs</code>), falls er welche ausgeführt
				hat: In Node fügt der Bericht Befunden, die eine Prüfung brauchen und ohne sie kommen, die
				Schritte „So prüfen Sie es“ hinzu, die einer Core-Regel und der Basisregel einer Variante
				immer, die eigenen Schritte einer Pack-Regel (ihr <code>meta.review</code>, auf Englisch
				oder so, wie die Wörterbücher ihres Packs sie übersetzen) nur, wenn er die Packs erhält
				(siehe <a href="/configuration/packs/#review-steps">Packs</a>). Im Browser (
				<code>surea11y.report.js</code>) zeigt er die Schritte, die das Ergebnis bereits mitführt.
				Mit den Packs folgt „Was ein Mensch noch prüfen muss“ auch dem Standard eines Packs, wo der
				Scan dessen Profil ausgeführt hat. <code>options.manualChecks: false</code> lässt diesen
				Abschnitt weg.
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
