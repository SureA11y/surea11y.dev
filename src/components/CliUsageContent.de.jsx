import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";
const cliDocs = "https://github.com/SureA11y/cli/blob/main/docs/CLI.md";

export function CliUsageContent() {
	return (
		<>
			<p>
				Ein Befehl statt Code — kein Test-Framework und kein Node-Skript nötig, gut geeignet als
				Pipeline-Schritt oder für eine schnelle Prüfung eines Build-Artefakts.
			</p>

			<h2>Erster Scan</h2>
			<CodeBlock
				lines={[
					{ text: "npm install -g @surea11y/cli", command: true },
					{ text: "surea11y scan ./index.html", command: true },
					{ text: "surea11y scan https://example.com/ --wcag 2.2", command: true },
				]}
			/>
			<p>
				Erfordert Node.js <code>^20.19.0 || ^22.13.0 || &gt;=24.0.0</code>. Die Zusammenfassung
				nennt das Release von <code>@surea11y/core</code>, das den Scan ausgeführt hat:
			</p>
			<CodeBlock
				lines={[
					"$ surea11y scan ./index.html",
					"",
					"surea11y scan: file:///path/to/index.html",
					"  engine: @surea11y/core 1.17.0",
					"  pass: 16   fail: 4   cantTell: 4   notApplicable: 125",
					"",
					"  occurrences by tier: fail: 4   cantTell: 4",
					"  needs review: likely fail: 1   likely pass: 0   needs a person: 3",
					"",
					"FAIL (4 rule(s)):",
					"",
					"  button-name-present  (serious, 1 fail occurrence(s))",
					"    - html > body > main > button",
					"      This button has no accessible name.",
					"      hint: Give the button visible text, or name it with aria-label, so screen",
					"      reader users know what it does.",
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
					"      Element has insufficient color contrast of 2.85:1 (foreground: #999999,",
					"      background: #ffffff, font size: 16px, font weight: normal). Expected",
					"      contrast ratio of 4.5:1 (normal text).",
					"      hint: Change the text color, the background color, or both, so the",
					"      contrast ratio reaches at least 4.5:1.",
					"",
					"  img-alt-present  (serious, 1 fail occurrence(s))",
					"    - html > body > main > img",
					"      This <img> has no alt attribute.",
					"      hint: Add an alt attribute that says what the image shows, or alt=\"\" if",
					"      the image is purely decorative.",
					"",
					"LIKELY FAIL — confirm (1 occurrence(s)):",
					"  - heading-order (minor): html > body > main > h3",
					"    This level-3 heading \"Details\" follows the level-1 heading \"Welcome\",",
					"    skipping a level.",
					"    why: The heading skips a level after the one before it.",
					"",
					"cantTell — needs human review (4 rule(s)): heading-order, link-name-quality,",
					"manual-review, page-title-patterns",
					"",
					"criteria (WCAG 2.2):",
					"  fail       1.1.1 Non-text content: text alternatives; 1.4.3 Contrast: minimum;",
					"             1.4.6 Contrast: enhanced; 4.1.2 Name, role, value: accessible name",
					"  cantTell   1.2.1 Audio-only and video-only (prerecorded): transcript; 1.2.2",
					"             Captions (Prerecorded); 1.3.1 Info and Relationships; 1.3.4",
					"             Orientation; 1.3.5 Identify Input Purpose; 1.4.1 Use of Color;",
					"             1.4.2 Audio Control; 1.4.4 Resize Text; 1.4.5 Images of Text;",
					"             1.4.11 Non-text Contrast; 1.4.12 Text Spacing; 2.1.1 Keyboard;",
					"             2.1.3 Keyboard (No Exception); 2.2.1 Timing Adjustable; 2.2.2",
					"             Pause, Stop, Hide; 2.2.4 Interruptions; 2.4.1 Bypass Blocks; 2.4.2",
					"             Page titled; 2.4.3 Focus order; 2.4.4 Link Purpose (In Context);",
					"             2.4.6 Headings and Labels; 2.4.7 Focus visible; 2.4.9 Link Purpose",
					"             (Link Only); 2.4.11 Focus Not Obscured (Minimum); 2.4.12 Focus Not",
					"             Obscured (Enhanced); 2.4.13 Focus Appearance; 2.5.5 Target Size",
					"             (Enhanced); 2.5.8 Target size: minimum; 3.1.1 Language of page;",
					"             3.1.2 Language of Parts; 3.2.5 Change on Request; 3.3.1 Error",
					"             Identification; 3.3.2 Labels or Instructions; 3.3.8 Accessible",
					"             Authentication (Minimum); 4.1.2 Name, role, value: ARIA validity;",
					"             4.1.3 Status Messages",
					"  notApplicable: 2",
					"  A criterion that passes here means the checks that ran found nothing in it,",
					"  not that the page conforms.",
				]}
			/>
			<p>
				Die Zeile <code>needs review</code> ordnet die Fragen danach, was die prüfende Person mit
				ihnen tut: <em lang="en">likely fail</em> (die Hinweise auf der Seite deuten auf einen
				Fehlschlag, wie die übersprungene Überschriftenebene hier), <em lang="en">likely pass</em>{" "}
				und <em lang="en">needs a person</em>. Die wahrscheinlichen Fehlschläge werden mit dem Grund
				aufgelistet, aus dem sie in diese Richtung tendieren, und jede Frage in <code>--json</code>{" "}
				und in den Berichten enthält die Schritte, mit denen sie sich beantworten lässt (
				<code>howToCheck</code>).
			</p>
			<p>
				Der Block <code>criteria</code> liest denselben Scan nach WCAG-Erfolgskriterium, so wie man
				meist fragt („scheitert sie an 1.4.3?“): zuerst <code>fail</code>, dann{" "}
				<code>cantTell</code> und eine Anzahl für <code>notApplicable</code>. Seit{" "}
				<code>@surea11y/core</code> 1.14 steht kein Kriterium mehr unter <code>pass</code>: Ein
				Kriterium gilt nur dann als bestanden, wenn seine Regeln alles prüfen, was es verlangt, und
				noch keines ist als vollständig geprüft erfasst. Ergeben alle seine Regeln{" "}
				<code>pass</code>, bleibt es daher <code>cantTell</code>, damit eine Person den Rest prüft.
				Der Block ändert den Exit-Code nie, und <code>--compact</code> zeigt ihn als Anzahlen.
				Schlägt keine Regel fehl, endet die Zusammenfassung mit dem Hinweis, dass das keine Aussage
				über Konformität ist, und nennt, was eine Person noch prüft.
			</p>

			<h2 id="several-pages">Mehrere Seiten oder eine Sitemap</h2>
			<p>
				Nennen Sie mehrere Seiten, listen Sie sie in einer Datei auf (ein Pfad oder eine URL pro
				Zeile, mit <code>#</code>-Kommentaren), oder richten Sie den Scan auf eine Sitemap:
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html ./dist/pricing.html", command: true },
					{ text: "surea11y scan --urls pages.txt", command: true },
					{ text: "surea11y scan --sitemap https://example.com/sitemap.xml   # up to 50 pages; --max-pages to change it", command: true },
				]}
			/>
			<p>
				Jede Seite erhält einen eigenen Abschnitt in der Zusammenfassung, eine letzte Zeile zählt
				die Seiten mit Fehlschlägen, und der Lauf schlägt fehl, sobald eine Seite fehlschlägt.{" "}
				<code>--json</code> gibt ein Array aus, <code>--sarif</code> und <code>--junit</code>{" "}
				schreiben eine Datei für alle Seiten, <code>--html</code> schreibt einen Bericht pro Seite
				(<code>report.html</code>, <code>report-2.html</code> …), und eine Baseline merkt sich, auf
				welcher Seite jeder bekannte Fehlschlag war. Eine Sitemap kann eine URL oder eine lokale
				Datei sein, unkomprimiert oder mit gzip, und einem Sitemap-Index wird eine Ebene tief
				gefolgt. Eine Seite, die sich nicht scannen lässt, beendet den Lauf mit Exit-Code{" "}
				<code>2</code> und wird genannt, bevor etwas geschrieben wird.
			</p>

			<h2 id="in-a-real-browser">In einem echten Browser</h2>
			<p>
				Standardmäßig liest die CLI statisches HTML. Für Seiten, deren Inhalt ihr JavaScript
				rendert, installieren Sie Playwright in Ihrem Projekt und ergänzen <code>--browser</code>:
				Jede Seite wird in Headless-Chromium geöffnet, ihre Skripte laufen, und der Scan sieht, was
				gerendert wird, mit echtem Layout für die Regeln, die es messen. Die Engine ist dasselbe{" "}
				<code>@surea11y/core</code>, und jede Option funktioniert damit, auch Berichte, Baselines,
				Packs und eigene Regeln.
			</p>
			<CodeBlock
				lines={[
					{ text: "npm install --save-dev playwright", command: true },
					{ text: "npx playwright install chromium", command: true },
					{ text: "surea11y scan https://app.example.com/ https://app.example.com/settings --browser", command: true },
				]}
			/>
			<p>
				Eine Anwendung, die ihre Daten nach dem Laden abruft, kann den Scan darauf warten lassen,
				und eine Seite lässt sich in Smartphone-Breite, im dunklen Modus oder in jeder Kombination
				mehrerer Werte scannen:
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan https://app.example.com/orders --browser --wait-for \"#orders-table\"", command: true },
					{ text: "surea11y scan https://example.com/ --browser --width 320 --color-scheme dark", command: true },
					{ text: "surea11y scan https://example.com/ --browser --width 1280,320 --color-scheme light,dark", command: true },
				]}
			/>
			<p>
				<code>--wait-for</code> wartet bis zu 30 Sekunden (<code>--wait-timeout</code> ändert das)
				und beendet den Lauf mit Exit-Code <code>2</code>, wenn das Element nie erscheint. Mehrere
				Breiten oder Farbschemata laden die Seite einmal und führen die Scans zu einem Ergebnis pro
				Seite zusammen: das schlechteste Ergebnis jeder Regel, und jeder Befund einmal, mit den
				Kombinationen, in denen er auftrat (<code>seen in:</code>).
			</p>
			<p>
				Bevor jede Seite lädt, installiert die CLI den Internals- und den Listener-Hook von core.
				Der Scan beurteilt daher Namen, die Web Components über <code>ElementInternals</code>{" "}
				setzen, und Klick-Handler, die per Skript hinzugefügt wurden: Ein{" "}
				<code>role="button"</code>, den Enter und Leertaste nie erreichen, ergibt{" "}
				<code>fail</code>. <code>--live-regions</code> ergänzt den Live-Region-Hook, sodass der
				Scan zu einer Statusmeldung, die schon mit ihrem Text eingefügt wurde und die Screenreader
				oft nicht ansagen, eine Frage stellt; <code>--no-hooks</code> lässt die ersten beiden weg.
				Die Zusammenfassung nennt Viewport, Farbschema und Hooks jedes Scans. Die CLI klickt,
				tippt und meldet sich nicht an: Für Inhalte, die erst danach erscheinen, steuern Sie den
				Browser mit einem der Bindings. Frames innerhalb der Seite werden noch nicht gescannt.
			</p>

			<h2 id="choosing-what-runs">Auswählen, was läuft</h2>
			<p>
				<code>--wcag</code> wählt die Regeln für ein WCAG-Konformitätsziel aus, nach der Stufe, die
				jedes Kriterium in dieser Version hat; <code>--wcag-level</code> legt dessen Stufe fest
				(<code>AA</code>, sofern nichts anderes angegeben ist). <code>--best-practices</code>{" "}
				ergänzt die Regeln, die kein WCAG-Kriterium prüfen, etwa <code>region</code> und{" "}
				<code>heading-order</code>; allein angegeben führt es nur diese aus. <code>--profile</code>{" "}
				führt ein Konformitätsprofil aus, etwa <code>en301549-v4.1.1</code> oder das eines Packs.
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --wcag 2.2                    # WCAG 2.2, Level A and AA", command: true },
					{ text: "surea11y scan ./dist/index.html --wcag 2.1 --wcag-level A     # WCAG 2.1, Level A", command: true },
					{ text: "surea11y scan ./dist/index.html --wcag 2.2 --best-practices   # and the best practices", command: true },
				]}
			/>
			<p>
				4.1.1 Syntaxanalyse, das WCAG 2.2 entfernt hat, gehört zu einem Ziel <code>2.1</code>, nicht
				aber zu einem Ziel <code>2.2</code>. <code>--rules</code> und <code>--tags</code> ergänzen
				die Regeln eines Ziels, und <code>--exclude-rules</code> wirkt danach. Neben{" "}
				<code>--profile</code> ergänzt <code>--best-practices</code> seine Regeln, und das Profil
				gilt weiterhin; <code>--wcag</code>, <code>--rules</code> und <code>--tags</code> wählen die
				Regeln anstelle eines Profils, daher endet <code>--profile</code> zusammen mit einem davon
				mit Exit-Code <code>2</code>. Sie entsprechen <code>runOnly.wcag</code>,{" "}
				<code>runOnly.bestPractices</code> und <code>engineOptions.profile</code> (siehe{" "}
				<a href="/configuration/engine-options/#selecting-which-rules-run">Engine-Optionen</a>).
			</p>

			<h2 id="naming-checks">Prüfungen selbst benennen</h2>
			<p>
				Sind beide angegeben, führen <code>--rules</code> und <code>--tags</code> die
				Regeln aus, die zu beiden passen. Für „dieser Bereich, und dazu diese Prüfungen“
				geben Sie <code>--include-mode or</code> an, das die Regeln ausführt, die zu
				einem von beiden passen. Ohne diese Option führt der Scan unten keine Regel aus,
				da <code>contrast-computable</code> nicht mit <code>forms</code> getaggt ist,
				und endet mit <code>2</code>, statt ohne geprüfte Regel zu bestehen.
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/form.html --tags forms --rules contrast-computable --include-mode or", command: true },
				]}
			/>
			<p>
				Ein Scan, der Prüfungen benennt, meldet die WCAG-Kriterien, zu denen sie
				gehören, auf jeder Stufe. <code>contrast-computable</code> prüft 1.4.3 (AA) und
				1.4.6 (AAA), sodass eine Website, die AA erfüllt, ein nicht bestandenes
				AAA-Kriterium zeigen kann, das sie nie angestrebt hat. Ohne <code>--wcag</code>{" "}
				legt <code>--wcag-level</code> die Stufe der gemeldeten Kriterien fest, ohne zu
				ändern, welche Regeln laufen:
			</p>
			<CodeBlock
				lines={[
					"$ surea11y scan ./index.html --rules contrast-computable --wcag-level AA",
					"",
					"surea11y scan: file:///path/to/index.html",
					"  engine: @surea11y/core 1.17.0",
					"  WCAG level reported: AA",
					"  pass: 1   fail: 0   cantTell: 0   notApplicable: 0",
					"",
					"  occurrences by tier: fail: 0   cantTell: 0",
					"",
					"criteria (WCAG 2.2 AA):",
					"  cantTell   1.4.3 Contrast: minimum (partly checked: 1 of 2 checks not selected)",
					"  A criterion that passes here means the checks that ran found nothing in it,",
					"  not that the page conforms.",
					"",
					"No rule failed, which is not a claim that the page conforms: the automated rules",
					"found nothing definite. A person still checks the cantTell findings, keyboard",
					"use, how a screen reader reads the page, and the content itself.",
				]}
			/>
			<p>
				1.4.3 ist <em>teilweise geprüft</em>: Seine andere Prüfung,{" "}
				<code>contrast-minimum</code>, wurde nicht ausgewählt, daher deckt sein Ergebnis
				nur die ausgeführte Prüfung ab, und da keine Regel fehlgeschlagen ist, endet die
				Zusammenfassung mit dem Hinweis, dass das keine Aussage über Konformität ist. Regel-IDs und Stufen werden ohne Rücksicht auf
				Groß- und Kleinschreibung gelesen (<code>--rules IMG-ALT-PRESENT</code>,{" "}
				<code>--wcag-level aa</code>). <code>--include-mode</code> entspricht{" "}
				<code>engineOptions.includeMode</code>, und <code>--wcag-level</code> ohne{" "}
				<code>--wcag</code> entspricht <code>engineOptions.wcagLevel</code>.
			</p>

			<h2 id="packs">Packs</h2>
			<p>
				<code>--pack</code> lädt ein <a href="/configuration/packs/">Pack</a> (Regeln, eine Norm
				oder eine Checkliste und deren Profile) über den Paketnamen, aufgelöst aus dem Projekt des
				Arbeitsverzeichnisses, oder über einen Pfad; <code>--profile</code> führt eines seiner
				Profile aus. Wiederholen Sie <code>--pack</code>, um mit mehreren zu scannen.
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --pack @acme/a11y-policy --profile acme-web-2026", command: true },
					{ text: "surea11y scan ./dist/index.html --pack ./acme-policy-pack.js --profile acme-web-2026", command: true },
				]}
			/>
			<p>
				Die Zusammenfassung nennt das Profil und die Packs, die gelaufen sind, und{" "}
				<code>--json</code> enthält sie als <code>engine.profile</code> und{" "}
				<code>engine.packs</code>. Ein Pack, das sich nicht finden oder laden lässt oder das die
				Engine überspringt, endet mit Exit-Code <code>2</code>, ohne dass ein Bericht geschrieben
				wird, sodass ein Scan nie besteht, während die Prüfungen des Packs nicht gelaufen sind.
			</p>

			<h2 id="several-profiles">Mehrere Profile</h2>
			<p>
				<code>--profile</code> kann mehrmals angegeben werden, um jede Seite nach mehreren Profilen
				zugleich zu beurteilen, das eines Packs neben dem von WCAG oder dem eines anderen Packs (ab{" "}
				<code>@surea11y/cli</code> 1.5.0 und core 1.15.0):
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --pack @surea11y/pack-wai-aria --profile wcag22-aa --profile wai-aria-1.2", command: true },
				]}
			/>
			<p>
				Jedes Profil beurteilt die Seite so, wie es das allein täte, und das Ergebnis liest sich wie
				ein einziges Profil mit den Regeln aller: Das Ergebnis einer Regel ist das schlechteste, das
				ihre Profile ihr geben, ein Fehlschlag unter irgendeinem Profil endet also mit Exit-Code{" "}
				<code>1</code>, und die <code>verdicts</code> jedes Befunds in <code>--json</code> sagen,
				was jedes Profil daraus macht (siehe{" "}
				<a href="/results-reports/output-schema/#several-profiles">Ausgabeschema</a>). Die
				Zusammenfassung führt sie auf (<code>profiles: wcag22-aa, wai-aria-1.2</code>),{" "}
				<code>--html</code> nennt jedes und zeigt das Urteil jedes Profils zu einem Befund, und{" "}
				<code>--sarif</code> und <code>--junit</code> steuern nach dem schlechtesten Ergebnis. Ein
				Profil, das nicht gelaufen ist, endet mit Exit-Code <code>2</code> und wird mit dem Grund
				aufgeführt; <code>--allow-profiles-not-run</code> macht daraus eine Warnung, außer bei einem
				Profil, dessen Pack die Engine übersprungen hat, da das übersprungene Pack selbst mit{" "}
				<code>2</code> endet.
			</p>

			<h2 id="failing-only-on-serious-problems">Nur bei schwerwiegenden Problemen fehlschlagen</h2>
			<p>
				<code>--fail-on-severity</code> (<code>critical</code>, <code>serious</code>,{" "}
				<code>moderate</code> oder <code>minor</code>) lässt den Lauf nur bei fehlschlagenden
				Regeln ab diesem Schweregrad fehlschlagen; mit <code>--baseline</code> nur bei neuen. Jeder
				Fehlschlag wird weiter gemeldet, und die Zusammenfassung markiert die unterhalb der Stufe.
				So kann ein Team zuerst bei schwerwiegenden Problemen blockieren und die Schwelle
				verschärfen, während der Rückstand schrumpft.
			</p>
			<CodeBlock lines={[{ text: "surea11y scan --urls pages.txt --fail-on-severity serious", command: true }]} />

			<h2 id="questions-that-likely-fail">Fragen, die wahrscheinlich nicht erfüllt sind</h2>
			<p>
				<code>--fail-on-lean</code> lässt den Lauf auch bei den Fragen fehlschlagen, die
				wahrscheinlich nicht erfüllt sind (<code>leaningFailures()</code> aus core), ab dem
				Schweregrad von <code>--fail-on-severity</code>, wenn Sie einen angeben;{" "}
				<code>--lean-fail-wcag-only</code> zählt nur die von Regeln, die einem WCAG-Kriterium
				zugeordnet sind, ohne die Best Practices. Damit meldet <code>--junit</code> eine solche
				Regel als fehlgeschlagenen Test und <code>--sarif</code> einen solchen Befund als{" "}
				<code>error</code>, und <code>--write-baseline</code> zeichnet auch die heutigen
				wahrscheinlichen Fehlschläge auf, sodass <code>--baseline</code> nur bei neuen blockiert.
				Das ist optional, weil eine Tendenz ein Hinweis ist, kein Beweis: Ob ein Befund tendiert,
				und in welche Richtung, kann sich in einer Minor-Version von core ändern.
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --fail-on-lean --lean-fail-wcag-only", command: true },
					{ text: "surea11y scan ./dist/index.html --fail-on-lean --write-baseline baseline.json   # once, commit it", command: true },
					{ text: "surea11y scan ./dist/index.html --fail-on-lean --baseline baseline.json         # in CI, from then on", command: true },
				]}
			/>

			<h2 id="manual-checks">Manuelle Prüfungen</h2>
			<p>
				Ein Scan entscheidet, was Regeln entscheiden können. <code>--manual-checks &lt;path&gt;</code>{" "}
				schreibt daneben den Rest: ein Arbeitsblatt der Prüfungen, die keine Regel vollständig
				entscheidet, damit eine Person sie von Hand durchführt, mit den Schritten für jede, dem, was
				als bestanden und was als nicht bestanden gilt, und einem Ergebnis und Notizen zum Festhalten
				(die <a href="/conformance/procedures/">Prüfverfahren</a> von core). Mit{" "}
				<code>--html</code>, dessen Bericht jetzt mit „Was ein Mensch noch prüfen muss“ endet, hat
				das Team beide Hälften der Bewertung aus einem Lauf:
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan https://example.com/ --wcag 2.2 --html report.html --manual-checks manual-checks.html", command: true },
				]}
			/>
			<ul>
				<li>
					<strong>Für welchen Standard:</strong> den gescannten. Das Profil eines Packs gibt diesen
					Standard und diese Version vor, unter seinen eigenen Nummern, wo das Pack Prüfverfahren
					mitbringt; sonst WCAG, in der Version und Stufe von <code>--wcag</code> und{" "}
					<code>--wcag-level</code> oder vom Ziel von <code>--profile</code>, standardmäßig
					WCAG 2.2 A und AA. Mit mehreren <code>--profile</code> ein Arbeitsblatt pro Standard und
					Version.
				</li>
				<li>
					<strong>In welcher Sprache:</strong> in der von <code>--locale</code>. Ein Pfad, der auf{" "}
					<code>.md</code> endet, schreibt stattdessen Markdown, mit einem Aufgabenpunkt pro
					Prüfung.
				</li>
				<li>
					<strong>Mehrere Seiten:</strong> ein Arbeitsblatt pro Seite, nummeriert wie die von{" "}
					<code>--html</code>, jedes mit seiner Seite betitelt, sodass die Ergebnisse jeder Seite
					getrennt bleiben.
				</li>
			</ul>
			<p>
				Es ändert nie den Exit-Code. Öffnen Sie das Arbeitsblatt von der Festplatte, halten Sie
				jedes Ergebnis und Notizen fest und laden Sie sie als JSON herunter, mit dem Ergebnis jedes
				Kriteriums aus seinen Prüfungen zusammengefasst, oder als CSV.
			</p>

			<h2 id="procedures">Prüfverfahren, ohne Scan</h2>
			<p>
				<code>surea11y procedures</code> schreibt, wie eine Person jede Anforderung eines Standards
				von Hand bewertet, ohne Scan: eine Referenz zum Lesen oder ein Arbeitsblatt zum
				Durcharbeiten (<code>--checklist</code>), in HTML, Markdown oder JSON.
			</p>
			<CodeBlock
				lines={[
					"# How to assess every WCAG 2.2 A and AA criterion, as a page",
					{ text: "surea11y procedures --wcag 2.2 --wcag-level AA -o wcag-22-aa.html", command: true },
					"",
					"# A worksheet for a manual audit, titled for it",
					{ text: 'surea11y procedures --wcag-level AA --checklist --title "Audit: example.com" -o audit.html', command: true },
					"",
					"# Only what no rule decides in full, as Markdown for a repository",
					{ text: "surea11y procedures --wcag-level AA --automation manual,partial -o left-to-a-person.md", command: true },
					"",
					"# What needs a screen reader, for a session with a person who uses one",
					{ text: "surea11y procedures --wcag-level AA --tools screen-reader -o screen-reader-session.html", command: true },
					"",
					"# One criterion, in French, with the steps a scan's questions give",
					{ text: "surea11y procedures 1.4.12 --locale fr --variants -o 1.4.12.html", command: true },
					"",
					"# A pack's standard, under its own numbers",
					{ text: "surea11y procedures --pack @surea11y/pack-en301549 --profile en301549-v4.1.1 --checklist -o en-301-549.html", command: true },
				]}
			/>
			<p>
				<code>--standard</code> und <code>--standard-version</code> nennen den Standard eines Packs
				über Schlüssel und Version, <code>--rules</code> behält nur, was bestimmte Regeln testen,{" "}
				<code>--no-record</code> erzeugt ein Arbeitsblatt ohne etwas zum Festhalten, und{" "}
				<code>--json</code> die Daten statt einer Seite. Die Optionen eines Scans sind hier ein
				Aufruffehler, so wie diese bei <code>scan</code>. Jedes Flag finden Sie in{" "}
				<a href={`${cliDocs}#procedures-how-to-assess-by-hand`}>der CLI-Referenz</a> auf GitHub.
			</p>

			<h2 id="compact-results">Kompakte Ergebnisse</h2>
			<p>
				<code>--compact</code> reduziert jedes <code>pass</code>- und{" "}
				<code>notApplicable</code>-Ergebnis auf Regel, Ergebnis und Typ
				(<code>engineOptions.output.detail: 'findings'</code>): ein kleineres <code>--json</code>{" "}
				für ein Ergebnis, das als CI-Artefakt aufbewahrt wird. Zusammenfassung, Exit-Code, Baseline
				sowie HTML-, SARIF- und JUnit-Berichte sind dieselben wie ohne die Option.
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --compact --json > result.json", command: true }]} />

			<h2>Exit-Codes und Einschränkungen</h2>
			<p>
				<code>cantTell</code> beeinflusst den Exit-Code nicht, außer mit{" "}
				<code>--fail-on-lean</code>: <code>0</code> bestanden, <code>1</code> mindestens ein — bzw.
				beim Scannen mit <code>--baseline</code> mindestens ein <em>neues</em> — <code>fail</code>{" "}
				auf einer Seite (der Fall für CI-Gating; <code>--fail-on-severity</code> zählt nur die ab
				seiner Stufe; unter <a href="/conformance/baseline/">Baseline / Allowlist</a> steht, was als
				„bekannt“ und was als „neu“ gilt), <code>2</code> ein Aufruf- oder Scan-Fehler oder ein
				Scan, der nichts oder weniger als verlangt geprüft hätte: eine{" "}
				<code>--rules</code>-/<code>--tags</code>-Liste, die keine bekannte Regel und kein
				bekanntes Tag nennt, ein <code>--context</code>-Selektor, der auf nichts passt, eine eigene
				Regel oder ein Pack, die nicht gelaufen sind, ein <code>--profile</code>, das nicht
				angewendet wurde (bei mehreren eines, das nicht gelaufen ist, außer mit{" "}
				<code>--allow-profiles-not-run</code>). Eine <code>--baseline</code>- oder{" "}
				<code>--migrate-baseline</code>-Datei mit einem Eintrag, der keiner ist (<code>null</code>,
				kein <code>ruleId</code>, ein <code>selector</code>, der kein String ist), endet vor dem
				Scan mit <code>2</code> und nennt Datei und Eintrag (<code>@surea11y/cli</code> 1.6.0 und
				neuer). Eine vom vorherigen Minor-Release geschriebene
				Baseline passt weiterhin zu Befunden, deren Reason-Codes sich seitdem verschoben haben;{" "}
				<code>--migrate-baseline baseline.json</code> schreibt sie mit den neuen Codes neu (siehe{" "}
				<a href="/conformance/baseline/#upgrading">Upgrade</a>).
			</p>
			<p>
				Ohne <code>--browser</code> liest die CLI <strong>nur statisches HTML</strong> — eine
				lokale Datei oder den rohen Body eines HTTP(S)-GET — und führt nie JavaScript der Seite
				aus. Keiner der beiden Modi klickt, tippt oder meldet sich an: Für Inhalte, die erst danach
				erscheinen, verwenden Sie eines der Bindings oder rufen die Engine direkt in einem Browser
				auf, den Sie selbst steuern (<span lang="en">Pattern 2</span> in{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>, dem
				Integrationsleitfaden auf GitHub).
			</p>
			<p>
				Vollständige Referenz der Flags, Vertrag für eigene Regeln, Packs und CI-Rezepte:{" "}
				<a href={cliDocs}><code>docs/CLI.md</code></a>. Fertige Vorlagen für CI-Pipelines finden
				Sie unter <a href="/configuration/ci-integration/">CI-Integration</a>.
			</p>
		</>
	);
}
