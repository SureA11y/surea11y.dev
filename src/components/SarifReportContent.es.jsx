import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const sarifLevelRows = [
	{ id: "fail", outcome: <code>fail</code>, level: <code>error</code>, meaning: "Violación determinista: el caso de bloqueo en CI." },
	{ id: "cantTell", outcome: <code>cantTell</code>, level: <code>warning</code>, meaning: "Requiere revisión humana: se muestra, pero no debería bloquear una compilación por sí sola." },
	{ id: "leanFail", outcome: <><code>cantTell</code> con tendencia a <code>fail</code>, con <code>leanFailAs: 'error'</code></>, level: <code>error</code>, meaning: <>Sin decidir, pero los indicios de la página apuntan a un fallo (<a href="/results-reports/output-schema/#leans"><code>lean</code></a>); lo cuenta una puerta sobre errores.</> },
];

const sarifFieldRows = [
	{ id: "ruleId", field: <code>results[].ruleId</code>, source: <code>checksResults[i].ruleId</code> },
	{ id: "message", field: <code>results[].message.text</code>, source: <><code>occurrence.summary</code> + <code>occurrence.hint</code>. Una ocurrencia sin resumen (la de una regla personalizada, por ejemplo) usa el título de la regla, o su id, ya que GitHub rechaza un resultado con el texto vacío. Detrás, tras una línea en blanco, van los pasos de un hallazgo sin decidir: <code>How to check:</code>, los pasos numerados, y luego <code>Passes when:</code> y <code>Fails when:</code>, para que una alerta diga cómo responderla.</> },
	{ id: "howToCheck", field: <code>results[].properties.howToCheck</code>, source: <>Los pasos de un hallazgo sin decidir, <code>{"{ steps, passWhen, failWhen }"}</code>, tal como los da <a href="/results-reports/output-schema/#how-to-check"><code>occurrence.howToCheck</code></a>. Un resultado que llega sin ellos, como el de un binding, los recibe en Node; <code>packs</code> (los packs que ejecutó el análisis) añade los propios de una regla de un pack. Como la tendencia, no forma parte de la identidad del hallazgo.</> },
	{ id: "uri", field: <code>results[].locations[].physicalLocation.artifactLocation.uri</code>, source: <>El objetivo analizado (ver <a href="#sarif-locations">Ubicaciones</a> más abajo).</> },
	{ id: "fqn", field: <code>results[].locations[].logicalLocations[].fullyQualifiedName</code>,source: <>La ubicación del elemento, con <code>kind: "element"</code>, cuando <code>occurrence.selector</code> es una cadena no vacía. Fuera de un árbol shadow es el selector. Para un elemento dentro de un árbol shadow son los selectores de los hosts shadow y luego el del propio elemento, unidos con <code>{" >>> "}</code>: <code>{"html > body > main > x-card >>> button"}</code>. La línea <code>selector:</code> de JUnit y el informe HTML muestran el mismo texto.</> },
	{
		id: "fingerprint",
		field: <code>results[].partialFingerprints["surea11y/violation/v2"]</code>,
		source: (
			<>
				El resumen SHA-256, de 64 dígitos hexadecimales, de la misma clave de identidad{" "}
				<code>ruleId + reasonCode + html</code> que usa{" "}
				<a href="/conformance/baseline/">Baseline / allowlist</a> (<code>computeBaselineKey</code>):
				una huella basada en el contenido y estable, no basada en la posición, para los consumidores
				que la leen: el mismo hallazgo recibe el mismo resumen en todos los informes. Antes de la
				1.11, <code>surea11y/violation/v1</code> contenía la propia clave, así que una herramienta que
				leía <code>v1</code> ve cada hallazgo como nuevo una vez.{" "}
				<strong>Un hallazgo cuyo código de motivo cambia recibe otro resumen</strong>: en la 1.14,
				los hallazgos de las diecisiete reglas que ahora dan un código, y los de los códigos
				divididos según su causa, así que sus alertas de <span lang="en">Code Scanning</span> se
				cierran una vez y los hallazgos vuelven como nuevos (ver{" "}
				<a href="/conformance/baseline/">Baseline / allowlist</a>).
			</>
		),
	},
	{
		id: "lineHash",
		field: <code>results[].partialFingerprints.primaryLocationLineHash</code>,
		source: (
			<>
				Los primeros 16 dígitos hexadecimales del resumen y un recuento,{" "}
				<code>&lt;16 hex digits&gt;:&lt;n&gt;</code> (sin cambios respecto a antes de{" "}
				<code>v2</code>), donde <code>n</code> cuenta
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
	{ id: "tags", field: <code>tool.driver.rules[].properties.tags</code>, source: <><code>accessibility</code>, <code>automatic</code>/<code>manual</code>,y una etiqueta <code>wcag-&lt;SC&gt;</code> por cada criterio de conformidad de WCAG en <code>meta.normativeMappings</code> que conservan el nivel y la versión de WCAG del análisis. Un criterio que el análisis dejó fuera de <code>rulesResults</code> por ellos no recibe etiqueta: un criterio AAA con <code>engineOptions.wcagLevel: 'AA'</code>, o 4.1.1 cuando <code>{"includeRuleIds: ['duplicate-id']"}</code> se ejecutó con WCAG 2.2. Un criterio que el análisis informa, como un resultado agregado nombrado por id por encima del nivel, conserva su etiqueta, igual que todos los criterios de un resultado que no registra ni <code>engine.wcagLevel</code> ni <code>engine.wcagVersion</code>. La regla se mantiene, y sus resultados también, como notas cuando todos los criterios a los que se asocia quedan fuera (ver <a href="#outside-the-target">más arriba</a>). Las entradas de documentos Understanding no reciben etiqueta. Cada cláusula de EN 301 549 que lleve el resultado (solo cuando el análisis las pidió, ver <a href="/configuration/engine-options/#other-standards-mappings">Otros estándares</a>) recibe una etiqueta <code>en301549-&lt;cláusula&gt;</code>, por ejemplo <code>en301549-9.1.1.1</code>: los números de cláusula son los mismos en todas las versiones que los tienen, así que la etiqueta no lleva versión, y el estándar o la lista de comprobación de un pack se etiqueta de la misma forma bajo su propia clave (el id de un elemento de lista de comprobación, <code>acme-images</code>, es su propia etiqueta). Después, las propias <code>meta.tags</code> de la regla (incluidas las de una regla personalizada), sin las etiquetas internas del motor ni las etiquetas de criterio que ya dan las etiquetas <code>wcag-&lt;SC&gt;</code>.</> },
	{ id: "helpUri", field: <code>tool.driver.rules[].helpUri</code>, source: <><code>meta.helpUrl</code>, el enlace de ayuda de la regla, cuando es una URL <code>http(s)</code> absoluta; si no, el documento Understanding del primer criterio de WCAG al que se asocia; ausente en una regla sin ninguno de los dos, lo que no ocurre con ninguna regla incorporada: una sin criterio asociado enlaza su sección del catálogo de reglas.</> },
	{ id: "toolVersion", field: <code>tool.driver.version</code>, source: <>La opción <code>toolVersion</code>, si se indica (una herramienta que envuelve el motor pasa la suya); si no, <code>engine.version</code>, la versión del motor que produjo el resultado.<code>"0.0.0"</code> solo para un resultado que no lo tiene, de una versión anterior a la 1.10.0, o cuyo <code>engine.version</code> no es una cadena.</> },
	{ id: "category", field: <code>runs[0].automationDetails.id</code>, source: <>La opción <code>category</code>, con una <code>/</code> final añadida si no la tiene (GitHub lee todo lo que hay hasta la última barra como la categoría). Ausente cuando no se indica ninguna categoría. Ver <a href="#scanning-at-several-viewport-widths">Analizar con varios anchos de viewport</a>.</> },
	{ id: "runProps", field: <code>runs[0].properties</code>,source: <><code>wcagVersion</code>, <code>wcagLevel</code> (cuando el análisis tenía un nivel: <code>engineOptions.wcagLevel</code>, o el que da su selección), <code>profile</code> (el primer perfil, en un análisis de varios), <code>profiles</code> (solo en un análisis de varios perfiles: cada perfil que ejecutó, <code>engine.profiles</code>), <code>optInRules</code> y <code>environment</code> (una copia de <code>engine.environment</code>) del <code>engine</code> del resultado: el objetivo de conformidad que usó la ejecución, para que un panel distinga una ejecución de WCAG 2.1 de una de 2.2, y una ejecución AA de una de todos los niveles, las etiquetas de reglas opcionales que añadió más allá de ese objetivo, cuando añadió alguna, y las condiciones en que se renderizó la página (<code>layout</code>, <code>viewport</code>, <code>devicePixelRatio</code>, <code>colorScheme</code>, <code>forcedColors</code>, <code>fonts</code> y cualquier otro campo que tenga, incluidos los de los hooks; ver <a href="/results-reports/output-schema/#top-level-result">Esquema de salida</a>). Se omiten en resultados de versiones anteriores a esos campos.</> },
];

const sarifOptionRows = [
	{ id: "toolVersion", option: <code>toolVersion</code>, def: <code>engine.version</code>, effect: <><code>tool.driver.version</code>, para una herramienta que envuelve el motor.</> },
	{ id: "informationUri", option: <code>informationUri</code>, def: <code>'https://github.com/SureA11y/core'</code>, effect: <><code>tool.driver.informationUri</code>, la página principal de la herramienta.</> },
	{ id: "baselineEntries", option: <code>baselineEntries</code>, def: "ninguno", effect: <>El archivo de baseline tal como se guardó (su <code>JSON.parse</code>) o su lista <code>entries</code>, ver <a href="/conformance/baseline/#file-format">Formato del archivo</a>. Las ocurrencias de fallo registradas ahí se omiten, como hace <code>--baseline</code> (ver más abajo). Una entrada escrita por la versión menor anterior, con un código de motivo que ha cambiado desde entonces, sigue coincidiendo con el hallazgo con su código nuevo (ver <a href="/conformance/baseline/#upgrading">Actualizar de versión</a>).</> },
	{ id: "allowProfilesNotRun", option: <code>allowProfilesNotRun</code>, def: <code>false</code>, effect: <>Un análisis de <a href="/configuration/engine-options/#several-profiles">varios perfiles</a> que ejecutó menos de los que pidió (<code>engine.profilesNotRun</code>) contó menos de lo que se le pidió: cada perfil no ejecutado es una notificación <code>error</code>, y la invocación no es <code>executionSuccessful</code>. <code>true</code> las convierte en advertencias. Un valor distinto de <code>true</code> o <code>false</code> lanza un <code>TypeError</code>. Core 1.15.0 y posteriores.</> },
	{ id: "category", option: <code>category</code>, def: "ninguno", effect: <><code>runs[0].automationDetails.id</code>, ver <a href="#scanning-at-several-viewport-widths">Analizar con varios anchos de viewport</a>.</> },
	{ id: "leanFailAs", option: <code>leanFailAs</code>, def: <code>'warning'</code>, effect: <><code>'error'</code> informa con nivel <code>error</code> de un hallazgo <code>cantTell</code> cuya tendencia apunta a fallo, para que una compilación bloqueada por errores falle también con los fallos probables. Se lee sin distinguir mayúsculas y minúsculas; cualquier otro valor lanza un <code>TypeError</code>. También el de una regla de buenas prácticas: una regla así, sin criterio de WCAG asociado, nunca falla, y los hechos que constata tienden a fallo sin condiciones, así que un nivel de encabezado saltado (<code>heading-order</code>) es un <code>error</code>. Un hallazgo de una regla cuyos criterios quedan todos fuera del objetivo del análisis sigue siendo una <code>note</code>. Un hallazgo que tiende a fallo y tiene una entrada marcada con <code>lean: 'fail'</code> en <code>baselineEntries</code> sigue siendo un <code>warning</code>.</> },
	{ id: "leanFailWcagOnly", option: <code>leanFailWcagOnly</code>, def: <code>false</code>, effect: <>Con <code>leanFailAs: 'error'</code>, <code>true</code> eleva solo los hallazgos de reglas asociadas a un criterio de WCAG dentro del objetivo del análisis, y deja las tendencias de las reglas de buenas prácticas en <code>warning</code>. Un valor distinto de <code>true</code> o <code>false</code> lanza un <code>TypeError</code>. <code>leaningFailures(result, {"{ wcagOnly }"})</code>, de <code>@surea11y/core</code>, enumera los hallazgos que elevan estas dos opciones, antes del baseline.</> },
	{ id: "packs", option: <code>packs</code>, def: "ninguno", effect: <>Los packs que ejecutó el análisis (<code>engineOptions.packs</code>): en Node, los hallazgos sin decidir de una regla de un pack llevan los pasos de su propio <code>meta.review</code> (<code>properties.howToCheck</code>).</> },
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
				<a href="/results-reports/html-report/">informe HTML</a>).{" "}
				<strong>Así que un registro sin resultados dice que nada falló ni necesita revisión entre
				las comprobaciones que se ejecutaron</strong>; no dice qué se comprobó, y no es una
				declaración de conformidad. Para eso, conserva el resultado JSON.
			</p>
			<p>
				Una comprobación <code>notApplicable</code> no siempre está vacía: una regla puede adjuntar
				una ocurrencia que explica por qué no tuvo nada que juzgar, algo que hacen las reglas de
				contraste cuando ningún texto tenía un fondo con el que calcular el contraste. Esas nunca se
				convierten en resultados: un consumidor trata cada resultado como una alerta, y "esto no se
				evaluó" no lo es. Pero tampoco se descartan. Se incluyen como entradas de nivel{" "}
				<code>note</code> en <code>runs[0].invocations[0].toolExecutionNotifications</code>, cada una
				identificando la regla de la que proviene mediante <code>associatedRule.id</code>:
			</p>
			<CodeBlock
				lang="json"
				lines={[
					'"invocations": [',
					"  {",
					'    "executionSuccessful": true,',
					'    "toolExecutionNotifications": [',
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
				no tiene ninguna clave <code>invocations</code>. Una regla que pasó no escribe ninguna
				notificación.
			</p>
			<p>
				Una regla que no terminó (lanzó una excepción: <code>cantTell</code> sin ocurrencias y con
				un <code>error</code>) no juzgó nada, así que tampoco es un resultado. Es una notificación de
				nivel <code>error</code> en la misma lista,{" "}
				<code>"The rule &lt;id&gt; did not complete: &lt;error&gt;"</code>, que nombra la regla en{" "}
				<code>associatedRule.id</code>, para que el hueco en la cobertura no se lea como un
				aprobado.
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
				Un hallazgo sin decidir con tendencia la lleva en <code>properties.lean</code>:{" "}
				<code>{'{ "toward": "fail", "why": "The heading skips a level after the one before it." }'}</code>,
				sea cual sea el nivel con el que se informe. Cuando la tendencia los tiene, también lleva{" "}
				<code>caution</code>, qué podría hacer que se equivoque (
				<code>"A layout table can also hold numbers."</code>), y <code>measured</code>, cuántas
				veces ha acertado (<code>{'{ "agreed": 47, "cases": 50, "corpus": "…", "coreVersion": "…" }'}</code>,
				cuando una tendencia se ha contado en cinco casos, lo que aún no ha ocurrido con ninguna),
				para que una alerta muestre lo que el <a href="/results-reports/html-report/">informe HTML</a>{" "}
				muestra junto a la tendencia. Sus claves <code>signals</code> e <code>i18n</code> se quedan
				en el resultado del análisis.
			</p>
			<p id="outside-the-target">
				Una regla cuyos criterios de WCAG quedan todos fuera del objetivo del análisis (una regla
				AAA con <code>engineOptions.wcagLevel: 'AA'</code>, o <code>duplicate-id</code> con WCAG
				2.2: los criterios que el análisis dejó fuera de <code>rulesResults</code>, como para las
				etiquetas <code>wcag-&lt;SC&gt;</code> más abajo) se ejecutó igualmente, y sus hallazgos{" "}
				<code>fail</code> y <code>cantTell</code> siguen siendo resultados, con nivel{" "}
				<code>note</code>, para que se vean sin hacer fallar una compilación limitada al objetivo.
				Cada uno dice por qué en <code>properties.outsideTarget</code>:{" "}
				<code>{'{ "criteria": ["1.4.6"], "target": "WCAG 2.2 AA" }'}</code>.
			</p>
			<p>
				Cada regla que se ejecutó (sin importar si produjo un resultado) se lista una vez en{" "}
				<code>runs[0].tool.driver.rules</code>, con <code>defaultConfiguration.level</code>{" "}
				establecido según el <code>type</code> de la regla: <code>automatic</code> (capaz de fallar)
				→ <code>error</code>, <code>manual</code> (nunca <code>fail</code>) →{" "}
				<code>warning</code>. Un id de regla que no es una cadena, en un resultado guardado, se
				escribe como su texto; una comprobación sin id de regla no nombra ninguna regla y se omite,
				como la omiten JUnit y EARL.
			</p>

			<h2 id="field-mapping">Correspondencia de campos</h2>
			<DataTable
				label="Correspondencia de campos SARIF"
				rowKey="id"
				columns={[
					{ key: "field", label: "Campo SARIF", width: "36%", wrap: true },
					{ key: "source", label: "Origen", wrap: true },
				]}
				rows={sarifFieldRows}
			/>
			<p>
				Un resultado compacto (<code>engineOptions.output.detail: 'findings'</code>, ver{" "}
				<a href="/results-reports/output-schema/#top-level-result">Esquema de salida</a>) se lee
				como el resultado completo que representa, así que se informa igual. Un resultado cuya lista{" "}
				<code>standards</code> falta o está dañada sigue etiquetando todos los estándares que nombran
				sus reglas.
			</p>

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
					en lugar de una URL en vivo. La URL se escribe tal como la serializa un analizador de
					URL, así que lo que una URI no admite se codifica con porcentajes (
					<code>https://example.test/a%20b</code>).
				</li>
				<li>
					<strong>Otros objetivos</strong>: un resultado cuyo <code>url</code> no es una URL, como
					la ruta con la que se analizó una página (
					<code>runDomRulesInPage('dist/my page.html', …)</code>), es una ruta relativa, con barras
					normales y cada segmento codificado con porcentajes (<code>dist/my%20page.html</code>);
					una ruta de Windows es una URL <code>file:</code> absoluta. Un resultado sin{" "}
					<code>url</code>, o con uno que no es una cadena, se ubica en <code>about:blank</code>.
				</li>
			</ul>
			<p>
				La ubicación del elemento (su selector, precedido de los selectores de sus hosts shadow y{" "}
				<code>{" >>> "}</code> cuando está dentro de un árbol shadow) se incluye además como un{" "}
				<code>logicalLocations[].fullyQualifiedName</code>, así que un consumidor que lea las
				ubicaciones lógicas igual obtiene la señal de "qué elemento" incluso sin una ubicación
				física utilizable.
			</p>

			<h2 id="cross-frame-results">Resultados entre frames</h2>
			<p>
				Un resultado de <code>runa11yCoreAcrossFrames</code>, o de un análisis{" "}
				<code>.frames(true)</code> de una integración (ver{" "}
				<a href="/results-reports/output-schema/#cross-frame-result">Esquema de salida</a>), es una
				sola ejecución: los hallazgos de cada frame son resultados dentro de ella. Un hallazgo en un
				frame se ubica en el documento de ese frame (<code>artifactLocation.uri</code> es la URL del
				frame), y lleva la ruta del frame en <code>properties.frame</code>:
			</p>
			<CodeBlock
				lang="json"
				lines={[
					'"properties": {',
					'  "severity": "serious",',
					'  "confidence": "high",',
					'  "reasonCode": "DEFAULT",',
					'  "html": "<img src=\\"card.png\\">",',
					'  "frame": ["#checkout"]',
					"}",
				]}
			/>
			<p>
				La ruta también forma parte de la identidad del hallazgo (<code>partialFingerprints</code>),
				así que el mismo defecto en la página y en un frame, o en dos frames, son dos alertas. Un
				frame que no respondió (sin respondedor, o se agotó el tiempo) es una notificación de nivel{" "}
				<code>warning</code>,{" "}
				<code>"The frame #ads (https://ads.example/) was not scanned: &lt;error&gt;"</code>, ya que
				no se comprobó nada en él.
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

			<h2 id="options">Opciones</h2>
			<p>
				<code>renderSarifReport(result, options)</code> de <code>@surea11y/core/sarif</code>{" "}
				devuelve el registro como texto JSON. Acepta:
			</p>
			<DataTable
				label="Opciones de renderSarifReport"
				rowKey="id"
				columns={[
					{ key: "option", label: "Opción", width: "22%" },
					{ key: "def", label: "Por defecto", width: "30%", wrap: true },
					{ key: "effect", label: "Efecto", wrap: true },
				]}
				rows={sarifOptionRows}
			/>

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
				Un baseline nunca deja fuera las ocurrencias <code>cantTell</code>. Un baseline escrito con{" "}
				<code>{"buildBaselineEntries(result, { leanFail: true })"}</code> registra también los
				hallazgos que tienden a fallo, como entradas marcadas con <code>lean: 'fail'</code> (ver{" "}
				<a href="/conformance/baseline/#findings-that-lean-fail">Baseline / allowlist</a>); con{" "}
				<code>leanFailAs: 'error'</code> un hallazgo así se queda en <code>warning</code> en lugar
				de elevarse a <code>error</code>, para que un equipo pueda aceptar los fallos probables que
				ya tiene y seguir bloqueando los nuevos. <code>--write-baseline</code> solo registra
				ocurrencias <code>fail</code>.
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
