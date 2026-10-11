import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const apiRows = [
	{
		id: "received",
		param: <code>received</code>,
		type: (
			<>
				<code>Element</code>, <code>Document</code> oder Scan-Ergebnis
			</>
		),
		meaning: (
			<>
				Was geprüft wird. Ein DOM-<code>Element</code>/<code>Document</code> wird automatisch
				gescannt; bei einem Objekt der Form <code>{"{ checksResults: [...] }"}</code> wird direkt
				darauf geprüft, ohne Scan. Alles andere wirft einen <code>TypeError</code>.
			</>
		),
	},
	{
		id: "engineOptions",
		param: <code>engineOptions</code>,
		type: "Objekt (optional)",
		meaning: (
			<>
				Wird unverändert an den Scan von <code>@surea11y/core</code> durchgereicht: dasselbe
				Optionsobjekt, das überall sonst im Ökosystem verwendet wird (siehe{" "}
				<a href="/configuration/engine-options/">Engine-Optionen</a>). Wird ignoriert, wenn{" "}
				<code>received</code> bereits ein Scan-Ergebnis ist.
			</>
		),
	},
	{
		id: "runOnly",
		param: <code>runOnly</code>,
		type: "Objekt, String oder String[] (optional)",
		meaning: (
			<>
				Wird unverändert als <code>runOnly</code> des Scans durchgereicht: ein WCAG-Ziel (
				<code>{"{ wcag: { version: '2.2', level: 'AA' } }"}</code>), <code>bestPractices</code>,
				Regel-IDs oder Tags. Siehe <a href="#choosing-a-wcag-target">Ein WCAG-Ziel wählen</a>. Wird
				ignoriert, wenn <code>received</code> bereits ein Scan-Ergebnis ist.
			</>
		),
	},
];

export function TestMatchersUsageContent() {
	return (
		<>
			<p>
				Für Unit- und Komponententests: Prüfen Sie Barrierefreiheit direkt in einer Jest- oder
				Vitest-Suite, gegen das DOM, das der Test ohnehin hat, statt einen echten oder
				Headless-Browser zu steuern. Wenn Sie stattdessen vollständig gerenderte Seiten testen,
				nutzen Sie{" "}
				<a href="/getting-started/">die browsergesteuerten Bindings</a>.
			</p>
			<p>
				<a href="https://github.com/SureA11y/test-matchers"><code>@surea11y/test-matchers</code></a>{" "}
				ist ein einzelner Matcher, <code>toHaveNoA11yViolations()</code>, der sich unverändert in{" "}
				<code>expect.extend()</code> beider Frameworks einfügt; er enthält keinen
				framework-spezifischen Code. Er scannt die jsdom-basierte Umgebung, in der Ihr Test
				ohnehin läuft; er hängt nicht selbst von <code>jsdom</code> ab und richtet auch keine
				Umgebung für Sie ein. Die Engine von surea11y ist synchron, also auch dieser Matcher: kein{" "}
				<code>await</code>, und damit auch kein vergessenes <code>await</code>, bei dem ein Test
				über ein aufgelöstes Promise stillschweigend besteht.
			</p>
			<CodeBlock lines={[{ text: "npm install --save-dev @surea11y/test-matchers", command: true }]} />

			<h2>Einrichtung</h2>
			<p>
				Ihre Testumgebung muss bereits jsdom-basiert sein: Dieser Matcher scannt das{" "}
				<code>document</code>/<code>window</code>, das sie bereitstellt. Registrieren Sie den
				Matcher einmal, in der Setup-Datei, die Ihr Test-Runner ohnehin lädt:
			</p>
			<h3>Jest</h3>
			<CodeBlock
				lang="js"
				lines={[
					"// jest.setup.js",
					"expect.extend({",
					"  toHaveNoA11yViolations: require('@surea11y/test-matchers').toHaveNoA11yViolations",
					"});",
					"",
					"// jest.config.js",
					"module.exports = {",
					"  testEnvironment: 'jsdom',   // or the explicit jest-environment-jsdom package, depending on your Jest version",
					"  setupFilesAfterEnv: ['./jest.setup.js']",
					"};",
				]}
			/>
			<h3>Vitest</h3>
			<CodeBlock
				lang="js"
				lines={[
					"// vitest.setup.js",
					"import { expect } from 'vitest';",
					"import { toHaveNoA11yViolations } from '@surea11y/test-matchers';",
					"",
					"expect.extend({ toHaveNoA11yViolations });",
					"",
					"// vitest.config.js",
					"export default {",
					"  test: {",
					"    environment: 'jsdom',   // Vitest doesn't bundle jsdom -- install it as a devDependency too",
					"    setupFiles: ['./vitest.setup.js']",
					"  }",
					"};",
				]}
			/>
			<p>
				Die mitgelieferte <code>.d.ts</code> erweitert sowohl Jests globales Interface{" "}
				<code>jest.Matchers</code> als auch die Interfaces von <code>@vitest/expect</code>, ohne
				dass dafür ein Import von <code>@types/jest</code> oder <code>vitest</code> nötig ist.
				Wirksam wird nur die Erweiterung für das Framework, das tatsächlich installiert ist.
			</p>

			<h2>Verwendung</h2>
			<p>Funktioniert mit einem einfachen DOM-Knoten:</p>
			<CodeBlock
				lang="js"
				lines={[
					"test('no accessibility violations', () => {",
					"  document.body.innerHTML = '<img src=\"logo.png\">';",
					"",
					"  expect(document.body).toHaveNoA11yViolations(); // fails: missing alt",
					"});",
				]}
			/>
			<p>
				...oder mit jedem <code>container</code> einer <span lang="en">Testing Library</span>, ob von <span lang="en">React Testing
				Library</span>, <code>wrapper.element</code> von <span lang="en">Vue Test Utils</span>, <span lang="en">Angular Testing Library</span> oder{" "}
				<span lang="en">Svelte Testing Library</span>, denn alle stellen ein gerendertes DOM-Element auf dieselbe Weise
				bereit:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { render } = require('@testing-library/react');",
					"",
					"test('MyComponent has no accessibility violations', () => {",
					"  const { container } = render(<MyComponent />);",
					"",
					"  expect(container).toHaveNoA11yViolations();",
					"});",
				]}
			/>
			<p>
				Auch auf der Seite des Test-Runners ist das framework-unabhängig: Die Snippets oben sind
				identisch, ob sie unter Jest oder Vitest laufen, sobald der Matcher registriert ist.
			</p>

			<h3>Mit <code>.not</code> prüfen</h3>
			<CodeBlock
				lang="js"
				lines={[
					"test('a page with a violation fails the assertion', () => {",
					"  document.body.innerHTML = '<main><img src=\"logo.png\"></main>';",
					"",
					"  expect(document.body).not.toHaveNoA11yViolations();",
					"});",
				]}
			/>

			<h3>Einen Scan für mehrere Assertions wiederverwenden</h3>
			<p>
				Wenn Sie ein surea11y-Scan-Ergebnis bereits selbst berechnen, etwa um über mehrere{" "}
				<code>it()</code>-Blöcke hinweg auf bestimmte Regeln zu prüfen, ohne jedes Mal neu zu
				scannen, übergeben Sie statt eines DOM-Knotens direkt das Ergebnisobjekt:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { runDomRulesInPage } = require('@surea11y/core');",
					"",
					"const result = runDomRulesInPage(null, '#main', {}, null);",
					"expect(result).toHaveNoA11yViolations();",
				]}
			/>

			<h2>Scans filtern und konfigurieren</h2>
			<p>
				Das zweite Argument akzeptiert alles, was <code>@surea11y/core</code> akzeptiert; den
				vollen Umfang finden Sie unter{" "}
				<a href="/configuration/engine-options/">Engine-Optionen</a>. Einige häufige Fälle:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// Only run rules relevant to WCAG 2.0 A",
					"expect(container).toHaveNoA11yViolations({ tags: { include: 'wcag2a' } });",
					"",
					"// Skip a rule you've decided not to enforce yet",
					"expect(container).toHaveNoA11yViolations({ rules: { exclude: 'target-size-minimum' } });",
					"",
					"// Ignore a third-party widget you don't control",
					"expect(container).toHaveNoA11yViolations({ excludeSelectors: ['.intercom-launcher'] });",
				]}
			/>

			<h3 id="choosing-a-wcag-target">Ein WCAG-Ziel wählen (<code>runOnly</code>)</h3>
			<p>
				Das dritte Argument ist das <code>runOnly</code> des Scans und wird unverändert an die
				Engine übergeben. <code>runOnly.wcag</code> wählt nach Konformitätsziel aus:{" "}
				<code>{"{ wcag: { version: '2.2', level: 'AA' } }"}</code> führt die Regeln für die
				Kriterien der Stufen A und AA von WCAG 2.2 aus, nach der Stufe, die jedes Kriterium in
				dieser Version hat. <code>bestPractices: true</code> ergänzt die Regeln, die kein
				WCAG-Kriterium nennen, etwa <code>region</code> und <code>heading-order</code>; allein
				angegeben führt es nur diese aus, und neben <code>engineOptions.profile</code> fügt es sie
				den Regeln des Profils hinzu.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.2 A and AA",
					"expect(container).toHaveNoA11yViolations({}, { wcag: { version: '2.2', level: 'AA' } });",
					"",
					"// The same, and the best practices",
					"expect(container).toHaveNoA11yViolations({}, { wcag: { version: '2.2', level: 'AA' }, bestPractices: true });",
				]}
			/>
			<p>
				<code>runOnly</code> nimmt auch Regel-IDs und Tags an (<code>includeRuleIds</code>,{" "}
				<code>tags</code>, <code>excludeRuleIds</code>, ...), die die Regeln eines Ziels ergänzen;
				die Ausschlüsse wirken danach. Ein <code>runOnly</code>, das irgendetwas auswählt, ersetzt
				die Auswahl in <code>engineOptions.rules</code>/<code>.tags</code> vollständig: Geben Sie
				eine Auswahl auf die eine oder die andere Weise an, nicht auf beide. Übergeben Sie{" "}
				<code>{"{}"}</code> oder <code>null</code> als <code>engineOptions</code>, wenn Sie nur{" "}
				<code>runOnly</code> brauchen.
			</p>

			<h2 id="packs">Mit Packs scannen</h2>
			<p>
				Ein <a href="/configuration/packs/">Pack</a> bringt Regeln, eine Norm oder eine Checkliste
				sowie deren Profile und Meldungen aus einem eigenen Paket mit. Der Matcher scannt in Node,
				daher wird ein Pack als das Objekt selbst in <code>engineOptions.packs</code> übergeben, und
				sein Profil wird mit <code>engineOptions.profile</code> gewählt:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const acmePolicy = require('./acme-policy-pack');",
					"const policy = { packs: [acmePolicy], profile: 'acme-web-2026' };",
					"",
					"test(\"a page that breaks the pack's house rule fails the assertion\", () => {",
					"  document.body.innerHTML = '<main><h1>Welcome</h1><video autoplay src=\"intro.mp4\"></video></main>';",
					"  expect(document).not.toHaveNoA11yViolations(policy);",
					"});",
					"",
					"// A pack's checklist profile, and the best practices",
					"expect(container).toHaveNoA11yViolations(policy, { bestPractices: true });",
				]}
			/>
			<p>
				Die eigenen Regeln eines Packs erscheinen im Ergebnis wie die von core, mit IDs, die mit
				seinem Namensraum beginnen (<code>acme-no-autoplay</code>). Halten Sie die Pack-Objekte an
				einer Stelle (einer Setup-Datei oder einem Modul): core bereitet für jede Menge von
				Pack-Objekten eine Engine vor und behält sie für den nächsten Scan mit denselben. Ein Pack,
				das core nicht ausführen kann (sein <code>core</code>-Bereich schließt das installierte core
				aus, es ist nicht gültig, oder sein Namensraum kollidiert mit dem eines anderen Packs), steht
				in <code>skippedPacks</code> des Ergebnisses, und die Assertion scheitert daran, statt zu
				bestehen, während die Regeln des Packs nie gelaufen sind.
			</p>

			<h2>API</h2>
			<DataTable
				label="Parameter der Matcher"
				rowKey="id"
				columns={[
					{ key: "param", label: "Parameter", width: "18%" },
					{ key: "type", label: "Typ", width: "26%" },
					{ key: "meaning", label: "Bedeutung", wrap: true },
				]}
				rows={apiRows}
			/>
			<p>
				Gibt die Form <code>{"{ pass, message }"}</code> zurück, die <code>expect.extend()</code>{" "}
				in beiden Frameworks erwartet. Sie rufen das nie direkt auf; es wird einmal über{" "}
				<code>expect.extend()</code> eingebunden, wie oben unter Einrichtung gezeigt.
			</p>

			<h2>Was geprüft wird und was nicht</h2>
			<p>
				<strong>Nur <code>fail</code>-Ergebnisse lassen die Assertion scheitern</strong>, wie bei
				jedem anderen surea11y-Binding, wo <code>cantTell</code>-Ergebnisse als Hinweis gelten,
				nicht als Fehler. Ein vager Link wie{" "}
				<code>&lt;a href="/pricing"&gt;Click here&lt;/a&gt;</code> ist <code>cantTell</code>, nicht{" "}
				<code>fail</code>, und lässt einen bestandenen Test daher allein nie scheitern. Scheitert
				eine Assertion aber <em>aus anderen Gründen</em>, werden alle <code>cantTell</code>-Ergebnisse
				als separater Hinweis an die Fehlermeldung angehängt, damit sie sichtbar bleiben. Unter{" "}
				<a href="/help/known-limitations/">Bekannte Einschränkungen</a> steht, was diese Engine
				überhaupt nicht automatisiert.
			</p>
			<p>
				<strong>Ein Scan, der nicht prüfen konnte, was er prüfen sollte, scheitert ebenfalls</strong>,
				statt über nichts zu bestehen: ein Element, das nicht im Dokument liegt, in dem der Scan
				läuft (abgetrennt oder aus einem anderen Dokument), eine eigene Regel, die nicht gelaufen
				ist (aufgeführt in <code>skippedCustomRules</code>), oder ein Pack, das nicht gelaufen ist
				(aufgeführt in <code>skippedPacks</code>). Die Meldung nennt jedes davon mit dem Grund.
			</p>
			<p>
				Der Scan selbst kann eine Ausnahme werfen, und der Test scheitert dann mit dem Fehler der
				Engine, der einen <code>code</code> trägt: <code>INVALID_RUN_ONLY</code> (eine Liste von
				Regeln oder Tags, in der kein Wert eine Regel oder ein Tag nennt, oder ein{" "}
				<code>runOnly.wcag</code>-Ziel, das keines ist), <code>INVALID_ENGINE_OPTIONS</code> (mit{" "}
				<code>strictOptions: true</code> eine Option, die die Engine nicht liest, oder ein Wert, den
				sie nicht verwenden kann) oder <code>PAGE_BUILTINS_BROKEN</code> (der eigene Code des Tests
				oder der Seite hat ein JavaScript-Built-in beschädigt, auf das sich die Engine verlässt).
			</p>
			<p>
				<strong>Ein auf ein Element beschränkter Scan meldet nur, was darin liegt</strong>: Ein
				Verstoß an anderer Stelle der Seite lässt eine auf einen <code>container</code> beschränkte
				Assertion nie scheitern. Intern wird das gescannte Element vorübergehend mit einem
				eindeutigen Attribut markiert und über diesen Selektor gescannt, für Ihren Test
				unsichtbar.
			</p>
			<p>
				<strong>Einige wenige Regeln prüfen eine Eigenschaft der ganzen Seite</strong>, nicht
				etwas in einem bestimmten Teilbaum: <code>page-title-present</code>,{" "}
				<code>html-lang-attr-present</code> und ein paar weitere prüfen direkt{" "}
				<code>document.title</code>/<code>document.documentElement</code>, weil die Frage, ob{" "}
				<em>die Seite</em> einen Titel hat, für ein beliebiges Komponenten-Snippet keinen Sinn
				ergibt. Übergeben Sie ein <code>Element</code> (einen <code>container</code> einer{" "}
				<span lang="en">Testing Library</span>, <code>document.body</code>), melden diese Regeln{" "}
				<code>notApplicable</code> statt <code>fail</code>, sodass ein fehlendes{" "}
				<code>&lt;title&gt;</code> nie einen Test auf Komponentenebene scheitern lässt; übergeben
				Sie <code>document</code> selbst, werden sie tatsächlich ausgewertet. Wenn Sie{" "}
				<code>document</code> direkt scannen, setzen Sie <code>document.title</code> und{" "}
				<code>lang</code> von <code>document.documentElement</code> einmal in Ihrer Setup-Datei
				statt in jedem Test.
			</p>

			<h2>Fehlermeldungen</h2>
			<p>
				Listet jedes Vorkommen auf, nicht nur jede Regel (eine Regel kann mehrere Elemente
				markieren), mit Regel-ID, Schweregrad, einer lesbaren Zusammenfassung, dem Selektor des
				fehlerhaften Elements und, wo verfügbar, einem Hinweis zur Behebung. Sie nennt das Release
				von <code>@surea11y/core</code>, das das Ergebnis erzeugt hat, zum Zitieren in einem
				Fehlerbericht:
			</p>
			<CodeBlock
				lines={[
					"expected no accessibility violations, but found 1:",
					"",
					"1) img-alt-present (serious): This <img> has no alt attribute.",
					"   at body > img",
					"   Add an alt attribute that says what the image shows, or alt=\"\" if the image is purely decorative.",
					"",
					"Scanned with @surea11y/core 1.11.1.",
				]}
			/>
			<p>
				Alle <code>cantTell</code>-Ergebnisse neben den Fehlern werden als separater Hinweis
				angehängt, damit sie sichtbar bleiben, ohne <code>pass</code>/<code>fail</code> zu
				beeinflussen:
			</p>
			<CodeBlock lines={["3 rule(s) need manual review (cantTell, not counted as failures): contrast-computable, link-name-quality, manual-review"]} />
			<p>Ein Pack, das nicht gelaufen ist, wird mit dem Grund genannt:</p>
			<CodeBlock
				lines={[
					"expected no accessibility violations, but the scan left out what it was asked to check:",
					"",
					"No accessibility violations found in what was scanned.",
					"",
					"Pack \"@acme/a11y-policy\" did not run: it supports core ^2.0.0, and this is core 1.11.1.",
					"",
					"Scanned with @surea11y/core 1.11.1.",
				]}
			/>

			<p>
				Ausführbare Beispiele für beide Frameworks nebeneinander:{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/basic.test.js">Jest</a>{" "}
				und{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/basic.vitest.test.js">
					Vitest
				</a>
				, und dasselbe mit einem Pack:{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/pack.test.js">Jest</a>{" "}
				und{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/pack.vitest.test.js">
					Vitest
				</a>
				. Den vollständigen Umfang von <code>engineOptions</code> (Locale, Kontrastmodi, Shadow
				DOM, eigene Regeln, Tag-Kombinationen für WCAG-Versionen) finden Sie in{" "}
				<a href={`${core}/docs/ENGINE_OPTIONS.md`}><code>ENGINE_OPTIONS.md</code></a>. Dieses Paket
				reicht weiter, was Sie übergeben, statt diese Referenz zu duplizieren.
			</p>
		</>
	);
}
