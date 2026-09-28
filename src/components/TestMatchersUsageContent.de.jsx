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

			<h2>API</h2>
			<DataTable
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
				fehlerhaften Elements und, wo verfügbar, einem Hinweis zur Behebung:
			</p>
			<CodeBlock
				lines={[
					"expected no accessibility violations, but found 1:",
					"",
					"1) img-alt-present (serious): Missing alt attribute on <img>.",
					"   at html > body > img",
					"   Add an alt attribute or use alt=\"\" for decorative images.",
				]}
			/>
			<p>
				Alle <code>cantTell</code>-Ergebnisse neben den Fehlern werden als separater Hinweis
				angehängt, damit sie sichtbar bleiben, ohne <code>pass</code>/<code>fail</code> zu
				beeinflussen:
			</p>
			<CodeBlock lines={["2 rule(s) need manual review (cantTell, not counted as failures): link-name-quality-manual, color-contrast-computable"]} />

			<p>
				Ausführbare Beispiele für beide Frameworks nebeneinander:{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/basic.test.js">Jest</a>{" "}
				und{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/basic.vitest.test.js">
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
