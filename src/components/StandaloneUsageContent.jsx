import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function StandaloneUsageContent() {
	return (
		<>
			<p>
				For a manual check against a page open in a real browser, a bookmarklet, or any other
				context with no automation driver and no build step to reach for.
			</p>
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
				The bundle carries English only. Every other locale ships beside it as its own file — load
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
				Deliberately excluded from the bundle: <code>runa11yCoreAcrossFrames</code>/
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
		</>
	);
}
