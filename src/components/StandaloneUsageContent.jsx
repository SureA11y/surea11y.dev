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

			<h2 id="from-the-browser-console">From the browser console</h2>
			<p>
				For a scan by hand, the bundle has a few helpers. Load it into any open page from the
				browser's console (the Console tab of the developer tools), then scan, list the findings,
				box them on the page, or open the HTML report:
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
				<code>run(options)</code> takes the engine options plus two of its own,{" "}
				<code>context</code> (a selector, to scan only part of the page) and <code>runOnly</code>,
				and fetches the style sheets the page can't read itself before it scans.{" "}
				<code>table()</code> prints one row per finding: failures first, then the questions that
				lean fail, those that lean pass, and those only a person can judge.{" "}
				<code>highlight()</code> draws a box over each element a <code>fail</code> (solid red) or{" "}
				<code>cantTell</code> (dashed amber) names, in a layer of its own that leaves the page's
				elements untouched; <code>clearHighlights()</code> removes it. <code>inspect()</code> draws
				what a person reviewing the page checks by hand, and judges nothing:{" "}
				<code>'headings'</code>, <code>'landmarks'</code>, <code>'names'</code> or{" "}
				<code>'focus-order'</code>. <code>openReport()</code> fetches{" "}
				<code>surea11y.report.js</code> from beside the bundle the first time, and the report
				shows how to check each question. A page's Content Security Policy can block a script from
				a CDN: load the files from the page's own origin then, or scan with a driver. Every option
				is in the{" "}
				<a href={`${core}/docs/INTEGRATION.md#from-the-browser-console`}>
					browser console section of <code>INTEGRATION.md</code>
				</a>
				, the integration guide on GitHub.
			</p>

			<h2 id="packs-in-a-page">Packs in a page</h2>
			<p>
				A <a href="/configuration/packs/">pack</a> is prepared in Node, so it reaches a page as a
				script. For a page that loads its scripts as files (a <code>&lt;script&gt;</code> tag, a
				bookmarklet, an extension), build one file in Node:{" "}
				<code>buildBrowserBundle({"{ packs }"})</code> from <code>@surea11y/core/pack</code> is the
				bundle with the packs registered after it. Then name the packs in{" "}
				<code>engineOptions.packs</code> as <code>name@version</code>. The rules' code is written
				into the script as functions, so it runs where a Content Security Policy forbids{" "}
				<code>eval</code>.
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
				A pack's script runs only with the core that wrote it: it carries the catalog core and the
				packs make together, checked in Node. A page whose bundle is another version of core runs
				the scan without the packs and lists each in <code>skippedPacks</code>, naming the two
				versions. One file holds both, so they can't fall out of step. Build it again when you
				update core or a pack, and update the <code>name@version</code> the page names.
			</p>
			<p>
				Where core's bundle is already on the page, write <code>packScript(packs)</code> to a file
				with the same core, and load it after the bundle (and into every frame you scan):
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

			<h2 id="style-sheets-from-another-origin">Style sheets from another origin</h2>
			<p>
				A page's script can't read the rules of a style sheet served from another origin (a CDN, a
				fonts service), so a rule that looks for something in the CSS, such as{" "}
				<code>css-orientation-lock</code>, can't tell whether it's there, and asks. Give the scan
				their text in <code>engineOptions.styleSheetTexts</code> (<code>{"[{ href, text }]"}</code>)
				and <code>css-orientation-lock</code>, <code>css-hidden-focus</code> and{" "}
				<code>css-focus-indicator-suppressed</code> read it. On the bundle,{" "}
				<code>runa11yCoreInPageAsync</code> takes the same four arguments as{" "}
				<code>runa11yCoreInPage</code>, fetches the sheets whose server shares them (CORS) with{" "}
				<code>preloadStyleSheets()</code>, then scans:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const result = await a11ycore.runa11yCoreInPageAsync(location.href, null, {}, null);",
				]}
			/>
			<p>
				A sheet whose server doesn't share it can't be read from the page at all. A tool driving
				the browser can fetch it from outside the page, where no CORS applies, and pass it in the
				same option; the bindings do.
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

			<h2 id="listener-and-live-region-hooks">Click handlers and live regions</h2>
			<p>
				Two more opt-in hooks, from core 1.14, install the same way as the internals hook, before
				the page's own scripts. <code>listenerHookScript()</code> records the click, key, focus,
				mouse and paste listeners a page adds from script, so the keyboard rules judge them: a{" "}
				<code>&lt;div role="button"&gt;</code> with a click listener and no key listener anywhere a
				key event from it goes fails (<code>CLICK_HANDLER_NO_KEY_LISTENER</code>).{" "}
				<code>liveRegionHookScript()</code> records what live regions are given:{" "}
				<code>live-region-announcements</code> then asks about a region added with its text already
				in it, or shown and filled at once, which screen readers commonly don't announce, and{" "}
				<code>getAnnouncements()</code> returns what the page made available to announce:
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
				<code>engine.environment.listenerHook</code> and <code>.liveRegionHook</code> say whether a
				scan saw them. Only a listener hook installed before the page's scripts (
				<code>'early'</code>) proves a listener is missing; installed later, the rules only ask. On
				the bundle, <code>a11ycore.getAnnouncements()</code> reads them in the page. Like the
				internals hook, both keep what they record where any script on the page can read it:
				install them for test and audit runs. In a jsdom setup file, pass{" "}
				<code>{"{ early: true }"}</code>, and for the listener hook run one selector first (
				<code>document.querySelector('*')</code>), since jsdom adds key listeners of its own the
				first time a selector runs. The{" "}
				<a href={`${core}/docs/INTEGRATION.md#seeing-listeners-added-from-script-the-listener-hook`}>
					listener hook
				</a>{" "}
				and{" "}
				<a href={`${core}/docs/INTEGRATION.md#seeing-what-live-regions-are-given-the-live-region-hook`}>
					live-region hook
				</a>{" "}
				sections of <code>INTEGRATION.md</code>, the integration guide on GitHub, have the rest.
			</p>

			<h2 id="questions-and-steps">Leans and steps for questions</h2>
			<p>
				Since core 1.14, a <code>cantTell</code> occurrence can carry a <code>lean</code>: which way
				the page's evidence points (<code>toward: 'fail'</code> or <code>'pass'</code>), why, and
				what could make it wrong. The outcome stays <code>cantTell</code>. Each question of a core
				rule also carries <code>howToCheck</code>, the steps a person follows to answer it, in the
				scan's locale. They're added in Node, not by the engine in the page:{" "}
				<code>runDomRulesInPage</code> adds them, and for a result that comes back from a page,{" "}
				<code>addHowToCheck(result)</code> returns a copy with them. <code>leaningFailures(result)</code>{" "}
				lists the findings that lean fail, for a gate of your own:
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
				Whether a finding leans, and its texts, may change in a minor release of core; the shape of{" "}
				<code>lean</code> is stable. See{" "}
				<a href="/results-reports/output-schema/#leans">the output schema</a> for both fields.
			</p>

			<h2 id="procedures-in-a-browser">Procedures in a browser</h2>
			<p>
				Since core 1.15, the <a href="/conformance/procedures/">test procedures</a>, how a person
				assesses each criterion by hand, come to code that runs in a browser too, from{" "}
				<code>@surea11y/core/procedures</code>: it needs no file system and reaches none of the
				rules, so a browser extension or a page of your own can show them, or open a worksheet,
				with the dictionaries it imports:
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
				never as passed. Since core 1.14 no criterion is reported as passing at all: one passes
				only when its rules check everything it asks, and none is listed as checked in full yet. Building a tool of your own on core (a CLI, a CI integration, a dashboard,
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
