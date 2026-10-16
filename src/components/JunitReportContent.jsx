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
				selector, markup), then <code>help: &lt;url&gt;</code> when the rule has an{" "}
				<code>http(s)</code> help link (<code>meta.helpUrl</code>), or else its first WCAG
				criterion's Understanding document
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
	{
		id: "ruleError",
		outcome: <>a rule that did not complete (<code>cantTell</code> with no occurrences and an <code>error</code>: it threw)</>,
		junit: <><code>&lt;error type="ruleError"&gt;</code> with the error, counted in <code>errors</code></>,
		why: "JUnit's element for a test that could not run. The page was not checked against the rule, which is neither a pass nor something to review.",
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
				anything is undecided. Read in any case; another value throws a <code>TypeError</code>,
				as a misspelt one would quietly not gate.
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
				as in SARIF. It takes the baseline file as saved (<code>JSON.parse</code> of it) or its{" "}
				<code>entries</code> list. A rule whose every failure is already known is{" "}
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
				. From the command line there is no need to call it:{" "}
				<code>surea11y scan &lt;target&gt; --junit a11y.junit.xml</code> (CLI 1.1.0 or later)
				writes the report itself, with the default options plus the <code>baselineEntries</code>{" "}
				of its <code>--baseline</code> file. See{" "}
				<a href="/configuration/ci-integration/#junit-test-reports">CI integration</a> for GitLab
				and Azure DevOps recipes.
			</p>

			<h2>Shape</h2>
			<p>
				One <code>&lt;testsuite&gt;</code> per WCAG Success Criterion, one{" "}
				<code>&lt;testcase&gt;</code> per rule mapped to it. Scanning this page with the call
				above:
			</p>
			<CodeBlock
				lang="html"
				lines={[
					"<!doctype html>",
					'<html lang="en">',
					"<head><title>Home</title></head>",
					'<body><main><h1>Welcome</h1><img src="a.png"></main></body>',
					"</html>",
				]}
			/>
			<p>gives:</p>
			<CodeBlock
				lang="html"
				lines={[
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<testsuites name="surea11y" tests="13" failures="1" errors="0" skipped="5" time="0">',
					'  <testsuite name="WCAG 1.1.1" tests="1" failures="1" errors="0" skipped="0" time="0">',
					"    <properties>",
					'      <property name="wcagCriterion" value="1.1.1"/>',
					'      <property name="title" value="Non-text content: text alternatives"/>',
					'      <property name="wcagLevel" value="A"/>',
					'      <property name="criterionOutcome" value="fail"/>',
					'      <property name="engine" value="a11ycore"/>',
					'      <property name="schemaVersion" value="1.0.0"/>',
					'      <property name="wcagVersion" value="2.2"/>',
					'      <property name="profile" value="wcag22-aa"/>',
					'      <property name="layout" value="false"/>',
					'      <property name="locale" value="en"/>',
					'      <property name="url" value="https://example.test/"/>',
					"    </properties>",
					'    <testcase classname="wcag-1.1.1" name="img-alt-present" time="0">',
					'      <failure type="fail" message="1 failing occurrence: This &lt;img&gt; has no alt attribute.">- This &lt;img&gt; has no alt attribute. Add an alt attribute that says what the image shows, or alt=&quot;&quot; if the image is purely decorative.',
					"  selector: html &gt; body &gt; main &gt; img",
					"  html: &lt;img src=&quot;a.png&quot;&gt;",
					"help: https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html</failure>",
					"    </testcase>",
					"  </testsuite>",
					"  <!-- 10 more suites trimmed: 12 tests, 5 of them skipped (manual review) -->",
					"</testsuites>",
				]}
			/>
			<ul>
				<li>
					<strong>A green suite named for a criterion</strong> means the rules that ran for it
					reported no failure. It doesn't mean the criterion was fully checked, or met: most
					criteria have parts no rule covers (see{" "}
					<a href="/conformance/wcag-mapping/">WCAG mapping</a>).
				</li>
				<li>
					<strong>Suites follow the criterion</strong>, because that is what people track, and{" "}
					<strong>testcases follow the rule</strong> rather than the occurrence, so a defect
					repeated forty times on a page is one failing test whose body lists all forty, and test
					counts stay stable between runs.
				</li>
				<li id="names-in-every-locale">
					<strong>Names are the same in every locale.</strong> A suite is named{" "}
					<code>WCAG &lt;criterion&gt;</code> (<code>WCAG 1.4.3</code>), the suite of rules mapped to
					no criterion <code>Other checks</code>, a testcase by its rule id, and its{" "}
					<code>classname</code> is <code>wcag-&lt;criterion&gt;</code> or <code>other</code>,
					whatever <code>engineOptions.locale</code> the scan ran in. CI test history (GitLab,
					Jenkins, GitHub test reporters) is keyed on these names, so a scan read in French gives the
					same tests as one read in English. The criterion's title, which is translated, is the
					suite's <code>title</code> property (<code>Contrast: minimum</code>,{" "}
					<code>Contraste (minimum)</code>). The findings' own text (each occurrence's message and
					hint) is in the scan's locale; the words the report adds around it are English in every
					locale: the count that starts a <code>message</code> (
					<code>1 failing occurrence: Cet élément &lt;img&gt; n’a pas d’attribut alt.</code>), the{" "}
					<code>selector:</code>, <code>html:</code> and <code>help:</code> labels, and the{" "}
					<code>&lt;skipped&gt;</code> messages.{" "}
					<strong>Before core 1.12, a suite's name carried the criterion's title</strong> (
					<code>WCAG 1.1.1 Non-text content: text alternatives</code>), so the first report after
					upgrading shows every test once as new in a dashboard that tracked the old names, and
					their history starts again from there.
				</li>
				<li>
					Suites come from each rule's own WCAG mappings, not from the composites, so every rule
					that ran is reported even when composites were excluded. The composite, when it ran,
					supplies the suite's <code>title</code> property and the <code>criterionOutcome</code>{" "}
					property, which counts the
					custom rules mapped to the criterion as it counts the built-in ones. A criterion checked
					by several composites (4.1.2: its accessible name and its ARIA validity) takes the worst
					of their outcomes, since one part failing fails the criterion, and the title their titles
					share (<code>Name, role, value</code>).
					A rule mapped
					to two criteria appears in both suites. A rule mapped to no criterion goes into a final{" "}
					<code>Other checks</code> suite with <code>classname="other"</code>.
				</li>
				<li>
					<strong>Suites follow the scan's WCAG level and version.</strong> A criterion the scan
					left out of <code>rulesResults</code> because of them gets no suite: an AAA criterion
					under <code>engineOptions.wcagLevel: 'AA'</code> (<code>engine.wcagLevel</code>), or 4.1.1
					Parsing when <code>{"includeRuleIds: ['duplicate-id']"}</code> ran under WCAG 2.2 (
					<code>engine.wcagVersion</code>), which removed it. A criterion the scan does report is
					kept, such as a rollup named by id above the level, a{" "}
					<a href="/results-reports/output-schema/#partly-checked">partly checked</a> one, or 4.1.1
					in a 2.2 scan that selected it. A rule mapped only to criteria left out goes into{" "}
					<code>Other checks</code>, and its failures are{" "}
					<code>
						&lt;skipped message="Not counted: WCAG 1.4.6 is outside the scan's target, WCAG 2.2
						AA; 1 failing occurrence"&gt;
					</code>
					, with the occurrences in <code>&lt;system-out&gt;</code>: the rule ran and failed, which
					the report shows, but an AA build does not fail on an AAA criterion. A rule that did not
					complete is still an <code>&lt;error&gt;</code>. A level the selection gives (
					<code>runOnly.wcag.level</code>, or level tags) is recorded as{" "}
					<code>engine.wcagLevel</code> too, and gates the suites the same way. A result that
					records neither <code>engine.wcagLevel</code> nor <code>engine.wcagVersion</code>, as an
					older engine's, keeps every criterion.
				</li>
				<li>
					The run's <code>engine</code>, <code>schemaVersion</code>, <code>wcagVersion</code>,{" "}
					<code>profile</code>, <code>optInRules</code>, the rendering conditions from{" "}
					<a href="/results-reports/output-schema/">
						<code>engine.environment</code>
					</a>{" "}
					(<code>layout</code>, and in a browser <code>viewport</code> as <code>1280x720</code>,{" "}
					<code>devicePixelRatio</code>, <code>colorScheme</code>, <code>forcedColors</code> and{" "}
					<code>fonts</code>),{" "}
					<code>locale</code> and <code>url</code> are repeated as properties on every suite, each
					only when the result has it. A failure that comes and goes with the viewport width can be
					traced to the width the run used. The example above is a jsdom scan, which has no layout.
				</li>
				<li>
					A page scanned at several viewport widths gives the same suite and test names at each
					width, and a CI test view may merge them. Write one file per width, and name or group the
					files by width in the CI's report settings; the <code>viewport</code> property records
					which width a file describes.
				</li>
				<li>
					Suites are ordered by criterion, numerically (1.4.3 before 1.4.10), and testcases by rule
					id.
				</li>
				<li>
					<code>en301549</code> properties name the EN 301 549 clause that restates the criterion,
					where there is one and the scan asked for EN 301 549 clauses (see{" "}
					<a href="/conformance/wcag-mapping/#en-301-549">EN 301 549</a>). Each other standard
					listed in the result's <code>standards</code> adds properties named by its key, one per
					requirement of it that the suite's rules map to: a{" "}
					<a href="/configuration/packs/">pack</a>'s checklist item that groups the rule is listed
					by its id, <code>&lt;property name="acme" value="acme-images"/&gt;</code>. A standard
					that only a custom rule names adds no property.
				</li>
			</ul>
			<p>
				A compact result (<code>engineOptions.output.detail: 'findings'</code>) is read as the full
				result it stands for, so it is reported the same.
			</p>

			<h2 id="cross-frame-results">Cross-frame results</h2>
			<p>
				A cross-frame result (see{" "}
				<a href="/results-reports/output-schema/#cross-frame-result">Output schema</a>) gives the
				page's suites first, then each frame's, named for the frame's path (
				<code>Frame #checkout: WCAG 1.1.1</code>, the same in every locale) and with a{" "}
				<code>frame</code> property holding it, and their testcases' <code>classname</code> starts
				with it (<code>frame #checkout wcag-1.1.1</code>), so a failure in a frame is not merged
				with the page's, by a CI that keys tests on suite names or on <code>classname</code> and{" "}
				<code>name</code>. A frame that did not answer is a suite <code>Frame &lt;path&gt;</code> with one
				skipped testcase, <code>Not scanned: &lt;error&gt;</code>: the frame was not checked, which
				is not a pass. The totals on <code>&lt;testsuites&gt;</code> count every frame.
			</p>

			<h2 id="outcomes">Outcomes</h2>
			<DataTable
				label="Rule outcomes in JUnit"
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
			<p>
				The <code>selector:</code> line of an element inside a shadow tree names the shadow hosts
				first, then the element, joined with <code>{" >>> "}</code>:{" "}
				<code>{"html > body > main > x-card >>> button"}</code>. It is the same location{" "}
				<a href="/results-reports/sarif-report/#field-mapping">SARIF</a> and the{" "}
				<a href="/results-reports/html-report/">HTML report</a> give.
			</p>

			<h2>Options</h2>
			<DataTable
				label="JUnit report options"
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
