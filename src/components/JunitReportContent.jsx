import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const outcomeRows = [
	{
		id: "fail",
		outcome: <code>fail</code>,
		junit: (
			<>
				<code>&lt;failure type="fail"&gt;</code>, one line per failing occurrence (message, hint,
				selector, markup)
			</>
		),
		why: "The deterministic, gating case.",
	},
	{
		id: "cantTell",
		outcome: <code>cantTell</code>,
		junit: (
			<>
				<code>&lt;skipped&gt;</code> saying how many occurrences need manual review
			</>
		),
		why: (
			<>
				JUnit has no "could not tell". Skipped surfaces it without turning a build red, the same
				line <a href="/results-reports/sarif-report/">SARIF</a> draws with <code>warning</code>.
			</>
		),
	},
	{ id: "pass", outcome: <code>pass</code>, junit: <>a bare <code>&lt;testcase&gt;</code></>, why: "" },
	{
		id: "notApplicable",
		outcome: <code>notApplicable</code>,
		junit: "left out",
		why: (
			<>
				A page has hundreds; none says anything. <code>includeNotApplicable: true</code> adds them
				as <code>&lt;skipped message="Not applicable"&gt;</code>.
			</>
		),
	},
];

const optionRows = [
	{
		id: "cantTellAs",
		option: <code>cantTellAs</code>,
		default: <code>'skipped'</code>,
		effect: (
			<>
				<code>'failure'</code> reports <code>cantTell</code> rules as{" "}
				<code>&lt;failure type="cantTell"&gt;</code>, for a pipeline that must not pass while
				anything is undecided.
			</>
		),
	},
	{
		id: "includeNotApplicable",
		option: <code>includeNotApplicable</code>,
		default: <code>false</code>,
		effect: <>Include <code>notApplicable</code> rules as skipped tests.</>,
	},
	{
		id: "baselineEntries",
		option: <code>baselineEntries</code>,
		default: "none",
		effect: (
			<>
				Entries from <a href="/conformance/baseline/">the baseline</a>'s{" "}
				<code>buildBaselineEntries()</code>. Fail occurrences recorded there are dropped, exactly
				as in SARIF. A rule whose every failure is already known is{" "}
				<code>&lt;skipped message="N known failures recorded in the baseline"&gt;</code>, not
				passing: it did not pass.
			</>
		),
	},
	{
		id: "name",
		option: <code>name</code>,
		default: <code>'surea11y'</code>,
		effect: (
			<>
				The <code>name</code> of the root <code>&lt;testsuites&gt;</code>, for telling several
				pages' reports apart in one dashboard.
			</>
		),
	},
];

export function JunitReportContent() {
	return (
		<>
			<p>
				<code>@surea11y/core/junit</code> renders a scan result as JUnit XML, the test report
				format CI dashboards read natively: GitLab's merge request test widget, Azure DevOps' Tests
				tab, Jenkins and CircleCI.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { renderJunitReport } = require('@surea11y/core/junit');",
					"const { runDomRulesInPage } = require('@surea11y/core');",
					"",
					"const result = runDomRulesInPage(url, null, { profile: 'wcag22-aa' }, null);",
					"require('fs').writeFileSync('surea11y.junit.xml', renderJunitReport(result));",
				]}
			/>
			<p>
				<code>renderJunitReport(result, options)</code> is a pure function: it returns the XML as a
				string and never touches the filesystem. It works just as well on a result saved as JSON
				earlier, such as the output of <code>surea11y scan &lt;target&gt; --json</code> from{" "}
				<a href="https://github.com/SureA11y/cli#readme">
					<code>@surea11y/cli</code>
				</a>
				. See <a href="/configuration/ci-integration/#junit-test-reports">CI integration</a> for
				GitLab and Azure DevOps recipes.
			</p>

			<h2>Shape</h2>
			<p>
				One <code>&lt;testsuite&gt;</code> per WCAG Success Criterion, one{" "}
				<code>&lt;testcase&gt;</code> per rule mapped to it:
			</p>
			<CodeBlock
				lang="html"
				lines={[
					'<testsuites name="surea11y" tests="14" failures="2" errors="0" skipped="4" time="0">',
					'  <testsuite name="WCAG 1.1.1 Non-text content: text alternatives" tests="1" failures="1" errors="0" skipped="0" time="0">',
					"    <properties>",
					'      <property name="wcagCriterion" value="1.1.1"/>',
					'      <property name="wcagLevel" value="A"/>',
					'      <property name="en301549" value="9.1.1.1"/>',
					'      <property name="criterionOutcome" value="fail"/>',
					'      <property name="engine" value="a11ycore"/>',
					'      <property name="schemaVersion" value="1.0.0"/>',
					'      <property name="wcagVersion" value="2.2"/>',
					'      <property name="profile" value="wcag22-aa"/>',
					'      <property name="locale" value="en"/>',
					'      <property name="url" value="https://example.test/"/>',
					"    </properties>",
					'    <testcase classname="wcag-1.1.1" name="img-alt-present" time="0">',
					'      <failure type="fail" message="1 failing occurrence: Missing alt attribute on &lt;img&gt;.">- Missing alt attribute on &lt;img&gt;. Add an alt attribute (use alt=&quot;&quot; only for decorative images).',
					"  selector: html &gt; body &gt; main &gt; img",
					"  html: &lt;img src=&quot;a.png&quot;&gt;</failure>",
					"    </testcase>",
					"  </testsuite>",
					"</testsuites>",
				]}
			/>
			<ul>
				<li>
					<strong>Suites follow the criterion</strong>, because that is what people track, and{" "}
					<strong>testcases follow the rule</strong> rather than the occurrence, so a defect
					repeated forty times on a page is one failing test whose body lists all forty, and test
					counts stay stable between runs.
				</li>
				<li>
					Suites come from each rule's own WCAG mappings, not from the composites, so every rule
					that ran is reported even when composites were excluded. The composite, when it ran,
					supplies the suite's title and the <code>criterionOutcome</code> property. A rule mapped
					to two criteria appears in both suites. A rule mapped to no criterion goes into a final{" "}
					<code>Other checks</code> suite with <code>classname="other"</code>.
				</li>
				<li>
					The run's <code>engine</code>, <code>schemaVersion</code>, <code>wcagVersion</code>,{" "}
					<code>profile</code>, <code>optInRules</code>, <code>locale</code> and <code>url</code>{" "}
					are repeated as properties on every suite, each only when the result has it.
				</li>
				<li>
					Suites are ordered by criterion, numerically (1.4.3 before 1.4.10), and testcases by rule
					id.
				</li>
				<li>
					<code>en301549</code> properties name the EN 301 549 clause that restates the criterion,
					where there is one and the scan asked for EN 301 549 clauses (see{" "}
					<a href="/conformance/wcag-mapping/#en-301-549">EN 301 549</a>).
				</li>
			</ul>

			<h2>Outcomes</h2>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "outcome", label: "Rule outcome", width: "18%" },
					{ key: "junit", label: "JUnit", wrap: true },
					{ key: "why", label: "Why", wrap: true },
				]}
				rows={outcomeRows}
			/>
			<p>
				A <code>fail</code> rule that also has <code>cantTell</code> occurrences reports the
				failures in <code>&lt;failure&gt;</code> and the undecided ones in{" "}
				<code>&lt;system-out&gt;</code>, where dashboards show test output. A skipped{" "}
				<code>cantTell</code> rule does the same.
			</p>

			<h2>Options</h2>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "option", label: "Option", width: "22%" },
					{ key: "default", label: "Default", width: "14%" },
					{ key: "effect", label: "Effect", wrap: true },
				]}
				rows={optionRows}
			/>

			<h2>Determinism</h2>
			<p>
				The engine has no clock, and this report does not invent one: every <code>time</code> is{" "}
				<code>"0"</code>, and a <code>timestamp</code> attribute appears on each suite only when
				the result carries one (<code>engineOptions.timestamp</code>). The same scan always renders
				byte-identical XML, so a report can be committed or diffed.
			</p>
			<p>
				Text is escaped for XML, and characters XML 1.0 forbids even when escaped (most control
				characters, lone surrogates) are dropped, since markup captured from a page can contain
				them.
			</p>
		</>
	);
}
