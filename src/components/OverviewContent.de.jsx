import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { ResultBadge } from "./design-system/results/ResultBadge.jsx";
import rules from "../data/rules.generated.json";

const core = "https://github.com/SureA11y/core/blob/main";

const packageRows = [
	{ id: "playwright", want: "Barrierefreiheit in Playwright-Tests prüfen", install: <><code>@surea11y/playwright</code> + <code>@surea11y/core</code></> },
	{ id: "puppeteer", want: "…in Puppeteer-Tests", install: <><code>@surea11y/puppeteer</code> + <code>@surea11y/core</code></> },
	{ id: "selenium", want: "…in Selenium-Tests", install: <><code>@surea11y/selenium</code> + <code>@surea11y/core</code></> },
	{ id: "cypress", want: "…in Cypress-Tests", install: <><code>@surea11y/cypress</code> + <code>@surea11y/core</code></> },
	{ id: "webdriverio", want: "…in WebdriverIO-Tests", install: <><code>@surea11y/webdriverio</code> + <code>@surea11y/core</code></> },
	{ id: "test-matchers", want: "Barrierefreiheit in Komponenten- oder Unit-Tests mit Jest/Vitest prüfen", install: <><code>@surea11y/test-matchers</code> + <code>@surea11y/core</code></> },
	{ id: "cli", want: "Statisches HTML im Terminal oder in einer CI-Pipeline scannen", install: <code>@surea11y/cli</code> },
	{ id: "pack-en301549", want: "Gegen die EN 301 549, die europäische Norm, prüfen, mit jedem der obigen", install: <><a href="/configuration/packs/#en-301-549-pack"><code>@surea11y/pack-en301549</code></a> + <code>@surea11y/core</code></> },
	{ id: "pack-own", want: "Gegen eigene Regeln, Profile oder eine eigene Norm prüfen, öffentlich oder intern", install: <>Ein eigenes Pack: siehe <a href="/configuration/packs/#writing-a-pack">Ein Pack schreiben</a></> },
	{ id: "core", want: "Die Engine auf ein DOM anwenden, das Sie bereits haben", install: <code>@surea11y/core</code> },
	{ id: "core-build", want: "Ein eigenes Tool auf der Engine aufbauen: eine CLI, eine Erweiterung, ein Dashboard, einen Berichtsgenerator", install: <code>@surea11y/core</code> },
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
				testen passt, zusammen mit <code>@surea11y/core</code>, der Engine, die es ausführt. core
				allein installieren Sie, um die Engine auf ein DOM anzuwenden, das Sie bereits haben, oder um ein
				eigenes Tool darauf aufzubauen:
			</p>
			<DataTable
				label="Wahl des passenden Pakets"
				rowKey="id"
				columns={[
					{ key: "want", label: "Ich möchte…", wrap: true },
					{ key: "install", label: "Installieren", width: "26%" },
				]}
				rows={packageRows}
			/>
			<p>
				Installation und Verwendung pro Binding finden Sie unter{" "}
				<a href="/getting-started/">Erste Schritte</a>. Wenn Sie ein Tool entwickeln, beschreibt{" "}
				<a href={`${core}/docs/BUILDING_ON_CORE.md`}><code>BUILDING_ON_CORE.md</code></a> (auf
				GitHub, auf Englisch) den stabilen Vertrag, das Ausführen von Scans, die Wahl der Prüfungen
				und wie man Ergebnisse darstellt, ohne mehr zu behaupten, als sie aussagen.
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
				<strong>liefert einen kürzeren Bericht und den trügerischen Eindruck vollständiger Abdeckung</strong>. Die
				vollständige Struktur eines Ergebnisses finden Sie unter{" "}
				<a href="/results-reports/output-schema/">Ergebnisse und Berichte</a>, und unter{" "}
				<a href="/conformance/wcag-mapping/">Konformität</a>, wie sich einzelne Ergebnisse zu einem
				WCAG-Urteil zusammenfassen, einschließlich der Frage, wie eine Ziel-Version von WCAG
				(2.0/2.1/2.2) ermittelt und angewendet wird.
			</p>
			<p>
				Ein <code>pass</code> sagt auch, wie knapp er war. Regeln, die gegen einen Grenzwert messen
				(Kontrast, Zielgröße, Textabstände), melden eine <code>margin</code>: das Element, das dem
				Grenzwert am nächsten kam und ihn trotzdem einhielt. Text mit 4,52:1 bei einem Minimum von
				4,5:1 besteht, und die <code>margin</code> zeigt es. So können Sie ihn korrigieren, bevor eine
				kleine Änderung ein <code>fail</code> daraus macht. Siehe{" "}
				<a href="/results-reports/output-schema/#margin">Ausgabeschema</a>.
			</p>
			<p>
				Nennen Sie den Standard, und die Engine wählt die Regeln.{" "}
				<code>{"{ wcag: { version: '2.2', level: 'AA' } }"}</code> führt die Regeln für die A- und
				AA-Kriterien von WCAG 2.2 aus, nach der Stufe, die jedes Kriterium in dieser Version hat, und{" "}
				<code>bestPractices: true</code> ergänzt die Prüfungen, die WCAG nicht verlangt. Ein Standard
				über WCAG hinaus, etwa ein nationaler oder die eigene Richtlinie Ihrer Organisation, kommt als
				Pack: Seine Regeln, Profile und Checklistenpunkte laufen neben denen von core und erscheinen
				in jedem Bericht. Siehe{" "}
				<a href="/configuration/engine-options/#selecting-which-rules-run">Engine-Optionen</a> und{" "}
				<a href="/configuration/packs/">Packs</a>.
			</p>
			<p>
				Nennen Sie Prüfungen statt eines Standards, und das Ergebnis zeigt trotzdem, welche
				WCAG-Kriterien sie betreffen. Ein Scan, der nur <code>link-name-present</code> ausführt,
				meldet auch 2.4.4 und 4.1.2, dazu das AAA-Kriterium 2.4.9, wenn der Scan keine Stufe festlegt, und ein Kriterium, dessen übrige Prüfungen der Scan ausgelassen
				hat, ergibt <code>cantTell</code> („Teilweise geprüft“ im HTML-Bericht), nicht{" "}
				<code>pass</code>. <code>wcagLevel: 'AA'</code> legt die Stufe der Kriterien fest, die ein
				Scan meldet, und die JUnit-, SARIF- und EARL-Berichte folgen ihr. So schlägt ein AA-Build
				nicht wegen eines AAA-Kriteriums fehl.
			</p>
			<p>
				Web Components werden nach dem beurteilt, was sie bereitstellen. Ein Custom Element, das
				sich über <code>ElementInternals</code> einen Namen, Zustände oder eine Rolle gibt, wird daran
				geprüft, wo die Engine sie lesen kann, und als Frage gemeldet, wo nicht. Für Test- und
				Audit-Läufe ist <code>internalsHookScript()</code> ein optionales Skript, mit dem ein Scan
				die <code>internals</code> liest, die eine Komponente privat hält. Solche Elemente ergeben
				dann <code>pass</code> oder <code>fail</code> statt <code>cantTell</code>.{" "}
				<a href={`${core}/docs/INTEGRATION.md#reading-private-elementinternals-the-internals-hook`}>
					<code>INTEGRATION.md</code>
				</a>{" "}
				(auf GitHub) zeigt, wie Sie es vor den Skripten der Seite installieren.
			</p>
			<p>
				Im Browser wird Kontrast so gemessen, wie die Seite gezeichnet wird: Text auf einer Seite
				ohne eigenen Hintergrund, auf der Fläche, die der Browser malt, hell oder dunkel; generierter
				Text aus <code>::before</code>, <code>::after</code> und Listenmarkern; ein geschlossenes{" "}
				<code>&lt;select&gt;</code>; und Text, der nur durch eine Kontur gezeichnet wird. Diese Fälle
				wurden früher übersprungen oder als Frage gemeldet. Ein einzelnes Zeichen, das für den Namen
				eines Bedienelements steht, wie das „X“ in einer Schaltfläche namens „Schließen“, wird als
				Frage gemeldet statt als <code>fail</code>: Ob es ein Icon oder ein Buchstabe ist, muss eine
				Person entscheiden.
			</p>

			<h3 id="checked-against-the-act-corpus">Geprüft am ACT-Korpus</h3>
			<p>
				Die Engine bringt {rules.length} Regeln mit. 59 davon haben eine Entsprechung in den{" "}
				<a href="https://www.w3.org/WAI/standards-guidelines/act/rules/"><span lang="en">W3C ACT Rules</span></a>{" "}
				und laufen gegen die Testfälle, die das W3C dafür veröffentlicht, also die Menge, die die
				Implementierungsliste des W3C bewertet: 942 Beispiele über diese 59 Regeln. Für keines der
				Beispiele, die ACT als bestanden oder nicht anwendbar markiert, meldet die Engine{" "}
				<code>fail</code>; gegenüber diesem Korpus gibt es also keine Falsch-Positive. Das ist ein
				Ergebnis für diese Beispiele, keine Garantie für jede Seite. Wo die Engine einen Fall nicht
				entscheiden kann, meldet sie <code>cantTell</code>, was ACT einer automatisierten
				Implementierung erlaubt.
			</p>
			<p>
				Das gilt an beiden Orten, an denen die Engine läuft: in jsdom, wie test-matchers und die CLI
				sie ausführen, und in Chromium, wie die Browser-Bindings es tun, wobei jeder Testfall als
				echte Seite geladen wird, mit seinen Skripten und verlinkten Stylesheets. 25 Beispiele, die
				ACT als nicht bestanden markiert, erkennt die Engine in jsdom nicht, in Chromium 21. Meist
				geht es um Ermessensfragen wie die, ob eine Überschrift den Inhalt darunter beschreibt; die
				vier, die der Browser erkennt, brauchen die Skripte oder Stylesheets der Seite selbst, die
				jsdom nicht ausführt. Jedes einzelne, mit Begründung, steht in{" "}
				<a href={`${core}/docs/ACT_RULE_MAPPING.md`}><code>ACT_RULE_MAPPING.md</code></a>.
			</p>
			<p>
				Zwei EARL-Implementierungsberichte halten das Ergebnis für jeden dieser Fälle fest,
				bestandene und nicht anwendbare eingeschlossen. So lässt sich eine Regel, die stumm blieb,
				weil nichts anwendbar war, von einer unterscheiden, die gar nicht implementiert ist:{" "}
				<a href="https://surea11y.github.io/act-report/act-report.jsonld" lang="en">SureA11y</a>,
				ausgeführt in jsdom, und{" "}
				<a href="https://surea11y.github.io/act-report/act-report-browser.jsonld" lang="en">
					SureA11y in a browser
				</a>
				, ausgeführt in Chromium. Zum Format siehe{" "}
				<a href="/results-reports/earl-report/">EARL-Bericht</a>.
			</p>

			<h2>Grundprinzipien</h2>
			<ul>
				<li><strong>Deterministische Ausführung.</strong> Dieselbe Seite, unter denselben Bedingungen gerendert und mit denselben Optionen gescannt, erhält dieselben Entscheidungen. Laufzeiten, Zeitstempel und Angaben zur Umgebung im Ergebnis können sich zwischen Läufen trotzdem unterscheiden. Laufende Animationen und Übergänge werden für den Scan angehalten, sodass eine laufende Einblendung nicht verändert, was die Regeln messen.</li>
				<li><strong>Bewusst konservativ.</strong> Die Regeln von core behalten <code>fail</code> objektiven, normativen Verstößen vor, damit Fehlalarme selten bleiben.</li>
				<li><strong>Rückverfolgbarkeit zu Standards.</strong> Regeln sind, wo sinnvoll, dem zutreffenden WCAG-Erfolgskriterium zugeordnet.</li>
				<li><strong>Stabile maschinenlesbare Ausgabe.</strong> Regel-IDs bleiben unabhängig von der Sprache stabil.</li>
				<li><strong>Framework-unabhängig.</strong> Läuft in jsdom oder in jedem Framework zur Browser-Automatisierung.</li>
				<li><strong>Erweiterbar.</strong> Eigene Regeln hinzufügen, Policies registrieren und Scans nach Regel-IDs, Tags oder WCAG-Version filtern.</li>
				<li><strong>Lokalisierte Berichte.</strong> Lesbare Meldungen lassen sich übersetzen, ohne die maschinenlesbaren Daten zu berühren; derzeit mit <code>en</code>, <code>fr</code>, <code>de</code>, <code>es</code> und <code>ja</code>.</li>
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
				Einige implementierte Prüfungen melden <code>cantTell</code>, wenn eine Person entscheiden
				muss. Andere Aspekte, darunter Tastaturfallen und Reflow beim Zoomen, prüft die Engine gar
				nicht; sie brauchen eigene Tests. Kein <code>cantTell</code> steht für sie, ein Ergebnis
				ohne <code>cantTell</code> heißt also nicht, dass sie abgedeckt wurden. Die vollständige Liste finden Sie unter{" "}
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
