import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";
import localeData from "../data/locales.generated.json";

const core = "https://github.com/SureA11y/core/blob/main";

const localeCoverageRows = localeData.locales.map((l) => ({
	id: l.id,
	locale: <code>{l.id}</code>,
	name: l.name,
	file: <code>{l.file}</code>,
	keys: String(l.keys),
	untranslated: l.canonical ? "— (el conjunto canónico/de reserva)" : String(l.stillEnglish),
}));

const localeReasonRows = [
	{ id: "ok", reason: <code>ok</code>, meaning: "Obtuviste exactamente lo que pediste, y ese diccionario contiene todas las claves." },
	{
		id: "primary-subtag",
		reason: <code>primary-subtag</code>,
		meaning: (
			<>
				Tu código incluía una subetiqueta sin diccionario propio, así que se usó su idioma base —
				pediste <code>de-DE</code> y obtuviste <code>de</code>. Es normal y esperado; no hay nada
				que corregir. Una diferencia solo de mayúsculas/minúsculas no es esto: <code>DE</code>{" "}
				informa <code>ok</code>.
			</>
		),
	},
	{
		id: "dictionary-not-loaded",
		reason: <code>dictionary-not-loaded</code>,
		meaning: "El proyecto incluye ese idioma, pero esta copia del motor no lo trae incorporado y no se proporcionó ninguno. En la práctica: el paquete independiente para navegador sin su archivo lateral de locale.",
	},
	{
		id: "unknown-locale",
		reason: <code>unknown-locale</code>,
		meaning: (
			<>
				El proyecto no tiene esa traducción en absoluto, así que se usó inglés. <code>ja</code> y{" "}
				<code>pt-BR</code> caen ambos aquí actualmente.
			</>
		),
	},
	{
		id: "partial-dictionary",
		reason: <code>partial-dictionary</code>,
		meaning: "Se usó el diccionario, pero le faltan algunas claves, así que esas cadenas concretas recurrieron al inglés.",
	},
];

const dictionaryLocationRows = [
	{ id: "require", how: <code>require('@surea11y/core')</code>, what: "Todos los locales, incorporados. Nada que configurar." },
	{ id: "binding", how: "Un binding (Playwright, Cypress, …)", what: "Todos los locales, incorporados. Nada que configurar." },
	{
		id: "browser",
		how: <code>surea11y.browser.js</code>,
		what: (
			<>
				Inglés. Carga <code>surea11y.i18n.&lt;locale&gt;.js</code> después de él para cualquier otro
				idioma.
			</>
		),
	},
];

export function LocalesContent() {
	return (
		<>
			<p>
				El título/descripción de cada regla, y el resumen/pista de cada ocurrencia, se localizan
				mediante una búsqueda en un diccionario basado en claves — no están codificados de forma
				fija por idioma.
			</p>

			<h2>Cobertura actual de locales</h2>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "locale", label: "Locale", width: "18%" },
					{ key: "file", label: "Archivo", width: "24%" },
					{ key: "keys", label: "Claves", width: "12%" },
					{ key: "untranslated", label: "Valores que siguen en inglés", wrap: true },
				]}
				rows={localeCoverageRows.map((r) => ({
					...r,
					locale: (
						<>
							{r.locale} ({r.name})
						</>
					),
				}))}
			/>
			<p>
				Los archivos de locale son JSON simples: un mapa plano de clave a cadena traducida, en el
				mismo orden de claves que <code>en.json</code>. No contienen nada más, así que contribuir
				con un idioma significa editar texto y nunca tocar código.
			</p>
			<p>
				Cada locale contiene todas las claves que tiene <code>en.json</code>. Mantenerlo así es
				tarea de <code>npm run i18n:sync</code>: ejecútalo después de cualquier cambio en{" "}
				<code>en.json</code> y reescribe cada archivo de locale no inglés para que coincida —
				añadiendo claves nuevas, eliminando claves que <code>en.json</code> ya no tiene, y dejando
				intactas las traducciones existentes. Una clave que añade se inicializa con el texto en
				inglés, lo cual cuenta como no traducido hasta que alguien lo reemplace.
			</p>

			<h2>Seleccionar un locale</h2>
			<CodeBlock lang="js" lines={["runDomRulesInPage(url, null, { locale: 'fr' }, null);"]} />
			<p>El valor predeterminado es <code>'en'</code> si se omite. Se acepta cualquier cadena; <strong>un locale no reconocido nunca es un error</strong>.</p>

			<h2>Cómo se elige un locale</h2>
			<p>
				Ocurren dos cosas, en este orden. Confundirlas es la fuente habitual de confusión, así que
				se describen por separado.
			</p>
			<h3>Paso 1 — elegir un diccionario (una vez por análisis)</h3>
			<ol>
				<li>
					Usa el diccionario que coincide con tu código. <code>de</code> encuentra{" "}
					<code>de.json</code>. Las mayúsculas/minúsculas no importan — <code>pt-br</code>,{" "}
					<code>pt-BR</code> y <code>PT-BR</code> encuentran todos <code>pt-BR.json</code>.
				</li>
				<li>
					Si no, elimina todo lo que sigue al primer <code>-</code> y prueba con eso.{" "}
					<code>de-DE</code> encuentra <code>de.json</code>; <code>de-AT</code> también.
				</li>
				<li>Si no, usa inglés.</li>
			</ol>
			<p>
				Así que solo necesitas un <code>de-DE.json</code> si el alemán de Austria y de Alemania
				realmente debe leerse de forma distinta. Publica <code>de.json</code> y toda variante de
				alemán queda cubierta.
			</p>
			<h3>Paso 2 — resolver cada cadena (por cadena)</h3>
			<p>Dentro del diccionario elegido, cada cadena se busca de forma individual:</p>
			<ol>
				<li>Toma el valor de la clave del diccionario elegido.</li>
				<li>Si esa clave falta, toma la inglesa.</li>
				<li>
					Si el inglés tampoco la tiene — algo que no debería ocurrir con una clave incorporada,
					pero puede pasar con una escrita a mano — usa el texto literal que la propia regla lleva.
				</li>
			</ol>
			<p>
				<strong>El resultado nunca es un vacío, un <code>undefined</code>, ni un error lanzado.</strong>{" "}
				Una traducción a medias se muestra en tu idioma donde existe y en inglés en todo lo demás.
			</p>

			<h2>Saber qué locale obtuviste realmente</h2>
			<p>
				El respaldo elegante tiene un inconveniente:{" "}
				<strong>pide un idioma que la compilación no incluye y obtienes inglés fluido de vuelta,
				sin nada en las cadenas que lo indique</strong>. Por eso cada resultado informa la
				resolución una vez, al principio:
			</p>
			<CodeBlock
				lang="json"
				lines={[
					'"engine": {',
					'  "tag": "a11ycore",',
					'  "schemaVersion": "1.0.0",',
					'  "locale": { "requested": "ja", "resolved": "en", "reason": "unknown-locale" }',
					"}",
				]}
			/>
			<p>
				<code>requested</code> es lo que pediste (después de recortar espacios; <code>en</code> si
				no pasaste nada o pasaste algo que no es una cadena), <code>resolved</code> es el
				diccionario que se usó, y <code>reason</code> es uno de los siguientes:
			</p>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "reason", label: "reason", width: "26%" },
					{ key: "meaning", label: "Significado", wrap: true },
				]}
				rows={localeReasonRows}
			/>
			<p>
				Trata la lista como abierta — una versión posterior puede añadir un valor, así que compara
				solo con los que te interesan y deja que el resto caiga en un valor por defecto.
			</p>
			<p>
				Si necesitas un idioma concreto, <code>requested !== resolved</code> es la condición que
				hay que comprobar en CI. Ten en cuenta que también es cierta para el caso inofensivo de{" "}
				<code>primary-subtag</code>, así que condiciónalo a{" "}
				<code>reason === 'unknown-locale' || reason === 'dictionary-not-loaded'</code> si una
				coincidencia de idioma base te resulta suficiente. Consulta{" "}
				<a href="/results-reports/output-schema/">el esquema de salida</a> para conocer el lugar de
				este campo en el resultado, y{" "}
				<a href={`${core}/docs/API_STABILITY.md`}><code>API_STABILITY.md</code></a> para saber qué
				se garantiza sobre él.
			</p>

			<h2>Dónde viven los diccionarios</h2>
			<p>Qué idiomas están disponibles depende de cómo cargues el motor.</p>
			<DataTable
				rowKey="id"
				columns={[
					{ key: "how", label: "Cómo lo cargas", width: "36%" },
					{ key: "what", label: "Qué obtienes", wrap: true },
				]}
				rows={dictionaryLocationRows}
			/>
			<p>
				El paquete está dividido porque viaja por la red a cada página que lo usa, y ninguna página
				necesita los cuatro idiomas. Mantener el inglés incorporado y el resto como opcional redujo
				unos 280 KB de la descarga y evita que siga creciendo a medida que se añaden idiomas. Nada
				más cambia: el paquete de Node y los bindings no se ven afectados.
			</p>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="surea11y.browser.js"></script>',
					'<script src="surea11y.i18n.de.js"></script>',
				]}
			/>
			<p>
				Pide un idioma cuyo archivo no cargaste y obtienes inglés, con{" "}
				<code>engine.locale.reason</code> establecido en <code>dictionary-not-loaded</code> —
				distinto de <code>unknown-locale</code>, que significa que el proyecto no tiene esa
				traducción en absoluto.
			</p>

			<h3>Proporcionar tu propio diccionario</h3>
			<p>
				<code>engineOptions.messages</code> acepta <code>{"{ [locale]: { key: value } }"}</code>{" "}
				y tiene prioridad sobre cualquier cosa incorporada o cargada desde un archivo lateral. Útil
				para sobrescribir un puñado de cadenas, o para un idioma que mantienes de forma privada:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"runDomRulesInPage(url, null, {",
					"  locale: 'de',",
					"  messages: { de: { img_altPresent_title: 'Eigener Text' } }",
					"}, null);",
				]}
			/>
			<p>Las claves que no proporciones recurren al valor por defecto normalmente, así que una sobrescritura parcial es válida.</p>

			<h2>Dónde se usan las claves</h2>
			<p>Dos espacios de nombres de claves independientes, ambos resueltos de la misma manera:</p>
			<ul>
				<li>
					<strong>A nivel de regla</strong>: <code>meta.i18n.titleKey</code> / <code>meta.i18n.descriptionKey</code>{" "}
					— resuelven el <code>title</code>/<code>description</code> de una regla en cada entrada
					de <code>checksResults[]</code>.
				</li>
				<li>
					<strong>A nivel de ocurrencia</strong>: <code>i18n.summaryKey</code> / <code>i18n.hintKey</code>,
					con <code>i18n.params</code> para la interpolación de <code>{"{{placeholder}}"}</code> —
					resuelven el <code>summary</code>/<code>hint</code> de una ocurrencia. Consulta{" "}
					<a href="/results-reports/output-schema/">el esquema de salida</a>.
				</li>
			</ul>
			<p>
				Ambas se incluyen en el resultado junto con el texto ya resuelto, así que puedes volver a
				renderizar en un locale distinto a partir de un resultado guardado sin volver a analizar.
			</p>
		</>
	);
}
