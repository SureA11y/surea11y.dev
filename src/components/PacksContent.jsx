import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";
const pack = "https://github.com/SureA11y/pack-en301549#readme";
const ariaPack = "https://github.com/SureA11y/pack-wai-aria";
const aria = "https://www.w3.org/TR/wai-aria-1.2/";

const ariaRequirementRows = [
	{ id: "name-required", req: <code>name-required</code>, title: <a href={`${aria}#namecalculation`}>Roles that require an accessible name have one</a> },
	{ id: "roles", req: <code>roles</code>, title: <a href={`${aria}#roles`}>Roles are concrete and current</a> },
	{ id: "required-states", req: <code>required-states</code>, title: <a href={`${aria}#requiredState`}>Required states and properties are present</a> },
	{ id: "supported-attributes", req: <code>supported-attributes</code>, title: <a href={`${aria}#supportedState`}>States and properties are supported by the role</a> },
	{ id: "prohibited-attributes", req: <code>prohibited-attributes</code>, title: <a href={`${aria}#prohibitedattributes`}>Prohibited states and properties are absent</a> },
	{ id: "attribute-values", req: <code>attribute-values</code>, title: <a href={`${aria}#propcharacteristic_value`}>States and properties have valid values</a> },
	{ id: "owned-elements", req: <code>owned-elements</code>, title: <a href={`${aria}#mustContain`}>Containers own the elements their role requires, each with one owner</a> },
	{ id: "context-roles", req: <code>context-roles</code>, title: <a href={`${aria}#scope`}>Elements are in the context their role requires</a> },
];

const procedureFormRows = [
	{ id: "restates", form: <code>{"{ wcag: '1.1.1' }"}</code>, means: "It restates a WCAG criterion, and takes that criterion's facets, rules and procedures as they are, in every language core has them." },
	{ id: "replace", form: <code>{"{ wcag: '1.4.3', replace: { <facet>: { … } } }"}</code>, means: "It restates a criterion but tests some of it its own way: the facets it names show its procedure instead of core's." },
	{ id: "own", form: <code>{"{ facets: [ … ] }"}</code>, means: "It is the standard's own: the test objectives a person checks, each with its procedure." },
	{ id: "note", form: <code>{"{ note: '…' }"}</code>, means: "It has nothing to assess, such as a clause a version leaves void: it is listed with its note, so a person looking for it learns why." },
];

// The example pack each binding ships as examples/acme-policy-pack.js.
const examplePack = [
	"'use strict';",
	"",
	"// A small pack: one house rule, a checklist profile and two checklist items.",
	"// A real pack is a package of its own; `npx surea11y-pack new <folder>` writes one.",
	"",
	"const { definePack, wcagTags } = require('@surea11y/core/pack');",
	"",
	"module.exports = definePack({",
	"  name: '@acme/a11y-policy',",
	"  title: 'Acme web policy',",
	"  version: '1.0.0',",
	"  namespace: 'acme',",
	"  core: '^1.11.1',",
	"  rules: [",
	"    {",
	"      id: 'acme-no-autoplay',",
	"      meta: {",
	"        title: 'Videos do not play sound on their own',",
	"        description: 'A video that starts with sound talks over a screen reader.',",
	"        tags: ['acme'],",
	"        defaultSeverity: 'serious'",
	"      },",
	"      runInPage(ctx) {",
	"        // defaultMuted reflects the muted attribute where muted isn't set from it yet (jsdom).",
	"        const loud = [...ctx.document.querySelectorAll('video[autoplay]')].filter((v) => !(v.muted || v.defaultMuted));",
	"        return loud.length",
	"          ? {",
	"              outcome: 'fail',",
	"              occurrences: loud.map((v) =>",
	"                ctx.helpers.reportOccurrence(v, { summary: 'This video plays with sound as the page opens.', hint: 'Remove autoplay, or add muted.' })",
	"              )",
	"            }",
	"          : { outcome: 'pass', occurrences: [] };",
	"      }",
	"    }",
	"  ],",
	"  profiles: {",
	"    'acme-web-2026': { tags: wcagTags('2.2', ['A', 'AA']), rules: ['region', 'acme-no-autoplay'] }",
	"  },",
	"  rollups: [",
	"    { id: 'acme-images', title: 'Images have a text alternative', checksIds: ['img-alt-present'] },",
	"    { id: 'acme-media', title: 'Media stays quiet until asked', checksIds: ['acme-no-autoplay'] }",
	"  ]",
	"});",
];

const kindRows = [
	{
		id: "checklist",
		have: "An organisation's accessibility policy: “WCAG 2.2 AA, plus these rules, minus that one, with these items in our report”",
		kind: <strong>checklist</strong>,
		holds: "Profiles choosing core's rules and your own, and rollups as the checklist's items.",
	},
	{
		id: "standard",
		have: "A standard with requirements of its own (a national standard such as RGAA, a sector's): numbered requirements, each checked by some rules",
		kind: <strong>standard</strong>,
		holds: "A requirements table, the rules that check each requirement, a result per requirement, and profiles.",
	},
	{
		id: "rules",
		have: "A few rules to add to every scan, with no profile",
		kind: "rules only",
		holds: "Rules, and variants or overrides of core's. Start from a checklist and delete its profiles and rollups.",
	},
];

const fileRows = [
	{ id: "index", file: <code>index.js</code>, what: <>The pack, written with <code>definePack()</code> from <code>@surea11y/core/pack</code>.</> },
	{ id: "auto", file: <code>rules/automatic/&lt;ns&gt;-link-text-specific.js</code>, what: "A rule that decides, using core's helpers." },
	{ id: "variant", file: <code>rules/automatic/&lt;ns&gt;-contrast-enhanced.js</code>, what: <>A variant of core's <code>contrast-minimum</code> at 7:1.</> },
	{ id: "manual", file: <code>rules/manual/&lt;ns&gt;-new-window-review.js</code>, what: <>A manual rule that calls for human review, with its reason codes and the steps a person follows to answer it (<code>meta.reasonCodes</code>, <code>meta.review</code>).</> },
	{ id: "i18n", file: <code>i18n/en.json</code>, what: "The messages." },
	{ id: "tests", file: <><code>tests/rules/*.test.js</code>, <code>tests/profiles.test.js</code></>, what: "A test per rule, and what each profile runs." },
	{ id: "examples", file: <code>docs/RULE_EXAMPLES.md</code>, what: "Examples of each rule's outcomes." },
	{ id: "eslint", file: <code>eslint.config.js</code>, what: "Core's lint rules for rules." },
	{ id: "standard", file: <><code>requirements.js</code>, <code>rule-map.js</code></>, what: "Standard only: the requirements and the rules that check each." },
	{ id: "procedures", file: <><code>procedures.js</code>, <code>tests/procedures.test.js</code></>, what: "Standard only: how a person assesses each requirement by hand, and a test that every requirement has a procedure for each of its facets." },
	{ id: "package", file: <code>package.json</code>, what: <><code>private</code>, with <code>@surea11y/core</code> as a peer dependency at the version that wrote it (<code>^1.16.1</code>), and eslint, jsdom and Playwright as development dependencies.</> },
	{ id: "readme", file: <><code>README.md</code>, <code>.gitignore</code></>, what: "The pack's own guide to these files, and what git leaves out." },
];

const profileFieldRows = [
	{ id: "tags", field: <code>tags</code>, what: <>Rules carrying any of these tags. <code>wcagTags(version, levels)</code> from <code>@surea11y/core/pack</code> gives core's WCAG tags (<code>wcagTags('2.1')</code> is 2.0 and 2.1, A and AA).</> },
	{ id: "rules", field: <code>rules</code>, what: <>Rules by id, core's or the pack's: a best-practice rule no WCAG tag selects, or, with <code>tags: []</code>, the core rules the profile runs besides the pack's own.</> },
	{ id: "exclude", field: <code>exclude</code>, what: <><code>{"{ rules: [...] }"}</code> leaves rules out of the scan; <code>{"{ criteria: ['2.5.8'] }"}</code> waives those criteria: their rollups go, and so does each rule whose every criterion is waived; a rule that also checks a criterion the profile keeps still runs. This narrows what the scan checks: WCAG's requirements stay as they are.</> },
	{ id: "severity", field: <code>severity</code>, what: <><code>{"{ ruleId: level }"}</code>: another severity under the profile. Results show it and keep the rule's own as <code>ruleSeverity</code>; baselines and finding ids don't change.</> },
	{ id: "wcagVersion", field: <code>wcagVersion</code>, what: <><code>'2.0'</code>, <code>'2.1'</code> or <code>'2.2'</code>: the WCAG version the profile's scans are judged by (<code>engine.wcagVersion</code>). Without it, the WCAG tags in <code>tags</code> imply the version, and a profile with none is judged by 2.2. A scan's own <code>engineOptions.wcagVersion</code> still wins. Core 1.12.0 and later.</> },
	{ id: "keepsParsing", field: <code>keepsParsing</code>, what: <><code>true</code> when the standard requires 4.1.1 Parsing as written, as EN 301 549 V3.2.1 does: a failure of it then stays a failure under a 2.0 or 2.1 target. Under a profile without it, the 2023 errata to WCAG 2.0 and 2.1 count 4.1.1 as satisfied for HTML and XML, and <code>duplicate-id</code> asks instead (under 2.2, which removed 4.1.1, it asks whatever the profile says). Only the profile's own field counts: a pack's profile that takes the place of one of core's doesn't inherit it. <code>engineOptions.mappings</code> never changes an outcome, so a scan judged by a standard that keeps 4.1.1 runs its profile. Core 1.14.0 and later.</> },
	{ id: "version", field: <><code>version</code>, <code>mappedRules</code></>, what: <>A standard's profile only: the standard's version it targets, and <code>mappedRules: true</code> to run every rule the standard maps for that version.</> },
];

export function PacksContent() {
	return (
		<>
			<p>
				A <strong>pack</strong> brings rules, variants of core's rules, a standard or a checklist,
				and their profiles and messages, to <code>@surea11y/core</code> from a package of its own,
				without a fork or a build of core. A national standard such as RGAA can be a pack, and so
				can your organisation's accessibility policy. A scan takes packs in{" "}
				<code>engineOptions.packs</code>, and runs them as it runs core's own rules and standards:
				in Node and in a browser, from the CLI, the bindings and the test matchers, with results,
				rollups and report entries in the same format as core's. Packs need <code>@surea11y/core</code>{" "}
				1.11.1 or later. Two standard packs of the SureA11y family are ready to install:{" "}
				<a href="#en-301-549-pack">EN 301 549</a> and <a href="#wai-aria-pack">WAI-ARIA 1.2</a>.
			</p>

			<h2 id="which-kind-of-pack">Which kind of pack</h2>
			<DataTable
				label="Kinds of pack"
				rowKey="id"
				columns={[
					{ key: "have", label: "You have", wrap: true },
					{ key: "kind", label: "Kind", width: "16%" },
					{ key: "holds", label: "What it holds", wrap: true },
				]}
				rows={kindRows}
			/>
			<p>
				A pack's rules and profiles can use any of core's rules: a checklist or a standard is
				mostly core's rules, chosen and grouped, plus the few rules core doesn't have. The
				examples on this page use <code>acme-policy-pack.js</code>, the small pack every binding
				ships in its <code>examples/</code> folder: one house rule, a checklist profile (WCAG 2.2 A
				and AA, <code>region</code>, and the house rule) and two checklist items.{" "}
				<a href="#start-from-the-example">Its source</a> is below.
			</p>

			<h2 id="en-301-549-pack">The EN 301 549 pack</h2>
			<p>
				<a href={pack}><code>@surea11y/pack-en301549</code></a> is a standard pack of the
				SureA11y family, ready to install: EN 301 549 chapter 9 (Web), in V3.2.1 and V4.1.1. It has
				a profile per version, <code>en301549-v4.1.1</code> and <code>en301549-v3.2.1</code>, that
				reports one result per clause, and <code>mappings: ['en301549']</code> to name the clauses
				on the results of any scan, a WCAG one included. It needs <code>@surea11y/core</code> 1.13.0
				or later.
			</p>
			<p>
				Its 1.1.0 release, built on core 1.14.0, judges each clause as core judges the WCAG
				criterion it restates. So no clause passes yet: where all its rules pass, a clause is{" "}
				<code>cantTell</code>, for a person to check the rest, as its criterion is (see{" "}
				<a href="/conformance/wcag-mapping/">WCAG conformance mapping</a>). The{" "}
				<code>en301549-v3.2.1</code> profile keeps 4.1.1 Parsing, so a duplicate id still fails
				9.4.1.1 there, and 9.1.4.5, 9.3.3.1 and 9.4.1.3 have their first rules (
				<code>image-of-text</code>, <code>invalid-field-error-message</code>,{" "}
				<code>live-region-announcements</code>). With core 1.13 it behaves as its 1.0 releases do.
			</p>
			<p>
				Its 1.2.0 release, with core 1.15.0 or later, also says how a person checks each clause by
				hand: the <a href="/conformance/procedures/">procedures</a> of the WCAG criterion it
				restates, where a core rule evaluates it, read as the clause ("which fails EN 301 549
				9.1.4.3"). It lists the clauses in the standard's own order, under chapter 9's principles
				and guidelines, and the standard is translated into French, German, Spanish and Japanese,
				so a list or a worksheet of its procedures, and a scan's clause titles, read in those
				languages throughout. Chapter 9 is all the pack covers: the standard's other requirements
				(chapter 4's functional performance statements, chapter 12, the chapters for what is not
				a web page) have no rule, result or procedure in it.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// npm install @surea11y/core @surea11y/pack-en301549",
					"const en301549 = require('@surea11y/pack-en301549');",
					"",
					"runDomRulesInPage(url, null, { packs: [en301549], profile: 'en301549-v4.1.1' });",
					"runDomRulesInPage(url, null, { packs: [en301549], profile: 'wcag22-aa', mappings: ['en301549:V4.1.1'] });",
				]}
			/>
			<p>
				It is also a worked example of a standard of your own. It has no rules: chapter 9 restates
				WCAG, so each clause is checked by core's rules for its criterion. Its profiles choose
				those rules (<code>tags</code>, <code>mappedRules: true</code>), name the WCAG version
				each version of the standard is judged by (<code>wcagVersion</code>) and, for V3.2.1, keep
				4.1.1 Parsing (<code>keepsParsing</code>). Its clauses restate WCAG criteria one for one (
				<code>applicability: 'wcag'</code>), and its rule map is
				derived from the installed core's catalog, so a rule core adds is covered with no change to
				the pack. A standard with requirements WCAG doesn't have uses the same shape and adds its
				own rules. Its source is short and worth reading beside{" "}
				<a href="#writing-a-pack">Writing a pack</a> below.
			</p>
			<p>
				Core had EN 301 549 built in until 1.13.0, which deprecates it in favour of this pack (see{" "}
				<a href="/conformance/wcag-mapping/#en-301-549">WCAG mapping</a>). Like any profile, the
				pack's profiles choose what runs: a conformance claim still needs a person to check every clause.
			</p>

			<h2 id="wai-aria-pack">The WAI-ARIA pack</h2>
			<p>
				<a href={ariaPack}><code>@surea11y/pack-wai-aria</code></a> is WAI-ARIA 1.2 as a standard:
				one result per author requirement the rules can check, from core's ARIA rules judged by
				WAI-ARIA's own wording. Its profile, <code>wai-aria-1.2</code>, runs core's ARIA rules and
				the pack's own, and nothing else. It needs <code>@surea11y/core</code> 1.15.0 or later.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// npm install @surea11y/core @surea11y/pack-wai-aria",
					"const waiAria = require('@surea11y/pack-wai-aria');",
					"",
					"runDomRulesInPage(url, null, { packs: [waiAria], profile: 'wai-aria-1.2' });",
				]}
			/>
			<p>
				<strong>Why a standard of its own.</strong> Core's ARIA rules are WCAG rules, and a WCAG
				scan reports every WAI-ARIA violation they find, as a WCAG failure or as a question for a
				person. The two can differ: an unnamed <code>role="grid"</code> breaks WAI-ARIA's
				"Accessible Name Required" for certain, but whether it fails WCAG 4.1.2 depends on what the
				page shows, so WCAG asks. Since core 1.15.0 a WCAG scan fails only where WCAG fails (
				<a href="/help/faq/#results-changed-1-15">what changed</a>); this pack reads the same
				findings by WAI-ARIA, where the grid fails.
			</p>
			<DataTable
				label="WAI-ARIA 1.2 requirements in the pack"
				rowKey="id"
				columns={[
					{ key: "req", label: "Requirement", width: "30%" },
					{ key: "title", label: "Title", wrap: true },
				]}
				rows={ariaRequirementRows}
			/>
			<p>
				Each is a result, <code>{"wai-aria-1.2-<requirement>"}</code>: <code>fail</code> where a
				rule found what WAI-ARIA says an author MUST or MUST NOT do, and <code>cantTell</code>{" "}
				otherwise, for a finding WAI-ARIA only recommends against (SHOULD, "not recommended") or no
				finding at all, since the rules check what the markup states, not everything a requirement
				covers (what script changes, what a browser computes). A requirement never passes on the
				rules alone. Besides core's rules, the pack has eleven of its own for requirements no core
				rule checks, because they have no plausible WCAG impact: a scrollbar's{" "}
				<code>aria-controls</code>, a feed's articles, a caption's context, a combobox's popup, a
				spinbutton's owned elements, table indexes, <code>aria-setsize</code>,{" "}
				<code>aria-keyshortcuts</code>, toolbar names, presentational elements, and{" "}
				<code>wai-aria-role-name-present</code>, a variant of core's{" "}
				<code>aria-role-name-present</code> that covers every role WAI-ARIA requires a name for
				(application, marquee, table, tabpanel and treegrid besides core's). The pack's own text
				is in English.
			</p>
			<p>
				<strong>With WCAG, or another standard.</strong> A scan can judge the page by WAI-ARIA and
				WCAG at once (<a href="#with-other-profiles">below</a>), or by EN 301 549 and WAI-ARIA with
				both packs:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const result = runDomRulesInPage(url, null, {",
					"  packs: [waiAria],",
					"  profile: ['wcag22-aa', 'wai-aria-1.2']",
					"});",
					"",
					"// <div role=\"group\" aria-checked=\"true\">: an attribute the role doesn't",
					"// support, a question for WCAG 4.1.2 and a failure of WAI-ARIA.",
					"const check = result.checksResults.find((c) => c.ruleId === 'aria-allowed-attr');",
					"check.verdicts;     // { 'wcag22-aa': 'cantTell', 'wai-aria-1.2': 'fail' }",
					"check.outcome;      // 'fail', the worst of them, which SARIF and JUnit gate on",
					"check.checkOutcome; // 'cantTell', the rule's own, which WCAG's criteria read",
					"",
					"result.profiles['wai-aria-1.2'].rulesResults; // this standard's results, by id",
				]}
			/>
			<p>
				A rule both profiles run is one check with a verdict from each. Names are the exception:
				under <code>wai-aria-1.2</code> they are checked by the pack's variant, so an unnamed{" "}
				<code>role="grid"</code> is two checks, core's <code>aria-role-name-present</code> (
				<code>{"{ 'wcag22-aa': 'cantTell' }"}</code>) and the variant (
				<code>{"{ 'wai-aria-1.2': 'fail' }"}</code>).
			</p>
			<p>
				<strong>How a person answers a question.</strong> Under <code>wai-aria-1.2</code>, the steps
				of the core questions this standard asks are in WAI-ARIA's words and name what the finding
				found ("When the page was scanned, the element it controls had role dialog"); a scan that
				also runs a WCAG profile keeps core's steps, which name the WCAG criterion.{" "}
				<code>{"proceduresFor('name-required', { packs: [waiAria], standard: 'wai-aria' })"}</code>{" "}
				gives each requirement's checklist, with the roles, states and values that are valid listed
				in full, from the Recommendation's tables. The pack's <code>docs/COVERAGE.md</code> lists
				every WAI-ARIA 1.2 author requirement a rule can check from the markup, one case per role,
				state or property, and what the profile makes of each.
			</p>
			<p>
				It is also the worked example of a standard that is certain where WCAG asks:{" "}
				<code>rule-map.js</code> lists, for each of core's ARIA rules, what each reason code means
				under WAI-ARIA, with <code>outcome: 'fail'</code> for a MUST (see{" "}
				<a href="#sending-findings-to-requirements">Sending findings to requirements</a>).
			</p>

			<h2 id="using-a-pack">Using a pack</h2>

			<h3 id="from-node">From Node</h3>
			<CodeBlock
				lang="js"
				lines={[
					"const { runDomRulesInPage, getChecksCatalog } = require('@surea11y/core');",
					"const acmePolicy = require('./acme-policy-pack');",
					"",
					"const result = runDomRulesInPage(url, null, { packs: [acmePolicy], profile: 'acme-web-2026' }, null);",
					"result.engine.packs;   // ['@acme/a11y-policy@1.0.0']",
					"getChecksCatalog({ packs: [acmePolicy] }); // core's rules and the pack's",
				]}
			/>
			<p>
				The pack is prepared once and kept for the next scan with the same pack object, so a crawl
				that passes the same packs to every page prepares them once. <code>definePack</code> freezes
				the pack object: treat it as immutable, and reuse the same object between scans. Passing a
				pack registers it for the scan; it doesn't select its rules. A pack rule tagged with the
				pack's namespace is opt-in: without one of the pack's profiles, it runs only when selected
				by id or by that tag (see <a href="#names">Names</a>). A pack rule without the tag is selected as core's rules are,
				so a default scan with the pack runs it. Add{" "}
				<code>{"runOnly: { bestPractices: true }"}</code> beside the profile to run the best
				practices too.
			</p>

			<h3 id="with-a-browser-binding">With a browser binding</h3>
			<p>
				Playwright, Puppeteer, Selenium and WebdriverIO take the pack object in{" "}
				<code>.withPacks()</code>, register it in the page, and in every frame with{" "}
				<code>.frames(true)</code>, before the scan:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { A11yCoreBuilder, getScanGaps } = require('@surea11y/playwright');",
					"const acmePolicy = require('./acme-policy-pack');",
					"",
					"const results = await new A11yCoreBuilder({ page })",
					"  .withPacks(acmePolicy)",
					"  .options({ profile: 'acme-web-2026' })",
					"  .analyze();",
					"",
					"results.engine.packs;   // ['@acme/a11y-policy@1.0.0']",
					"",
					"// A checklist's items, each one result, beside core's WCAG rollups:",
					"results.rulesResults.filter((r) => r.meta && r.meta.standard === 'Acme web policy');",
				]}
			/>
			<p>
				Pass an array, or call <code>.withPacks()</code> again, to scan with several packs. The
				bindings share <code>.withPacks()</code>, but each builder takes its own driver object (
				<code>{"{ page }"}</code>, <code>{"{ driver }"}</code> or <code>{"{ browser }"}</code>) and
				needs its own setup: see <a href="/getting-started/playwright/">Playwright</a>,{" "}
				<a href="/getting-started/puppeteer/">Puppeteer</a>,{" "}
				<a href="/getting-started/selenium/">Selenium</a> and{" "}
				<a href="/getting-started/webdriverio/">WebdriverIO</a>.
			</p>

			<h3 id="with-cypress">With Cypress</h3>
			<p>
				A pack is prepared in Node, and a Cypress spec runs in the browser. So in Cypress{" "}
				<code>.withPacks()</code> takes each pack's module name (a package name, or a path from the
				project root), and the binding's plugin prepares the pack in Node. Register the plugin
				once:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// cypress.config.js",
					"const { defineConfig } = require('cypress');",
					"const surea11y = require('@surea11y/cypress/plugin');",
					"",
					"module.exports = defineConfig({",
					"  e2e: {",
					"    setupNodeEvents(on, config) {",
					"      surea11y(on, config);",
					"    }",
					"  }",
					"});",
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"new A11yCoreBuilder()",
					"  .withPacks('./examples/acme-policy-pack.js') // or a package name, '@acme/a11y-policy'",
					"  .options({ profile: 'acme-web-2026' })",
					"  .analyze()",
					"  .then((results) => {",
					"    expect(results.engine.packs).to.deep.equal(['@acme/a11y-policy@1.0.0']);",
					"  });",
				]}
			/>
			<p>
				<code>.analyze()</code> asks the plugin, through <code>cy.task</code>, for the script that
				registers the packs, and runs it in the page, and in every same-origin frame with{" "}
				<code>.frames(true)</code>. The plugin keeps a pack for the rest of the run, so a change to
				a pack's file shows on the next <code>cypress run</code>, or after restarting{" "}
				<code>cypress open</code>. A pack object, as the other bindings take, throws at{" "}
				<code>.withPacks()</code>: it can't be prepared in the browser.
			</p>

			<h3 id="with-the-test-matchers">With the test matchers</h3>
			<p>
				<code>@surea11y/test-matchers</code> scans in Node, so a pack is passed as the object
				itself:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const acmePolicy = require('./acme-policy-pack');",
					"const policy = { packs: [acmePolicy], profile: 'acme-web-2026' };",
					"",
					"test(\"a page that breaks the pack's house rule fails the assertion\", () => {",
					"  document.body.innerHTML = '<main><h1>Welcome</h1><video autoplay src=\"intro.mp4\"></video></main>';",
					"  expect(document).not.toHaveNoA11yViolations(policy);",
					"});",
				]}
			/>
			<p>
				Keep the pack objects in one place (a setup file or a module), so every test passes the
				same ones. A pack that did not run fails the assertion. See{" "}
				<a href="/getting-started/test-matchers/#packs">Test matchers</a>.
			</p>

			<h3 id="from-the-cli">From the CLI</h3>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --pack ./acme-policy-pack.js --profile acme-web-2026", command: true },
					{ text: "surea11y scan ./dist/index.html --pack @acme/a11y-policy --profile acme-web-2026", command: true },
				]}
			/>
			<p>
				<code>--pack</code> takes a package name, resolved from the working directory's project,
				or a path, and repeats for several packs. The pack loads <code>@surea11y/core/pack</code>,
				which is installed beside the CLI when you install <code>@surea11y/cli</code> in the
				project. See <a href="/getting-started/cli/#packs">CLI</a>.
			</p>

			<h3 id="in-a-page-of-your-own">In a page of your own</h3>
			<p>
				For a browser extension or a <code>page.evaluate</code> of your own, inject{" "}
				<code>packScript([acmePolicy])</code> from <code>@surea11y/core/pack</code> after core's
				browser bundle, or ship one file built with{" "}
				<code>buildBrowserBundle({"{ packs: [acmePolicy] }"})</code>, and name the pack as{" "}
				<code>name@version</code>. See{" "}
				<a href="/getting-started/standalone/#packs-in-a-page">Standalone</a>. A page that loads its scripts as files is best served by the one file from{" "}
				<code>buildBrowserBundle</code>: the pack's script runs only with the core that wrote it.
			</p>
			<p>
				A page with another core's bundle skips the pack, and <code>skippedPacks</code> names the two
				versions, so build that file again for each release of core or of the pack.
			</p>

			<h3 id="with-other-profiles">Beside other profiles</h3>
			<p>
				A pack's profile can run beside WCAG's, or beside another pack's, in one scan: since core
				1.15.0, <code>profile</code> takes a list, and each profile judges the page as it would
				alone (see <a href="/configuration/engine-options/#several-profiles">Engine options</a>):
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const result = runDomRulesInPage(url, null, {",
					"  packs: [acmePolicy, en301549],",
					"  profile: ['acme-web-2026', 'en301549-v4.1.1']",
					"});",
					"result.engine.profiles; // ['acme-web-2026', 'en301549-v4.1.1']",
					"result.profiles['acme-web-2026'].rulesResults; // the policy's items, by id",
				]}
			/>
			<p>
				A finding a standard is certain of where WCAG asks (<code>outcome: 'fail'</code> in its rule
				map) fails the scan, and its <code>verdicts</code> say what each profile makes of it. A
				profile whose pack is skipped is listed in <code>engine.profilesNotRun</code>, and the
				others still run. The bindings take the list in <code>.options({"{ profile }"})</code>, the
				test matchers in their options and the CLI as a repeated <code>--profile</code>.
			</p>

			<h2 id="what-a-scan-reports">What a scan reports</h2>
			<ul>
				<li>
					<code>engine.packs</code> names each pack that ran, as <code>name@version</code>, and{" "}
					<code>engine.profile</code> the profile that applied.
				</li>
				<li>
					A pack's rules appear in <code>checksResults</code> like core's, with ids that start with
					its namespace (<code>acme-no-autoplay</code>). A pack rule that maps to a WCAG criterion
					counts toward that criterion's rollup, unless it carries the pack's opt-in namespace tag:
					those rules check what WCAG doesn't require, so they count only in the pack's own rollups.
					Their <code>wcagSc</code> still names the WCAG criteria they check, for the reporters, and
					no other standard (EN 301 549, which maps every rule by its WCAG criteria) claims them.
					An override counts in place of the core rule it replaces, where its own mapping puts it.
				</li>
				<li>
					A checklist's items, or a standard's requirements, are rollups in{" "}
					<code>rulesResults</code>, with the checklist's or standard's name as{" "}
					<code>meta.standard</code>. The <a href="/results-reports/html-report/">HTML report</a>{" "}
					shows them in a section of their own, <a href="/results-reports/sarif-report/">SARIF</a>{" "}
					tags each rule with the items it belongs to (<code>acme-images</code>), and{" "}
					<a href="/results-reports/junit-report/">JUnit</a> lists them as properties. The result's{" "}
					<code>standards</code> names the checklist, so a stored result renders the same wherever
					it is rendered.
				</li>
				<li>
					A profile's <code>severity</code> shows on the results it changes, with the rule's own
					kept as <code>ruleSeverity</code>.
				</li>
				<li>
					In a scan of several profiles, <code>engine.profiles</code> lists those that ran,{" "}
					<code>profiles[id]</code> holds each one's rollups, and each finding's{" "}
					<code>verdicts</code> say what each profile makes of it (
					<a href="/results-reports/output-schema/#several-profiles">Output schema</a>).
				</li>
				<li>
					The HTML report's "What's left for a person" follows the pack's standard, under its own
					numbers, where the scan ran its profile and the standard gives{" "}
					<a href="#procedures">procedures</a>.
				</li>
			</ul>

			<h2 id="when-a-pack-doesnt-run">When a pack doesn't run</h2>
			<p>
				A pack whose <code>core</code> range leaves out the installed core, that isn't valid, or
				that doesn't fit with core (a rule id outside its namespace, a dictionary key core has, a
				variant of a rule that isn't there) is skipped: the scan runs without it, warns, and lists
				it in <code>skippedPacks</code> as <code>{"{ name, reason }"}</code>. Under{" "}
				<code>strictOptions</code> it throws, with <code>code: 'INVALID_ENGINE_OPTIONS'</code>, as
				every error in <code>engineOptions.packs</code> has. Two packs that clash with each other (a dictionary
				key both define, two standards with one key) throw, since any way of choosing between them
				would depend on the order they were passed in. In a page, a pack named in{" "}
				<code>engineOptions.packs</code> that no <code>packScript</code> call registered, or that
				was registered with another core version, is listed the same way. So a scan can finish
				without the checks you added the pack for: a tool that depends on a pack should check{" "}
				<code>skippedPacks</code> before treating the scan as complete.
			</p>
			<p>Each tool turns a skipped pack into a failure you can see:</p>
			<ul>
				<li>
					The browser bindings check each pack when you call <code>.withPacks()</code> and throw
					before scanning for one core can't run. A pack the page then doesn't run is a{" "}
					<code>'pack-skipped'</code> gap in <code>getScanGaps(results)</code>, and{" "}
					<code>.analyze()</code> warns about it, so a test that asserts on the gaps fails.
				</li>
				<li>The test matchers fail the assertion, naming the pack and the reason.</li>
				<li>
					The CLI exits <code>2</code>, with no report or baseline written, for a pack it can't
					find or load, or one the engine skips.
				</li>
			</ul>
			<p>
				Install the pack beside <code>@surea11y/core</code> and the package that runs it, so all
				three share one copy of core.
			</p>

			<h2 id="writing-a-pack">Writing a pack</h2>

			<h3 id="start-from-the-example">Start from the example</h3>
			<p>
				A pack is an object made with <code>definePack</code> from <code>@surea11y/core/pack</code>.
				This is <code>acme-policy-pack.js</code>, the example the bindings ship:
			</p>
			<CodeBlock lang="js" lines={examplePack} />
			<p>
				Its profile, <code>acme-web-2026</code>, runs core's WCAG 2.2 A and AA rules, the
				best-practice rule <code>region</code>, which no WCAG tag selects, and the house rule. Its
				two rollups are the checklist's items: each groups rules, core's or the pack's, into one
				result.
			</p>

			<p>
				For a standard, the{" "}
				<a href="#en-301-549-pack">EN 301 549 pack</a> is a complete, published example.
			</p>

			<h3 id="create-one">Create one with <code>surea11y-pack new</code></h3>
			<p>For a pack of your own, start from a generated package:</p>
			<CodeBlock
				lines={[
					{ text: "npx -p @surea11y/core surea11y-pack new acme-a11y --name @acme/a11y-pack", command: true },
					"# or, for a standard:",
					{ text: "npx -p @surea11y/core surea11y-pack new city-standard --name @city/a11y-standard --kind standard --title \"City Standard\"", command: true },
					"",
					{ text: "cd acme-a11y", command: true },
					{ text: "npm install", command: true },
					{ text: "npx playwright install chromium   # once, for npm run docs", command: true },
					{ text: "npm test && npm run lint && npm run docs", command: true },
				]}
			/>
			<p>
				The pack works as generated: its tests pass, its rules lint clean, its examples agree with
				its rules. <code>surea11y-pack new</code> checks the pack as a scan would before writing anything, and
				refuses a name, namespace or title that would make it invalid (a title of <code>WCAG</code>{" "}
				names its standard as one of core's), saying why. Change it step by step from there,
				running <code>npm test</code> as you go. Its README walks through each file:
			</p>
			<DataTable
				label="Files of a generated pack"
				rowKey="id"
				columns={[
					{ key: "file", label: "File", width: "40%", wrap: true },
					{ key: "what", label: "What it holds", wrap: true },
				]}
				rows={fileRows}
			/>

			<h3 id="names">Names</h3>
			<ul>
				<li>
					<strong>The package name and version</strong> are an npm package name and a whole
					version (<code>1.0.0</code>). A scan reports them in <code>engine.packs</code>.
				</li>
				<li>
					<strong>The namespace</strong> (<code>namespace: 'acme'</code>) keeps the pack's ids apart
					from core's and other packs': every rule, rollup and profile id starts with it and{" "}
					<code>-</code>. It can't be a prefix of core's rule ids (<code>img</code>,{" "}
					<code>aria</code> or <code>link</code> would be, as in <code>img-alt-present</code>), nor
					start with <code>wcag</code>, and two packs in one scan can't share one. It is also the tag that
					makes the pack's own rules opt-in: a rule tagged with it runs only under one of the
					pack's profiles, by its id, or by the tag (<code>optInRules: ['acme']</code>). By default, then,
					a scan that targets WCAG doesn't run it. Unlocking the tag with <code>optInRules</code>{" "}
					doesn't remove the scan's profile or filters: under a WCAG profile, an unlocked rule runs
					only when its tags also match that profile. Leave the tag off a rule
					that should run in every scan with the pack: it is then selected as core's rules are, and a
					scan that targets WCAG can run it and report its failures when its tags match.
				</li>
				<li>
					<strong><code>core</code></strong> is the range of core versions the pack works with (
					<code>'^1.11.1'</code>), read as npm reads ranges. Start new packs at 1.11.1: the 1.11.0
					package left out a file packs need in Node. A scan with a core outside it skips the
					pack, with the reason in <code>skippedPacks</code>. <code>surea11y-pack new</code> writes
					the version that generated the pack (<code>^1.16.1</code>); keep a range that starts at
					1.14 if the pack uses what 1.14 added: <code>meta.review</code>, <code>reasonCodes</code>{" "}
					and <code>findings</code> rows, <code>meta.contributions</code>, <code>applicability</code>,{" "}
					<code>partial</code> or <code>keepsParsing</code>; and one that starts at 1.15 if it uses{" "}
					<code>outcome: 'fail'</code>. What else 1.15 reads (a standard's procedures, groups and
					translations, its own review steps) an older core ignores. A pack that uses an API core
					marks experimental declares a range that takes no later minor (<code>'~1.16.0'</code>);
					see <a href="#experimental">Experimental APIs</a>.
				</li>
				<li>
					<strong><code>title</code></strong> is what results and reports call a checklist, and{" "}
					<strong><code>description</code></strong> a sentence on what the pack checks, for tools
					that let their users choose packs (<code>describePacks</code> returns it).
				</li>
			</ul>

			<h3 id="profiles">Profiles</h3>
			<p>
				A profile is a named selection, run with <code>engineOptions.profile</code>. A rule runs
				under it when it carries one of its <code>tags</code> or its id is in <code>rules</code>,
				and is not in <code>exclude</code>; the pack's rules tagged with its namespace run under
				every profile of the pack.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"profiles: {",
					"  'acme-policy': {",
					"    tags: wcagTags('2.2', ['A', 'AA']),               // core's WCAG 2.2 A and AA rules",
					"    rules: ['region', 'heading-order'],               // and these, by id",
					"    exclude: { rules: ['contrast-minimum'] },         // but not this one",
					"    severity: { 'img-alt-present': 'critical' }       // and this one is critical here",
					"  },",
					"  'acme-quick': {",
					"    tags: [],",
					"    rules: ['img-alt-present', 'link-name-present', 'page-title-present']",
					"  }",
					"}",
				]}
			/>
			<DataTable
				label="Profile fields"
				rowKey="id"
				columns={[
					{ key: "field", label: "Field", width: "22%" },
					{ key: "what", label: "What it does", wrap: true },
				]}
				rows={profileFieldRows}
			/>
			<p>
				<strong>A profile that runs only what its standard asks for.</strong> A standard's profile
				with <code>{"tags: [<ns>]"}</code> and <code>mappedRules: true</code> runs the pack's own
				rules and the core rules its map links to a requirement, and nothing else: no rule checks
				what the standard doesn't, and results hold no WCAG criteria. With no WCAG tag, though,
				nothing says which WCAG version the standard is built on, and the run is judged by 2.2.
				For a standard built on 2.1 that is wrong: the run reports 2.2's criteria, such as 2.5.8,
				which the standard doesn't have. Give the version, and <code>keepsParsing: true</code> if
				the standard still requires 4.1.1 Parsing. The generated{" "}
				<code>index.js</code> reads it from <code>requirements.js</code>, where each version of
				the standard names the WCAG version it is built on (
				<code>{"{ version: '1.0', wcagVersion: '2.2' }"}</code>):
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"'city-1.0': {",
					"  version: '1.0',",
					"  tags: ['city'],                      // the pack's own rules",
					"  mappedRules: true,                   // and the core rules its map links to a requirement",
					"  wcagVersion: wcagVersionOf('1.0')    // judged by the WCAG version requirements.js gives for 1.0",
					"}",
				]}
			/>
			<p>
				Core's rules, with their ids and tags, are in the <a href="/rules/">rule catalog</a>.
			</p>

			<h3 id="checklist-items-and-requirements">Checklist items and requirements</h3>
			<p>
				<strong>A checklist's items</strong> are its <code>rollups</code>:{" "}
				<code>{"{ id, title, checksIds }"}</code>, each grouping rules into one result. An item
				fails when one of its rules fails, and passes when they pass. When none fails but one
				returns <code>cantTell</code>, the item is <code>cantTell</code> too: it needs human
				review. A pack gives either <code>profiles</code> and <code>rollups</code>, a
				checklist, or a <code>standard</code>, not both.
			</p>
			<p>
				<strong>A standard's requirements</strong> come from two tables the generator writes,{" "}
				<code>requirements.js</code> (per version, each requirement's number, wording and WCAG
				criteria) and <code>rule-map.js</code> (which requirements each rule checks, and why).{" "}
				<code>ruleMappedStandard()</code> from <code>@surea11y/core/pack</code> turns them into the
				standard: a rollup per requirement, the requirements each rule's result names, and checks
				of both tables when the pack is prepared.
			</p>

			<h3 id="sending-findings-to-requirements">Sending findings to requirements</h3>
			<p>
				A rule's row in <code>rule-map.js</code> can send its findings of one reason code
				elsewhere, with <code>{"reasonCodes: { [code]: { requirements, outcome } }"}</code>:{" "}
				<code>requirements</code> (by default the row's) are the ones those findings count toward,{" "}
				<code>[]</code> for none; <code>outcome: 'cantTell'</code> makes a failing one a question
				there, and <code>outcome: 'fail'</code> (core 1.15.0 and later) makes a question a failure
				there. A requirement's rollup then judges the rule by the findings that count toward it, so
				a standard can ask about one cause where WCAG fails it, be certain of one where WCAG asks,
				or file two causes under two tests:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"'list-children-valid': {",
					"  requirements: ['9.3.1'],",
					"  reasonCodes: { LIST_ITEM_ROLE_OVERRIDDEN: { requirements: ['9.3.1', '9.3.2'], outcome: 'cantTell' } }",
					"}",
				]}
			/>
			<p>
				<code>outcome: 'fail'</code> is for a standard that is certain where WCAG asks. An unnamed{" "}
				<code>role="grid"</code> is <code>cantTell</code> for WCAG, whose 4.1.2 depends on what the
				page shows, but breaks WAI-ARIA's "Accessible Name Required" for certain, as the{" "}
				<a href="#wai-aria-pack">WAI-ARIA pack</a> says:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"'aria-role-name-present': {",
					"  requirements: ['name-required'],",
					"  reasonCodes: { name_missing: { outcome: 'fail' } }",
					"}",
				]}
			/>
			<p>
				It fails the standard's requirement only: the check result's own outcome, and every WCAG
				rollup, stay as they were. List only the codes the standard states for certain; a code
				left out is judged by the rule's own outcome. A standard that writes its own rollups uses
				the act <code>'fail'</code> in <code>meta.contributions</code> the same way.
			</p>
			<p>
				A row can also send findings by what they record, with{" "}
				<code>{"findings: [{ when, requirements, outcome }]"}</code>: <code>when</code> gives values
				that fields of a finding's <code>data.details</code> must equal, named by dotted path. A
				finding goes by the first entry it matches, else by its reason code, else by the row. So a
				standard can file one rule's failures under the test for their text size, though they
				share a reason code:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"'contrast-minimum': {",
					"  requirements: ['3.1', '3.2'],",
					"  findings: [",
					"    { when: { 'typography.isLargeText': false }, requirements: ['3.1'] },",
					"    { when: { 'typography.isLargeText': true }, requirements: ['3.2'] }",
					"  ]",
					"}",
				]}
			/>
			<p>
				Match only fields a rule keeps stable: <code>reasonCode</code> on every rule, and the
				others core's <a href={`${core}/docs/API_STABILITY.md`}>API stability policy</a> on GitHub
				names: <code>contrast-minimum</code>'s ratio, threshold and typography,{" "}
				<code>contrast-computable</code>'s typography, the list rules' <code>element</code> and{" "}
				<code>parentElement</code>, <code>aria-role-name-present</code>'s <code>role</code>, the
				link rules' <code>linkKind</code>, <code>live-region-announcements</code>'{" "}
				<code>messageKind</code>, and, experimental, <code>skip-link</code>'s <code>lean</code>{" "}
				(see the <a href="/results-reports/output-schema/#occurrence">output schema</a>). The typography of
				<code>contrast-computable</code>, <code>linkKind</code>, <code>messageKind</code> and{" "}
				<code>lean</code> are new in core 1.16.0, for a standard that files findings under tests of its own
				(an image link apart from a text link, a status message apart from an alert).{" "}
				<code>linkKind</code> and <code>messageKind</code> may gain values in a minor: name the
				ones you route, and the others go by their code or the row. A field that changes or
				disappears matches nothing, and the finding goes by its code or the row. Each rule's reason codes are listed under "What a finding reports" in core's{" "}
				<a href={`${core}/docs/RULE_CATALOG.md`}>rule catalog</a> on GitHub.
			</p>
			<p>
				Two more fields change how a requirement is judged. A standard whose requirements restate
				WCAG criteria one for one, as EN 301 549's chapter 9 does, passes{" "}
				<code>applicability: 'wcag'</code> to <code>ruleMappedStandard</code>: a requirement's
				rollup is then <code>notApplicable</code> or <code>pass</code> only where the WCAG rollup
				of its criteria would be, so the two agree in one report. A requirement that core's rules
				don't check in full, though it doesn't restate a criterion, says <code>partial: true</code>{" "}
				in the requirements table: its rollup is then <code>cantTell</code> where its rules all
				pass or all find nothing, since they checked only part of it. A standard that writes its
				own rollups says both in each rollup's <code>meta</code>, and routes findings in{" "}
				<code>meta.contributions</code>; <code>StandardRollup</code> in <code>pack.d.ts</code>{" "}
				gives the shape, and core's <a href={`${core}/docs/PACKS.md`}>pack guide</a> on GitHub
				walks through it. All of these need core 1.14.0.
			</p>
			<p>
				<strong>Tests under requirements</strong> (core 1.16.0,{" "}
				<a href="#experimental">experimental</a>). A standard that judges tests under its
				requirements, as RGAA judges tests under each criterion, gives{" "}
				<code>ruleMappedStandard</code> a third table, <code>tests</code>, per version: each test's{" "}
				<code>title</code> and the <code>requirements</code> it belongs to. A rule-map row then
				names tests, and may say where its findings are only questions, with <code>asks</code>.
				There is still one rollup per requirement, grouping the rules of its tests; each finding
				counts toward the test it fails, and the results name each test with the requirement it
				belongs to (<code>criterion</code>):
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"requirements: { '1.0': { '4.2': { title: 'Images have a text alternative', wcagSc: ['1.1.1'], tests: ['4.2.1', '4.2.2'] } } },",
					"tests: { '1.0': {",
					"  '4.2.1': { title: 'Each image has an alt attribute', requirements: ['4.2'] },",
					"  '4.2.2': { title: 'Each alternative describes the image', requirements: ['4.2'] }",
					"} },",
					"ruleMap: { '1.0': {",
					"  'img-alt-present': { requirements: ['4.2.1'] },",
					"  'img-alt-quality': { requirements: [], asks: ['4.2.2'] }",
					"} }",
				]}
			/>

			<h3 id="standards-as-data">A standard as data, or built on others</h3>
			<p>
				Since core 1.16.0 (<a href="#experimental">experimental</a>), the same tables, with the
				standard's versions, groups, profiles and texts, can be one JSON object in the format{" "}
				<code>surea11y-standard/1</code>, which <code>@surea11y/core/schemas/standard.schema.json</code>{" "}
				describes, so any tool can read the standard without running the pack.{" "}
				<code>checkStandardData(data)</code> lists what is wrong with it,{" "}
				<code>standardFromData(data)</code> makes the pack's <code>standard</code> from it, and{" "}
				<code>standardDataOf(standard)</code> gives it back. The{" "}
				<a href="#en-301-549-pack">EN 301 549 pack</a> built from its data gives the same results
				as it does today.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { definePack, standardFromData } = require('@surea11y/core/pack');",
					"const data = require('./standard.json');   // { format: 'surea11y-standard/1', key: 'city', ... }",
					"",
					"module.exports = definePack({ name, version, namespace: 'city', core: '~1.16.0',",
					"  standard: standardFromData(data) });",
				]}
			/>
			<p>
				A standard built on one or more others, the way some national standards build on EN 301
				549 or split its clauses into steps, declares only what it keeps and changes:{" "}
				<code>deriveStandard(bases, own)</code> completes it from the bases' data. Each of its
				versions, requirements and tests says what it is <code>basedOn</code>; it takes the fields,
				tests and rule-map rows of what it is based on, its own rows replace or drop inherited
				ones, and a <code>basedOn</code> the bases can't answer throws, so when a base changes the
				derived pack's tests fail rather than its results. Each entry in a result carries the{" "}
				<code>basedOn</code> of its requirement or test, so a step's result names the clause it
				comes from. Core's <a href={`${core}/docs/PACKS.md`}>pack guide</a> on GitHub has the format
				and every rule of the derivation.
			</p>

			<h3 id="rules">Rules</h3>
			<p>
				A rule has the shape of core's rule modules: <code>{"{ id, meta, runInPage }"}</code>, and{" "}
				<code>applicability</code> when it applies only sometimes, with the same <code>ctx</code>.{" "}
				<code>runInPage(ctx)</code> runs in the page, so it uses only <code>ctx</code>, never a
				variable or module from outside it, and it only reads: a pack's rules run after core's, and
				the helpers and options they are given are read-only. Read-only is a rule, not a sandbox:
				nothing stops a rule's code from doing more, so load only packs you trust (see core's{" "}
				<a href={`${core}/SECURITY.md`}>security policy</a> on GitHub). Three shortcuts need little or no
				code: <strong>a variant</strong> runs a core rule at other settings (
				<code>{"{ id, from: 'contrast-minimum', config: { normalTextRatio: 7 }, meta }"}</code>;
				a threshold takes a finite number above 0, a choice one of its listed values, and{" "}
				<code>definePack</code> refuses anything else),{" "}
				<strong>an override</strong> replaces a core rule (listed in <code>overrides</code>, and
				in results' <code>overriddenBuiltinIds</code>), and <strong>a core rule as it is</strong>{" "}
				needs only its id in a profile or a rollup. Writing a rule is in core's{" "}
				<a href={`${core}/docs/RULE_AUTHORING.md`}>rule-authoring guide</a> on GitHub.
			</p>
			<p>
				Core's <a href={`${core}/docs/RULE_SETTINGS.md`}>rule settings list</a> on GitHub gives
				every setting core's rules offer a variant, with its default, the values it takes and what
				it changes; <code>getChecksCatalog()</code> gives the same as each rule's{" "}
				<code>variantSettings</code>. That is how another standard's version of a requirement, or a
				choice WCAG leaves to the evaluator, runs on core's code. Since core 1.14,{" "}
				<code>contrast-minimum</code> offers choices for text that looks like a logo (
				<code>logoText</code>), a page with a higher-contrast switch (<code>contrastSwitch</code>)
				and semi-bold text (<code>semiBold</code>), and <code>valid-lang</code> offers{" "}
				<code>codes: 'iso639'</code> for a standard, such as RGAA, that accepts any ISO 639
				language code.
			</p>

			<h3 id="review-steps">How a person checks a <code>cantTell</code></h3>
			<p>
				A rule that can leave a finding undecided may say, per reason code, how a person answers
				it, as core's rules do (see{" "}
				<a href="/results-reports/output-schema/#how-to-check">"How to check"</a> in the output
				schema): a few steps starting from the element the finding names, then what they see if
				it passes and if it fails.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"meta.review = {",
					"  GENERIC_LINK_NAME: {",
					"    steps: ['Find the link the report names.', 'Read the text around it.'],",
					"    passWhen: 'The text around the link says where it goes.',",
					"    failWhen: 'Nothing near the link says where it goes, which fails WCAG 2.4.4.'",
					"  }",
					"};",
				]}
			/>
			<p>
				<code>definePack</code> checks the shape: 1 to 6 steps and a non-empty{" "}
				<code>passWhen</code> and <code>failWhen</code> per reason code. A rule that declares its
				reason codes in <code>meta.reasonCodes</code> (<code>['GENERIC_LINK_NAME']</code>) gives
				steps only for a code it declares there or names in its <code>runInPage</code>, so a
				mistyped code is refused: declaring them is worth it for that check. The steps are
				written in English (a pack's dictionaries may translate them, see below), and stay out
				of the page:{" "}
				<code>runDomRulesInPage</code> with <code>engineOptions.packs</code> adds them to the
				result, and for a result from a page <code>{"addHowToCheck(result, { packs })"}</code>{" "}
				does. A variant has its core rule's steps, translated, so it needs none; an override,
				like a custom rule, has none. Core 1.14.0 and later.
			</p>
			<p>
				Since core 1.15.0, a pack's dictionaries can translate its steps (
				<a href="#messages">below</a>), and a step can name what the finding found:{" "}
				<code>{"{{role|none}}"}</code> reads as the finding's <code>role</code>, from its{" "}
				<code>i18n.params</code> or <code>data.details</code>, and as <code>none</code> where there
				is no finding, on a procedures page. <code>definePack</code> refuses a placeholder without
				its text.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"meta.review = {",
					"  PRESENTATIONAL_ATTRIBUTE_UNSUPPORTED: {",
					"    steps: ['Find the element the report names, and read its {{attributes|aria-* attributes}}.'],",
					"    passWhen: 'The element is only for layout, and {{attributes|the attribute}} can be removed.',",
					"    failWhen: 'The element stands for a control, which role {{role|none}} hides.'",
					"  }",
					"};",
				]}
			/>
			<p>
				A rule says which facets of a criterion it tests in <code>meta.coverage.facetsBySc</code>{" "}
				(<code>{"{ '2.4.4': ['link-text-descriptive-evidence'] }"}</code>), and its steps then join
				that criterion's <a href="/conformance/procedures/">procedures</a> as core's do. A standard
				that judges core's rules by reason code can also give its own steps for a core rule's code,
				in <code>standard.review</code>: a finding only its profiles ask about reads them in place
				of core's, which name WCAG. Since core 1.16.0,{" "}
				<code>{"howToCheckFor(ruleId, code, locale, { packs, profile })"}</code> reads them the same
				way without a finding, and <code>reviewByVersion</code> gives each version of the standard
				steps of its own, so steps that name a requirement can follow the version's numbering.
			</p>

			<h3 id="procedures">How a person assesses it: procedures</h3>
			<p>
				Core says how a person assesses every WCAG criterion its rules evaluate by hand, facet by
				facet (see <a href="/conformance/procedures/">Test procedures</a>). Since core 1.15.0 a
				standard pack gives the same for its own requirements, in <code>standard.procedures</code>,
				by version and requirement, each with its <code>title</code>, in one of four forms:
			</p>
			<DataTable
				label="Forms of a requirement's procedures"
				rowKey="id"
				columns={[
					{ key: "form", label: "Form", width: "38%", wrap: true },
					{ key: "means", label: "What it means", wrap: true },
				]}
				rows={procedureFormRows}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"standard: {",
					"  // ...",
					"  procedures: {",
					"    '1.0': {",
					"      '4.2': { title: 'Images have a text alternative', wcag: '1.1.1' },",
					"      '7.1': {",
					"        title: 'Every form has a text version',",
					"        facets: [{",
					"          id: 'text-version',",
					"          label: 'Each form can be had as a text document',",
					"          automation: 'manual',              // full, partial or manual (the default)",
					"          tools: ['keyboard'],               // keyboard, pointer, screen-reader, zoom, contrast-theme, devtools",
					"          steps: ['Find each form on the page.', 'Look next to it for a link to a text version.'],",
					"          passWhen: 'Every form has a text version.',",
					"          failWhen: 'A form has no text version, which fails {{requirement}}.'",
					"        }]",
					"      }",
					"    }",
					"  }",
					"}",
				]}
			/>
			<p>
				Write a procedure for the whole page and for someone without accessibility training: one
				to eight short steps in a browser, with its developer tools, a keyboard and, where it
				matters, a screen reader, then what they see if it passes and if it fails.{" "}
				<code>{"{{requirement}}"}</code> is filled in with the standard's name and the requirement
				it is read as ("City Standard 7.1"). <code>surea11y-pack new --kind standard</code> writes{" "}
				<code>procedures.js</code> with an example of each form, and a test that every requirement
				of every version has a procedure for each of its facets; a standard that restates WCAG one
				for one gets the first form for every requirement from <code>ruleMappedStandard</code>.
			</p>
			<p>
				Since core 1.16.0, a facet also lists the core rules the standard's mapping sends to what
				it assesses, in its <code>rules</code> and its <code>mappedRules</code>, so a test only
				core's rules check no longer looks unchecked. A standard whose map links rules to
				something finer than its procedures' requirements, a criterion's tests say, names in each
				facet the ids its mapping uses, in <code>mappedRequirements</code>.
			</p>
			<p>
				A standard can also give <code>groups</code> (its themes or chapters, by version),{" "}
				<code>relatesTo</code> on a requirement of its own (the WCAG criteria it relates to without
				restating), and <code>notes</code> (what a reader should know before using a version's
				procedures). Its own text is written in one language, <code>lang</code>, English by
				default, and <code>translations</code> gives it in others, keyed by the text it translates,
				so a translation never outlives the text it was made from. A standard that declares its
				languages is read in one of them throughout, core's procedures included, so a page never
				mixes two; <code>packTranslationCoverage(pack)</code> says how far each translation goes.
				Core's <a href={`${core}/docs/PACKS.md#how-a-person-assesses-it-procedures`}>pack guide</a>{" "}
				on GitHub has every field and what <code>definePack</code> checks.
			</p>

			<h3 id="messages">Messages and languages</h3>
			<p>
				Each text a rule shows has a key, held per locale in <code>i18n/&lt;locale&gt;.json</code>{" "}
				and listed in the pack's <code>dictionaries</code>. A scan with{" "}
				<code>engineOptions.locale: 'fr'</code> shows the French ones; a locale the pack has no
				dictionary for shows English. A pack's keys are its own, starting with its namespace: a
				pack can't change a core message in a locale core ships.
			</p>
			<p>
				Since core 1.15.0 a rule's steps are translated the same way, under the keys core's steps
				use: the rule's prefix (its <code>titleKey</code> without <code>_title</code>),{" "}
				<code>_review_</code>, the reason code, then <code>{"step<n>"}</code>, <code>pass</code> or{" "}
				<code>fail</code>:
			</p>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					"  \"acmeLinkTextSpecific_review_GENERIC_LINK_NAME_step1\": \"Trouvez le lien que le rapport désigne.\",",
					"  \"acmeLinkTextSpecific_review_GENERIC_LINK_NAME_pass\": \"Le texte autour du lien dit où il mène.\",",
					"  \"acmeLinkTextSpecific_review_GENERIC_LINK_NAME_fail\": \"Rien près du lien ne dit où il mène, ce qui enfreint le critère 2.4.4 des WCAG.\"",
					"}",
				]}
			/>
			<p>
				A finding's <code>howToCheck</code> and the procedures show them in that locale, and in
				English each text the locale lacks. Since core 1.16.0, <code>checkPack</code> reports a
				dictionary that translates only part of an entry (some of its steps and not the others),
				which would have a person read its steps in two languages. For a locale core doesn't
				ship (<code>pt</code>), a pack's dictionary may also give core's keys, which translates
				core's rules, and its procedures, there.
			</p>
			<p>
				A standard's own steps for core's codes (<code>standard.review</code>) are translated
				under keys made of the standard's <code>key</code>, <code>_standardReview_</code>, the core
				rule's id and the reason code, then <code>{"step<n>"}</code>, <code>pass</code> or{" "}
				<code>fail</code> (<code>acme_standardReview_aria-valid-attr-value_ARIA_HASPOPUP_ROLE_MISMATCH_step1</code>);
				a finding reads them only where the dictionary translates the whole entry, and the English
				otherwise. These keys are <a href="#experimental">experimental</a> (core 1.16.0).
			</p>
			<p>
				<strong>Translations by id</strong> (core 1.16.0,{" "}
				<a href="#experimental">experimental</a>). <code>standard.texts</code> translates a standard
				per version by what each text is rather than by its wording (
				<code>requirements.4.2.title</code>, <code>groups.4.title</code>,{" "}
				<code>review.&lt;rule&gt;.&lt;CODE&gt;.steps</code>), so two texts worded alike can be
				translated apart and a version can word an id its own way. A text with its key in{" "}
				<code>texts</code> is read from there; one without, from <code>translations</code>, so a
				standard can move from one to the other text by text.
			</p>

			<h3 id="laws">The laws a standard is assessed under</h3>
			<p>
				Since core 1.16.0 (<a href="#experimental">experimental</a>), a standard can say which laws
				it serves in <code>standard.laws</code>, since one standard can serve more than one law,
				and each profile names the one it is for (<code>law</code>). Only <code>name</code> and{" "}
				<code>jurisdiction</code> are required; <code>appliesTo</code>, <code>exemptions</code>,{" "}
				<code>since</code>, <code>enforcement</code> and <code>sources</code> (https links only)
				describe it further, and <code>standard.lawTexts</code> translates them by id.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"laws: {",
					"  'city-public': {",
					"    name: 'City Accessibility Act, section 4',",
					"    jurisdiction: 'DE-BY',                 // 'FR', 'DE-BY', 'EU'…",
					"    appliesTo: 'Public bodies of the city',",
					"    sources: [{ title: 'Official journal', url: 'https://example.org/act' }]",
					"  }",
					"},",
					"profiles: { 'city-1.0': { version: '1.0', tags: ['city'], mappedRules: true, law: 'city-public' } }",
				]}
			/>
			<p>
				They are facts to show, never logic: <strong>core never decides whom a law applies
				to</strong>. Results name the profile's law (<code>engine.law</code>, see the{" "}
				<a href="/results-reports/output-schema/">output schema</a>), the{" "}
				<a href="/results-reports/html-report/">HTML report</a> shows it beside the profile,{" "}
				<code>{"listProcedures({ profile })"}</code> lists only the requirements that law asks for
				(a requirement only some of the laws ask for lists them in <code>laws</code>), and{" "}
				<code>describePacks</code> lists each standard's laws with the profiles that serve them.{" "}
				<code>lawOf(standard, id, locale)</code> from <code>@surea11y/core/pack</code> gives a law
				in a language. A standard derived from another names its own laws; it doesn't inherit them.
			</p>

			<h3 id="experimental">Experimental APIs</h3>
			<p>
				Core 1.16.0 marks some APIs experimental: they may change in a minor release, never in a
				patch, and become stable or are removed within two minors. Today those are standards as
				data, tests under requirements, standards built on others, translations by id and{" "}
				<code>reviewByVersion</code>, laws, the <code>_standardReview_</code> dictionary keys and{" "}
				<code>skip-link</code>'s <code>data.details.lean</code>, all experimental until 1.18.0.
				A pack that uses one declares a <code>core</code> range that takes no later minor (
				<code>'~1.16.0'</code>), since the next minor may change it: <code>checkPack</code> reports a
				wider one, and <code>describePacks</code> lists what each pack uses. Everything else on
				this page is stable across 1.x. Core's{" "}
				<a href={`${core}/docs/API_STABILITY.md#experimental-may-change-in-a-minor`}>API stability policy</a>{" "}
				on GitHub keeps the list.
			</p>

			<h3 id="test-lint-document">Test, lint and document it</h3>
			<ul>
				<li>
					<strong>Tests</strong> use <code>@surea11y/core/testing</code>, what core's own rule
					tests use: <code>runa11yCoreOnHtml(html, {"{ engineOptions }"})</code> scans HTML in jsdom,
					and <code>assertRule(result, ruleId, outcome)</code> checks a rule. With packs, the scan
					runs them both from the pack objects and as a page has them, so a rule that reads a
					variable from outside its function fails its test. It needs jsdom as a dev dependency.
				</li>
				<li>
					<strong>Checks</strong>: <code>definePack</code> throws, naming each problem, so the
					pack's own tests fail; <code>checkPack(pack)</code> returns the same list without
					throwing, with the installed core's version checked too. Both run a standard's own
					checks of its tables (<code>validate</code>) against core's rules and the pack's, as a
					scan does, so a version without its <code>wcagVersion</code>, or a finding sent to a
					requirement the table lacks, is refused there rather than making every scan skip the
					pack. Core 1.14.0 and later.
				</li>
				<li>
					<strong>Lint</strong> (<code>npm run lint</code>, <code>@surea11y/core/eslint-plugin</code>)
					holds the pack's rules to the lint rules core's are held to.
				</li>
				<li>
					<strong>Docs</strong> (<code>npm run docs</code>, <code>surea11y-pack docs</code>) write
					the pack's <code>docs/RULE_CATALOG.md</code> and run every example of its{" "}
					<code>docs/RULE_EXAMPLES.md</code> in Chromium (<code>CHROMIUM_EXECUTABLE_PATH</code>{" "}
					names another Chromium build); <code>--check</code> fails when either is stale, for the
					pack's CI.
				</li>
			</ul>

			<h3 id="publish">Publish it</h3>
			<p>
				The generated package is <code>private</code>. Choose its licence, set{" "}
				<code>license</code> and remove <code>private</code> in <code>package.json</code>, and{" "}
				<code>npm publish</code>. Keep <code>@surea11y/core</code> a peer dependency, with the range
				in <code>core</code>. Semver covers what a pack builds on: a pack written for core 1.11
				keeps working with later 1.x versions. For your own users, a rule's id and its reason codes
				are what their baselines hold: rename or remove one only in a major version of the pack.
			</p>
			<p>
				The full guide, from an empty folder to a published pack, is core's{" "}
				<a href={`${core}/docs/PACKS.md`}>
					<code>PACKS.md</code>
				</a>{" "}
				on GitHub, and every field is in the packs reference of{" "}
				<a href={`${core}/docs/ENGINE_OPTIONS.md#packs--rules-and-standards-from-outside-core`}>
					<code>ENGINE_OPTIONS.md</code>
				</a>
				.
			</p>
		</>
	);
}
