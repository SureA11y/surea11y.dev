import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { Callout } from "./design-system/feedback/Callout.jsx";

const core = "https://github.com/SureA11y/core/blob/main";
const pack = "/configuration/packs/#en-301-549-pack";

const optionRows = [
	{
		id: "strictOptions",
		option: <code>strictOptions</code>,
		meaning: (
			<>
				Predeterminado <code>false</code>. <code>true</code> comprueba todas las opciones antes del
				análisis, y lanza <code>INVALID_ENGINE_OPTIONS</code> ante una clave que el motor no lee o
				un valor de tipo incorrecto o fuera de su conjunto; consulta{" "}
				<a href="#catching-mistakes-in-the-options-strictoptions">"Detectar errores en las opciones"</a>{" "}
				más abajo.
			</>
		),
	},
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
				<code>engine.locale</code>: compruébalo si necesitas saber si obtuviste el idioma que
				pediste. Consulta <a href="/configuration/locales/">Configuración regional</a>.
			</>
		),
	},
	{
		id: "wcagVersion",
		option: <code>wcagVersion</code>,
		meaning: (
			<>
				<code>'2.0'</code>, <code>'2.1'</code> o <code>'2.2'</code>: qué versión de WCAG está
				probando la conformidad de la ejecución. El valor predeterminado es la versión que nombra
				el perfil de pack de la ejecución (su <code>wcagVersion</code>); si no, la que implican tus
				etiquetas de origen de versión, y <code>'2.2'</code> cuando no implican ninguna.{" "}
				Lo que cambia es qué criterios informa un análisis y, para el criterio de éxito 4.1.1{" "}
				<span lang="en">Parsing</span>, por qué una regla etiquetada <code>wcag22-removed</code> no
				puede dar <code>fail</code>: se eliminó en 2.2, y las erratas de 2.0 y 2.1 lo dan siempre
				por cumplido, salvo con un perfil cuyo estándar lo mantiene, como{" "}
				<code>en301549-v3.2.1</code>. Consulta{" "}
				<a href="#filtering-by-wcag-version">"Filtrado por versión de WCAG"</a> más arriba.
				Cualquier otro valor, de cualquier tipo (el número <code>2.1</code>, <code>'3.0'</code>), se
				ignora con un <code>console.warn</code> que nombra la versión a la que apunta la ejecución
				en su lugar.
			</>
		),
	},
	{
		id: "wcagLevel",
		option: <code>wcagLevel</code>,
		meaning: (
			<>
				Opcional: <code>'A'</code>, <code>'AA'</code> o <code>'AAA'</code>, en mayúsculas o
				minúsculas: el nivel de WCAG de los criterios que informa una ejecución. Los resultados
				agregados de WCAG por encima de él quedan fuera de <code>rulesResults</code> mientras sus
				reglas se siguen ejecutando; nunca cambia lo que se ejecuta. Gana al nivel que implica la
				selección; un resultado agregado nombrado por id se informa tal como se nombró. Se
				devuelve como <code>engine.wcagLevel</code>, que sin la opción contiene el nivel que
				implica la selección, si implica alguno. Cualquier otro valor se ignora con un{" "}
				<code>console.warn</code>, y lanza un error con <code>strictOptions</code>. Consulta{" "}
				<a href="#giving-the-level-of-a-scan-that-names-checks-wcaglevel">
					"Indicar el nivel de un análisis que nombra comprobaciones"
				</a>{" "}
				más arriba.
			</>
		),
	},
	{
		id: "profile",
		option: <code>profile</code>,
		meaning: (
			<>
				Objetivo de conformidad con nombre, opcional: <code>'wcag22-a'</code>,{" "}
				<code>'wcag22-aa'</code>, <code>'wcag22-aaa'</code>, <code>'en301549-v4.1.1'</code>,{" "}
				<code>'en301549-v3.2.1'</code>, <code>'section508'</code> o uno propio de un pack; o una
				lista de ellos, para un análisis de varios perfiles a la vez. Selecciona reglas por el
				conjunto de etiquetas correspondiente cuando nada más incluye ninguna, y el objetivo de WCAG
				se deduce de esas etiquetas. Se devuelve como <code>engine.profile</code> cuando surtió
				efecto (en una lista, el primero que se ejecutó, con todos en{" "}
				<code>engine.profiles</code>); si no, se ignora con un aviso en consola. Ver{" "}
				<a href="#conformance-profiles">"Perfiles de conformidad"</a> más arriba.
			</>
		),
	},
	{
		id: "mappings",
		option: <code>mappings</code>,
		meaning: (
			<>
				Estándares opcionales además de WCAG cuyos requisitos nombra{" "}
				<code>meta.normativeMappings</code>: <code>'en301549'</code>, <code>'en301549:V3.2.1'</code>{" "}
				o <code>'en301549:V4.1.1'</code>, o la clave del estándar de un pack, como array o cadena
				separada por comas. Por defecto
				ninguno, así que los resultados solo nombran WCAG; un perfil de EN 301 549 añade su propia
				versión. Se devuelve como <code>engine.mappings</code> cuando se aplica alguno. Ver{" "}
				<a href="#other-standards-mappings">"Otros estándares"</a> más arriba.
			</>
		),
	},
	{
		id: "logUntestedWcag",
		option: <code>logUntestedWcag</code>,
		meaning: (
			<>
				Predeterminado <code>true</code>. <code>false</code> omite la nota de{" "}
				<code>console.info</code> para una etiqueta de versión/nivel de WCAG que no lleva ninguna
				regla (<code>wcag22a</code>), en una lista de inclusión junto a otras; consulta{" "}
				<a href="#via-runonly-4th-argument">"Mediante runOnly"</a> más arriba.
			</>
		),
	},
	{
		id: "optInRules",
		option: <code>optInRules</code>,
		meaning: (
			<>
				Opcional: <code>'all'</code>, o una lista de etiquetas de reglas opcionales, como array o
				cadena separada por comas. Desbloquea esas reglas fuera del perfil de su estándar; el resto
				de la selección sigue decidiendo qué se ejecuta. Se devuelve como{" "}
				<code>engine.optInRules</code> cuando ejecutó una regla que la selección no habría
				ejecutado de otro modo; las etiquetas desconocidas se ignoran con un aviso en consola. Ver{" "}
				<a href="#running-every-rule-optinrules">"Ejecutar todas las reglas"</a> más arriba.
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
				que el ejecutor en la página está serializado y no puede leer archivos. A diferencia de
				las demás opciones, no se devuelve en el <code>engineOptions</code> de cada resultado;{" "}
				<code>engine.locale</code> informa del diccionario usado. Consulta{" "}
				<a href="/configuration/locales/">Configuración regional</a>.
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
				<code>&lt;details&gt;</code> cerrados (todo salvo su primer <code>&lt;summary&gt;</code>, a
				cualquier profundidad), contenido <code>content-visibility:hidden</code> y{" "}
				<code>hidden="until-found"</code>, el contenido de un subárbol <code>[inert]</code> (que
				las reglas sobre cómo se ve el contenido, como contraste y espaciado del texto, siguen
				juzgando, ya que se dibuja), y elementos host ocultos de solo renderizado (con sus
				descendientes también excluidos). <code>runa11yCoreAcrossFrames</code> no analiza un frame
				oculto de esta forma. Configura <code>true</code> para incluir esos
				subárboles ocultos/colapsados en la evaluación (comportamiento heredado/de marcado
				estático). Amplía lo que devuelven las consultas compartidas; aun así, la mayoría de las
				reglas juzgan solo lo que está en el árbol de accesibilidad, ya que un elemento oculto no
				tiene nombre ni rol que comprobar, así que para ellas no cambia nada. Importa en las
				reglas sobre el propio marcado, como una referencia de ID rota.
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
				<strong>Las raíces shadow cerradas nunca son alcanzables de todos modos</strong>:
				ninguna API del DOM las expone: se pregunta (<code>cantTell</code>,{" "}
				<code>name_closedContent</code>) por un elemento cuyo nombre podría venir de un elemento
				personalizado sin contenido que el motor pueda leer (un botón, enlace, elemento de menú,
				opción, pestaña, elemento de árbol, summary o tooltip), en lugar de hacerlo fallar.
			</>
		),
	},
	{
		id: "fragment",
		option: <code>fragment</code>,
		meaning: (
			<>
				Predeterminado <code>false</code>. Un puñado de reglas comprueba la presencia de una
				propiedad que existe una vez por página real: <code>page-title-present</code>,{" "}
				<code>html-lang-attr-present</code>, <code>html-xml-lang-mismatch</code>,{" "}
				<code>aria-hidden-body</code>, <code>css-orientation-lock</code>,{" "}
				<code>meta-refresh-no-exceptions</code>, <code>meta-refresh-timing-absent</code>,{" "}
				<code>meta-viewport-zoom-enabled</code>, <code>meta-viewport-large</code>,{" "}
				<code>page-title-patterns</code>, <code>region</code>,{" "}
				<code>bypass-blocks-present</code>, <code>landmark-one-main</code>,{" "}
				<code>page-has-heading-one</code>, e informa correctamente <code>notApplicable</code>{" "}
				para estas en cuanto <code>contextSelector</code> ha delimitado una ejecución más
				estrecha que el documento completo (<code>document.documentElement</code> ya no está
				entre las raíces resueltas), ya que nunca se esperó que un subárbol delimitado llevara
				su propio{" "}
				<code>&lt;title&gt;</code>/<code>&lt;html lang&gt;</code>/etc. Configura{" "}
				<code>fragment: true</code> para el caso que la delimitación por sí sola no puede
				detectar: un objetivo de análisis que es el documento <em>completo</em> dado pero que
				nunca pretendió representar una página real (por ejemplo, un fragmento de componente
				aislado analizado por sí solo): esto fuerza la misma{" "}
				<code>notApplicable</code> restringida incluso sin delimitar. Un documento mostrado en un
				frame tampoco es una página propia: <code>page-title-present</code>,{" "}
				<code>page-title-patterns</code>, <code>html-lang-attr-present</code>,{" "}
				<code>meta-viewport-zoom-enabled</code>, <code>meta-viewport-large</code>,{" "}
				<code>region</code>, <code>bypass-blocks-present</code>, <code>landmark-one-main</code> y{" "}
				<code>page-has-heading-one</code> son <code>notApplicable</code> en él diga lo que diga
				esta opción, salvo que <code>topLevelDocument: true</code> (más abajo) diga que es la
				página. Core 1.15.0 y posteriores.
			</>
		),
	},
	{
		id: "embeddedAriaHidden",
		option: <code>embeddedAriaHidden</code>,
		meaning: (
			<>
				Predeterminado <code>false</code>. <code>true</code> indica que el documento se muestra en
				un frame bajo <code>aria-hidden="true"</code> (en el <code>&lt;iframe&gt;</code> o en un
				elemento que lo rodea): cada elemento se lee como se lee el contenido aria-hidden, fuera
				del árbol de accesibilidad salvo lo que lo anula. Las reglas sobre nombres y roles (
				<code>img-alt-present</code>, <code>button-name-present</code>, …) dejan entonces de
				aplicarse, y las de lo que se ve y se maneja (contraste, foco, teclado) siguen
				aplicándose. <code>runa11yCoreAcrossFrames</code> la establece para ese frame, y un binding
				que analiza los frames por sí mismo la establece en el <code>engineOptions</code> de ese
				frame. El foco que toma ese frame es el hallazgo <code>aria-hidden-focus</code> de la
				página superior sobre el <code>&lt;iframe&gt;</code>. Core 1.15.0 y posteriores.
			</>
		),
	},
	{
		id: "embeddedInert",
		option: <code>embeddedInert</code>,
		meaning: (
			<>
				Predeterminado <code>false</code>. <code>true</code> indica que el documento se muestra en
				un frame bajo <code>[inert]</code>: cada elemento se lee como se lee el contenido inerte,
				fuera del árbol de accesibilidad y sin tomar el foco, así que solo lo juzgan las reglas
				sobre cómo se ve el contenido (contraste, espaciado del texto).{" "}
				<code>runa11yCoreAcrossFrames</code> la establece para ese frame, y deja fuera un frame tras
				un diálogo modal abierto, como deja fuera uno oculto; un binding que analiza los frames por
				sí mismo hace lo mismo. Core 1.15.0 y posteriores.
			</>
		),
	},
	{
		id: "topLevelDocument",
		option: <code>topLevelDocument</code>,
		meaning: (
			<>
				Sin valor por defecto: si el documento es una página propia. Sin valor, lo es cuando es el
				de la ventana superior: un documento mostrado en un frame no es una página propia, y las
				nueve reglas sobre la página que nombra la fila <code>fragment</code> son{" "}
				<code>notApplicable</code> en él. Un ejecutor de pruebas que muestra la página bajo prueba
				en un frame propio, como hace Cypress, la pone a <code>true</code> (
				<code>@surea11y/cypress</code> lo hace por ti); <code>false</code> lee un documento de
				nivel superior como el de un frame. <code>runa11yCoreAcrossFrames</code> no la pasa a los
				frames que analiza. Core 1.15.0 y posteriores.
			</>
		),
	},
	{
		id: "excludeSelectors",
		option: <code>excludeSelectors</code>,
		meaning: (
			<>
				Los elementos que coinciden con cualquiera de estos selectores (y sus descendientes,
				incluido lo que hay en sus shadow roots, y los documentos de los frames entre ellos) se
				omiten por completo, para <strong>todas</strong> las reglas: útil para banners de
				cookies, contenidos incrustados de terceros o widgets conocidos por generar ruido que
				no controlas. Para excluir algo de una sola regla específica en su lugar, usa{" "}
				<code>rules[ruleId].excludeSelectors</code> más abajo. Un array de selectores, o una cadena
				con una lista de selectores: <code>'#cookie-banner, img:not(.a, .b)'</code> equivale a{" "}
				<code>['#cookie-banner', 'img:not(.a, .b)']</code>, ya que la cadena solo se corta en las
				comas entre selectores. Cada selector se aplica por separado: uno que no es CSS válido no
				excluye nada, con un <code>console.warn</code>, y los demás se siguen aplicando.
			</>
		),
	},
	{
		id: "styleSheetTexts",
		option: <code>styleSheetTexts</code>,
		meaning: (
			<>
				El texto de hojas de estilo que la página no puede leer, <code>{"[{ href, text }]"}</code>:
				una hoja de otro origen, por su URL, y su CSS. Las reglas que leen el CSS (
				<code>css-orientation-lock</code>, <code>css-hidden-focus</code>,{" "}
				<code>css-focus-indicator-suppressed</code>) lo leen en lugar de la hoja. El{" "}
				<code>engineOptions</code> de cada resultado lo repite como los href de las hojas,{" "}
				<code>{"[{ href }]"}</code>, sin su texto. <code>preloadStyleSheets()</code> obtiene desde
				dentro de la página las que el servidor comparte, y <code>runa11yCoreInPageAsync</code> las
				obtiene antes de analizar; una herramienta que controla el navegador puede obtener las demás
				desde fuera. Consulta{" "}
				<a href={`${core}/docs/INTEGRATION.md#style-sheets-from-another-origin`}>
					«Style sheets from another origin»
				</a>{" "}
				en la guía de integración de core en GitHub. Core 1.14.0 y posteriores.
			</>
		),
	},
	{
		id: "timestamp",
		option: <code>timestamp</code>,
		meaning: (
			<>
				Se pasa directamente al campo <code>timestamp</code> de nivel superior del resultado; el
				motor no genera uno por sí mismo (determinista por diseño). Un valor que no es una cadena
				(un <code>Date</code>, un número) se ignora con un <code>console.warn</code>; pasa{" "}
				<code>new Date().toISOString()</code>.
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
				puerta de CI sin supervisión. Una página que no pinta ningún fondo opaco no es
				uno de esos casos: el lienzo que hay detrás se deduce del propio esquema de color de la
				página, así que su texto se mide en cualquiera de los dos modos sin suponer nada. Donde no
				se puede conocer el lienzo de la página (en un frame, con colores forzados),{" "}
				<code>auditorAssist</code> mide el texto sobre <code>contrast.rootCanvasFallback</code>, y
				lo registra como <code>ROOT_CANVAS_FALLBACK</code>.
			</>
		),
	},
	{
		id: "contrast-fallback",
		option: <code>contrast.rootCanvasFallback</code>,
		meaning: (
			<>
				Un color de lienzo para una página que no pinta ningún fondo opaco. Sin indicarlo, las
				reglas de contraste miden el texto de esa página sobre el lienzo que el navegador pinta
				detrás, en cualquiera de los dos modos: el lienzo del esquema de color en que se dibuja la
				página, que decide su propio <code>color-scheme</code> (en la raíz, o la forma{" "}
				<code>&lt;meta&gt;</code>). Una página que no declara ninguno se dibuja en claro, sobre
				blanco, prefiera lo que prefiera el usuario; <code>light dark</code> se dibuja sobre blanco
				para un usuario en modo claro y sobre el lienzo oscuro para uno en modo oscuro, y su texto se
				mide en los dos esquemas, y falla donde falla en cualquiera de ellos (
				<code>data.details.colorScheme</code> nombra cuál). Con jsdom, que no resuelve colores del
				sistema, el motor usa los de Chromium, y pregunta por el texto cuyos colores no puede
				deducir allí (<code>COLOR_SCHEME_NOT_RENDERED</code>). Si se indica, blanco incluido, el
				color sustituye al lienzo de la página en todos los esquemas: el texto se mide sobre él una
				vez, registrado como una suposición (<code>ROOT_CANVAS_FALLBACK</code>). El lienzo de la
				página no se puede conocer en un frame, cuyo lienzo puede dejar ver la página padre, ni con
				colores forzados: ahí <code>contrast-computable</code> pregunta y las reglas de ratio dejan
				fuera el texto, salvo que <code>auditorAssist</code> lo mida sobre este color. El{" "}
				<code>engineOptions.contrast</code> de cada resultado repite el color usado, blanco si no
				se indicó ninguno.
			</>
		),
	},
	{
		id: "contrast-fallback-set",
		option: <code>contrast.rootCanvasFallbackSet</code>,
		meaning: (
			<>
				Se repite en cada resultado: <code>true</code> cuando{" "}
				<code>contrast.rootCanvasFallback</code> es del llamador, <code>false</code> para el blanco
				predeterminado (también cuando el valor indicado no era un color utilizable). No hace falta
				como entrada: las opciones que se pasan de nuevo desde la copia de un resultado se leen tal
				como estaban, así que <code>false</code> mantiene el blanco repetido como predeterminado. Un
				valor que no es <code>true</code> ni <code>false</code> produce un aviso y se lee como no
				indicado. Core 1.14.0 y posteriores.
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
				Sin definir (el valor predeterminado), es <code>'styleAndGeometry'</code> donde la página
				tiene diseño, es decir, en cualquier análisis en navegador, y <code>'styleOnly'</code> donde
				no lo tiene (jsdom): quien lee solo ve el texto que se dibuja en algún lugar visible, y eso
				solo lo puede saber el diseño. <code>'styleOnly'</code>: la elegibilidad es solo CSS:{" "}
				<code>display</code>, <code>visibility</code>, <code>opacity</code>, ocultamiento por
				ancestro, etc. <code>'styleAndGeometry'</code>: añade comprobaciones reales de diseño (
				<code>getClientRects()</code>/<code>getBoundingClientRect()</code>) encima de eso: el
				texto sin rects de cliente o con ancho/alto cero también se excluye, igual que el texto
				situado por completo por encima o a la izquierda de la página, adonde no llega ningún
				desplazamiento (la técnica <code>left: -9999px</code>), y el texto que un ancestro con{" "}
				<code>overflow: hidden</code> o <code>clip</code> recorta por completo (
				<code>height: 0; overflow: hidden</code>, una diapositiva de carrusel fuera de la
				vista). Una caja con desplazamiento (<code>auto</code>, <code>scroll</code>) no excluye
				su texto, porque quien lee puede llegar a él. Las opciones de un{" "}
				<code>&lt;select&gt;</code> se juzgan por la posición de su <code>&lt;select&gt;</code> en
				la página. En ambos modos se excluye el texto con un
				tamaño de fuente de 0 o un color totalmente transparente, ya que no se dibuja nada; el
				texto transparente que deja ver un fondo a través de sus glifos (
				<code>background-clip: text</code>, en él o en un antecesor) no se excluye: se mide en el
				color de ese fondo cuando es sólido, y se pregunta por él cuando es un degradado o una
				imagen. Configura{" "}
				<code>'styleOnly'</code> en un navegador para comprobar el texto solo a partir de los
				estilos calculados, como hacían las versiones anteriores; bajo jsdom puro (
				<code>runDomRulesInPage</code>
				) no hay un motor de diseño real, así que <code>'styleAndGeometry'</code> básicamente
				solo añade comprobaciones de tamaño cero de{" "}
				<code>getBoundingClientRect()</code>, no una detección real de recorte/desbordamiento.
				Consulta <a href="/help/known-limitations/">limitaciones conocidas</a>.
			</>
		),
	},
	{
		id: "policyContract",
		option: <code>policyContract</code> ,
		meaning: (
			<>
				Consulta <a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a>: controla qué
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
				construir ocurrencias a mano (1.5.0), ese autocompletado es el camino que siguen casi
				todas las reglas: configurar{" "}
				<code>includeSelector: false</code> / <code>includeHtml: false</code> elimina selectores
				y fragmentos de HTML de casi todas ellas. Un puñado todavía ensambla esos campos
				por sí mismo dentro de <code>runInPage</code> y no se ve afectado: entre ellas{" "}
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
		id: "output-detail",
		option: <code>output.detail</code>,
		meaning: (
			<>
				<code>'full'</code> (predeterminado) o <code>'findings'</code>: un resultado más pequeño,
				que conserva completos solo los resultados de comprobación que informan algo (
				<code>fail</code>, <code>cantTell</code> y cualquiera que enumere ocurrencias); cada{" "}
				<code>pass</code> y <code>notApplicable</code> restante conserva su <code>ruleId</code>, su{" "}
				<code>outcome</code> y su <code>type</code>, y su <code>margin</code> o su{" "}
				<code>error</code> si lo tiene. Los resultados agregados y los veredictos no cambian, y los
				generadores de informes lo leen como un resultado completo. Una regla que el catálogo de
				core no podría volver a rellenar se queda completa: todas las reglas de un análisis con{" "}
				<code>packs</code>, una regla personalizada, y una que los <code>messages</code> del
				análisis reformulan. Consulta{" "}
				<a href="/results-reports/output-schema/#top-level-result"><code>engine.outputDetail</code></a>;
				en TypeScript, ese resultado es un <code>CompactScanResult</code>.
			</>
		),
	},
	{
		id: "rules-ruleId",
		option: <code>rules[ruleId]</code>,
		meaning: (
			<>
				Se pasa a esa regla como <code>ctx.config</code>, y, específicamente para{" "}
				<code>excludeSelectors</code>, el propio motor lo lee antes de que la regla se ejecute.
				Consulta{" "}
				<a href="#rule-scoped-excludeselectors">"excludeSelectors por regla"</a> más abajo.
				Cualquier otra clave es solo de paso: <strong>ninguna regla distribuida toma nada más de
				ella.</strong> Los ajustes que declara una regla, como los umbrales de{" "}
				<code>contrast-minimum</code>, son los de su estándar, así que el valor que indique quien
				llama se descarta: un resultado que nombra WCAG 1.4.3 siempre se decide a 4.5:1. Un
				estándar con otros umbrales tiene su propia regla, una variante, que un{" "}
				<a href="/configuration/packs/">pack</a> puede aportar. Una clave se compara igual que un id
				de regla, sin distinguir mayúsculas y minúsculas o con el prefijo heredado{" "}
				<code>a11ycore-</code>; una que no nombra ninguna regla del análisis genera un aviso con el
				id más parecido.
			</>
		),
	},
	{
		id: "packs",
		option: <code>packs</code>,
		meaning: (
			<>
				Packs opcionales de <code>@surea11y/core/pack</code>: reglas, variantes de las reglas de
				core, un estándar o una lista de comprobación y mensajes de fuera de core, que se suman al
				análisis. Una lista: los objetos de pack para <code>runDomRulesInPage</code> y las
				funciones de catálogo en Node, y para <code>runa11yCoreInPage</code> el{" "}
				<code>name@version</code> de los packs que un <code>packScript</code> registró en la
				página. Cualquier otra cosa no ejecuta ningún pack, con un aviso, y lanza un error con{" "}
				<code>strictOptions</code>, con <code>code: 'INVALID_ENGINE_OPTIONS'</code>. Se devuelve
				como <code>engine.packs</code>. Consulta{" "}
				<a href="/configuration/packs/">Packs</a>.
			</>
		),
	},
	{
		id: "probes",
		option: <code>probes</code>,
		meaning: (
			<>
				Un objeto de evidencia opcional, seguro para JSON, que proporciona tu aplicación
				anfitriona, para lo que el análisis de una sola página no puede ver, como las demás páginas
				del sitio. El motor lo limita antes de que las reglas lo lean (
				<code>ctx.inputs.probes</code>): seis niveles de profundidad, 200 elementos por array, 50
				claves por objeto, 2.000 caracteres por cadena. <code>page-title-patterns</code> lee{" "}
				<code>crawl.pageTitles</code> (<code>{"{ pages: [{ url, title }] }"}</code>) para buscar
				títulos genéricos y de plantilla en todo un sitio. Las reglas de un pack pueden leer
				sondas propias, que el pack documenta.
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
				hace nada: <code>perfStats</code> es lo que crea el objeto donde vive el desglose.{" "}
				<strong>La forma no es parte del contrato de salida estable: no construyas nada sobre
				ella.</strong> Ten en cuenta también que{" "}
				<code>profileRules</code> es la única opción que hace que la salida sea no determinista:
				los contadores son estables entre ejecuciones idénticas, los tiempos de reloj no lo son.
				Déjala desactivada si comparas resultados entre ejecuciones. Con{" "}
				<code>profileRules</code>, las cachés compartidas (estilos calculados y elegibilidad en el
				árbol de accesibilidad) se llenan antes de la primera regla y se miden aparte como{" "}
				<code>perfStats.warmUpMs</code>, para que su coste no se cargue a la primera regla que
				recorra la página.
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
				): cuánto tiempo esperar a que un frame hijo responda a un ping (predeterminado{" "}
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
				<code>engineOptions</code> y <code>runOnly</code> en su totalidad. Para comprobar una
				página frente a una versión y un nivel de WCAG, empieza por{" "}
				<a href="#selecting-by-wcag-target-runonlywcag"><code>runOnly.wcag</code></a>.
			</p>

			<h2 id="selecting-which-rules-run">Seleccionar qué reglas se ejecutan</h2>
			<p>
				Nombra aquello contra lo que pruebas y el motor elige las reglas. Sin ninguna selección, se
				ejecutan las reglas predeterminadas: todas salvo las reglas opcionales de un estándar o de
				un pack, que solo se ejecutan una vez desbloqueadas (consulta{" "}
				<a href="#opt-in-rules">Reglas opcionales</a>).
			</p>
			<DataTable
				label="Elegir qué se ejecuta"
				rowKey="id"
				columns={[
					{ key: "run", label: "Para ejecutar", wrap: true },
					{ key: "pass", label: "Pasa", wrap: true },
				]}
				rows={[
					{ id: "all", run: "Las reglas predeterminadas: todas salvo las opcionales no desbloqueadas", pass: <>nada: <code>runOnly</code> <code>null</code></> },
					{
						id: "wcag",
						run: "Un objetivo de conformidad de WCAG: las reglas de los criterios de una versión en un nivel y en los inferiores",
						pass: <code>{"runOnly: { wcag: { version: '2.2', level: 'AA' } }"}</code>,
					},
					{
						id: "wcag-bp",
						run: "Lo mismo, y las reglas de buenas prácticas, que no comprueban ningún criterio de WCAG",
						pass: <code>{"runOnly: { wcag: { version: '2.2', level: 'AA' }, bestPractices: true }"}</code>,
					},
					{ id: "bp", run: "Solo las reglas de buenas prácticas", pass: <code>{"runOnly: { bestPractices: true }"}</code> },
					{
						id: "profile",
						run: "Un estándar basado en WCAG (EN 301 549, Section 508)",
						pass: <code>{"engineOptions: { profile: 'en301549-v4.1.1' }"}</code>,
					},
					{
						id: "profile-bp",
						run: "Lo mismo, y las reglas de buenas prácticas",
						pass: (
							<>
								<code>{"engineOptions: { profile: 'en301549-v4.1.1' }"}</code>,{" "}
								<code>{"runOnly: { bestPractices: true }"}</code>
							</>
						),
					},
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.2 AA, with the best practices:",
					"runDomRulesInPage(url, null, {}, {",
					"  wcag: { version: '2.2', level: 'AA' },",
					"  bestPractices: true",
					"});",
				]}
			/>
			<p>
				Toda regla o bien comprueba criterios de WCAG o bien es una buena práctica, así que{" "}
				<code>{"{ wcag: { version: '2.2', level: 'AAA' }, bestPractices: true }"}</code> ejecuta
				todas las reglas salvo las del 4.1.1 <span lang="en">Parsing</span>, que WCAG 2.2 eliminó.
				Para algo más fino, como un solo criterio, una lista de reglas o una exclusión, consulta{" "}
				<a href="#advanced-selection-tags-and-rule-ids">"Selección avanzada: etiquetas e ids de regla"</a>;
				esos campos se combinan con los de arriba. Un análisis que nombra reglas informa también de
				los criterios que comprueban (
				<a href="#which-criteria-a-scan-reports">"Qué criterios informa un análisis"</a>).
			</p>

			<h3 id="selecting-by-wcag-target-runonlywcag">Seleccionar por objetivo de WCAG (<code>runOnly.wcag</code>)</h3>
			<p>
				<code>runOnly.wcag</code> nombra una versión y un nivel de conformidad de WCAG, y selecciona
				las reglas de los criterios de ese objetivo:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.2 Level A and AA:",
					"runDomRulesInPage(url, null, {}, { wcag: { version: '2.2', level: 'AA' } });",
				]}
			/>
			<ul>
				<li>
					<code>version</code> es <code>'2.0'</code>, <code>'2.1'</code> o <code>'2.2'</code>;{" "}
					<code>level</code> es <code>'A'</code>, <code>'AA'</code> o <code>'AAA'</code> (sin
					distinguir mayúsculas y minúsculas).
				</li>
				<li>
					Una regla se selecciona cuando uno de los criterios que nombra forma parte del objetivo:
					vigente en esa versión (introducido en ella o antes, y no eliminado en ella ni antes), en
					el nivel del objetivo o en uno inferior, según el nivel que tiene el criterio{" "}
					<strong>en esa versión</strong>. Los niveles vienen de <code>WCAG_CRITERIA</code> en{" "}
					<code>@surea11y/core/wcag</code>, que tiene un nivel por versión.
				</li>
				<li>
					Así, el 4.1.1 <span lang="en">Parsing</span>, que 2.2 eliminó, forma parte de los
					objetivos <code>{"{ version: '2.1' }"}</code> y no de los{" "}
					<code>{"{ version: '2.2' }"}</code>: <code>duplicate-id</code> se ejecuta para los primeros
					y no para los segundos, donde las etiquetas de versión sí lo ejecutarían.
				</li>
				<li>
					Una regla que no nombra ningún criterio (una regla de buenas prácticas) no forma parte de
					ningún objetivo. Añádelas con <code>bestPractices: true</code> (siguiente sección), o reglas
					sueltas con <code>tags</code> o <code>includeRuleIds</code>: junto a <code>wcag</code>,
					todos ellos seleccionan reglas <strong>además</strong>, la unión de las reglas del
					objetivo y lo que seleccionan los demás. <code>excludeTags</code>,{" "}
					<code>excludeRuleIds</code> y <code>excludeTestIds</code> se aplican después, como
					siempre.
				</li>
				<li>
					La versión del objetivo es el objetivo de WCAG de la ejecución (
					<code>engine.wcagVersion</code>), salvo que se defina <code>engineOptions.wcagVersion</code>;
					su nivel decide qué resultados agregados de WCAG se informan, como hace una etiqueta de
					nivel, salvo que se defina <code>engineOptions.wcagLevel</code> (
					<a href="#giving-the-level-of-a-scan-that-names-checks-wcaglevel">
						"Indicar el nivel de un análisis que nombra comprobaciones"
					</a>
					).
				</li>
				<li>
					Un objetivo incluye reglas, así que las selecciona en lugar de{" "}
					<code>engineOptions.profile</code>, igual que <code>tags</code>.{" "}
					<code>getProfileWcagTarget(profile)</code> da el objetivo al que equivale un perfil
					(consulta <a href="#conformance-profiles">"Perfiles de conformidad"</a>), y{" "}
					<code>getChecksForRunOnly(runOnly, engineOptions)</code> enumera las reglas que ejecuta un{" "}
					<code>runOnly</code> con <code>wcag</code>, y{" "}
					<code>getRulesForRunOnly(runOnly, engineOptions)</code> los resultados agregados que
					informa.
				</li>
				<li>
					Cualquier otra cosa lanza <code>INVALID_RUN_ONLY</code>, nombrando lo que está mal:{" "}
					<code>runOnly.wcag.version must be "2.0", "2.1" or "2.2", not "3.0".</code>
				</li>
			</ul>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.1 AA, plus the best-practice rules, without one of them:",
					"{ wcag: { version: '2.1', level: 'AA' }, tags: ['best-practice'], excludeRuleIds: ['region'] }",
				]}
			/>

			<h3 id="adding-the-best-practices-runonlybestpractices">Añadir las buenas prácticas (<code>runOnly.bestPractices</code>)</h3>
			<p>
				<code>bestPractices: true</code> selecciona las reglas de buenas prácticas: las reglas que no
				nombran ningún criterio de WCAG, como <code>region</code>, <code>landmark-one-main</code>,{" "}
				<code>heading-order</code>, <code>page-has-heading-one</code>, <code>skip-link</code>,{" "}
				<code>tabindex</code> e <code>image-redundant-alt</code>. Son las reglas etiquetadas como{" "}
				<code>best-practice</code>, así que equivale a añadir esa etiqueta. Un hallazgo de una de
				ellas es una buena práctica, no un fallo de WCAG: ningún resultado agregado de WCAG lo
				cuenta. La mayoría informan <code>cantTell</code>; una cuyo hallazgo es en sí una barrera
				informa <code>fail</code>, como hace <code>empty-heading</code> con un encabezado sin
				nombre.
			</p>
			<ul>
				<li>
					Junto a <code>wcag</code>, <code>tags</code> o ids de regla, añade esas reglas a lo que
					ellos seleccionan; las exclusiones se aplican después, así que{" "}
					<code>excludeRuleIds: ['region']</code> sigue dejando fuera <code>region</code>.
				</li>
				<li>Por sí solo, selecciona solo las reglas de buenas prácticas.</li>
				<li>
					<code>false</code>, u omitirlo, no añade nada. Por sí solo,{" "}
					<code>{"{ bestPractices: false }"}</code> es una selección vacía, así que se ejecutan las
					reglas predeterminadas, como con <code>{"{}"}</code>.
				</li>
				<li>
					Cualquier otro valor lanza <code>INVALID_RUN_ONLY</code>:{" "}
					<code>runOnly.bestPractices must be true or false, not "yes".</code>
				</li>
				<li>
					Junto a <code>engineOptions.profile</code>, añade las reglas de buenas prácticas a las del
					perfil, y el perfil se sigue aplicando: sus reglas, sus resultados agregados, sus
					asociaciones y <code>engine.profile</code>, igual que sin él.{" "}
					<code>{"{ bestPractices: true }"}</code> con <code>profile: 'en301549-v4.1.1'</code>{" "}
					ejecuta ese estándar y las buenas prácticas. Las reglas de buenas prácticas no cuentan en
					ninguno de los resultados agregados del perfil, ya que no comprueban ningún criterio de
					WCAG.
				</li>
			</ul>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.1 AA and the best practices, without one of them:",
					"{ wcag: { version: '2.1', level: 'AA' }, bestPractices: true, excludeRuleIds: ['region'] }",
				]}
			/>

			<h3 id="conformance-profiles">Perfiles de conformidad</h3>
			<p>
				<code>engineOptions.profile</code> nombra un objetivo de conformidad en lugar de enumerar su
				conjunto de etiquetas:
			</p>
			<DataTable
				label="Perfiles de conformidad"
				rowKey="profile"
				columns={[
					{ key: "profile", label: "Perfil", width: "20%" },
					{ key: "tags", label: "Ejecuta las reglas con las etiquetas", wrap: true },
					{ key: "target", label: "Objetivo WCAG", width: "12%" },
					{ key: "wcagTarget", label: "getProfileWcagTarget", wrap: true },
					{ key: "why", label: "Por qué", wrap: true },
				]}
				rows={[
					{
						profile: <code>wcag22-a</code>,
						tags: (
							<>
								<code>wcag2a</code>, <code>wcag21a</code>, <code>wcag22a</code>
							</>
						),
						target: "2.2",
						wcagTarget: <code>{"{ version: '2.2', level: 'A' }"}</code>,
						why: "WCAG 2.2 nivel A",
					},
					{
						profile: <code>wcag22-aa</code>,
						tags: (
							<>
								<code>wcag2a</code>, <code>wcag2aa</code>, <code>wcag21a</code>, <code>wcag21aa</code>,{" "}
								<code>wcag22a</code>, <code>wcag22aa</code>
							</>
						),
						target: "2.2",
						wcagTarget: <code>{"{ version: '2.2', level: 'AA' }"}</code>,
						why: "WCAG 2.2 nivel A y AA",
					},
					{
						profile: <code>wcag22-aaa</code>,
						tags: (
							<>
								las etiquetas de <code>wcag22-aa</code> y <code>wcag2aaa</code>,{" "}
								<code>wcag21aaa</code>, <code>wcag22aaa</code>
							</>
						),
						target: "2.2",
						wcagTarget: <code>{"{ version: '2.2', level: 'AAA' }"}</code>,
						why: "WCAG 2.2 nivel A, AA y AAA",
					},
					{
						profile: <code>en301549-v4.1.1</code>,
						tags: (
							<>
								igual que <code>wcag22-aa</code>
							</>
						),
						target: "2.2",
						wcagTarget: <code>{"{ version: '2.2', level: 'AA' }"}</code>,
						why: "El capítulo 9 de EN 301 549 V4.1.1 reformula WCAG 2.2 A y AA",
					},
					{
						profile: <code>en301549-v3.2.1</code>,
						tags: (
							<>
								<code>wcag2a</code>, <code>wcag2aa</code>, <code>wcag21a</code>, <code>wcag21aa</code>
							</>
						),
						target: "2.1",
						wcagTarget: <code>{"{ version: '2.1', level: 'AA' }"}</code>,
						why: "El capítulo 9 de EN 301 549 V3.2.1 reformula WCAG 2.1 A y AA, incluido 4.1.1 Procesamiento",
					},
					{
						profile: <code>section508</code>,
						tags: (
							<>
								<code>wcag2a</code>, <code>wcag2aa</code>
							</>
						),
						target: "2.0",
						wcagTarget: <code>{"{ version: '2.0', level: 'AA' }"}</code>,
						why: "Las normas revisadas de la Sección 508 incorporan WCAG 2.0 A y AA",
					},
				]}
			/>
			<p>
				<code>getProfileWcagTarget(profile)</code> da el objetivo <code>runOnly.wcag</code> al que
				equivale el conjunto de etiquetas de un perfil, o <code>null</code> para un nombre que no es
				un perfil. Cada nivel de WCAG incluye los inferiores, como los niveles de WCAG:{" "}
				<code>wcag22-aaa</code> ejecuta todas las reglas de <code>wcag22-aa</code> y añade las de
				AAA, así que un análisis nombra un nivel, no varios. <code>wcag22-a</code> y{" "}
				<code>wcag22-aaa</code> son nuevos en core 1.15.0. Un perfil sigue seleccionando por sus
				etiquetas, como en la tabla: con <code>wcag22-aa</code> (y <code>wcag22-a</code> y{" "}
				<code>wcag22-aaa</code>), <code>duplicate-id</code> (4.1.1) se ejecuta y no puede dar{" "}
				<code>fail</code>, mientras que <code>{"{ wcag: getProfileWcagTarget('wcag22-aa') }"}</code>{" "}
				lo deja fuera.
			</p>
			<CodeBlock lang="js" lines={["runDomRulesInPage(url, null, { profile: 'en301549-v3.2.1' }, null);"]} />
			<Callout tone="note" title="Obsoleto">
				<p>
					<code>en301549-v4.1.1</code> y <code>en301549-v3.2.1</code> pasan al pack de EN 301 549,{" "}
					<a href={pack}><code>@surea11y/pack-en301549</code></a>, y salen de core en la 2.0.0. Funcionan como antes, con un{" "}
					<code>console.warn</code> por proceso. Con el pack (<code>{"packs: [en301549]"}</code>), un
					análisis toma de él los mismos nombres y no muestra el aviso; los perfiles del pack informan
					un resultado por cláusula en lugar de los resultados agregados de WCAG. Ver{" "}
					<a href={`${core}/docs/API_STABILITY.md#deprecating-a-standard-a-profile-or-an-entry-point`}>cómo core declara obsoleto un estándar</a>.
				</p>
			</Callout>
			<p>
				El estándar o la lista de comprobación de un <a href="/configuration/packs/">pack</a> añade
				sus propios perfiles a esta lista.
			</p>
			<h4 id="several-profiles">Varios perfiles a la vez</h4>
			<p>
				<code>profile</code> acepta también una lista, con los packs que los traen en{" "}
				<code>packs</code>: un solo análisis juzga entonces la página con WCAG y con WAI-ARIA, con
				EN 301 549 y tu propia política, o con dos versiones de un estándar mientras pasas de una a
				otra. Cada perfil juzga la página como lo haría un análisis solo de él, y el resultado se
				lee como un solo perfil con las reglas de todos: el <code>outcome</code> de una comprobación
				es el peor que le dan sus perfiles, y los <code>verdicts</code> de cada hallazgo dicen qué
				hace de él cada perfil (
				<a href="/results-reports/output-schema/#several-profiles">Esquema de salida</a>). Core
				1.15.0 y posteriores.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const waiAria = require('@surea11y/pack-wai-aria');",
					"",
					"const result = runDomRulesInPage(url, null, {",
					"  packs: [waiAria],",
					"  profile: ['wcag22-aa', 'wai-aria-1.2']",
					"});",
					"// <div role=\"group\" aria-checked=\"true\">: an attribute the role doesn't",
					"// support, a question for WCAG 4.1.2 and a failure of WAI-ARIA.",
					"result.checksResults.find((c) => c.ruleId === 'aria-allowed-attr').verdicts;",
					"// { 'wcag22-aa': 'cantTell', 'wai-aria-1.2': 'fail' }",
				]}
			/>
			<p>
				Cada perfil se analiza por turno, sobre la misma página, así que el análisis tarda más o
				menos lo que uno por perfil. Un perfil que no se aplica (no existe ese perfil, su pack se
				omitió, o un include de <code>runOnly</code> elige las reglas en su lugar) figura en{" "}
				<code>engine.profilesNotRun</code> con el motivo, y los demás se siguen ejecutando; SARIF,
				JUnit, la CLI y los test matchers tratan ese análisis como un error, ya que juzgó menos de
				lo que se le pidió. Una lista de uno es su único nombre, y analiza exactamente como antes.
				El <a href="/configuration/packs/#wai-aria-pack">pack de WAI-ARIA</a> es el caso para el
				que se creó.
			</p>
			<p>
				El objetivo de WCAG se deduce de las etiquetas igual que con un conjunto escrito a mano (ver{" "}
				<a href="#filtering-by-wcag-version">"Filtrado por versión de WCAG"</a> más abajo), así que{" "}
				<code>en301549-v3.2.1</code> apunta a WCAG 2.1 y <code>en301549-v4.1.1</code> a WCAG 2.2.
				Un id duplicado todavía puede dar <code>fail</code> con <code>en301549-v3.2.1</code>{" "}
				porque su perfil mantiene el texto del 4.1.1 (<code>keepsParsing</code>,{" "}
				<a href="#parsing-errata">ver más abajo</a>); con <code>en301549-v4.1.1</code> no. El perfil de un pack puede nombrar su versión en su lugar,
				con <code>wcagVersion</code> (<a href="/configuration/packs/#profiles">Packs</a>): un
				perfil que ejecuta solo las reglas que asocia su estándar no tiene etiquetas de WCAG que
				impliquen una. Los nombres no distinguen mayúsculas y minúsculas. Una ejecución que usó un
				perfil lo devuelve como <code>engine.profile</code>.
			</p>
			<p>
				Precedencia: cualquier cosa que <em>incluya</em> reglas las selecciona en lugar del perfil:
				un <code>runOnly</code> con <code>wcag</code>, <code>tags</code>, <code>includeRuleIds</code>{" "}
				o <code>includeTestIds</code>, o un <code>include</code> en{" "}
				<code>engineOptions.rules</code>/<code>.tags</code>/<code>.tests</code>. Las exclusiones se
				siguen aplicando sobre el perfil, tanto si vienen de <code>runOnly</code> (
				<code>excludeTags</code>, <code>excludeRuleIds</code>, <code>excludeTestIds</code>, de modo
				que el <code>disableTags()</code> de una integración acota el perfil en lugar de
				sustituirlo) como, si no hay filtro <code>runOnly</code>, de <code>engineOptions</code> (
				<code>tags.exclude</code>, <code>rules.exclude</code>, <code>tests.exclude</code>), y un{" "}
				<code>engineOptions.wcagVersion</code> explícito sigue ganando a la versión que implica o
				nombra el perfil. Un perfil que no surte efecto (un nombre desconocido, o uno anulado como se acaba de
				describir) no es un error: la ejecución continúa como si no se hubiera indicado ninguno,
				registra un <code>console.warn</code> que explica por qué y no lleva{" "}
				<code>engine.profile</code>. <code>runOnly.bestPractices: true</code> no es una inclusión de
				ese tipo: añade las reglas de buenas prácticas a las del perfil, y el perfil se aplica (
				<a href="#adding-the-best-practices-runonlybestpractices">"Añadir las buenas prácticas"</a>).
			</p>
			<p>
				El perfil de un estándar también puede dejar reglas fuera, cuando su estándar exime de un
				criterio de WCAG o sustituye una comprobación de WCAG por una propia: las reglas que nombra,
				las reglas de las que exime todos los criterios y los resultados agregados de WCAG de los
				criterios eximidos no se ejecutan, y el catálogo de reglas también los deja fuera. Una
				regla que también comprueba un criterio que el perfil conserva se sigue ejecutando (
				<code>link-name-present</code>, que comprueba 2.4.4 y 4.1.2, con un perfil que exime del
				2.4.4), y <code>engine.profileExcludes</code> nombra lo que se dejó fuera. Hoy ningún perfil
				incluido excluye nada.
			</p>
			<p>
				<strong>Un perfil solo elige qué reglas se ejecutan.</strong> No dice nada sobre si
				superarlas cumple el estándar del que toma el nombre: la mayoría de los criterios de éxito
				necesitan un juicio humano que ninguna regla automatizada cubre (ver{" "}
				<a href="/conformance/wcag-mapping/#what-this-engine-cannot-tell-you">
					lo que este motor no puede decirte
				</a>
				).
			</p>
			<p>
				Un perfil de EN 301 549 también activa las cláusulas de EN 301 549 de la versión a la que
				apunta, como si se hubiera pasado <code>mappings: ['en301549:V4.1.1']</code> (o{" "}
				<code>V3.2.1</code>); ver <a href="#other-standards-mappings">"Otros estándares"</a> más
				abajo. El perfil de cualquier estándar activa su propia versión de la misma forma. Un perfil
				con <code>mappedRules</code> también ejecuta, sean cuales sean sus etiquetas, las reglas a
				las que se asocia su estándar: las que no tienen asociación con WCAG, como{" "}
				<code>heading-order</code> y <code>skip-link</code>, no tienen ninguna etiqueta de WCAG por
				la que seleccionarse. Un estándar con requisitos propios, o la lista de comprobación de una
				organización, llega al motor como un <a href="/configuration/packs/">pack</a>, con sus
				propios nombres de perfil, reglas y resultados agregados. El propio motor no incluye ningún
				estándar así.
			</p>

			<h3 id="opt-in-rules">Reglas opcionales</h3>
			<p>
				Algunas reglas comprueban requisitos propios de un estándar que WCAG no impone: un estándar
				nacional puede exigir un doctype, o prohibir atributos de presentación como{" "}
				<code>bgcolor</code>. Un <code>fail</code> de una regla así es un fallo de ese estándar, no
				de WCAG, así que estas reglas están <strong>desactivadas por defecto</strong>. Cada una lleva
				la etiqueta de regla de su estándar y solo se ejecuta cuando la selección la pide:
			</p>
			<ul>
				<li>mediante el perfil del estándar, que enumera la etiqueta,</li>
				<li>
					por esa etiqueta (<code>{"tags: { include: '<tag>' }"}</code>, sola o con otras),
				</li>
				<li>
					por su id (<code>{"rules: { include: '<rule id>' }"}</code>, o{" "}
					<code>runOnly.includeRuleIds</code>),
				</li>
				<li>
					por el id de uno de los resultados agregados propios de su estándar que la agrupe (
					<code>{"rules: { include: '<rollup id>' }"}</code> ejecuta las reglas de ese resultado
					agregado, opcionales o no), o
				</li>
				<li>
					desbloqueándola con <code>engineOptions.optInRules</code>, más abajo.
				</li>
			</ul>
			<p>
				Nada más selecciona una: ni una ejecución por defecto, ni un conjunto de etiquetas de WCAG,
				ni un perfil de WCAG o de EN 301 549, ni un id de resultado agregado de WCAG. Las exclusiones
				se les aplican como a cualquier regla. Seleccionar solo la etiqueta ejecuta las reglas
				propias de ese estándar, no las reglas de WCAG con las que también está asociado, así que
				responde a "qué exige el estándar además de WCAG" y no es una auditoría frente a él. Para
				una auditoría, usa el perfil del estándar: con la etiqueta sola, sus propios resultados
				agregados informan <code>cantTell</code> para cualquier requisito cuyas reglas no se
				ejecutaron. Una regla añadida mediante <code>customRules</code> que lleva la etiqueta sigue
				la misma barrera. Hoy ninguno de los estándares incluidos en el motor tiene reglas
				opcionales; la etiqueta de espacio de nombres de un pack funciona así.
			</p>

			<h3 id="running-every-rule-optinrules">Ejecutar todas las reglas (<code>optInRules</code>)</h3>
			<p>
				Para ejecutar todas las reglas del motor, sea cual sea el estándar al que pertenecen, omite
				el perfil y desbloquea las reglas opcionales:
			</p>
			<CodeBlock lang="js" lines={["runDomRulesInPage(url, null, { optInRules: 'all' }, null);"]} />
			<p>
				<code>'all'</code> desbloquea las reglas opcionales de todos los estándares; una lista de
				etiquetas desbloquea solo esas. Levanta la barrera y nada más: el resto de la selección
				sigue decidiendo qué reglas se ejecutan. Así, sin filtro y sin perfil, como arriba, la
				ejecución cubre todas las reglas y los resultados agregados de todos los estándares; con{" "}
				<code>profile: 'wcag22-aa'</code> sigue ejecutando solo las reglas de WCAG, ya que las
				reglas opcionales no llevan etiquetas de WCAG. Las exclusiones se aplican como siempre. Una
				etiqueta que no es de reglas opcionales se ignora con un <code>console.warn</code>. Solo
				esta opción del motor desbloquea: <code>runOnly</code> no tiene clave{" "}
				<code>optInTags</code>, así que una indicada ahí es una clave desconocida, que lanza{" "}
				<code>INVALID_RUN_ONLY</code> por sí sola y se ignora con un aviso junto a claves que{" "}
				<code>runOnly</code> lee, con un mensaje que remite a <code>engineOptions.optInRules</code>.
			</p>
			<p>
				Sirve para ver todo lo que el motor puede informar, durante el desarrollo o al explorar un
				sitio. <strong>No es un objetivo de conformidad</strong>: una ejecución así hace fallar una
				página por cosas que WCAG permite y que solo otro estándar prohíbe. El resultado lo indica:{" "}
				<code>engine.optInRules</code> enumera las etiquetas cuyas reglas se ejecutaron, y el informe
				HTML, SARIF y JUnit lo muestran junto al perfil. No añade a los resultados los números de
				ningún otro estándar; para eso, pasa <code>mappings</code>, por ejemplo{" "}
				<code>{"{ optInRules: 'all', mappings: ['<key>'] }"}</code>.
			</p>

			<h3 id="other-standards-mappings">Otros estándares (<code>mappings</code>)</h3>
			<p>
				El <code>meta.normativeMappings</code> de cada resultado nombra los criterios de éxito de
				WCAG que comprueba. <code>engineOptions.mappings</code> añade el requisito de otro estándar
				que corresponde a cada uno. Por defecto no añade ninguno: una cláusula de un estándar con el
				que no auditas es ruido en cada etiqueta SARIF, propiedad JUnit e informe.
			</p>
			<DataTable
				label="Valores de mappings"
				rowKey="value"
				columns={[
					{ key: "value", label: "Valor", width: "34%" },
					{ key: "adds", label: "Añade", wrap: true },
				]}
				rows={[
					{
						value: <code>'en301549'</code>,
						adds: "La cláusula del capítulo 9 de EN 301 549 de cada criterio, en todas las versiones que la tienen (V3.2.1 y V4.1.1)",
					},
					{
						value: (
							<>
								<code>'en301549:V3.2.1'</code>, <code>'en301549:V4.1.1'</code>
							</>
						),
						adds: "Lo mismo, solo para esa versión",
					},
				]}
			/>
			<CodeBlock lang="js" lines={["runDomRulesInPage(url, null, { mappings: ['en301549:V3.2.1'] }, null);"]} />
			<Callout tone="note" title="Obsoleto">
				<p>
					Los mapeos <code>en301549</code> pasan al pack de EN 301 549, <a href={pack}><code>@surea11y/pack-en301549</code></a>, y salen de core en
					la 2.0.0. Funcionan como antes, con un <code>console.warn</code> por proceso. Con el pack,{" "}
					<code>mappings: ['en301549']</code> toma el mismo nombre y da a cada resultado las mismas
					entradas, sin aviso.
				</p>
			</Callout>
			<p>
				Acepta un array o una cadena separada por comas, con nombres y versiones sin distinguir
				mayúsculas y minúsculas. Con <code>profile: 'en301549-v4.1.1'</code> las cláusulas de V4.1.1
				están ahí sin pedirlas, y <code>mappings</code> puede añadir más. Un nombre o versión para el
				que el motor no tiene tabla se ignora con un <code>console.warn</code>. Una ejecución que
				lleva cualquier otro estándar informa cuáles en <code>engine.mappings</code>, con la grafía
				canónica (<code>["en301549:V3.2.1"]</code>, o <code>["en301549"]</code> para todas las
				versiones).
			</p>
			<p>
				Solo cambia lo que nombra un resultado, nunca qué reglas se ejecutan ni sus resultados. El
				catálogo de reglas sigue la misma opción: <code>getChecksCatalog(engineOptions)</code>,{" "}
				<code>getCheckDefById(ruleId, engineOptions)</code>,{" "}
				<code>getChecksForRunOnly(runOnly, engineOptions)</code>,{" "}
				<code>getRulesCatalog(engineOptions)</code>,{" "}
				<code>getRulesForRunOnly(runOnly, engineOptions)</code> y{" "}
				<code>getCompositeRuleById(id, engineOptions)</code> nombran los estándares que nombraría un
				análisis con esas opciones, incluido un perfil cuando se aplicaría, así que una entrada del
				catálogo y un resultado siempre coinciden. Sin opciones, solo nombran WCAG. Una regla
				añadida mediante <code>customRules</code> conserva exactamente las asociaciones que declara.
				Qué son las cláusulas y en qué se diferencian las dos versiones está en{" "}
				<a href="/conformance/wcag-mapping/#en-301-549">Mapeo de conformidad con WCAG</a>.
			</p>

			<h2 id="advanced-selection-tags-and-rule-ids">Selección avanzada: etiquetas e ids de regla</h2>
			<p>
				Los campos siguientes seleccionan por las etiquetas que llevan las reglas y por ids de regla.
				Recurre a ellos para lo que no dicen un objetivo de WCAG y <code>bestPractices</code>: un
				criterio (<code>tags: ['wcag1412']</code>), una lista de reglas, una exclusión o un conjunto
				de etiquetas propio. Se combinan con <code>wcag</code> y{" "}
				<code>bestPractices</code>: lo que incluyen se añade a lo que estos seleccionan, y lo que
				excluyen se quita después.
			</p>
			<p>
				Hay <strong>dos formas independientes</strong> de indicarlos: el cuarto argumento (
				<code>runOnly</code>), o bien <code>engineOptions.rules</code>/<code>.tags</code>/
				<code>.tests</code>/<code>.includeMode</code>. Si <code>runOnly</code> contiene algún
				filtro, tiene prioridad; de lo contrario, el motor recurre a{" "}
				<code>engineOptions</code>.{" "}
				<strong>No combines ambos mecanismos: no se aplican simultáneamente. Elige uno.</strong>{" "}
				<code>engineOptions.rules</code>, <code>.tags</code> y <code>.tests</code> aceptan{" "}
				<code>{"{ include, exclude }"}</code>; una lista o una cadena simples son la lista de
				inclusión.
			</p>

			<h3 id="via-runonly-4th-argument">Mediante <code>runOnly</code> (4.º argumento)</h3>
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
				Un array o una cadena simples funcionan como forma abreviada:{" "}
				<code>runOnly: ['img-alt-present', 'button-name-present']</code> ejecuta esas reglas
				(un id compuesto incluye sus reglas), y <code>runOnly: ['wcag2a', 'wcag2aa']</code>{" "}
				equivale a <code>{"{ tags: ['wcag2a', 'wcag2aa'] }"}</code>. Un array no puede mezclar
				ids de regla y etiquetas, y cada valor tiene que nombrar una regla (integrada, compuesta
				o una de <code>engineOptions.customRules</code>) o una etiqueta: cualquier otra cosa
				lanza un error, para que una errata no pueda ejecutar en silencio todas las reglas o
				ninguna. Usa la forma de objeto para combinar ids y etiquetas o para excluir. Antes de la
				1.10.0, un array simple se ignoraba y se ejecutaban todas las reglas.
			</p>
			<DataTable
				label="Campos de runOnly"
				rowKey="field"
				columns={[
					{ key: "field", label: "Campo", width: "22%" },
					{ key: "type", label: "Tipo", width: "16%" },
					{ key: "meaning", label: "Significado", wrap: true },
				]}
				rows={[
					{
						field: <code>wcag</code>,
						type: <code>{"{ version, level }"}</code>,
						meaning: "Un objetivo de conformidad de WCAG: las reglas de los criterios de esa versión en ese nivel y en los inferiores. Consulta Seleccionar por objetivo de WCAG, más arriba.",
					},
					{
						field: <code>bestPractices</code>,
						type: <code>boolean</code>,
						meaning: "true añade las reglas de buenas prácticas. Consulta Añadir las buenas prácticas, más arriba.",
					},
					{ field: <code>includeRuleIds</code>, type: <code>string[]</code>, meaning: "Ejecuta solo estos IDs de regla (además, para un ID compuesto, sus reglas atómicas hijas)." },
					{ field: <code>excludeRuleIds</code>, type: <code>string[]</code>, meaning: "Nunca ejecuta estos, se aplica después de la inclusión." },
					{
						field: (
							<>
								<code>includeTestIds</code> / <code>excludeTestIds</code>
							</>
						),
						type: <code>string[]</code>,
						meaning: 'Misma coincidencia que arriba: se mantiene como un campo separado porque las reglas se llaman internamente "tests" (la unidad ejecutable atómica); funcionalmente idéntico a includeRuleIds/excludeRuleIds hoy en día.',
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
				<code>engineOptions</code> de más abajo: <code>includeRuleIds: 'img-alt-present, button-name-present'</code>{" "}
				y <code>includeRuleIds: ['img-alt-present', 'button-name-present']</code> son
				equivalentes.
			</p>
			<p>
				Los nombres se comprueban, aquí y en <code>engineOptions.rules</code>/<code>.tags</code>{" "}
				más abajo. Una lista de inclusión (<code>includeRuleIds</code>,{" "}
				<code>includeTestIds</code>, <code>tags</code>, el <code>values</code> heredado,{" "}
				<code>rules.include</code>, <code>tags.include</code>) en la que ningún valor nombra una
				regla o una etiqueta (una que lleva una regla o un resultado agregado, así que la etiqueta
				de un estándar se conoce aunque solo la lleven sus resultados agregados) lanza un error con{" "}
				<code>code: 'INVALID_RUN_ONLY'</code> y un mensaje que nombra el campo y los valores, ya
				que no seleccionaría nada y una ejecución sin reglas se lee como un resultado limpio. Una
				selección cuyos nombres existen todos pero cuyas partes se anulan entre sí (una regla
				incluida y excluida a la vez, reglas y etiquetas sin ninguna regla en común con{" "}
				<code>includeMode: 'and'</code>) tampoco ejecuta ninguna regla: el análisis avisa, nombrando
				las partes, y lanza <code>INVALID_RUN_ONLY</code> con <code>strictOptions</code>.{" "}
				<code>includeMode</code> es <code>'and'</code> u <code>'or'</code>; cualquier otro valor se
				lee como <code>'and'</code>, con un aviso, y lanza un error con <code>strictOptions</code>;
				en una integración de navegador, lo define <code>.includeMode('or')</code>. Un valor que no nombra nada junto a otros que sí, o en una lista de exclusión, se ignora con
				un <code>console.warn</code>. Antes de la 1.10.0, todos esos valores se ignoraban en
				silencio.
			</p>
			<p>
				Las nueve etiquetas de versión/nivel de WCAG, de <code>wcag2a</code> a{" "}
				<code>wcag22aaa</code>, siempre se conocen, la lleve o no alguna regla. Algunas no las lleva
				hoy ninguna (<code>wcag21aaa</code>, <code>wcag22a</code>, <code>wcag22aaa</code>): sus
				criterios no tienen ninguna regla automatizada, y eso no es una errata. En una lista de
				inclusión junto a otros valores, una etiqueta así se señala con un{" "}
				<code>console.info</code>, no con un aviso:
			</p>
			<CodeBlock
				lines={['[surea11y] runOnly.tags: no rules for WCAG 2.2 Level A ("wcag22a"); its criteria need manual review.']}
			/>
			<p>
				<code>engineOptions.logUntestedWcag: false</code> omite esa línea. Cuando todos los valores
				de una lista de inclusión son etiquetas así, no se ejecutaría nada, así que sigue lanzando{" "}
				<code>INVALID_RUN_ONLY</code>, explicando por qué. Junto a un objetivo{" "}
				<code>runOnly.wcag</code> o <code>bestPractices: true</code>, que seleccionan reglas
				propias, solo se señala. En una lista de exclusión no se toca.
			</p>
			<p>
				Los IDs de regla van sin prefijo (sin prefijo del motor), por ejemplo{" "}
				<code>'img-alt-present'</code>. Por compatibilidad con versiones anteriores, la
				coincidencia también acepta una forma heredada con el prefijo <code>a11ycore-</code> del
				mismo id (<code>'a11ycore-img-alt-present'</code>). Los ids se comparan sin distinguir
				mayúsculas y minúsculas, igual que las etiquetas: <code>'IMG-ALT-PRESENT'</code> selecciona{" "}
				<code>img-alt-present</code>, en toda lista que nombra reglas (<code>runOnly</code> en cada
				una de sus formas, <code>engineOptions.rules</code> y <code>engineOptions.tests</code>,
				inclusión y exclusión). No hay dos reglas cuyos ids difieran solo en mayúsculas, así que
				esto no puede seleccionar la equivocada.
			</p>
			<p>
				También se acepta la <strong>forma <code>{"{ type, values }"}</code></strong> como valor
				completo de <code>runOnly</code>:{" "}
				<code>{"{ type: 'tag', values: ['wcag2a', 'wcag2aa'] }"}</code> equivale a{" "}
				<code>{"{ tags: ['wcag2a', 'wcag2aa'] }"}</code>, y{" "}
				<code>{"{ type: 'rule', values: ['img-alt-present'] }"}</code> equivale a{" "}
				<code>{"{ includeRuleIds: ['img-alt-present'] }"}</code> (<code>'tags'</code> y{" "}
				<code>'rules'</code> también funcionan). <code>values</code> puede ser una cadena separada
				por comas, sus nombres se comprueban como cualquier id de regla o etiqueta, y las demás
				claves que lo acompañan (<code>excludeTags</code>, <code>excludeRuleIds</code>...) se siguen
				aplicando. Un <code>Set</code> de nombres se lee como la lista que contiene. Una clave que
				la forma de objeto no lee, junto a otras que sí, se ignora con un aviso. Cualquier otro{" "}
				<code>type</code> lanza <code>INVALID_RUN_ONLY</code>, igual que un <code>runOnly</code>{" "}
				que sea un número o un booleano, o un objeto sin ninguna clave que el motor lea (
				<code>{"{ includeRuleId: [...] }"}</code>): antes, cada uno de estos casos ejecutaba
				todas las reglas. Un array, una cadena o un objeto vacíos siguen significando la selección
				predeterminada.
			</p>

			<h3 id="which-criteria-a-scan-reports">Qué criterios informa un análisis</h3>
			<p>
				Un análisis informa el resultado agregado de un criterio (<code>rulesResults</code>) cuando
				la selección lo selecciona: un objetivo de WCAG o una etiqueta de versión/nivel, un perfil,
				el propio id del resultado agregado, o ninguna selección. También informa el resultado
				agregado de cada criterio que comprueba una regla que la selección{" "}
				<strong>nombró por sí misma</strong>, cuando esa regla se ejecutó:
			</p>
			<ul>
				<li>
					por su id (<code>includeRuleIds</code>, <code>includeTestIds</code>,{" "}
					<code>rules.include</code>, o la propia lista de reglas de un perfil),
				</li>
				<li>
					por una etiqueta que no es de WCAG (la de una regla personalizada, la de un pack o la de un
					estándar; las etiquetas de WCAG son las de versión/nivel, las de criterio como{" "}
					<code>wcag244</code>, y <code>wcag22-removed</code>, así que una etiqueta personalizada
					como <code>wcagteam</code> no lo es),
				</li>
				<li>
					por <code>optInRules</code>, o
				</li>
				<li>
					como regla de buenas prácticas (<code>bestPractices</code>).
				</li>
			</ul>
			<p>
				Una regla que el perfil de un estándar ejecuta solo porque su estándar la asocia (
				<code>mappedRules</code>) está nombrada para ese estándar, no por sí misma: añade los
				requisitos del estándar y ninguno de sus criterios de WCAG. Así, un perfil que ejecuta solo
				lo que pide su estándar informa únicamente de ese estándar (
				<a href="/configuration/packs/#profiles">Packs</a>); una regla que nombra su lista{" "}
				<code>rules</code> añade también sus criterios de WCAG. Antes de la 1.12.0, un análisis que
				nombraba reglas en lugar de criterios tenía un <code>rulesResults</code> vacío.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// The unnamed link fails link-name-present, and with it 2.4.4 and 4.1.2:",
					"runDomRulesInPage(url, null, {}, { includeRuleIds: ['link-name-present'] });",
					"// rulesResults: wcag-2.4.4-link-purpose-in-context: fail, wcag-4.1.2-name: fail",
				]}
			/>
			<ul>
				<li>
					<strong>El veredicto es el del propio resultado agregado.</strong> Una regla que falla
					hace fallar el criterio. Una regla que se supera no hace que se supere cuando el análisis
					dejó fuera las demás reglas del criterio: es <code>cantTell</code>, con{" "}
					<code>reasonCode</code> <code>composite.rollup.cantTell.notSelectedChild</code>, y cada
					regla que el análisis no seleccionó figura entre los contribuyentes como{" "}
					<code>missing</code> con <code>notSelected: true</code>. Con todas ellas seleccionadas y
					aprobadas, un criterio de WCAG sigue siendo <code>cantTell</code> (
					<code>composite.rollup.cantTell.partialCheck</code>), ya que las reglas de ningún
					criterio comprueban todavía todo lo que pide (consulta{" "}
					<a href="/conformance/wcag-mapping/">Mapeo de conformidad con WCAG</a>). El informe HTML muestra
					«Comprobado en parte: 1 de 2 comprobaciones no se seleccionó para este análisis» debajo. Consulta{" "}
					<a href="/results-reports/output-schema/#partly-checked">el esquema de salida</a>.
				</li>
				<li>
					<strong>Una etiqueta de criterio nombra su propio criterio.</strong>{" "}
					<code>tags: ['wcag244']</code> informa del 2.4.4, y no de los demás criterios que
					comprueban sus reglas (el 4.1.2 en el caso de <code>link-name-present</code>). Una regla
					que entra por el id de un resultado agregado, un objetivo de WCAG, una etiqueta de versión
					o de nivel, o un perfil de WCAG no añade ningún criterio: ahí la selección nombra los
					criterios. Así, un análisis que selecciona sus criterios informa lo mismo que antes.
				</li>
				<li>
					<strong>Se aplican la versión y el nivel de WCAG de la ejecución.</strong> Un criterio
					solo se añade si está vigente en <code>engine.wcagVersion</code> (
					<code>duplicate-id</code> por sí sola no añade el 4.1.1 con 2.2, y sí lo hace con{" "}
					<code>wcagVersion: '2.1'</code>), y si está en el nivel de la ejecución o por debajo,
					como haría un objetivo: <code>engineOptions.wcagLevel</code> cuando se indica (siguiente
					sección); si no, el nivel que da la selección (<code>runOnly.wcag.level</code>, o las
					etiquetas de versión/nivel junto a los ids de regla). Sin ninguno de los dos, se informan
					todos los niveles.
				</li>
				<li>
					<strong>Las exclusiones se aplican.</strong> Un resultado agregado que la selección
					excluye (<code>{"excludeRuleIds: ['wcag-4.1.2-name']"}</code>, o una etiqueta) no se
					añade. Una regla que excluyó quien llama cuenta como no seleccionada. Una regla que excluye
					un perfil acota el criterio: figura como <code>missing</code> sin{" "}
					<code>notSelected</code>, y un criterio del que exime el perfil nunca se añade.
				</li>
				<li>
					<strong>Los resultados agregados propios de un estándar</strong> (uno por requisito) se
					añaden del mismo modo, pero solo mientras el estándar está en juego: el perfil aplicado
					apunta a él, o la selección nombra su etiqueta, o <code>optInRules</code> lo desbloquea.
					Un análisis de WCAG nunca muestra los requisitos de un estándar que nadie pidió. Un perfil
					que no se aplicó, y <code>mappings</code> por sí solo, no ponen un estándar en juego. Con
					su perfil, solo se añade la versión del perfil; desbloqueado sin perfil, se añaden todas
					las versiones, igual que las informa un análisis seleccionado por su etiqueta. Esto vale
					tanto para un estándar o una lista de comprobación de un pack como para uno incluido: un
					perfil de lista de comprobación que nombra sus reglas (<code>tags: []</code>,{" "}
					<code>{"rules: [...]"}</code>) obtiene sus criterios de WCAG y sus propios elementos.
				</li>
				<li>
					<strong>La lista antes del análisis.</strong>{" "}
					<code>getRulesForRunOnly(runOnly, engineOptions)</code> enumera los resultados agregados
					que informa un análisis con esa selección y esas opciones, incluidos los añadidos, como
					entradas de <code>getRulesCatalog</code>. Los calcula con el mismo paso de agregación que
					el análisis, así que ambos coinciden; <code>getChecksForRunOnly</code> enumera las
					reglas. <code>getRulesCatalog(engineOptions)</code> enumera todos los resultados
					agregados que las opciones ponen a disposición, sea cual sea la selección. Una
					herramienta puede registrar qué comprueba un análisis antes de ejecutarlo; los
					constructores de las integraciones de navegador dan las mismas listas como{" "}
					<code>plannedChecks()</code> y <code>plannedCriteria()</code>.
				</li>
			</ul>

			<h3 id="giving-the-level-of-a-scan-that-names-checks-wcaglevel">
				Indicar el nivel de un análisis que nombra comprobaciones (<code>wcagLevel</code>)
			</h3>
			<p>
				Un análisis pensado como WCAG 2.2 AA que ejecuta solo algunas comprobaciones las nombra, e
				indica la versión en <code>engineOptions.wcagVersion</code>. Eso no dice ningún nivel, así
				que los criterios de esas comprobaciones se informan en todos los niveles:{" "}
				<code>contrast-computable</code> comprueba el 1.4.3 (AA) y el 1.4.6 (AAA), y se informan
				ambos. <code>engineOptions.wcagLevel</code> indica el nivel:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// Only the contrast checks of a WCAG 2.2 AA scan: 1.4.3 is reported, 1.4.6 is not.",
					"runDomRulesInPage(url, null,",
					"  { wcagVersion: '2.2', wcagLevel: 'AA' },",
					"  { includeRuleIds: ['contrast-computable'] });",
				]}
			/>
			<ul>
				<li>
					<strong>Valores.</strong> <code>'A'</code>, <code>'AA'</code> o <code>'AAA'</code>, en
					mayúsculas o minúsculas. Cualquier otro valor se ignora con un <code>console.warn</code>{" "}
					(<code>engineOptions.wcagLevel: ignoring "AA+"; use "A", "AA" or "AAA". ...</code>), y
					lanza <code>INVALID_ENGINE_OPTIONS</code> con <code>strictOptions</code>. La ejecución
					informa un nivel válido como <code>engine.wcagLevel</code>, escrito <code>'A'</code>,{" "}
					<code>'AA'</code> o <code>'AAA'</code>; sin la opción, <code>engine.wcagLevel</code> es el
					nivel que implica la selección, y no aparece cuando no implica ninguno.
				</li>
				<li>
					<strong>Decide lo que se informa, nunca lo que se ejecuta.</strong> La selección decide
					lo que se ejecuta, igual que sin la opción. Una comprobación por encima del nivel que la
					selección nombra se sigue ejecutando e informa su propio resultado; solo sus criterios
					por encima del nivel quedan fuera de <code>rulesResults</code>.
				</li>
				<li>
					<strong>Se aplica a todos los resultados agregados de WCAG, no solo a los criterios
					añadidos por comprobaciones nombradas.</strong> <code>wcagLevel: 'AA'</code> en un análisis
					completo, un perfil o una selección por etiquetas deja los criterios AAA fuera de{" "}
					<code>rulesResults</code>, mientras sus comprobaciones se siguen ejecutando e informando
					en <code>checksResults</code>. En esto difiere de <code>wcagVersion</code>, que nunca
					quita un resultado agregado que la selección selecciona: un análisis 2.2 sigue informando
					del 4.1.1, con sus reglas convertidas a <code>cantTell</code>. Un análisis sin la opción
					informa lo mismo que antes.
				</li>
				<li>
					<strong>Gana al nivel que implica la selección</strong> (<code>runOnly.wcag.level</code>,
					o el nivel más alto que nombran sus etiquetas de versión/nivel), igual que un{" "}
					<code>wcagVersion</code> explícito gana a la versión que implican. Un conflicto entre
					ambos no genera aviso, igual que no lo genera uno entre <code>wcagVersion</code> y la
					versión de un objetivo; <code>engine.wcagLevel</code> muestra el nivel por el que se
					filtraron los criterios.
				</li>
				<li>
					<strong>Un resultado agregado nombrado por id se informa tal como se nombró.</strong>{" "}
					<code>{"includeRuleIds: ['wcag-1.4.6-contrast-enhanced']"}</code> con{" "}
					<code>wcagLevel: 'AA'</code> informa del 1.4.6: la opción dice qué criterios informar, no
					que se quite uno que pidió quien llama. Un nivel que implican las propias etiquetas de la
					selección sigue filtrando un resultado agregado nombrado, igual que sin la opción.
				</li>
				<li>
					<strong>Los resultados agregados propios de un estándar</strong> no tienen nivel de WCAG
					y no se filtran por él. El perfil de un pack no puede indicar un nivel (sus etiquetas
					implican uno); quien lo llama puede pasar <code>wcagLevel</code>.
				</li>
				<li>
					<code>getRulesForRunOnly(runOnly, engineOptions)</code> la respeta, así que enumera lo
					que informa el análisis, y avisa de un valor no válido igual que el análisis, o lanza un
					error con <code>strictOptions</code>.
				</li>
			</ul>
			<p>
				Sin la opción, las etiquetas de versión/nivel junto a los ids de regla también dan un
				nivel, ya que el <code>includeMode: 'and'</code> predeterminado conserva las reglas
				nombradas que llevan una de ellas:{" "}
				<code>{"{ includeRuleIds: ['contrast-computable'], tags: wcagTags('2.2') }"}</code> ejecuta{" "}
				<code>contrast-computable</code> e informa solo del 1.4.3. Pero las etiquetas también
				deciden lo que se ejecuta: una regla nombrada sin etiqueta de WCAG (una regla de buenas
				prácticas como <code>region</code>, una regla personalizada sin etiquetas de WCAG), o una
				que comprueba solo criterios AAA, queda fuera de la ejecución, y una etiqueta de
				versión/nivel que no lleva ninguna regla (<code>wcag22a</code>) se señala con un{" "}
				<code>console.info</code>. <code>wcagLevel</code> indica el nivel sin cambiar lo que se
				ejecuta. En una integración de navegador, lo define el <code>.wcagLevel('AA')</code> del
				constructor.
			</p>

			<h3 id="filtering-by-wcag-version">Filtrado por versión de WCAG (2.0, 2.1, 2.2)</h3>
			<p>
				Cada regla y compuesto lleva exactamente una etiqueta de nivel de versión de origen de
				WCAG:{" "}
				<code>wcag2a</code>/<code>wcag2aa</code>/<code>wcag2aaa</code> para un Criterio de Éxito (SC)
				que sea línea base de WCAG 2.0, <code>wcag21a</code>/<code>wcag21aa</code>/<code>wcag21aaa</code>{" "}
				para uno introducido en WCAG 2.1 (por ejemplo, <code>1.3.5</code> <span lang="en">Identify
				Input Purpose</span>),{" "}
				<code>wcag22a</code>/<code>wcag22aa</code>/<code>wcag22aaa</code> para uno introducido
				en WCAG 2.2 (por ejemplo, <code>2.5.8</code> <span lang="en">Target Size Minimum</span>). Una
				regla obtiene{" "}
				<strong>solo</strong> la etiqueta de la versión de origen real de su criterio de éxito: un criterio de éxito
				introducido en 2.1 nunca lleva también la etiqueta <code>wcag2aa</code>, ya que no
				existe bajo un objetivo de conformidad de WCAG 2.0.
			</p>
			<p>
				<code>runOnly.wcag</code> selecciona un objetivo de conformidad en un solo campo (
				<a href="#selecting-by-wcag-target-runonlywcag">más arriba</a>), y deja fuera el 4.1.1 bajo
				2.2. Con etiquetas, dado que las versiones son acumulativas (2.1 = 2.0 + nuevo; 2.2 = 2.0 +
				2.1 + nuevo), selecciona un objetivo de conformidad de versión de WCAG combinando conjuntos
				de etiquetas: la coincidencia OR del motor sobre <code>tags</code> (cualquier coincidencia
				incluye la regla) hace el resto:
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
				<strong>Un criterio de éxito va en sentido contrario.</strong> WCAG 2.2 eliminó el criterio de éxito 4.1.1 <span lang="en">Parsing</span>:
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
			<p id="parsing-errata">
				Con un objetivo 2.0 o 2.1 ocurre lo mismo: las erratas de 2023 a WCAG 2.0 y 2.1 dan el
				4.1.1 por cumplido siempre para el contenido en HTML o XML, así que la regla pregunta en
				lugar de fallar, y <code>wcagVersionScope.by</code> es <code>"errata"</code>. La única
				excepción es un perfil cuyo estándar mantiene el texto del 4.1.1, como{" "}
				<code>en301549-v3.2.1</code> (<code>keepsParsing</code> en el perfil del estándar, ver{" "}
				<a href="/configuration/packs/#profiles">Packs</a>): ahí un id duplicado todavía puede dar{" "}
				<code>fail</code>. Core 1.14.0 y posteriores; antes, un objetivo 2.0 o 2.1 dejaba que
				fallara.
			</p>
			<p>La versión objetivo se resuelve en este orden:</p>
			<ol>
				<li>
					<code>engineOptions.wcagVersion</code>: <code>'2.0'</code>, <code>'2.1'</code> o{" "}
					<code>'2.2'</code>, si lo configuras.
				</li>
				<li>
					El <code>wcagVersion</code> del perfil de pack que aplica la ejecución, si nombra uno: un
					estándar basado en WCAG 2.1 cuyo perfil ejecuta solo las reglas que asocia no selecciona
					ninguna etiqueta de WCAG, así que indica la versión él mismo. Gana a la versión que
					implican las propias etiquetas del perfil. Un perfil que no surte efecto (anulado por una
					selección tuya) no aporta ninguna versión.
				</li>
				<li>La versión de un objetivo <code>runOnly.wcag</code>.</li>
				<li>
					Las etiquetas de origen de versión en tu propio filtro: un conjunto que llega como
					máximo hasta{" "}
					<code>wcag21a</code>/<code>wcag21aa</code> se interpreta como objetivo 2.1, uno que
					contiene cualquier{" "}
					<code>wcag22*</code> etiqueta como 2.2, uno con solo etiquetas <code>wcag2*</code>{" "}
					como 2.0. Solo cuentan esas nueve etiquetas: una etiqueta de criterio de éxito (
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
				La versión de destino resuelta se incluye en cada resultado como{" "}
				<code>engine.wcagVersion</code>, así puedes confirmar cuál usó realmente una ejecución.
			</p>
			<p>
				Si prefieres no ver la regla en absoluto bajo 2.2, exclúyela directamente: la etiqueta
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
				deja, sigue informando algo real (un id duplicado rompe <code>&lt;label for&gt;</code>,
				los enlaces de fragmento y <code>getElementById</code> diga lo que diga el estándar),
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
				tokens vacíos se descartan automáticamente. Una lista o una cadena simples, como{" "}
				<code>rules: ['img-alt-present']</code>, se leen como la lista de inclusión.
			</p>

			<h2><code>engineOptions</code>: el resto</h2>
			<CodeBlock
				lang="js"
				lines={[
					"const engineOptions = {",
					"  strictOptions: false,            // default false — true throws on an unknown option or a value of the wrong type",
					"  locale: 'en',                    // default 'en'; de-DE falls back to de, then to en per string",
					"  wcagVersion: '2.2',              // default '2.2' — the conformance target",
					"  wcagLevel: 'AA',                 // optional — the level of the criteria reported",
					"  profile: 'wcag22-aa',            // optional — a named conformance target, or a list of them",
					"  mappings: ['en301549'],          // optional — standards besides WCAG to name on each result",
					"  optInRules: 'all',               // optional — also run rules other standards add beyond WCAG",
					"  messages: { de: { /* key: text */ } },  // optional caller-supplied dictionaries; win over built-in ones",
					"  includeHiddenElements: false,    // default false — set true to evaluate hidden/collapsed subtrees too",
					"  includeShadowDom: true,          // default true — opt OUT with false to skip open shadow roots",
					"  fragment: false,                 // default false — set true when the scan target isn't a real page",
					"  embeddedAriaHidden: false,       // default false — a frame's document shown under aria-hidden=\"true\"",
					"  embeddedInert: false,            // default false — a frame's document shown under [inert]",
					"  topLevelDocument: true,          // optional — unset, a document shown in a frame is no page of its own",
					"  excludeSelectors: ['#cookie-banner', '.third-party-widget'],  // array or comma-separated string",
					"  styleSheetTexts: [{ href: 'https://cdn.example/site.css', text: '/* its CSS */' }],  // sheets the page can't read",
					"  timestamp: '2026-07-20T12:00:00Z',  // optional — engine has no built-in clock",
					"  perfStats: false,                // default false — internal timing counters, debug-only shape",
					"  profileRules: false,             // default false — per-rule timings; needs perfStats",
					"",
					"  contrast: {",
					"    mode: 'strictConformance',     // 'strictConformance' (default) | 'auditorAssist'",
					"    rootCanvasFallback: '#ffffff', // a canvas to measure on in place of the page's own; unset, the page's color scheme gives it",
					"    rootCanvasFallbackSet: true    // echoed on each result: whether rootCanvasFallback was given; read back, false means the default",
					"  },",
					"  visibilityMode: undefined,       // 'styleOnly' | 'styleAndGeometry'; unset: geometry with a layout, else styles",
					"",
					"  policyContract: 'a11y',          // 'a11y' (default) | 'generic' | inline contract object",
					"  policy: {                        // optional overrides on top of policyContract",
					"    coerceManualFailToCantTell: true",
					"  },",
					"",
					"  output: {",
					"    includeSelector: true,         // set false to suppress auto-filled selectors",
					"    includeHtml: true,",
					"    detail: 'full'                 // 'findings': pass/notApplicable results keep only rule, outcome, type",
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
					"  packs: [ /* rules and standards from outside core, see Packs */ ],",
					"",
					"  // Only read by runa11yCoreAcrossFrames. Ignored by runDomRulesInPage/runa11yCoreInPage.",
					"  pingWaitTime: 500,               // ms to wait for a child frame to answer a ping",
					"  frameWaitTime: 60000             // ms to wait for a child frame's full scan result",
					"};",
				]}
			/>
			<DataTable
				label="Otras engineOptions"
				rowKey="id"
				columns={[
					{ key: "option", label: "Opción", width: "22%" },
					{ key: "meaning", label: "Significado", wrap: true },
				]}
				rows={optionRows}
			/>

			<h3 id="catching-mistakes-in-the-options-strictoptions">Detectar errores en las opciones (<code>strictOptions</code>)</h3>
			<p>
				Una opción que el motor no lee se deja pasar: una regla personalizada puede leer ajustes
				propios de <code>ctx.engineOptions</code>, y una opción eliminada en una versión posterior
				no rompe un análisis. Así que, por defecto, una opción mal escrita se ignora, y el análisis
				se ejecuta como si no estuviera. Dos cosas lo indican:
			</p>
			<ul>
				<li>
					<strong>Siempre</strong>, una clave a una o dos letras de una conocida (sin distinguir
					mayúsculas y minúsculas) genera un aviso, incluidas las claves anidadas:{" "}
					<code>lcoale</code> produce{" "}
					<code>[surea11y] engineOptions: unknown option "lcoale" (did you mean "locale"?); ignored.</code>
				</li>
				<li>
					<strong>Siempre</strong>, un valor de tipo incorrecto genera un aviso y se lee como no
					indicado, igual que un <code>engineOptions</code> que no es un objeto. Las opciones de
					activar/desactivar (<code>includeShadowDom</code>, <code>includeHiddenElements</code>,{" "}
					<code>fragment</code>, <code>perfStats</code>, <code>profileRules</code>,{" "}
					<code>output.includeHtml</code>, <code>output.includeSelector</code>) aceptan{" "}
					<code>true</code> o <code>false</code>, o <code>'true'</code>, <code>'false'</code>,{" "}
					<code>'1'</code>, <code>'0'</code>, <code>1</code> y <code>0</code> tal como los escribe
					una línea de comandos: <code>perfStats: 'false'</code> está desactivada.
				</li>
				<li>
					<strong>Con <code>strictOptions: true</code></strong> (o <code>'true'</code>,{" "}
					<code>'1'</code> o <code>1</code>), todas las opciones se comprueban antes del análisis, y
					cualquier error lanza una excepción con <code>code: 'INVALID_ENGINE_OPTIONS'</code> que
					nombra cada uno, con <code>problems</code> enumerándolos como{" "}
					<code>{"{ path, kind, message, suggestion }"}</code>: una clave desconocida (
					<code>kind: 'unknown'</code>), en <code>engineOptions</code> o en uno de sus objetos, y un
					valor de tipo incorrecto o fuera de su conjunto (<code>kind: 'invalid'</code>), como{" "}
					<code>includeHiddenElements: 'yes'</code> o <code>contrast.mode: 'strict'</code>.
				</li>
			</ul>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, { strictOptions: true, lcoale: 'de' }, null);",
					"// Error: engineOptions: unknown option \"lcoale\" (did you mean \"locale\"?). (strictOptions)",
				]}
			/>
			<p>
				Las funciones de catálogo que aceptan <code>engineOptions</code> (
				<code>getChecksCatalog</code>, <code>getRulesCatalog</code>, <code>getCheckDefById</code>,{" "}
				<code>getCompositeRuleById</code>, <code>getChecksForRunOnly</code>,{" "}
				<code>getRulesForRunOnly</code>, <code>getTestsForRunOnly</code>) las comprueban del mismo
				modo, con las mismas palabras:{" "}
				<code>{"getRulesForRunOnly(runOnly, { wcagLevel: 'AA+' })"}</code> avisa, lee el nivel como
				no indicado y enumera lo que informa un análisis con esas opciones; con{" "}
				<code>strictOptions: true</code> lanza <code>INVALID_ENGINE_OPTIONS</code>, igual que el
				análisis. Una selección que se anula a sí misma (una regla incluida y excluida a la vez,
				partes sin ninguna regla en común) se señala como la señala el análisis: un aviso, y{" "}
				<code>INVALID_RUN_ONLY</code> con <code>strictOptions</code>.
			</p>
			<p>
				No se comprueban: los ajustes propios de una regla (<code>rules[ruleId]</code>), las claves
				de <code>messages</code> y <code>probes</code>, que el motor transmite sin leer; ni las
				reglas personalizadas, que tienen sus propias comprobaciones (
				<code>skippedCustomRules</code>). En TypeScript, <code>StrictEngineOptions</code> es el mismo
				conjunto de opciones sin la firma de índice que permite compilar cualquier clave, así que una
				opción mal escrita también es un error ahí.
			</p>

			<h3 id="rule-scoped-excludeselectors"><code>excludeSelectors</code> por regla</h3>
			<p>
				El <code>excludeSelectors</code> de nivel superior se aplica a <em>todas</em> las reglas:
				no hay forma de excluir un elemento de una sola regla mientras se siguen ejecutando
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
				Por qué querrías esto: el <code>&lt;mat-select&gt;</code> de <span lang="en">Angular Material</span> construye
				su estructura ARIA interna de una manera que dispara un falso positivo específicamente
				en <code>aria-required-children</code>, aunque el componente por lo demás esté bien. Con
				solo el <code>excludeSelectors</code> global, la única forma de silenciar ese falso
				positivo es <code>excludeSelectors: ['mat-select']</code>: lo cual también oculta{" "}
				<code>mat-select</code> a <em>todas las demás reglas</em>, incluidas{" "}
				<code>contrast-minimum</code> y <code>aria-allowed-attr</code>, eliminando
				silenciosamente cobertura real con la que esas comprobaciones nunca tuvieron problema.
				El ejemplo de arriba mantiene{" "}
				<code>mat-select</code> completamente visible para todas las reglas excepto la que falla
				incorrectamente con él.
			</p>
			<p>
				Las exclusiones efectivas para una regla dada son la <strong>unión</strong> de la lista
				global y la lista propia de esa regla: un elemento que coincide con cualquiera de las
				dos se elimina de los candidatos de esa regla. Una regla cuyos únicos elementos que
				fallarían quedan todos excluidos de esta manera informa{" "}
				<code>outcome: 'pass'</code> o <code>'notApplicable'</code> (siguiendo la convención
				propia de esa regla para el caso sin candidatos), con <code>occurrences: []</code>;
				nunca{" "}
				<code>outcome: 'fail'</code> con un array <code>occurrences</code> vacío, ya que el{" "}
				<code>fail</code> de una regla integrada siempre nombra lo que ha fallado. (Una regla que
				lanza un error es otro caso: informa <code>cantTell</code> con <code>error</code>{" "}
				definido; consulta <a href="/results-reports/output-schema/">el esquema de salida</a>.)
			</p>
			<p>
				Acepta las mismas formas que la opción global: un array (
				<code>['mat-select', 'mat-stepper']</code>) o una cadena separada por comas (
				<code>'mat-select, mat-stepper'</code>).
			</p>
			<p>
				Si estás usando un paquete de integración (<code>binding</code>) (<code>@surea11y/binding-base</code> y sus
				wrappers de Playwright/Puppeteer), consulta el propio README de esa integración para ver si
				su método constructor{" "}
				<code>.exclude()</code> ya tiene una forma por regla: esta es una forma de{" "}
				<code>engineOptions</code> documentada aquí a nivel del motor; no todas las integraciones la
				han incorporado todavía.
			</p>

			<h2>Recetas: combinar opciones para escenarios reales</h2>
			<p>
				<strong>Puerta de CI: solo WCAG 2.2 AA, ignorando un widget de terceros que no
				controlas</strong>
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
						"  excludeSelectors: ['#cookie-banner', '.intercom-launcher']",
						"}, { wcag: { version: '2.2', level: 'AA' } });",
					]}
				/>
			<p>
				Añade <code>bestPractices: true</code> junto a <code>wcag</code> para ejecutar también las
				reglas de buenas prácticas, que una puerta de WCAG suele informar sin fallar por ellas.
				Algunas pueden dar <code>fail</code> (<code>empty-heading</code>), así que una puerta que
				falla ante cualquier <code>fail</code> también falla por ellas.
			</p>
			<p>
				<strong>Auditor humano haciendo una pasada de contraste en profundidad en un navegador
				real</strong>: sacrifica algo de protección contra falsos positivos a cambio de más
				hallazgos. En un navegador real, las reglas de contraste ya comprueban el diseño, no solo
				los estilos calculados, así que solo hace falta configurar el modo de contraste. Se muestra con el <code>page.evaluate</code> de Puppeteer
				(acepta múltiples argumentos); si estás en Playwright, primero envuelve los cuatro
				argumentos posicionales en un solo objeto; consulta{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const result = await page.evaluate(runa11yCoreInPage, url, null, {",
					"  contrast: { mode: 'auditorAssist' }",
					"}, null);",
				]}
			/>
			<p>
				<strong>Reanálisis delimitado de una región tras un cambio de interfaz, omitiendo el
				shadow DOM</strong>: útil en una prueba a nivel de componente donde solo te importa el
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
				<strong>Salida para pruebas de snapshot</strong>: fija un <code>timestamp</code> para que
				la marca de tiempo del propio resultado no cambie entre ejecuciones, y deja desactivados{" "}
				<code>perfStats</code> y <code>profileRules</code>: sus tiempos varían, y su estructura no forma
				parte de la salida estable. Un snapshot también necesita el mismo DOM, las mismas opciones y
				las mismas condiciones de renderizado (navegador, viewport, fuentes) en cada ejecución; la
				marca de tiempo por sí sola no hace idénticos dos resultados.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
					"  timestamp: '2026-01-01T00:00:00Z'",
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
					"      // queryAllSmart applies excludeSelectors, the scope's shadow roots and",
					"      // the hidden-content filter; queryAll is the plain light-DOM query.",
						"      // ctx.helpers.dom reads the DOM so the page's markup can't redirect it.",
						"      const dom = ctx.helpers.dom;",
						"      const els = ctx.helpers.queryAllSmart('[onclick]');",
					"      const occurrences = els.map((el) => ({",
					"        selector: ctx.helpers.buildSelector(el),",
					"        html: dom.outerHTML(el),",
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

			<h2><code>customRules</code>: reglas registradas en tiempo de ejecución</h2>
			<p>
				Todas las reglas distribuidas están incorporadas en <code>src/core.js</code> en tiempo
				de compilación. <code>engineOptions.customRules</code> es la vía de escape en tiempo de
				ejecución: un array de descriptores de regla registrados solo para esa llamada; no se
				añade nada al catálogo estático, y nada persiste entre llamadas. Las funciones de catálogo
				aceptan las mismas <code>engineOptions</code> y enumeran lo que tiene un análisis con ellas:{" "}
				<code>getChecksCatalog(engineOptions)</code> enumera las reglas personalizadas válidas, con
				cada sustitución en el lugar de su regla integrada,{" "}
				<code>getCheckDefById(id, engineOptions)</code> las encuentra, y{" "}
				<code>getChecksForRunOnly(runOnly, engineOptions)</code> las selecciona igual que el
				análisis, y <code>getRulesForRunOnly(runOnly, engineOptions)</code> enumera los resultados
				agregados que añaden. Esto es deliberado, no
				una limitación que sortear: surea11y ya toma <code>engineOptions</code> nuevas en cada
				llamada sin configuración global mutable, y
				las reglas personalizadas siguen ese mismo modelo por llamada.
			</p>
			<p>
				Llamar a la biblioteca directamente es una forma de acceder; la CLI también expone esto
				vía <code>--custom-rules &lt;path&gt;</code> (un archivo local, cargado una vez por
				análisis). Consulta{" "}
				<a href="https://github.com/SureA11y/cli/blob/main/docs/CLI.md#custom-rules">
					la documentación de la CLI
				</a>
				.
			</p>
			<p>
				Una regla personalizada, como la de un pack, se ejecuta después de las reglas integradas, y
				los <code>ctx.helpers</code>, <code>ctx.engineOptions</code> y{" "}
				<code>ctx.inputs.probes</code> que recibe son de solo lectura: definir o eliminar cualquier
				cosa en ellos lanza un error (la regla se informa como <code>cantTell</code> con ese error),
				así que no puede cambiar lo que ven las demás reglas. No debe modificar la página: una que lo
				hace se nombra en un <code>console.warn</code>. Los resultados conservan el orden del
				catálogo. Lance o devuelva lo que sea, el análisis devuelve un resultado, y el resultado de
				la regla se convierte en datos simples, para que el resultado del análisis se pueda escribir
				como JSON y clonar.
			</p>
<p>
				Un descriptor tiene la <em>misma forma que la propia exportación de un módulo de regla
				interno</em>: si ya sabes cómo escribir un archivo de regla para este motor, ya conoces
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
					sí lo hace: por ejemplo, una llamada de Playwright{" "}
					<code>page.evaluate(runa11yCoreInPage, {"{ engineOptions }"})</code>, donde{" "}
					<code>engineOptions</code> cruza un límite de JSON/clonación estructurada que no
					puede llevar una referencia <code>Function</code> viva pero sí puede llevar una
					cadena. El motor reconstruye una cadena vía <code>new Function</code>, el mismo
					mecanismo que usa la compilación para incrustar el código fuente de cada regla
					integrada en el ejecutor dentro de la página. Sirve el código fuente de cualquier
					función: una función flecha, una declaración <code>function</code> o un método escrito
					en forma abreviada como en el ejemplo de arriba (<code>{"runInPage(ctx) {…}"}</code>,
					también <code>async</code>), cuyo <code>toString()</code> no es una expresión por sí
					solo. La reconstrucción necesita que <code>eval</code> esté permitido, así que una página
					cuya Content Security Policy prohíbe <code>'unsafe-eval'</code> omite una regla dada como
					cadena, y su motivo en <code>skippedCustomRules</code> indica que la causa es la política;
					ahí, pasa una función real.
				</li>
				<li>
					<code>meta</code> recibe los mismos valores predeterminados/validación que una regla
					en tiempo de compilación: omite lo que no necesites; <code>defaultSeverity</code>{" "}
					tiene como predeterminado <code>moderate</code>, <code>defaultConfidence</code> tiene
					como predeterminado <code>medium</code>, <code>type</code> tiene como predeterminado{" "}
					<code>automatic</code>, etc. Un valor fuera de su conjunto (<code>minor</code>/
					<code>moderate</code>/<code>serious</code>/<code>critical</code>; <code>high</code>/
					<code>medium</code>/<code>low</code>; <code>automatic</code>/<code>manual</code>, sin
					distinguir mayúsculas) es un <code>meta</code> que no supera la validación, y la regla
					se omite. Una <code>severity</code> que una regla devuelve fuera del conjunto se
					sustituye por su valor predeterminado, con una nota en <code>error</code>.
				</li>
				<li>
					Una regla personalizada cuyo <code>id</code> coincide con el de una regla integrada{" "}
					<strong>la sobrescribe para ese análisis</strong>, en lugar de ejecutar ambas. Dado
					que una regla personalizada con el mismo nombre es tan probable que sea una colisión
					accidental como una sobrescritura deliberada, cada colisión se muestra de dos formas:
					un <code>console.warn</code> que nombra el/los id(s), y un array{" "}
					<code>overriddenBuiltinIds</code> de nivel superior en el resultado (vacío cuando no
					hay colisión). Consulta <a href="/results-reports/output-schema/">el esquema de
					salida</a>. Los ids se comparan sin distinguir mayúsculas y minúsculas: una regla
					personalizada <code>IMG-ALT-PRESENT</code> sustituye a <code>img-alt-present</code> y toma
					su id, y un segundo aviso nombra ambas grafías.
				</li>
				<li>
					Una regla personalizada que se ejecutó cuenta para el resultado agregado de WCAG (
					<code>rulesResults</code>) de cada criterio al que se asocia, mediante{" "}
					<code>meta.wcagSc</code> o una entrada de WCAG en <code>meta.normativeMappings</code>,
					igual que una regla integrada: si falla, el resultado agregado falla. El resultado agregado
					la marca con <code>custom: true</code> entre sus contribuyentes y la enumera en{" "}
					<code>data.details.customChecksIds</code>. Una regla personalizada que la selección nombra
					por sí misma (por su id o por una de sus etiquetas) y que se ejecutó informa los
					resultados agregados de sus criterios aunque la selección no nombre ninguno de ellos (
					<a href="#which-criteria-a-scan-reports">"Qué criterios informa un análisis"</a>). Una
					sustitución cuenta donde dice su propia
					asociación: en el lugar de su regla integrada cuando se asocia a ese criterio, y en ningún
					resultado agregado cuando no se asocia a ninguno, con un aviso que nombra los resultados
					agregados que abandonó.
				</li>
				<li>
					Una regla personalizada se selecciona igual que una integrada, por su id y sus{" "}
					<code>meta.tags</code>. Un <code>runOnly</code> que nombra una regla personalizada que el
					análisis omitió lanza <code>INVALID_RUN_ONLY</code>, con el motivo por el que se omitió.{" "}
					<code>customRules</code> es una lista: una sola regla pasada por sí sola no se ejecuta, y
					figura en <code>skippedCustomRules</code>. Bajo un perfil o un objetivo de WCAG, una regla
					etiquetada como <code>best-practice</code>, o sin etiqueta de WCAG, no forma parte de la
					ejecución: figura en <code>skippedCustomRules</code>, con un <code>console.warn</code>, y
					se ejecuta cuando le das las etiquetas de los criterios que comprueba (
					<code>'wcag111'</code>) o añades <code>runOnly.bestPractices: true</code>. Una regla
					personalizada que la selección excluye (<code>{"excludeRuleIds: ['org-b']"}</code>,{" "}
					<code>rules.exclude</code>...) también figura ahí, con el motivo{" "}
					<code>excluded by the selection.</code> y <code>excluded: true</code>, y sin aviso. Una
					sustitución se ejecuta allí donde se habría ejecutado su regla integrada.
				</li>
				<li>
					Una regla personalizada puede informar un margen igual que una regla integrada: declara{" "}
					<code>meta.margin</code> (<code>{"{ measure, unit, limit }"}</code>) y devuelve{" "}
					<code>marginCandidates</code> (consulta{" "}
					<a href={`${core}/docs/RULE_AUTHORING.md#metamargin`}>
						<code>RULE_AUTHORING.md</code>, <code>meta.margin</code>
					</a>
					, la guía de autoría de reglas en GitHub). Un <code>meta.margin</code> mal formado se
					ignora, así que esa regla no informa ningún margen; el análisis continúa.
				</li>
				<li>
					Un descriptor inválido (<code>id</code> ausente/no-string, un <code>runInPage</code>{" "}
					que no es una función ni una cadena de código fuente reconstruible, un{" "}
					<code>applicability</code> que no se puede convertir en una función, un{" "}
					<code>meta</code> que no supera la validación, como <code>deprecated: true</code> sin{" "}
					<code>deprecation</code>, un id que ya tiene otra regla personalizada de la lista, o el
					id de una regla compuesta) se omite con un <code>console.warn</code> que nombra la regla
					y el motivo, y figura en el <code>skippedCustomRules</code> del resultado: el resto del análisis, incluidas todas las reglas integradas, sigue
					ejecutándose con normalidad. Esto no es un vacío de validación por corregir: una
					regla personalizada es código arbitrario proporcionado por quien la llama, así que
					"fallar cerrado en esta sola entrada, sin abortar el análisis" es el comportamiento
					predeterminado más seguro, reflejando cómo una{" "}
					<em>regla integrada</em> que lanza un error queda contenida en un{" "}
					<code>cantTell</code> para esa regla en lugar de hacer fallar toda la ejecución.
				</li>
				<li>
					Las reglas se ejecutan de forma síncrona. Un <code>runInPage</code> o un{" "}
					<code>applicability</code> que devuelve una Promise (una función <code>async</code>) se
					informa como <code>cantTell</code> con un <code>error</code> que lo indica, igual que un{" "}
					<code>runInPage</code> que devuelve algo que no es un objeto de resultado. Un{" "}
					<code>outcome</code> fuera de <code>pass</code>, <code>fail</code>,{" "}
					<code>cantTell</code> y <code>notApplicable</code> (como <code>'failed'</code>) pasa a
					ser <code>cantTell</code>, y <code>error</code> nombra el valor devuelto. El{" "}
					<code>type</code> de una regla viene de su <code>meta</code>: un <code>type</code> en lo
					que devuelve se ignora, con una nota en <code>error</code>.
				</li>
				<li>
					Los resultados aparecen en <code>checksResults</code> exactamente igual que los de
					cualquier otra regla, incluido el autocompletado automático de{" "}
					<code>selector</code>/<code>html</code>/<code>structuralPath</code> para ocurrencias{" "}
					<code>fail</code>/<code>cantTell</code> que solo adjuntan{" "}
					<code>{"{ __node }"}</code> (consulta <a href="/results-reports/output-schema/">el
					esquema de salida</a>).
				</li>
				<li>
					Un <code>fail</code> nombra lo que ha fallado. Un <code>fail</code> de una regla
					personalizada sin ocurrencias (un fallo de toda la página) se informa con una ocurrencia en
					el elemento del documento (<code>selector: 'html'</code>, código de motivo{" "}
					<code>FAIL_WITHOUT_OCCURRENCE</code>), para que JUnit, SARIF, las líneas base y el informe
					HTML lo muestren como el fallo que es.
				</li>
			</ul>

			<h2 id="packs">Packs: reglas y estándares de fuera de core</h2>
			<p>
				Un pack trae reglas, variantes de las reglas de core, un estándar o una lista de
				comprobación, y los mensajes que usan, desde un paquete independiente, sin una compilación de
				core. Pasa los packs a un análisis en <code>engineOptions.packs</code>; el análisis se
				ejecuta en un motor preparado con ellos, mediante los pasos que usa la compilación para las
				propias reglas de core, así que el estándar, los perfiles, los resultados agregados y las
				reglas opcionales de un pack se comportan como lo harían los de uno integrado. El motor se
				conserva para el siguiente análisis con los mismos objetos de pack, así que un rastreo que
				pasa los mismos packs a cada página los prepara una sola vez.
			</p>
			<CodeBlock
					lang="js"
					lines={[
						"const { runDomRulesInPage, getChecksCatalog } = require('@surea11y/core');",
						"const acmePolicy = require('./acme-policy-pack');",
						"",
						"const result = runDomRulesInPage(url, null, { packs: [acmePolicy], profile: 'acme-web-2026' });",
						"result.engine.packs; // ['@acme/a11y-policy@1.0.0']",
						"getChecksCatalog({ packs: [acmePolicy] }); // core's rules and the pack's",
					]}
				/>
			<p>
				Un pack que no encaja con core (su rango <code>core</code> excluye esta versión, un id de
				regla sin el espacio de nombres, una clave de diccionario que core ya tiene) se omite con un{" "}
				<code>console.warn</code>, figura en el <code>skippedPacks</code> del resultado como{" "}
				<code>{"{ name, reason }"}</code>, y el análisis se ejecuta sin él; con{" "}
				<code>strictOptions</code> lanza un error, con <code>code: 'INVALID_ENGINE_OPTIONS'</code>.
				Los packs que chocan entre sí lanzan un error. En
				una página, un pack se registra primero con <code>packScript(packs)</code> y se nombra en{" "}
				<code>engineOptions.packs</code> como <code>name@version</code>. Qué contiene un pack, cómo
				usar uno desde cada integración, los test matchers y la CLI, y cómo escribir uno, está en{" "}
				<a href="/configuration/packs/">Packs</a>.
			</p>

			<h2><code>contextSelector</code> (2.º argumento del ejecutor, no un campo de <code>engineOptions</code>)</h2>
			<p>
				Un selector CSS (o array de selectores) que delimita el análisis a uno o más subárboles,
				resuelto vía <code>document.querySelectorAll</code> (todas las coincidencias, no solo la
				primera). Pasa <code>null</code> para analizar todo el documento.
			</p>
			<ul>
				<li>
					<strong>Un selector que no coincide con nada no analiza nada.</strong> Todas las reglas
					informan <code>notApplicable</code>, incluidas las de nivel de página, y el{" "}
					<code>contextMatch</code> del resultado lo indica:{" "}
					<code>{"{ elementCount: 0, unmatchedSelectors: ['#mian'] }"}</code> (consulta{" "}
					<a href="/results-reports/output-schema/#top-level-result">el esquema de salida</a>).
					La ejecución también registra un <code>console.warn</code>. Un ámbito que la página no
					tiene no se amplía a toda la página: un resultado sobre contenido que nunca pediste, con
					un <code>pass</code> de página completa entre medias, se leería como un resultado sobre
					la parte que sí pediste. En un array, un selector que no coincide con nada figura en{" "}
					<code>unmatchedSelectors</code> mientras los demás se analizan con normalidad, así que
					un contenido que solo a veces está en la página, como un banner de cookies, puede
					estar en la lista. Antes de la 1.10.0, un ámbito sin coincidencias recurría a todo el
					documento, sin ninguna indicación en el resultado.
				</li>
				<li>
					<strong>Un selector que el navegador no puede analizar lanza un error</strong>, solo o
					en un array, antes de que se ejecute ninguna regla:{" "}
					<code>contextSelector: "#main[" is not a valid CSS selector.</code> El error lleva{" "}
					<code>code: 'INVALID_CONTEXT_SELECTOR'</code> y <code>selector</code>, el selector que
					ha fallado. A diferencia de un selector que no coincide con nada, siempre es un error en
					la llamada. <code>runa11yCoreAcrossFrames</code> se rechaza con el mismo error. Un error
					que cruza <code>page.evaluate</code> (Playwright, Puppeteer) conserva solo su mensaje,
					por eso el mensaje nombra la opción y el selector. Antes de la 1.10.0, un selector
					inválido se omitía, así que por sí solo analizaba todo el documento.
				</li>
				<li>
					<strong>Cualquier cosa que no sea un selector, un array de selectores o{" "}
					<code>null</code> lanza el mismo error</strong>, nombrando lo que se pasó: un elemento,
					una NodeList, un objeto <code>{"{ include, exclude }"}</code>, un número o un elemento del
					array que no es una cadena (
					<code>contextSelector[1] must be a CSS selector, not the number 5.</code>). Pasa en su
					lugar un selector que coincida con el elemento, y pon lo que dejaría fuera un{" "}
					<code>exclude</code> en <code>engineOptions.excludeSelectors</code>.
				</li>
				<li>
					<strong>Una sola cadena</strong> puede ser en sí misma una lista de selectores
					separados por comas (semántica de unión CSS habitual):{" "}
					<code>'#a, #b'</code> analiza tanto <code>#a</code> como{" "}
					<code>#b</code>.
				</li>
				<li>
					<strong>Un array de cadenas</strong> analiza la unión de las coincidencias de cada
					selector:{" "}
					<code>['#a', '.card']</code> se comporta igual que <code>'#a, .card'</code>; la forma
					de array existe para quienes construyen la lista de forma programática.
				</li>
				<li>
					<strong>Shadow DOM.</strong> Con <code>includeShadowDom</code> (el valor
					predeterminado), un ámbito incluye las raíces shadow que contiene, y un ámbito que es él
					mismo un host shadow incluye su propia raíz shadow. El selector se compara con el
					documento, así que no puede seleccionar un elemento <em>dentro</em> de una raíz shadow;
					delimita a su host en su lugar.
				</li>
				<li>
					Las regiones superpuestas/anidadas se deduplican automáticamente: un elemento
					alcanzable desde más de una raíz coincidente solo se informa una vez, no una vez por
					región.
				</li>
				<li>
					<strong>Qué significa un resultado delimitado.</strong> La mayoría de las reglas juzgan
					cada elemento por sí solo, y juzgan los elementos del ámbito exactamente igual que en un
					análisis de toda la página. Dos tipos de regla dependen de la página que los rodea. Las
					reglas de página completa (<code>page-title-present</code>,{" "}
					<code>landmark-one-main</code> y el resto de las que figuran en <code>fragment</code>{" "}
					más arriba) informan <code>notApplicable</code>. Las reglas que comparan elementos en
					toda la página (<code>landmark-unique</code>,{" "}
					<code>landmark-no-duplicate-banner</code>, <code>-contentinfo</code> y{" "}
					<code>-main</code>, <code>landmark-banner-is-top-level</code>,{" "}
					<code>-complementary-</code>, <code>-contentinfo-</code> y{" "}
					<code>-main-is-top-level</code>, <code>accesskeys</code>, <code>heading-order</code>,{" "}
					<code>identical-links-same-purpose</code>, <code>identical-iframes-same-purpose</code>)
					siguen informando lo que encuentran dentro del ámbito, ya que dos landmarks que ahí
					comparten nombre lo comparten en cualquier página, pero informan{" "}
					<code>notApplicable</code> en lugar de <code>pass</code>: el análisis solo vio parte de
					la página, así que no puede afirmar que la página esté bien. <code>duplicate-id</code>{" "}
					y <code>duplicate-id-aria</code> comparan cada elemento del ámbito con todo el
					documento, ya que su duplicado puede estar fuera del ámbito, e informan de un elemento
					del ámbito cuyo id aparece en cualquier otro lugar. Su <code>pass</code> significa que
					ningún elemento del ámbito comparte id con otro elemento de la página; un par duplicado
					completamente fuera del ámbito no se informa, como en cualquier regla, así que no
					afirma que toda la página esté libre de duplicados. <code>target-size-minimum</code>{" "}
					juzga los objetivos del ámbito frente a vecinos de cualquier parte del documento, ya
					que la excepción de espaciado depende de lo que la página pone junto a un objetivo.{" "}
					<code>text-spacing-content-loss</code> juzga el texto del ámbito y comprueba si llega a
					solaparse con texto de cualquier parte de la página.
				</li>
			</ul>
		</>
	);
}
