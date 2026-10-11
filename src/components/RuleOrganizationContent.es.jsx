import React from "react";
import rules from "../data/rules.generated.json";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { ResultBadge } from "./design-system/results/ResultBadge.jsx";

const familyRows = [
	{ id: "present", ruleId: <code>img-alt-present</code>, family: <code>img</code>, intent: <code>present</code>, type: "automática" },
	{ id: "quality", ruleId: <code>img-alt-quality</code>, family: <code>img</code>, intent: <code>quality</code>, type: "manual" },
	{ id: "decorative", ruleId: <code>img-alt-decorative</code>, family: <code>img</code>, intent: <code>decorative</code>, type: "manual" },
];

export function RuleOrganizationContent() {
	return (
		<>
			<p>
				Esto describe cómo están estructuradas las {rules.length} reglas del <a href="/rules/">catálogo</a>, útil
				para interpretar un resultado o para encontrar la regla que buscas. Refleja lo que ya existe en
				el conjunto de reglas, no un diseño abstracto.
			</p>

			<h2>Automáticas frente a manuales</h2>
			<p>
				Cada regla tiene uno de dos valores en la propiedad <code>type</code>, y la diferencia está en
				lo que la regla es <em>capaz de decidir</em>, no en qué resultado informa:
			</p>
			<ul>
				<li>
					<strong>automática</strong>: decide de forma determinista, sin heurísticas y sin adivinar.
					Puede informar <code>fail</code>. <code>cantTell</code> igual aparece aquí, en estas
					situaciones: existe una violación real pero por sí sola no establece que el criterio de
					WCAG asignado falle (un requisito de autoría de ARIA cuyo nombre/rol/valor expuesto sigue
					siendo válido); la regla decide de forma determinista pero no reclama ningún Criterio de
					Éxito en absoluto (<code>aria-allowed-role</code>, etiquetada como buena práctica); o la
					regla solo puede confirmar que un mecanismo está <em>presente</em>, mientras que si lo que
					está presente es realmente válido le corresponde a una regla hermana (
					<code>aria-required-children</code>, emparejada con <code>aria-prohibited-children</code>);
					o la regla no puede decidir sin adivinar, así que pregunta en lugar de fallar: un nombre que
					puede venir de una raíz shadow cerrada o de contenido anidado a demasiada profundidad para
					leerlo (las reglas <code>*-name-present</code>), texto que puede recortarse o solaparse al
					aumentar el espaciado (<code>text-spacing-content-loss</code>), un bloque de consulta de
					medios de orientación que gira un elemento distinto del contenido de la página (
					<code>css-orientation-lock</code>), un texto provisional por debajo de su relación de
					contraste (<code>contrast-minimum</code>), o un color o tamaño que no se puede calcular (las
					reglas de contraste, <code>target-size-minimum</code>). Una regla que lanza una excepción
					también se informa como <code>cantTell</code>, como red de seguridad.
				</li>
				<li>
					<strong>manual</strong>: indica que una persona tiene que decidir; la regla no puede
					decidir si lo que encontró es un problema. Informa <code>cantTell</code> o{" "}
					<code>notApplicable</code>, y <code>pass</code> solo cuando lo que encuentra es la
					respuesta que no requiere juicio; nunca <code>fail</code>.{" "}
					<a href="/rules/landmark-unique/"><code>landmark-unique</code></a> no puede decidir si
					dos regiones de referencia que comparten nombre son un problema (la APG lo permite cuando
					su contenido es idéntico), así que eso es <code>cantTell</code>; pero «todos los nombres son
					distintos» es un hecho, así que eso es <code>pass</code>. Una regla que pide a una persona
					juzgar cada elemento que encuentra, como si el texto alternativo de una imagen es
					preciso, nunca informa <code>pass</code>.
				</li>
			</ul>
			<p>
				<strong>Que una regla manual informe <code>cantTell</code> no es el mismo evento que una regla
				automática informe <code>cantTell</code>, aunque el valor sea idéntico</strong>: la regla
				automática ya decidió y te está diciendo lo que encontró; la regla manual te está diciendo que
				la cuestión no es decidible a partir del marcado en absoluto. Consulta{" "}
				<a href="/results-reports/output-schema/">Resultados e informes</a> para ver la referencia
				completa de resultado/gravedad/confianza.
			</p>

			<h2>Cómo están estructurados los ID de regla</h2>
			<p>
				Un ID de regla generalmente es <code>&lt;family&gt;-&lt;intent&gt;</code>: qué elementos/mecanismo
				apunta la regla, y luego qué pregunta hace sobre ellos. La familia de alternativas de imagen
				(WCAG 1.1.1) es el ejemplo más claro:
			</p>
			<DataTable
				label="Ejemplos de ID de regla"
				rowKey="id"
				columns={[
					{ key: "ruleId", label: "ID de regla", mono: true },
					{ key: "family", label: "Familia", mono: true },
					{ key: "intent", label: "Intención", mono: true },
					{ key: "type", label: "Tipo" },
				]}
				rows={familyRows}
			/>
			<ul>
				<li><code>present</code>: verifica que exista un mecanismo requerido. Normalmente automática.</li>
				<li><code>quality</code>: verifica idoneidad, corrección o significado. Siempre manual.</li>
				<li><code>decorative</code>: verifica el tratamiento correcto de contenido puramente decorativo. Siempre manual.</li>
			</ul>
			<p>
				La intención determina si una regla <em>puede</em> ser automática: "¿algo está presente?" suele
				ser decidible solo a partir del marcado, mientras que "¿es bueno?" casi nunca lo es. Esta es
				también la lógica detrás de los enlaces de <strong>Reglas relacionadas</strong> en cada página
				de regla: las reglas que comparten una familia (todo lo anterior al último segmento{" "}
				<code>-</code> del ID) son las que se agrupan ahí. El conjunto de reglas abarca docenas de
				familias además de <code>img</code>: <code>aria-*</code>,{" "}
				<code>contrast-*</code>, <code>dialog-*</code>, <code>iframe-*</code>, <code>label-*</code>,{" "}
				<code>link-*</code>, <code>list-*</code>, <code>landmark-*</code>, y más; el{" "}
				<a href="/rules/">catálogo</a> es la lista actual y generada.
			</p>
			<p>
				Las reglas nunca mezclan familias: cada una consulta un tipo de elemento, usando las funciones
				auxiliares apropiadas para él. Por eso también el conjunto de reglas tiene {rules.length} reglas específicas en lugar
				de una docena de reglas amplias: dos comprobaciones que difieren en lo que deciden, a qué
				apuntan o qué faceta de WCAG cubren se mantienen como reglas separadas en lugar de fusionarse,
				de modo que un resultado nunca tiene que desambiguarse posteriormente para decir qué se
				encontró exactamente.
			</p>

			<h2>Facetas de WCAG</h2>
			<p>
				Un Criterio de Éxito de WCAG suele ser más grande de lo que una sola regla puede decidir de
				forma determinista. Internamente, cada SC se descompone en "facetas" con nombre: para 1.1.1
				Contenido no textual, eso incluye cosas como si un atributo <code>alt</code> está presente, si
				su texto es significativo, y si las imágenes decorativas están correctamente marcadas como
				nulas. Una regla se asigna a una o más facetas, y varias reglas comúnmente cubren distintas
				facetas del mismo SC, que es exactamente lo que hace arriba la familia img-alt para 1.1.1.
			</p>
			<p>
				Esto importa al leer un resultado compuesto (resultado agregado por WCAG-SC): un resultado
				agregado con estado{" "}
				<ResultBadge lang="en" state="pass" size="sm" /> significa que ninguna comprobación automatizada de ese
				criterio detectó fallos, pero <strong>si una faceta no tiene ninguna cobertura automatizada, el
				compuesto guarda silencio sobre esa faceta en lugar de afirmar que está bien</strong>. Consulta{" "}
				<a href="/conformance/wcag-mapping/">Conformidad</a> para ver las tres capas (reglas atómicas,
				facetas, compuestos) y cómo se calcula realmente el resultado de un compuesto.
			</p>
		</>
	);
}
