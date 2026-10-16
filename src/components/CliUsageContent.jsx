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
					"  engine: @surea11y/core 1.12.0",
					"  pass: 15   fail: 4   cantTell: 4   notApplicable: 111",
					"",
					"  occurrences by tier: fail: 4   cantTell: 5",
					"",
					"FAIL (4 rule(s)):",
					"",
					"  img-alt-present  (serious, 1 fail occurrence(s))",
					"    - html > body > main > img",
					"      This <img> has no alt attribute.",
					"      hint: Add an alt attribute that says what the image shows, or alt=\"\" if",
					"      the image is purely decorative.",
					"",
					"cantTell — needs human review (4 rule(s)): contrast-computable, link-name-quality,",
					"manual-review, page-title-patterns",
					"",
					"criteria (WCAG 2.2):",
					"  fail       1.1.1 Non-text content: text alternatives; 1.4.3 Contrast: minimum;",
					"             1.4.6 Contrast: enhanced; 4.1.2 Name, role, value: accessible name",
					"  cantTell   2.1.1 Keyboard; 2.4.2 Page titled; 2.4.3 Focus order; 2.4.4 Link",
					"             Purpose (In Context); 2.4.7 Focus visible; 2.4.9 Link Purpose (Link Only)",
					"  pass       1.3.1 Info and Relationships; 2.2.2 Pause, Stop, Hide; 2.4.1 Bypass",
					"             Blocks; 3.1.1 Language of page; 4.1.2 Name, role, value: ARIA validity",
					"  notApplicable: 19",
					"  A criterion that passes here means the checks that ran found nothing in it, not",
					"  that the page conforms.",
				]}
			/>
			<p>
				The <code>criteria</code> block reads the same scan by WCAG criterion, the way people
				usually ask ("does it fail 1.4.3?"): <code>fail</code> first, then <code>cantTell</code>{" "}
				and <code>pass</code>, and a count of <code>notApplicable</code>. A passing criterion means
				the checks that ran found nothing in it, not that the page meets it: most criteria need a
				person to check them. The block never changes the exit code, and <code>--compact</code>{" "}
				shows it as counts.
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
					"  engine: @surea11y/core 1.12.0",
					"  WCAG level reported: AA",
					"  pass: 0   fail: 0   cantTell: 1   notApplicable: 0",
					"",
					"  occurrences by tier: fail: 0   cantTell: 2",
					"",
					"cantTell — needs human review (1 rule(s)): contrast-computable",
					"",
					"criteria (WCAG 2.2 AA):",
					"  cantTell   1.4.3 Contrast: minimum (partly checked: 1 of 2 checks not selected)",
					"  A criterion that passes here means the checks that ran found nothing in it, not",
					"  that the page conforms.",
				]}
			/>
			<p>
				1.4.3 is <em>partly checked</em>: its other check, <code>contrast-minimum</code>, wasn't
				selected, so its outcome covers only the check that ran. Rule ids and levels are read in any
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
				<code>cantTell</code> never affects the exit code: <code>0</code> clean, <code>1</code>{" "}
				at least one — or, scanning with <code>--baseline</code>, one <em>new</em> — <code>fail</code>{" "}
				(the CI-gating case; see <a href="/conformance/baseline/">Baseline / allowlist</a> for what
				counts as "known" vs. "new"), <code>2</code> a usage or scan error, or a scan that would
				have checked nothing or less than asked: a <code>--rules</code>/<code>--tags</code> list
				naming no known rule or tag, a <code>--context</code> selector that matches nothing, a
				custom rule or a pack that didn't run, a <code>--profile</code> that wasn't applied. The
				CLI reads <strong>static HTML only</strong> — a local file, or the raw body of an HTTP(S)
				GET — and never executes page JavaScript. For client-rendered pages, use one of the
				bindings instead, or call the engine directly against a real, driven browser (see{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a> Pattern 2).
			</p>
			<p>
				Full flag reference, custom-rule contract, packs and CI recipes:{" "}
				<a href={cliDocs}><code>docs/CLI.md</code></a>. For CI-pipeline templates specifically, see{" "}
				<a href="/configuration/ci-integration/">CI integration</a>.
			</p>
		</>
	);
}
