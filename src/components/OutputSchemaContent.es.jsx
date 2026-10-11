import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const topLevelRows = [
	{ id: "engine.tag", field: <code>engine.tag</code>, meaning: <>La etiqueta de identidad propia del motor, actualmente <code>"a11ycore"</code>. Cada regla (integrada o personalizada) la lleva en <code>meta.tags</code>: los <code>ruleId</code> de las reglas en sí son simples (sin prefijo).</> },
	{
		id: "engine.version",
		field: <code>engine.version</code>,
		meaning: (
			<>
				La versión de <code>@surea11y/core</code> que produjo el resultado, como{" "}
				<code>"1.11.1"</code>: lo que hay que citar en un informe de error, y cómo distinguir
				resultados de dos versiones. Un resultado puede cambiar entre versiones sin que cambie su
				estructura, así que esto no es <code>schemaVersion</code>. Los generadores de{" "}
				<a href="/results-reports/sarif-report/">SARIF</a> y{" "}
				<a href="/results-reports/earl-report/">EARL</a> lo usan como versión de la herramienta
				cuando no indicas ninguna.
			</>
		),
	},
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
	{
		id: "engine.profile",
		field: <code>engine.profile</code>,
		meaning: (
			<>
				Presente solo cuando un <code>engineOptions.profile</code> seleccionó las reglas de esta
				ejecución, y nombra el perfil en minúsculas. Ausente cuando no se pidió ninguno, y también
				cuando se pidió uno pero no se aplicó (nombre desconocido, o un include en{" "}
				<code>runOnly</code> o <code>engineOptions</code> eligió las reglas en su lugar), así que su
				presencia es cómo confirmas que una ejecución apuntó de verdad a ese perfil. Ver{" "}
				<a href="/configuration/engine-options/#conformance-profiles">Perfiles de conformidad</a>.
			</>
		),
	},
	{
		id: "engine.profileExcludes",
		field: <code>engine.profileExcludes</code>,
		meaning: (
			<>
				Presente solo cuando el perfil aplicado deja reglas fuera:{" "}
				<code>{"{ rules, criteria }"}</code>, las reglas que nombra y los criterios de WCAG que
				deja fuera. Sus reglas y resultados agregados de WCAG no se ejecutaron, lo que reduce el
				análisis sin cambiar lo que exige WCAG. Ningún perfil incluido
				deja nada fuera.
			</>
		),
	},
	{
		id: "engine.optInRules",
		field: <code>engine.optInRules</code>,
		meaning: (
			<>
				Presente solo cuando <code>engineOptions.optInRules</code> ejecutó al menos una regla
				opcional que el resto de la selección no habría ejecutado. Enumera sus etiquetas. Su
				presencia significa que el resultado incluye reglas de requisitos más allá del estándar
				objetivo, así que un fallo puede no ser un fallo de WCAG. Ver{" "}
				<a href="/configuration/engine-options/#running-every-rule-optinrules">Ejecutar todas las reglas</a>.
			</>
		),
	},
	{
		id: "engine.mappings",
		field: <code>engine.mappings</code>,
		meaning: (
			<>
				Presente solo cuando la ejecución nombra un estándar además de WCAG en{" "}
				<code>meta.normativeMappings</code>, mediante <code>engineOptions.mappings</code> o el perfil
				de un estándar. Los enumera de forma canónica: <code>"en301549"</code> para todas las
				versiones, <code>"en301549:V3.2.1"</code> para una. Su ausencia significa que todos los
				resultados nombran solo WCAG. Ver{" "}
				<a href="/configuration/engine-options/#other-standards-mappings">Otros estándares</a>.
			</>
		),
	},
	{
		id: "engine.packs",
		field: <code>engine.packs</code>,
		meaning: (
			<>
				Presente solo cuando el análisis se ejecutó con <code>engineOptions.packs</code>: cada pack
				que se ejecutó, como <code>name@version</code>, ordenados por nombre. Ver{" "}
				<a href="/configuration/packs/">Packs</a>.
			</>
		),
	},
	{
		id: "engine.outputDetail",
		field: <code>engine.outputDetail</code>,
		meaning: (
			<>
				Presente solo cuando <code>engineOptions.output.detail</code> es <code>'findings'</code>,
				como <code>"findings"</code>: cada resultado de comprobación <code>pass</code> o{" "}
				<code>notApplicable</code> que no enumera ocurrencias es compacto,{" "}
				<code>{"{ ruleId, outcome, type }"}</code> y su <code>margin</code> o su <code>error</code>{" "}
				cuando lo tiene, sin el título, la descripción ni <code>meta</code>, que son los del
				catálogo e iguales en todas las páginas. Los resultados <code>fail</code> y{" "}
				<code>cantTell</code>, los resultados agregados y <code>engine</code> están completos, así
				que ningún veredicto cambia. Los generadores de informes (SARIF, JUnit, el informe HTML,
				EARL, las funciones de baseline) leen un resultado compacto como el completo, rellenándolo a
				partir del catálogo de core. Un resultado que ese catálogo no podría rellenar se queda
				completo: todos los resultados de comprobación de un análisis con <code>packs</code>, el de
				una regla personalizada, y uno cuyo título o descripción cambiaron los{" "}
				<code>messages</code> del análisis. El resultado de una página vacía pasa de unos 236 KB a
				80 KB.
			</>
		),
	},
	{
		id: "engine.environment",
		field: <code>engine.environment</code>,
		meaning: (
			<>
				Las condiciones en que se renderizó la página, leídas de la página al empezar el análisis,
				antes de que se ejecute ninguna regla. Las reglas que miden el diseño, como{" "}
				<a href="/rules/text-spacing-content-loss/">
					<code>text-spacing-content-loss</code>
				</a>
				, pueden dar otro resultado para el mismo marcado con otro ancho de viewport o mientras las
				fuentes web aún se están cargando, así que esto es lo que necesitas para reproducir una
				ejecución. <code>layout</code> indica si la página tenía diseño: <code>false</code> en jsdom
				y otros emuladores de DOM, y entonces es el único campo. En un navegador,{" "}
				<code>viewport</code> es <code>innerWidth</code>/<code>innerHeight</code> en píxeles CSS,{" "}
				<code>devicePixelRatio</code> el de la página (el zoom del navegador también se refleja
				aquí), <code>colorScheme</code> lo que coincide con <code>prefers-color-scheme</code>, y{" "}
				<code>fonts</code> es <code>"loading"</code> mientras alguna de las fuentes de la página aún
				se está cargando, <code>"loaded"</code> en caso contrario. Un campo que la página no puede
				informar se omite. Leerlos no añade no determinismo: igual que el DOM, son entrada. Para
				obtener resultados que puedas comparar entre ejecuciones, espera a{" "}
				<code>document.fonts.ready</code> antes de analizar. <code>images</code> es{" "}
				<code>"loading"</code> mientras alguna imagen aún se está cargando, <code>"loaded"</code> en
				caso contrario: una imagen que llega más tarde puede mover lo que midieron las reglas de
				diseño, así que, para obtener resultados comparables, analiza después del evento{" "}
				<code>load</code> de la página. Una imagen con <code>loading="lazy"</code> se omite, ya que
				espera a que el lector desplace la página. <code>animationsSettled</code> es cuántas
				animaciones y transiciones en curso detuvo el análisis: durante el análisis, una finita (un
				fundido de entrada) se lee en su final y una que se repite indefinidamente (una marquesina,
				un indicador de carga) en su inicio, y cada una se devuelve exactamente a donde estaba
				después, así que una página analizada durante un fundido de entrada obtiene el mismo
				resultado que una analizada después. El navegador nunca pinta el estado detenido, ya que el
				análisis es una única tarea síncrona. Cada frame de un{" "}
				<a href="#cross-frame-result">resultado entre frames</a> lleva el suyo.
			</>
		),
	},
	{ id: "url", field: <code>url</code>, meaning: <>El argumento <code>pageUrl</code> que pasaste, o <code>document.location.href</code> si pasaste <code>null</code>/lo omitiste (o pasaste algo que no es una cadena, lo que además registra un <code>console.warn</code>), o <code>null</code> si ninguno está disponible.</> },
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
				id: "contextMatch",
				field: <code>contextMatch</code>,
				meaning: (
					<>
						Cómo se resolvió el <code>contextSelector</code>, o <code>null</code> si no se indicó
						ninguno. <code>elementCount</code> es cuántos elementos distintos coincidieron, las raíces
						del análisis. <code>unmatchedSelectors</code> enumera cada selector, tal como lo pasaste, que
						no coincidió con ningún elemento; una cadena separada por comas es aquí un solo selector,
						igual que es una sola llamada a <code>querySelectorAll</code>.{" "}
						<strong>Un <code>elementCount</code> de 0 significa que no se analizó nada</strong>: la
						página no tiene ese ámbito, todas las entradas de <code>checksResults</code> y{" "}
						<code>rulesResults</code> son <code>notApplicable</code>, y el resultado no dice nada sobre
						la página. Infórmalo como un ámbito que no se encontró, no como un análisis sin hallazgos.
						Un selector que el navegador no puede interpretar nunca llega a un resultado: el análisis
						lanza una excepción con <code>code: 'INVALID_CONTEXT_SELECTOR'</code> (ver{" "}
						<a href="/configuration/engine-options/">Opciones del motor</a>).
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
				Una entrada por cada <strong>regla compuesta (resultado agregado)</strong> que se
				ejecutó. Ver <a href="#composite-result">Un resultado compuesto</a> y{" "}
				<a href="/conformance/wcag-mapping/">Conformidad</a>. Normalmente una por criterio de éxito
				de WCAG; una ejecución con el perfil de un estándar que tiene resultados agregados propios
				también los recibe (con <code>meta.standard</code>). Array vacío si ningún compuesto
				coincidió con el filtro <code>runOnly</code>/etiqueta actual.
			</>
		),
	},
	{
		id: "standards",
		field: <code>standards</code>,
		meaning: (
			<>
				Presente solo cuando el resultado nombra un estándar además de WCAG en una entrada de{" "}
				<code>meta.normativeMappings</code> o en el <code>meta.standard</code> de un resultado
				agregado: un <code>{"{ key, standard, titleLang?, note? }"}</code> por cada estándar
				registrado que nombra, incluidos los de un pack, en el orden del registro.{" "}
				<code>key</code> es la clave del estándar (<code>"en301549"</code>), <code>standard</code>{" "}
				el nombre que llevan sus entradas (<code>"EN 301 549"</code>), <code>titleLang</code> el
				idioma en que están escritos los títulos de sus propios resultados agregados cuando no es el
				del análisis, y <code>note</code> el texto que aparece encima de sus propios resultados
				agregados en el informe HTML, en el idioma del análisis. Los generadores de informes lo
				leen en lugar del registro, así que un resultado guardado se muestra igual dondequiera que
				se genere, conozca o no esa instalación el estándar. Un estándar que solo nombra una regla
				personalizada no se incluye.
			</>
		),
	},
	{
		id: "skippedPacks",
		field: <code>skippedPacks</code>,
		meaning: (
			<>
				Presente solo cuando un pack de <code>engineOptions.packs</code> no se ejecutó: cada uno{" "}
				<code>{"{ name, reason }"}</code>, con <code>name</code> igual a <code>null</code> cuando el
				pack no tenía. En una página (<code>runa11yCoreInPage</code>), <code>name</code> es el{" "}
				<code>name@version</code> indicado, y el motivo dice por qué la página no lo ejecutó:
				ninguna llamada a <code>packScript</code> registró exactamente el conjunto nombrado, o el
				script se preparó con otra versión de core. Cada uno se registra también con{" "}
				<code>console.warn</code>.
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
				{
				id: "skippedCustomRules",
				field: <code>skippedCustomRules</code>,
				meaning: (
					<>
						Las entradas de <code>engineOptions.customRules</code> que no se ejecutaron, cada una{" "}
						<code>{"{ id, reason }"}</code> (<code>id</code> es <code>null</code> cuando la entrada no
						tenía): sin id, un <code>runInPage</code> que no es una función o no puede reconstruirse a
						partir de su código fuente, un <code>meta</code> que no supera la validación, un id que ya
						tiene otra regla personalizada, o el id de una regla compuesta; o una regla válida que la
						selección de la ejecución no selecciona (bajo un perfil o un objetivo de WCAG, una regla
						etiquetada como <code>best-practice</code> o sin etiqueta de WCAG), cuyo{" "}
						<code>reason</code> dice cómo seleccionarla. Siempre es un array; vacío
						cuando se ejecutaron todas las reglas personalizadas. Cada una se registra también con{" "}
						<code>console.warn</code>. Una regla listada aquí no aparece en ningún resultado, así que un
						análisis que la dejó fuera se distingue de uno en el que pasó.
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
				Un id, un test id, un <code>name</code> o un <code>aria-label</code> se usa como ancla solo
				cuando ningún otro elemento del documento lo tiene, incluidos los elementos ocultos,
				excluidos y fuera del ámbito, ya que <code>querySelector</code> lo resuelve frente a todo el
				documento; si no, el selector es una ruta. No se garantiza que sea único en todas las
				estructuras de DOM: un elemento dentro de un shadow root se nombra dentro de su propio árbol
				(<code>structuralPath</code> lo sitúa), y la ruta de un elemento muy profundo se acorta desde
				arriba. En 255 páginas de prueba y reales, 15 de 39.857 selectores no nombraron exactamente
				su elemento, todos de esos tipos. La excepción es una regla
				cuyo hallazgo <em>es</em> un elemento ausente: <code>page-title-present</code> devuelve{" "}
				<code>head &gt; title</code> con un <code>html</code> de{" "}
				<code>&lt;title&gt;(missing)&lt;/title&gt;</code>, ninguno de los cuales está en la
				página. Ambos son constantes, así que la huella que alimentan se mantiene estable, pero{" "}
				<strong>no trates <code>selector</code> como resoluble ni <code>html</code> como marcado
				real sin comprobar antes que la regla devolvió algo que existe</strong>. Para un elemento
				dentro de un árbol shadow, <code>selector</code> se resuelve dentro de su shadow root, y{" "}
				<code>shadowHostSelectors</code> indica cómo llegar hasta él.
				</>
				),
				},
				{
				id: "shadowHostSelectors",
				field: <code>shadowHostSelectors</code>,
				meaning: (
					<>
						Presente solo para un elemento dentro de un árbol shadow: los selectores de los shadow
						hosts que llevan hasta él, del más externo al más interno, cada uno resuelto en el árbol
						que lo contiene, de modo que{" "}
						<code>document.querySelector(s[0]).shadowRoot.querySelector(s[1])…shadowRoot.querySelector(selector)</code>{" "}
						encuentra el elemento. Dos componentes con el mismo contenido dan el mismo{" "}
						<code>selector</code> y se distinguen aquí. Como <code>selector</code>, no forma parte de la
						identidad de un hallazgo.
					</>
				),
				},
	{
		id: "html",
		field: <code>html</code>,
		meaning: (
			<>
				Un fragmento de outer-HTML del elemento señalado, cortado a 2.000 caracteres: útil para
				mostrar el elemento y, para un elemento dentro de un árbol shadow, para leerlo junto a{" "}
				<code>shadowHostSelectors</code>. Para <code>&lt;html&gt;</code>,{" "}
				<code>&lt;head&gt;</code> y <code>&lt;body&gt;</code>, que contienen la página entera, es
				solo la etiqueta de apertura (<code>&lt;html class="x"&gt;</code>), así que un hallazgo a
				nivel de página conserva su identidad cuando cambia el resto del contenido.
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
				<em>es</em> <code>documentElement</code>, <code>null</code> si no pudo determinarse, lo que
				incluye todo elemento dentro de un árbol shadow (usa ahí <code>shadowHostSelectors</code> y{" "}
				<code>selector</code>). Un
				mecanismo de identidad de elemento más robusto que <code>selector</code> por sí solo:
				sobrevive a cambios en el DOM que una cadena de selector no soportaría (un cambio de{" "}
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
				es ese resultado (ausente en los hallazgos de nivel de página de{" "}
				<code>bypass-blocks-present</code>, <code>html-lang-attr-present</code> y{" "}
				<code>page-title-present</code>); <code>targetSet</code> indica qué modelo lo produjo (<code>'dom'</code>:
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
				Datos estructurados específicos de la regla (métricas calculadas, referencias resueltas),{" "}
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
				. La página de cada regla enumera los campos que llevan sus hallazgos, en “Qué informa un
				hallazgo”.
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
				<code>outcome</code> del resultado es el nivel de la ocurrencia. El resultado siempre
				concuerda con los niveles: cualquier ocurrencia de nivel <code>fail</code> lo hace{" "}
				<code>fail</code>, y un <code>fail</code> cuyas ocurrencias son todas de nivel{" "}
				<code>cantTell</code> es <code>cantTell</code>, así que SARIF, JUnit, EARL y las líneas base
				dan una sola respuesta. El motor resuelve una regla personalizada o de un pack que los
				devuelve en desacuerdo; con la política predeterminada, una regla manual nunca es{" "}
				<code>fail</code>.
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
	{ id: "fail", outcome: <code>fail</code>, meaning: "La regla informa de que no se cumple el requisito que comprueba. Consulta su mapeo, confianza y ocurrencias para interpretar el hallazgo.", manual: <>No, con la política predeterminada (se fuerza a <code>cantTell</code>)</> },
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
					"    version: string,       // the @surea11y/core release that produced the result",
					"    schemaVersion: string,",
					"    locale: { requested: string, resolved: string, reason: string },",
					'    wcagVersion: "2.0" | "2.1" | "2.2",',
					'    profile?: string,      // "wcag22-aa", "en301549-v4.1.1", "en301549-v3.2.1", "section508", or a registered standard\'s own',
					'    mappings?: string[],   // e.g. ["en301549"] or ["en301549:V3.2.1"]',
					"    profileExcludes?: { rules: string[], criteria: string[] },",
					"    optInRules?: string[],",
					'    outputDetail?: "findings",',
					"    packs?: string[],      // name@version",
					"    environment: {",
					"      layout: boolean,",
					"      viewport?: { width: number, height: number },  // CSS px",
					"      devicePixelRatio?: number,",
					'      colorScheme?: "light" | "dark",',
					'      fonts?: "loaded" | "loading",',
					'      images?: "loaded" | "loading",',
					"      animationsSettled?: number",
					"    }",
					"  },",
					"  url: string | null,",
					"  title: string | null,",
					"  timestamp: string | null,",
					"  perfStats: object | null,",
					"  contextSelector: string | string[] | null,",
					"  contextMatch: { elementCount: number, unmatchedSelectors: string[] } | null,",
					"  checksResults: CheckResult[],",
					"  rulesResults: CompositeResult[],",
					"  standards?: Array<{ key: string, standard: string, titleLang?: string, note?: string }>,",
					"  overriddenBuiltinIds: string[],",
					"  skippedCustomRules: Array<{ id: string | null, reason: string }>,",
					"  skippedPacks?: Array<{ name: string | null, reason: string }>",
					"}",
				]}
			/>
			<DataTable
				label="Campos de nivel superior del resultado"
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
					"    | { url: string | null, selector: string | null, title: string | null,",
					"        topFrame: <top-level result>, frames: [...same shape, recursively] }",
					"    | { url: string | null, selector: string | null, title: string | null, error: string }",
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
					<code>&lt;frame&gt;</code> hijo directo dentro del ámbito analizado (incluidos los shadow
					roots abiertos, y el propio ámbito cuando es un frame), salvo un frame que la página no
					muestra y un frame que <code>excludeSelectors</code> excluye, que quedan fuera con todo su
					documento. Cada entrada nombra su elemento frame: <code>selector</code> es un selector CSS
					del <code>&lt;iframe&gt;</code>/<code>&lt;frame&gt;</code> en el documento del padre, y{" "}
					<code>title</code> es el atributo <code>title</code> del elemento, o <code>null</code>, para
					que se puedan distinguir frames que cargan el mismo documento. <code>url</code> es el
					documento que muestra el frame o, para un frame que aún no ha navegado, su{" "}
					<code>src</code>. Un hijo alcanzable
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
					<li>
						<strong>Los generadores de informes aceptan el árbol tal cual.</strong>{" "}
						<code>renderHtmlReport</code>, <code>renderSarifReport</code>,{" "}
						<code>renderJunitReport</code>, <code>buildBaselineEntries</code>,{" "}
						<code>matchBaseline</code> y <code>renderEarlReport</code> informan de todos sus frames:
						cada frame que respondió, con sus propios hallazgos, ubicados en su propio documento, y
						cada frame que no respondió, como no analizado, para que un hueco en la cobertura no se
						lea como un aprobado. Un frame se nombra por su <strong>ruta</strong>, los{" "}
						<code>selector</code> de los elementos frame que llevan hasta él desde la página, del más
						externo al más interno (<code>#checkout → iframe:nth-of-type(2)</code>). Lanzan un{" "}
						<code>TypeError</code> ante cualquier cosa que no sea ni un resultado de análisis ni un
						resultado entre frames (un array, <code>null</code> o <code>undefined</code> de un
						análisis que falló), en lugar de presentarlo como un análisis que no encontró nada.
					</li>
					<li>
						<strong>También aceptan el análisis de frames de una integración.</strong> El{" "}
						<code>.frames(true)</code> de las integraciones de navegador devuelve{" "}
						<code>{"{ topFrame, frames }"}</code> con cada frame como un resultado simple (o{" "}
						<code>{"{ url, error }"}</code>) en lugar de una entrada anidada; los generadores de
						informes, <code>getMargins</code> y <code>flattenCrossFrameResult</code> leen cada uno de
						esos frames como analizado, nombrado por la ruta <code>['iframe']</code>, ya que no lleva{" "}
						<code>selector</code>.
					</li>
					<li>
						<code>flattenCrossFrameResult(result)</code>, de <code>@surea11y/core</code>, enumera
						los frames tal como los leen los generadores de informes:{" "}
						<code>{"[{ frame: { path, title, url }, result }]"}</code>, o <code>error</code> en lugar
						de <code>result</code> para un frame que no respondió, primero la página y cada frame
						antes de los frames que contiene. El <code>path</code> de la página es <code>[]</code>.
						Un resultado de análisis simple es una sola entrada.
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
					'  ruleSeverity?: "minor" | "moderate" | "serious" | "critical", // the rule\'s own, when a profile gave it another',
					'  policyOutcome?: "pass" | "fail" | "cantTell" | "notApplicable", // what the rule found, when the policy made it cantTell',
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
					"    helpUrl: string,       // where to read how to fix it; \"\" when there is none",
					"    tags: string[],        // the rule's tags, its own and the engine's",
					"    normativeMappings: Array<{ standard: string, version: string, requirement: string, title: string,",
					"      conformanceLevel?: string, wcagSc?: string[], url?: string, understandingUrl?: string }>,",
					"    standard: string | null,",
					"    applicability: string,",
					"    expectation: string,",
					"    references: string[],",
					"    requirements: object | null,",
					"    mappings: object | null",
					"  },",
					"  engineOptions: object,   // the resolved engineOptions this rule actually ran under",
					"  schemaVersion: string,",
					"  rollupIds: string[],     // the rulesResults entries that group this rule in this run; [] if none",
					"  data?: object,           // page-level data a rule reports whatever its outcome; see below",
					"  margin?: {               // the closest a measurement came to its threshold while meeting it; see below",
					'    measure: string,       // "contrast-ratio" | "overflow-px" | "target-size-px" | ... (open set)',
					'    unit: "px" | "ratio",  // open set',
					'    limit: "min" | "max",',
					"    threshold: number,",
					"    value: number,",
					"    headroom: number,      // >= 0",
					"    measuredCount: number,",
					"    selector?: string,",
					"    shadowHostSelectors?: string[],  // as on an occurrence",
					"    structuralPath?: number[],",
					"    context?: object       // rule-specific; not a stable contract",
					"  },",
					"  wcagVersionScope?: {     // present only when the target WCAG version changed this outcome",
					'    target: "2.0" | "2.1" | "2.2",',
					"    removedSc: string[],",
					'    coercedFrom: "fail"',
					"  },",
					"  error?: string           // present when the rule did not complete, or the engine noted a change — see below",
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
					<strong>Con la política predeterminada <code>a11y</code>, las reglas{" "}
					<code>type: "manual"</code> devuelven <code>cantTell</code> en lugar de{" "}
					<code>fail</code>.</strong>{" "}
					Si la lógica propia de una regla manual hubiera dicho <code>fail</code>, el motor la
					fuerza a <code>cantTell</code> y añade una nota explicativa a <code>error</code>: esto
					se aplica de forma centralizada (<code>policy.coerceManualFailToCantTell</code>,
					activado por defecto bajo el contrato de política <code>a11y</code>; consulta{" "}
					<a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a>), no es algo que cada
					regla tenga que recordar por su cuenta. Con esta política, <code>fail</code> está
					reservado únicamente para hallazgos deterministas de <code>type: "automatic"</code>.
				</li>
				<li>
					<strong><code>meta.normativeMappings</code></strong> es cómo un resultado de
					comprobación se vincula de vuelta a un criterio de éxito de WCAG. Una lista vacía
					significa que la regla no tiene un mapeo formal en este resultado. Eso no indica si la
					regla es automática o manual: para eso, lee <code>type</code> (
					<code>aria-allowed-role</code>, por ejemplo, es automática y no tiene mapeo a WCAG).
					Consulta{" "}
					<a href="/conformance/wcag-mapping/">Conformidad</a> para ver cómo se agregan.{" "}
					<strong>La lista no es solo de WCAG.</strong> Cuando el análisis pide otro estándar (
					<code>engineOptions.mappings</code>, o el perfil de un estándar), cada criterio de WCAG va
					seguido del requisito correspondiente de ese estándar, como la cláusula de EN 301 549 que
					lo reformula (
					<code>{'{ standard: "EN 301 549", version: "V3.2.1" | "V4.1.1", requirement: "9.1.1.1", title, wcagSc: ["1.1.1"] }'}</code>
					, una entrada por cada versión que incluye el criterio); y una regla también puede citar los
					documentos Understanding de WCAG (<code>type: "Understanding"</code>). Filtra por{" "}
					<code>standard</code> (y por la ausencia de <code>type</code>) antes de leer{" "}
					<code>requirement</code> como un criterio de éxito. La entrada de WCAG de un compuesto va
					siempre primero. Ver <a href="/conformance/wcag-mapping/#en-301-549">EN 301 549</a>.
				</li>
				<li>
					<strong><code>rollupIds</code></strong> enumera los compuestos de{" "}
					<code>rulesResults</code> que agrupan esta regla en esta ejecución. Una lista vacía
					significa que los hallazgos de la regla no aparecen en ningún resultado agregado, así que
					quien lea solo <code>rulesResults</code> nunca los ve; <code>heading-order</code>, por
					ejemplo, no pertenece a ningún resultado agregado de WCAG.
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
					<strong><code>data</code></strong>: presente solo en una regla que informa algo sobre la
					página entera, sea cual sea su resultado. Ninguna regla de core lo hace hoy. Como{" "}
					<code>data.details</code> en una ocurrencia, no es un contrato estable.
					</li>
					<li id="margin">
						<strong><code>margin</code></strong>: presente solo en una regla que declara uno en el
						catálogo (<code>getChecksCatalog()[i].margin</code>,{" "}
						<code>{"{ measure, unit, limit }"}</code>), cuando al menos un elemento alcanzó el umbral
						de la regla. Indica el elemento que más se acercó al umbral cumpliéndolo, de modo que un{" "}
						<code>pass</code> a 4,52:1 frente a 4,5:1, o a 0,4 px de cortar el texto, se distingue de
						uno holgado. Va junto al resultado y no es un hallazgo: nunca añade, quita ni cambia una
						ocurrencia, y las líneas base, SARIF, JUnit y EARL lo ignoran. También se indica en
						resultados <code>fail</code> y <code>cantTell</code> cuando algunos elementos pasaron.{" "}
						<code>limit</code> es <code>min</code> cuando el valor debe alcanzar el umbral (contraste,
						tamaño) y <code>max</code> cuando debe quedar por debajo (desbordamiento);{" "}
						<code>headroom</code> es cuánto margen queda, en <code>unit</code>, es decir,{" "}
						<code>value - threshold</code> para <code>min</code> y <code>threshold - value</code> para{" "}
						<code>max</code>, nunca negativo. <code>threshold</code> es el umbral con el que se juzgó
						ese elemento, que puede variar entre elementos (3:1 para texto grande). Los píxeles se dan
						con un decimal: los píxeles CSS y umbrales como la mitad de una fuente de 15px son
						fraccionarios, y una interfaz los redondea para las personas. Una razón no se redondea, ya
						que WCAG no redondea el contraste. En caso de empate gana el primer elemento en el orden del
						documento, así que una página da siempre el mismo margen. <code>measure</code> y{" "}
						<code>unit</code> son conjuntos abiertos que pueden crecer en una versión menor;{" "}
						<code>context</code> es específico de cada regla y, como <code>data.details</code>, no es un
						contrato estable. <code>getMargins(result)</code> devuelve todos los márgenes de un
						resultado como <code>{"[{ ruleId, ...margin }]"}</code>, ordenados por <code>ruleId</code>;
						de un resultado entre frames, los de todos los frames, los de un frame hijo con{" "}
						<code>frame</code>, la ruta hasta él.
					</li>
				<li>
					<strong><code>error</code></strong>: presente cuando la regla no terminó, o cuando el
					motor cambió o ignoró parte de lo que devolvió la regla. Una regla que lanzó una excepción
					(o devolvió algo que no es un resultado) siempre aparece como{" "}
					<code>outcome: "cantTell"</code> con <code>occurrences: []</code> y <code>error</code>{" "}
					establecido al mensaje de la excepción, así que <code>cantTell</code> sin ocurrencias y con
					un <code>error</code> es la forma de reconocer una regla que no terminó; el motor nunca
					deja que una regla rota haga fallar todo el análisis. En los demás casos,{" "}
					<code>error</code> contiene las notas del motor, unidas con <code>|</code> después de
					cualquier <code>error</code> que la propia regla devolvió: la coerción de{" "}
					<code>fail</code> manual descrita arriba, un <code>outcome</code> o un{" "}
					<code>severity</code> fuera de su conjunto, un <code>type</code> distinto del de su meta,
					ocurrencias que no son objetos (se dejan fuera), un <code>policyOutcome</code> o un{" "}
					<code>ruleSeverity</code> que devolvió la regla (no se toman: el motor establece ambos), un{" "}
					<code>uncertainty.code</code> fuera del conjunto cerrado, y un <code>fail</code> rebajado a{" "}
					<code>cantTell</code> porque el recorrido de ancestros de 200 pasos se detuvo antes de
					llegar a todos los elementos informados. Esos resultados conservan sus ocurrencias: la
					regla terminó.
				</li>
				<li>
					<strong><code>policyOutcome</code></strong>: presente cuando el{" "}
					<code>allowedOutcomes</code> de la política no permite el resultado que encontró la regla.
					El resultado es entonces <code>cantTell</code>, con el resultado propio de la regla aquí y
					sin <code>error</code>, para que los generadores de informes no lo lean como una regla que
					no terminó.
				</li>
				<li>
					<strong><code>engineOptions</code></strong> en cada resultado es el objeto de opciones{" "}
					<em>resuelto</em> (después de aplicar los valores predeterminados de locale/contrast),
					no literalmente lo que pasaste: útil para confirmar qué vio realmente una regla dada,
					especialmente el <code>locale</code> resuelto y <code>contrast.mode</code>/
					<code>contrast.rootCanvasFallback</code>. Omite <code>messages</code>, los diccionarios con
					los que tradujo la ejecución (un archivo de locale aparte en el paquete para navegador, o tus
					propias cadenas): son datos, no un ajuste, y una copia en cada resultado hacía que un
					análisis ocupara decenas de megabytes. <code>engine.locale</code> indica qué diccionario se
					usó. Otras dos opciones se reflejan tal como las vieron las reglas, para que el resultado
					siga siendo datos simples que <code>JSON.stringify</code> y <code>structuredClone</code>{" "}
					(<code>postMessage</code>) puedan transportar: <code>probes</code> como la copia limitada
					que leen las reglas, y <code>customRules</code> como <code>{"[{ id }]"}</code>, una entrada
					por cada regla personalizada con id, sin sus funciones.
					</li>
			</ul>

			<h2 id="occurrence">Una ocurrencia (<code>occurrences[i]</code>)</h2>
			<p>
				Un <code>fail</code> siempre tiene al menos una: un <code>fail</code> de una regla
				personalizada que no nombra ningún elemento recibe una en el elemento del documento (
				<code>selector: "html"</code>, código de motivo <code>FAIL_WITHOUT_OCCURRENCE</code>).
				Normalmente presente solo cuando <code>outcome</code> es <code>fail</code> o{" "}
				<code>cantTell</code>: un resultado <code>pass</code> tiene <code>occurrences: []</code>,
				ya que este motor no enumera los elementos que pasó, solo los que señaló. Las reglas de
				contraste son la excepción: su <code>pass</code> lleva una ocurrencia que describe el
				análisis (cuánto texto era elegible y calculable), con un <code>selector</code> vacío, para
				que un <code>pass</code> sin texto se distinga de uno sobre una página llena de texto.
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
					"  shadowHostSelectors?: string[],",
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
					"  data?: {               // absent on manual-review's page-level finding",
					"    visibilityFilter?: { eligible?: boolean, targetSet: string, accEligible: boolean | null, reasons: string[] },",
					"    details?: object   // rule-specific, non-normative — see below",
					"  }",
					"}",
				]}
			/>
			<DataTable
				label="Campos de una ocurrencia"
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
				afirmando que la regla decidió y no decidió a la vez, así que el motor la omite. Una
				incertidumbre cuyo <code>code</code> no es uno de los códigos de abajo también se deja
				fuera, y el <code>error</code> de la regla nombra el código.
			</p>
			<DataTable
				label="Códigos de incertidumbre"
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
				ejemplo, <code>wcag-1.1.1-non-text-content</code> agrega 21 reglas atómicas). Con el perfil de un estándar que tiene resultados agregados
				propios, también están esos, con la redacción del estándar como <code>title</code> y su
				nombre como <code>meta.standard</code>. La estructura es
				la misma que la de un resultado de comprobación, con un <code>data.details</code>{" "}
				específico de compuestos:
			</p>
			<CodeBlock
				lines={[
					"{",
					'  ruleId: string,              // e.g. "wcag-1.1.1-non-text-content"',
					'  outcome: "pass" | "fail" | "cantTell" | "notApplicable",',
					"  severity, confidence, type, title, description, meta, engineOptions, schemaVersion,  // as on a check result, except that",
					"                                // meta.normativeMappings names the criterion in a shorter form:",
					"                                // { standard, requirement, level }",
					"  occurrences: [],              // always empty — composites are rollups, not element-level findings",
					"  data: {",
					"    details: {",
					'      reasonCode: string,       // e.g. "composite.rollup.fail.anyFail"',
					"      standard?: string,        // a standard's own rollup only, with version and criterion",
					"      version?: string,",
					"      criterion?: string,",
					"      checksIds: string[],      // every atomic ruleId it rolls up, custom rules mapped to its criteria included",
					"      customChecksIds?: string[], // the custom rules among them; absent when none",
					"      contributors: Array<{ testId: string, outcome: string, severity?: string | null, custom?: true }>,",
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
			<p>
				Las reglas de un resultado agregado de WCAG son su propia lista y cada regla de{" "}
				<code>engineOptions.customRules</code> que se ejecutó y se asocia a uno de sus criterios
				(mediante <code>meta.wcagSc</code> o una entrada de WCAG en{" "}
				<code>meta.normativeMappings</code>), marcada con <code>custom: true</code> entre los
				contribuyentes y enumerada en <code>customChecksIds</code>, para que un lector vea cuándo una
				regla personalizada decidió el resultado. Los resultados agregados propios de un estándar
				conservan sus listas.
			</p>

			<h2>Valores de outcome</h2>
			<DataTable
				label="Valores de outcome"
				rowKey="id"
				columns={[
					{ key: "outcome", label: "Resultado", width: "16%" },
					{ key: "meaning", label: "Significado", wrap: true },
					{ key: "manual", label: '¿Puede aparecer en type: "manual"?', width: "22%" },
				]}
				rows={outcomeRows}
			/>
			<p>
				En las reglas integradas de core, <code>fail</code> es, de forma intencional, el outcome
				más estrecho y de mayor exigencia: reservado para violaciones deterministas y normativas;{" "}
				<strong>la persecución de cobertura de reglas nunca debe diluir esto</strong>.
			</p>

			<h2>Valores de severity y confidence</h2>
			<ul>
				<li>
					<code>severity</code>: <code>minor</code> &lt; <code>moderate</code> &lt;{" "}
					<code>serious</code> &lt; <code>critical</code>: la evaluación del autor de la regla
					sobre el impacto en el usuario, independiente de <code>confidence</code>. Un perfil puede
					dar a una regla otra gravedad (el <code>severity</code> de un perfil en un estándar o en la
					lista de comprobación de un pack): bajo ese perfil, el resultado muestra la del perfil,
					conserva la propia de la regla como <code>ruleSeverity</code> (presente solo entonces), y
					los resultados agregados toman la del perfil.
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
				<code>video-poster-text-alternative-present</code>, <code>target-size-minimum</code> y{" "}
				<code>text-spacing-content-loss</code>.{" "}
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
				<a href="/configuration/engine-options/">Opciones del motor</a>; desde la 1.10.0, un array
				simple de ids de regla hace lo mismo):
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
					'  "contextMatch": null,',
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
					'          "hint": "Give the button visible text, or name it with aria-label, so screen reader users know what it does.",',
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
					'          "summary": "This <img> has no alt attribute.",',
					'          "hint": "Add an alt attribute (use alt=\\"\\" only for decorative images)."',
					"        }",
					"      ]",
					"    }",
					"  ],",
					'  "rulesResults": [],',
					'  "overriddenBuiltinIds": [],',
					'  "skippedCustomRules": []',
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
