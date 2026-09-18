import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function CliUsageContent() {
	return (
		<>
			<p>
				Un comando en lugar de código. No requiere un framework de pruebas ni un script de Node y
				resulta adecuado para un paso del pipeline de CI o para una comprobación rápida de un
				artefacto de compilación.
			</p>

			<h2>Primer análisis</h2>
			<CodeBlock
				lines={[
					{ text: "npm install -g @surea11y/cli", command: true },
					{ text: "surea11y scan ./index.html", command: true },
					{ text: "surea11y scan https://example.com/ --tags wcag2a,wcag2aa", command: true },
				]}
			/>
			<p>
				Requiere Node.js <code>^20.19.0 || ^22.13.0 || &gt;=24.0.0</code>.
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
			<h2>Limitaciones</h2>
			<p>
				<code>cantTell</code> nunca afecta al código de salida. El código <code>0</code> indica que
				no se han encontrado fallos; <code>1</code>, que existe al menos un resultado{" "}
				<code>fail</code> — o, analizando con <code>--baseline</code>, un resultado <code>fail</code>{" "}
				<em>nuevo</em> — (el caso que condiciona CI; ver{" "}
				<a href="/conformance/baseline/">Baseline / allowlist</a> para saber qué cuenta como
				"conocido" frente a "nuevo"); y <code>2</code>, que se ha producido un error
				de uso o de análisis. La CLI solo lee <strong>HTML estático</strong> — un archivo local, o el
				cuerpo crudo de un GET HTTP(S) — y nunca ejecuta el JavaScript de la página. Para páginas
				renderizadas en cliente, usa una de las integraciones (<code>bindings</code>) en su lugar, o
				llama al motor directamente contra un navegador real y manejado (ver{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a> Patrón 2).
			</p>
			<p>
				Referencia completa de flags, contrato de reglas personalizadas y recetas de CI:{" "}
				<a href="https://github.com/SureA11y/cli/blob/main/docs/CLI.md"><code>docs/CLI.md</code></a>.
				Para plantillas de pipeline de CI en concreto, ver{" "}
				<a href="/configuration/ci-integration/">Integración con CI</a>.
			</p>
		</>
	);
}
