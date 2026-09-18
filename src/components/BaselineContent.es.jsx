import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

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
				cuando una regla no establece uno), y <code>html</code> es el fragmento de outer-HTML de la
				ocurrencia. Esto se basa en el contenido y no en la posición: sobrevive a que el elemento
				marcado se mueva por la página (un reordenamiento, un elemento hermano no relacionado
				añadido o eliminado) siempre que el propio marcado del elemento marcado no cambie. El{" "}
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
				Las entradas de baseline que no coinciden con nada en un análisis nuevo se indican como{" "}
				<strong>obsoletas</strong> (la violación presumiblemente se corrigió); esto es solo
				informativo y nunca bloquea la compilación; regenera el baseline con <code>--write-baseline</code>{" "}
				periódicamente para limpiarlas.
			</p>

			<h2>Formato del archivo</h2>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					'  "version": 1,',
					'  "generatedAt": "2026-07-30T12:00:00.000Z",',
					'  "entries": [',
					'    { "ruleId": "img-alt-present", "reasonCode": "DEFAULT", "selector": "html > body > img", "html": "<img src=\\"logo.png\\">" }',
					"  ]",
					"}",
				]}
			/>
			<p>
				<code>--baseline &lt;path&gt;</code> rechaza un archivo que no sea{" "}
				<code>{"{ version: 1, entries: [...] }"}</code> con un error claro de salida 2 en lugar de
				adivinar un formato más antiguo o distinto.
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
