import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const topLevelRows = [
	{ id: "engine.tag", field: <code>engine.tag</code>, meaning: <>La etiqueta de identidad propia del motor, actualmente <code>"a11ycore"</code>. Cada regla (integrada o personalizada) la lleva en <code>meta.tags</code>: los <code>ruleId</code> de las reglas en sí son simples (sin prefijo).</> },
	{
		id: "engine.schemaVersion",
		field: <code>engine.schemaVersion</code>,
		meaning: (
			<>
				La versión del esquema de resultados (<code>"1.0.0"</code>). Sujeta a incrementarse si la
				estructura de este documento cambia alguna vez de manera incompatible: ánclate a ella si
				analizas la salida de forma programática. Consulta{" "}
				<a href={`${core}/docs/API_STABILITY.md`}><code>API_STABILITY.md</code></a> para ver la
				lista completa de campos estables/inestables y la política de incremento de versión.
			</>
		),
	},
	{
		id: "engine.locale",
		field: <code>engine.locale</code>,
		meaning: (
			<>
				Qué diccionario usó realmente la ejecución. <code>requested</code> es tu{" "}
				<code>engineOptions.locale</code> después de recortar espacios (<code>"en"</code> si no
				pasaste nada o pasaste algo que no es una cadena); <code>resolved</code> es el idioma cuyo
				diccionario se usó; <code>reason</code> explica el porqué de ese emparejamiento. Como el
				mecanismo de reserva de idioma es gradual y se aplica cadena por cadena,{" "}
				<strong>pedir un idioma que la compilación no incluye produce texto en inglés en lugar de
				un error</strong>: este campo es cómo te enteras de eso sin leer las cadenas. Se informa
				una vez por resultado: una ejecución usa un solo diccionario en todo momento.
			</>
		),
	},
	{
		id: "engine.locale.reason",
		field: <code>engine.locale.reason</code>,
		meaning: (
			<>
				<code>"ok"</code>: obtuviste el diccionario que pediste, y contiene todas las claves.{" "}
				<code>"primary-subtag"</code>: tu código tenía un subtag sin diccionario propio, así que
				se usó su idioma base: <code>"de-DE"</code> se resuelve a <code>"de"</code>.{" "}
				<code>"dictionary-not-loaded"</code>: el proyecto incluye ese idioma, pero esta
				compilación no lo lleva y no se suministró ninguno (el paquete independiente para
				navegador, sin su archivo lateral de idioma). <code>"unknown-locale"</code>: el proyecto
				no tiene ninguna traducción de ese tipo. <code>"partial-dictionary"</code>: se usó el
				diccionario, pero le faltan claves que el inglés sí tiene, así que esas cadenas
				recurrieron al inglés. Trata este conjunto como abierto; versiones posteriores pueden
				añadir más.
			</>
		),
	},
	{
		id: "engine.wcagVersion",
		field: <code>engine.wcagVersion</code>,
		meaning: (
			<>
				Contra qué versión de WCAG se evaluó la conformidad en esta ejecución: tu{" "}
				<code>engineOptions.wcagVersion</code>, o lo que implicaban tus etiquetas de origen de
				versión, o el valor predeterminado <code>"2.2"</code>. Hoy afecta a una sola cosa:{" "}
				<strong>una regla mapeada únicamente al SC 4.1.1 <span lang="en">Parsing</span> no puede dar <code>fail</code>{" "}
				bajo un objetivo 2.2</strong> (ver{" "}
				<code>checksResults[i].wcagVersionScope</code> más abajo). Se informa una vez por
				resultado: una ejecución tiene un solo objetivo en todo momento.
			</>
		),
	},
	{ id: "url", field: <code>url</code>, meaning: <>El argumento <code>pageUrl</code> que pasaste, o <code>document.location.href</code> si pasaste <code>null</code>/lo omitiste, o <code>null</code> si ninguno está disponible.</> },
	{ id: "title", field: <code>title</code>, meaning: <><code>document.title</code> en el momento del análisis o <code>null</code>.</> },
	{
		id: "timestamp",
		field: <code>timestamp</code>,
		meaning: (
			<>
				<strong>No se genera automáticamente.</strong> Solo se establece si pasas{" "}
				<code>engineOptions.timestamp</code> como una cadena no vacía: el motor no tiene reloj
				integrado (es determinista por diseño). Si quieres una marca de tiempo del análisis en el
				resultado, súplela tú mismo.
			</>
		),
	},
	{
		id: "perfStats",
		field: <code>perfStats</code>,
		meaning: <><code>null</code> a menos que <code>engineOptions.perfStats: true</code>. Temporizaciones/contadores internos: su estructura no está cubierta por este documento, trátalo como solo para depuración.</>,
	},
	{
		id: "contextSelector",
		field: <code>contextSelector</code>,
		meaning: (
			<>
				El argumento (recortado) <code>contextSelector</code> que pasaste: una cadena, un array
				de cadenas (análisis multi-región, ver <a href="/configuration/engine-options/">Opciones del motor</a>), o{" "}
				<code>null</code> si no hay ninguno o está vacío.
			</>
		),
	},
	{
		id: "checksResults",
		field: <code>checksResults</code>,
		meaning: (
			<>
				Una entrada por cada <strong>regla atómica</strong> que se ejecutó (toda regla no
				filtrada por <code>runOnly</code>, ver <a href="/configuration/engine-options/">Opciones del motor</a>).{" "}
				<strong>Cada regla cargada produce una entrada, incluso las que dan como outcome{" "}
				<code>notApplicable</code></strong>: esto no es una lista de «solo violaciones».
			</>
		),
	},
	{
		id: "rulesResults",
		field: <code>rulesResults</code>,
		meaning: (
			<>
				Una entrada por cada <strong>regla compuesta (agregación por SC de WCAG)</strong> que se
				ejecutó. Ver <a href="#composite-result">Un resultado compuesto</a> y{" "}
				<a href="/conformance/wcag-mapping/">Conformidad</a>. Array vacío si ningún compuesto
				coincidió con el filtro <code>runOnly</code>/etiqueta actual.
			</>
		),
	},
	{
		id: "overriddenBuiltinIds",
		field: <code>overriddenBuiltinIds</code>,
		meaning: (
			<>
				Ids de regla en los que una entrada de <code>engineOptions.customRules</code> compartió su{" "}
				<code>id</code> con una regla integrada, de modo que la implementación personalizada
				reemplazó a la integrada para este análisis (ver <a href="/configuration/engine-options/">Opciones del motor</a>). Siempre
				es un array; vacío cuando no ocurrió ninguna colisión. También se registra vía{" "}
				<code>console.warn</code> en el momento del análisis, ya que una regla personalizada con
				el mismo nombre es tan probable que sea una colisión accidental como una sustitución
				deliberada.
			</>
		),
	},
];

const occurrenceRows = [
	{
		id: "selector",
		field: <code>selector</code>,
		meaning: (
			<>
				Un selector CSS construido con el mejor esfuerzo posible para resolver de vuelta al
				elemento señalado (ver <code>helpers.buildSelector</code> en <code>RULE_AUTHORING.md</code>).
				No se garantiza que sea único en estructuras de DOM adversas, pero el motor verifica
				activamente que resuelva al elemento identificado antes de usarlo. La excepción es una regla
				cuyo hallazgo <em>es</em> un elemento ausente: <code>page-title-present</code> devuelve{" "}
				<code>head &gt; title</code> con un <code>html</code> de{" "}
				<code>&lt;title&gt;(missing)&lt;/title&gt;</code>, ninguno de los cuales está en la
				página. Ambos son constantes, así que la huella que alimentan se mantiene estable, pero{" "}
				<strong>no trates <code>selector</code> como resoluble ni <code>html</code> como marcado
				real sin comprobar antes que la regla devolvió algo que existe</strong>.
			</>
		),
	},
	{
		id: "html",
		field: <code>html</code>,
		meaning: (
			<>
				Un fragmento de outer-HTML del elemento señalado: úsalo como tu señal principal de «qué
				elemento es» cuando <code>includeShadowDom: true</code> (los selectores no atraviesan los
				límites de shadow DOM).
			</>
		),
	},
	{
		id: "structuralPath",
		field: <code>structuralPath</code>,
		meaning: (
			<>
				La ruta de índices de hermanos del elemento señalado, desde <code>documentElement</code>{" "}
				hasta él (por ejemplo, <code>[1, 0, 2]</code>): <code>[]</code> si el elemento{" "}
				<em>es</em> <code>documentElement</code>, <code>null</code> si no pudo determinarse. Un
				mecanismo de identidad de elemento más robusto que <code>selector</code> por sí solo:
				sobrevive a cambios en el DOM que una cadena de selector no soportaría (un cambio de
				<code>id</code>/clase, por ejemplo), a costa de{" "}
				<strong>no poder usarse como un selector CSS real</strong>.
			</>
		),
	},
	{ id: "summary", field: <code>summary</code>, meaning: <>Legible para humanos, ya localizado ("<span lang="en">This button has no accessible name.</span>").</> },
	{ id: "hint", field: <code>hint</code>, meaning: "Guía de corrección legible para humanos, ya localizada." },
	{
		id: "i18n",
		field: <code>i18n</code>,
		meaning: (
			<>
				Las claves de traducción originales detrás de <code>summary</code>/<code>hint</code>, por
				si quieres volver a renderizarlas tú mismo en otro idioma sin volver a ejecutar el
				análisis. <code>null</code> si la ocurrencia no usó i18n basado en claves.
			</>
		),
	},
	{
		id: "data.visibilityFilter",
		field: <code>data.visibilityFilter</code>,
		meaning: (
			<>
				Presente en la mayoría de las ocurrencias: por qué el motor consideró este elemento
				elegible (o no) según el modelo de elegibilidad que usó la regla. <code>eligible</code>{" "}
				es ese resultado; <code>targetSet</code> indica qué modelo lo produjo (<code>'dom'</code>:
				visibilidad de DOM/CSS en bruto, la mayoría de las reglas; <code>'acc'</code>:
				elegibilidad del árbol de accesibilidad). <code>accEligible</code> refleja{" "}
				<code>eligible</code> solo cuando <code>targetSet</code> es <code>'acc'</code>; en caso
				contrario es <code>null</code>. <code>reasons</code> es una lista de códigos de exclusión
				legibles por máquina cuando <code>eligible: false</code>.
			</>
		),
	},
	{
		id: "data.details",
		field: <code>data.details</code>,
		meaning: (
			<>
				Datos estructurados específicos de la regla (métricas calculadas, referencias resueltas),
				<strong>no normativos</strong>: útiles para construir una interfaz más rica o para
				depurar, pero nunca cambian lo que significan <code>outcome</code>/<code>severity</code>.
				La estructura varía según la regla; trátalo como contexto adicional de mejor esfuerzo, no como
				un contrato estable. La única excepción es{" "}
				<code>data.details.reasonCode</code>, que <strong>sí</strong> es estable: identifica{" "}
				<em>cuál</em> de los hallazgos de una regla es este, y junto con <code>ruleId</code> y{" "}
				<code>html</code> forma la huella sobre la que se indexan los baselines y SARIF. Consulta{" "}
				<a href={`${core}/docs/API_STABILITY.md#finding-identity`}>
					<code>API_STABILITY.md</code>
				</a>
				.
			</>
		),
	},
	{
		id: "occurrenceOutcome",
		field: <code>occurrenceOutcome</code>,
		meaning: (
			<>
				A qué nivel pertenece esta ocurrencia, en una regla que clasificó sus hallazgos en un
				nivel <code>fail</code> (con confianza) y un nivel <code>cantTell</code> (que necesita
				revisión). Una regla que solo informa un nivel lo omite, en cuyo caso el propio{" "}
				<code>outcome</code> del resultado es el nivel de la ocurrencia.
			</>
		),
	},
	{ id: "uncertainty", field: <code>uncertainty</code>, meaning: <>Por qué no se pudo decidir este hallazgo (ver <a href="#uncertainty-codes">Códigos de incertidumbre</a> más abajo).</> },
];

const uncertaintyRows = [
	{ id: "not-computable", code: <code>not-computable</code>, meaning: "La evidencia que la regla necesitaba no se pudo leer en este entorno.", shape: "Una hoja de estilos de origen cruzado, un color de fondo que no resuelve a ningún valor, un src que no se resuelve." },
	{ id: "runtime-dependent", code: <code>runtime-dependent</code>, meaning: "El marcado no puede resolverlo porque un script lo decide en tiempo de ejecución.", shape: "Un aria-controls que nombra un elemento que el widget crea al abrirse." },
	{ id: "spec-only", code: <code>spec-only</code>, meaning: "Una violación real de la especificación, pero el nombre, rol y valor expuestos sobreviven a ella, así que no se establece que ningún criterio de éxito haya fallado.", shape: "Un atributo ARIA cuya ausencia la especificación cubre con un valor predeterminado." },
	{ id: "equivalence-unknown", code: <code>equivalence-unknown</code>, meaning: "Dos cosas pueden o no cumplir el mismo propósito, y ni el marcado ni el contenido lo resuelven.", shape: "Dos frames que comparten un nombre accesible pero incrustan recursos distintos." },
	{ id: "judgement-required", code: <code>judgement-required</code>, meaning: "La pregunta es, por naturaleza, una decisión humana.", shape: "Si un objetivo de tamaño insuficiente es esencial; toda regla type: \"manual\"." },
	{ id: "out-of-scope", code: <code>out-of-scope</code>, meaning: "El hallazgo es real, pero queda fuera del estándar al que apunta esta ejecución.", shape: "Una regla mapeada únicamente a un criterio que la versión de WCAG objetivo eliminó." },
];

const outcomeRows = [
	{ id: "fail", outcome: <code>fail</code>, meaning: "Violación determinista y normativa: el procedimiento de decisión no adivina nada.", manual: <>No (se fuerza a <code>cantTell</code>)</> },
	{ id: "pass", outcome: <code>pass</code>, meaning: "El/los objetivo(s) aplicable(s) de la regla existen y ninguno fue señalado.", manual: "Sí" },
	{ id: "cantTell", outcome: <code>cantTell</code>, meaning: "Requiere juicio humano: ya sea genuinamente ambiguo o el hallazgo de carácter consultivo de una regla manual.", manual: "Sí" },
	{ id: "notApplicable", outcome: <code>notApplicable</code>, meaning: "La regla no encontró elementos a los que aplicarse en esta página/ámbito.", manual: "Sí" },
];

export function OutputSchemaContent() {
	return (
		<>
			<p>
				Esta es la estructura exacta del objeto que devuelven <code>runDomRulesInPage(...)</code> /{" "}
				<code>runa11yCoreInPage(...)</code> (consulta{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a> para saber cuál
				llamar). Todos los ejemplos de esta página son salida real del motor actual (
				<code>schemaVersion: "1.0.0"</code>), no están escritos a mano. <code>runa11yCoreAcrossFrames</code>{" "}
				devuelve una estructura distinta y recursiva que envuelve esta. Ver{" "}
				<a href="#cross-frame-result">Resultado entre frames</a> más abajo.
			</p>

			<h2 id="top-level-result">Resultado de nivel superior</h2>
			<CodeBlock
				lines={[
					"{",
					"  engine: {",
					"    tag: string,",
					"    schemaVersion: string,",
					"    locale: { requested: string, resolved: string, reason: string },",
					'    wcagVersion: "2.0" | "2.1" | "2.2"',
					"  },",
					"  url: string | null,",
					"  title: string | null,",
					"  timestamp: string | null,",
					"  perfStats: object | null,",
					"  contextSelector: string | string[] | null,",
					"  checksResults: CheckResult[],",
					"  rulesResults: CompositeResult[],",
					"  overriddenBuiltinIds: string[]",
					"}",
				]}
			/>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "field", label: "Campo", width: "22%" },
					{ key: "meaning", label: "Significado", wrap: true },
				]}
				rows={topLevelRows}
			/>

			<h2 id="cross-frame-result">Resultado entre frames (<code>runa11yCoreAcrossFrames</code>)</h2>
			<p>
				<code>runa11yCoreAcrossFrames</code> (consulta{" "}
				<a href={`${core}/docs/INTEGRATION.md#cross-frame-scanning-including-cross-origin`}>
					<code>INTEGRATION.md</code>
				</a>
				) devuelve una estructura distinta y recursiva en lugar de un resultado de nivel superior
				simple:
			</p>
			<CodeBlock
				lines={[
					"{",
					"  topFrame: <the normal top-level result shape above>,",
					"  frames: Array<",
					"    | { url: string | null, topFrame: <top-level result>, frames: [...same shape, recursively] }",
					"    | { url: string | null, error: string }",
					"  >",
					"}",
				]}
			/>
			<ul>
				<li>
					<code>topFrame</code> es exactamente la estructura del{" "}
					<a href="#top-level-result">resultado de nivel superior</a>, para el frame en el que se
					llamó a la función.
				</li>
				<li>
					<code>frames</code> tiene una entrada por cada <code>&lt;iframe&gt;</code>/
					<code>&lt;frame&gt;</code> hijo directo dentro del ámbito analizado. Un hijo alcanzable
					(uno que llamó a <code>a11yCoreEnableFrameResponder()</code>) aporta su propio{" "}
					<code>{"{ url, topFrame, frames }"}</code> completo: incluyendo{" "}
					<em>sus propios</em> <code>frames</code> anidados, de forma recursiva, ya que un nieto
					anidado más profundo solo es alcanzable a través de su padre inmediato. Un hijo
					inalcanzable (el caso común para la mayoría de los embebidos de terceros, sin
					responder cooperante o que agotó el tiempo de espera) aporta{" "}
					<code>{"{ url, error }"}</code> en su lugar, y no aborta el resto del análisis.
				</li>
				<li>
					Esto es un <strong>árbol, no una lista plana</strong>: una diferencia deliberada
					respecto a <code>@surea11y/playwright</code>'s <code>.frames(true)</code>, que{" "}
					<em>sí</em> puede aplanar porque <code>page.frames()</code> de Playwright ya entrega
					todos los frames sin importar la profundidad de anidamiento; un relé por{" "}
					<code>postMessage</code> no tiene esa visión global, así que el anidamiento se expresa
					de forma estructural en su lugar.
				</li>
			</ul>

			<h2>Un resultado de comprobación (<code>checksResults[i]</code>)</h2>
			<CodeBlock
				lines={[
					"{",
					"  ruleId: string,",
					'  outcome: "pass" | "fail" | "cantTell" | "notApplicable",',
					'  outcomeNormalized: "pass" | "fail" | "cantTell" | "inapplicable",',
					'  severity: "minor" | "moderate" | "serious" | "critical",',
					'  confidence: "high" | "medium" | "low",',
					'  type: "automatic" | "manual",',
					"  occurrences: Occurrence[],",
					"  title: string,",
					"  description: string,",
					"  i18n: { titleKey: string, descriptionKey: string } | null,",
					"  meta: {",
					"    ruleId: string,",
					"    ruleInterfaceVersion: string,",
					"    ruleVersion: string,",
					"    normative: boolean,",
					"    atomic: boolean,",
					"    deprecated: boolean,",
					"    deprecation: object | null,",
					'    category: "perceivable" | "operable" | "understandable" | "robust" | null,',
					"    normativeMappings: Array<{ standard: string, version: string, requirement: string, title: string, conformanceLevel: string }>,",
					"    standard: string | null,",
					"    applicability: string,",
					"    expectation: string,",
					"    references: string[],",
					"    requirements: object | null,",
					"    mappings: object | null",
					"  },",
					"  engineOptions: object,   // the resolved engineOptions this rule actually ran under",
					"  schemaVersion: string,",
					"  wcagVersionScope?: {     // present only when the target WCAG version changed this outcome",
					'    target: "2.0" | "2.1" | "2.2",',
					"    removedSc: string[],",
					'    coercedFrom: "fail"',
					"  },",
					"  error?: string           // present only if the rule threw — see below",
					"}",
				]}
			/>
			<p>Notas:</p>
			<ul>
				<li>
					<strong><code>outcome</code> frente a <code>outcomeNormalized</code></strong>:
					idénticos, salvo que <code>notApplicable</code> se convierte en{" "}
					<code>"inapplicable"</code> en <code>outcomeNormalized</code>. Se ofrecen ambos para
					que puedas ajustarte a tu propio vocabulario o al vocabulario interno del motor.
				</li>
				<li>
					<strong>Las reglas <code>type: "manual"</code> nunca pueden devolver{" "}
					<code>outcome: "fail"</code>.</strong>{" "}
					Si la lógica propia de una regla manual hubiera dicho <code>fail</code>, el motor la
					fuerza a <code>cantTell</code> y añade una nota explicativa a <code>error</code>: esto
					se aplica de forma centralizada (<code>policy.coerceManualFailToCantTell</code>,
					activado por defecto bajo el contrato de política <code>a11y</code>; consulta{" "}
					<a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a>), no es algo que cada
					regla tenga que recordar por su cuenta. <code>fail</code> está reservado únicamente
					para hallazgos deterministas de <code>type: "automatic"</code>.
				</li>
				<li>
					<strong><code>meta.normativeMappings</code></strong> es cómo un resultado de
					comprobación se vincula de vuelta a un criterio de éxito de WCAG: <code>[]</code> para
					reglas sin mapeo formal a WCAG (este motor las llama reglas consultivas{" "}
					<code>type: "manual"</code>). Consulta{" "}
					<a href="/conformance/wcag-mapping/">Conformidad</a> para ver cómo se agregan.
				</li>
				<li>
					<strong><code>wcagVersionScope</code></strong>: presente solo cuando la versión de WCAG
					objetivo de la ejecución convirtió el <code>fail</code> de esta regla en un{" "}
					<code>cantTell</code>: hoy eso significa una regla mapeada al SC 4.1.1 <span lang="en">Parsing</span> (
					<code>duplicate-id</code>) bajo el objetivo 2.2 predeterminado, ya que 2.2 eliminó ese
					criterio. <code>removedSc</code> enumera los criterios que dejaron de existir,{" "}
					<code>target</code> es la versión que los eliminó, y <code>coercedFrom</code> es el
					outcome que la propia regla devolvió. Las occurrences son las propias de la regla, sin
					cambios: no se descartó nada, solo cambió el veredicto de conformidad. Ausente en
					cualquier otro resultado, y <strong>nunca</strong> se indica a través de{" "}
					<code>error</code>: no salió nada mal. Consulta{" "}
					<a href="/configuration/engine-options/#filtering-by-wcag-version">Filtrado por versión de WCAG</a>.
				</li>
				<li>
					<strong><code>error</code></strong>: presente solo en tres casos: la implementación de
					la regla lanzó una excepción no capturada, se activó la coerción de <code>fail</code> manual descrita
					arriba o cada occurrence de un resultado <code>fail</code> tuvo su recorrido de
					ancestros topando con un límite de profundidad interno (así que el motor no pudo
					confirmar que el contenido señalado esté realmente expuesto) y todo el resultado se
					forzó a <code>cantTell</code> del mismo modo. Una regla que lanza una excepción siempre
					aparece como <code>outcome: "cantTell"</code> con <code>occurrences: []</code> y{" "}
					<code>error</code> establecido al mensaje de la excepción: el motor nunca deja que una
					regla rota haga fallar todo el análisis.
				</li>
				<li>
					<strong><code>engineOptions</code></strong> en cada resultado es el objeto de opciones{" "}
					<em>resuelto</em> (después de aplicar los valores predeterminados de locale/contrast),
					no literalmente lo que pasaste: útil para confirmar qué vio realmente una regla dada,
					especialmente el <code>locale</code> resuelto y <code>contrast.mode</code>/
					<code>contrast.rootCanvasFallback</code>.
				</li>
			</ul>

			<h2>Una ocurrencia (<code>occurrences[i]</code>)</h2>
			<p>
				Normalmente presente solo cuando <code>outcome</code> es <code>fail</code> o{" "}
				<code>cantTell</code>: un resultado <code>pass</code> tiene <code>occurrences: []</code>,
				ya que este motor no enumera los elementos que pasó, solo los que señaló.
			</p>
			<p>
				<code>notApplicable</code> es la única excepción. Una regla que no tuvo nada que juzgar
				puede adjuntar una única occurrence explicando por qué, y las reglas de contraste hacen
				exactamente eso cuando ningún texto tenía un fondo calculable: la diferencia entre «se
				comprobó, nada que señalar» y «no se pudo comprobar» es algo que este motor indica en
				lugar de ocultar. Una occurrence así describe el análisis, no un elemento, así que su{" "}
				<code>selector</code> está vacío.{" "}
				<strong>No interpretes <code>occurrences.length</code> como un recuento de violaciones
				sin comprobar antes <code>outcome</code>.</strong>
			</p>
			<CodeBlock
				lines={[
					"{",
					"  selector: string,",
					"  html: string,",
					"  structuralPath: number[] | null,",
					"  summary: string,",
					"  hint: string,",
					"  i18n: { summaryKey: string, hintKey: string, params: object } | null,",
					'  occurrenceOutcome?: "fail" | "cantTell",   // present when the rule graded its findings into tiers',
					"  uncertainty?: {          // present only on a cantTell-tier occurrence",
					'    code: "not-computable" | "runtime-dependent" | "spec-only"',
					'        | "equivalence-unknown" | "judgement-required" | "out-of-scope",',
					"    needed?: string,       // what would settle the question",
					"    evidence?: object      // what the rule did establish, rule-specific",
					"  },",
					"  data: {",
					"    visibilityFilter?: { eligible: boolean, targetSet: string, accEligible: boolean | null, reasons: string[] },",
					"    details?: object   // rule-specific, non-normative — see below",
					"  }",
					"}",
				]}
			/>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "field", label: "Campo", width: "22%" },
					{ key: "meaning", label: "Significado", wrap: true },
				]}
				rows={occurrenceRows}
			/>

			<h3 id="uncertainty-codes">Códigos de incertidumbre</h3>
			<p>
				Un <code>cantTell</code> dice que el motor no decidió. <code>uncertainty</code> dice{" "}
				<strong>por qué</strong>, a partir de un vocabulario cerrado, para que un consumidor pueda
				ramificar según el motivo en lugar de analizar una cadena de resumen. Está presente solo
				en una occurrence de nivel <code>cantTell</code>: una de nivel <code>fail</code> estaría
				afirmando que la regla decidió y no decidió a la vez, así que el motor la omite.
			</p>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "code", label: "code", width: "20%" },
					{ key: "meaning", label: "Significado", wrap: true, width: "40%" },
					{ key: "shape", label: "Forma típica", wrap: true },
				]}
				rows={uncertaintyRows}
			/>
			<p>
				<code>needed</code> indica, en una frase, qué resolvería la cuestión: lo que un revisor
				tiene que ir a comprobar. <code>evidence</code> lleva lo que la regla <em>sí</em> llegó a
				establecer, para que el revisor parta del trabajo del motor en lugar de repetirlo; su
				estructura es específica de cada regla y, como <code>data.details</code>, no es un contrato
				estable. En cuanto a <code>code</code>: pueden añadirse códigos nuevos en una versión
				menor, pero uno existente no cambia de significado, así que ramifica según los códigos que
				conoces y{" "}
				<strong>trata uno no reconocido como «necesita revisión» en lugar de como un error</strong>.
			</p>
			<p>
				Toda regla automática que puede devolver <code>cantTell</code> lleva esto, y una prueba
				mantiene esa línea para que no pueda llegar una nueva sin ello. El código{" "}
				<code>out-of-scope</code> lo adjunta el motor, no una regla, en las mismas occurrences que
				producen un <code>wcagVersionScope</code> a nivel de resultado. Las reglas manuales no lo
				llevan: <code>judgement-required</code> ya es lo que significa{" "}
				<code>type: "manual"</code>, así que repetirlo por occurrence no diría nada que el
				resultado no diga ya.
			</p>

			<h2 id="composite-result">Un resultado compuesto (<code>rulesResults[i]</code>)</h2>
			<p>
				Los compuestos agregan varias reglas atómicas en un solo criterio de éxito de WCAG (por
				ejemplo, <code>wcag-1.1.1-non-text-content</code> agrega 21 reglas atómicas). La estructura es
				la misma que la de un resultado de comprobación, con un <code>data.details</code>{" "}
				específico de compuestos:
			</p>
			<CodeBlock
				lines={[
					"{",
					'  ruleId: string,              // e.g. "wcag-1.1.1-non-text-content"',
					'  outcome: "pass" | "fail" | "cantTell" | "notApplicable",',
					"  severity, confidence, type, title, description, meta, engineOptions, schemaVersion,  // same as a check result",
					"  occurrences: [],              // always empty — composites are rollups, not element-level findings",
					"  data: {",
					"    details: {",
					'      reasonCode: string,       // e.g. "composite.rollup.fail.anyFail"',
					"      checksIds: string[],      // every atomic ruleId this composite rolls up",
					"      contributors: Array<{ testId: string, outcome: string, severity: string | null }>,",
					"      metrics: { failCount, cantTellCount, notApplicableCount, passCount, missingCount }",
					"    }",
					"  }",
					"}",
				]}
			/>
			<p>
				Precedencia de la agregación (determinista, en este orden):{" "}
				<strong>cualquier contribuyente <code>fail</code> → compuesto <code>fail</code></strong>;
				si no, <strong>cualquier <code>cantTell</code> (o una regla contribuyente que no se
				ejecutó en absoluto, <code>missingCount &gt; 0</code>) → compuesto{" "}
				<code>cantTell</code></strong>; si no, <strong>todos los contribuyentes{" "}
				<code>notApplicable</code> → compuesto <code>notApplicable</code></strong>; si no,{" "}
				<strong><code>pass</code></strong>. Consulta{" "}
				<a href="/conformance/wcag-mapping/">Conformidad</a> para ver qué implica esto en una
				afirmación de conformidad global.
			</p>

			<h2>Valores de outcome</h2>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "outcome", label: "Resultado", width: "16%" },
					{ key: "meaning", label: "Significado", wrap: true },
					{ key: "manual", label: '¿Puede aparecer en type: "manual"?', width: "22%" },
				]}
				rows={outcomeRows}
			/>
			<p>
				<code>fail</code> es, de forma intencional, el outcome más estrecho y de mayor exigencia
				en este motor: reservado para violaciones deterministas y normativas;{" "}
				<strong>la persecución de cobertura de reglas nunca debe diluir esto</strong>.
			</p>

			<h2>Valores de severity y confidence</h2>
			<ul>
				<li>
					<code>severity</code>: <code>minor</code> &lt; <code>moderate</code> &lt;{" "}
					<code>serious</code> &lt; <code>critical</code>: la evaluación del autor de la regla
					sobre el impacto en el usuario, independiente de <code>confidence</code>.
				</li>
				<li>
					<code>confidence</code>: <code>low</code> &lt; <code>medium</code> &lt;{" "}
					<code>high</code>: cuán seguro está el motor de que un veredicto{" "}
					<code>fail</code>/<code>cantTell</code> es correcto. Ambos son metadatos informativos
					para priorizar; ninguno cambia el significado de <code>outcome</code>.
				</li>
			</ul>
			<p>
				<strong>Un <code>fail</code> no siempre tiene <code>confidence: "high"</code>, y eso no es
				una contradicción.</strong> El outcome describe el procedimiento de decisión (resolvió la
				cuestión sin adivinar), mientras que <code>confidence</code> describe el modelo contra el
				que se tomó esa decisión. Un puñado de reglas automáticas deciden de forma determinista
				contra algo que en sí mismo es una aproximación (las tablas curadas de roles WAI-ARIA, los
				mapeos de roles nativos, un árbol de accesibilidad inferido a partir de marcado estático) y
				devuelven <code>medium</code>: <code>aria-required-children</code>,{" "}
				<code>aria-prohibited-children</code>, <code>aria-required-parent</code>,{" "}
				<code>aria-allowed-attr</code>, <code>form-control-programmatic-label-present</code>,{" "}
				<code>identical-iframes-same-purpose</code>,{" "}
				<code>svg-image-text-alternative-present</code>,{" "}
				<code>video-poster-text-alternative-present</code> y <code>target-size-minimum</code>.{" "}
				<code>confidence</code> está presente en todo resultado, así que un consumidor que solo
				quiera los fallos más seguros puede filtrar directamente por él;{" "}
				<code>policy.allowedConfidence</code> no hará eso por ti, ya que un valor no permitido se
				sustituye por el <code>defaultConfidence</code> propio de la regla en lugar de cambiar el
				outcome (consulta{" "}
				<a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a>).
			</p>

			<h2>Ejemplo resuelto</h2>
			<p>
				Analizando <code>&lt;img src="logo.png"&gt;</code> (sin <code>alt</code>) y{" "}
				<code>&lt;button&gt;&lt;/button&gt;</code> (sin nombre accesible), limitado a esas dos
				reglas mediante <code>runOnly: {"{ includeRuleIds: [...] }"}</code> (ver{" "}
				<a href="/configuration/engine-options/">Opciones del motor</a>; esto{" "}
				<strong>no</strong> es un array simple):
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const result = runDomRulesInPage(",
					"  'https://example.test/',",
					"  null,",
					"  {},",
					"  { includeRuleIds: ['img-alt-present', 'button-name-present'] }",
					");",
				]}
			/>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					'  "engine": {',
					'    "tag": "a11ycore",',
					'    "schemaVersion": "1.0.0",',
					'    "locale": { "requested": "en", "resolved": "en", "reason": "ok" }',
					"  },",
					'  "url": "https://example.test/",',
					'  "title": "Example",',
					'  "timestamp": null,',
					'  "perfStats": null,',
					'  "contextSelector": null,',
					'  "checksResults": [',
					"    {",
					'      "ruleId": "button-name-present",',
					'      "outcome": "fail",',
					'      "severity": "serious",',
					'      "confidence": "high",',
					'      "type": "automatic",',
					'      "occurrences": [',
					"        {",
					'          "selector": "html > body > button",',
					'          "html": "<button></button>",',
					'          "structuralPath": [1, 1],',
					'          "summary": "This button has no accessible name.",',
					'          "hint": "Provide visible button text or a programmatic accessible-name mechanism (for example aria-label) so assistive technologies can identify the button.",',
					'          "data": {',
					'            "visibilityFilter": { "eligible": true, "reasons": [], "targetSet": "acc", "accEligible": true },',
					'            "details": { "reasonCode": "name_missing" }',
					"          }",
					"        }",
					"      ]",
					"    },",
					"    {",
					'      "ruleId": "img-alt-present",',
					'      "outcome": "fail",',
					'      "severity": "serious",',
					'      "confidence": "high",',
					'      "type": "automatic",',
					'      "occurrences": [',
					"        {",
					'          "selector": "html > body > img",',
					'          "html": "<img src=\\"logo.png\\">",',
					'          "structuralPath": [1, 0],',
					'          "summary": "Missing alt attribute on <img>.",',
					'          "hint": "Add an alt attribute (use alt=\\"\\" only for decorative images)."',
					"        }",
					"      ]",
					"    }",
					"  ],",
					'  "rulesResults": [],',
					'  "overriddenBuiltinIds": []',
					"}",
				]}
			/>
			<p>
				(Recortado por legibilidad: el resultado real también incluye{" "}
				<code>title</code>/<code>description</code>/<code>i18n</code>/<code>meta</code>/
				<code>engineOptions</code>/<code>schemaVersion</code> en cada entrada, según la estructura
				completa mostrada arriba. <code>rulesResults</code> está vacío aquí porque{" "}
				<code>runOnly.includeRuleIds</code> limitó el análisis a dos reglas atómicas y no se
				incluyó el ID propio de ningún compuesto.)
			</p>
		</>
	);
}
