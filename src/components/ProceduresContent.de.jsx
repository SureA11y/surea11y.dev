import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const toolRows = [
	{ id: "keyboard", tool: <code>keyboard</code>, what: "Eine Tastatur" },
	{ id: "pointer", tool: <code>pointer</code>, what: "Eine Maus oder ein anderes Zeigegerät" },
	{ id: "screen-reader", tool: <code>screen-reader</code>, what: "Ein Screenreader" },
	{ id: "zoom", tool: <code>zoom</code>, what: "Der Zoom des Browsers" },
	{ id: "contrast-theme", tool: <code>contrast-theme</code>, what: "Ein Kontrastdesign (erzwungene Farben)" },
	{ id: "devtools", tool: <code>devtools</code>, what: "Die Entwicklertools des Browsers" },
];

const functionRows = [
	{ id: "proceduresFor", fn: <code>proceduresFor(requirement, options)</code>, what: <>Eine Anforderung: ein WCAG-Kriterium (<code>'1.4.12'</code>), <code>'best-practice'</code> oder die Anforderung eines Packs.</> },
	{ id: "listProcedures", fn: <code>listProcedures(options)</code>, what: "Jede Anforderung eines Standards, in seiner Reihenfolge, mit den Gruppen, in die er sie einordnet (die Prinzipien und Richtlinien von WCAG)." },
	{ id: "procedureChecklist", fn: <code>procedureChecklist(options)</code>, what: "Was eine Person tut, um den Standard zu bewerten, jeweils einmal: ein Punkt pro allgemeinem Prüfverfahren." },
	{ id: "renderProcedures", fn: <code>renderProcedures(input, options)</code>, what: "Jedes der drei als eigenständige HTML-Seite oder als Markdown." },
	{ id: "relatedRequirements", fn: <code>relatedRequirements(requirement, options)</code>, what: "Zwischen WCAG und dem Standard eines Packs: die Anforderungen, die ein Kriterium wiedergeben oder sich darauf beziehen, und umgekehrt." },
	{ id: "procedureLanguages", fn: <code>procedureLanguages(options)</code>, what: "Die Sprachen, in denen die Prüfverfahren eines Standards lesbar sind, jeweils vollständig oder nicht, für eine Sprachauswahl." },
];

const listOptionRows = [
	{ id: "standard", option: <code>standard</code>, what: <><code>'wcag'</code> (der Standard), <code>'best-practice'</code> oder der Standard eines Packs nach Schlüssel oder Name.</> },
	{ id: "version", option: <code>version</code>, what: <>Die von WCAG (<code>'2.0'</code>, <code>'2.1'</code>, <code>'2.2'</code>, der Standard) oder die des Standards des Packs.</> },
	{ id: "levels", option: <code>levels</code>, what: <>Nur WCAG: <code>'A'</code>, <code>'AA'</code>, <code>'AAA'</code> oder eine Liste davon; standardmäßig jede Stufe.</> },
	{ id: "locale", option: <code>locale</code>, what: <>Ein Tag (<code>'fr-CA'</code> liest <code>fr-ca</code>, dann <code>fr</code>) oder eine Liste, die gewünschteste zuerst; Englisch für jeden Text, der einer Locale fehlt.</> },
	{ id: "tools", option: <code>tools</code>, what: <>Nur Facetten, deren Prüfverfahren eines dieser Werkzeuge braucht (<code>'screen-reader'</code>).</> },
	{ id: "automation", option: <code>automation</code>, what: <>Nur Facetten, die Regeln vollständig, teilweise oder gar nicht entscheiden: <code>['manual', 'partial']</code> ist das, was ein Scan einer Person überlässt.</> },
	{ id: "rules", option: <code>rules</code>, what: <>Nur Facetten, die eine dieser Regeln beansprucht (<code>'img-alt-present'</code>).</> },
	{ id: "packs", option: <code>packs</code>, what: "Die Packs, deren Standard oder Regeln gelesen werden." },
	{ id: "profile", option: <code>profile</code>, what: <>Das Profil eines Packs, das ein Gesetz nennt: nur die Anforderungen, die dieses Gesetz verlangt, mit dem Gesetz im Kopf der Liste genannt (core 1.16.0, experimentell; siehe <a href="/configuration/packs/#laws">Packs</a>).</> },
];

const renderOptionRows = [
	{ id: "format", option: <code>format</code>, what: <><code>'html'</code> (der Standard) oder <code>'markdown'</code>.</> },
	{ id: "locale", option: <code>locale</code>, what: "Die Sprache der eigenen Wörter der Seite; standardmäßig die, in der die Prüfverfahren gelesen wurden." },
	{ id: "title", option: <code>title</code>, what: <>Titel und Überschrift der Seite; standardmäßig einer, der den Standard nennt („WCAG 2.2: manuelle Checkliste“).</> },
	{ id: "variants", option: <code>variants</code>, what: <><code>true</code> fügt unter jeder Facette einer Liste die Schritte hinzu, die ein offener Befund eines Scans für sie angibt, in einem geschlossenen Aufklappbereich.</> },
	{ id: "record", option: <code>record</code>, what: <><code>false</code> lässt die Ergebnisse einer Checklisten-Seite und ihr Script weg.</> },
	{ id: "before", option: <code>before</code>, what: <><code>false</code> lässt „Bevor Sie beginnen“ weg, die Gewohnheiten, die ein Ergebnis verlässlich machen.</> },
	{ id: "fragment", option: <code>fragment</code>, what: <><code>true</code> liefert nur den Inhalt, ohne Dokument, Styles oder Script, zum Einfügen in eine eigene Seite.</> },
	{ id: "packs", option: <code>packs</code>, what: "Die Packs, mit denen die Prüfverfahren gelesen wurden." },
];

export function ProceduresContent() {
	return (
		<>
			<p>
				Ein Scan entscheidet, was Regeln entscheiden können. Der Rest einer Bewertung ist Sache
				einer Person: die Fragen, die ein Scan offen lässt (<code>cantTell</code>), und die Teile
				eines Kriteriums, die gar keine Regel testet. Seit <code>@surea11y/core</code> 1.15.0 sagt
				core auch, wie dieser Teil geht: ein <strong>Prüfverfahren</strong> für jede Facette jedes
				WCAG-Kriteriums, das seine Regeln bewerten, und der Best Practices, mit den Schritten, den
				benötigten Werkzeugen und dem, was als bestanden und was als nicht bestanden gilt, auf
				Englisch, Französisch, Deutsch, Spanisch und Japanisch. Es ist derselbe Text, aus dem{" "}
				<a href="/results-reports/output-schema/#how-to-check">„So prüfen Sie es“</a> eines Befunds
				stammt, sodass die manuellen Prüfungen eines Teams und seine Scans gleich lauten.
			</p>
			<p>
				Nutzen Sie sie ganz ohne Scan, für ein manuelles Audit; neben einem Scan, für das, was er
				einer Person überlässt; oder um ein Kriterium zu erklären, dessen Regeln nichts gefunden
				haben, es aber nicht vollständig abdecken. Wie die Schritte eines Befunds sind Prüfverfahren
				eine Anleitung, nicht Teil der Identität eines Befunds: Ihr Wortlaut kann sich in jedem
				Release verbessern.
			</p>

			<h2 id="see-them">Ansehen</h2>
			<p>
				Diese beiden Seiten sind die eigene Ausgabe von core für WCAG 2.2 Stufe A und AA, mit jedem
				Release, dem diese Website folgt, neu erzeugt, und öffnen sich von der Festplatte, ohne
				etwas von anderswo zu laden:
			</p>
			<ul>
				<li>
					<a href="/procedures/wcag-22-aa.html">Die Referenz</a>: wie jedes Kriterium zu bewerten
					ist, Facette für Facette, unter den Prinzipien und Richtlinien von WCAG.
				</li>
				<li>
					<a href="/procedures/wcag-22-aa-checklist.html">Das Arbeitsblatt</a>: jede Prüfung
					einmal, mit einem Ergebnis (<em>Nicht geprüft</em>, <em>Bestanden</em>,{" "}
					<em>Nicht bestanden</em>, <em>Nicht anwendbar</em>) und Notizen zum Festhalten, in Ihrem
					Browser gespeichert und als JSON oder CSV herunterladbar.
				</li>
			</ul>
			<p>
				Beide Seiten werden an den eigenen Regeln von core gemessen, in jsdom und in Chromium, im
				hellen und im dunklen Modus, mit dem Profil WCAG 2.2 AA: ein Skip-Link, jeweils eine
				Überschriftenebene, beschriftete Bereiche, echte Listen und Fieldsets, sichtbarer Fokus,
				nichts allein über Farbe, ein befolgtes Design mit erzwungenen Farben, die Breite eines
				Smartphones und ein druckbares Layout.
			</p>

			<h2 id="what-a-procedure-is">Was ein Prüfverfahren ist</h2>
			<p>
				Ein Kriterium hat <strong>Facetten</strong>, die Prüfziele, die eine Person prüft, um es zu
				bewerten. Eine Facette, die eine Regel entscheidet, ist <code>full</code>, eine, von der
				Regeln einen Teil entscheiden, <code>partial</code>, und eine, die nur eine Person
				beurteilen kann, <code>manual</code>. Eine Facette hat ein{" "}
				<strong>allgemeines Prüfverfahren</strong>: Schritte, denen eine Person auf einer ganzen
				Seite folgt, in einem Browser mit seinen Entwicklertools, einer Tastatur und, wo es darauf
				ankommt, einem Screenreader; dann was sie sieht, wenn es bestanden ist und wenn nicht, mit
				dem Kriterium, das dann nicht erfüllt ist; und die <strong>Werkzeuge</strong>, die es
				außer einem Browser braucht:
			</p>
			<DataTable
				label="Werkzeuge, die ein Prüfverfahren brauchen kann"
				rowKey="id"
				columns={[
					{ key: "tool", label: "Werkzeug", width: "30%" },
					{ key: "what", label: "Was es ist", wrap: true },
				]}
				rows={toolRows}
			/>
			<ul>
				<li>
					Eine <strong>Technologie-Facette</strong> ist ein Test, den eine Regel an einer Art von
					Element vornimmt (ein <code>&lt;img&gt;</code> hat ein <code>alt</code>-Attribut). Sie
					hat kein eigenes Prüfverfahren: <code>coveredBy</code> nennt die umfassendere Facette,
					deren Prüfverfahren sie bewertet, sodass eine Checkliste einmal aufführt, was eine Person
					tut.
				</li>
				<li>
					Eine <strong>Variante</strong> ist die engere Frage, die eine Regel zu einem Element
					stellt: die Schritte, die ihr offener Befund als <code>howToCheck</code> zeigt. Ein Befund
					zeigt immer seine Variante, nie den allgemeinen Text, und die beiden widersprechen sich
					nie. Jeder Reason-Code, den eine Regel von core als <code>cantTell</code> melden kann,
					steht unter genau einer Facette.
				</li>
				<li>
					Was kein Kriterium verlangt, wird getrennt gehalten, unter <code>best-practice</code>,
					sodass die Prüfverfahren eines Kriteriums nie einen Rat als Fehlschlag darstellen.
				</li>
			</ul>

			<h2 id="which-criteria-have-procedures">Welche Kriterien Prüfverfahren haben</h2>
			<p>
				Jedes Kriterium, das eine Regel von core bewertet, vollständig, teilweise oder als{" "}
				<code>cantTell</code>, hat ein Prüfverfahren für jede Facette, auch für die Facetten, die
				keine Regel prüft, da eine Person sie braucht, um zu vollenden, was der Scan begonnen hat:
				36 der 87 Kriterien von WCAG 2.2 auf den Stufen A, AA und AAA sowie 4.1.1 (in 2.2
				entfernt), mit 170 Facetten, 56 eigenen Prüfverfahren und 114 Technologie-Facetten, die von
				einem davon abgedeckt werden. Ein solches Kriterium ist <code>complete</code>. Die übrigen 51
				Kriterien, die keine Regel bewertet (etwa 1.2.3 Audiodeskription oder Medienalternative
				(aufgezeichnet)), werden mit ihren Facetten und ohne Prüfverfahren aufgeführt: Wie sie von
				Hand zu bewerten sind, liegt außerhalb von core. Die Best Practices haben eines für jede
				ihrer 13 Facetten: Landmarks, Inhalte in Landmarks, Überschriften, Tabellen-Markup,
				ARIA-Rollen, Fokusreihenfolge, Access Keys, Skip-Links, Namen und Beschriftungen, Zoom,
				wiederholte Namen, neue Fenster und Downloads sowie reduzierte Bewegung.
			</p>

			<h2 id="reading-them">Sie lesen</h2>
			<DataTable
				label="Funktionen für Prüfverfahren"
				rowKey="id"
				columns={[
					{ key: "fn", label: "Funktion", width: "38%", wrap: true },
					{ key: "what", label: "Was sie liefert", wrap: true },
				]}
				rows={functionRows}
			/>
			<p>
				In Node kommen sie aus <code>@surea11y/core</code>, das die Wörterbücher von der Festplatte
				liest. Code, der im Browser läuft, importiert dasselbe aus{" "}
				<code>@surea11y/core/procedures</code>, mit dem Suffix <code>From</code> (
				<code>proceduresFrom</code>, <code>listProceduresFrom</code>,{" "}
				<code>procedureChecklistFrom</code>, <code>renderProceduresFrom</code>,{" "}
				<code>procedureLanguagesFrom</code>), und übergibt die Wörterbücher, die er als{" "}
				<code>{"@surea11y/core/procedures/<locale>"}</code> importiert: Er braucht kein Dateisystem
				und erreicht keine der Regeln.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { proceduresFor } = require('@surea11y/core');",
					"",
					"proceduresFor('1.4.12', { locale: 'fr' });",
					"// { standard: 'wcag', id: '1.4.12', title: 'Espacement du texte', level: 'AA', complete: true,",
					"//   rules: ['avoid-inline-spacing', 'text-spacing-content-loss'], facets: [ … ] }",
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"import { proceduresFrom } from '@surea11y/core/procedures';",
					"import en from '@surea11y/core/procedures/en';",
					"import fr from '@surea11y/core/procedures/fr';",
					"",
					"proceduresFrom({ en, fr }, '1.4.12', { locale: 'fr' });",
				]}
			/>
			<p>
				Jede Facette trägt ihr <code>label</code>, <code>automation</code>, die{" "}
				<code>rules</code>, die sie beanspruchen, ihre <code>tools</code>, ihr{" "}
				<code>procedure</code> (<code>{"{ steps, passWhen, failWhen }"}</code> oder{" "}
				<code>null</code> bei einer Technologie-Facette, mit <code>coveredBy</code>) und ihre{" "}
				<code>variants</code>, jede genau das <code>howToCheck</code> des Befunds dieser Regel für
				diesen Code. Ein Text in einer anderen Sprache als der gelesenen (der eigene Titel einer
				früheren WCAG-Version, etwa „<span lang="en">Parsing</span>“ von 2.1 für 4.1.1, oder ein
				Text, der einer Locale fehlt) sagt, in welcher, damit ein Tool ihn mit <code>lang</code>{" "}
				kennzeichnen kann, wie es WCAG 3.1.2 verlangt.{" "}
				<a href={`${core}/docs/PROCEDURES.md#the-shape`}><code>PROCEDURES.md</code></a> von core
				auf GitHub enthält die ganze Form.
			</p>

			<h2 id="listing-them">Sie auflisten</h2>
			<CodeBlock
				lang="js"
				lines={[
					"const { listProcedures } = require('@surea11y/core');",
					"",
					"listProcedures();                                         // WCAG 2.2, every level",
					"listProcedures({ version: '2.1', levels: ['A', 'AA'] });  // WCAG 2.1 A and AA",
					"listProcedures({ standard: 'best-practice' });",
					"listProcedures({ levels: ['A', 'AA'], automation: ['manual', 'partial'] }); // what a scan leaves",
				]}
			/>
			<DataTable
				label="Optionen von listProcedures und procedureChecklist"
				rowKey="id"
				columns={[
					{ key: "option", label: "Option", width: "22%" },
					{ key: "what", label: "Was sie bewirkt", wrap: true },
				]}
				rows={listOptionRows}
			/>
			<p>
				Die Kriterien von WCAG sind die, die die Version hat, auf ihren Stufen: 2.0 und 2.1 führen
				4.1.1 als Kriterium der Stufe A mit dem Titel „Syntaxanalyse“, 2.2 nicht. Bei mehreren
				Filtern muss eine Facette jedem entsprechen; das <code>complete</code> einer Anforderung
				bleibt ihr eigenes.
			</p>

			<h2 id="a-checklist">Eine Checkliste</h2>
			<p>
				<code>procedureChecklist</code> nimmt dieselben Optionen und liefert, was eine Person tut,
				um den Standard zu bewerten, jeweils einmal: einen Punkt pro allgemeinem Prüfverfahren, mit
				den Technologie-Facetten, die es ebenfalls bewertet, in <code>covers</code> und den Regeln
				dahinter in <code>rules</code>.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { procedureChecklist } = require('@surea11y/core');",
					"",
					"procedureChecklist({ levels: ['A', 'AA'] }).items[0];",
					"// {",
					"//   key: '1.1.1/text-alternative-mechanism',",
					"//   label: 'Non-text content that conveys something has a text alternative',",
					"//   automation: 'partial',",
					"//   wcag: '1.1.1',",
					"//   requirements: ['1.1.1'],",
					"//   covers: ['img-alt-attr-present', 'role-img-text-alternative-present', …],",
					"//   rules: ['img-alt-present', …],",
					"//   tools: [{ id: 'devtools', label: \"The browser's developer tools\" }],",
					"//   procedure: { steps: ['…'], passWhen: '…', failWhen: '… which fails WCAG 1.1.1.' }",
					"// }",
				]}
			/>

			<h2 id="rendering-them">Seiten und Arbeitsblätter</h2>
			<p>
				<code>renderProcedures</code> macht aus dem, was <code>listProcedures</code>,{" "}
				<code>procedureChecklist</code> oder <code>proceduresFor</code> liefert, ein Dokument, das
				eine Person liest oder durcharbeitet: eine eigenständige HTML-Seite, die sich ohne Server,
				Netzwerk, Schrift oder Script von anderswo von der Festplatte öffnet, oder Markdown.
				Dieselbe Eingabe und dieselben Optionen ergeben immer dieselbe Seite.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { listProcedures, procedureChecklist, renderProcedures } = require('@surea11y/core');",
					"const fs = require('node:fs');",
					"",
					"// A reference: how to assess every WCAG 2.2 A and AA criterion.",
					"fs.writeFileSync('wcag-22-aa.html', renderProcedures(listProcedures({ levels: ['A', 'AA'] })));",
					"",
					"// A worksheet: each check once, with a result and notes to record.",
					"fs.writeFileSync('wcag-22-aa-checklist.html', renderProcedures(procedureChecklist({ levels: ['A', 'AA'] })));",
					"",
					"// The same in Markdown, for a repository or a wiki.",
					"fs.writeFileSync('wcag-22-aa.md', renderProcedures(listProcedures({ levels: ['A', 'AA'] }), { format: 'markdown' }));",
				]}
			/>
			<DataTable
				label="Optionen von renderProcedures"
				rowKey="id"
				columns={[
					{ key: "option", label: "Option", width: "22%" },
					{ key: "what", label: "Was sie bewirkt", wrap: true },
				]}
				rows={renderOptionRows}
			/>
			<p>
				<strong>Die Seite einer Liste</strong> ist eine Referenz für den Standard: sein Titel und
				Umfang, was seine Ergebnisse bedeuten (die Best Practices zählen gegen keine Konformität,
				Stufe AAA ist eine Empfehlung), „Bevor Sie beginnen“, ein Inhaltsverzeichnis und jede
				Anforderung mit ihren Facetten: was jede prüft, wie viel davon Regeln entscheiden, die
				Werkzeuge, die Schritte, was als bestanden und was als nicht bestanden gilt, und die
				Regeln, die sie testen.
			</p>
			<p>
				<strong>Die Seite einer Checkliste</strong> ist ein Arbeitsblatt. Unter jedem Punkt hält eine
				Person ein Ergebnis und Notizen fest; die Seite zählt die Ergebnisse in einer
				Statusmeldung, die ein Screenreader ansagt, speichert sie im Browser (
				<code>localStorage</code>, nach Standard, Version und Titel geschlüsselt) und lädt sie als
				JSON herunter, mit dem Ergebnis jeder Anforderung aus ihren Punkten zusammengefasst, oder
				als CSV, das eine Tabellenkalkulation mit seinen Akzenten öffnet. Eine Anforderung ist nicht
				bestanden, wo einer ihrer Punkte nicht bestanden ist, <code>open</code>, wo einer noch nicht
				geprüft ist, <code>notApplicable</code>, wo keiner zutrifft, und sonst bestanden.
			</p>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					'  "title": "WCAG 2.2: manual checklist",',
					'  "standard": "wcag",',
					'  "version": "2.2",',
					'  "items": [',
					"    {",
					'      "key": "1.1.1/text-alternative-mechanism",',
					'      "requirements": ["1.1.1"],',
					'      "outcome": "fail",',
					'      "notes": "The logo has no alt."',
					"    }",
					"  ],",
					'  "requirements": [{ "id": "1.1.1", "outcome": "fail" }]',
					"}",
				]}
			/>
			<p>
				Die eigenen Wörter einer Seite gibt es in jeder Sprache, die core mitliefert, ebenso die
				Prüfverfahren, die Bezeichnungen der Facetten und die Prinzipien, Richtlinien und
				Kriterien von WCAG, mit den Namen, wie sie die veröffentlichte Übersetzung von WCAG in jeder
				Sprache angibt. Was in einer anderen Sprache als der der Seite steht, ist mit dieser
				gekennzeichnet, sodass ein Screenreader jeden Teil in seiner Sprache vorliest.{" "}
				<code>fragment: true</code> liefert nur den Inhalt, in einem{" "}
				<code>{'<div class="surea11y-procedures">'}</code> mit Überschriften ab <code>h1</code>,
				für eine Dokumentationswebsite, die eigene Styles mitbringt.
			</p>

			<h2 id="from-the-cli">Aus der CLI</h2>
			<p>
				<a href="/getting-started/cli/#manual-checks"><code>@surea11y/cli</code></a> 1.5.0 schreibt
				dieselben Seiten ohne Code: <code>surea11y procedures</code> ohne Scan und{" "}
				<code>--manual-checks</code> neben einem Scan, für die Prüfungen, die er einer Person
				überlässt.
			</p>
			<CodeBlock
				lines={[
					"# How to assess every WCAG 2.2 A and AA criterion, or a worksheet for a manual audit",
					{ text: "surea11y procedures --wcag-level AA -o wcag-22-aa.html", command: true },
					{ text: 'surea11y procedures --wcag-level AA --checklist --title "Audit: example.com" -o audit.html', command: true },
					"",
					"# The checks a scan leaves to a person, as a worksheet next to its report",
					{ text: "surea11y scan https://example.com/ --wcag 2.2 --html report.html --manual-checks manual-checks.html", command: true },
				]}
			/>

			<h2 id="in-the-html-report">Im HTML-Bericht</h2>
			<p>
				Der <a href="/results-reports/html-report/">HTML-Bericht</a> hat einen Abschnitt „Was ein
				Mensch noch prüfen muss“: jede Anforderung des gescannten Standards mit einer Prüfung, die
				keine Regel vollständig entscheidet, ihr Ergebnis im Scan daneben und, darunter
				eingeklappt, diese Prüfungen mit ihren Schritten. Eine Anforderung, deren Regeln alle{" "}
				<code>pass</code> ergeben, ist erst erfüllt, wenn auch ihre Prüfungen bestanden sind, und
				der Bericht sagt das. <code>{"renderHtmlReport(result, { manualChecks: false })"}</code>{" "}
				lässt den Abschnitt weg.
			</p>

			<h2 id="uses">Anwendungen</h2>
			<p>
				<strong>Ein manuelles Audit, ohne Scan.</strong> Eine prüfende Person arbeitet das
				Arbeitsblatt des Standards durch, gegen den das Audit läuft, hält jedes Ergebnis und jede
				Notiz fest und lädt das JSON für den Bericht herunter:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const checklist = procedureChecklist({ version: '2.2', levels: ['A', 'AA'] });",
					"fs.writeFileSync('audit-worksheet.html', renderProcedures(checklist, { title: 'Accessibility audit: example.com' }));",
				]}
			/>
			<p>
				<strong>Der Anhang eines Testlaufs.</strong> Ein Playwright-Test, der eine Seite scannt,
				kann die Prüfungen anhängen, die seine Regeln nicht entscheiden, sodass sie im Testbericht
				neben dem Scan stehen:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"test('home page', async ({ page }, testInfo) => {",
					"  // ... scan the page ...",
					"  const left = procedureChecklist({ levels: ['A', 'AA'], automation: ['manual', 'partial'] });",
					"  await testInfo.attach('manual-checks.html', {",
					"    body: renderProcedures(left, { record: false }),",
					"    contentType: 'text/html'",
					"  });",
					"});",
				]}
			/>
			<p>
				<strong>Eine Sitzung mit einer Person, die einen Screenreader nutzt.</strong> Nur das, was
				einen Screenreader braucht, für eine Sitzung mit einer Person, die täglich einen nutzt:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const sr = listProcedures({ levels: ['A', 'AA'], tools: 'screen-reader' });",
					"fs.writeFileSync('screen-reader-session.html', renderProcedures(sr, { title: 'Screen reader session' }));",
				]}
			/>
			<p>
				<strong>Dokumentation.</strong> Eine Markdown-Datei pro Standard in einer
				Dokumentationswebsite oder einem Repository, neu erzeugt, wenn core aktualisiert wird,
				sodass ein Team dieselben Prüfverfahren liest, die seine Werkzeuge verwenden.{" "}
				<strong>Ein Kriterium, wo es gebraucht wird:</strong> Ein Tool, das einen Befund zeigt,
				kann zeigen, wie sein ganzes Kriterium zu bewerten ist, mit{" "}
				<code>{"renderProcedures(proceduresFor('1.4.12', { locale: 'de' }), { fragment: true })"}</code>.
			</p>

			<h2 id="a-packs-standard">Der Standard eines Packs</h2>
			<p>
				Der Standard eines <a href="/configuration/packs/#procedures">Packs</a> kann sagen, wie eine
				Person seine eigenen Anforderungen bewertet, und jede der obigen Funktionen liest ihn, wenn
				sie die Packs erhält: nach seinen eigenen Nummern und Gruppen, in seiner eigenen Sprache,
				wo er eine angibt. Eine Anforderung, die ein WCAG-Kriterium wiedergibt, übernimmt dessen
				Prüfverfahren, gelesen als die Anforderung („which fails EN 301 549 9.1.4.3“). Seit core
				1.16.0 listet eine Facette auch die Regeln von core auf, die die Zuordnung des Standards
				dem zuweist, was sie bewertet (<code>mappedRules</code>, und im <code>mappedRules</code>{" "}
				eines Checklistenpunkts), sodass eine Anforderung oder ein Test, den nur Regeln von core
				prüfen, nicht ungeprüft aussieht.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const en301549 = require('@surea11y/pack-en301549');",
					"",
					"proceduresFor('9.1.4.3', { packs: [en301549], standard: 'en301549', version: 'V4.1.1', locale: 'fr' });",
					"relatedRequirements('1.4.3', { packs: [en301549] });",
					"// [{ standard: 'EN 301 549', id: '9.1.4.3', version: 'V4.1.1', relation: 'restates', … }]",
					"",
					"const options = { packs: [en301549], standard: 'en301549', version: 'V4.1.1', locale: 'fr' };",
					"fs.writeFileSync('en-301-549.html', renderProcedures(procedureChecklist(options), { packs: [en301549] }));",
				]}
			/>
			<p>
				Das <a href="/configuration/packs/#en-301-549-pack">EN-301-549-Pack</a> 1.2.0 liefert
				Prüfverfahren für jede Klausel von Kapitel 9, deren Kriterium eine Regel von core bewertet,
				in fünf Sprachen, und das <a href="/configuration/packs/#wai-aria-pack">WAI-ARIA-Pack</a>{" "}
				liefert eine Checkliste für jede seiner Anforderungen, mit den gültigen Rollen, Zuständen und
				Werten vollständig aufgeführt. Ein Pack, das keine Prüfverfahren mitbringt, ändert nichts:
				Die von WCAG sind mit ihm dieselben wie ohne es.
			</p>
		</>
	);
}
