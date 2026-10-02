import React from "react";

const core = "https://github.com/SureA11y/core/blob/main";

export function KnownLimitationsContent() {
	return (
		<>
			<p>
				Estas limitaciones se exponen con claridad desde el principio para que no tengas que
				descubrirlas por tu cuenta. Cada elemento aquí es una decisión deliberada y razonada, no un
				descuido, pero "deliberada" no significa "sin importancia antes de confiar en esta
				herramienta".
			</p>

			<h2>Estructurales: esta arquitectura no puede hacer esto en absoluto</h2>
			<p>
				surea11y es un <strong>análisis estático del DOM</strong>: lee el árbol DOM y los estilos
				calculados en un instante determinado, sin capacidad de simular la interacción del
				usuario, esperar cambios de estado asíncronos ni medir el diseño real en tamaños de
				viewport arbitrarios. No se trata de reglas faltantes: ninguna implementación de regla,
				por ingeniosa que sea, puede resolver esto sin una arquitectura fundamentalmente distinta
				(automatización de navegador real que genere eventos de teclado/puntero reales a lo largo
				del tiempo):
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
					), pero sería la primera comprobación de este motor que modifica la página que está
					inspeccionando, así que no está implementada y, aunque lo estuviera, no formaría parte
					de un análisis normal. Mientras tanto, nada en el marcado estático la sustituye.
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
					<strong>
						En un navegador real, algunas reglas modifican la página mientras dura su comprobación, y
						los propios scripts de la página pueden reaccionar.
					</strong>{" "}
					Para medir lo que dibuja el navegador, <code>css-hidden-focus</code> enfoca elementos como
					lo haría el teclado y desactiva las transiciones en el elemento que mide;{" "}
					<code>text-spacing-content-loss</code> añade una hoja de estilo con el espaciado de WCAG
					1.4.12. Todo esto se restablece antes de que la regla termine: el foco, la posición de
					desplazamiento, los atributos style y la hoja de estilo añadida. Lo que no se puede
					restablecer es lo que hagan los scripts de la página en respuesta, ya que enfocar un
					elemento dispara sus manejadores <code>focus</code>: un carrusel puede pasar a la
					diapositiva enfocada o activar un botón. Los hallazgos no se ven afectados, pero si
					analizas una página que sigues usando, recárgala después.
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
