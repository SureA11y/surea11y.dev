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
				<code>require</code>/a module system, not to add a separate API surface. The arguments are
				the same as anywhere else. A scan scoped to one region, limited to WCAG 2.2 A and AA, with
				two noisy widgets left out:
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
				The bundle also loads as a module: <code>import a11ycore from '@surea11y/core/browser'</code>,
				a named import of <code>runa11yCoreInPage</code>, and <code>require()</code> all get its
				API, and the global is still defined.
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
				no real browser, or driving Puppeteer/Playwright yourself instead of going through a binding.
				For tests, <code>runa11yCoreOnHtml(html, options)</code> from{" "}
				<code>@surea11y/core/testing</code> scans an HTML string in jsdom and sets up the document
				for you; since core 1.12 its <code>contentType</code> option parses an SVG or XHTML
				document as what it is.
			</p>

			<h2 id="packs-in-a-page">Packs in a page</h2>
			<p>
				A <a href="/configuration/packs/">pack</a> is prepared in Node, so it reaches a page as a
				script. <code>packScript(packs)</code> from <code>@surea11y/core/pack</code> returns one
				that registers the packs; load it after the bundle (and into every frame you scan), then
				name the packs in <code>engineOptions.packs</code> as <code>name@version</code>. Or ship one
				file with <code>buildBrowserBundle({"{ packs }"})</code>, the bundle with the packs
				registered after it. The rules' code is written into the script as functions, so it runs
				where a Content Security Policy forbids <code>eval</code>.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// In Node: write the script once, beside the bundle.",
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
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(location.href, null, {",
					"    packs: ['@acme/a11y-policy@1.0.0'],",
					"    profile: 'acme-web-2026'",
					"  }, null);",
					"</script>",
				]}
			/>
			<p>
				The page runs exactly the set of packs one <code>packScript</code> call registered, with
				the core it was prepared with: pass every pack a scan needs to one call. Named packs the
				page doesn't run are listed in <code>skippedPacks</code> with the reason. The bindings do
				all of this for you with <code>.withPacks()</code>.
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
				Whether to scan anyway, wait longer or stop is your choice; if you scan, keep what was
				pending with the result.
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

			<h2 id="a-time-limit-on-a-scan">A time limit on a scan</h2>
			<p>
				A scan runs in one go inside the page, and nothing in the page can stop it once it has
				started: a page getter or a rule that never returns blocks that tab for good. Limit the
				time from where you start the scan, and give up on the tab when the limit passes: your time
				limit stops the wait, not the script running in the page. 60
				seconds is far above what a normal page takes, so it only catches the broken ones:
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
				In jsdom the scan runs on Node's own thread, so a timer there can't fire until it ends: run
				the scan in a worker thread or a child process, and end that when the limit passes. A CI
				job's own time limit is the last resort for both.
			</p>

			<h2 id="internals-hook">Web components with private internals</h2>
			<p>
				A custom element can name itself, set its states and give itself a role through{" "}
				<code>ElementInternals</code>. Many keep their internals in a private field, where no
				script can read them back, so a scan asks about such an element (<code>cantTell</code>)
				instead of judging it, and doesn't see a role set that way at all.
			</p>
			<p>
				<code>internalsHookScript()</code>, from <code>@surea11y/core</code> (not the bundle),
				returns a script that records each element's internals as the page attaches them, so the
				scan can read them. It is opt-in: core never installs it. Install it before the page's own
				scripts, in every frame you scan: with your driver's init-script API, or on a page you
				build yourself as the first <code>&lt;script&gt;</code> in <code>&lt;head&gt;</code>. In a
				jsdom setup file, which runs after the document has loaded but before any component is
				defined, pass <code>{"{ early: true }"}</code>:
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
				The result says whether it was there, in <code>engine.environment.internalsHook</code>:{" "}
				<code>'early'</code> when it was installed before the page's scripts, <code>'late'</code>{" "}
				after them, when it only sees what the page attaches from then on. Any script in the page
				can read what the hook records, so a component's private internals are no longer
				private: install it for test and audit runs, not in pages you serve to users. Every other
				way to install it, and what a page can notice, is in{" "}
				<a href={`${core}/docs/INTEGRATION.md#reading-private-elementinternals-the-internals-hook`}>
					<code>INTEGRATION.md</code>
				</a>
				.
			</p>

			<h2 id="what-a-scan-covers">Knowing what a scan covers</h2>
			<p>
				A tool that reports by WCAG criterion and lets its users pick checks can say which target
				the scan is for: <code>engineOptions.wcagLevel</code>, beside <code>wcagVersion</code>,
				leaves out criteria above that level without changing which checks run.{" "}
				<code>getRulesForRunOnly(runOnly, engineOptions)</code> lists the criteria a scan with that
				selection reports, before you run it, using the scan's own logic:
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
				A criterion only some of whose checks ran comes back <code>cantTell</code>, with each
				check that didn't run marked <code>notSelected: true</code>: show it as partly checked,
				never as passed. Building a tool of your own on core (a CLI, a CI integration, a dashboard,
				a conformance-report generator) is covered in{" "}
				<a href={`${core}/docs/BUILDING_ON_CORE.md`}>
					<code>BUILDING_ON_CORE.md</code>
				</a>{" "}
				on GitHub: what you can rely on, running scans, choosing checks, presenting results
				honestly and comparing runs.
			</p>
		</>
	);
}
