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
		reason: (
			<>
				Keine Integration zu schreiben — ein einziger Befehl gegen Dateien, URLs, eine Sitemap oder
				in einem CI-Schritt; mit <code>--browser</code> scannt sie auch Seiten, die ihr JavaScript
				rendert.
			</>
		),
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
				label="Wahl der passenden Option"
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
					"",
					"surea11y scan: file:///path/to/index.html",
					"  engine: @surea11y/core 1.15.0",
					"  pass: 14   fail: 3   cantTell: 2   notApplicable: 126",
					"",
					"  occurrences by tier: fail: 3   cantTell: 2",
					"  needs review: likely fail: 0   likely pass: 0   needs a person: 2",
					"",
					"FAIL (3 rule(s)):",
					"",
					"  contrast-enhanced  (serious, 1 fail occurrence(s))",
					"    - html > body > main > p",
					"      Element has insufficient color contrast (AAA) of 2.85:1 (foreground:",
					"      #999999, background: #ffffff, font size: 16px, font weight: normal).",
					"      Expected contrast ratio of 7:1 (normal text).",
					"      hint: Change the text color, the background color, or both, so the",
					"      contrast ratio reaches at least 7:1.",
					"",
					"  contrast-minimum  (serious, 1 fail occurrence(s))",
					"    - html > body > main > p",
					"      Element has insufficient color contrast of 2.85:1 (foreground:",
					"      #999999, background: #ffffff, font size: 16px, font weight: normal).",
					"      Expected contrast ratio of 4.5:1 (normal text).",
					"      hint: Change the text color, the background color, or both, so the",
					"      contrast ratio reaches at least 4.5:1.",
					"",
					"  page-title-present  (serious, 1 fail occurrence(s))",
					"    - head > title",
					"      This page has no <title> element.",
					"      hint: Add a <title> that says what the page is about or what it is for.",
					"",
					"cantTell — needs human review (2 rule(s)): link-name-quality,",
					"manual-review",
					"",
					"criteria (WCAG 2.2):",
					"  fail       1.4.3 Contrast: minimum; 1.4.6 Contrast: enhanced; 2.4.2 Page",
					"             titled",
					"  cantTell   1.1.1 Non-text content: text alternatives; 1.2.1 Audio-only",
					"             and video-only (prerecorded): transcript; 1.2.2 Captions",
					"             (Prerecorded); 1.3.1 Info and Relationships; 1.3.4",
					"             Orientation; 1.3.5 Identify Input Purpose; 1.4.1 Use of",
					"             Color; 1.4.2 Audio Control; 1.4.4 Resize Text; 1.4.5 Images",
					"             of Text; 1.4.12 Text Spacing; 2.1.1 Keyboard; 2.1.3 Keyboard",
					"             (No Exception); 2.2.1 Timing Adjustable; 2.2.2 Pause, Stop,",
					"             Hide; 2.2.4 Interruptions; 2.4.1 Bypass Blocks; 2.4.3 Focus",
					"             order; 2.4.4 Link Purpose (In Context); 2.4.6 Headings and",
					"             Labels; 2.4.7 Focus visible; 2.4.9 Link Purpose (Link Only);",
					"             2.5.8 Target size: minimum; 3.1.1 Language of page; 3.1.2",
					"             Language of Parts; 3.2.5 Change on Request; 3.3.1 Error",
					"             Identification; 3.3.2 Labels or Instructions; 3.3.8",
					"             Accessible Authentication (Minimum); 4.1.2 Name, role, value:",
					"             accessible name; 4.1.2 Name, role, value: ARIA validity;",
					"             4.1.3 Status Messages",
					"  notApplicable: 2",
					"  A criterion that passes here means the checks that ran found nothing in",
					"  it, not that the page conforms.",
				]}
			/>
			<p>
				Zwei Probleme, bei denen sich die Engine sicher ist, sodass sie <code>fail</code> ergeben:
				der kontrastarme Text, der sowohl am AA- als auch am AAA-Verhältnis scheitert, und das
				fehlende <code>&lt;title&gt;</code>. Dann eine <code>cantTell</code>-Liste zur manuellen
				Prüfung (ist „<span lang="en">Click here</span>“ ein guter Linkname, gibt es hier etwas,
				das manuell angesehen werden muss); die Zeile <code>needs review</code> zeigt, dass keine
				der beiden Fragen in eine Richtung tendiert, beide brauchen also eine Person. Unter den 126{" "}
				<code>notApplicable</code>-Ergebnissen ist <code>target-size-minimum</code>: Diese Regel
				kann ohne echtes CSS-Layout nicht laufen, und das hat ein Scan von statischem HTML nicht (
				<code>--browser</code> gibt ihr eines).
			</p>
			<p>
				Der letzte Block zeigt dasselbe Ergebnis nach WCAG-2.2-Erfolgskriterium: 1.4.3, 1.4.6 und
				2.4.2 ergeben <code>fail</code>; jedes andere Kriterium, das der Scan prüft, ist{" "}
				<code>cantTell</code> und bleibt einer Person überlassen; und die 2, bei denen es nichts zu
				beurteilen gab, werden nur gezählt. Keines steht unter <code>pass</code>: Seit{" "}
				<code>@surea11y/core</code> 1.14 gilt ein Kriterium nur dann als bestanden, wenn seine
				Regeln alles prüfen, was es verlangt, und das tut noch keines. Ergeben sie alle{" "}
				<code>pass</code>, bleibt der Rest also Sache einer Person. Unter{" "}
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
					<strong>Seiten im Terminal oder in einer CI-Pipeline, als statisches HTML oder im Browser:</strong> die{" "}
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
