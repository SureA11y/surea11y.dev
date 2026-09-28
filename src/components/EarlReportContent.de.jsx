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
				<a href="https://act-rules.github.io/">ACT Rules</a> als Implementierungsbericht
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
				Ein <strong>Implementierungsbericht</strong> zeigt der ACT Rules Community Group, wie sich
				diese Engine bei ihren Testfällen verhält; darüber wird eine Engine neben den anderen
				Implementierungen gelistet. Eine Listung ist keine Empfehlung, und das W3C prüft die Daten
				nicht. Korrekt heißt es <em>„als ACT-Implementierung gelistet“</em>, nie{" "}
				<em>„W3C-zertifiziert“</em>. Der Bericht dieser Engine ist unter{" "}
				<a href="https://surea11y.github.io/act-report/act-report.jsonld">
					https://surea11y.github.io/act-report/act-report.jsonld
				</a>{" "}
				veröffentlicht und wird von <code>scripts/act-report.js</code> neu erzeugt.
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
				stumm blieb, weil sie nichts Anwendbares fand, ist ein Beleg, kein Rauschen: Nur so kann
				ein Leser unterscheiden zwischen „diese Engine hat geprüft und nichts zu prüfen gefunden“
				und „diese Engine implementiert diese Regel gar nicht“.
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
					<code>about:blank</code>, wenn ein Ergebnis keine enthält.
				</li>
				<li>
					<strong><code>test.title</code></strong> ist die Regel-ID der Engine. In ACT-Begriffen
					ist eine Regel das <em>Verfahren</em>, das die Implementierung ausgeführt hat, und genau
					das benennt eine Regel-ID.
				</li>
				<li>
					<strong><code>test.isPartOf</code></strong> listet die Erfolgskriterien, denen die Regel
					zugeordnet ist, als <code>WCAG2:&lt;criterion-id&gt;</code>. Bei einer Regel, die kein
					Kriterium beansprucht, fehlt das Feld ganz: <code>aria-allowed-role</code> ist die
					einzige automatische Regel der Engine in dieser Lage, und eine leere Liste würde sich
					lesen wie „keine Zuordnung gefunden“ statt „bewusst keiner zugeordnet“.
				</li>
				<li>
					<strong><code>assertedBy</code></strong> und <strong><code>mode</code></strong>{" "}
					erscheinen nur, wenn Sie sie angeben.
				</li>
			</ul>
			<p>
				Kriterien-IDs werden aus dem Titel des Kriteriums abgeleitet (<code>Non-text Content</code>{" "}
				→ <code>non-text-content</code>). <code>normativeMappings</code> enthält außerdem Verweise
				auf Understanding-Dokumente und Nicht-WCAG-Standards, die <code>standard: "WCAG"</code>{" "}
				und ein <code>requirement</code> mit dem echten Kriterium teilen. Ein Erfolgskriterium ist
				der Eintrag, der eine Konformitätsstufe angibt und keinen anderen Dokumenttyp beansprucht,
				und nur diese Einträge werden gelesen.
			</p>

			<h2>Ergebnisse</h2>
			<DataTable
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
				<strong><code>cantTell</code> kostet keine Konformitätspunkte.</strong> Nach den
				Konsistenzregeln von ACT darf eine automatische Implementierung bei manchen Beispielen,
				wenn auch nicht bei allen, „<span lang="en">cannot tell</span>“ melden und trotzdem als konsistent gelten. Was
				eine teilweise konsistente Implementierung <em>nicht</em> darf, ist ein Falsch-Positiv
				erzeugen: ein Beispiel scheitern lassen, das laut Regel bestehen soll oder nicht anwendbar
				ist. Das ist die Schwelle, auf die es ankommt, und sie ist eine Eigenschaft der Regeln,
				nicht dieses Berichts. Beim letzten vollständigen Lauf erzeugte die Engine{" "}
				<strong>null Falsch-Positive</strong> über die 798 ACT-Beispiele hinweg, die ihre 58
				zugeordneten Regeln abdecken. Siehe{" "}
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
				Ergebnisse mit derselben URL werden zu einem Subjekt zusammengeführt: Wer dieselbe Seite
				mit unterschiedlichen <code>engineOptions</code> scannt, beschreibt immer noch eine
				Ressource, und der Kontext kann keine zwei Subjekte mit derselben Quelle ausdrücken.{" "}
				<strong>Treffen zwei Ergebnisse eine Aussage zur selben Regel für dieselbe URL, gewinnt
				das letzte.</strong>
			</p>
			<p>
				Die Ausgabe ist deterministisch: Subjekte werden nach Quelle sortiert, Aussagen nach
				Regel-ID, und dieselben Eingaben erzeugen in jeder Reihenfolge byte-identische Ausgabe.
				Erst dadurch ist ein Diff zwischen zwei Engine-Versionen aussagekräftig.
			</p>

			<h2>Optionen</h2>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "option", label: "Option", width: "22%" },
					{ key: "meaning", label: "Bedeutung", wrap: true },
				]}
				rows={[
					{ id: "assertor", option: <code>assertor</code>, meaning: <><code>{"{ name, version }"}</code>. Der Name ist standardmäßig <code>surea11y</code>; übergeben Sie <code>null</code>, um <code>assertedBy</code> ganz wegzulassen.</> },
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
