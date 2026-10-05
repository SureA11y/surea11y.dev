import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const topLevelRows = [
	{ id: "engine.tag", field: <code>engine.tag</code>, meaning: <>Das Identitäts-Tag der Engine, derzeit <code>"a11ycore"</code>. Jede Regel (eingebaut oder eigene) trägt es in <code>meta.tags</code>; die <code>ruleId</code>s der Regeln selbst stehen ohne Präfix.</> },
	{
		id: "engine.version",
		field: <code>engine.version</code>,
		meaning: (
			<>
				Das Release von <code>@surea11y/core</code>, das das Ergebnis erzeugt hat, etwa{" "}
				<code>"1.10.0"</code>: Das geben Sie in einem Fehlerbericht an, und daran unterscheiden Sie
				Ergebnisse aus zwei Releases. Ein Ergebnis kann sich zwischen Releases ändern, ohne dass
				sich seine Struktur ändert, deshalb ist das nicht <code>schemaVersion</code>. Die
				Reporter für <a href="/results-reports/sarif-report/">SARIF</a> und{" "}
				<a href="/results-reports/earl-report/">EARL</a> verwenden es als Tool-Version, wenn Sie
				keine angeben.
			</>
		),
	},
	{
		id: "engine.schemaVersion",
		field: <code>engine.schemaVersion</code>,
		meaning: (
			<>
				Die Version des Ergebnisschemas (<code>"1.0.0"</code>). Wird erhöht, falls sich die
				Struktur dieses Dokuments je inkompatibel ändert. Fixieren Sie sie, wenn Sie die Ausgabe
				programmatisch parsen. Siehe{" "}
				<a href={`${core}/docs/API_STABILITY.md`}><code>API_STABILITY.md</code></a> für die
				vollständige Liste stabiler und instabiler Felder und die Regeln für Versionssprünge.
			</>
		),
	},
	{
		id: "engine.locale",
		field: <code>engine.locale</code>,
		meaning: (
			<>
				Welches Wörterbuch der Lauf tatsächlich verwendet hat. <code>requested</code> ist Ihr{" "}
				<code>engineOptions.locale</code> nach dem Trimmen (<code>"en"</code>, wenn Sie nichts
				oder keinen String übergeben haben); <code>resolved</code> ist die Locale, deren
				Wörterbuch verwendet wurde; <code>reason</code> erklärt die Zuordnung. Weil der
				Locale-Rückfall stufenweise und pro String erfolgt,{" "}
				<strong>führt die Anfrage nach einer Sprache, die der Build nicht mitbringt, zu
				englischem Text statt zu einem Fehler</strong>. An diesem Feld erkennen Sie das, ohne
				die Strings zu lesen. Wird einmal pro Ergebnis gemeldet: Ein Lauf verwendet durchgehend
				ein Wörterbuch.
			</>
		),
	},
	{
		id: "engine.locale.reason",
		field: <code>engine.locale.reason</code>,
		meaning: (
			<>
				<code>"ok"</code>: Sie haben das angeforderte Wörterbuch bekommen, und es enthält jeden
				Key. <code>"primary-subtag"</code>: Ihr Code hatte ein Subtag ohne eigenes Wörterbuch,
				daher wurde die Basissprache verwendet: <code>"de-DE"</code> wird zu <code>"de"</code>{" "}
				aufgelöst. <code>"dictionary-not-loaded"</code>: Das Projekt liefert diese Sprache aus,
				aber dieser Build bringt sie nicht mit, und es wurde keine übergeben (das eigenständige
				Browser-Bundle ohne seine Locale-Zusatzdatei). <code>"unknown-locale"</code>: Das
				Projekt hat überhaupt keine solche Übersetzung. <code>"partial-dictionary"</code>: Das
				Wörterbuch wurde verwendet, ihm fehlen aber Keys, die es im Englischen gibt, sodass
				diese Strings auf Englisch zurückgefallen sind. Behandeln Sie die Menge als offen;
				spätere Releases können Werte hinzufügen.
			</>
		),
	},
	{
		id: "engine.wcagVersion",
		field: <code>engine.wcagVersion</code>,
		meaning: (
			<>
				Gegen welche WCAG-Version dieser Lauf auf Konformität geprüft hat: Ihr{" "}
				<code>engineOptions.wcagVersion</code>, die Version, die sich aus Ihren
				Versionsursprungs-Tags ergab, oder der Standard <code>"2.2"</code>. Derzeit wirkt sich
				das auf genau eine Sache aus:{" "}
				<strong>Eine Regel, die nur auf Erfolgskriterium 4.1.1 „Syntaxanalyse“ abgebildet ist, kann bei
				einem 2.2-Ziel nicht <code>fail</code> ergeben</strong> (siehe{" "}
				<code>checksResults[i].wcagVersionScope</code> unten). Wird einmal pro Ergebnis
				gemeldet: Ein Lauf hat durchgehend ein Ziel.
			</>
		),
	},
	{
		id: "engine.profile",
		field: <code>engine.profile</code>,
		meaning: (
			<>
				Nur vorhanden, wenn ein <code>engineOptions.profile</code> die Regeln dieses Laufs
				ausgewählt hat, und nennt das Profil in Kleinbuchstaben. Fehlt, wenn keines angefordert
				wurde, und auch, wenn eines angefordert, aber nicht angewendet wurde (unbekannter Name oder
				ein include in <code>runOnly</code> oder <code>engineOptions</code> hat stattdessen die
				Regeln gewählt) — sein Vorhandensein bestätigt also, dass ein Lauf wirklich dieses Profil
				als Ziel hatte. Siehe{" "}
				<a href="/configuration/engine-options/#conformance-profiles">Konformitätsprofile</a>.
			</>
		),
	},
	{
		id: "engine.profileExcludes",
		field: <code>engine.profileExcludes</code>,
		meaning: (
			<>
				Nur vorhanden, wenn das angewendete Profil Regeln auslässt:{" "}
				<code>{"{ rules, criteria }"}</code>, die genannten Regeln und die WCAG-Kriterien, die es
				erlässt. Deren Regeln und WCAG-Zusammenfassungen sind nicht gelaufen. Kein eingebautes
				Profil lässt etwas aus.
			</>
		),
	},
	{
		id: "engine.optInRules",
		field: <code>engine.optInRules</code>,
		meaning: (
			<>
				Nur vorhanden, wenn <code>engineOptions.optInRules</code> mindestens eine Opt-in-Regel
				ausgeführt hat, die die übrige Auswahl nicht ausgeführt hätte. Listet ihre Tags auf. Sein
				Vorhandensein bedeutet, dass das Ergebnis Regeln für Anforderungen jenseits der Zielnorm
				enthält, ein fail also kein WCAG-Verstoß sein muss. Siehe{" "}
				<a href="/configuration/engine-options/#running-every-rule-optinrules">Alle Regeln ausführen</a>.
			</>
		),
	},
	{
		id: "engine.mappings",
		field: <code>engine.mappings</code>,
		meaning: (
			<>
				Nur vorhanden, wenn der Lauf in <code>meta.normativeMappings</code> eine andere Norm als
				WCAG nennt, über <code>engineOptions.mappings</code> oder das Profil einer Norm. Listet sie
				in kanonischer Schreibweise: <code>"en301549"</code> für alle Versionen,{" "}
				<code>"en301549:V3.2.1"</code> für eine. Fehlt es, nennt jedes Ergebnis nur WCAG. Siehe{" "}
				<a href="/configuration/engine-options/#other-standards-mappings">Andere Normen</a>.
			</>
		),
	},
	{
		id: "engine.environment",
		field: <code>engine.environment</code>,
		meaning: (
			<>
				Die Bedingungen, unter denen die Seite dargestellt wurde, beim Start des Scans aus der
				Seite gelesen, bevor irgendeine Regel läuft. Regeln, die das Layout messen, etwa{" "}
				<a href="/rules/text-spacing-content-loss/">
					<code>text-spacing-content-loss</code>
				</a>
				, können für dasselbe Markup bei einer anderen Viewport-Breite oder während noch Webfonts
				laden ein anderes Ergebnis liefern; das hier brauchen Sie also, um einen Lauf zu
				reproduzieren. <code>layout</code> gibt an, ob die Seite ein Layout hatte:{" "}
				<code>false</code> in jsdom und anderen DOM-Emulatoren, und dann ist es das einzige Feld. In
				einem Browser ist <code>viewport</code> <code>innerWidth</code>/<code>innerHeight</code> in
				CSS-Pixeln, <code>devicePixelRatio</code> der Wert der Seite (auch der Browser-Zoom zeigt
				sich hier), <code>colorScheme</code> das, worauf <code>prefers-color-scheme</code> passt,
				und <code>fonts</code> ist <code>"loading"</code>, solange noch eine der Schriften der Seite
				lädt, sonst <code>"loaded"</code>. Ein Feld, das die Seite nicht liefern kann, fehlt. Das
				Auslesen bringt keinen Nichtdeterminismus mit sich: Wie das DOM sind diese Werte Eingabe.
				Für Ergebnisse, die sich zwischen Läufen vergleichen lassen, warten Sie vor dem Scan auf{" "}
				<code>document.fonts.ready</code>. <code>images</code> ist <code>"loading"</code>, solange
				noch ein Bild lädt, sonst <code>"loaded"</code>: Ein Bild, das später ankommt, kann
				verschieben, was Layout-Regeln gemessen haben, scannen Sie für vergleichbare Ergebnisse
				also nach dem <code>load</code>-Event der Seite. Ein Bild mit <code>loading="lazy"</code>{" "}
				wird nicht berücksichtigt, da es wartet, bis gescrollt wird. <code>animationsSettled</code>{" "}
				gibt an, wie viele laufende Animationen und Transitions der Scan angehalten hat: Für den
				Scan wird eine endliche (ein Einblenden) an ihrem Ende gelesen und eine, die sich endlos
				wiederholt (ein Laufband, ein Ladekreisel), an ihrem Anfang, und jede wird danach genau
				dorthin zurückgesetzt, wo sie war. So ergibt eine Seite, die während eines Einblendens
				gescannt wird, dasselbe Ergebnis wie eine danach gescannte. Der Browser zeichnet den
				angehaltenen Zustand nie, da der Scan eine einzige synchrone Aufgabe ist. Jeder Frame in
				einem <a href="#cross-frame-result">Frame-übergreifenden Ergebnis</a> trägt sein eigenes.
			</>
		),
	},
	{ id: "url", field: <code>url</code>, meaning: <>Das übergebene Argument <code>pageUrl</code>, oder <code>document.location.href</code>, wenn Sie <code>null</code> übergeben oder es weggelassen haben, oder <code>null</code>, wenn keins von beiden verfügbar ist.</> },
	{ id: "title", field: <code>title</code>, meaning: <><code>document.title</code> zum Zeitpunkt des Scans, oder <code>null</code>.</> },
	{
		id: "timestamp",
		field: <code>timestamp</code>,
		meaning: (
			<>
				<strong>Wird nicht automatisch erzeugt.</strong> Nur gesetzt, wenn Sie{" "}
				<code>engineOptions.timestamp</code> als nicht leeren String übergeben. Die Engine hat
				keine eingebaute Uhr (bewusst deterministisch). Wenn Sie einen Zeitstempel für den
				Scan im Ergebnis haben möchten, liefern Sie ihn selbst.
			</>
		),
	},
	{
		id: "perfStats",
		field: <code>perfStats</code>,
		meaning: <><code>null</code>, außer bei <code>engineOptions.perfStats: true</code>. Interne Laufzeiten und Zähler; die Struktur wird in diesem Dokument nicht beschrieben, behandeln Sie sie als reines Debug-Werkzeug.</>,
	},
	{
		id: "contextSelector",
		field: <code>contextSelector</code>,
		meaning: (
			<>
				Das übergebene Argument <code>contextSelector</code> (getrimmt): ein String, ein Array
				von Strings (Scan mehrerer Bereiche, siehe{" "}
				<a href="/configuration/engine-options/">Engine-Optionen</a>) oder <code>null</code>,
				wenn keins bzw. ein leeres übergeben wurde.
				</>
				),
				},
				{
				id: "contextMatch",
				field: <code>contextMatch</code>,
				meaning: (
					<>
						Wie der <code>contextSelector</code> aufgelöst wurde, oder <code>null</code>, wenn keiner
						angegeben war. <code>elementCount</code> ist die Zahl der verschiedenen Elemente, auf die
						er gepasst hat, also der Wurzeln des Scans. <code>unmatchedSelectors</code> listet jeden
						Selektor so, wie Sie ihn angegeben haben, der auf kein Element gepasst hat; ein
						kommagetrennter String ist hier ein einziger Selektor, so wie er ein einziger Aufruf von{" "}
						<code>querySelectorAll</code> ist.{" "}
						<strong>Ein <code>elementCount</code> von 0 bedeutet, dass nichts gescannt wurde</strong>:
						Die Seite hat keinen solchen Bereich, jeder Eintrag in <code>checksResults</code> und{" "}
						<code>rulesResults</code> ist <code>notApplicable</code>, und das Ergebnis sagt nichts über
						die Seite aus. Melden Sie es als nicht gefundenen Bereich, nicht als Scan ohne Befunde. Ein
						Selektor, den der Browser nicht parsen kann, erreicht nie ein Ergebnis: Der Scan wirft
						einen Fehler mit <code>code: 'INVALID_CONTEXT_SELECTOR'</code> (siehe{" "}
						<a href="/configuration/engine-options/">Engine-Optionen</a>).
					</>
				),
				},
	{
		id: "checksResults",
		field: <code>checksResults</code>,
		meaning: (
			<>
				Ein Eintrag pro <strong>atomarer Regel</strong>, die gelaufen ist (jede Regel, die nicht
				durch <code>runOnly</code> herausgefiltert wurde, siehe{" "}
				<a href="/configuration/engine-options/">Engine-Optionen</a>).{" "}
				<strong>Jede geladene Regel erzeugt einen Eintrag, auch solche, die{" "}
				<code>notApplicable</code> ergeben</strong>. Das ist keine Liste nur mit Verstößen.
			</>
		),
	},
	{
		id: "rulesResults",
		field: <code>rulesResults</code>,
		meaning: (
			<>
				Ein Eintrag pro <strong>zusammengesetzter Regel (Zusammenfassung)</strong>, die gelaufen
				ist, siehe <a href="#composite-result">Ein zusammengesetztes Ergebnis</a> und{" "}
				<a href="/conformance/wcag-mapping/">Konformität</a>. Normalerweise eine pro
				WCAG-Erfolgskriterium; ein Lauf unter dem Profil einer Norm mit eigenen Zusammenfassungen
				erhält auch diese (mit <code>meta.standard</code>). Leeres Array, wenn keine
				zusammengesetzte Regel zum aktuellen <code>runOnly</code>- bzw. Tag-Filter passte.
			</>
		),
	},
	{
		id: "overriddenBuiltinIds",
		field: <code>overriddenBuiltinIds</code>,
		meaning: (
			<>
				Regel-IDs, bei denen ein Eintrag in <code>engineOptions.customRules</code> dieselbe{" "}
				<code>id</code> wie eine eingebaute Regel hatte, sodass die eigene Implementierung die
				eingebaute für diesen Scan ersetzt hat (siehe{" "}
				<a href="/configuration/engine-options/">Engine-Optionen</a>). Immer ein Array; leer,
				wenn keine Kollision auftrat. Wird beim Scan zusätzlich über <code>console.warn</code>{" "}
				protokolliert, da eine gleichnamige eigene Regel genauso gut eine versehentliche
				Kollision wie ein gewolltes Überschreiben sein kann.
				</>
				),
				},
				{
				id: "skippedCustomRules",
				field: <code>skippedCustomRules</code>,
				meaning: (
					<>
						Die Einträge in <code>engineOptions.customRules</code>, die nicht ausgeführt wurden, jeweils
						als <code>{"{ id, reason }"}</code> (<code>id</code> ist <code>null</code>, wenn der Eintrag
						keine hatte): keine ID, ein <code>runInPage</code>, das keine Funktion ist oder sich nicht
						aus seinem Quelltext wiederherstellen lässt, ein <code>meta</code>, das die Validierung
						nicht besteht, eine ID, die schon eine andere eigene Regel hat, oder die ID einer
						zusammengesetzten Regel. Immer ein Array; leer, wenn jede eigene Regel ausgeführt wurde.
						Jeder Eintrag wird zusätzlich mit <code>console.warn</code> protokolliert. Eine hier
						aufgeführte Regel steht in keinem Ergebnis, so lässt sich ein Scan, der sie ausgelassen
						hat, von einem unterscheiden, in dem sie <code>pass</code> ergab.
					</>
				),
				},
				];

const occurrenceRows = [
	{
		id: "selector",
		field: <code>selector</code>,
		meaning: (
			<>
				Ein nach bestem Bemühen erzeugter CSS-Selektor, der wieder auf das markierte Element
				auflösen soll (siehe <code>helpers.buildSelector</code> in{" "}
				<code>RULE_AUTHORING.md</code>). Bei ungünstig gebauten DOM-Strukturen nicht garantiert
				eindeutig, aber die Engine prüft aktiv, dass er auf das gemeldete Element auflöst, bevor
				sie ihn verwendet. Die Ausnahme ist eine Regel, deren Befund ein <em>fehlendes</em>{" "}
				Element ist: <code>page-title-present</code> meldet <code>head &gt; title</code> mit dem{" "}
				<code>html</code> <code>&lt;title&gt;(missing)&lt;/title&gt;</code>, und keins von
				beiden steht auf der Seite. Beides sind Konstanten, der daraus gebildete Fingerprint
				bleibt also stabil, aber{" "}
				<strong>behandeln Sie <code>selector</code> nicht als auflösbar und <code>html</code>{" "}
				nicht als echtes Markup, ohne zu prüfen, dass die Regel etwas Existierendes gemeldet
				hat</strong>. Bei einem Element in einem Shadow Tree löst <code>selector</code> innerhalb
				seiner Shadow Root auf, und <code>shadowHostSelectors</code> gibt an, wie man dorthin
				gelangt.
				</>
				),
				},
				{
				id: "shadowHostSelectors",
				field: <code>shadowHostSelectors</code>,
				meaning: (
					<>
						Nur bei einem Element in einem Shadow Tree vorhanden: die Selektoren der Shadow Hosts, die
						zu ihm führen, vom äußersten an, jeder in dem Baum aufgelöst, der ihn enthält, sodass{" "}
						<code>document.querySelector(s[0]).shadowRoot.querySelector(s[1])…shadowRoot.querySelector(selector)</code>{" "}
						das Element findet. Zwei Komponenten mit gleichem Inhalt ergeben denselben{" "}
						<code>selector</code> und unterscheiden sich hier. Wie <code>selector</code> gehört es
						nicht zur Identität eines Befunds.
					</>
				),
				},
	{
		id: "html",
		field: <code>html</code>,
		meaning: (
			<>
				Ein Outer-HTML-Ausschnitt des markierten Elements, nach 2.000 Zeichen abgeschnitten.
				Nützlich, um das Element zu zeigen, und bei einem Element in einem Shadow Tree zusammen mit{" "}
				<code>shadowHostSelectors</code> zu lesen. Bei <code>&lt;html&gt;</code>,{" "}
				<code>&lt;head&gt;</code> und <code>&lt;body&gt;</code>, die die ganze Seite enthalten, ist
				es nur das Start-Tag (<code>&lt;html class="x"&gt;</code>), sodass ein Befund auf
				Seitenebene seine Identität behält, wenn sich anderer Inhalt ändert.
			</>
		),
	},
	{
		id: "structuralPath",
		field: <code>structuralPath</code>,
		meaning: (
			<>
				Der Pfad aus Geschwister-Indizes von <code>documentElement</code> hinunter zum markierten
				Element (z. B. <code>[1, 0, 2]</code>); <code>[]</code>, wenn das Element selbst{" "}
				<code>documentElement</code> <em>ist</em>, <code>null</code>, wenn er sich nicht
				bestimmen ließ, was für jedes Element in einem Shadow Tree gilt (verwenden Sie dort{" "}
				<code>shadowHostSelectors</code> und <code>selector</code>). Ein robusterer Mechanismus zur Identifizierung von Elementen als{" "}
				<code>selector</code> allein: Er übersteht DOM-Änderungen, an denen ein Selektor-String
				scheitern würde (etwa eine umbenannte ID oder Klasse), um{" "}
				<strong>den Preis, dass er sich nicht als echter CSS-Selektor verwenden lässt</strong>.
			</>
		),
	},
	{ id: "summary", field: <code>summary</code>, meaning: <>Für Menschen lesbar, bereits lokalisiert („<span lang="en">This button has no accessible name.</span>“).</> },
	{ id: "hint", field: <code>hint</code>, meaning: "Für Menschen lesbare Hinweise zur Behebung, bereits lokalisiert." },
	{
		id: "i18n",
		field: <code>i18n</code>,
		meaning: (
			<>
				Die rohen Übersetzungs-Keys hinter <code>summary</code>/<code>hint</code>, falls Sie sie
				selbst in einer anderen Locale neu rendern möchten, ohne den Scan zu wiederholen.{" "}
				<code>null</code>, wenn das Vorkommen keine Key-basierte i18n verwendet hat.
			</>
		),
	},
	{
		id: "data.visibilityFilter",
		field: <code>data.visibilityFilter</code>,
		meaning: (
			<>
				Bei den meisten Vorkommen vorhanden: warum die Engine dieses Element nach dem
				Eignungsmodell der jeweiligen Regel als geeignet (oder nicht) eingestuft hat.{" "}
				<code>eligible</code> ist dieses Ergebnis (fehlt bei den Befunden auf Seitenebene von{" "}
				<code>bypass-blocks-present</code>, <code>html-lang-attr-present</code> und{" "}
				<code>page-title-present</code>); <code>targetSet</code> gibt an, welches Modell
				es erzeugt hat (<code>'dom'</code>: reine DOM/CSS-Sichtbarkeit, die meisten Regeln;{" "}
				<code>'acc'</code>: Eignung laut Accessibility Tree). <code>accEligible</code> spiegelt{" "}
				<code>eligible</code> nur, wenn <code>targetSet</code> <code>'acc'</code> ist, sonst{" "}
				<code>null</code>. <code>reasons</code> ist bei <code>eligible: false</code> eine Liste
				maschinenlesbarer Ausschlusscodes.
			</>
		),
	},
	{
		id: "data.details",
		field: <code>data.details</code>,
		meaning: (
			<>
				Regelspezifische strukturierte Daten (berechnete Metriken, aufgelöste Referenzen),{" "}
				<strong>nicht normativ</strong>: nützlich für eine reichhaltigere UI oder zum Debuggen,
				ändert aber nie, was <code>outcome</code>/<code>severity</code> bedeuten. Die Struktur
				variiert je nach Regel; behandeln Sie sie als zusätzlichen Kontext ohne Gewähr, nicht als
				stabilen Vertrag. Die einzige Ausnahme ist <code>data.details.reasonCode</code>, das{" "}
				<strong>sehr wohl</strong> stabil ist: Es gibt an, <em>welcher</em> der Befunde einer
				Regel das ist, und bildet zusammen mit <code>ruleId</code> und <code>html</code> den
				Fingerprint, an dem Baselines und SARIF festgemacht sind. Siehe{" "}
				<a href={`${core}/docs/API_STABILITY.md#finding-identity`}>
					<code>API_STABILITY.md</code>
				</a>
				. Die Seite jeder Regel listet unter „Was ein Befund meldet“ die Felder auf, die ihre
				Befunde mitführen.
			</>
		),
	},
	{
		id: "occurrenceOutcome",
		field: <code>occurrenceOutcome</code>,
		meaning: (
			<>
				Zu welcher Stufe dieses Vorkommen gehört, bei einer Regel, die ihre Befunde in eine
				sichere <code>fail</code>-Stufe und eine prüfbedürftige <code>cantTell</code>-Stufe
				eingeteilt hat. Eine Regel, die nur eine Stufe meldet, lässt das Feld weg; dann ist das{" "}
				<code>outcome</code> des Ergebnisses selbst die Stufe des Vorkommens.
			</>
		),
	},
	{ id: "uncertainty", field: <code>uncertainty</code>, meaning: <>Warum sich dieser Befund nicht entscheiden ließ, siehe <a href="#uncertainty-codes">Unsicherheitscodes</a> unten.</> },
];

const uncertaintyRows = [
	{ id: "not-computable", code: <code>not-computable</code>, meaning: "Die Evidenz, die die Regel brauchte, ließ sich in dieser Umgebung nicht lesen.", shape: "Ein Cross-Origin-Stylesheet, eine Hintergrundfarbe, die zu keinem Wert auflöst, ein src, das sich nicht auflösen lässt." },
	{ id: "runtime-dependent", code: <code>runtime-dependent</code>, meaning: "Das Markup kann es nicht klären, weil ein Skript zur Laufzeit entscheidet.", shape: "Ein aria-controls, das auf ein Element verweist, das das Widget erst beim Öffnen erzeugt." },
	{ id: "spec-only", code: <code>spec-only</code>, meaning: "Ein echter Verstoß gegen die Spezifikation, aber Name, Rolle und Wert bleiben trotzdem zugänglich, sodass kein Erfolgskriterium als nicht erfüllt feststeht.", shape: "Ein ARIA-Attribut, für dessen Fehlen die Spezifikation einen Standardwert vorsieht." },
	{ id: "equivalence-unknown", code: <code>equivalence-unknown</code>, meaning: "Zwei Dinge dienen womöglich demselben Zweck, womöglich nicht, und weder Markup noch Inhalt klären das.", shape: "Zwei Frames mit demselben zugänglichen Namen, die verschiedene Ressourcen einbetten." },
	{ id: "judgement-required", code: <code>judgement-required</code>, meaning: "Die Frage kann grundsätzlich nur ein Mensch beantworten.", shape: "Ob ein zu kleines Ziel unverzichtbar ist; jede Regel mit type: \"manual\"." },
	{ id: "out-of-scope", code: <code>out-of-scope</code>, meaning: "Der Befund ist real, liegt aber außerhalb des Standards, gegen den dieser Lauf prüft.", shape: "Eine Regel, die nur auf ein Kriterium abgebildet ist, das die WCAG-Zielversion entfernt hat." },
];

const outcomeRows = [
	{ id: "fail", outcome: <code>fail</code>, meaning: "Deterministischer, normativer Verstoß: Das Entscheidungsverfahren rät an keiner Stelle.", manual: "Nein (zu cantTell umgewandelt)" },
	{ id: "pass", outcome: <code>pass</code>, meaning: "Die Ziele, auf die die Regel anwendbar ist, existieren, und keines wurde markiert.", manual: "Ja" },
	{ id: "cantTell", outcome: <code>cantTell</code>, meaning: "Erfordert menschliches Urteil: entweder wirklich mehrdeutig oder ein Hinweis einer manuellen Regel.", manual: "Ja" },
	{ id: "notApplicable", outcome: <code>notApplicable</code>, meaning: "Die Regel hat auf dieser Seite bzw. in diesem Bereich keine Elemente gefunden, auf die sie anwendbar ist.", manual: "Ja" },
];

export function OutputSchemaContent() {
	return (
		<>
			<p>
				Dies ist die genaue Struktur des Objekts, das <code>runDomRulesInPage(...)</code> /{" "}
				<code>runa11yCoreInPage(...)</code> zurückgibt (welche davon Sie aufrufen, steht in{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>). Jedes Beispiel
				auf dieser Seite ist echte Ausgabe der aktuellen Engine (
				<code>schemaVersion: "1.0.0"</code>), nicht von Hand geschrieben.{" "}
				<code>runa11yCoreAcrossFrames</code> gibt eine andere, rekursive Struktur zurück, die
				diese umschließt, siehe <a href="#cross-frame-result">Frame-übergreifendes Ergebnis</a>{" "}
				unten.
			</p>

			<h2 id="top-level-result">Ergebnis auf oberster Ebene</h2>
			<CodeBlock
				lines={[
					"{",
					"  engine: {",
					"    tag: string,",
					"    schemaVersion: string,",
					"    locale: { requested: string, resolved: string, reason: string },",
					'    wcagVersion: "2.0" | "2.1" | "2.2",',
					'    profile?: string,      // "wcag22-aa", "en301549-v4.1.1", "en301549-v3.2.1", "section508", or a registered standard\'s own',
					'    mappings?: string[],   // e.g. ["en301549"] or ["en301549:V3.2.1"]',
					"    environment: {",
					"      layout: boolean,",
					"      viewport?: { width: number, height: number },  // CSS px",
					"      devicePixelRatio?: number,",
					'      colorScheme?: "light" | "dark",',
					'      fonts?: "loaded" | "loading"',
					"    }",
					"  },",
					"  url: string | null,",
					"  title: string | null,",
					"  timestamp: string | null,",
					"  perfStats: object | null,",
					"  contextSelector: string | string[] | null,",
					"  contextMatch: { elementCount: number, unmatchedSelectors: string[] } | null,",
					"  checksResults: CheckResult[],",
					"  rulesResults: CompositeResult[],",
					"  overriddenBuiltinIds: string[],",
					"  skippedCustomRules: Array<{ id: string | null, reason: string }>",
					"}",
				]}
			/>
			<DataTable
				label="Felder des Ergebnisses auf oberster Ebene"
				rowKey="id"
				columns={[
					{ key: "field", label: "Feld", width: "22%" },
					{ key: "meaning", label: "Bedeutung", wrap: true },
				]}
				rows={topLevelRows}
			/>

			<h2 id="cross-frame-result">Frame-übergreifendes Ergebnis (<code>runa11yCoreAcrossFrames</code>)</h2>
			<p>
				<code>runa11yCoreAcrossFrames</code> (siehe{" "}
				<a href={`${core}/docs/INTEGRATION.md#cross-frame-scanning-including-cross-origin`}>
					<code>INTEGRATION.md</code>
				</a>
				) gibt statt eines einfachen Ergebnisses auf oberster Ebene eine andere, rekursive
				Struktur zurück:
			</p>
			<CodeBlock
				lines={[
					"{",
					"  topFrame: <the normal top-level result shape above>,",
					"  frames: Array<",
					"    | { url: string | null, topFrame: <top-level result>, frames: [...same shape, recursively] }",
					"    | { url: string | null, error: string }",
					"  >",
					"}",
				]}
			/>
			<ul>
				<li>
					<code>topFrame</code> hat genau die Struktur des{" "}
					<a href="#top-level-result">Ergebnisses auf oberster Ebene</a>, für den Frame, in dem
					die Funktion aufgerufen wurde.
				</li>
				<li>
					<code>frames</code> hat einen Eintrag pro direktem Kind-<code>&lt;iframe&gt;</code>/
					<code>&lt;frame&gt;</code> im gescannten Bereich. Ein erreichbares Kind (eines, das{" "}
					<code>a11yCoreEnableFrameResponder()</code> aufgerufen hat) liefert sein eigenes
					vollständiges <code>{"{ url, topFrame, frames }"}</code>, einschließlich{" "}
					<em>seiner eigenen</em> verschachtelten <code>frames</code>, rekursiv, denn ein tiefer
					verschachteltes Enkel-Frame ist nur über sein unmittelbares Eltern-Frame erreichbar.
					Ein nicht erreichbares Kind (der Normalfall bei den meisten Einbettungen von
					Drittanbietern: kein kooperierender Responder, oder er hat das Zeitlimit überschritten)
					liefert stattdessen <code>{"{ url, error }"}</code> und bricht den Rest des Scans nicht
					ab.
				</li>
				<li>
					Das ist ein <strong>Baum, keine flache Liste</strong>. Das ist ein bewusster
					Unterschied zu <code>.frames(true)</code> im Binding <code>@surea11y/playwright</code>,
					das <em>abflachen kann</em>, weil <code>page.frames()</code> in Playwright ohnehin jedes
					Frame unabhängig von der Verschachtelungstiefe liefert. Ein <code>postMessage</code>-Relay
					hat keine solche Gesamtsicht, deshalb wird die Verschachtelung stattdessen strukturell
					abgebildet.
					</li>
					<li>
						<strong>Die Reporter nehmen ein einzelnes Ergebnis der obersten Ebene, nicht diesen
						Baum.</strong> <code>renderHtmlReport</code>, <code>renderSarifReport</code>,{" "}
						<code>renderJunitReport</code>, <code>buildBaselineEntries</code> und{" "}
						<code>matchBaseline</code> werfen einen <code>TypeError</code>, wenn sie etwas anderes
						erhalten als ein Objekt mit einem Array <code>checksResults</code> (ein Frame-übergreifendes
						Ergebnis, ein Array, <code>null</code> oder <code>undefined</code> aus einem
						fehlgeschlagenen Scan), statt es als Scan ohne Befunde darzustellen. Übergeben Sie{" "}
						<code>topFrame</code> und den <code>topFrame</code> jedes Frames in eigenen Aufrufen.{" "}
						<code>renderEarlReport</code> nimmt den Baum, wie er ist: Jeder Frame, der geantwortet hat,
						wird ein eigenes Subjekt, über seine URL zugeordnet.
					</li>
					</ul>

			<h2>Ein Prüfergebnis (<code>checksResults[i]</code>)</h2>
			<CodeBlock
				lines={[
					"{",
					"  ruleId: string,",
					'  outcome: "pass" | "fail" | "cantTell" | "notApplicable",',
					'  outcomeNormalized: "pass" | "fail" | "cantTell" | "inapplicable",',
					'  severity: "minor" | "moderate" | "serious" | "critical",',
					'  confidence: "high" | "medium" | "low",',
					'  type: "automatic" | "manual",',
					"  occurrences: Occurrence[],",
					"  title: string,",
					"  description: string,",
					"  i18n: { titleKey: string, descriptionKey: string } | null,",
					"  meta: {",
					"    ruleId: string,",
					"    ruleInterfaceVersion: string,",
					"    ruleVersion: string,",
					"    normative: boolean,",
					"    atomic: boolean,",
					"    deprecated: boolean,",
					"    deprecation: object | null,",
					'    category: "perceivable" | "operable" | "understandable" | "robust" | null,',
					"    normativeMappings: Array<{ standard: string, version: string, requirement: string, title: string, conformanceLevel?: string, wcagSc?: string[] }>,",
					"    standard: string | null,",
					"    applicability: string,",
					"    expectation: string,",
					"    references: string[],",
					"    requirements: object | null,",
					"    mappings: object | null",
					"  },",
					"  engineOptions: object,   // the resolved engineOptions this rule actually ran under",
					"  schemaVersion: string,",
					"  rollupIds: string[],     // the rulesResults entries that group this rule in this run; [] if none",
					"  data?: object,           // page-level data a rule reports whatever its outcome; see below",
					"  margin?: {               // the closest a measurement came to its threshold while meeting it; see below",
					'    measure: string,       // "contrast-ratio" | "overflow-px" | "target-size-px" | ... (open set)',
					'    unit: "px" | "ratio",  // open set',
					'    limit: "min" | "max",',
					"    threshold: number,",
					"    value: number,",
					"    headroom: number,      // >= 0",
					"    measuredCount: number,",
					"    selector?: string,",
					"    shadowHostSelectors?: string[],  // as on an occurrence",
					"    structuralPath?: number[],",
					"    context?: object       // rule-specific; not a stable contract",
					"  },",
					"  wcagVersionScope?: {     // present only when the target WCAG version changed this outcome",
					'    target: "2.0" | "2.1" | "2.2",',
					"    removedSc: string[],",
					'    coercedFrom: "fail"',
					"  },",
					"  error?: string           // present only if the rule threw — see below",
					"}",
				]}
			/>
			<p>Hinweise:</p>
			<ul>
				<li>
					<strong><code>outcome</code> vs. <code>outcomeNormalized</code></strong>: identisch, nur
					dass <code>notApplicable</code> in <code>outcomeNormalized</code> zu{" "}
					<code>"inapplicable"</code> wird. Beide werden geliefert, damit Sie entweder Ihr eigenes
					Vokabular oder das interne der Engine abgleichen können.
				</li>
				<li>
					<strong>Regeln mit <code>type: "manual"</code> können nie <code>outcome: "fail"</code>{" "}
					melden.</strong> Würde die eigene Logik einer manuellen Regel <code>fail</code> ergeben,
					wandelt die Engine das zu <code>cantTell</code> um und hängt einen erklärenden Hinweis an{" "}
					<code>error</code> an. Das wird zentral durchgesetzt (
					<code>policy.coerceManualFailToCantTell</code>, im Policy-Vertrag <code>a11y</code>{" "}
					standardmäßig aktiv; siehe{" "}
					<a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a>) und muss nicht von jeder
					Regel selbst beachtet werden. <code>fail</code> ist ausschließlich deterministischen
					Befunden mit <code>type: "automatic"</code> vorbehalten.
				</li>
				<li>
					<strong><code>meta.normativeMappings</code></strong> verknüpft ein Prüfergebnis mit einem
					WCAG-Erfolgskriterium; <code>[]</code> bei Regeln ohne formale WCAG-Zuordnung (das sind die
					Hinweisregeln mit <code>type: "manual"</code> sowie die automatische Best-Practice-Regel{" "}
					<code>aria-allowed-role</code>). Wie diese
					zusammengefasst werden, steht unter <a href="/conformance/wcag-mapping/">Konformität</a>.{" "}
					<strong>Die Liste enthält nicht nur WCAG.</strong> Fordert der Scan eine andere Norm an (
					<code>engineOptions.mappings</code> oder das Profil einer Norm), folgt auf jedes
					WCAG-Kriterium die entsprechende Anforderung dieser Norm, etwa die EN-301-549-Klausel, die
					es wiedergibt (
					<code>{'{ standard: "EN 301 549", version: "V3.2.1" | "V4.1.1", requirement: "9.1.1.1", title, wcagSc: ["1.1.1"] }'}</code>
					, ein Eintrag pro Version, die das Kriterium enthält); außerdem kann eine Regel die
					Understanding-Dokumente der WCAG zitieren (<code>type: "Understanding"</code>). Filtern Sie
					nach <code>standard</code> (und nach fehlendem <code>type</code>), bevor Sie{" "}
					<code>requirement</code> als Erfolgskriterium lesen. Der WCAG-Eintrag einer
					zusammengesetzten Regel steht immer zuerst. Siehe{" "}
					<a href="/conformance/wcag-mapping/#en-301-549">EN 301 549</a>.
				</li>
				<li>
					<strong><code>rollupIds</code></strong> listet die zusammengesetzten Regeln in{" "}
					<code>rulesResults</code>, die diese Regel in diesem Lauf gruppieren. Eine leere Liste
					bedeutet, dass die Befunde der Regel in keiner Zusammenfassung erscheinen; wer nur{" "}
					<code>rulesResults</code> liest, sieht sie also nie. <code>heading-order</code> gehört zum
					Beispiel zu keiner WCAG-Zusammenfassung.
				</li>
				<li>
					<strong><code>wcagVersionScope</code></strong>: nur vorhanden, wenn die WCAG-Zielversion
					des Laufs das <code>fail</code> dieser Regel in ein <code>cantTell</code> verwandelt
					hat. Derzeit betrifft das eine auf Erfolgskriterium 4.1.1 „Syntaxanalyse“ abgebildete Regel (
					<code>duplicate-id</code>) beim Standardziel 2.2, da 2.2 dieses Kriterium entfernt hat.{" "}
					<code>removedSc</code> listet die Kriterien, die weggefallen sind, <code>target</code>{" "}
					ist die Version, die sie entfernt hat, und <code>coercedFrom</code> ist das Ergebnis, das
					die Regel selbst gemeldet hat. Die Vorkommen sind die der Regel, unverändert: Nichts
					wurde verworfen, nur das Konformitätsurteil. Fehlt bei jedem anderen Ergebnis und wird{" "}
					<strong>nie</strong> über <code>error</code> gemeldet: Es ist nichts schiefgegangen.
					Siehe{" "}
					<a href="/configuration/engine-options/#filtering-by-wcag-version">Filtern nach WCAG-Version</a>.
				</li>
				<li>
					<strong><code>data</code></strong>: nur bei einer Regel vorhanden, die unabhängig von
					ihrem Ergebnis etwas über die ganze Seite meldet. Keine Core-Regel tut das derzeit. Wie{" "}
					<code>data.details</code> bei einem Vorkommen ist es kein stabiler Vertrag.
					</li>
					<li id="margin">
						<strong><code>margin</code></strong>: nur bei einer Regel vorhanden, die im Katalog eine
						deklariert (<code>getChecksCatalog()[i].margin</code>,{" "}
						<code>{"{ measure, unit, limit }"}</code>), und nur, wenn mindestens ein Element den
						Schwellenwert der Regel erfüllt hat. Es nennt das Element, das dem Schwellenwert am
						nächsten kam und ihn dabei erfüllte. So lässt sich ein <code>pass</code> mit 4,52:1 bei
						geforderten 4,5:1 oder 0,4 px vor abgeschnittenem Text von einem mit reichlich Abstand
						unterscheiden. Es steht neben dem Ergebnis und ist kein Befund: Es fügt nie ein Vorkommen
						hinzu, entfernt oder ändert keines, und Baselines, SARIF, JUnit und EARL ignorieren es. Es
						wird auch bei <code>fail</code>- und <code>cantTell</code>-Ergebnissen gemeldet, wenn
						einige Elemente bestanden haben. <code>limit</code> ist <code>min</code>, wenn der Wert den
						Schwellenwert erreichen muss (Kontrast, Größe), und <code>max</code>, wenn er darunter
						bleiben muss (Überlauf); <code>headroom</code> ist der verbleibende Abstand in{" "}
						<code>unit</code>, also <code>value - threshold</code> bei <code>min</code> und{" "}
						<code>threshold - value</code> bei <code>max</code>, nie negativ. <code>threshold</code> ist
						der Schwellenwert, an dem dieses Element gemessen wurde; er kann sich zwischen Elementen
						unterscheiden (3:1 für großen Text). Pixel werden mit einer Nachkommastelle angegeben:
						CSS-Pixel und Schwellenwerte wie die Hälfte einer 15px-Schrift sind Bruchzahlen, und eine
						Anzeige rundet sie für Menschen. Ein Verhältnis wird nicht gerundet, da WCAG Kontrast nicht
						rundet. Bei Gleichstand gewinnt das in der Dokumentreihenfolge erste Element, sodass eine
						Seite jedes Mal denselben Wert ergibt. <code>measure</code> und <code>unit</code> sind
						offene Mengen, die in einem Minor-Release wachsen können; <code>context</code> ist
						regelspezifisch und, wie <code>data.details</code>, kein stabiler Vertrag.{" "}
						<code>getMargins(result)</code> gibt alle Werte eines Ergebnisses als{" "}
						<code>{"[{ ruleId, ...margin }]"}</code> zurück, sortiert nach <code>ruleId</code>.
					</li>
				<li>
					<strong><code>error</code></strong>: nur in drei Fällen vorhanden: Die
					Regelimplementierung hat eine nicht abgefangene Exception geworfen, die oben
					beschriebene Umwandlung manueller <code>fail</code>-Ergebnisse hat gegriffen, oder bei
					jedem Vorkommen eines <code>fail</code>-Ergebnisses ist der Durchlauf über die Vorfahren
					an ein internes Tiefenlimit gestoßen (die Engine konnte also nicht bestätigen, dass der
					markierte Inhalt tatsächlich zugänglich gemacht wird), und das gesamte Ergebnis wurde auf
					dieselbe Weise zu <code>cantTell</code> umgewandelt. Eine Regel, die eine Exception
					wirft, erscheint immer als <code>outcome: "cantTell"</code> mit{" "}
					<code>occurrences: []</code> und der Exception-Meldung in <code>error</code>. Die Engine
					lässt nie zu, dass eine einzelne defekte Regel den ganzen Scan zum Absturz bringt.
				</li>
				<li>
					<strong><code>engineOptions</code></strong> ist in jedem Ergebnis das{" "}
					<em>aufgelöste</em> Optionsobjekt (nach Anwendung der Standardwerte für Locale und
					Kontrast), nicht wörtlich das, was Sie übergeben haben. Nützlich, um zu prüfen, was eine
					bestimmte Regel tatsächlich gesehen hat, insbesondere die aufgelöste{" "}
					<code>locale</code> und <code>contrast.mode</code>/
					<code>contrast.rootCanvasFallback</code>. Es lässt <code>messages</code> weg, die
					Wörterbücher, mit denen der Lauf übersetzt hat (eine separate Locale-Datei im Browser-Bundle
					oder Ihre eigenen Strings): Sie sind Daten, keine Einstellung, und eine Kopie in jedem
					Ergebnis machte einen Scan zig Megabyte groß. <code>engine.locale</code> gibt an, welches
					Wörterbuch verwendet wurde. Zwei weitere Optionen werden so wiedergegeben, wie die Regeln
					sie gesehen haben, damit das Ergebnis einfache Daten bleibt, die{" "}
					<code>JSON.stringify</code> und <code>structuredClone</code> (<code>postMessage</code>)
					transportieren können: <code>probes</code> als die gekappte Kopie, die die Regeln lesen, und{" "}
					<code>customRules</code> als <code>{"[{ id }]"}</code>, ein Eintrag je eigener Regel mit ID,
					ohne ihre Funktionen.
					</li>
			</ul>

			<h2 id="occurrence">Ein Vorkommen (<code>occurrences[i]</code>)</h2>
			<p>
				Normalerweise nur vorhanden, wenn <code>outcome</code> <code>fail</code> oder{" "}
				<code>cantTell</code> ist: Ein <code>pass</code>-Ergebnis hat{" "}
				<code>occurrences: []</code>, da diese Engine nicht die Elemente aufzählt, die bestanden
				haben, sondern nur die markierten. Die Kontrastregeln sind die Ausnahme: Ihr{" "}
				<code>pass</code> trägt ein Vorkommen, das den Scan beschreibt (wie viel Text in Frage kam
				und berechenbar war), mit leerem <code>selector</code>, damit sich ein <code>pass</code>{" "}
				ohne jeden Text von einem über eine Seite voller Text unterscheiden lässt.
				</p>
			<p>
				<code>notApplicable</code> ist die einzige Ausnahme. Eine Regel, die nichts zu beurteilen
				hatte, kann ein einzelnes Vorkommen mit der Begründung anhängen, und die Kontrastregeln
				tun genau das, wenn kein Text einen berechenbaren Hintergrund hatte. Den Unterschied
				zwischen „geprüft, nichts zu melden“ und „konnte nicht prüfen“ meldet diese Engine, statt
				ihn zu verbergen. Ein solches Vorkommen beschreibt den Scan, kein Element, deshalb ist
				sein <code>selector</code> leer.{" "}
				<strong>Lesen Sie <code>occurrences.length</code> nicht als Anzahl der Verstöße, ohne
				vorher <code>outcome</code> zu prüfen.</strong>
			</p>
			<CodeBlock
				lines={[
					"{",
					"  selector: string,",
					"  html: string,",
					"  structuralPath: number[] | null,",
					"  shadowHostSelectors?: string[],",
					"  summary: string,",
					"  hint: string,",
					"  i18n: { summaryKey: string, hintKey: string, params: object } | null,",
					'  occurrenceOutcome?: "fail" | "cantTell",   // present when the rule graded its findings into tiers',
					"  uncertainty?: {          // present only on a cantTell-tier occurrence",
					'    code: "not-computable" | "runtime-dependent" | "spec-only"',
					'        | "equivalence-unknown" | "judgement-required" | "out-of-scope",',
					"    needed?: string,       // what would settle the question",
					"    evidence?: object      // what the rule did establish, rule-specific",
					"  },",
					"  data?: {               // absent on manual-review's page-level finding",
					"    visibilityFilter?: { eligible?: boolean, targetSet: string, accEligible: boolean | null, reasons: string[] },",
					"    details?: object   // rule-specific, non-normative — see below",
					"  }",
					"}",
				]}
			/>
			<DataTable
				label="Felder eines Vorkommens"
				rowKey="id"
				columns={[
					{ key: "field", label: "Feld", width: "22%" },
					{ key: "meaning", label: "Bedeutung", wrap: true },
				]}
				rows={occurrenceRows}
			/>

			<h3 id="uncertainty-codes">Unsicherheitscodes</h3>
			<p>
				Ein <code>cantTell</code> besagt, dass die Engine nicht entschieden hat.{" "}
				<code>uncertainty</code> sagt <strong>warum</strong>, aus einem geschlossenen Vokabular,
				sodass ein Konsument nach dem Grund verzweigen kann, statt einen Zusammenfassungs-String
				zu parsen. Es ist nur bei einem Vorkommen der <code>cantTell</code>-Stufe vorhanden: Ein
				Vorkommen der <code>fail</code>-Stufe würde behaupten, dass die Regel zugleich entschieden
				und nicht entschieden hat, daher entfernt die Engine es dort.
			</p>
			<DataTable
				label="Unsicherheitscodes"
				rowKey="id"
				columns={[
					{ key: "code", label: "code", width: "20%" },
					{ key: "meaning", label: "Bedeutung", wrap: true, width: "40%" },
					{ key: "shape", label: "Typischer Fall", wrap: true },
				]}
				rows={uncertaintyRows}
			/>
			<p>
				<code>needed</code> nennt in einem Satz, was die Frage klären würde, also das, was eine
				prüfende Person nachsehen muss. <code>evidence</code> enthält, was die Regel{" "}
				<em>tatsächlich</em> festgestellt hat, damit die Prüfung auf der Arbeit der Engine
				aufbaut, statt sie zu wiederholen; die Struktur ist regelspezifisch und, wie{" "}
				<code>data.details</code>, kein stabiler Vertrag. Der <code>code</code> dagegen schon:
				Neue Codes können in einem Minor-Release hinzukommen, aber ein bestehender ändert seine
				Bedeutung nicht. Verzweigen Sie also nach den Codes, die Sie kennen, und{" "}
				<strong>behandeln Sie einen unbekannten als „muss geprüft werden“, nicht als
				Fehler</strong>.
			</p>
			<p>
				Jede automatische Regel, die <code>cantTell</code> melden kann, liefert dieses Feld, und
				ein Test stellt das sicher, damit keine neue Regel ohne es hinzukommt. Den Code{" "}
				<code>out-of-scope</code> hängt die Engine an, nicht eine Regel, und zwar an genau die
				Vorkommen, die auf Ergebnisebene ein <code>wcagVersionScope</code> erzeugen. Manuelle
				Regeln liefern es nicht: <code>judgement-required</code> ist genau das, was{" "}
				<code>type: "manual"</code> bereits bedeutet, eine Wiederholung pro Vorkommen würde also
				nichts sagen, was das Ergebnis nicht schon sagt.
			</p>

			<h2 id="composite-result">Ein zusammengesetztes Ergebnis (<code>rulesResults[i]</code>)</h2>
			<p>
				Zusammengesetzte Regeln fassen mehrere atomare Regeln zu einem WCAG-Erfolgskriterium
				zusammen (z. B. fasst <code>wcag-1.1.1-non-text-content</code> 21 atomare Regeln
				zusammen). Unter dem Profil einer Norm mit eigenen Zusammenfassungen gibt es zusätzlich
				diese, mit dem Wortlaut der Norm als <code>title</code> und ihrem Namen als{" "}
				<code>meta.standard</code>. Die Struktur ist dieselbe Hülle wie bei einem Prüfergebnis, mit
				spezifischen <code>data.details</code> für zusammengesetzte Regeln:
			</p>
			<CodeBlock
				lines={[
					"{",
					'  ruleId: string,              // e.g. "wcag-1.1.1-non-text-content"',
					'  outcome: "pass" | "fail" | "cantTell" | "notApplicable",',
					"  severity, confidence, type, title, description, meta, engineOptions, schemaVersion,  // as on a check result, except that",
					"                                // meta.normativeMappings names the criterion in a shorter form:",
					"                                // { standard, requirement, level }",
					"  occurrences: [],              // always empty — composites are rollups, not element-level findings",
					"  data: {",
					"    details: {",
					'      reasonCode: string,       // e.g. "composite.rollup.fail.anyFail"',
					"      standard?: string,        // a standard's own rollup only, with version and criterion",
					"      version?: string,",
					"      criterion?: string,",
					"      checksIds: string[],      // every atomic ruleId this composite rolls up",
					"      contributors: Array<{ testId: string, outcome: string, severity: string | null }>,",
					"      metrics: { failCount, cantTellCount, notApplicableCount, passCount, missingCount }",
					"    }",
					"  }",
					"}",
				]}
			/>
			<p>
				Vorrang bei der Zusammenfassung (deterministisch, in dieser Reihenfolge):{" "}
				<strong>irgendein Beitrag <code>fail</code> → zusammengesetzt <code>fail</code></strong>;
				sonst <strong>irgendein <code>cantTell</code> (oder eine beitragende Regel, die gar nicht
				gelaufen ist, <code>missingCount &gt; 0</code>) → zusammengesetzt{" "}
				<code>cantTell</code></strong>; sonst{" "}
				<strong>alle Beiträge <code>notApplicable</code> → zusammengesetzt{" "}
				<code>notApplicable</code></strong>; sonst <strong><code>pass</code></strong>. Was das für
				eine Gesamtaussage zur Konformität bedeutet, steht unter{" "}
				<a href="/conformance/wcag-mapping/">Konformität</a>.
			</p>

			<h2>Ergebniswerte</h2>
			<DataTable
				label="Ergebniswerte"
				rowKey="id"
				columns={[
					{ key: "outcome", label: "Ergebnis", width: "16%" },
					{ key: "meaning", label: "Bedeutung", wrap: true },
					{ key: "manual", label: 'Bei type: "manual" möglich?', width: "22%" },
				]}
				rows={outcomeRows}
			/>
			<p>
				<code>fail</code> ist in dieser Engine bewusst das engste Ergebnis mit der höchsten Hürde:
				deterministischen, normativen Verstößen vorbehalten;{" "}
				<strong>das Streben nach mehr Regelabdeckung darf es nie verwässern</strong>.
			</p>

			<h2>Werte für Schweregrad und Konfidenz</h2>
			<ul>
				<li>
					<code>severity</code>: <code>minor</code> &lt; <code>moderate</code> &lt;{" "}
					<code>serious</code> &lt; <code>critical</code>: die Einschätzung der Regelautorin bzw.
					des Regelautors zu den Auswirkungen auf Nutzende, unabhängig von{" "}
					<code>confidence</code>.
				</li>
				<li>
					<code>confidence</code>: <code>low</code> &lt; <code>medium</code> &lt;{" "}
					<code>high</code>: wie sicher die Engine ist, dass ein <code>fail</code>/
					<code>cantTell</code>-Urteil stimmt. Beides sind informative Metadaten zur
					Priorisierung; keins von beiden ändert die Bedeutung von <code>outcome</code>.
				</li>
			</ul>
			<p>
				<strong>Ein <code>fail</code> hat nicht immer <code>confidence: "high"</code>, und das
				ist kein Widerspruch.</strong> Das Ergebnis beschreibt das Entscheidungsverfahren (es hat
				die Frage ohne Raten beantwortet), während <code>confidence</code> das Modell
				beschreibt, gegen das entschieden wurde. Einige automatische Regeln entscheiden
				deterministisch gegen etwas, das selbst eine Näherung ist (die kuratierten
				WAI-ARIA-Rollentabellen, die Zuordnungen nativer Rollen, ein aus statischem Markup
				abgeleiteter Accessibility Tree), und melden <code>medium</code>:{" "}
				<code>aria-required-children</code>, <code>aria-prohibited-children</code>,{" "}
				<code>aria-required-parent</code>, <code>aria-allowed-attr</code>,{" "}
				<code>form-control-programmatic-label-present</code>,{" "}
				<code>identical-iframes-same-purpose</code>,{" "}
				<code>svg-image-text-alternative-present</code>,{" "}
				<code>video-poster-text-alternative-present</code> und <code>target-size-minimum</code>.{" "}
				<code>confidence</code> steht in jedem Ergebnis, sodass ein Konsument, der nur die
				sichersten Verstöße will, direkt danach filtern kann; <code>policy.allowedConfidence</code>{" "}
				erledigt das nicht für Sie, da ein nicht zulässiger Wert durch den{" "}
				<code>defaultConfidence</code> der Regel ersetzt wird, statt das Ergebnis zu ändern
				(siehe <a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a>).
			</p>

			<h2>Durchgerechnetes Beispiel</h2>
			<p>
				Scan von <code>&lt;img src="logo.png"&gt;</code> (ohne <code>alt</code>) und{" "}
				<code>&lt;button&gt;&lt;/button&gt;</code> (ohne zugänglichen Namen), eingegrenzt auf
				genau diese beiden Regeln über <code>runOnly: {"{ includeRuleIds: [...] }"}</code>{" "}
				(siehe <a href="/configuration/engine-options/">Engine-Optionen</a>; seit 1.10.0 bewirkt ein
				reines Array von Regel-IDs dasselbe):
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const result = runDomRulesInPage(",
					"  'https://example.test/',",
					"  null,",
					"  {},",
					"  { includeRuleIds: ['img-alt-present', 'button-name-present'] }",
					");",
				]}
			/>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					'  "engine": {',
					'    "tag": "a11ycore",',
					'    "schemaVersion": "1.0.0",',
					'    "locale": { "requested": "en", "resolved": "en", "reason": "ok" }',
					"  },",
					'  "url": "https://example.test/",',
					'  "title": "Example",',
					'  "timestamp": null,',
					'  "perfStats": null,',
					'  "contextSelector": null,',
					'  "contextMatch": null,',
					'  "checksResults": [',
					"    {",
					'      "ruleId": "button-name-present",',
					'      "outcome": "fail",',
					'      "severity": "serious",',
					'      "confidence": "high",',
					'      "type": "automatic",',
					'      "occurrences": [',
					"        {",
					'          "selector": "html > body > button",',
					'          "html": "<button></button>",',
					'          "structuralPath": [1, 1],',
					'          "summary": "This button has no accessible name.",',
					'          "hint": "Provide visible button text or a programmatic accessible-name mechanism (for example aria-label) so assistive technologies can identify the button.",',
					'          "data": {',
					'            "visibilityFilter": { "eligible": true, "reasons": [], "targetSet": "acc", "accEligible": true },',
					'            "details": { "reasonCode": "name_missing" }',
					"          }",
					"        }",
					"      ]",
					"    },",
					"    {",
					'      "ruleId": "img-alt-present",',
					'      "outcome": "fail",',
					'      "severity": "serious",',
					'      "confidence": "high",',
					'      "type": "automatic",',
					'      "occurrences": [',
					"        {",
					'          "selector": "html > body > img",',
					'          "html": "<img src=\\"logo.png\\">",',
					'          "structuralPath": [1, 0],',
					'          "summary": "Missing alt attribute on <img>.",',
					'          "hint": "Add an alt attribute (use alt=\\"\\" only for decorative images)."',
					"        }",
					"      ]",
					"    }",
					"  ],",
					'  "rulesResults": [],',
					'  "overriddenBuiltinIds": [],',
					'  "skippedCustomRules": []',
					"}",
				]}
			/>
			<p>
				(Zur besseren Lesbarkeit gekürzt: Das echte Ergebnis enthält laut der vollständigen
				Struktur oben in jedem Eintrag zusätzlich{" "}
				<code>title</code>/<code>description</code>/<code>i18n</code>/<code>meta</code>/
				<code>engineOptions</code>/<code>schemaVersion</code>. <code>rulesResults</code> ist hier
				leer, weil <code>runOnly.includeRuleIds</code> den Scan auf zwei atomare Regeln
				eingegrenzt hat und keine ID einer zusammengesetzten Regel enthalten war.)
			</p>
		</>
	);
}
