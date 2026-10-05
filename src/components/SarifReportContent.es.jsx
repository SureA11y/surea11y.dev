import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const sarifLevelRows = [
	{ id: "fail", outcome: <code>fail</code>, level: <code>error</code>, meaning: "Violación determinista: el caso de bloqueo en CI." },
	{ id: "cantTell", outcome: <code>cantTell</code>, level: <code>warning</code>, meaning: "Requiere revisión humana: se muestra, pero no debería bloquear una compilación por sí sola." },
];

const sarifFieldRows = [
	{ id: "ruleId", field: <code>results[].ruleId</code>, source: <code>checksResults[i].ruleId</code> },
	{ id: "message", field: <code>results[].message.text</code>, source: <><code>occurrence.summary</code> + <code>occurrence.hint</code>. Una ocurrencia sin resumen (la de una regla personalizada, por ejemplo) usa el título de la regla, o su id, ya que GitHub rechaza un resultado con el texto vacío.</> },
	{ id: "uri", field: <code>results[].locations[].physicalLocation.artifactLocation.uri</code>, source: <>El objetivo analizado (ver <a href="#sarif-locations">Ubicaciones</a> más abajo).</> },
	{ id: "fqn", field: <code>results[].locations[].logicalLocations[].fullyQualifiedName</code>, source: <><code>occurrence.selector</code>, cuando está presente.</> },
	{
		id: "fingerprint",
		field: <code>results[].partialFingerprints["surea11y/violation/v1"]</code>,
		source: (
			<>
				La misma clave de identidad <code>ruleId + reasonCode + html</code> que usa{" "}
				<a href="/conformance/baseline/">Baseline / allowlist</a> (<code>computeBaselineKey</code>):
				una huella basada en el contenido y estable, no basada en la posición, para los consumidores
				que la leen.
			</>
		),
	},
	{
		id: "lineHash",
		field: <code>results[].partialFingerprints.primaryLocationLineHash</code>,
		source: (
			<>
				Un hash de esa clave, <code>&lt;16 hex digits&gt;:&lt;n&gt;</code>, donde <code>n</code> cuenta
				un hallazgo repetido en la página (el mismo componente defectuoso dos veces). <span lang="en">GitHub
				Code Scanning</span> empareja las alertas entre subidas solo por este campo. Un hallazgo del DOM
				no tiene ninguna línea a la que la acción de subida de GitHub pueda aplicar el hash, así que
				sin él las alertas se emparejaban por posición, y corregir un hallazgo podía cerrar la alerta
				de otro. Si vienes de core 1.8 o anterior, la primera subida cierra las alertas existentes y
				las vuelve a abrir como nuevas, una sola vez; un descarte hecho en GitHub hay que volver a
				hacerlo.
			</>
		),
	},
	{ id: "props", field: <><code>results[].properties.severity</code> / <code>.confidence</code> / <code>.reasonCode</code> / <code>.html</code></>, source: <>El propio <code>severity</code>/<code>confidence</code> del resultado, más el mismo <code>reasonCode</code> y fragmento <code>html</code> sobre el que se calcula la huella anterior: informativo, no forma parte del propio esquema de SARIF.</> },
	{ id: "tags", field: <code>tool.driver.rules[].properties.tags</code>, source: <><code>accessibility</code>, <code>automatic</code>/<code>manual</code>, y una etiqueta <code>wcag-&lt;SC&gt;</code> por cada criterio de conformidad de WCAG en <code>meta.normativeMappings</code>. Las entradas de documentos Understanding no reciben etiqueta. Cada cláusula de EN 301 549 que lleve el resultado (solo cuando el análisis las pidió, ver <a href="/configuration/engine-options/#other-standards-mappings">Otros estándares</a>) recibe una etiqueta <code>en301549-&lt;cláusula&gt;</code>, por ejemplo <code>en301549-9.1.1.1</code>: los números de cláusula son los mismos en todas las versiones que los tienen, así que la etiqueta no lleva versión.</> },
	{ id: "toolVersion", field: <code>tool.driver.version</code>, source: <>La opción <code>toolVersion</code>, si se indica (una herramienta que envuelve el motor pasa la suya); si no, <code>engine.version</code>, la versión del motor que produjo el resultado. <code>"0.0.0"</code> solo para un resultado que no lo tiene, de una versión anterior a la 1.10.0.</> },
	{ id: "category", field: <code>runs[0].automationDetails.id</code>, source: <>La opción <code>category</code>, con una <code>/</code> final añadida si no la tiene (GitHub lee todo lo que hay hasta la última barra como la categoría). Ausente cuando no se indica ninguna categoría. Ver <a href="#scanning-at-several-viewport-widths">Analizar con varios anchos de viewport</a>.</> },
	{ id: "runProps", field: <code>runs[0].properties</code>, source: <><code>wcagVersion</code>, <code>profile</code>, <code>optInRules</code> y <code>environment</code> del <code>engine</code> del resultado: el objetivo de conformidad que usó la ejecución, para que un panel distinga una ejecución de WCAG 2.1 de una de 2.2, las etiquetas de reglas opcionales que añadió más allá de ese objetivo, cuando añadió alguna, y las condiciones en que se renderizó la página (<code>layout</code>, <code>viewport</code>, <code>devicePixelRatio</code>, <code>colorScheme</code>, <code>fonts</code>; ver <a href="/results-reports/output-schema/">Esquema de salida</a>). Se omiten en resultados de motores anteriores a esos campos.</> },
];

export function SarifReportContent() {
	return (
		<>
			<p>
				<code>--sarif &lt;path&gt;</code> escribe un registro{" "}
				<a href="https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html">SARIF 2.1.0</a>{" "}
				(el formato estándar que espera <span lang="en">GitHub Code Scanning</span> y otros paneles que consumen SARIF),
				en lugar del resultado sin procesar del motor de <code>--json</code>, o además de él.
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --sarif results.sarif", command: true }]} />
			<p>
				Ver <a href="/configuration/ci-integration/">integración con CI</a> para un flujo de trabajo
				de <span lang="en">GitHub Actions</span> listo para usar que ejecuta un análisis y sube{" "}
				<code>results.sarif</code> a la pestaña "<span lang="en">Security</span>".
			</p>

			<h2>
				Por qué un formato separado de <code>--json</code>
			</h2>
			<p>
				El resultado sin procesar de <code>--json</code> (ver{" "}
				<a href="/results-reports/output-schema/">Esquema de salida</a>) es el contrato propio de
				este motor, versionado y estable según{" "}
				<a href={`${core}/docs/API_STABILITY.md`}>
					<code>API_STABILITY.md</code>
				</a>
				. SARIF es un contrato distinto, definido externamente, diseñado específicamente para
				paneles de análisis de código: una entrada de <code>checksResults[]</code> y un{" "}
				<code>result</code> de SARIF no se corresponden 1:1, así que{" "}
				<strong>esto es una conversión real, no una re-serialización</strong>.
			</p>

			<h2>Qué se convierte en un resultado SARIF</h2>
			<p>
				<strong>
					Solo las ocurrencias <code>fail</code>/<code>cantTell</code> producen resultados SARIF
				</strong>{" "}
				(el mismo enfoque de "solo violaciones" que el{" "}
				<a href="/results-reports/html-report/">informe HTML</a>).
			</p>
			<p>
				Una comprobación <code>notApplicable</code> no siempre está vacía: una regla puede adjuntar
				una ocurrencia que explica por qué no tuvo nada que juzgar, algo que hacen las reglas de
				contraste cuando ningún texto tenía un fondo con el que calcular el contraste. Esas nunca se
				convierten en resultados: un consumidor trata cada resultado como una alerta, y "esto no se
				evaluó" no lo es. Pero tampoco se descartan. Se incluyen como entradas de nivel{" "}
				<code>note</code> en <code>runs[0].invocations[0].toolExecutionNotices</code>, cada una
				identificando la regla de la que proviene mediante <code>associatedRule.id</code>:
			</p>
			<CodeBlock
				lang="json"
				lines={[
					'"invocations": [',
					"  {",
					'    "executionSuccessful": true,',
					'    "toolExecutionNotices": [',
					"      {",
					'        "level": "note",',
					'        "message": { "text": "No eligible text had computable contrast (eligible text nodes: 13). See the contrast computability rule for details." },',
					'        "associatedRule": { "id": "contrast-minimum" }',
					"      }",
					"    ]",
					"  }",
					"]",
				]}
			/>
			<p>
				<strong>
					Esto evita que un flujo que solo lee SARIF interprete el silencio como un buen estado de
					salud
				</strong>
				: que no haya alertas de contraste puede significar que la página está bien o que el
				contraste nunca fue calculable, y solo la notificación distingue entre ambos casos. El
				bloque se emite solo cuando hay algo que decir, así que una ejecución sin nada que indicar
				no tiene ninguna clave <code>invocations</code>.
			</p>
			<DataTable
				label="Resultados del motor como niveles SARIF"
				rowKey="id"
				columns={[
					{ key: "outcome", label: "Resultado del motor", width: "22%" },
					{ key: "level", label: "Nivel SARIF", width: "18%" },
					{ key: "meaning", label: "Significado", wrap: true },
				]}
				rows={sarifLevelRows}
			/>
			<p>
				Cada regla que se ejecutó (sin importar si produjo un resultado) se lista una vez en{" "}
				<code>runs[0].tool.driver.rules</code>, con <code>defaultConfiguration.level</code>{" "}
				establecido según el <code>type</code> de la regla: <code>automatic</code> (capaz de fallar)
				→ <code>error</code>, <code>manual</code> (nunca <code>fail</code>) →{" "}
				<code>warning</code>.
			</p>

			<h2>Correspondencia de campos</h2>
			<DataTable
				label="Correspondencia de campos SARIF"
				rowKey="id"
				columns={[
					{ key: "field", label: "Campo SARIF", width: "36%", wrap: true },
					{ key: "source", label: "Origen", wrap: true },
				]}
				rows={sarifFieldRows}
			/>

			<h2 id="sarif-locations">Ubicaciones</h2>
			<p>
				El análisis basado en el DOM no tiene línea/columna que indicar, así que{" "}
				<code>physicalLocation.artifactLocation.uri</code> es el propio objetivo analizado, no una
				posición en un archivo fuente:
			</p>
			<ul>
				<li>
					<strong>Análisis de archivos locales</strong>: un archivo dentro del directorio de trabajo
					actual es una ruta relativa a él, con barras diagonales y cada segmento codificado con
					porcentajes (<code>build%20out/index.html</code>). Si esto coincide con un archivo real de
					tu repositorio, <span lang="en">GitHub Code Scanning</span> puede mostrar el hallazgo como
					una anotación en línea. Un archivo fuera del directorio de trabajo es una URL{" "}
					<code>file:</code> absoluta, no una ruta relativa que sale del repositorio con{" "}
					<code>../</code>, que un consumidor no podría resolver.
				</li>
				<li>
					<strong>Análisis de URL</strong>: la propia URL analizada. <span lang="en">GitHub Code Scanning</span> seguirá
					listando el hallazgo, pero no puede adjuntar una anotación en línea a una URL que no es un
					archivo del repositorio: esto es inherente a cómo SARIF/<span lang="en">Code Scanning</span> asocian los
					hallazgos con el código fuente, no una limitación de surea11y. Si necesitas anotaciones en
					línea, analiza el archivo HTML renderizado (por ejemplo, un artefacto de compilación)
					en lugar de una URL en vivo.
				</li>
			</ul>
			<p>
				<code>occurrence.selector</code> se incluye además como un{" "}
				<code>logicalLocations[].fullyQualifiedName</code>, así que un consumidor que lea las
				ubicaciones lógicas igual obtiene la señal de "qué elemento" incluso sin una ubicación
				física utilizable.
			</p>

			<h2 id="scanning-at-several-viewport-widths">Analizar con varios anchos de viewport</h2>
			<p>
				Una regla que depende del diseño puede fallar con un ancho de viewport y cumplirse con otro
				(ver <a href="/help/known-limitations/">Limitaciones conocidas</a>), así que una página
				analizada con dos anchos son dos análisis, no uno. Da a cada uno su propia categoría:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { renderSarifReport } = require('@surea11y/core/sarif');",
					"",
					"for (const width of [390, 1280]) {",
					"  // ...scan the page at this width into `result`...",
					"  fs.writeFileSync(`a11y-${width}.sarif`, renderSarifReport(result, { category: `a11y-${width}` }));",
					"}",
				]}
			/>
			<p>
				y sube cada archivo por separado. <span lang="en">GitHub Code Scanning</span> trata cada
				categoría como un análisis propio. Dentro de una categoría, una subida posterior sustituye a
				la anterior, y una alerta que no aparece en ella se cierra, así que dos anchos subidos con la
				misma categoría abrirían y cerrarían una alerta propia de un ancho en cada ejecución. GitHub
				también rechaza un único archivo SARIF que contenga dos ejecuciones de la misma herramienta y
				la misma categoría. <code>github/codeql-action/upload-sarif</code> tiene una entrada{" "}
				<code>category</code> que hace lo mismo cuando el archivo no lleva ninguna.
			</p>
			<p>
				La identidad del hallazgo no incluye el viewport, y no le hace falta: el mismo elemento con
				el mismo defecto es el mismo hallazgo con cualquier ancho, y la categoría es lo que mantiene
				separados los análisis. <code>runs[0].properties.environment</code> registra el viewport que
				usó cada ejecución.
			</p>

			<h2>
				Combinación con <code>--baseline</code>
			</h2>
			<p>
				Un consumidor genérico de SARIF no tiene un concepto propio de "conocido, no bloquear por
				esto": la única forma fiel de respetar un baseline en la salida SARIF es{" "}
				<strong>
					omitir por completo las ocurrencias <code>fail</code> ya conocidas, en lugar de
					rebajarlas a <code>warning</code>
				</strong>
				:
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --baseline baseline.json --sarif results.sarif", command: true }]} />
			<p>
				Las ocurrencias <code>cantTell</code> nunca se filtran mediante un baseline: el mecanismo
				de baseline solo rastrea ocurrencias <code>fail</code> (igual que{" "}
				<code>--write-baseline</code>, ver{" "}
				<a href="/conformance/baseline/">Baseline / allowlist</a>).
			</p>

			<h2>
				Combinación con <code>--html</code>/<code>--json</code>
			</h2>
			<p>
				<code>--sarif</code>, <code>--html</code> y <code>--json</code> son indicadores de salida
				independientes: pasa cualquier combinación en una sola ejecución; cada uno escribe o
				imprime su propio informe a partir del mismo análisis único.
			</p>
		</>
	);
}
