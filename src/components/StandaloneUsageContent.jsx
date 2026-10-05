import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function StandaloneUsageContent() {
	return (
		<>
			<h2>When to use it</h2>
			<p>
				For a manual check against a page open in a real browser, a bookmarklet, or any other
				context with no automation driver and no build step to reach for.
			</p>

			<h2>Usage</h2>
			<p>
				<code>@surea11y/core</code> ships <code>surea11y.browser.js</code> at the package root, a
				bundle generated from the same rule sources as the Node package. Loading it directly
				defines one global, <code>a11ycore</code>:
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
				<code>a11ycore.runa11yCoreInPage</code> is the exact same function the bindings call
				under the hood — the bundle exists only to solve <em>loading</em> it without{" "}
				<code>require</code>/a module system, not to add a separate API surface.
			</p>
			<p>
				<strong>The bundle carries English only.</strong> Every other locale ships beside it as its own file — load
				one after the bundle and that language becomes available:
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
				Ask for a locale whose file you haven't loaded and you get English, not an error — see{" "}
				<a href="/configuration/locales/">Locales</a>.
			</p>
			<p>
				<strong>Deliberately excluded from the bundle</strong>: <code>runa11yCoreAcrossFrames</code>/
				<code>a11yCoreEnableFrameResponder</code> (cross-frame scanning needs the embedded frame to
				load the engine and opt in too — not a fit for a single dropped-in script tag). Use the npm
				package directly if you need it — see{" "}
				<a href={`${core}/docs/INTEGRATION.md#cross-frame-scanning-including-cross-origin`}>
					<code>INTEGRATION.md</code>
				</a>
				.
			</p>
			<p>
				<code>require('@surea11y/core')</code> directly, without any binding, is the other
				standalone path — this is Pattern 1/Pattern 2 in{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>: jsdom in Node with
				no real browser, or driving Puppeteer/Playwright yourself instead of going through a
				binding.
			</p>

			<h2 id="waiting-for-the-page">Waiting for the page before a scan</h2>
			<p>
				A scan reads the page as it is at that moment. On a page that has just opened, web fonts
				may still be loading and images may not have arrived, so the same page scanned a second
				later can give another result. The scan records this in{" "}
				<code>engine.environment.fonts</code> and <code>.images</code> (see{" "}
				<a href="/results-reports/output-schema/">the output schema</a>), but the better fix is
				not to scan until the page has settled.
			</p>
			<p>
				<code>waitForPageReady(options)</code> does that waiting, and the bundle puts it on the
				same global. The scan never calls it itself; call it just before you scan. It waits for
				the window's <code>load</code> event, for <code>document.fonts.ready</code>, and for every
				image still loading (except <code>loading="lazy"</code> ones), for at most{" "}
				<code>timeoutMs</code> (default <code>5000</code>). It never rejects: when the time runs
				out it resolves anyway with <code>ready: false</code> and says what was still pending.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const ready = await a11ycore.waitForPageReady({ timeoutMs: 3000 });",
					"const result = a11ycore.runa11yCoreInPage(location.href, null, {}, null);",
				]}
			/>
			<p>
				A driver you run yourself can send it into the page the same way as{" "}
				<code>runa11yCoreInPage</code>: <code>page.evaluate(waitForPageReady, {"{ timeoutMs: 5000 }"})</code>.
				In jsdom there is nothing to wait for, so it resolves at once with <code>ready: true</code>.
				The other options (<code>quietMs</code>, <code>document</code>) and the full return value
				are in{" "}
				<a href={`${core}/docs/INTEGRATION.md#waiting-for-the-page-before-a-scan`}>
					<code>INTEGRATION.md</code>
				</a>
				, the integration guide on GitHub.
			</p>
		</>
	);
}
