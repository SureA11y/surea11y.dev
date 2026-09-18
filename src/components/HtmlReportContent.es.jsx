import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

export function HtmlReportContent() {
	return (
		<>
			<p>
				Un informe HTML autocontenido que puedes abrir en un navegador después de un análisis: sin
				servidor, sin recursos externos, sin peticiones de red. Pensado para quienes hacen pruebas de
				control de calidad (QA) o revisión manual y quieren una vista navegable de los resultados de
				un análisis en lugar de JSON sin procesar o un resumen de terminal.
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --html report.html", command: true }]} />
			<p>
				Abre <code>report.html</code> directamente desde el disco. Funciona junto a cualquier otro
				modo de salida: <code>--html</code> no sustituye a <code>--json</code>/al resumen
				predeterminado, es un artefacto adicional escrito en la ruta indicada.
			</p>

			<h2>Qué muestra</h2>
			<ul>
				<li>
					<strong>Cabecera</strong>: un titular en lenguaje llano ("N de M comprobaciones aplicables
					pasaron") más una barra apilada y una leyenda (icono + etiqueta + recuento; el estado
					nunca depende solo del color) desglosada por resultado (<code>fail</code>/
					<code>cantTell</code>/<code>pass</code>/<code>notApplicable</code>).
				</li>
				<li>
					<strong>Vale la pena revisar</strong>: una tarjeta por regla con ocurrencias{" "}
					<code>fail</code>/<code>cantTell</code> (no una por ocurrencia: una regla con muchas
					ocurrencias idénticas es una sola cosa que merece atención, no muchas), cada una mostrando
					gravedad, chip(s) de SC de WCAG, una ocurrencia representativa y el recuento total de
					ocurrencias. Limitado a las 24 reglas de mayor prioridad, con una nota de desbordamiento a
					partir de ahí.
				</li>
				<li>
					<strong>Resumen por WCAG</strong>: agrupado por nivel de conformidad (A / AA / AAA),
					obtenido directamente de los resultados agregados compuestos <code>rulesResults[]</code> propios del
					motor (ver <a href="/conformance/wcag-mapping/">Conformidad</a>): una fila por Criterio
					de Éxito, su resultado, un desglose de aprobado/fallido/necesita revisión/n.a. y qué
					reglas atómicas contribuyeron. Son datos reales del motor, no una agrupación inventada:
					el mismo resultado agregado que obtendrías del <code>rulesResults</code> del JSON sin procesar.
				</li>
				<li>
					<strong>Datos técnicos completos</strong> (contraído por defecto): una tarjeta resumen
					(mosaicos por resultado) y una tabla con función de búsqueda, filtrable (por resultado) y paginada de
					cada ocurrencia individual de todo el análisis.
				</li>
			</ul>
			<p>
				La barra de metadatos bajo la cabecera lleva el recuento de reglas, el recuento de
				ocurrencias, la etiqueta del motor, la versión del esquema y el idioma al que se resolvió el
				análisis. El mecanismo de reserva de idioma es por cadena de texto e invisible en el propio texto, así
				que <strong>un informe solicitado en un idioma que el motor no soporta se lee como uno en
				inglés normal</strong>; el chip nombra el idioma solicitado junto al resuelto cuando ambos
				difieren. Ver <a href="/configuration/locales/">Locales</a>.
			</p>

			<h2>Uso como biblioteca</h2>
			<CodeBlock
				lang="js"
				lines={[
					"const { renderHtmlReport } = require('@surea11y/core/report');",
					"const { runDomRulesInPage } = require('@surea11y/core');",
					"",
					"const result = runDomRulesInPage(url, null, {}, null);",
					"const html = renderHtmlReport(result, { title: 'My scan report' });",
					"",
					"require('fs').writeFileSync('report.html', html);",
				]}
			/>
			<p>
				<code>renderHtmlReport(result, options)</code> es una función pura: devuelve una cadena,{" "}
				<strong>nunca toca el sistema de archivos por sí misma</strong> (el flag <code>--html</code>{" "}
				de la CLI es el que escribe). <code>options.title</code> es opcional (por defecto{" "}
				<code>"surea11y scan report"</code>).
			</p>

			<h2>Alcance</h2>
			<p>
				<strong>Esto es un informe de un solo análisis: una instantánea puntual, no un panel que
				siga resultados a lo largo de muchos análisis en el tiempo.</strong> Seguir resultados a lo
				largo de muchas ejecuciones es un asunto aparte, más amplio, y no forma parte de esta
				herramienta: conserva el JSON de cada análisis y compáralo tú mismo, o bien envía SARIF a un panel
				que ya se encargue del historial (ver <a href="/results-reports/sarif-report/">Informe
				SARIF</a> más abajo).
			</p>
		</>
	);
}
