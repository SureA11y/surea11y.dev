import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";
const cliDocs = "https://github.com/SureA11y/cli/blob/main/docs/CLI.md";

export function CliUsageContent() {
	return (
		<>
			<p>
				Un comando en lugar de código. No requiere un framework de pruebas ni un script de Node y
				resulta adecuado para un paso del pipeline de CI o para una comprobación rápida de un
				artefacto de compilación.
			</p>

			<h2>Primer análisis</h2>
			<CodeBlock
				lines={[
					{ text: "npm install -g @surea11y/cli", command: true },
					{ text: "surea11y scan ./index.html", command: true },
					{ text: "surea11y scan https://example.com/ --wcag 2.2", command: true },
				]}
			/>
			<p>
				Requiere Node.js <code>^20.19.0 || ^22.13.0 || &gt;=24.0.0</code>. El resumen nombra la
				versión de <code>@surea11y/core</code> que ejecutó el análisis:
			</p>
			<CodeBlock
				lines={[
					"$ surea11y scan ./index.html",
					"",
					"surea11y scan: file:///path/to/index.html",
					"  engine: @surea11y/core 1.14.0",
					"  pass: 16   fail: 4   cantTell: 4   notApplicable: 121",
					"",
					"  occurrences by tier: fail: 4   cantTell: 4",
					"  needs review: likely fail: 1   likely pass: 0   needs a person: 3",
					"",
					"FAIL (4 rule(s)):",
					"",
					"  img-alt-present  (serious, 1 fail occurrence(s))",
					"    - html > body > main > img",
					"      This <img> has no alt attribute.",
					"      hint: Add an alt attribute that says what the image shows, or alt=\"\" if",
					"      the image is purely decorative.",
					"",
					"LIKELY FAIL — confirm (1 occurrence(s)):",
					"  - heading-order (minor): html > body > main > h3",
					"    This heading jumps from level 1 to level 3, skipping a level.",
					"    why: The heading skips a level after the one before it.",
					"",
					"cantTell — needs human review (4 rule(s)): heading-order, link-name-quality,",
					"manual-review, page-title-patterns",
					"",
					"criteria (WCAG 2.2):",
					"  fail       1.1.1 Non-text content: text alternatives; 1.4.3 Contrast: minimum;",
					"             1.4.6 Contrast: enhanced; 4.1.2 Name, role, value: accessible name",
					"  cantTell   1.2.1 Audio-only and video-only (prerecorded): transcript; 1.2.2",
					"             Captions (Prerecorded); 1.3.1 Info and Relationships; 1.3.4",
					"             Orientation; 1.3.5 Identify Input Purpose; 1.4.1 Use of Color;",
					"             1.4.2 Audio Control; 1.4.4 Resize Text; 1.4.5 Images of Text;",
					"             1.4.12 Text Spacing; 2.1.1 Keyboard; 2.1.3 Keyboard (No Exception);",
					"             2.2.1 Timing Adjustable; 2.2.2 Pause, Stop, Hide; 2.2.4",
					"             Interruptions; 2.4.1 Bypass Blocks; 2.4.2 Page titled; 2.4.3 Focus",
					"             order; 2.4.4 Link Purpose (In Context); 2.4.6 Headings and Labels;",
					"             2.4.7 Focus visible; 2.4.9 Link Purpose (Link Only); 2.5.8 Target",
					"             size: minimum; 3.1.1 Language of page; 3.1.2 Language of Parts;",
					"             3.2.5 Change on Request; 3.3.1 Error Identification; 3.3.2 Labels",
					"             or Instructions; 3.3.8 Accessible Authentication (Minimum); 4.1.2",
					"             Name, role, value: ARIA validity; 4.1.3 Status Messages",
					"  notApplicable: 2",
					"  A criterion that passes here means the checks that ran found nothing in it,",
					"  not that the page conforms.",
				]}
			/>
			<p>
				La línea <code>needs review</code> ordena las preguntas según lo que hace con ellas quien
				revisa: <em lang="en">likely fail</em> (las evidencias de la página apuntan a un fallo, como el salto
				de nivel de encabezado de este ejemplo), <em lang="en">likely pass</em> y <em lang="en">needs a person</em>.
				Los probables fallos se enumeran con el motivo de su tendencia, y cada
				pregunta en <code>--json</code> y en los informes lleva los pasos para responderla (
				<code>howToCheck</code>).
			</p>
			<p>
				El bloque <code>criteria</code> lee el mismo análisis por criterio de WCAG, que es como se
				suele preguntar ("¿falla el 1.4.3?"): primero <code>fail</code>, luego{" "}
				<code>cantTell</code>, y un recuento de <code>notApplicable</code>. Desde{" "}
				<code>@surea11y/core</code> 1.14 ningún criterio figura como <code>pass</code>: un criterio
				solo pasa cuando sus reglas comprueban todo lo que pide, y todavía no hay ninguno que se
				compruebe por completo, así que, cuando todas sus reglas pasan, queda en{" "}
				<code>cantTell</code> para que una persona compruebe el resto. El bloque nunca cambia el
				código de salida, y <code>--compact</code> lo muestra como recuentos. Si no falla ninguna
				regla, el resumen termina diciendo que eso no significa que la página sea conforme, y
				nombra lo que todavía revisa una persona.
			</p>

			<h2 id="several-pages">Varias páginas, o un sitemap</h2>
			<p>
				Nombra varias páginas, enuméralas en un archivo (una ruta o URL por línea, con comentarios{" "}
				<code>#</code>), o apunta el análisis a un sitemap:
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html ./dist/pricing.html", command: true },
					{ text: "surea11y scan --urls pages.txt", command: true },
					{ text: "surea11y scan --sitemap https://example.com/sitemap.xml   # up to 50 pages; --max-pages to change it", command: true },
				]}
			/>
			<p>
				Cada página tiene su propia sección en el resumen, una última línea cuenta las páginas con
				fallos, y la ejecución falla cuando falla cualquier página. <code>--json</code> imprime un
				array, <code>--sarif</code> y <code>--junit</code> escriben un archivo que cubre todas las
				páginas, <code>--html</code> escribe un informe por página (<code>report.html</code>,{" "}
				<code>report-2.html</code>…), y una baseline recuerda en qué página estaba cada fallo
				conocido. Un sitemap puede ser una URL o un archivo local, sin comprimir o con gzip, y un
				índice de sitemaps se sigue un nivel hacia abajo. Una página que no se puede analizar
				detiene la ejecución con el código <code>2</code>, nombrándola, antes de escribir nada.
			</p>

			<h2 id="in-a-real-browser">En un navegador real</h2>
			<p>
				Por defecto, la CLI lee HTML estático. Para páginas cuyo contenido renderiza su JavaScript,
				instala Playwright en tu proyecto y añade <code>--browser</code>: cada página se abre en
				Chromium headless, se ejecutan sus scripts y el análisis ve lo que se renderiza, con un
				layout real para las reglas que lo miden. El motor es el mismo <code>@surea11y/core</code>,
				y todas las opciones funcionan con él, incluidos informes, baselines, packs y reglas
				personalizadas.
			</p>
			<CodeBlock
				lines={[
					{ text: "npm install --save-dev playwright", command: true },
					{ text: "npx playwright install chromium", command: true },
					{ text: "surea11y scan https://app.example.com/ https://app.example.com/settings --browser", command: true },
				]}
			/>
			<p>
				Una aplicación que obtiene sus datos después de cargar puede hacer que el análisis los
				espere, y una página se puede analizar con el ancho de un móvil, en modo oscuro o en todas
				las combinaciones de varios valores:
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan https://app.example.com/orders --browser --wait-for \"#orders-table\"", command: true },
					{ text: "surea11y scan https://example.com/ --browser --width 320 --color-scheme dark", command: true },
					{ text: "surea11y scan https://example.com/ --browser --width 1280,320 --color-scheme light,dark", command: true },
				]}
			/>
			<p>
				<code>--wait-for</code> espera hasta 30 segundos (<code>--wait-timeout</code> lo cambia) y
				detiene la ejecución con el código <code>2</code> si el elemento no aparece nunca. Varios
				anchos o esquemas de color cargan la página una vez y combinan los análisis en un único
				resultado por página: el peor resultado de cada regla, y cada hallazgo una sola vez, con las
				combinaciones en las que se vio (<code>seen in:</code>).
			</p>
			<p>
				Antes de que cargue cada página, la CLI instala los hooks de internals y de listeners de
				core, así que el análisis juzga los nombres que los componentes web fijan mediante{" "}
				<code>ElementInternals</code> y los manejadores de clic añadidos desde un script: un{" "}
				<code>role="button"</code> al que nunca llegan Intro ni Espacio falla.{" "}
				<code>--live-regions</code> añade el hook de regiones vivas, de modo que se pregunta por un
				mensaje de estado añadido con su texto ya dentro, que los lectores de pantalla no suelen
				anunciar; <code>--no-hooks</code> deja fuera los dos primeros. El resumen nombra el
				viewport, el esquema de color y los hooks de cada análisis. La CLI no hace clic, no escribe
				ni inicia sesión: para contenido que solo aparece después de eso, controla el navegador con
				una de las integraciones (<code>bindings</code>). Los frames dentro de la página todavía no
				se analizan.
			</p>

			<h2 id="choosing-what-runs">Elegir qué se ejecuta</h2>
			<p>
				<code>--wcag</code> selecciona las reglas de un objetivo de conformidad de WCAG, según el
				nivel que tiene cada criterio en esa versión; <code>--wcag-level</code> establece su nivel (
				<code>AA</code> salvo que se indique otro). <code>--best-practices</code> añade las reglas
				que no comprueban ningún criterio de WCAG, como <code>region</code> y{" "}
				<code>heading-order</code>; por sí solo, ejecuta solo esas. <code>--profile</code> ejecuta un
				perfil de conformidad, como <code>en301549-v4.1.1</code> o uno propio de un pack.
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --wcag 2.2                    # WCAG 2.2, Level A and AA", command: true },
					{ text: "surea11y scan ./dist/index.html --wcag 2.1 --wcag-level A     # WCAG 2.1, Level A", command: true },
					{ text: "surea11y scan ./dist/index.html --wcag 2.2 --best-practices   # and the best practices", command: true },
				]}
			/>
			<p>
				El 4.1.1 <span lang="en">Parsing</span>, que WCAG 2.2 eliminó, forma parte de un objetivo{" "}
				<code>2.1</code> y no de uno <code>2.2</code>. <code>--rules</code> y <code>--tags</code>{" "}
				añaden reglas a las de un objetivo, y <code>--exclude-rules</code> se aplica después. Junto
				a <code>--profile</code>, <code>--best-practices</code> añade sus reglas y el perfil sigue
				aplicándose; <code>--wcag</code>, <code>--rules</code> y <code>--tags</code> eligen las
				reglas en lugar de un perfil, así que <code>--profile</code> con cualquiera de ellos sale con{" "}
				<code>2</code>. Se corresponden con <code>runOnly.wcag</code>,{" "}
				<code>runOnly.bestPractices</code> y <code>engineOptions.profile</code> (ver{" "}
				<a href="/configuration/engine-options/#selecting-which-rules-run">Opciones del motor</a>).
			</p>

			<h2 id="naming-checks">Nombrar tú mismo las comprobaciones</h2>
			<p>
				Con ambos, <code>--rules</code> y <code>--tags</code> ejecutan las reglas que
				coinciden con los dos. Para decir "esta área, y además estas comprobaciones",
				pasa <code>--include-mode or</code>, que ejecuta las reglas que coinciden con
				cualquiera de ellos. Sin él, el análisis de abajo no ejecuta ninguna regla,
				porque <code>contrast-computable</code> no lleva la etiqueta <code>forms</code>,
				y sale con <code>2</code> en lugar de pasar sin haber comprobado nada.
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/form.html --tags forms --rules contrast-computable --include-mode or", command: true },
				]}
			/>
			<p>
				Un análisis que nombra comprobaciones informa de los criterios de WCAG a los que
				pertenecen, en todos los niveles. <code>contrast-computable</code> comprueba el
				1.4.3 (AA) y el 1.4.6 (AAA), así que un sitio que cumple AA puede mostrar un
				criterio AAA que falla y al que nunca aspiró. Sin <code>--wcag</code>,{" "}
				<code>--wcag-level</code> establece el nivel de los criterios de los que se
				informa, sin cambiar qué reglas se ejecutan:
			</p>
			<CodeBlock
				lines={[
					"$ surea11y scan ./index.html --rules contrast-computable --wcag-level AA",
					"",
					"surea11y scan: file:///path/to/index.html",
					"  engine: @surea11y/core 1.14.0",
					"  WCAG level reported: AA",
					"  pass: 1   fail: 0   cantTell: 0   notApplicable: 0",
					"",
					"  occurrences by tier: fail: 0   cantTell: 0",
					"",
					"criteria (WCAG 2.2 AA):",
					"  cantTell   1.4.3 Contrast: minimum (partly checked: 1 of 2 checks not selected)",
					"  A criterion that passes here means the checks that ran found nothing in it,",
					"  not that the page conforms.",
					"",
					"No rule failed, which is not a claim that the page conforms: the automated rules",
					"found nothing definite. A person still checks the cantTell findings, keyboard",
					"use, how a screen reader reads the page, and the content itself.",
				]}
			/>
			<p>
				El 1.4.3 queda <em>comprobado en parte</em>: su otra comprobación,{" "}
				<code>contrast-minimum</code>, no se seleccionó, así que su resultado solo cubre
				la comprobación que se ejecutó, y como no falló ninguna regla, el resumen termina
				recordando que eso no significa que la página sea conforme. Los ids de regla y los niveles se leen sin
				distinguir mayúsculas de minúsculas (<code>--rules IMG-ALT-PRESENT</code>,{" "}
				<code>--wcag-level aa</code>). <code>--include-mode</code> se corresponde con{" "}
				<code>engineOptions.includeMode</code>, y <code>--wcag-level</code> sin{" "}
				<code>--wcag</code>, con <code>engineOptions.wcagLevel</code>.
			</p>

			<h2 id="packs">Packs</h2>
			<p>
				<code>--pack</code> carga un <a href="/configuration/packs/">pack</a> (reglas, un estándar o
				una lista de comprobación, y sus perfiles) por nombre de paquete, resuelto desde el proyecto
				del directorio de trabajo, o por ruta; <code>--profile</code> ejecuta uno de sus perfiles.
				Repite <code>--pack</code> para analizar con varios.
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --pack @acme/a11y-policy --profile acme-web-2026", command: true },
					{ text: "surea11y scan ./dist/index.html --pack ./acme-policy-pack.js --profile acme-web-2026", command: true },
				]}
			/>
			<p>
				El resumen nombra el perfil y los packs que se ejecutaron, y <code>--json</code> los incluye
				como <code>engine.profile</code> y <code>engine.packs</code>. Un pack que no se puede
				encontrar o cargar, o que el motor omite, sale con <code>2</code> sin escribir ningún
				informe, así que un análisis nunca pasa con las comprobaciones del pack sin ejecutar.
			</p>

			<h2 id="failing-only-on-serious-problems">Fallar solo con problemas graves</h2>
			<p>
				<code>--fail-on-severity</code> (<code>critical</code>, <code>serious</code>,{" "}
				<code>moderate</code> o <code>minor</code>) hace fallar la ejecución solo con reglas que
				fallan con esa gravedad o más; con <code>--baseline</code>, solo con las nuevas. Todos los
				fallos se siguen informando, y el resumen marca los que quedan por debajo del nivel, para
				que un equipo empiece bloqueando los problemas graves y endurezca el umbral a medida que se
				reduce lo pendiente.
			</p>
			<CodeBlock lines={[{ text: "surea11y scan --urls pages.txt --fail-on-severity serious", command: true }]} />

			<h2 id="questions-that-likely-fail">Preguntas que probablemente fallan</h2>
			<p>
				<code>--fail-on-lean</code> hace fallar la ejecución también con las preguntas que
				probablemente fallan (<code>leaningFailures()</code> de core), con la gravedad de{" "}
				<code>--fail-on-severity</code> o más cuando la indicas; <code>--lean-fail-wcag-only</code>{" "}
				cuenta solo las de reglas asociadas a un criterio de WCAG, sin las buenas prácticas. Con
				él, <code>--junit</code> informa de esa regla como una prueba fallida y{" "}
				<code>--sarif</code> de ese hallazgo como un <code>error</code>, y{" "}
				<code>--write-baseline</code> registra también los probables fallos de hoy, para que{" "}
				<code>--baseline</code> solo bloquee los nuevos. Es opcional porque una tendencia es una evidencia, no una prueba: si un hallazgo tiene tendencia, y hacia dónde, puede cambiar en una
				versión menor de core.
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --fail-on-lean --lean-fail-wcag-only", command: true },
					{ text: "surea11y scan ./dist/index.html --fail-on-lean --write-baseline baseline.json   # once, commit it", command: true },
					{ text: "surea11y scan ./dist/index.html --fail-on-lean --baseline baseline.json         # in CI, from then on", command: true },
				]}
			/>

			<h2 id="compact-results">Resultados compactos</h2>
			<p>
				<code>--compact</code> reduce cada resultado <code>pass</code> y <code>notApplicable</code>{" "}
				a su regla, su resultado y su tipo (<code>engineOptions.output.detail: 'findings'</code>):
				un <code>--json</code> más pequeño, para un resultado que se guarda como artefacto de CI. El
				resumen, el código de salida, la línea base y los informes HTML, SARIF y JUnit son los
				mismos que sin él.
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --compact --json > result.json", command: true }]} />

			<h2>Códigos de salida y limitaciones</h2>
			<p>
				<code>cantTell</code> no afecta al código de salida salvo que pases{" "}
				<code>--fail-on-lean</code>: el <code>0</code> indica que no se han encontrado fallos, el{" "}
				<code>1</code> que existe al menos un resultado <code>fail</code> (o, analizando con{" "}
				<code>--baseline</code>, un resultado <code>fail</code> <em>nuevo</em>) en alguna página, y
				el <code>2</code> un error de uso o de análisis, o un análisis que no habría comprobado nada
				o menos de lo pedido: una lista <code>--rules</code>/<code>--tags</code> que no nombra
				ninguna regla ni etiqueta conocida, un selector <code>--context</code> que no coincide con
				nada, una regla personalizada o un pack que no se ejecutó, un <code>--profile</code> que no
				se aplicó. El resultado <code>fail</code> es el caso que condiciona CI (
				<code>--fail-on-severity</code> solo cuenta los de su nivel o más); consulta{" "}
				<a href="/conformance/baseline/">Baseline / allowlist</a> para saber qué cuenta como
				"conocido" frente a "nuevo". Una baseline escrita con core 1.13 sigue coincidiendo con los
				hallazgos cuyos códigos de motivo dividió la 1.14; <code>--migrate-baseline baseline.json</code>{" "}
				la reescribe con los códigos nuevos.
			</p>
			<p>
				Sin <code>--browser</code>, la CLI solo lee <strong>HTML estático</strong>: un archivo local,
				o el cuerpo sin procesar de un GET HTTP(S), y nunca ejecuta el JavaScript de la página.
				Ningún modo hace clic, escribe ni inicia sesión: para contenido que solo aparece después de
				eso, usa una de las integraciones (<code>bindings</code>), o llama al motor directamente
				contra un navegador que controles tú (el Patrón 2 de{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>, la guía de
				integración en GitHub).
			</p>
			<p>
				Referencia completa de flags, contrato de reglas personalizadas, packs y recetas de CI:{" "}
				<a href={cliDocs}><code>docs/CLI.md</code></a>. Para plantillas de pipeline de CI en
				concreto, ver <a href="/configuration/ci-integration/">Integración con CI</a>.
			</p>
		</>
	);
}
