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
				<code>Element</code>, <code>Document</code> o un resultado de análisis
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
				Se pasa directamente al análisis de <code>@surea11y/core</code>: el mismo objeto de
				opciones usado en el resto del ecosistema (consulta <a href="/configuration/engine-options/">Opciones del motor</a>). Se ignora
				cuando <code>received</code> ya es un resultado de análisis.
			</>
		),
	},
	{
		id: "runOnly",
		param: <code>runOnly</code>,
		type: "objeto, cadena o string[] (opcional)",
		meaning: (
			<>
				Se pasa tal cual como el <code>runOnly</code> del análisis: un objetivo de WCAG (
				<code>{"{ wcag: { version: '2.2', level: 'AA' } }"}</code>), <code>bestPractices</code>,
				IDs de regla o etiquetas. Consulta{" "}
				<a href="#choosing-a-wcag-target">Elegir un objetivo de WCAG</a>. Se ignora cuando{" "}
				<code>received</code> ya es un resultado de análisis.
			</>
		),
	},
	{
		id: "options",
		param: <code>options</code>,
		type: "objeto (opcional)",
		meaning: (
			<>
				<code>{"{ failOnSeverity, leanFail, wcagOnly, howToCheck }"}</code>: consulta{" "}
				<a href="#failing-only-on-serious-problems">Fallar solo con problemas graves</a> y{" "}
				<a href="#questions-that-likely-fail">Preguntas que probablemente fallan</a>. Cada una
				sustituye al valor por defecto que fija <code>configureA11yMatchers()</code>.
			</>
		),
	},
];

export function TestMatchersUsageContent() {
	return (
		<>
			<p>
				Para pruebas unitarias y de componentes: verifica la accesibilidad directamente dentro de
				una suite de Jest o Vitest, contra el DOM que la prueba ya tiene, en lugar de manejar un
				navegador real o headless. Si en cambio estás probando páginas completamente renderizadas,
				consulta{" "}
				<a href="/getting-started/">las integraciones (<code>binding</code>) basadas en navegador</a>.
			</p>
			<p>
				<a href="https://github.com/SureA11y/test-matchers"><code>@surea11y/test-matchers</code></a>{" "}
				te da <code>toHaveNoA11yViolations()</code>, más <code>toHaveAnnounced()</code> para las
				regiones vivas. Ambos se conectan al <code>expect.extend()</code> de cualquiera de los dos
				frameworks sin modificaciones, sin código propio específico de ningún framework. Analiza cualquier
				entorno basado en jsdom bajo el que ya se ejecute tu prueba; no depende de <code>jsdom</code>{" "}
				en sí ni lo configura por ti. El motor de surea11y es síncrono, así que este matcher también
				lo es: sin <code>await</code>, sin el riesgo de olvidarlo y que la prueba se dé por superada
				sin esperar a que se resuelva la promesa.
			</p>
			<CodeBlock lines={[{ text: "npm install --save-dev @surea11y/core @surea11y/test-matchers", command: true }]} />
			<p>
				<code>@surea11y/core</code> es el motor que ejecuta el matcher; instálalo con el matcher,
				como arriba. Para
				comprobar HTML compilado desde la terminal o un paso de CI, fuera de un ejecutor
				de pruebas, consulta la <a href="/getting-started/cli/">CLI</a>.
			</p>

			<h2>Configuración</h2>
			<p>
				Tu entorno de pruebas ya debe estar basado en jsdom. Este matcher analiza cualquier{" "}
				<code>document</code>/<code>window</code> que proporcione. Registra el matcher una vez, en
				el archivo de configuración que tu ejecutor de pruebas ya cargue:
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
				import de <code>@types/jest</code> o <code>vitest</code> para distribuirlo: sea cual sea
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
				...o cualquier <code>container</code> de testing-library: el de <span lang="en">React Testing Library</span>, el{" "}
				<code>wrapper.element</code> de <span lang="en">Vue Test Utils</span>, el de <span lang="en">Angular Testing Library</span>, el de Svelte
				<span lang="en">Testing Library</span>, ya que todos exponen un elemento DOM renderizado de la misma manera:
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
				Esto también es agnóstico respecto al ejecutor de pruebas: los fragmentos anteriores son
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
				Si ya estás calculando tú mismo un resultado de análisis de surea11y (para verificar
				reglas específicas en varios bloques <code>it()</code> sin volver a analizar cada vez),
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
				El segundo argumento acepta cualquier cosa que acepte <code>@surea11y/core</code>. Consulta{" "}
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
					"",
					"// EN 301 549 V4.1.1 (WCAG 2.2 A and AA); 'en301549-v3.2.1' for V3.2.1 (WCAG 2.1 A and AA)",
					"expect(container).toHaveNoA11yViolations({ profile: 'en301549-v4.1.1' });",
				]}
			/>

			<h3 id="choosing-a-wcag-target">Elegir un objetivo de WCAG (<code>runOnly</code>)</h3>
			<p>
				El tercer argumento es el <code>runOnly</code> del análisis, que se pasa al motor tal cual.{" "}
				<code>runOnly.wcag</code> selecciona por objetivo de conformidad:{" "}
				<code>{"{ wcag: { version: '2.2', level: 'AA' } }"}</code> ejecuta las reglas de los criterios
				de nivel A y AA de WCAG 2.2, según el nivel que tiene cada criterio en esa versión.{" "}
				<code>bestPractices: true</code> añade las reglas que no nombran ningún criterio de WCAG, como{" "}
				<code>region</code> y <code>heading-order</code>; por sí solo, ejecuta solo esas, y junto a{" "}
				<code>engineOptions.profile</code> las añade a las reglas del perfil.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.2 A and AA",
					"expect(container).toHaveNoA11yViolations({}, { wcag: { version: '2.2', level: 'AA' } });",
					"",
					"// The same, and the best practices",
					"expect(container).toHaveNoA11yViolations({}, { wcag: { version: '2.2', level: 'AA' }, bestPractices: true });",
				]}
			/>
			<p>
				<code>runOnly</code> también acepta IDs de regla y etiquetas (<code>includeRuleIds</code>,{" "}
				<code>tags</code>, <code>excludeRuleIds</code>, ...), que se añaden a las reglas de un
				objetivo; las exclusiones se aplican después. Un <code>runOnly</code> que selecciona algo
				sustituye por completo la selección de <code>engineOptions.rules</code>/<code>.tags</code>:
				indica una selección de una forma o de la otra, no de ambas. Pasa <code>{"{}"}</code> o{" "}
				<code>null</code> como <code>engineOptions</code> cuando solo necesites{" "}
				<code>runOnly</code>.
				Los IDs de regla se leen sin distinguir mayúsculas de minúsculas
				(<code>'IMG-ALT-PRESENT'</code>).
			</p>
			<p>
				Un objetivo implica su nivel. Una prueba que nombra reglas o etiquetas puede
				fijar uno con <code>engineOptions.wcagLevel</code> (<code>@surea11y/core</code>{" "}
				1.12.0 y posteriores): el nivel de los criterios de los que informa el análisis,
				sin cambiar qué reglas se ejecutan. <code>contrast-computable</code> comprueba
				el 1.4.3 (AA) y el 1.4.6 (AAA), así que el análisis de abajo solo informa del
				1.4.3. La aserción depende de los resultados <code>fail</code>, así que esto
				cambia los criterios del resultado, no lo que hace fallar la prueba.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"expect(container).toHaveNoA11yViolations({ wcagLevel: 'AA' }, { includeRuleIds: ['contrast-computable'] });",
				]}
			/>

			<h2 id="packs">Analizar con packs</h2>
			<p>
				Un <a href="/configuration/packs/">pack</a> trae reglas, un estándar o una lista de
				comprobación, junto con sus perfiles y mensajes, desde un paquete independiente. El matcher
				analiza en Node, así que un pack se pasa como el propio objeto, en{" "}
				<code>engineOptions.packs</code>, y su perfil se elige con <code>engineOptions.profile</code>:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const acmePolicy = require('./acme-policy-pack');",
					"const policy = { packs: [acmePolicy], profile: 'acme-web-2026' };",
					"",
					"test(\"a page that breaks the pack's house rule fails the assertion\", () => {",
					"  document.body.innerHTML = '<main><h1>Welcome</h1><video autoplay src=\"intro.mp4\"></video></main>';",
					"  expect(document).not.toHaveNoA11yViolations(policy);",
					"});",
					"",
					"// A pack's checklist profile, and the best practices",
					"expect(container).toHaveNoA11yViolations(policy, { bestPractices: true });",
				]}
			/>
			<p>
				Las reglas propias de un pack aparecen en el resultado igual que las de core, con IDs que
				empiezan por su espacio de nombres (<code>acme-no-autoplay</code>). Mantén los objetos de
				pack en un solo lugar (un archivo de configuración o un módulo): core prepara un motor para
				cada conjunto de objetos de pack y lo conserva para el siguiente análisis con los mismos. Un
				pack que core no puede ejecutar (su rango <code>core</code> deja fuera el core instalado, no
				es válido, o su espacio de nombres choca con el de otro pack) figura en el{" "}
				<code>skippedPacks</code> del resultado, y la aserción falla por ello en lugar de pasar sin
				que se hayan ejecutado las reglas del pack.
			</p>

			<h2>API</h2>
			<DataTable
				label="Parámetros del matcher"
				rowKey="id"
				columns={[
					{ key: "param", label: "Parámetro", width: "18%" },
					{ key: "type", label: "Tipo", width: "26%" },
					{ key: "meaning", label: "Significado", wrap: true },
				]}
				rows={apiRows}
			/>
			<p>
				El segundo argumento puede ser, en cambio, un único objeto con todos ellos,{" "}
				<code>{"{ engineOptions, runOnly, failOnSeverity, leanFail, wcagOnly, howToCheck }"}</code>:{" "}
				<code>{"toHaveNoA11yViolations({ leanFail: true })"}</code>. Se lee así cuando tiene
				alguna de esas claves, ninguna de las cuales es una opción del motor; un objeto que las
				mezcla con opciones del motor lanza un <code>TypeError</code>.
			</p>
			<p>
				Devuelve la forma <code>{"{ pass, message }"}</code> que el <code>expect.extend()</code>{" "}
				de ambos frameworks espera: nunca llamas a esto directamente; se conecta una vez mediante{" "}
				<code>expect.extend()</code> como se muestra en Configuración más arriba. El paquete
				también exporta <code>configureA11yMatchers(options)</code>, para valores por defecto en
				toda la suite; <code>installInternalsHook(win?)</code>, para{" "}
				<a href="#web-components">componentes web</a>; y <code>installListenerHook(win?)</code>,{" "}
				<code>installLiveRegionHook(win?)</code> y el matcher <code>toHaveAnnounced()</code>, para{" "}
				<a href="#listener-and-live-region-hooks">manejadores de clic y regiones vivas</a>.
			</p>

			<h2>Qué comprueba y qué no</h2>
			<p>
				<strong>Solo los fallos condicionan la aserción</strong>: coincidiendo con la convención del
				resto de integraciones de surea11y de que los resultados <code>cantTell</code> son
				informativos, no fallos. Cada hallazgo se lee por su propio resultado, no por el de su
				regla: una regla que falla en un elemento puede preguntar por otro, y esa pregunta no cuenta
				como fallo. Un enlace vago como <code>&lt;a href="/pricing"&gt;Click here&lt;/a&gt;</code>{" "}
				es <code>cantTell</code>, no <code>fail</code>, así que no rompe por sí solo una prueba que
				pasa, salvo que lo pidas con <code>leanFail</code> (
				<a href="#questions-that-likely-fail">más abajo</a>), aunque cuando una aserción{" "}
				<em>sí</em> falla por otros motivos, las preguntas se enumeran después de los fallos, para
				que sigan siendo visibles. Consulta{" "}
				<a href="/help/known-limitations/">Limitaciones conocidas</a> para saber qué no automatiza
				en absoluto este motor.
			</p>
			<p>
				<strong>Un análisis que no pudo comprobar lo que se le pidió también falla</strong>, en
				lugar de pasar sin haber comprobado nada: un elemento que no está en el documento en el que
				se ejecuta el análisis (desconectado, o de otro documento), una regla personalizada que no
				se ejecutó (listada en <code>skippedCustomRules</code>), o un pack que no se ejecutó
				(listado en <code>skippedPacks</code>). El mensaje nombra cada uno con el motivo.
				Una regla personalizada que la propia prueba excluye no es un hueco, y no la
				hace fallar.
			</p>
			<p>
				<strong>Una llamada sin selección también ejecuta las buenas prácticas.</strong>{" "}
				Desde <code>@surea11y/core</code> 1.12, una de ellas,{" "}
				<code>empty-heading</code>, falla un encabezado sin nombre accesible, cuando
				antes preguntaba por él, así que un componente que renderiza{" "}
				<code>&lt;h2&gt;&lt;/h2&gt;</code> (a menudo una prop de título vacía en la
				prueba) falla una llamada por defecto. Un lector de pantalla anuncia ese
				encabezado sin nada dentro: da contenido real a la prueba o corrige el
				componente. Una llamada con un objetivo de WCAG, que deja fuera las buenas
				prácticas, no la ejecuta.
			</p>
			<p>
				El propio análisis puede lanzar una excepción, y entonces la prueba falla con el error del
				motor, que lleva un <code>code</code>: <code>INVALID_RUN_ONLY</code> (una lista de reglas o
				etiquetas en la que ningún valor nombra una regla o una etiqueta, o un objetivo{" "}
				<code>runOnly.wcag</code> que no es válido), <code>INVALID_ENGINE_OPTIONS</code> (con{" "}
				<code>strictOptions: true</code>, una opción que el motor no lee o un valor que no puede
				usar), o <code>PAGE_BUILTINS_BROKEN</code> (el código de la prueba o de la propia página
				rompió un objeto integrado de JavaScript del que depende el motor).
			</p>
			<p>
				<strong>Limitar el alcance a un elemento solo informa de lo que hay dentro de él</strong>. Un
				fallo en otra parte de la página nunca hace fallar una aserción limitada a un{" "}
				<code>container</code>. Internamente, el elemento analizado se marca temporalmente con un
				atributo único y se analiza mediante ese selector, de forma invisible para tu prueba.
			</p>
			<p>
				<strong>Un puñado de reglas comprueban un hecho de toda la página</strong>, no algo en un
				subárbol concreto: <code>page-title-present</code>, <code>html-lang-attr-present</code>, y
				algunas otras comprueban <code>document.title</code>/<code>document.documentElement</code>{" "}
				directamente, ya que preguntar si <em>la página</em> tiene un título no tiene sentido para
				un fragmento de componente arbitrario. Pasar un <code>Element</code> (un{" "}
				<code>container</code> de testing-library, <code>document.body</code>) informa estas{" "}
				<code>notApplicable</code> en lugar de <code>fail</code>, así que un{" "}
				<code>&lt;title&gt;</code> faltante nunca rompe una prueba a nivel de componente; pasar el
				propio <code>document</code> sí las evalúa de verdad. Si analizas{" "}
				<code>document</code> directamente, define una vez el <code>lang</code> de{" "}
				<code>document.title</code>/<code>document.documentElement</code> en tu archivo de
				configuración en lugar de en cada prueba.
			</p>

			<h2 id="failing-only-on-serious-problems">Fallar solo con problemas graves</h2>
			<p>
				Cada resultado de regla tiene una gravedad: <code>critical</code>, <code>serious</code>,{" "}
				<code>moderate</code> o <code>minor</code>. Para empezar haciendo fallar las pruebas solo
				con problemas graves mientras el resto se sigue informando, fija un nivel para toda la suite
				en el archivo de configuración con <code>configureA11yMatchers()</code>, o para una
				aserción en sus opciones, que sustituyen al valor por defecto (<code>failOnSeverity: null</code>{" "}
				lo desactiva ahí):
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// jest.setup.js (vitest.setup.js: the same, with import)",
					"const { toHaveNoA11yViolations, configureA11yMatchers } = require('@surea11y/test-matchers');",
					"",
					"expect.extend({ toHaveNoA11yViolations });",
					"configureA11yMatchers({ failOnSeverity: 'serious' });",
					"",
					"// one assertion",
					"expect(container).toHaveNoA11yViolations({ failOnSeverity: 'critical' });",
				]}
			/>
			<p>
				Las reglas que fallan por debajo del nivel no hacen fallar la prueba, pero cuando falla, el
				mensaje enumera todos los fallos y marca los que quedan por debajo del nivel. Es el mismo
				umbral que <code>surea11y scan --fail-on-severity</code>. Un análisis que dejó algo fuera
				(un ámbito que no coincidió con nada, una regla personalizada o un pack que no se ejecutó)
				hace fallar la aserción sea cual sea el nivel.
			</p>

			<h2 id="questions-that-likely-fail">Preguntas que probablemente fallan</h2>
			<p>
				Un <code>cantTell</code> es una pregunta para una persona. Desde <code>@surea11y/core</code>{" "}
				1.14, una pregunta puede tener una tendencia: cuando las evidencias de la página apuntan hacia un
				lado, dice hacia cuál (<code>fail</code> o <code>pass</code>) y por qué, y cada pregunta de
				una regla de core lleva los pasos para responderla (<code>howToCheck</code>). Un mensaje de
				fallo enumera las preguntas después de los fallos: primero las que probablemente fallan,
				luego las que probablemente cumplen, cada una con su motivo, y después las abiertas, por
				regla. <code>{"{ howToCheck: true }"}</code> enumera cada pregunta completa, con sus pasos.
			</p>
			<p>
				Por defecto, una pregunta nunca hace fallar la prueba. <code>{"{ leanFail: true }"}</code>{" "}
				la hace fallar también con las preguntas que probablemente fallan, y{" "}
				<code>wcagOnly: true</code> deja fuera las de reglas de buenas prácticas:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"test('the settings page has no failures or likely failures', () => {",
					"  const { container } = render(<Settings />); // an <h1>, then an <h3>",
					"  expect(container).toHaveNoA11yViolations(); // passes: heading-order is a question",
					"  expect(container).toHaveNoA11yViolations({ leanFail: true }); // fails: it leans fail",
					"  expect(container).toHaveNoA11yViolations({ leanFail: true, wcagOnly: true }); // passes: heading-order is a best practice",
					"});",
				]}
			/>
			<p>
				Es opcional porque una tendencia es una evidencia, no una prueba: si un hallazgo tiene tendencia, y hacia dónde, puede cambiar en una versión menor de core.{" "}
				<code>{"configureA11yMatchers({ leanFail: true })"}</code> lo activa para toda la suite.
			</p>

			<h2 id="web-components">Componentes web</h2>
			<p>
				Muchos componentes web guardan sus <code>ElementInternals</code> en un campo
				privado y, a través de ellos, se dan un nombre, fijan sus estados o se asignan
				un rol. Ningún script puede volver a leerlos, así que por defecto el análisis
				pregunta por ese elemento (<code>cantTell</code>) en lugar de juzgarlo: la
				prueba no falla, pero tampoco se comprueba nada, y un rol asignado así ni
				siquiera se ve.
			</p>
			<p>
				<code>installInternalsHook(win?)</code> permite que el análisis los lea. Llámalo
				una vez en el archivo de configuración, antes de que se defina ningún
				componente, para que vea cada llamada a <code>attachInternals()</code>;{" "}
				<code>win</code> es por defecto el <code>window</code> global:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// jest.setup.js",
					"const {",
					"  toHaveNoA11yViolations,",
					"  installInternalsHook",
					"} = require('@surea11y/test-matchers');",
					"",
					"installInternalsHook();",
					"expect.extend({ toHaveNoA11yViolations });",
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"// vitest.setup.js",
					"import { expect } from 'vitest';",
					"import {",
					"  toHaveNoA11yViolations,",
					"  installInternalsHook",
					"} from '@surea11y/test-matchers';",
					"",
					"installInternalsHook();",
					"expect.extend({ toHaveNoA11yViolations });",
				]}
			/>
			<p>
				Con él, un componente que se da nombre a través de sus{" "}
				<code>ElementInternals</code> pasa, uno que los adjunta pero no fija ningún
				nombre falla como cualquier control sin nombre, y uno que es un{" "}
				<code>switch</code> solo a través de ellos se comprueba como tal. El campo{" "}
				<code>engine.environment.internalsHook</code> de un resultado indica si el hook
				estaba instalado. Envuelve <code>HTMLElement.prototype.attachInternals</code> en
				la ventana de la prueba, algo inofensivo en una prueba y la razón de que sea
				opcional. Un límite: <code>jest-environment-jsdom</code> 30 incluye jsdom 26, donde un
				componente que fija una propiedad ARIA en sus <code>ElementInternals</code> lanza un
				error, con hook o sin él (Vitest con jsdom 29 lo admite). Desde{" "}
				<code>@surea11y/core</code> 1.14 el hook se registra como <code>'early'</code> también con
				Vitest, así que allí un componente que nunca adjuntó <code>ElementInternals</code> ya no
				es una pregunta. El{" "}
				<a href="https://github.com/SureA11y/test-matchers#web-components-names-set-through-elementinternals">README
				del paquete</a> tiene los detalles.
			</p>

			<h2 id="listener-and-live-region-hooks">Manejadores de clic y regiones vivas</h2>
			<p>
				Dos hooks opcionales más, desde <code>@surea11y/core</code> 1.14, se instalan del mismo
				modo, en el archivo de configuración, antes de que se ejecute nada de tu código.{" "}
				<code>installListenerHook()</code> registra los listeners de clic, teclado, foco y ratón
				que se añaden desde entonces, para que las reglas de teclado los juzguen: un{" "}
				<code>&lt;div role="button"&gt;</code> que solo escucha <code>click</code> falla (
				<code>CLICK_HANDLER_NO_KEY_LISTENER</code>), y pasa en cuanto también escucha{" "}
				<code>keydown</code>. <code>installLiveRegionHook()</code> registra lo que reciben las
				regiones vivas de la página: el análisis pregunta por una región añadida con su texto ya
				dentro, que los lectores de pantalla no suelen anunciar, y <code>toHaveAnnounced()</code>{" "}
				comprueba que una acción le dijo algo al usuario. Instala solo los que quieras; cada uno es
				independiente:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// jest.setup.js (vitest.setup.js: the same, with import)",
					"const {",
					"  toHaveNoA11yViolations,",
					"  toHaveAnnounced,",
					"  installInternalsHook,",
					"  installListenerHook,",
					"  installLiveRegionHook",
					"} = require('@surea11y/test-matchers');",
					"",
					"installInternalsHook();",
					"installListenerHook();",
					"installLiveRegionHook();",
					"expect.extend({",
					"  toHaveNoA11yViolations,",
					"  toHaveAnnounced",
					"});",
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"test('saving says so', async () => {",
					"  const user = userEvent.setup();",
					"  const { container } = render(<SaveBar />);",
					"  await user.click(screen.getByRole('button', { name: 'Save' }));",
					"",
					"  expect(container).toHaveAnnounced('Saved');",
					"  expect(window).not.toHaveAnnounced(/error/i);",
					"});",
				]}
			/>
			<p>
				Un string tiene que ser el texto completo; un RegExp puede coincidir con una parte. Sobre
				un elemento, solo cuentan las regiones vivas que es o que contiene; sobre{" "}
				<code>window</code> o <code>document</code>, todos los anuncios desde que se instaló el
				hook. Es lo que la página puso a disposición para anunciar, no lo que dijo un lector de
				pantalla, y <code>toHaveAnnounced()</code> lanza un error sin el hook. Dos cosas que
				conviene saber: React añade sus listeners a la raíz en la que renderiza, no a cada
				elemento, así que en un componente de React el análisis ve los listeners de la raíz y
				juzga sus botones por su marcado, como sin el hook; y el hook de regiones vivas lee los
				cambios por lotes, así que primero renderiza y luego actúa, con un <code>await</code>{" "}
				entre medias (<code>await user.click()</code>), como hace un usuario real. El{" "}
				<a href="https://github.com/SureA11y/test-matchers#click-handlers-added-from-script-the-listener-hook">
					README del paquete
				</a>{" "}
				tiene los detalles.
			</p>

			<h2>Mensajes de fallo</h2>
			<p>
				Enumera cada ocurrencia que falla, no solo cada regla (una regla puede marcar varios
				elementos), con el ID de la regla, la gravedad, un resumen legible, el selector del
				elemento que falla y una pista para corregirlo cuando la hay. Nombra la versión de{" "}
				<code>@surea11y/core</code> que produjo el resultado, para citarla en un informe de error,
				y después enumera las preguntas, que no cuentan como fallos. Con un salto de nivel de
				encabezado junto a la imagen:
			</p>
			<CodeBlock
				lines={[
					"expected no accessibility violations, but found 1:",
					"",
					"1) img-alt-present (serious): This <img> has no alt attribute.",
					"   at body > main > img",
					"   Add an alt attribute that says what the image shows, or alt=\"\" if the image is purely decorative.",
					"",
					"Scanned with @surea11y/core 1.14.1.",
					"",
					"2 findings need manual review (cantTell, not counted as failures):",
					"",
					"1) heading-order (minor, likely fails): This heading jumps from level 1 to level 3, skipping a level.",
					"   at body > main > h3",
					"   Go down one level at a time, so an <h2> is followed by an <h3> rather than an <h4>, and the outline of the page stays easy to follow.",
					"   Why it likely fails: The heading skips a level after the one before it.",
					"",
					"Open questions, which only a person can answer: manual-review.",
				]}
			/>
			<p>
				Antes de la línea de versión, el mensaje puede incluir notas sobre cómo se ejecutó el
				análisis: cuando el análisis preguntó por elementos personalizados que podría haber leído
				con el <a href="#web-components">hook de internals</a>, o juzgó hallazgos que el{" "}
				<a href="#listener-and-live-region-hooks">hook de listeners o el de regiones vivas</a>{" "}
				habría decidido, una línea dice cuántos y que lo instales. Con{" "}
				<code>{"{ leanFail: true }"}</code>, las preguntas que probablemente fallan suben a los
				fallos, y la cabecera cuenta ambos (<code>found 1 failure and 1 likely failure:</code>).
			</p>
			<p>Un pack que no se ejecutó se nombra con el motivo:</p>
			<CodeBlock
				lines={[
					"expected no accessibility violations, but the scan left out what it was asked to check:",
					"",
					"No accessibility violations found in what was scanned.",
					"",
					"Pack \"@acme/a11y-policy\" did not run: it supports core ^2.0.0, and this is core 1.14.0.",
					"",
					"Scanned with @surea11y/core 1.14.1.",
				]}
			/>

			<p>
				Ejemplos ejecutables, en paralelo, para ambos frameworks:{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/basic.test.js">Jest</a>{" "}
				y{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/basic.vitest.test.js">
					Vitest
				</a>
				, y lo mismo con un pack:{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/pack.test.js">Jest</a>{" "}
				y{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/pack.vitest.test.js">
					Vitest
				</a>
				, y un componente pequeño comprobado con los hooks de listeners y de regiones vivas,{" "}
				<code>toHaveAnnounced()</code> y <code>leanFail</code>:{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/hooks.test.js">Jest</a>{" "}
				y{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/hooks.vitest.test.js">
					Vitest
				</a>
				. Para la superficie completa de <code>engineOptions</code> (locale, modos de contraste,
				shadow DOM, reglas personalizadas, combinaciones de etiquetas de versión de WCAG), consulta{" "}
				<a href={`${core}/docs/ENGINE_OPTIONS.md`}><code>ENGINE_OPTIONS.md</code></a>. Este
				paquete reenvía todo lo que le pasas en lugar de duplicar esa referencia.
			</p>
		</>
	);
}
