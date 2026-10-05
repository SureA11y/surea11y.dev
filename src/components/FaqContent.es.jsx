import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function FaqContent() {
	return (
		<>
			<article>
				<h2 id="runonly-threw">
					"<code>runOnly</code> lanzó un error: <span lang="en">no rule or tag named …</span>, o{" "}
					<span lang="en">either rule ids or tags</span>"
				</h2>
				<p>
					Desde la 1.10.0, un <code>runOnly</code> dado como array simple o como cadena se lee como
					ids de regla o como etiquetas, igual que lo lee axe-core (consulta{" "}
					<a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a>). Lanza un
					error en dos casos:
				</p>
				<ul>
					<li>
						<strong>Un valor que no nombra ninguna regla ni ninguna etiqueta</strong>, normalmente
						una errata: <code>runOnly: ['img-alt-presnt']</code>. Comprueba el id con{" "}
						<code>getChecksCatalog()</code>.
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
						selector no coincidió con nada, y <code>unmatchedSelectors</code> lo nombra. Revisa si
						tiene una errata, o si el elemento ya está en la página cuando analizas (por ejemplo,
						contenido que un script renderiza después de la carga).
					</li>
					<li>
						<strong>
							El análisis lanzó un error con <code>code: 'INVALID_CONTEXT_SELECTOR'</code>
						</strong>
						: el selector del mensaje, y del campo <code>selector</code> del error, no es CSS
						válido, por ejemplo <code>'#main['</code> o un combinador <code>&gt;&gt;&gt;</code>.
					</li>
				</ul>
				<p>Antes de la 1.10.0, en ambos casos se analizaba la página entera.</p>
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
				<h2>
					"Solo veo apariciones de <code>fail</code>/<code>cantTell</code>. ¿Dónde está la lista de
					elementos que aprobaron?"
				</h2>
				<p>
					<strong>Por diseño, este motor nunca enumera los elementos que una regla <em>aprobó</em>,
					solo los que señaló.</strong> El <code>outcome: 'pass'</code> general de una regla significa
					"existían uno o más objetivos aplicables y ninguno fue señalado", pero{" "}
					<code>occurrences</code> es <code>[]</code> en ambos casos. Si necesitas saber qué elementos
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
				<h2>"¿Un análisis limpio (<code>pass</code> en todo) significa que la página es conforme con WCAG?"</h2>
				<p>
					No. Consulta <a href="/conformance/wcag-mapping/"><code>WCAG_CONFORMANCE.md</code></a>.{" "}
					<strong>Un <code>pass</code> significa que toda comprobación <em>automatizable</em> salió
					limpia.</strong> Una fracción considerable de WCAG requiere juicio humano (texto alternativo
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
					fallido.</strong> La mayoría de los equipos registran los hallazgos de <code>cantTell</code>{" "}
					sin hacer fallar la CI por ellos, ya que hacer fallar una compilación por algo que el motor
					explícitamente no pudo determinar tiende a enseñar a la gente a ignorar la validación.
					Consulta <a href={`${core}/docs/POLICY.md`}><code>POLICY.md</code></a> si quieres cambiar
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
					<code>runDomRulesInPage</code> si la llamas directamente en el mismo proceso de Node (jsdom,
					un content script de extensión de navegador). <code>runa11yCoreInPage</code> si le entregas
					la <em>función en sí</em> a un realm de JS diferente: casi siempre{" "}
					<code>page.evaluate</code> en Puppeteer/Playwright, que serializa la función a texto fuente
					y la vuelve a ejecutar dentro de la pestaña del navegador (que no tiene acceso al ámbito de
					tus módulos de Node). Consulta <a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>{" "}
					para ver ambos patrones desarrollados por completo.
				</p>
			</article>
		</>
	);
}
