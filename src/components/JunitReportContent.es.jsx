import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const outcomeRows = [
	{
		id: "fail",
		outcome: <code>fail</code>,
		junit: (
			<>
				<code>&lt;failure type="fail"&gt;</code>, una línea por ocurrencia fallida (mensaje, pista,
				selector, marcado), y después <code>help: &lt;url&gt;</code> cuando la regla tiene un enlace
				de ayuda <code>http(s)</code> (<code>meta.helpUrl</code>), o si no, el documento{" "}
				<span lang="en">Understanding</span> de su primer criterio de WCAG
			</>
		),
		why: "El caso determinista que condiciona la compilación.",
	},
	{
		id: "cantTell",
		outcome: <code>cantTell</code>,
		junit: (
			<>
				<code>&lt;skipped&gt;</code> indicando cuántas ocurrencias necesitan revisión manual
			</>
		),
		why: (
			<>
				JUnit no tiene "no se pudo determinar". Omitido lo muestra sin poner la compilación en
				rojo, el mismo criterio que sigue <a href="/results-reports/sarif-report/">SARIF</a> con{" "}
				<code>warning</code>.
			</>
		),
	},
	{ id: "pass", outcome: <code>pass</code>, junit: <>un <code>&lt;testcase&gt;</code> sin más</>, why: "" },
	{
		id: "notApplicable",
		outcome: <code>notApplicable</code>,
		junit: "se omite",
		why: (
			<>
				Una página tiene cientos y ninguno dice nada. <code>includeNotApplicable: true</code> los
				añade como <code>&lt;skipped message="Not applicable"&gt;</code>.
			</>
		),
	},
	{
		id: "ruleError",
		outcome: <>una regla que no terminó (<code>cantTell</code> sin ocurrencias y con un <code>error</code>: lanzó una excepción)</>,
		junit: <><code>&lt;error type="ruleError"&gt;</code> con el error, contado en <code>errors</code></>,
		why: "El elemento de JUnit para una prueba que no se pudo ejecutar. La página no se comprobó con la regla, lo que no es ni un aprobado ni algo que revisar.",
	},
];

const optionRows = [
	{
		id: "cantTellAs",
		option: <code>cantTellAs</code>,
		default: <code>'skipped'</code>,
		effect: (
			<>
				<code>'failure'</code> informa las reglas <code>cantTell</code> como{" "}
				<code>&lt;failure type="cantTell"&gt;</code>, para un pipeline que no debe pasar mientras
				quede algo sin decidir. Se lee sin distinguir mayúsculas y minúsculas; cualquier otro valor
				lanza un <code>TypeError</code>, ya que uno mal escrito dejaría de condicionar la
				compilación sin avisar.
			</>
		),
	},
	{
		id: "includeNotApplicable",
		option: <code>includeNotApplicable</code>,
		default: <code>false</code>,
		effect: <>Incluye las reglas <code>notApplicable</code> como pruebas omitidas.</>,
	},
	{
		id: "baselineEntries",
		option: <code>baselineEntries</code>,
		default: "ninguno",
		effect: (
			<>
				Entradas de <code>buildBaselineEntries()</code> de{" "}
				<a href="/conformance/baseline/">la línea base</a>. Las ocurrencias fallidas registradas ahí
				se descartan, exactamente como en SARIF. Acepta el archivo de línea base tal como se guardó
				(<code>JSON.parse</code> del mismo) o su lista <code>entries</code>. Una regla cuyos fallos ya son todos conocidos es{" "}
				<code>&lt;skipped message="N known failures recorded in the baseline"&gt;</code>, no una
				prueba superada: no pasó.
			</>
		),
	},
	{
		id: "name",
		option: <code>name</code>,
		default: <code>'surea11y'</code>,
		effect: (
			<>
				El <code>name</code> del <code>&lt;testsuites&gt;</code> raíz, para distinguir los informes
				de varias páginas en un mismo panel.
			</>
		),
	},
];

export function JunitReportContent() {
	return (
		<>
			<p>
				<code>@surea11y/core/junit</code> genera un resultado de análisis como JUnit XML, el formato
				de informes de pruebas que los paneles de CI leen de forma nativa: el widget de pruebas de las
				merge requests de GitLab, la pestaña Tests de Azure DevOps, Jenkins y CircleCI.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { renderJunitReport } = require('@surea11y/core/junit');",
					"const { runDomRulesInPage } = require('@surea11y/core');",
					"",
					"const result = runDomRulesInPage(url, null, { profile: 'wcag22-aa' }, null);",
					"require('fs').writeFileSync('surea11y.junit.xml', renderJunitReport(result));",
				]}
			/>
			<p>
				<code>renderJunitReport(result, options)</code> es una función pura: devuelve el XML como
				cadena y nunca toca el sistema de archivos. Funciona igual de bien con un resultado guardado
				antes como JSON, como la salida de <code>surea11y scan &lt;target&gt; --json</code> de{" "}
				<a href="https://github.com/SureA11y/cli#readme">
					<code>@surea11y/cli</code>
				</a>
				. Desde la línea de comandos no hace falta llamarla:{" "}
				<code>surea11y scan &lt;target&gt; --junit a11y.junit.xml</code> (CLI 1.1.0 o posterior)
				escribe el informe por sí mismo, con las opciones predeterminadas más las{" "}
				<code>baselineEntries</code> de su archivo <code>--baseline</code>. Ver{" "}
				<a href="/configuration/ci-integration/#junit-test-reports">Integración con CI</a> para
				recetas de GitLab y Azure DevOps.
			</p>

			<h2>Estructura</h2>
			<p>
				Un <code>&lt;testsuite&gt;</code> por criterio de éxito de WCAG, un{" "}
				<code>&lt;testcase&gt;</code> por regla asociada a él. Al analizar esta página con la
				llamada anterior:
			</p>
			<CodeBlock
				lang="html"
				lines={[
					"<!doctype html>",
					'<html lang="en">',
					"<head><title>Home</title></head>",
					'<body><main><h1>Welcome</h1><img src="a.png"></main></body>',
					"</html>",
				]}
			/>
			<p>da:</p>
			<CodeBlock
				lang="html"
				lines={[
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<testsuites name="surea11y" tests="13" failures="1" errors="0" skipped="5" time="0">',
					'  <testsuite name="WCAG 1.1.1" tests="1" failures="1" errors="0" skipped="0" time="0">',
					"    <properties>",
					'      <property name="wcagCriterion" value="1.1.1"/>',
					'      <property name="title" value="Non-text content: text alternatives"/>',
					'      <property name="wcagLevel" value="A"/>',
					'      <property name="criterionOutcome" value="fail"/>',
					'      <property name="engine" value="a11ycore"/>',
					'      <property name="schemaVersion" value="1.0.0"/>',
					'      <property name="wcagVersion" value="2.2"/>',
					'      <property name="profile" value="wcag22-aa"/>',
					'      <property name="layout" value="false"/>',
					'      <property name="locale" value="en"/>',
					'      <property name="url" value="https://example.test/"/>',
					"    </properties>",
					'    <testcase classname="wcag-1.1.1" name="img-alt-present" time="0">',
					'      <failure type="fail" message="1 failing occurrence: This &lt;img&gt; has no alt attribute.">- This &lt;img&gt; has no alt attribute. Add an alt attribute that says what the image shows, or alt=&quot;&quot; if the image is purely decorative.',
					"  selector: html &gt; body &gt; main &gt; img",
					"  html: &lt;img src=&quot;a.png&quot;&gt;",
					"help: https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html</failure>",
					"    </testcase>",
					"  </testsuite>",
					"  <!-- 10 more suites trimmed: 12 tests, 5 of them skipped (manual review) -->",
					"</testsuites>",
				]}
			/>
			<ul>
				<li>
					<strong>Una suite en verde con el nombre de un criterio</strong> significa que las reglas
					que se ejecutaron para él no informaron ningún fallo. No significa que el criterio se
					comprobara por completo, ni que se cumpla: la mayoría de los criterios tienen partes que
					ninguna regla cubre (ver <a href="/conformance/wcag-mapping/">Mapeo de conformidad con WCAG</a>).
				</li>
				<li>
					<strong>Las suites siguen al criterio</strong>, porque es lo que la gente sigue, y{" "}
					<strong>los testcases siguen a la regla</strong> y no a la ocurrencia, así que un defecto
					repetido cuarenta veces en una página es una sola prueba fallida cuyo cuerpo enumera las
					cuarenta, y los recuentos de pruebas se mantienen estables entre ejecuciones.
				</li>
				<li id="names-in-every-locale">
					<strong>Los nombres son los mismos en todos los idiomas.</strong> Una suite se llama{" "}
					<code>WCAG &lt;criterion&gt;</code> (<code>WCAG 1.4.3</code>), la suite de las reglas sin
					criterio asociado <code>Other checks</code>, un testcase por su id de regla, y su{" "}
					<code>classname</code> es <code>wcag-&lt;criterion&gt;</code> u <code>other</code>, sea
					cual sea el <code>engineOptions.locale</code> con el que se ejecutó el análisis. El
					historial de pruebas de la CI (GitLab, Jenkins, los generadores de informes de pruebas de
					GitHub) se basa en estos nombres, así que un análisis leído en francés da las mismas
					pruebas que uno leído en inglés. El título del criterio, que sí se traduce, es la propiedad{" "}
					<code>title</code> de la suite (<code>Contrast: minimum</code>,{" "}
					<code>Contraste (minimum)</code>). El texto propio de los hallazgos (el mensaje y la pista
					de cada ocurrencia) está en el idioma del análisis; las palabras que el informe añade
					alrededor están en inglés en todos los idiomas: el recuento con el que empieza un{" "}
					<code>message</code> (
					<code>1 failing occurrence: Cet élément &lt;img&gt; n’a pas d’attribut alt.</code>), las
					etiquetas <code>selector:</code>, <code>html:</code> y <code>help:</code>, y los mensajes
					de <code>&lt;skipped&gt;</code>.{" "}
					<strong>Antes de core 1.12, el nombre de una suite llevaba el título del criterio</strong>{" "}
					(<code>WCAG 1.1.1 Non-text content: text alternatives</code>), así que el primer informe
					después de actualizar muestra cada prueba una vez como nueva en un panel que seguía los
					nombres antiguos, y su historial vuelve a empezar desde ahí.
				</li>
				<li>
					Las suites salen de las asociaciones de WCAG de cada regla, no de los compuestos, así que
					cada regla que se ejecutó se informa aunque se hayan excluido los compuestos. El compuesto,
					cuando se ejecutó, aporta la propiedad <code>title</code> de la suite y la propiedad{" "}
					<code>criterionOutcome</code>, que cuenta las reglas personalizadas asociadas al criterio
					igual que las incorporadas. Un criterio comprobado por varios compuestos (4.1.2: su nombre
					accesible y su validez ARIA) toma el peor de sus resultados, ya que si falla una parte
					falla el criterio, y el título que comparten sus títulos (<code>Name, role, value</code>). Una regla asociada a dos criterios aparece en ambas suites.
					Una regla sin criterio asociado va a una suite final <code>Other checks</code> con{" "}
					<code>classname="other"</code>.
				</li>
				<li>
					<strong>Las suites siguen el nivel y la versión de WCAG del análisis.</strong> Un criterio
					que el análisis dejó fuera de <code>rulesResults</code> por ellos no tiene suite: un
					criterio AAA con <code>engineOptions.wcagLevel: 'AA'</code> (<code>engine.wcagLevel</code>),
					o 4.1.1 <span lang="en">Parsing</span> cuando{" "}
					<code>{"includeRuleIds: ['duplicate-id']"}</code> se ejecutó con WCAG 2.2 (
					<code>engine.wcagVersion</code>), que lo eliminó. Un criterio que el análisis sí informa
					se conserva, como un resultado agregado nombrado por id por encima del nivel, uno{" "}
					<a href="/results-reports/output-schema/#partly-checked">comprobado en parte</a>, o 4.1.1
					en un análisis 2.2 que lo seleccionó. Una regla asociada solo a criterios que quedan fuera
					va a <code>Other checks</code>, y sus fallos son{" "}
					<code>
						&lt;skipped message="Not counted: WCAG 1.4.6 is outside the scan's target, WCAG 2.2
						AA; 1 failing occurrence"&gt;
					</code>
					, con las ocurrencias en <code>&lt;system-out&gt;</code>: la regla se ejecutó y falló, lo
					que el informe muestra, pero una compilación AA no falla por un criterio AAA. Una regla
					que no terminó sigue siendo un <code>&lt;error&gt;</code>. Un nivel que da la selección (
					<code>runOnly.wcag.level</code>, o etiquetas de nivel) también se registra como{" "}
					<code>engine.wcagLevel</code>, y filtra las suites de la misma forma. Un resultado que no
					registra ni <code>engine.wcagLevel</code> ni <code>engine.wcagVersion</code>, como el de un
					motor anterior, conserva todos los criterios.
				</li>
				<li>
					<code>engine</code>, <code>schemaVersion</code>, <code>wcagVersion</code>,{" "}
					<code>profile</code>, <code>optInRules</code>, las condiciones de renderizado de{" "}
					<a href="/results-reports/output-schema/">
						<code>engine.environment</code>
					</a>{" "}
					(<code>layout</code> y, en un navegador, <code>viewport</code> como <code>1280x720</code>,{" "}
					<code>devicePixelRatio</code>, <code>colorScheme</code>, <code>forcedColors</code> y{" "}
					<code>fonts</code>),{" "}
					<code>locale</code> y <code>url</code> de la ejecución se repiten como propiedades en cada
					suite, cada una solo cuando el resultado la tiene. Un fallo que aparece y desaparece con el
					ancho del viewport se puede atribuir al ancho que usó la ejecución. El ejemplo anterior es
					un análisis en jsdom, que no tiene diseño.
				</li>
				<li>
					Una página analizada con varios anchos de viewport da los mismos nombres de suite y de
					test con cada ancho, y una vista de tests de CI puede fusionarlos. Escribe un archivo por
					ancho, y nombra o agrupa los archivos por ancho en la configuración de informes de la CI;
					la propiedad <code>viewport</code> registra qué ancho describe un archivo.
				</li>
				<li>
					Las suites se ordenan por criterio, numéricamente (1.4.3 antes que 1.4.10), y los testcases
					por id de regla.
				</li>
				<li>
					Las propiedades <code>en301549</code> nombran la cláusula de EN 301 549 que reformula el
					criterio, cuando la hay y el análisis pidió cláusulas de EN 301 549 (ver{" "}
					<a href="/conformance/wcag-mapping/#en-301-549">EN 301 549</a>). Cada otro estándar que
					figura en el <code>standards</code> del resultado añade propiedades con el nombre de su
					clave, una por cada requisito suyo al que se asocian las reglas de la suite: el elemento de
					lista de comprobación de un <a href="/configuration/packs/">pack</a> que agrupa la regla se
					indica por su id, <code>&lt;property name="acme" value="acme-images"/&gt;</code>. Un
					estándar que solo nombra una regla personalizada no añade ninguna propiedad.
				</li>
			</ul>
			<p>
				Un resultado compacto (<code>engineOptions.output.detail: 'findings'</code>) se lee como el
				resultado completo que representa, así que se informa igual.
			</p>

			<h2 id="cross-frame-results">Resultados entre frames</h2>
			<p>
				Un resultado entre frames (ver{" "}
				<a href="/results-reports/output-schema/#cross-frame-result">Esquema de salida</a>) da
				primero las suites de la página y después las de cada frame, nombradas por la ruta del frame
				(<code>Frame #checkout: WCAG 1.1.1</code>, igual en todos los idiomas) y con una propiedad{" "}
				<code>frame</code> que la contiene, y el <code>classname</code> de sus testcases empieza por
				ella (<code>frame #checkout wcag-1.1.1</code>), para que un fallo en un frame no se fusione
				con los de la página en una CI que identifica las pruebas por el nombre de la suite o por{" "}
				<code>classname</code> y <code>name</code>. Un frame que no respondió es una suite <code>Frame &lt;path&gt;</code> con
				un testcase omitido, <code>Not scanned: &lt;error&gt;</code>: el frame no se comprobó, lo que
				no es un aprobado. Los totales de <code>&lt;testsuites&gt;</code> cuentan todos los frames.
			</p>

			<h2 id="outcomes">Resultados</h2>
			<DataTable
				label="Resultados de las reglas en JUnit"
				rowKey="id"
				columns={[
					{ key: "outcome", label: "Resultado de la regla", width: "18%" },
					{ key: "junit", label: "JUnit", wrap: true },
					{ key: "why", label: "Por qué", wrap: true },
				]}
				rows={outcomeRows}
			/>
			<p>
				Una regla <code>fail</code> que también tiene ocurrencias <code>cantTell</code> informa los
				fallos en <code>&lt;failure&gt;</code> y las no decididas en{" "}
				<code>&lt;system-out&gt;</code>, donde los paneles muestran la salida de las pruebas. Una regla{" "}
				<code>cantTell</code> omitida hace lo mismo.
			</p>
			<p>
				La línea <code>selector:</code> de un elemento dentro de un árbol shadow nombra primero los
				hosts shadow y después el elemento, unidos con <code>{" >>> "}</code>:{" "}
				<code>{"html > body > main > x-card >>> button"}</code>. Es la misma ubicación que dan{" "}
				<a href="/results-reports/sarif-report/#field-mapping">SARIF</a> y el{" "}
				<a href="/results-reports/html-report/">informe HTML</a>.
			</p>

			<h2>Opciones</h2>
			<DataTable
				label="Opciones del informe JUnit"
				rowKey="id"
				columns={[
					{ key: "option", label: "Opción", width: "22%" },
					{ key: "default", label: "Por defecto", width: "14%" },
					{ key: "effect", label: "Efecto", wrap: true },
				]}
				rows={optionRows}
			/>

			<h2>Determinismo</h2>
			<p>
				El motor no tiene reloj, y este informe no se inventa uno: cada <code>time</code> es{" "}
				<code>"0"</code>, y un atributo <code>timestamp</code> aparece en cada suite solo cuando el
				resultado lleva uno (<code>engineOptions.timestamp</code>). El mismo análisis siempre genera
				un XML idéntico byte a byte, así que un informe se puede versionar o comparar.
			</p>
			<p>
				El texto se escapa para XML, y los caracteres que XML 1.0 prohíbe incluso escapados (la
				mayoría de los caracteres de control, los sustitutos sueltos) se eliminan, ya que el marcado
				capturado de una página puede contenerlos.
			</p>
		</>
	);
}
