import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function CliUsageContent() {
	return (
		<>
			<p>
				Ein Befehl statt Code — kein Test-Framework und kein Node-Skript nötig, gut geeignet als
				Pipeline-Schritt oder für eine schnelle Prüfung eines Build-Artefakts.
			</p>

			<h2>Erster Scan</h2>
			<CodeBlock
				lines={[
					{ text: "npm install -g @surea11y/cli", command: true },
					{ text: "surea11y scan ./index.html", command: true },
					{ text: "surea11y scan https://example.com/ --tags wcag2a,wcag2aa", command: true },
				]}
			/>
			<p>
				Erfordert Node.js <code>^20.19.0 || ^22.13.0 || &gt;=24.0.0</code>.
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
			<h2>Einschränkungen</h2>
			<p>
				<code>cantTell</code> beeinflusst den Exit-Code nie: <code>0</code> bestanden,{" "}
				<code>1</code> mindestens ein — bzw. beim Scannen mit <code>--baseline</code> mindestens
				ein <em>neues</em> — <code>fail</code> (der Fall für CI-Gating; unter{" "}
				<a href="/conformance/baseline/">Baseline / Allowlist</a> steht, was als „bekannt“ und was
				als „neu“ gilt), <code>2</code> ein Aufruf- oder Scan-Fehler. Die CLI liest{" "}
				<strong>nur statisches HTML</strong> — eine lokale Datei oder den rohen Body eines
				HTTP(S)-GET — und führt nie JavaScript der Seite aus. Für clientseitig gerenderte Seiten
				verwenden Sie stattdessen eines der Bindings oder rufen die Engine direkt in einem
				echten, gesteuerten Browser auf (siehe{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a> <span lang="en">Pattern 2</span>).
			</p>
			<p>
				Vollständige Referenz der Flags, Vertrag für eigene Regeln und CI-Rezepte:{" "}
				<a href="https://github.com/SureA11y/cli/blob/main/docs/CLI.md"><code>docs/CLI.md</code></a>.
				Fertige Vorlagen für CI-Pipelines finden Sie unter{" "}
				<a href="/configuration/ci-integration/">CI-Integration</a>.
			</p>
		</>
	);
}
