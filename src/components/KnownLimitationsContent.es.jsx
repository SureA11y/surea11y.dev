import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const remedyRows = [
	{
		id: "interaction",
		situation: "El contenido aparece solo tras un clic, un hover o una carga de datos",
		remedy: "Lleva tú mismo la página a ese estado y luego analízala. Analiza cada estado que importe.",
	},
	{
		id: "layout",
		situation:
			"Una comprobación necesita diseño: tamaño del objetivo, espaciado del texto, contraste frente a lo que se pinta bajo el texto",
		remedy: (
			<>
				Analiza en un navegador real. jsdom no tiene diseño (el{" "}
				<code>engine.environment.layout</code> del resultado es <code>false</code>), así que estas
				reglas miden menos ahí o informan <code>notApplicable</code>, como indican las secciones
				siguientes.
			</>
		),
	},
	{
		id: "keyboard",
		situation: "Un requisito trata del manejo con teclado, como una trampa de teclado",
		remedy: "Pruébalo con un teclado. Ningún análisis lo cubre.",
	},
	{
		id: "canttell",
		situation: (
			<>
				Un resultado es <code>cantTell</code>
			</>
		),
		remedy: (
			<>
				Sigue los pasos de <code>howToCheck</code> de la ocurrencia y decídelo a mano.{" "}
				<code>uncertainty</code> dice qué faltaba, y <code>lean</code> hacia dónde apunta la
				evidencia de la página (consulta el{" "}
				<a href="/results-reports/output-schema/#how-to-check">esquema de salida</a>).
			</>
		),
	},
	{
		id: "responsive",
		situation: "La página es adaptable",
		remedy: "Analiza con cada ancho que te importe.",
	},
	{
		id: "differ",
		situation: "Dos ejecuciones de la misma página difieren",
		remedy: (
			<>
				Compara <code>engine.version</code> y <code>engine.environment</code> (viewport, fuentes e
				imágenes aún cargando), y recarga la página entre análisis.
			</>
		),
	},
	{
		id: "no-failures",
		situation: "Un análisis no informa de fallos",
		remedy: (
			<>
				Eso no es una declaración de conformidad. Consulta{" "}
				<a href="/conformance/wcag-mapping/">Mapeo de conformidad con WCAG</a>.
			</>
		),
	},
];

export function KnownLimitationsContent() {
	return (
		<>
			<p>
				Qué no evalúa el motor, qué depende de dónde se ejecuta un análisis (jsdom, un navegador
				o los propios scripts de la página) y qué necesita la revisión de una persona. Algunos
				puntos son decisiones de diseño, cada una con su razonamiento; cada uno indica qué no
				puede establecer un análisis y, cuando lo hay, qué hacer al respecto. Léelo antes de
				confiar en un resultado sin hallazgos.
			</p>

			<h2>Qué hacer al respecto</h2>
			<DataTable
				label="Qué hacer con cada limitación"
				rowKey="id"
				columns={[
					{ key: "situation", label: "Si…", width: "40%" },
					{ key: "remedy", label: "Entonces…" },
				]}
				rows={remedyRows}
			/>
			<p>Las secciones siguientes dan las razones.</p>

			<h2 id="outside-what-one-scan-can-see">Fuera de lo que un análisis puede ver</h2>
			<p>
				Un análisis lee la página en un momento, en un estado y en un viewport: el DOM, sus
				estilos calculados y, en un navegador real, su diseño. No usa la página como lo hace una
				persona. No la recorre con un teclado, no abre sus menús, no espera a sus datos ni cambia
				su tamaño. (En un navegador, algunas reglas enfocan un elemento o añaden una hoja de
				estilo mientras dura su comprobación, y lo restablecen; consulta la sección siguiente.)
				Los puntos de aquí necesitan ese tipo de interacción en el tiempo, así que otra regla no
				puede cubrirlos. Necesitan una prueba de interacción o una persona:
			</p>
			<ul>
				<li>
					<strong>Detección de trampas de teclado</strong> (WCAG 2.1.2): requiere mover el foco
					por la página y observar dónde termina, algo que ninguna lectura única del DOM puede
					hacer. Se ha definido el alcance de una técnica que funcionaría (consulta la sección
					sobre trampas de teclado de{" "}
					<a href={`${core}/docs/ACT_RULE_MAPPING.md#keyboard-trap-detection-scoping-notes`}>
						<code>ACT_RULE_MAPPING.md</code>
					</a>
					), pero no está implementada: un análisis no explora las interacciones del usuario ni
					los estados a los que llevan, y ninguna de las comprobaciones que modifican la página
					brevemente mueve el foco por ella como lo haría la detección de trampas. Mientras tanto,
					nada en el marcado estático la sustituye.
				</li>
				<li>
					<strong>Reflujo / recorte al aplicar zoom</strong> (WCAG 1.4.10): requiere una medición
					real del diseño (<code>clientWidth</code>/<code>scrollWidth</code>) en un viewport
					simulado equivalente a 320px. A diferencia de algunas heurísticas basadas en
					declaraciones CSS presentes en otras partes de este motor, no existe ningún sustituto en
					marcado estático para determinar si "el contenido se recorta al 400% de zoom".
				</li>
				<li>
					<strong>Estado dinámico o posterior a la interacción</strong>: todo lo que solo existe
					después de un clic, un hover o una carga de datos asíncrona (el contenido de un modal,
					las opciones de un desplegable, los mensajes de error de validación de un formulario) es
					invisible para un análisis del DOM <em>actual</em> de la página. Si tu framework lo
					renderiza de forma anticipada (incluso fuera de pantalla u <code>hidden</code>), es
					analizable; si solo existe tras la interacción, no lo es, a menos que produzcas esa
					interacción tú mismo antes de analizar (por ejemplo, haz clic en el botón y{" "}
					<em>luego</em> analiza). Analizar el estado abierto comprueba lo que hay en él, no si una
					persona que usa teclado o lector de pantalla puede abrirlo, usarlo y cerrarlo.
				</li>
			</ul>

			<h2>Dependientes del entorno: depende de cómo lo ejecutes</h2>
			<ul>
				<li>
					<strong>jsdom (Node, sin navegador real) no tiene motor de diseño CSS.</strong> Las
					reglas que necesitan geometría real (sobre todo <code>target-size-minimum</code>, WCAG
					2.5.8, necesita un <code>getBoundingClientRect()</code> real) informan{" "}
					<code>notApplicable</code> bajo jsdom puro en lugar de adivinar. Ejecuta bajo un
					navegador real (Puppeteer/Playwright, consulta{" "}
					<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a> Patrón 2) para
					obtener resultados reales de estas reglas.
				</li>
				<li>
					<strong>
						Saber si el texto hace salto de línea requiere diseño, así que los hallazgos de
						text-spacing en texto que no hace salto se informan para revisión.
					</strong>{" "}
					WCAG 1.4.12 y las reglas ACT que lo sustentan se aplican solo a texto que contiene un
					salto de línea suave, algo que un análisis estático no puede determinar.{" "}
					<code>avoid-inline-spacing</code> trata el texto como si hiciera salto de línea por
					defecto, así que un valor forzado ordinario por debajo de la métrica sigue fallando;
					cuando el salto de línea no es posible por una razón que <em>sí</em> es visible sin
					diseño (texto al que no se le permite hacer salto o un elemento de ancho fijo dentro de
					un ancestro con desplazamiento horizontal), informa <code>cantTell</code> en su lugar. El
					texto que nunca hace salto de línea por otro motivo sigue informándose como fallo.
				</li>
				<li>
					<strong>El motor se ejecuta sobre los objetos integrados de JavaScript de la propia
					página.</strong> Una página cuyos scripts rompen uno del que depende (
					<code>Array.prototype.filter</code>, <code>Map</code>, <code>JSON.stringify</code>,{" "}
					<code>String.prototype.toLowerCase</code> y otros) detiene el análisis con un error de
					código <code>PAGE_BUILTINS_BROKEN</code> que nombra cada uno, en lugar de dar un resultado
					que parece correcto y es erróneo; uno roto antes de inyectar el bundle (
					<code>Object.keys</code>) impide que el bundle se cargue. Una página que añade{" "}
					<code>then</code> a <code>Object.prototype</code> se analiza como cualquier otra. Los
					métodos del DOM que una página sustituye (<code>getComputedStyle</code>,{" "}
					<code>querySelectorAll</code>, <code>getBoundingClientRect</code>) no se comprueban: las
					reglas leen lo que devuelven.
				</li>
				<li>
					<strong>Un nombre no se calcula a partir de contenido anidado a más de 256 niveles de
					profundidad.</strong>{" "}
					El recorrido se detiene ahí (Chrome no da ningún nombre a partir de contenido a 100 niveles
					de profundidad), así que{" "}
					<a href="/rules/button-name-present/"><code>button-name-present</code></a>,{" "}
					<a href="/rules/link-name-present/"><code>link-name-present</code></a>, las reglas de
					nombre de elemento de menú, opción, summary, pestaña, tooltip y elemento de árbol, y{" "}
					<a href="/rules/empty-heading/"><code>empty-heading</code></a> preguntan (
					<code>name_contentTooDeep</code>) por un elemento cuyo único nombre está más abajo; otras
					reglas que obtienen el nombre del contenido leen ese contenido como vacío.
				</li>
				<li>
					<strong>El contenido de una raíz shadow cerrada no se puede leer.</strong> Ningún script
					llega dentro de <code>{"attachShadow({ mode: 'closed' })"}</code> ni de un{" "}
					<code>shadowrootmode="closed"</code> declarativo, así que el motor no puede ver el nombre
					que un navegador obtiene de ahí. <code>button-name-present</code> y{" "}
					<code>link-name-present</code>, y las reglas de nombre de elemento de menú, opción,
					pestaña, elemento de árbol, summary y tooltip, preguntan por un elemento cuyo nombre
					podría venir de un elemento personalizado que se renderiza pero no muestra contenido
					legible, en lugar de hacerlo fallar. Una raíz cerrada en un elemento incorporado (un{" "}
					<code>&lt;span&gt;</code>) parece una vacía, como un icono dibujado con CSS, así que un
					botón sobre una sigue fallando. Comprueba a mano lo que expone ese componente, por
					ejemplo con un lector de pantalla.
				</li>
				<li>
					<strong>
						No se puede leer un nombre o un estado que un elemento personalizado define mediante{" "}
						<code>ElementInternals</code>.
					</strong>{" "}
					<code>{"this.attachInternals().ariaLabel = 'Save'"}</code> da nombre al elemento en todos
					los navegadores, pero ningún script puede volver a leerlo. Cuando un componente guarda
					sus internals en una propiedad (<code>_internals</code>, <code>internals</code>,{" "}
					<code>internals_</code>, <code>__internals</code>), el motor los lee a través de ella, y
					aprueba o hace fallar el elemento según lo que digan. Para cualquier otro elemento
					personalizado definido sin nombre (o sin un estado obligatorio), las reglas de nombre y{" "}
					<a href="/rules/aria-required-attr/"><code>aria-required-attr</code></a> preguntan (
					<code>name_internals</code>, <code>state_internals</code>) en lugar de hacerlo fallar.
					Compruébalos en el árbol de accesibilidad del navegador, o instala el hook de internals
					opcional antes de que se ejecuten los scripts de la página:{" "}
					<code>installInternalsHook()</code> en cada integración (consulta{" "}
					<a href="/getting-started/">Primeros pasos</a>) y en test-matchers, o{" "}
					<code>internalsHookScript()</code> de core para una página propia (consulta{" "}
					<a href={`${core}/docs/INTEGRATION.md#reading-private-elementinternals-the-internals-hook`}>
						<code>INTEGRATION.md</code>
					</a>
					, que muestra dónde instalarlo). El hook registra los internals de cada elemento para
					el análisis, así que también reconoce un elemento que nunca adjuntó ninguno. Un rol
					definido solo mediante internals (<code>internals.role</code>) se lee donde se leen los
					internals, a través de una propiedad o del hook, como el rol predeterminado del
					elemento; guardado en un campo privado sin el hook, no se ve, y no se pregunta por el
					elemento, ya que casi cualquier componente podría tener uno. Los elementos incorporados,
					y los elementos personalizados que no están definidos, se juzgan como antes.
				</li>
				<li>
					<strong>No se pueden enumerar los manejadores de eventos añadidos desde script.</strong>{" "}
					Un manejador añadido con <code>addEventListener</code>, o asignado como propiedad (
					<code>el.onclick = fn</code>), no deja nada en el marcado y ningún script puede leerlo,
					así que las reglas de teclado (
					<a href="/rules/click-handler-keyboard-operable/"><code>click-handler-keyboard-operable</code></a>,{" "}
					<a href="/rules/mouse-only-event-handlers/"><code>mouse-only-event-handlers</code></a>)
					solo juzgan los atributos de manejador en línea: un <code>role="button"</code> enfocable
					que recibe su manejador de clic desde script no se informa (por uno que no puede recibir
					el foco pregunta igualmente{" "}
					<a href="/rules/widget-keyboard-focusable/"><code>widget-keyboard-focusable</code></a>), un
					manejador de teclado añadido desde script no puede justificar un <code>onclick</code> en
					línea, y <code>password-paste-enabled</code> no puede saber si un manejador de pegado
					añadido desde script devuelve el texto que cancela un <code>onpaste</code> en línea.
					Instala el hook opcional de manejadores (<code>listenerHookScript()</code>) antes de que
					se ejecuten los scripts de la página: las reglas juzgan entonces también los manejadores
					que registra y, donde no vio ningún manejador de teclado, hacen fallar un control que
					Intro y Espacio no pueden accionar. Un manejador de clic que un framework añade a su
					elemento raíz sirve a elementos que nada nombra, así que incluso con el hook esos se
					juzgan por su marcado. Dónde instalarlo:{" "}
					<a href={`${core}/docs/INTEGRATION.md#seeing-listeners-added-from-script-the-listener-hook`}>
						<code>INTEGRATION.md</code>
					</a>
					, en GitHub.
				</li>
				<li>
					<strong>No se puede ver después cómo se llenó una región viva.</strong> Un mensaje de
					estado se anuncia cuando una región viva cambia mientras la tecnología de asistencia
					puede alcanzarla (4.1.3), pero un análisis ve la página en un momento. Sin ayuda,{" "}
					<a href="/rules/live-region-announcements/"><code>live-region-announcements</code></a>{" "}
					solo juzga lo que hay: una región viva oculta a la tecnología de asistencia con{" "}
					<code>aria-hidden</code> o <code>inert</code>, o detrás de un{" "}
					<code>&lt;dialog&gt;</code> modal abierto, o que se quedó en <code>aria-busy</code>. Con
					el hook opcional de regiones vivas (<code>liveRegionHookScript()</code>), pregunta además
					por una región que la página añadió ya con su texto, o que mostró y llenó a la vez, y{" "}
					<code>getAnnouncements()</code> enumera lo que la página dejó disponible para anunciar.
					Ninguno de los dos dice qué pronunció un lector de pantalla: eso depende del lector. El
					hook no ve dentro de los shadow roots. Detalles:{" "}
					<a href={`${core}/docs/INTEGRATION.md#seeing-what-live-regions-are-given-the-live-region-hook`}>
						<code>INTEGRATION.md</code>
					</a>
					, en GitHub.
				</li>
				<li>
					<strong>
						Un análisis hecho con un diálogo modal abierto ve el diálogo, no la página.
					</strong>{" "}
					Un <code>&lt;dialog&gt;</code> abierto con <code>showModal()</code> vuelve inerte el resto
					del documento, y los navegadores solo exponen el diálogo a la tecnología de asistencia. Un
					diálogo abierto con el atributo <code>open</code> o con <code>show()</code> no es modal,
					aunque tenga <code>aria-modal="true"</code>: la página de detrás sigue siendo alcanzable, y
					el motor la juzga. Bajo jsdom, que no tiene capa superior, un{" "}
					<code>&lt;dialog aria-modal="true"&gt;</code> abierto se toma en cambio como modal, lo más
					cercano que el motor puede saber ahí. El motor hace lo mismo que el navegador: el
					contenido detrás del diálogo queda fuera de todas las reglas, igual que el resto del
					contenido oculto, y las reglas sobre la estructura de la propia página (
					<a href="/rules/page-has-heading-one/"><code>page-has-heading-one</code></a>,{" "}
					<a href="/rules/landmark-one-main/"><code>landmark-one-main</code></a>,{" "}
					<a href="/rules/bypass-blocks-present/"><code>bypass-blocks-present</code></a>,{" "}
					<a href="/rules/region/"><code>region</code></a>) informan <code>notApplicable</code>,
					porque el análisis no puede ver esa estructura. Vuelve a analizar la página con el
					diálogo cerrado para juzgar lo que hay detrás. Un modal propio, un elemento mostrado con{" "}
					<code>role="dialog"</code> o <code>role="alertdialog"</code> y{" "}
					<code>aria-modal="true"</code>, también deja esas reglas de estructura en{" "}
					<code>notApplicable</code>; <code>aria-modal</code> no vuelve nada inerte, así que todas
					las demás reglas siguen juzgando la página de detrás. Un diálogo modal dentro de un shadow
					root abierto cuenta como uno del documento; uno en un shadow root cerrado no se puede
					encontrar. Un modal propio sin <code>aria-modal="true"</code> solo se trata a través del{" "}
					<code>inert</code> o el <code>aria-hidden</code> que la página pone en el resto, que
					ocultan la página pero no indican a las reglas de estructura que hay un diálogo abierto.
				</li>
				<li id="framed-documents">
					<strong>Un documento mostrado en un frame no se juzga como una página propia.</strong> En
					un frame, las reglas sobre la página (<code>page-title-present</code>,{" "}
					<code>page-title-patterns</code>, <code>html-lang-attr-present</code>,{" "}
					<code>meta-viewport-zoom-enabled</code>, <code>meta-viewport-large</code>,{" "}
					<code>page-has-heading-one</code>, <code>landmark-one-main</code>,{" "}
					<code>bypass-blocks-present</code> y <code>region</code>) son{" "}
					<code>notApplicable</code>: la página que rodea el frame es la que tiene el título, el
					idioma y las regiones de referencia que usan las personas, y un navegador ignora el{" "}
					<code>&lt;meta&gt;</code> viewport de un documento en un frame. Un ejecutor de pruebas que
					muestra la página bajo prueba en un frame propio establece{" "}
					<code>engineOptions.topLevelDocument: true</code>, para que esa página se juzgue como la
					página (<a href="/getting-started/cypress/">@surea11y/cypress</a> lo hace).{" "}
					<code>runa11yCoreAcrossFrames</code> lee un frame bajo <code>aria-hidden="true"</code>{" "}
					como contenido aria-hidden y uno bajo <code>[inert]</code> como contenido inerte, en los
					que solo se juzga cómo se ve el contenido, y deja fuera un frame tras un diálogo modal
					abierto; un binding que analiza los frames uno a uno establece él mismo{" "}
					<code>embeddedAriaHidden</code> y <code>embeddedInert</code> (ver{" "}
					<a href="/configuration/engine-options/">Opciones del motor</a>). Core 1.15.0 y
					posteriores.
				</li>
				<li>
					<strong>
						<code>&lt;dialog&gt;</code> y otros elementos ocultos por la hoja de estilos
						predeterminada del agente de usuario
					</strong>{" "}
					(sin atributo <code>open</code>, <code>display: none</code> según la especificación),
					junto con cualquier otro subárbol oculto mediante <code>display:none</code>,{" "}
					<code>visibility:hidden</code>, <code>[hidden]</code> o un <code>&lt;details&gt;</code>{" "}
					cerrado, y un subárbol <code>[inert]</code> (que las reglas sobre el aspecto del
					contenido, como el contraste y el espaciado del texto, siguen juzgando, ya que se
					dibuja), quedan <strong>excluidos de la evaluación de reglas por defecto</strong>. Este
					es un valor predeterminado deliberado (
					<code>engineOptions.includeHiddenElements: false</code>), no un descuido: el contenido
					oculto no es accesible mediante tecnología de asistencia ni teclado hasta que se muestra,
					así que marcar por defecto un defecto de marcado dentro de él a menudo sería ruido.
					Define <code>engineOptions.includeHiddenElements: true</code> para evaluar igualmente
					subárboles ocultos o colapsados: por ejemplo, para detectar un defecto de marcado (como
					una referencia de ID ARIA rota) antes de que un diálogo llegue a abrirse. Consulta{" "}
					<a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a>{" "}
					para conocer la opción y exactamente qué mecanismos de ocultación cubre.
				</li>
				<li>
					<strong>
						No se informa de un <code>aria-details</code> que nombra contenido oculto.
					</strong>{" "}
					<a href="/rules/aria-valid-attr-value/"><code>aria-valid-attr-value</code></a> comprueba
					que el id nombra un elemento, no que el elemento se muestre. Chromium deja la relación
					fuera de su árbol de accesibilidad mientras el elemento está oculto y la recupera cuando
					se muestra, así que unos detalles que se abren a petición se anuncian al abrirse, y WCAG
					no pide más. Para comprobar la relación tal como la recibe la tecnología de asistencia,
					analiza la página con los detalles visibles.
				</li>
				<li>
					<strong>jsdom no tiene popovers.</strong> Incluye la regla de HTML que oculta un{" "}
					<code>[popover]</code> cerrado, pero no <code>showPopover()</code>, y lee{" "}
					<code>:popover-open</code> de forma inconsistente. Cuando el DOM no tiene{" "}
					<code>showPopover</code>, el motor trata todo <code>[popover]</code> que no sea un{" "}
					<code>&lt;dialog&gt;</code> abierto como cerrado y oculto, así que su contenido no se
					comprueba; un popover que el propio CSS de la página mantiene visible tampoco se
					comprueba bajo jsdom. En un navegador, el motor lee lo que se muestra. Para comprobar el
					contenido de un popover, analiza la página en un navegador con el popover abierto.
				</li>
				<li>
					<strong>Bajo jsdom, el texto de <code>content</code> de CSS no da nombre.</strong> jsdom no
					calcula estilos para <code>::before</code> ni <code>::after</code>, así que un botón o un
					enlace cuyo único texto es generado (<code>content: "Save"</code>,{" "}
					<code>content: attr(data-label)</code>) tiene nombre en un navegador y no lo tiene bajo
					jsdom, donde <code>button-name-present</code>, <code>link-name-present</code> y las demás
					reglas de nombre lo hacen fallar. Analiza esas páginas en un navegador.
				</li>
				<li>
					<strong>jsdom conserva el tamaño de fuente tal como está escrito.</strong> Un navegador
					informa de un tamaño de fuente calculado en px; jsdom conserva una palabra clave o un{" "}
					<code>calc()</code> tal como está escrito. El motor lee las palabras clave con los tamaños
					de un navegador para un valor predeterminado de 16px (<code>xx-large</code> es 32px) y el{" "}
					<code>calc()</code> de longitudes y números, así que el texto grande se distingue como en un
					navegador. <code>larger</code> y <code>smaller</code>, que dependen del tamaño del padre, no
					se resuelven bajo jsdom: ese texto se somete a la relación del texto normal, y su mensaje
					indica su tamaño como 0px. Un navegador resuelve ambos.
				</li>
				<li>
					<strong>jsdom ignora las hojas de estilo propias de un shadow root.</strong> Confirmado en
					jsdom 29.1.1: ni un <code>&lt;style&gt;</code> dentro de un shadow root ni sus{" "}
					<code>adoptedStyleSheets</code> llegan al estilo calculado de sus elementos, así que bajo
					jsdom no se ven los colores, los tamaños ni el <code>display: none</code> o{" "}
					<code>visibility: hidden</code> definidos ahí. Las reglas juzgan entonces el contenido de
					un componente como si no tuviera estilos: el contraste se mide con los colores
					predeterminados, y el contenido que su CSS oculta se juzga como visible. La única
					excepción es el color de un enlace, que los helpers de contraste calculan a partir de las
					propias hojas del shadow root. Analiza en un navegador las páginas hechas con componentes
					web con estilos.
				</li>
				<li>
					<strong>
						El <code>text-shadow</code> calculado por jsdom no es fiable en una segunda lectura
						del mismo elemento.
					</strong>{" "}
					Confirmado en jsdom 29.1.1: leer un valor calculado de <code>text-shadow</code> por
					segunda vez en el mismo elemento (mediante cualquier propiedad de acceso, desde cualquier{" "}
					<code>CSSStyleDeclaration</code> recién solicitado para ese elemento, sin importar el
					caché) devuelve de forma silenciosa un valor distinto e incorrecto de "sin sombra" en
					lugar del valor realmente declarado. La primera lectura siempre es correcta. Este motor
					lo evita internamente leyendo el <code>text-shadow</code> de cada elemento exactamente
					una vez por ejecución y guardando el resultado en caché (consulta{" "}
					<code>__textShadowInfoEl</code> en <code>src/core/contrast-helpers.js</code>), así que un
					único análisis no se ve afectado. Solo aparece si tú mismo lees{" "}
					<code>getComputedStyle(el).textShadow</code> más de una vez sobre el mismo elemento
					analizado por jsdom. Un navegador real no tiene este error.
				</li>
				<li>
					<strong>
						Un segundo análisis del mismo DOM de jsdom puede perder un estilo que sobrescribe una
						propiedad abreviada.
					</strong>{" "}
					jsdom conserva el estilo calculado de un elemento una vez leído, hasta el siguiente
					cambio del DOM, y la copia que devuelve de esa caché pierde una propiedad desarrollada
					que sobrescribe una abreviada de una regla menos específica: con{" "}
					<code>{"*{background:#888}"}</code> y <code>style="background-image:url(hero.png)"</code>,
					la primera lectura da la imagen y todas las siguientes <code>none</code>. Un análisis
					conserva el estilo que leyó primero, así que no se ve afectado, pero un segundo análisis
					del mismo DOM sin cambios puede no ver la imagen y aprobar un texto por el que el
					primero preguntó (<code>contrast-computable</code>). Analiza un parseo nuevo, o cambia el
					DOM entre análisis, lo que vacía la caché de jsdom; <code>@surea11y/core/testing</code>{" "}
					lo hace en su propio segundo análisis. Un navegador real no tiene este error.
				</li>
				<li>
					<strong>
						Bajo jsdom, el tiempo de análisis crece con el cuadrado de la profundidad del DOM, no
						con el número de elementos.
					</strong>{" "}
					jsdom resuelve el CSS heredado recorriendo la cadena de ancestros de un elemento en cada
					llamada a <code>getComputedStyle</code>, así que una llamada por elemento cuesta O(número de
					elementos × profundidad). Medido en jsdom 29.1.1 sin código del motor involucrado: 4000 elementos
					en una sola cadena tardan 8,3s solo en <code>getComputedStyle</code>, frente a 0,25s para
					esos mismos 4000 como hermanos. Los propios recorridos de ancestros del motor están
					acotados y se mantienen lineales, así que este es un coste de jsdom y no de las reglas.
					Afecta a <code>runDomRulesInPage</code> y a todo lo construido sobre él, incluido{" "}
					<code>@surea11y/test-matchers</code>; un navegador real calcula el estilo heredado de
					forma nativa y no tiene esta forma de coste. Los frameworks de componentes anidan
					habitualmente entre 100 y 300 niveles, lo cual sigue siendo cómodamente rápido; se
					vuelve perceptible a partir de aproximadamente 1000.
				</li>
				<li>
					<strong>Bajo jsdom, el tiempo de análisis también crece con el tamaño de la hoja de
					estilo.</strong> jsdom calcula un estilo comparando cada regla CSS con el elemento. El motor
					no modifica el DOM durante un análisis, así que cada elemento se calcula una sola vez, pero
					esa vez cuesta O(reglas): en una página de noticias guardada (7916 elementos, 2683 reglas
					CSS, jsdom 29.1.1), el primer cálculo de 5735 elementos tarda unos 224 s de un análisis de
					243 s. Ese es el coste de jsdom; un navegador real calcula la misma página en una fracción
					de segundo. jsdom además deja sin sustituir las propiedades personalizadas, así que un
					color definido con <code>var()</code> no se puede leer ahí: se pregunta por el texto o el
					fondo (<code>contrast-computable</code>) en lugar de medirlo. Usa un navegador real para
					páginas grandes de producción.
				</li>
				<li>
					<strong>Bajo jsdom, el color de un enlace se calcula a partir de las reglas de la propia
					página.</strong> jsdom ordena su propio <code>{":link { color: #0000EE }"}</code> con las
					reglas de la página solo por especificidad, así que el{" "}
					<code>{"a { color: #fff }"}</code> de una página pierde frente a él, mientras que un
					navegador aplica la regla de la página. Bajo jsdom, el motor calcula el color de un
					enlace, y del texto que contiene, a partir de las reglas de la página como lo hace la
					cascada de un navegador; un enlace que ninguna regla de la página colorea conserva el
					color de enlace del navegador, y un enlace se considera no visitado. Donde eso no se
					puede hacer (una hoja de estilo que no se puede leer, un <code>var()</code>, una regla
					dentro de <code>@supports</code>, <code>@layer</code>, <code>@container</code> o anidada
					en otra), se pregunta por el texto (<code>contrast-computable</code>,{" "}
					<code>FOREGROUND_UNPARSABLE</code>) en lugar de medirlo en el azul de jsdom. En un
					navegador se lee el color calculado tal cual.
				</li>
				<li>
					<strong>Bajo jsdom, el texto se juzga por su <code>font-size</code> calculado.</strong> En
					un navegador, las reglas de contraste y <code>p-as-heading</code> juzgan el texto por el
					tamaño al que se dibuja, incluidos el <code>zoom</code> de CSS, una transformación SVG y{" "}
					<code>font-size-adjust</code>, este último a partir de las métricas de la propia fuente (
					<code>font-size: 24px; font-size-adjust: 0.3</code> dibuja Arial a unos 14px, que no es
					texto grande). jsdom no maqueta nada ni lee ninguna fuente, así que ahí el{" "}
					<code>font-size</code> se toma tal cual. Analiza en un navegador una página que escala
					así su texto.
				</li>
				<li>
					<strong>
						En un navegador real, algunas reglas modifican la página mientras dura su comprobación, y
						los propios scripts de la página pueden reaccionar.
					</strong>{" "}
					Para medir lo que dibuja el navegador, <code>css-hidden-focus</code> enfoca elementos como
					lo haría el teclado y desactiva las transiciones en el elemento que mide;{" "}
					<code>aria-hidden-focus</code> enfoca un elemento dentro de un subárbol{" "}
					<code>aria-hidden</code> para ver si la página retira el foco de inmediato (un centinela de
					trampa de foco); <code>text-spacing-content-loss</code> añade una hoja de estilo con el espaciado de WCAG
					1.4.12; las reglas de contraste añaden un frame vacío fuera de la pantalla para leer los
					colores propios del navegador para un texto provisional o un{" "}
					<code>&lt;select&gt;</code> desplegable. El análisis también lleva cada animación en
					curso a un punto fijo mientras se ejecutan las reglas (una finita a su final, una
					infinita a su inicio), así que un fundido de entrada se mide ya asentado. Todo esto se
					restablece antes de que termine la regla o el análisis: el foco, la posición de
					desplazamiento, los atributos style, las animaciones, la hoja de estilo añadida y el
					frame. Lo que no se puede
					restablecer es lo que hagan los scripts de la página en respuesta, ya que enfocar un
					elemento dispara sus manejadores <code>focus</code> y <code>focusin</code>: un carrusel
					puede pasar a la diapositiva enfocada, moviendo <code>aria-hidden</code> con ella, o
					activar un botón. Los hallazgos de ese análisis son los de la página tal como se encontró:{" "}
					<code>aria-hidden-focus</code> lee qué subárboles están ocultos, y el marcado que informa,
					antes de enfocar nada. Pero la página queda como la dejaron sus scripts, así que un segundo
					análisis de la misma página puede encontrar otra cosa: si analizas una página que sigues
					usando, o analizas una página dos veces, recárgala entre medias. Como el espaciado se
					vuelve a quitar, una captura de pantalla hecha tras el análisis muestra como si cupiera el
					texto que <code>text-spacing-content-loss</code> encontró cortado; ese hallazgo nombra el
					estado en que se hizo (
					<code>data.details.evidenceState: 'text-spacing'</code>), y{" "}
					<code>evidenceState()</code> de <code>@surea11y/core</code> vuelve a poner la página en ese
					estado para la imagen, como hacen los <code>.screenshots()</code> de los bindings.
				</li>
				<li>
					<strong>Una hoja de estilo de otro origen no se puede leer desde la página.</strong> El
					script de una página no puede enumerar las reglas de una hoja que sirve otro origen (una
					CDN, un servicio de fuentes), así que <code>css-orientation-lock</code> pregunta por ella (
					<code>STYLESHEETS_NOT_READABLE</code>), y <code>css-hidden-focus</code> y{" "}
					<code>css-focus-indicator-suppressed</code> no pueden ver una regla de foco en ella. Pasa
					su texto en <code>engineOptions.styleSheetTexts</code>: <code>preloadStyleSheets()</code>{" "}
					descarga las que el servidor comparte (CORS), y una herramienta que controla el navegador
					puede descargar las demás desde fuera de la página (consulta{" "}
					<a href={`${core}/docs/INTEGRATION.md#style-sheets-from-another-origin`}>
						<code>INTEGRATION.md</code>
					</a>
					, en GitHub).
				</li>
				<li>
					<strong>Marcado estático frente a estado del DOM en vivo o posterior a la hidratación.</strong>{" "}
					La lógica de las reglas en sí es agnóstica respecto al origen del DOM: evalúa cualquier
					DOM que reciba, ya sea HTML estático analizado por jsdom (Patrón 1) o una pestaña de
					navegador real ya cargada e hidratada (Patrón 2, consulta{" "}
					<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>
					). Pero la CLI (<code>npx @surea11y/cli scan &lt;url&gt;</code>) obtiene específicamente
					solo HTML estático, sin ejecución de JS. Consulta{" "}
					<a href="https://github.com/SureA11y/cli/blob/main/docs/CLI.md">la documentación de la CLI</a>. Para
					un widget hidratado por un framework de JS cuyo marcado renderizado en el servidor
					entrega intencionadamente un estado antes de que el JS del cliente lo sincronice (por
					ejemplo,{" "}
					<code>&lt;input type="checkbox" aria-checked="true"&gt;</code> entregado antes de que el
					JS del cliente establezca la propiedad nativa <code>checked</code> para que coincida
					durante la hidratación, un patrón extremadamente común y totalmente legítimo), un
					análisis de la CLI solo ve el marcado previo a la hidratación. Un análisis que se ejecuta
					dentro de una pestaña de navegador real ya cargada ve en cambio el estado posterior a la
					hidratación, así que ambos pueden discrepar exactamente en esta clase de elemento por
					razones que no tienen nada que ver con la corrección de la regla. Por eso{" "}
					<code>aria-checked-state-mismatch</code> está limitado a <code>manual</code>/
					<code>cantTell</code> en lugar de un <code>fail</code> estricto. Si necesitas precisión de
					DOM en vivo para comprobaciones sensibles a la hidratación, ejecuta la librería
					directamente contra una página ya cargada mediante el Patrón 2, no la CLI de obtención
					estática.
				</li>
				<li>
					<strong>El diseño se mide en un único viewport, con las fuentes que tiene la página en
					ese momento.</strong> Las reglas que miden lo que dibuja el navegador,{" "}
					<a href="/rules/text-spacing-content-loss/">
						<code>text-spacing-content-loss</code>
					</a>
					,{" "}
					<a href="/rules/target-size-minimum/">
						<code>target-size-minimum</code>
					</a>{" "}
					y{" "}
					<a href="/rules/skip-link/">
						<code>skip-link</code>
					</a>
					, valen para el viewport en el que se analizó la página: una página adaptable puede
					recortar texto, o encoger un objetivo, con un ancho y no con otro, y un texto medido
					antes de que cargue su fuente web tiene otro ancho. El resultado registra ambas cosas en{" "}
					<a href="/results-reports/output-schema/">
						<code>engine.environment</code>
					</a>
					, y los hallazgos de esas reglas repiten su viewport e indican lo que se midió (cuánto
					sobrepasó el texto el borde, qué tamaño tiene un objetivo y a qué distancia está su
					vecino), de modo que un hallazgo que difiere entre ejecuciones se puede atribuir a las
					condiciones. Analiza con cada ancho que te importe, y espera a que la página se
					estabilice antes de analizar: <code>waitForPageReady()</code> espera al evento load, a
					las fuentes web y a las imágenes (consulta{" "}
					<a href={`${core}/docs/INTEGRATION.md#waiting-for-the-page-before-a-scan`}>
						<code>INTEGRATION.md</code>
					</a>
					, que muestra cómo llamarla antes de un análisis), y el resultado registra en{" "}
					<code>engine.environment</code> si las fuentes o las imágenes aún estaban cargando.
				</li>
				<li>
					<strong>
						En un navegador, el contraste se mide frente a lo que se pinta bajo el texto, tal como
						está la página en ese momento.
					</strong>{" "}
					Se pregunta por el texto sobre una imagen, un degradado o una pintura que solo lo cubre
					en parte (<a href="/rules/contrast-computable/"><code>contrast-computable</code></a>,
					código de motivo <code>BACKGROUND_OVERLAP</code>) en lugar de medirlo. El texto que una
					caja con <code>overflow: hidden</code> mantiene totalmente fuera de la vista, como una
					diapositiva de carrusel fuera de su pista, se deja fuera hasta que está a la vista, así
					que analiza la página en ese estado para comprobarlo. Las cajas fijas y sticky sobre el
					texto se ignoran. Bajo jsdom, el texto se mide solo frente a sus ancestros. Analizada en
					colores forzados (alto contraste de Windows, o un{" "}
					<code>forced-colors: active</code> emulado), la página se mantiene en sus propios colores
					mientras se mide, así que los resultados son los de colores forzados desactivados, salvo
					que el propio CSS de la página reaccione a los colores forzados (una media query{" "}
					<code>forced-colors</code>, o un color del sistema como <code>GrayText</code>), lo que el
					análisis indica en <code>engine.environment.forcedColorsCss</code>; donde no se puede (una Content Security Policy que bloquea el <code>&lt;style&gt;</code> del
					motor en un navegador que no puede adoptar una hoja de estilo), los colores medidos son
					en parte los del navegador, y cada ocurrencia de contraste lo indica (
					<code>details.forcedColors</code>). Cómo funciona la medición, paso a paso:{" "}
					<a href={`${core}/docs/LAYOUT_MEASUREMENT.md#contrast`}>
						<code>LAYOUT_MEASUREMENT.md</code>
					</a>
					, en GitHub.
				</li>
				<li>
					<strong>
						El texto de una página sin fondo se mide sobre el lienzo del esquema de color de la
						página, donde ese lienzo se conoce.
					</strong>{" "}
					El navegador pinta su lienzo detrás de una página que no pinta ningún fondo opaco, con el
					color <code>Canvas</code> del esquema de color en que se dibuja la página, que decide el{" "}
					<code>color-scheme</code> de la propia página: blanco para una página que no declara
					ninguno, prefiera lo que prefiera el usuario, y el lienzo oscuro para una que se dibuja en
					oscuro. Las reglas de contraste miden ahí el texto en cualquiera de los dos modos. No se
					mide, y <code>contrast-computable</code> pregunta por él (
					<code>BACKGROUND_NOT_OPAQUE_AT_ROOT</code>): el texto dentro de un frame, cuyo lienzo
					puede dejar ver la página que lo rodea, y el texto en colores forzados, donde el lienzo es
					la paleta del usuario.
				</li>
				<li>
					<strong>
						Bajo jsdom, el texto se mide con los colores del esquema en que se dibuja la página
						donde se pueden calcular, y se pregunta por él donde no.
					</strong>{" "}
					jsdom calcula los colores del esquema claro y no aplica ninguna regla{" "}
					<code>prefers-color-scheme</code>. En una página que se dibuja en oscuro (
					<code>color-scheme: dark</code> en la raíz o en{" "}
					<code>&lt;meta name="color-scheme"&gt;</code>), el texto que colorea el esquema toma los
					colores del esquema oscuro (los de Chromium), y un color de texto dado como{" "}
					<code>light-dark()</code>, <code>CanvasText</code>, <code>LinkText</code> o{" "}
					<code>Canvas</code> se calcula para el oscuro. Por el texto
					cuyos colores en ese esquema no se pueden calcular se pregunta (
					<code>contrast-computable</code>, <code>COLOR_SCHEME_NOT_RENDERED</code>;{" "}
					<code>link-in-text-block</code>, <code>COLOR_NOT_COMPUTABLE</code>) en lugar de medirlo
					con los colores claros. En un navegador, los colores son los que dibuja.
				</li>
				<li>
					<strong>
						En una página que admite claro y oscuro, el esquema que el análisis no ve solo se mide
						donde los colores del texto no pueden cambiar con él.
					</strong>{" "}
					Un análisis ve el esquema que prefiere el navegador (jsdom: claro). El texto sobre el
					lienzo se mide también en el otro esquema, salvo donde una regla{" "}
					<code>prefers-color-scheme</code>, un valor <code>light-dark()</code> o un color del
					sistema que define la página alcanza el color del texto o un fondo detrás de él, o donde
					una hoja de estilo no se puede leer; tampoco el texto dibujado por un contorno, una
					sombra, <code>::first-line</code> o un pseudoelemento, ni el texto medido sobre otra
					pintura. <code>data.details.colorSchemesChecked</code> enumera
					los esquemas medidos; vuelve a analizar con el navegador en el otro esquema para
					comprobarlo.
				</li>
				<li>
					<strong>
						El texto generado solo se mide en un navegador, y solo donde se puede leer.
					</strong>{" "}
					El texto que escribe el <code>content</code> de un <code>::before</code> o un{" "}
					<code>::after</code> y el <code>::marker</code> de un elemento de lista se miden con el
					color y la fuente del pseudoelemento; se pregunta en su lugar (
					<code>contrast-computable</code>) por el contenido que no se puede leer (un contador en
					un <code>@counter-style</code> propio de la página) y por un <code>::before</code> o{" "}
					<code>::after</code> posicionado fuera del flujo sin fondo propio. Los marcadores solo se
					buscan en <code>&lt;li&gt;</code>. Bajo jsdom, que no calcula estilos de
					pseudoelementos, el texto generado se deja fuera.
				</li>
				<li>
					<strong>
						El texto y el texto provisional de un campo de formulario se miden tal como los dibuja
						el campo, con huecos.
					</strong>{" "}
					No se mide el texto que dibuja un navegador en un campo de fecha u hora vacío, ni el
					botón y el nombre de archivo de un input de archivo. Un <code>&lt;select&gt;</code>{" "}
					desplegable se mide tal como lo dibuja el control cerrado, con su opción mostrada en los
					colores del propio select; otra de sus opciones con colores propios solo se muestra en
					la lista que dibuja la plataforma al abrirse, y es <code>cantTell</code> (
					<code>SELECT_OPTION_COLOR</code>). Un texto provisional por debajo de su relación de
					contraste falla (<code>PLACEHOLDER_BELOW_THRESHOLD</code>) cuando la página eligió sus
					colores, cumple la relación cuando todos son los del propio navegador (técnica G148), y
					es <code>cantTell</code> cuando eso no se puede saber. Bajo jsdom, los
					textos provisionales no se miden en absoluto. Detalles:{" "}
					<a href={`${core}/docs/LAYOUT_MEASUREMENT.md#form-fields`}>
						<code>LAYOUT_MEASUREMENT.md</code>
					</a>
					.
				</li>
				<li>
					<strong>
						<a href="/rules/target-size-minimum/"><code>target-size-minimum</code></a> calcula la
						región de impacto a partir del diseño, no mediante pruebas de impacto (hit-testing).
					</strong>{" "}
					Los objetivos por debajo del pliegue o dentro de una caja con desplazamiento se miden
					enteros, como si estuvieran desplazados a la vista; las cajas fijas y sticky sobre un
					objetivo se ignoran; las transformaciones 3D, la mayoría de las formas de{" "}
					<code>clip-path</code> y el recorte redondeado de un ancestro se miden como una caja
					delimitadora; y los enlaces separados solo por separadores ("Edit | Delete") que se
					amontonan entre sí se preguntan en lugar de quedar exentos. Bajo jsdom, la regla es{" "}
					<code>notApplicable</code>. Detalles:{" "}
					<a href={`${core}/docs/LAYOUT_MEASUREMENT.md#target-size`}>
						<code>LAYOUT_MEASUREMENT.md</code>
					</a>
					.
				</li>
				<li>
					<strong>El contraste se calcula en sRGB.</strong> Los colores dados en{" "}
					<code>oklch()</code>, <code>oklab()</code>, <code>lab()</code>, <code>lch()</code> o{" "}
					<code>color()</code> (también la forma calculada de <code>color-mix()</code> y de los
					colores relativos) se convierten a sRGB, tal como los muestra una pantalla estándar; uno
					fuera de sRGB, como un rojo <code>display-p3</code> saturado, se recorta a su borde, que
					es lo que Chromium dibuja en una pantalla sRGB. Una pantalla de gama amplia puede mostrar
					ese color más saturado de lo que supone la relación calculada. Un color de fondo que el motor no puede
					convertir, un <code>color()</code> en un espacio que no conoce, no se trata como
					transparente: <code>contrast-computable</code> pregunta por el texto con el código de
					motivo <code>BACKGROUND_UNPARSABLE</code>, y las demás reglas de contraste lo dejan fuera.
				</li>
			</ul>

			<h2>Comprobaciones no implementadas: decisiones que no pueden automatizarse de forma segura</h2>
			<p>
				Estos no cuentan con una heurística comparablemente segura para el nivel de exigencia de
				este motor (<code>fail</code> debe seguir reservado exclusivamente para violaciones
				deterministas). Construirlas de todos modos capturaría casi nada (demasiado estrictas para
				ser útiles) o arriesgaría falsos positivos reales (demasiado amplias para confiar en
				ellas):
			</p>
			<ul>
				<li>
					<strong>"¿Es significativo este texto de encabezado o etiqueta?"</strong>: los
					encabezados y etiquetas reales son enormemente variados y legítimamente cortos ("FAQ",
					"Nombre", "Resumen" son todos válidos), así que nada permite decidir a partir del
					marcado si un encabezado describe la sección que tiene debajo o si una etiqueta describe
					el campo que tiene al lado. Lo que <em>sí</em> se puede decidir es que algunas cadenas no
					pueden describir nada: <code>heading-quality</code> y{" "}
					<code>form-control-label-quality</code> marcan marcadores de posición olvidados, campos
					de plantilla numerados, nombres de archivo y URLs contra listas curadas de coincidencia
					exacta, el mismo compromiso de precisión sobre exhaustividad que hace{" "}
					<code>link-name-quality</code>. Ambas son reglas <code>manual</code> limitadas a{" "}
					<code>cantTell</code>: señalan un candidato para revisión, nunca afirman que el texto
					sea incorrecto.
				</li>
				<li>
					<strong>"¿Describe este mensaje de error el problema?"</strong>: qué dispara un error de
					validación y su contenido casi siempre dependen de JS o de una librería de validación,
					invisibles para un análisis estático de entrada; no es solo un problema de diseño de
					heurísticas.
				</li>
				<li>
					<strong>Subcomprobaciones detalladas de medios basados en tiempo</strong> (WCAG 1.2.x
					tiene 13 reglas ACT sin regla equivalente aquí; consulta la sección de carencias de{" "}
					<a href={`${core}/docs/ACT_RULE_MAPPING.md#gaps-no-corresponding-rule`}>
						<code>ACT_RULE_MAPPING.md</code>
					</a>
					):
					el propio contenido de audio/vídeo es fundamentalmente imposible de verificar a partir de
					marcado estático; los dos casos más amplios y seguros están cubiertos (
					<code>media-alternative-transcript-evidence</code>, <code>video-caption</code>), los más
					específicos no lo están, de forma deliberada.
				</li>
				<li>
					<strong>Análisis del contenido de imágenes de texto</strong> (WCAG 1.4.5/1.4.9): si una
					imagen contiene texto está en sus píxeles, lo que requeriría una comprensión de imágenes
					equivalente a OCR. <a href="/rules/image-of-text/"><code>image-of-text</code></a> solo
					pregunta donde el marcado muestra una señal: un <code>&lt;input type="image"&gt;</code>, y
					un <code>&lt;img&gt;</code> que muestra una data URL SVG cuyo marcado contiene{" "}
					<code>&lt;text&gt;</code>. Una foto de una frase, un banner con el texto incrustado o una
					imagen de fondo CSS con texto no dan ninguna señal, y no se pregunta por ellos. El 1.4.9,
					que no admite excepciones, no tiene regla.
				</li>
				<li>
					<strong>Controles activados por movimiento</strong> (WCAG 2.5.4): caso de nicho, baja
					incidencia real; no priorizado, no estructuralmente imposible.
				</li>
				<li>
					<strong>Los dos casos límite de ACT en <code>img-alt-decorative</code></strong>: un{" "}
					<code>&lt;img&gt;</code> cuyo estado actual de solicitud de red no está "completamente
					disponible" (aún cargando o roto), y un <code>&lt;canvas&gt;</code> totalmente
					transparente (sin nada realmente dibujado en él), están ambos exentos de la propia
					aplicabilidad de ACT. Ninguno de los dos se puede decidir a partir de un análisis
					estático del DOM (sin decodificación de imágenes, sin lectura de píxeles del canvas), así
					que ambos se dejan dentro del alcance en lugar de eximirse: un falso positivo poco
					frecuente que un revisor humano descarta de un vistazo, más seguro que subinformar en
					silencio un elemento realmente excluido o no decorativo.
				</li>
			</ul>

			<h2>Qué significa esto en la práctica</h2>
			<p>
				Casi nada de lo anterior es exclusivo de surea11y. Cualquier herramienta que juzga un
				único estado del DOM comparte los límites de{" "}
				<a href="#outside-what-one-scan-can-see">Fuera de lo que un análisis puede ver</a>, y la
				mayoría de las herramientas automatizadas también dejan las decisiones de criterio a una
				persona, aunque difieren en cómo se ejecutan, qué comprueban y cómo informan de lo que no
				pueden decidir. La razón para exponerlo
				explícitamente aquí: <strong>un <code>pass</code> de este motor (o de cualquier herramienta
				automatizada) nunca sustituye la revisión manual que el propio WCAG exige para los criterios
				anteriores.</strong> Consulta{" "}
				<a href="/conformance/wcag-mapping/"><code>WCAG_CONFORMANCE.md</code></a> para saber
				exactamente qué afirma y qué no afirma el <code>pass</code> de una regla, y por qué un
				criterio de WCAG cuyas reglas se cumplen todas sigue en <code>cantTell</code>.
			</p>
		</>
	);
}
