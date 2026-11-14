import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { ResultBadge } from "./design-system/results/ResultBadge.jsx";
import rules from "../data/rules.generated.json";

const core = "https://github.com/SureA11y/core/blob/main";

const packageRows = [
	{ id: "playwright", want: "Add accessibility checks to Playwright tests", install: <><code>@surea11y/playwright</code> + <code>@surea11y/core</code></> },
	{ id: "puppeteer", want: "…Puppeteer", install: <><code>@surea11y/puppeteer</code> + <code>@surea11y/core</code></> },
	{ id: "selenium", want: "…Selenium", install: <><code>@surea11y/selenium</code> + <code>@surea11y/core</code></> },
	{ id: "cypress", want: "…Cypress", install: <><code>@surea11y/cypress</code> + <code>@surea11y/core</code></> },
	{ id: "webdriverio", want: "…WebdriverIO", install: <><code>@surea11y/webdriverio</code> + <code>@surea11y/core</code></> },
	{ id: "test-matchers", want: "Assert accessibility in Jest/Vitest component or unit tests", install: <><code>@surea11y/test-matchers</code> + <code>@surea11y/core</code></> },
	{ id: "cli", want: "Scan pages from a terminal or CI pipeline, as static HTML or in Chromium", install: <code>@surea11y/cli</code> },
	{ id: "pack-en301549", want: "Check against EN 301 549, the European standard, with any of the above", install: <><a href="/configuration/packs/#en-301-549-pack"><code>@surea11y/pack-en301549</code></a> + <code>@surea11y/core</code></> },
	{ id: "pack-wai-aria", want: "Check ARIA against WAI-ARIA 1.2 itself, beside WCAG or on its own", install: <><a href="/configuration/packs/#wai-aria-pack"><code>@surea11y/pack-wai-aria</code></a> + <code>@surea11y/core</code></> },
	{ id: "pack-own", want: "Check against your own rules, profiles or standard, public or internal", install: <>A pack of your own: see <a href="/configuration/packs/#writing-a-pack">Writing a pack</a></> },
	{ id: "core", want: "Run the engine against a DOM you already have", install: <code>@surea11y/core</code> },
	{ id: "core-build", want: "Build your own tool on the engine: a CLI, an extension, a dashboard, a report generator", install: <code>@surea11y/core</code> },
];

export function OverviewLead() {
	return (
		<>
			<p>
				<a href="https://github.com/SureA11y/core">@surea11y/core</a> is an <strong>accessibility testing engine</strong> you run in your own
				test suite, CI pipeline, or from the command line.
			</p>
			<p>
				What sets it apart is what it does with the cases automated testing can't settle. It
				implements the W3C's open{" "}
				<a href="https://www.w3.org/TR/act-rules-format/">
					Accessibility Conformance Testing (ACT) Rules Format
				</a>
				, verified against ACT's own published test corpus rather than judged only against
				itself. It reports findings, non-findings, and — unusually — explicit uncertainty, so
				results are auditable rather than reassuring.
			</p>
			<p>
				<em>Sure</em> means certainty about what is known, and honesty about what isn't. It tells you what it
				can't tell you.
			</p>
		</>
	);
}

export function OverviewContent() {
	return (
		<>
			<h2>Not a single product</h2>
			<p>
				surea11y is a family of packages sharing one engine, not one tool with one install
				command. Install the one that matches how you already test, together with{" "}
				<code>@surea11y/core</code>, the engine it runs. Install core on its own to run the engine
				on a DOM you already have, or to build a tool of your own on it:
			</p>
			<DataTable
				label="Which package to install"
				rowKey="id"
				columns={[
					{ key: "want", label: "I want to…", wrap: true },
					{ key: "install", label: "Install", width: "26%" },
				]}
				rows={packageRows}
			/>
			<p>
				See <a href="/getting-started/">Getting Started</a> for install and usage per binding. If
				you're building a tool, <a href={`${core}/docs/BUILDING_ON_CORE.md`}><code>BUILDING_ON_CORE.md</code></a>{" "}
				on GitHub covers the stable contract, running scans, choosing checks, and presenting
				results without claiming more than they say.
			</p>
			<p>
				For a first look without a test suite, load the{" "}
				<a href="/getting-started/standalone/">standalone bundle</a> on a page and scan it from the
				browser console: <code>await a11ycore.run()</code> scans the page,{" "}
				<code>a11ycore.table(result)</code> lists the findings, <code>a11ycore.highlight(result)</code>{" "}
				outlines them on the page, and <code>await a11ycore.openReport(result)</code> opens the HTML
				report.{" "}
				<a href={`${core}/docs/INTEGRATION.md#from-the-browser-console`}>
					<code>INTEGRATION.md</code>
				</a>{" "}
				on GitHub lists the other helpers, such as <code>a11ycore.inspect('headings')</code> for a
				page's headings, landmarks, names or focus order.
			</p>

			<h2>How its results differ</h2>
			<p>
				Every rule makes one deterministic decision, from a fixed vocabulary of four outcomes —
				not the <code>violations</code>/<code>passes</code>/<code>incomplete</code>/
				<code>inapplicable</code> shape other popular accessibility testing tools use:
			</p>
			<ul className="outcome-list">
				<li>
					<ResultBadge lang="en" state="fail" /> (<code>fail</code>) — a violation provable from the DOM.
					Reserved for objective, normative cases.
				</li>
				<li>
					<ResultBadge lang="en" state="pass" /> (<code>pass</code>) — this rule's specific condition is met.{" "}
					<strong>Not a claim that the page is accessible.</strong>
				</li>
				<li>
					<ResultBadge lang="en" state="unknown" /> (<code>cantTell</code>) — a human has to decide this, and
					the result says what was ambiguous.
				</li>
				<li>
					<ResultBadge lang="en" state="na" /> (<code>notApplicable</code>) — the rule's precondition isn't
					present.
				</li>
			</ul>
			<p>
				<code>cantTell</code> is the point of the project. An engine that quietly discards what it
				cannot determine <strong>produces a shorter report and a false sense of coverage</strong>. See{" "}
				<a href="/results-reports/output-schema/">Results &amp; Reports</a> for the full result shape, and{" "}
				<a href="/conformance/wcag-mapping/">Conformance</a> for how individual results roll up into a WCAG
				verdict — including how a target WCAG version (2.0/2.1/2.2) is resolved and applied.
			</p>
			<p>
				A <code>cantTell</code> doesn't leave you with only a question. Every one a core rule
				reports says how to answer it: a few steps starting from the element it names, and what
				you'll see if it passes and if it fails, in the scan's language. Where the page gives
				evidence, the finding also leans toward <code>pass</code> or <code>fail</code>, with the facts
				it read, its reason, and what could make it wrong. Each lean is counted against the W3C ACT
				test cases, and once it has been counted on at least five, it says how often it was right;
				until then it carries no figure at all, never an estimate. The outcome stays{" "}
				<code>cantTell</code>: a lean orders the questions, and a person still answers them. See{" "}
				<a href="/results-reports/output-schema/#how-to-check">How to check</a> and{" "}
				<a href="/results-reports/output-schema/#leans">Leans</a> in the Output schema, and{" "}
				<a href={`${core}/docs/LEANS.md`}><code>LEANS.md</code></a> on GitHub for what earns a
				finding a lean and how far to trust one.
			</p>
			<p>
				A scan is half an assessment, and the engine gives you the other half too. For every WCAG
				criterion its rules evaluate, core has a test procedure for each part of it: the steps a
				person follows in a browser, the tools it needs (a keyboard, a screen reader, the zoom),
				and what they see if it passes and if it fails, in five languages. They are the same text
				a finding's "How to check" comes from. Read them as data, or render them as a reference or
				as a worksheet that records each result and rolls them up per criterion, with no scan for
				a manual audit, or next to one for what it leaves open. See{" "}
				<a href="/conformance/procedures/">Test procedures</a>, or open{" "}
				<a href="/procedures/wcag-22-aa-checklist.html">the WCAG 2.2 AA worksheet</a>.
			</p>
			<p>
				The HTML report sets out the questions in the order a reviewer works through them: "Likely
				fails: confirm", "Likely passes: confirm" and "Needs a person". Each card has its "How to check" steps, and those in the
				first two groups say why they lean, and a last section, "What's left for a person", lists
				the checks no rule decides in full, criterion by criterion, beside the scan's outcome for
				each. In CI, the JUnit and SARIF reports can also gate on the findings
				that lean fail, off by default, and a baseline can accept the ones a page already has, so
				only new ones break the build. See <a href="/results-reports/html-report/">HTML report</a>{" "}
				and <a href="/conformance/baseline/">Baseline / allowlist</a>, or <a href="/sample-report.html">open a sample report</a> of a
				small checkout page.
			</p>
			<p>
				A <code>pass</code> that came close says so. Rules that measure against a threshold —
				contrast, target size, text spacing — report a <code>margin</code> when the closest pass
				came near the limit: the element that came closest while still meeting it. Text at 4.52:1 against a 4.5:1 minimum passes,
				and the margin shows it, so you can fix it before a small change turns it into a{" "}
				<code>fail</code>. See the <a href="/results-reports/output-schema/#margin">Output schema</a>.
			</p>
			<p>
				Name the standard, and the engine picks the rules.{" "}
				<code>{"{ wcag: { version: '2.2', level: 'AA' } }"}</code> runs the rules for WCAG 2.2's A
				and AA criteria, by the level each criterion has in that version, and{" "}
				<code>bestPractices: true</code> adds the checks WCAG doesn't require.{" "}
				<code>profile: 'wcag21-aa'</code> does the same by name, for WCAG 2.0, 2.1 and 2.2 at each
				level, and can be scanned beside a pack's profile. A standard beyond
				WCAG, such as a national one or your organisation's own policy, comes as a pack: its rules,
				profiles and checklist items run beside core's and show in every report. See{" "}
				<a href="/configuration/engine-options/#selecting-which-rules-run">Engine options</a> and{" "}
				<a href="/configuration/packs/">Packs</a>.
			</p>
			<p>
				Name several standards, and one scan judges the page by each.{" "}
				<code>profile: ['wcag22-aa', 'wai-aria-1.2']</code> judges it by WCAG and by WAI-ARIA at
				once: each profile decides as a scan of it alone would, the result counts as one scan with
				the rules of all, and every finding says what each profile makes of it. An attribute a role
				doesn't support is a question for WCAG 4.1.2 and a failure of WAI-ARIA, and the result
				says both, so nothing is counted twice and nothing is lost. See{" "}
				<a href="/configuration/engine-options/#several-profiles">Engine options</a>.
			</p>
			<p>
				Name checks rather than a standard, and the result still says which WCAG criteria they
				bear on. A scan that runs only <code>link-name-present</code> reports 2.4.4 and 4.1.2
				too, plus the AAA 2.4.9 unless the scan sets a level, and a criterion whose other checks the scan left out comes back{" "}
				<code>cantTell</code> ("Partly checked" in the HTML report), not <code>pass</code>. <code>wcagLevel: 'AA'</code>{" "}
				sets the level of the criteria a scan reports, and the JUnit, SARIF and EARL reports follow
				it, so an AA build doesn't fail on an AAA criterion.
			</p>
			<p>
				No WCAG criterion is reported as passed on the strength of rules that check only part of
				it. A criterion passes only when its rules check everything it asks, and none is checked
				that completely yet, so where every rule for a criterion passes, the criterion comes back{" "}
				<code>cantTell</code>: the parts the rules check are met, and a person checks the rest. A
				report with no failure says the same under its headline: no rule failed, and that is not a
				claim that the page conforms. Marking those criteria as passed would be the false sense of
				coverage this engine is built to avoid. See <a href="/conformance/wcag-mapping/">WCAG conformance mapping</a>.
			</p>
			<p>
				A WCAG failure is a WCAG failure, not a broken specification that WCAG doesn't count. Where
				only WAI-ARIA or the HTML content model is broken, and the name, role and value people
				rely on survive it, the ARIA and HTML structure rules ask rather than fail, with steps to
				check. The <a href="/configuration/packs/#wai-aria-pack">WAI-ARIA pack</a> reads the same
				findings by WAI-ARIA's own MUSTs, so a team that holds itself to the specification can
				fail on it, by choice.
			</p>
			<p>
				Web components are judged by what they expose. A custom element that gives itself a name,
				states or a role through <code>ElementInternals</code> is checked against them where the
				engine can read them, and asked about where it can't. For test and audit runs,{" "}
				<code>internalsHookScript()</code> is an opt-in script that lets a scan read the internals a
				component keeps private, so those elements pass or fail instead of coming back{" "}
				<code>cantTell</code>.{" "}
				<a href={`${core}/docs/INTEGRATION.md#reading-private-elementinternals-the-internals-hook`}>
					<code>INTEGRATION.md</code>
				</a>{" "}
				on GitHub shows how to install it before the page's own scripts.
			</p>
			<p>
				Rules reach four criteria no rule covered before: 3.3.1 Error Identification (a field
				marked invalid whose error message is missing, hidden or not tied to it), 4.1.3 Status
				Messages (a live region assistive technology can't reach), 1.4.5 Images of Text (text
				drawn in an image that could be real text) and, in a browser, 2.4.11 Focus Not Obscured (Minimum)
				(a fixed or sticky header, footer or banner that elements in the tab order can take focus
				hidden behind, confirmed by hit-testing). All four ask rather than fail. A finding's
				message names the cause where the rule knows it: why an element has no name, a likely
				typo in a role, attribute or <code>autocomplete</code> value, what hides an element. The keyboard
				rules read event handlers from the markup; with <code>listenerHookScript()</code>, another
				opt-in script installed before the page's own, they judge listeners added from script too,
				so a <code>role="button"</code> in the tab order with a click listener and no key listener
				anywhere its keys could reach one (on it, inside it, on its ancestors, a shadow root it
				is in, the document or the window), and no focus listener that might add one, fails: Enter
				and Space do nothing.{" "}
				<a href={`${core}/docs/INTEGRATION.md#seeing-listeners-added-from-script-the-listener-hook`}>
					<code>INTEGRATION.md</code>
				</a>{" "}
				on GitHub shows how to install it, and its counterpart for status messages, the
				live-region hook.
			</p>
			<p>
				In a browser, contrast is measured as the page is drawn: text on a page with no background
				of its own, on the canvas the browser paints, light or dark; generated text from{" "}
				<code>::before</code>, <code>::after</code> and list markers; a closed{" "}
				<code>&lt;select&gt;</code>. These used to be skipped or asked about. Text drawn only by
				an outline or a shadow now fails where every color it is drawn in is below the ratio. A lone character standing in for a control's name, the "X" in a button named
				"Close", is asked about rather than failed: whether it's an icon or a letter takes a person.
			</p>

			<h3 id="checked-against-the-act-corpus">Checked against the ACT corpus</h3>
			<p>
				The engine ships {rules.length} rules. Those with a{" "}
				<a href="https://www.w3.org/WAI/standards-guidelines/act/rules/">W3C ACT Rules</a>{" "}
				counterpart run against the test cases W3C publishes for them, the set W3C's own
				implementation listing scores: 957 examples across 60 ACT rules. The engine fails none of
				the examples ACT marks passed or inapplicable, so it reports no false positives against
				that corpus. That is a result on those examples, not a guarantee for every page; where the
				engine can't decide a case, it returns <code>cantTell</code>, which ACT permits for an
				automated implementation.
			</p>
			<p>
				It holds in both places the engine runs: in jsdom, as test-matchers and the CLI run it by default, and
				in Chromium, as the browser bindings do, with each test case loaded as a real page, its
				scripts and linked style sheets included. Twenty-two examples ACT marks failed go
				unflagged in jsdom and 18 in Chromium. Most are judgement calls, such as whether a heading
				describes the content under it; the four a browser catches need a page's own scripts or
				style sheets, which jsdom doesn't run. See{" "}
				<a href={`${core}/docs/ACT_RULE_MAPPING.md`}><code>ACT_RULE_MAPPING.md</code></a> for every
				one, with the reasoning.
			</p>
			<p>
				Two EARL implementation reports record the outcome for every one of those cases, passes and
				inapplicable results included, so a rule that stayed silent because nothing applied is
				distinguishable from one that isn't implemented at all:{" "}
				<a href="https://surea11y.github.io/act-report/act-report.jsonld">SureA11y</a>, run in
				jsdom, and{" "}
				<a href="https://surea11y.github.io/act-report/act-report-browser.jsonld">
					SureA11y in a browser
				</a>
				, run in Chromium. See <a href="/results-reports/earl-report/">EARL report</a> for the
				format.
			</p>

			<h2>Key principles</h2>
			<ul>
				<li><strong>Deterministic execution.</strong> The same page, rendered under the same conditions and scanned with the same options, gets the same decisions. Timings, timestamps and environment details in the result can still differ between runs. Running animations and transitions are held still for the scan, so a fade in progress doesn't change what the rules measure.</li>
				<li><strong>Conservative by design.</strong> Core's rules reserve <code>fail</code> for objective, normative violations, to keep false alarms rare.</li>
				<li><strong>Standards traceability.</strong> Rules map to the applicable WCAG Success Criterion whenever appropriate.</li>
				<li><strong>Stable machine-readable output.</strong> Rule identifiers remain stable regardless of language.</li>
				<li><strong>Framework independent.</strong> Run inside jsdom or any browser automation framework.</li>
				<li><strong>Extensible.</strong> Add custom rules, register policies and filter scans by rule IDs, tags or WCAG version.</li>
				<li><strong>Localized reporting.</strong> Human-readable messages can be translated without affecting machine-readable data — ships with <code>en</code>, <code>fr</code>, <code>de</code>, <code>es</code>, and <code>ja</code> today.</li>
			</ul>

			<h2>Philosophy</h2>
			<blockquote>
				Automate what can be determined objectively. Never pretend to automate what cannot.
			</blockquote>
			<p>
				Some WCAG requirements can be checked with complete confidence. Others need human
				judgement, knowledge of context, or usability evaluation. A single score or a pass/fail
				verdict flattens that difference; surea11y reports it. This is why <code>cantTell</code>{" "}
				and <code>notApplicable</code> exist as outcomes, and it shapes every rule in the engine.
			</p>

			<h3>What surea11y won't catch</h3>
			<p>Being explicit about the boundaries of automation is part of the same philosophy. For example, surea11y will not:</p>
			<ul>
				<li>confirm that alt text is <em>meaningful</em>, only that it is present (an alt attribute of <code>"image123.png"</code> passes the objective check, and is asked about, leaning fail, as a file name);</li>
				<li>judge whether a color contrast choice is aesthetically appropriate, only whether it meets the applicable contrast ratio;</li>
				<li>determine whether an error message actually <em>explains</em> the problem, since that depends on validation logic a static scan can't see;</li>
				<li>detect a keyboard focus trap or content clipped at 400% zoom, since both require simulating real user interaction over time, not just reading the DOM at one instant.</li>
			</ul>
			<p>
				Some implemented checks report <code>cantTell</code> when a person has to decide. Other
				aspects, including keyboard traps and reflow at zoom, are not checked by the engine at all
				and need separate testing: no <code>cantTell</code> stands in for them, so a result without
				one doesn't mean they were covered. See{" "}
				<a href="/help/known-limitations/">Known limitations</a> for the complete list, and the{" "}
				<a href="/conformance/procedures/">test procedures</a> for how a person checks the
				criteria the rules evaluate.
			</p>
		</>
	);
}

export function OverviewAbout() {
	return (
		<section className="stewardship" aria-labelledby="about-the-project">
			<h2 id="about-the-project" className="stewardship-label">About the project</h2>
			<p className="stewardship-lead">
				surea11y is an independent <span className="stewardship-nowrap">open-source</span> project, developed in the open.
			</p>
			<p className="stewardship-body">
				<code>@surea11y/core</code> and every integration package are published on{" "}
				<a href="https://www.npmjs.com/org/surea11y">npm</a>. Issues, discussion, and changes all
				happen publicly on <a href="https://github.com/SureA11y">GitHub</a>, and contributions are
				welcome. See{" "}
				<a href="https://github.com/SureA11y/core/blob/main/CONTRIBUTING.md">
					<code>CONTRIBUTING.md</code>
				</a>{" "}
				for contribution guidelines.
			</p>
			<div className="stewardship-byline">
				<p className="stewardship-credit">
					<span className="stewardship-credit-label">Created and currently maintained by</span>{" "}
					<span className="stewardship-name">Jorge Rumoroso</span>
				</p>
				<p className="stewardship-role">
					Digital accessibility specialist with professional experience in accessibility
					auditing, standards, and governance.
				</p>
				<p className="stewardship-link">
					<a href="https://www.linkedin.com/in/jorgerumoroso/">LinkedIn profile</a>
				</p>
			</div>
		</section>
	);
}
