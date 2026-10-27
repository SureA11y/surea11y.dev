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
	{
		id: "options",
		param: <code>options</code>,
		type: "Objekt (optional)",
		meaning: (
			<>
				<code>{"{ failOnSeverity, leanFail, wcagOnly, howToCheck }"}</code>: siehe{" "}
				<a href="#failing-only-on-serious-problems">Nur bei schwerwiegenden Problemen fehlschlagen</a>{" "}
				und <a href="#questions-that-likely-fail">Fragen, die wahrscheinlich nicht erfüllt sind</a>.
				Jede Option ersetzt den Standardwert, den <code>configureA11yMatchers()</code> setzt.
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
			<CodeBlock lines={[{ text: "npm install --save-dev @surea11y/core @surea11y/test-matchers", command: true }]} />
			<p>
				<code>@surea11y/core</code> ist die Engine, die der Matcher ausführt; installieren Sie
				sie wie oben zusammen mit dem Matcher. Um
				gebautes HTML stattdessen vom Terminal oder in einem CI-Schritt zu prüfen,
				außerhalb eines Test-Runners, siehe <a href="/getting-started/cli/">CLI</a>.
			</p>

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
					"",
					"// EN 301 549 V4.1.1 (WCAG 2.2 A and AA); 'en301549-v3.2.1' for V3.2.1 (WCAG 2.1 A and AA)",
					"expect(container).toHaveNoA11yViolations({ profile: 'en301549-v4.1.1' });",
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
				Regel-IDs werden ohne Rücksicht auf Groß- und Kleinschreibung gelesen
				(<code>'IMG-ALT-PRESENT'</code>).
			</p>
			<p>
				Ein Ziel bringt seine Stufe mit. Ein Test, der stattdessen Regeln oder Tags
				benennt, kann eine mit <code>engineOptions.wcagLevel</code> setzen
				(<code>@surea11y/core</code> 1.12.0 und neuer): die Stufe der Kriterien, die der
				Scan meldet, ohne zu ändern, welche Regeln laufen.{" "}
				<code>contrast-computable</code> prüft 1.4.3 (AA) und 1.4.6 (AAA), daher meldet
				der Scan unten nur 1.4.3. Die Assertion entscheidet nach Ergebnissen mit{" "}
				<code>fail</code>, daher ändert das die Kriterien im Ergebnis, nicht, woran der
				Test scheitert.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"expect(container).toHaveNoA11yViolations({ wcagLevel: 'AA' }, { includeRuleIds: ['contrast-computable'] });",
				]}
			/>

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
				Das zweite Argument kann stattdessen ein einziges Objekt mit allem sein,{" "}
				<code>{"{ engineOptions, runOnly, failOnSeverity, leanFail, wcagOnly, howToCheck }"}</code>:{" "}
				<code>{"toHaveNoA11yViolations({ leanFail: true })"}</code>. Es wird so gelesen, wenn es
				einen dieser Schlüssel hat, von denen keiner eine Engine-Option ist; ein Objekt, das sie mit
				Engine-Optionen mischt, wirft einen <code>TypeError</code>.
			</p>
			<p>
				Gibt die Form <code>{"{ pass, message }"}</code> zurück, die <code>expect.extend()</code>{" "}
				in beiden Frameworks erwartet — Sie rufen das nie direkt auf; es wird einmal über{" "}
				<code>expect.extend()</code> eingebunden, wie oben unter Einrichtung gezeigt. Das Paket
				exportiert außerdem <code>configureA11yMatchers(options)</code> für Standardwerte in der
				ganzen Suite, <code>installInternalsHook(win?)</code> für{" "}
				<a href="#web-components">Web Components</a> sowie <code>installListenerHook(win?)</code>,{" "}
				<code>installLiveRegionHook(win?)</code> und den Matcher <code>toHaveAnnounced()</code> für{" "}
				<a href="#listener-and-live-region-hooks">Klick-Handler und Live-Regionen</a>.
			</p>

			<h2>Was geprüft wird und was nicht</h2>
			<p>
				<strong>Nur Fehlschläge lassen die Assertion scheitern</strong>, wie bei jedem anderen
				surea11y-Binding, wo <code>cantTell</code>-Ergebnisse als Hinweis gelten, nicht als Fehler.
				Jeder Befund wird nach seinem eigenen Ergebnis gelesen, nicht nach dem seiner Regel: Eine
				Regel, die bei einem Element fehlschlägt, kann zu einem anderen eine Frage stellen, und
				diese Frage zählt nicht als Fehlschlag. Ein vager Link wie{" "}
				<code>&lt;a href="/pricing"&gt;Click here&lt;/a&gt;</code> ist <code>cantTell</code>, nicht{" "}
				<code>fail</code>, und lässt einen bestandenen Test daher allein nicht scheitern, außer Sie
				verlangen das mit <code>leanFail</code> (<a href="#questions-that-likely-fail">unten</a>).
				Scheitert eine Assertion aber <em>aus anderen Gründen</em>, werden die Fragen nach den
				Fehlschlägen aufgelistet, damit sie sichtbar bleiben. Unter{" "}
				<a href="/help/known-limitations/">Bekannte Einschränkungen</a> steht, was diese Engine
				überhaupt nicht automatisiert.
			</p>
			<p>
				<strong>Ein Scan, der nicht prüfen konnte, was er prüfen sollte, scheitert ebenfalls</strong>,
				statt über nichts zu bestehen: ein Element, das nicht im Dokument liegt, in dem der Scan
				läuft (abgetrennt oder aus einem anderen Dokument), eine eigene Regel, die nicht gelaufen
				ist (aufgeführt in <code>skippedCustomRules</code>), oder ein Pack, das nicht gelaufen ist
				(aufgeführt in <code>skippedPacks</code>). Die Meldung nennt jedes davon mit dem Grund.
				Eine eigene Regel, die der Test selbst ausschließt, ist keine Lücke und lässt
				ihn nicht scheitern.
			</p>
			<p>
				<strong>Ein Aufruf ohne Auswahl führt auch die Best Practices aus.</strong> Seit{" "}
				<code>@surea11y/core</code> 1.12 lässt eine davon, <code>empty-heading</code>,
				eine Überschrift ohne zugänglichen Namen scheitern, wo sie früher nachfragte.
				Eine Komponente, die <code>&lt;h2&gt;&lt;/h2&gt;</code> rendert (oft ein
				Titel-Prop, das im Test leer bleibt), lässt daher einen Aufruf ohne Optionen
				scheitern. Ein Screenreader kündigt diese Überschrift ohne Inhalt an: Geben Sie
				dem Test echten Inhalt oder beheben Sie die Komponente. Ein Aufruf mit einem
				WCAG-Ziel, das die Best Practices auslässt, führt sie nicht aus.
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

			<h2 id="failing-only-on-serious-problems">Nur bei schwerwiegenden Problemen fehlschlagen</h2>
			<p>
				Jedes Regelergebnis hat einen Schweregrad: <code>critical</code>, <code>serious</code>,{" "}
				<code>moderate</code> oder <code>minor</code>. Um Tests zunächst nur bei schwerwiegenden
				Problemen scheitern zu lassen, während der Rest weiter gemeldet wird, setzen Sie eine Stufe
				für die ganze Suite in der Setup-Datei mit <code>configureA11yMatchers()</code>, oder für
				eine Assertion in deren Optionen, die den Standardwert ersetzen (
				<code>failOnSeverity: null</code> schaltet ihn dort ab):
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// jest.setup.js (vitest.setup.js: the same, with import)",
					"const { toHaveNoA11yViolations, configureA11yMatchers } = require('@surea11y/test-matchers');",
					"",
					"expect.extend({ toHaveNoA11yViolations });",
					"configureA11yMatchers({ failOnSeverity: 'serious' });",
					"",
					"// one assertion",
					"expect(container).toHaveNoA11yViolations({ failOnSeverity: 'critical' });",
				]}
			/>
			<p>
				Fehlschlagende Regeln unterhalb der Stufe lassen den Test nicht scheitern; scheitert er
				aber, listet die Meldung jeden Fehlschlag auf und markiert die unterhalb der Stufe. Es ist
				dieselbe Schwelle wie bei <code>surea11y scan --fail-on-severity</code>. Ein Scan, der etwas
				ausgelassen hat (ein Bereich, der auf nichts passte, eine eigene Regel oder ein Pack, die
				nicht gelaufen sind), lässt die Assertion unabhängig von der Stufe scheitern.
			</p>

			<h2 id="questions-that-likely-fail">Fragen, die wahrscheinlich nicht erfüllt sind</h2>
			<p>
				Ein <code>cantTell</code> ist eine Frage an eine Person. Seit <code>@surea11y/core</code>{" "}
				1.14 kann eine Frage tendieren: Wo die Hinweise auf der Seite in eine Richtung zeigen, sagt
				sie, in welche (<code>fail</code> oder <code>pass</code>) und warum, und jede Frage einer
				core-Regel enthält die Schritte, mit denen sie sich beantworten lässt (
				<code>howToCheck</code>). Eine Fehlermeldung listet die Fragen nach den Fehlschlägen: zuerst
				die wahrscheinlich nicht erfüllten, dann die wahrscheinlich erfüllten, jeweils mit Grund,
				dann die offenen, nach Regel. <code>{"{ howToCheck: true }"}</code> listet jede Frage
				vollständig auf, mit ihren Schritten.
			</p>
			<p>
				Standardmäßig lässt eine Frage den Test nie scheitern. <code>{"{ leanFail: true }"}</code>{" "}
				lässt ihn auch bei den Fragen scheitern, die wahrscheinlich nicht erfüllt sind, und{" "}
				<code>wcagOnly: true</code> lässt die von Best-Practice-Regeln weg:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"test('the settings page has no failures or likely failures', () => {",
					"  const { container } = render(<Settings />); // an <h1>, then an <h3>",
					"  expect(container).toHaveNoA11yViolations(); // passes: heading-order is a question",
					"  expect(container).toHaveNoA11yViolations({ leanFail: true }); // fails: it leans fail",
					"  expect(container).toHaveNoA11yViolations({ leanFail: true, wcagOnly: true }); // passes: heading-order is a best practice",
					"});",
				]}
			/>
			<p>
				Das ist optional, weil eine Tendenz ein Hinweis ist, kein Beweis: Ob ein Befund tendiert,
				und in welche Richtung, kann sich in einer Minor-Version von core ändern.{" "}
				<code>{"configureA11yMatchers({ leanFail: true })"}</code> schaltet es für die ganze Suite
				ein.
			</p>

			<h2 id="web-components">Web Components</h2>
			<p>
				Viele Web Components halten ihre <code>ElementInternals</code> in einem privaten
				Feld und geben sich darüber einen Namen, setzen ihre Zustände oder geben sich
				eine Rolle. Kein Skript kann das zurücklesen, daher fragt der Scan standardmäßig
				bei einem solchen Element nach (<code>cantTell</code>), statt es zu beurteilen:
				Der Test scheitert nicht, aber geprüft wird auch nichts, und eine so gesetzte
				Rolle wird gar nicht gesehen.
			</p>
			<p>
				<code>installInternalsHook(win?)</code> lässt den Scan sie lesen. Rufen Sie es
				einmal in der Setup-Datei auf, bevor eine Komponente definiert wird, damit es
				jeden Aufruf von <code>attachInternals()</code> sieht; <code>win</code> ist
				standardmäßig das globale <code>window</code>:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// jest.setup.js",
					"const {",
					"  toHaveNoA11yViolations,",
					"  installInternalsHook",
					"} = require('@surea11y/test-matchers');",
					"",
					"installInternalsHook();",
					"expect.extend({ toHaveNoA11yViolations });",
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"// vitest.setup.js",
					"import { expect } from 'vitest';",
					"import {",
					"  toHaveNoA11yViolations,",
					"  installInternalsHook",
					"} from '@surea11y/test-matchers';",
					"",
					"installInternalsHook();",
					"expect.extend({ toHaveNoA11yViolations });",
				]}
			/>
			<p>
				Damit besteht eine Komponente, die sich über ihre <code>ElementInternals</code>{" "}
				benennt; eine, die sie anhängt, aber keinen Namen setzt, scheitert wie jedes
				unbenannte Bedienelement; und eine, die nur über sie ein <code>switch</code>{" "}
				ist, wird als solcher geprüft. <code>engine.environment.internalsHook</code> im
				Scan-Ergebnis zeigt, ob der Hook da war. Er umhüllt{" "}
				<code>HTMLElement.prototype.attachInternals</code> im Testfenster, was in einem
				Test harmlos ist und der Grund, warum er optional ist. Eine Grenze gibt es:{" "}
				<code>jest-environment-jsdom</code> 30 bringt jsdom 26 mit, wo eine Komponente, die eine
				ARIA-Eigenschaft auf ihren <code>ElementInternals</code> setzt, einen Fehler wirft, mit
				oder ohne Hook (Vitest mit jsdom 29 kommt damit zurecht). Seit <code>@surea11y/core</code>{" "}
				1.14 wird der Hook auch unter Vitest als <code>'early'</code> erfasst, sodass eine
				Komponente, die nie <code>ElementInternals</code> angehängt hat, dort keine offene Frage
				mehr ist. Die
				Details stehen in der{" "}
				<a href="https://github.com/SureA11y/test-matchers#web-components-names-set-through-elementinternals">README
				des Pakets</a>.
			</p>

			<h2 id="listener-and-live-region-hooks">Klick-Handler und Live-Regionen</h2>
			<p>
				Zwei weitere optionale Hooks, seit <code>@surea11y/core</code> 1.14, werden genauso
				installiert, in der Setup-Datei, bevor Ihr Code läuft. <code>installListenerHook()</code>{" "}
				zeichnet die Klick-, Tastatur-, Fokus- und Maus-Listener auf, die von da an hinzugefügt
				werden, damit die Tastaturregeln sie beurteilen: Ein <code>&lt;div role="button"&gt;</code>,
				das nur auf <code>click</code> hört, ergibt <code>fail</code> (
				<code>CLICK_HANDLER_NO_KEY_LISTENER</code>) und besteht, sobald es auch auf{" "}
				<code>keydown</code> hört. <code>installLiveRegionHook()</code> zeichnet auf, was die
				Live-Regionen der Seite erhalten: Der Scan stellt eine Frage zu einer Region, die schon mit
				ihrem Text eingefügt wurde und die Screenreader oft nicht ansagen, und{" "}
				<code>toHaveAnnounced()</code> prüft, ob eine Aktion den Nutzenden etwas mitgeteilt hat.
				Installieren Sie nur die, die Sie brauchen; jeder ist unabhängig:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// jest.setup.js (vitest.setup.js: the same, with import)",
					"const {",
					"  toHaveNoA11yViolations,",
					"  toHaveAnnounced,",
					"  installInternalsHook,",
					"  installListenerHook,",
					"  installLiveRegionHook",
					"} = require('@surea11y/test-matchers');",
					"",
					"installInternalsHook();",
					"installListenerHook();",
					"installLiveRegionHook();",
					"expect.extend({",
					"  toHaveNoA11yViolations,",
					"  toHaveAnnounced",
					"});",
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"test('saving says so', async () => {",
					"  const user = userEvent.setup();",
					"  const { container } = render(<SaveBar />);",
					"  await user.click(screen.getByRole('button', { name: 'Save' }));",
					"",
					"  expect(container).toHaveAnnounced('Saved');",
					"  expect(window).not.toHaveAnnounced(/error/i);",
					"});",
				]}
			/>
			<p>
				Ein String muss der ganze Text sein; ein RegExp darf auf einen Teil passen. Auf einem
				Element zählen nur die Live-Regionen, die es ist oder enthält; auf <code>window</code> oder{" "}
				<code>document</code> jede Ansage, seit der Hook installiert wurde. Es ist das, was die
				Seite zur Ansage bereitgestellt hat, nicht das, was ein Screenreader gesagt hat, und{" "}
				<code>toHaveAnnounced()</code> wirft ohne den Hook einen Fehler. Zwei Dinge sollten Sie
				wissen: React hängt seine Listener an den Root, in den es rendert, nicht an jedes Element,
				sodass der Scan bei einer React-Komponente die Listener des Roots sieht und ihre Buttons
				nach ihrem Markup beurteilt, wie ohne den Hook; und der Live-Region-Hook liest Änderungen
				in Gruppen, also erst rendern und dann handeln, mit einem <code>await</code> dazwischen (
				<code>await user.click()</code>), wie es echte Nutzende tun. Die Details stehen in der{" "}
				<a href="https://github.com/SureA11y/test-matchers#click-handlers-added-from-script-the-listener-hook">
					README des Pakets
				</a>
				.
			</p>

			<h2>Fehlermeldungen</h2>
			<p>
				Die Meldung listet jedes fehlschlagende Vorkommen auf, nicht nur jede Regel — eine Regel kann
				mehrere Elemente markieren —, mit Regel-ID, Schweregrad, einer lesbaren Zusammenfassung,
				dem Selektor des betroffenen Elements und, wo vorhanden, einem Hinweis zur Behebung. Sie
				nennt das <code>@surea11y/core</code>-Release, das das Ergebnis erzeugt hat, zum Zitieren in
				einem Fehlerbericht, und listet danach die Fragen auf, die nicht als Fehlschläge zählen. Mit
				einer übersprungenen Überschriftenebene neben dem Bild:
			</p>
			<CodeBlock
				lines={[
					"expected no accessibility violations, but found 1:",
					"",
					"1) img-alt-present (serious): This <img> has no alt attribute.",
					"   at body > main > img",
					"   Add an alt attribute that says what the image shows, or alt=\"\" if the image is purely decorative.",
					"",
					"Scanned with @surea11y/core 1.14.1.",
					"",
					"2 findings need manual review (cantTell, not counted as failures):",
					"",
					"1) heading-order (minor, likely fails): This heading jumps from level 1 to level 3, skipping a level.",
					"   at body > main > h3",
					"   Go down one level at a time, so an <h2> is followed by an <h3> rather than an <h4>, and the outline of the page stays easy to follow.",
					"   Why it likely fails: The heading skips a level after the one before it.",
					"",
					"Open questions, which only a person can answer: manual-review.",
				]}
			/>
			<p>
				Vor der Versionszeile kann die Meldung Hinweise dazu enthalten, wie der Scan lief: Hat der
				Scan zu Custom Elements Fragen gestellt, die er mit dem{" "}
				<a href="#web-components">Internals-Hook</a> hätte lesen können, oder Befunde beurteilt,
				die der <a href="#listener-and-live-region-hooks">Listener- oder Live-Region-Hook</a>{" "}
				entschieden hätte, sagt eine Zeile, wie viele, und dass Sie ihn installieren sollten. Mit{" "}
				<code>{"{ leanFail: true }"}</code> rücken die wahrscheinlich nicht erfüllten Fragen zu den
				Fehlschlägen auf, und die Kopfzeile zählt beides (
				<code>found 1 failure and 1 likely failure:</code>).
			</p>
			<p>Ein Pack, das nicht gelaufen ist, wird mit dem Grund genannt:</p>
			<CodeBlock
				lines={[
					"expected no accessibility violations, but the scan left out what it was asked to check:",
					"",
					"No accessibility violations found in what was scanned.",
					"",
					"Pack \"@acme/a11y-policy\" did not run: it supports core ^2.0.0, and this is core 1.14.0.",
					"",
					"Scanned with @surea11y/core 1.14.1.",
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
				, und eine kleine Komponente, geprüft mit dem Listener- und dem Live-Region-Hook,{" "}
				<code>toHaveAnnounced()</code> und <code>leanFail</code>:{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/hooks.test.js">Jest</a>{" "}
				und{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/hooks.vitest.test.js">
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
