import React from "react";
import { DataTable } from "./design-system/data/DataTable.jsx";

const formatRows = [
	{ format: <code>JSON</code>, use: "Integración, almacenamiento y procesamiento propio", audience: "Desarrollo y plataformas" },
	{ format: "HTML", use: "Revisión humana de un análisis concreto", audience: "QA y auditoría" },
	{ format: "SARIF", use: "Integración con herramientas de análisis de código", audience: "Equipos de desarrollo y seguridad" },
	{ format: "JUnit", use: "Vistas de pruebas de los paneles de CI", audience: "Equipos de desarrollo y QA" },
	{ format: "EARL", use: "Interoperabilidad e informes de implementación de reglas ACT", audience: "Estándares, investigación y conformidad" },
];

export function ResultsReportsContent() {
	return (
		<>
			<p>
				Cada análisis se devuelve como un único objeto JSON plano. Los cuatro formatos de informe
				siguientes se generan a partir de ese mismo objeto, cada uno pensado para un lector distinto: una persona revisando una
				pestaña del navegador, un panel de análisis de código que solo entiende SARIF, una vista
				de pruebas de CI que lee JUnit, o el propio formato de
				informe de implementación del W3C. Elige la forma que se ajuste a quién va a mirarlo
				realmente.
			</p>
			<DataTable
				label="Formatos de salida"
				rowKey="format"
				columns={[
					{ key: "format", label: "Formato" },
					{ key: "use", label: "Uso principal", wrap: true },
					{ key: "audience", label: "Audiencia" },
				]}
				rows={formatRows}
			/>

			<h2>Esquema de salida</h2>
			<p>
				El contrato exacto que devuelve cada runner, y del que se deriva cualquier otro formato de
				informe: un objeto de resultado de nivel superior, una entrada por regla (incluyendo
				cada <code>pass</code> y <code>notApplicable</code>, nunca una lista de solo violaciones),
				detalle por ocurrencia hasta el elemento marcado, códigos explícitos de incertidumbre para
				todo lo que una regla no pudo decidir, y resultados agregados por criterio de conformidad de WCAG. Cada hallazgo sin decidir de una regla de core dice cómo
				lo responde una persona, y algunos dicen hacia dónde apuntan los indicios de la página (una{" "}
				<em>tendencia</em>), para que una revisión empiece por los fallos probables en lugar de por
				una lista plana. Vale la pena
				leerlo una vez si estás construyendo algo sobre un resultado sin procesar. Ver{" "}
				<a href="/results-reports/output-schema/">Esquema de salida</a> para la estructura completa.
			</p>

			<h2>Informe HTML</h2>
			<p>
				Un único archivo HTML que se abre en cualquier navegador, sin servidor ni paso de
				compilación. Un resumen en lenguaje llano arriba, los fallos, después los hallazgos que
				necesitan revisión ordenados en fallos probables, probables cumplimientos y los que solo una
				persona puede juzgar, los de cada regla de core con los pasos para comprobarlo, un resumen por WCAG agrupado por nivel
				de conformidad obtenido de los resultados compuestos propios del motor, y una tabla completa
				con función de búsqueda debajo para quien quiera profundizar. Este es el informe para entregar a un
				revisor que no quiere leer la salida sin procesar. Ver{" "}
				<a href="/results-reports/html-report/">Informe HTML</a>.
			</p>

			<h2>Informe SARIF</h2>
			<p>
				Envía un análisis directamente a <span lang="en">GitHub Code Scanning</span> o a cualquier otro panel que consuma
				SARIF, sin tener que escribir tú mismo un conversor. Las violaciones se mapean a resultados
				SARIF con una huella estable basada en contenido, así que un{" "}
				<a href="/conformance/baseline/">Baseline / allowlist</a> sigue filtrando con
				limpieza y un panel puede seguir un hallazgo a través de commits en lugar de perderlo cada
				vez que cambia un número de línea. Un registro sin resultados significa que nada falló ni
				necesita revisión entre las comprobaciones que se ejecutaron; no es una declaración de
				conformidad. Una opción eleva a errores los hallazgos que probablemente fallan, para una
				compilación que se condiciona a ellos sin condicionarse a cada pregunta. Ver <a href="/results-reports/sarif-report/">Informe SARIF</a>.
			</p>

			<h2>Informe JUnit</h2>
			<p>
				Lleva los resultados de accesibilidad a la vista de pruebas que tu CI ya tiene (el widget
				de merge requests de GitLab, la pestaña Tests de Azure DevOps, Jenkins, CircleCI), junto a
				tus pruebas unitarias. Cada criterio de WCAG es una suite y cada regla una prueba, así que
				un defecto repetido en una página es una sola prueba fallida y los recuentos se mantienen
				estables entre ejecuciones. <code>cantTell</code> llega como prueba omitida, visible sin
				poner la compilación en rojo, salvo que decidas hacer fallar la compilación con los que
				probablemente fallan. Los nombres de las suites son los mismos en todos los
				idiomas, así que el historial de pruebas no se reinicia cuando cambia el idioma del
				análisis. Una suite en verde significa que las reglas que se ejecutaron para un criterio
				no encontraron nada, no que el criterio se cumpla. Ver{" "}
				<a href="/results-reports/junit-report/">Informe JUnit</a>.
			</p>

			<h2>Informe EARL</h2>
			<p>
				Un informe de implementación EARL/JSON-LD del W3C <strong>que declara el resultado de cada
				regla, no solo los fallos</strong>: el formato que el grupo comunitario de <span lang="en">ACT Rules</span> acepta
				para los informes de implementación de reglas ACT. Ejecutado sobre los casos de prueba de
				ACT, registra el resultado de cada uno, así que cómo implementa el motor cada regla se puede
				examinar en lugar de darse por bueno. No es una certificación ni una evidencia de
				conformidad con WCAG: figurar como implementación de ACT no supone un aval del W3C. Ver{" "}
				<a href="/results-reports/earl-report/">Informe EARL</a>.
			</p>
		</>
	);
}
