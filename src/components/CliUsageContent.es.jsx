import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function CliUsageContent() {
	return (
		<>
			<p>
				Un comando en lugar de código — no requiere framework de testing ni script de Node, bueno
				para un paso de pipeline o una comprobación rápida contra un artefacto de build.
			</p>
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
			<p>
				<code>cantTell</code> nunca afecta al código de salida: <code>0</code> limpio, <code>1</code>{" "}
				al menos un <code>fail</code> (el caso que condiciona CI), <code>2</code> un error de uso o
				de análisis. La CLI solo lee <strong>HTML estático</strong> — un archivo local, o el cuerpo
				crudo de un GET HTTP(S) — y nunca ejecuta el JavaScript de la página. Para páginas
				renderizadas en cliente, usa uno de los bindings en su lugar, o llama al motor directamente
				contra un navegador real y manejado (ver{" "}
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
