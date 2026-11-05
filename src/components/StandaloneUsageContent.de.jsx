import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function StandaloneUsageContent() {
	return (
		<>
			<h2>Wann Sie es verwenden</h2>
			<p>
				Für eine manuelle Prüfung einer Seite, die in einem echten Browser geöffnet ist, für ein
				Bookmarklet oder für jeden anderen Kontext ohne Automatisierungstreiber und ohne
				Build-Schritt.
			</p>

			<h2>Verwendung</h2>
			<p>
				<code>@surea11y/core</code> liefert im Paketstamm <code>surea11y.browser.js</code> mit,
				ein Bundle, das aus denselben Regelquellen erzeugt wird wie das Node-Paket. Wenn Sie es
				direkt laden, definiert es eine globale Variable, <code>a11ycore</code>:
			</p>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="node_modules/@surea11y/core/surea11y.browser.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(location.href, null, {}, null);",
					"  console.log(result.checksResults.filter((r) => r.outcome === 'fail'));",
					"</script>",
				]}
			/>
			<p>
				<code>a11ycore.runa11yCoreInPage</code> ist genau dieselbe Funktion, die die Bindings
				intern aufrufen — das Bundle existiert nur, um das <em>Laden</em> ohne{" "}
				<code>require</code>/Modulsystem zu lösen, nicht um eine separate API anzubieten.
				Die Argumente sind dieselben wie überall sonst. Ein Scan, der auf einen Bereich
				und auf WCAG 2.2 A und AA beschränkt ist und zwei störende Widgets auslässt:
			</p>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="node_modules/@surea11y/core/surea11y.browser.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(",
					"    location.href,",
					"    '#main', // contextSelector: scan only this region",
					"    {",
					"      excludeSelectors: ['#cookie-banner', '.intercom-launcher'],",
					"      contrast: { mode: 'auditorAssist' } // trade some false-positive protection for more findings",
					"    },",
					"    { wcag: { version: '2.2', level: 'AA' } } // runOnly",
					"  );",
					"</script>",
				]}
			/>
			<p>
				<strong>Das Bundle enthält nur Englisch.</strong> Jede andere Locale wird daneben als eigene Datei
				ausgeliefert — laden Sie eine nach dem Bundle, und diese Sprache steht zur Verfügung:
			</p>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="node_modules/@surea11y/core/surea11y.browser.js"></script>',
					'<script src="node_modules/@surea11y/core/surea11y.i18n.de.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(location.href, null, { locale: 'de' }, null);",
					"</script>",
				]}
			/>
			<p>
				Wenn Sie eine Locale anfordern, deren Datei Sie nicht geladen haben, erhalten Sie
				Englisch, keinen Fehler — siehe <a href="/configuration/locales/">Locales</a>.
			</p>
			<p>
				Das Bundle lässt sich auch als Modul laden:{" "}
				<code>import a11ycore from '@surea11y/core/browser'</code>, ein benannter Import von{" "}
				<code>runa11yCoreInPage</code> und <code>require()</code> erhalten alle seine API, und das
				Global ist weiterhin definiert.
			</p>
			<p>
				<strong>Bewusst nicht im Bundle enthalten</strong>: <code>runa11yCoreAcrossFrames</code>/
				<code>a11yCoreEnableFrameResponder</code> (frameübergreifendes Scannen setzt voraus, dass
				auch der eingebettete Frame die Engine lädt und dies ausdrücklich aktiviert — das passt nicht zu einem
				einzelnen eingefügten Script-Tag). Verwenden Sie direkt das npm-Paket, wenn Sie das
				brauchen — siehe{" "}
				<a href={`${core}/docs/INTEGRATION.md#cross-frame-scanning-including-cross-origin`}>
					<code>INTEGRATION.md</code>
				</a>
				.
			</p>
			<p>
				<code>require('@surea11y/core')</code> direkt, ohne Binding, ist der andere
				Standalone-Weg — das entspricht <span lang="en">Pattern 1</span>/<span lang="en">Pattern 2</span> in{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>: jsdom in Node
				ohne echten Browser, oder Puppeteer/Playwright selbst steuern, statt über ein Binding zu
				gehen.
				Für Tests scannt <code>runa11yCoreOnHtml(html, options)</code> aus{" "}
				<code>@surea11y/core/testing</code> einen HTML-String in jsdom und richtet das
				Dokument für Sie ein; seit core 1.12 liest seine Option <code>contentType</code>{" "}
				ein SVG- oder XHTML-Dokument als das, was es ist.
			</p>

			<h2 id="from-the-browser-console">Aus der Browser-Konsole</h2>
			<p>
				Für einen Scan von Hand hat das Bundle einige Helfer. Laden Sie es über die Konsole des
				Browsers (den Tab „Console“ der Entwicklertools) in eine beliebige geöffnete Seite, und
				scannen Sie dann, listen Sie die Befunde auf, markieren Sie sie auf der Seite oder öffnen
				Sie den HTML-Bericht:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// Pasted into the console of the page to check.",
					"const s = document.createElement('script');",
					"s.src = 'https://cdn.jsdelivr.net/npm/@surea11y/core/surea11y.browser.js';",
					"document.head.append(s);",
					"",
					"// Once it has loaded:",
					"a11ycore.version; // the engine's version",
					"const result = await a11ycore.run(); // scan the page",
					"a11ycore.table(result); // the findings, worst first",
					"a11ycore.highlight(result); // box each one on the page",
					"await a11ycore.openReport(result); // the HTML report, in a new tab",
					"await a11ycore.inspect('headings'); // what a person checks by hand",
				]}
			/>
			<p>
				<code>run(options)</code> nimmt die Engine-Optionen und zwei eigene,{" "}
				<code>context</code> (ein Selektor, um nur einen Teil der Seite zu scannen) und{" "}
				<code>runOnly</code>, und ruft vor dem Scan die Stylesheets ab, die die Seite selbst nicht
				lesen kann. <code>table()</code> gibt eine Zeile pro Befund aus: zuerst die Fehlschläge,
				dann die Fragen, die zu <code>fail</code> tendieren, die, die zu <code>pass</code>{" "}
				tendieren, und die, die nur eine Person beurteilen kann. <code>highlight()</code> zeichnet
				einen Rahmen um jedes Element, das ein <code>fail</code> (durchgehend rot) oder ein{" "}
				<code>cantTell</code> (gestrichelt bernsteinfarben) nennt, in einer eigenen Ebene, die die
				Elemente der Seite unverändert lässt; <code>clearHighlights()</code> entfernt sie.{" "}
				<code>inspect()</code> zeichnet, was eine prüfende Person von Hand kontrolliert, und
				beurteilt nichts: <code>'headings'</code>, <code>'landmarks'</code>, <code>'names'</code>{" "}
				oder <code>'focus-order'</code>. <code>openReport()</code> lädt beim ersten Mal{" "}
				<code>surea11y.report.js</code> von neben dem Bundle, und der Bericht zeigt, wie sich jede
				Frage prüfen lässt. Die Content Security Policy einer Seite kann ein Skript von einem CDN
				blockieren: Laden Sie die Dateien dann vom eigenen Origin der Seite, oder scannen Sie mit
				einem Driver. Alle Optionen stehen im{" "}
				<a href={`${core}/docs/INTEGRATION.md#from-the-browser-console`}>
					Abschnitt zur Browser-Konsole in <code>INTEGRATION.md</code>
				</a>
				, dem Integrationsleitfaden auf GitHub.
			</p>

			<h2 id="packs-in-a-page">Packs in einer Seite</h2>
			<p>
				Ein <a href="/configuration/packs/">Pack</a> wird in Node vorbereitet und gelangt daher als
				Script in eine Seite. Für eine Seite, die ihre Scripts als Dateien lädt (ein{" "}
				<code>&lt;script&gt;</code>-Tag, ein Bookmarklet, eine Erweiterung), bauen Sie in Node eine
				einzige Datei: <code>buildBrowserBundle({"{ packs }"})</code> aus{" "}
				<code>@surea11y/core/pack</code> ist das Bundle, nach dem die Packs registriert werden.
				Nennen Sie die Packs dann in <code>engineOptions.packs</code> als <code>name@version</code>.
				Der Code der Regeln wird als Funktionen in das Script geschrieben, daher läuft er auch dort,
				wo eine Content Security Policy <code>eval</code> verbietet.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// In Node, once per release of core or of a pack.",
					"const fs = require('node:fs');",
					"const { buildBrowserBundle } = require('@surea11y/core/pack');",
					"const acmePolicy = require('./acme-policy-pack');",
					"fs.writeFileSync('surea11y-acme.js', buildBrowserBundle({ packs: [acmePolicy] }));",
				]}
			/>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="surea11y-acme.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(location.href, null, {",
					"    packs: ['@acme/a11y-policy@1.0.0'],",
					"    profile: 'acme-web-2026'",
					"  }, null);",
					"</script>",
				]}
			/>
			<p>
				Das Script eines Packs läuft nur mit dem core, der es geschrieben hat: Es enthält den
				Katalog, den core und die Packs zusammen bilden, in Node geprüft. Eine Seite, deren Bundle
				eine andere Version von core ist, führt den Scan ohne die Packs aus und führt jedes in{" "}
				<code>skippedPacks</code> auf, mit beiden Versionen. Eine einzige Datei enthält beides, also
				können sie nicht auseinanderlaufen. Bauen Sie sie neu, wenn Sie core oder ein Pack
				aktualisieren, und passen Sie das <code>name@version</code> an, das die Seite nennt.
			</p>
			<p>
				Ist das Bundle von core bereits in der Seite, schreiben Sie <code>packScript(packs)</code>{" "}
				mit demselben core in eine Datei und laden Sie sie nach dem Bundle (und in jeden Frame, den
				Sie scannen):
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// In Node, with the core whose bundle the page loads.",
					"const fs = require('node:fs');",
					"const { packScript } = require('@surea11y/core/pack');",
					"const acmePolicy = require('./acme-policy-pack');",
					"fs.writeFileSync('acme-pack.js', packScript([acmePolicy]));",
				]}
			/>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="node_modules/@surea11y/core/surea11y.browser.js"></script>',
					'<script src="acme-pack.js"></script>',
				]}
			/>
			<p>
				Die Seite führt genau die Packs aus, die ein Aufruf von <code>packScript</code> registriert
				hat, mit dem core, mit dem er vorbereitet wurde: Übergeben Sie jedes Pack, das ein Scan
				braucht, an einen einzigen Aufruf. Genannte Packs, die die Seite nicht ausführt, stehen mit
				dem Grund in <code>skippedPacks</code>. Die Bindings erledigen all das mit{" "}
				<code>.withPacks()</code> für Sie.
			</p>

			<h2 id="waiting-for-the-page">Vor dem Scan auf die Seite warten</h2>
			<p>
				Ein Scan liest die Seite so, wie sie in diesem Moment ist. Auf einer gerade geöffneten
				Seite laden Webfonts womöglich noch, und Bilder sind vielleicht noch nicht da; dieselbe
				Seite kann eine Sekunde später ein anderes Ergebnis liefern. Der Scan hält das in{" "}
				<code>engine.environment.fonts</code> und <code>.images</code> fest (siehe{" "}
				<a href="/results-reports/output-schema/">das Ausgabeschema</a>), besser ist es aber, erst
				zu scannen, wenn die Seite fertig geladen ist.
			</p>
			<p>
				<code>waitForPageReady(options)</code> übernimmt dieses Warten, und das Bundle stellt es
				auf demselben Global bereit. Der Scan ruft es nie selbst auf; rufen Sie es direkt vor dem
				Scan auf. Es wartet auf das <code>load</code>-Event des Fensters, auf{" "}
				<code>document.fonts.ready</code> und auf jedes Bild, das noch lädt (außer solchen mit{" "}
				<code>loading="lazy"</code>), höchstens <code>timeoutMs</code> lang (Standard{" "}
				<code>5000</code>). Es lehnt nie ab: Läuft die Zeit ab, löst es trotzdem auf, mit{" "}
				<code>ready: false</code>, und nennt, was noch ausstand.
				Ob Sie trotzdem scannen, länger warten oder abbrechen, entscheiden Sie; wenn Sie
				scannen, bewahren Sie mit dem Ergebnis auf, was noch ausstand.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const ready = await a11ycore.waitForPageReady({ timeoutMs: 3000 });",
					"const result = a11ycore.runa11yCoreInPage(location.href, null, {}, null);",
				]}
			/>
			<p>
				Ein Treiber, den Sie selbst steuern, kann es genauso in die Seite schicken wie{" "}
				<code>runa11yCoreInPage</code>:{" "}
				<code>page.evaluate(waitForPageReady, {"{ timeoutMs: 5000 }"})</code>. In jsdom gibt es
				nichts zu warten, es löst also sofort mit <code>ready: true</code> auf. Die übrigen
				Optionen (<code>quietMs</code>, <code>document</code>) und der vollständige Rückgabewert
				stehen in{" "}
				<a href={`${core}/docs/INTEGRATION.md#waiting-for-the-page-before-a-scan`}>
					<code>INTEGRATION.md</code>
				</a>
				, der Integrationsanleitung auf GitHub.
			</p>

			<h2 id="style-sheets-from-another-origin">Stylesheets von einem anderen Origin</h2>
			<p>
				Das Skript einer Seite kann die Regeln eines Stylesheets, das von einem anderen Origin
				kommt (einem CDN, einem Schriftdienst), nicht lesen. Eine Regel, die im CSS nach etwas
				sucht, etwa <code>css-orientation-lock</code>, kann daher nicht sagen, ob es da ist, und
				stellt eine Frage. Geben Sie dem Scan ihren Text in{" "}
				<code>engineOptions.styleSheetTexts</code> (<code>{"[{ href, text }]"}</code>), und{" "}
				<code>css-orientation-lock</code>, <code>css-hidden-focus</code> und{" "}
				<code>css-focus-indicator-suppressed</code> lesen ihn. Im Bundle nimmt{" "}
				<code>runa11yCoreInPageAsync</code> dieselben vier Argumente wie{" "}
				<code>runa11yCoreInPage</code>, ruft mit <code>preloadStyleSheets()</code> die Stylesheets
				ab, die ihr Server freigibt (CORS), und scannt dann:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const result = await a11ycore.runa11yCoreInPageAsync(location.href, null, {}, null);",
				]}
			/>
			<p>
				Ein Stylesheet, das sein Server nicht freigibt, lässt sich aus der Seite gar nicht lesen.
				Ein Werkzeug, das den Browser steuert, kann es außerhalb der Seite abrufen, wo kein CORS
				gilt, und in derselben Option übergeben; die Bindings tun das.
			</p>

			<h2 id="a-time-limit-on-a-scan">Ein Zeitlimit für einen Scan</h2>
			<p>
				Ein Scan läuft in einem Zug innerhalb der Seite, und nichts in der Seite kann ihn anhalten,
				sobald er begonnen hat: Ein Getter der Seite oder eine Regel, die nie zurückkehrt, blockiert
				diesen Tab endgültig. Begrenzen Sie die Zeit dort, wo Sie den Scan starten, und geben Sie
				den Tab auf, wenn das Limit überschritten ist: Ihr Zeitlimit beendet das Warten, nicht das Skript, das in der Seite läuft. 60 Sekunden liegen weit über dem, was eine
				normale Seite braucht, und erfassen daher nur die defekten:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// Playwright or Puppeteer: page.evaluate has no time limit of its own.",
					"async function scanWithin(page, ms, scan) {",
					"  let timer;",
					"  const late = new Promise((_, reject) => {",
					"    timer = setTimeout(() => reject(new Error(`the scan took longer than ${ms} ms`)), ms);",
					"  });",
					"  try {",
					"    return await Promise.race([scan(), late]);",
					"  } catch (err) {",
					"    // The tab may still be busy with the scan: close it, and use a new one.",
					"    await page.close().catch(() => {});",
					"    throw err;",
					"  } finally {",
					"    clearTimeout(timer);",
					"  }",
					"}",
					"",
					"const fs = require('node:fs');",
					"await page.evaluate(fs.readFileSync(require.resolve('@surea11y/core/browser'), 'utf8'));",
					"const result = await scanWithin(page, 60_000, () =>",
					"  page.evaluate(() => window.a11ycore.runa11yCoreInPage(location.href, null, {}, null))",
					");",
				]}
			/>
			<p>
				In jsdom läuft der Scan auf dem eigenen Thread von Node, daher kann ein Timer dort erst
				auslösen, wenn er endet: Führen Sie den Scan in einem Worker-Thread oder einem
				Kindprozess aus, und beenden Sie diesen, wenn das Limit überschritten ist. Das Zeitlimit des
				CI-Jobs selbst ist in beiden Fällen der letzte Ausweg.
			</p>

			<h2 id="internals-hook">Web Components mit privaten Internals</h2>
			<p>
				Ein Custom Element kann sich über <code>ElementInternals</code> einen Namen
				geben, seine Zustände setzen und sich eine Rolle geben. Viele halten ihre
				Internals in einem privaten Feld, wo kein Skript sie zurücklesen kann. Ein Scan
				fragt deshalb bei einem solchen Element nach (<code>cantTell</code>), statt es
				zu beurteilen, und sieht eine so gesetzte Rolle gar nicht.
			</p>
			<p>
				<code>internalsHookScript()</code> aus <code>@surea11y/core</code> (nicht aus
				dem Bundle) gibt ein Skript zurück, das die Internals jedes Elements erfasst,
				sobald die Seite sie anhängt, damit der Scan sie lesen kann. Es ist optional:
				Core installiert es nie. Installieren Sie es vor den eigenen Skripten der Seite,
				in jedem Frame, den Sie scannen: mit der Init-Script-API Ihres Treibers oder,
				auf einer Seite, die Sie selbst bauen, als erstes <code>&lt;script&gt;</code> im{" "}
				<code>&lt;head&gt;</code>. In einer jsdom-Setup-Datei, die läuft, nachdem das
				Dokument geladen ist, aber bevor eine Komponente definiert wird, übergeben Sie{" "}
				<code>{"{ early: true }"}</code>:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { internalsHookScript } = require('@surea11y/core');",
					"",
					"// Playwright",
					"await page.addInitScript({ content: internalsHookScript() });",
					"",
					"// Puppeteer",
					"await page.evaluateOnNewDocument(internalsHookScript());",
					"",
					"// jest.setup.js or vitest.setup.js, before any component is imported",
					"window.eval(internalsHookScript({ early: true }));",
				]}
			/>
			<p>
				Ob der Hook da war, zeigt das Ergebnis in{" "}
				<code>engine.environment.internalsHook</code>: <code>'early'</code>, wenn er vor
				den Skripten der Seite installiert wurde, <code>'late'</code>, wenn er danach
				kam und nur sieht, was die Seite ab dann anhängt. Jedes Skript der Seite kann
				lesen, was der Hook erfasst, private Internals einer Komponente sind damit nicht
				mehr privat: Installieren Sie ihn für Test- und Audit-Läufe, nicht in Seiten,
				die Sie an Nutzende ausliefern. Alle anderen Wege, ihn zu installieren, und was
				eine Seite davon bemerken kann, stehen in{" "}
				<a href={`${core}/docs/INTEGRATION.md#reading-private-elementinternals-the-internals-hook`}><code>INTEGRATION.md</code></a>.
			</p>

			<h2 id="listener-and-live-region-hooks">Klick-Handler und Live-Regionen</h2>
			<p>
				Zwei weitere optionale Hooks, seit core 1.14, werden wie der Internals-Hook installiert,
				vor den eigenen Skripten der Seite. <code>listenerHookScript()</code> zeichnet die Klick-,
				Tastatur-, Fokus-, Maus- und Einfüge-Listener auf, die eine Seite per Skript hinzufügt,
				damit die Tastaturregeln sie beurteilen: Ein <code>&lt;div role="button"&gt;</code> mit
				einem Klick-Listener und ohne Tastatur-Listener überall dort, wohin ein Tastaturereignis von
				ihm gelangt, ergibt <code>fail</code> (<code>CLICK_HANDLER_NO_KEY_LISTENER</code>).{" "}
				<code>liveRegionHookScript()</code> zeichnet auf, was Live-Regionen erhalten:{" "}
				<code>live-region-announcements</code> stellt dann eine Frage zu einer Region, die schon mit
				ihrem Text eingefügt oder auf einmal eingeblendet und gefüllt wurde und die Screenreader oft
				nicht ansagen, und <code>getAnnouncements()</code> gibt zurück, was die Seite zur Ansage
				bereitgestellt hat:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { listenerHookScript, liveRegionHookScript, getAnnouncements } = require('@surea11y/core');",
					"",
					"// Playwright: before the page's own scripts",
					"await page.addInitScript({ content: listenerHookScript() });",
					"await page.addInitScript({ content: liveRegionHookScript() });",
					"await page.goto('https://example.com/settings');",
					"",
					"await page.click('text=Save');",
					"const said = await page.evaluate(getAnnouncements, { selectors: true });",
					"// [{ text: 'Saved', politeness: 'polite', time: 1234.5, order: 7, behindModal: false, selector: '#status' }]",
				]}
			/>
			<p>
				<code>engine.environment.listenerHook</code> und <code>.liveRegionHook</code> zeigen, ob ein
				Scan sie gesehen hat. Nur ein Listener-Hook, der vor den Skripten der Seite installiert
				wurde (<code>'early'</code>), belegt, dass ein Listener fehlt; später installiert, stellen
				die Regeln nur eine Frage. Im Bundle liest <code>a11ycore.getAnnouncements()</code> sie in
				der Seite. Wie der Internals-Hook legen beide das, was sie aufzeichnen, dort ab, wo jedes
				Skript der Seite es lesen kann: Installieren Sie sie für Test- und Audit-Läufe. In einer
				jsdom-Setup-Datei übergeben Sie <code>{"{ early: true }"}</code> und führen für den
				Listener-Hook vorher einen Selektor aus (<code>document.querySelector('*')</code>), weil
				jsdom beim ersten Selektor eigene Tastatur-Listener hinzufügt. Die Abschnitte zum{" "}
				<a href={`${core}/docs/INTEGRATION.md#seeing-listeners-added-from-script-the-listener-hook`}>
					Listener-Hook
				</a>{" "}
				und zum{" "}
				<a href={`${core}/docs/INTEGRATION.md#seeing-what-live-regions-are-given-the-live-region-hook`}>
					Live-Region-Hook
				</a>{" "}
				in <code>INTEGRATION.md</code>, dem Integrationsleitfaden auf GitHub, enthalten den Rest.
			</p>

			<h2 id="questions-and-steps">Tendenzen und Prüfschritte für Fragen</h2>
			<p>
				Seit core 1.14 kann ein <code>cantTell</code>-Vorkommen einen <code>lean</code> enthalten:
				in welche Richtung die Hinweise auf der Seite zeigen (<code>toward: 'fail'</code> oder{" "}
				<code>'pass'</code>), warum, und was dagegen sprechen könnte. Das Ergebnis bleibt{" "}
				<code>cantTell</code>. Jede Frage einer core-Regel enthält außerdem{" "}
				<code>howToCheck</code>, die Schritte, mit denen eine Person sie beantwortet, in der Locale
				des Scans. Sie werden in Node hinzugefügt, nicht von der Engine in der Seite:{" "}
				<code>runDomRulesInPage</code> fügt sie hinzu, und für ein Ergebnis, das aus einer Seite
				zurückkommt, gibt <code>addHowToCheck(result)</code> eine Kopie mit ihnen zurück.{" "}
				<code>leaningFailures(result)</code> listet die Befunde, die zu <code>fail</code> tendieren,
				für eine eigene Schwelle:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { runa11yCoreInPage, addHowToCheck, leaningFailures } = require('@surea11y/core');",
					"",
					"const raw = await page.evaluate(runa11yCoreInPage, page.url(), null, {}, null);",
					"const result = addHowToCheck(raw); // a copy, with each question's steps",
					"const likelyFailures = leaningFailures(result);",
				]}
			/>
			<p>
				Ob ein Befund tendiert, und seine Texte, können sich in einer Minor-Version von core
				ändern; die Form von <code>lean</code> ist stabil. Beide Felder beschreibt{" "}
				<a href="/results-reports/output-schema/#leans">das Ausgabeschema</a>.
			</p>

			<h2 id="procedures-in-a-browser">Prüfverfahren im Browser</h2>
			<p>
				Seit core 1.15 kommen die <a href="/conformance/procedures/">Prüfverfahren</a>, also wie eine
				Person jedes Kriterium von Hand bewertet, auch zu Code, der im Browser läuft, aus{" "}
				<code>@surea11y/core/procedures</code>: Es braucht kein Dateisystem und erreicht keine der
				Regeln, sodass eine Browser-Erweiterung oder eine eigene Seite sie anzeigen oder ein
				Arbeitsblatt öffnen kann, mit den Wörterbüchern, die sie importiert:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"import { procedureChecklistFrom, renderProceduresFrom } from '@surea11y/core/procedures';",
					"import en from '@surea11y/core/procedures/en';",
					"import fr from '@surea11y/core/procedures/fr';",
					"",
					"const dictionaries = { en, fr };",
					"const checklist = procedureChecklistFrom(dictionaries, { levels: ['A', 'AA'], locale: 'fr' });",
					"const html = renderProceduresFrom(dictionaries, checklist);",
					"window.open(URL.createObjectURL(new Blob([html], { type: 'text/html' })));",
				]}
			/>

			<h2 id="what-a-scan-covers">Wissen, was ein Scan abdeckt</h2>
			<p>
				Ein Werkzeug, das nach WCAG-Kriterium berichtet und seine Nutzenden Prüfungen
				auswählen lässt, kann angeben, für welches Ziel der Scan gilt:{" "}
				<code>engineOptions.wcagLevel</code> neben <code>wcagVersion</code> lässt
				Kriterien oberhalb dieser Stufe aus, ohne zu ändern, welche Prüfungen laufen.{" "}
				<code>getRulesForRunOnly(runOnly, engineOptions)</code> listet die Kriterien
				auf, die ein Scan mit dieser Auswahl meldet, bevor Sie ihn ausführen, mit der
				Logik des Scans selbst:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { getRulesForRunOnly, runDomRulesInPage } = require('@surea11y/core');",
					"",
					"const engineOptions = { wcagVersion: '2.2', wcagLevel: 'AA' };",
					"const runOnly = { includeRuleIds: ['contrast-computable'] };",
					"",
					"getRulesForRunOnly(runOnly, engineOptions).map((r) => r.id); // before the scan",
					"const result = runDomRulesInPage(url, null, engineOptions, runOnly);",
				]}
			/>
			<p>
				Ein Kriterium, von dessen Prüfungen nur einige liefen, kommt als{" "}
				<code>cantTell</code> zurück, und jede Prüfung, die nicht lief, ist mit{" "}
				<code>notSelected: true</code> markiert: Zeigen Sie es als teilweise geprüft,
				nie als bestanden. Seit core 1.14 wird überhaupt kein Kriterium als bestanden gemeldet: Ein
				Kriterium gilt nur dann als bestanden, wenn seine Regeln alles prüfen, was es verlangt, und
				noch keines ist als vollständig geprüft erfasst. Wie Sie ein eigenes Werkzeug auf core aufbauen (eine CLI,
				eine CI-Integration, ein Dashboard, einen Generator für Konformitätsberichte),
				beschreibt{" "}
				<a href={`${core}/docs/BUILDING_ON_CORE.md`}><code>BUILDING_ON_CORE.md</code></a>{" "}
				auf GitHub: worauf Sie sich verlassen können, Scans ausführen, Prüfungen
				auswählen, Ergebnisse ehrlich darstellen und Läufe vergleichen.
			</p>
		</>
	);
}
