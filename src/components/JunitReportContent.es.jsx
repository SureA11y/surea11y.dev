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
				selector, marcado)
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
				quede algo sin decidir.
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
				se descartan, exactamente como en SARIF. Una regla cuyos fallos ya son todos conocidos es{" "}
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
				. Ver <a href="/configuration/ci-integration/#junit-test-reports">Integración con CI</a> para
				recetas de GitLab y Azure DevOps.
			</p>

			<h2>Estructura</h2>
			<p>
				Un <code>&lt;testsuite&gt;</code> por criterio de éxito de WCAG, un{" "}
				<code>&lt;testcase&gt;</code> por regla asociada a él:
			</p>
			<CodeBlock
				lang="html"
				lines={[
					'<testsuites name="surea11y" tests="14" failures="2" errors="0" skipped="4" time="0">',
					'  <testsuite name="WCAG 1.1.1 Non-text content: text alternatives" tests="1" failures="1" errors="0" skipped="0" time="0">',
					"    <properties>",
					'      <property name="wcagCriterion" value="1.1.1"/>',
					'      <property name="wcagLevel" value="A"/>',
					'      <property name="en301549" value="9.1.1.1"/>',
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
					'      <failure type="fail" message="1 failing occurrence: Missing alt attribute on &lt;img&gt;.">- Missing alt attribute on &lt;img&gt;. Add an alt attribute (use alt=&quot;&quot; only for decorative images).',
					"  selector: html &gt; body &gt; main &gt; img",
					"  html: &lt;img src=&quot;a.png&quot;&gt;</failure>",
					"    </testcase>",
					"  </testsuite>",
					"</testsuites>",
				]}
			/>
			<ul>
				<li>
					<strong>Las suites siguen al criterio</strong>, porque es lo que la gente sigue, y{" "}
					<strong>los testcases siguen a la regla</strong> y no a la ocurrencia, así que un defecto
					repetido cuarenta veces en una página es una sola prueba fallida cuyo cuerpo enumera las
					cuarenta, y los recuentos de pruebas se mantienen estables entre ejecuciones.
				</li>
				<li>
					Las suites salen de las asociaciones de WCAG de cada regla, no de los compuestos, así que
					cada regla que se ejecutó se informa aunque se hayan excluido los compuestos. El compuesto,
					cuando se ejecutó, aporta el título de la suite y la propiedad{" "}
					<code>criterionOutcome</code>. Una regla asociada a dos criterios aparece en ambas suites.
					Una regla sin criterio asociado va a una suite final <code>Other checks</code> con{" "}
					<code>classname="other"</code>.
				</li>
				<li>
					<code>engine</code>, <code>schemaVersion</code>, <code>wcagVersion</code>,{" "}
					<code>profile</code>, <code>optInRules</code>, las condiciones de renderizado de{" "}
					<a href="/results-reports/output-schema/">
						<code>engine.environment</code>
					</a>{" "}
					(<code>layout</code> y, en un navegador, <code>viewport</code> como <code>1280x720</code>,{" "}
					<code>devicePixelRatio</code>, <code>colorScheme</code> y <code>fonts</code>),{" "}
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
					<a href="/conformance/wcag-mapping/#en-301-549">EN 301 549</a>).
				</li>
			</ul>

			<h2>Resultados</h2>
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
