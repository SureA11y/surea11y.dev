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
			</p>
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
		</>
	);
}
