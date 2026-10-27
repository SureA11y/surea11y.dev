import React from "react";
import engine from "../data/engine.generated.json";

export function RulesIntroContent() {
	return (
		<p>
			Los {engine.composites} resúmenes compuestos por Criterio de Éxito de WCAG no aparecen aquí: no son reglas
			configurables individualmente, pertenecen a{" "}
			<a href="/conformance/wcag-mapping/">Conformidad</a> en su lugar. Consulta{" "}
			<a href="/rules/organization/">cómo se organizan las reglas</a> para ver automáticas frente
			a manuales, cómo se estructuran los ID de regla y las facetas de WCAG. La columna Preguntas cuenta las
			preguntas que una regla puede dejar a una persona (<code>cantTell</code>); cada una viene con
			pasos para responderla en la página de la regla.
		</p>
	);
}
