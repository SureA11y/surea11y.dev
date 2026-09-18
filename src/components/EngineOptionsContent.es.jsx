import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const optionRows = [
	{
		id: "locale",
		option: <code>locale</code>,
		meaning: (
			<>
				Cualquier cadena. Un código con una subetiqueta recurre primero a su idioma base, así{" "}
				<code>de-DE</code> usa <code>de</code>; si eso falla, inglés. Las cadenas individuales
				luego recurren de la misma manera (configuración regional elegida → <code>en</code> → el
				texto literal en inglés de la regla), por lo que una configuración regional
				parcialmente traducida nunca produce texto faltante. Todo esto es silencioso en las
				propias cadenas, así que el resultado informa lo que realmente ocurrió en{" "}
				<code>engine.locale</code> — compruébalo si necesitas saber si obtuviste el idioma que
				pediste. Consulta <a href="/configuration/locales/">Locales</a>.
			</>
		),
	},
	{
		id: "wcagVersion",
		option: <code>wcagVersion</code>,
		meaning: (
			<>
				<code>'2.0'</code>, <code>'2.1'</code> o <code>'2.2'</code> — qué versión de WCAG está
				probando la conformidad de la ejecución. El valor predeterminado es el que implican tus
				etiquetas de origen de versión, y <code>'2.2'</code> cuando no implican ninguna.{" "}
				<strong>Lo único que cambia actualmente es el SC 4.1.1 Parsing, eliminado en 2.2</strong>:
				bajo un objetivo 2.2, una regla etiquetada{" "}
				<code>wcag22-removed</code> sigue ejecutándose y sigue informando sus ocurrencias, pero
				no puede <code>fail</code> — consulta{" "}
				<a href="#filtering-by-wcag-version">"Filtrado por versión de WCAG"</a> más arriba.
				Cualquier otro valor se ignora y se aplica el valor predeterminado.
			</>
		),
	},
	{
		id: "messages",
		option: <code>messages</code>,
		meaning: (
			<>
				Opcional <code>{"{ [locale]: { key: text } }"}</code>. Se comprueba antes que las
				propias tablas del motor, así que puede sobrescribir cadenas individuales o proporcionar
				un idioma que la compilación no incluye. Las claves que omitas recurren al
				comportamiento normal, así que una sobrescritura parcial está bien. Así es como el
				paquete independiente para navegador recibe un archivo lateral de configuración
				regional, y es la única forma de introducir un diccionario en un contexto de página, ya
				que el ejecutor en la página está serializado y no puede leer archivos. Consulta{" "}
				<a href="/configuration/locales/">Locales</a>.
			</>
		),
	},
	{
		id: "includeHiddenElements",
		option: <code>includeHiddenElements</code>,
		meaning: (
			<>
				Predeterminado <code>false</code>: las consultas auxiliares excluyen elementos ocultos
				por mecanismos estructurales/CSS como <code>display:none</code>, <code>[hidden]</code>,{" "}
				<code>&lt;details&gt;</code> cerrados, y elementos host ocultos de solo renderizado (con
				sus descendientes también excluidos). Configura <code>true</code> para incluir esos
				subárboles ocultos/colapsados en la evaluación (comportamiento heredado/de marcado
				estático).
			</>
		),
	},
	{
		id: "includeShadowDom",
		option: <code>includeShadowDom</code>,
		meaning: (
			<>
				Predeterminado <code>true</code>: las reglas que usan <code>helpers.queryAllSmart</code>{" "}
				atraviesan las raíces shadow abiertas. Configura <code>false</code> para analizar solo
				el DOM ligero (light DOM).{" "}
				<strong>Las raíces shadow cerradas nunca son alcanzables de todos modos</strong> —
				ninguna API del DOM las expone.
			</>
		),
	},
	{
		id: "fragment",
		option: <code>fragment</code>,
		meaning: (
			<>
				Predeterminado <code>false</code>. Un puñado de reglas comprueba la presencia de una
				propiedad que existe una vez por página real — <code>page-title-present</code>,{" "}
				<code>html-lang-attr-present</code>, <code>html-xml-lang-mismatch</code>,{" "}
				<code>aria-hidden-body</code>, <code>css-orientation-lock</code>,{" "}
				<code>meta-refresh-no-exceptions</code>, <code>meta-refresh-timing-absent</code>,{" "}
				<code>meta-viewport-zoom-enabled</code>, <code>meta-viewport-large</code>,{" "}
				<code>page-title-patterns</code>, <code>region</code>,{" "}
				<code>bypass-blocks-present</code>, <code>landmark-one-main</code>,{" "}
				<code>page-has-heading-one</code> — e informa correctamente <code>notApplicable</code>{" "}
				para estas en cuanto <code>contextSelector</code> ha delimitado una ejecución más
				estrecha que el documento completo (<code>document.documentElement</code> ya no está
				entre las raíces resueltas), ya que nunca se esperó que un subárbol delimitado llevara
				su propio{" "}
				<code>&lt;title&gt;</code>/<code>&lt;html lang&gt;</code>/etc. Configura{" "}
				<code>fragment: true</code> para el caso que la delimitación por sí sola no puede
				detectar: un objetivo de análisis que es el documento <em>completo</em> dado pero que
				nunca pretendió representar una página real (por ejemplo, un fragmento de componente
				aislado analizado por sí solo) — esto fuerza la misma{" "}
				<code>notApplicable</code> restringida incluso sin delimitar.
			</>
		),
	},
	{
		id: "excludeSelectors",
		option: <code>excludeSelectors</code>,
		meaning: (
			<>
				Los elementos que coinciden con cualquiera de estos selectores (y sus descendientes) se
				omiten por completo, para <strong>todas</strong> las reglas — útil para banners de
				cookies, contenidos incrustados de terceros, o widgets conocidos por generar ruido que
				no controlas. Para excluir algo de una sola regla específica en su lugar, usa{" "}
				<code>rules[ruleId].excludeSelectors</code> más abajo.
			</>
		),
	},
	{
		id: "timestamp",
		option: <code>timestamp</code>,
		meaning: (
			<>
				Se pasa directamente al campo <code>timestamp</code> de nivel superior del resultado; el
				motor no genera uno por sí mismo (determinista por diseño).
			</>
		),
	},
	{
		id: "contrast-mode",
		option: <code>contrast.mode</code>,
		meaning: (
			<>
				<code>strictConformance</code> (predeterminado): las reglas de contraste permanecen en
				silencio (
				<code>notApplicable</code>/omitidas) cuando el fondo realmente renderizado no se puede
				calcular con confianza, para proteger contra falsos <code>fail</code>.{" "}
				<code>auditorAssist</code>: sacrifica parte de ese margen de seguridad a cambio de más
				hallazgos, pensado para un auditor humano que revisará los casos marcados, no para una
				puerta de CI sin supervisión.
			</>
		),
	},
	{
		id: "contrast-fallback",
		option: <code>contrast.rootCanvasFallback</code>,
		meaning: (
			<>
				El color de fondo de página que se asume cuando no se puede calcular en absoluto — solo
				importa en el modo <code>auditorAssist</code>.
			</>
		),
	},
	{
		id: "visibilityMode",
		option: <code>visibilityMode</code>,
		meaning: (
			<>
				Controla cuán estrictas son las tres reglas de contraste (<code>contrast-minimum</code>,{" "}
				<code>contrast-enhanced</code>, <code>contrast-computable</code>) al decidir si un nodo
				de texto es realmente elegible para comprobar. <strong>No lo lee ninguna otra
				regla.</strong>{" "}
				<code>'styleOnly'</code> (predeterminado): la elegibilidad es solo CSS —{" "}
				<code>display</code>, <code>visibility</code>, <code>opacity</code>, ocultamiento por
				ancestro, etc. <code>'styleAndGeometry'</code>: añade comprobaciones reales de diseño (
				<code>getClientRects()</code>/<code>getBoundingClientRect()</code>) encima de eso — el
				texto sin rects de cliente, o con ancho/alto cero, también se excluye. Recurre a{" "}
				<code>'styleAndGeometry'</code> cuando se ejecuta bajo un navegador real/Playwright-Puppeteer (
				<code>runa11yCoreInPage</code>) y quieres que los hallazgos de contraste reflejen el
				diseño realmente renderizado en lugar de solo el estilo calculado; bajo jsdom puro (
				<code>runDomRulesInPage</code>
				) no hay un motor de diseño real, así que <code>'styleAndGeometry'</code> básicamente
				solo añade comprobaciones de tamaño cero de{" "}
				<code>getBoundingClientRect()</code>, no una detección real de recorte/desbordamiento —
				consulta <a href="/help/known-limitations/">limitaciones conocidas</a>.
			</>
		),
	},
	{
		id: "policyContract",
		option: <code>policyContract</code> ,
		meaning: (
			<>
				Consulta <a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a> — controla qué
				valores de resultado/confianza están permitidos y si los <code>fail</code>{" "}
				que emitirían las reglas manuales se fuerzan a <code>cantTell</code>.
			</>
		),
	},
	{
		id: "output",
		option: (
			<>
				<code>output.includeSelector</code> / <code>.includeHtml</code>
			</>
		),
		meaning: (
			<>
				Suprime el autocompletado automático de <code>selector</code>/<code>html</code> del
				motor. Dado que todas las reglas se migraron para informar su elemento en lugar de
				construir ocurrencias a mano (1.5.0), ese autocompletado es el camino que sigue casi
				todas las 132 reglas del motor: configurar{" "}
				<code>includeSelector: false</code> / <code>includeHtml: false</code> elimina selectores
				y fragmentos de HTML de la gran mayoría de ellas. Un puñado todavía ensambla esos campos
				por sí mismo dentro de <code>runInPage</code> y no se ve afectado — entre ellas{" "}
				<code>contrast-minimum</code>/<code>contrast-enhanced</code> (cuyos hallazgos son
				fragmentos de texto, no elementos), <code>page-title-present</code> e{" "}
				<code>identical-links-same-purpose</code>.{" "}
				<strong>Así que esto reduce sustancialmente la salida pero aún no es una garantía de que{" "}
				<em>no</em>{" "}
				haya selectores ni HTML en ninguna parte del resultado.</strong>
			</>
		),
	},
	{
		id: "rules-ruleId",
		option: <code>rules[ruleId]</code>,
		meaning: (
			<>
				Se pasa a esa regla como <code>ctx.config</code>, y — específicamente para{" "}
				<code>excludeSelectors</code> — el propio motor lo lee antes de que la regla se ejecute.
				Consulta{" "}
				<a href="#rule-scoped-excludeselectors">"excludeSelectors por regla"</a> más abajo.
				Cualquier otra clave es solo de paso: <strong>actualmente ninguna regla distribuida lee{" "}
				<code>ctx.config</code></strong> para nada que no sea <code>excludeSelectors</code>.
			</>
		),
	},
	{
		id: "probes",
		option: <code>probes</code>,
		meaning: (
			<>
				Un objeto de evidencia opcional, seguro para JSON, que tu aplicación anfitriona puede
				proporcionar (con límites de profundidad y tamaño impuestos por el motor antes de que
				las reglas lo vean, vía <code>ctx.inputs.probes</code>) — pensado para futuras reglas
				que puedan aceptar señales suministradas externamente (por ejemplo, mediciones reales de
				diseño que un análisis estático del DOM no puede calcular por sí mismo).{" "}
				<strong>Ninguna regla actual lo consume.</strong>
			</>
		),
	},
	{
		id: "perfStats",
		option: (
			<>
				<code>perfStats</code> / <code>profileRules</code>
			</>
		),
		meaning: (
			<>
				Solo para depuración. <code>perfStats: true</code> devuelve contadores internos en el
				campo <code>perfStats</code> del resultado; <code>profileRules: true</code>{" "}
				<strong>además</strong>{" "}
				añade allí un desglose de tiempos por regla. <code>profileRules</code> por sí solo no
				hace nada — <code>perfStats</code> es lo que crea el objeto donde vive el desglose.{" "}
				<strong>La forma no es parte del contrato de salida estable — no construyas nada sobre
				ella.</strong> Ten en cuenta también que{" "}
				<code>profileRules</code> es la única opción que hace que la salida sea no determinista:
				los contadores son estables entre ejecuciones idénticas, los tiempos de reloj no lo son.
				Déjala desactivada si comparas resultados entre ejecuciones.
			</>
		),
	},
	{
		id: "frameWaitTime",
		option: (
			<>
				<code>pingWaitTime</code> / <code>frameWaitTime</code>
			</>
		),
		meaning: (
			<>
				Solo lo lee <code>runa11yCoreAcrossFrames</code> (consulta{" "}
				<a href={`${core}/docs/INTEGRATION.md#cross-frame-scanning-including-cross-origin`}>
					<code>INTEGRATION.md</code>
				</a>
				) — cuánto tiempo esperar a que un frame hijo responda a un ping (predeterminado{" "}
				<code>500</code>ms) y a una solicitud de ejecución completa (predeterminado{" "}
				<code>60000</code>ms) antes de tratarlo como inalcanzable. Lo ignoran{" "}
				<code>runDomRulesInPage</code>/<code>runa11yCoreInPage</code>.
			</>
		),
	},
];

export function EngineOptionsContent() {
	return (
		<>
			<p>
				Todos los ejecutores (<code>runDomRulesInPage</code>, <code>runa11yCoreInPage</code>)
				reciben los mismos cuatro argumentos:{" "}
				<code>(pageUrl, contextSelector, engineOptions, runOnly)</code>. Esta página documenta{" "}
				<code>engineOptions</code> y <code>runOnly</code> en su totalidad.
			</p>

			<h2>Seleccionar qué reglas se ejecutan</h2>
			<p>
				Hay <strong>dos formas independientes</strong> de seleccionar reglas — el cuarto
				argumento (
				<code>runOnly</code>), o <code>engineOptions.rules</code>/<code>.tags</code>/
				<code>.tests</code>/<code>.includeMode</code>. Si <code>runOnly</code> contiene algún
				filtro, gana directamente; de lo contrario, el motor recurre a{" "}
				<code>engineOptions</code>.{" "}
				<strong>No los mezcles esperando que ambos se apliquen — elige uno.</strong>
			</p>

			<h3>Mediante <code>runOnly</code> (4.º argumento)</h3>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {}, {",
					"  includeRuleIds: ['img-alt-present', 'button-name-present'],",
					"  excludeRuleIds: ['region'],",
					"  tags: ['wcag412'],",
					"  excludeTags: ['best-practice'],",
					"  includeMode: 'and'   // 'and' (default) | 'or' — see below",
					"});",
				]}
			/>
			<p>
				<strong><code>runOnly</code> debe tener esta forma de objeto, no ser un array
				simple.</strong>{" "}
				<code>runOnly: ['img-alt-present']</code> (un array simple) se{" "}
				<strong>ignora silenciosamente</strong>; el motor ejecuta todas las reglas en su lugar.
				Este es el error de integración más común con diferencia — consulta{" "}
				<a href="/help/faq/">las preguntas frecuentes</a>.
			</p>
			<DataTable
				rowKey="field"
				columns={[
					{ key: "field", label: "Campo", width: "22%" },
					{ key: "type", label: "Tipo", width: "16%" },
					{ key: "meaning", label: "Significado", wrap: true },
				]}
				rows={[
					{ field: <code>includeRuleIds</code>, type: <code>string[]</code>, meaning: "Ejecuta solo estos IDs de regla (además, para un ID compuesto, sus reglas atómicas hijas)." },
					{ field: <code>excludeRuleIds</code>, type: <code>string[]</code>, meaning: "Nunca ejecuta estos, se aplica después de la inclusión." },
					{
						field: (
							<>
								<code>includeTestIds</code> / <code>excludeTestIds</code>
							</>
						),
						type: <code>string[]</code>,
						meaning: 'Misma coincidencia que arriba — se mantiene como un campo separado porque las reglas se llaman internamente "tests" (la unidad ejecutable atómica); funcionalmente idéntico a includeRuleIds/excludeRuleIds hoy en día.',
					},
					{ field: <code>tags</code>, type: <code>string[]</code>, meaning: "Ejecuta solo las reglas que llevan al menos una de estas etiquetas (por ejemplo, wcag412, wcag2aa, best-practice)." },
					{ field: <code>excludeTags</code>, type: <code>string[]</code>, meaning: "Nunca ejecuta reglas que lleven cualquiera de estas etiquetas, se aplica después de la inclusión." },
					{
						field: <code>includeMode</code>,
						type: (
							<>
								<code>'and'</code> | <code>'or'</code>
							</>
						),
						meaning: "Cuando se dan tanto una inclusión de ID como una de etiqueta: 'and' (predeterminado) requiere que una regla satisfaga ambas; 'or' ejecuta una regla si satisface cualquiera de las dos. Irrelevante si solo usas una dimensión.",
					},
				]}
			/>
			<p>
				Cada uno de estos acepta un array o una cadena separada por comas, igual que la forma de{" "}
				<code>engineOptions</code> de más abajo — <code>includeRuleIds: 'img-alt-present, button-name-present'</code>{" "}
				y <code>includeRuleIds: ['img-alt-present', 'button-name-present']</code> son
				equivalentes.
			</p>
			<p>
				Los IDs de regla van sin prefijo (sin prefijo del motor), por ejemplo{" "}
				<code>'img-alt-present'</code>. Por compatibilidad con versiones anteriores, la
				coincidencia también acepta una forma heredada con el prefijo <code>a11ycore-</code> del
				mismo id (<code>'a11ycore-img-alt-present'</code>).
			</p>
			<p>
				También se acepta una <strong>forma heredada de filtro por etiqueta</strong> como valor
				completo de{" "}
				<code>runOnly</code>: <code>{"{ type: 'tag', values: ['wcag2a', 'wcag2aa'] }"}</code>{" "}
				— equivalente a <code>{"{ tags: ['wcag2a', 'wcag2aa'] }"}</code>.
			</p>

			<h3 id="filtering-by-wcag-version">Filtrado por versión de WCAG (2.0, 2.1, 2.2)</h3>
			<p>
				Cada regla y compuesto lleva exactamente una etiqueta de nivel de versión de origen de
				WCAG:{" "}
				<code>wcag2a</code>/<code>wcag2aa</code>/<code>wcag2aaa</code> para un Criterio de Éxito
				que sea línea base de WCAG 2.0, <code>wcag21a</code>/<code>wcag21aa</code>/<code>wcag21aaa</code>{" "}
				para uno introducido recientemente en WCAG 2.1 (por ejemplo, <code>1.3.5</code> Identify
				Input Purpose),{" "}
				<code>wcag22a</code>/<code>wcag22aa</code>/<code>wcag22aaa</code> para uno introducido
				recientemente en WCAG 2.2 (por ejemplo, <code>2.5.8</code> Target Size Minimum). Una
				regla obtiene{" "}
				<strong>solo</strong> la etiqueta de la versión de origen real de su SC — un SC
				introducido en 2.1 nunca lleva también la etiqueta <code>wcag2aa</code>, ya que no
				existe bajo un objetivo de conformidad de WCAG 2.0.
			</p>
			<p>
				Dado que las versiones son acumulativas (2.1 = 2.0 + nuevo; 2.2 = 2.0 + 2.1 + nuevo),
				selecciona un objetivo de conformidad de versión de WCAG combinando conjuntos de
				etiquetas — la coincidencia OR del motor sobre{" "}
				<code>tags</code> (cualquier coincidencia incluye la regla) hace el resto:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.0 AA only (excludes every 2.1/2.2-introduced SC, even at level AA):",
					"{ tags: ['wcag2a', 'wcag2aa'] }",
					"",
					"// WCAG 2.1 AA conformance (2.0 baseline + everything 2.1 added, both at A and AA):",
					"{ tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }",
					"",
					"// WCAG 2.2 AA conformance (2.0 baseline + 2.1 additions + 2.2 additions):",
					"{ tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'] }",
					"",
					"// Just the SCs 2.2 introduced, nothing else:",
					"{ tags: ['wcag22a', 'wcag22aa', 'wcag22aaa'] }",
				]}
			/>
			<p>
				<strong>Un SC va en sentido contrario.</strong> WCAG 2.2 eliminó el SC 4.1.1 Parsing —
				el único criterio que se ha eliminado alguna vez en lugar de añadirse. Una regla mapeada
				a él lleva su etiqueta de origen 2.0 (
				<code>wcag2a</code>) como cualquier otra regla de línea base, más{" "}
				<code>wcag22-removed</code>, y por eso los conjuntos de etiquetas de versión de arriba
				la incluyen bajo un objetivo 2.2, donde no pertenece.
			</p>
			<p>
				No tienes que hacer nada al respecto. El motor resuelve una{" "}
				<strong>versión objetivo de WCAG</strong> para cada ejecución y, cuando ese objetivo es
				2.2, una regla{" "}
				<code>wcag22-removed</code> no puede informar <code>fail</code>: sigue
				ejecutándose, sigue informando cada ocurrencia que encontró, pero su resultado se fuerza
				a <code>cantTell</code> y el resultado lleva un campo <code>wcagVersionScope</code> que
				explica por qué (consulta{" "}
				<a href="/results-reports/output-schema/">el esquema de salida</a>). Nada se descarta
				silenciosamente, y una ejecución 2.2 no queda bloqueada por un criterio que 2.2 no
				contiene.
			</p>
			<p>La versión objetivo se resuelve en este orden:</p>
			<ol>
				<li>
					<code>engineOptions.wcagVersion</code> — <code>'2.0'</code>, <code>'2.1'</code> o{" "}
					<code>'2.2'</code>, si lo configuras.
				</li>
				<li>
					Las etiquetas de origen de versión en tu propio filtro: un conjunto que llega como
					máximo hasta{" "}
					<code>wcag21a</code>/<code>wcag21aa</code> se interpreta como objetivo 2.1, uno que
					contiene cualquier{" "}
					<code>wcag22*</code> etiqueta como 2.2, uno con solo etiquetas <code>wcag2*</code>{" "}
					como 2.0. Solo cuentan esas nueve etiquetas — una etiqueta de SC (
					<code>wcag411</code>) o <code>best-practice</code>{" "}
					no dice nada sobre una versión.
				</li>
				<li>
					En caso contrario <code>'2.2'</code>, el objetivo predeterminado de este motor.
				</li>
			</ol>
			<CodeBlock
				lang="js"
				lines={[
					"// Nothing to declare: a plain run already targets 2.2, so a duplicate id",
					"// comes back cantTell rather than fail.",
					"runDomRulesInPage(url, null, {}, null);",
					"",
					"// Conformance-testing against 2.1, where SC 4.1.1 still exists:",
					"runDomRulesInPage(url, null, { wcagVersion: '2.1' }, null);",
					"",
					"// Same thing, implied by the tag set — no extra option needed:",
					"runDomRulesInPage(url, null, {}, { tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] });",
				]}
			/>
			<p>
				El objetivo resuelto se informa de vuelta en cada resultado como{" "}
				<code>engine.wcagVersion</code>, así puedes confirmar cuál usó realmente una ejecución.
			</p>
			<p>
				Si prefieres no ver la regla en absoluto bajo 2.2, exclúyela directamente — la etiqueta
				está ahí precisamente para eso:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.2 AA conformance, with the removed criterion left out entirely:",
					"{",
					"  tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'],",
					"  excludeTags: ['wcag22-removed']",
					"}",
				]}
			/>
			<p>
				<code>duplicate-id</code> es la única regla que lleva esa etiqueta hoy en día. Si se
				deja, sigue informando algo real — un id duplicado rompe <code>&lt;label for&gt;</code>,
				los enlaces de fragmento y <code>getElementById</code> diga lo que diga el estándar —
				simplemente no es un fallo de conformidad 2.2.
			</p>

			<h3>Mediante <code>engineOptions</code> (sin <code>runOnly</code>)</h3>
			<p>El mismo filtrado, expresado como cadenas separadas por comas (o arrays) anidadas en <code>engineOptions</code>:</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
					"  rules: { include: 'img-alt-present, button-name-present', exclude: 'region' },",
					"  tags: { include: 'wcag412', exclude: 'best-practice' },",
					"  includeMode: 'and'",
					"}, null);",
				]}
			/>
			<p>
				<code>rules.include</code>/<code>.exclude</code>, <code>tags.include</code>/
				<code>.exclude</code>, <code>tests.include</code>/<code>.exclude</code> (alias de{" "}
				<code>rules</code>), y el <code>includeMode</code> de nivel superior reflejan
				exactamente los campos de <code>runOnly</code>{" "}
				de arriba. Las cadenas separadas por comas se recortan, se eliminan duplicados y los
				tokens vacíos se descartan automáticamente.
			</p>

			<h2><code>engineOptions</code> — el resto</h2>
			<CodeBlock
				lang="js"
				lines={[
					"const engineOptions = {",
					"  locale: 'en',                    // default 'en'; de-DE falls back to de, then to en per string",
					"  wcagVersion: '2.2',              // default '2.2' — the conformance target",
					"  messages: { de: { /* key: text */ } },  // optional caller-supplied dictionaries; win over built-in ones",
					"  includeHiddenElements: false,    // default false — set true to evaluate hidden/collapsed subtrees too",
					"  includeShadowDom: true,          // default true — opt OUT with false to skip open shadow roots",
					"  fragment: false,                 // default false — set true when the scan target isn't a real page",
					"  excludeSelectors: ['#cookie-banner', '.third-party-widget'],  // array or comma-separated string",
					"  timestamp: '2026-07-20T12:00:00Z',  // optional — engine has no built-in clock",
					"  perfStats: false,                // default false — internal timing counters, debug-only shape",
					"  profileRules: false,             // default false — per-rule timings; needs perfStats",
					"",
					"  contrast: {",
					"    mode: 'strictConformance',     // 'strictConformance' (default) | 'auditorAssist'",
					"    rootCanvasFallback: '#ffffff'  // background assumed when the true root background isn't computable",
					"  },",
					"  visibilityMode: 'styleOnly',     // 'styleOnly' (default) | 'styleAndGeometry' — scoped to the contrast rules only",
					"",
					"  policyContract: 'a11y',          // 'a11y' (default) | 'generic' | inline contract object",
					"  policy: {                        // optional overrides on top of policyContract",
					"    coerceManualFailToCantTell: true",
					"  },",
					"",
					"  output: {",
					"    includeSelector: true,         // set false to suppress auto-filled selectors",
					"    includeHtml: true",
					"  },",
					"",
					"  rules: {",
					"    'some-rule-id': {",
					"      excludeSelectors: ['.some-noisy-widget']  // narrows candidates for THIS rule only",
					"    }",
					"  },",
					"",
					"  probes: { /* optional host-supplied evidence */ },",
					"",
					"  customRules: [ /* runtime-registered rules, see below */ ],",
					"",
					"  // Only read by runa11yCoreAcrossFrames. Ignored by runDomRulesInPage/runa11yCoreInPage.",
					"  pingWaitTime: 500,               // ms to wait for a child frame to answer a ping",
					"  frameWaitTime: 60000             // ms to wait for a child frame's full scan result",
					"};",
				]}
			/>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "option", label: "Opción", width: "22%" },
					{ key: "meaning", label: "Significado", wrap: true },
				]}
				rows={optionRows}
			/>

			<h3 id="rule-scoped-excludeselectors"><code>excludeSelectors</code> por regla</h3>
			<p>
				El <code>excludeSelectors</code> de nivel superior se aplica a <em>todas</em> las reglas
				— no hay forma de excluir un elemento de una sola regla mientras se siguen ejecutando
				todas las demás reglas sobre él. <code>rules[ruleId].excludeSelectors</code> llena ese
				vacío: reduce los candidatos para{" "}
				<strong>solo esa regla</strong>, además de (nunca en lugar de) la lista global.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const engineOptions = {",
					"  excludeSelectors: ['#cookie-banner'],   // applies to every rule, as always",
					"  rules: {",
					"    'aria-required-children': {",
					"      excludeSelectors: ['mat-select', 'mat-stepper', 'mat-horizontal-stepper', 'mat-vertical-stepper']",
					"    },",
					"    'aria-allowed-attr': {",
					"      excludeSelectors: ['mat-progress-spinner']",
					"    }",
					"  }",
					"};",
				]}
			/>
			<p>
				Por qué querrías esto: el <code>&lt;mat-select&gt;</code> de Angular Material construye
				su estructura ARIA interna de una manera que dispara un falso positivo específicamente
				en <code>aria-required-children</code>, aunque el componente por lo demás esté bien. Con
				solo el <code>excludeSelectors</code> global, la única forma de silenciar ese falso
				positivo es <code>excludeSelectors: ['mat-select']</code> — lo cual también oculta{" "}
				<code>mat-select</code> a <em>todas las demás reglas</em>, incluidas{" "}
				<code>contrast-minimum</code> y <code>aria-allowed-attr</code>, eliminando
				silenciosamente cobertura real con la que esas comprobaciones nunca tuvieron problema.
				El ejemplo de arriba mantiene{" "}
				<code>mat-select</code> completamente visible para todas las reglas excepto la que falla
				incorrectamente con él.
			</p>
			<p>
				Las exclusiones efectivas para una regla dada son la <strong>unión</strong> de la lista
				global y la lista propia de esa regla — un elemento que coincide con cualquiera de las
				dos se elimina de los candidatos de esa regla. Una regla cuyos únicos elementos que
				fallarían quedan todos excluidos de esta manera informa{" "}
				<code>outcome: 'pass'</code> o <code>'notApplicable'</code> (siguiendo la convención
				propia de esa regla para el caso sin candidatos), con <code>occurrences: []</code> —
				nunca{" "}
				<code>outcome: 'fail'</code> con un array <code>occurrences</code> vacío, ya que esa
				forma exacta está reservada en otra parte del esquema para significar "esta regla lanzó
				un error" (consulta{" "}
				<a href="/results-reports/output-schema/">el esquema de salida</a>).
			</p>
			<p>
				Acepta las mismas formas que la opción global: un array (
				<code>['mat-select', 'mat-stepper']</code>) o una cadena separada por comas (
				<code>'mat-select, mat-stepper'</code>).
			</p>
			<p>
				Si estás usando un paquete de binding (<code>@surea11y/binding-base</code> y sus
				wrappers de Playwright/Puppeteer), consulta el propio README de ese binding para ver si
				su método constructor{" "}
				<code>.exclude()</code> ya tiene una forma por regla — esta es una forma de{" "}
				<code>engineOptions</code> documentada aquí a nivel del motor; no todos los bindings la
				han incorporado todavía.
			</p>

			<h2>Recetas — combinar opciones para escenarios reales</h2>
			<p>
				<strong>Puerta de CI: solo WCAG 2.2 AA, ignorando un widget de terceros que no
				controlas</strong>
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
					"  excludeSelectors: ['#cookie-banner', '.intercom-launcher'],",
					"  tags: { include: 'wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22a,wcag22aa' }",
					"}, null);",
				]}
			/>
			<p>
				<strong>Auditor humano haciendo una pasada de contraste en profundidad en un navegador
				real</strong> — sacrifica algo de protección contra falsos positivos a cambio de más
				hallazgos, y comprueba el diseño real (no solo el estilo calculado) ya que se está
				controlando una página real. Se muestra con el <code>page.evaluate</code> de Puppeteer
				(acepta múltiples argumentos); si estás en Playwright, primero envuelve los cuatro
				argumentos posicionales en un solo objeto — consulta{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const result = await page.evaluate(runa11yCoreInPage, url, null, {",
					"  contrast: { mode: 'auditorAssist' },",
					"  visibilityMode: 'styleAndGeometry'",
					"}, null);",
				]}
			/>
			<p>
				<strong>Reanálisis delimitado de una región tras un cambio de interfaz, omitiendo el
				shadow DOM</strong> — útil en un test a nivel de componente donde solo te importa el
				widget que acabas de cambiar:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, '#checkout-form', {",
					"  includeShadowDom: false",
					"}, { includeRuleIds: ['form-control-programmatic-label-present', 'button-name-present'] });",
				]}
			/>
			<p>
				<strong>Salida reproducible para testing de snapshot</strong> — fija un{" "}
				<code>timestamp</code>{" "}
				para que dos ejecuciones del mismo HTML produzcan un JSON idéntico byte a byte, y
				solicita el desglose de tiempos de depuración:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
					"  timestamp: '2026-01-01T00:00:00Z',",
					"  perfStats: true,",
					"  profileRules: true",
					"}, null);",
				]}
			/>
			<p>
				<strong>Una regla personalizada, específica de la organización, junto a las
				integradas</strong>, solo para esta llamada:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
					"  customRules: [{",
					"    id: 'org-no-inline-onclick',",
					"    meta: { title: 'No inline onclick handlers', defaultSeverity: 'moderate' },",
					"    runInPage(ctx) {",
					"      const els = ctx.helpers.queryAll('[onclick]');",
					"      const occurrences = els.map((el) => ({",
					"        selector: ctx.helpers.buildSelector(el),",
					"        html: el.outerHTML,",
					"        summary: 'Inline onclick handler found.',",
					"        hint: 'Move event handling into an external script.'",
					"      }));",
					"",
					"      return { ruleId: ctx.rule.ruleId, outcome: occurrences.length ? 'fail' : 'pass', severity: 'moderate', occurrences };",
					"    }",
					"  }]",
					"}, null);",
				]}
			/>

			<h2><code>customRules</code> — reglas registradas en tiempo de ejecución</h2>
			<p>
				Todas las reglas distribuidas están incorporadas en <code>src/core.js</code> en tiempo
				de compilación. <code>engineOptions.customRules</code> es la vía de escape en tiempo de
				ejecución: un array de descriptores de regla registrados solo para esa llamada — no se
				añade nada al catálogo estático, y nada persiste entre llamadas. Esto es deliberado, no
				una limitación que sortear: surea11y ya toma <code>engineOptions</code> nuevas en cada
				llamada sin configuración global mutable (a diferencia de otros motores, que necesitan
				un paso de <code>configure()</code>/<code>reset()</code> sobre un runtime compartido), y
				las reglas personalizadas siguen ese mismo modelo por llamada.
			</p>
			<p>
				Llamar a la biblioteca directamente es una forma de acceder; la CLI también expone esto
				vía <code>--custom-rules &lt;path&gt;</code> (un archivo local, cargado una vez por
				análisis) — consulta{" "}
				<a href="https://github.com/SureA11y/cli/blob/main/docs/CLI.md#custom-rules">
					la documentación de la CLI
				</a>
				.
			</p>
			<p>
				Un descriptor tiene la <em>misma forma que la propia exportación de un módulo de regla
				interno</em> — si ya sabes cómo escribir un archivo de regla para este motor, ya conoces
				esta API:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"{",
					"  id: 'my-org-custom-rule',          // required",
					"  meta: { title, description, tags, defaultSeverity, defaultConfidence, /* same fields as a rule module's meta */ },",
					"  runInPage(ctx) { /* same ctx shape and same return contract as any built-in rule */ },",
					"  applicability(ctx) { return true; }, // optional, same contract as a built-in rule's applicability",
					"  data: { /* optional, JSON-serializable */ }",
					"}",
				]}
			/>
			<ul>
				<li>
					<code>runInPage</code>/<code>applicability</code> puede ser una{" "}
					<strong>función real</strong> o una{" "}
					<strong>cadena con el código fuente de la función</strong> (es decir,{" "}
					<code>fn.toString()</code>). Pasa una función real cuando <code>engineOptions</code>{" "}
					nunca sale del ámbito de JS actual (uso normal en Node/jsdom). Pasa una cadena cuando
					sí lo hace — por ejemplo, una llamada de Playwright{" "}
					<code>page.evaluate(runa11yCoreInPage, {"{ engineOptions }"})</code>, donde{" "}
					<code>engineOptions</code> cruza un límite de JSON/clonación estructurada que no
					puede llevar una referencia <code>Function</code> viva pero sí puede llevar una
					cadena. El motor reconstruye una cadena vía <code>new Function</code>, el mismo
					mecanismo que usa la compilación para incrustar el código fuente de cada regla
					integrada en el ejecutor dentro de la página.
				</li>
				<li>
					<code>meta</code> recibe los mismos valores predeterminados/validación que una regla
					en tiempo de compilación — omite lo que no necesites; <code>severity</code> tiene
					como predeterminado <code>moderate</code>, <code>confidence</code> tiene como
					predeterminado{" "}
					<code>medium</code>, <code>type</code> tiene como predeterminado{" "}
					<code>automatic</code>, etc.
				</li>
				<li>
					Una regla personalizada cuyo <code>id</code> coincide con el de una regla integrada{" "}
					<strong>la sobrescribe para ese análisis</strong>, en lugar de ejecutar ambas. Dado
					que una regla personalizada con el mismo nombre es tan probable que sea una colisión
					accidental como una sobrescritura deliberada, cada colisión se muestra de dos formas:
					un <code>console.warn</code> que nombra el/los id(s), y un array{" "}
					<code>overriddenBuiltinIds</code> de nivel superior en el resultado (vacío cuando no
					hay colisión) — consulta <a href="/results-reports/output-schema/">el esquema de
					salida</a>.
				</li>
				<li>
					Un descriptor inválido (<code>id</code> ausente/no-string, o un{" "}
					<code>runInPage</code>{" "}
					que no es una función ni una cadena de código fuente reconstruible) se omite
					silenciosamente — el resto del análisis, incluidas todas las reglas integradas, sigue
					ejecutándose con normalidad. Esto no es un vacío de validación por corregir: una
					regla personalizada es código arbitrario proporcionado por quien la llama, así que
					"fallar cerrado en esta sola entrada, sin abortar el análisis" es el comportamiento
					predeterminado más seguro, reflejando cómo una{" "}
					<em>regla integrada</em> que lanza un error queda contenida en un{" "}
					<code>cantTell</code> para esa regla en lugar de hacer fallar toda la ejecución.
				</li>
				<li>
					Los resultados aparecen en <code>checksResults</code> exactamente igual que los de
					cualquier otra regla, incluido el autocompletado automático de{" "}
					<code>selector</code>/<code>html</code>/<code>structuralPath</code> para ocurrencias{" "}
					<code>fail</code>/<code>cantTell</code> que solo adjuntan{" "}
					<code>{"{ __node }"}</code> (consulta <a href="/results-reports/output-schema/">el
					esquema de salida</a>).
				</li>
			</ul>

			<h2><code>contextSelector</code> (2.º argumento del ejecutor, no un campo de <code>engineOptions</code>)</h2>
			<p>
				Un selector CSS (o array de selectores) que delimita el análisis a uno o más subárboles,
				resuelto vía <code>document.querySelectorAll</code> (todas las coincidencias, no solo la
				primera), recurriendo a <code>document.documentElement</code>/<code>document.body</code>{" "}
				si nada coincide. Pasa <code>null</code> para analizar todo el documento.
			</p>
			<ul>
				<li>
					<strong>Una sola cadena</strong> puede ser en sí misma una lista de selectores
					separados por comas (semántica de unión CSS habitual) —{" "}
					<code>'#a, #b'</code> analiza tanto <code>#a</code> como{" "}
					<code>#b</code>.
				</li>
				<li>
					<strong>Un array de cadenas</strong> analiza la unión de las coincidencias de cada
					selector —{" "}
					<code>['#a', '.card']</code> se comporta igual que <code>'#a, .card'</code>; la forma
					de array existe para quienes construyen la lista de forma programática.
				</li>
				<li>
					Las regiones superpuestas/anidadas se deduplican automáticamente — un elemento
					alcanzable desde más de una raíz coincidente solo se informa una vez, no una vez por
					región.
				</li>
			</ul>
		</>
	);
}
