import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { ResultBadge } from "./design-system/results/ResultBadge.jsx";
import rules from "../data/rules.generated.json";

const core = "https://github.com/SureA11y/core/blob/main";

const packageRows = [
	{ id: "playwright", want: "Agregar comprobaciones de accesibilidad a las pruebas de Playwright", install: <><code>@surea11y/playwright</code> + <code>@surea11y/core</code></> },
	{ id: "puppeteer", want: "…Puppeteer", install: <><code>@surea11y/puppeteer</code> + <code>@surea11y/core</code></> },
	{ id: "selenium", want: "…Selenium", install: <><code>@surea11y/selenium</code> + <code>@surea11y/core</code></> },
	{ id: "cypress", want: "…Cypress", install: <><code>@surea11y/cypress</code> + <code>@surea11y/core</code></> },
	{ id: "webdriverio", want: "…WebdriverIO", install: <><code>@surea11y/webdriverio</code> + <code>@surea11y/core</code></> },
	{ id: "test-matchers", want: "Verificar la accesibilidad en pruebas de componentes o unitarias con Jest/Vitest", install: <><code>@surea11y/test-matchers</code> + <code>@surea11y/core</code></> },
	{ id: "cli", want: "Analizar páginas desde una terminal o una canalización de CI, como HTML estático o en Chromium", install: <code>@surea11y/cli</code> },
	{ id: "pack-en301549", want: "Comprobar EN 301 549, el estándar europeo, con cualquiera de los anteriores", install: <><a href="/configuration/packs/#en-301-549-pack"><code>@surea11y/pack-en301549</code></a> + <code>@surea11y/core</code></> },
	{ id: "pack-own", want: "Comprobar tus propias reglas, perfiles o estándar, públicos o internos", install: <>Un pack propio: ver <a href="/configuration/packs/#writing-a-pack">Escribir un pack</a></> },
	{ id: "core", want: "Ejecutar el motor sobre un DOM que ya tengas", install: <code>@surea11y/core</code> },
	{ id: "core-build", want: "Crear tu propia herramienta sobre el motor: una CLI, una extensión, un panel, un generador de informes", install: <code>@surea11y/core</code> },
];

export function OverviewLead() {
	return (
		<>
			<p>
				<a href="https://github.com/SureA11y/core">@surea11y/core</a> es un <strong>motor de pruebas de accesibilidad</strong> que ejecutas en tu propia
				suite de pruebas, canalización de CI o desde la línea de comandos.
			</p>
			<p>
				Lo que lo distingue es lo que hace con los casos que las pruebas automatizadas no pueden resolver. Implementa
				el{" "}
				<a href="https://www.w3.org/TR/act-rules-format/">
					<span lang="en">Accessibility Conformance Testing (ACT) Rules Format</span>
				</a>{" "}
				abierto del W3C, validado con el corpus público de casos de prueba de ACT, en lugar de evaluarse
				únicamente con sus propias pruebas. Informa hallazgos, ausencia de hallazgos y, de forma poco habitual,
				incertidumbre explícita, de modo que los resultados son auditables en lugar de tranquilizadores.
			</p>
			<p>
				<em><span lang="en">Sure</span></em> significa certeza sobre lo que se sabe, y honestidad sobre lo que no. Te dice lo que
				no te puede decir.
			</p>
		</>
	);
}

export function OverviewContent() {
	return (
		<>
			<h2>No es un único producto</h2>
			<p>
				surea11y es una familia de paquetes que comparten un mismo motor, no una única herramienta con un
				único comando de instalación. Instala el que coincida con cómo ya pruebas, junto con{" "}
				<code>@surea11y/core</code>, el motor que ejecuta. Instala core por sí solo para ejecutar el
				motor sobre un DOM que ya tengas, o para crear tu propia herramienta sobre él:
			</p>
			<DataTable
				label="Qué paquete instalar"
				rowKey="id"
				columns={[
					{ key: "want", label: "Quiero…", wrap: true },
					{ key: "install", label: "Instalar", width: "26%" },
				]}
				rows={packageRows}
			/>
			<p>
				Consulta <a href="/getting-started/">Primeros pasos</a> para ver la instalación y el uso de cada integración (<code>binding</code>). Si estás creando
				una herramienta, <a href={`${core}/docs/BUILDING_ON_CORE.md`}><code>BUILDING_ON_CORE.md</code></a>{" "}
				(en GitHub, en inglés) explica el contrato estable, cómo ejecutar análisis, cómo elegir
				comprobaciones y cómo presentar los resultados sin afirmar más de lo que dicen.
			</p>
			<p>
				Para un primer vistazo sin suite de pruebas, carga el{" "}
				<a href="/getting-started/standalone/">bundle independiente</a> en una página y analízala
				desde la consola del navegador: <code>await a11ycore.run()</code> analiza la página,{" "}
				<code>a11ycore.table(result)</code> lista los resultados, <code>a11ycore.highlight(result)</code>{" "}
				los recuadra en la página y <code>await a11ycore.openReport(result)</code> abre el informe
				HTML.{" "}
				<a href={`${core}/docs/INTEGRATION.md#from-the-browser-console`}>
					<code>INTEGRATION.md</code>
				</a>{" "}
				(en GitHub, en inglés) lista las demás funciones de ayuda, como{" "}
				<code>a11ycore.inspect('headings')</code> para los encabezados, los landmarks, los nombres o
				el orden del foco de una página.
			</p>

			<h2>En qué se diferencian sus resultados</h2>
			<p>
				Cada regla toma una decisión determinista, a partir de un vocabulario fijo de cuatro resultados,
				no la forma <code>violations</code>/<code>passes</code>/<code>incomplete</code>/
				<code>inapplicable</code> que usan otras herramientas populares de pruebas de accesibilidad:
			</p>
			<ul className="outcome-list">
				<li>
					<ResultBadge lang="en" state="fail" /> (<code>fail</code>): una violación demostrable a partir del DOM.
					Reservado para casos objetivos y normativos.
				</li>
				<li>
					<ResultBadge lang="en" state="pass" /> (<code>pass</code>): se cumple la condición específica de esta regla.{" "}
					<strong>No es una afirmación de que la página sea accesible.</strong>
				</li>
				<li>
					<ResultBadge lang="en" state="unknown" /> (<code>cantTell</code>): una persona tiene que decidir esto, y
					el resultado indica qué era ambiguo.
				</li>
				<li>
					<ResultBadge lang="en" state="na" /> (<code>notApplicable</code>): la precondición de la regla no está
					presente.
				</li>
			</ul>
			<p>
				<code>cantTell</code> expresa uno de los principios centrales del proyecto. Un motor que descarta en silencio lo que no puede
				determinar <strong>produce un informe más corto y una falsa sensación de cobertura</strong>. Consulta{" "}
				<a href="/results-reports/output-schema/">Resultados e informes</a> para conocer la estructura completa
				del resultado, y{" "}
				<a href="/conformance/wcag-mapping/">Conformidad</a> para ver cómo los resultados individuales se
				combinan en un veredicto de WCAG, incluida la forma en que se resuelve y aplica una versión de
				WCAG objetivo (2.0/2.1/2.2).
			</p>
			<p>
				Un <code>cantTell</code> no te deja solo con una pregunta. Cada uno que informa una regla de
				core dice cómo responderla: unos pocos pasos a partir del elemento que señala, y lo que verás
				si cumple y si falla, en el idioma del análisis. Cuando la página aporta indicios, el
				resultado además se inclina hacia <code>pass</code> o <code>fail</code>, con los hechos que
				leyó, su motivo y lo que podría hacerlo erróneo. Cada inclinación se cuenta frente a los
				casos de prueba ACT del W3C y, cuando se ha contado en al menos cinco, dice cuántas veces
				acertó; hasta entonces no lleva ninguna cifra, nunca una estimación. El resultado sigue
				siendo <code>cantTell</code>: una inclinación ordena las preguntas, y las sigue respondiendo
				una persona. Consulta{" "}
				<a href="/results-reports/output-schema/#how-to-check">Cómo comprobarlo</a> e{" "}
				<a href="/results-reports/output-schema/#leans">Inclinaciones</a> en el Esquema de salida, y{" "}
				<a href={`${core}/docs/LEANS.md`}><code>LEANS.md</code></a> (en GitHub, en inglés) para saber
				qué hace que un resultado se incline y hasta qué punto fiarse de ello.
			</p>
			<p>
				El informe HTML presenta las preguntas en el orden en que las revisa una persona: «Probable
				fallo: confírmelo», «Probablemente cumple: confírmelo» y «Lo debe revisar una persona». Cada
				tarjeta tiene sus pasos de «Cómo comprobarlo», y las de los dos primeros grupos dicen por
				qué se inclinan. En CI, los informes JUnit y SARIF
				también pueden bloquear la compilación por los resultados que se inclinan hacia el fallo,
				desactivado por defecto, y una baseline puede aceptar los que una página ya tiene, de modo
				que solo los nuevos rompen la compilación. Consulta{" "}
				<a href="/results-reports/html-report/">Informe HTML</a> y{" "}
				<a href="/conformance/baseline/">Baseline / allowlist</a>, o <a href="/sample-report.html">abre un informe de ejemplo</a> de una
				pequeña página de pago.
			</p>
			<p>
				Un <code>pass</code> que pasó por poco lo dice. Las reglas que miden contra un umbral
				(contraste, tamaño del objetivo, espaciado del texto) informan de un <code>margin</code>{" "}
				cuando el <code>pass</code> más ajustado quedó cerca del límite: el elemento que más se
				acercó sin dejar de cumplirlo. Un texto con 4,52:1 frente a un
				mínimo de 4,5:1 pasa, y el margen lo muestra, así que puedes corregirlo antes de que un cambio
				pequeño lo convierta en un <code>fail</code>. Consulta el{" "}
				<a href="/results-reports/output-schema/#margin">Esquema de salida</a>.
			</p>
			<p>
				Nombra el estándar y el motor elige las reglas.{" "}
				<code>{"{ wcag: { version: '2.2', level: 'AA' } }"}</code> ejecuta las reglas de los criterios
				A y AA de WCAG 2.2, según el nivel que tiene cada criterio en esa versión, y{" "}
				<code>bestPractices: true</code> añade las comprobaciones que WCAG no exige. Un estándar más
				allá de WCAG, como uno nacional o la política propia de tu organización, llega como un pack:
				sus reglas, perfiles y elementos de lista de comprobación se ejecutan junto a los de core
				y aparecen en todos los informes. Consulta{" "}
				<a href="/configuration/engine-options/#selecting-which-rules-run">Opciones del motor</a> y{" "}
				<a href="/configuration/packs/">Packs</a>.
			</p>
			<p>
				Si nombras comprobaciones en lugar de un estándar, el resultado sigue indicando a qué
				criterios de WCAG afectan. Un análisis que ejecuta solo <code>link-name-present</code> informa
				también de 2.4.4 y 4.1.2, más el AAA 2.4.9 si el análisis no fija un nivel, y un criterio cuyas otras comprobaciones el análisis dejó fuera
				resulta <code>cantTell</code> («Comprobado en parte» en el informe HTML), no <code>pass</code>.{" "}
				<code>wcagLevel: 'AA'</code> fija el nivel de los criterios que informa un análisis, y los
				informes JUnit, SARIF y EARL lo siguen, así que una compilación AA no falla por un criterio AAA.
			</p>
			<p>
				Ningún criterio de WCAG se da por cumplido a partir de reglas que solo comprueban una parte
				de él. Un criterio cumple solo cuando sus reglas comprueban todo lo que pide, y todavía no
				hay ninguno comprobado tan a fondo, así que cuando todas las reglas de un criterio cumplen,
				el criterio resulta <code>cantTell</code>: las partes que comprueban las reglas se cumplen, y
				una persona comprueba el resto. Un informe sin ningún fallo dice lo mismo bajo su titular:
				ninguna regla ha fallado, y eso no significa que la página sea conforme. Dar esos criterios
				por cumplidos sería la falsa sensación de cobertura que este motor está hecho para evitar.
				Consulta <a href="/conformance/wcag-mapping/">Mapeo de conformidad con WCAG</a>.
			</p>
			<p>
				Los componentes web se juzgan por lo que exponen. Un elemento personalizado que se da un
				nombre, estados o un rol mediante <code>ElementInternals</code> se comprueba con ellos cuando
				el motor puede leerlos, y se pregunta por él cuando no puede. Para ejecuciones de prueba y de
				auditoría, <code>internalsHookScript()</code> es un script opcional que permite al análisis
				leer los <code>internals</code> que un componente guarda en privado, de modo que esos
				elementos se aprueban o fallan en lugar de quedar en <code>cantTell</code>.{" "}
				<a href={`${core}/docs/INTEGRATION.md#reading-private-elementinternals-the-internals-hook`}>
					<code>INTEGRATION.md</code>
				</a>{" "}
				(en GitHub) muestra cómo instalarlo antes de los scripts de la propia página.
			</p>
			<p>
				Las reglas llegan a tres criterios que ninguna regla cubría antes: 3.3.1 Identificación de
				errores (un campo marcado como no válido cuyo mensaje de error falta, está oculto o no está
				asociado a él), 4.1.3 Mensajes de estado (una región viva a la que las tecnologías de apoyo
				no pueden llegar) y 1.4.5 Imágenes de texto (texto dibujado en una imagen que podría ser
				texto real). Las tres preguntan en lugar de fallar. Las reglas de teclado leen los
				controladores de eventos del marcado; con <code>listenerHookScript()</code>, otro script
				opcional que se instala antes de los de la propia página, juzgan también los listeners
				añadidos desde script, así que un <code>role="button"</code> en el orden de tabulación con un
				listener de clic y ninguno de teclado en ningún lugar al que lleguen sus teclas (en él,
				dentro de él, en sus ancestros, en un shadow root en el que esté, el documento o la
				ventana), y sin ningún listener de foco que pudiera añadir uno, falla: Intro y Espacio no
				hacen nada.{" "}
				<a href={`${core}/docs/INTEGRATION.md#seeing-listeners-added-from-script-the-listener-hook`}>
					<code>INTEGRATION.md</code>
				</a>{" "}
				(en GitHub) muestra cómo instalarlo, y su equivalente para los mensajes de estado, el hook
				de regiones vivas.
			</p>
			<p>
				En un navegador, el contraste se mide tal como se dibuja la página: el texto de una página
				sin fondo propio, sobre el lienzo que pinta el navegador, claro u oscuro; el texto generado
				con <code>::before</code>, <code>::after</code> y los marcadores de lista; un{" "}
				<code>&lt;select&gt;</code> cerrado. Antes se omitían o se preguntaba por ellos. El texto
				dibujado solo con un contorno o una sombra falla ahora donde todos los colores con los que
				se dibuja quedan por debajo de la proporción. Un único carácter que hace las veces del nombre de un
				control, como la «X» de un botón llamado «Cerrar», se pregunta en lugar de fallar: saber si
				es un icono o una letra requiere a una persona.
			</p>

			<h3 id="checked-against-the-act-corpus">Verificado contra el corpus de ACT</h3>
			<p>
				El motor incluye {rules.length} reglas. Las que tienen una contraparte en{" "}
				<a href="https://www.w3.org/WAI/standards-guidelines/act/rules/"><span lang="en">W3C ACT Rules</span></a>{" "}
				se ejecutan contra los casos de prueba que el W3C publica para ellas, el conjunto que puntúa
				el propio listado de implementaciones del W3C: 957 ejemplos en 60 reglas de ACT. El motor no
				falla en ninguno de los ejemplos que ACT marca como aprobados o no aplicables, por lo que no
				informa falsos positivos frente a ese corpus. Es un resultado sobre esos ejemplos, no una
				garantía para cualquier página; cuando el motor no puede decidir un caso, devuelve{" "}
				<code>cantTell</code>, algo que ACT permite a una implementación automatizada.
			</p>
			<p>
				Se cumple en los dos lugares donde se ejecuta el motor: en jsdom, como lo ejecutan
				test-matchers y la CLI por defecto, y en Chromium, como lo hacen las integraciones de navegador, con cada
				caso de prueba cargado como una página real, incluidos sus scripts y hojas de estilo
				enlazadas. Veintidós ejemplos que ACT marca como fallidos quedan sin señalar en jsdom, y 18
				en Chromium. En su mayoría son juicios de valor, como si un encabezado describe el contenido
				que tiene debajo; los cuatro que detecta el navegador necesitan los scripts o las hojas de
				estilo de la propia página, que jsdom no ejecuta. Consulta{" "}
				<a href={`${core}/docs/ACT_RULE_MAPPING.md`}><code>ACT_RULE_MAPPING.md</code></a> para ver cada
				uno, con el razonamiento.
			</p>
			<p>
				Dos informes de implementación EARL registran el resultado de cada uno de esos casos,
				incluidos los resultados aprobados y no aplicables, de modo que una regla que permaneció en
				silencio porque nada le era aplicable se distingue de una que directamente no está
				implementada:{" "}
				<a href="https://surea11y.github.io/act-report/act-report.jsonld" lang="en">SureA11y</a>,
				ejecutado en jsdom, y{" "}
				<a href="https://surea11y.github.io/act-report/act-report-browser.jsonld" lang="en">
					SureA11y in a browser
				</a>
				, ejecutado en Chromium. Consulta{" "}
				<a href="/results-reports/earl-report/">Informe EARL</a> para conocer el formato.
			</p>

			<h2>Principios clave</h2>
			<ul>
				<li><strong>Ejecución determinista.</strong> La misma página, renderizada en las mismas condiciones y analizada con las mismas opciones, recibe las mismas decisiones. Los tiempos, las marcas de tiempo y los detalles del entorno en el resultado pueden variar entre ejecuciones. Las animaciones y transiciones en curso se detienen durante el análisis, así que un fundido a medias no cambia lo que miden las reglas.</li>
				<li><strong>Conservador por diseño.</strong> Las reglas de core reservan <code>fail</code> para violaciones objetivas y normativas, para que las falsas alarmas sean poco frecuentes.</li>
				<li><strong>Trazabilidad frente a los estándares.</strong> Las reglas se asignan al Criterio de Éxito de WCAG aplicable siempre que corresponde.</li>
				<li><strong>Salida estable y legible por máquina.</strong> Los identificadores de regla permanecen estables sin importar el idioma.</li>
				<li><strong>Independiente del framework.</strong> Se ejecuta dentro de jsdom o de cualquier framework de automatización de navegador.</li>
				<li><strong>Extensible.</strong> Agrega reglas personalizadas, registra políticas y filtra análisis por ID de regla, etiquetas o versión de WCAG.</li>
				<li><strong>Informes localizados.</strong> Los mensajes legibles por humanos se pueden traducir sin afectar los datos legibles por máquina: hoy incluye <code>en</code>, <code>fr</code>, <code>de</code>, <code>es</code> y <code>ja</code>.</li>
			</ul>

			<h2>Filosofía</h2>
			<blockquote>
				Automatiza lo que se puede determinar objetivamente. Nunca finjas automatizar lo que no se puede.
			</blockquote>
			<p>
				Algunos requisitos de WCAG se pueden comprobar con total confianza. Otros necesitan juicio humano,
				conocimiento del contexto o una evaluación de usabilidad. Una puntuación única o un veredicto
				binario borra esa diferencia; surea11y la informa. Por eso existen <code>cantTell</code>{" "}
				y <code>notApplicable</code> como resultados, y eso da forma a cada regla del motor.
			</p>

			<h3>Lo que surea11y no detecta</h3>
			<p>Ser explícito sobre los límites de la automatización es parte de la misma filosofía. Por ejemplo, surea11y no:</p>
			<ul>
				<li>confirma que un texto alternativo sea <em>significativo</em>, solo que esté presente (un atributo alt con el valor <code>"image123.png"</code> aprueba la comprobación objetiva, y se pregunta por él, inclinado hacia el fallo, como nombre de archivo);</li>
				<li>juzga si una elección de contraste de color es estéticamente apropiada, solo si cumple la relación de contraste aplicable;</li>
				<li>determina si un mensaje de error realmente <em>explica</em> el problema, ya que eso depende de una lógica de validación que un análisis estático no puede ver;</li>
				<li>detecta una trampa de foco de teclado o contenido recortado al 400% de zoom, ya que ambos requieren simular una interacción real del usuario a lo largo del tiempo, no solo leer el DOM en un instante.</li>
			</ul>
			<p>
				Algunas comprobaciones implementadas informan <code>cantTell</code> cuando una persona
				tiene que decidir. Otros aspectos, como las trampas de teclado y el reflujo al aplicar
				zoom, el motor no los comprueba en absoluto y necesitan pruebas aparte: ningún{" "}
				<code>cantTell</code> los sustituye, así que un resultado sin ninguno no significa que se
				hayan cubierto. Consulta{" "}
				<a href="/help/known-limitations/">Limitaciones conocidas</a> para ver la lista completa.
			</p>
		</>
	);
}

export function OverviewAbout() {
	return (
		<section className="stewardship" aria-labelledby="about-the-project">
			<h2 id="about-the-project" className="stewardship-label">Sobre el proyecto</h2>
			<p className="stewardship-lead">
				surea11y es un proyecto independiente de código abierto, desarrollado a la vista de todos.
			</p>
			<p className="stewardship-body">
				<code>@surea11y/core</code> y todos los paquetes de integración están publicados en{" "}
				<a href="https://www.npmjs.com/org/surea11y">npm</a>. Las incidencias, las conversaciones y
				cada cambio son públicos en <a href="https://github.com/SureA11y">GitHub</a>, y las
				contribuciones son bienvenidas. Consulta{" "}
				<a href="https://github.com/SureA11y/core/blob/main/CONTRIBUTING.md">
					<code>CONTRIBUTING.md</code>
				</a>{" "}
				(en inglés) para ver las pautas de contribución.
			</p>
			<div className="stewardship-byline">
				<p className="stewardship-credit">
					<span className="stewardship-credit-label">Creado y mantenido actualmente por</span>{" "}
					<span className="stewardship-name">Jorge Rumoroso</span>
				</p>
				<p className="stewardship-role">
					Especialista en accesibilidad digital, con experiencia profesional en auditoría,
					estándares y gobernanza de la accesibilidad.
				</p>
				<p className="stewardship-link">
					<a href="https://www.linkedin.com/in/jorgerumoroso/">Perfil en LinkedIn</a>
				</p>
			</div>
		</section>
	);
}
