import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const optionRows = [
	{
		id: "strictOptions",
		option: <code>strictOptions</code>,
		meaning: (
			<>
				Standard <code>false</code>. <code>true</code> prüft vor dem Scan jede Option und wirft{" "}
				<code>INVALID_ENGINE_OPTIONS</code> bei einem Schlüssel, den die Engine nicht liest, oder
				bei einem Wert vom falschen Typ oder außerhalb seiner Menge; siehe{" "}
				<a href="#catching-mistakes-in-the-options-strictoptions">„Fehler in den Optionen abfangen“</a>{" "}
				unten.
			</>
		),
	},
	{
		id: "locale",
		option: <code>locale</code>,
		meaning: (
			<>
				Ein beliebiger String. Ein Code mit Subtag fällt zuerst auf seine Basissprache zurück,{" "}
				<code>de-DE</code> verwendet also <code>de</code>; gibt es die nicht, Englisch. Einzelne
				Strings fallen anschließend nach demselben Muster zurück (gewählte Locale →{" "}
				<code>en</code> → der wörtliche englische Text der Regel), sodass eine nur teilweise
				übersetzte Locale nie zu fehlendem Text führt. In den Strings selbst ist davon nichts zu
				sehen, deshalb meldet das Ergebnis in <code>engine.locale</code>, was tatsächlich
				passiert ist. Prüfen Sie diesen Wert, wenn Sie wissen müssen, ob Sie die angeforderte
				Sprache bekommen haben. Siehe <a href="/configuration/locales/">Locales</a>.
			</>
		),
	},
	{
		id: "wcagVersion",
		option: <code>wcagVersion</code>,
		meaning: (
			<>
				<code>'2.0'</code>, <code>'2.1'</code> oder <code>'2.2'</code>: gegen welche WCAG-Version
				der Lauf auf Konformität prüft. Standardmäßig gilt die Version, die sich aus Ihren
				Versionsursprungs-Tags ergibt, und <code>'2.2'</code>, wenn sich daraus keine ergibt.{" "}
				<strong>Derzeit ändert die Option nur etwas an Erfolgskriterium 4.1.1 „Syntaxanalyse“, das in 2.2 entfernt
				wurde</strong>: Bei einem 2.2-Ziel läuft eine Regel mit dem Tag{" "}
				<code>wcag22-removed</code> weiterhin und meldet weiterhin ihre Vorkommen, kann aber nicht{" "}
				<code>fail</code> ergeben. Siehe{" "}
				<a href="#filtering-by-wcag-version">„Filtern nach WCAG-Version“</a> oben. Jeder andere
				Wert, gleich welchen Typs (die Zahl <code>2.1</code>, <code>'3.0'</code>), wird mit einem{" "}
				<code>console.warn</code> ignoriert, das die Version nennt, auf die der Lauf stattdessen
				zielt.
			</>
		),
	},
	{
		id: "profile",
		option: <code>profile</code>,
		meaning: (
			<>
				Optionales benanntes Konformitätsziel: <code>'wcag22-aa'</code>,{" "}
				<code>'en301549-v4.1.1'</code>, <code>'en301549-v3.2.1'</code>,{" "}
				<code>'section508'</code> oder das eines Packs. Wählt Regeln über das passende Tag-Set aus, wenn nichts anderes
				welche einschließt, und das WCAG-Ziel ergibt sich aus diesen Tags. Wird als{" "}
				<code>engine.profile</code> zurückgemeldet, wenn es gewirkt hat; andernfalls mit einer
				Konsolenwarnung ignoriert. Siehe <a href="#conformance-profiles">„Konformitätsprofile“</a>{" "}
				oben.
			</>
		),
	},
	{
		id: "mappings",
		option: <code>mappings</code>,
		meaning: (
			<>
				Optionale Normen neben WCAG, deren Anforderungen <code>meta.normativeMappings</code> nennt:{" "}
				<code>'en301549'</code>, <code>'en301549:V3.2.1'</code> oder <code>'en301549:V4.1.1'</code>{" "}
				oder der Schlüssel der Norm eines Packs, als Array oder kommagetrennter String. Standardmäßig keine, sodass Ergebnisse nur WCAG
				nennen; ein EN-301-549-Profil fügt seine eigene Version hinzu. Wird als{" "}
				<code>engine.mappings</code> zurückgemeldet, wenn eine greift. Siehe{" "}
				<a href="#other-standards-mappings">„Andere Normen“</a> oben.
			</>
		),
	},
	{
		id: "logUntestedWcag",
		option: <code>logUntestedWcag</code>,
		meaning: (
			<>
				Standard <code>true</code>. <code>false</code> lässt den Hinweis über{" "}
				<code>console.info</code> weg, der zu einem WCAG-Tag für Version und Stufe erscheint, das
				keine Regel trägt (<code>wcag22a</code>), wenn es in einer Einschlussliste neben anderen
				steht; siehe <a href="#via-runonly-4th-argument">„Über runOnly“</a> oben.
			</>
		),
	},
	{
		id: "optInRules",
		option: <code>optInRules</code>,
		meaning: (
			<>
				Optional: <code>'all'</code> oder eine Liste von Opt-in-Regel-Tags, als Array oder
				kommagetrennter String. Schaltet diese Regeln außerhalb des Profils ihrer Norm frei; die
				übrige Auswahl entscheidet weiterhin, was läuft. Wird als <code>engine.optInRules</code>{" "}
				zurückgemeldet, wenn es eine Regel ausgeführt hat, die die Auswahl sonst nicht ausgeführt
				hätte; unbekannte Tags werden mit einer Konsolenwarnung ignoriert. Siehe{" "}
				<a href="#running-every-rule-optinrules">„Alle Regeln ausführen“</a> oben.
			</>
		),
	},
	{
		id: "messages",
		option: <code>messages</code>,
		meaning: (
			<>
				Optional <code>{"{ [locale]: { key: text } }"}</code>. Wird vor den eigenen Tabellen der
				Engine geprüft und kann so einzelne Strings überschreiben oder eine Sprache liefern, die
				der Build nicht mitbringt. Keys, die Sie weglassen, fallen normal zurück; eine teilweise
				Überschreibung ist also kein Problem. Auf diesem Weg erhält das eigenständige
				Browser-Bundle eine Locale-Zusatzdatei, und es ist die einzige Möglichkeit, ein
				Wörterbuch in einen Seitenkontext zu bringen, da der In-Page-Runner serialisiert wird
				und keine Dateien lesen kann. Anders als die übrigen Optionen wird es nicht im{" "}
				<code>engineOptions</code> jedes Ergebnisses zurückgegeben; <code>engine.locale</code>{" "}
				meldet das verwendete Wörterbuch. Siehe <a href="/configuration/locales/">Locales</a>.
			</>
		),
	},
	{
		id: "includeHiddenElements",
		option: <code>includeHiddenElements</code>,
		meaning: (
			<>
				Standard <code>false</code>: Hilfsabfragen schließen Elemente aus, die durch strukturelle
				oder CSS-Mechanismen verborgen sind, etwa <code>display:none</code>,{" "}
				<code>[hidden]</code>, geschlossene <code>&lt;details&gt;</code> (alles außer ihrem ersten{" "}
				<code>&lt;summary&gt;</code>, in jeder Tiefe), Inhalt mit{" "}
				<code>content-visibility:hidden</code> und <code>hidden="until-found"</code> sowie
				verborgene, nur zum Rendern dienende Host-Elemente (einschließlich ihrer Nachfahren).{" "}
				<code>runa11yCoreAcrossFrames</code> scannt keinen Frame, der auf diese Weise verborgen
				ist. Setzen Sie{" "}
				<code>true</code>, um diese verborgenen bzw. eingeklappten Teilbäume in die Auswertung
				einzubeziehen (Legacy-Verhalten für statisches Markup). Das erweitert, was die
				gemeinsamen Abfragen liefern; die meisten Regeln beurteilen dann trotzdem nur, was im
				Accessibility Tree steht, da ein verborgenes Element weder Namen noch Rolle hat, die sich
				prüfen ließen. Für sie ändert sich also nichts. Wichtig ist es für Regeln zum Markup
				selbst, etwa eine fehlerhafte ID-Referenz.
			</>
		),
	},
	{
		id: "includeShadowDom",
		option: <code>includeShadowDom</code>,
		meaning: (
			<>
				Standard <code>true</code>: Regeln, die <code>helpers.queryAllSmart</code> verwenden,
				steigen in offene Shadow Roots ab. Setzen Sie <code>false</code>, um nur das Light DOM
				zu scannen.{" "}
				<strong>Geschlossene Shadow Roots sind in keinem Fall erreichbar</strong>: Keine DOM-API
				macht sie zugänglich. Bei einem Element, dessen Name von einem Custom Element ohne für die
				Engine lesbaren Inhalt stammen könnte (ein Button, Link, Menüeintrag, eine Option, ein Tab,
				Baumeintrag, summary oder Tooltip), wird nachgefragt (<code>cantTell</code>,{" "}
				<code>name_closedContent</code>), statt es scheitern zu lassen.
			</>
		),
	},
	{
		id: "fragment",
		option: <code>fragment</code>,
		meaning: (
			<>
				Standard <code>false</code>. Einige Regeln prüfen, ob eine Eigenschaft vorhanden ist, die
				es pro echter Seite genau einmal gibt (<code>page-title-present</code>,{" "}
				<code>html-lang-attr-present</code>, <code>html-xml-lang-mismatch</code>,{" "}
				<code>aria-hidden-body</code>, <code>css-orientation-lock</code>,{" "}
				<code>meta-refresh-no-exceptions</code>, <code>meta-refresh-timing-absent</code>,{" "}
				<code>meta-viewport-zoom-enabled</code>, <code>meta-viewport-large</code>,{" "}
				<code>page-title-patterns</code>, <code>region</code>,{" "}
				<code>bypass-blocks-present</code>, <code>landmark-one-main</code>,{" "}
				<code>page-has-heading-one</code>), und melden für diese korrekt{" "}
				<code>notApplicable</code>, sobald <code>contextSelector</code> einen Lauf enger als das
				ganze Dokument eingegrenzt hat (<code>document.documentElement</code> gehört nicht mehr
				zu den aufgelösten Wurzeln), denn von einem eingegrenzten Teilbaum wurde nie erwartet,
				dass er ein eigenes <code>&lt;title&gt;</code>/<code>&lt;html lang&gt;</code>/usw.
				mitbringt. Setzen Sie <code>fragment: true</code> für den Fall, den die Eingrenzung
				allein nicht erkennen kann: ein Scan-Ziel, das das <em>ganze</em> übergebene Dokument
				ist, aber nie eine echte Seite darstellen sollte (z. B. ein für sich allein geparstes
				Komponenten-Snippet). Damit gilt dieselbe <code>notApplicable</code>-Sperre auch ohne
				Eingrenzung.
			</>
		),
	},
	{
		id: "excludeSelectors",
		option: <code>excludeSelectors</code>,
		meaning: (
			<>
				Elemente, auf die einer dieser Selektoren passt (samt ihren Nachfahren, einschließlich
				dessen, was in ihren Shadow Roots liegt, und der Dokumente von Frames darunter), werden
				für <strong>jede</strong> Regel vollständig übersprungen. Nützlich für Cookie-Banner,
				Einbettungen von Drittanbietern oder bekanntermaßen auffällige Widgets, die Sie nicht
				kontrollieren. Um etwas stattdessen nur von einer bestimmten Regel auszuschließen,
				verwenden Sie <code>rules[ruleId].excludeSelectors</code> weiter unten. Ein Array von
				Selektoren oder ein String mit einer Selektorliste:{" "}
				<code>'#cookie-banner, img:not(.a, .b)'</code> ist dasselbe wie{" "}
				<code>['#cookie-banner', 'img:not(.a, .b)']</code>, da der String nur an den Kommas
				zwischen Selektoren getrennt wird. Jeder Selektor gilt für sich: Einer, der kein gültiges
				CSS ist, schließt nichts aus, mit einem <code>console.warn</code>, und die anderen gelten
				weiterhin.
			</>
		),
	},
	{
		id: "timestamp",
		option: <code>timestamp</code>,
		meaning: (
			<>
				Wird unverändert in das Feld <code>timestamp</code> auf oberster Ebene des Ergebnisses
				übernommen; die Engine erzeugt selbst keinen (bewusst deterministisch). Ein Wert, der kein
				String ist (ein <code>Date</code>, eine Zahl), wird mit einem <code>console.warn</code>{" "}
				ignoriert; übergeben Sie <code>new Date().toISOString()</code>.
			</>
		),
	},
	{
		id: "contrast-mode",
		option: <code>contrast.mode</code>,
		meaning: (
			<>
				<code>strictConformance</code> (Standard): Kontrastregeln bleiben stumm (
				<code>notApplicable</code>/Überspringen), sobald sich der tatsächlich gerenderte
				Hintergrund nicht verlässlich berechnen lässt, um falsche <code>fail</code>-Ergebnisse
				zu vermeiden. <code>auditorAssist</code>: gibt einen Teil dieser Sicherheitsmarge
				zugunsten von mehr Befunden auf. Gedacht für Fachleute im Audit, die markierte
				Fälle nachprüfen, nicht für unbeaufsichtigtes Gating in der CI.
			</>
		),
	},
	{
		id: "contrast-fallback",
		option: <code>contrast.rootCanvasFallback</code>,
		meaning: (
			<>
				Die angenommene Hintergrundfarbe der Seite, wenn sie sich überhaupt nicht berechnen
				lässt. Spielt nur im Modus <code>auditorAssist</code> eine Rolle. Eine Seite, die ein
				dunkles Farbschema anfordert (<code>color-scheme: dark</code> an der Wurzel oder die Form
				mit <code>&lt;meta&gt;</code>), wird stattdessen auf der dunklen Fläche gemessen, die der
				Browser dahinter zeichnet; der Fallback gilt dort, wo sich das nicht lesen lässt, etwa in
				jsdom. Er muss eine deckende Farbe sein: Ein anderer Wert wird als Weiß gemessen, mit einer
				Warnung.
			</>
		),
	},
	{
		id: "visibilityMode",
		option: <code>visibilityMode</code>,
		meaning: (
			<>
				Steuert, wie streng die drei Kontrastregeln (<code>contrast-minimum</code>,{" "}
				<code>contrast-enhanced</code>, <code>contrast-computable</code>) entscheiden, ob ein
				Textknoten tatsächlich geprüft werden darf.{" "}
				<strong>Wird von keiner anderen Regel gelesen.</strong> Nicht gesetzt (der Standard), ist
				es <code>'styleAndGeometry'</code>, wo die Seite ein Layout hat, also bei jedem Scan im
				Browser, und <code>'styleOnly'</code>, wo sie keines hat (jsdom): Lesende sehen nur Text,
				der irgendwo sichtbar gezeichnet wird, und das kann nur das Layout feststellen.{" "}
				<code>'styleOnly'</code>: Die Eignung hängt nur von CSS ab, also <code>display</code>,{" "}
				<code>visibility</code>, <code>opacity</code>, Verbergen durch Vorfahren usw.{" "}
				<code>'styleAndGeometry'</code>: ergänzt das um echte Layout-Prüfungen (
				<code>getClientRects()</code>/<code>getBoundingClientRect()</code>); Text ohne Client
				Rects oder mit Breite/Höhe null wird ebenfalls ausgeschlossen, ebenso Text, der ganz
				oberhalb oder links der Seite liegt, wo kein Scrollen hinkommt (die Technik{" "}
				<code>left: -9999px</code>), und Text, den ein Vorfahr mit{" "}
				<code>overflow: hidden</code> oder <code>clip</code> vollständig abschneidet (
				<code>height: 0; overflow: hidden</code>, eine nicht sichtbare Karussell-Folie). Eine
				scrollbare Box (<code>auto</code>, <code>scroll</code>) schließt ihren Text nicht aus,
				da Lesende ihn erreichen können. Die Optionen eines <code>&lt;select&gt;</code> werden nach
				der Position ihres <code>&lt;select&gt;</code> auf der Seite beurteilt. In beiden Modi wird Text mit Schriftgröße 0 oder
				vollständig transparenter Farbe ausgeschlossen, da nichts gezeichnet wird; transparenter
				Text, durch dessen Glyphen ein Hintergrund scheint (<code>background-clip: text</code>),
				wird nicht ausgeschlossen, sondern als Frage gemeldet. Setzen Sie im Browser{" "}
				<code>'styleOnly'</code>, um Text allein anhand der berechneten Styles zu prüfen, wie es
				frühere Releases taten. Unter reinem jsdom (<code>runDomRulesInPage</code>) gibt es keine echte Layout-Engine, dort
				fügt <code>'styleAndGeometry'</code> im Wesentlichen nur Nullgrößen-Prüfungen über{" "}
				<code>getBoundingClientRect()</code> hinzu, keine echte Erkennung von Clipping oder
				Overflow. Siehe <a href="/help/known-limitations/">bekannte Einschränkungen</a>.
			</>
		),
	},
	{
		id: "policyContract",
		option: <code>policyContract</code> ,
		meaning: (
			<>
				Siehe <a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a>. Steuert, welche
				Ergebnis- und Konfidenzwerte zulässig sind und ob ein <code>fail</code>, das eine
				manuelle Regel ergeben würde, zu <code>cantTell</code> umgewandelt wird.
			</>
		),
	},
	{
		id: "output",
		option: (
			<>
				<code>output.includeSelector</code> / <code>.includeHtml</code>
			</>
		),
		meaning: (
			<>
				Unterdrückt das automatische Ausfüllen von <code>selector</code>/<code>html</code> durch
				die Engine. Seit alle Regeln darauf umgestellt wurden, ihr Element zu melden, statt
				Vorkommen von Hand zu bauen (1.5.0), nehmen fast alle Regeln diesen
				Weg: <code>includeSelector: false</code> / <code>includeHtml: false</code> entfernt
				Selektoren und HTML-Snippets aus nahezu jeder Regel. Einige wenige setzen diese
				Felder weiterhin selbst in <code>runInPage</code> zusammen und sind davon nicht
				betroffen, darunter <code>contrast-minimum</code>/<code>contrast-enhanced</code> (deren
				Befunde Textabschnitte sind, keine Elemente), <code>page-title-present</code> und{" "}
				<code>identical-links-same-purpose</code>.{" "}
				<strong>Die Ausgabe wird dadurch also deutlich schlanker, es ist aber keine Garantie,
				dass das Ergebnis <em>keinerlei</em> Selektoren oder HTML enthält.</strong>
			</>
		),
	},
	{
		id: "output-detail",
		option: <code>output.detail</code>,
		meaning: (
			<>
				<code>'full'</code> (Standard) oder <code>'findings'</code>: ein kleineres Ergebnis, das nur
				die Prüfergebnisse vollständig behält, die etwas melden (<code>fail</code>,{" "}
				<code>cantTell</code> und alle, die Vorkommen auflisten); jedes andere <code>pass</code> und{" "}
				<code>notApplicable</code> behält seine <code>ruleId</code>, sein <code>outcome</code> und
				seinen <code>type</code> sowie seine <code>margin</code> oder seinen <code>error</code>,
				falls vorhanden. Zusammenfassungen und Urteile bleiben unverändert, und die Reporter lesen
				es als vollständiges Ergebnis. Eine Regel, die der Katalog von core nicht wieder ergänzen
				könnte, bleibt vollständig: jede Regel eines Scans mit <code>packs</code>, eine eigene
				Regel und eine, die die <code>messages</code> des Scans umformulieren. Siehe{" "}
				<a href="/results-reports/output-schema/#top-level-result"><code>engine.outputDetail</code></a>;
				in TypeScript ist ein solches Ergebnis ein <code>CompactScanResult</code>.
			</>
		),
	},
	{
		id: "rules-ruleId",
		option: <code>rules[ruleId]</code>,
		meaning: (
			<>
				Wird als <code>ctx.config</code> an die jeweilige Regel durchgereicht und, speziell für{" "}
				<code>excludeSelectors</code>, von der Engine selbst gelesen, bevor die Regel überhaupt
				läuft. Siehe{" "}
				<a href="#rule-scoped-excludeselectors">„<code>excludeSelectors</code> pro Regel“</a>{" "}
				unten. Jeder andere Key wird nur durchgereicht:{" "}
				<strong>Keine ausgelieferte Regel entnimmt daraus etwas anderes.</strong> Die
				deklarierten Einstellungen einer Regel, etwa die Schwellenwerte von{" "}
				<code>contrast-minimum</code>, gehören zu ihrer Norm, daher wird ein vom Aufrufer
				übergebener Wert verworfen: Ein Ergebnis, das WCAG 1.4.3 nennt, wird immer bei 4,5:1
				entschieden. Eine Norm mit anderen Schwellenwerten hat eine eigene Regel, eine Variante,
				die ein <a href="/configuration/packs/">Pack</a> mitbringen kann. Ein Schlüssel wird wie
				eine Regel-ID abgeglichen, unabhängig von Groß- und Kleinschreibung oder mit dem alten
				Präfix <code>a11ycore-</code>; zu einem, der keine Regel des Scans nennt, gibt es eine
				Warnung mit der nächstliegenden ID.
			</>
		),
	},
	{
		id: "packs",
		option: <code>packs</code>,
		meaning: (
			<>
				Optionale Packs aus <code>@surea11y/core/pack</code>: Regeln, Varianten der Regeln von
				core, eine Norm oder eine Checkliste und Meldungen von außerhalb von core, die dem Scan
				beitreten. Eine Liste: die Pack-Objekte für <code>runDomRulesInPage</code> und die
				Katalogfunktionen in Node, und für <code>runa11yCoreInPage</code> das{" "}
				<code>name@version</code> von Packs, die ein <code>packScript</code> in der Seite
				registriert hat. Alles andere führt kein Pack aus, mit einer Warnung, und wirft unter{" "}
				<code>strictOptions</code> einen Fehler. Wird als <code>engine.packs</code>{" "}
				zurückgemeldet. Siehe <a href="/configuration/packs/">Packs</a>.
			</>
		),
	},
	{
		id: "probes",
		option: <code>probes</code>,
		meaning: (
			<>
				Ein optionales, JSON-sicheres Evidenzobjekt, das Ihre Host-Anwendung liefert, für das, was
				der Scan einer einzelnen Seite nicht sehen kann, etwa die anderen Seiten der Website. Die
				Engine begrenzt es, bevor Regeln es lesen (<code>ctx.inputs.probes</code>): sechs Ebenen
				tief, 200 Einträge pro Array, 50 Schlüssel pro Objekt, 2.000 Zeichen pro String.{" "}
				<code>page-title-patterns</code> liest <code>crawl.pageTitles</code> (
				<code>{"{ pages: [{ url, title }] }"}</code>), um websiteweit nach generischen und aus
				Vorlagen stammenden Titeln zu suchen. Die Regeln eines Packs können eigene Probes lesen,
				die das Pack dokumentiert.
			</>
		),
	},
	{
		id: "perfStats",
		option: (
			<>
				<code>perfStats</code> / <code>profileRules</code>
			</>
		),
		meaning: (
			<>
				Nur zum Debuggen. <code>perfStats: true</code> liefert interne Zähler im Feld{" "}
				<code>perfStats</code> des Ergebnisses; <code>profileRules: true</code> fügt dort{" "}
				<strong>zusätzlich</strong> eine Aufschlüsselung der Laufzeit pro Regel hinzu.{" "}
				<code>profileRules</code> allein bewirkt nichts: Erst <code>perfStats</code> erzeugt das
				Objekt, in dem die Aufschlüsselung steht.{" "}
				<strong>Die Struktur ist nicht Teil des stabilen Ausgabevertrags; bauen Sie nicht darauf
				auf.</strong> Beachten Sie außerdem, dass <code>profileRules</code> die einzige Option
				ist, die die Ausgabe nicht deterministisch macht: Die Zähler sind über identische Läufe
				hinweg stabil, die gemessenen Zeiten nicht. Lassen Sie sie aus, wenn Sie Ergebnisse
				zwischen Läufen per Diff vergleichen. Mit <code>profileRules</code> werden die gemeinsamen
				Caches (berechnete Styles und die Eignung für den Accessibility Tree) vor der ersten Regel
				gefüllt und getrennt als <code>perfStats.warmUpMs</code> gemessen, sodass ihre Kosten nicht
				der Regel angerechnet werden, die die Seite zuerst durchläuft.
			</>
		),
	},
	{
		id: "frameWaitTime",
		option: (
			<>
				<code>pingWaitTime</code> / <code>frameWaitTime</code>
			</>
		),
		meaning: (
			<>
				Wird nur von <code>runa11yCoreAcrossFrames</code> gelesen (siehe{" "}
				<a href={`${core}/docs/INTEGRATION.md#cross-frame-scanning-including-cross-origin`}>
					<code>INTEGRATION.md</code>
				</a>
				): wie lange auf die Antwort eines Child-Frames auf einen Ping (Standard{" "}
				<code>500</code> ms) und auf eine vollständige Laufanfrage (Standard <code>60000</code>{" "}
				ms) gewartet wird, bevor er als nicht erreichbar gilt. Von{" "}
				<code>runDomRulesInPage</code>/<code>runa11yCoreInPage</code> ignoriert.
			</>
		),
	},
];

export function EngineOptionsContent() {
	return (
		<>
			<p>
				Jeder Runner (<code>runDomRulesInPage</code>, <code>runa11yCoreInPage</code>) nimmt
				dieselben vier Argumente entgegen: <code>(pageUrl, contextSelector, engineOptions, runOnly)</code>.
				Diese Seite dokumentiert <code>engineOptions</code> und <code>runOnly</code> vollständig.
				Um eine Seite gegen eine WCAG-Version und -Stufe zu prüfen, beginnen Sie mit{" "}
				<a href="#selecting-by-wcag-target-runonlywcag"><code>runOnly.wcag</code></a>.
			</p>

			<h2 id="selecting-which-rules-run">Auswählen, welche Regeln laufen</h2>
			<p>
				Nennen Sie, wogegen Sie prüfen, und die Engine wählt die Regeln. Ohne Auswahl laufen die
				Standardregeln: jede Regel außer den Opt-in-Regeln einer Norm oder eines Packs, die erst
				laufen, wenn sie freigeschaltet sind (siehe <a href="#opt-in-rules">Opt-in-Regeln</a>).
			</p>
			<DataTable
				label="Auswählen, was läuft"
				rowKey="id"
				columns={[
					{ key: "run", label: "Um auszuführen", wrap: true },
					{ key: "pass", label: "Übergeben Sie", wrap: true },
				]}
				rows={[
					{ id: "all", run: "Die Standardregeln: jede Regel außer nicht freigeschalteten Opt-in-Regeln", pass: <>nichts: <code>runOnly</code> <code>null</code></> },
					{
						id: "wcag",
						run: "Ein WCAG-Konformitätsziel: die Regeln für die Kriterien einer Version auf einer Stufe und darunter",
						pass: <code>{"runOnly: { wcag: { version: '2.2', level: 'AA' } }"}</code>,
					},
					{
						id: "wcag-bp",
						run: "Dasselbe, und die Best-Practice-Regeln, die kein WCAG-Kriterium prüfen",
						pass: <code>{"runOnly: { wcag: { version: '2.2', level: 'AA' }, bestPractices: true }"}</code>,
					},
					{ id: "bp", run: "Nur die Best-Practice-Regeln", pass: <code>{"runOnly: { bestPractices: true }"}</code> },
					{
						id: "profile",
						run: "Eine auf WCAG aufbauende Norm (EN 301 549, Section 508)",
						pass: <code>{"engineOptions: { profile: 'en301549-v4.1.1' }"}</code>,
					},
					{
						id: "profile-bp",
						run: "Dasselbe, und die Best-Practice-Regeln",
						pass: (
							<>
								<code>{"engineOptions: { profile: 'en301549-v4.1.1' }"}</code>,{" "}
								<code>{"runOnly: { bestPractices: true }"}</code>
							</>
						),
					},
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.2 AA, with the best practices:",
					"runDomRulesInPage(url, null, {}, {",
					"  wcag: { version: '2.2', level: 'AA' },",
					"  bestPractices: true",
					"});",
				]}
			/>
			<p>
				Jede Regel prüft entweder WCAG-Kriterien oder ist eine Best Practice, daher führt{" "}
				<code>{"{ wcag: { version: '2.2', level: 'AAA' }, bestPractices: true }"}</code> jede Regel
				aus außer denen für 4.1.1 Syntaxanalyse, das WCAG 2.2 entfernt hat. Für alles Feinere, etwa
				ein einzelnes Kriterium, eine Liste von Regeln oder einen Ausschluss, siehe{" "}
				<a href="#advanced-selection-tags-and-rule-ids">„Erweiterte Auswahl: Tags und Regel-IDs“</a>;
				diese Felder lassen sich mit den obigen kombinieren.
			</p>

			<h3 id="selecting-by-wcag-target-runonlywcag">Auswahl nach WCAG-Ziel (<code>runOnly.wcag</code>)</h3>
			<p>
				<code>runOnly.wcag</code> nennt eine WCAG-Version und eine Konformitätsstufe und wählt die
				Regeln für die Kriterien dieses Ziels aus:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.2 Level A and AA:",
					"runDomRulesInPage(url, null, {}, { wcag: { version: '2.2', level: 'AA' } });",
				]}
			/>
			<ul>
				<li>
					<code>version</code> ist <code>'2.0'</code>, <code>'2.1'</code> oder <code>'2.2'</code>;{" "}
					<code>level</code> ist <code>'A'</code>, <code>'AA'</code> oder <code>'AAA'</code>{" "}
					(unabhängig von Groß- und Kleinschreibung).
				</li>
				<li>
					Eine Regel wird ausgewählt, wenn eines der Kriterien, die sie nennt, zum Ziel gehört: in
					dieser Version gültig (in ihr oder davor eingeführt und weder in ihr noch davor entfernt),
					auf der Stufe des Ziels oder darunter, nach der Stufe, die das Kriterium{" "}
					<strong>in dieser Version</strong> hat. Die Stufen stammen aus{" "}
					<code>WCAG_CRITERIA</code> in <code>@surea11y/core/wcag</code>, das eine Stufe pro Version
					enthält.
				</li>
				<li>
					4.1.1 Syntaxanalyse, das 2.2 entfernt hat, gehört also zu Zielen mit{" "}
					<code>{"{ version: '2.1' }"}</code>, nicht aber zu solchen mit{" "}
					<code>{"{ version: '2.2' }"}</code>: <code>duplicate-id</code> läuft beim ersten und nicht
					beim zweiten, wo die Versions-Tags es ausführen würden.
				</li>
				<li>
					Eine Regel, die kein Kriterium nennt (eine Best-Practice-Regel), gehört zu keinem Ziel.
					Ergänzen Sie diese mit <code>bestPractices: true</code> (nächster Abschnitt) oder einzelne
					Regeln mit <code>tags</code> oder <code>includeRuleIds</code>: Neben <code>wcag</code>{" "}
					wählen sie alle <strong>zusätzlich</strong> Regeln aus, die Vereinigung aus den Regeln des
					Ziels und dem, was die anderen auswählen. <code>excludeTags</code>,{" "}
					<code>excludeRuleIds</code> und <code>excludeTestIds</code> wirken wie immer danach.
				</li>
				<li>
					Die Version des Ziels ist das WCAG-Ziel des Laufs (<code>engine.wcagVersion</code>), sofern{" "}
					<code>engineOptions.wcagVersion</code> nicht gesetzt ist; seine Stufe entscheidet, welche
					WCAG-Zusammenfassungen gemeldet werden, wie es ein Stufen-Tag tut.
				</li>
				<li>
					Ein Ziel schließt Regeln ein, wählt sie also anstelle von{" "}
					<code>engineOptions.profile</code> aus, wie es <code>tags</code> tun.{" "}
					<code>getProfileWcagTarget(profile)</code> liefert das Ziel, auf das ein Profil
					hinausläuft (siehe <a href="#conformance-profiles">„Konformitätsprofile“</a>), und{" "}
					<code>getChecksForRunOnly(runOnly, engineOptions)</code> listet die Regeln, die ein{" "}
					<code>runOnly</code> mit <code>wcag</code> ausführt.
				</li>
				<li>
					Alles andere wirft <code>INVALID_RUN_ONLY</code> und nennt, was falsch ist:{" "}
					<code>runOnly.wcag.version must be "2.0", "2.1" or "2.2", not "3.0".</code>
				</li>
			</ul>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.1 AA, plus the best-practice rules, without one of them:",
					"{ wcag: { version: '2.1', level: 'AA' }, tags: ['best-practice'], excludeRuleIds: ['region'] }",
				]}
			/>

			<h3 id="adding-the-best-practices-runonlybestpractices">Best Practices ergänzen (<code>runOnly.bestPractices</code>)</h3>
			<p>
				<code>bestPractices: true</code> wählt die Best-Practice-Regeln aus: die Regeln, die kein
				WCAG-Kriterium nennen, etwa <code>region</code>, <code>landmark-one-main</code>,{" "}
				<code>heading-order</code>, <code>page-has-heading-one</code>, <code>skip-link</code>,{" "}
				<code>tabindex</code> und <code>image-redundant-alt</code>. Es sind die Regeln mit dem Tag{" "}
				<code>best-practice</code>, daher ist es dasselbe, wie dieses Tag hinzuzufügen. Ein Befund
				einer dieser Regeln ist gute Praxis, kein WCAG-Verstoß: Keine WCAG-Zusammenfassung zählt ihn.
			</p>
			<ul>
				<li>
					Neben <code>wcag</code>, <code>tags</code> oder Regel-IDs fügt es diese Regeln dem hinzu,
					was jene auswählen; Ausschlüsse wirken danach, daher lässt{" "}
					<code>excludeRuleIds: ['region']</code> <code>region</code> weiterhin weg.
				</li>
				<li>Allein angegeben wählt es nur die Best-Practice-Regeln aus.</li>
				<li>
					<code>false</code> oder das Weglassen fügt nichts hinzu. Allein ist{" "}
					<code>{"{ bestPractices: false }"}</code> eine leere Auswahl, daher laufen die
					Standardregeln, wie bei <code>{"{}"}</code>.
				</li>
				<li>
					Jeder andere Wert wirft <code>INVALID_RUN_ONLY</code>:{" "}
					<code>runOnly.bestPractices must be true or false, not "yes".</code>
				</li>
				<li>
					Neben <code>engineOptions.profile</code> fügt es die Best-Practice-Regeln denen des Profils
					hinzu, und das Profil gilt weiterhin: seine Regeln, seine Zusammenfassungen, seine
					Zuordnungen und <code>engine.profile</code>, wie ohne die Option.{" "}
					<code>{"{ bestPractices: true }"}</code> mit <code>profile: 'en301549-v4.1.1'</code> führt
					diese Norm und die Best Practices aus. Die Best-Practice-Regeln zählen in keiner der
					Zusammenfassungen des Profils, da sie kein WCAG-Kriterium prüfen.
				</li>
			</ul>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.1 AA and the best practices, without one of them:",
					"{ wcag: { version: '2.1', level: 'AA' }, bestPractices: true, excludeRuleIds: ['region'] }",
				]}
			/>

			<h3 id="conformance-profiles">Konformitätsprofile</h3>
			<p>
				<code>engineOptions.profile</code> benennt ein Konformitätsziel, statt dessen Tag-Set
				auszuschreiben:
			</p>
			<DataTable
				label="Konformitätsprofile"
				rowKey="profile"
				columns={[
					{ key: "profile", label: "Profil", width: "20%" },
					{ key: "tags", label: "Führt die Regeln mit den Tags aus", wrap: true },
					{ key: "target", label: "WCAG-Ziel", width: "12%" },
					{ key: "wcagTarget", label: "getProfileWcagTarget", wrap: true },
					{ key: "why", label: "Warum", wrap: true },
				]}
				rows={[
					{
						profile: <code>wcag22-aa</code>,
						tags: (
							<>
								<code>wcag2a</code>, <code>wcag2aa</code>, <code>wcag21a</code>, <code>wcag21aa</code>,{" "}
								<code>wcag22a</code>, <code>wcag22aa</code>
							</>
						),
						target: "2.2",
						wcagTarget: <code>{"{ version: '2.2', level: 'AA' }"}</code>,
						why: "WCAG 2.2 Stufe A und AA",
					},
					{
						profile: <code>en301549-v4.1.1</code>,
						tags: (
							<>
								wie <code>wcag22-aa</code>
							</>
						),
						target: "2.2",
						wcagTarget: <code>{"{ version: '2.2', level: 'AA' }"}</code>,
						why: "Kapitel 9 der EN 301 549 V4.1.1 gibt WCAG 2.2 A und AA wieder",
					},
					{
						profile: <code>en301549-v3.2.1</code>,
						tags: (
							<>
								<code>wcag2a</code>, <code>wcag2aa</code>, <code>wcag21a</code>, <code>wcag21aa</code>
							</>
						),
						target: "2.1",
						wcagTarget: <code>{"{ version: '2.1', level: 'AA' }"}</code>,
						why: "Kapitel 9 der EN 301 549 V3.2.1 gibt WCAG 2.1 A und AA wieder, einschließlich 4.1.1 Syntaxanalyse",
					},
					{
						profile: <code>section508</code>,
						tags: (
							<>
								<code>wcag2a</code>, <code>wcag2aa</code>
							</>
						),
						target: "2.0",
						wcagTarget: <code>{"{ version: '2.0', level: 'AA' }"}</code>,
						why: "Die überarbeiteten Section-508-Standards übernehmen WCAG 2.0 A und AA",
					},
				]}
			/>
			<p>
				<code>getProfileWcagTarget(profile)</code> liefert das <code>runOnly.wcag</code>-Ziel, auf
				das das Tag-Set eines Profils hinausläuft, oder <code>null</code> für einen Namen, der kein
				Profil ist. Ein Profil wählt weiterhin über seine Tags aus, wie in der Tabelle: Unter{" "}
				<code>wcag22-aa</code> läuft <code>duplicate-id</code> (4.1.1) und kann kein{" "}
				<code>fail</code> ergeben, während{" "}
				<code>{"{ wcag: getProfileWcagTarget('wcag22-aa') }"}</code> die Regel weglässt.
			</p>
			<CodeBlock lang="js" lines={["runDomRulesInPage(url, null, { profile: 'en301549-v3.2.1' }, null);"]} />
			<p>
				Die Norm oder Checkliste eines <a href="/configuration/packs/">Packs</a> bringt eigene
				Profile in diese Liste ein.
			</p>
			<p>
				Das WCAG-Ziel ergibt sich aus den Tags wie bei einem von Hand geschriebenen Set (siehe{" "}
				<a href="#filtering-by-wcag-version">„Filtern nach WCAG-Version“</a> unten), daher kann eine
				doppelte id unter <code>en301549-v3.2.1</code> noch <code>fail</code> ergeben, unter{" "}
				<code>en301549-v4.1.1</code> nicht. Bei Namen spielt Groß- und Kleinschreibung keine Rolle.
				Ein Lauf, der ein Profil verwendet hat, meldet es als <code>engine.profile</code> zurück.
			</p>
			<p>
				Vorrang: Alles, was Regeln <em>einschließt</em>, wählt sie anstelle des Profils aus — ein{" "}
				<code>runOnly</code> mit <code>wcag</code>, <code>tags</code>, <code>includeRuleIds</code>{" "}
				oder{" "}
				<code>includeTestIds</code> oder ein <code>include</code> in{" "}
				<code>engineOptions.rules</code>/<code>.tags</code>/<code>.tests</code>. Ausschlüsse gelten
				weiterhin zusätzlich zum Profil, ob sie aus <code>runOnly</code> stammen (
				<code>excludeTags</code>, <code>excludeRuleIds</code>, <code>excludeTestIds</code>, sodass
				das <code>disableTags()</code> eines Bindings das Profil einschränkt, statt es zu ersetzen)
				oder, ohne <code>runOnly</code>-Filter, aus <code>engineOptions</code> (
				<code>tags.exclude</code>, <code>rules.exclude</code>, <code>tests.exclude</code>), und ein
				explizites <code>engineOptions.wcagVersion</code> hat weiterhin Vorrang vor der Version, die
				das Profil impliziert. Ein Profil ohne Wirkung — ein unbekannter Name oder eines, das wie oben
				übersteuert wird — ist kein Fehler: Der Lauf geht weiter, als wäre keines angegeben, schreibt
				ein <code>console.warn</code> mit dem Grund und enthält kein <code>engine.profile</code>.{" "}
				<code>runOnly.bestPractices: true</code> ist kein solches Einschließen: Es fügt die
				Best-Practice-Regeln denen des Profils hinzu, und das Profil gilt (
				<a href="#adding-the-best-practices-runonlybestpractices">„Best Practices ergänzen“</a>).
			</p>
			<p>
				Das Profil einer Norm kann auch Regeln weglassen, wenn seine Norm auf ein WCAG-Kriterium
				verzichtet oder eine WCAG-Prüfung durch eine eigene ersetzt: Diese Regeln und ihre
				WCAG-Zusammenfassungen laufen nicht, der Regelkatalog lässt sie ebenfalls weg, und{" "}
				<code>engine.profileExcludes</code> nennt, was weggelassen wurde. Derzeit schließt kein
				eingebautes Profil etwas aus.
			</p>
			<p>
				<strong>Ein Profil wählt nur aus, welche Regeln laufen.</strong> Es sagt nichts darüber aus,
				ob das Bestehen dieser Regeln die namensgebende Norm erfüllt: Die meisten Erfolgskriterien
				erfordern menschliches Urteil, das keine automatisierte Regel abdeckt (siehe{" "}
				<a href="/conformance/wcag-mapping/#what-this-engine-cannot-tell-you">
					was diese Engine nicht aussagen kann
				</a>
				).
			</p>
			<p>
				Ein EN-301-549-Profil schaltet außerdem die EN-301-549-Klauseln der angepeilten Version ein,
				als wäre <code>mappings: ['en301549:V4.1.1']</code> (oder <code>V3.2.1</code>) übergeben
				worden; siehe <a href="#other-standards-mappings">„Andere Normen“</a> unten. Das Profil
				jeder Norm schaltet auf dieselbe Weise seine eigene Version ein. Ein Profil mit{" "}
				<code>mappedRules</code> führt außerdem, unabhängig von ihren Tags, die Regeln aus, denen
				seine Norm zugeordnet ist: Die ohne WCAG-Zuordnung, etwa <code>heading-order</code> und{" "}
				<code>skip-link</code>, haben kein WCAG-Tag, über das sie ausgewählt werden könnten. Eine
				Norm mit eigenen Anforderungen oder die Checkliste einer Organisation kommt als{" "}
				<a href="/configuration/packs/">Pack</a> in die Engine und bringt eigene Profilnamen, Regeln
				und Zusammenfassungen mit. Die Engine selbst liefert keine solche Norm mit.
			</p>

			<h3 id="opt-in-rules">Opt-in-Regeln</h3>
			<p>
				Manche Regeln prüfen eigene Anforderungen einer Norm, die WCAG nicht stellt: Eine nationale
				Norm verlangt vielleicht einen Doctype oder verbietet präsentationale Attribute wie{" "}
				<code>bgcolor</code>. Ein <code>fail</code> einer solchen Regel ist ein Verstoß gegen diese
				Norm, nicht gegen WCAG, daher sind diese Regeln <strong>standardmäßig aus</strong>. Jede trägt
				das Regel-Tag ihrer Norm und läuft nur, wenn die Auswahl sie anfordert:
			</p>
			<ul>
				<li>über das Profil der Norm, das das Tag enthält,</li>
				<li>
					über dieses Tag (<code>{"tags: { include: '<tag>' }"}</code>, allein oder mit anderen),
				</li>
				<li>
					über ihre id (<code>{"rules: { include: '<rule id>' }"}</code> oder{" "}
					<code>runOnly.includeRuleIds</code>),
				</li>
				<li>
					über die id einer eigenen Zusammenfassung ihrer Norm, die sie gruppiert (
					<code>{"rules: { include: '<rollup id>' }"}</code> führt die Regeln dieser
					Zusammenfassung aus, ob Opt-in oder nicht), oder
				</li>
				<li>
					indem sie mit <code>engineOptions.optInRules</code> freigeschaltet wird, siehe unten.
				</li>
			</ul>
			<p>
				Nichts anderes wählt sie aus: kein Standardlauf, kein WCAG-Tag-Set, kein WCAG- oder
				EN-301-549-Profil, keine WCAG-Zusammenfassungs-id. Ausschlüsse gelten für sie wie für jede
				Regel. Wird nur das Tag ausgewählt, laufen die eigenen Regeln dieser Norm, nicht die
				WCAG-Regeln, denen sie ebenfalls zugeordnet ist; das beantwortet „was verlangt die Norm über
				WCAG hinaus“ und ist keine Prüfung gegen sie. Für eine Prüfung verwenden Sie das Profil der
				Norm: Unter einem Tag allein melden ihre eigenen Zusammenfassungen <code>cantTell</code>{" "}
				für jede Anforderung, deren Regeln nicht gelaufen sind. Eine über <code>customRules</code>{" "}
				hinzugefügte Regel, die das Tag trägt, unterliegt derselben Sperre. Keine der eingebauten
				Normen der Engine hat derzeit Opt-in-Regeln; das Namensraum-Tag eines Packs funktioniert auf
				diese Weise.
			</p>

			<h3 id="running-every-rule-optinrules">Alle Regeln ausführen (<code>optInRules</code>)</h3>
			<p>
				Um jede Regel der Engine auszuführen, gleich zu welcher Norm sie gehört, lassen Sie das
				Profil weg und schalten die Opt-in-Regeln frei:
			</p>
			<CodeBlock lang="js" lines={["runDomRulesInPage(url, null, { optInRules: 'all' }, null);"]} />
			<p>
				<code>'all'</code> schaltet die Opt-in-Regeln aller Normen frei; eine Liste von Tags nur
				diese. Die Option hebt die Sperre auf und sonst nichts: Die übrige Auswahl entscheidet
				weiterhin, welche Regeln laufen. Ohne Filter und ohne Profil wie oben deckt der Lauf also
				jede Regel und die Zusammenfassungen aller Normen ab; unter{" "}
				<code>profile: 'wcag22-aa'</code> laufen weiterhin nur die WCAG-Regeln, da Opt-in-Regeln
				kein WCAG-Tag tragen. Ausschlüsse gelten wie üblich. Ein Tag, das kein Opt-in-Tag ist, wird
				mit einem <code>console.warn</code> ignoriert.
			</p>
			<p>
				Das ist dafür gedacht, alles zu sehen, was die Engine melden kann, während der Entwicklung
				oder beim Erkunden einer Website. <strong>Es ist kein Konformitätsziel</strong>: Ein solcher
				Lauf lässt eine Seite an Dingen scheitern, die WCAG erlaubt und nur eine andere Norm
				verbietet. Das Ergebnis weist darauf hin: <code>engine.optInRules</code> listet die Tags,
				deren Regeln gelaufen sind, und HTML-Bericht, SARIF und JUnit zeigen es neben dem Profil.
				Es fügt den Ergebnissen keine Nummern anderer Normen hinzu; übergeben Sie dafür{" "}
				<code>mappings</code>, zum Beispiel{" "}
				<code>{"{ optInRules: 'all', mappings: ['<key>'] }"}</code>.
			</p>

			<h3 id="other-standards-mappings">Andere Normen (<code>mappings</code>)</h3>
			<p>
				Das <code>meta.normativeMappings</code> jedes Ergebnisses nennt die WCAG-Erfolgskriterien,
				die es prüft. <code>engineOptions.mappings</code> fügt die entsprechende Anforderung einer
				anderen Norm zu jedem hinzu. Standardmäßig fügt es keine hinzu: Eine Klausel einer Norm,
				gegen die Sie nicht prüfen, ist Rauschen in jedem SARIF-Tag, jeder JUnit-Eigenschaft und
				jedem Bericht.
			</p>
			<DataTable
				label="Werte von mappings"
				rowKey="value"
				columns={[
					{ key: "value", label: "Wert", width: "34%" },
					{ key: "adds", label: "Fügt hinzu", wrap: true },
				]}
				rows={[
					{
						value: <code>'en301549'</code>,
						adds: "Die Klausel aus Kapitel 9 der EN 301 549 für jedes Kriterium, in jeder Version, die sie enthält (V3.2.1 und V4.1.1)",
					},
					{
						value: (
							<>
								<code>'en301549:V3.2.1'</code>, <code>'en301549:V4.1.1'</code>
							</>
						),
						adds: "Dasselbe, nur für diese Version",
					},
				]}
			/>
			<CodeBlock lang="js" lines={["runDomRulesInPage(url, null, { mappings: ['en301549:V3.2.1'] }, null);"]} />
			<p>
				Die Option nimmt ein Array oder einen kommagetrennten String; bei Namen und Versionen spielt
				Groß- und Kleinschreibung keine Rolle. Unter <code>profile: 'en301549-v4.1.1'</code> sind die
				V4.1.1-Klauseln ohne Anforderung vorhanden, und <code>mappings</code> kann weitere
				hinzufügen. Ein Name oder eine Version ohne Tabelle in der Engine wird mit einem{" "}
				<code>console.warn</code> ignoriert. Ein Lauf, der eine andere Norm enthält, meldet welche in{" "}
				<code>engine.mappings</code>, in kanonischer Schreibweise (<code>["en301549:V3.2.1"]</code>{" "}
				oder <code>["en301549"]</code> für alle Versionen).
			</p>
			<p>
				Sie ändert nur, was ein Ergebnis nennt, nie welche Regeln laufen oder ihre Ergebnisse. Der
				Regelkatalog folgt derselben Option: <code>getChecksCatalog(engineOptions)</code>,{" "}
				<code>getCheckDefById(ruleId, engineOptions)</code>,{" "}
				<code>getChecksForRunOnly(runOnly, engineOptions)</code>,{" "}
				<code>getRulesCatalog(engineOptions)</code> und{" "}
				<code>getCompositeRuleById(id, engineOptions)</code> nennen die Normen, die ein Scan mit
				diesen Optionen nennen würde, ein Profil eingeschlossen, wenn es greifen würde, sodass
				Katalogeintrag und Ergebnis immer übereinstimmen. Ohne Optionen nennen sie nur WCAG. Eine
				über <code>customRules</code> hinzugefügte Regel behält genau die Zuordnungen, die sie
				deklariert. Was die Klauseln sind und wie sich die beiden Versionen unterscheiden, steht unter{" "}
				<a href="/conformance/wcag-mapping/#en-301-549">WCAG-Konformitätszuordnung</a>.
			</p>

			<h2 id="advanced-selection-tags-and-rule-ids">Erweiterte Auswahl: Tags und Regel-IDs</h2>
			<p>
				Die folgenden Felder wählen nach den Tags aus, die Regeln tragen, und nach Regel-IDs.
				Greifen Sie zu ihnen für das, was ein WCAG-Ziel und <code>bestPractices</code> nicht
				ausdrücken: ein einzelnes Kriterium (<code>tags: ['wcag1412']</code>), eine Liste von
				Regeln, einen Ausschluss oder ein Tag-Set, das aus einem anderen Tool übernommen wurde. Sie
				lassen sich mit <code>wcag</code> und <code>bestPractices</code> kombinieren: Was sie
				einschließen, kommt zu dem hinzu, was jene auswählen, und was sie ausschließen, wird danach
				abgezogen.
			</p>
			<p>
				Es gibt <strong>zwei voneinander unabhängige Wege</strong>, sie anzugeben: das
				4. Argument (<code>runOnly</code>) oder <code>engineOptions.rules</code>/
				<code>.tags</code>/<code>.tests</code>/<code>.includeMode</code>. Enthält{" "}
				<code>runOnly</code> irgendeinen Filter, gewinnt es vollständig; andernfalls greift die
				Engine auf <code>engineOptions</code> zurück.{" "}
				<strong>Mischen Sie beide nicht in der Erwartung, dass beide gelten. Entscheiden Sie
				sich für einen.</strong> <code>engineOptions.rules</code>, <code>.tags</code> und{" "}
				<code>.tests</code> nehmen <code>{"{ include, exclude }"}</code> an; eine einfache Liste
				oder ein String ist die Include-Liste.
			</p>

			<h3 id="via-runonly-4th-argument">Über <code>runOnly</code> (4. Argument)</h3>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {}, {",
					"  includeRuleIds: ['img-alt-present', 'button-name-present'],",
					"  excludeRuleIds: ['region'],",
					"  tags: ['wcag412'],",
					"  excludeTags: ['best-practice'],",
					"  includeMode: 'and'   // 'and' (default) | 'or' — see below",
					"});",
				]}
			/>
			<p>
				Ein einfaches Array oder ein String funktioniert als Kurzform:{" "}
				<code>runOnly: ['img-alt-present', 'button-name-present']</code> führt diese
				Regeln aus (eine Composite-ID bringt ihre Regeln mit), und{" "}
				<code>runOnly: ['wcag2a', 'wcag2aa']</code> ist dasselbe wie{" "}
				<code>{"{ tags: ['wcag2a', 'wcag2aa'] }"}</code>. Ein Array kann Regel-IDs und Tags
				nicht mischen, und jeder Wert muss eine Regel (eingebaut, Composite oder eine aus{" "}
				<code>engineOptions.customRules</code>) oder einen Tag benennen: Alles andere wirft einen
				Fehler, damit ein Tippfehler nicht unbemerkt jede Regel oder keine ausführt. Verwenden
				Sie die Objektform, um IDs und Tags zu kombinieren oder um auszuschließen. Vor 1.10.0
				wurde ein einfaches Array ignoriert, und jede Regel lief.
			</p>
			<DataTable
				label="Felder von runOnly"
				rowKey="field"
				columns={[
					{ key: "field", label: "Feld", width: "22%" },
					{ key: "type", label: "Typ", width: "16%" },
					{ key: "meaning", label: "Bedeutung", wrap: true },
				]}
				rows={[
					{
						field: <code>wcag</code>,
						type: <code>{"{ version, level }"}</code>,
						meaning: "Ein WCAG-Konformitätsziel: die Regeln für die Kriterien dieser Version auf dieser Stufe und darunter. Siehe „Auswahl nach WCAG-Ziel“ oben.",
					},
					{
						field: <code>bestPractices</code>,
						type: <code>boolean</code>,
						meaning: "true ergänzt die Best-Practice-Regeln. Siehe „Best Practices ergänzen“ oben.",
					},
					{ field: <code>includeRuleIds</code>, type: <code>string[]</code>, meaning: "Nur diese Regel-IDs ausführen (bei einer zusammengesetzten ID zusätzlich ihre atomaren Kindregeln)." },
					{ field: <code>excludeRuleIds</code>, type: <code>string[]</code>, meaning: "Diese nie ausführen; wird nach dem Einschließen angewendet." },
					{
						field: (
							<>
								<code>includeTestIds</code> / <code>excludeTestIds</code>
							</>
						),
						type: <code>string[]</code>,
						meaning: "Gleicher Abgleich wie oben. Als eigenes Feld geführt, weil Regeln intern „Tests“ heißen (die atomare ausführbare Einheit); funktional derzeit identisch mit includeRuleIds/excludeRuleIds.",
					},
					{ field: <code>tags</code>, type: <code>string[]</code>, meaning: "Nur Regeln ausführen, die mindestens eines dieser Tags tragen (z. B. wcag412, wcag2aa, best-practice)." },
					{ field: <code>excludeTags</code>, type: <code>string[]</code>, meaning: "Regeln mit einem dieser Tags nie ausführen; wird nach dem Einschließen angewendet." },
					{
						field: <code>includeMode</code>,
						type: (
							<>
								<code>'and'</code> | <code>'or'</code>
							</>
						),
						meaning: "Wenn sowohl ein ID-Include als auch ein Tag-Include angegeben ist: 'and' (Standard) verlangt, dass eine Regel beide erfüllt; 'or' führt eine Regel aus, wenn sie eines davon erfüllt. Irrelevant, wenn Sie nur eine Dimension verwenden.",
					},
				]}
			/>
			<p>
				Jedes dieser Felder akzeptiert entweder ein Array oder einen kommagetrennten String,
				passend zur <code>engineOptions</code>-Form weiter unten:{" "}
				<code>includeRuleIds: 'img-alt-present, button-name-present'</code>{" "}
				und <code>includeRuleIds: ['img-alt-present', 'button-name-present']</code> sind
				gleichwertig.
			</p>
			<p>
				Namen werden geprüft, hier und in <code>engineOptions.rules</code>/<code>.tags</code>{" "}
				weiter unten. Eine Include-Liste (<code>includeRuleIds</code>, <code>tags</code>, das
				ältere <code>values</code>, <code>rules.include</code>, <code>tags.include</code>), in
				der kein Wert eine Regel oder einen Tag benennt, wirft einen Fehler mit{" "}
				<code>code: 'INVALID_RUN_ONLY'</code> und einer Meldung, die das Feld und die Werte
				nennt, denn sie würde nichts auswählen, und ein Lauf ohne Regeln liest sich wie ein Scan
				ohne Befunde. Eine Auswahl, deren Namen alle existieren, deren Teile sich aber gegenseitig
				aufheben (eine Regel, die zugleich eingeschlossen und ausgeschlossen ist, Regeln und Tags
				ohne gemeinsame Regel unter <code>includeMode: 'and'</code>), führt ebenfalls keine Regel
				aus: Der Scan warnt und nennt die Teile, und unter <code>strictOptions</code> wirft er{" "}
				<code>INVALID_RUN_ONLY</code>. <code>includeMode</code> ist <code>'and'</code> oder{" "}
				<code>'or'</code>; ein anderer Wert wird als <code>'and'</code> gelesen, mit einer Warnung,
				und wirft unter <code>strictOptions</code> einen Fehler. Ein Wert, der nichts benennt,
				neben anderen, die etwas benennen, oder in einer Exclude-Liste wird mit einem{" "}
				<code>console.warn</code> ignoriert. Vor 1.10.0 wurde jeder solche Wert stillschweigend
				ignoriert.
			</p>
			<p>
				Die neun WCAG-Tags für Version und Stufe, <code>wcag2a</code> bis <code>wcag22aaa</code>,
				sind immer bekannt, ob eine Regel eines davon trägt oder nicht. Einige tragen derzeit keine
				(<code>wcag21aaa</code>, <code>wcag22a</code>, <code>wcag22aaa</code>): Für ihre Kriterien
				gibt es keine automatische Regel, und das ist kein Tippfehler. In einer Include-Liste neben
				anderen Werten wird ein solches Tag mit einem <code>console.info</code> vermerkt, nicht mit
				einer Warnung:
			</p>
			<CodeBlock
				lines={['[surea11y] runOnly.tags: no rules for WCAG 2.2 Level A ("wcag22a"); its criteria need manual review.']}
			/>
			<p>
				<code>engineOptions.logUntestedWcag: false</code> lässt diese Zeile weg. Ist jeder Wert
				einer Include-Liste ein solches Tag, würde nichts laufen, daher wirft sie weiterhin{" "}
				<code>INVALID_RUN_ONLY</code> und sagt, warum. Neben einem <code>runOnly.wcag</code>-Ziel
				oder <code>bestPractices: true</code>, die eigene Regeln auswählen, wird es nur vermerkt. In
				einer Exclude-Liste bleibt es unbeachtet.
			</p>
			<p>
				Regel-IDs stehen ohne Präfix (kein Engine-Präfix), z. B. <code>'img-alt-present'</code>.
				Aus Gründen der Abwärtskompatibilität akzeptiert der Abgleich auch eine ältere, mit{" "}
				<code>a11ycore-</code> präfixierte Form derselben ID (<code>'a11ycore-img-alt-present'</code>).
			</p>
			<p>
				Als gesamter <code>runOnly</code>-Wert wird außerdem die{" "}
				<strong><code>{"{ type, values }"}</code>-Form</strong> akzeptiert:{" "}
				<code>{"{ type: 'tag', values: ['wcag2a', 'wcag2aa'] }"}</code> ist{" "}
				<code>{"{ tags: ['wcag2a', 'wcag2aa'] }"}</code>, und{" "}
				<code>{"{ type: 'rule', values: ['img-alt-present'] }"}</code> ist{" "}
				<code>{"{ includeRuleIds: ['img-alt-present'] }"}</code> (<code>'tags'</code> und{" "}
				<code>'rules'</code> funktionieren auch). <code>values</code> kann ein kommagetrennter
				String sein, seine Namen werden wie alle Regel-IDs oder Tags geprüft, und die anderen
				Schlüssel daneben (<code>excludeTags</code>, <code>excludeRuleIds</code>...) gelten
				weiterhin. Ein <code>Set</code> von Namen wird als die Liste gelesen, die es enthält. Ein
				Schlüssel, den die Objektform nicht liest, neben solchen, die sie liest, wird mit einer
				Warnung ignoriert. Jeder andere <code>type</code> wirft{" "}
				<code>INVALID_RUN_ONLY</code>, ebenso ein <code>runOnly</code>, das eine Zahl oder ein
				Boolean ist, oder ein Objekt, von dessen Keys die Engine keinen liest (
				<code>{"{ includeRuleId: [...] }"}</code>): Jeder dieser Fälle führte früher jede Regel
				aus. Ein leeres Array, ein leerer String oder ein leeres Objekt bedeutet weiterhin die
				Standardauswahl.
			</p>

			<h3 id="filtering-by-wcag-version">Filtern nach WCAG-Version (2.0, 2.1, 2.2)</h3>
			<p>
				Jede Regel und jede zusammengesetzte Regel trägt genau ein Level-Tag für ihre
				WCAG-Ursprungsversion: <code>wcag2a</code>/<code>wcag2aa</code>/<code>wcag2aaa</code>{" "}
				für ein Erfolgskriterium, das schon zur Basis von WCAG 2.0 gehört,{" "}
				<code>wcag21a</code>/<code>wcag21aa</code>/<code>wcag21aaa</code> für eines, das mit
				WCAG 2.1 neu hinzukam (z. B. <code>1.3.5</code> <span lang="en">Identify Input Purpose</span>),{" "}
				<code>wcag22a</code>/<code>wcag22aa</code>/<code>wcag22aaa</code> für eines, das mit
				WCAG 2.2 neu hinzukam (z. B. <code>2.5.8</code> <span lang="en">Target Size Minimum</span>). Eine Regel erhält{" "}
				<strong>nur</strong> das Tag der tatsächlichen Ursprungsversion ihres Kriteriums: Ein in
				2.1 eingeführtes Kriterium trägt nie zusätzlich <code>wcag2aa</code>, da es bei einem
				Konformitätsziel WCAG 2.0 gar nicht existiert.
			</p>
			<p>
				<code>runOnly.wcag</code> wählt ein Konformitätsziel in einem einzigen Feld aus (
				<a href="#selecting-by-wcag-target-runonlywcag">oben</a>) und lässt 4.1.1 unter 2.2 weg.
				Mit Tags wählen Sie, da die Versionen kumulativ sind (2.1 = 2.0 + Neues; 2.2 = 2.0 + 2.1 +
				Neues), ein Konformitätsziel für eine WCAG-Version durch Kombinieren von Tag-Sets aus. Den Rest
				erledigt der ODER-Abgleich der Engine auf <code>tags</code> (ein einziger Treffer
				schließt die Regel ein):
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.0 AA only (excludes every 2.1/2.2-introduced SC, even at level AA):",
					"{ tags: ['wcag2a', 'wcag2aa'] }",
					"",
					"// WCAG 2.1 AA conformance (2.0 baseline + everything 2.1 added, both at A and AA):",
					"{ tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }",
					"",
					"// WCAG 2.2 AA conformance (2.0 baseline + 2.1 additions + 2.2 additions):",
					"{ tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'] }",
					"",
					"// Just the SCs 2.2 introduced, nothing else:",
					"{ tags: ['wcag22a', 'wcag22aa', 'wcag22aaa'] }",
				]}
			/>
			<p>
				<strong>Ein Kriterium geht den umgekehrten Weg.</strong> WCAG 2.2 hat Erfolgskriterium 4.1.1 „Syntaxanalyse“
				entfernt, das einzige Kriterium, das je gestrichen statt hinzugefügt wurde. Eine darauf
				abgebildete Regel trägt wie jede andere Basisregel ihr 2.0-Ursprungs-Tag (
				<code>wcag2a</code>) und zusätzlich <code>wcag22-removed</code>. Die obigen
				Versions-Tag-Sets schließen sie deshalb auch bei einem 2.2-Ziel ein, wo sie nicht
				hingehört.
			</p>
			<p>
				Sie müssen dafür nichts tun. Die Engine ermittelt für jeden Lauf eine{" "}
				<strong>WCAG-Zielversion</strong>, und ist dieses Ziel 2.2, kann eine Regel mit{" "}
				<code>wcag22-removed</code> kein <code>fail</code> melden: Sie läuft weiterhin, meldet
				weiterhin jedes gefundene Vorkommen, aber ihr Ergebnis wird zu <code>cantTell</code>{" "}
				umgewandelt, und das Ergebnis enthält ein Feld <code>wcagVersionScope</code>, das den
				Grund nennt (siehe <a href="/results-reports/output-schema/">das Ausgabeschema</a>).
				Nichts fällt stillschweigend weg, und ein 2.2-Lauf wird nicht durch ein Kriterium
				blockiert, das es in 2.2 nicht gibt.
			</p>
			<p>Die Zielversion wird in dieser Reihenfolge ermittelt:</p>
			<ol>
				<li>
					<code>engineOptions.wcagVersion</code>: <code>'2.0'</code>, <code>'2.1'</code> oder{" "}
					<code>'2.2'</code>, sofern Sie es setzen.
				</li>
				<li>Die Version eines <code>runOnly.wcag</code>-Ziels.</li>
				<li>
					Die Versionsursprungs-Tags in Ihrem eigenen Filter: Ein Set, das bei{" "}
					<code>wcag21a</code>/<code>wcag21aa</code> endet, gilt als 2.1-Ziel, eines mit
					irgendeinem <code>wcag22*</code>-Tag als 2.2, eines nur mit <code>wcag2*</code>-Tags als
					2.0. Nur diese neun Tags zählen; ein Kriteriums-Tag (<code>wcag411</code>) oder{" "}
					<code>best-practice</code> sagt nichts über eine Version aus.
				</li>
				<li>
					Andernfalls <code>'2.2'</code>, das Standardziel dieser Engine.
				</li>
			</ol>
			<CodeBlock
				lang="js"
				lines={[
					"// Nothing to declare: a plain run already targets 2.2, so a duplicate id",
					"// comes back cantTell rather than fail.",
					"runDomRulesInPage(url, null, {}, null);",
					"",
					"// Conformance-testing against 2.1, where SC 4.1.1 still exists:",
					"runDomRulesInPage(url, null, { wcagVersion: '2.1' }, null);",
					"",
					"// Same thing, implied by the tag set — no extra option needed:",
					"runDomRulesInPage(url, null, {}, { tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] });",
				]}
			/>
			<p>
				Die ermittelte Zielversion steht in jedem Ergebnis als <code>engine.wcagVersion</code>,
				sodass Sie prüfen können, welche ein Lauf tatsächlich verwendet hat.
			</p>
			<p>
				Wenn Sie die Regel unter 2.2 lieber gar nicht sehen möchten, schließen Sie sie
				ausdrücklich aus. Genau dafür ist das Tag weiterhin da:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.2 AA conformance, with the removed criterion left out entirely:",
					"{",
					"  tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'],",
					"  excludeTags: ['wcag22-removed']",
					"}",
				]}
			/>
			<p>
				<code>duplicate-id</code> ist derzeit die einzige Regel mit diesem Tag. Bleibt sie
				drin, meldet sie weiterhin etwas Reales (eine doppelte ID macht{" "}
				<code>&lt;label for&gt;</code>, Fragment-Links und <code>getElementById</code> kaputt,
				ganz gleich, was der Standard sagt), es ist nur kein Konformitätsverstoß gegen 2.2.
			</p>

			<h3>Über <code>engineOptions</code> (ohne <code>runOnly</code>)</h3>
			<p>Dieselbe Filterung, ausgedrückt als kommagetrennte Strings (oder Arrays) innerhalb von <code>engineOptions</code>:</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
					"  rules: { include: 'img-alt-present, button-name-present', exclude: 'region' },",
					"  tags: { include: 'wcag412', exclude: 'best-practice' },",
					"  includeMode: 'and'",
					"}, null);",
				]}
			/>
			<p>
				<code>rules.include</code>/<code>.exclude</code>, <code>tags.include</code>/
				<code>.exclude</code>, <code>tests.include</code>/<code>.exclude</code> (Alias von{" "}
				<code>rules</code>) und <code>includeMode</code> auf oberster Ebene entsprechen genau
				den <code>runOnly</code>-Feldern oben. Kommagetrennte Strings werden automatisch
				getrimmt, dedupliziert und von leeren Einträgen befreit. Eine einfache Liste oder ein
				String, etwa <code>rules: ['img-alt-present']</code>, wird als Include-Liste gelesen.
			</p>

			<h2><code>engineOptions</code>: der Rest</h2>
			<CodeBlock
				lang="js"
				lines={[
					"const engineOptions = {",
					"  strictOptions: false,            // default false — true throws on an unknown option or a value of the wrong type",
					"  locale: 'en',                    // default 'en'; de-DE falls back to de, then to en per string",
					"  wcagVersion: '2.2',              // default '2.2' — the conformance target",
					"  profile: 'en301549-v4.1.1',      // optional — a named conformance target",
					"  mappings: ['en301549'],          // optional — standards besides WCAG to name on each result",
					"  optInRules: 'all',               // optional — also run rules other standards add beyond WCAG",
					"  messages: { de: { /* key: text */ } },  // optional caller-supplied dictionaries; win over built-in ones",
					"  includeHiddenElements: false,    // default false — set true to evaluate hidden/collapsed subtrees too",
					"  includeShadowDom: true,          // default true — opt OUT with false to skip open shadow roots",
					"  fragment: false,                 // default false — set true when the scan target isn't a real page",
					"  excludeSelectors: ['#cookie-banner', '.third-party-widget'],  // array or comma-separated string",
					"  timestamp: '2026-07-20T12:00:00Z',  // optional — engine has no built-in clock",
					"  perfStats: false,                // default false — internal timing counters, debug-only shape",
					"  profileRules: false,             // default false — per-rule timings; needs perfStats",
					"",
					"  contrast: {",
					"    mode: 'strictConformance',     // 'strictConformance' (default) | 'auditorAssist'",
					"    rootCanvasFallback: '#ffffff'  // background assumed when the true root background isn't computable",
					"  },",
					"  visibilityMode: undefined,       // 'styleOnly' | 'styleAndGeometry'; unset: geometry with a layout, else styles",
					"",
					"  policyContract: 'a11y',          // 'a11y' (default) | 'generic' | inline contract object",
					"  policy: {                        // optional overrides on top of policyContract",
					"    coerceManualFailToCantTell: true",
					"  },",
					"",
					"  output: {",
					"    includeSelector: true,         // set false to suppress auto-filled selectors",
					"    includeHtml: true,",
					"    detail: 'full'                 // 'findings': pass/notApplicable results keep only rule, outcome, type",
					"  },",
					"",
					"  rules: {",
					"    'some-rule-id': {",
					"      excludeSelectors: ['.some-noisy-widget']  // narrows candidates for THIS rule only",
					"    }",
					"  },",
					"",
					"  probes: { /* optional host-supplied evidence */ },",
					"",
					"  customRules: [ /* runtime-registered rules, see below */ ],",
					"  packs: [ /* rules and standards from outside core, see Packs */ ],",
					"",
					"  // Only read by runa11yCoreAcrossFrames. Ignored by runDomRulesInPage/runa11yCoreInPage.",
					"  pingWaitTime: 500,               // ms to wait for a child frame to answer a ping",
					"  frameWaitTime: 60000             // ms to wait for a child frame's full scan result",
					"};",
				]}
			/>
			<DataTable
				label="Weitere engineOptions"
				rowKey="id"
				columns={[
					{ key: "option", label: "Option", width: "22%" },
					{ key: "meaning", label: "Bedeutung", wrap: true },
				]}
				rows={optionRows}
			/>

			<h3 id="catching-mistakes-in-the-options-strictoptions">Fehler in den Optionen abfangen (<code>strictOptions</code>)</h3>
			<p>
				Eine Option, die die Engine nicht liest, wird durchgereicht: Eine eigene Regel kann eigene
				Einstellungen aus <code>ctx.engineOptions</code> lesen, und eine in einem späteren Release
				entfernte Option bricht keinen Scan. Standardmäßig wird eine falsch geschriebene Option
				daher ignoriert, und der Scan läuft, als wäre sie nicht da. Zwei Dinge weisen darauf hin:
			</p>
			<ul>
				<li>
					<strong>Immer</strong> gibt es eine Warnung zu einem Schlüssel, der ein oder zwei
					Buchstaben von einem bekannten entfernt ist (unabhängig von Groß- und Kleinschreibung),
					verschachtelte Schlüssel eingeschlossen: <code>lcoale</code> erhält{" "}
					<code>[surea11y] engineOptions: unknown option "lcoale" (did you mean "locale"?); ignored.</code>
				</li>
				<li>
					<strong>Immer</strong> gibt es eine Warnung zu einem Wert vom falschen Typ, und er wird
					als nicht angegeben gelesen, ebenso ein <code>engineOptions</code>, das kein Objekt ist.
					Ein/Aus-Optionen (<code>includeShadowDom</code>, <code>includeHiddenElements</code>,{" "}
					<code>fragment</code>, <code>perfStats</code>, <code>profileRules</code>,{" "}
					<code>output.includeHtml</code>, <code>output.includeSelector</code>) nehmen{" "}
					<code>true</code> oder <code>false</code> an, oder <code>'true'</code>,{" "}
					<code>'false'</code>, <code>'1'</code>, <code>'0'</code>, <code>1</code> und{" "}
					<code>0</code>, so wie eine Kommandozeile sie schreibt: <code>perfStats: 'false'</code>{" "}
					ist aus.
				</li>
				<li>
					<strong>Mit <code>strictOptions: true</code></strong> (oder <code>'true'</code>,{" "}
					<code>'1'</code> oder <code>1</code>) wird jede Option vor dem Scan geprüft, und jeder
					Fehler wirft einen Fehler mit <code>code: 'INVALID_ENGINE_OPTIONS'</code>, der jeden
					davon nennt, wobei <code>problems</code> sie als{" "}
					<code>{"{ path, kind, message, suggestion }"}</code> auflistet: ein unbekannter Schlüssel
					(<code>kind: 'unknown'</code>) in <code>engineOptions</code> oder in einem seiner Objekte
					und ein Wert vom falschen Typ oder außerhalb seiner Menge (<code>kind: 'invalid'</code>),
					etwa <code>includeHiddenElements: 'yes'</code> oder <code>contrast.mode: 'strict'</code>.
				</li>
			</ul>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, { strictOptions: true, lcoale: 'de' }, null);",
					"// Error: engineOptions: unknown option \"lcoale\" (did you mean \"locale\"?). (strictOptions)",
				]}
			/>
			<p>
				Nicht geprüft werden: die eigenen Einstellungen einer Regel (<code>rules[ruleId]</code>),
				die Schlüssel von <code>messages</code> und <code>probes</code>, die die Engine ungelesen
				weitergibt, sowie die eigenen Regeln, die eigene Prüfungen haben
				(<code>skippedCustomRules</code>). In TypeScript ist <code>StrictEngineOptions</code>{" "}
				dieselbe Menge von Optionen ohne die Index-Signatur, mit der jeder Schlüssel kompiliert,
				daher ist eine falsch geschriebene Option auch dort ein Fehler.
			</p>

			<h3 id="rule-scoped-excludeselectors"><code>excludeSelectors</code> pro Regel</h3>
			<p>
				Das <code>excludeSelectors</code> auf oberster Ebene gilt für <em>jede</em> Regel. Damit
				lässt sich ein Element nicht von nur einer Regel ausschließen, während alle anderen
				Regeln weiterhin dagegen laufen. <code>rules[ruleId].excludeSelectors</code> schließt
				diese Lücke: Es grenzt die Kandidaten <strong>nur für diese eine Regel</strong> ein,
				zusätzlich zur globalen Liste (nie an ihrer Stelle).
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const engineOptions = {",
					"  excludeSelectors: ['#cookie-banner'],   // applies to every rule, as always",
					"  rules: {",
					"    'aria-required-children': {",
					"      excludeSelectors: ['mat-select', 'mat-stepper', 'mat-horizontal-stepper', 'mat-vertical-stepper']",
					"    },",
					"    'aria-allowed-attr': {",
					"      excludeSelectors: ['mat-progress-spinner']",
					"    }",
					"  }",
					"};",
				]}
			/>
			<p>
				Wozu das gut ist: <code>&lt;mat-select&gt;</code> aus <span lang="en">Angular Material</span> baut seine
				interne ARIA-Struktur so auf, dass speziell bei <code>aria-required-children</code> ein
				falsch positives Ergebnis entsteht, obwohl die Komponente ansonsten in Ordnung ist. Mit nur dem
				globalen <code>excludeSelectors</code> lässt sich dieses falsch positive Ergebnis nur über{" "}
				<code>excludeSelectors: ['mat-select']</code> unterdrücken. Das verbirgt{" "}
				<code>mat-select</code> aber auch vor <em>allen anderen Regeln</em>, darunter{" "}
				<code>contrast-minimum</code> und <code>aria-allowed-attr</code>, und lässt damit
				stillschweigend echte Abdeckung wegfallen, mit der diese Prüfungen nie ein Problem
				hatten. Das Beispiel oben hält <code>mat-select</code> für jede Regel vollständig
				sichtbar, außer für die eine, die dort fälschlich anschlägt.
			</p>
			<p>
				Die wirksamen Ausschlüsse für eine Regel sind die <strong>Vereinigung</strong> aus der
				globalen Liste und der eigenen Liste der Regel: Ein Element, auf das eine der beiden
				passt, fällt aus den Kandidaten dieser Regel heraus. Eine Regel, deren einzige
				Elemente, die sonst <code>fail</code> ergeben würden, alle auf diese Weise ausgeschlossen sind, meldet{" "}
				<code>outcome: 'pass'</code> oder <code>'notApplicable'</code> (je nach eigener
				Konvention der Regel für den Fall ohne Kandidaten) mit <code>occurrences: []</code>, nie{" "}
				<code>outcome: 'fail'</code> mit leerem <code>occurrences</code>-Array, denn das{" "}
				<code>fail</code> einer eingebauten Regel nennt immer, was fehlgeschlagen ist. (Eine
				Regel, die eine Exception wirft, ist ein anderer Fall: Sie meldet <code>cantTell</code>{" "}
				mit gesetztem <code>error</code>, siehe{" "}
				<a href="/results-reports/output-schema/">das Ausgabeschema</a>.)
			</p>
			<p>
				Akzeptiert dieselben Formen wie die globale Option: ein Array (
				<code>['mat-select', 'mat-stepper']</code>) oder einen kommagetrennten String (
				<code>'mat-select, mat-stepper'</code>).
			</p>
			<p>
				Wenn Sie ein Binding-Paket verwenden (<code>@surea11y/binding-base</code> und seine
				Wrapper für Playwright/Puppeteer), prüfen Sie in der README des jeweiligen Bindings, ob
				dessen Builder-Methode <code>.exclude()</code> schon eine Form pro Regel hat. Diese{" "}
				<code>engineOptions</code>-Struktur ist hier auf Engine-Ebene dokumentiert; nicht jedes
				Binding hat sie bereits übernommen.
			</p>

			<h2>Rezepte: Optionen für reale Szenarien kombinieren</h2>
			<p>
				<strong>CI-Gate: nur WCAG 2.2 AA, ein Drittanbieter-Widget ignorieren, das Sie nicht
				kontrollieren</strong>
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
						"  excludeSelectors: ['#cookie-banner', '.intercom-launcher']",
						"}, { wcag: { version: '2.2', level: 'AA' } });",
					]}
			/>
				<p>
					Ergänzen Sie <code>bestPractices: true</code> neben <code>wcag</code>, um auch die
					Best-Practice-Regeln auszuführen, die ein WCAG-Gate üblicherweise meldet, ohne daran zu
					scheitern.
				</p>
			<p>
				<strong>Manuelles Audit: gründliche Kontrastprüfung im echten
				Browser</strong>: etwas Schutz vor falsch positiven Ergebnissen gegen mehr Befunde
				eintauschen. Im echten Browser prüfen die Kontrastregeln bereits das Layout, nicht nur die
				berechneten Styles, daher muss nur der Kontrastmodus gesetzt werden. Gezeigt mit <code>page.evaluate</code> von Puppeteer (akzeptiert mehrere
				Argumente); mit Playwright fassen Sie die vier Positionsargumente zuerst in einem
				einzigen Objekt zusammen, siehe{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const result = await page.evaluate(runa11yCoreInPage, url, null, {",
					"  contrast: { mode: 'auditorAssist' }",
					"}, null);",
				]}
			/>
			<p>
				<strong>Eingegrenzter erneuter Scan eines Bereichs nach einer UI-Änderung, ohne Shadow
				DOM</strong>: nützlich in einem Komponententest, bei dem Sie nur das gerade geänderte
				Widget interessiert:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, '#checkout-form', {",
					"  includeShadowDom: false",
					"}, { includeRuleIds: ['form-control-programmatic-label-present', 'button-name-present'] });",
				]}
			/>
			<p>
				<strong>Ausgabe für Snapshot-Tests</strong>: Legen Sie einen <code>timestamp</code> fest,
				damit sich der Zeitstempel des Ergebnisses zwischen Läufen nicht ändert, und lassen Sie{" "}
				<code>perfStats</code> und <code>profileRules</code> aus: Ihre Laufzeiten schwanken, und
				ihre Form gehört nicht zur stabilen Ausgabe. Ein Snapshot braucht außerdem bei jedem Lauf
				dasselbe DOM, dieselben Optionen und dieselben Rendering-Bedingungen (Browser, Viewport,
				Schriften); der Zeitstempel allein macht zwei Ergebnisse nicht identisch.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
					"  timestamp: '2026-01-01T00:00:00Z'",
					"}, null);",
				]}
			/>
			<p>
				<strong>Eine eigene, organisationsspezifische Regel neben den eingebauten</strong>, nur
				für diesen einen Aufruf:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
					"  customRules: [{",
					"    id: 'org-no-inline-onclick',",
					"    meta: { title: 'No inline onclick handlers', defaultSeverity: 'moderate' },",
					"    runInPage(ctx) {",
					"      // queryAllSmart applies excludeSelectors, the scope's shadow roots and",
					"      // the hidden-content filter; queryAll is the plain light-DOM query.",
						"      // ctx.helpers.dom reads the DOM so the page's markup can't redirect it.",
						"      const dom = ctx.helpers.dom;",
						"      const els = ctx.helpers.queryAllSmart('[onclick]');",
					"      const occurrences = els.map((el) => ({",
					"        selector: ctx.helpers.buildSelector(el),",
					"        html: dom.outerHTML(el),",
					"        summary: 'Inline onclick handler found.',",
					"        hint: 'Move event handling into an external script.'",
					"      }));",
					"",
					"      return { ruleId: ctx.rule.ruleId, outcome: occurrences.length ? 'fail' : 'pass', severity: 'moderate', occurrences };",
					"    }",
					"  }]",
					"}, null);",
				]}
			/>

			<h2><code>customRules</code>: zur Laufzeit registrierte Regeln</h2>
			<p>
				Jede ausgelieferte Regel wird beim Build fest in <code>src/core.js</code> eingebaut.{" "}
				<code>engineOptions.customRules</code> ist der Ausweg zur Laufzeit: ein Array von
				Regel-Deskriptoren, die nur für diesen einen Aufruf registriert werden. Dem statischen
				Katalog wird nichts hinzugefügt, und zwischen Aufrufen bleibt nichts erhalten. Die
				Katalogfunktionen nehmen dieselben <code>engineOptions</code> entgegen und listen, was ein
				Scan mit ihnen enthält: <code>getChecksCatalog(engineOptions)</code> listet die gültigen
				eigenen Regeln, jede Überschreibung an der Stelle ihrer eingebauten Regel,{" "}
				<code>getCheckDefById(id, engineOptions)</code> findet sie, und{" "}
				<code>getChecksForRunOnly(runOnly, engineOptions)</code> wählt sie so aus wie der Scan. Das ist
				Absicht und keine Einschränkung, die es zu umgehen gilt: surea11y nimmt ohnehin bei
				jedem Aufruf frische <code>engineOptions</code> entgegen, ohne veränderbare globale
				Konfiguration (anders als manche anderen Engines, die einen Schritt{" "}
				<code>configure()</code>/<code>reset()</code> gegen eine gemeinsame Laufzeit
				brauchen), und eigene Regeln folgen demselben Modell pro Aufruf.
			</p>
			<p>
				Die Bibliothek direkt aufzurufen ist ein Weg; die CLI bietet das auch über{" "}
				<code>--custom-rules &lt;path&gt;</code> (eine lokale Datei, einmal pro Scan geladen),
				siehe{" "}
				<a href="https://github.com/SureA11y/cli/blob/main/docs/CLI.md#custom-rules">
					die CLI-Dokumentation
				</a>
				.
			</p>
			<p>
				Eine eigene Regel läuft, wie die eines Packs, nach den eingebauten Regeln, und die{" "}
				<code>ctx.helpers</code>, <code>ctx.engineOptions</code> und{" "}
				<code>ctx.inputs.probes</code>, die sie erhält, sind schreibgeschützt: Etwas darauf zu
				setzen oder zu löschen wirft einen Fehler (die Regel wird mit diesem Fehler als{" "}
				<code>cantTell</code> gemeldet), sodass sie nicht ändern kann, was andere Regeln sehen. Sie
				darf die Seite nicht verändern: Eine, die es tut, wird in einem <code>console.warn</code>{" "}
				genannt. Die Ergebnisse behalten die Reihenfolge des Katalogs. Was immer sie wirft oder
				zurückgibt, der Scan liefert ein Ergebnis, und das Ergebnis der Regel wird zu einfachen
				Daten gemacht, sodass sich das Ergebnis des Scans als JSON schreiben und klonen lässt.
			</p>
			<p>
				Ein Deskriptor hat <em>dieselbe Form wie der Export eines internen Regelmoduls</em>: Wenn
				Sie schon wissen, wie man eine Regeldatei für diese Engine schreibt, kennen Sie diese API
				bereits:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"{",
					"  id: 'my-org-custom-rule',          // required",
					"  meta: { title, description, tags, defaultSeverity, defaultConfidence, /* same fields as a rule module's meta */ },",
					"  runInPage(ctx) { /* same ctx shape and same return contract as any built-in rule */ },",
					"  applicability(ctx) { return true; }, // optional, same contract as a built-in rule's applicability",
					"  data: { /* optional, JSON-serializable */ }",
					"}",
				]}
			/>
			<ul>
				<li>
					<code>runInPage</code>/<code>applicability</code> kann eine{" "}
					<strong>echte Funktion</strong> oder ein <strong>Funktionsquelltext als String</strong>{" "}
					sein (also <code>fn.toString()</code>). Übergeben Sie eine echte Funktion, wenn{" "}
					<code>engineOptions</code> den aktuellen JS-Realm nie verlässt (reine Nutzung mit
					Node/jsdom). Übergeben Sie einen String, wenn es ihn verlässt, z. B. bei einem Aufruf{" "}
					<code>page.evaluate(runa11yCoreInPage, {"{ engineOptions }"})</code> in Playwright, bei
					dem <code>engineOptions</code> eine JSON- bzw. Structured-Clone-Grenze überquert, die
					keine lebende <code>Function</code>-Referenz transportieren kann, wohl aber einen String.
					Die Engine rekonstruiert einen String über <code>new Function</code>, denselben
					Mechanismus, mit dem der Build den Quelltext jeder eingebauten Regel in den
					In-Page-Runner einbettet. Der Quelltext jeder Funktion funktioniert: eine
					Pfeilfunktion, eine <code>function</code>-Deklaration oder eine Methode in Kurzschreibweise
					wie im Beispiel oben (<code>{"runInPage(ctx) {…}"}</code>, auch <code>async</code>),
					deren <code>toString()</code> für sich allein kein Ausdruck ist. Die Rekonstruktion
					setzt voraus, dass <code>eval</code> erlaubt ist; eine Seite, deren Content Security
					Policy <code>'unsafe-eval'</code> verbietet, überspringt daher eine als String
					übergebene Regel, und deren Grund in <code>skippedCustomRules</code> nennt die Policy
					als Ursache. Übergeben Sie dort eine echte Funktion.
				</li>
				<li>
					<code>meta</code> erhält dieselben Standardwerte und dieselbe Validierung wie eine
					Regel aus dem Build. Lassen Sie weg, was Sie nicht brauchen;{" "}
					<code>defaultSeverity</code> ist standardmäßig <code>moderate</code>,{" "}
					<code>defaultConfidence</code> <code>medium</code>, <code>type</code>{" "}
					<code>automatic</code> usw. Ein Wert außerhalb seiner Menge (<code>minor</code>/
					<code>moderate</code>/<code>serious</code>/<code>critical</code>; <code>high</code>/
					<code>medium</code>/<code>low</code>; <code>automatic</code>/<code>manual</code>,
					Groß- und Kleinschreibung egal) ist ein <code>meta</code>, das die Validierung nicht
					besteht, und die Regel wird übersprungen. Eine <code>severity</code>, die eine Regel
					außerhalb der Menge zurückgibt, wird durch ihren Standardwert ersetzt, mit einem
					Hinweis in <code>error</code>.
				</li>
				<li>
					Eine eigene Regel, deren <code>id</code> mit einer eingebauten kollidiert,{" "}
					<strong>überschreibt diese für den jeweiligen Scan</strong>, statt dass beide laufen.
					Da eine gleichnamige eigene Regel genauso gut eine versehentliche Kollision wie ein
					gewolltes Überschreiben sein kann, wird jede Kollision auf zwei Wegen sichtbar gemacht:
					durch ein <code>console.warn</code> mit der oder den IDs und durch ein Array{" "}
					<code>overriddenBuiltinIds</code> auf oberster Ebene des Ergebnisses (leer, wenn es
					keine Kollision gibt). Siehe <a href="/results-reports/output-schema/">das Ausgabeschema</a>.
					IDs werden unabhängig von Groß- und Kleinschreibung abgeglichen: Eine eigene Regel{" "}
					<code>IMG-ALT-PRESENT</code> überschreibt <code>img-alt-present</code> und übernimmt
					dessen ID, und eine zweite Warnung nennt beide Schreibweisen.
				</li>
				<li>
					Eine eigene Regel, die gelaufen ist, zählt für die WCAG-Zusammenfassung
					(<code>rulesResults</code>) jedes Kriteriums, dem sie über <code>meta.wcagSc</code> oder
					einen WCAG-Eintrag in <code>meta.normativeMappings</code> zugeordnet ist, genau wie eine
					eingebaute Regel: Schlägt sie fehl, schlägt die Zusammenfassung fehl. Die Zusammenfassung
					kennzeichnet sie unter ihren beitragenden Regeln mit <code>custom: true</code> und listet
					sie in <code>data.details.customChecksIds</code>. Eine Überschreibung zählt dort, wo ihre
					eigene Zuordnung es sagt: an der Stelle ihrer eingebauten Regel, wenn sie diesem Kriterium
					zugeordnet ist, und in keiner Zusammenfassung, wenn sie keinem zugeordnet ist, mit einer
					Warnung, die die verlassenen Zusammenfassungen nennt.
				</li>
				<li>
					Eine eigene Regel wird wie eine eingebaute ausgewählt, über ihre ID und ihre{" "}
					<code>meta.tags</code>. Ein <code>runOnly</code>, das eine eigene Regel nennt, die der
					Scan übersprungen hat, wirft <code>INVALID_RUN_ONLY</code> mit dem Grund, aus dem sie
					übersprungen wurde. <code>customRules</code> ist eine Liste: Eine einzelne, allein
					übergebene Regel wird nicht ausgeführt und in <code>skippedCustomRules</code> aufgeführt.
					Unter einem Profil oder einem WCAG-Ziel gehört eine Regel mit dem Tag{" "}
					<code>best-practice</code> oder ohne WCAG-Tag nicht zum Lauf: Sie wird mit einem{" "}
					<code>console.warn</code> in <code>skippedCustomRules</code> aufgeführt und läuft, wenn
					Sie ihr die Tags der Kriterien geben, die sie prüft (<code>'wcag111'</code>), oder{" "}
					<code>runOnly.bestPractices: true</code> ergänzen. Eine Überschreibung läuft überall dort,
					wo ihre eingebaute Regel gelaufen wäre.
				</li>
				<li>
					Eine eigene Regel kann wie eine eingebaute eine Marge melden: Deklarieren Sie{" "}
					<code>meta.margin</code> (<code>{"{ measure, unit, limit }"}</code>) und geben Sie{" "}
					<code>marginCandidates</code> zurück (siehe{" "}
					<a href={`${core}/docs/RULE_AUTHORING.md#metamargin`}>
						<code>RULE_AUTHORING.md</code>, <code>meta.margin</code>
					</a>
					, die Anleitung zum Schreiben von Regeln auf GitHub). Ein fehlerhaftes{" "}
					<code>meta.margin</code> wird ignoriert, diese Regel meldet dann keine Marge; der Scan
					läuft weiter.
				</li>
				<li>
					Ein ungültiger Deskriptor (fehlende oder nicht als String angegebene <code>id</code>,
					ein <code>runInPage</code>, das weder eine Funktion noch ein rekonstruierbarer
					Quelltext-String ist, eine <code>applicability</code>, die sich nicht in eine Funktion
					umwandeln lässt, ein <code>meta</code>, das die Validierung nicht besteht, etwa{" "}
					<code>deprecated: true</code> ohne <code>deprecation</code>, eine ID, die schon eine
					andere eigene Regel in der Liste hat, oder die ID einer Composite-Regel) wird mit einem{" "}
					<code>console.warn</code> übersprungen, das die Regel und den Grund nennt, und im{" "}
					<code>skippedCustomRules</code> des Ergebnisses aufgeführt. Der Rest des Scans,
					einschließlich jeder eingebauten Regel, läuft ganz normal weiter. Das ist keine zu
					schließende Validierungslücke: Eine eigene Regel ist beliebiger, vom Aufrufer
					gelieferter Code, daher ist „nur diesen einen Eintrag verwerfen, den Scan
					nicht abbrechen“ der sicherere Standard. Das entspricht dem Umgang mit einer{" "}
					<em>eingebauten</em> Regel, die eine Exception wirft: Sie wird auf ein{" "}
					<code>cantTell</code> für diese Regel begrenzt, statt den Lauf abstürzen zu lassen.
				</li>
				<li>
					Regeln laufen synchron. Ein <code>runInPage</code> oder <code>applicability</code>, das
					ein Promise zurückgibt (eine <code>async</code>-Funktion), wird als{" "}
					<code>cantTell</code> gemeldet, mit einem <code>error</code>, der das sagt, ebenso ein{" "}
					<code>runInPage</code>, das etwas anderes als ein Ergebnisobjekt zurückgibt. Ein{" "}
					<code>outcome</code> außerhalb von <code>pass</code>, <code>fail</code>,{" "}
					<code>cantTell</code> und <code>notApplicable</code> (etwa <code>'failed'</code>) wird
					zu <code>cantTell</code>, und <code>error</code> nennt den zurückgegebenen Wert. Der{" "}
					<code>type</code> einer Regel stammt aus ihrem <code>meta</code>: Ein <code>type</code>{" "}
					in ihrer Rückgabe wird ignoriert, mit einem Hinweis in <code>error</code>.
				</li>
				<li>
					Ergebnisse erscheinen in <code>checksResults</code> genau wie die jeder anderen Regel,
					einschließlich des automatischen Ausfüllens von <code>selector</code>/
					<code>html</code>/<code>structuralPath</code> für <code>fail</code>/
					<code>cantTell</code>-Vorkommen, die nur <code>{"{ __node }"}</code> anhängen (siehe{" "}
					<a href="/results-reports/output-schema/">das Ausgabeschema</a>).
				</li>
				<li>
					Ein <code>fail</code> nennt, was fehlgeschlagen ist. Das <code>fail</code> einer eigenen
					Regel ohne Vorkommen (ein Fehlschlag der ganzen Seite) wird mit einem Vorkommen am
					Dokumentelement gemeldet (<code>selector: 'html'</code>, Reason-Code{" "}
					<code>FAIL_WITHOUT_OCCURRENCE</code>), sodass JUnit, SARIF, Baselines und der HTML-Bericht
					es als den Fehlschlag zeigen, der es ist.
				</li>
			</ul>

				<h2 id="packs">Packs: Regeln und Normen von außerhalb von core</h2>
				<p>
					Ein Pack bringt Regeln, Varianten der Regeln von core, eine Norm oder eine Checkliste und
					die Meldungen, die sie verwenden, aus einem eigenen Paket mit, ohne einen Build von core.
					Übergeben Sie Packs einem Scan in <code>engineOptions.packs</code>; der Scan läuft auf
					einer Engine, die mit ihnen vorbereitet wurde, in denselben Schritten, die der Build für
					die eigenen Regeln von core verwendet, sodass sich Norm, Profile, Zusammenfassungen und
					Opt-in-Regeln eines Packs wie eingebaute verhalten. Die Engine wird für den nächsten Scan
					mit denselben Pack-Objekten behalten, sodass ein Crawl, der jeder Seite dieselben Packs
					übergibt, sie nur einmal vorbereitet.
				</p>
				<CodeBlock
					lang="js"
					lines={[
						"const { runDomRulesInPage, getChecksCatalog } = require('@surea11y/core');",
						"const acmePolicy = require('./acme-policy-pack');",
						"",
						"const result = runDomRulesInPage(url, null, { packs: [acmePolicy], profile: 'acme-web-2026' });",
						"result.engine.packs; // ['@acme/a11y-policy@1.0.0']",
						"getChecksCatalog({ packs: [acmePolicy] }); // core's rules and the pack's",
					]}
				/>
				<p>
					Ein Pack, das nicht zu core passt (sein <code>core</code>-Bereich schließt diese Version
					aus, eine Regel-ID ohne den Namensraum, ein Wörterbuchschlüssel, den core hat), wird mit
					einem <code>console.warn</code> übersprungen, im <code>skippedPacks</code> des Ergebnisses
					als <code>{"{ name, reason }"}</code> aufgeführt, und der Scan läuft ohne es; unter{" "}
					<code>strictOptions</code> wirft er einen Fehler. Packs, die miteinander kollidieren,
					werfen einen Fehler. In einer Seite wird ein Pack zuerst mit <code>packScript(packs)</code>{" "}
					registriert und in <code>engineOptions.packs</code> als <code>name@version</code>{" "}
					genannt. Was ein Pack enthält, wie man eines aus jedem Binding, den Test-Matchern und der
					CLI verwendet und wie man eines schreibt, steht unter{" "}
					<a href="/configuration/packs/">Packs</a>.
				</p>

			<h2><code>contextSelector</code> (2. Runner-Argument, kein Feld von <code>engineOptions</code>)</h2>
			<p>
				Ein CSS-Selektor (oder ein Array von Selektoren), der den Scan auf einen oder mehrere
				Teilbäume eingrenzt. Aufgelöst über <code>document.querySelectorAll</code> (alle Treffer,
				nicht nur der erste). Übergeben Sie <code>null</code>, um das ganze Dokument zu
				scannen.
			</p>
			<ul>
				<li>
					<strong>Ein Selektor ohne Treffer scannt nichts.</strong> Jede Regel meldet{" "}
					<code>notApplicable</code>, auch die seitenweiten, und das <code>contextMatch</code>{" "}
					des Ergebnisses sagt es:{" "}
					<code>{"{ elementCount: 0, unmatchedSelectors: ['#mian'] }"}</code> (siehe{" "}
					<a href="/results-reports/output-schema/#top-level-result">das Ausgabeschema</a>).
					Der Lauf gibt außerdem ein <code>console.warn</code> aus. Ein Scope, den die Seite
					nicht hat, wird nicht auf die ganze Seite ausgeweitet: Ein Ergebnis für Inhalte, nach
					denen Sie nie gefragt haben, darunter ein seitenweites <code>pass</code>, würde sich
					wie ein Ergebnis für den Teil lesen, nach dem Sie gefragt haben. In einem Array wird
					ein Selektor ohne Treffer in <code>unmatchedSelectors</code> aufgeführt, während die
					anderen wie gewohnt gescannt werden; Inhalte, die nur manchmal auf der Seite sind,
					etwa ein Cookie-Banner, können also in der Liste stehen. Vor 1.10.0 fiel ein Scope
					ohne Treffer auf das ganze Dokument zurück, ohne dass das Ergebnis es erwähnte.
				</li>
				<li>
					<strong>Ein Selektor, den der Browser nicht parsen kann, wirft einen Fehler</strong>,
					allein oder in einem Array, bevor irgendeine Regel läuft:{" "}
					<code>contextSelector: "#main[" is not a valid CSS selector.</code> Der Fehler trägt{" "}
					<code>code: 'INVALID_CONTEXT_SELECTOR'</code> und <code>selector</code>, den
					fehlgeschlagenen Selektor. Anders als ein Selektor ohne Treffer ist er immer ein Fehler
					im Aufruf. <code>runa11yCoreAcrossFrames</code> lehnt mit demselben Fehler ab. Ein
					Fehler, der <code>page.evaluate</code> (Playwright, Puppeteer) überquert, behält nur
					seine Meldung; deshalb nennt die Meldung die Option und den Selektor. Vor 1.10.0 wurde
					ein ungültiger Selektor übersprungen, allein angegeben scannte er also das ganze
					Dokument.
				</li>
				<li>
					<strong>Alles außer einem Selektor, einem Array von Selektoren oder <code>null</code>{" "}
					wirft denselben Fehler</strong> und nennt, was übergeben wurde: ein Element, eine
					NodeList, ein Objekt <code>{"{ include, exclude }"}</code>, eine Zahl oder ein
					Array-Eintrag, der kein String ist (
					<code>contextSelector[1] must be a CSS selector, not the number 5.</code>). Übergeben Sie
					stattdessen einen Selektor, der auf das Element passt, und setzen Sie, was ein{" "}
					<code>exclude</code> weglassen würde, in <code>engineOptions.excludeSelectors</code>.
				</li>
				<li>
					<strong>Ein einzelner String</strong> kann selbst eine kommagetrennte Selektorliste sein
					(normale CSS-Vereinigungssemantik): <code>'#a, #b'</code> scannt sowohl{" "}
					<code>#a</code> als auch <code>#b</code>.
				</li>
				<li>
					<strong>Ein Array von Strings</strong> scannt die Vereinigung der Treffer aller
					Selektoren: <code>['#a', '.card']</code> verhält sich genauso wie{" "}
					<code>'#a, .card'</code>; die Array-Form gibt es für Aufrufer, die die Liste
					programmatisch aufbauen.
				</li>
				<li>
					<strong>Shadow DOM.</strong> Mit <code>includeShadowDom</code> (Standard) umfasst ein
					Scope die Shadow Roots in ihm, und ein Scope, der selbst ein Shadow Host ist, umfasst
					seine eigene Shadow Root. Der Selektor wird gegen das Dokument abgeglichen, kann also
					kein Element <em>innerhalb</em> einer Shadow Root auswählen; grenzen Sie stattdessen auf
					ihren Host ein.
				</li>
				<li>
					Überlappende bzw. verschachtelte Bereiche werden automatisch dedupliziert: Ein Element,
					das von mehr als einer gefundenen Wurzel aus erreichbar ist, wird nur einmal gemeldet,
					nicht einmal pro Bereich.
				</li>
				<li>
					<strong>Was ein eingegrenztes Ergebnis bedeutet.</strong> Die meisten Regeln beurteilen
					jedes Element für sich und beurteilen die Elemente im Scope genau wie in einem Scan der
					ganzen Seite. Zwei Arten von Regeln hängen von der Seite um sie herum ab.
					Seitenweite Regeln (<code>page-title-present</code>, <code>landmark-one-main</code> und
					die übrigen, die oben unter <code>fragment</code> aufgeführt sind) melden{" "}
					<code>notApplicable</code>. Regeln, die Elemente über die Seite hinweg vergleichen (
					<code>landmark-unique</code>, <code>landmark-no-duplicate-banner</code>,{" "}
					<code>-contentinfo</code> und <code>-main</code>,{" "}
					<code>landmark-banner-is-top-level</code>, <code>-complementary-</code>,{" "}
					<code>-contentinfo-</code> und <code>-main-is-top-level</code>,{" "}
					<code>accesskeys</code>, <code>heading-order</code>,{" "}
					<code>identical-links-same-purpose</code>, <code>identical-iframes-same-purpose</code>),
					melden weiterhin, was sie im Scope finden, denn zwei Landmarks, die dort einen Namen
					teilen, teilen ihn auf jeder Seite, melden aber <code>notApplicable</code> statt{" "}
					<code>pass</code>: Der Scan hat nur einen Teil der Seite gesehen und kann daher nicht
					sagen, dass die Seite in Ordnung ist. <code>duplicate-id</code> und{" "}
					<code>duplicate-id-aria</code> vergleichen jedes Element im Scope mit dem ganzen
					Dokument, da sein Duplikat außerhalb des Scopes liegen kann, und melden ein Element im
					Scope, dessen ID irgendwo sonst vorkommt. Ihr <code>pass</code> bedeutet, dass kein
					Element im Scope seine ID mit einem anderen Element der Seite teilt; ein Duplikatpaar
					ganz außerhalb des Scopes wird, wie bei jeder Regel, nicht gemeldet, es sagt also nicht,
					dass die ganze Seite frei von Duplikaten ist. <code>target-size-minimum</code>{" "}
					beurteilt die Ziele im Scope gegen Nachbarn irgendwo im Dokument, da die
					Abstands-Ausnahme davon abhängt, was die Seite neben ein Ziel setzt.{" "}
					<code>text-spacing-content-loss</code> beurteilt den Text im Scope und prüft, ob er
					Text irgendwo auf der Seite zu überlappen beginnt.
				</li>
			</ul>
		</>
	);
}
