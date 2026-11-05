import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

export function HtmlReportContent() {
	return (
		<>
			<p>
				Un informe HTML autocontenido que puedes abrir en un navegador después de un análisis: sin
				servidor, sin recursos externos, sin peticiones de red. Pensado para quienes hacen pruebas de
				control de calidad (QA) o revisión manual y quieren una vista navegable de los resultados de
				un análisis en lugar de JSON sin procesar o un resumen de terminal. <a href="/sample-report.html">Abre un informe de
				ejemplo</a>: una pequeña página de pago analizada con los hooks de listeners y de regiones
				vivas, con un hallazgo en cada grupo y lo que el análisis deja a una persona.
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --html report.html", command: true }]} />
			<p>
				Abre <code>report.html</code> directamente desde el disco. Funciona junto a cualquier otro
				modo de salida: <code>--html</code> no sustituye a <code>--json</code>/al resumen
				predeterminado, es un artefacto adicional escrito en la ruta indicada.
			</p>

			<h2>Qué muestra</h2>
			<ul>
				<li>
					<strong>Cabecera</strong>: un titular en lenguaje llano ("N de M comprobaciones aplicables
					pasaron") más una barra apilada y una leyenda (icono + etiqueta + recuento; el estado
					nunca depende solo del color) desglosada por resultado (<code>fail</code>/
					<code>cantTell</code>/<code>pass</code>/<code>notApplicable</code>). Cuando ninguna regla
					falló y alguna se aplicó, una nota bajo el titular dice que eso no afirma que la página sea
					conforme, y nombra lo que una persona aún comprueba: los hallazgos que necesitan revisión,
					el uso con teclado, cómo lee la página un lector de pantalla y el propio contenido.
				</li>
				<li>
					<strong>Vale la pena revisar</strong>: una tarjeta por regla con ocurrencias{" "}
					<code>fail</code>/<code>cantTell</code> (no una por ocurrencia: una regla con muchas
					ocurrencias idénticas es una sola cosa que merece atención, no muchas), cada una mostrando
					gravedad, chip(s) de SC de WCAG, en un análisis de varios perfiles lo que hace de ella cada
					perfil («wai-aria-1.2: No superada» junto a «wcag22-aa: Requiere revisión», sus{" "}
					<code>verdicts</code>), una ocurrencia representativa y el recuento total de
					ocurrencias. Las reglas que fallan van primero. Les siguen los hallazgos que necesitan
					revisión, en tres grupos: aquellos cuyos indicios apuntan a un fallo («Probable fallo:
					confírmelo»), aquellos cuyos indicios apuntan a que cumple («Probablemente cumple:
					confírmelo») y los que solo una persona puede juzgar («Lo debe revisar una persona»), tal
					como los clasifica <code>reviewGroupOf(check, occurrence)</code> de{" "}
					<code>@surea11y/core</code>, para que una herramienta que ordena una cola de revisión la
					ordene igual. Cada tarjeta de los dos primeros dice por qué tiende hacia ese lado (el{" "}
					<a href="/results-reports/output-schema/#leans"><code>lean</code></a> de la ocurrencia).
					Cada una de estas tarjetas tiene una sección «Cómo comprobarlo», contraída por defecto,
					con los pasos para responder la pregunta y qué cumple y qué falla (el{" "}
					<a href="/results-reports/output-schema/#how-to-check"><code>howToCheck</code></a> de la
					ocurrencia). Una regla cuyos hallazgos tienden hacia lados distintos tiene una tarjeta en
					cada grupo. Dentro de cada grupo, primero la más grave (de crítica a menor) y, con la misma
					gravedad, la que tiene más ocurrencias. Limitado a las 24 reglas de mayor prioridad, con una nota de desbordamiento a
					partir de ahí. Una regla que no terminó (lanzó una excepción) también recibe una tarjeta,
					que lo indica junto con su error, ya que la página no se comprobó con ella. Una regla con
					un enlace de ayuda <code>http(s)</code> (<code>meta.helpUrl</code>, incluido el de una regla
					personalizada) recibe en su tarjeta un enlace "<span lang="en">How to fix &lt;rule&gt;</span>"; una regla sin él
					enlaza el documento <span lang="en">Understanding</span> del criterio de WCAG que comprueba
					("<span lang="en">Understanding 1.1.1 Non-text Content</span>").
					</li>
					<li>
						<strong>Frames</strong>: solo para un resultado entre frames (
						<code>runa11yCoreAcrossFrames</code>, o el <code>.frames(true)</code> de una
						integración). Las tarjetas anteriores son las de la propia página; esta sección tiene un
						encabezado por frame, nombrado por su ruta (los selectores de los elementos frame que
						llevan hasta él), con el título y la URL del frame y sus tarjetas, o "Not scanned" y el
						motivo para un frame que no respondió. El resto del informe describe la propia página.
					</li>
					<li>
						<strong>Lo más cerca del límite</strong>: se muestra cuando el análisis tiene márgenes (
						<a href="/results-reports/output-schema/#margin"><code>margin</code> en un resultado de comprobación</a>).
						Una fila por cada regla cuyo elemento aprobado más cercano quedó cerca de su umbral (dentro
						de la banda de la regla, como el 10 % de una razón de contraste), como indica la nota sobre
						la tabla: su valor aprobado más cercano, el límite, el margen que queda y el elemento. Los píxeles se redondean a enteros, con «menos
						de 1 px» por debajo de uno; las razones muestran dos decimales. Una regla que pasó con poco
						margen es una que un pequeño cambio puede convertir en un fallo.
					</li>
				<li>
					<strong>Resumen por WCAG</strong>: agrupado por nivel de conformidad (A / AA / AAA),
					obtenido directamente de los resultados agregados compuestos <code>rulesResults[]</code> propios del
					motor (ver <a href="/conformance/wcag-mapping/">Conformidad</a>): una fila por Criterio
					de Éxito (con los requisitos de cada otro estándar del <code>standards</code> del resultado
					a los que se asocian sus reglas, como la cláusula de EN 301 549 que lo reformula, cuando la
					hay y el análisis pidió cláusulas de EN 301 549), su resultado, un desglose de
					aprobado/fallido/necesita revisión/n.a. (con una línea «Comprobado en parte» cuando las reglas del
					criterio solo comprueban parte de lo que pide, así que una persona comprueba el resto, como
					«Comprobado en parte: sus comprobaciones cubren solo una parte de este criterio, y el resto
					lo comprueba una persona», o cuando el análisis seleccionó solo algunas de sus reglas, como
					«Comprobado en parte: 1 de 2 comprobaciones no se seleccionó para este análisis», ver{" "}
					<a href="/results-reports/output-schema/#partly-checked">Un criterio comprobado en
					parte</a>) y qué reglas atómicas contribuyeron, incluida una
					regla personalizada asociada al criterio. Son datos reales del motor, no una agrupación inventada:
					el mismo resultado agregado que obtendrías del <code>rulesResults</code> del JSON sin procesar.
				</li>
				<li>
					<strong>Resultado agregado propio de un estándar</strong>: solo cuando el análisis ejecutó
					las reglas de un estándar que tiene sus propios resultados agregados (su perfil, o{" "}
					<code>engineOptions.optInRules</code>), una tabla por estándar, y por versión de él cuando
					un análisis de varios perfiles juzgó la página con dos (EN 301 549 V3.2.1 con V4.1.1, cada
					una nombrada por su versión), con una fila por resultado agregado, con la redacción
					del estándar, los requisitos de las reglas que decidieron el resultado, el desglose y las
					reglas que contribuyeron. Esto cubre el estándar de un{" "}
					<a href="/configuration/packs/">pack</a> y la lista de comprobación de un pack, cuyos
					elementos son sus resultados agregados. Cada uno de esos estándares figura en el{" "}
					<code>standards</code> del resultado, así que un resultado guardado se muestra igual
					dondequiera que se genere; cuando esa lista falta o está dañada, el informe lo indica
					encima del resumen por WCAG.
				</li>
				<li id="whats-left-for-a-person">
					<strong>Lo que queda para una persona</strong> (core 1.15.0 y posteriores): lo que el
					análisis no puede decidir en los requisitos que evalúan sus reglas. Cada requisito del
					estándar analizado con una comprobación que ninguna regla decide por completo, cada uno con
					su resultado en el análisis al lado («Análisis: No superada», «Análisis: Superada» o
					«Ninguna regla lo comprueba») y, debajo, contraídas por defecto, esas comprobaciones: qué
					evalúa cada una, cuánto de ella deciden las reglas, las herramientas que necesita, los
					pasos, y qué cumple y qué falla (los{" "}
					<a href="/conformance/procedures/">procedimientos de prueba</a> de core). Una frase encima
					dice cuántas comprobaciones y requisitos hay, y que un requisito cuyas reglas se superan
					todas solo se cumple cuando también se superan sus comprobaciones. El estándar es WCAG, en
					la versión a la que apuntó el análisis y los niveles de los que informó; cuando el análisis
					ejecutó el perfil de un pack y el pack, pasado en <code>options.packs</code>, da
					procedimientos, es el estándar de ese pack, con su propia numeración. Un análisis de varios
					perfiles tiene una parte por cada estándar y versión. Una nota debajo dice cómo hacer con
					ellas una hoja de trabajo, para registrar un resultado de cada una (
					<code>renderProcedures</code>, o el <code>--manual-checks</code> de la CLI). Se genera en
					Node; el informe del navegador (<code>surea11y.report.js</code>) no la tiene.
				</li>
				<li>
					<strong>Datos técnicos completos</strong> (contraído por defecto): una tarjeta resumen
					(mosaicos por resultado) y una tabla con función de búsqueda, filtrable (por resultado) y paginada de
					cada ocurrencia individual de todo el análisis; un hallazgo que necesita revisión y tiene
					tendencia la muestra bajo su resumen («Probable fallo: …»), y la búsqueda la encuentra.
					Cuando no muestra ninguna ocurrencia,
					contiene una fila que lo dice: el análisis no registró ninguna, o los filtros las ocultan
					todas.
				</li>
			</ul>
			<p>
				Un elemento dentro de un árbol shadow se localiza por los selectores de sus hosts shadow
				y luego el suyo propio, unidos con <code>{" >>> "}</code>:{" "}
				<code>{"html > body > main > x-card >>> button"}</code>. Las tarjetas, la tabla de márgenes
				y la tabla de ocurrencias lo muestran así, igual que{" "}
				<a href="/results-reports/sarif-report/#field-mapping">SARIF</a> y{" "}
				<a href="/results-reports/junit-report/#outcomes">JUnit</a>.
			</p>
			<p>
				El informe sigue el esquema de color del lector, y su propio texto cumple WCAG 1.4.3 en
				ambos: cada color de estado tiene al menos 4,5:1 sobre su chip y su mosaico, y las propias
				reglas de contraste del motor pasan en el informe renderizado en modo claro y oscuro.
			</p>
			<p>
				El informe se reorganiza a 320 px CSS (WCAG 1.4.10): la página nunca se desplaza en
				horizontal. Una tabla más ancha que la ventana se desplaza dentro de su propia caja, una
				región con el nombre del encabezado de la tabla que recibe el foco del teclado, así que se
				puede desplazar con las flechas.
			</p>
			<p>
				La barra de metadatos bajo la cabecera lleva el recuento de reglas, el recuento de
				ocurrencias, la etiqueta del motor, la versión del esquema, la versión de WCAG a la que
				apuntó el análisis, el <code>engineOptions.profile</code> que usó (si hubo uno; cada perfil
				de un análisis de varios, unidos con <code>+</code>, y los que no se ejecutaron), las
				etiquetas de reglas opcionales que añadió <code>engineOptions.optInRules</code> (si añadió
				alguna), las condiciones en que se renderizó la página y el idioma al que se resolvió el
				análisis. Las condiciones son el viewport (con la relación de píxeles del dispositivo cuando
				no es 1) y el esquema de color, y las fuentes web cuando aún se estaban cargando; un
				análisis sin diseño, en jsdom, lo indica en su lugar. Un hallazgo que depende del diseño
				puede aparecer y desaparecer con el ancho del viewport, así que el chip indica qué ancho
				describe el informe. El mecanismo de reserva de idioma es por cadena de texto e invisible en el propio texto, así
				que <strong>un informe solicitado en un idioma que el motor no soporta se lee como uno en
				inglés normal</strong>; el chip nombra el idioma solicitado junto al resuelto cuando ambos
				difieren. Ver <a href="/configuration/locales/">Locales</a>.
			</p>
			<p>
				Toda la página está escrita en el idioma al que se resolvió el análisis: encabezados,
				columnas de tabla, nombres de resultados y gravedades, el titular, el paginador y el formato
				de fecha. <code>&lt;html lang&gt;</code> nombra ese idioma. Los códigos de resultado de los
				filtros de ocurrencias (<code>fail</code>, <code>cantTell</code>, …) se mantienen tal cual,
				porque son los valores que un lector busca en el resultado JSON.
			</p>
			<p>
				Un caso conserva las etiquetas en inglés: un análisis en un idioma que el motor no incluye,
				ejecutado con un diccionario <code>engineOptions.messages</code> propio. Ese diccionario no
				forma parte del resultado, así que el informe no puede leer etiquetas de él; sus hallazgos
				se marcan entonces con su propio idioma (<code>lang="nl"</code>, por ejemplo), para que un
				lector de pantalla los lea con la voz adecuada.
			</p>
			<p>
				Un resultado compacto (<code>engineOptions.output.detail: 'findings'</code>, ver{" "}
				<a href="/results-reports/output-schema/#top-level-result">Esquema de salida</a>) se lee
				como el resultado completo que representa, así que se informa igual.
			</p>

			<h2>Uso como biblioteca</h2>
			<CodeBlock
				lang="js"
				lines={[
					"const { renderHtmlReport } = require('@surea11y/core/report');",
					"const { runDomRulesInPage } = require('@surea11y/core');",
					"",
					"const result = runDomRulesInPage(url, null, {}, null);",
					"const html = renderHtmlReport(result, { title: 'My scan report' });",
					"",
					"require('fs').writeFileSync('report.html', html);",
				]}
			/>
			<p>
				<code>renderHtmlReport(result, options)</code> devuelve una cadena y{" "}
				<strong>nunca toca el sistema de archivos por sí misma</strong> (el flag <code>--html</code>{" "}
				de la CLI es el que escribe). La página se fecha con el <code>timestamp</code> del resultado
				(se establece con <code>engineOptions.timestamp</code>), mostrado en UTC, así que el mismo
				resultado siempre genera la misma página; un resultado sin él se fecha con el momento en que
				se genera. <code>options.title</code> es opcional (por defecto, el título propio del idioma del
				informe: <code>"Informe de análisis de surea11y"</code> en español).{" "}
				<code>options.packs</code> es la lista de packs que ejecutó el análisis (
				<code>engineOptions.packs</code>), cuando ejecutó alguno: en Node el informe añade los
				pasos de «Cómo comprobarlo» a los hallazgos sin decidir que llegan sin ellos, siempre los
				de una regla de core y los de la regla base de una variante, y los pasos propios de una
				regla de un pack (su <code>meta.review</code>, en inglés, o como los traduzcan los
				diccionarios de su pack) solo cuando recibe los packs (ver{" "}
				<a href="/configuration/packs/#review-steps">Packs</a>). En el navegador (
				<code>surea11y.report.js</code>) muestra los pasos que el resultado ya lleva. Con los packs,
				«Lo que queda para una persona» sigue también el estándar de un pack cuando el análisis
				ejecutó su perfil. <code>options.manualChecks: false</code> deja fuera esa sección.
			</p>

			<h2>Alcance</h2>
			<p>
				<strong>Esto es un informe de un solo análisis: una instantánea puntual, no un panel que
				siga resultados a lo largo de muchos análisis en el tiempo.</strong> Seguir resultados a lo
				largo de muchas ejecuciones es un asunto aparte, más amplio, y no forma parte de esta
				herramienta: conserva el JSON de cada análisis y compáralo tú mismo, o bien envía SARIF a un panel
				que ya se encargue del historial (ver <a href="/results-reports/sarif-report/">Informe
				SARIF</a> más abajo).
			</p>
		</>
	);
}
