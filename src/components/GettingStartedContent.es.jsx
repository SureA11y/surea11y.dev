import React from "react";

export function GettingStartedContent() {
	return (
		<>
			<h2>Instalación</h2>
			<p>
				No existe un único comando de instalación. surea11y combina un motor central con varias
				integraciones publicadas por separado, por lo que el paquete que debes instalar depende de
				cómo ejecutes actualmente tus pruebas o scripts. Elige la opción que corresponda a tu entorno:
			</p>
			<ul>
				<li>
					<strong>Tests end-to-end, manejando un navegador real o headless:</strong>{" "}
					<a href="/getting-started/cypress/">Cypress</a>,{" "}
					<a href="/getting-started/playwright/">Playwright</a>,{" "}
					<a href="/getting-started/puppeteer/">Puppeteer</a>,{" "}
					<a href="/getting-started/selenium/">Selenium</a>, o{" "}
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
					<a href="/getting-started/standalone/">standalone</a> — instala{" "}
					<code>@surea11y/core</code> directamente, o incorpora el bundle de navegador.
				</li>
			</ul>

			<h2>Uso</h2>
			<p>
				Sea cual sea la forma en que ejecutes un análisis — jsdom, un navegador real, cualquier
				integración (<code>binding</code>), la CLI — devuelve un resultado con la misma estructura
				nativa: <code>checksResults</code>{" "}
				(una entrada por regla, incluyendo cada <code>pass</code>/<code>notApplicable</code> — no
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
