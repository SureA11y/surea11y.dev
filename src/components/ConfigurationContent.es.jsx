import React from "react";

export function ConfigurationContent() {
	return (
		<>
			<p>
				Cada runner toma el mismo objeto <code>engineOptions</code> plano: sin archivo de
				configuración que mantener, sin una superficie de flags separada solo para la CLI que
				sincronizar. La CLI y cada integración (<code>binding</code>) simplemente construyen ese objeto por ti a partir de sus
				propios flags o métodos constructores, así que lo que aprendas aquí se aplica en cualquier
				sitio donde ejecutes un análisis. Vale la pena acertar pronto en cuatro cosas:
			</p>

			<h2>Opciones del motor</h2>
			<p>
				Limita un análisis exactamente a las reglas que quieres: nombrando una versión y un nivel de
				WCAG (WCAG 2.2 AA en una sola opción, con las buenas prácticas encima si las quieres), por
				ID, por etiqueta o nombrando un perfil de conformidad como WCAG 2.2 AA, EN 301 549 o
				Section 508, para que una ejecución informe solo de lo
				que realmente eres responsable, ni más ni menos. Silencia widgets globalmente ruidosos conocidos
				o para una sola regla sin perder cobertura en el resto, ajusta cuán agresivas son las
				comprobaciones de contraste para un auditor humano frente a una puerta de CI desatendida, e
				incorpora una regla propia de tu organización junto a las incorporadas cuando el catálogo no
				cubre algo que te importa. Ver{" "}
				<a href="/configuration/engine-options/">Opciones del motor</a> para la referencia completa.
			</p>

			<h2>Packs</h2>
			<p>
				Prueba contra más que WCAG sin bifurcar el motor. Un pack trae un estándar nacional, la
				política de accesibilidad de tu organización o unas cuantas reglas propias desde un paquete
				independiente, y el motor lo ejecuta igual que sus propias reglas: sus perfiles seleccionan
				qué se ejecuta, sus elementos de lista de comprobación devuelven un resultado cada uno, y
				todos los informes los muestran junto a los criterios de WCAG. El mismo pack funciona desde
				Node, cada integración, los test matchers y la CLI, y{" "}
				<code>npx surea11y-pack new</code> genera uno que pasa sus propias pruebas tal como sale.
				Ver <a href="/configuration/packs/">Packs</a> para usar uno o escribir uno.
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
