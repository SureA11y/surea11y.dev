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
	{ id: "cli", want: "Scan static HTML from a terminal or CI pipeline", install: <code>@surea11y/cli</code> },
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
				A <code>pass</code> also says how close it came. Rules that measure against a threshold —
				contrast, target size, text spacing — report a <code>margin</code>: the element that came
				closest to the limit while still meeting it. Text at 4.52:1 against a 4.5:1 minimum passes,
				and the margin shows it, so you can fix it before a small change turns it into a{" "}
				<code>fail</code>. See the <a href="/results-reports/output-schema/#margin">Output schema</a>.
			</p>
			<p>
				Name the standard, and the engine picks the rules.{" "}
				<code>{"{ wcag: { version: '2.2', level: 'AA' } }"}</code> runs the rules for WCAG 2.2's A
				and AA criteria, by the level each criterion has in that version, and{" "}
				<code>bestPractices: true</code> adds the checks WCAG doesn't require. A standard beyond
				WCAG, such as a national one or your organisation's own policy, comes as a pack: its rules,
				profiles and checklist items run beside core's and show in every report. See{" "}
				<a href="/configuration/engine-options/#selecting-which-rules-run">Engine options</a> and{" "}
				<a href="/configuration/packs/">Packs</a>.
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
				In a browser, contrast is measured as the page is drawn: text on a page with no background
				of its own, on the canvas the browser paints, light or dark; generated text from{" "}
				<code>::before</code>, <code>::after</code> and list markers; a closed{" "}
				<code>&lt;select&gt;</code>; and text drawn only by an outline. These used to be skipped or
				asked about. A lone character standing in for a control's name, the "X" in a button named
				"Close", is asked about rather than failed: whether it's an icon or a letter takes a person.
			</p>

			<h3 id="checked-against-the-act-corpus">Checked against the ACT corpus</h3>
			<p>
				The engine ships {rules.length} rules. Fifty-nine of them have a{" "}
				<a href="https://www.w3.org/WAI/standards-guidelines/act/rules/">W3C ACT Rules</a>{" "}
				counterpart and run against the test cases W3C publishes for them, the set W3C's own
				implementation listing scores: 942 examples across those 59 rules. The engine fails none of
				the examples ACT marks passed or inapplicable, so it reports no false positives against
				that corpus. That is a result on those examples, not a guarantee for every page; where the
				engine can't decide a case, it returns <code>cantTell</code>, which ACT permits for an
				automated implementation.
			</p>
			<p>
				It holds in both places the engine runs: in jsdom, as test-matchers and the CLI run it, and
				in Chromium, as the browser bindings do, with each test case loaded as a real page, its
				scripts and linked style sheets included. Twenty-five examples ACT marks failed go
				unflagged in jsdom and 21 in Chromium. Most are judgement calls, such as whether a heading
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
				<li>confirm that alt text is <em>meaningful</em>, only that it is present (an alt attribute of <code>"image123.png"</code> passes the objective check);</li>
				<li>judge whether a color contrast choice is aesthetically appropriate, only whether it meets the applicable contrast ratio;</li>
				<li>determine whether an error message actually <em>explains</em> the problem, since that depends on validation logic a static scan can't see;</li>
				<li>detect a keyboard focus trap or content clipped at 400% zoom, since both require simulating real user interaction over time, not just reading the DOM at one instant.</li>
			</ul>
			<p>
				Some implemented checks report <code>cantTell</code> when a person has to decide. Other
				aspects, including keyboard traps and reflow at zoom, are not checked by the engine at all
				and need separate testing: no <code>cantTell</code> stands in for them, so a result without
				one doesn't mean they were covered. See{" "}
				<a href="/help/known-limitations/">Known limitations</a> for the complete list.
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
