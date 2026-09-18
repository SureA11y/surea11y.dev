import React from "react";
import { Callout } from "./design-system/feedback/Callout.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const choiceRows = [
	{
		need: "Analizar una aplicación web real",
		recommended: <a href="/getting-started/playwright/">Playwright</a>,
		reason: "Maneja un navegador real y es una integración que las suites de pruebas modernas ya usan, así que los resultados reflejan el layout y el renderizado reales.",
	},
	{
		need: "Analizar HTML estático",
		recommended: <a href="/getting-started/cli/">CLI</a>,
		reason: "Sin integración que escribir: un único comando contra un archivo, una URL o un paso de CI.",
	},
	{
		need: "Ya usas Cypress, Selenium, Puppeteer o WebdriverIO",
		recommended: "La integración correspondiente",
		reason: "Encaja directamente en el entorno de pruebas que ya tienes.",
	},
	{
		need: "Tests unitarios o de componentes",
		recommended: <a href="/getting-started/test-matchers/">test-matchers</a>,
		reason: "Integración directa con Jest/Vitest contra jsdom.",
	},
	{
		need: "Integración propia o acceso directo al motor",
		recommended: <a href="/getting-started/standalone/"><code>@surea11y/core</code></a>,
		reason: "Máximo control sobre la ejecución y los resultados.",
	},
];

export function GettingStartedContent() {
	return (
		<>
			<h2>Instalación</h2>
			<p>
				No existe un único comando de instalación. surea11y combina un motor central con varias
				integraciones publicadas por separado, por lo que el paquete que debes instalar depende de
				cómo ejecutes actualmente tus pruebas o scripts. Elige la opción que corresponda a tu entorno:
			</p>
			<Callout tone="note" title="¿No sabes por dónde empezar?">
				<p>
					Usa <a href="/getting-started/playwright/">Playwright</a> para analizar una aplicación
					web real o la <a href="/getting-started/cli/">CLI</a> para revisar HTML estático desde
					una terminal o un pipeline de CI.
				</p>
			</Callout>
			<DataTable
				rowKey="need"
				columns={[
					{ key: "need", label: "Necesidad", wrap: true },
					{ key: "recommended", label: "Opción recomendada" },
					{ key: "reason", label: "Motivo", wrap: true },
				]}
				rows={choiceRows}
			/>

			<h2>Un ejemplo de cinco minutos</h2>
			<p>
				La CLI es la forma más rápida de ver un resultado real: sin configurar un navegador, sin
				framework de pruebas. Analiza una página mínima:
			</p>
			<CodeBlock lang="html" lines={[
				"<html lang=\"en\">",
				"  <body>",
				"    <main>",
				"      <h1>Welcome</h1>",
				"      <p style=\"color: #999999; background-color: #ffffff;\">This text has low contrast.</p>",
				"      <a href=\"/details\">Click here</a>",
				"    </main>",
				"  </body>",
				"</html>",
			]} />
			<CodeBlock
				lines={[
					{ text: "npm install -g @surea11y/cli", command: true },
					{ text: "surea11y scan ./index.html", command: true },
				]}
			/>
			<CodeBlock
				lines={[
					"surea11y scan: file:///path/to/index.html",
					"  pass: 6   fail: 2   cantTell: 3   notApplicable: 114",
					"",
					"  occurrences by tier: fail: 2   cantTell: 4",
					"",
					"FAIL (2 rule(s)):",
					"",
					"  contrast-enhanced  (serious, 1 fail occurrence(s))",
					"    - html > body > main > p",
					"      Element has insufficient color contrast (AAA) of 2.85:1 (foreground: #999999,",
					"      background: #ffffff, font size: 0px, font weight: normal). Expected contrast",
					"      ratio of 7:1 (normal text).",
					"",
					"  contrast-minimum  (serious, 1 fail occurrence(s))",
					"    - html > body > main > p",
					"      Element has insufficient color contrast of 2.85:1 (foreground: #999999,",
					"      background: #ffffff, font size: 0px, font weight: normal). Expected contrast",
					"      ratio of 4.5:1 (normal text).",
					"",
					"cantTell — needs human review (3 rule(s)): contrast-computable, link-name-quality,",
					"manual-review",
				]}
			/>
			<p>
				Un <code>fail</code> del que el motor está seguro (contraste), una lista de{" "}
				<code>cantTell</code> para que revise una persona (¿es "Click here" un buen nombre de
				enlace?, ¿ese mismo texto de bajo contraste pasa otra comprobación distinta?, ¿hay algo aquí
				que necesite una revisión manual?) y, entre los 114 resultados{" "}
				<code>notApplicable</code>, <code>target-size-minimum</code>: no puede ejecutarse sin un
				layout CSS real, y un análisis de HTML estático no lo tiene. Consulta{" "}
				<a href="/results-reports/output-schema/">Resultados e informes</a> para ver qué significa
				cada campo de un resultado completo.
			</p>
			<ul>
				<li>
					<strong>Tests end-to-end, manejando un navegador real o headless:</strong>{" "}
					<a href="/getting-started/cypress/">Cypress</a>,{" "}
					<a href="/getting-started/playwright/">Playwright</a>,{" "}
					<a href="/getting-started/puppeteer/">Puppeteer</a>,{" "}
					<a href="/getting-started/selenium/">Selenium</a> o{" "}
					<a href="/getting-started/webdriverio/">WebdriverIO</a>.
				</li>
				<li>
					<strong>Tests unitarios y de componentes, contra jsdom:</strong>{" "}
					<a href="/getting-started/test-matchers/">test-matchers</a>, para Jest o Vitest.
				</li>
				<li>
					<strong>HTML estático desde una terminal o un pipeline de CI:</strong> la{" "}
					<a href="/getting-started/cli/">CLI</a>.
				</li>
				<li>
					<strong>Sin framework de pruebas ni paso de compilación:</strong>{" "}
					<a href="/getting-started/standalone/">standalone</a>: instala{" "}
					<code>@surea11y/core</code> directamente o incorpora el bundle de navegador.
				</li>
			</ul>

			<h2>Uso</h2>
			<p>
				Ya sea con jsdom, un navegador real, cualquier integración (<code>binding</code>) o la CLI, un
				análisis devuelve un resultado con la misma estructura
				nativa: <code>checksResults</code>{" "}
				(una entrada por regla, incluyendo cada <code>pass</code>/<code>notApplicable</code>, no
				una lista de "solo violaciones") y <code>rulesResults</code> (resultados agregados por SC de
				WCAG). Esta{" "}
				<strong>no</strong> es la estructura{" "}
				<code>violations</code>/<code>passes</code>/<code>incomplete</code>/<code>inapplicable</code>{" "}
				que usan otras herramientas populares de pruebas de accesibilidad. Los métodos de cada
				integración siguen convenciones habituales del ecosistema para facilitar la migración, pero
				el esquema de resultado más rico se mantiene tal cual. Ver{" "}
				<a href="/results-reports/output-schema/">Resultados e informes</a> para el esquema
				completo.
			</p>
		</>
	);
}
