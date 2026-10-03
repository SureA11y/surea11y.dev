import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { ResultBadge } from "./design-system/results/ResultBadge.jsx";
import rules from "../data/rules.generated.json";

const core = "https://github.com/SureA11y/core/blob/main";

const packageRows = [
	{ id: "playwright", want: "Add accessibility checks to Playwright tests", install: <code>@surea11y/playwright</code> },
	{ id: "puppeteer", want: "…Puppeteer", install: <code>@surea11y/puppeteer</code> },
	{ id: "selenium", want: "…Selenium", install: <code>@surea11y/selenium</code> },
	{ id: "cypress", want: "…Cypress", install: <code>@surea11y/cypress</code> },
	{ id: "webdriverio", want: "…WebdriverIO", install: <code>@surea11y/webdriverio</code> },
	{ id: "cli", want: "Scan static HTML from a terminal or CI pipeline", install: <code>@surea11y/cli</code> },
	{ id: "test-matchers", want: "Assert accessibility in Jest/Vitest component or unit tests", install: <code>@surea11y/test-matchers</code> },
	{ id: "core", want: "Run the engine against a DOM you already have", install: <code>@surea11y/core</code> },
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
				command. Install the one that matches how you already test — each pulls in{" "}
				<code>@surea11y/core</code> for you:
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
				See <a href="/getting-started/">Getting Started</a> for install and usage per binding.
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

			<h3>Checked against the ACT corpus</h3>
			<p>
				The engine ships {rules.length} rules. Fifty-nine of them have a{" "}
				<a href="https://act-rules.github.io/">W3C ACT Rules</a> counterpart and run against
				ACT's own published test cases — 821 examples across those 59 rules. The engine fails
				none of the examples ACT marks passed or inapplicable, so it reports no false positives
				against that corpus. Thirty examples ACT marks failed go unflagged — mostly judgement
				calls, such as whether a heading describes the content under it — see{" "}
				<a href={`${core}/docs/ACT_RULE_MAPPING.md`}><code>ACT_RULE_MAPPING.md</code></a> for every
				one, with the reasoning.
			</p>
			<p>
				The <a href="https://surea11y.github.io/act-report/act-report.jsonld">
					EARL implementation report
				</a>{" "}
				records the outcome for every one of those cases, passes and inapplicable results
				included, so a rule that stayed silent because nothing applied is distinguishable from one
				that isn't implemented at all. See <a href="/results-reports/earl-report/">EARL report</a>{" "}
				for the format.
			</p>

			<h2>Key principles</h2>
			<ul>
				<li><strong>Deterministic execution.</strong> The same input always produces the same output.</li>
				<li><strong>Conservative by design.</strong> <code>fail</code> is reserved for objective, normative violations, minimizing false alarms.</li>
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
				These are the cases where the engine reports <code>cantTell</code>, and where a human
				reviewer's judgement remains necessary. See{" "}
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
