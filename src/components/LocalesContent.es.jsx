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

// Sample output for getLocaleCoverage(), built from the same generated data
// as the table above so the numbers can't drift apart.
const coverageSampleLines = [
	"const { getLocaleCoverage } = require('@surea11y/core');",
	"",
	"getLocaleCoverage();",
	"// {",
	"//   sourceLocale: 'en',",
	`//   totalKeys: ${localeData.totalKeys},`,
	"//   locales: [",
	...localeData.locales
		.filter((l) => !l.canonical)
		.slice(0, 2)
		.map(
			(l) =>
				`//     { locale: '${l.id}', total: ${l.keys}, translated: ${l.keys - l.stillEnglish}, missing: ${l.missing}, orphaned: [], percent: ${Math.round(((l.keys - l.stillEnglish) / l.keys) * 1000) / 10} },`,
		),
	"//     ...",
	"//   ]",
	"// }",
];

const localeReasonRows = [
	{ id: "ok", reason: <code>ok</code>, meaning: "Obtuviste exactamente lo que pediste, y ese diccionario contiene todas las claves." },
	{
		id: "primary-subtag",
		reason: <code>primary-subtag</code>,
		meaning: (
			<>
				Tu código incluía una subetiqueta sin diccionario propio, así que se usó su idioma base:
				pediste <code>de-DE</code> y obtuviste <code>de</code>. Es normal y esperado; no hay nada
				que corregir. Una diferencia solo de mayúsculas/minúsculas no es esto: <code>DE</code>{" "}
				informa <code>ok</code>.
			</>
		),
	},
	{
		id: "dictionary-not-loaded",
		reason: <code>dictionary-not-loaded</code>,
		meaning: "El proyecto incluye ese idioma, pero esta copia del motor no lo trae incorporado y no se proporcionó ninguno. En la práctica: el paquete independiente para navegador sin su archivo lateral de configuración regional.",
	},
	{
		id: "unknown-locale",
		reason: <code>unknown-locale</code>,
		meaning: (
			<>
				El proyecto no tiene esa traducción en absoluto, así que se usó inglés. <code>ko</code> y{" "}
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
	{ id: "require", how: <code>require('@surea11y/core')</code>, what: "Toda la configuración regional, incorporada. Nada que configurar." },
	{
		id: "binding",
		how: (
			<>
				Una integración (<code>binding</code>) (Playwright, Cypress, …)
			</>
		),
		what: "Toda la configuración regional, incorporada. Nada que configurar.",
	},
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
				mediante una búsqueda en un diccionario basado en claves: no están codificados de forma
				fija por idioma.
			</p>

			<h2>Cobertura actual de configuración regional</h2>
			<DataTable
				label="Cobertura de configuraciones regionales"
				rowKey="id"
				columns={[
					{ key: "locale", label: "Configuración regional", width: "18%" },
					{ key: "file", label: "Archivo", width: "24%" },
					{ key: "keys", label: "Claves", width: "12%" },
					{ key: "untranslated", label: "No traducidos", wrap: true },
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
				"No traducidos" cuenta los valores que coinciden carácter por carácter con el texto en
				inglés, salvo las palabras que con razón son iguales en un idioma: en francés{" "}
				<em lang="fr">Orientation</em>, <em lang="fr">Interruptions</em> y{" "}
				<em lang="fr">Occurrences</em>, en alemán <em lang="de">Frame</em>,{" "}
				<em lang="de">Frames</em> y <em lang="de">Element</em>, en español{" "}
				<em lang="es">Selector</em>. Esas palabras figuran en una lista, cada una con el texto en
				inglés con el que se comprobó, y cuentan como traducidas. Si el inglés cambia, la entrada
				deja de aplicarse y la cadena cuenta como no traducida hasta que alguien la vuelva a
				comprobar. El recuento no puede ver una palabra en inglés que quede dentro de una frase por
				lo demás traducida; eso se detecta leyendo el texto, y no queda ninguna en las
				configuraciones regionales de arriba.
			</p>

			<h3 id="reading-coverage-from-the-package">Leer la cobertura desde el paquete</h3>
			<p>
				Las mismas cifras están disponibles en tiempo de ejecución, a partir de los diccionarios que
				incluye el paquete instalado, así que una herramienta o un sitio de documentación puede
				mostrarlas sin una copia del repositorio:
			</p>
			<CodeBlock lang="js" lines={coverageSampleLines} />
			<p>
				Para cada configuración regional, <code>total</code> es el número de claves en inglés con el
				que se mide, <code>translated</code> cuántos de sus valores difieren del inglés o figuran
				como iguales con razón, <code>missing</code> cuántas claves le faltan (se muestran en
				inglés) y <code>orphaned</code> las claves que tiene y el inglés no.{" "}
				<code>total - translated</code> es la columna "No traducidos" de arriba, incluidas las
				claves que faltan. Las claves que un perfil deja fuera de una configuración regional a
				propósito no se cuentan. El informe de cobertura del propio repositorio y esta función
				comparten una única implementación, así que siempre coinciden; el informe cuenta por
				separado los diccionarios de core y los de cada perfil, y esta función el diccionario
				combinado que usa un análisis. Es una exportación con soporte (
				<a href={`${core}/docs/API_STABILITY.md#extension-points`}>
					<code>API_STABILITY.md</code>, puntos de extensión
				</a>
				).
			</p>
			<p>
				Los archivos de configuración regional son JSON simples: un mapa plano de clave a cadena traducida, en el
				mismo orden de claves que <code>en.json</code>. No contienen nada más, así que contribuir
				con un idioma significa editar texto y nunca tocar código.
			</p>
			<p>
				Cada configuración regional contiene todas las claves que tiene <code>en.json</code>. Mantenerlo así es
				tarea de <code>npm run i18n:sync</code>: ejecútalo después de cualquier cambio en{" "}
				<code>en.json</code> y reescribe cada archivo de configuración regional no inglés para que coincida:
				añadiendo claves nuevas, eliminando claves que <code>en.json</code> ya no tiene, y dejando
				intactas las traducciones existentes. Una clave que añade se inicializa con el texto en
				inglés, lo cual cuenta como no traducido hasta que alguien lo reemplace.
			</p>

			<h2>Seleccionar una configuración regional</h2>
			<CodeBlock lang="js" lines={["runDomRulesInPage(url, null, { locale: 'fr' }, null);"]} />
			<p>El valor predeterminado es <code>'en'</code> si se omite. Se acepta cualquier cadena; <strong>una configuración regional no reconocida nunca es un error</strong>.</p>

			<h2>Cómo se elige una configuración regional</h2>
			<p>
				Ocurren dos cosas, en este orden. Confundirlas es la fuente habitual de confusión, así que
				se describen por separado.
			</p>
			<h3>Paso 1: elegir un diccionario (una vez por análisis)</h3>
			<ol>
				<li>
					Usa el diccionario que coincide con tu código. <code>de</code> encuentra{" "}
					<code>de.json</code>. Las mayúsculas/minúsculas no importan: <code>pt-br</code>,{" "}
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
			<h3>Paso 2: resolver cada cadena (por cadena)</h3>
			<p>Dentro del diccionario elegido, cada cadena se busca de forma individual:</p>
			<ol>
				<li>Toma el valor de la clave del diccionario elegido.</li>
				<li>Si esa clave falta, toma la inglesa.</li>
				<li>
					Si el inglés tampoco la tiene (algo que no debería ocurrir con una clave incorporada,
					pero puede pasar con una escrita a mano), usa el texto literal que la propia regla lleva.
				</li>
			</ol>
			<p>
				<strong>El resultado nunca es un vacío, un <code>undefined</code>, ni un error lanzado.</strong>{" "}
				Una traducción a medias se muestra en tu idioma donde existe y en inglés en todo lo demás.
			</p>

			<h2>Saber qué configuración regional obtuviste realmente</h2>
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
					'  "locale": { "requested": "ko", "resolved": "en", "reason": "unknown-locale" }',
					"}",
				]}
			/>
			<p>
				<code>requested</code> es lo que pediste (después de recortar espacios; <code>en</code> si
				no pasaste nada o pasaste algo que no es una cadena), <code>resolved</code> es el
				diccionario que se usó, y <code>reason</code> es uno de los siguientes:
			</p>
			<DataTable
				label="Valores de locale.reason"
				rowKey="id"
				columns={[
					{ key: "reason", label: "reason", width: "26%" },
					{ key: "meaning", label: "Significado", wrap: true },
				]}
				rows={localeReasonRows}
			/>
			<p>
				Trata la lista como abierta: una versión posterior puede añadir un valor, así que compara
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
				label="De dónde proceden los diccionarios"
				rowKey="id"
				columns={[
					{ key: "how", label: "Cómo lo cargas", width: "36%" },
					{ key: "what", label: "Qué obtienes", wrap: true },
				]}
				rows={dictionaryLocationRows}
			/>
			<p>
				El paquete está dividido porque viaja por la red a cada página que lo usa, y ninguna página
				necesita todos los idiomas. Mantener el inglés incorporado y el resto como opcional redujo
				unos 280 KB de la descarga y evita que siga creciendo a medida que se añaden idiomas. Nada
				más cambia: el paquete de Node y las integraciones no se ven afectados.
			</p>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="surea11y.browser.js"></script>',
					'<script src="surea11y.i18n.ja.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(location.href, null, { locale: 'ja' }, null);",
					"</script>",
				]}
			/>
			<p>
				Pide un idioma cuyo archivo no cargaste y obtienes inglés, con{" "}
				<code>engine.locale.reason</code> establecido en <code>dictionary-not-loaded</code>,
				distinto de <code>unknown-locale</code>, que significa que el proyecto no tiene esa
				traducción en absoluto.
			</p>
			<p>
				En Node, el mismo archivo lateral es un módulo:{" "}
				<code>require('@surea11y/core/i18n/de')</code> devuelve{" "}
				<code>{"{ locale, messages }"}</code> (<code>locale</code> es <code>'de'</code>, y{" "}
				<code>messages</code> el mapa plano de clave a texto), sin necesidad del paquete para navegador.
			</p>
			<p>
				Los mensajes de un <a href="/configuration/packs/">pack</a> están en sus propios
				diccionarios, que el pack enumera por configuración regional; en una configuración regional
				para la que el pack no tiene diccionario, sus mensajes aparecen en inglés.
			</p>

			<h3>Proporcionar tu propio diccionario</h3>
			<p>
				<code>engineOptions.messages</code> acepta <code>{"{ [locale]: { key: value } }"}</code>{" "}
				y tiene prioridad sobre cualquier cosa incorporada o cargada desde un archivo lateral. Útil
				para sobrescribir un puñado de cadenas o para un idioma que mantienes de forma privada:
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

			<h2 id="language-specific-matching">Coincidencia específica por idioma</h2>
			<p>
				Cinco reglas juzgan el texto por frases conocidas, así que llevan listas de palabras además
				de mensajes: <code>link-name-quality</code> ("<span lang="en">click here</span>",
				「<span lang="ja">こちら</span>」), <code>heading-quality</code> ("<span lang="en">Untitled</span>",
				「<span lang="ja">見出し</span>」), <code>form-control-label-quality</code>{" "}
				("<span lang="en">Label</span>", 「<span lang="ja">入力欄</span>」),{" "}
				<code>page-title-patterns</code> ("<span lang="en">Home</span>",
				「<span lang="ja">トップページ</span>」) y <code>media-alternative-transcript-evidence</code>{" "}
				("<span lang="en">transcript</span>", 「<span lang="ja">文字起こし</span>」). Cada lista
				cubre <code>en</code>, <code>de</code>, <code>es</code>, <code>fr</code> y <code>ja</code>.
				La regla <code>skip-link</code> reconoce la redacción de los enlaces de salto en esos mismos
				cinco idiomas.
			</p>
			<p>
				El inglés se comprueba siempre. La lista del idioma propio del elemento, tomado del atributo{" "}
				<code>lang</code> más cercano (el del elemento <code>&lt;html&gt;</code> para el título de la
				página), se añade encima. Comprobar todas las listas en todas partes marcaría palabras que
				son genéricas en un idioma y un nombre real en otro, como "<span lang="fr">Suite</span>" o
				"<span lang="fr">Plus</span>" en una página en inglés. Las palabras de transcripción son la
				excepción: son distintivas en todos los idiomas y una página puede enlazar una transcripción
				en otro idioma, así que se comprueban todas siempre. El texto se normaliza primero en NFKC,
				así que coinciden las formas de ancho completo como 「<span lang="ja">見出し２</span>」.
			</p>
			<p>
				<code>page-title-patterns</code> también cuenta cada carácter chino, japonés o coreano como
				dos al decidir si un título es demasiado corto, ya que 「<span lang="ja">お問い合わせ</span>」
				es un título completo de seis caracteres.
			</p>

			<h2>Dónde se usan las claves</h2>
			<p>Varios espacios de nombres de claves, todos resueltos de la misma manera:</p>
			<ul>
				<li>
					<strong>A nivel de regla</strong>: <code>meta.i18n.titleKey</code> / <code>meta.i18n.descriptionKey</code>,{" "}
					resuelven el <code>title</code>/<code>description</code> de una regla en cada entrada
					de <code>checksResults[]</code>.
				</li>
				<li>
					<strong>Informe HTML</strong>: las claves <code>report_*</code> etiquetan la página que
					genera <code>@surea11y/core/report</code>: encabezados, columnas de tabla, nombres de
					resultados y gravedades, el titular, el paginador. El informe las lee en el idioma al que
					se resolvió el análisis, así que un diccionario también traduce el informe.
				</li>
				<li>
					<strong>A nivel de compuesto</strong>: el <code>title</code>/<code>description</code> de
					cada resultado agregado de <code>rulesResults[]</code>, con el nombre publicado del
					criterio de conformidad en cada idioma.
				</li>
				<li>
					<strong>A nivel de ocurrencia</strong>: <code>i18n.summaryKey</code> / <code>i18n.hintKey</code>,
					con <code>i18n.params</code> para la interpolación de <code>{"{{placeholder}}"}</code>,
					resuelven el <code>summary</code>/<code>hint</code> de una ocurrencia. Consulta{" "}
					<a href="/results-reports/output-schema/">el esquema de salida</a>.
				</li>
			</ul>
			<p>
				Las claves de regla, de compuesto y de ocurrencia se incluyen en el resultado junto con el
				texto ya resuelto, así que puedes volver a renderizar en una configuración regional distinta a partir de un resultado guardado sin volver a analizar.
			</p>
		</>
	);
}
