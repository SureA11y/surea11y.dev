import React from "react";

export function ConfigurationContent() {
	return (
		<>
			<p>
				Cada runner toma el mismo objeto <code>engineOptions</code> plano — sin archivo de
				configuración que mantener, sin una superficie de flags separada solo para la CLI que
				sincronizar. La CLI y cada integración (<code>binding</code>) simplemente construyen ese objeto por ti a partir de sus
				propios flags o métodos constructores, así que lo que aprendas aquí se aplica en cualquier
				sitio donde ejecutes un análisis. Vale la pena acertar pronto en tres cosas:
			</p>

			<h2>Opciones del motor</h2>
			<p>
				Limita un análisis exactamente a las reglas que quieres — por ID, por etiqueta, o por
				versión de conformidad de WCAG (2.0, 2.1 o 2.2) — para que una ejecución informe solo de lo
				que realmente eres responsable, ni más ni menos. Silencia widgets globalmente ruidosos conocidos
				o para una sola regla sin perder cobertura en el resto, ajusta cuán agresivas son las
				comprobaciones de contraste para un auditor humano frente a una puerta de CI desatendida, e
				incorpora una regla propia de tu organización junto a las incorporadas cuando el catálogo no
				cubre algo que te importa. Ver{" "}
				<a href="/configuration/engine-options/">Opciones del motor</a> para la referencia completa.
			</p>

			<h2>Integración con CI</h2>
			<p>
				Consigue una puerta de accesibilidad funcionando en tu pipeline de CI sin escribirla desde cero —
				plantillas listas para pegar de GitHub Actions y Bitbucket Pipelines que condicionan una
				compilación al propio código de salida de la CLI, establecen una línea base de las violaciones
				preexistentes de un sitio ya existente para que solo falles en las genuinamente nuevas, y
				suben resultados SARIF directamente a GitHub Code Scanning donde tu equipo ya mira. Ver{" "}
				<a href="/configuration/ci-integration/">Integración con CI</a> para las plantillas
				completas.
			</p>

			<h2>Locales</h2>
			<p>
				Entrega hallazgos que tu equipo realmente pueda accionar en el idioma que lea más rápido —
				cada título de regla y el resumen y la pista de cada ocurrencia se resuelven desde un
				diccionario basado en claves, con una alternativa elegante por cadena de texto al inglés en
				lugar de un vacío o un error. Hoy se incluyen cuatro configuraciones regionales (inglés,
				francés, alemán, español), y un resultado siempre te dice exactamente qué configuración
				regional usó, así que nada se degrada
				en silencio sin que lo sepas. Ver <a href="/configuration/locales/">Locales</a> para la
				cobertura y cómo aportar tu propio diccionario.
			</p>
		</>
	);
}
