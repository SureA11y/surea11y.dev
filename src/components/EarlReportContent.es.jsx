import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";
import engine from "../data/engine.generated.json";

const core = "https://github.com/SureA11y/core/blob/main";

const earlOutcomeRows = [
	{ id: "pass", engine: <code>pass</code>, earl: <code>earl:passed</code> },
	{ id: "fail", engine: <code>fail</code>, earl: <code>earl:failed</code> },
	{ id: "cantTell", engine: <code>cantTell</code>, earl: <code>earl:cantTell</code> },
	{ id: "notApplicable", engine: <code>notApplicable</code>, earl: <code>earl:inapplicable</code> },
];

export function EarlReportContent() {
	return (
		<>
			<p>
				<code>@surea11y/core/earl</code> convierte los resultados de un análisis en{" "}
				<a href="https://www.w3.org/TR/EARL10-Schema/">EARL 1.0</a> en JSON-LD: el vocabulario que
				publica el W3C para declarar "esta herramienta probó esto y obtuvo este resultado", y el
				formato que el grupo comunitario <a href="https://act-rules.github.io/"><span lang="en">ACT Rules</span></a> acepta
				como informe de implementación.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { renderEarlReport } = require('@surea11y/core/earl');",
					"",
					"const report = renderEarlReport(result, {",
					`  assertor: { name: 'surea11y', version: '${engine.version}' },`,
					"  mode: 'earl:automatic'",
					"});",
					"",
					"fs.writeFileSync('earl.jsonld', JSON.stringify(report, null, 2));",
				]}
			/>

			<h2>Para qué sirve</h2>
			<p>Dos audiencias, y ambas quieren el mismo documento por razones distintas.</p>
			<p>
				Un <strong>informe de implementación</strong> le dice al grupo comunitario <span lang="en">ACT Rules</span> cómo se
				comporta este motor frente a sus casos de prueba, que es lo que permite que un motor aparezca
				listado junto a las demás implementaciones. Estar listado no es un aval y el W3C no verifica
				los datos: la formulación correcta es <em>"listado como implementación ACT"</em>, nunca{" "}
				<em>"certificado por el W3C"</em>. El informe propio de este motor se publica en{" "}
				<a href="https://surea11y.github.io/act-report/act-report.jsonld">
					https://surea11y.github.io/act-report/act-report.jsonld
				</a>{" "}
				y se regenera con <code>scripts/act-report.js</code>.{" "}
				<code>--runner=chromium</code> genera el mismo informe a partir de un análisis en
				Chromium, como ejecutan el motor los bindings de navegador, con el asertor llamado
				«SureA11y in a browser» y la versión de Chromium en la descripción del informe.
			</p>
			<p>
				Un <strong>consumidor</strong> obtiene un formato de intercambio. EARL es lo que lee una
				herramienta de accesibilidad cuando tiene que combinar resultados de más de una fuente (un
				análisis automatizado y una auditoría manual, por ejemplo, o varios motores), porque cada
				aserción indica quién la hizo y cómo. Eso tiene valor aunque nunca se envíe a ningún sitio.
			</p>

			<h2>En qué se diferencia de los demás informes</h2>
			<p>
				El <a href="/results-reports/sarif-report/">informe SARIF</a> y el{" "}
				<a href="/results-reports/html-report/">informe HTML</a> llevan{" "}
				<strong>solo las violaciones</strong>: informan de las ocurrencias <code>fail</code> y{" "}
				<code>cantTell</code> y descartan todo lo demás. EARL es lo contrario.{" "}
				<strong>
					Cada regla que se ejecutó se convierte en una aserción, incluidas <code>pass</code> e{" "}
					<code>inapplicable</code>
				</strong>
				, porque un informe de implementación es una afirmación sobre lo que decidió el motor{" "}
				<em>en todos los casos</em>. Una regla que no dijo nada porque no encontró nada aplicable es
				evidencia, no ruido: es lo que permite distinguir "este motor comprobó y no encontró nada
				que comprobar" de "este motor no implementa esa regla en absoluto".{" "}
				<strong>Cada aserción trata de una regla sobre un sujeto</strong>: el <code>passed</code>{" "}
				de una regla no es un veredicto sobre el criterio de WCAG al que se asocia, la mayoría de
				los cuales tienen partes que ninguna regla cubre (ver{" "}
				<a href="/conformance/wcag-mapping/">Mapeo de conformidad con WCAG</a>).
			</p>

			<h2>Forma</h2>
			<p>El grafo se agrupa por sujeto en lugar de ser una lista plana de aserciones:</p>
			<CodeBlock
				lang="json"
				lines={[
					"{",
					'  "@context": "https://www.w3.org/WAI/content-assets/wcag-act-rules/earl-context.json",',
					'  "@graph": [',
					"    {",
					'      "@type": "TestSubject",',
					'      "source": "https://example.test/",',
					'      "assertions": [',
					"        {",
					'          "@type": "Assertion",',
					'          "test": { "title": "img-alt-present", "isPartOf": ["WCAG2:non-text-content"] },',
					'          "result": { "outcome": "earl:failed" },',
					'          "assertedBy": {',
					'            "@type": "Assertor",',
					'            "name": "surea11y",',
					`            "release": { "@type": "Version", "revision": "${engine.version}" }`,
					"          },",
					'          "mode": "earl:automatic"',
					"        }",
					"      ]",
					"    }",
					"  ]",
					"}",
				]}
			/>
			<ul>
				<li>
					<strong>
						<code>source</code>
					</strong>{" "}
					es la URL analizada, o bien <code>about:blank</code> cuando un resultado no lleva ninguna.
					Cuando varios resultados no llevan ninguna, cada uno es un sujeto propio,{" "}
					<code>about:blank#result-&lt;n&gt;</code> según su posición en la lista (empezando por 1),
					en lugar de fusionarse todos en uno.
				</li>
				<li>
					<strong>
						<code>test.title</code>
					</strong>{" "}
					es el ID de regla propio del motor. En términos ACT, una regla es el{" "}
					<em>procedimiento</em> que ejecutó la implementación, que es exactamente lo que nombra un
					ID de regla.
				</li>
				<li>
					<strong>
						<code>test.isPartOf</code>
					</strong>{" "}
					enumera los Criterios de Éxito a los que se asocia esa regla, como{" "}
					<code>WCAG2:&lt;criterion-id&gt;</code>: cada entrada de <code>normativeMappings</code>{" "}
					cuyo <code>standard</code> es <code>WCAG</code> o está ausente (como en SARIF) y que no
					tiene <code>type</code>. Se omite por completo para una regla que no reclama ningún
					criterio: <code>aria-allowed-role</code>, <code>empty-heading</code> y{" "}
					<code>landmark-role-name-present</code> son las reglas automáticas del motor en esa
					situación, y afirmar una lista vacía se leería como "no encontramos a qué se asocia" en
					lugar de "deliberadamente no se asocia a ninguno". Una regla así puede dar{" "}
					<code>fail</code> igualmente (<code>empty-heading</code> falla con un encabezado sin
					nombre): su aserción es entonces <code>earl:failed</code> sin <code>isPartOf</code>, un
					fallo de la regla que no afirma que haya fallado ningún criterio de WCAG.
				</li>
				<li>
					<strong><code>isPartOf</code> sigue el nivel y la versión de WCAG del análisis.</strong>{" "}
					Un criterio que el análisis dejó fuera de <code>rulesResults</code> por ellos no se
					enumera, como 1.4.6 (AAA) con <code>engineOptions.wcagLevel: 'AA'</code>, o 4.1.1 cuando{" "}
					<code>{"includeRuleIds: ['duplicate-id']"}</code> se ejecutó con WCAG 2.2, que lo
					eliminó; una regla cuyos criterios quedan todos fuera no tiene <code>isPartOf</code>. La
					aserción en sí se mantiene, ya que trata de la regla. Un criterio que el análisis informa
					sí se enumera, como un resultado agregado nombrado por id por encima del nivel, o 4.1.1 en
					un análisis 2.2 que lo seleccionó, y también todos los criterios de un resultado que no
					registra ni <code>engine.wcagLevel</code> ni <code>engine.wcagVersion</code>.
				</li>
				<li>
					<strong>
						<code>assertedBy</code>
					</strong>{" "}
					siempre está presente salvo que pases <code>assertor: null</code>: por defecto es{" "}
					<code>surea11y</code> y la versión del motor que llevan los resultados.{" "}
					<strong>
						<code>mode</code>
					</strong>{" "}
					aparece solo cuando lo proporcionas.
				</li>
			</ul>
			<p>
				Los ids de criterio se derivan del propio título del criterio (<code>Non-text Content</code> →{" "}
				<code>non-text-content</code>). <code>normativeMappings</code> también lleva referencias a
				documentos <span lang="en">Understanding</span>, que tienen un <code>type</code>, y entradas
				de otros estándares (cláusulas de EN 301 549, los requisitos o elementos de lista de
				comprobación de un pack), que nombran su propio <code>standard</code>; ambas pueden compartir
				un número de <code>requirement</code> con un criterio. Solo las entradas cuyo{" "}
				<code>standard</code> es <code>WCAG</code> o está ausente y que no tienen <code>type</code>{" "}
				se leen como Criterios de Éxito. No hace falta ningún nivel de conformidad.{" "}
				<code>isPartOf</code> enumera solo criterios de WCAG; las entradas de otros estándares se
				dejan fuera.
			</p>
			<p>
				Un resultado compacto (<code>engineOptions.output.detail: 'findings'</code>, ver{" "}
				<a href="/results-reports/output-schema/#top-level-result">Esquema de salida</a>) se lee
				como el resultado completo que representa, así que se informa igual.
			</p>

			<h2>Resultados</h2>
			<DataTable
				label="Resultados del motor en EARL"
				rowKey="id"
				columns={[
					{ key: "engine", label: "Motor", width: "30%" },
					{ key: "earl", label: "EARL", wrap: true },
				]}
				rows={earlOutcomeRows}
			/>
			<p>
				<code>earl:untested</code> no tiene contraparte: una regla que no se ejecutó no produce
				ningún resultado sobre el cual hacer una aserción, así que no aporta ninguna aserción en
				lugar de aportar una de "no probada".
			</p>
			<p>
				<strong>
					<code>cantTell</code> no le resta crédito de conformidad.
				</strong>{" "}
				Las propias reglas de consistencia de ACT permiten que una implementación automatizada
				indique "no se puede determinar" en algunos ejemplos (aunque no en todos) y aun así cuente
				como consistente. Lo que una implementación parcialmente consistente <em>no</em> puede hacer
				es producir un falso positivo: fallar un ejemplo que la regla dice que debería pasar o que
				es inaplicable. Esa es la condición que vale la pena vigilar, y es una propiedad de las
				reglas, no de este informe. Según la última ejecución completa, el motor produce{" "}
				<strong>cero falsos positivos</strong> entre los 957 ejemplos que el W3C publica para sus
				60 reglas asociadas. Ver{" "}
				<a href={`${core}/docs/ACT_RULE_MAPPING.md`}>
					<code>ACT_RULE_MAPPING.md</code>
				</a>
				, y volver a ejecutar <code>scripts/act-testcase-check.js</code> para la cifra actual en
				lugar de confiar en esta indefinidamente.
			</p>

			<h2>Varios resultados, un solo informe</h2>
			<p>
				<code>renderEarlReport</code> acepta un array con la misma facilidad que un solo resultado,
				porque un informe que cubre muchas páginas es el caso normal:
			</p>
			<CodeBlock lang="js" lines={["renderEarlReport([homeResult, checkoutResult, searchResult], { assertor });"]} />
			<p>
				Un resultado entre frames de <a href="/results-reports/output-schema/#cross-frame-result"><code>runa11yCoreAcrossFrames</code></a> se acepta tal
				cual, solo o dentro del array: cada frame que respondió es un resultado más y se convierte
				en un sujeto con su propia URL. Un frame por debajo del superior cuya URL no lo distingue,
				porque es <code>about:srcdoc</code> o <code>about:blank</code> o porque otro frame del
				resultado también la tiene, se nombra por su URL y su ruta, los selectores con los que lo
				nombran SARIF y JUnit, cada uno codificado y unidos con <code>/</code>:{" "}
				<code>about:srcdoc#frame=%23pay</code>, <code>about:srcdoc#frame=%23widget/%23inner</code>.
				Donde incluso la ruta se comparte, como en los frames de un binding, que no llevan
				selector, se añade su posición entre los frames del resultado, desde 1:{" "}
				<code>about:srcdoc#frame=iframe&amp;n=3</code>. Cualquier otra cosa que no sea un resultado
				de análisis, como <code>null</code> o una cadena, lanza un <code>TypeError</code>.
			</p>
			<p>
				Los resultados que comparten una URL se fusionan en un solo sujeto: quien llama y analiza
				la misma página con distintas <code>engineOptions</code> sigue describiendo un único recurso,
				y el contexto no tiene forma de expresar dos sujetos con la misma fuente.{" "}
				<strong>
					Cuando dos resultados hacen una aserción sobre la misma regla para la misma URL, se
					conserva el peor resultado
				</strong>
				: <code>earl:failed</code>, luego <code>earl:cantTell</code>, luego{" "}
				<code>earl:passed</code>, luego <code>earl:inapplicable</code>, así que ningún orden de las
				entradas puede ocultar un fallo. Eso incluye la misma página analizada con dos anchos de
				viewport: EARL no tiene ningún término para las condiciones en que se renderizó una página,
				así que un informe construido a partir de varios anchos conserva, para cada regla, un fallo
				en cualquier ancho. Genera un informe por ancho si los propios anchos importan.
			</p>
			<p>
				La salida es determinista: los sujetos se ordenan por fuente, las aserciones por ID de regla,
				y las mismas entradas producen una salida idéntica byte a byte sin importar el orden. La única
				excepción son los resultados sin URL, que se distinguen por su posición en la lista (
				<code>about:blank#result-2</code>); da a cada resultado su URL cuando el orden no deba
				importar. Eso es lo que hace útil una comparación entre dos versiones del motor.
			</p>

			<h2>Opciones</h2>
			<DataTable
				label="Opciones del informe EARL"
				rowKey="id"
				columns={[
					{ key: "option", label: "Opción", width: "22%" },
					{ key: "meaning", label: "Significado", wrap: true },
				]}
				rows={[
					{ id: "assertor", option: <code>assertor</code>, meaning: <><code>{"{ name, version }"}</code>. El nombre por defecto es <code>surea11y</code>, y la versión, indicada como la versión (<code>release</code>) del asertor, es por defecto el <code>engine.version</code> que llevan los resultados cuando todos llevan el mismo; los resultados de versiones distintas no reciben ninguna salvo que la indiques. Pasa <code>null</code> para omitir <code>assertedBy</code> por completo.</> },
					{ id: "mode", option: <code>mode</code>, meaning: <>Un modo de prueba EARL como <code>'earl:automatic'</code>. Se omite cuando no se proporciona.</> },
				]}
			/>

			<h2>Ver también</h2>
			<ul>
				<li>
					<a href="/results-reports/output-schema/">Esquema de salida</a>: el resultado que este
					informe lee
				</li>
				<li>
					<a href={`${core}/docs/ACT_RULE_MAPPING.md`}>
						<code>ACT_RULE_MAPPING.md</code>
					</a>: a qué reglas ACT corresponden las reglas del motor
				</li>
				<li>
					<a href={`${core}/docs/API_STABILITY.md`}>
						<code>API_STABILITY.md</code>
					</a>: qué está cubierto por el versionado semántico
				</li>
			</ul>
		</>
	);
}
