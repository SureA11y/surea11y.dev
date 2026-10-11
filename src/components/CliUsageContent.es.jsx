import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";
const cliDocs = "https://github.com/SureA11y/cli/blob/main/docs/CLI.md";

export function CliUsageContent() {
	return (
		<>
			<p>
				Un comando en lugar de código. No requiere un framework de pruebas ni un script de Node y
				resulta adecuado para un paso del pipeline de CI o para una comprobación rápida de un
				artefacto de compilación.
			</p>

			<h2>Primer análisis</h2>
			<CodeBlock
				lines={[
					{ text: "npm install -g @surea11y/cli", command: true },
					{ text: "surea11y scan ./index.html", command: true },
					{ text: "surea11y scan https://example.com/ --wcag 2.2", command: true },
				]}
			/>
			<p>
				Requiere Node.js <code>^20.19.0 || ^22.13.0 || &gt;=24.0.0</code>. El resumen nombra la
				versión de <code>@surea11y/core</code> que ejecutó el análisis:
			</p>
			<CodeBlock
				lines={[
					"$ surea11y scan ./index.html",
					"",
					"surea11y scan: file:///path/to/index.html",
					"  engine: @surea11y/core 1.11.1",
					"  pass: 15   fail: 4   cantTell: 4   notApplicable: 111",
					"",
					"  occurrences by tier: fail: 4   cantTell: 5",
					"",
					"FAIL (4 rule(s)):",
					"",
					"  img-alt-present  (serious, 1 fail occurrence(s))",
					"    - html > body > main > img",
					"      This <img> has no alt attribute.",
					"      hint: Add an alt attribute that says what the image shows, or alt=\"\" if",
					"      the image is purely decorative.",
					"",
					"cantTell — needs human review (4 rule(s)): contrast-computable, link-name-quality,",
					"manual-review, page-title-patterns",
				]}
			/>

			<h2 id="choosing-what-runs">Elegir qué se ejecuta</h2>
			<p>
				<code>--wcag</code> selecciona las reglas de un objetivo de conformidad de WCAG, según el
				nivel que tiene cada criterio en esa versión; <code>--wcag-level</code> establece el nivel (
				<code>AA</code> salvo que se indique otro). <code>--best-practices</code> añade las reglas
				que no comprueban ningún criterio de WCAG, como <code>region</code> y{" "}
				<code>heading-order</code>; por sí solo, ejecuta solo esas. <code>--profile</code> ejecuta un
				perfil de conformidad, como <code>en301549-v4.1.1</code> o uno propio de un pack.
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --wcag 2.2                    # WCAG 2.2, Level A and AA", command: true },
					{ text: "surea11y scan ./dist/index.html --wcag 2.1 --wcag-level A     # WCAG 2.1, Level A", command: true },
					{ text: "surea11y scan ./dist/index.html --wcag 2.2 --best-practices   # and the best practices", command: true },
				]}
			/>
			<p>
				El 4.1.1 <span lang="en">Parsing</span>, que WCAG 2.2 eliminó, forma parte de un objetivo{" "}
				<code>2.1</code> y no de uno <code>2.2</code>. <code>--rules</code> y <code>--tags</code>{" "}
				añaden reglas a las de un objetivo, y <code>--exclude-rules</code> se aplica después. Junto
				a <code>--profile</code>, <code>--best-practices</code> añade sus reglas y el perfil sigue
				aplicándose; <code>--wcag</code>, <code>--rules</code> y <code>--tags</code> eligen las
				reglas en lugar de un perfil, así que <code>--profile</code> con cualquiera de ellos sale con{" "}
				<code>2</code>. Se corresponden con <code>runOnly.wcag</code>,{" "}
				<code>runOnly.bestPractices</code> y <code>engineOptions.profile</code> (ver{" "}
				<a href="/configuration/engine-options/#selecting-which-rules-run">Opciones del motor</a>).
			</p>

			<h2 id="packs">Packs</h2>
			<p>
				<code>--pack</code> carga un <a href="/configuration/packs/">pack</a> (reglas, un estándar o
				una lista de comprobación, y sus perfiles) por nombre de paquete, resuelto desde el proyecto
				del directorio de trabajo, o por ruta; <code>--profile</code> ejecuta uno de sus perfiles.
				Repite <code>--pack</code> para analizar con varios.
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --pack @acme/a11y-policy --profile acme-web-2026", command: true },
					{ text: "surea11y scan ./dist/index.html --pack ./acme-policy-pack.js --profile acme-web-2026", command: true },
				]}
			/>
			<p>
				El resumen nombra el perfil y los packs que se ejecutaron, y <code>--json</code> los incluye
				como <code>engine.profile</code> y <code>engine.packs</code>. Un pack que no se puede
				encontrar o cargar, o que el motor omite, sale con <code>2</code> sin escribir ningún
				informe, así que un análisis nunca pasa con las comprobaciones del pack sin ejecutar.
			</p>

			<h2 id="compact-results">Resultados compactos</h2>
			<p>
				<code>--compact</code> reduce cada resultado <code>pass</code> y <code>notApplicable</code>{" "}
				a su regla, su resultado y su tipo (<code>engineOptions.output.detail: 'findings'</code>):
				un <code>--json</code> más pequeño, para un resultado que se guarda como artefacto de CI. El
				resumen, el código de salida, la línea base y los informes HTML, SARIF y JUnit son los
				mismos que sin él.
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --compact --json > result.json", command: true }]} />

			<h2>Códigos de salida y limitaciones</h2>
			<p>
				<code>cantTell</code> nunca afecta al código de salida: el <code>0</code> indica que no se han
				encontrado fallos, el <code>1</code> que existe al menos un resultado{" "}
				<code>fail</code> (o, analizando con <code>--baseline</code>, un resultado <code>fail</code>{" "}
				<em>nuevo</em>), y el <code>2</code> un error de uso o de análisis, o un análisis que no
				habría comprobado nada o menos de lo pedido: una lista <code>--rules</code>/
				<code>--tags</code> que no nombra ninguna regla ni etiqueta conocida, un selector{" "}
				<code>--context</code> que no coincide con nada, una regla personalizada o un pack que no se
				ejecutó, un <code>--profile</code> que no se aplicó. El resultado <code>fail</code> es el
				caso que condiciona CI; consulta <a href="/conformance/baseline/">Baseline / allowlist</a>{" "}
				para saber qué cuenta como "conocido" frente a "nuevo". La CLI solo lee{" "}
				<strong>HTML estático</strong>: un archivo local, o el cuerpo sin procesar de un GET
				HTTP(S), y nunca ejecuta el JavaScript de la página. Para páginas renderizadas en cliente,
				usa una de las integraciones (<code>bindings</code>) en su lugar, o llama al motor
				directamente contra un navegador real controlado mediante automatización (ver{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a> Patrón 2).
			</p>
			<p>
				Referencia completa de flags, contrato de reglas personalizadas, packs y recetas de CI:{" "}
				<a href={cliDocs}><code>docs/CLI.md</code></a>. Para plantillas de pipeline de CI en
				concreto, ver <a href="/configuration/ci-integration/">Integración con CI</a>.
			</p>
		</>
	);
}
