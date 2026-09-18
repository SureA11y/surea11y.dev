import React from "react";

export function HelpContent() {
	return (
		<>
			<p>
				Antes de investigar un problema, conviene distinguir entre dos tipos de preguntas: por qué
				el motor ha producido un resultado concreto y qué tareas no puede realizar.
			</p>

			<h2>Preguntas frecuentes</h2>
			<p>
				Las preguntas que surgen más a menudo, respondidas sin rodeos: por qué <code>runOnly</code>{" "}
				ejecutó en silencio todas las reglas en lugar de la que pediste, por qué una regla
				personalizada sigue devolviendo <code>cantTell</code> sin causa aparente, por qué una regla
				dependiente de geometría indica <code>notApplicable</code> bajo jsdom, y qué significa
				realmente un análisis limpio y qué no. Revisar primero estas preguntas frecuentes evita
				buena parte de la depuración innecesaria. Ver{" "}
				<a href="/help/faq/">Preguntas frecuentes</a>.
			</p>

			<h2>Limitaciones conocidas</h2>
			<p>
				Cada límite de la arquitectura de análisis estático del DOM de este motor está documentado de
				forma explícita para que no lo descubras inesperadamente en producción: qué no puede hacer
				estructuralmente en absoluto, qué depende del entorno en el que lo ejecutes, y qué se niega deliberadamente a
				adivinar porque una suposición incorrecta sería peor que un honesto <code>cantTell</code>.
				Conocer esto de antemano es lo que te permite confiar en el resto de los resultados. Ver{" "}
				<a href="/help/known-limitations/">Limitaciones conocidas</a>.
			</p>
		</>
	);
}
