import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const optionRows = [
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
				<strong>Derzeit ändert die Option nur etwas an Erfolgskriterium 4.1.1 Parsing, das in 2.2 entfernt
				wurde</strong>: Bei einem 2.2-Ziel läuft eine Regel mit dem Tag{" "}
				<code>wcag22-removed</code> weiterhin und meldet weiterhin ihre Vorkommen, kann aber nicht{" "}
				<code>fail</code> ergeben. Siehe{" "}
				<a href="#filtering-by-wcag-version">„Filtern nach WCAG-Version“</a> oben. Jeder andere
				Wert wird ignoriert, und es gilt der Standard.
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
				und keine Dateien lesen kann. Siehe <a href="/configuration/locales/">Locales</a>.
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
				<code>[hidden]</code>, geschlossene <code>&lt;details&gt;</code> und verborgene, nur zum
				Rendern dienende Host-Elemente (einschließlich ihrer Nachfahren). Setzen Sie{" "}
				<code>true</code>, um diese verborgenen bzw. eingeklappten Teilbäume in die Auswertung
				einzubeziehen (Legacy-Verhalten für statisches Markup).
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
				macht sie zugänglich.
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
				Elemente, auf die einer dieser Selektoren passt (samt ihren Nachfahren), werden für{" "}
				<strong>jede</strong> Regel vollständig übersprungen. Nützlich für Cookie-Banner,
				Einbettungen von Drittanbietern oder bekanntermaßen auffällige Widgets, die Sie nicht
				kontrollieren. Um etwas stattdessen nur von einer bestimmten Regel auszuschließen,
				verwenden Sie <code>rules[ruleId].excludeSelectors</code> weiter unten.
			</>
		),
	},
	{
		id: "timestamp",
		option: <code>timestamp</code>,
		meaning: (
			<>
				Wird unverändert in das Feld <code>timestamp</code> auf oberster Ebene des Ergebnisses
				übernommen; die Engine erzeugt selbst keinen (bewusst deterministisch).
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
				zugunsten von mehr Befunden auf. Gedacht für einen menschlichen Auditor, der markierte
				Fälle nachprüft, nicht für unbeaufsichtigtes Gating in der CI.
			</>
		),
	},
	{
		id: "contrast-fallback",
		option: <code>contrast.rootCanvasFallback</code>,
		meaning: (
			<>
				Die angenommene Hintergrundfarbe der Seite, wenn sie sich überhaupt nicht berechnen
				lässt. Spielt nur im Modus <code>auditorAssist</code> eine Rolle.
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
				<strong>Wird von keiner anderen Regel gelesen.</strong> <code>'styleOnly'</code>{" "}
				(Standard): Die Eignung hängt nur von CSS ab, also <code>display</code>,{" "}
				<code>visibility</code>, <code>opacity</code>, Verbergen durch Vorfahren usw.{" "}
				<code>'styleAndGeometry'</code>: ergänzt das um echte Layout-Prüfungen (
				<code>getClientRects()</code>/<code>getBoundingClientRect()</code>); Text ohne Client
				Rects oder mit Breite/Höhe null wird ebenfalls ausgeschlossen. Greifen Sie zu{" "}
				<code>'styleAndGeometry'</code>, wenn Sie in einem echten Browser bzw. mit
				Playwright/Puppeteer (<code>runa11yCoreInPage</code>) arbeiten und Kontrastbefunde das
				tatsächlich gerenderte Layout statt nur des berechneten Stils widerspiegeln sollen. Unter
				reinem jsdom (<code>runDomRulesInPage</code>) gibt es keine echte Layout-Engine, dort
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
				Outcome- und Confidence-Werte zulässig sind und ob ein <code>fail</code>, das eine
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
				Vorkommen von Hand zu bauen (1.5.0), nehmen fast alle der 132 Regeln der Engine diesen
				Weg: <code>includeSelector: false</code> / <code>includeHtml: false</code> entfernt
				Selektoren und HTML-Snippets aus der großen Mehrheit davon. Einige wenige setzen diese
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
		id: "rules-ruleId",
		option: <code>rules[ruleId]</code>,
		meaning: (
			<>
				Wird als <code>ctx.config</code> an die jeweilige Regel durchgereicht und, speziell für{" "}
				<code>excludeSelectors</code>, von der Engine selbst gelesen, bevor die Regel überhaupt
				läuft. Siehe{" "}
				<a href="#rule-scoped-excludeselectors">„<code>excludeSelectors</code> pro Regel“</a>{" "}
				unten. Jeder andere Key wird nur durchgereicht:{" "}
				<strong>Keine ausgelieferte Regel liest <code>ctx.config</code> derzeit</strong> für
				etwas anderes als <code>excludeSelectors</code>.
			</>
		),
	},
	{
		id: "probes",
		option: <code>probes</code>,
		meaning: (
			<>
				Ein optionales, JSON-sicheres Evidenzobjekt, das Ihre Host-Anwendung liefern kann (von
				der Engine in Tiefe und Größe begrenzt, bevor Regeln es über{" "}
				<code>ctx.inputs.probes</code> sehen). Gedacht für künftige Regeln, die von außen
				gelieferte Signale annehmen könnten (z. B. echte Layout-Messungen, die ein statischer
				DOM-Scan nicht selbst berechnen kann).{" "}
				<strong>Wird von keiner aktuellen Regel verwendet.</strong>
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
				zwischen Läufen per Diff vergleichen.
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
			</p>

			<h2>Auswählen, welche Regeln laufen</h2>
			<p>
				Es gibt <strong>zwei voneinander unabhängige Wege</strong>, Regeln auszuwählen: das
				4. Argument (<code>runOnly</code>) oder <code>engineOptions.rules</code>/
				<code>.tags</code>/<code>.tests</code>/<code>.includeMode</code>. Enthält{" "}
				<code>runOnly</code> irgendeinen Filter, gewinnt es vollständig; andernfalls greift die
				Engine auf <code>engineOptions</code> zurück.{" "}
				<strong>Mischen Sie beide nicht in der Erwartung, dass beide gelten. Entscheiden Sie
				sich für einen.</strong>
			</p>

			<h3>Über <code>runOnly</code> (4. Argument)</h3>
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
				<strong><code>runOnly</code> muss genau diese Objektform haben, kein reines Array.</strong>{" "}
				<code>runOnly: ['img-alt-present']</code> (ein einfaches Array) wird{" "}
				<strong>stillschweigend ignoriert</strong>; die Engine führt dann jede Regel aus. Das
				ist der mit Abstand häufigste Integrationsfehler, siehe <a href="/help/faq/">die FAQ</a>.
			</p>
			<DataTable
				rowKey="field"
				columns={[
					{ key: "field", label: "Feld", width: "22%" },
					{ key: "type", label: "Typ", width: "16%" },
					{ key: "meaning", label: "Bedeutung", wrap: true },
				]}
				rows={[
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
				Regel-IDs stehen ohne Präfix (kein Engine-Präfix), z. B. <code>'img-alt-present'</code>.
				Aus Gründen der Abwärtskompatibilität akzeptiert der Abgleich auch eine ältere, mit{" "}
				<code>a11ycore-</code> präfixierte Form derselben ID (<code>'a11ycore-img-alt-present'</code>).
			</p>
			<p>
				Als gesamter <code>runOnly</code>-Wert wird außerdem eine{" "}
				<strong>ältere Tag-Filter-Form</strong> akzeptiert:{" "}
				<code>{"{ type: 'tag', values: ['wcag2a', 'wcag2aa'] }"}</code>, gleichbedeutend mit{" "}
				<code>{"{ tags: ['wcag2a', 'wcag2aa'] }"}</code>.
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
				Da die Versionen kumulativ sind (2.1 = 2.0 + Neues; 2.2 = 2.0 + 2.1 + Neues), wählen Sie
				ein Konformitätsziel für eine WCAG-Version durch Kombinieren von Tag-Sets aus. Den Rest
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
				<strong>Ein Kriterium geht den umgekehrten Weg.</strong> WCAG 2.2 hat Erfolgskriterium 4.1.1 Parsing
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
				weiterhin jedes gefundene Vorkommen, aber ihr Outcome wird zu <code>cantTell</code>{" "}
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
				getrimmt, dedupliziert und von leeren Einträgen befreit.
			</p>

			<h2><code>engineOptions</code>: der Rest</h2>
			<CodeBlock
				lang="js"
				lines={[
					"const engineOptions = {",
					"  locale: 'en',                    // default 'en'; de-DE falls back to de, then to en per string",
					"  wcagVersion: '2.2',              // default '2.2' — the conformance target",
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
					"  visibilityMode: 'styleOnly',     // 'styleOnly' (default) | 'styleAndGeometry' — scoped to the contrast rules only",
					"",
					"  policyContract: 'a11y',          // 'a11y' (default) | 'generic' | inline contract object",
					"  policy: {                        // optional overrides on top of policyContract",
					"    coerceManualFailToCantTell: true",
					"  },",
					"",
					"  output: {",
					"    includeSelector: true,         // set false to suppress auto-filled selectors",
					"    includeHtml: true",
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
					"",
					"  // Only read by runa11yCoreAcrossFrames. Ignored by runDomRulesInPage/runa11yCoreInPage.",
					"  pingWaitTime: 500,               // ms to wait for a child frame to answer a ping",
					"  frameWaitTime: 60000             // ms to wait for a child frame's full scan result",
					"};",
				]}
			/>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "option", label: "Option", width: "22%" },
					{ key: "meaning", label: "Bedeutung", wrap: true },
				]}
				rows={optionRows}
			/>

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
				Wozu das gut ist: <code>&lt;mat-select&gt;</code> aus Angular Material baut seine
				interne ARIA-Struktur so auf, dass speziell bei <code>aria-required-children</code> ein
				Falsch-Positiv entsteht, obwohl die Komponente ansonsten in Ordnung ist. Mit nur dem
				globalen <code>excludeSelectors</code> lässt sich dieses Falsch-Positiv nur über{" "}
				<code>excludeSelectors: ['mat-select']</code> unterdrücken. Das verbirgt{" "}
				<code>mat-select</code> aber auch vor <em>allen anderen Regeln</em>, darunter{" "}
				<code>contrast-minimum</code> und <code>aria-allowed-attr</code>, und lässt damit
				stillschweigend echte Abdeckung wegfallen, mit der diese Prüfungen nie ein Problem
				hatten. Das Beispiel oben hält <code>mat-select</code> für jede Regel vollständig
				sichtbar, außer für die eine, die daran fehlschlägt.
			</p>
			<p>
				Die wirksamen Ausschlüsse für eine Regel sind die <strong>Vereinigung</strong> aus der
				globalen Liste und der eigenen Liste der Regel: Ein Element, auf das eine der beiden
				passt, fällt aus den Kandidaten dieser Regel heraus. Eine Regel, deren einzige
				potenziell fehlschlagende Elemente alle auf diese Weise ausgeschlossen sind, meldet{" "}
				<code>outcome: 'pass'</code> oder <code>'notApplicable'</code> (je nach eigener
				Konvention der Regel für den Fall ohne Kandidaten) mit <code>occurrences: []</code>, nie{" "}
				<code>outcome: 'fail'</code> mit leerem <code>occurrences</code>-Array, denn genau diese
				Form ist an anderer Stelle im Schema für „diese Regel hat eine Exception geworfen“
				reserviert (siehe <a href="/results-reports/output-schema/">das Ausgabeschema</a>).
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
					"  excludeSelectors: ['#cookie-banner', '.intercom-launcher'],",
					"  tags: { include: 'wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22a,wcag22aa' }",
					"}, null);",
				]}
			/>
			<p>
				<strong>Menschlicher Auditor bei einer gründlichen Kontrastprüfung im echten
				Browser</strong>: etwas Schutz vor Falsch-Positiven gegen mehr Befunde eintauschen und
				das echte Layout prüfen (nicht nur den berechneten Stil), da eine echte Seite gesteuert
				wird. Gezeigt mit <code>page.evaluate</code> von Puppeteer (akzeptiert mehrere
				Argumente); mit Playwright fassen Sie die vier Positionsargumente zuerst in einem
				einzigen Objekt zusammen, siehe{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const result = await page.evaluate(runa11yCoreInPage, url, null, {",
					"  contrast: { mode: 'auditorAssist' },",
					"  visibilityMode: 'styleAndGeometry'",
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
				<strong>Reproduzierbare Ausgabe für Snapshot-Tests</strong>: Legen Sie einen{" "}
				<code>timestamp</code> fest, damit zwei Läufe mit demselben HTML byte-identisches JSON
				erzeugen, und fordern Sie die Debug-Aufschlüsselung der Laufzeiten an:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
					"  timestamp: '2026-01-01T00:00:00Z',",
					"  perfStats: true,",
					"  profileRules: true",
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
					"      const els = ctx.helpers.queryAll('[onclick]');",
					"      const occurrences = els.map((el) => ({",
					"        selector: ctx.helpers.buildSelector(el),",
					"        html: el.outerHTML,",
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
				Katalog wird nichts hinzugefügt, und zwischen Aufrufen bleibt nichts erhalten. Das ist
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
					In-Page-Runner einbettet.
				</li>
				<li>
					<code>meta</code> erhält dieselben Standardwerte und dieselbe Validierung wie eine
					Regel aus dem Build. Lassen Sie weg, was Sie nicht brauchen; <code>severity</code> ist
					standardmäßig <code>moderate</code>, <code>confidence</code> <code>medium</code>,{" "}
					<code>type</code> <code>automatic</code> usw.
				</li>
				<li>
					Eine eigene Regel, deren <code>id</code> mit einer eingebauten kollidiert,{" "}
					<strong>überschreibt diese für den jeweiligen Scan</strong>, statt dass beide laufen.
					Da eine gleichnamige eigene Regel genauso gut eine versehentliche Kollision wie ein
					gewolltes Überschreiben sein kann, wird jede Kollision auf zwei Wegen sichtbar gemacht:
					durch ein <code>console.warn</code> mit der oder den IDs und durch ein Array{" "}
					<code>overriddenBuiltinIds</code> auf oberster Ebene des Ergebnisses (leer, wenn es
					keine Kollision gibt). Siehe <a href="/results-reports/output-schema/">das Ausgabeschema</a>.
				</li>
				<li>
					Ein ungültiger Deskriptor (fehlende oder nicht als String angegebene <code>id</code>,
					oder ein <code>runInPage</code>, das weder eine Funktion noch ein rekonstruierbarer
					Quelltext-String ist) wird stillschweigend übersprungen. Der Rest des Scans,
					einschließlich jeder eingebauten Regel, läuft ganz normal weiter. Das ist keine zu
					schließende Validierungslücke: Eine eigene Regel ist beliebiger, vom Aufrufer
					gelieferter Code, daher ist „diesen einen Eintrag sicher fehlschlagen lassen, den Scan
					nicht abbrechen“ der sicherere Standard. Das entspricht dem Umgang mit einer{" "}
					<em>eingebauten</em> Regel, die eine Exception wirft: Sie wird auf ein{" "}
					<code>cantTell</code> für diese Regel begrenzt, statt den Lauf abstürzen zu lassen.
				</li>
				<li>
					Ergebnisse erscheinen in <code>checksResults</code> genau wie die jeder anderen Regel,
					einschließlich des automatischen Ausfüllens von <code>selector</code>/
					<code>html</code>/<code>structuralPath</code> für <code>fail</code>/
					<code>cantTell</code>-Vorkommen, die nur <code>{"{ __node }"}</code> anhängen (siehe{" "}
					<a href="/results-reports/output-schema/">das Ausgabeschema</a>).
				</li>
			</ul>

			<h2><code>contextSelector</code> (2. Runner-Argument, kein Feld von <code>engineOptions</code>)</h2>
			<p>
				Ein CSS-Selektor (oder ein Array von Selektoren), der den Scan auf einen oder mehrere
				Teilbäume eingrenzt. Aufgelöst über <code>document.querySelectorAll</code> (alle Treffer,
				nicht nur der erste), mit Rückfall auf <code>document.documentElement</code>/
				<code>document.body</code>, wenn nichts passt. Übergeben Sie <code>null</code>, um das
				ganze Dokument zu scannen.
			</p>
			<ul>
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
					Überlappende bzw. verschachtelte Bereiche werden automatisch dedupliziert: Ein Element,
					das von mehr als einer gefundenen Wurzel aus erreichbar ist, wird nur einmal gemeldet,
					nicht einmal pro Bereich.
				</li>
			</ul>
		</>
	);
}
