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
	{ id: "message", field: <code>results[].message.text</code>, source: <><code>occurrence.summary</code> + <code>occurrence.hint</code></> },
	{ id: "uri", field: <code>results[].locations[].physicalLocation.artifactLocation.uri</code>, source: <>El objetivo analizado (ver <a href="#sarif-locations">Ubicaciones</a> más abajo).</> },
	{ id: "fqn", field: <code>results[].locations[].logicalLocations[].fullyQualifiedName</code>, source: <><code>occurrence.selector</code>, cuando está presente.</> },
	{
		id: "fingerprint",
		field: <code>results[].partialFingerprints["surea11y/violation/v1"]</code>,
		source: (
			<>
				La misma clave de identidad <code>ruleId + reasonCode + html</code> que usa{" "}
				<a href="/conformance/baseline/">Baseline / allowlist</a> (<code>computeBaselineKey</code>):
				una huella basada en el contenido y estable, no basada en la posición.
			</>
		),
	},
	{ id: "props", field: <><code>results[].properties.severity</code> / <code>.confidence</code> / <code>.reasonCode</code> / <code>.html</code></>, source: <>El propio <code>severity</code>/<code>confidence</code> del resultado, más el mismo <code>reasonCode</code> y fragmento <code>html</code> sobre el que se calcula la huella anterior: informativo, no forma parte del propio esquema de SARIF.</> },
	{ id: "tags", field: <code>tool.driver.rules[].properties.tags</code>, source: <><code>accessibility</code>, <code>automatic</code>/<code>manual</code>, y una etiqueta <code>wcag-&lt;SC&gt;</code> por cada <code>meta.normativeMappings[].requirement</code>.</> },
];

export function SarifReportContent() {
	return (
		<>
			<p>
				<code>--sarif &lt;path&gt;</code> escribe un registro{" "}
				<a href="https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html">SARIF 2.1.0</a>{" "}
				(el formato estándar que espera GitHub Code Scanning y otros paneles que consumen SARIF),
				en lugar del resultado sin procesar del motor de <code>--json</code>, o además de él.
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --sarif results.sarif", command: true }]} />
			<p>
				Ver <a href="/configuration/ci-integration/">integración con CI</a> para un flujo de trabajo
				de GitHub Actions listo para usar que ejecuta un análisis y sube{" "}
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
				→ <code>error</code>, <code>manual</code> (limitada a <code>cantTell</code> como máximo) →{" "}
				<code>warning</code>.
			</p>

			<h2>Correspondencia de campos</h2>
			<DataTable
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
					<strong>Análisis de archivos locales</strong>: una ruta relativa al directorio de trabajo
					actual (con barras diagonales). Si esto coincide con un archivo real de tu repositorio,
					GitHub Code Scanning puede mostrar el hallazgo como una anotación en línea.
				</li>
				<li>
					<strong>Análisis de URL</strong>: la propia URL analizada. GitHub Code Scanning seguirá
					listando el hallazgo, pero no puede adjuntar una anotación en línea a una URL que no es un
					archivo del repositorio: esto es inherente a cómo SARIF/Code Scanning asocian los
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
