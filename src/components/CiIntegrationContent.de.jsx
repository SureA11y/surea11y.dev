import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function CiIntegrationContent() {
	return (
		<>
			<p>
				Vorlagen zum direkten Einfügen, die die{" "}
				<a href="https://github.com/SureA11y/cli#readme">CLI</a> (
				<code>npx @surea11y/cli scan ...</code>) in <span lang="en">GitHub Actions</span>, <span lang="en">Bitbucket Pipelines</span>, <span lang="en">GitLab CI</span> und <span lang="en">Azure DevOps</span>{" "}
				einbinden. Wenn Sie die Bibliothek statt über die CLI direkt aus Ihrem eigenen
				Node-Skript aufrufen, lesen Sie stattdessen{" "}
				<a href={`${core}/docs/INTEGRATION.md#ci-gating-a-build-on-the-result`}>
					<code>INTEGRATION.md</code>
				</a>{" "}
				— diese Seite behandelt speziell die CLI als Pipeline-Schritt.
			</p>
			<p>
				Alle Vorlagen nutzen die Exit-Codes der CLI (<code>0</code> bestanden, <code>1</code>{" "}
				mindestens ein — bzw. mit <code>--baseline</code> mindestens ein <em>neues</em> —{" "}
				<code>fail</code>-Ergebnis, <code>2</code> ein Aufruf- oder Scan-Fehler), um die
				Pipeline zu steuern; für ein einfaches Bestanden/Nicht-bestanden-Gating ist kein
				zusätzliches Skript nötig.
			</p>

			<h2><span lang="en">GitHub Actions</span></h2>
			<h3>Einfach: Gating über den Exit-Code</h3>
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
					"          node-version: 20",
					"      - run: npm ci && npm run build   # produce whatever static HTML you're scanning",
					"      - run: npx @surea11y/cli scan ./dist/index.html",
				]}
			/>
			<p>
				Damit schlägt der Job fehl, sobald irgendein <code>fail</code>-Ergebnis gefunden wird.
				Für eine bestehende Website mit bereits vorhandenen Verstößen verwenden Sie die
				Baseline-Variante unten, statt den Schritt zu deaktivieren.
			</p>

			<h3>Mit Baseline (bestehende Website, Gating nur bei neuen Verstößen)</h3>
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
				Unter <a href="/conformance/baseline/">Baseline / Allowlist</a> erfahren Sie, was als
				„bekannt“ und was als „neu“ gilt und wie Sie die Datei neu erzeugen, während Verstöße
				behoben werden.
			</p>

			<h3>SARIF zu <span lang="en">GitHub Code Scanning</span> hochladen</h3>
			<p>
				<code>upload-sarif</code> benötigt die Berechtigung <code>security-events: write</code>{" "}
				und <strong>lässt den Job selbst nicht fehlschlagen</strong> — kombinieren Sie es mit
				einem separaten Gating-Schritt (oder <code>continue-on-error</code> plus eigener
				Prüfung), wenn der Build bei neuen Verstößen auch fehlschlagen soll.
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
					"          node-version: 20",
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
				Siehe <a href="/results-reports/sarif-report/">das SARIF-Berichtsformat</a> und eine
				bekannte Einschränkung: Der Scan einer <strong>lokalen Datei</strong> in Ihrem Checkout
				erhält Inline-Annotationen in der Code-Scanning-Oberfläche; der Scan einer{" "}
				<strong>Live-URL</strong> nicht (SARIF/<span lang="en">Code Scanning</span> kann einen Befund nur einer
				tatsächlichen Datei im Repository zuordnen).
			</p>

			<h2><span lang="en">Bitbucket Pipelines</span></h2>
			<p>
				<span lang="en">Bitbucket Pipelines</span> hat kein eingebautes Dashboard für SARIF, das mit <span lang="en">GitHub Code
				Scanning</span> vergleichbar wäre. Der praktische Integrationspunkt ist daher der Exit-Code der
				CLI (optional ergänzt um <code>--html</code> als herunterladbares Pipeline-Artefakt),
				nicht <code>--sarif</code>.
			</p>
			<CodeBlock
				lang="yaml"
				lines={[
					"pipelines:",
					"  pull-requests:",
					"    '**':",
					"      - step:",
					"          name: Accessibility scan",
					"          image: node:20",
					"          script:",
					"            - npm ci",
					"            - npm run build",
					"            - npx @surea11y/cli scan ./dist/index.html --baseline a11y-baseline.json --html a11y-report.html",
					"          artifacts:",
					"            - a11y-report.html",
				]}
			/>
			<p>
				Der Schritt lässt die Pipeline über den Exit-Code der CLI fehlschlagen, genau wie jeder
				andere <code>script</code>-Eintrag; <code>a11y-report.html</code> (siehe{" "}
				<a href="/results-reports/html-report/">den HTML-Bericht</a>) wird als herunterladbares
				Build-Artefakt angehängt, sodass jemand im Review ihn öffnen kann, ohne den Scan lokal
				erneut auszuführen.
			</p>

			<h2 id="junit-test-reports">JUnit-Testberichte</h2>
			<p>
				GitLab, Azure DevOps, Jenkins und CircleCI zeigen JUnit-XML in ihren eigenen Testansichten:
				Jedes WCAG-Kriterium wird zu einer Suite und jede Regel zu einem Test (siehe{" "}
				<a href="/results-reports/junit-report/">JUnit-Bericht</a>). Speichern Sie den Scan als JSON,
				erzeugen Sie den Bericht mit <code>@surea11y/core/junit</code> und behalten Sie den Exit-Code
				der CLI für das Gate. Der Render-Schritt braucht <code>@surea11y/core</code> in den eigenen{" "}
				<code>devDependencies</code> des Projekts.
			</p>
			<h3><span lang="en">GitLab CI</span></h3>
			<CodeBlock
				lang="yaml"
				lines={[
					"a11y:",
					"  image: node:20",
					"  script:",
					"    - npm ci",
					"    - npm run build",
					"    - npx @surea11y/cli scan ./dist/index.html --json > a11y-scan.json || scan_exit=$?",
					"    - node -e \"const fs = require('fs'); const { renderJunitReport } = require('@surea11y/core/junit'); fs.writeFileSync('a11y.junit.xml', renderJunitReport(JSON.parse(fs.readFileSync('a11y-scan.json', 'utf8'))))\"",
					"    - exit ${scan_exit:-0}",
					"  artifacts:",
					"    when: always",
					"    reports:",
					"      junit: a11y.junit.xml",
				]}
			/>
			<p>
				<code>when: always</code> lädt den Bericht auch dann hoch, wenn der Exit-Code des Scans den
				Job fehlschlagen lässt — also genau dann, wenn sich ein Blick in das Merge-Request-Widget
				lohnt.
			</p>
			<h3><span lang="en">Azure DevOps</span></h3>
			<CodeBlock
				lang="yaml"
				lines={[
					"steps:",
					"  - script: |",
					"      npm ci",
					"      npm run build",
					"      npx @surea11y/cli scan ./dist/index.html --json > a11y-scan.json || scan_exit=$?",
					"      node -e \"const fs = require('fs'); const { renderJunitReport } = require('@surea11y/core/junit'); fs.writeFileSync('a11y.junit.xml', renderJunitReport(JSON.parse(fs.readFileSync('a11y-scan.json', 'utf8'))))\"",
					"      exit ${scan_exit:-0}",
					"    displayName: Accessibility scan",
					"  - task: PublishTestResults@2",
					"    condition: succeededOrFailed()",
					"    inputs:",
					"      testResultsFormat: JUnit",
					"      testResultsFiles: a11y.junit.xml",
				]}
			/>
			<p>
				<code>cantTell</code>-Regeln erscheinen als übersprungene Tests, nie als Fehlschläge. Soll
				das Gate auch an ihnen scheitern, übergeben Sie <code>{"{ cantTellAs: 'failure' }"}</code>{" "}
				als zweites Argument an <code>renderJunitReport</code>; das ändert den Bericht, nicht den
				Exit-Code der CLI.
			</p>

			<h2>Minutenlimits bei Free-Tier und privaten Repositories</h2>
			<p>
				Wenn das Free-Tier Ihres Pipeline-Anbieters minutenbegrenzt ist (das Free-Tier von{" "}
				<span lang="en">Bitbucket Pipelines</span> umfasst zum Beispiel 50 Build-Minuten pro Monat für private
				Workspaces), ist ein <code>jsdom</code>-basierter Scan von statischem oder
				serverseitig gerendertem HTML (das, was die CLI macht) deutlich günstiger, als einen
				echten Browser zu steuern — in{" "}
				<a href="https://github.com/SureA11y/cli/blob/main/docs/CLI.md#what-it-can-and-cant-scan">
					der CLI-Dokumentation
				</a>{" "}
				steht, worauf Sie dabei verzichten (kein clientseitig gerenderter Inhalt, kein echtes
				CSS-Layout).
			</p>
		</>
	);
}
