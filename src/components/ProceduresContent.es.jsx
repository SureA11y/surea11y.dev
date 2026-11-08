import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const toolRows = [
	{ id: "keyboard", tool: <code>keyboard</code>, what: "Un teclado" },
	{ id: "pointer", tool: <code>pointer</code>, what: "Un ratón u otro dispositivo señalador" },
	{ id: "screen-reader", tool: <code>screen-reader</code>, what: "Un lector de pantalla" },
	{ id: "zoom", tool: <code>zoom</code>, what: "El zoom del navegador" },
	{ id: "contrast-theme", tool: <code>contrast-theme</code>, what: "Un tema de alto contraste (colores forzados)" },
	{ id: "devtools", tool: <code>devtools</code>, what: "Las herramientas para desarrolladores del navegador" },
];

const functionRows = [
	{ id: "proceduresFor", fn: <code>proceduresFor(requirement, options)</code>, what: <>Un requisito: un criterio de WCAG (<code>'1.4.12'</code>), <code>'best-practice'</code> o un requisito de un pack.</> },
	{ id: "listProcedures", fn: <code>listProcedures(options)</code>, what: "Todos los requisitos de un estándar, en su orden, con los grupos en que los organiza (los principios y pautas de WCAG)." },
	{ id: "procedureChecklist", fn: <code>procedureChecklist(options)</code>, what: "Lo que hace una persona para evaluar el estándar, una vez cada cosa: un elemento por procedimiento general." },
	{ id: "renderProcedures", fn: <code>renderProcedures(input, options)</code>, what: "Cualquiera de los tres como una página HTML autocontenida, o en Markdown." },
	{ id: "relatedRequirements", fn: <code>relatedRequirements(requirement, options)</code>, what: "Entre WCAG y el estándar de un pack: los requisitos que reformulan un criterio o se relacionan con él, y a la inversa." },
	{ id: "procedureLanguages", fn: <code>procedureLanguages(options)</code>, what: "Los idiomas en que pueden leerse los procedimientos de un estándar, cada uno completo o no, para un selector de idioma." },
];

const listOptionRows = [
	{ id: "standard", option: <code>standard</code>, what: <><code>'wcag'</code> (el predeterminado), <code>'best-practice'</code>, o el estándar de un pack por clave o nombre.</> },
	{ id: "version", option: <code>version</code>, what: <>La de WCAG (<code>'2.0'</code>, <code>'2.1'</code>, <code>'2.2'</code>, la predeterminada), o la del estándar del pack.</> },
	{ id: "levels", option: <code>levels</code>, what: <>Solo WCAG: <code>'A'</code>, <code>'AA'</code>, <code>'AAA'</code> o una lista de ellos; todos los niveles por defecto.</> },
	{ id: "locale", option: <code>locale</code>, what: <>Una etiqueta (<code>'fr-CA'</code> lee <code>fr-ca</code> y luego <code>fr</code>) o una lista, la preferida primero; inglés para cualquier texto que le falte a un locale.</> },
	{ id: "tools", option: <code>tools</code>, what: <>Solo las facetas cuyo procedimiento necesita una de estas herramientas (<code>'screen-reader'</code>).</> },
	{ id: "automation", option: <code>automation</code>, what: <>Solo las facetas que las reglas deciden por completo, en parte o nada: <code>['manual', 'partial']</code> es lo que un análisis deja a una persona.</> },
	{ id: "rules", option: <code>rules</code>, what: <>Solo las facetas que reclama una de estas reglas (<code>'img-alt-present'</code>).</> },
	{ id: "packs", option: <code>packs</code>, what: "Los packs cuyo estándar o reglas se leen." },
	{ id: "profile", option: <code>profile</code>, what: <>El perfil de un pack que nombra una ley: solo los requisitos que pide esa ley, con la ley nombrada en la cabecera de la lista (core 1.16.0, experimental; consulta <a href="/configuration/packs/#laws">Packs</a>).</> },
];

const renderOptionRows = [
	{ id: "format", option: <code>format</code>, what: <><code>'html'</code> (el predeterminado) o <code>'markdown'</code>.</> },
	{ id: "locale", option: <code>locale</code>, what: "El idioma de las palabras propias de la página; por defecto, aquel en que se leyeron los procedimientos." },
	{ id: "title", option: <code>title</code>, what: <>El título y el encabezado de la página; por defecto, uno que nombra el estándar («WCAG 2.2: lista de comprobación manual»).</> },
	{ id: "variants", option: <code>variants</code>, what: <><code>true</code> añade, bajo cada faceta de una lista, los pasos que da para ella el hallazgo sin decidir de un análisis, en un desplegable cerrado.</> },
	{ id: "record", option: <code>record</code>, what: <><code>false</code> deja fuera los resultados de la página de una lista de comprobación y su script.</> },
	{ id: "before", option: <code>before</code>, what: <><code>false</code> deja fuera «Antes de empezar», los hábitos que hacen fiable un resultado.</> },
	{ id: "fragment", option: <code>fragment</code>, what: <><code>true</code> da solo el contenido, sin documento, estilos ni script, para ponerlo en una página propia.</> },
	{ id: "packs", option: <code>packs</code>, what: "Los packs con los que se leyeron los procedimientos." },
];

export function ProceduresContent() {
	return (
		<>
			<p>
				Un análisis decide lo que las reglas pueden decidir. El resto de una evaluación le toca a
				una persona: las preguntas que un análisis deja abiertas (<code>cantTell</code>) y las
				partes de un criterio que ninguna regla prueba. Desde <code>@surea11y/core</code> 1.15.0,
				core dice también cómo hacer esa parte: un <strong>procedimiento de prueba</strong> para
				cada faceta de cada criterio de WCAG que evalúan sus reglas, y de las buenas prácticas, con
				los pasos, las herramientas que necesita y qué cumple y qué falla, en inglés, francés,
				alemán, español y japonés. Es el mismo texto del que sale el{" "}
				<a href="/results-reports/output-schema/#how-to-check">«Cómo comprobarlo»</a> de un
				hallazgo, así que las comprobaciones manuales de un equipo y sus análisis dicen lo mismo.
			</p>
			<p>
				Úsalos sin ningún análisis, para una auditoría manual; junto a un análisis, para lo que deja
				a una persona; o para explicar un criterio cuyas reglas no encontraron nada pero no lo
				cubren entero. Como los pasos de un hallazgo, los procedimientos son una guía, no parte de
				la identidad de un hallazgo: su redacción puede mejorar en cualquier versión.
			</p>

			<h2 id="see-them">Verlos</h2>
			<p>
				Estas dos páginas son la propia salida de core para WCAG 2.2 nivel A y AA, regeneradas con
				cada versión que sigue este sitio, y se abren desde el disco sin cargar nada de otro sitio:
			</p>
			<ul>
				<li>
					<a href="/procedures/wcag-22-aa.html">La referencia</a>: cómo evaluar cada criterio,
					faceta por faceta, bajo los principios y pautas de WCAG.
				</li>
				<li>
					<a href="/procedures/wcag-22-aa-checklist.html">La hoja de trabajo</a>: cada comprobación
					una vez, con un resultado (<em>Sin comprobar</em>, <em>Superado</em>,{" "}
					<em>No superado</em>, <em>No aplicable</em>) y notas que registrar, guardados en tu
					navegador y descargables como JSON o CSV.
				</li>
			</ul>
			<p>
				Ambas páginas se someten a las propias reglas de core, en jsdom y en Chromium, en modo claro
				y oscuro, con el perfil WCAG 2.2 AA: un enlace para saltar, un nivel de encabezado cada vez,
				regiones con nombre, listas y fieldsets reales, foco visible, nada solo por el color, un
				tema de colores forzados respetado, el ancho de un móvil y un diseño imprimible.
			</p>

			<h2 id="what-a-procedure-is">Qué es un procedimiento</h2>
			<p>
				Un criterio tiene <strong>facetas</strong>, los objetivos de prueba que comprueba una
				persona para evaluarlo. Una faceta que decide una regla es <code>full</code>, una de la que
				las reglas deciden una parte es <code>partial</code>, y una que solo puede juzgar una
				persona es <code>manual</code>. Una faceta tiene un{" "}
				<strong>procedimiento general</strong>: los pasos que sigue una persona en una página
				entera, en un navegador con sus herramientas de desarrollo, un teclado y, cuando importa,
				un lector de pantalla; luego lo que ve si cumple y si falla, nombrando el criterio que
				incumple; y las <strong>herramientas</strong> que necesita además de un navegador:
			</p>
			<DataTable
				label="Herramientas que puede necesitar un procedimiento"
				rowKey="id"
				columns={[
					{ key: "tool", label: "Herramienta", width: "30%" },
					{ key: "what", label: "Qué es", wrap: true },
				]}
				rows={toolRows}
			/>
			<ul>
				<li>
					Una <strong>faceta de tecnología</strong> es una prueba que hace una regla sobre un tipo
					de elemento (un <code>&lt;img&gt;</code> tiene un atributo <code>alt</code>). No tiene
					procedimiento propio: <code>coveredBy</code> nombra la faceta más amplia cuyo
					procedimiento la evalúa, para que una lista de comprobación enumere lo que hace una
					persona, una sola vez.
				</li>
				<li>
					Una <strong>variante</strong> es la pregunta más concreta que hace una regla sobre un
					elemento: los pasos que muestra su hallazgo sin decidir como <code>howToCheck</code>. Un
					hallazgo muestra siempre su variante, nunca el texto general, y los dos nunca se
					contradicen. Cada código de motivo que una regla de core puede informar como{" "}
					<code>cantTell</code> está bajo exactamente una faceta.
				</li>
				<li>
					Lo que ningún criterio exige se mantiene aparte, bajo <code>best-practice</code>, para
					que los procedimientos de un criterio nunca presenten un consejo como un fallo.
				</li>
			</ul>

			<h2 id="which-criteria-have-procedures">Qué criterios tienen procedimientos</h2>
			<p>
				Cada criterio que evalúa una regla de core, por completo, en parte o como{" "}
				<code>cantTell</code>, tiene un procedimiento para cada faceta, incluidas las que ninguna
				regla comprueba, ya que una persona las necesita para terminar lo que empezó el análisis:
				36 de los 87 criterios de WCAG 2.2 en los niveles A, AA y AAA y el 4.1.1 (eliminado en la
				2.2), con 170 facetas, 56 procedimientos propios y 114 facetas de tecnología cubiertas por
				uno de ellos. Un criterio así es <code>complete</code>. Los otros 51 criterios, que no
				evalúa ninguna regla (el 1.2.3 Audiodescripción o medio alternativo, por ejemplo), figuran
				con sus facetas y sin procedimiento: cómo evaluarlos a mano queda fuera de core. Las buenas
				prácticas tienen uno para cada una de sus 13 facetas: regiones de referencia, contenido en
				regiones de referencia, encabezados, marcado de tablas, roles ARIA, orden del foco, teclas
				de acceso, enlaces para saltar, nombres y etiquetas, zoom, nombres repetidos, ventanas
				nuevas y descargas, y movimiento reducido.
			</p>

			<h2 id="reading-them">Leerlos</h2>
			<DataTable
				label="Funciones para procedimientos"
				rowKey="id"
				columns={[
					{ key: "fn", label: "Función", width: "38%", wrap: true },
					{ key: "what", label: "Qué da", wrap: true },
				]}
				rows={functionRows}
			/>
			<p>
				En Node vienen de <code>@surea11y/core</code>, que lee los diccionarios del disco. El código
				que se ejecuta en un navegador importa lo mismo de <code>@surea11y/core/procedures</code>,
				con el sufijo <code>From</code> (<code>proceduresFrom</code>,{" "}
				<code>listProceduresFrom</code>, <code>procedureChecklistFrom</code>,{" "}
				<code>renderProceduresFrom</code>, <code>procedureLanguagesFrom</code>), y pasa los
				diccionarios que importa como <code>{"@surea11y/core/procedures/<locale>"}</code>: no
				necesita sistema de archivos ni toca ninguna de las reglas.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { proceduresFor } = require('@surea11y/core');",
					"",
					"proceduresFor('1.4.12', { locale: 'fr' });",
					"// { standard: 'wcag', id: '1.4.12', title: 'Espacement du texte', level: 'AA', complete: true,",
					"//   rules: ['avoid-inline-spacing', 'text-spacing-content-loss'], facets: [ … ] }",
				]}
			/>
			<CodeBlock
				lang="js"
				lines={[
					"import { proceduresFrom } from '@surea11y/core/procedures';",
					"import en from '@surea11y/core/procedures/en';",
					"import fr from '@surea11y/core/procedures/fr';",
					"",
					"proceduresFrom({ en, fr }, '1.4.12', { locale: 'fr' });",
				]}
			/>
			<p>
				Cada faceta lleva su <code>label</code>, <code>automation</code>, las <code>rules</code>{" "}
				que la reclaman, sus <code>tools</code>, su <code>procedure</code> (
				<code>{"{ steps, passWhen, failWhen }"}</code>, o <code>null</code> para una faceta de
				tecnología, con <code>coveredBy</code>) y sus <code>variants</code>, cada una exactamente
				el <code>howToCheck</code> del hallazgo de esa regla para ese código. Un texto en otro
				idioma distinto del leído (el título propio de una versión anterior de WCAG, como el{" "}
				«<span lang="en">Parsing</span>» de la 2.1 para el 4.1.1, o un texto que le falta a un
				locale) dice en cuál está, para que una herramienta pueda marcarlo con <code>lang</code>,
				como pide el 3.1.2 de WCAG. El{" "}
				<a href={`${core}/docs/PROCEDURES.md#the-shape`}><code>PROCEDURES.md</code></a> de core,
				en GitHub, tiene la estructura completa.
			</p>

			<h2 id="listing-them">Enumerarlos</h2>
			<CodeBlock
				lang="js"
				lines={[
					"const { listProcedures } = require('@surea11y/core');",
					"",
					"listProcedures();                                         // WCAG 2.2, every level",
					"listProcedures({ version: '2.1', levels: ['A', 'AA'] });  // WCAG 2.1 A and AA",
					"listProcedures({ standard: 'best-practice' });",
					"listProcedures({ levels: ['A', 'AA'], automation: ['manual', 'partial'] }); // what a scan leaves",
				]}
			/>
			<DataTable
				label="Opciones de listProcedures y procedureChecklist"
				rowKey="id"
				columns={[
					{ key: "option", label: "Opción", width: "22%" },
					{ key: "what", label: "Qué hace", wrap: true },
				]}
				rows={listOptionRows}
			/>
			<p>
				Los criterios de WCAG son los que tiene la versión, en sus niveles: la 2.0 y la 2.1
				enumeran el 4.1.1 como criterio de nivel A titulado «Procesamiento», la 2.2 no. Con varios
				filtros, una faceta debe cumplir cada uno; el <code>complete</code> de un requisito sigue
				siendo el suyo.
			</p>

			<h2 id="a-checklist">Una lista de comprobación</h2>
			<p>
				<code>procedureChecklist</code> acepta las mismas opciones y da lo que hace una persona
				para evaluar el estándar, una vez cada cosa: un elemento por procedimiento general, con las
				facetas de tecnología que también evalúa en <code>covers</code>, y las reglas que hay detrás
				en <code>rules</code>.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { procedureChecklist } = require('@surea11y/core');",
					"",
					"procedureChecklist({ levels: ['A', 'AA'] }).items[0];",
					"// {",
					"//   key: '1.1.1/text-alternative-mechanism',",
					"//   label: 'Non-text content that conveys something has a text alternative',",
					"//   automation: 'partial',",
					"//   wcag: '1.1.1',",
					"//   requirements: ['1.1.1'],",
					"//   covers: ['img-alt-attr-present', 'role-img-text-alternative-present', …],",
					"//   rules: ['img-alt-present', …],",
					"//   tools: [{ id: 'devtools', label: \"The browser's developer tools\" }],",
					"//   procedure: { steps: ['…'], passWhen: '…', failWhen: '… which fails WCAG 1.1.1.' }",
					"// }",
				]}
			/>

			<h2 id="rendering-them">Páginas y hojas de trabajo</h2>
			<p>
				<code>renderProcedures</code> convierte lo que dan <code>listProcedures</code>,{" "}
				<code>procedureChecklist</code> o <code>proceduresFor</code> en un documento que una persona
				lee o completa: una página HTML autocontenida, que se abre desde el disco sin servidor, red,
				fuentes ni scripts de otro sitio, o Markdown. La misma entrada y las mismas opciones dan
				siempre la misma página.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { listProcedures, procedureChecklist, renderProcedures } = require('@surea11y/core');",
					"const fs = require('node:fs');",
					"",
					"// A reference: how to assess every WCAG 2.2 A and AA criterion.",
					"fs.writeFileSync('wcag-22-aa.html', renderProcedures(listProcedures({ levels: ['A', 'AA'] })));",
					"",
					"// A worksheet: each check once, with a result and notes to record.",
					"fs.writeFileSync('wcag-22-aa-checklist.html', renderProcedures(procedureChecklist({ levels: ['A', 'AA'] })));",
					"",
					"// The same in Markdown, for a repository or a wiki.",
					"fs.writeFileSync('wcag-22-aa.md', renderProcedures(listProcedures({ levels: ['A', 'AA'] }), { format: 'markdown' }));",
				]}
			/>
			<DataTable
				label="Opciones de renderProcedures"
				rowKey="id"
				columns={[
					{ key: "option", label: "Opción", width: "22%" },
					{ key: "what", label: "Qué hace", wrap: true },
				]}
				rows={renderOptionRows}
			/>
			<p>
				<strong>La página de una lista</strong> es una referencia del estándar: su título y
				alcance, qué significan sus resultados (las buenas prácticas no cuentan para ninguna
				conformidad, el nivel AAA es orientativo), «Antes de empezar», un índice, y cada requisito
				con sus facetas: qué comprueba cada una, cuánto de ella deciden las reglas, las
				herramientas, los pasos, qué cumple y qué falla, y las reglas que la prueban.
			</p>
			<p>
				<strong>La página de una lista de comprobación</strong> es una hoja de trabajo. Bajo cada
				elemento una persona registra un resultado y notas; la página cuenta los resultados en un
				mensaje de estado que anuncia un lector de pantalla, los guarda en el navegador (
				<code>localStorage</code>, con el estándar, la versión y el título como clave), y los
				descarga como JSON, con el resultado de cada requisito agregado a partir de sus elementos,
				o como CSV, que una hoja de cálculo abre con sus tildes. Un requisito falla cuando falla uno
				de sus elementos, es <code>open</code> cuando uno aún no se ha comprobado, es{" "}
				<code>notApplicable</code> cuando no se aplica ninguno, y se cumple en los demás casos.
			</p>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					'  "title": "WCAG 2.2: manual checklist",',
					'  "standard": "wcag",',
					'  "version": "2.2",',
					'  "items": [',
					"    {",
					'      "key": "1.1.1/text-alternative-mechanism",',
					'      "requirements": ["1.1.1"],',
					'      "outcome": "fail",',
					'      "notes": "The logo has no alt."',
					"    }",
					"  ],",
					'  "requirements": [{ "id": "1.1.1", "outcome": "fail" }]',
					"}",
				]}
			/>
			<p>
				Las palabras propias de una página están en todos los idiomas que incluye core, y también
				los procedimientos, las etiquetas de las facetas y los principios, pautas y criterios de
				WCAG, con los nombres que les da la traducción publicada de WCAG en cada idioma. Lo que está
				en otro idioma que el de la página se marca con él, para que un lector de pantalla lea cada
				parte en su idioma. <code>fragment: true</code> da solo el contenido, en un{" "}
				<code>{'<div class="surea11y-procedures">'}</code> con sus encabezados desde{" "}
				<code>h1</code>, para un sitio de documentación que aporta sus propios estilos.
			</p>

			<h2 id="from-the-cli">Desde la CLI</h2>
			<p>
				<a href="/getting-started/cli/#manual-checks"><code>@surea11y/cli</code></a> 1.5.0 escribe
				las mismas páginas sin código: <code>surea11y procedures</code> sin análisis, y{" "}
				<code>--manual-checks</code> junto a un análisis, para las comprobaciones que deja a una
				persona.
			</p>
			<CodeBlock
				lines={[
					"# How to assess every WCAG 2.2 A and AA criterion, or a worksheet for a manual audit",
					{ text: "surea11y procedures --wcag-level AA -o wcag-22-aa.html", command: true },
					{ text: 'surea11y procedures --wcag-level AA --checklist --title "Audit: example.com" -o audit.html', command: true },
					"",
					"# The checks a scan leaves to a person, as a worksheet next to its report",
					{ text: "surea11y scan https://example.com/ --wcag 2.2 --html report.html --manual-checks manual-checks.html", command: true },
				]}
			/>

			<h2 id="in-the-html-report">En el informe HTML</h2>
			<p>
				El <a href="/results-reports/html-report/">informe HTML</a> tiene una sección «Lo que queda
				para una persona»: cada requisito del estándar analizado con una comprobación que ninguna
				regla decide por completo, su resultado en el análisis al lado y, contraídas debajo, esas
				comprobaciones con sus pasos. Un requisito cuyas reglas se superan todas solo se cumple
				cuando también se superan sus comprobaciones, y el informe lo dice.{" "}
				<code>{"renderHtmlReport(result, { manualChecks: false })"}</code> deja fuera la sección.
			</p>

			<h2 id="uses">Usos</h2>
			<p>
				<strong>Una auditoría manual, sin análisis.</strong> Quien audita completa la hoja de
				trabajo del estándar con el que se hace la auditoría, registra cada resultado y nota, y
				descarga el JSON para el informe:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const checklist = procedureChecklist({ version: '2.2', levels: ['A', 'AA'] });",
					"fs.writeFileSync('audit-worksheet.html', renderProcedures(checklist, { title: 'Accessibility audit: example.com' }));",
				]}
			/>
			<p>
				<strong>Un adjunto de una ejecución de pruebas.</strong> Una prueba de Playwright que
				analiza una página puede adjuntar las comprobaciones que sus reglas no deciden, para que
				queden junto al análisis en el informe de pruebas:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"test('home page', async ({ page }, testInfo) => {",
					"  // ... scan the page ...",
					"  const left = procedureChecklist({ levels: ['A', 'AA'], automation: ['manual', 'partial'] });",
					"  await testInfo.attach('manual-checks.html', {",
					"    body: renderProcedures(left, { record: false }),",
					"    contentType: 'text/html'",
					"  });",
					"});",
				]}
			/>
			<p>
				<strong>Una sesión con una persona usuaria de lector de pantalla.</strong> Solo lo que
				necesita un lector de pantalla, para una sesión con una persona que lo usa a diario:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const sr = listProcedures({ levels: ['A', 'AA'], tools: 'screen-reader' });",
					"fs.writeFileSync('screen-reader-session.html', renderProcedures(sr, { title: 'Screen reader session' }));",
				]}
			/>
			<p>
				<strong>Documentación.</strong> Un archivo Markdown por estándar en un sitio de
				documentación o un repositorio, regenerado cuando se actualiza core, para que un equipo lea
				los mismos procedimientos que usan sus herramientas.{" "}
				<strong>Un criterio, donde hace falta:</strong> una herramienta que muestra un hallazgo
				puede mostrar cómo evaluar todo su criterio, con{" "}
				<code>{"renderProcedures(proceduresFor('1.4.12', { locale: 'de' }), { fragment: true })"}</code>.
			</p>

			<h2 id="a-packs-standard">El estándar de un pack</h2>
			<p>
				El estándar de un <a href="/configuration/packs/#procedures">pack</a> puede decir cómo
				evalúa una persona sus propios requisitos, y cada función anterior lo lee si recibe los
				packs: con su propia numeración y grupos, en su propio idioma cuando declara uno. Un
				requisito que reformula un criterio de WCAG toma los procedimientos de ese criterio, leídos
				como el requisito («which fails EN 301 549 9.1.4.3»). Desde core 1.16.0, una faceta también
				enumera las reglas de core que el mapeo del estándar envía a lo que evalúa (
				<code>mappedRules</code>, también en el <code>mappedRules</code> de un elemento de la lista
				de comprobación), así que un requisito o una prueba que solo comprueban reglas de core no
				parece sin comprobar.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const en301549 = require('@surea11y/pack-en301549');",
					"",
					"proceduresFor('9.1.4.3', { packs: [en301549], standard: 'en301549', version: 'V4.1.1', locale: 'fr' });",
					"relatedRequirements('1.4.3', { packs: [en301549] });",
					"// [{ standard: 'EN 301 549', id: '9.1.4.3', version: 'V4.1.1', relation: 'restates', … }]",
					"",
					"const options = { packs: [en301549], standard: 'en301549', version: 'V4.1.1', locale: 'fr' };",
					"fs.writeFileSync('en-301-549.html', renderProcedures(procedureChecklist(options), { packs: [en301549] }));",
				]}
			/>
			<p>
				El <a href="/configuration/packs/#en-301-549-pack">pack de EN 301 549</a> 1.2.0 da
				procedimientos para cada cláusula del capítulo 9 cuyo criterio evalúa una regla de core, en
				cinco idiomas, y el <a href="/configuration/packs/#wai-aria-pack">pack de WAI-ARIA</a> da
				una lista de comprobación para cada uno de sus requisitos, con los roles, estados y valores
				válidos enumerados por completo. Un pack que no da procedimientos no cambia nada: los de
				WCAG son los mismos con él que sin él.
			</p>
		</>
	);
}
