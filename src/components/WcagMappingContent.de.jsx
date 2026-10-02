import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

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
				Alle beitragenden Regeln ergeben <code>notApplicable</code>
			</>
		),
		outcome: <code>notApplicable</code>,
	},
	{
		id: "pass",
		condition: "Andernfalls (alle ausgeführt, keine ergibt fail/cantTell, nicht alle N/A)",
		outcome: <code>pass</code>,
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
					Facetten pro SC.
				</li>
				<li>
					<strong>Zusammengesetzte Regeln (Zusammenfassung pro WCAG-SC)</strong>{" "}
					(<code>rulesResults[]</code>): ein generiertes Aggregat aller atomaren Regeln, die einem
					SC zugeordnet sind. Sie bekommen damit ein Urteil
					pass/fail/cantTell/notApplicable pro SC, statt Dutzende atomarer Ergebnisse selbst
					zusammenzufassen. Siehe{" "}
					<a href={`${core}/docs/RULE_CATALOG.md#composite-wcag-sc-rollup-rules-34`}>
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
			<p>
				Das heißt: <strong>Ein zusammengesetztes <code>pass</code> ist ein echtes, deterministisches
				„jede anwendbare automatische Prüfung für dieses SC ist ohne Befund geblieben“, aber für sich genommen
				keine Aussage über WCAG-Konformität.</strong> Hat eine Facette dieses SC gar keine
				automatische Abdeckung (siehe <code>coverage-report.md</code>), schweigt ein
				zusammengesetztes <code>pass</code> zu dieser Facette, statt zu behaupten, sie sei in
				Ordnung. Gleichen Sie die Facettentabelle ab, bevor Sie ein zusammengesetztes{" "}
				<code>pass</code> als „SC vollständig verifiziert“ behandeln.
			</p>
			<p>
				Das Array <code>data.details.contributors</code> einer zusammengesetzten Regel (siehe{" "}
				<a href="/results-reports/output-schema/">das Ausgabeschema</a>) listet jede atomare Regel
				und ihr einzelnes Ergebnis. Daran sehen Sie genau, welche Facette(n) ein{" "}
				<code>fail</code>/<code>cantTell</code> verursacht haben, statt die zusammengesetzte Regel
				als Blackbox zu behandeln.
			</p>

			<h2>Eine Konformitätsstufe anpeilen (A / AA / AAA)</h2>
			<p>
				Übergeben Sie <code>runOnly.tags</code> (oder <code>engineOptions.tags.include</code>) mit
				den gewünschten Stufen-Tags:
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
				<code>wcag2a</code>. <code>{"{ tags: ['wcag2aa'] }"}</code> allein führt daher die 10 Regeln
				aus, die einem AA-Kriterium von 2.0 zugeordnet sind, nicht die rund 100, die ein Ziel A +
				AA ausmachen. Listen Sie jede Stufe auf, die Sie meinen, oder überlassen Sie das{" "}
				<code>engineOptions.profile</code> (<code>wcag22-aa</code>, <code>en301549-v4.1.1</code>,{" "}
				<code>en301549-v3.2.1</code>, <code>section508</code>); siehe{" "}
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
				eine Ziel-Version von WCAG (<code>engineOptions.wcagVersion</code>, sonst was Ihre
				Versions-Tags nahelegen, sonst <code>2.2</code>) und meldet sie als{" "}
				<code>engine.wcagVersion</code> zurück. Bei einem 2.2-Ziel kann eine Regel, die nur SC
				4.1.1 Syntaxanalyse zugeordnet ist, kein <code>fail</code> melden: Sie läuft, meldet ihre
				Vorkommen und liefert <code>cantTell</code> mit einem Feld <code>wcagVersionScope</code>,
				das die Umwandlung erklärt. Ein Standard-Scan scheitert also nie an einem Kriterium, das
				WCAG 2.2 nicht enthält, und ein Scan für 2.0/2.1 bekommt weiterhin ein echtes Urteil zu
				4.1.1.
			</p>
			<p>
				Zusammengesetzte Regeln werden, anders als atomare, <em>sehr wohl</em> kumulativ gefiltert.
				Der Runner liest die höchste in <code>tags</code> genannte Stufe und verwirft jede
				zusammengesetzte Regel darüber; mit <code>{"['wcag2a', 'wcag2aa']"}</code> gibt es also
				keinen <code>rulesResults</code>-Eintrag für ein SC, das nur AAA ist. Die genaue
				Rangfolge steht in <code>inferTargetLevelFromRunOnly</code>/
				<code>isAllowedByTargetLevel</code> in <code>src/core/dom-runner.js</code>.
			</p>
			<p>
				Lassen Sie <code>tags</code> ganz weg (der Standard), laufen alle Regeln auf allen Stufen,
				ohne dass zusammengesetzte Regeln unterdrückt werden.
			</p>

			<h2 id="en-301-549">EN 301 549</h2>
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
				Berichtsgeneratoren lesen; eine weitere Norm lässt sich also auf dieselbe Weise hinzufügen,
				mit eigenen Profilen, Regeln und Zusammenfassungen. Wie man eine registriert, steht in{" "}
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
					Jedes <code>fail</code> ist ein echter, deterministischer, normativer Verstoß gegen die
					angepeilte Norm und Version, nie eine Vermutung. Standardmäßig ist diese Norm WCAG: Eine
					Regel für eine Anforderung, die nur eine andere Norm stellt, ist eine Opt-in-Regel und läuft
					nur, wenn Sie diese Norm als Ziel wählen (siehe{" "}
					<a href="/configuration/engine-options/#opt-in-rules">Opt-in-Regeln</a>), daher lässt ein
					WCAG-Scan eine Seite nie an etwas scheitern, das WCAG nicht verlangt. Die einzige Ausnahme
					ist ein Lauf, der alle Regeln anfordert (<code>engineOptions.optInRules</code>): Er zielt
					auf keine einzelne Norm und weist das in <code>engine.optInRules</code> aus.
				</li>
				<li>
					Jedes <code>cantTell</code> ist eine ausdrückliche Markierung zur menschlichen Prüfung,
					keine verschluckte Unsicherheit.
				</li>
				<li>
					Die Tabelle zur Facettenabdeckung zeigt Ihnen genau, welche Teile welcher SC gar keine
					automatische Abdeckung haben. So wissen Sie, wo ein <code>pass</code> schweigt, statt
					erschöpfend zu sein.
				</li>
			</ul>
			<p>
				Ein zusammengesetztes <code>pass</code> für jedes SC Ihrer Zielstufe bedeutet: <em>Jede
				automatisierbare Prüfung für diese Stufe ist ohne Befund geblieben.</em> Das ist der automatisierbare
				Teil der Konformität, präzise benannt, kein Ersatz für die manuelle Prüfung, die WCAG
				selbst verlangt.
			</p>
		</>
	);
}
