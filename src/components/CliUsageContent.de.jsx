import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";
const cliDocs = "https://github.com/SureA11y/cli/blob/main/docs/CLI.md";

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
					{ text: "surea11y scan https://example.com/ --wcag 2.2", command: true },
				]}
			/>
			<p>
				Erfordert Node.js <code>^20.19.0 || ^22.13.0 || &gt;=24.0.0</code>. Die Zusammenfassung
				nennt das Release von <code>@surea11y/core</code>, das den Scan ausgeführt hat:
			</p>
			<CodeBlock
				lines={[
					"$ surea11y scan ./index.html",
					"",
					"surea11y scan: file:///path/to/index.html",
					"  engine: @surea11y/core 1.11.1",
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
				]}
			/>

			<h2 id="choosing-what-runs">Auswählen, was läuft</h2>
			<p>
				<code>--wcag</code> wählt die Regeln für ein WCAG-Konformitätsziel aus, nach der Stufe, die
				jedes Kriterium in dieser Version hat; <code>--wcag-level</code> legt die Stufe fest
				(<code>AA</code>, sofern nichts anderes angegeben ist). <code>--best-practices</code>{" "}
				ergänzt die Regeln, die kein WCAG-Kriterium prüfen, etwa <code>region</code> und{" "}
				<code>heading-order</code>; allein angegeben führt es nur diese aus. <code>--profile</code>{" "}
				führt ein Konformitätsprofil aus, etwa <code>en301549-v4.1.1</code> oder das eines Packs.
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --wcag 2.2                    # WCAG 2.2, Level A and AA", command: true },
					{ text: "surea11y scan ./dist/index.html --wcag 2.1 --wcag-level A     # WCAG 2.1, Level A", command: true },
					{ text: "surea11y scan ./dist/index.html --wcag 2.2 --best-practices   # and the best practices", command: true },
				]}
			/>
			<p>
				4.1.1 Syntaxanalyse, das WCAG 2.2 entfernt hat, gehört zu einem Ziel <code>2.1</code>, nicht
				aber zu einem Ziel <code>2.2</code>. <code>--rules</code> und <code>--tags</code> ergänzen
				die Regeln eines Ziels, und <code>--exclude-rules</code> wirkt danach. Neben{" "}
				<code>--profile</code> ergänzt <code>--best-practices</code> seine Regeln, und das Profil
				gilt weiterhin; <code>--wcag</code>, <code>--rules</code> und <code>--tags</code> wählen die
				Regeln anstelle eines Profils, daher endet <code>--profile</code> zusammen mit einem davon
				mit Exit-Code <code>2</code>. Sie entsprechen <code>runOnly.wcag</code>,{" "}
				<code>runOnly.bestPractices</code> und <code>engineOptions.profile</code> (siehe{" "}
				<a href="/configuration/engine-options/#selecting-which-rules-run">Engine-Optionen</a>).
			</p>

			<h2 id="packs">Packs</h2>
			<p>
				<code>--pack</code> lädt ein <a href="/configuration/packs/">Pack</a> (Regeln, eine Norm
				oder eine Checkliste und deren Profile) über den Paketnamen, aufgelöst aus dem Projekt des
				Arbeitsverzeichnisses, oder über einen Pfad; <code>--profile</code> führt eines seiner
				Profile aus. Wiederholen Sie <code>--pack</code>, um mit mehreren zu scannen.
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --pack @acme/a11y-policy --profile acme-web-2026", command: true },
					{ text: "surea11y scan ./dist/index.html --pack ./acme-policy-pack.js --profile acme-web-2026", command: true },
				]}
			/>
			<p>
				Die Zusammenfassung nennt das Profil und die Packs, die gelaufen sind, und{" "}
				<code>--json</code> enthält sie als <code>engine.profile</code> und{" "}
				<code>engine.packs</code>. Ein Pack, das sich nicht finden oder laden lässt oder das die
				Engine überspringt, endet mit Exit-Code <code>2</code>, ohne dass ein Bericht geschrieben
				wird, sodass ein Scan nie besteht, während die Prüfungen des Packs nicht gelaufen sind.
			</p>

			<h2 id="compact-results">Kompakte Ergebnisse</h2>
			<p>
				<code>--compact</code> reduziert jedes <code>pass</code>- und{" "}
				<code>notApplicable</code>-Ergebnis auf Regel, Ergebnis und Typ
				(<code>engineOptions.output.detail: 'findings'</code>): ein kleineres <code>--json</code>{" "}
				für ein Ergebnis, das als CI-Artefakt aufbewahrt wird. Zusammenfassung, Exit-Code, Baseline
				sowie HTML-, SARIF- und JUnit-Berichte sind dieselben wie ohne die Option.
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --compact --json > result.json", command: true }]} />

			<h2>Exit-Codes und Einschränkungen</h2>
			<p>
				<code>cantTell</code> beeinflusst den Exit-Code nie: <code>0</code> bestanden,{" "}
				<code>1</code> mindestens ein — bzw. beim Scannen mit <code>--baseline</code> mindestens
				ein <em>neues</em> — <code>fail</code> (der Fall für CI-Gating; unter{" "}
				<a href="/conformance/baseline/">Baseline / Allowlist</a> steht, was als „bekannt“ und was
				als „neu“ gilt), <code>2</code> ein Aufruf- oder Scan-Fehler oder ein Scan, der nichts oder
				weniger als verlangt geprüft hätte: eine <code>--rules</code>-/<code>--tags</code>-Liste,
				die keine bekannte Regel und kein bekanntes Tag nennt, ein <code>--context</code>-Selektor,
				der auf nichts passt, eine eigene Regel oder ein Pack, die nicht gelaufen sind, ein{" "}
				<code>--profile</code>, das nicht angewendet wurde. Die CLI liest{" "}
				<strong>nur statisches HTML</strong> — eine lokale Datei oder den rohen Body eines
				HTTP(S)-GET — und führt nie JavaScript der Seite aus. Für clientseitig gerenderte Seiten
				verwenden Sie stattdessen eines der Bindings oder rufen die Engine direkt in einem
				echten, gesteuerten Browser auf (siehe{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a> <span lang="en">Pattern 2</span>).
			</p>
			<p>
				Vollständige Referenz der Flags, Vertrag für eigene Regeln, Packs und CI-Rezepte:{" "}
				<a href={cliDocs}><code>docs/CLI.md</code></a>. Fertige Vorlagen für CI-Pipelines finden
				Sie unter <a href="/configuration/ci-integration/">CI-Integration</a>.
			</p>
		</>
	);
}
