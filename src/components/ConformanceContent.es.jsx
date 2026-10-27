import React from "react";

export function ConformanceContent() {
	return (
		<>
			<p>
				<strong>Un análisis limpio no es, por sí solo, una declaración de conformidad con
				WCAG</strong>. Pretender lo contrario es exactamente el tipo de exceso que este motor se
				niega a cometer. Esta sección cubre cómo los resultados de reglas individuales realmente se
				agregan en un veredicto de Criterio de Éxito, qué cubre honestamente ese veredicto y qué no,
				y cómo condicionar un pipeline de CI real a violaciones conocidas y ya revisadas en lugar de
				bloquear cada compilación hasta que todo esté arreglado de una vez.
			</p>

			<h2>Mapeo de conformidad con WCAG</h2>
			<p>
				Mira exactamente cómo encajan entre sí las reglas atómicas, las facetas de cobertura y las
				reglas compuestas de resultado agregado por SC de WCAG, y por qué un criterio cuyas
				comprobaciones salieron todas limpias queda en <code>cantTell</code>, comprobado en parte, en
				lugar de un vago "parece estar bien": un compuesto dice qué partes se comprobaron y deja el
				resto a una persona. Un análisis que nombra unas pocas
				comprobaciones en lugar de un objetivo sigue informando de los criterios a los que
				pertenecen, e indica cuáles comprobó solo en parte. Apunta a un nivel de conformidad (A,
				AA o AAA) en cualquier versión de WCAG con un único conjunto de etiquetas o un perfil con
				nombre, asocia cada resultado a la cláusula de EN 301 549 que reformula su criterio cuando
				ese es el estándar con el que informas, y obtén una
				respuesta directa a la pregunta que de verdad importa: qué puede decirte este tipo de
				resultado automatizado, y dónde se detiene. Ver{" "}
				<a href="/conformance/wcag-mapping/">Mapeo de conformidad con WCAG</a>.
			</p>

			<h2>Baseline / allowlist</h2>
			<p>
				No dejes que un primer análisis de un sitio existente e imperfecto bloquee cada compilación
				futura: registra una sola vez lo que ya se conoce, y condiciona la CI solo a violaciones
				genuinamente nuevas. Es la diferencia entre "no podemos publicar nada hasta que esto sea
				perfecto" y "podemos detectar regresiones a partir de hoy", y es lo que de verdad hace que
				un equipo active la puerta de control. También puede aceptar los hallazgos que
				probablemente fallan, y un baseline escrito antes de actualizar sigue coincidiendo cuando el
				código de motivo de un hallazgo se divide o cambia de nombre. Ver{" "}
				<a href="/conformance/baseline/">Baseline / allowlist</a>.
			</p>
		</>
	);
}
