import React from "react";

export function GettingStartedContent() {
	return (
		<>
			<h2>Instalación</h2>
			<p>
				No hay un único comando de instalación — surea11y es un motor central más una familia de
				bindings publicados por separado, así que qué paquete(s) instalas depende de cómo ya
				ejecutas tus tests o scripts. Elige tu stack:
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
					<strong>Sin framework de testing ni paso de compilación:</strong>{" "}
					<a href="/getting-started/standalone/">standalone</a> — instala{" "}
					<code>@surea11y/core</code> directamente, o incorpora el bundle de navegador.
				</li>
			</ul>

			<h2>Uso</h2>
			<p>
				Sea cual sea la forma en que ejecutes un análisis — jsdom, un navegador real, cualquier
				binding, la CLI — devuelve la misma forma de resultado nativa: <code>checksResults</code>{" "}
				(una entrada por regla, incluyendo cada <code>pass</code>/<code>notApplicable</code> — no
				una lista de "solo violaciones") y <code>rulesResults</code> (rollups por SC de WCAG). Esta{" "}
				<strong>no</strong> es la forma{" "}
				<code>violations</code>/<code>passes</code>/<code>incomplete</code>/<code>inapplicable</code>{" "}
				que usan otras herramientas populares de testing de accesibilidad — los nombres de método de
				cada binding están modelados sobre convenciones comunes en este espacio por familiaridad de
				migración, pero el esquema de resultado más rico se mantiene tal cual. Ver{" "}
				<a href="/results-reports/output-schema/">Resultados e informes</a> para el esquema
				completo.
			</p>
		</>
	);
}
