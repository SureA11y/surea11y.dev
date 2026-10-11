import React from "react";

const core = "https://github.com/SureA11y/core/blob/main";

export function KnownLimitationsContent() {
	return (
		<>
			<p>
				Qué no evalúa el motor, qué depende del entorno en el que se ejecuta y qué necesita la
				revisión de una persona. Léelo antes de confiar en un resultado sin hallazgos.
			</p>

			<h2>Aspectos que el análisis no evalúa</h2>
			<p>
				surea11y comprueba la página en su estado actual. Algunas reglas cambian brevemente el
				foco o los estilos para medir una condición concreta, y en un navegador real las reglas
				pueden medir el diseño (en jsdom no lo hay), pero el análisis no explora de forma
				sistemática las interacciones del usuario, los estados asíncronos ni distintos tamaños de
				viewport. Por eso lo siguiente necesita pruebas aparte, con automatización de navegador y
				revisión humana según corresponda:
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
					los estados a los que llevan. Algunas comprobaciones modifican la página brevemente para
					medirla (<code>aria-hidden-focus</code> intenta enfocar elementos,{" "}
					<code>text-spacing-content-loss</code> aplica un espaciado de prueba), pero ninguna
					mueve el foco por la página como lo haría la detección de trampas. Mientras tanto, nada
					en el marcado estático la sustituye.
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
					<em>luego</em> analiza).
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
					<a href="/rules/button-name-present/"><code>button-name-present</code></a> y{" "}
					<a href="/rules/link-name-present/"><code>link-name-present</code></a> preguntan (
					<code>name_contentTooDeep</code>) por un botón o un enlace cuyo único nombre está más
					abajo; otras reglas que obtienen el nombre del contenido leen ese contenido como vacío.
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
					botón sobre una sigue fallando.
				</li>
				<li>
					<strong>
						Un análisis hecho con un diálogo modal abierto ve el diálogo, no la página.
					</strong>{" "}
					Un <code>&lt;dialog&gt;</code> abierto con <code>showModal()</code> (o un{" "}
					<code>&lt;dialog aria-modal="true"&gt;</code> abierto) vuelve inerte el resto del
					documento, y los navegadores solo exponen el diálogo a la tecnología de asistencia. El
					motor hace lo mismo: el contenido detrás del diálogo queda fuera de todas las reglas,
					igual que el resto del contenido oculto, y las reglas sobre la estructura de la propia
					página (<a href="/rules/page-has-heading-one/"><code>page-has-heading-one</code></a>,{" "}
					<a href="/rules/landmark-one-main/"><code>landmark-one-main</code></a>,{" "}
					<a href="/rules/bypass-blocks-present/"><code>bypass-blocks-present</code></a>,{" "}
					<a href="/rules/region/"><code>region</code></a>) informan <code>notApplicable</code>,
					porque el análisis no puede ver esa estructura. Vuelve a analizar la página con el
					diálogo cerrado para juzgar lo que hay detrás. Dos límites: un{" "}
					<code>&lt;dialog&gt;</code> modal dentro de un shadow root no se detecta, y un modal
					propio construido con un elemento <code>role="dialog"</code> e <code>inert</code> o{" "}
					<code>aria-hidden</code> en el resto de la página solo se trata a través de esos
					atributos, que ocultan la página pero no indican a las reglas de estructura que hay un
					diálogo abierto. Otros motores difieren aquí: algunos hacen lo mismo, otros juzgan la
					página detrás del diálogo como si no hubiera nada abierto.
				</li>
				<li>
					<strong>
						<code>&lt;dialog&gt;</code> y otros elementos ocultos por la hoja de estilos
						predeterminada del agente de usuario
					</strong>{" "}
					(sin atributo <code>open</code>, <code>display: none</code> según la especificación),
					junto con cualquier otro subárbol oculto mediante <code>display:none</code>,{" "}
					<code>visibility:hidden</code>, <code>[hidden]</code> o un <code>&lt;details&gt;</code>{" "}
					cerrado, quedan <strong>excluidos de la evaluación de reglas por defecto</strong>:
					coincidiendo con el comportamiento sensible a la visibilidad de otros motores
					consolidados. Este es un valor predeterminado deliberado (
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
					<strong>
						En un navegador real, algunas reglas modifican la página mientras dura su comprobación, y
						los propios scripts de la página pueden reaccionar.
					</strong>{" "}
					Para medir lo que dibuja el navegador, <code>css-hidden-focus</code> enfoca elementos como
					lo haría el teclado y desactiva las transiciones en el elemento que mide;{" "}
					<code>aria-hidden-focus</code> enfoca un elemento dentro de un subárbol{" "}
					<code>aria-hidden</code> para ver si la página retira el foco de inmediato (un centinela de
					trampa de foco); <code>text-spacing-content-loss</code> añade una hoja de estilo con el espaciado de WCAG
					1.4.12. Todo esto se restablece antes de que la regla termine: el foco, la posición de
					desplazamiento, los atributos style y la hoja de estilo añadida. Lo que no se puede
					restablecer es lo que hagan los scripts de la página en respuesta, ya que enfocar un
					elemento dispara sus manejadores <code>focus</code> y <code>focusin</code>: un carrusel
					puede pasar a la diapositiva enfocada, moviendo <code>aria-hidden</code> con ella, o
					activar un botón. Los hallazgos de ese análisis son los de la página tal como se encontró:{" "}
					<code>aria-hidden-focus</code> lee qué subárboles están ocultos, y el marcado que informa,
					antes de enfocar nada. Pero la página queda como la dejaron sus scripts, así que un segundo
					análisis de la misma página puede encontrar otra cosa: si analizas una página que sigues
					usando, o analizas una página dos veces, recárgala entre medias.
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
					<strong>En un navegador, las reglas de contraste miden el texto frente a lo que se pinta
					debajo de él, en el orden de pintado de CSS.</strong>{" "}
					Un texto posicionado sobre un hermano, sobre una imagen <code>&lt;img&gt;</code> de
					cabecera, sobre una superposición <code>::before</code>, o desplazado sobre otro bloque
					con un margen negativo queda sobre una pintura que no pertenece a ninguno de sus
					ancestros, y un texto que desborda la caja de un ancestro, o que tiene un{" "}
					<code>z-index</code> negativo, no está sobre el fondo de ese ancestro. En un navegador, el
					motor mide las cajas de línea del texto, encuentra los elementos que pintan ahí (un color o
					una imagen de fondo, contenido reemplazado como <code>img</code>, <code>video</code>,{" "}
					<code>canvas</code>, <code>iframe</code>, formas SVG) y los ordena junto con el texto y los
					fondos de sus ancestros según el orden de pintado de CSS: contextos de apilamiento,{" "}
					<code>z-index</code>, cajas posicionadas y flotantes, y después el orden del documento.
					Cuando todo lo que hay entre el texto y la primera capa opaca es un color sólido que cubre
					todo el texto, la relación de contraste se mide frente a eso; cuando interviene una imagen,
					un degradado, una pintura que cubre solo parte del texto o una pintura dibujada sobre el
					texto, <a href="/rules/contrast-computable/"><code>contrast-computable</code></a>{" "}
					pregunta por el texto con el código de motivo <code>BACKGROUND_OVERLAP</code> y las reglas
					que calculan la relación de contraste lo dejan fuera. El texto que una caja que recorta su
					desbordamiento mantiene fuera de la vista, como las opciones más abajo en una lista con
					desplazamiento, se mide tal como queda una vez desplazado dentro de esa caja. El texto que
					una caja con <code>overflow: hidden</code> mantiene totalmente fuera de la vista, como una
					diapositiva de carrusel fuera de su pista, no se mide en absoluto: solo por sus estilos,
					esa caja no se puede distinguir de una que oculta ese texto definitivamente, así que el
					texto se deja fuera en lugar de suponer. Analiza la página en ese estado (con la
					diapositiva visible) para comprobarlo. Límites: una caja fija o sticky sobre el texto queda
					fuera, ya que solo lo cubre en la posición de desplazamiento en la que se hizo el análisis;
					un degradado bajo el texto no se muestrea, así que un texto tenue sobre un degradado tenue
					se pregunta en lugar de fallar; y un efecto de grupo (<code>opacity</code>, un filtro, un
					modo de fusión) en un ancestro deja la superposición a una comprobación más aproximada.
					Bajo jsdom no hay diseño, así que el texto se mide solo frente a sus ancestros.
				</li>
				<li>
					<strong>El texto de un campo de formulario se mide tal como lo dibuja el campo.</strong> El
					valor de un <code>&lt;input&gt;</code> que muestra texto (text, search, email, url, tel,
					password, number, los tipos de fecha y hora) y el valor actual de un{" "}
					<code>&lt;textarea&gt;</code> se miden con el color del campo frente a su fondo; mientras
					el valor está vacío, el texto provisional se mide con el color y la fuente de{" "}
					<code>::placeholder</code>, atenuado por su <code>opacity</code>. No se mide: el texto que
					dibuja el navegador cuando un campo de fecha u hora está vacío (<code>mm/dd/yyyy</code>),
					el botón y el nombre de archivo de un input de archivo, y la opción mostrada de un{" "}
					<code>&lt;select&gt;</code>. Bajo jsdom no hay estilo <code>::placeholder</code>, así que
					ahí no se miden los textos provisionales; los valores sí. Un texto provisional por debajo
					de su relación de contraste es <code>cantTell</code> en lugar de un fallo (
					<code>PLACEHOLDER_BELOW_THRESHOLD</code>): WCAG somete el texto provisional a la relación
					de contraste, pero considera que la cumplen los colores que la página dejó por completo al
					navegador (técnica G148), y distinguir los colores del navegador de los de la página en
					páginas reales aún no está resuelto, así que por ahora decide una persona.
				</li>
				<li>
					<strong>
						<code>target-size-minimum</code> mide la región que un puntero puede alcanzar,
						calculada a partir del diseño.
					</strong>{" "}
					Un objetivo es su border box con sus esquinas redondeadas y sus transformaciones 2D,
					recortado por <code>clip</code> y <code>clip-path: inset()</code> en su cadena de bloques
					contenedores y no más grande que una caja de esa cadena que recorta su{" "}
					<code>overflow</code>, con el contenido que sobresale de él, menos las cajas pintadas encima
					que reciben eventos de puntero; es lo bastante grande cuando cabe dentro un cuadrado de 24
					por 24 alineado con la página (<span lang="en">Understanding</span> 2.5.8). Como la región
					sale del diseño y no de pruebas de impacto (hit-testing), los objetivos por debajo del
					pliegue se miden igual que los visibles, y también los objetivos dentro de una caja que
					recorta su desbordamiento, como si estuvieran desplazados dentro de ella. Las esquinas
					redondeadas se miden tal como se dibujan. Las cajas fijas y sticky sobre un objetivo quedan
					fuera; un objetivo antes del inicio de la página, adonde el desplazamiento no llega (un
					enlace de salto en <code>left: -9999px</code>), no es un objetivo. Se dejan como su caja
					delimitadora: las transformaciones 3D, otras formas de <code>clip-path</code> y el recorte
					redondeado de un ancestro. Su excepción en línea cubre un enlace dentro de una frase, que
					la regla interpreta como texto con una letra o un dígito fuera de cualquier objetivo en el
					tramo del bloque del enlace entre saltos de línea; los enlaces separados solo por
					separadores ("Edit | Delete") que se amontonan entre sí se preguntan en lugar de quedar
					exentos. Bajo jsdom, que no tiene diseño, la regla es <code>notApplicable</code>.
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
					tiene unos 8 casos distintos a nivel de regla ACT más allá de lo que está implementado):
					el propio contenido de audio/vídeo es fundamentalmente imposible de verificar a partir de
					marcado estático; los dos casos más amplios y seguros están cubiertos (
					<code>media-alternative-transcript-evidence</code>, <code>video-caption</code>), los más
					específicos no lo están, de forma deliberada.
				</li>
				<li>
					<strong>Análisis del contenido de imágenes de texto</strong> (WCAG 1.4.5/1.4.9):
					requeriría una comprensión de imágenes equivalente a OCR; fuera del alcance de un motor
					de marcado estático.
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
				Nada de lo anterior es exclusivo de surea11y: toda herramienta de accesibilidad basada en
				análisis estático (incluidos otros motores consolidados) comparte las limitaciones
				estructurales, y la mayoría comparte también las de criterio. La razón para exponerlo
				explícitamente aquí: <strong>un <code>pass</code> de este motor (o de cualquier herramienta
				automatizada) nunca sustituye la revisión manual que el propio WCAG exige para los criterios
				anteriores.</strong> Consulta{" "}
				<a href="/conformance/wcag-mapping/"><code>WCAG_CONFORMANCE.md</code></a> para saber
				exactamente qué afirma y qué no afirma un <code>pass</code>/<code>pass</code> compuesto.
			</p>
		</>
	);
}
