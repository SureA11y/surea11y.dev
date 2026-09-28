import React from "react";
import { Callout } from "./design-system/feedback/Callout.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const choiceRows = [
	{
		need: "Eine echte Webanwendung analysieren",
		recommended: <a href="/getting-started/playwright/">Playwright</a>,
		reason: "Steuert einen echten Browser und ist eine Integration, die moderne Testsuiten bereits nutzen, sodass die Ergebnisse das tatsächliche Layout und Rendering widerspiegeln.",
	},
	{
		need: "Statisches HTML analysieren",
		recommended: <a href="/getting-started/cli/">CLI</a>,
		reason: "Keine Integration zu schreiben — ein einziger Befehl gegen eine Datei, eine URL oder in einem CI-Schritt.",
	},
	{
		need: "Sie nutzen bereits Cypress, Selenium, Puppeteer oder WebdriverIO",
		recommended: "Das passende Binding",
		reason: "Fügt sich direkt in Ihre bestehende Testumgebung ein.",
	},
	{
		need: "Unit- oder Komponententests",
		recommended: <a href="/getting-started/test-matchers/">test-matchers</a>,
		reason: "Direkte Jest-/Vitest-Integration gegen jsdom.",
	},
	{
		need: "Eigene Integration oder direkter Zugriff auf die Engine",
		recommended: <a href="/getting-started/standalone/"><code>@surea11y/core</code></a>,
		reason: "Maximale Kontrolle über Ausführung und Ergebnisse.",
	},
];

export function GettingStartedContent() {
	return (
		<>
			<h2>Installation</h2>
			<p>
				Es gibt keinen einzelnen Installationsbefehl — surea11y besteht aus einer Core-Engine und
				einer Familie separat veröffentlichter Bindings. Welche Pakete Sie installieren, hängt
				also davon ab, wie Sie Tests oder Skripte bereits ausführen. Wählen Sie Ihren Stack:
			</p>
			<Callout tone="note" title="Unsicher, wo Sie anfangen sollen?">
				<p>
					Nutzen Sie <a href="/getting-started/playwright/">Playwright</a>, um eine echte
					Webanwendung zu scannen, oder die <a href="/getting-started/cli/">CLI</a>, um
					statisches HTML im Terminal oder in einer CI-Pipeline zu prüfen.
				</p>
			</Callout>
			<DataTable
				rowKey="need"
				columns={[
					{ key: "need", label: "Bedarf", wrap: true },
					{ key: "recommended", label: "Empfohlene Option" },
					{ key: "reason", label: "Begründung", wrap: true },
				]}
				rows={choiceRows}
			/>

			<h2>Ein Beispiel in 5 Minuten</h2>
			<p>
				Mit der CLI sehen Sie am schnellsten ein echtes Ergebnis — ohne Browser-Setup, ohne
				Test-Framework. Scannen Sie eine minimale Seite:
			</p>
			<CodeBlock lang="html" lines={[
				"<html lang=\"en\">",
				"  <body>",
				"    <main>",
				"      <h1>Welcome</h1>",
				"      <p style=\"color: #999999; background-color: #ffffff;\">This text has low contrast.</p>",
				"      <a href=\"/details\">Click here</a>",
				"    </main>",
				"  </body>",
				"</html>",
			]} />
			<CodeBlock
				lines={[
					{ text: "npm install -g @surea11y/cli", command: true },
					{ text: "surea11y scan ./index.html", command: true },
				]}
			/>
			<CodeBlock
				lines={[
					"surea11y scan: file:///path/to/index.html",
					"  pass: 6   fail: 2   cantTell: 3   notApplicable: 114",
					"",
					"  occurrences by tier: fail: 2   cantTell: 4",
					"",
					"FAIL (2 rule(s)):",
					"",
					"  contrast-enhanced  (serious, 1 fail occurrence(s))",
					"    - html > body > main > p",
					"      Element has insufficient color contrast (AAA) of 2.85:1 (foreground: #999999,",
					"      background: #ffffff, font size: 0px, font weight: normal). Expected contrast",
					"      ratio of 7:1 (normal text).",
					"",
					"  contrast-minimum  (serious, 1 fail occurrence(s))",
					"    - html > body > main > p",
					"      Element has insufficient color contrast of 2.85:1 (foreground: #999999,",
					"      background: #ffffff, font size: 0px, font weight: normal). Expected contrast",
					"      ratio of 4.5:1 (normal text).",
					"",
					"cantTell — needs human review (3 rule(s)): contrast-computable, link-name-quality,",
					"manual-review",
				]}
			/>
			<p>
				Ein <code>fail</code>, bei dem sich die Engine sicher ist (Kontrast), eine{" "}
				<code>cantTell</code>-Liste zur Prüfung durch einen Menschen (ist „Click here“ ein guter
				Linkname, besteht derselbe kontrastarme Text eine andere Prüfung, gibt es hier etwas, das
				manuell angesehen werden muss) und unter den 114 <code>notApplicable</code>-Ergebnissen{" "}
				<code>target-size-minimum</code> — diese Regel kann ohne echtes CSS-Layout nicht laufen,
				und das hat ein Scan von statischem HTML nicht. Unter{" "}
				<a href="/results-reports/output-schema/">Ergebnisse und Berichte</a> erfahren Sie, was
				jedes Feld eines vollständigen Ergebnisses bedeutet.
			</p>
			<ul>
				<li>
					<strong>End-to-End-Tests mit einem echten oder Headless-Browser:</strong>{" "}
					<a href="/getting-started/cypress/">Cypress</a>,{" "}
					<a href="/getting-started/playwright/">Playwright</a>,{" "}
					<a href="/getting-started/puppeteer/">Puppeteer</a>,{" "}
					<a href="/getting-started/selenium/">Selenium</a> oder{" "}
					<a href="/getting-started/webdriverio/">WebdriverIO</a>.
				</li>
				<li>
					<strong>Unit- und Komponententests gegen jsdom:</strong>{" "}
					<a href="/getting-started/test-matchers/">test-matchers</a>, für Jest oder Vitest.
				</li>
				<li>
					<strong>Statisches HTML im Terminal oder in einer CI-Pipeline:</strong> die{" "}
					<a href="/getting-started/cli/">CLI</a>.
				</li>
				<li>
					<strong>Kein Test-Framework, kein Build-Schritt:</strong>{" "}
					<a href="/getting-started/standalone/">Standalone</a> — installieren Sie{" "}
					<code>@surea11y/core</code> direkt oder binden Sie das Browser-Bundle ein.
				</li>
			</ul>

			<h2>Verwendung</h2>
			<p>
				Egal, wie Sie einen Scan ausführen — jsdom, ein echter Browser, ein beliebiges Binding,
				die CLI —, er liefert dieselbe native Ergebnisform: <code>checksResults</code> (ein
				Eintrag pro Regel, einschließlich jedes <code>pass</code>/<code>notApplicable</code> —
				keine Liste nur mit Verstößen) und <code>rulesResults</code> (Zusammenfassungen pro
				WCAG-Erfolgskriterium). Das ist <strong>nicht</strong> die Form{" "}
				<code>violations</code>/<code>passes</code>/<code>incomplete</code>/<code>inapplicable</code>,
				die andere verbreitete Werkzeuge für Barrierefreiheitstests verwenden — die Methodennamen
				der einzelnen Bindings orientieren sich an gängigen Konventionen in diesem Bereich, damit
				der Umstieg vertraut wirkt, aber das reichhaltigere Ergebnisschema bleibt unverändert.
				Das vollständige Schema finden Sie unter{" "}
				<a href="/results-reports/output-schema/">Ergebnisse und Berichte</a>.
			</p>
		</>
	);
}
