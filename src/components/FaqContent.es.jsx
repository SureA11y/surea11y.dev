import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function FaqContent() {
	return (
		<>
			<article>
				<h2>"Pasé <code>runOnly: ['some-rule-id']</code> pero de todas formas se ejecutaron todas las reglas"</h2>
				<p>
					<strong><code>runOnly</code> debe ser un objeto, no un array simple.</strong>{" "}
					<code>runOnly: ['img-alt-present']</code> se ignora silenciosamente (el motor termina
					ejecutando "todas las reglas"), porque esa forma no tiene ninguno de los campos que el motor
					realmente comprueba (<code>includeRuleIds</code>, <code>tags</code>, etc.). Es fácil utilizar
					por error un array simple, así que vale la pena comprobar esto primero.
				</p>
				<p>Solución:</p>
				<CodeBlock lang="js" lines={["runOnly: { includeRuleIds: ['img-alt-present'] }"]} />
				<p>
					Consulta <a href="/configuration/engine-options/"><code>ENGINE_OPTIONS.md</code></a> para ver la forma completa.
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
					<code>runInPage</code>, o enrútalo a través de <code>ctx.rule</code>/<code>ctx.helpers</code>).
				</p>
			</article>

			<article>
				<h2>
					"Una regla que depende de la geometría (por ejemplo, <code>target-size-minimum</code>) siempre
					indica <code>notApplicable</code>"
				</h2>
				<p>
					jsdom puro (sin un navegador real) no implementa un motor de diseño CSS —{" "}
					<code>getBoundingClientRect()</code> siempre devuelve una geometría de cero. <strong>Las
					reglas que necesitan información real de maquetación devuelven <code>notApplicable</code> al
					ejecutarse con jsdom en lugar de adivinar.</strong> Ejecuta en su lugar a través de un navegador real (Puppeteer/Playwright — consulta{" "}
					<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a> Patrón 2) para
					obtener hallazgos reales de estas reglas. Consulta{" "}
					<a href="/help/known-limitations/"><code>LIMITATIONS.md</code></a>.
				</p>
			</article>

			<article>
				<h2>
					"Solo veo apariciones de <code>fail</code>/<code>cantTell</code> — ¿dónde está la lista de
					elementos que aprobaron?"
				</h2>
				<p>
					<strong>Por diseño, este motor nunca enumera los elementos que una regla <em>aprobó</em> —
					solo los que señaló.</strong> El <code>outcome: 'pass'</code> general de una regla significa
					"existían uno o más objetivos aplicables y ninguno fue señalado", pero{" "}
					<code>occurrences</code> es <code>[]</code> en ambos casos. Si necesitas saber qué elementos
					concretos se comprobaron y se consideraron correctos, eso actualmente no se expone — consulta{" "}
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
						<strong>El elemento está excluido del árbol de accesibilidad</strong> —{" "}
						<code>aria-hidden="true"</code>, <code>display: none</code>,{" "}
						<code>visibility: hidden</code>, <code>hidden</code>, o un ancestro <code>inert</code>.
						La mayoría de las reglas omiten contenido que ya es invisible para la tecnología de
						asistencia, ya que comprobar un elemento oculto no tendría sentido y podría producir un{" "}
						<code>fail</code> engañoso sobre contenido que ningún usuario encuentra. Algunas reglas
						se excluyen explícitamente de este filtro cuando no tendría sentido aplicarlo (por
						ejemplo, <code>no-autoplay-audio</code> — el audio oculto sigue sonando) — revisa el
						comentario de encabezado del archivo de la regla específica (
						<code>@applicability</code>) en <code>src/checks/</code>.
					</li>
					<li>
						<strong><code>excludeSelectors</code></strong> — si has configurado esto (directamente
						o heredado de una configuración compartida), confirma que el elemento en cuestión no
						coincide con él. Recuerda que esto también se puede limitar a una sola regla mediante{" "}
						<code>engineOptions.rules[ruleId].excludeSelectors</code> (consulta{" "}
						<a href="/configuration/engine-options/#rule-scoped-excludeselectors"><code>ENGINE_OPTIONS.md</code></a>) — si una regla que
						esperas que se active sigue devolviendo <code>notApplicable</code>/<code>pass</code>{" "}
						solo para un elemento, comprueba si esa regla en particular tiene su propia lista de
						exclusión configurada, no solo la global.
					</li>
				</ol>
			</article>

			<article>
				<h2>"¿Un análisis limpio (<code>pass</code> en todo) significa que la página es conforme con WCAG?"</h2>
				<p>
					No — consulta <a href="/conformance/wcag-mapping/"><code>WCAG_CONFORMANCE.md</code></a>.{" "}
					<strong>Un <code>pass</code> significa que toda comprobación <em>automatizable</em> salió
					limpia.</strong> Una fracción considerable de WCAG requiere juicio humano (texto alternativo
					preciso, mensajes de error comprensibles) o pruebas dinámicas que la arquitectura de este
					motor no puede hacer en absoluto (trampas de teclado, reflow al hacer zoom) — consulta{" "}
					<a href="/help/known-limitations/"><code>LIMITATIONS.md</code></a> para ver la lista
					explícita, deliberadamente no exhaustiva.
				</p>
			</article>

			<article>
				<h2>"¿Debo tratar <code>cantTell</code> como un fallo?"</h2>
				<p>
					<strong>Trátalo como "necesita que lo revise una persona" — por diseño no es ni aprobado ni
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
					"<code>runDomRulesInPage</code> frente a <code>runa11yCoreInPage</code> — ¿cuál necesito?"
				</h2>
				<p>
					<code>runDomRulesInPage</code> si la llamas directamente en el mismo proceso de Node (jsdom,
					un content script de extensión de navegador). <code>runa11yCoreInPage</code> si le entregas
					la <em>función en sí</em> a un realm de JS diferente — casi siempre{" "}
					<code>page.evaluate</code> en Puppeteer/Playwright, que serializa la función a texto fuente
					y la vuelve a ejecutar dentro de la pestaña del navegador (que no tiene acceso al ámbito de
					tus módulos de Node). Consulta <a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>{" "}
					para ver ambos patrones desarrollados por completo.
				</p>
			</article>
		</>
	);
}
