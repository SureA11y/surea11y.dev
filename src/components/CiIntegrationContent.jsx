import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function CiIntegrationContent() {
	return (
		<>
			<p>
				Ready-to-paste templates wrapping the{" "}
				<a href="https://github.com/SureA11y/cli#readme">CLI</a> (
				<code>npx @surea11y/cli scan ...</code>) in GitHub Actions, Bitbucket Pipelines, GitLab CI
				and Azure DevOps. If
				you're calling the library directly from your own Node script instead of the CLI, see{" "}
				<a href={`${core}/docs/INTEGRATION.md#ci-gating-a-build-on-the-result`}>
					<code>INTEGRATION.md</code>
				</a>{" "}
				instead — this page is specifically about the CLI as a pipeline step.
			</p>
			<p>
				The CLI scans static HTML: it doesn't run the page's JavaScript. That suits built or
				server-rendered pages; for a client-rendered app, or rules that need layout, scan in a
				browser through one of the <a href="/getting-started/">browser bindings</a> instead.
			</p>
			<p>
				All of these rely on the CLI's own exit codes (<code>0</code> clean, <code>1</code> at
				least one — or one <em>new</em>, with <code>--baseline</code> — <code>fail</code> outcome,{" "}
				<code>2</code> a usage/scan error) to gate the pipeline; no extra scripting is required
				for basic pass/fail gating. A green pipeline means no check failed, or no new one did. It
				is not a conformance claim, and <code>cantTell</code> findings don't fail it.
			</p>

			<h2>GitHub Actions</h2>
			<h3>Basic: gate on exit code</h3>
			<CodeBlock
				lang="yaml"
				lines={[
					"name: Accessibility scan",
					"on: [pull_request]",
					"",
					"jobs:",
					"  a11y-scan:",
					"    runs-on: ubuntu-latest",
					"    steps:",
					"      - uses: actions/checkout@v4",
					"      - uses: actions/setup-node@v4",
					"        with:",
					"          node-version: 22",
					"      - run: npm ci && npm run build   # produce whatever static HTML you're scanning",
					"      - run: npx @surea11y/cli scan ./dist/index.html",
				]}
			/>
			<p>
				This fails the job the moment any <code>fail</code> outcome is found. For an existing
				site with pre-existing violations, see the baseline variant below instead of disabling
				the step.
			</p>

			<h3>With a baseline (existing site, gate only on new violations)</h3>
			<CodeBlock
				lines={[
					"# Once, locally: record every current fail occurrence, commit the file.",
					{ text: "surea11y scan ./dist/index.html --write-baseline a11y-baseline.json", command: true },
					{ text: "git add a11y-baseline.json", command: true },
				]}
			/>
			<CodeBlock
				lang="yaml"
				lines={[
					"      - run: npm ci && npm run build",
					"      - run: npx @surea11y/cli scan ./dist/index.html --baseline a11y-baseline.json",
				]}
			/>
			<p>
				A baseline keeps known violations from failing the build; it doesn't make them
				acceptable. Fix them and shrink the file over time. See{" "}
				<a href="/conformance/baseline/">Baseline / allowlist</a> for what counts as "known"
				vs. "new," and how to regenerate the file as violations get fixed.
			</p>

			<h3>Uploading SARIF to GitHub Code Scanning</h3>
			<p>
				<code>upload-sarif</code> needs <code>security-events: write</code> permission and{" "}
				<strong>does not fail the job itself</strong> — pair it with a separate gating step (or{" "}
				<code>continue-on-error</code> + your own check) if you also want the build to fail on
				new violations.
			</p>
			<CodeBlock
				lang="yaml"
				lines={[
					"name: Accessibility scan",
					"on: [pull_request]",
					"",
					"permissions:",
					"  contents: read",
					"  security-events: write",
					"",
					"jobs:",
					"  a11y-scan:",
					"    runs-on: ubuntu-latest",
					"    steps:",
					"      - uses: actions/checkout@v4",
					"      - uses: actions/setup-node@v4",
					"        with:",
					"          node-version: 22",
					"      - run: npm ci && npm run build",
					"      - name: Scan (report, don't fail the job here)",
					"        run: npx @surea11y/cli scan ./dist/index.html --baseline a11y-baseline.json --sarif results.sarif",
					"        continue-on-error: true",
					"        id: scan",
					"      - name: Upload SARIF to Code Scanning",
					"        uses: github/codeql-action/upload-sarif@v3",
					"        with:",
					"          sarif_file: results.sarif",
					"      - name: Fail the job on new violations",
					"        if: steps.scan.outcome == 'failure'",
					"        run: exit 1",
				]}
			/>
			<p>
				See <a href="/results-reports/sarif-report/">the SARIF report format</a> and a known limitation: a
				scan of a <strong>local file</strong> in your checkout gets inline annotations in the Code
				Scanning UI; a scan of a <strong>live URL</strong> doesn't (SARIF/Code Scanning can only
				associate a finding with a real file in the repository).
			</p>

			<h2>Bitbucket Pipelines</h2>
			<p>
				Bitbucket Pipelines has no built-in SARIF-consuming dashboard equivalent to GitHub Code
				Scanning, so the CLI's exit code (plus, optionally, <code>--html</code> as a downloadable
				pipeline artifact) is the practical integration point rather than <code>--sarif</code>.
			</p>
			<CodeBlock
				lang="yaml"
				lines={[
					"pipelines:",
					"  pull-requests:",
					"    '**':",
					"      - step:",
					"          name: Accessibility scan",
					"          image: node:22",
					"          script:",
					"            - npm ci",
					"            - npm run build",
					"            - npx @surea11y/cli scan ./dist/index.html --baseline a11y-baseline.json --html a11y-report.html",
					"          artifacts:",
					"            - a11y-report.html",
				]}
			/>
			<p>
				The step fails the pipeline on the CLI's exit code exactly like any other{" "}
				<code>script</code> entry; <code>a11y-report.html</code> (see{" "}
				<a href="/results-reports/html-report/">the HTML report</a>) is attached as a downloadable build
				artifact so a reviewer can open it without re-running the scan locally.
			</p>

			<h2 id="junit-test-reports">JUnit test reports</h2>
			<p>
				GitLab, Azure DevOps, Jenkins and CircleCI show JUnit XML in their own test views: each
				WCAG criterion becomes a suite and each rule a test (see{" "}
				<a href="/results-reports/junit-report/">the JUnit report</a>). The CLI writes it with{" "}
				<code>--junit &lt;path&gt;</code> (<code>@surea11y/cli</code> 1.1.0 or later), from the
				same scan as its other outputs, and the report never changes its exit code, so the step
				still gates the build.
			</p>
			<h3>GitLab CI</h3>
			<CodeBlock
				lang="yaml"
				lines={[
					"a11y:",
					"  image: node:22",
					"  script:",
					"    - npm ci",
					"    - npm run build",
					"    - npx @surea11y/cli scan ./dist/index.html --junit a11y.junit.xml",
					"  artifacts:",
					"    when: always",
					"    reports:",
					"      junit: a11y.junit.xml",
				]}
			/>
			<p>
				<code>when: always</code> uploads the report even when the scan's exit code fails the job,
				which is exactly when the merge request widget is worth reading.
			</p>
			<h3>Azure DevOps</h3>
			<CodeBlock
				lang="yaml"
				lines={[
					"steps:",
					"  - script: |",
					"      npm ci",
					"      npm run build",
					"      npx @surea11y/cli scan ./dist/index.html --junit a11y.junit.xml",
					"    displayName: Accessibility scan",
					"  - task: PublishTestResults@2",
					"    condition: succeededOrFailed()",
					"    inputs:",
					"      testResultsFormat: JUnit",
					"      testResultsFiles: a11y.junit.xml",
				]}
			/>
			<p>
				<code>cantTell</code> rules arrive as skipped tests, never failures. With{" "}
				<code>--baseline</code>, failures already in the baseline are skipped tests too. To show{" "}
				<code>cantTell</code> rules as failures, the CLI has no flag: save the scan with{" "}
				<code>--json</code> and render it with{" "}
				<code>{"renderJunitReport(result, { cantTellAs: 'failure' })"}</code> from{" "}
				<code>@surea11y/core/junit</code> (see{" "}
				<a href="/results-reports/junit-report/">the JUnit report</a>), which needs{" "}
				<code>@surea11y/core</code> in the project's own <code>devDependencies</code>.{" "}
				<code>{"{ leanFailAs: 'failure' }"}</code> is the narrower choice: only the{" "}
				<code>cantTell</code> findings that{" "}
				<a href="/results-reports/output-schema/#leans">lean fail</a> become failures, each with
				why and the steps to confirm it. Either changes
				the report, not the CLI's exit code.
			</p>

			<h2>Free-tier/private-repo minute limits</h2>
			<p>
				If your pipeline provider's free tier is minute-limited (Bitbucket Pipelines' free tier is
				50 build-minutes/month on private workspaces, for example), a <code>jsdom</code>-based
				scan of static/server-rendered HTML (what the CLI does) is far cheaper than driving a
				real browser — see{" "}
				<a href="https://github.com/SureA11y/cli/blob/main/docs/CLI.md#what-it-can-and-cant-scan">
					the CLI docs
				</a>{" "}
				for what that trades away (no client-rendered content, no real CSS layout).
			</p>
		</>
	);
}
