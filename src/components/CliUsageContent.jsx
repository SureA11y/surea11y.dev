import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

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
					{ text: "surea11y scan https://example.com/ --tags wcag2a,wcag2aa", command: true },
				]}
			/>
			<p>
				Requires Node.js <code>^20.19.0 || ^22.13.0 || &gt;=24.0.0</code>.
			</p>
			<CodeBlock
				lines={[
					"$ surea11y scan ./index.html",
					"",
					"surea11y scan: file:///path/to/index.html",
					"  pass: 6   fail: 3   cantTell: 4   notApplicable: 112",
					"",
					"  occurrences by tier: fail: 3   cantTell: 5",
					"",
					"FAIL (3 rule(s)):",
					"",
					"  contrast-minimum  (serious, 1 fail occurrence(s))",
					"    - html > body > main > p",
					"      Element has insufficient color contrast of 2.85:1 (foreground: #999999,",
					"      background: #ffffff, font size: 0px, font weight: normal). Expected",
					"      contrast ratio of 4.5:1 (normal text).",
					"",
					"cantTell — needs human review (4 rule(s)): contrast-computable, link-name-quality,",
					"manual-review, page-title-patterns",
				]}
			/>
			<h2>Limitations</h2>
			<p>
				<code>cantTell</code> never affects the exit code: <code>0</code> clean, <code>1</code>{" "}
				at least one — or, scanning with <code>--baseline</code>, one <em>new</em> — <code>fail</code>{" "}
				(the CI-gating case; see <a href="/conformance/baseline/">Baseline / allowlist</a> for what
				counts as "known" vs. "new"), <code>2</code> a usage/scan error.
				The CLI reads <strong>static HTML only</strong> — a local file, or the raw body of an
				HTTP(S) GET — and never executes page JavaScript. For client-rendered pages, use one of
				the bindings instead, or call the engine directly against a real, driven browser (see{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a> Pattern 2).
			</p>
			<p>
				Full flag reference, custom-rule contract, and CI recipes:{" "}
				<a href="https://github.com/SureA11y/cli/blob/main/docs/CLI.md"><code>docs/CLI.md</code></a>.
				For CI-pipeline templates specifically, see <a href="/configuration/ci-integration/">CI integration</a>.
			</p>
		</>
	);
}
