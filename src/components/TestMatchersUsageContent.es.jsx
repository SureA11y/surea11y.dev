import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const apiRows = [
	{
		id: "received",
		param: <code>received</code>,
		type: (
			<>
				<code>Element</code>, <code>Document</code>, o un resultado de análisis
			</>
		),
		meaning: (
			<>
				Qué comprobar. Un <code>Element</code>/<code>Document</code> del DOM se analiza
				automáticamente; un objeto con la forma <code>{"{ checksResults: [...] }"}</code> se
				verifica directamente, sin realizar ningún análisis. Cualquier otra cosa lanza un{" "}
				<code>TypeError</code>.
			</>
		),
	},
	{
		id: "engineOptions",
		param: <code>engineOptions</code>,
		type: "objeto (opcional)",
		meaning: (
			<>
				Se pasa directamente al análisis de <code>@surea11y/core</code> — el mismo objeto de
				opciones usado en el resto del ecosistema (consulta <a href="/configuration/engine-options/">Opciones del motor</a>). Se ignora
				cuando <code>received</code> ya es un resultado de análisis.
			</>
		),
	},
];

export function TestMatchersUsageContent() {
	return (
		<>
			<p>
				Para tests unitarios y de componentes — verifica la accesibilidad directamente dentro de
				una suite de Jest o Vitest, contra el DOM que el test ya tiene, en lugar de manejar un
				navegador real o headless. Si en cambio estás probando páginas completamente renderizadas,
				consulta{" "}
				<a href="/getting-started/">los bindings basados en navegador</a>.
			</p>
			<p>
				<a href="https://github.com/SureA11y/test-matchers"><code>@surea11y/test-matchers</code></a>{" "}
				es un único matcher, <code>toHaveNoA11yViolations()</code>,
				que se conecta al <code>expect.extend()</code> de cualquiera de los dos frameworks sin
				modificaciones — no tiene código propio específico de ningún framework. Analiza cualquier
				entorno basado en jsdom bajo el que ya se ejecute tu test; no depende de <code>jsdom</code>{" "}
				en sí ni lo configura por ti. El motor de surea11y es síncrono, así que este matcher también
				lo es — sin <code>await</code>, sin el riesgo de olvidarlo y que el test pase en silencio
				sobre una promesa resuelta.
			</p>
			<CodeBlock lines={[{ text: "npm install --save-dev @surea11y/test-matchers", command: true }]} />

			<h2>Configuración</h2>
			<p>
				Tu entorno de testing ya debe estar basado en jsdom — este matcher analiza cualquier{" "}
				<code>document</code>/<code>window</code> que proporcione. Registra el matcher una vez, en
				el archivo de configuración que tu ejecutor de tests ya cargue:
			</p>
			<h3>Jest</h3>
			<CodeBlock
				lang="js"
				lines={[
					"// jest.setup.js",
					"expect.extend({",
					"  toHaveNoA11yViolations: require('@surea11y/test-matchers').toHaveNoA11yViolations",
					"});",
					"",
					"// jest.config.js",
					"module.exports = {",
					"  testEnvironment: 'jsdom',   // or the explicit jest-environment-jsdom package, depending on your Jest version",
					"  setupFilesAfterEnv: ['./jest.setup.js']",
					"};",
				]}
			/>
			<h3>Vitest</h3>
			<CodeBlock
				lang="js"
				lines={[
					"// vitest.setup.js",
					"import { expect } from 'vitest';",
					"import { toHaveNoA11yViolations } from '@surea11y/test-matchers';",
					"",
					"expect.extend({ toHaveNoA11yViolations });",
					"",
					"// vitest.config.js",
					"export default {",
					"  test: {",
					"    environment: 'jsdom',   // Vitest doesn't bundle jsdom -- install it as a devDependency too",
					"    setupFiles: ['./vitest.setup.js']",
					"  }",
					"};",
				]}
			/>
			<p>
				El <code>.d.ts</code> incluido amplía tanto la interfaz global <code>jest.Matchers</code>{" "}
				de Jest como las interfaces <code>@vitest/expect</code> de Vitest, sin necesitar ningún{" "}
				import de <code>@types/jest</code> o <code>vitest</code> para distribuirlo — sea cual sea
				el framework realmente instalado, solo se activa la ampliación correspondiente.
			</p>

			<h2>Uso</h2>
			<p>Funciona contra un nodo DOM simple:</p>
			<CodeBlock
				lang="js"
				lines={[
					"test('no accessibility violations', () => {",
					"  document.body.innerHTML = '<img src=\"logo.png\">';",
					"",
					"  expect(document.body).toHaveNoA11yViolations(); // fails: missing alt",
					"});",
				]}
			/>
			<p>
				...o cualquier <code>container</code> de testing-library — el de React Testing Library, el{" "}
				<code>wrapper.element</code> de Vue Test Utils, el de Angular Testing Library, el de Svelte
				Testing Library — ya que todos exponen un elemento DOM renderizado de la misma manera:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { render } = require('@testing-library/react');",
					"",
					"test('MyComponent has no accessibility violations', () => {",
					"  const { container } = render(<MyComponent />);",
					"",
					"  expect(container).toHaveNoA11yViolations();",
					"});",
				]}
			/>
			<p>
				Esto también es agnóstico respecto al ejecutor de tests — los fragmentos anteriores son
				idénticos tanto si se ejecutan bajo Jest como bajo Vitest, una vez registrado el matcher.
			</p>

			<h3>Verificar con <code>.not</code></h3>
			<CodeBlock
				lang="js"
				lines={[
					"test('a page with a violation fails the assertion', () => {",
					"  document.body.innerHTML = '<main><img src=\"logo.png\"></main>';",
					"",
					"  expect(document.body).not.toHaveNoA11yViolations();",
					"});",
				]}
			/>

			<h3>Reutilizar un análisis en varias aserciones</h3>
			<p>
				Si ya estás calculando tú mismo un resultado de análisis de surea11y — para verificar
				reglas específicas en varios bloques <code>it()</code> sin volver a analizar cada vez —
				pasa el objeto de resultado directamente en lugar de un nodo DOM:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { runDomRulesInPage } = require('@surea11y/core');",
					"",
					"const result = runDomRulesInPage(null, '#main', {}, null);",
					"expect(result).toHaveNoA11yViolations();",
				]}
			/>

			<h2>Filtrar y configurar análisis</h2>
			<p>
				El segundo argumento acepta cualquier cosa que acepte <code>@surea11y/core</code> — consulta{" "}
				<a href="/configuration/engine-options/">Opciones del motor</a> para ver la superficie completa. Algunos casos
				comunes:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// Only run rules relevant to WCAG 2.0 A",
					"expect(container).toHaveNoA11yViolations({ tags: { include: 'wcag2a' } });",
					"",
					"// Skip a rule you've decided not to enforce yet",
					"expect(container).toHaveNoA11yViolations({ rules: { exclude: 'target-size-minimum' } });",
					"",
					"// Ignore a third-party widget you don't control",
					"expect(container).toHaveNoA11yViolations({ excludeSelectors: ['.intercom-launcher'] });",
				]}
			/>

			<h2>API</h2>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "param", label: "Parámetro", width: "18%" },
					{ key: "type", label: "Tipo", width: "26%" },
					{ key: "meaning", label: "Significado", wrap: true },
				]}
				rows={apiRows}
			/>
			<p>
				Devuelve la forma <code>{"{ pass, message }"}</code> que el <code>expect.extend()</code>{" "}
				de ambos frameworks espera — nunca llamas a esto directamente; se conecta una vez mediante{" "}
				<code>expect.extend()</code> como se muestra en Configuración más arriba.
			</p>

			<h2>Qué comprueba y qué no</h2>
			<p>
				<strong>Solo los resultados <code>fail</code> condicionan la aserción</strong> — coincidiendo con
				la convención del resto de bindings de surea11y de que los resultados <code>cantTell</code>{" "}
				son informativos, no fallos. Un enlace vago como{" "}
				<code>&lt;a href="/pricing"&gt;Click here&lt;/a&gt;</code> es <code>cantTell</code>, no{" "}
				<code>fail</code>, así que nunca rompe por sí solo un test que pasa — aunque cuando una
				aserción <em>sí</em> falla por otros motivos, cualquier resultado <code>cantTell</code>{" "}
				se añade al mensaje de fallo como una nota aparte, para que siga siendo visible. Consulta{" "}
				<a href="/help/known-limitations/">Limitaciones conocidas</a> para saber qué no
				automatiza en absoluto este motor.
			</p>
			<p>
				<strong>Limitar el alcance a un elemento solo informa de lo que hay dentro de él</strong> — un
				fallo en otra parte de la página nunca hace fallar una aserción limitada a un{" "}
				<code>container</code>. Internamente, el elemento analizado se marca temporalmente con un
				atributo único y se analiza mediante ese selector, de forma invisible para tu test.
			</p>
			<p>
				<strong>Un puñado de reglas comprueban un hecho de toda la página</strong>, no algo en un
				subárbol concreto — <code>page-title-present</code>, <code>html-lang-attr-present</code>, y
				algunas otras comprueban <code>document.title</code>/<code>document.documentElement</code>{" "}
				directamente, ya que preguntar si <em>la página</em> tiene un título no tiene sentido para
				un fragmento de componente arbitrario. Pasar un <code>Element</code> (un{" "}
				<code>container</code> de testing-library, <code>document.body</code>) informa estas{" "}
				<code>notApplicable</code> en lugar de <code>fail</code>, así que un{" "}
				<code>&lt;title&gt;</code> faltante nunca rompe un test a nivel de componente; pasar el
				propio <code>document</code> sí las evalúa de verdad. Si analizas{" "}
				<code>document</code> directamente, define una vez el <code>lang</code> de{" "}
				<code>document.title</code>/<code>document.documentElement</code> en tu archivo de
				configuración en lugar de en cada test.
			</p>

			<h2>Mensajes de fallo</h2>
			<p>
				Enumera cada ocurrencia, no solo cada regla — una regla puede marcar varios elementos — con
				el ID de la regla, la gravedad, un resumen legible, el selector del elemento que falla, y
				una pista de corrección cuando está disponible:
			</p>
			<CodeBlock
				lines={[
					"expected no accessibility violations, but found 1:",
					"",
					"1) img-alt-present (serious): Missing alt attribute on <img>.",
					"   at html > body > img",
					"   Add an alt attribute or use alt=\"\" for decorative images.",
				]}
			/>
			<p>
				Cualquier resultado <code>cantTell</code> junto a los fallos se añade como una nota aparte,
				para que siga siendo visible sin afectar a <code>pass</code>/<code>fail</code>:
			</p>
			<CodeBlock lines={["2 rule(s) need manual review (cantTell, not counted as failures): link-name-quality-manual, color-contrast-computable"]} />

			<p>
				Ejemplos ejecutables, en paralelo, para ambos frameworks:{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/basic.test.js">Jest</a>{" "}
				y{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/basic.vitest.test.js">
					Vitest
				</a>
				. Para la superficie completa de <code>engineOptions</code> (locale, modos de contraste,
				shadow DOM, reglas personalizadas, combinaciones de etiquetas de versión de WCAG), consulta{" "}
				<a href={`${core}/docs/ENGINE_OPTIONS.md`}><code>ENGINE_OPTIONS.md</code></a> — este
				paquete reenvía todo lo que le pasas en lugar de duplicar esa referencia.
			</p>
		</>
	);
}
