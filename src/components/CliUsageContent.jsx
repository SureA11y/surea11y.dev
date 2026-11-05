import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";
const cliDocs = "https://github.com/SureA11y/cli/blob/main/docs/CLI.md";

export function CliUsageContent() {
	return (
		<>
			<p>
				A command instead of code — no test framework or Node script required, good for a
				pipeline step or a quick check against a build artifact.
			</p>

			<h2>First scan</h2>
			<CodeBlock
				lines={[
					{ text: "npm install -g @surea11y/cli", command: true },
					{ text: "surea11y scan ./index.html", command: true },
					{ text: "surea11y scan https://example.com/ --wcag 2.2", command: true },
				]}
			/>
			<p>
				Requires Node.js <code>^20.19.0 || ^22.13.0 || &gt;=24.0.0</code>. The summary names the{" "}
				<code>@surea11y/core</code> release that ran the scan:
			</p>
			<CodeBlock
				lines={[
					"$ surea11y scan ./index.html",
					"",
					"surea11y scan: file:///path/to/index.html",
					"  engine: @surea11y/core 1.15.0",
					"  pass: 16   fail: 4   cantTell: 4   notApplicable: 121",
					"",
					"  occurrences by tier: fail: 4   cantTell: 4",
					"  needs review: likely fail: 1   likely pass: 0   needs a person: 3",
					"",
					"FAIL (4 rule(s)):",
					"",
					"  button-name-present  (serious, 1 fail occurrence(s))",
					"    - html > body > main > button",
					"      This button has no accessible name.",
					"      hint: Give the button visible text, or name it with aria-label, so screen",
					"      reader users know what it does.",
					"",
					"  contrast-enhanced  (serious, 1 fail occurrence(s))",
					"    - html > body > main > p",
					"      Element has insufficient color contrast (AAA) of 2.85:1 (foreground:",
					"      #999999, background: #ffffff, font size: 16px, font weight: normal).",
					"      Expected contrast ratio of 7:1 (normal text).",
					"      hint: Change the text color, the background color, or both, so the",
					"      contrast ratio reaches at least 7:1.",
					"",
					"  contrast-minimum  (serious, 1 fail occurrence(s))",
					"    - html > body > main > p",
					"      Element has insufficient color contrast of 2.85:1 (foreground: #999999,",
					"      background: #ffffff, font size: 16px, font weight: normal). Expected",
					"      contrast ratio of 4.5:1 (normal text).",
					"      hint: Change the text color, the background color, or both, so the",
					"      contrast ratio reaches at least 4.5:1.",
					"",
					"  img-alt-present  (serious, 1 fail occurrence(s))",
					"    - html > body > main > img",
					"      This <img> has no alt attribute.",
					"      hint: Add an alt attribute that says what the image shows, or alt=\"\" if",
					"      the image is purely decorative.",
					"",
					"LIKELY FAIL — confirm (1 occurrence(s)):",
					"  - heading-order (minor): html > body > main > h3",
					"    This heading jumps from level 1 to level 3, skipping a level.",
					"    why: The heading skips a level after the one before it.",
					"",
					"cantTell — needs human review (4 rule(s)): heading-order, link-name-quality,",
					"manual-review, page-title-patterns",
					"",
					"criteria (WCAG 2.2):",
					"  fail       1.1.1 Non-text content: text alternatives; 1.4.3 Contrast: minimum;",
					"             1.4.6 Contrast: enhanced; 4.1.2 Name, role, value: accessible name",
					"  cantTell   1.2.1 Audio-only and video-only (prerecorded): transcript; 1.2.2",
					"             Captions (Prerecorded); 1.3.1 Info and Relationships; 1.3.4",
					"             Orientation; 1.3.5 Identify Input Purpose; 1.4.1 Use of Color;",
					"             1.4.2 Audio Control; 1.4.4 Resize Text; 1.4.5 Images of Text;",
					"             1.4.12 Text Spacing; 2.1.1 Keyboard; 2.1.3 Keyboard (No Exception);",
					"             2.2.1 Timing Adjustable; 2.2.2 Pause, Stop, Hide; 2.2.4",
					"             Interruptions; 2.4.1 Bypass Blocks; 2.4.2 Page titled; 2.4.3 Focus",
					"             order; 2.4.4 Link Purpose (In Context); 2.4.6 Headings and Labels;",
					"             2.4.7 Focus visible; 2.4.9 Link Purpose (Link Only); 2.5.8 Target",
					"             size: minimum; 3.1.1 Language of page; 3.1.2 Language of Parts;",
					"             3.2.5 Change on Request; 3.3.1 Error Identification; 3.3.2 Labels",
					"             or Instructions; 3.3.8 Accessible Authentication (Minimum); 4.1.2",
					"             Name, role, value: ARIA validity; 4.1.3 Status Messages",
					"  notApplicable: 2",
					"  A criterion that passes here means the checks that ran found nothing in it,",
					"  not that the page conforms.",
				]}
			/>
			<p>
				The <code>needs review</code> line sorts the questions by what a reviewer does with them:{" "}
				<em>likely fail</em> (the page's evidence points to a failure, as with the skipped heading
				level here), <em>likely pass</em>, and <em>needs a person</em>. The likely failures are
				listed with the reason each leans that way, and every question in <code>--json</code> and
				in the reports carries the steps to answer it (<code>howToCheck</code>).
			</p>
			<p>
				The <code>criteria</code> block reads the same scan by WCAG criterion, the way people
				usually ask ("does it fail 1.4.3?"): <code>fail</code> first, then <code>cantTell</code>,
				and a count of <code>notApplicable</code>. Since <code>@surea11y/core</code> 1.14 no
				criterion is listed as <code>pass</code>: one passes only when its rules check everything it
				asks, and none is listed as checked in full yet, so where its rules all pass it's{" "}
				<code>cantTell</code>, for a person to check the rest. The block never changes the exit
				code, and <code>--compact</code> shows it as counts. With no failing rule, the summary ends
				by saying that this is no claim the page conforms, and names what a person still checks.
			</p>

			<h2 id="several-pages">Several pages, or a sitemap</h2>
			<p>
				Name several pages, list them in a file (one path or URL per line, with <code>#</code>{" "}
				comments), or point the scan at a sitemap:
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html ./dist/pricing.html", command: true },
					{ text: "surea11y scan --urls pages.txt", command: true },
					{ text: "surea11y scan --sitemap https://example.com/sitemap.xml   # up to 50 pages; --max-pages to change it", command: true },
				]}
			/>
			<p>
				Each page gets its own section of the summary, a last line counts the pages with failures,
				and the run fails when any page does. <code>--json</code> prints an array,{" "}
				<code>--sarif</code> and <code>--junit</code> write one file covering every page,{" "}
				<code>--html</code> writes a report per page (<code>report.html</code>,{" "}
				<code>report-2.html</code>…), and a baseline remembers which page each known failure was
				on. A sitemap can be a URL or a local file, plain or gzipped, and a sitemap index is
				followed one level down. A page that can't be scanned stops the run with exit{" "}
				<code>2</code>, naming it, before anything is written.
			</p>

			<h2 id="in-a-real-browser">In a real browser</h2>
			<p>
				By default the CLI reads static HTML. For pages whose content their JavaScript renders,
				install Playwright in your project and add <code>--browser</code>: each page opens in
				headless Chromium, its scripts run, and the scan sees what renders, with a real layout for
				the rules that measure it. The engine is the same <code>@surea11y/core</code>, and every
				option works with it, reports, baselines, packs and custom rules included.
			</p>
			<CodeBlock
				lines={[
					{ text: "npm install --save-dev playwright", command: true },
					{ text: "npx playwright install chromium", command: true },
					{ text: "surea11y scan https://app.example.com/ https://app.example.com/settings --browser", command: true },
				]}
			/>
			<p>
				An app that fetches its data after loading can make the scan wait for it, and a page can be
				scanned at a phone's width, in dark mode, or in every combination of several:
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan https://app.example.com/orders --browser --wait-for \"#orders-table\"", command: true },
					{ text: "surea11y scan https://example.com/ --browser --width 320 --color-scheme dark", command: true },
					{ text: "surea11y scan https://example.com/ --browser --width 1280,320 --color-scheme light,dark", command: true },
				]}
			/>
			<p>
				<code>--wait-for</code> waits up to 30 seconds (<code>--wait-timeout</code> changes that)
				and stops the run with exit <code>2</code> if the element never shows. Several widths or
				color schemes load the page once and merge the scans into one result per page: a rule's
				worst outcome, and each finding once, with the combinations it was seen in (
				<code>seen in:</code>).
			</p>
			<p>
				Before each page loads, the CLI installs core's internals and listener hooks, so the scan
				judges names that web components set through <code>ElementInternals</code>, and click
				handlers added from script: a <code>role="button"</code> that Enter and Space never reach
				fails. <code>--live-regions</code> adds the live-region hook, so a status message added
				with its text already in it, which screen readers commonly don't announce, is asked about;{" "}
				<code>--no-hooks</code> leaves the first two out. The summary names the viewport, color
				scheme and hooks each scan used. The CLI doesn't click, type or log in: for content that
				only appears after that, drive the browser with one of the bindings. Frames inside the page
				aren't scanned yet.
			</p>

			<h2 id="choosing-what-runs">Choosing what runs</h2>
			<p>
				<code>--wcag</code> selects the rules for a WCAG conformance target, by the level each
				criterion has in that version; <code>--wcag-level</code> sets its level (<code>AA</code>{" "}
				unless it says otherwise). <code>--best-practices</code> adds the rules that test no WCAG
				criterion, such as <code>region</code> and <code>heading-order</code>; on its own it runs
				only those. <code>--profile</code> runs a conformance profile, such as{" "}
				<code>en301549-v4.1.1</code> or a pack's own.
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --wcag 2.2                    # WCAG 2.2, Level A and AA", command: true },
					{ text: "surea11y scan ./dist/index.html --wcag 2.1 --wcag-level A     # WCAG 2.1, Level A", command: true },
					{ text: "surea11y scan ./dist/index.html --wcag 2.2 --best-practices   # and the best practices", command: true },
				]}
			/>
			<p>
				4.1.1 Parsing, which WCAG 2.2 removed, is part of a <code>2.1</code> target and not of a{" "}
				<code>2.2</code> one. <code>--rules</code> and <code>--tags</code> add to a target's
				rules, and <code>--exclude-rules</code> applies after. Beside <code>--profile</code>,{" "}
				<code>--best-practices</code> adds its rules and the profile still applies;{" "}
				<code>--wcag</code>, <code>--rules</code> and <code>--tags</code> choose the rules in a
				profile's place, so <code>--profile</code> with any of them exits <code>2</code>. These map
				onto <code>runOnly.wcag</code>, <code>runOnly.bestPractices</code> and{" "}
				<code>engineOptions.profile</code> (see{" "}
				<a href="/configuration/engine-options/#selecting-which-rules-run">Engine options</a>).
			</p>

			<h2 id="naming-checks">Naming the checks yourself</h2>
			<p>
				Given both, <code>--rules</code> and <code>--tags</code> run the rules that match both.
				To say "this area, plus these checks" instead, pass <code>--include-mode or</code>, which
				runs the rules that match either. Without it, the scan below runs no rule, since{" "}
				<code>contrast-computable</code> isn't tagged <code>forms</code>, and exits <code>2</code>{" "}
				rather than pass on nothing.
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/form.html --tags forms --rules contrast-computable --include-mode or", command: true },
				]}
			/>
			<p>
				A scan that names checks reports the WCAG criteria they belong to, at every level.{" "}
				<code>contrast-computable</code> checks 1.4.3 (AA) and 1.4.6 (AAA), so a site that meets AA
				can show a failing AAA criterion it never aimed for. Without <code>--wcag</code>,{" "}
				<code>--wcag-level</code> sets the level of the criteria reported, without changing which
				rules run:
			</p>
			<CodeBlock
				lines={[
					"$ surea11y scan ./index.html --rules contrast-computable --wcag-level AA",
					"",
					"surea11y scan: file:///path/to/index.html",
					"  engine: @surea11y/core 1.15.0",
					"  WCAG level reported: AA",
					"  pass: 1   fail: 0   cantTell: 0   notApplicable: 0",
					"",
					"  occurrences by tier: fail: 0   cantTell: 0",
					"",
					"criteria (WCAG 2.2 AA):",
					"  cantTell   1.4.3 Contrast: minimum (partly checked: 1 of 2 checks not selected)",
					"  A criterion that passes here means the checks that ran found nothing in it,",
					"  not that the page conforms.",
					"",
					"No rule failed, which is not a claim that the page conforms: the automated rules",
					"found nothing definite. A person still checks the cantTell findings, keyboard",
					"use, how a screen reader reads the page, and the content itself.",
				]}
			/>
			<p>
				1.4.3 is <em>partly checked</em>: its other check, <code>contrast-minimum</code>, wasn't
				selected, so its outcome covers only the check that ran, and since no rule failed, the
				summary ends with the reminder that this is no claim the page conforms. Rule ids and levels are read in any
				case (<code>--rules IMG-ALT-PRESENT</code>, <code>--wcag-level aa</code>).{" "}
				<code>--include-mode</code> maps onto <code>engineOptions.includeMode</code>, and{" "}
				<code>--wcag-level</code> without <code>--wcag</code> onto{" "}
				<code>engineOptions.wcagLevel</code>.
			</p>

			<h2 id="packs">Packs</h2>
			<p>
				<code>--pack</code> loads a <a href="/configuration/packs/">pack</a> (rules, a standard or
				a checklist, and their profiles) by package name, resolved from the working directory's
				project, or by path; <code>--profile</code> runs one of its profiles. Repeat{" "}
				<code>--pack</code> to scan with several.
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --pack @acme/a11y-policy --profile acme-web-2026", command: true },
					{ text: "surea11y scan ./dist/index.html --pack ./acme-policy-pack.js --profile acme-web-2026", command: true },
				]}
			/>
			<p>
				The summary names the profile and the packs that ran, and <code>--json</code> has them as{" "}
				<code>engine.profile</code> and <code>engine.packs</code>. A pack that can't be found or
				loaded, or that the engine skips, exits <code>2</code> with no report written, so a scan
				never passes with the pack's checks unrun.
			</p>

			<h2 id="several-profiles">Several profiles</h2>
			<p>
				<code>--profile</code> can be given more than once, to judge each page by several profiles
				at once, a pack's beside WCAG's or another pack's (<code>@surea11y/cli</code> 1.5.0, core
				1.15.0 and later):
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --pack @surea11y/pack-wai-aria --profile wcag22-aa --profile wai-aria-1.2", command: true },
				]}
			/>
			<p>
				Each profile judges the page as it would alone, and the result reads as one profile with
				the rules of all: a rule's outcome is the worst its profiles give it, so a failure under
				any profile exits <code>1</code>, and each finding's <code>verdicts</code> in{" "}
				<code>--json</code> say what each profile makes of it (see{" "}
				<a href="/results-reports/output-schema/#several-profiles">Output schema</a>). The summary
				lists them (<code>profiles: wcag22-aa, wai-aria-1.2</code>), <code>--html</code> names
				each and shows each one's verdict on a finding, and <code>--sarif</code> and{" "}
				<code>--junit</code> gate on the worst outcome. A profile that didn't run exits{" "}
				<code>2</code>, listed with why; <code>--allow-profiles-not-run</code> makes it a warning,
				except for a profile whose pack the engine skipped, since the skipped pack exits{" "}
				<code>2</code> itself.
			</p>

			<h2 id="failing-only-on-serious-problems">Failing only on serious problems</h2>
			<p>
				<code>--fail-on-severity</code> (<code>critical</code>, <code>serious</code>,{" "}
				<code>moderate</code> or <code>minor</code>) fails the run only on failing rules at that
				severity or above; with <code>--baseline</code>, only on new ones. Every failure is still
				reported, and the summary marks those below the level, so a team can start by blocking on
				serious problems and tighten the gate as the backlog shrinks.
			</p>
			<CodeBlock lines={[{ text: "surea11y scan --urls pages.txt --fail-on-severity serious", command: true }]} />

			<h2 id="questions-that-likely-fail">Questions that likely fail</h2>
			<p>
				<code>--fail-on-lean</code> also fails the run on the questions that likely fail (core's{" "}
				<code>leaningFailures()</code>), at or above <code>--fail-on-severity</code>'s level when
				you give one; <code>--lean-fail-wcag-only</code> counts only those of rules mapped to a
				WCAG criterion, leaving out the best practices. With it, <code>--junit</code> reports such
				a rule as a failing test and <code>--sarif</code> such a finding as an <code>error</code>,
				and <code>--write-baseline</code> records today's likely failures too, so{" "}
				<code>--baseline</code> gates only on new ones. It's opt-in because a lean is evidence, not
				proof: whether a finding leans, and which way, may change in a minor release of core.
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --fail-on-lean --lean-fail-wcag-only", command: true },
					{ text: "surea11y scan ./dist/index.html --fail-on-lean --write-baseline baseline.json   # once, commit it", command: true },
					{ text: "surea11y scan ./dist/index.html --fail-on-lean --baseline baseline.json         # in CI, from then on", command: true },
				]}
			/>

			<h2 id="manual-checks">Manual checks</h2>
			<p>
				A scan decides what rules can decide. <code>--manual-checks &lt;path&gt;</code> writes,
				next to it, the rest: a worksheet of the checks no rule decides in full, for a person to do
				by hand, with the steps for each, what passes and what fails, and a result and notes to
				record (core's <a href="/conformance/procedures/">test procedures</a>). With{" "}
				<code>--html</code>, whose report now ends with “What's left for a person”, the team has
				both halves of the assessment from one run:
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan https://example.com/ --wcag 2.2 --html report.html --manual-checks manual-checks.html", command: true },
				]}
			/>
			<ul>
				<li>
					<strong>For which standard:</strong> the one scanned. A pack's profile gives that
					standard and version, under its own numbers, where the pack gives procedures; otherwise
					WCAG, at the version and level of <code>--wcag</code> and <code>--wcag-level</code>, or of{" "}
					<code>--profile</code>'s target, and WCAG 2.2 A and AA by default. With several{" "}
					<code>--profile</code>, one worksheet per standard and version.
				</li>
				<li>
					<strong>In which language:</strong> <code>--locale</code>'s. A path ending in{" "}
					<code>.md</code> writes Markdown instead, with a task item per check.
				</li>
				<li>
					<strong>Several pages:</strong> one worksheet per page, numbered as <code>--html</code>'s
					are, each titled with its page, so each page's results stay apart.
				</li>
			</ul>
			<p>
				It never changes the exit code. Open the worksheet from disk, record each result and
				notes, and download them as JSON, with each criterion's result rolled up from its checks,
				or as CSV.
			</p>

			<h2 id="procedures">Procedures, with no scan</h2>
			<p>
				<code>surea11y procedures</code> writes how a person assesses each requirement of a
				standard by hand, with no scan: a reference to read, or a worksheet to work through (
				<code>--checklist</code>), in HTML, Markdown or JSON.
			</p>
			<CodeBlock
				lines={[
					"# How to assess every WCAG 2.2 A and AA criterion, as a page",
					{ text: "surea11y procedures --wcag 2.2 --wcag-level AA -o wcag-22-aa.html", command: true },
					"",
					"# A worksheet for a manual audit, titled for it",
					{ text: 'surea11y procedures --wcag-level AA --checklist --title "Audit: example.com" -o audit.html', command: true },
					"",
					"# Only what no rule decides in full, as Markdown for a repository",
					{ text: "surea11y procedures --wcag-level AA --automation manual,partial -o left-to-a-person.md", command: true },
					"",
					"# What needs a screen reader, for a session with a person who uses one",
					{ text: "surea11y procedures --wcag-level AA --tools screen-reader -o screen-reader-session.html", command: true },
					"",
					"# One criterion, in French, with the steps a scan's questions give",
					{ text: "surea11y procedures 1.4.12 --locale fr --variants -o 1.4.12.html", command: true },
					"",
					"# A pack's standard, under its own numbers",
					{ text: "surea11y procedures --pack @surea11y/pack-en301549 --profile en301549-v4.1.1 --checklist -o en-301-549.html", command: true },
				]}
			/>
			<p>
				<code>--standard</code> and <code>--standard-version</code> name a pack's standard by key
				and version, <code>--rules</code> keeps only what some rules test, <code>--no-record</code>{" "}
				gives a worksheet with nothing to record, and <code>--json</code> the data instead of a
				page. A scan's options are a usage error here, as these are on <code>scan</code>. See{" "}
				<a href={`${cliDocs}#procedures-how-to-assess-by-hand`}>the CLI reference</a> on GitHub for
				every flag.
			</p>

			<h2 id="compact-results">Compact results</h2>
			<p>
				<code>--compact</code> keeps each <code>pass</code> and <code>notApplicable</code> result
				to its rule, outcome and type (<code>engineOptions.output.detail: 'findings'</code>): a
				smaller <code>--json</code>, for a result kept as a CI artifact. The summary, the exit code,
				the baseline and the HTML, SARIF and JUnit reports are the same as without it.
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --compact --json > result.json", command: true }]} />

			<h2>Exit codes and limitations</h2>
			<p>
				<code>cantTell</code> doesn't affect the exit code unless you pass{" "}
				<code>--fail-on-lean</code>: <code>0</code> clean, <code>1</code> at least one — or,
				scanning with <code>--baseline</code>, one <em>new</em> — <code>fail</code> on some page
				(the CI-gating case; <code>--fail-on-severity</code> counts only those at its level or
				above; see <a href="/conformance/baseline/">Baseline / allowlist</a> for what counts as
				"known" vs. "new"), <code>2</code> a usage or scan error, or a scan that would have checked
				nothing or less than asked: a <code>--rules</code>/<code>--tags</code> list naming no known
				rule or tag, a <code>--context</code> selector that matches nothing, a custom rule or a
				pack that didn't run, a <code>--profile</code> that wasn't applied (with several, one that
				didn't run, unless <code>--allow-profiles-not-run</code>). A baseline written by the
				minor release before keeps matching findings whose reason codes moved since;{" "}
				<code>--migrate-baseline baseline.json</code> rewrites it under the new codes (see{" "}
				<a href="/conformance/baseline/#upgrading">Upgrading</a>).
			</p>
			<p>
				Without <code>--browser</code>, the CLI reads <strong>static HTML only</strong> — a local
				file, or the raw body of an HTTP(S) GET — and never executes page JavaScript. Neither mode
				clicks, types or logs in: for content that only appears after that, use one of the
				bindings, or call the engine directly against a browser you drive (Pattern 2 in{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>, the integration
				guide on GitHub).
			</p>
			<p>
				Full flag reference, custom-rule contract, packs and CI recipes:{" "}
				<a href={cliDocs}><code>docs/CLI.md</code></a>. For CI-pipeline templates specifically, see{" "}
				<a href="/configuration/ci-integration/">CI integration</a>.
			</p>
		</>
	);
}
