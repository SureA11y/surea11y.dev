import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

// The example pack each binding ships as examples/acme-policy-pack.js.
const examplePack = [
	"'use strict';",
	"",
	"// A small pack: one house rule, a checklist profile and two checklist items.",
	"// A real pack is a package of its own; `npx surea11y-pack new <folder>` writes one.",
	"",
	"const { definePack, wcagTags } = require('@surea11y/core/pack');",
	"",
	"module.exports = definePack({",
	"  name: '@acme/a11y-policy',",
	"  title: 'Acme web policy',",
	"  version: '1.0.0',",
	"  namespace: 'acme',",
	"  core: '^1.11.1',",
	"  rules: [",
	"    {",
	"      id: 'acme-no-autoplay',",
	"      meta: {",
	"        title: 'Videos do not play sound on their own',",
	"        description: 'A video that starts with sound talks over a screen reader.',",
	"        tags: ['acme'],",
	"        defaultSeverity: 'serious'",
	"      },",
	"      runInPage(ctx) {",
	"        // defaultMuted reflects the muted attribute where muted isn't set from it yet (jsdom).",
	"        const loud = [...ctx.document.querySelectorAll('video[autoplay]')].filter((v) => !(v.muted || v.defaultMuted));",
	"        return loud.length",
	"          ? {",
	"              outcome: 'fail',",
	"              occurrences: loud.map((v) =>",
	"                ctx.helpers.reportOccurrence(v, { summary: 'This video plays with sound as the page opens.', hint: 'Remove autoplay, or add muted.' })",
	"              )",
	"            }",
	"          : { outcome: 'pass', occurrences: [] };",
	"      }",
	"    }",
	"  ],",
	"  profiles: {",
	"    'acme-web-2026': { tags: wcagTags('2.2', ['A', 'AA']), rules: ['region', 'acme-no-autoplay'] }",
	"  },",
	"  rollups: [",
	"    { id: 'acme-images', title: 'Images have a text alternative', checksIds: ['img-alt-present'] },",
	"    { id: 'acme-media', title: 'Media stays quiet until asked', checksIds: ['acme-no-autoplay'] }",
	"  ]",
	"});",
];

const kindRows = [
	{
		id: "checklist",
		have: "La política de accesibilidad de una organización: «WCAG 2.2 AA, más estas reglas, menos esta otra, con estos elementos en nuestro informe»",
		kind: <strong>lista de comprobación</strong>,
		holds: "Perfiles que eligen reglas de core y reglas propias, y resultados agregados como elementos de la lista de comprobación.",
	},
	{
		id: "standard",
		have: "Un estándar con requisitos propios (un estándar nacional como RGAA, uno de un sector): requisitos numerados, cada uno comprobado por algunas reglas",
		kind: <strong>estándar</strong>,
		holds: "Una tabla de requisitos, las reglas que comprueban cada requisito, un resultado por requisito y perfiles.",
	},
	{
		id: "rules",
		have: "Unas cuantas reglas que añadir a cada análisis, sin perfil",
		kind: "solo reglas",
		holds: "Reglas, y variantes o sustituciones de las de core. Parte de una lista de comprobación y elimina sus perfiles y resultados agregados.",
	},
];

const fileRows = [
	{ id: "index", file: <code>index.js</code>, what: <>El pack, escrito con <code>definePack()</code> de <code>@surea11y/core/pack</code>.</> },
	{ id: "auto", file: <code>rules/automatic/&lt;ns&gt;-link-text-specific.js</code>, what: "Una regla que decide, usando los helpers de core." },
	{ id: "variant", file: <code>rules/automatic/&lt;ns&gt;-contrast-enhanced.js</code>, what: <>Una variante de <code>contrast-minimum</code> de core a 7:1.</> },
	{ id: "manual", file: <code>rules/manual/&lt;ns&gt;-new-window-review.js</code>, what: "Una regla manual que solicita revisión humana." },
	{ id: "i18n", file: <code>i18n/en.json</code>, what: "Los mensajes." },
	{ id: "tests", file: <><code>tests/rules/*.test.js</code>, <code>tests/profiles.test.js</code></>, what: "Una prueba por regla, y lo que ejecuta cada perfil." },
	{ id: "examples", file: <code>docs/RULE_EXAMPLES.md</code>, what: "Ejemplos de los resultados de cada regla." },
	{ id: "eslint", file: <code>eslint.config.js</code>, what: "Las reglas de lint de core para reglas." },
	{ id: "standard", file: <><code>requirements.js</code>, <code>rule-map.js</code></>, what: "Solo para un estándar: los requisitos y las reglas que comprueban cada uno." },
];

const profileFieldRows = [
	{ id: "tags", field: <code>tags</code>, what: <>Las reglas que llevan cualquiera de estas etiquetas. <code>wcagTags(version, levels)</code> de <code>@surea11y/core/pack</code> da las etiquetas de WCAG de core (<code>wcagTags('2.1')</code> es 2.0 y 2.1, A y AA).</> },
	{ id: "rules", field: <code>rules</code>, what: <>Reglas por id, de core o del pack: una regla de buenas prácticas que ninguna etiqueta de WCAG selecciona o, con <code>tags: []</code>, las reglas de core que el perfil ejecuta además de las propias del pack.</> },
	{ id: "exclude", field: <code>exclude</code>, what: <><code>{"{ rules: [...] }"}</code> deja reglas fuera del análisis; <code>{"{ criteria: ['2.5.8'] }"}</code> exime de esos criterios: sus resultados agregados desaparecen, y también cada regla de la que se eximen todos los criterios; una regla que también comprueba un criterio que el perfil conserva se sigue ejecutando. Esto reduce lo que comprueba el análisis: los requisitos de WCAG siguen siendo los mismos.</> },
	{ id: "severity", field: <code>severity</code>, what: <><code>{"{ ruleId: level }"}</code>: otra gravedad bajo el perfil. Los resultados la muestran y conservan la propia de la regla como <code>ruleSeverity</code>; las líneas base y los ids de los hallazgos no cambian.</> },
	{ id: "wcagVersion", field: <code>wcagVersion</code>, what: <><code>'2.0'</code>, <code>'2.1'</code> o <code>'2.2'</code>: la versión de WCAG con la que se juzgan los análisis del perfil (<code>engine.wcagVersion</code>). Sin ella, las etiquetas de WCAG de <code>tags</code> implican la versión, y un perfil sin ninguna se juzga con 2.2. El <code>engineOptions.wcagVersion</code> propio de un análisis sigue ganando. Core 1.12.0 y posteriores.</> },
	{ id: "version", field: <><code>version</code>, <code>mappedRules</code></>, what: <>Solo para el perfil de un estándar: la versión del estándar a la que apunta, y <code>mappedRules: true</code> para ejecutar todas las reglas que el estándar asocia para esa versión.</> },
];

export function PacksContent() {
	return (
		<>
			<p>
				Un <strong>pack</strong> aporta a <code>@surea11y/core</code> reglas, variantes de las reglas
				de core, un estándar o una lista de comprobación, junto con sus perfiles y mensajes, desde un
				paquete independiente, sin una bifurcación ni una compilación de core. Un estándar nacional
				como RGAA puede ser un pack, y también la política de accesibilidad de tu organización. Un
				análisis recibe los packs en <code>engineOptions.packs</code>, y los ejecuta igual que las
				propias reglas y estándares de core: en Node y en un navegador, desde la CLI, las
				integraciones y los test matchers, con resultados, resultados agregados y entradas de informe
				con el mismo formato que las de core. Los packs necesitan <code>@surea11y/core</code> 1.11.1 o
				posterior.
			</p>

			<h2 id="which-kind-of-pack">Qué tipo de pack</h2>
			<DataTable
				label="Tipos de pack"
				rowKey="id"
				columns={[
					{ key: "have", label: "Tienes", wrap: true },
					{ key: "kind", label: "Tipo", width: "16%" },
					{ key: "holds", label: "Qué contiene", wrap: true },
				]}
				rows={kindRows}
			/>
			<p>
				Las reglas y los perfiles de un pack pueden usar cualquiera de las reglas de core: una lista
				de comprobación o un estándar consiste sobre todo en reglas de core, elegidas y agrupadas,
				más las pocas reglas que core no tiene. Los ejemplos de esta página usan{" "}
				<code>acme-policy-pack.js</code>, el pequeño pack que cada integración incluye en su carpeta{" "}
				<code>examples/</code>: una regla propia, un perfil de lista de comprobación (WCAG 2.2 A y
				AA, <code>region</code> y la regla propia) y dos elementos de lista de comprobación.{" "}
				<a href="#start-from-the-example">Su código fuente</a> está más abajo.
			</p>

			<h2 id="using-a-pack">Usar un pack</h2>

			<h3 id="from-node">Desde Node</h3>
			<CodeBlock
				lang="js"
				lines={[
					"const { runDomRulesInPage, getChecksCatalog } = require('@surea11y/core');",
					"const acmePolicy = require('./acme-policy-pack');",
					"",
					"const result = runDomRulesInPage(url, null, { packs: [acmePolicy], profile: 'acme-web-2026' }, null);",
					"result.engine.packs;   // ['@acme/a11y-policy@1.0.0']",
					"getChecksCatalog({ packs: [acmePolicy] }); // core's rules and the pack's",
				]}
			/>
			<p>
				El pack se prepara una vez y se conserva para el siguiente análisis con el mismo objeto de
				pack, así que un rastreo que pasa los mismos packs a cada página los prepara una sola vez.{" "}
				<code>definePack</code> congela el objeto del pack: trátalo como inmutable y reutiliza el
				mismo objeto entre análisis. Pasar un pack lo registra para el análisis; no selecciona sus
				reglas. Una regla de un pack etiquetada con el espacio de nombres del pack es opcional: sin
				uno de los perfiles del pack, solo se ejecuta cuando se selecciona por id o por esa etiqueta
				(consulta <a href="#names">Nombres</a>). Una regla de un pack sin la etiqueta se selecciona
				igual que las reglas de core, así que un análisis predeterminado con el pack la ejecuta.
				Añade{" "}
				<code>{"runOnly: { bestPractices: true }"}</code> junto al perfil para ejecutar también las
				buenas prácticas.
			</p>

			<h3 id="with-a-browser-binding">Con una integración de navegador</h3>
			<p>
				Playwright, Puppeteer, Selenium y WebdriverIO reciben el objeto de pack en{" "}
				<code>.withPacks()</code>, y lo registran en la página, y en cada frame con{" "}
				<code>.frames(true)</code>, antes del análisis:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { A11yCoreBuilder, getScanGaps } = require('@surea11y/playwright');",
					"const acmePolicy = require('./acme-policy-pack');",
					"",
					"const results = await new A11yCoreBuilder({ page })",
					"  .withPacks(acmePolicy)",
					"  .options({ profile: 'acme-web-2026' })",
					"  .analyze();",
					"",
					"results.engine.packs;   // ['@acme/a11y-policy@1.0.0']",
					"",
					"// A checklist's items, each one result, beside core's WCAG rollups:",
					"results.rulesResults.filter((r) => r.meta && r.meta.standard === 'Acme web policy');",
				]}
			/>
			<p>
				Pasa un array, o llama de nuevo a <code>.withPacks()</code>, para analizar con varios packs.
				Las integraciones comparten <code>.withPacks()</code>, pero cada builder recibe su propio
				objeto de driver (<code>{"{ page }"}</code>, <code>{"{ driver }"}</code> o{" "}
				<code>{"{ browser }"}</code>) y necesita su propia configuración: consulta{" "}
				<a href="/getting-started/playwright/">Playwright</a>,{" "}
				<a href="/getting-started/puppeteer/">Puppeteer</a>,{" "}
				<a href="/getting-started/selenium/">Selenium</a> y{" "}
				<a href="/getting-started/webdriverio/">WebdriverIO</a>.
			</p>

			<h3 id="with-cypress">Con Cypress</h3>
			<p>
				Un pack se prepara en Node, y una spec de Cypress se ejecuta en el navegador. Por eso, en
				Cypress, <code>.withPacks()</code> recibe el nombre de módulo de cada pack (un nombre de
				paquete, o una ruta desde la raíz del proyecto), y el plugin de la integración prepara el
				pack en Node. Registra el plugin una vez:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// cypress.config.js",
					"const { defineConfig } = require('cypress');",
					"const surea11y = require('@surea11y/cypress/plugin');",
					"",
					"module.exports = defineConfig({",
					"  e2e: {",
					"    setupNodeEvents(on, config) {",
					"      surea11y(on, config);",
					"    }",
					"  }",
					"});",
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"new A11yCoreBuilder()",
					"  .withPacks('./examples/acme-policy-pack.js') // or a package name, '@acme/a11y-policy'",
					"  .options({ profile: 'acme-web-2026' })",
					"  .analyze()",
					"  .then((results) => {",
					"    expect(results.engine.packs).to.deep.equal(['@acme/a11y-policy@1.0.0']);",
					"  });",
				]}
			/>
			<p>
				<code>.analyze()</code> pide al plugin, mediante <code>cy.task</code>, el script que
				registra los packs, y lo ejecuta en la página, y en cada frame del mismo origen con{" "}
				<code>.frames(true)</code>. El plugin conserva un pack durante el resto de la ejecución, así
				que un cambio en el archivo de un pack aparece en el siguiente <code>cypress run</code>, o
				tras reiniciar <code>cypress open</code>. Un objeto de pack, como el que reciben las demás
				integraciones, lanza un error en <code>.withPacks()</code>: no se puede preparar en el
				navegador.
			</p>

			<h3 id="with-the-test-matchers">Con los test matchers</h3>
			<p>
				<code>@surea11y/test-matchers</code> analiza en Node, así que un pack se pasa como el propio
				objeto:
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
				]}
			/>
			<p>
				Mantén los objetos de pack en un solo lugar (un archivo de configuración o un módulo), para
				que todas las pruebas pasen los mismos. Un pack que no se ejecutó hace fallar la aserción.
				Consulta <a href="/getting-started/test-matchers/#packs">test-matchers</a>.
			</p>

			<h3 id="from-the-cli">Desde la CLI</h3>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --pack ./acme-policy-pack.js --profile acme-web-2026", command: true },
					{ text: "surea11y scan ./dist/index.html --pack @acme/a11y-policy --profile acme-web-2026", command: true },
				]}
			/>
			<p>
				<code>--pack</code> recibe un nombre de paquete, resuelto desde el proyecto del directorio de
				trabajo, o una ruta, y se repite para varios packs. El pack carga{" "}
				<code>@surea11y/core/pack</code>, que se instala junto a la CLI cuando instalas{" "}
				<code>@surea11y/cli</code> en el proyecto. Consulta{" "}
				<a href="/getting-started/cli/#packs">CLI</a>.
			</p>

			<h3 id="in-a-page-of-your-own">En una página propia</h3>
			<p>
				Para una extensión de navegador o un <code>page.evaluate</code> propio, inyecta{" "}
				<code>packScript([acmePolicy])</code> de <code>@surea11y/core/pack</code> después del bundle
				de navegador de core, o distribuye un solo archivo generado con{" "}
				<code>buildBrowserBundle({"{ packs: [acmePolicy] }"})</code>, y nombra el pack como{" "}
				<code>name@version</code>. Consulta{" "}
				<a href="/getting-started/standalone/#packs-in-a-page">Uso independiente</a>.
			</p>

			<h2 id="what-a-scan-reports">Qué informa un análisis</h2>
			<ul>
				<li>
					<code>engine.packs</code> nombra cada pack que se ejecutó, como <code>name@version</code>,
					y <code>engine.profile</code> el perfil que se aplicó.
				</li>
				<li>
					Las reglas de un pack aparecen en <code>checksResults</code> igual que las de core, con
					ids que empiezan por su espacio de nombres (<code>acme-no-autoplay</code>). Una regla de
					un pack que se asocia a un criterio de WCAG cuenta para el resultado agregado de ese
					criterio, salvo que lleve la etiqueta opcional del espacio de nombres del pack: esas
					reglas comprueban lo que WCAG no exige, así que solo cuentan en los resultados agregados
					propios del pack. El <code>wcagSc</code> de esas reglas sigue nombrando los criterios de WCAG que
					comprueban, para los generadores de informes, y ningún otro estándar (EN 301 549, que
					asocia cada regla por sus criterios de WCAG) las reclama. Una sustitución cuenta en lugar de la regla de core a la que reemplaza,
					donde la sitúe su propio mapeo.
				</li>
				<li>
					Los elementos de una lista de comprobación, o los requisitos de un estándar, son
					resultados agregados en <code>rulesResults</code>, con el nombre de la lista de
					comprobación o del estándar como <code>meta.standard</code>. El{" "}
					<a href="/results-reports/html-report/">Informe HTML</a> los muestra en una sección
					propia, <a href="/results-reports/sarif-report/">SARIF</a> etiqueta cada regla con los
					elementos a los que pertenece (<code>acme-images</code>), y{" "}
					<a href="/results-reports/junit-report/">JUnit</a> los enumera como propiedades. El campo{" "}
					<code>standards</code> del resultado nombra la lista de comprobación, así que un resultado
					guardado se muestra igual dondequiera que se genere.
				</li>
				<li>
					La gravedad definida por un perfil (<code>severity</code>) aparece en los resultados que
					cambia, y la gravedad propia de la regla se conserva como <code>ruleSeverity</code>.
				</li>
			</ul>

			<h2 id="when-a-pack-doesnt-run">Cuando un pack no se ejecuta</h2>
			<p>
				Un pack cuyo rango <code>core</code> deja fuera el core instalado, que no es válido, o que no
				encaja con core (un id de regla fuera de su espacio de nombres, una clave de diccionario que
				core ya tiene, una variante de una regla que no existe) se omite: el análisis se ejecuta sin
				él, avisa, y lo enumera en <code>skippedPacks</code> como{" "}
				<code>{"{ name, reason }"}</code>. Con <code>strictOptions</code> lanza un error, con{" "}
				<code>code: 'INVALID_ENGINE_OPTIONS'</code>, como todo error de{" "}
				<code>engineOptions.packs</code>. Dos packs
				que chocan entre sí (una clave de diccionario que definen ambos, dos estándares con una misma
				clave) lanzan un error, ya que cualquier forma de elegir entre ellos dependería del orden en
				que se pasaron. En una página, un pack nombrado en <code>engineOptions.packs</code> que
				ninguna llamada a <code>packScript</code> registró, o que se registró con otra versión de
				core, se enumera de la misma forma. Así, un análisis puede terminar sin las comprobaciones
				para las que añadiste el pack: una herramienta que depende de un pack debería comprobar{" "}
				<code>skippedPacks</code> antes de dar el análisis por completo.
			</p>
			<p>Cada herramienta convierte un pack omitido en un fallo visible:</p>
			<ul>
				<li>
					Las integraciones de navegador comprueban cada pack cuando llamas a{" "}
					<code>.withPacks()</code> y lanzan un error antes de analizar si core no puede ejecutar
					uno. Un pack que la página luego no ejecuta es una carencia <code>'pack-skipped'</code> en{" "}
					<code>getScanGaps(results)</code>, y <code>.analyze()</code> avisa de ello, así que una
					prueba que comprueba las carencias falla.
				</li>
				<li>Los test matchers hacen fallar la aserción, nombrando el pack y el motivo.</li>
				<li>
					La CLI sale con <code>2</code>, sin escribir ningún informe ni línea base, para un pack que
					no puede encontrar o cargar, o uno que el motor omite.
				</li>
			</ul>
			<p>
				Instala el pack junto al paquete que lo ejecuta, para que npm resuelva un solo{" "}
				<code>@surea11y/core</code> para ambos.
			</p>

			<h2 id="writing-a-pack">Escribir un pack</h2>

			<h3 id="start-from-the-example">Partir del ejemplo</h3>
			<p>
				Un pack es un objeto creado con <code>definePack</code> de <code>@surea11y/core/pack</code>.
				Este es <code>acme-policy-pack.js</code>, el ejemplo que incluyen las integraciones:
			</p>
			<CodeBlock lang="js" lines={examplePack} />
			<p>
				Su perfil, <code>acme-web-2026</code>, ejecuta las reglas de WCAG 2.2 A y AA de core, la
				regla de buenas prácticas <code>region</code>, que ninguna etiqueta de WCAG selecciona, y la
				regla propia. Sus dos resultados agregados son los elementos de la lista de comprobación:
				cada uno agrupa reglas, de core o del pack, en un solo resultado.
			</p>

			<h3 id="create-one">Crear uno con <code>surea11y-pack new</code></h3>
			<p>Para un pack propio, parte de un paquete generado:</p>
			<CodeBlock
				lines={[
					{ text: "npx -p @surea11y/core surea11y-pack new acme-a11y --name @acme/a11y-pack", command: true },
					"# or, for a standard:",
					{ text: "npx -p @surea11y/core surea11y-pack new city-standard --name @city/a11y-standard --kind standard --title \"City Standard\"", command: true },
					"",
					{ text: "cd acme-a11y", command: true },
					{ text: "npm install", command: true },
					{ text: "npx playwright install chromium   # once, for npm run docs", command: true },
					{ text: "npm test && npm run lint && npm run docs", command: true },
				]}
			/>
			<p>
				El pack funciona tal como se genera: sus pruebas pasan, sus reglas pasan el lint sin
				errores, sus ejemplos concuerdan con sus reglas. <code>surea11y-pack new</code> comprueba
				el pack como lo haría un análisis antes de escribir nada, y rechaza un nombre, un espacio
				de nombres o un título que lo harían no válido (un título <code>WCAG</code> nombra su
				estándar como uno de los de core), explicando por qué. A partir de ahí, cámbialo paso a
				paso, ejecutando <code>npm test</code> sobre la marcha. Su README recorre cada archivo:
			</p>
			<DataTable
				label="Archivos de un pack generado"
				rowKey="id"
				columns={[
					{ key: "file", label: "Archivo", width: "40%", wrap: true },
					{ key: "what", label: "Qué contiene", wrap: true },
				]}
				rows={fileRows}
			/>

			<h3 id="names">Nombres</h3>
			<ul>
				<li>
					<strong>El nombre y la versión del paquete</strong> son un nombre de paquete npm y una
					versión completa (<code>1.0.0</code>). Un análisis los informa en{" "}
					<code>engine.packs</code>.
				</li>
				<li>
					<strong>El espacio de nombres</strong> (<code>namespace: 'acme'</code>) mantiene los ids
					del pack separados de los de core y de los de otros packs: todo id de regla, de resultado
					agregado y de perfil empieza por él y <code>-</code>. No puede ser un prefijo de los ids de
					regla de core (<code>img</code>, <code>aria</code> o <code>link</code> lo serían, como en{" "}
					<code>img-alt-present</code>), ni empezar por <code>wcag</code>, y dos packs de un mismo
					análisis no pueden compartirlo. También es la etiqueta que hace opcionales las
					reglas propias del pack: una regla etiquetada con él solo se ejecuta bajo uno de los
					perfiles del pack, por su id o por la etiqueta (<code>optInRules: ['acme']</code>). Por
					defecto, entonces, un análisis que apunta a WCAG no la ejecuta. Desbloquear la etiqueta con{" "}
					<code>optInRules</code> no quita el perfil ni los filtros del análisis: con un perfil de
					WCAG, una regla desbloqueada solo se ejecuta cuando sus etiquetas también coinciden con
					ese perfil. Quita la etiqueta de una regla que deba
					ejecutarse en todos los análisis con el pack: entonces se selecciona igual que las reglas de
					core, y un análisis que apunta a WCAG puede ejecutarla e informar de sus fallos cuando sus
					etiquetas coinciden.
				</li>
				<li>
					<strong><code>core</code></strong> es el rango de versiones de core con las que funciona
					el pack (<code>'^1.11.1'</code>), interpretado como npm interpreta los rangos. Empieza los
					packs nuevos en 1.11.1: el paquete 1.11.0 omitía un archivo que los packs necesitan en
					Node. Un análisis
					con un core fuera de él omite el pack, con el motivo en <code>skippedPacks</code>.
				</li>
				<li>
					<strong><code>title</code></strong> es como los resultados y los informes llaman a una
					lista de comprobación, y <strong><code>description</code></strong> una frase sobre lo que
					comprueba el pack, para herramientas que permiten a sus usuarios elegir packs (
					<code>describePacks</code> la devuelve).
				</li>
			</ul>

			<h3 id="profiles">Perfiles</h3>
			<p>
				Un perfil es una selección con nombre, que se ejecuta con <code>engineOptions.profile</code>.
				Una regla se ejecuta bajo él cuando tiene una de las etiquetas definidas en{" "}
				<code>tags</code> o su id está en{" "}
				<code>rules</code>, y no está en <code>exclude</code>; las reglas del pack etiquetadas con
				su espacio de nombres se ejecutan bajo todos los perfiles del pack.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"profiles: {",
					"  'acme-policy': {",
					"    tags: wcagTags('2.2', ['A', 'AA']),               // core's WCAG 2.2 A and AA rules",
					"    rules: ['region', 'heading-order'],               // and these, by id",
					"    exclude: { rules: ['contrast-minimum'] },         // but not this one",
					"    severity: { 'img-alt-present': 'critical' }       // and this one is critical here",
					"  },",
					"  'acme-quick': {",
					"    tags: [],",
					"    rules: ['img-alt-present', 'link-name-present', 'page-title-present']",
					"  }",
					"}",
				]}
			/>
			<DataTable
				label="Campos de un perfil"
				rowKey="id"
				columns={[
					{ key: "field", label: "Campo", width: "22%" },
					{ key: "what", label: "Qué hace", wrap: true },
				]}
				rows={profileFieldRows}
			/>
			<p>
				<strong>Un perfil que ejecuta solo lo que pide su estándar.</strong> El perfil de un
				estándar con <code>{"tags: [<ns>]"}</code> y <code>mappedRules: true</code> ejecuta las
				reglas propias del pack y las reglas de core que su mapa vincula a un requisito, y nada
				más: ninguna regla comprueba lo que el estándar no pide, y los resultados no contienen
				criterios de WCAG. Sin etiqueta de WCAG, sin embargo, nada dice en qué versión de WCAG se
				basa el estándar, y la ejecución se juzga con 2.2. Para un estándar basado en 2.1 eso es
				un error: el 4.1.1 <span lang="en">Parsing</span> desaparece en 2.2, así que{" "}
				<code>duplicate-id</code> pregunta en lugar de fallar. Indica la versión. El{" "}
				<code>index.js</code> generado la lee de <code>requirements.js</code>, donde cada versión
				del estándar nombra la versión de WCAG en la que se basa (
				<code>{"{ version: '1.0', wcagVersion: '2.2' }"}</code>):
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"'city-1.0': {",
					"  version: '1.0',",
					"  tags: ['city'],                      // the pack's own rules",
					"  mappedRules: true,                   // and the core rules its map links to a requirement",
					"  wcagVersion: wcagVersionOf('1.0')    // judged by the WCAG version requirements.js gives for 1.0",
					"}",
				]}
			/>
			<p>
				Las reglas de core, con sus ids y etiquetas, están en <a href="/rules/">Reglas</a>.
			</p>

			<h3 id="checklist-items-and-requirements">Elementos de lista de comprobación y requisitos</h3>
			<p>
				<strong>Los elementos de una lista de comprobación</strong> son sus <code>rollups</code>:{" "}
				<code>{"{ id, title, checksIds }"}</code>, cada uno de los cuales agrupa reglas en un solo
				resultado. Un elemento falla cuando falla una de sus reglas, y pasa cuando pasan. Cuando
				ninguna falla pero una devuelve <code>cantTell</code>, el elemento también es{" "}
				<code>cantTell</code>: necesita revisión humana. Un pack indica o bien <code>profiles</code> y{" "}
				<code>rollups</code>, una lista de comprobación, o bien un <code>standard</code>, no
				ambos.
			</p>
			<p>
				<strong>Los requisitos de un estándar</strong> vienen de dos tablas que escribe el
				generador: <code>requirements.js</code> (por versión, el número, la redacción y los criterios
				de WCAG de cada requisito) y <code>rule-map.js</code> (qué requisitos comprueba cada regla, y
				por qué). <code>ruleMappedStandard()</code> de <code>@surea11y/core/pack</code> los convierte
				en el estándar: un resultado agregado por requisito, los requisitos que nombra el resultado
				de cada regla, y comprobaciones de ambas tablas cuando se prepara el pack.
			</p>

			<h3 id="rules">Reglas</h3>
			<p>
				Una regla tiene la forma de los módulos de regla de core:{" "}
				<code>{"{ id, meta, runInPage }"}</code>, y <code>applicability</code> cuando solo se aplica
				a veces, con el mismo <code>ctx</code>. <code>runInPage(ctx)</code> se ejecuta en la página,
				así que solo usa <code>ctx</code>, nunca una variable o un módulo de fuera, y solo lee: las
				reglas de un pack se ejecutan después de las de core, y los helpers y las opciones que
				reciben son de solo lectura. Solo lectura es una norma, no un entorno aislado: nada impide
				que el código de una regla haga más, así que carga solo packs de confianza (consulta la{" "}
				<a href={`${core}/SECURITY.md`}>política de seguridad</a> de core en GitHub). Tres atajos
				necesitan poco o ningún código:{" "}
				<strong>una variante</strong> ejecuta una regla de core con otros ajustes (
				<code>{"{ id, from: 'contrast-minimum', config: { normalTextRatio: 7 }, meta }"}</code>;
				cada ajuste es un umbral, un número finito mayor que 0, y <code>definePack</code> rechaza
				cualquier otro valor),{" "}
				<strong>una sustitución</strong> reemplaza una regla de core (enumerada en{" "}
				<code>overrides</code>, y en el <code>overriddenBuiltinIds</code> de los resultados), y{" "}
				<strong>una regla de core tal cual</strong> solo necesita su id en un perfil o en un
				resultado agregado. Cómo escribir una regla está en la{" "}
				<a href={`${core}/docs/RULE_AUTHORING.md`}>guía de autoría de reglas</a> de core en GitHub.
			</p>

			<h3 id="messages">Mensajes e idiomas</h3>
			<p>
				Cada texto que muestra una regla tiene una clave, guardada por idioma en{" "}
				<code>i18n/&lt;locale&gt;.json</code> y enumerada en los <code>dictionaries</code> del pack.
				Un análisis con <code>engineOptions.locale: 'fr'</code> muestra los textos en francés; si el pack no
				incluye un diccionario para el idioma solicitado, se muestran en inglés. Las
				claves de un pack son propias y empiezan por su espacio de nombres: un pack no puede cambiar
				un mensaje de core en un idioma que core incluye.
			</p>

			<h3 id="test-lint-document">Probarlo, pasarle el lint y documentarlo</h3>
			<ul>
				<li>
					<strong>Las pruebas</strong> usan <code>@surea11y/core/testing</code>, lo mismo que usan
					las pruebas de reglas del propio core:{" "}
					<code>runa11yCoreOnHtml(html, {"{ engineOptions }"})</code> analiza HTML en jsdom, y{" "}
					<code>assertRule(result, ruleId, outcome)</code> comprueba una regla. Con packs, el análisis
					los ejecuta tanto desde los objetos de pack como tal como los tiene una página, así que una
					regla que lee una variable de fuera de su función falla su prueba. Necesita jsdom como
					dependencia de desarrollo.
				</li>
				<li>
					<strong>El lint</strong> (<code>npm run lint</code>,{" "}
					<code>@surea11y/core/eslint-plugin</code>) somete las reglas del pack a las mismas reglas
					de lint que las de core.
				</li>
				<li>
					<strong>La documentación</strong> (<code>npm run docs</code>,{" "}
					<code>surea11y-pack docs</code>) escribe el <code>docs/RULE_CATALOG.md</code> del pack y
					ejecuta en Chromium todos los ejemplos de su <code>docs/RULE_EXAMPLES.md</code> (
					<code>CHROMIUM_EXECUTABLE_PATH</code> nombra otra compilación de Chromium);{" "}
					<code>--check</code> falla cuando alguno de los dos está desactualizado, para la CI del
					pack.
				</li>
			</ul>

			<h3 id="publish">Publicarlo</h3>
			<p>
				El paquete generado es <code>private</code>. Elige su licencia, define{" "}
				<code>license</code> y quita <code>private</code> en <code>package.json</code>, y ejecuta{" "}
				<code>npm publish</code>. Mantén <code>@surea11y/core</code> como dependencia peer, con el
				rango en <code>core</code>. Semver cubre aquello sobre lo que se construye un pack: un pack
				escrito para core 1.11 sigue funcionando con versiones 1.x posteriores. Para tus propios
				usuarios, el id de una regla y sus códigos de motivo son lo que guardan sus líneas base:
				cambia el nombre de uno o elimínalo solo en una versión mayor del pack.
			</p>
			<p>
				La guía completa, desde una carpeta vacía hasta un pack publicado, es{" "}
				<a href={`${core}/docs/PACKS.md`}>
					<code>PACKS.md</code>
				</a>{" "}
				de core en GitHub, y cada campo está en la referencia de packs de{" "}
				<a href={`${core}/docs/ENGINE_OPTIONS.md#packs--rules-and-standards-from-outside-core`}>
					<code>ENGINE_OPTIONS.md</code>
				</a>
				.
			</p>
		</>
	);
}
