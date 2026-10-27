import React from "react";
import engine from "../data/engine.generated.json";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { Callout } from "./design-system/feedback/Callout.jsx";

const core = "https://github.com/SureA11y/core/blob/main";
const pack = "/configuration/packs/#en-301-549-pack";

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
				Todos los contribuyentes en <code>notApplicable</code>, para un criterio cuyas reglas
				encuentran todos los casos a los que se aplica
			</>
		),
		outcome: <code>notApplicable</code>,
	},
	{
		id: "na-partial",
		condition: (
			<>
				Todos los contribuyentes en <code>notApplicable</code>, para cualquier otro criterio
			</>
		),
		outcome: (
			<>
				<code>cantTell</code> (<code>composite.rollup.cantTell.partialCoverage</code>)
			</>
		),
	},
	{
		id: "pass",
		condition: (
			<>
				En cualquier otro caso (todos se ejecutaron, ninguno falló ni quedó en <code>cantTell</code>, no
				todos son N/A), para un criterio cuyas reglas comprueban todo lo que pide
			</>
		),
		outcome: <code>pass</code>,
	},
	{
		id: "pass-partial",
		condition: "En cualquier otro caso, para cualquier otro criterio",
		outcome: (
			<>
				<code>cantTell</code> (<code>composite.rollup.cantTell.partialCheck</code>)
			</>
		),
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
					<code>alt</code>?". Ver <a href="/rules/">el catálogo de reglas</a> para todas.
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
					<a href={`${core}/docs/RULE_CATALOG.md#composite-wcag-sc-rollup-rules-${engine.composites}`}>
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
			<h3 id="when-a-criterion-passes">Cuándo un criterio se cumple y cuándo no es aplicable</h3>
			<p>
				Desde la 1.14, un criterio se cumple solo cuando sus reglas comprueban todo lo que pide,
				igual que WCAG lo da por satisfecho solo cuando lo está entero. Que todas las reglas se
				cumplan solo dice que se cumplen las partes que comprueban:{" "}
				<a href="/rules/html-lang-attr-present/"><code>html-lang-attr-present</code></a> comprueba
				que <code>{'<html lang="fr">'}</code> nombra un idioma, no que la página esté en francés
				(3.1.1), y <a href="/rules/page-title-present/"><code>page-title-present</code></a>, que
				la página tiene título, no que el título la describa (2.4.2). Un criterio así queda en{" "}
				<code>cantTell</code>, con el código de motivo{" "}
				<code>composite.rollup.cantTell.partialCheck</code>, y el{" "}
				<a href="/results-reports/html-report/">informe HTML</a> dice que se comprobó en parte
				(«Comprobado en parte»): el resto lo comprueba una persona. Los criterios cuyas reglas los
				comprueban enteros se enumeran en <code>src/coverage/complete-applicability.js</code>{" "}
				(<code>COMPLETE_CHECK</code>), cada uno con su motivo, y todavía no hay ninguno: cada uno
				pide algo que las reglas no ven, ya sea si un texto alternativo, una etiqueta, un
				encabezado o el texto de un enlace dicen lo correcto, o cómo lo cumple el contenido que un
				script dibuja o cambia. <strong>Así que en la 1.14 no se cumple ningún compuesto de
				WCAG.</strong>
			</p>
			<p>
				Del mismo modo, un criterio es <code>notApplicable</code> solo cuando sus reglas encuentran
				todos los casos a los que se aplica: los enlaces para 2.4.4 y 2.4.9, los elementos
				enfocables para 2.4.3 y 2.4.7, los componentes con etiqueta para 2.5.3, el marcado para
				4.1.1. Los campos de formulario (1.3.5, 3.3.2) y los objetivos de puntero (2.5.8) no están
				en esa lista: un campo hecho con un rol ARIA, un campo sin <code>autocomplete</code> o un
				elemento que solo es un objetivo mediante un script pueden estar en una página donde esas
				reglas no encontraron nada. Para cualquier otro criterio, que ninguna regla encuentre nada
				solo dice que faltan los casos que buscan: un script que redirige tras un retardo es un
				límite de tiempo (2.2.1) sin <code>{'<meta http-equiv="refresh">'}</code>, y un pasaje en
				otro idioma (3.1.2) no tiene por qué llevar <code>lang</code>. En términos de WCAG-EM,
				«no presente» exige haber mirado todos los lugares donde podría estar el contenido, así
				que un criterio así queda en <code>cantTell</code>, con el código de motivo{" "}
				<code>composite.rollup.cantTell.partialCoverage</code>.
			</p>
			<p>
				Esto significa: <strong>un compuesto en <code>fail</code> es una violación real y
				determinista, y un compuesto en <code>cantTell</code> cuyos contribuyentes se cumplieron
				todos (<code>partialCheck</code>) dice que todas las comprobaciones automatizadas de ese
				criterio salieron limpias y que lo que queda lo comprueba una persona.</strong> No es, por
				sí solo, una declaración de conformidad. La tabla de facetas (
				<code>coverage-report.md</code>) muestra qué partes de cada criterio tienen cobertura
				automatizada y cuáles comprueba una persona. Muéstralos como «comprobaciones superadas,
				requiere revisión» y «nada que comprobar encontrado», nunca como cumplidos.
			</p>
			<p>
				El array <code>data.details.contributors</code> de un compuesto (ver{" "}
				<a href="/results-reports/output-schema/">el esquema de salida</a>) enumera cada regla
				atómica y su resultado individual: úsalo para ver exactamente qué faceta o facetas
				provocaron un <code>fail</code>/<code>cantTell</code>, en lugar de tratar el compuesto como
				una caja negra.
			</p>
			<p>
				Una regla personalizada (<code>engineOptions.customRules</code>) o una regla de un{" "}
				<a href="/configuration/packs/">pack</a> que se ejecutó cuenta para el compuesto de cada
				criterio al que se asocia, mediante <code>meta.wcagSc</code> o una entrada de WCAG en{" "}
				<code>meta.normativeMappings</code>, igual que una regla incorporada: si falla, el compuesto
				falla. El compuesto marca una regla personalizada con <code>custom: true</code> entre sus
				contribuyentes y la enumera en <code>data.details.customChecksIds</code>, ya que las reglas
				personalizadas no se comprueban contra las especificaciones como las incorporadas. Una
				sustitución de una regla incorporada cuenta donde dice su propia asociación: en el lugar de
				la incorporada cuando se asocia a ese criterio, y en ninguna parte cuando no se asocia a
				ninguno (con un aviso).
			</p>
			<p>
				Un análisis que nombra reglas en lugar de criterios (por ID, como{" "}
				<code>{"includeRuleIds: ['link-name-present']"}</code>, por una etiqueta que no es de WCAG,
				por <code>optInRules</code> o como las buenas prácticas) también obtiene los compuestos de
				los criterios que esas reglas comprueban; una etiqueta de criterio como{" "}
				<code>wcag244</code> informa solo de ese criterio (consulta{" "}
				<a href="/configuration/engine-options/#which-criteria-a-scan-reports">Opciones del motor</a>). Antes de 1.12, un
				análisis así no informaba de ninguno. La tabla anterior los decide: una regla que falla
				hace fallar el criterio, y las reglas que el análisis no seleccionó son contribuyentes que
				no se ejecutaron, así que el criterio es como mucho <code>cantTell</code>, comprobado en
				parte (<code>reasonCode</code>{" "}
				<code>composite.rollup.cantTell.notSelectedChild</code>, con cada uno de esos
				contribuyentes marcado <code>notSelected: true</code>; «Comprobado en parte» en el{" "}
				<a href="/results-reports/html-report/">informe HTML</a>).
			</p>

			<h2>Apuntar a un nivel de conformidad (A / AA / AAA)</h2>
			<p>Nombra la versión y el nivel de WCAG en <code>runOnly.wcag</code>:</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.2 Level A and AA:",
					"runDomRulesInPage(url, null, {}, { wcag: { version: '2.2', level: 'AA' } });",
					"",
					"// The same, and the best-practice rules, which test no WCAG criterion:",
					"runDomRulesInPage(url, null, {}, { wcag: { version: '2.2', level: 'AA' }, bestPractices: true });",
				]}
			/>
			<p>
				Un objetivo ejecuta las reglas de cada criterio vigente en esa versión en ese nivel y en los
				inferiores, según el nivel que tiene cada criterio en esa versión (<code>WCAG_CRITERIA</code>{" "}
				en <code>@surea11y/core/wcag</code>), así que el 4.1.1 <span lang="en">Parsing</span> forma
				parte de los objetivos 2.0 y 2.1 y no de los 2.2. También establece la versión de WCAG de la
				ejecución y el nivel de los resultados agregados que se informan. Ver{" "}
				<a href="/configuration/engine-options/#selecting-by-wcag-target-runonlywcag">
					Seleccionar por objetivo de WCAG
				</a>
				.
			</p>
			<p>
				Cada entrada de <code>WCAG_CRITERIA</code> tiene también el <code>id</code> que el W3C da al
				criterio en WCAG 2.2 (<code>non-text-content</code>). Cada asociación de WCAG que lleva una
				regla enlaza la sección de su criterio en la Recomendación de esa versión (<code>url</code>)
				y su documento <span lang="en">Understanding</span> (<code>understandingUrl</code>), para 2.1
				y 2.2: los generadores de informes usan el documento <span lang="en">Understanding</span>{" "}
				como enlace de ayuda de una regla cuando la regla no tiene uno propio.
			</p>

			<h3 id="with-tags">Con etiquetas</h3>
			<p>
				Los mismos objetivos se pueden expresar con etiquetas de nivel, en <code>runOnly.tags</code>{" "}
				(o <code>engineOptions.tags.include</code>):
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// WCAG 2.0 A and AA. Both tags are required: they are not cumulative.",
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
				por tanto, ejecuta las 11 reglas asociadas a un criterio AA de la versión 2.0, no las
				105 que forman un objetivo A + AA de la 2.0. Enumera cada nivel que quieras, o usa{" "}
				<code>runOnly.wcag</code>, que no tiene ese problema. <code>engineOptions.profile</code> (
				<code>wcag22-aa</code>, <code>en301549-v4.1.1</code>, <code>en301549-v3.2.1</code>,{" "}
				<code>section508</code>) también lo hace por ti; ver{" "}
				<a href="/configuration/engine-options/#conformance-profiles">Perfiles de conformidad</a>.
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
				una versión de WCAG objetivo (<code>engineOptions.wcagVersion</code>, si no, el{" "}
				<code>wcagVersion</code> del perfil del <a href="/configuration/packs/">pack</a> que
				aplica la ejecución, si no, la versión de <code>runOnly.wcag</code>, si no, lo que impliquen tus etiquetas de versión, si no, <code>2.2</code>) y la devuelve como{" "}
				<code>engine.wcagVersion</code>. Bajo un objetivo 2.2, una regla asociada solo al SC 4.1.1
				<span lang="en">Parsing</span> no puede devolver <code>fail</code>: se ejecuta, informa de sus ocurrencias, y vuelve
				como <code>cantTell</code> con un campo <code>wcagVersionScope</code> que explica la
				coerción. Desde la 1.14, bajo un objetivo 2.0 o 2.1 hace lo mismo, con{" "}
				<code>wcagVersionScope.by: "errata"</code>: las erratas de 2023 del W3C a esas versiones
				dan el 4.1.1 por satisfecho siempre para contenido en HTML o XML. Así, ningún análisis de
				WCAG bloquea por el 4.1.1; solo un perfil cuyo estándar conserva su texto, uno que declara{" "}
				<code>keepsParsing: true</code> como hace <code>en301549-v3.2.1</code>, sigue haciéndolo
				fallar.
			</p>
			<p>
				Los compuestos, a diferencia de las reglas atómicas, <em>sí</em> se filtran de forma
				acumulativa. El ejecutor lee <code>engineOptions.wcagLevel</code>, si no, el nivel de{" "}
				<code>runOnly.wcag</code>, o el nivel más alto nombrado en <code>tags</code>, y descarta
				todo compuesto por encima de él, así que pedir{" "}
				<code>{"['wcag2a', 'wcag2aa']"}</code> no devuelve ninguna entrada en{" "}
				<code>rulesResults</code> para un SC exclusivo de AAA. <code>wcagLevel</code> (
				<code>'A'</code>, <code>'AA'</code> o <code>'AAA'</code>) es la opción para un análisis
				que nombra comprobaciones en lugar de un objetivo: todas las reglas seleccionadas se
				siguen ejecutando, y solo los criterios que informa se limitan a ese nivel, así que un
				análisis de <code>contrast-computable</code> con <code>'AA'</code> informa del 1.4.3 y no
				del 1.4.6 de nivel AAA. La ejecución lo registra como <code>engine.wcagLevel</code>. Eso
				es <code>targetWcagLevelOf</code>/<code>isAllowedByTargetLevel</code> en{" "}
				<code>src/core/dom-runner.js</code> si necesitas la precedencia exacta.
			</p>
			<p>
				Omite <code>tags</code> por completo (el valor por defecto) y se ejecuta cada regla en cada
				nivel, sin ninguna supresión de compuestos.
			</p>

			<h2 id="en-301-549">EN 301 549</h2>
			<Callout tone="note" title="Obsoleto">
				<p>
					EN 301 549 pasa a su propio pack, <a href={pack}><code>@surea11y/pack-en301549</code></a>, y sale de core en la 2.0.0, con sus
					perfiles, su clave de <code>mappings</code> y <code>@surea11y/core/en301549</code>. Todo
					funciona como antes, con un <code>console.warn</code> por proceso. Para cambiar, se pasa el
					pack en <code>engineOptions.packs</code>: el análisis toma del pack los mismos nombres, y{" "}
					<code>@surea11y/pack-en301549/public</code> tiene las exportaciones de la tabla. Ver{" "}
					<a href={`${core}/docs/API_STABILITY.md#deprecating-a-standard-a-profile-or-an-entry-point`}>cómo core declara obsoleto un estándar</a>.
				</p>
			</Callout>
			<p>
				El capítulo 9 de EN 301 549 reformula los criterios de éxito de nivel A y AA de WCAG como
				cláusulas numeradas <code>9.</code> más el número del propio criterio: WCAG 1.4.3 es la
				cláusula 9.1.4.3. Cuando un análisis las pide, cada resultado atómico y compuesto lleva, tras
				sus entradas de WCAG en <code>meta.normativeMappings</code>, la cláusula de cada uno de sus
				criterios, una vez por cada versión del estándar que incluye ese criterio. Un análisis las
				pide con <code>engineOptions.mappings: ['en301549']</code> (ambas versiones) o{" "}
				<code>['en301549:V3.2.1']</code> (una), o apuntando a un perfil de EN 301 549, que añade la
				versión que nombra; por defecto los resultados solo nombran WCAG (ver{" "}
				<a href="/configuration/engine-options/#other-standards-mappings">Otros estándares</a>).
			</p>
			<DataTable
				label="Versiones de EN 301 549"
				rowKey="version"
				columns={[
					{ key: "version", label: "Versión", width: "20%" },
					{ key: "builtOn", label: "Basada en", wrap: true },
					{ key: "differs", label: "Se diferencia de la otra en", wrap: true },
				]}
				rows={[
					{ version: "V3.2.1 (2021-03)", builtOn: "WCAG 2.1 A y AA, 50 criterios", differs: "Incluye 9.4.1.1 Procesamiento" },
					{ version: "V4.1.1 (2026-09)", builtOn: "WCAG 2.2 A y AA, 55 criterios", differs: "Añade 2.4.11, 2.5.7, 2.5.8, 3.2.6, 3.3.7, 3.3.8; 9.4.1.1 queda sin efecto" },
				]}
			/>
			<p>
				Cada entrada de cláusula nombra también el criterio que reformula, como{" "}
				<code>{'wcagSc: ["1.4.3"]'}</code>, para que una vista agrupada por criterio (las suites de{" "}
				<a href="/results-reports/junit-report/">JUnit</a>, el resultado agregado del{" "}
				<a href="/results-reports/html-report/">informe HTML</a>) la sitúe bajo el correcto incluso
				en una regla asociada a varios. Los criterios AAA no tienen cláusula en ninguna versión. Los
				catálogos nombran las cláusulas con las mismas opciones:{" "}
				<code>{"getChecksCatalog({ mappings: ['en301549'] })"}</code> en el{" "}
				<code>normativeMappings</code> de cada entrada, y las entradas compuestas que devuelve{" "}
				<code>{"getRulesCatalog({ mappings: ['en301549'] })"}</code> como{" "}
				<code>meta.standardMappings</code>, así que las cláusulas de un criterio se pueden leer sin
				ejecutar un análisis.
			</p>
			<p>
				La tabla es pública como <code>@surea11y/core/en301549</code>, para herramientas que
				necesitan la vista inversa, como qué criterios exige una versión que un análisis no cubrió:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { EN301549_CLAUSES, en301549ClausesForSc } = require('@surea11y/core/en301549');",
					"",
					"Object.keys(EN301549_CLAUSES['V3.2.1']);  // the 50 WCAG 2.1 A and AA criteria V3.2.1 restates",
					"en301549ClausesForSc('2.5.8');            // [{ version: 'V4.1.1', clause: '9.2.5.8', title: 'Target size (minimum)' }]",
				]}
			/>
			<p>
				<strong>Es una correspondencia entre dos documentos publicados, no una declaración de
				conformidad</strong>: una cláusula en un resultado dice qué requisito de EN 301 549 es ese
				criterio de WCAG, nada más. Qué versión exige una ley concreta queda fuera del motor.
			</p>
			<p>
				EN 301 549 es una entrada de un registro de estándares que leen el ejecutor, el catálogo de
				reglas y los generadores de informes. Un estándar con veredictos propios (requisitos que
				comprueban sus propias reglas, un estándar nacional como RGAA, por ejemplo), o la lista de
				comprobación de una organización, llega como un <a href="/configuration/packs/">pack</a>: un
				paquete independiente fuera de core, que un análisis recibe en{" "}
				<code>engineOptions.packs</code> y cuya entrada se une al registro para ese análisis, con sus
				propios perfiles, reglas y resultados agregados. Una regla personalizada puede nombrar
				cualquier estándar en su propio <code>normativeMappings</code>, pero solo los estándares
				registrados (los de core y los de los packs del análisis) reciben un perfil, un
				interruptor de <code>mappings</code>, reglas opcionales, resultados agregados o un lugar en
				SARIF, JUnit y el informe HTML. Cómo se integra un estándar en el propio core está en{" "}
				<a href={`${core}/docs/WCAG_CONFORMANCE.md#adding-another-standard`}>
					<code>WCAG_CONFORMANCE.md</code>
				</a>
				, la guía para contribuidores en GitHub.
			</p>

			<h2 id="what-this-engine-cannot-tell-you">Lo que este motor no puede decirte</h2>
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
					Las reglas integradas de core están escritas para devolver <code>fail</code> solo ante una
					violación normativa y determinista del estándar y la versión que elegiste como objetivo, y
					para informar <code>cantTell</code> cuando no pueden estar seguras. Es un objetivo de
					diseño, no una garantía: las{" "}
					<a href="/help/known-limitations/">limitaciones conocidas</a> enumeran casos límite en
					los que una regla aún puede equivocarse, las ocurrencias de cada hallazgo muestran sobre
					qué se decidió, y el <a href="/rules/">catálogo de reglas</a> indica la confianza de cada
					regla. La precisión de una regla personalizada, una regla de un pack o una sustitución
					depende de cómo se haya escrito. Por defecto ese estándar es WCAG. Una regla para un
					requisito que solo impone otro estándar es opcional: por defecto solo se ejecuta cuando
					apuntas a ese estándar (ver{" "}
					<a href="/configuration/engine-options/#opt-in-rules">Reglas opcionales</a>).{" "}
					<code>engineOptions.optInRules</code> desbloquea las reglas opcionales sin quitar el
					perfil ni los filtros del análisis. Con <code>optInRules: 'all'</code> y sin perfil
					ni filtro, la ejecución abarca todas las reglas y no apunta a ningún estándar concreto;
					una lista de etiquetas desbloquea solo esos grupos de reglas opcionales.{" "}
					<code>engine.optInRules</code> enumera las etiquetas cuyas reglas se ejecutaron. Con un perfil de WCAG, una regla desbloqueada solo
					se ejecuta cuando sus etiquetas coinciden con ese perfil, y la ejecución sigue apuntando a
					WCAG. Así,
					entre las reglas de core, un análisis con un objetivo de WCAG solo ejecuta las de los
					criterios del objetivo, más las reglas de buenas prácticas si las añades. Una regla de
					buenas prácticas no nombra ningún criterio, y aun así puede informar <code>fail</code>{" "}
					cuando lo que encuentra es en sí una barrera, como un encabezado vacío (
					<a href="/rules/empty-heading/"><code>empty-heading</code></a>); ningún compuesto de WCAG
					lo cuenta. Una regla personalizada, una sustitución o una regla de un pack sin etiqueta opcional se ejecuta
					cuando la selección la incluye, y entonces puede informar un <code>fail</code> por una
					comprobación propia que WCAG no exige.
				</li>
				<li>
					Cada <code>cantTell</code> es una señal explícita para revisión humana, no una
					incertidumbre silenciada.
				</li>
				<li>
					Un compuesto nunca da por cumplido un criterio que sus reglas solo comprueban en parte:
					cuando todas se cumplen, queda en <code>cantTell</code>{" "}
					(<code>composite.rollup.cantTell.partialCheck</code>), así que un <code>pass</code> nunca
					guarda silencio sobre una parte que ninguna regla comprueba.
				</li>
				<li>
					La tabla de cobertura de facetas te dice exactamente qué partes de qué SC no tienen
					ninguna cobertura automatizada, y por tanto qué queda para una persona.
				</li>
			</ul>
			<p>
				Que ningún compuesto esté en <code>fail</code> en cada SC de tu nivel objetivo significa:{" "}
				<em>cada comprobación automatizable para ese nivel salió limpia.</em> Es el subconjunto
				automatizable de la conformidad, declarado con precisión, no un sustituto de la revisión
				manual que la propia WCAG exige.
			</p>
		</>
	);
}
