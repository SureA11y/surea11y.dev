import React from "react";

export function ConfigurationContent() {
	return (
		<>
			<p>
				Cada runner toma el mismo objeto <code>engineOptions</code> plano: sin archivo de
				configuración que mantener, sin una superficie de flags separada solo para la CLI que
				sincronizar. La CLI y cada integración (<code>binding</code>) simplemente construyen ese objeto por ti a partir de sus
				propios flags o métodos constructores, así que lo que aprendas aquí se aplica en cualquier
				sitio donde ejecutes un análisis. Vale la pena acertar pronto en tres cosas:
			</p>

			<h2>Opciones del motor</h2>
			<p>
				Limita un análisis exactamente a las reglas que quieres, por ID, por etiqueta o por
				versión de conformidad de WCAG (2.0, 2.1 o 2.2), o nombrando un perfil de conformidad como
				WCAG 2.2 AA, EN 301 549 o Section 508, para que una ejecución informe solo de lo
				que realmente eres responsable, ni más ni menos. Silencia widgets globalmente ruidosos conocidos
				o para una sola regla sin perder cobertura en el resto, ajusta cuán agresivas son las
				comprobaciones de contraste para un auditor humano frente a una puerta de CI desatendida, e
				incorpora una regla propia de tu organización junto a las incorporadas cuando el catálogo no
				cubre algo que te importa. Ver{" "}
				<a href="/configuration/engine-options/">Opciones del motor</a> para la referencia completa.
			</p>

			<h2>Integración con CI</h2>
			<p>
				Consigue una puerta de accesibilidad funcionando en tu pipeline de CI sin escribirla desde cero:
				plantillas listas para pegar de <span lang="en">GitHub Actions</span> y <span lang="en">Bitbucket Pipelines</span> que condicionan una
				compilación al propio código de salida de la CLI, establecen una línea base de las violaciones
				preexistentes de un sitio ya existente para que solo falles en las genuinamente nuevas, y
				suben resultados SARIF directamente a <span lang="en">GitHub Code Scanning</span> donde tu equipo ya mira. Las recetas para GitLab CI y Azure DevOps llevan los resultados a
				sus propias vistas de pruebas como JUnit. Ver{" "}
				<a href="/configuration/ci-integration/">Integración con CI</a> para las plantillas
				completas.
			</p>

			<h2>Locales</h2>
			<p>
				Entrega hallazgos que tu equipo realmente pueda accionar en el idioma que lea más rápido:
				cada título de regla y el resumen y la pista de cada ocurrencia se resuelven desde un
				diccionario basado en claves, con una alternativa elegante por cadena de texto al inglés en
				lugar de un vacío o un error. Hoy se incluyen cinco configuraciones regionales (inglés,
				francés, alemán, español, japonés), y un resultado siempre te dice exactamente qué configuración
				regional usó, así que nada se degrada
				en silencio sin que lo sepas. Ver <a href="/configuration/locales/">Locales</a> para la
				cobertura y cómo aportar tu propio diccionario.
			</p>
		</>
	);
}
