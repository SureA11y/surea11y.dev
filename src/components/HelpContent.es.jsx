import React from "react";

export function HelpContent() {
	return (
		<>
			<p>
				Aquí llegan dos tipos de pregunta, y vale la pena saber cuál tienes antes de empezar a
				indagar: "por qué hizo eso el motor" tiene respuesta más abajo, y "qué es lo que nunca hará"
				se responde con la misma franqueza — dicho por adelantado, no dejado para que lo descubras
				por las malas en producción.
			</p>

			<h2>Preguntas frecuentes</h2>
			<p>
				Las preguntas que surgen más a menudo, respondidas sin rodeos: por qué <code>runOnly</code>{" "}
				ejecutó en silencio todas las reglas en lugar de la que pediste, por qué una regla
				personalizada sigue devolviendo <code>cantTell</code> sin causa aparente, por qué una regla
				dependiente de geometría reporta <code>notApplicable</code> bajo jsdom, y qué significa
				realmente un análisis limpio y qué no. Quince minutos aquí ahorran la mayor parte de la
				depuración que la mayoría de la gente acaba haciendo de todos modos. Ver{" "}
				<a href="/help/faq/">Preguntas frecuentes</a>.
			</p>

			<h2>Limitaciones conocidas</h2>
			<p>
				Cada límite de la arquitectura de análisis estático del DOM de este motor, nombrado
				explícitamente en lugar de descubierto por sorpresa: qué no puede hacer estructuralmente en
				absoluto, qué depende del entorno en el que lo ejecutes, y qué se niega deliberadamente a
				adivinar porque una suposición incorrecta sería peor que un honesto <code>cantTell</code>.
				Conocer esto de antemano es lo que te permite confiar en el resto de los resultados. Ver{" "}
				<a href="/help/known-limitations/">Limitaciones conocidas</a>.
			</p>
		</>
	);
}
