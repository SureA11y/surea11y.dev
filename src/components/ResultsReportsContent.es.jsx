import React from "react";

export function ResultsReportsContent() {
	return (
		<>
			<p>
				Cada análisis se devuelve como un único objeto JSON plano — nada oculto, nada que tengas que
				volver a derivar. Los tres formatos de informe siguientes se construyen directamente sobre
				ese mismo objeto, cada uno pensado para un lector distinto: una persona revisando una
				pestaña del navegador, un panel de CI que solo entiende SARIF, o el propio formato de
				reporte de implementación del W3C. Elige la forma que se ajuste a quién va a mirarlo
				realmente.
			</p>

			<h2>Esquema de salida</h2>
			<p>
				El contrato exacto que devuelve cada runner, y del que se deriva cualquier otro formato de
				informe: un envoltorio de resultado de nivel superior, una entrada por regla (incluyendo
				cada <code>pass</code> y <code>notApplicable</code> — nunca una lista de solo violaciones),
				detalle por ocurrencia hasta el elemento marcado, códigos explícitos de incertidumbre para
				todo lo que una regla no pudo decidir, y rollups compuestos por SC de WCAG. Vale la pena
				leerlo una vez si estás construyendo algo sobre un resultado crudo. Ver{" "}
				<a href="/results-reports/output-schema/">Esquema de salida</a> para la forma completa.
			</p>

			<h2>Informe HTML</h2>
			<p>
				Ábrelo, entiéndelo — sin servidor, sin paso de compilación, sin JSON que entrecerrar los
				ojos para leer. Un resumen en lenguaje llano arriba, un resumen por WCAG agrupado por nivel
				de conformidad obtenido de los resultados compuestos propios del motor, y una tabla buscable
				completa debajo para quien quiera profundizar. Este es el informe para entregar a un
				revisor que no quiere leer la salida cruda. Ver{" "}
				<a href="/results-reports/html-report/">Informe HTML</a>.
			</p>

			<h2>Informe SARIF</h2>
			<p>
				Envía un análisis directamente a GitHub Code Scanning o a cualquier otro panel que consuma
				SARIF, sin tener que escribir tú mismo un conversor. Las violaciones se mapean a resultados
				SARIF con una huella estable basada en contenido, así que una línea base sigue filtrando con
				limpieza y un panel puede seguir un hallazgo a través de commits en lugar de perderlo cada
				vez que cambia un número de línea. Ver{" "}
				<a href="/results-reports/sarif-report/">Informe SARIF</a>.
			</p>

			<h2>Informe EARL</h2>
			<p>
				Un informe de implementación EARL/JSON-LD del W3C <strong>que declara el resultado de cada
				regla, no solo los fallos</strong> — el formato que el grupo comunitario de ACT Rules acepta
				como evidencia de que un motor realmente implementa lo que dice. Una prueba útil cuando una
				afirmación de conformidad con ACT necesita ser verificable, no solo declarada. Ver{" "}
				<a href="/results-reports/earl-report/">Informe EARL</a>.
			</p>
		</>
	);
}
