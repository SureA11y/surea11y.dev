import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";
import engine from "../data/engine.generated.json";

const core = "https://github.com/SureA11y/core/blob/main";

const earlOutcomeRows = [
	{ id: "pass", engine: <code>pass</code>, earl: <code>earl:passed</code> },
	{ id: "fail", engine: <code>fail</code>, earl: <code>earl:failed</code> },
	{ id: "cantTell", engine: <code>cantTell</code>, earl: <code>earl:cantTell</code> },
	{ id: "notApplicable", engine: <code>notApplicable</code>, earl: <code>earl:inapplicable</code> },
];

export function EarlReportContent() {
	return (
		<>
			<p>
				<code>@surea11y/core/earl</code> gibt Scan-Ergebnisse als{" "}
				<a href="https://www.w3.org/TR/EARL10-Schema/">EARL 1.0</a> in JSON-LD aus: das Vokabular,
				das das W3C veröffentlicht, um festzuhalten „dieses Tool hat diese Sache getestet und
				dieses Ergebnis bekommen“, und das Format, das die Community Group der{" "}
				<a href="https://act-rules.github.io/"><span lang="en">ACT Rules</span></a> als Implementierungsbericht
				akzeptiert.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { renderEarlReport } = require('@surea11y/core/earl');",
					"",
					"const report = renderEarlReport(result, {",
					`  assertor: { name: 'surea11y', version: '${engine.version}' },`,
					"  mode: 'earl:automatic'",
					"});",
					"",
					"fs.writeFileSync('earl.jsonld', JSON.stringify(report, null, 2));",
				]}
			/>

			<h2>Wofür er gedacht ist</h2>
			<p>Zwei Zielgruppen, die dasselbe Dokument aus unterschiedlichen Gründen wollen.</p>
			<p>
				Ein <strong>Implementierungsbericht</strong> zeigt der <span lang="en">ACT Rules Community Group</span>, wie sich
				diese Engine bei ihren Testfällen verhält; darüber wird eine Engine neben den anderen
				Implementierungen gelistet. Eine Listung ist keine Empfehlung, und das W3C prüft die Daten
				nicht. Korrekt heißt es <em>„als ACT-Implementierung gelistet“</em>, nie{" "}
				<em>„W3C-zertifiziert“</em>. Der Bericht dieser Engine ist unter{" "}
				<a href="https://surea11y.github.io/act-report/act-report.jsonld">
					https://surea11y.github.io/act-report/act-report.jsonld
				</a>{" "}
				veröffentlicht und wird von <code>scripts/act-report.js</code> neu erzeugt.{" "}
				<code>--runner=chromium</code> erzeugt denselben Bericht aus einem Scan in Chromium, so wie
				die Browser-Bindings die Engine ausführen, mit dem Assertor „SureA11y in a browser“ und der
				Chromium-Version in der Beschreibung des Berichts.
			</p>
			<p>
				Wer die Engine <strong>nutzt</strong>, bekommt ein Austauschformat. EARL ist das, was
				Barrierefreiheits-Tools lesen, wenn sie Ergebnisse aus mehr als einer Quelle
				zusammenführen müssen, etwa aus einem automatischen Scan und einem manuellen Audit oder
				aus mehreren Engines, denn jede Aussage hält fest, wer sie getroffen hat und wie. Das
				lohnt sich unabhängig davon, ob je etwas irgendwo eingereicht wird.
			</p>

			<h2>Wie er sich von den anderen Berichten unterscheidet</h2>
			<p>
				<a href="/results-reports/sarif-report/">SARIF-Bericht</a> und <a href="/results-reports/html-report/">HTML-Bericht</a>{" "}
				enthalten beide <strong>nur Verstöße</strong>: Sie melden <code>fail</code>- und{" "}
				<code>cantTell</code>-Vorkommen und verwerfen alles andere. EARL ist das Gegenteil.{" "}
				<strong>Jede ausgeführte Regel wird zu einer Aussage, <code>pass</code> und{" "}
				<code>inapplicable</code> eingeschlossen</strong>, weil ein Implementierungsbericht eine
				Aussage darüber ist, was die Engine <em>überall</em> entschieden hat. Eine Regel, die
				stumm blieb, weil sie nichts Anwendbares fand, ist ein Beleg, kein Rauschen: Nur so lässt
				sich unterscheiden zwischen „diese Engine hat geprüft und nichts zu prüfen gefunden“
				und „diese Engine implementiert diese Regel gar nicht“.{" "}
				<strong>Jede Aussage betrifft eine Regel auf einem Subjekt</strong>: Ein{" "}
				<code>passed</code> einer Regel ist kein Urteil über das WCAG-Kriterium, dem sie
				zugeordnet ist; die meisten Kriterien haben Teile, die keine Regel abdeckt (siehe{" "}
				<a href="/conformance/wcag-mapping/">WCAG-Konformitätszuordnung</a>).
			</p>

			<h2>Aufbau</h2>
			<p>Der Graph ist nach Subjekt gruppiert, statt eine flache Liste von Aussagen zu sein:</p>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					'  "@context": "https://www.w3.org/WAI/content-assets/wcag-act-rules/earl-context.json",',
					'  "@graph": [',
					"    {",
					'      "@type": "TestSubject",',
					'      "source": "https://example.test/",',
					'      "assertions": [',
					"        {",
					'          "@type": "Assertion",',
					'          "test": { "title": "img-alt-present", "isPartOf": ["WCAG2:non-text-content"] },',
					'          "result": { "outcome": "earl:failed" },',
					'          "assertedBy": {',
					'            "@type": "Assertor",',
					'            "name": "surea11y",',
					`            "release": { "@type": "Version", "revision": "${engine.version}" }`,
					"          },",
					'          "mode": "earl:automatic"',
					"        }",
					"      ]",
					"    }",
					"  ]",
					"}",
				]}
			/>
			<ul>
				<li>
					<strong><code>source</code></strong> ist die gescannte URL oder{" "}
					<code>about:blank</code>, wenn ein Ergebnis keine enthält. Enthalten mehrere Ergebnisse
					keine, wird jedes zu einem eigenen Subjekt, <code>about:blank#result-&lt;n&gt;</code> nach
					seiner Position in der Liste (ab 1), statt dass alle zu einem zusammenfallen.
				</li>
				<li>
					<strong><code>test.title</code></strong> ist die Regel-ID der Engine. In ACT-Begriffen
					ist eine Regel das <em>Verfahren</em>, das die Implementierung ausgeführt hat, und genau
					das benennt eine Regel-ID.
				</li>
				<li>
					<strong><code>test.isPartOf</code></strong> listet die Erfolgskriterien, denen die Regel
					zugeordnet ist, als <code>WCAG2:&lt;criterion-id&gt;</code>: jeden Eintrag in{" "}
					<code>normativeMappings</code>, dessen <code>standard</code> <code>WCAG</code> ist oder
					fehlt (wie in SARIF) und der keinen <code>type</code> hat. Bei einer Regel, die kein
					Kriterium beansprucht, fehlt das Feld ganz: <code>aria-allowed-role</code>,{" "}
					<code>empty-heading</code> und <code>landmark-role-name-present</code> sind die
					automatischen Regeln der Engine in dieser Lage, und eine leere Liste würde sich lesen wie
					„keine Zuordnung gefunden“ statt „bewusst keiner zugeordnet“. Eine solche Regel kann
					trotzdem <code>fail</code> ergeben (<code>empty-heading</code> bei einer Überschrift ohne
					Namen): Ihre Aussage ist dann <code>earl:failed</code> ohne <code>isPartOf</code>, ein
					Fehlschlag der Regel, nicht eines WCAG-Kriteriums, denn sie beansprucht keins.
				</li>
				<li>
					<strong><code>isPartOf</code> folgt der WCAG-Stufe und -Version des Scans.</strong> Ein
					Kriterium, das der Scan ihretwegen aus <code>rulesResults</code> ausgelassen hat, wird
					nicht aufgeführt, etwa 1.4.6 (AAA) unter <code>engineOptions.wcagLevel: 'AA'</code> oder
					4.1.1, wenn <code>{"includeRuleIds: ['duplicate-id']"}</code> unter WCAG 2.2 lief, da WCAG 2.2 es
					gestrichen hat; eine Regel, deren sämtliche Kriterien ausgelassen werden, hat kein{" "}
					<code>isPartOf</code>. Die Aussage selbst bleibt, da sie die Regel betrifft. Ein
					Kriterium, das der Scan meldet, wird aufgeführt, etwa eine per ID genannte
					Zusammenfassung oberhalb der Stufe oder 4.1.1 in einem 2.2-Scan, der es ausgewählt hat,
					ebenso jedes Kriterium eines Ergebnisses, das weder <code>engine.wcagLevel</code> noch{" "}
					<code>engine.wcagVersion</code> festhält.
				</li>
				<li>
					<strong><code>assertedBy</code></strong> ist immer vorhanden, außer Sie übergeben{" "}
					<code>assertor: null</code>: Standardmäßig enthält es <code>surea11y</code> und die
					Engine-Version, die die Ergebnisse tragen. <strong><code>mode</code></strong> erscheint
					nur, wenn Sie es angeben.
				</li>
			</ul>
			<p>
				Kriterien-IDs werden aus dem Titel des Kriteriums abgeleitet (<code>Non-text Content</code>{" "}
				→ <code>non-text-content</code>). <code>normativeMappings</code> enthält außerdem Verweise
				auf Understanding-Dokumente, die einen <code>type</code> haben, und Einträge anderer Normen
				(EN-301-549-Klauseln, die Anforderungen oder Checklistenpunkte eines Packs), die ihren
				eigenen <code>standard</code> nennen; beide können eine <code>requirement</code>-Nummer mit
				einem Kriterium teilen. Nur Einträge, deren <code>standard</code> <code>WCAG</code> ist oder
				fehlt und die keinen <code>type</code> haben, werden als Erfolgskriterien gelesen. Eine
				Konformitätsstufe ist nicht nötig. <code>isPartOf</code> listet nur WCAG-Kriterien;
				Einträge anderer Normen werden weggelassen.
			</p>
			<p>
				Ein kompaktes Ergebnis (<code>engineOptions.output.detail: 'findings'</code>, siehe{" "}
				<a href="/results-reports/output-schema/#top-level-result">Ausgabeschema</a>) wird als das
				vollständige Ergebnis gelesen, für das es steht, und daher genauso gemeldet.
			</p>

			<h2>Ergebnisse</h2>
			<DataTable
				label="Engine-Ergebnisse in EARL"
				rowKey="id"
				columns={[
					{ key: "engine", label: "Engine", width: "30%" },
					{ key: "earl", label: "EARL", wrap: true },
				]}
				rows={earlOutcomeRows}
			/>
			<p>
				<code>earl:untested</code> hat keine Entsprechung: Eine Regel, die nicht ausgeführt wurde,
				liefert kein Ergebnis, über das sich etwas aussagen ließe; sie trägt also keine Aussage
				bei statt einer „<span lang="en">untested</span>“-Aussage.
			</p>
			<p>
				<strong><code>cantTell</code> wird nicht negativ angerechnet.</strong> Nach den
				Konsistenzregeln von ACT darf eine automatische Implementierung bei manchen Beispielen,
				wenn auch nicht bei allen, „<span lang="en">cannot tell</span>“ melden und trotzdem als konsistent gelten. Was
				eine teilweise konsistente Implementierung <em>nicht</em> darf, ist ein falsch positives
				Ergebnis erzeugen: ein Beispiel scheitern lassen, das laut Regel bestehen soll oder nicht anwendbar
				ist. Das ist die Schwelle, auf die es ankommt, und sie ist eine Eigenschaft der Regeln,
				nicht dieses Berichts. Beim letzten vollständigen Lauf erzeugte die Engine{" "}
				<strong>null falsch positive Ergebnisse</strong> über die 957 Beispiele hinweg, die das W3C
				für ihre 60 zugeordneten Regeln veröffentlicht. Siehe{" "}
				<a href={`${core}/docs/ACT_RULE_MAPPING.md`}><code>ACT_RULE_MAPPING.md</code></a>, und
				führen Sie <code>scripts/act-testcase-check.js</code> für die aktuelle Zahl erneut aus,
				statt sich unbegrenzt auf diese zu verlassen.
			</p>

			<h2>Mehrere Ergebnisse, ein Bericht</h2>
			<p>
				<code>renderEarlReport</code> nimmt ein Array genauso an wie ein einzelnes Ergebnis, denn
				ein Bericht über viele Seiten ist der Normalfall:
			</p>
			<CodeBlock lang="js" lines={["renderEarlReport([homeResult, checkoutResult, searchResult], { assertor });"]} />
			<p>
				Ein Frame-übergreifendes Ergebnis von <a href="/results-reports/output-schema/#cross-frame-result"><code>runa11yCoreAcrossFrames</code></a> wird
				so übernommen, wie es ist, allein oder im Array: Jeder Frame, der geantwortet hat, ist ein
				weiteres Ergebnis und wird zu einem Subjekt unter seiner eigenen URL. Ein Frame unterhalb
				des obersten, dessen URL ihn nicht unterscheidet, weil sie <code>about:srcdoc</code> oder{" "}
				<code>about:blank</code> ist oder ein anderer Frame des Ergebnisses sie ebenfalls hat, wird
				nach seiner URL und seinem Pfad benannt, den Selektoren, mit denen SARIF und JUnit ihn
				benennen, jeweils kodiert und mit <code>/</code> verbunden:{" "}
				<code>about:srcdoc#frame=%23pay</code>, <code>about:srcdoc#frame=%23widget/%23inner</code>.
				Wo selbst der Pfad geteilt wird, etwa bei den Frames eines Bindings, die keinen Selektor
				tragen, kommt seine Position unter den Frames des Ergebnisses hinzu, ab 1:{" "}
				<code>about:srcdoc#frame=iframe&amp;n=3</code>. Alles andere, was
				kein Scan-Ergebnis ist, etwa <code>null</code> oder ein String, wirft einen{" "}
				<code>TypeError</code>.
			</p>
			<p>
				Ergebnisse mit derselben URL werden zu einem Subjekt zusammengeführt: Wer dieselbe Seite
				mit unterschiedlichen <code>engineOptions</code> scannt, beschreibt immer noch eine
				Ressource, und der Kontext kann keine zwei Subjekte mit derselben Quelle ausdrücken.{" "}
				<strong>Treffen zwei Ergebnisse eine Aussage zur selben Regel für dieselbe URL, bleibt das
				schlechtere Ergebnis erhalten</strong>: <code>earl:failed</code>, dann{" "}
				<code>earl:cantTell</code>, dann <code>earl:passed</code>, dann{" "}
				<code>earl:inapplicable</code>, sodass keine Reihenfolge der Eingaben einen Fehlschlag
				verbergen kann. Das gilt auch für dieselbe Seite, gescannt bei zwei Viewport-Breiten: EARL
				hat keinen Begriff für die Bedingungen, unter denen eine Seite dargestellt wurde, daher
				behält ein Bericht aus mehreren Breiten für jede Regel einen Fehlschlag bei irgendeiner
				Breite. Erzeugen Sie einen Bericht pro Breite, wenn die Breiten selbst eine Rolle spielen.
			</p>
			<p>
				Die Ausgabe ist deterministisch: Subjekte werden nach Quelle sortiert, Aussagen nach
				Regel-ID, und dieselben Eingaben erzeugen in jeder Reihenfolge byte-identische Ausgabe. Die
				einzige Ausnahme sind Ergebnisse ohne URL, die nach ihrer Position in der Liste
				unterschieden werden (<code>about:blank#result-2</code>); geben Sie jedem Ergebnis seine
				URL, wenn die Reihenfolge keine Rolle spielen soll. Erst dadurch ist ein Diff zwischen zwei Engine-Versionen aussagekräftig.
			</p>

			<h2>Optionen</h2>
			<DataTable
				label="Optionen des EARL-Berichts"
				rowKey="id"
				columns={[
					{ key: "option", label: "Option", width: "22%" },
					{ key: "meaning", label: "Bedeutung", wrap: true },
				]}
				rows={[
					{ id: "assertor", option: <code>assertor</code>, meaning: <><code>{"{ name, version }"}</code>. Der Name ist standardmäßig <code>surea11y</code>, und die Version, angegeben als <code>release</code> des Assertors, standardmäßig die <code>engine.version</code>, die die Ergebnisse tragen, wenn alle dieselbe tragen; Ergebnisse aus verschiedenen Releases erhalten keine, sofern Sie keine angeben. Übergeben Sie <code>null</code>, um <code>assertedBy</code> ganz wegzulassen.</> },
					{ id: "mode", option: <code>mode</code>, meaning: <>Ein EARL-Testmodus wie <code>'earl:automatic'</code>. Entfällt, wenn nicht angegeben.</> },
				]}
			/>

			<h2>Siehe auch</h2>
			<ul>
				<li><a href="/results-reports/output-schema/">Ausgabeschema</a>: das Ergebnis, das hier gelesen wird</li>
				<li>
					<a href={`${core}/docs/ACT_RULE_MAPPING.md`}><code>ACT_RULE_MAPPING.md</code></a>: welchen
					ACT-Regeln die Regeln der Engine entsprechen
				</li>
				<li>
					<a href={`${core}/docs/API_STABILITY.md`}><code>API_STABILITY.md</code></a>: was unter
					Semver fällt
				</li>
			</ul>
		</>
	);
}
