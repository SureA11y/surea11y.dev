import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { ResultBadge } from "./design-system/results/ResultBadge.jsx";
import rules from "../data/rules.generated.json";

const core = "https://github.com/SureA11y/core/blob/main";

const packageRows = [
	{ id: "playwright", want: "Barrierefreiheit in Playwright-Tests prüfen", install: <code>@surea11y/playwright</code> },
	{ id: "puppeteer", want: "…in Puppeteer-Tests", install: <code>@surea11y/puppeteer</code> },
	{ id: "selenium", want: "…in Selenium-Tests", install: <code>@surea11y/selenium</code> },
	{ id: "cypress", want: "…in Cypress-Tests", install: <code>@surea11y/cypress</code> },
	{ id: "webdriverio", want: "…in WebdriverIO-Tests", install: <code>@surea11y/webdriverio</code> },
	{ id: "cli", want: "Statisches HTML im Terminal oder in einer CI-Pipeline scannen", install: <code>@surea11y/cli</code> },
	{ id: "test-matchers", want: "Barrierefreiheit in Komponenten- oder Unit-Tests mit Jest/Vitest prüfen", install: <code>@surea11y/test-matchers</code> },
	{ id: "core", want: "Die Engine auf ein DOM anwenden, das Sie bereits haben", install: <code>@surea11y/core</code> },
];

export function OverviewLead() {
	return (
		<>
			<p>
				<a href="https://github.com/SureA11y/core">@surea11y/core</a> ist eine <strong>Engine für Barrierefreiheitstests</strong>, die Sie in Ihrer
				eigenen Testsuite, Ihrer CI-Pipeline oder über die Kommandozeile ausführen.
			</p>
			<p>
				Was sie unterscheidet, ist ihr Umgang mit den Fällen, die automatisierte Tests nicht
				entscheiden können. Sie implementiert das offene{" "}
				<a href="https://www.w3.org/TR/act-rules-format/">
					<span lang="en">Accessibility Conformance Testing (ACT) Rules Format</span>
				</a>{" "}
				des W3C und wird am veröffentlichten Testkorpus von ACT geprüft, statt sich nur an sich
				selbst zu messen. Sie meldet Befunde, Nicht-Befunde und, was selten ist, ausdrückliche
				Unsicherheit. Die Ergebnisse lassen sich so nachprüfen, statt nur zu beruhigen.
			</p>
			<p>
				<em>Sure</em> heißt Gewissheit über das, was feststeht, und Ehrlichkeit über das, was nicht
				feststeht. Sie sagt Ihnen, was sie nicht sagen kann.
			</p>
		</>
	);
}

export function OverviewContent() {
	return (
		<>
			<h2>Kein einzelnes Produkt</h2>
			<p>
				surea11y ist eine Familie von Paketen mit einer gemeinsamen Engine, kein Tool mit
				nur einem Installationsbefehl. Installieren Sie das Paket, das zu Ihrer bisherigen Art zu
				testen passt; jedes bringt <code>@surea11y/core</code> automatisch mit:
			</p>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "want", label: "Ich möchte…", wrap: true },
					{ key: "install", label: "Installieren", width: "26%" },
				]}
				rows={packageRows}
			/>
			<p>
				Installation und Verwendung pro Binding finden Sie unter{" "}
				<a href="/getting-started/">Erste Schritte</a>.
			</p>

			<h2>Wie sich die Ergebnisse unterscheiden</h2>
			<p>
				Jede Regel trifft eine deterministische Entscheidung aus einem festen Vokabular von vier
				Ergebnissen, nicht in der Form <code>violations</code>/<code>passes</code>/<code>incomplete</code>/
				<code>inapplicable</code>, die andere verbreitete Tools für Barrierefreiheitstests
				verwenden:
			</p>
			<ul className="outcome-list">
				<li>
					<ResultBadge lang="en" state="fail" /> (<code>fail</code>): ein Verstoß, der sich am DOM belegen
					lässt. Objektiven, normativen Fällen vorbehalten.
				</li>
				<li>
					<ResultBadge lang="en" state="pass" /> (<code>pass</code>): Die konkrete Bedingung dieser Regel ist
					erfüllt.{" "}
					<strong>Keine Aussage, dass die Seite barrierefrei ist.</strong>
				</li>
				<li>
					<ResultBadge lang="en" state="unknown" /> (<code>cantTell</code>): Das muss ein Mensch entscheiden,
					und das Ergebnis sagt, was unklar war.
				</li>
				<li>
					<ResultBadge lang="en" state="na" /> (<code>notApplicable</code>): Die Vorbedingung der Regel ist
					nicht gegeben.
				</li>
			</ul>
			<p>
				<code>cantTell</code> ist der Kern des Projekts. Eine Engine, die stillschweigend
				verwirft, was sie nicht bestimmen kann,{" "}
				<strong>liefert einen kürzeren Bericht und eine trügerische Abdeckung</strong>. Die
				vollständige Struktur eines Ergebnisses finden Sie unter{" "}
				<a href="/results-reports/output-schema/">Ergebnisse und Berichte</a>, und unter{" "}
				<a href="/conformance/wcag-mapping/">Konformität</a>, wie sich einzelne Ergebnisse zu einem
				WCAG-Urteil zusammenfassen, einschließlich der Frage, wie eine Ziel-Version von WCAG
				(2.0/2.1/2.2) ermittelt und angewendet wird.
			</p>

			<h3 id="checked-against-the-act-corpus">Geprüft am ACT-Korpus</h3>
			<p>
				Die Engine bringt {rules.length} Regeln mit. 58 davon haben eine Entsprechung in den{" "}
				<a href="https://act-rules.github.io/"><span lang="en">W3C ACT Rules</span></a> und laufen gegen die
				veröffentlichten Testfälle von ACT: 798 Beispiele über diese 58 Regeln. Die Engine lässt
				keines der Beispiele scheitern, die ACT als bestanden oder nicht anwendbar markiert, meldet
				also gegenüber diesem Korpus keine Falsch-Positive. 31 Beispiele, die ACT als gescheitert
				markiert, bleiben unmarkiert, meist Ermessensfragen wie die, ob eine Überschrift den Inhalt
				darunter beschreibt. Jedes einzelne, mit Begründung, steht in{" "}
				<a href={`${core}/docs/ACT_RULE_MAPPING.md`}><code>ACT_RULE_MAPPING.md</code></a>.
			</p>
			<p>
				Der <a href="https://surea11y.github.io/act-report/act-report.jsonld">
					EARL-Implementierungsbericht
				</a>{" "}
				hält das Ergebnis für jeden dieser Fälle fest, bestandene und nicht anwendbare
				eingeschlossen. So lässt sich eine Regel, die stumm blieb, weil nichts anwendbar war, von
				einer unterscheiden, die gar nicht implementiert ist. Zum Format siehe{" "}
				<a href="/results-reports/earl-report/">EARL-Bericht</a>.
			</p>

			<h2>Grundprinzipien</h2>
			<ul>
				<li><strong>Deterministische Ausführung.</strong> Dieselbe Eingabe erzeugt immer dieselbe Ausgabe.</li>
				<li><strong>Bewusst konservativ.</strong> <code>fail</code> ist objektiven, normativen Verstößen vorbehalten, damit es möglichst wenige Fehlalarme gibt.</li>
				<li><strong>Rückverfolgbarkeit zu Standards.</strong> Regeln sind, wo sinnvoll, dem zutreffenden WCAG-Erfolgskriterium zugeordnet.</li>
				<li><strong>Stabile maschinenlesbare Ausgabe.</strong> Regel-IDs bleiben unabhängig von der Sprache stabil.</li>
				<li><strong>Framework-unabhängig.</strong> Läuft in jsdom oder in jedem Framework zur Browser-Automatisierung.</li>
				<li><strong>Erweiterbar.</strong> Eigene Regeln hinzufügen, Policies registrieren und Scans nach Regel-IDs, Tags oder WCAG-Version filtern.</li>
				<li><strong>Lokalisierte Berichte.</strong> Lesbare Meldungen lassen sich übersetzen, ohne die maschinenlesbaren Daten zu berühren; derzeit mit <code>en</code>, <code>fr</code>, <code>de</code> und <code>es</code>.</li>
			</ul>

			<h2>Philosophie</h2>
			<blockquote>
				Automatisieren, was sich objektiv bestimmen lässt. Nie so tun, als ließe sich
				automatisieren, was sich nicht bestimmen lässt.
			</blockquote>
			<p>
				Manche WCAG-Anforderungen lassen sich mit voller Sicherheit prüfen. Andere brauchen
				menschliches Urteil, Kenntnis des Kontexts oder eine Bewertung der Gebrauchstauglichkeit.
				Eine einzelne Punktzahl oder ein Urteil „bestanden/nicht bestanden“ verwischt diesen
				Unterschied; surea11y weist ihn aus. Deshalb gibt es <code>cantTell</code> und{" "}
				<code>notApplicable</code> als Ergebnisse, und das prägt jede Regel der Engine.
			</p>

			<h3>Was surea11y nicht findet</h3>
			<p>Die Grenzen der Automatisierung klar zu benennen, gehört zur selben Philosophie. surea11y wird zum Beispiel nicht:</p>
			<ul>
				<li>bestätigen, dass ein Alternativtext <em>aussagekräftig</em> ist, nur dass er vorhanden ist (ein alt-Attribut <code>"image123.png"</code> besteht die objektive Prüfung);</li>
				<li>beurteilen, ob eine Farbkombination ästhetisch passt, nur ob sie das geltende Kontrastverhältnis erfüllt;</li>
				<li>feststellen, ob eine Fehlermeldung das Problem tatsächlich <em>erklärt</em>, denn das hängt von Validierungslogik ab, die ein statischer Scan nicht sieht;</li>
				<li>eine Tastaturfalle oder bei 400 % Zoom abgeschnittenen Inhalt erkennen, denn beides erfordert, echte Benutzerinteraktion über die Zeit zu simulieren, statt das DOM zu einem einzigen Zeitpunkt zu lesen.</li>
			</ul>
			<p>
				In diesen Fällen meldet die Engine <code>cantTell</code>, und hier bleibt das Urteil eines
				Menschen nötig. Die vollständige Liste finden Sie unter{" "}
				<a href="/help/known-limitations/">Bekannte Einschränkungen</a>.
			</p>
		</>
	);
}

export function OverviewAbout() {
	return (
		<section className="stewardship" aria-labelledby="about-the-project">
			<h2 id="about-the-project" className="stewardship-label">Über das Projekt</h2>
			<p className="stewardship-lead">
				surea11y ist ein unabhängiges <span className="stewardship-nowrap">Open-Source-Projekt</span>, offen entwickelt.
			</p>
			<p className="stewardship-body">
				<code>@surea11y/core</code> und jedes Integrationspaket sind auf{" "}
				<a href="https://www.npmjs.com/org/surea11y">npm</a> veröffentlicht. Issues, Diskussionen
				und Änderungen laufen öffentlich auf <a href="https://github.com/SureA11y">GitHub</a>, und
				Beiträge sind willkommen. Die Richtlinien für Beiträge stehen in{" "}
				<a href="https://github.com/SureA11y/core/blob/main/CONTRIBUTING.md">
					<code>CONTRIBUTING.md</code>
				</a>
				.
			</p>
			<div className="stewardship-byline">
				<p className="stewardship-credit">
					<span className="stewardship-credit-label">Entwickelt und derzeit betreut von</span>{" "}
					<span className="stewardship-name">Jorge Rumoroso</span>
				</p>
				<p className="stewardship-role">
					Fachperson für digitale Barrierefreiheit mit Berufserfahrung in Barrierefreiheits-Audits,
					Standards und Governance.
				</p>
				<p className="stewardship-link">
					<a href="https://www.linkedin.com/in/jorgerumoroso/">LinkedIn-Profil</a>
				</p>
			</div>
		</section>
	);
}
