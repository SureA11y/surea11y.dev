import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const toolRows = [
	{ id: "keyboard", tool: <code>keyboard</code>, what: "A keyboard" },
	{ id: "pointer", tool: <code>pointer</code>, what: "A mouse or other pointer" },
	{ id: "screen-reader", tool: <code>screen-reader</code>, what: "A screen reader" },
	{ id: "zoom", tool: <code>zoom</code>, what: "The browser's zoom" },
	{ id: "contrast-theme", tool: <code>contrast-theme</code>, what: "A high-contrast theme (forced colors)" },
	{ id: "devtools", tool: <code>devtools</code>, what: "The browser's developer tools" },
];

const functionRows = [
	{ id: "proceduresFor", fn: <code>proceduresFor(requirement, options)</code>, what: <>One requirement: a WCAG criterion (<code>'1.4.12'</code>), <code>'best-practice'</code>, or a pack's requirement.</> },
	{ id: "listProcedures", fn: <code>listProcedures(options)</code>, what: "Every requirement of a standard, in its order, with the groups it puts them in (WCAG's principles and guidelines)." },
	{ id: "procedureChecklist", fn: <code>procedureChecklist(options)</code>, what: "What a person does to assess the standard, once each: an item per general procedure." },
	{ id: "renderProcedures", fn: <code>renderProcedures(input, options)</code>, what: "Any of the three as a self-contained HTML page, or Markdown." },
	{ id: "relatedRequirements", fn: <code>relatedRequirements(requirement, options)</code>, what: "Between WCAG and a pack's standard: the requirements that restate or relate to a criterion, and the reverse." },
	{ id: "procedureLanguages", fn: <code>procedureLanguages(options)</code>, what: "The languages a standard's procedures can be read in, each complete or not, for a language picker." },
];

const listOptionRows = [
	{ id: "standard", option: <code>standard</code>, what: <><code>'wcag'</code> (the default), <code>'best-practice'</code>, or a pack's standard by key or name.</> },
	{ id: "version", option: <code>version</code>, what: <>WCAG's (<code>'2.0'</code>, <code>'2.1'</code>, <code>'2.2'</code>, the default), or the pack's standard's.</> },
	{ id: "levels", option: <code>levels</code>, what: <>WCAG only: <code>'A'</code>, <code>'AA'</code>, <code>'AAA'</code> or a list of them; every level by default.</> },
	{ id: "locale", option: <code>locale</code>, what: <>A tag (<code>'fr-CA'</code> reads <code>fr-ca</code>, then <code>fr</code>) or a list, most wanted first; English for any text a locale lacks.</> },
	{ id: "tools", option: <code>tools</code>, what: <>Only facets whose procedure needs one of these tools (<code>'screen-reader'</code>).</> },
	{ id: "automation", option: <code>automation</code>, what: <>Only facets rules decide in full, in part or not at all: <code>['manual', 'partial']</code> is what a scan leaves to a person.</> },
	{ id: "rules", option: <code>rules</code>, what: <>Only facets one of these rules claims (<code>'img-alt-present'</code>).</> },
	{ id: "packs", option: <code>packs</code>, what: "The packs whose standard or rules to read." },
];

const renderOptionRows = [
	{ id: "format", option: <code>format</code>, what: <><code>'html'</code> (the default) or <code>'markdown'</code>.</> },
	{ id: "locale", option: <code>locale</code>, what: "The language of the page's own words; by default, the one the procedures were read in." },
	{ id: "title", option: <code>title</code>, what: <>The page's title and heading; by default one naming the standard (“WCAG 2.2: manual checklist”).</> },
	{ id: "variants", option: <code>variants</code>, what: <><code>true</code> adds, under each facet of a list, the steps a scan's undecided finding gives for it, in a closed disclosure.</> },
	{ id: "record", option: <code>record</code>, what: <><code>false</code> leaves out a checklist page's results and its script.</> },
	{ id: "before", option: <code>before</code>, what: <><code>false</code> leaves out “Before you start”, the habits that make a result reliable.</> },
	{ id: "fragment", option: <code>fragment</code>, what: <><code>true</code> gives the content alone, with no document, style or script, to put in a page of your own.</> },
	{ id: "packs", option: <code>packs</code>, what: "The packs the procedures were read with." },
];

export function ProceduresContent() {
	return (
		<>
			<p>
				A scan decides what rules can decide. The rest of an assessment is a person's: the
				questions a scan leaves open (<code>cantTell</code>), and the parts of a criterion no rule
				tests at all. Since <code>@surea11y/core</code> 1.15.0, core says how to do that part too:
				a <strong>test procedure</strong> for every facet of each WCAG criterion its rules
				evaluate, and of the best practices, with the steps, the tools it needs, and what passes
				and what fails, in English, French, German, Spanish and Japanese. It is the same text a
				finding's <a href="/results-reports/output-schema/#how-to-check">“How to check”</a> comes
				from, so a team's manual checks and its scans read the same.
			</p>
			<p>
				Use them with no scan at all, for a manual audit; next to a scan, for what it leaves to a
				person; or to explain a criterion whose rules found nothing but don't cover all of it. Like
				the steps of a finding, procedures are guidance, not part of a finding's identity: their
				wording may improve in any release.
			</p>

			<h2 id="see-them">See them</h2>
			<p>
				These two pages are core's own output for WCAG 2.2 Level A and AA, regenerated with each
				release this site follows, and open from disk with nothing loaded from elsewhere:
			</p>
			<ul>
				<li>
					<a href="/procedures/wcag-22-aa.html">The reference</a>: how to assess every criterion,
					facet by facet, under WCAG's principles and guidelines.
				</li>
				<li>
					<a href="/procedures/wcag-22-aa-checklist.html">The worksheet</a>: each check once, with
					a result (<em>Not checked</em>, <em>Passes</em>, <em>Fails</em>, <em>Does not apply</em>)
					and notes to record, kept in your browser and downloadable as JSON or CSV.
				</li>
			</ul>
			<p>
				Both pages are held to core's own rules, in jsdom and in Chromium, in light and dark mode,
				at the WCAG 2.2 AA profile: a skip link, one heading level at a time, labelled regions,
				real lists and fieldsets, visible focus, nothing in color alone, a forced-colors theme
				followed, a phone's width, and a printable layout.
			</p>

			<h2 id="what-a-procedure-is">What a procedure is</h2>
			<p>
				A criterion has <strong>facets</strong>, the test objectives a person checks to assess it.
				A facet a rule decides is <code>full</code>, one rules decide part of is{" "}
				<code>partial</code>, and one only a person can judge is <code>manual</code>. A facet has a{" "}
				<strong>general procedure</strong>: steps a person follows on a whole page, in a browser
				with its developer tools, a keyboard and, where it matters, a screen reader; then what they
				see if it passes and if it fails, naming the criterion it fails; and the{" "}
				<strong>tools</strong> it needs besides a browser:
			</p>
			<DataTable
				label="Tools a procedure may need"
				rowKey="id"
				columns={[
					{ key: "tool", label: "Tool", width: "30%" },
					{ key: "what", label: "What it is", wrap: true },
				]}
				rows={toolRows}
			/>
			<ul>
				<li>
					A <strong>technology facet</strong> is one test a rule makes on one kind of element (an{" "}
					<code>&lt;img&gt;</code> has an <code>alt</code> attribute). It has no procedure of its
					own: <code>coveredBy</code> names the broader facet whose procedure assesses it, so a
					checklist lists what a person does, once.
				</li>
				<li>
					A <strong>variant</strong> is the narrower question one rule asks about one element: the
					steps its undecided finding shows as <code>howToCheck</code>. A finding always shows its
					variant, never the general text, and the two never contradict each other. Every reason
					code a core rule can report as <code>cantTell</code> is under exactly one facet.
				</li>
				<li>
					What no criterion requires is kept apart, under <code>best-practice</code>, so a
					criterion's procedures never present advice as a failure.
				</li>
			</ul>

			<h2 id="which-criteria-have-procedures">Which criteria have procedures</h2>
			<p>
				Every criterion a core rule evaluates, in full, in part or as <code>cantTell</code>, has a
				procedure for every facet, the facets no rule checks included, since a person needs them
				to finish what the scan began: 36 of the 87 criteria of WCAG 2.2 at levels A, AA and AAA
				and 4.1.1 (removed in 2.2), with 170 facets, 56 procedures of their own and 114 technology
				facets covered by one of them. Such a criterion is <code>complete</code>. The other 51
				criteria, which no rule evaluates (1.2.3 Audio Description or Media Alternative, say), are
				listed with their facets and no procedure: how to assess those by hand is outside core.
				The best practices have one for each of their 13 facets: landmarks, content in landmarks,
				headings, table markup, ARIA roles, focus order, access keys, skip links, names and labels,
				zoom, repeated names, new windows and downloads, and reduced motion.
			</p>

			<h2 id="reading-them">Reading them</h2>
			<DataTable
				label="Functions for procedures"
				rowKey="id"
				columns={[
					{ key: "fn", label: "Function", width: "38%", wrap: true },
					{ key: "what", label: "What it gives", wrap: true },
				]}
				rows={functionRows}
			/>
			<p>
				In Node they come from <code>@surea11y/core</code>, which reads the dictionaries from
				disk. Code that runs in a browser imports the same from{" "}
				<code>@surea11y/core/procedures</code>, with a <code>From</code> suffix (
				<code>proceduresFrom</code>, <code>listProceduresFrom</code>,{" "}
				<code>procedureChecklistFrom</code>, <code>renderProceduresFrom</code>,{" "}
				<code>procedureLanguagesFrom</code>), and passes the dictionaries it imports as{" "}
				<code>{"@surea11y/core/procedures/<locale>"}</code>: it needs no file system and reaches none
				of the rules.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { proceduresFor } = require('@surea11y/core');",
					"",
					"proceduresFor('1.4.12', { locale: 'fr' });",
					"// { standard: 'wcag', id: '1.4.12', title: 'Espacement du texte', level: 'AA', complete: true,",
					"//   rules: ['avoid-inline-spacing', 'text-spacing-content-loss'], facets: [ … ] }",
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"import { proceduresFrom } from '@surea11y/core/procedures';",
					"import en from '@surea11y/core/procedures/en';",
					"import fr from '@surea11y/core/procedures/fr';",
					"",
					"proceduresFrom({ en, fr }, '1.4.12', { locale: 'fr' });",
				]}
			/>
			<p>
				Each facet carries its <code>label</code>, <code>automation</code>, the{" "}
				<code>rules</code> that claim it, its <code>tools</code>, its <code>procedure</code> (
				<code>{"{ steps, passWhen, failWhen }"}</code>, or <code>null</code> for a technology facet,
				with <code>coveredBy</code>) and its <code>variants</code>, each exactly the{" "}
				<code>howToCheck</code> of that rule's finding for that code. A text in another language
				than the one read (an earlier WCAG's own title, such as 2.1's “Parsing” for 4.1.1, or a
				text a locale lacks) says which, so a tool can mark it with <code>lang</code>, as WCAG 3.1.2
				asks. Core's{" "}
				<a href={`${core}/docs/PROCEDURES.md#the-shape`}><code>PROCEDURES.md</code></a> on GitHub
				has the whole shape.
			</p>

			<h2 id="listing-them">Listing them</h2>
			<CodeBlock
				lang="js"
				lines={[
					"const { listProcedures } = require('@surea11y/core');",
					"",
					"listProcedures();                                         // WCAG 2.2, every level",
					"listProcedures({ version: '2.1', levels: ['A', 'AA'] });  // WCAG 2.1 A and AA",
					"listProcedures({ standard: 'best-practice' });",
					"listProcedures({ levels: ['A', 'AA'], automation: ['manual', 'partial'] }); // what a scan leaves",
				]}
			/>
			<DataTable
				label="Options of listProcedures and procedureChecklist"
				rowKey="id"
				columns={[
					{ key: "option", label: "Option", width: "22%" },
					{ key: "what", label: "What it does", wrap: true },
				]}
				rows={listOptionRows}
			/>
			<p>
				WCAG's criteria are those the version has, at its levels: 2.0 and 2.1 list 4.1.1 as a
				Level A criterion titled “Parsing”, 2.2 doesn't. Given several filters, a facet must match
				each; a requirement's <code>complete</code> stays its own.
			</p>

			<h2 id="a-checklist">A checklist</h2>
			<p>
				<code>procedureChecklist</code> takes the same options and gives what a person does to
				assess the standard, once each: an item per general procedure, with the technology facets
				it also assesses in <code>covers</code>, and the rules behind it in <code>rules</code>.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { procedureChecklist } = require('@surea11y/core');",
					"",
					"procedureChecklist({ levels: ['A', 'AA'] }).items[0];",
					"// {",
					"//   key: '1.1.1/text-alternative-mechanism',",
					"//   label: 'Non-text content that conveys something has a text alternative',",
					"//   automation: 'partial',",
					"//   wcag: '1.1.1',",
					"//   requirements: ['1.1.1'],",
					"//   covers: ['img-alt-attr-present', 'role-img-text-alternative-present', …],",
					"//   rules: ['img-alt-present', …],",
					"//   tools: [{ id: 'devtools', label: \"The browser's developer tools\" }],",
					"//   procedure: { steps: ['…'], passWhen: '…', failWhen: '… which fails WCAG 1.1.1.' }",
					"// }",
				]}
			/>

			<h2 id="rendering-them">Pages and worksheets</h2>
			<p>
				<code>renderProcedures</code> turns what <code>listProcedures</code>,{" "}
				<code>procedureChecklist</code> or <code>proceduresFor</code> gives into a document a person
				reads or works through: one self-contained HTML page, which opens from disk with no server,
				network, font or script from elsewhere, or Markdown. The same input and options always
				give the same page.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { listProcedures, procedureChecklist, renderProcedures } = require('@surea11y/core');",
					"const fs = require('node:fs');",
					"",
					"// A reference: how to assess every WCAG 2.2 A and AA criterion.",
					"fs.writeFileSync('wcag-22-aa.html', renderProcedures(listProcedures({ levels: ['A', 'AA'] })));",
					"",
					"// A worksheet: each check once, with a result and notes to record.",
					"fs.writeFileSync('wcag-22-aa-checklist.html', renderProcedures(procedureChecklist({ levels: ['A', 'AA'] })));",
					"",
					"// The same in Markdown, for a repository or a wiki.",
					"fs.writeFileSync('wcag-22-aa.md', renderProcedures(listProcedures({ levels: ['A', 'AA'] }), { format: 'markdown' }));",
				]}
			/>
			<DataTable
				label="Options of renderProcedures"
				rowKey="id"
				columns={[
					{ key: "option", label: "Option", width: "22%" },
					{ key: "what", label: "What it does", wrap: true },
				]}
				rows={renderOptionRows}
			/>
			<p>
				<strong>A list's page</strong> is a reference for the standard: its title and scope, what
				its results mean (the best practices count against no conformance, Level AAA is advisory),
				“Before you start”, a table of contents, and each requirement with its facets: what each
				checks, how much of it rules decide, the tools, the steps, what passes and what fails, and
				the rules that test it.
			</p>
			<p>
				<strong>A checklist's page</strong> is a worksheet. Under each item a person records a
				result and notes; the page counts the results in a status message a screen reader
				announces, keeps them in the browser (<code>localStorage</code>, keyed by the standard,
				version and title), and downloads them as JSON, with each requirement's result rolled up
				from its items, or as CSV, which a spreadsheet opens with its accents. A requirement fails
				where one of its items fails, is <code>open</code> where one is not checked yet, is{" "}
				<code>notApplicable</code> where none applies, and passes otherwise.
			</p>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					'  "title": "WCAG 2.2: manual checklist",',
					'  "standard": "wcag",',
					'  "version": "2.2",',
					'  "items": [',
					"    {",
					'      "key": "1.1.1/text-alternative-mechanism",',
					'      "requirements": ["1.1.1"],',
					'      "outcome": "fail",',
					'      "notes": "The logo has no alt."',
					"    }",
					"  ],",
					'  "requirements": [{ "id": "1.1.1", "outcome": "fail" }]',
					"}",
				]}
			/>
			<p>
				A page's own words are in every language core ships, and so are the procedures, the facets'
				labels and WCAG's principles, guidelines and criteria, the names as each language's
				published translation of WCAG gives them. What is in another language than the page's is
				marked with it, so a screen reader reads each part in its language.{" "}
				<code>fragment: true</code> gives the content alone, in a{" "}
				<code>{'<div class="surea11y-procedures">'}</code> with its headings from <code>h1</code>,
				for a documentation site that brings its own styles.
			</p>

			<h2 id="from-the-cli">From the CLI</h2>
			<p>
				<a href="/getting-started/cli/#manual-checks"><code>@surea11y/cli</code></a> 1.5.0 writes
				the same pages with no code: <code>surea11y procedures</code> with no scan, and{" "}
				<code>--manual-checks</code> next to a scan, for the checks it leaves to a person.
			</p>
			<CodeBlock
				lines={[
					"# How to assess every WCAG 2.2 A and AA criterion, or a worksheet for a manual audit",
					{ text: "surea11y procedures --wcag-level AA -o wcag-22-aa.html", command: true },
					{ text: 'surea11y procedures --wcag-level AA --checklist --title "Audit: example.com" -o audit.html', command: true },
					"",
					"# The checks a scan leaves to a person, as a worksheet next to its report",
					{ text: "surea11y scan https://example.com/ --wcag 2.2 --html report.html --manual-checks manual-checks.html", command: true },
				]}
			/>

			<h2 id="in-the-html-report">In the HTML report</h2>
			<p>
				The <a href="/results-reports/html-report/">HTML report</a> has a “What's left for a
				person” section: every requirement of the standard scanned with a check no rule decides
				in full, its outcome in the scan beside it, and, collapsed under it, those checks with their
				steps. A requirement whose rules all pass is met only once its checks pass too, and the
				report says so. <code>{"renderHtmlReport(result, { manualChecks: false })"}</code> leaves
				the section out.
			</p>

			<h2 id="uses">Uses</h2>
			<p>
				<strong>A manual audit, with no scan.</strong> An auditor works through the worksheet of the
				standard the audit is against, records each result and note, and downloads the JSON for
				the report:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const checklist = procedureChecklist({ version: '2.2', levels: ['A', 'AA'] });",
					"fs.writeFileSync('audit-worksheet.html', renderProcedures(checklist, { title: 'Accessibility audit: example.com' }));",
				]}
			/>
			<p>
				<strong>A test run's attachment.</strong> A Playwright test that scans a page can attach the
				checks its rules don't decide, so they sit next to the scan in the test report:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"test('home page', async ({ page }, testInfo) => {",
					"  // ... scan the page ...",
					"  const left = procedureChecklist({ levels: ['A', 'AA'], automation: ['manual', 'partial'] });",
					"  await testInfo.attach('manual-checks.html', {",
					"    body: renderProcedures(left, { record: false }),",
					"    contentType: 'text/html'",
					"  });",
					"});",
				]}
			/>
			<p>
				<strong>A session with a screen reader user.</strong> Only what needs a screen reader, for a
				session with a person who uses one every day:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const sr = listProcedures({ levels: ['A', 'AA'], tools: 'screen-reader' });",
					"fs.writeFileSync('screen-reader-session.html', renderProcedures(sr, { title: 'Screen reader session' }));",
				]}
			/>
			<p>
				<strong>Documentation.</strong> One Markdown file per standard in a documentation site or a
				repository, regenerated when core is updated, so a team reads the same procedures its tools
				use. <strong>One criterion, where it is needed:</strong> a tool that shows a finding can show
				how to assess its whole criterion, with{" "}
				<code>{"renderProcedures(proceduresFor('1.4.12', { locale: 'de' }), { fragment: true })"}</code>.
			</p>

			<h2 id="a-packs-standard">A pack's standard</h2>
			<p>
				A <a href="/configuration/packs/#procedures">pack</a>'s standard can say how a person
				assesses its own requirements, and every function above reads it given the packs: by its
				own numbers and groups, in its own language where it declares one. A requirement that
				restates a WCAG criterion takes that criterion's procedures, read as the requirement (“which
				fails EN 301 549 9.1.4.3”).
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const en301549 = require('@surea11y/pack-en301549');",
					"",
					"proceduresFor('9.1.4.3', { packs: [en301549], standard: 'en301549', version: 'V4.1.1', locale: 'fr' });",
					"relatedRequirements('1.4.3', { packs: [en301549] });",
					"// [{ standard: 'EN 301 549', id: '9.1.4.3', version: 'V4.1.1', relation: 'restates', … }]",
					"",
					"const options = { packs: [en301549], standard: 'en301549', version: 'V4.1.1', locale: 'fr' };",
					"fs.writeFileSync('en-301-549.html', renderProcedures(procedureChecklist(options), { packs: [en301549] }));",
				]}
			/>
			<p>
				The <a href="/configuration/packs/#en-301-549-pack">EN 301 549 pack</a> 1.2.0 gives
				procedures for every chapter 9 clause whose criterion a core rule evaluates, in five
				languages, and the <a href="/configuration/packs/#wai-aria-pack">WAI-ARIA pack</a> gives a
				checklist for each of its requirements, with the roles, states and values that are valid
				listed in full. A pack that gives no procedures changes nothing: WCAG's are the same with it
				as without it.
			</p>
		</>
	);
}
