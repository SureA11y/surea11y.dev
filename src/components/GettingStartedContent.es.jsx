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
				label="Qué opción elegir"
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
					"  engine: @surea11y/core 1.12.0",
					"  pass: 13   fail: 3   cantTell: 3   notApplicable: 115",
					"",
					"  occurrences by tier: fail: 3   cantTell: 4",
					"",
					"FAIL (3 rule(s)):",
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
					"  page-title-present  (serious, 1 fail occurrence(s))",
					"    - head > title",
					"      This page has no <title> element.",
					"      hint: Add a <title> that says what the page is about or what it is for.",
					"",
					"cantTell — needs human review (3 rule(s)): contrast-computable, link-name-quality,",
					"manual-review",
					"",
					"criteria (WCAG 2.2):",
					"  fail       1.4.3 Contrast: minimum; 1.4.6 Contrast: enhanced;",
					"             2.4.2 Page titled",
					"  cantTell   2.1.1 Keyboard; 2.4.3 Focus order;",
					"             2.4.4 Link Purpose (In Context); 2.4.7 Focus visible;",
					"             2.4.9 Link Purpose (Link Only)",
					"  pass       1.3.1 Info and Relationships; 2.2.2 Pause, Stop, Hide;",
					"             2.4.1 Bypass Blocks; 3.1.1 Language of page;",
					"             4.1.2 Name, role, value: accessible name;",
					"             4.1.2 Name, role, value: ARIA validity",
					"  notApplicable: 20",
					"  A criterion that passes here means the checks that ran found nothing in it,",
					"  not that the page conforms.",
				]}
			/>
			<p>
				Dos problemas de los que el motor está seguro, así que dan <code>fail</code>: el texto de bajo
				contraste, que falla tanto en la relación AA como en la AAA, y el{" "}
				<code>&lt;title&gt;</code> que falta. Después, una lista de <code>cantTell</code> para que
				revise una persona (¿es "<span lang="en">Click here</span>" un buen nombre de
				enlace?, ¿ese mismo texto de bajo contraste pasa otra comprobación distinta?, ¿hay algo aquí
				que necesite una revisión manual?) y, entre los 115 resultados{" "}
				<code>notApplicable</code>, <code>target-size-minimum</code>: no puede ejecutarse sin un
				layout CSS real, y un análisis de HTML estático no lo tiene.
			</p>
			<p>
				El último bloque presenta el mismo resultado por criterio de WCAG 2.2: 1.4.3, 1.4.6 y 2.4.2
				dan <code>fail</code>; 2.1.1, 2.4.3, 2.4.4, 2.4.7 y 2.4.9 son <code>cantTell</code> y quedan
				para una persona; 1.3.1, 2.2.2, 2.4.1, 3.1.1 y las dos entradas de 4.1.2 dan{" "}
				<code>pass</code>; y los 20 criterios sin nada que juzgar solo se cuentan. Su última línea
				es la que conviene recordar: que un criterio pase significa que las comprobaciones que se
				ejecutaron no encontraron nada en él, no que la página sea conforme. Consulta{" "}
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
