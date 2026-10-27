import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function FaqContent() {
	return (
		<>
			<article>
				<h2 id="results-changed-1-14">"Mis resultados cambiaron al actualizar a core 1.14"</h2>
				<p>
					La 1.14 informa de más <code>cantTell</code> y afirma menos, a propósito. Los cambios que
					más probablemente se noten en un pipeline:
				</p>
				<ul>
					<li>
						<strong>Ningún resultado agregado de WCAG se cumple.</strong> Un criterio se cumple solo
						cuando sus reglas comprueban todo lo que pide, y todavía no hay ninguno marcado como
						comprobado por completo, así que un criterio cuyas reglas se cumplen todas queda en{" "}
						<code>cantTell</code> (<code>composite.rollup.cantTell.partialCheck</code>). Uno cuyas
						reglas no encontraron nada es <code>notApplicable</code> solo para 2.4.3, 2.4.4, 2.4.7,
						2.4.9, 2.5.3 y 4.1.1, y <code>cantTell</code> en los demás (
						<code>composite.rollup.cantTell.partialCoverage</code>). Una regla que falla sigue
						haciendo fallar su criterio. Un panel o una validación que cuente criterios cumplidos no
						verá ninguno; consulta <a href="#why-criterion-canttell">la entrada de más abajo</a> y{" "}
						<a href="/conformance/wcag-mapping/#when-a-criterion-passes">Mapeo de conformidad con WCAG</a>.
					</li>
					<li>
						<strong>Dos reglas preguntan más.</strong>{" "}
						<a href="/rules/page-title-patterns/"><code>page-title-patterns</code></a> pregunta por
						cada título de página, no solo por los genéricos o de plantilla, ya que si un título
						describe su página lo decide una persona (G88).{" "}
						<a href="/rules/duplicate-id/"><code>duplicate-id</code></a> pregunta por el 4.1.1 también
						con WCAG 2.0 y 2.1, ya que las erratas de 2023 lo dan por satisfecho, salvo que un
						perfil declare <code>keepsParsing: true</code>, como hace <code>en301549-v3.2.1</code>.
					</li>
					<li>
						<strong>Once reglas nuevas</strong>, entre ellas las primeras para el 3.3.1 (
						<a href="/rules/invalid-field-error-message/"><code>invalid-field-error-message</code></a>),
						el 4.1.3 (<a href="/rules/live-region-announcements/"><code>live-region-announcements</code></a>)
						y el 1.4.5 (<a href="/rules/image-of-text/"><code>image-of-text</code></a>). La mayoría
						pregunta;{" "}
						<a href="/rules/click-handler-keyboard-operable/"><code>click-handler-keyboard-operable</code></a>,{" "}
						<a href="/rules/focus-not-removed-by-script/"><code>focus-not-removed-by-script</code></a>{" "}
						y <a href="/rules/aria-owns-valid/"><code>aria-owns-valid</code></a> pueden fallar, igual
						que <a href="/rules/aria-valid-attr-value/"><code>aria-valid-attr-value</code></a>, que
						ahora comprueba las restricciones entre atributos (<code>aria-valuemin</code> por encima
						de <code>aria-valuemax</code>, por ejemplo). Consulta{" "}
						<a href="/rules/">el catálogo de reglas</a>.
					</li>
					<li>
						<strong>Algunos fallos pasan a ser preguntas, y aparecen fallos nuevos.</strong>{" "}
						<code>td-has-header</code> pregunta una vez por una tabla grande sin celdas de
						encabezado en lugar de hacer fallar cada celda, y <code>form-control-single-label</code>{" "}
						pregunta por un campo con dos etiquetas. El contraste se mide en más de lo que dibuja la
						página (el texto sobre el lienzo de la página en cada esquema de color,{" "}
						<code>::first-line</code>, <code>font-size-adjust</code>, un placeholder cuyos colores
						eligió la página), así que pueden aparecer fallos de contraste nuevos.
					</li>
					<li>
						<strong>Algunos hallazgos tienen un código de motivo nuevo.</strong> Diecisiete reglas
						que no daban ninguno ahora lo dan, y algunos códigos se dividen según la causa. Un
						baseline escrito por la 1.13 sigue coincidiendo con ellos hasta la 1.15; reescríbelo con{" "}
						<code>migrateBaselineEntries</code> (consulta{" "}
						<a href="#baseline-after-upgrade">la entrada de más abajo</a>). Una alerta de Code
						Scanning de un hallazgo así se cierra y vuelve como nueva.
					</li>
					<li>
						<strong>Cada <code>cantTell</code> dice cómo responderlo.</strong> El hallazgo de una
						regla de core lleva los pasos de <code>howToCheck</code>, y algunos llevan un{" "}
						<code>lean</code>, hacia dónde apunta la evidencia de la página. El resultado sigue
						siendo <code>cantTell</code>, y nada bloquea por un <code>lean</code> salvo que lo pidas
						(<code>leanFailAs</code>). El <a href="/results-reports/html-report/">informe HTML</a>{" "}
						agrupa estos hallazgos en probables fallos, probables cumplimientos y los que debe
						revisar una persona. Consulta el{" "}
						<a href="/results-reports/output-schema/#leans">esquema de salida</a>.
					</li>
				</ul>
				<p>
					La lista completa está en el{" "}
					<a href={`${core}/CHANGELOG.md`}>
						<code>CHANGELOG.md</code>
					</a>{" "}
					de core.
				</p>
			</article>

			<article>
				<h2 id="runonly-threw">
					"<code>runOnly</code> lanzó un error: <span lang="en">no rule or tag named …</span>, o{" "}
					<span lang="en">either rule ids or tags</span>"
				</h2>
				<p>
					Desde la 1.10.0, un <code>runOnly</code> dado como array simple o como cadena se lee como
					ids de regla o como etiquetas (consulta{" "}
					<a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a>). Lanza un
					error en dos casos:
				</p>
				<ul>
					<li>
						<strong>Un valor que no nombra ninguna regla ni ninguna etiqueta</strong>, normalmente
						una errata: <code>runOnly: ['img-alt-presnt']</code>. Comprueba el id con{" "}
						<code>getChecksCatalog()</code>. Las mayúsculas no son la causa: los ids de regla y
						las etiquetas se comparan sin distinguir mayúsculas y minúsculas, así que{" "}
						<code>IMG-ALT-PRESENT</code> selecciona <code>img-alt-present</code>.
					</li>
					<li>
						<strong>Ids de regla y etiquetas en un mismo array</strong>:{" "}
						<code>runOnly: ['img-alt-present', 'wcag2a']</code>. Usa la forma de objeto para
						combinarlos:
					</li>
				</ul>
				<CodeBlock
					lang="js"
					lines={[
						"runOnly: {",
						"  includeRuleIds: ['img-alt-present'],",
						"  tags: ['wcag2a'],",
						"  includeMode: 'or',",
						"}",
					]}
				/>
				<p>Antes de la 1.10.0, un array simple se ignoraba y se ejecutaban todas las reglas.</p>
				<p>
					La forma de objeto, <code>{"{ includeRuleIds }"}</code>, <code>{"{ tags }"}</code> o{" "}
					<code>{"{ type: 'tag', values }"}</code>, y <code>engineOptions.rules.include</code> /{" "}
					<code>.tags.include</code> también lanzan un error, con{" "}
					<code>code: 'INVALID_RUN_ONLY'</code>, cuando ningún valor de la lista nombra una regla
					o una etiqueta (<code>runOnly.tags: no tag named "wcag2.2aa".</code>). Antes no
					ejecutaban ninguna regla, lo que se lee como un análisis sin hallazgos. Un único valor
					desconocido junto a otros conocidos, o en una lista de exclusión, solo registra un{" "}
					<code>console.warn</code>.
				</p>
			</article>

			<article>
				<h2 id="tags-and-rules-run-nothing">
					"Seleccioné etiquetas e ids de regla, y el análisis no ejecutó ninguna regla pero parece
					limpio"
				</h2>
				<p>
					Con el valor predeterminado <code>includeMode: 'and'</code>, una selección con etiquetas
					e ids de regla a la vez ejecuta solo las reglas que coinciden con ambos.{" "}
					<code>.withTags('wcag2a').withRules('region')</code> no ejecuta nada, ya que{" "}
					<code>region</code> es una buena práctica sin la etiqueta <code>wcag2a</code>, y un
					análisis sin reglas no tiene fallos. El motor avisa en la consola de la página, que una
					ejecución de pruebas no muestra, y solo lanza <code>INVALID_RUN_ONLY</code> con{" "}
					<code>strictOptions</code>. Para ejecutar cualquiera de las dos, pídelo:{" "}
					<code>.includeMode('or')</code> en las integraciones, <code>includeMode: 'or'</code> en{" "}
					<code>runOnly</code> (arriba), o <code>--include-mode or</code> en la{" "}
					<a href="/getting-started/cli/">CLI</a>. Desde la versión 1.3.0, la CLI sale con{" "}
					<code>2</code> y esa sugerencia cuando las dos no tienen ninguna regla en común.
				</p>
				<p>
					Para detectar una selección que no elige nada antes de ejecutarla, comprueba el{" "}
					<code>plannedChecks()</code> del builder, las reglas que ejecutará el análisis,
					calculadas sin página (en Cypress devuelve un chainable):
				</p>
				<CodeBlock
					lang="js"
					lines={[
						"const builder = new A11yCoreBuilder({ page })",
						"  .withTags('wcag2a')",
						"  .withRules('region')",
						"  .includeMode('or'); // the wcag2a rules, plus region",
						"",
						"if (builder.plannedChecks().length === 0) {",
						"  throw new Error('This selection runs no rule.');",
						"}",
					]}
				/>
				<p>
					Consulta{" "}
					<a href="/configuration/engine-options/#via-runonly-4th-argument">Opciones del motor</a>{" "}
					para ver cómo se combinan las partes de una selección.
				</p>
			</article>

			<article>
				<h2 id="untested-wcag-tag">
					"<code>runOnly.tags: no rules for WCAG 2.2 Level A ("wcag22a")</code>"
				</h2>
				<p>
					Las nueve etiquetas de versión/nivel de WCAG, de <code>wcag2a</code> a{" "}
					<code>wcag22aaa</code>, siempre se conocen, pero tres no llevan ninguna regla:{" "}
					<code>wcag21aaa</code>, <code>wcag22a</code> y <code>wcag22aaa</code>, cuyos criterios no
					tienen ninguna comprobación automatizada. Nombrar una junto a otras etiquetas registra esa
					línea con <code>console.info</code>: el resto de la lista se ejecuta, y esos criterios
					necesitan revisión manual. Pasa <code>engineOptions.logUntestedWcag: false</code> para
					omitirla, o selecciona por objetivo, que no nombra ninguna etiqueta:{" "}
					<code>{"runOnly: { wcag: { version: '2.2', level: 'AA' } }"}</code> (consulta{" "}
					<a href="/configuration/engine-options/#selecting-by-wcag-target-runonlywcag">
						Seleccionar por objetivo de WCAG
					</a>
					). Una lista con solo esas etiquetas no ejecutaría nada, así que lanza{" "}
					<code>INVALID_RUN_ONLY</code> con la misma explicación.
				</p>
			</article>

			<article>
				<h2 id="invalid-wcag-target">
					"<code>runOnly.wcag.version must be …</code>" o "
					<code>runOnly.bestPractices must be true or false …</code>"
				</h2>
				<p>
					<code>runOnly.wcag</code> acepta <code>{"{ version, level }"}</code>, con{" "}
					<code>version</code> igual a <code>'2.0'</code>, <code>'2.1'</code> o <code>'2.2'</code> (una
					cadena: <code>2.2</code> como número se rechaza) y <code>level</code> igual a{" "}
					<code>'A'</code>, <code>'AA'</code> o <code>'AAA'</code>; <code>runOnly.bestPractices</code>{" "}
					acepta <code>true</code> o <code>false</code>. Cualquier otra cosa lanza{" "}
					<code>INVALID_RUN_ONLY</code> nombrando el campo y el valor, en lugar de ejecutar una
					selección que no pretendías.
				</p>
			</article>

			<article>
				<h2 id="invalid-engine-options">
					"<code>engineOptions: unknown option "lcoale" (did you mean "locale"?)</code>", o un
					análisis lanzó <code>INVALID_ENGINE_OPTIONS</code>
				</h2>
				<p>
					Una clave de opción a una o dos letras de una conocida, sin distinguir mayúsculas y
					minúsculas, genera un aviso y se ignora: el análisis se ejecuta como si no estuviera, así
					que corrige la ortografía. Las demás claves desconocidas no generan ningún aviso, ya que una
					regla personalizada puede leer ajustes propios de <code>ctx.engineOptions</code>. Con{" "}
					<code>engineOptions.strictOptions: true</code>, el análisis lanza en cambio un error, con{" "}
					<code>code: 'INVALID_ENGINE_OPTIONS'</code>, ante cualquier clave que el motor no lee
					(incluidas las anidadas) y ante un valor de tipo incorrecto o fuera de su conjunto, nombrando
					cada una con la clave conocida más parecida; el <code>problems</code> del error las enumera.
					Consulta{" "}
					<a href="/configuration/engine-options/#catching-mistakes-in-the-options-strictoptions">
						Detectar errores en las opciones
					</a>
					.
				</p>
			</article>

			<article>
				<h2 id="custom-rule-rollup">
					"Mi regla personalizada falla, pero el resultado agregado de WCAG no"
				</h2>
				<p>
					Una regla personalizada cuenta para el resultado agregado de WCAG (<code>rulesResults</code>)
					de cada criterio al que se asocia: dale <code>meta.wcagSc: ['1.1.1']</code>, o una entrada
					de WCAG en <code>meta.normativeMappings</code>. Sin ninguna de las dos, no está en ningún
					resultado agregado. Una regla personalizada que no se ejecutó (listada en{" "}
					<code>skippedCustomRules</code>) tampoco cuenta. Una sustitución de una regla incorporada
					cuenta solo donde dice su propia asociación, así que una que no declara ninguna deja los
					resultados agregados para los que contaba su regla incorporada, y un aviso (
					<code>customRules: "…" overrides a built-in rule but maps to none of the criteria of …</code>
					) los nombra; dale los criterios de la regla incorporada para que siga ahí.
				</p>
			</article>

			<article>
				<h2 id="contextselector-matched-nothing">
					"Mi análisis acotado informa todo como <code>notApplicable</code>", o "
					<code>contextSelector</code> lanzó un error:{" "}
					<span lang="en">… is not a valid CSS selector</span>"
				</h2>
				<p>
					Desde la 1.10.0, un <code>contextSelector</code> que no coincide con ningún elemento no
					analiza nada, y uno que el navegador no puede interpretar lanza un error (consulta{" "}
					<a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a>).
				</p>
				<ul>
					<li>
						<strong>Todo es <code>notApplicable</code></strong>: mira{" "}
						<code>result.contextMatch</code>. <code>elementCount: 0</code> significa que el
						selector no coincidió con nada, así que no se analizó nada: eso no es un resultado
						sin hallazgos. <code>unmatchedSelectors</code> nombra el selector. Revisa si
						tiene una errata, o si el elemento ya está en la página cuando analizas (por ejemplo,
						contenido que un script renderiza después de la carga).
					</li>
					<li>
						<strong>
							El análisis lanzó un error con <code>code: 'INVALID_CONTEXT_SELECTOR'</code>
						</strong>
						: el selector del mensaje, y del campo <code>selector</code> del error, no es CSS
						válido, por ejemplo <code>'#main['</code> o un combinador <code>&gt;&gt;&gt;</code>. O
						el ámbito no es un selector en absoluto, como un elemento o un objeto{" "}
						<code>{"{ include, exclude }"}</code>, y el mensaje dice qué se pasó: pasa un selector
						que coincida con el elemento, y las exclusiones en{" "}
						<code>engineOptions.excludeSelectors</code>.
					</li>
				</ul>
				<p>
					Antes, cada uno de estos casos analizaba la página entera: un selector que no coincidía
					con nada o que no se podía interpretar hasta la 1.10.0, y un ámbito que no es un selector
					también en la 1.10.0.
				</p>
			</article>

			<article>
				<h2 id="page-builtins-broken">"Un análisis lanzó <code>PAGE_BUILTINS_BROKEN</code>"</h2>
				<p>
					Los propios scripts de la página cambiaron un objeto integrado de JavaScript del que
					depende el motor (<code>Array.prototype.filter</code>, <code>Map</code>,{" "}
					<code>JSON.stringify</code> y otros), así que un análisis de ella podría dar un resultado
					que parece correcto y es erróneo. El mensaje del error y su lista <code>broken</code>{" "}
					nombran cada uno. Analiza la página antes de que sus scripts los cambien (inyecta el bundle
					antes, o analiza una compilación sin el script que lo hace). Consulta{" "}
					<a href="/help/known-limitations/">Limitaciones conocidas</a>.
				</p>
			</article>

			<article>
				<h2 id="scan-never-returns">"Mi análisis nunca termina"</h2>
				<p>
					Algo en la página bloquea el análisis: un getter o un script que nunca termina, o un bucle
					de un pack o de una regla personalizada. Nada dentro de la página puede detener un análisis
					una vez iniciado, así que pon el límite de tiempo donde lo inicias, y abandona la pestaña
					cuando pase.{" "}
					<a href="/getting-started/standalone/#a-time-limit-on-a-scan">Uso independiente</a>{" "}
					muestra cómo hacerlo para Playwright y Puppeteer; en jsdom, ejecuta el análisis en un
					worker thread o en un proceso hijo.
				</p>
			</article>

			<article>
				<h2 id="scan-time">"Un análisis tarda más tras actualizar"</h2>
				<p>
					La mayor parte del tiempo de un análisis es trabajo de estilos y maquetación en el
					navegador, así que depende de la página, la máquina y el navegador tanto como del motor.
					Aun así, una versión puede cambiarlo: una regla que ahora comprueba más de la página cuesta
					más, y el <a href={`${core}/CHANGELOG.md`}><code>CHANGELOG.md</code></a> de core indica cuándo una versión cambia lo
					que cuesta una regla. <a href={`${core}/docs/PERFORMANCE.md`}><code>PERFORMANCE.md</code></a>, en GitHub, registra cuánto
					tarda un análisis versión a versión, como proporción respecto a una versión anterior en las
					mismas páginas, y cómo se mide. Una regla más lenta que encuentra más puede estar pagando
					por lo que ahora encuentra; una más lenta con los mismos resultados es una regresión que
					merece la pena <a href="https://github.com/SureA11y/core/issues">comunicar</a>.
				</p>
			</article>

			<article>
				<h2 id="pack-did-not-run">
					"Un pack no se ejecutó", o <code>skippedPacks</code> no está vacío
				</h2>
				<p>
					Un pack cuyo rango <code>core</code> deja fuera el core instalado, que no es válido, o que
					no encaja con core (un id de regla fuera de su espacio de nombres, una clave de diccionario
					que core ya tiene) se omite: el análisis se ejecuta sin él, avisa, y lo enumera en{" "}
					<code>result.skippedPacks</code> con el motivo; con <code>strictOptions</code> lanza un
					error. En una página, un pack nombrado en <code>engineOptions.packs</code> que ninguna
					llamada a <code>packScript</code> registró, o que se registró con otra versión de core, se
					enumera de la misma forma. Las integraciones lo informan como una carencia{" "}
					<code>'pack-skipped'</code>, los test matchers hacen fallar la aserción, y la CLI sale con{" "}
					<code>2</code>. Instala el pack junto a <code>@surea11y/core</code> y al paquete que lo
					ejecuta, para que los tres compartan una sola copia de core. Consulta{" "}
					<a href="/configuration/packs/#when-a-pack-doesnt-run">Packs</a>.
				</p>
			</article>

			<article>
				<h2>"Mi regla personalizada siempre devuelve <code>cantTell</code> sin un motivo claro"</h2>
				<p>
					Primero revisa el campo <code>error</code> del resultado: si dice{" "}
					<code>"&lt;something&gt; is not defined"</code>, tu <code>runInPage</code> hace referencia
					a una variable definida fuera del cuerpo de la función (un <code>const</code> de ámbito de
					módulo, un helper importado, cualquier cosa a la que no se llegue a través de{" "}
					<code>ctx.*</code>). Esta es una trampa real y común: <code>runInPage</code> se serializa a
					texto fuente y se vuelve a evaluar más tarde en el contexto de la página, así que{" "}
					<strong>la compilación nunca detecta esto: el problema solo aparece cuando se ejecuta la
					regla</strong>, y el fallo parece un resultado normal (aunque poco informativo), no un error
					de ejecución. Consulta <a href={`${core}/docs/RULE_AUTHORING.md`}><code>RULE_AUTHORING.md</code></a>{" "}
					§1.1 para ver la explicación completa y la solución (mueve el valor dentro de{" "}
					<code>runInPage</code> o enrútalo a través de <code>ctx.rule</code>/<code>ctx.helpers</code>).
				</p>
			</article>

			<article>
				<h2>
					"Una regla que depende de la geometría (por ejemplo, <code>target-size-minimum</code>) siempre
					indica <code>notApplicable</code>"
				</h2>
				<p>
					jsdom puro (sin un navegador real) no implementa un motor de diseño CSS:{" "}
					<code>getBoundingClientRect()</code> siempre devuelve una geometría de cero. <strong>Las
					reglas que necesitan información real de maquetación devuelven <code>notApplicable</code> al
					ejecutarse con jsdom en lugar de adivinar.</strong> Ejecuta en su lugar a través de un navegador real (Puppeteer/Playwright, consulta{" "}
					<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a> Patrón 2) para
					obtener hallazgos reales de estas reglas. Consulta{" "}
					<a href="/help/known-limitations/"><code>LIMITATIONS.md</code></a>.
				</p>
			</article>

			<article>
				<h2 id="web-component-canttell">
					"Un componente web devuelve <code>cantTell</code> (<code>name_internals</code>)"
				</h2>
				<p>
					Un elemento personalizado que se da nombre, define sus estados o se asigna un rol
					mediante un <code>ElementInternals</code> guardado en un campo privado (
					<code>#internals</code>) queda expuesto por el navegador, pero ningún script de la página
					puede volver a leerlo. Desde la 1.12, el motor lee los internals guardados en una
					propiedad (<code>_internals</code>, <code>internals</code>, …), y pregunta por cualquier
					otro elemento personalizado definido sin un nombre legible o sin un estado obligatorio (
					<code>name_internals</code>, <code>state_internals</code>) en lugar de hacerlo fallar.
				</p>
				<p>
					Para que el análisis pueda juzgar esos elementos, instala el hook de internals antes de
					que se ejecuten los scripts de la página: <code>installInternalsHook()</code> en cada
					integración (en la página o el contexto en{" "}
					<a href="/getting-started/playwright/">Playwright</a>, la página en{" "}
					<a href="/getting-started/puppeteer/">Puppeteer</a>, el driver en{" "}
					<a href="/getting-started/selenium/">Selenium</a>, el browser en{" "}
					<a href="/getting-started/webdriverio/">WebdriverIO</a>, el archivo de soporte u{" "}
					<code>onBeforeLoad</code> en <a href="/getting-started/cypress/">Cypress</a>) y en el
					archivo de configuración de <a href="/getting-started/test-matchers/">test-matchers</a>,
					o <code>internalsHookScript()</code> de core para una página propia. El{" "}
					<code>engine.environment.internalsHook</code> del resultado indica si se ejecutó (
					<code>'early'</code> o <code>'late'</code>). El hook permite que cualquier script de la
					página lea los internals de todos los componentes, así que está pensado para ejecuciones
					de prueba y auditoría. Consulta{" "}
					<a href="/help/known-limitations/">Limitaciones conocidas</a>.
				</p>
			</article>

			<article>
				<h2>
					"Solo veo apariciones de <code>fail</code>/<code>cantTell</code>. ¿Dónde está la lista de
					elementos que aprobaron?"
				</h2>
				<p>
					<strong>Por diseño, este motor nunca enumera los elementos que una regla <em>aprobó</em>,
					solo los que señaló.</strong> El <code>outcome: 'pass'</code> general de una regla significa
					"existían uno o más objetivos aplicables y ninguno fue señalado", y{" "}
					<code>occurrences</code> es <code>[]</code>. Las reglas de contraste son la excepción: su{" "}
					<code>pass</code> lleva una ocurrencia con un <code>selector</code> vacío que describe el
					análisis (cuánto texto era elegible y calculable), no un elemento. Si necesitas saber qué elementos
					concretos se comprobaron y se consideraron correctos, eso actualmente no se expone. Consulta{" "}
					<a href="/results-reports/output-schema/"><code>OUTPUT_SCHEMA.md</code></a>.
				</p>
			</article>

			<article>
				<h2>
					"Una regla que esperaba que se activara devolvió <code>notApplicable</code> / no encontró nada
					en una página que sé que tiene el problema"
				</h2>
				<p>Dos causas comunes, en orden de probabilidad:</p>
				<ol>
					<li>
						<strong>El elemento está excluido del árbol de accesibilidad</strong>:{" "}
						<code>aria-hidden="true"</code>, <code>display: none</code>,{" "}
						<code>visibility: hidden</code>, <code>hidden</code> o un ancestro <code>inert</code>.
						La mayoría de las reglas omiten contenido que ya es invisible para la tecnología de
						asistencia, ya que comprobar un elemento oculto no tendría sentido y podría producir un{" "}
						<code>fail</code> engañoso sobre contenido que ningún usuario encuentra. Algunas reglas
						se excluyen explícitamente de este filtro cuando no tendría sentido aplicarlo (por
						ejemplo, <code>no-autoplay-audio</code>: el audio oculto sigue sonando). Revisa el
						comentario de encabezado del archivo de la regla específica (
						<code>@applicability</code>) en <code>src/checks/</code>.
					</li>
					<li>
						<strong><code>excludeSelectors</code></strong>: si has configurado esto (directamente
						o heredado de una configuración compartida), confirma que el elemento en cuestión no
						coincide con él. Recuerda que esto también se puede limitar a una sola regla mediante{" "}
						<code>engineOptions.rules[ruleId].excludeSelectors</code> (consulta{" "}
						<a href="/configuration/engine-options/#rule-scoped-excludeselectors"><code>ENGINE_OPTIONS.md</code></a>). Si una regla que
						esperas que se active sigue devolviendo <code>notApplicable</code>/<code>pass</code>{" "}
						solo para un elemento, comprueba si esa regla en particular tiene su propia lista de
						exclusión configurada, no solo la global.
					</li>
				</ol>
			</article>

			<article>
				<h2 id="why-criterion-canttell">
					"Todas las comprobaciones se cumplen, ¿por qué cada criterio de WCAG queda en{" "}
					<code>cantTell</code>?"
				</h2>
				<p>
					Desde la 1.14, un resultado agregado de WCAG en <code>rulesResults</code> se cumple solo
					para un criterio cuyas reglas comprueban todo lo que pide, y todavía no hay ninguno
					marcado así (<code>COMPLETE_CHECK</code> en{" "}
					<code>src/coverage/complete-applicability.js</code>). Cuando todas las reglas de un
					criterio se cumplen, su resultado agregado es <code>cantTell</code> con{" "}
					<code>reasonCode</code> <code>composite.rollup.cantTell.partialCheck</code>: las partes que
					comprueban las reglas se cumplen, y el resto lo comprueba una persona.{" "}
					<a href="/rules/html-lang-attr-present/"><code>html-lang-attr-present</code></a> comprueba
					que <code>{'<html lang="fr">'}</code> nombra un idioma, no que la página esté en francés.
					Del mismo modo, un criterio cuyas reglas no encontraron nada es <code>notApplicable</code>{" "}
					solo cuando encuentran todos los casos a los que se aplica, y si no, <code>cantTell</code>{" "}
					con <code>composite.rollup.cantTell.partialCoverage</code>. Una regla que falla sigue
					haciendo fallar su criterio. Muéstralos como «comprobaciones superadas, requiere revisión»
					y «nada que comprobar encontrado», nunca como cumplidos; consulta{" "}
					<a href="/conformance/wcag-mapping/#when-a-criterion-passes">Mapeo de conformidad con WCAG</a>.
				</p>
			</article>

			<article>
				<h2>"¿Un análisis limpio (sin fallos) significa que la página es conforme con WCAG?"</h2>
				<p>
					No. Consulta <a href="/conformance/wcag-mapping/"><code>WCAG_CONFORMANCE.md</code></a>.{" "}
					<strong>
						El <code>pass</code> de una regla significa que las comprobaciones que se ejecutaron salieron limpias
						en la parte de la página que analizaron.
					</strong>{" "}
					Un análisis limitado a una parte de la página, a algunas reglas, o ejecutado bajo jsdom
					comprueba menos de lo que podría. Una fracción considerable de WCAG requiere juicio humano (texto alternativo
					preciso, mensajes de error comprensibles) o pruebas dinámicas que la arquitectura de este
					motor no puede hacer en absoluto (trampas de teclado, reflow al hacer zoom). Consulta{" "}
					<a href="/help/known-limitations/"><code>LIMITATIONS.md</code></a> para ver la lista
					explícita, deliberadamente no exhaustiva.
				</p>
			</article>

			<article>
				<h2>"¿Debo tratar <code>cantTell</code> como un fallo?"</h2>
				<p>
					<strong>Trátalo como "necesita que lo revise una persona": por diseño no es ni aprobado ni
					fallido.</strong> Una opción habitual es registrar los hallazgos de{" "}
					<code>cantTell</code> sin hacer fallar la CI por ellos, ya que hacer fallar una
					compilación por algo que el motor explícitamente no pudo determinar tiende a enseñar a la
					gente a ignorar la validación. Un equipo que quiera revisar cada uno antes de fusionar
					puede bloquear por ellos; en cualquier caso, mantenlos separados de los fallos. Entre
					ambas opciones, una compilación puede bloquearse solo por los hallazgos que apuntan a un
					fallo, donde la evidencia de la página indica un fallo: <code>leanFailAs</code> en los
					generadores de informes <a href="/results-reports/junit-report/#options">JUnit</a> y{" "}
					<a href="/results-reports/sarif-report/#options">SARIF</a>, o{" "}
					<code>leaningFailures(result)</code> (consulta el{" "}
					<a href="/results-reports/output-schema/#leans">esquema de salida</a>). Cada hallazgo{" "}
					<code>cantTell</code> de una regla de core dice cómo responderlo en{" "}
					<code>howToCheck</code>. Consulta <a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a> si quieres cambiar
					este comportamiento (por ejemplo, mediante un contrato de política personalizado), y{" "}
					<a href={`${core}/docs/INTEGRATION.md#ci-gating-a-build-on-the-result`}>
						<code>INTEGRATION.md</code>
					</a>{" "}
					para ver un ejemplo concreto de validación en CI.
				</p>
			</article>

			<article>
				<h2>"¿Qué pasa si una configuración regional solo está parcialmente traducida?"</h2>
				<p>
					<strong>Las claves faltantes recurren al inglés por cadena (nunca a un resultado en blanco
					o roto), de modo que una configuración regional parcial recurre de forma gradual al inglés
					sin dejar textos vacíos, en lugar de fallar por completo.</strong> Consulta{" "}
					<a href="/configuration/locales/"><code>I18N.md</code></a> para
					ver el mecanismo y la cobertura actual. La paridad de claves se hace cumplir en lugar de
					darse por hecha: <code>npm run i18n:sync</code>{" "}
					traslada cualquier clave nueva o renombrada de <code>en.json</code> a los demás archivos de
					configuración regional, y la compilación falla si alguno queda desincronizado. Una clave
					que agrega conserva el texto en inglés hasta que alguien la traduce, de modo que una
					configuración regional puede ir atrasada en la redacción sin ir nunca atrasada en las
					claves.
				</p>
			</article>

			<article>
				<h2>
					"<code>runDomRulesInPage</code> frente a <code>runa11yCoreInPage</code>: ¿cuál necesito?"
				</h2>
				<p>
					<code>runDomRulesInPage</code> si la llamas directamente en el mismo proceso de Node
					(jsdom). <code>runa11yCoreInPage</code> si le entregas
					la <em>función en sí</em> a un realm de JS diferente: casi siempre{" "}
					<code>page.evaluate</code> en Puppeteer/Playwright, que serializa la función a texto fuente
					y la vuelve a ejecutar dentro de la pestaña del navegador (que no tiene acceso al ámbito de
					tus módulos de Node). Consulta <a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>{" "}
					para ver ambos patrones desarrollados por completo.
				</p>
			</article>

			<article>
				<h2 id="baseline-after-upgrade">
					"Tras actualizar, mi baseline indica hallazgos conocidos como nuevos y sus entradas como
					obsoletas"
				</h2>
				<p>
					La identidad de un hallazgo incluye su código de motivo, y la 1.14 dio códigos a
					diecisiete reglas que no tenían y dividió algunos códigos según la causa. Un baseline
					escrito por la 1.13 sigue coincidiendo con esos hallazgos con la 1.14.x, gracias a{" "}
					<code>src/baseline-moves.json</code>; un hallazgo cuyo resultado cambió con la
					actualización es nuevo o desaparece igualmente, y el registro de cambios explica por qué.
					Reescribe los códigos del archivo con <code>migrateBaselineEntries</code> de{" "}
					<code>@surea11y/core/baseline</code>, o regenéralo y revisa el diff, antes de la 1.15.
					Consulta <a href="/conformance/baseline/#upgrading">Baseline / allowlist</a>.
				</p>
			</article>

			<article>
				<h2 id="stylesheets-not-readable">
					"<code>css-orientation-lock</code> pregunta por <code>STYLESHEETS_NOT_READABLE</code>"
				</h2>
				<p>
					El script de una página no puede leer una hoja de estilos que sirve otro origen (una CDN,
					un servicio de fuentes), así que las reglas que leen CSS no saben qué contiene. Pásale su
					texto al análisis en <code>engineOptions.styleSheetTexts</code>:{" "}
					<code>preloadStyleSheets()</code>, o <code>runa11yCoreInPageAsync</code> en el bundle del
					navegador, descarga las que el servidor comparte, y una herramienta que controla el
					navegador puede descargar las demás desde fuera de la página. Consulta "Style sheets from
					another origin" en{" "}
					<a href={`${core}/docs/INTEGRATION.md#style-sheets-from-another-origin`}>
						<code>INTEGRATION.md</code>
					</a>
					, la guía de integración en GitHub.
				</p>
			</article>
		</>
	);
}
