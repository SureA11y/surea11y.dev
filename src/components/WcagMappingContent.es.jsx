import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const precedenceRows = [
	{
		id: "fail",
		condition: (
			<>
				Cualquier contribuyente en <code>fail</code>
			</>
		),
		outcome: <code>fail</code>,
	},
	{
		id: "canttell",
		condition: (
			<>
				Ningún <code>fail</code>, pero algún contribuyente en <code>cantTell</code> o un
				contribuyente listado que no se ejecutó en absoluto
			</>
		),
		outcome: <code>cantTell</code>,
	},
	{
		id: "na",
		condition: (
			<>
				Todos los contribuyentes en <code>notApplicable</code>
			</>
		),
		outcome: <code>notApplicable</code>,
	},
	{
		id: "pass",
		condition: (
			<>
				En cualquier otro caso (todos se ejecutaron, ninguno falló ni quedó en <code>cantTell</code>, no
				todos son N/A)
			</>
		),
		outcome: <code>pass</code>,
	},
];

export function WcagMappingContent() {
	return (
		<>
			<p>
				Cómo se relacionan los resultados de reglas individuales con un Criterio de Éxito (SC) de
				WCAG, y qué puede y no puede decirte surea11y sobre la conformidad general.
			</p>

			<h2>Las tres capas</h2>
			<ol>
				<li>
					<strong>Reglas atómicas</strong> (<code>checksResults[]</code>): una decisión normativa
					cada una, por ejemplo "¿tiene este <code>&lt;img&gt;</code> un atributo{" "}
					<code>alt</code>?". Ver <a href="/rules/">el catálogo de reglas</a> para las 132.
				</li>
				<li>
					<strong>Facetas</strong>: un SC de WCAG suele ser más grande de lo que una sola regla
					puede decidir de forma determinista. Internamente, cada SC se divide en "facetas"
					nombradas (por ejemplo, 1.1.1 <span lang="en">Non-text Content</span> tiene facetas como{" "}
					<code>img-alt-attr-present</code>, <code>text-alternative-quality</code>,{" "}
					<code>decorative-null</code>) registradas en <code>src/coverage/wcag-facets.js</code>,
					cada una marcada como <code>full</code> (una regla la decide con alta confianza),{" "}
					<code>partial</code> (una regla decide <em>parte</em> de ella; ver las notas de alcance
					de cada regla) o <code>manual</code> (no existe ninguna heurística automatizada segura).
					Ejecuta <code>npm run coverage</code> para regenerar{" "}
					<code>coverage/coverage-report.md</code>, el desglose de facetas por SC.
				</li>
				<li>
					<strong>Reglas compuestas (resultado agregado por SC de WCAG)</strong> (<code>rulesResults[]</code>):
					un agregado generado de cada regla atómica asociada a un SC, que da un único veredicto{" "}
					<code>pass</code>/<code>fail</code>/<code>cantTell</code>/<code>notApplicable</code> por SC en
					lugar de tener que combinar tú mismo docenas de resultados atómicos. Ver{" "}
					<a href={`${core}/docs/RULE_CATALOG.md#composite-wcag-sc-rollup-rules-34`}>
						la lista completa
					</a>{" "}
					(por ejemplo, <code>wcag-1.1.1-non-text-content</code> agrupa 21 reglas atómicas).
				</li>
			</ol>

			<h2>Cómo se calcula el resultado de un compuesto</h2>
			<p>Precedencia determinista, evaluada sobre los contribuyentes atómicos de ese compuesto:</p>
			<DataTable
				caption="Precedencia del resultado compuesto"
				rowKey="id"
				columns={[
					{ key: "condition", label: "Condición", wrap: true, width: "75%" },
					{ key: "outcome", label: "Resultado compuesto", width: "25%" },
				]}
				rows={precedenceRows}
			/>
			<p>
				Esto significa: <strong>un compuesto en <code>pass</code> es un "todas las comprobaciones
				automatizadas aplicables a este SC salieron limpias" real y determinista, pero no es, por
				sí solo, una declaración de conformidad WCAG.</strong> Si alguna faceta de ese SC no tiene
				ninguna cobertura automatizada (ver <code>coverage-report.md</code>), un compuesto en{" "}
				<code>pass</code> guarda silencio sobre esa faceta, no está afirmando que esté bien. Verifica
				la tabla de facetas antes de tratar un compuesto en <code>pass</code> como "SC totalmente
				verificado".
			</p>
			<p>
				El array <code>data.details.contributors</code> de un compuesto (ver{" "}
				<a href="/results-reports/output-schema/">el esquema de salida</a>) enumera cada regla
				atómica y su resultado individual: úsalo para ver exactamente qué faceta o facetas
				provocaron un <code>fail</code>/<code>cantTell</code>, en lugar de tratar el compuesto como
				una caja negra.
			</p>

			<h2>Apuntar a un nivel de conformidad (A / AA / AAA)</h2>
			<p>
				Pasa <code>runOnly.tags</code> (o <code>engineOptions.tags.include</code>) con las etiquetas
				de nivel que quieras:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.0 A y AA. Ambas etiquetas son necesarias: no son acumulativas.",
					"runDomRulesInPage(url, null, {}, { tags: ['wcag2a', 'wcag2aa'] });",
				]}
			/>
			<p>
				<strong>
					Las etiquetas de nivel no se anidan, y esto es lo más fácil de entender mal aquí.
				</strong>{" "}
				Una regla lleva una etiqueta de nivel por cada Criterio de Éxito al que se asocia, y nada
				más: una regla asociada solo a un criterio AA lleva la etiqueta <code>wcag2aa</code> y{" "}
				<em>no</em> <code>wcag2a</code>. Pedir <code>{"{ tags: ['wcag2aa'] }"}</code> por sí solo,
				por tanto, ejecuta las 10 reglas asociadas a un criterio AA de la versión 2.0, no las
				aproximadamente 100 que forman un objetivo A + AA. Enumera cada nivel que quieras.
			</p>
			<p>
				Lo mismo aplica entre versiones de WCAG (un criterio introducido en 2.1 o 2.2 lleva solo su
				propia etiqueta de origen), así que un objetivo de conformidad completo es una unión de
				conjuntos de etiquetas. Ver{" "}
				<a href="/configuration/engine-options/#filtering-by-wcag-version">
					la guía de opciones del motor
				</a>{" "}
				para los conjuntos ya preparados por versión, incluido el único criterio que WCAG 2.2
				eliminó en lugar de añadir.
			</p>
			<p>
				<strong>El criterio eliminado se maneja automáticamente.</strong> Cada ejecución resuelve
				una versión de WCAG objetivo (<code>engineOptions.wcagVersion</code>, si no, lo que
				impliquen tus etiquetas de versión, si no, <code>2.2</code>) y la devuelve como{" "}
				<code>engine.wcagVersion</code>. Bajo un objetivo 2.2, una regla asociada solo al SC 4.1.1
				<span lang="en">Parsing</span> no puede devolver <code>fail</code>: se ejecuta, informa de sus ocurrencias, y vuelve
				como <code>cantTell</code> con un campo <code>wcagVersionScope</code> que explica la
				coerción. Así, un análisis por defecto nunca bloquea por un criterio que WCAG 2.2 no
				contiene, y un análisis 2.0/2.1 sigue obteniendo un veredicto real para el 4.1.1.
			</p>
			<p>
				Los compuestos, a diferencia de las reglas atómicas, <em>sí</em> se filtran de forma
				acumulativa. El ejecutor lee el nivel más alto nombrado en <code>tags</code> y descarta
				todo compuesto por encima de él, así que pedir{" "}
				<code>{"['wcag2a', 'wcag2aa']"}</code> no devuelve ninguna entrada en{" "}
				<code>rulesResults</code> para un SC exclusivo de AAA. Eso es{" "}
				<code>inferTargetLevelFromRunOnly</code>/<code>isAllowedByTargetLevel</code> en{" "}
				<code>src/core/dom-runner.js</code> si necesitas la precedencia exacta.
			</p>
			<p>
				Omite <code>tags</code> por completo (el valor por defecto) y se ejecuta cada regla en cada
				nivel, sin ninguna supresión de compuestos.
			</p>

			<h2>Lo que este motor no puede decirte</h2>
			<p>
				<strong>
					Ninguna herramienta automatizada, esta incluida, puede certificar la conformidad WCAG
					completa.
				</strong>{" "}
				Esa no es una limitación específica de surea11y; es inherente a WCAG en sí; una fracción
				importante de los Criterios de Éxito requiere criterio humano (¿es este texto alternativo{" "}
				<em>exacto</em>, y no solo <em>presente</em>?; ¿es este mensaje de error{" "}
				<em>comprensible</em>?) o pruebas dinámicas que la arquitectura de análisis estático del DOM
				de este motor no puede realizar en absoluto (detección de trampas de teclado, disposición y
				reflujo real con zoom). Ver{" "}
				<a href="/help/known-limitations/">las limitaciones conocidas</a> para la lista completa y
				explícita de qué queda fuera de alcance y por qué.
			</p>
			<p>Lo que surea11y <em>sí</em> puede darte, con honestidad:</p>
			<ul>
				<li>
					Cada <code>fail</code> es una violación normativa real, determinista, bajo la versión que
					elegiste como objetivo, nunca una suposición.
				</li>
				<li>
					Cada <code>cantTell</code> es una señal explícita para revisión humana, no una
					incertidumbre silenciada.
				</li>
				<li>
					La tabla de cobertura de facetas te dice exactamente qué partes de qué SC no tienen
					ninguna cobertura automatizada, para que sepas dónde un <code>pass</code> guarda silencio
					en lugar de ser exhaustivo.
				</li>
			</ul>
			<p>
				Un compuesto en <code>pass</code> en cada SC de tu nivel objetivo significa:{" "}
				<em>cada comprobación automatizable para ese nivel salió limpia.</em> Es el subconjunto
				automatizable de la conformidad, declarado con precisión, no un sustituto de la revisión
				manual que la propia WCAG exige.
			</p>
		</>
	);
}
