import React from "react";
import engine from "../data/engine.generated.json";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { Callout } from "./design-system/feedback/Callout.jsx";

const core = "https://github.com/SureA11y/core/blob/main";
const pack = "/configuration/packs/#en-301-549-pack";

const precedenceRows = [
	{
		id: "fail",
		condition: (
			<>
				Mindestens eine beitragende Regel ergibt <code>fail</code>
			</>
		),
		outcome: <code>fail</code>,
	},
	{
		id: "canttell",
		condition: (
			<>
				Kein <code>fail</code>, aber mindestens eine beitragende Regel ergibt <code>cantTell</code>{" "}
				oder eine aufgeführte beitragende Regel wurde gar nicht ausgeführt
			</>
		),
		outcome: <code>cantTell</code>,
	},
	{
		id: "na",
		condition: (
			<>
				Alle beitragenden Regeln ergeben <code>notApplicable</code>, bei einem Kriterium, dessen
				Regeln jeden Fall finden, für den es gilt
			</>
		),
		outcome: <code>notApplicable</code>,
	},
	{
		id: "na-partial",
		condition: (
			<>
				Alle beitragenden Regeln ergeben <code>notApplicable</code>, bei jedem anderen Kriterium
			</>
		),
		outcome: (
			<>
				<code>cantTell</code> (<code>composite.rollup.cantTell.partialCoverage</code>)
			</>
		),
	},
	{
		id: "pass",
		condition: "Andernfalls (alle ausgeführt, keine ergibt fail/cantTell, nicht alle N/A), bei einem Kriterium, dessen Regeln alles prüfen, was es verlangt",
		outcome: <code>pass</code>,
	},
	{
		id: "pass-partial",
		condition: "Andernfalls, bei jedem anderen Kriterium",
		outcome: (
			<>
				<code>cantTell</code> (<code>composite.rollup.cantTell.partialCheck</code>)
			</>
		),
	},
];

export function WcagMappingContent() {
	return (
		<>
			<p>
				Wie sich einzelne Regelergebnisse zu einem WCAG-Erfolgskriterium (SC) verhalten und was
				surea11y über die Gesamtkonformität aussagen kann und was nicht.
			</p>

			<h2>Die drei Ebenen</h2>
			<ol>
				<li>
					<strong>Atomare Regeln</strong> (<code>checksResults[]</code>): jeweils eine normative
					Entscheidung, z. B. „hat dieses <code>&lt;img&gt;</code> ein <code>alt</code>-Attribut“.
					Alle finden Sie im{" "}
					<a href="/rules/">Regelkatalog</a>.
				</li>
				<li>
					<strong>Facetten</strong>: Ein WCAG-SC ist meist größer als das, was eine einzelne Regel
					deterministisch entscheiden kann. Intern wird jedes SC in benannte „Facetten“ zerlegt
					(1.1.1 Nicht-Text-Inhalt hat z. B. Facetten wie <code>img-alt-attr-present</code>,{" "}
					<code>text-alternative-quality</code>, <code>decorative-null</code>), erfasst in{" "}
					<code>src/coverage/wcag-facets.js</code> und jeweils markiert als <code>full</code>{" "}
					(eine Regel entscheidet sie mit hoher Sicherheit), <code>partial</code> (eine Regel
					entscheidet <em>einen Teil</em> davon; siehe die Hinweise zum Umfang der jeweiligen
					Regel) oder <code>manual</code> (es gibt überhaupt keine sichere automatische
					Heuristik). Führen Sie <code>npm run coverage</code> aus, um{" "}
					<code>coverage/coverage-report.md</code> neu zu erzeugen, die Aufschlüsselung der
					Facetten pro SC. Seit core 1.15.0 hat jede Facette eines Kriteriums, das eine Regel
					bewertet, auch ein Prüfverfahren, also wie eine Person sie von Hand bewertet (siehe{" "}
					<a href="/conformance/procedures/">Prüfverfahren</a>).
				</li>
				<li>
					<strong>Zusammengesetzte Regeln (Zusammenfassung pro WCAG-SC)</strong>{" "}
					(<code>rulesResults[]</code>): ein generiertes Aggregat aller atomaren Regeln, die einem
					SC zugeordnet sind. Sie bekommen damit ein Urteil
					pass/fail/cantTell/notApplicable pro SC, statt Dutzende atomarer Ergebnisse selbst
					zusammenzufassen. Siehe{" "}
					<a href={`${core}/docs/RULE_CATALOG.md#composite-wcag-sc-rollup-rules-${engine.composites}`}>
						die vollständige Liste
					</a>{" "}
					(z. B. fasst <code>wcag-1.1.1-non-text-content</code> 21 atomare Regeln zusammen).
				</li>
			</ol>

			<h2>Wie das Ergebnis einer zusammengesetzten Regel berechnet wird</h2>
			<p>Eine deterministische Rangfolge, ausgewertet über die beitragenden atomaren Regeln dieser zusammengesetzten Regel:</p>
			<DataTable
				caption="Rangfolge für das Ergebnis zusammengesetzter Regeln"
				rowKey="id"
				columns={[
					{ key: "condition", label: "Bedingung", wrap: true, width: "75%" },
					{ key: "outcome", label: "Gesamtergebnis", width: "25%" },
				]}
				rows={precedenceRows}
			/>
			<h3 id="when-a-criterion-passes">Wann ein Kriterium erfüllt und wann es nicht anwendbar ist</h3>
			<p>
				Seit 1.14 gilt ein Kriterium nur dann als erfüllt, wenn seine Regeln alles prüfen, was es
				verlangt, so wie WCAG es nur dann als erfüllt ansieht, wenn es ganz erfüllt ist. Ergeben
				alle Regeln <code>pass</code>, heißt das nur, dass die Teile erfüllt sind, die sie prüfen:{" "}
				<a href="/rules/html-lang-attr-present/"><code>html-lang-attr-present</code></a> stellt
				fest, dass <code>{'<html lang="fr">'}</code> eine Sprache nennt, nicht, dass die Seite auf
				Französisch ist (3.1.1), und <a href="/rules/page-title-present/"><code>page-title-present</code></a>,
				dass die Seite einen Titel hat, nicht, dass er die Seite beschreibt (2.4.2). Ein solches
				Kriterium ergibt <code>cantTell</code>, mit dem Reason-Code{" "}
				<code>composite.rollup.cantTell.partialCheck</code>, und der{" "}
				<a href="/results-reports/html-report/">HTML-Bericht</a> meldet es als teilweise geprüft
				(„Teilweise geprüft“): Den Rest prüft eine Person. Die Kriterien, die ihre Regeln ganz
				prüfen, stehen in <code>src/coverage/complete-applicability.js</code>{" "}
				(<code>COMPLETE_CHECK</code>), jeweils mit Begründung, und noch ist es keines: Jedes fragt
				etwas, das die Regeln nicht sehen, ob eine Textalternative, ein Label, eine Überschrift
				oder der Text eines Links das Richtige sagt, oder wie Inhalte, die ein Skript zeichnet
				oder ändert, es erfüllen. <strong>In 1.14 ergibt daher keine zusammengesetzte WCAG-Regel{" "}
				<code>pass</code>.</strong>
			</p>
			<p>
				Ebenso ist ein Kriterium nur dann <code>notApplicable</code>, wenn seine Regeln jeden Fall
				finden, für den es gilt: Links für 2.4.4 und 2.4.9, fokussierbare Elemente für 2.4.3 und
				2.4.7, beschriftete Komponenten für 2.5.3, Markup für 4.1.1. Formularfelder (1.3.5, 3.3.2)
				und Zeigerziele (2.5.8) stehen nicht auf dieser Liste: Ein Feld aus einer ARIA-Rolle, ein
				Feld ohne <code>autocomplete</code> oder ein Element, das nur durch ein Skript zum Ziel
				wird, kann auf einer Seite sein, auf der diese Regeln nichts gefunden haben. Bei jedem
				anderen Kriterium sagen Regeln, die alle nichts gefunden haben, nur, dass die Fälle fehlen,
				nach denen sie suchen: Ein Skript, das nach einer Verzögerung weiterleitet, ist eine
				Zeitbegrenzung (2.2.1) ohne <code>{'<meta http-equiv="refresh">'}</code>, und eine Passage
				in einer anderen Sprache (3.1.2) muss kein <code>lang</code> tragen. In den Begriffen von
				WCAG-EM setzt „nicht vorhanden“ voraus, dass jede Stelle angesehen wurde, an der der
				Inhalt sein könnte; ein solches Kriterium ergibt daher <code>cantTell</code>, mit dem
				Reason-Code <code>composite.rollup.cantTell.partialCoverage</code>.
			</p>
			<p>
				Das heißt: <strong>Ein zusammengesetztes <code>fail</code> ist ein echter, deterministischer
				Verstoß, und ein zusammengesetztes <code>cantTell</code>, dessen beitragende Regeln alle{" "}
				<code>pass</code> ergeben haben (<code>partialCheck</code>), sagt: Jede automatische Prüfung
				für dieses Kriterium ist ohne Befund geblieben, und den Rest prüft eine Person.</strong>{" "}
				Für sich genommen ist das keine Aussage über Konformität. Die Facettentabelle (
				<code>coverage-report.md</code>) zeigt, welche Teile jedes Kriteriums automatisch abgedeckt
				sind und welche eine Person prüft. Zeigen Sie diese als „Prüfungen bestanden, Prüfung
				durch eine Person nötig“ und „nichts zu prüfen gefunden“, nie als erfüllt.
			</p>
			<p>
				Das Array <code>data.details.contributors</code> einer zusammengesetzten Regel (siehe{" "}
				<a href="/results-reports/output-schema/">das Ausgabeschema</a>) listet jede atomare Regel
				und ihr einzelnes Ergebnis. Daran sehen Sie genau, welche Facette(n) ein{" "}
				<code>fail</code>/<code>cantTell</code> verursacht haben, statt die zusammengesetzte Regel
				als Blackbox zu behandeln.
			</p>
			<p>
				Eine eigene Regel (<code>engineOptions.customRules</code>) oder eine Regel eines{" "}
				<a href="/configuration/packs/">Packs</a>, die gelaufen ist, zählt für die
				zusammengesetzte Regel jedes Kriteriums, dem sie über <code>meta.wcagSc</code> oder einen
				WCAG-Eintrag in <code>meta.normativeMappings</code> zugeordnet ist, genau wie eine
				eingebaute Regel: Schlägt sie fehl, schlägt die zusammengesetzte Regel fehl. Die
				zusammengesetzte Regel kennzeichnet eine eigene Regel unter ihren beitragenden Regeln mit{" "}
				<code>custom: true</code> und listet sie in <code>data.details.customChecksIds</code>, da
				eigene Regeln nicht wie die eingebauten gegen die Spezifikationen geprüft sind. Eine
				Überschreibung einer eingebauten Regel zählt dort, wo ihre eigene Zuordnung es sagt: an der
				Stelle der eingebauten Regel, wenn sie diesem Kriterium zugeordnet ist, und nirgends, wenn
				sie keinem zugeordnet ist (mit einer Warnung).
			</p>
			<p>
				Ein Scan, der Regeln statt Kriterien nennt (per ID, etwa{" "}
				<code>{"includeRuleIds: ['link-name-present']"}</code>, per Tag, das kein WCAG-Tag ist, per{" "}
				<code>optInRules</code> oder als die Best Practices), bekommt ebenfalls die
				zusammengesetzten Regeln der Kriterien, die diese Regeln prüfen; ein Kriteriums-Tag wie{" "}
				<code>wcag244</code> meldet nur dieses Kriterium (siehe{" "}
				<a href="/configuration/engine-options/#which-criteria-a-scan-reports">Engine-Optionen</a>). Vor 1.12 meldete ein solcher
				Scan keine. Die Tabelle oben entscheidet über sie: Eine Regel mit <code>fail</code> lässt das
				Kriterium scheitern, und die Regeln, die der Scan nicht ausgewählt hat, sind Beitragende,
				die nicht gelaufen sind; das Kriterium ist also bestenfalls <code>cantTell</code>, teilweise
				geprüft (<code>reasonCode</code>{" "}
				<code>composite.rollup.cantTell.notSelectedChild</code>, jede solche beitragende Regel mit{" "}
				<code>notSelected: true</code> markiert; „Teilweise geprüft“ im{" "}
				<a href="/results-reports/html-report/">HTML-Bericht</a>).
			</p>

			<h2>Eine Konformitätsstufe anpeilen (A / AA / AAA)</h2>
			<p>Nennen Sie WCAG-Version und -Stufe in <code>runOnly.wcag</code>:</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.2 Level A and AA:",
					"runDomRulesInPage(url, null, {}, { wcag: { version: '2.2', level: 'AA' } });",
					"",
					"// The same, and the best-practice rules, which test no WCAG criterion:",
					"runDomRulesInPage(url, null, {}, { wcag: { version: '2.2', level: 'AA' }, bestPractices: true });",
				]}
			/>
			<p>
				Ein Ziel führt die Regeln für jedes Kriterium aus, das in dieser Version auf dieser Stufe
				und darunter gilt, nach der Stufe, die jedes Kriterium in dieser Version hat
				(<code>WCAG_CRITERIA</code> in <code>@surea11y/core/wcag</code>); 4.1.1 Syntaxanalyse gehört
				also zu Zielen für 2.0 und 2.1, nicht aber zu Zielen für 2.2. Es legt außerdem die
				WCAG-Version des Laufs und die Stufe der gemeldeten Zusammenfassungen fest. Siehe{" "}
				<a href="/configuration/engine-options/#selecting-by-wcag-target-runonlywcag">Auswahl nach WCAG-Ziel</a>.
			</p>
			<p>
				Jeder Eintrag in <code>WCAG_CRITERIA</code> hat außerdem die <code>id</code>, die das W3C
				dem Kriterium in WCAG 2.2 gibt (<code>non-text-content</code>). Jede WCAG-Zuordnung einer
				Regel verlinkt den Abschnitt ihres Kriteriums in der Empfehlung dieser Version
				(<code>url</code>) und sein Understanding-Dokument (<code>understandingUrl</code>), für 2.1
				und 2.2: Die Reporter verwenden das Understanding-Dokument als Hilfelink einer Regel, wenn
				die Regel keinen eigenen hat.
			</p>

			<h3 id="with-tags">Mit Tags</h3>
			<p>
				Dieselben Ziele lassen sich auch mit Stufen-Tags angeben, in <code>runOnly.tags</code>{" "}
				(oder <code>engineOptions.tags.include</code>):
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.0 A and AA. Both tags are required: they are not cumulative.",
					"runDomRulesInPage(url, null, {}, { tags: ['wcag2a', 'wcag2aa'] });",
				]}
			/>
			<p>
				<strong>Stufen-Tags sind nicht verschachtelt, und genau das wird hier am leichtesten
				falsch gemacht.</strong>{" "}
				Eine Regel trägt ein Stufen-Tag pro zugeordnetem Erfolgskriterium, mehr nicht: Eine Regel,
				die nur einem AA-Kriterium zugeordnet ist, trägt <code>wcag2aa</code> und <em>nicht</em>{" "}
				<code>wcag2a</code>. <code>{"{ tags: ['wcag2aa'] }"}</code> allein führt daher die 11 Regeln
				aus, die einem AA-Kriterium von 2.0 zugeordnet sind, nicht die 105, die ein Ziel 2.0 A +
				AA ausmachen. Listen Sie jede Stufe auf, die Sie meinen, oder verwenden Sie{" "}
				<code>runOnly.wcag</code>, das dieses Problem nicht hat. Auch{" "}
				<code>engineOptions.profile</code> (<code>wcag20-aa</code>,{" "}
				<code>wcag21-aa</code>, <code>wcag22-aa</code> und die anderen WCAG-Versionen und
				-Stufen) erledigt das für Sie; siehe{" "}
				<a href="/configuration/engine-options/#conformance-profiles">Konformitätsprofile</a>.
			</p>
			<p>
				Dasselbe gilt über WCAG-Versionen hinweg: Ein Kriterium, das in 2.1 oder 2.2 eingeführt
				wurde, trägt nur sein eigenes Herkunfts-Tag. Ein vollständiges Konformitätsziel ist also
				eine Vereinigung von Tag-Sätzen. Die fertigen Sätze pro Version, einschließlich des einen
				Kriteriums, das WCAG 2.2 entfernt statt hinzugefügt hat, finden Sie in{" "}
				<a href="/configuration/engine-options/#filtering-by-wcag-version">der Anleitung zu den Engine-Optionen</a>.
			</p>
			<p>
				<strong>Um das entfernte Kriterium kümmert sich die Engine.</strong> Jeder Lauf ermittelt
				eine Ziel-Version von WCAG (<code>engineOptions.wcagVersion</code>, sonst die{" "}
				<code>wcagVersion</code> des <a href="/configuration/packs/">Pack</a>-Profils, das der Lauf
				anwendet, sonst die Version von <code>runOnly.wcag</code>, sonst was Ihre Versions-Tags nahelegen, sonst <code>2.2</code>) und meldet sie als{" "}
				<code>engine.wcagVersion</code> zurück. Bei einem 2.2-Ziel kann eine Regel, die nur SC
				4.1.1 Syntaxanalyse zugeordnet ist, kein <code>fail</code> melden: Sie läuft, meldet ihre
				Vorkommen und liefert <code>cantTell</code> mit einem Feld <code>wcagVersionScope</code>,
				das die Umwandlung erklärt. Seit 1.14 tut sie bei einem Ziel 2.0 oder 2.1 dasselbe, mit{" "}
				<code>wcagVersionScope.by: "errata"</code>: Die Errata des W3C von 2023 zu diesen
				Versionen werten 4.1.1 für Inhalte in HTML oder XML als immer erfüllt. Kein WCAG-Scan
				scheitert also an 4.1.1; nur ein Profil, dessen Standard den Text beibehält, eines mit{" "}
				<code>keepsParsing: true</code> wie <code>en301549-v3.2.1</code>, lässt es noch
				fehlschlagen.
			</p>
			<p>
				Zusammengesetzte Regeln werden, anders als atomare, <em>sehr wohl</em> kumulativ gefiltert.
				Der Runner liest <code>engineOptions.wcagLevel</code>, sonst die Stufe von{" "}
				<code>runOnly.wcag</code> oder die höchste in <code>tags</code> genannte Stufe, und verwirft
				jede zusammengesetzte Regel darüber; mit <code>{"['wcag2a', 'wcag2aa']"}</code> gibt es
				also keinen <code>rulesResults</code>-Eintrag für ein SC, das nur AAA ist.{" "}
				<code>wcagLevel</code> (<code>'A'</code>, <code>'AA'</code> oder <code>'AAA'</code>) ist die
				Option für einen Scan, der Prüfungen statt eines Ziels nennt: Jede ausgewählte Regel läuft
				weiterhin, nur die gemeldeten Kriterien werden auf diese Stufe begrenzt, sodass ein Scan von{" "}
				<code>contrast-computable</code> bei <code>'AA'</code> 1.4.3 meldet und nicht das AAA-Kriterium
				1.4.6. Der Lauf hält sie als <code>engine.wcagLevel</code> fest. Die genaue Rangfolge steht in{" "}
				<code>targetWcagLevelOf</code>/
				<code>isAllowedByTargetLevel</code> in <code>src/core/dom-runner.js</code>.
			</p>
			<p>
				Lassen Sie <code>tags</code> ganz weg (der Standard), laufen alle Regeln auf allen Stufen,
				ohne dass zusammengesetzte Regeln unterdrückt werden.
			</p>

			<h2 id="en-301-549">EN 301 549</h2>
			<Callout tone="note" title="Veraltet">
				<p>
					EN 301 549 zieht in ein eigenes Pack um, <a href={pack}><code>@surea11y/pack-en301549</code></a>, und entfällt in core 2.0.0, mit
					seinen Profilen, seinem <code>mappings</code>-Schlüssel und{" "}
					<code>@surea11y/core/en301549</code>. Alles funktioniert wie bisher, mit einem{" "}
					<code>console.warn</code> pro Prozess. Zum Umstieg übergeben Sie das Pack in{" "}
					<code>engineOptions.packs</code>: Der Scan übernimmt dieselben Namen aus dem Pack, und{" "}
					<code>@surea11y/pack-en301549/public</code> hat die Exporte der Tabelle. Siehe{" "}
					<a href={`${core}/docs/API_STABILITY.md#deprecating-a-standard-a-profile-or-an-entry-point`}>wie core eine Norm abkündigt</a>.
				</p>
			</Callout>
			<p>
				Kapitel 9 der EN 301 549 gibt die WCAG-Erfolgskriterien der Stufen A und AA als Klauseln
				wieder, nummeriert mit <code>9.</code> plus der Nummer des Kriteriums: WCAG 1.4.3 ist Klausel
				9.1.4.3. Wenn ein Scan sie anfordert, trägt jedes atomare und zusammengesetzte Ergebnis nach
				seinen WCAG-Einträgen in <code>meta.normativeMappings</code> die Klausel jedes seiner
				Kriterien, einmal pro Version der Norm, die dieses Kriterium enthält. Ein Scan fordert sie
				mit <code>engineOptions.mappings: ['en301549']</code> (beide Versionen) oder{" "}
				<code>['en301549:V3.2.1']</code> (eine) an oder über ein EN-301-549-Profil, das die genannte
				Version hinzufügt; standardmäßig nennen Ergebnisse nur WCAG (siehe{" "}
				<a href="/configuration/engine-options/#other-standards-mappings">Andere Normen</a>).
			</p>
			<DataTable
				label="Versionen der EN 301 549"
				rowKey="version"
				columns={[
					{ key: "version", label: "Version", width: "20%" },
					{ key: "builtOn", label: "Basiert auf", wrap: true },
					{ key: "differs", label: "Unterscheidet sich von der anderen durch", wrap: true },
				]}
				rows={[
					{ version: "V3.2.1 (2021-03)", builtOn: "WCAG 2.1 A und AA, 50 Kriterien", differs: "Enthält 9.4.1.1 Syntaxanalyse" },
					{ version: "V4.1.1 (2026-09)", builtOn: "WCAG 2.2 A und AA, 55 Kriterien", differs: "Ergänzt 2.4.11, 2.5.7, 2.5.8, 3.2.6, 3.3.7, 3.3.8; 9.4.1.1 entfällt" },
				]}
			/>
			<p>
				Jeder Klausel-Eintrag nennt außerdem das Kriterium, das er wiedergibt, als{" "}
				<code>{'wcagSc: ["1.4.3"]'}</code>, damit eine nach Kriterium gruppierte Ansicht (die Suites
				im <a href="/results-reports/junit-report/">JUnit-Bericht</a>, die Zusammenfassung im{" "}
				<a href="/results-reports/html-report/">HTML-Bericht</a>) ihn auch bei einer Regel mit
				mehreren Kriterien richtig einordnet. AAA-Kriterien haben in keiner Version eine Klausel. Die
				Kataloge nennen die Klauseln bei denselben Optionen:{" "}
				<code>{"getChecksCatalog({ mappings: ['en301549'] })"}</code> im{" "}
				<code>normativeMappings</code> jedes Eintrags, und die zusammengesetzten Einträge aus{" "}
				<code>{"getRulesCatalog({ mappings: ['en301549'] })"}</code> als{" "}
				<code>meta.standardMappings</code>, sodass sich die Klauseln eines Kriteriums ohne Scan
				ablesen lassen.
			</p>
			<p>
				Die Tabelle ist als <code>@surea11y/core/en301549</code> öffentlich, für Werkzeuge, die die
				umgekehrte Sicht brauchen, etwa welche Kriterien eine Version verlangt, die ein Scan nicht
				abgedeckt hat:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { EN301549_CLAUSES, en301549ClausesForSc } = require('@surea11y/core/en301549');",
					"",
					"Object.keys(EN301549_CLAUSES['V3.2.1']);  // the 50 WCAG 2.1 A and AA criteria V3.2.1 restates",
					"en301549ClausesForSc('2.5.8');            // [{ version: 'V4.1.1', clause: '9.2.5.8', title: 'Target size (minimum)' }]",
				]}
			/>
			<p>
				<strong>Das ist eine Zuordnung zwischen zwei veröffentlichten Dokumenten, keine
				Konformitätsaussage</strong>: Eine Klausel an einem Ergebnis sagt, welche Anforderung der EN
				301 549 dieses WCAG-Kriterium ist, nicht mehr. Welche Version ein bestimmtes Gesetz verlangt,
				liegt außerhalb der Engine.
			</p>
			<p>
				EN 301 549 ist ein Eintrag in einem Register von Normen, das Runner, Regelkatalog und
				Berichtsgeneratoren lesen. Eine Norm mit eigenen Urteilen (Anforderungen, die ihre eigenen
				Regeln prüfen, etwa eine nationale Norm wie RGAA) oder die Checkliste einer Organisation
				kommt als <a href="/configuration/packs/">Pack</a>: ein eigenes Paket außerhalb von core,
				das ein Scan in <code>engineOptions.packs</code> übernimmt und dessen Eintrag für diesen
				Scan dem Register beitritt, mit eigenen Profilen, Regeln und Zusammenfassungen. Eine eigene
				Regel kann in ihren eigenen <code>normativeMappings</code> jede beliebige Norm nennen, aber
				nur registrierte Normen (die von core und die der Packs des Scans) erhalten ein Profil,
				einen <code>mappings</code>-Schalter, Opt-in-Regeln, Zusammenfassungen oder einen Platz in
				SARIF, JUnit und dem HTML-Bericht. Wie eine Norm in core selbst eingebaut wird, steht in{" "}
				<a href={`${core}/docs/WCAG_CONFORMANCE.md#adding-another-standard`}>
					<code>WCAG_CONFORMANCE.md</code>
				</a>
				, dem Leitfaden für Beitragende auf GitHub.
			</p>

			<h2 id="what-this-engine-cannot-tell-you">Was diese Engine nicht aussagen kann</h2>
			<p>
				<strong>Kein automatisches Tool, auch dieses nicht, kann volle WCAG-Konformität
				bescheinigen.</strong> Das ist keine Einschränkung speziell von surea11y, sondern liegt in
				WCAG selbst: Ein erheblicher Teil der Erfolgskriterien verlangt menschliches Urteil (ist
				dieser Alternativtext <em>zutreffend</em>, nicht nur <em>vorhanden</em>; ist diese
				Fehlermeldung <em>verständlich</em>) oder dynamische Tests, die die Architektur dieser
				Engine als statischer DOM-Scan gar nicht leisten kann (Erkennung von Tastaturfallen,
				echtes Layout bzw. Reflow beim Zoomen). Die vollständige, ausdrückliche Liste dessen, was
				außerhalb des Umfangs liegt und warum, finden Sie unter{" "}
				<a href="/help/known-limitations/">Bekannte Einschränkungen</a>.
			</p>
			<p>Was surea11y Ihnen ehrlicherweise <em>geben</em> kann:</p>
			<ul>
				<li>
					Die eingebauten Regeln von core sind so geschrieben, dass sie nur bei einem
					deterministischen, normativen Verstoß gegen die angepeilte Norm und Version{" "}
					<code>fail</code> ergeben und <code>cantTell</code> melden, wenn sie nicht sicher sein
					können. Das ist ein Entwurfsziel, keine Garantie: Die Seite{" "}
					<a href="/help/known-limitations/">Bekannte Einschränkungen</a> nennt Grenzfälle, in
					denen eine Regel trotzdem falsch liegen kann, die Vorkommen jedes Befunds zeigen, worauf
					er beruht, und die Seite <a href="/rules/">Regeln</a> nennt die Konfidenz jeder Regel.
					Wie genau eine eigene Regel, eine Regel eines Packs oder eine Überschreibung ist, hängt
					davon ab, wie sie geschrieben wurde. Standardmäßig ist diese Norm WCAG. Eine Regel für eine
					Anforderung, die nur eine andere Norm stellt, ist eine Opt-in-Regel: Standardmäßig läuft
					sie nur, wenn Sie diese Norm als Ziel wählen (siehe{" "}
					<a href="/configuration/engine-options/#opt-in-rules">Opt-in-Regeln</a>).{" "}
					<code>engineOptions.optInRules</code> schaltet Opt-in-Regeln frei, ohne das Profil oder
					die Filter des Scans zu entfernen. Mit <code>optInRules: 'all'</code> und ohne Profil
					und Filter umfasst der Lauf jede Regel und zielt auf keine einzelne Norm; eine Liste von
					Tags schaltet nur diese Gruppen von Opt-in-Regeln frei. <code>engine.optInRules</code>{" "}
					nennt die Tags, deren Regeln gelaufen sind. Unter einem WCAG-Profil läuft eine freigeschaltete Regel nur, wenn
					ihre Tags zu diesem Profil passen, und der Lauf zielt weiterhin auf WCAG. Unter den Regeln
					von core führt ein Scan mit WCAG-Ziel also nur die Regeln für die Kriterien des Ziels aus,
					dazu die Best-Practice-Regeln, wenn Sie sie ergänzen. Eine Best-Practice-Regel nennt kein
					Kriterium und kann trotzdem <code>fail</code> melden, wo das Gefundene selbst eine Barriere
					ist, etwa eine leere Überschrift (
					<a href="/rules/empty-heading/"><code>empty-heading</code></a>); keine zusammengesetzte
					WCAG-Regel zählt sie mit. Eine eigene Regel, eine Überschreibung
					oder eine Regel eines Packs ohne Opt-in-Tag läuft, wenn die Auswahl sie einschließt, und
					kann dann für eine eigene Prüfung, die WCAG nicht verlangt, <code>fail</code> melden.
				</li>
				<li>
					Seit core 1.15.0 lässt eine Regel ein WCAG-Kriterium nur dort scheitern, wo WCAG es
					scheitern lässt. Wo nur WAI-ARIA oder das HTML-Inhaltsmodell verletzt ist und Name, Rolle
					und Wert der Seite das überstehen, fragen die ARIA- und HTML-Strukturregeln stattdessen
					(<code>cantTell</code>, Unsicherheit <code>spec-only</code>), sodass ein WCAG-Fehlschlag nie
					für eine Verletzung einer Spezifikation steht, die WCAG nicht zählt. Um diese Befunde nach
					WAI-ARIA selbst zu beurteilen, führen Sie das Profil des{" "}
					<a href="/configuration/packs/#wai-aria-pack">WAI-ARIA-Packs</a> neben dem von WCAG aus.
				</li>
				<li>
					Jedes <code>cantTell</code> ist eine ausdrückliche Markierung zur menschlichen Prüfung,
					keine verschluckte Unsicherheit.
				</li>
				<li>
					Eine zusammengesetzte Regel ergibt nie <code>pass</code> für ein Kriterium, das ihre
					Regeln nur zum Teil prüfen: Ergeben sie alle <code>pass</code>, ist sie{" "}
					<code>cantTell</code> (<code>composite.rollup.cantTell.partialCheck</code>). Ein{" "}
					<code>pass</code> verschweigt also nie einen Teil, den keine Regel prüft.
				</li>
				<li>
					Die Tabelle zur Facettenabdeckung zeigt Ihnen genau, welche Teile welcher SC gar keine
					automatische Abdeckung haben, und damit, was einer Person bleibt, und die{" "}
					<a href="/conformance/procedures/">Prüfverfahren</a> von core sagen, wie eine Person jeden
					davon prüft, für jedes Kriterium, das eine Regel bewertet.
				</li>
			</ul>
			<p>
				Kein zusammengesetztes <code>fail</code> für jedes SC Ihrer Zielstufe bedeutet: <em>Jede
				automatisierbare Prüfung für diese Stufe ist ohne Befund geblieben.</em> Das ist der automatisierbare
				Teil der Konformität, präzise benannt, kein Ersatz für die manuelle Prüfung, die WCAG
				selbst verlangt.
			</p>
		</>
	);
}
