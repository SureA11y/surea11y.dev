import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function FaqContent() {
	return (
		<>
			<article>
				<h2 id="results-changed-1-17">"Mis resultados cambiaron al actualizar a core 1.17"</h2>
				<p>
					La 1.17 añade cuatro reglas, asigna algunas reglas a más criterios y hace que los mensajes
					nombren la causa de un hallazgo. Por lo demás, los resultados y los códigos de motivo de
					las reglas existentes no cambian. Los cambios que más probablemente se noten en un
					pipeline:
				</p>
				<ul>
					<li>
						<strong>Un análisis de WCAG 2.2 AA en un navegador pregunta por el 2.4.11.</strong>{" "}
						<a href="/rules/focus-not-obscured-minimum/">
							<code>focus-not-obscured-minimum</code>
						</a>{" "}
						pregunta (<code>cantTell</code>) por una caja fija o sticky, como un encabezado, un pie
						de página o un banner, detrás de la cual los elementos del orden de tabulación pueden
						recibir el foco ocultos, y{" "}
						<a href="/rules/focus-not-obscured-enhanced/">
							<code>focus-not-obscured-enhanced</code>
						</a>{" "}
						hace lo mismo para el 2.4.12 (AAA). Con jsdom ambas son <code>notApplicable</code>. Un
						análisis así tarda alrededor de un 4 % más en Chromium (consulta{" "}
						<a href="/help/known-limitations/">Limitaciones conocidas</a> para ver lo que dejan
						fuera).
					</li>
					<li>
						<strong>Un análisis que ejecuta reglas AAA hace fallar los objetivos de menos de 44
						px.</strong>{" "}
						<a href="/rules/target-size-enhanced/">
							<code>target-size-enhanced</code>
						</a>{" "}
						(2.5.5) se ejecuta en un análisis completo, uno sin objetivo de WCAG, y con un objetivo
						AAA. Un pipeline que falla con cualquier <code>fail</code> de un análisis completo
						puede ver fallos nuevos: analiza con un objetivo, como el perfil{" "}
						<code>wcag22-aa</code>, para juzgar solo por A y AA (consulta{" "}
						<a href="/configuration/engine-options/">Opciones del motor</a>). Con las buenas
						prácticas,{" "}
						<a href="/rules/page-zones-landmark/">
							<code>page-zones-landmark</code>
						</a>{" "}
						pregunta por un encabezado, una navegación, una búsqueda o un pie de página que no es
						su región de referencia.
					</li>
					<li>
						<strong>Algunas reglas cuentan para más criterios.</strong>{" "}
						<code>css-focus-indicator-suppressed</code> se asigna también al 1.4.11 y al 2.4.13,
						así que sus hallazgos aparecen ahora en el resultado del 1.4.11;{" "}
						<code>focus-not-removed-by-script</code> se asigna al 2.4.13, y cuatro reglas que se
						asignan al 2.1.1 se asignan también al 2.1.3.
					</li>
					<li>
						<strong>Los mensajes nombran la causa de fondo</strong> que encuentran las reglas: por
						qué un elemento no tiene nombre (<code>data.details.nameCause</code>), una probable
						errata en un rol, un atributo o un valor de <code>autocomplete</code>, qué oculta un
						elemento, el contraste en un fallo de <code>link-in-text-block</code>, cuánto le falta
						a un objetivo para pasar <code>target-size-minimum</code>. Una prueba que compare el
						texto de los mensajes, o la clave de la pista de <code>target-size-minimum</code>{" "}
						(ahora <code>_centerDistance</code> o <code>_regionDistance</code>), necesita
						actualizarse.
					</li>
					<li>
						<strong>Algunos hallazgos cambian.</strong> <code>css-hidden-focus</code> tiende a{" "}
						<code>fail</code> cuando el elemento está fuera de la vista y no se sabe de nada que lo
						traiga a la vista; <code>aria-hidden-focus</code> hace fallar un elemento enfocable
						devuelto a <code>visibility: visible</code> dentro de una raíz <code>aria-hidden</code>{" "}
						oculta; <code>aria-conditional-attr</code> da por bueno un valor de{" "}
						<code>aria-invalid</code> fuera de sus tokens; <code>link-in-text-block</code> solo
						cuenta el texto de la propia línea del enlace.
					</li>
					<li>
						<strong>Los packs creados para la 1.16 pueden omitirse.</strong> Un pack que usa las
						API experimentales de core no acepta ninguna versión menor posterior, así que un
						análisis con la 1.17 lo omite hasta que tenga una versión para la 1.17: el{" "}
						<a href="/configuration/packs/#en-301-549-pack">pack de EN 301 549</a> necesita la
						1.4.0. Además, la 1.17 eliminó cuatro campos de las leyes de un estándar, y un pack que
						todavía los tenga se rechaza (consulta{" "}
						<a href="/configuration/packs/#laws">Packs</a>).
					</li>
				</ul>
				<p>
					Nuevo, y sin cambiar nada salvo que lo uses: un pack construido sobre otro pack (
					<code>uses</code>, <code>surea11y-pack new --kind derived</code>), experimental hasta la
					1.19.0 (<a href="/configuration/packs/#a-pack-built-on-another-pack">Packs</a>). El
					bundle para navegador pasa de 1.565 a 1.829 KB, sobre todo por los mensajes nuevos. La
					lista completa está en el{" "}
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
				<p>
					Cuando <code>broken</code> es solo <code>Array.from</code>, la página lo sustituyó
					(Prototype y MooTools lo hacen) y una regla de un pack o personalizada del análisis lo
					usa: las reglas propias de core no lo usan, desde la 1.16. Escribe esa regla con
					spread (<code>[...x]</code>, <code>[...x].map(f)</code>), o déjala fuera de la
					selección. El <a href="/configuration/packs/#wai-aria-pack">pack de WAI-ARIA</a> lo
					hacía hasta su versión 1.0.2: actualízalo.
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
				<p>
					Un análisis de varios perfiles a la vez (<code>profile: ['wcag22-aa', 'wai-aria-1.2']</code>)
					analiza la página una vez por perfil, así que tarda más o menos lo que ese número de
					análisis.
				</p>
			</article>

			<article>
				<h2 id="profile-not-run">
					"Un perfil no se ejecutó", o <code>engine.profilesNotRun</code> no está vacío
				</h2>
				<p>
					En un análisis de varios perfiles, un perfil que no pudo ejecutarse se enumera en{" "}
					<code>engine.profilesNotRun</code> con su motivo, y los demás se siguen ejecutando:{" "}
					<code>unknown-profile</code> (no existe ese perfil: el perfil de un pack necesita su pack
					en <code>packs</code>), <code>pack-skipped</code> (su pack no se ejecutó, consulta{" "}
					<a href="#pack-did-not-run">la entrada de más abajo</a>) u{" "}
					<code>overridden-by-selection</code> (un include de <code>runOnly</code>, o ids o
					etiquetas de reglas en <code>engineOptions</code>, eligieron las reglas en su lugar, para
					todos los perfiles). Ese análisis juzgó menos de lo que se le pidió, así que SARIF y JUnit
					informan un error salvo con <code>allowProfilesNotRun: true</code>, la CLI sale con{" "}
					<code>2</code> salvo con <code>--allow-profiles-not-run</code>, las integraciones informan
					una carencia <code>'profile-not-run'</code>, y los test matchers hacen fallar la aserción.
					Consulta <a href="/configuration/engine-options/#several-profiles">Opciones del motor</a>.
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
				<h2 id="framed-page-rules">
					"Las reglas de título, idioma y regiones de referencia son <code>notApplicable</code> en
					un frame"
				</h2>
				<p>
					Desde la 1.15, un documento mostrado en un frame no es una página propia:{" "}
					<code>page-title-present</code>, <code>page-title-patterns</code>,{" "}
					<code>html-lang-attr-present</code>, <code>meta-viewport-zoom-enabled</code>,{" "}
					<code>meta-viewport-large</code>, <code>region</code>,{" "}
					<code>bypass-blocks-present</code>, <code>landmark-one-main</code> y{" "}
					<code>page-has-heading-one</code> son <code>notApplicable</code> en él. La página que
					rodea el frame es la que tiene el título, el idioma y las regiones de referencia que usan
					las personas, y un navegador ignora el <code>&lt;meta&gt;</code> viewport de un documento
					en un frame. Un ejecutor de pruebas que muestra la página bajo prueba en un frame propio
					establece <code>engineOptions.topLevelDocument: true</code>;{" "}
					<a href="/getting-started/cypress/">@surea11y/cypress</a> 1.6.0 lo hace por ti. Consulta{" "}
					<a href="/configuration/engine-options/">Opciones del motor</a>.
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
					explícita, deliberadamente no exhaustiva. Lo que queda le toca comprobarlo a una persona,
					y los <a href="/conformance/procedures/">procedimientos de prueba</a> de core dicen cómo,
					criterio por criterio.
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
					ver el mecanismo y la cobertura actual. La paridad de claves se hace cumplir en la propia
					compilación de core en lugar de darse por hecha: toda clave inglesa nueva o renombrada
					se traslada a los demás archivos de configuración regional, con el texto en inglés hasta
					que alguien la traduce, de modo que una configuración regional puede ir atrasada en la
					redacción sin ir nunca atrasada en las claves.
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
					<code>src/baseline-moves.json</code>, pero no con la 1.15, que quitó esos cambios: allí
					una entrada con un código antiguo está obsoleta y su hallazgo es nuevo. Reescribe los
					códigos del archivo con la 1.14.x con <code>migrateBaselineEntries</code> de{" "}
					<code>@surea11y/core/baseline</code> y después actualiza, o regenéralo con la 1.15 y revisa
					el diff. Ni la 1.15 ni la 1.16 movieron ningún código, así que un baseline escrito por la
					1.14 sigue coincidiendo; un hallazgo cuyo resultado cambió con la actualización es nuevo o
					desaparece igualmente, y el registro de cambios explica por qué. Consulta <a href="/conformance/baseline/#upgrading">Baseline / allowlist</a>.
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

			<article>
				<h2 id="results-changed-1-16">"Mis resultados cambiaron al actualizar a core 1.16"</h2>
				<p>
					La 1.16 acerca jsdom al navegador y redacta sus mensajes para cualquier estándar. Los
					cambios que más probablemente se noten en un pipeline:
				</p>
				<ul>
					<li>
						<strong>Con jsdom, solo un diálogo abierto con <code>showModal()</code> es
						modal</strong>, como en un navegador. La página detrás de un{" "}
						<code>&lt;dialog open aria-modal="true"&gt;</code> se juzga ahora, así que una prueba
						con jsdom que simula un modal de esa manera ve hallazgos detrás de él;{" "}
						<code>engineOptions.assumeModal: true</code> mantiene el comportamiento anterior
						(consulta <a href="/help/known-limitations/">Limitaciones conocidas</a>; con
						test-matchers 1.6.0, pásalo también a <code>installLiveRegionHook()</code>, consulta{" "}
						<a href="/getting-started/test-matchers/#modal-dialogs-in-jsdom">test-matchers</a>).
						Nada detrás
						de un diálogo modal recibe el foco, y de varios abiertos con <code>showModal()</code>{" "}
						solo se juzga el superior.
					</li>
					<li>
						<strong>jsdom oculta lo que oculta un navegador.</strong> Las reglas dentro de{" "}
						<code>@layer</code>, <code>@supports</code> y <code>@container</code> ocultan
						elementos, así que <code>hidden</code> y <code>sr-only</code> de Tailwind v4
						funcionan; <code>clip: rect(0 0 0 0)</code> cuenta como recortado; el{" "}
						<code>&lt;area&gt;</code> de un mapa de imagen está en la página. Desaparecen los
						hallazgos sobre contenido que siempre estuvo oculto.
					</li>
					<li>
						<strong>Los mensajes y los pasos describen la comprobación</strong> en lugar de nombrar
						el criterio de WCAG, en todas las configuraciones regionales, así que un informe para
						otro estándar se lee bien. Los mapeos y <code>failWhen</code> no cambian; una prueba
						que compare el texto de los mensajes necesita actualizarse.
					</li>
					<li>
						<strong>Se juzgan las páginas profundas.</strong> Un elemento a 200 o más niveles de
						profundidad se juzga con todo lo que tiene encima, hasta 10.000 niveles, donde un fallo
						tan profundo pasaba a ser una pregunta anotada en <code>error</code>; así que pueden
						aparecer fallos ahí. Más allá de 10.000 es una pregunta, informada en{" "}
						<a href="/results-reports/output-schema/">
							<code>ancestorWalkLimit</code>
						</a>
						.
					</li>
					<li>
						<strong>Las páginas que sustituyen <code>Array.from</code></strong> (Prototype.js,
						MooTools) se analizan, donde antes el análisis se detenía con{" "}
						<code>PAGE_BUILTINS_BROKEN</code> (consulta{" "}
						<a href="#page-builtins-broken">la entrada de más arriba</a>).
					</li>
					<li>
						<strong>Algunos selectores son distintos.</strong> Los caracteres de control se
						escapan, un valor de más de 256 caracteres deja paso a la ruta del elemento, y{" "}
						<a href="/rules/page-title-present/"><code>page-title-present</code></a> y{" "}
						<a href="/rules/page-title-patterns/"><code>page-title-patterns</code></a> apuntan al
						propio elemento del título, o a <code>&lt;head&gt;</code> cuando no hay ninguno. La
						identidad de un hallazgo no incluye su selector, así que los baselines siguen
						coincidiendo. Las reglas de contraste son <code>notApplicable</code> sin ninguna
						ocurrencia cuando no se pudo calcular ningún contraste.
					</li>
					<li>
						<strong>Los errores se informan en lugar de leerse como nada.</strong> Un{" "}
						<code>contextSelector</code> vacío sigue analizando toda la página, pero avisa; algo
						que no es un baseline lanza <code>INVALID_BASELINE</code> en lugar de hacer nuevo cada
						fallo; y con <code>strictOptions</code>, un nombre de perfil desconocido lanza un error.
						El perfil <code>section508</code> está obsoleto: usa <code>wcag20-aa</code>, que
						ejecuta las mismas reglas.
					</li>
					<li>
						<strong>Análisis más rápidos</strong>, con los mismos hallazgos: un pequeño porcentaje
						en Chromium en páginas corrientes, del 10 al 25 % con jsdom, y mucho más donde era peor
						(miles de enlaces o campos idénticos, tablas largas, muchas reglas de estilo).
					</li>
				</ul>
				<p>
					Nuevo, y sin cambiar nada salvo que lo uses: los perfiles de WCAG 2.0 y 2.1 (
					<a href="/configuration/engine-options/#conformance-profiles">Opciones del motor</a>) y,
					experimentales hasta la 1.18.0, los estándares como datos, las pruebas bajo los
					requisitos, los estándares construidos sobre otros y las leyes bajo las que se evalúa un
					estándar (<a href="/configuration/packs/#experimental">Packs</a>). La lista completa está
					en el{" "}
					<a href={`${core}/CHANGELOG.md`}>
						<code>CHANGELOG.md</code>
					</a>{" "}
					de core.
				</p>
			</article>

			<article>
				<h2 id="results-changed-1-15">"Mis resultados cambiaron al actualizar a core 1.15"</h2>
				<p>
					La 1.15 hace fallar un criterio de WCAG solo donde WCAG falla, y lee los frames como los
					muestra el navegador. Los cambios que más probablemente se noten en un pipeline:
				</p>
				<ul>
					<li>
						<strong>Menos fallos de estructura ARIA y HTML.</strong> Ocho reglas de ARIA y las reglas
						de estructura HTML ya no hacen fallar un criterio donde solo se incumple WAI-ARIA o el
						modelo de contenido de HTML: esos hallazgos son <code>cantTell</code>, con incertidumbre{" "}
						<code>spec-only</code> y pasos para comprobarlo. Afectadas:{" "}
						<a href="/rules/aria-role-name-present/"><code>aria-role-name-present</code></a> (grid,
						tree, radiogroup, meter, progressbar),{" "}
						<a href="/rules/dialog-name-present/"><code>dialog-name-present</code></a>,{" "}
						<a href="/rules/tooltip-name-present/"><code>tooltip-name-present</code></a>,{" "}
						<a href="/rules/aria-allowed-attr/"><code>aria-allowed-attr</code></a>,{" "}
						<a href="/rules/aria-valid-attr-value/"><code>aria-valid-attr-value</code></a> (salvo
						para el estado, el valor o el foco de un control),{" "}
						<a href="/rules/aria-prohibited-attr/"><code>aria-prohibited-attr</code></a>,{" "}
						<a href="/rules/aria-roles-valid/"><code>aria-roles-valid</code></a> (salvo en un
						elemento enfocable), <a href="/rules/aria-owns-valid/"><code>aria-owns-valid</code></a>{" "}
						(un ancestro; ahora solo se asocia al 1.3.1),{" "}
						<a href="/rules/list-children-valid/"><code>list-children-valid</code></a> y{" "}
						<a href="/rules/listitem-parent-valid/"><code>listitem-parent-valid</code></a> (salvo
						donde la página dibuja el elemento defectuoso),{" "}
						<a href="/rules/definition-list-children-valid/"><code>definition-list-children-valid</code></a>,{" "}
						<a href="/rules/dlitem-parent-valid/"><code>dlitem-parent-valid</code></a> y{" "}
						<a href="/rules/nested-interactive-controls-absent/"><code>nested-interactive-controls-absent</code></a>{" "}
						(salvo dentro de un control con hijos presentacionales). Cada hallazgo conserva su
						código de motivo, así que los baselines siguen coincidiendo, pero una validación o un
						resultado agregado que solo fallaban por estos ahora se cumplen o quedan en{" "}
						<code>cantTell</code>. Para juzgar los mismos hallazgos según WAI-ARIA, donde fallan,
						añade el <a href="/configuration/packs/#wai-aria-pack">pack de WAI-ARIA</a>.
					</li>
					<li>
						<strong>Un documento en un frame no es una página propia.</strong> En un frame,{" "}
						<code>page-title-present</code>, <code>html-lang-attr-present</code> y las reglas de
						viewport, de bloques que saltar y de regiones de referencia son{" "}
						<code>notApplicable</code> (consulta{" "}
						<a href="#framed-page-rules">la entrada de más arriba</a>). Un frame bajo{" "}
						<code>aria-hidden</code> o <code>inert</code> se lee como tal, y uno tras un diálogo
						modal abierto se deja fuera.
					</li>
					<li>
						<strong>Los roles siguen WAI-ARIA más de cerca.</strong> <code>role="text"</code> no
						nombra ningún rol válido; una imagen con un rol presentacional y un atributo ARIA global
						conserva su rol, y falla{" "}
						<a href="/rules/img-alt-present/"><code>img-alt-present</code></a> sin{" "}
						<code>alt</code>; los cuatro globales que WAI-ARIA 1.2 declara obsoletos ya no devuelven
						su rol a un elemento presentacional.
					</li>
					<li>
						<strong>Un nivel de encabezado saltado es un problema de buenas prácticas</strong>, no
						un fallo del 1.3.1, en los{" "}
						<a href="/conformance/procedures/">procedimientos de prueba</a> revisados, que también
						dan los pasos de «Cómo comprobarlo» de seis preguntas nuevas.
					</li>
					<li>
						<strong>Un baseline de la 1.13 necesita ponerse al día primero.</strong> La 1.15 no
						movió ningún código de motivo, y quitó los cambios de la 1.13 a la 1.14 (consulta{" "}
						<a href="#baseline-after-upgrade">la entrada de más arriba</a>).
					</li>
				</ul>
				<p>
					Nuevo, y sin cambiar nada salvo que lo uses: análisis de varios perfiles a la vez (
					<a href="/configuration/engine-options/#several-profiles">Opciones del motor</a>), los
					perfiles <code>wcag22-a</code> y <code>wcag22-aaa</code>, los procedimientos de prueba
					para evaluar a mano, y «Lo que queda para una persona» en el informe HTML. La lista
					completa está en el{" "}
					<a href={`${core}/CHANGELOG.md`}>
						<code>CHANGELOG.md</code>
					</a>{" "}
					de core.
				</p>
			</article>
		</>
	);
}
