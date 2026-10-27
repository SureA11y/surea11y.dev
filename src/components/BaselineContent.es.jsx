import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const codes = (list) =>
	list.map((c, i) => (
		<React.Fragment key={c}>
			{i > 0 && ", "}
			<code>{c}</code>
		</React.Fragment>
	));

const baselineMoves = [
	{ id: "text-missing", rules: ["img-alt-present", "embed-text-alternative-present", "object-text-alternative-present", "svg-image-text-alternative-present", "svg-text-alternative-present", "video-poster-text-alternative-present"], from: ["DEFAULT"], to: ["TEXT_ALTERNATIVE_MISSING"] },
	{ id: "area-alt", rules: ["area-alt-present"], from: ["DEFAULT"], to: ["TEXT_ALTERNATIVE_MISSING", "TEXT_ALTERNATIVE_EMPTY"] },
	{ id: "canvas", rules: ["canvas-text-alternative-present"], from: ["DEFAULT"], to: ["TEXT_ALTERNATIVE_MISSING", "ROLE_IMG_NAME_MISSING"] },
	{ id: "text-review", rules: ["area-alt-quality", "canvas-text-alternative-quality", "embed-text-alternative-quality", "input-image-alt-quality", "object-text-alternative-quality"], from: ["DEFAULT"], to: ["TEXT_ALTERNATIVE_REVIEW"] },
	{ id: "img-quality", rules: ["img-alt-quality", "svg-text-alternative-quality"], from: ["DEFAULT"], to: ["TEXT_ALTERNATIVE_REVIEW", "IMAGE_ONLY_CONTROL_CONTENT"] },
	{ id: "img-decorative", rules: ["img-alt-decorative"], from: ["EXCLUDED_ELEMENT_REVIEW"], to: ["IMAGE_ONLY_CONTROL_CONTENT"] },
	{ id: "input-image", rules: ["input-image-alt-decorative"], from: ["DEFAULT"], to: ["NAME_FROM_ELSEWHERE_REVIEW"] },
	{ id: "manual-review", rules: ["manual-review"], from: ["DEFAULT"], to: ["KEYBOARD_REVIEW"] },
	{ id: "list-children", rules: ["list-children-valid"], from: ["LIST_INVALID_CHILD"], to: ["LIST_ITEM_ROLE_OVERRIDDEN"] },
	{ id: "listitem-parent", rules: ["listitem-parent-valid"], from: ["LISTITEM_INVALID_PARENT"], to: ["LIST_ROLE_OVERRIDDEN"] },
	{ id: "prohibited-children", rules: ["aria-prohibited-children"], from: ["ARIA_PROHIBITED_CHILD_ROLELESS"], to: ["ARIA_PROHIBITED_CHILD"] },
	{ id: "duplicate-id", rules: ["duplicate-id"], from: ["DUPLICATE_ID"], to: ["DUPLICATE_ID_IN_SHADOW_TREE"] },
	{ id: "valid-lang", rules: ["valid-lang"], from: ["ELEMENT_LANG_INVALID"], to: ["DEFAULT_LANG_INVALID"] },
	{ id: "p-as-heading", rules: ["p-as-heading"], from: ["BOLD_LARGE_PARAGRAPH", "BOLD_LARGE_DIV"], to: ["HEADING_LIKE_NUMBER", "HEADING_LIKE_LINK"] },
].map((row) => ({ ...row, rules: codes(row.rules), from: codes(row.from), to: codes(row.to) }));

export function BaselineContent() {
	return (
		<>
			<p>
				Un control estricto en CI ("fallar la compilación ante cualquier resultado <code>fail</code>")
				es un obstáculo para la adopción por parte de un equipo que analiza por primera vez un sitio
				existente e imperfecto: no pueden publicar nada hasta corregir cada violación preexistente.
				Un baseline permite que un equipo diga "estas N ya se conocen, no bloquees por ellas, pero
				falla en cuanto aparezca una genuinamente nueva".
			</p>
			<CodeBlock
				lines={[
					"# Once: record every current fail occurrence, does not fail the build.",
					{ text: "surea11y scan ./dist/index.html --write-baseline baseline.json", command: true },
					"",
					"# Commit baseline.json to git.",
					"",
					"# From then on, in CI: only a NEW (not-yet-baselined) fail occurrence gates the build.",
					{ text: "surea11y scan ./dist/index.html --baseline baseline.json", command: true },
				]}
			/>
			<p>
				El archivo de baseline está pensado para incorporarse a git, de modo que aceptar más deuda de
				accesibilidad se convierta en una decisión explícita y revisable: una violación nueva
				aparece como una fila nueva en el diff del archivo en un PR, no como un cambio silencioso en
				un recuento.
			</p>

			<h2>Cuándo es útil</h2>
			<ul>
				<li>
					<strong>Adoptar el análisis en un sitio existente.</strong> El caso motivador anterior: un
					primer análisis en un sitio maduro puede revelar cientos de violaciones preexistentes.
					Registrarlas en el baseline una sola vez elimina el bloqueo de inmediato en lugar de
					exigir "corregir todo primero".
				</li>
				<li>
					<strong>Remediación incremental con un avance visible.</strong> Corrige violaciones por
					lotes, y luego regenera periódicamente el baseline con <code>--write-baseline</code>. El
					diff de git de cada regeneración se <em>reduce</em> a medida que desaparecen entradas: el
					propio archivo se convierte en un rastreador de progreso, y un PR que corrige un lote de
					problemas muestra exactamente qué se limpió.
				</li>
				<li>
					<strong>Contenido de terceros o de proveedores que no controlas.</strong> Una página
					incrusta un widget (burbuja de chat, unidad de anuncios, iframe de pago) con violaciones
					conocidas que no puedes corregir. Registrar en el baseline solo esas ocurrencias
					específicas es más preciso que excluir todo el subárbol mediante{" "}
					<code>excludeSelectors</code> (ver{" "}
					<a href="/configuration/engine-options/#rule-scoped-excludeselectors">
						la guía de opciones del motor
					</a>
					); los problemas nuevos introducidos en cualquier otro lugar cercano, incluido tu propio
					código, siguen bloqueando con normalidad.
				</li>
				<li>
					<strong>Red de seguridad contra regresiones durante una refactorización grande.</strong>{" "}
					A mitad de una migración, algunas reglas pueden fallar legítimamente de forma temporal, en
					formas ya rastreadas y en proceso de corrección a lo largo de muchos PR. Registrar en el
					baseline el conjunto conocido y en curso sigue detectando regresiones nuevas{" "}
					<em>no relacionadas</em> provenientes de otros PR durante la misma ventana, en lugar de
					desactivar el control por completo o bloquear cada PR con él.
				</li>
				<li>
					<strong>Despliegue escalonado de una regla nueva o más estricta.</strong> Activar una
					regla (o un nivel completo de WCAG) contra el que la base de código aún no está limpia:
					registra en el baseline los huecos existentes, activa el control de inmediato, y evita
					cualquier violación <em>nueva</em> de esa regla mientras el trabajo pendiente se limpia por
					separado, en lugar de esperar a activar la regla hasta que la base de código ya cumpla.
				</li>
			</ul>

			<h2>Cómo funciona la coincidencia</h2>
			<p>
				Nada en la estructura de una ocurrencia es una identidad perfecta e independiente de la posición
				en la página (ver <a href="/results-reports/output-schema/">el esquema de salida</a>):{" "}
				<code>selector</code> y <code>structuralPath</code> se derivan ambos de la posición del
				elemento en el DOM, así que cualquiera de los dos puede cambiar cuando se modifica marcado{" "}
				<em>no relacionado</em> en otra parte de la página, aunque el elemento marcado en sí no haya
				cambiado.
			</p>
			<p>En su lugar, la identidad de una entrada de baseline es:</p>
			<CodeBlock lines={["ruleId + reasonCode + html"]} />
			<p>
				donde <code>reasonCode</code> es el código específico de la regla proveniente de{" "}
				<code>occurrence.data.details.reasonCode</code> (con <code>"DEFAULT"</code> por defecto
				cuando una regla no establece uno, o establece algo que no sea una cadena no vacía), y{" "}
				<code>html</code> es el fragmento de outer-HTML de la
				ocurrencia. Esto se basa en el contenido y no en la posición: sobrevive a que el elemento
				marcado se mueva por la página (un reordenamiento, un elemento hermano no relacionado
				añadido o eliminado) siempre que el propio marcado del elemento marcado no cambie. Para
				un hallazgo sobre la propia página, informado en <code>&lt;html&gt;</code> o{" "}
				<code>&lt;body&gt;</code> (<a href="/rules/html-lang-attr-present/"><code>html-lang-attr-present</code></a>,{" "}
				<a href="/rules/bypass-blocks-present/"><code>bypass-blocks-present</code></a>, <a href="/rules/landmark-one-main/"><code>landmark-one-main</code></a>), el fragmento es solo
				la etiqueta de apertura, así que editar el contenido de la página no lo convierte en nuevo.
				El fragmento se compara con los atributos de cada etiqueta ordenados por nombre y sus
				nombres de clase ordenados, así que una compilación que escribe{" "}
				<code>class="b a" src</code> donde la anterior escribió <code>src class="a b"</code>{" "}
				coincide; los archivos de baseline escritos antes de esto siguen coincidiendo, porque la
				comparación se hace en el momento de buscar coincidencias. El{" "}
				<code>selector</code> sigue registrándose en el archivo de baseline, pero únicamente como
				contexto para una persona que lea un diff; nunca se usa para la coincidencia.
			</p>
			<p>
				<strong>Limitación conocida</strong>: un elemento cuyo propio marcado incluye contenido
				dinámico (una marca de tiempo, un contador en vivo, un <code>id</code> generado aleatoriamente) nunca
				coincidirá consigo mismo entre dos análisis, ya que su fragmento <code>html</code> difiere
				cada vez. Si tus páginas presentan este caso, el mecanismo de baseline no ayudará para esas
				reglas o elementos específicos (ver "Alternativa" más abajo).
			</p>
			<p>
				<strong>La coincidencia cuenta ocurrencias, no solo presencia.</strong> Si una página tiene 3
				elementos que producen una combinación idéntica byte a byte de{" "}
				<code>ruleId</code>+<code>reasonCode</code>+<code>html</code> (por ejemplo, el mismo
				componente defectuoso repetido 3 veces) y el baseline solo registró 1 de ellos, un análisis
				nuevo devuelve 1 conocido y 2 nuevos, no los 3 como conocidos.
			</p>
			<p>
				Un hallazgo dentro de un frame de un resultado entre frames (
				<code>runa11yCoreAcrossFrames</code>) se distingue también por su frame: su entrada registra
				la <strong>ruta</strong> del frame, los selectores de los elementos frame que llevan hasta él
				(<code>"frame": ["#checkout"]</code>), y solo coincide con un hallazgo en el frame de esa
				ruta. El mismo componente defectuoso en la página y en un frame son dos hallazgos. Las
				entradas sin <code>frame</code> son las de la propia página, así que un baseline escrito a
				partir de un análisis de un solo documento sigue coincidiendo con la página.
			</p>
			<p>
				Un resultado compacto (<code>engineOptions.output.detail: 'findings'</code>, ver{" "}
				<a href="/results-reports/output-schema/#top-level-result">Esquema de salida</a>) se lee
				como el resultado completo que representa, así que se informa igual.
			</p>
			<p>
				Las entradas de baseline que no coinciden con nada en un análisis nuevo se indican como{" "}
				<strong>obsoletas</strong>: puede que la violación se haya corregido, que el marcado del
				elemento haya cambiado o que el análisis no llegara a él (otro viewport, otro ámbito u
				otro conjunto de reglas). Esto es solo informativo y nunca bloquea la compilación;
				revísalas y luego regenera el baseline con <code>--write-baseline</code> periódicamente
				para limpiarlas.
			</p>

			<h2 id="findings-that-lean-fail">Hallazgos que probablemente fallan</h2>
			<p>
				Un baseline registra fallos. Un hallazgo sin decidir no lo es, pero desde la 1.14 algunos
				apuntan a un fallo: la evidencia de la página indica un fallo sin demostrarlo (su{" "}
				<code>lean</code>, ver el <a href="/results-reports/output-schema/#leans">esquema de
				salida</a>). Una compilación que se bloquea por ellos (<code>leanFailAs</code>{" "}
				en los generadores de informes <a href="/results-reports/junit-report/#options">JUnit</a> y{" "}
				<a href="/results-reports/sarif-report/#options">SARIF</a>) necesita una forma de aceptar
				los que una página ya tiene, igual que acepta sus fallos. Pídelos al crear el baseline:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { buildBaselineEntries } = require('@surea11y/core/baseline');",
					"",
					"const entries = buildBaselineEntries(result, { leanFail: true });",
				]}
			/>
			<p>
				Cada hallazgo que apunta a un fallo y bloquea con <code>leanFailAs</code> (
				<code>leaningFailures(result)</code> de <code>@surea11y/core</code>) recibe una entrada
				marcada con <code>"lean": "fail"</code>, después de los fallos:
			</p>
			<CodeBlock
				lang="json"
				lines={[
					'{ "ruleId": "heading-order", "reasonCode": "HEADING_ORDER_SKIPPED_LEVEL", "selector": "html > body > main > h3", "html": "<h3>Details</h3>", "lean": "fail" }',
				]}
			/>
			<p>
				Una entrada así solo coincide con un hallazgo que apunta a un fallo, con la misma
				identidad, y una entrada normal solo con un fallo. Con <code>leanFailAs</code>, JUnit no
				bloquea por un hallazgo con el que coincide (su mensaje <code>&lt;skipped&gt;</code> lo
				cuenta entre los probables fallos conocidos) y SARIF lo deja como <code>warning</code>. Sin{" "}
				<code>leanFailAs</code> las entradas no cambian nada, y <code>matchBaseline</code> las deja
				fuera de sus cuentas, obsoletas incluidas, salvo que reciba{" "}
				<code>{"{ leanFail: true }"}</code>, en cuyo caso las compara en <code>leanFail</code> (
				<code>{"{ total, knownCount, newCount, newOccurrences, staleCount }"}</code>).{" "}
				<code>--write-baseline</code> solo escribe fallos.
			</p>
			<p>
				Los <code>lean</code> llegan en versiones menores, así que una actualización puede traer
				probables fallos que el baseline no tiene: vuelve a crearlo con <code>leanFail: true</code>{" "}
				tras actualizar y revisa el diff. Cómo se eligen y se miden está en{" "}
				<a href={`${core}/docs/LEANS.md`}>
					<code>LEANS.md</code>
				</a>
				, en GitHub.
			</p>

			<h2 id="upgrading">Actualizar de versión</h2>
			<p>
				La identidad de un hallazgo incluye su código de motivo, y una versión menor puede darle uno
				nuevo: una regla que no daba ninguno (<code>DEFAULT</code>) ahora da uno, o un código se
				divide en dos según la causa (ver la{" "}
				<a href={`${core}/docs/API_STABILITY.md#finding-identity`}>identidad de un hallazgo</a> en{" "}
				<code>API_STABILITY.md</code>, en GitHub). El hallazgo es el mismo, y un baseline escrito
				antes de actualizar sigue coincidiendo con él: cada cambio figura en{" "}
				<code>src/baseline-moves.json</code> (regla, código antiguo, códigos nuevos), y una entrada
				con el código antiguo coincide con el hallazgo con uno nuevo cuando el resto de su
				identidad (la regla, el marcado y el frame) es el mismo. <code>matchBaseline</code> y la
				opción <code>baselineEntries</code> de los generadores de informes SARIF y JUnit lo leen.
				Una entrada se busca primero con el propio código del hallazgo, así que nunca va a un
				hallazgo movido cuando otro hallazgo tiene exactamente esa identidad.
			</p>
			<p>La 1.14 mueve estos, desde la 1.13:</p>
			<DataTable
				label="Códigos de motivo movidos en la 1.14"
				rowKey="id"
				columns={[
					{ key: "rules", label: "Regla", wrap: true, width: "45%" },
					{ key: "from", label: "Código antiguo", wrap: true },
					{ key: "to", label: "Código nuevo", wrap: true },
				]}
				rows={baselineMoves}
			/>
			<p>
				La tabla cubre una versión menor: un cambio figura desde la versión en que llegó hasta la
				siguiente versión menor, que lo quita. Así, un baseline escrito por la 1.13 sigue
				coincidiendo con la 1.14.x, y hay que regenerarlo antes de la 1.15.
			</p>
			<p>
				Regenerar el baseline con <code>--write-baseline</code> (o{" "}
				<code>buildBaselineEntries</code>) tras actualizar escribe cada hallazgo con su código
				actual y hace innecesaria la tabla. También acepta cualquier hallazgo nuevo que traiga la
				actualización, así que revisa su diff. Para poner al día los códigos sin aceptar nada nuevo,
				reescribe el archivo con <code>migrateBaselineEntries</code> de{" "}
				<code>@surea11y/core/baseline</code>:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { migrateBaselineEntries } = require('@surea11y/core/baseline');",
					"",
					"const file = JSON.parse(fs.readFileSync('baseline.json', 'utf8'));",
					"// With the scan's result, an entry for a split code takes the code its finding has now.",
					"file.entries = migrateBaselineEntries(file, result);",
					"fs.writeFileSync('baseline.json', JSON.stringify(file, null, 2) + '\\n');",
				]}
			/>
			<p>
				Devuelve una copia de las entradas con cada una movida a su código nuevo, y todas las demás
				como estaban. Sin un resultado, solo reescribe los cambios que puede deducir sin el
				hallazgo: un código que la regla ya no da y que pasó a uno solo nuevo (el{" "}
				<code>DEFAULT</code> de <code>img-alt-present</code>), no una división.
			</p>
			<p>
				Otra cosa es un hallazgo cuyo resultado cambió con la actualización: una regla que ahora
				hace fallar lo que antes preguntaba, o pregunta por lo que antes hacía fallar, da un
				hallazgo que el baseline no tenía, o deja de dar uno que tenía, y el{" "}
				<a href={`${core}/CHANGELOG.md`}>registro de cambios</a> explica por qué.
			</p>

			<h2 id="scanning-at-several-viewport-widths">Analizar con varios anchos de viewport</h2>
			<p>
				Una entrada del baseline no registra el viewport, y la comparación no lo usa: el mismo
				elemento con el mismo defecto coincide con cualquier ancho. Eso encaja con una página cuyos
				hallazgos no dependen de su diseño. Una regla que depende del diseño, como{" "}
				<a href="/rules/text-spacing-content-loss/">
					<code>text-spacing-content-loss</code>
				</a>{" "}
				o{" "}
				<a href="/rules/target-size-minimum/">
					<code>target-size-minimum</code>
				</a>
				, puede fallar con un ancho y no con otro, así que para una página analizada con varios
				anchos, mantén <strong>un baseline por ancho</strong>: <code>a11y-baseline-390.json</code>,{" "}
				<code>a11y-baseline-1280.json</code>.
			</p>
			<p>
				Un único baseline escrito a partir de todos los anchos sigue bloqueando correctamente, ya
				que un hallazgo solo es nuevo cuando ninguna entrada coincide con él. Pero entonces cada
				ejecución informa de los hallazgos de los demás anchos como obsoletos, así que el recuento
				de obsoletos deja de decirte qué se corrigió.
			</p>

			<h2 id="file-format">Formato del archivo</h2>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					'  "version": 1,',
					'  "generatedAt": "2026-07-30T12:00:00.000Z",',
					'  "entries": [',
					'    { "ruleId": "img-alt-present", "reasonCode": "TEXT_ALTERNATIVE_MISSING", "selector": "html > body > img", "html": "<img src=\\"logo.png\\">" }',
					"  ]",
					"}",
				]}
			/>
			<p>
				<code>--baseline &lt;path&gt;</code> rechaza un archivo que no sea{" "}
				<code>{"{ version: 1, entries: [...] }"}</code> con un error claro de salida 2 en lugar de
				adivinar un formato más antiguo o distinto. <code>matchBaseline</code>, y la opción{" "}
				<code>baselineEntries</code> de los generadores de informes SARIF y JUnit, aceptan el archivo tal como se
				guardó (<code>JSON.parse</code> del mismo) o su lista <code>entries</code>.
			</p>

			<h2>
				Combinación con <code>--json</code>
			</h2>
			<p>
				Cuando <code>--baseline</code> o <code>--write-baseline</code> se usa junto con{" "}
				<code>--json</code>, el objeto impreso gana una clave <code>baseline</code> junto al
				resultado normal del motor (esto es exclusivo de la salida de la CLI, no forma parte del
				contrato de resultado propio del motor descrito en el esquema de salida):
			</p>
			<ul>
				<li>
					<code>--write-baseline</code>:{" "}
					<code>{'{ mode: "write", path, entries: <number written> }'}</code>
				</li>
				<li>
					<code>--baseline</code>:{" "}
					<code>
						{'{ mode: "check", totalFail, knownCount, newCount, staleCount, newOccurrences: [...] }'}
					</code>
				</li>
			</ul>

			<h2>Alternativa: comparar dos análisis tú mismo</h2>
			<p>
				Si tus páginas no encajan en este modelo (contenido dinámico intenso dentro de los propios
				elementos marcados), la alternativa siempre disponible es comparar tú mismo dos salidas
				completas de <code>--json</code>. Consulta{" "}
				<a href={`${core}/docs/INTEGRATION.md#ci-gating-a-build-on-the-result`}>
					<code>INTEGRATION.md</code>
				</a>
				. Eso te da control total sobre la lógica de identidad y coincidencia, a costa de tener que
				escribirla tú mismo.
			</p>
		</>
	);
}
