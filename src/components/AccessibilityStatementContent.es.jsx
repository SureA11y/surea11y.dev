import React from "react";

const core = "https://github.com/SureA11y/core/blob/main";

export function AccessibilityStatementContent() {
	return (
		<>
			<p>
				Esta declaración se aplica a <strong>surea11y.dev</strong>, el sitio que estás consultando. No se
				refiere a los hallazgos obtenidos al analizar otros sitios; estos se explican en la sección{" "}
				<a href="/conformance/wcag-mapping/">Conformidad</a>.
			</p>

			<h2>Objetivo de conformidad</h2>
			<p>
				Este sitio aspira a cumplir con <a href="https://www.w3.org/TR/WCAG22/">WCAG 2.2</a> en
				Nivel AA. Sigue los mismos criterios de accesibilidad en todas las interfaces de SureA11y:
				el color nunca es la única señal (los indicadores de estado y de estado activo
				siempre combinan el color con una segunda señal — un subrayado, un glifo, una palabra),
				todo control interactivo tiene un contorno de foco visible y un objetivo mínimo de 44px, y
				todo icono que no sea puramente decorativo lleva una alternativa textual.
			</p>

			<h2>Cómo se prueba este sitio</h2>
			<p>
				Este sitio lo construye el mismo equipo que construye <code>@surea11y/core</code>, así que
				por coherencia, el sitio también se evalúa con nuestro propio motor. La salida
				completa compilada se analiza periódicamente con <code>@surea11y/core</code> mismo — el
				mismo motor de análisis estático del DOM documentado en todo este sitio — y todo hallazgo
				real que arroja ese análisis se corrige, no se justifica. Ese análisis tiene límites reales
				y honestos propios (ver <a href="/help/known-limitations/">Limitaciones conocidas</a>): no
				puede ejecutarse contra el CSS computado real de este sitio como lo haría un navegador real,
				así que los hallazgos de contraste de ese modo de análisis en particular no son una
				evidencia significativa en ningún sentido.
			</p>
			<p>
				<strong>El análisis automatizado establece un punto de partida, no un límite</strong>, así que no es la
				única comprobación que recibe este sitio. Los cambios también están sujetos a pruebas
				manuales de accesibilidad — navegación solo con teclado, una pasada con lector de pantalla y
				una revisión de las cosas que ninguna herramienta automatizada puede juzgar (si un encabezado
				realmente describe lo que sigue, si el orden del foco coincide con el orden visual, si el
				contenido que solo aparece tras una interacción sigue siendo alcanzable) — la misma postura
				de "las herramientas automatizadas no pueden decírtelo todo" sobre la que se construye todo
				este proyecto.
			</p>

			<h2>Carencias conocidas</h2>
			<ul>
				<li>
					El índice "En esta página" no resalta tu posición de desplazamiento actual — eso
					necesitaría JavaScript en el cliente, y este sitio no envía ninguno, por diseño. Los
					enlaces en sí funcionan con normalidad con teclado o lector de pantalla; solo falta el
					resaltado de "estás aquí" mientras te desplazas.
				</li>
				<li>
					Las muestras de código se muestran intencionadamente sobre un fondo oscuro aunque el
					resto del sitio es claro — la misma excepción de "una terminal es una terminal"
					documentada en el propio sistema de diseño de este sitio. Si esa combinación de
					contraste en particular te resulta difícil de leer, el texto de cada muestra de código
					sigue siendo totalmente seleccionable y copiable como texto plano.
				</li>
			</ul>

			<h2>Informar de un problema</h2>
			<p>
				Si algo en este sitio es difícil de usar con teclado, lector de pantalla o cualquier otra
				tecnología de asistencia, por favor{" "}
				<a href={`${core}/issues`}>abre un issue en GitHub</a>. Incluye la URL de la página, qué
				intentabas hacer y qué ocurrió en su lugar — el mismo nivel de detalle que querrías de
				cualquiera que informara de un error contra el motor mismo.
			</p>
		</>
	);
}
