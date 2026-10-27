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
				Las preguntas que surgen más a menudo, respondidas sin rodeos: por qué una selección de
				etiquetas e ids de regla puede no ejecutar ninguna regla y aun así parecer limpia, por qué
				un componente web devuelve <code>cantTell</code>, qué cambia en tus resultados al
				actualizar a core 1.14, por qué cada criterio de WCAG queda en <code>cantTell</code> aunque
				todas las comprobaciones se cumplan, por qué una regla dependiente de geometría indica <code>notApplicable</code> bajo jsdom, y qué significa
				realmente un análisis limpio y qué no. Revisar primero estas preguntas frecuentes evita
				buena parte de la depuración innecesaria. Ver{" "}
				<a href="/help/faq/">Preguntas frecuentes</a>.
			</p>

			<h2>Limitaciones conocidas</h2>
			<p>
				Los límites conocidos de este motor están documentados de forma explícita para que no los descubras
				inesperadamente en producción: qué no puede ver un análisis de un único estado de la
				página, qué depende de dónde lo ejecutes (jsdom, un navegador, los propios scripts de la
				página), y qué se niega deliberadamente a adivinar porque una suposición incorrecta sería
				peor que un honesto <code>cantTell</code>, cada uno con qué hacer al respecto.
				Conocer esto de antemano es lo que te permite confiar en el resto de los resultados. Ver{" "}
				<a href="/help/known-limitations/">Limitaciones conocidas</a>.
			</p>
		</>
	);
}
