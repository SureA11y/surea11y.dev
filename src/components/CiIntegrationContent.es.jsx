import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function CiIntegrationContent() {
	return (
		<>
			<p>
				Plantillas listas para pegar que envuelven la{" "}
				<a href="https://github.com/SureA11y/cli#readme">CLI</a> (
				<code>npx @surea11y/cli scan ...</code>) en <span lang="en">GitHub Actions</span> y <span lang="en">Bitbucket Pipelines</span>. Si llamas a la
				librería directamente desde tu propio script de Node en lugar de usar la CLI, consulta en su
				lugar{" "}
				<a href={`${core}/docs/INTEGRATION.md#ci-gating-a-build-on-the-result`}>
					<code>INTEGRATION.md</code>
				</a>
				: esta página trata específicamente sobre la CLI como paso del pipeline de CI.
			</p>
			<p>
				Todas estas plantillas utilizan los códigos de salida de la CLI (<code>0</code> si no se encuentran
				fallos, <code>1</code> si existe al menos un resultado <code>fail</code> (o uno{" "}
				<em>nuevo</em> al utilizar <code>--baseline</code>) y <code>2</code> si se produce un error de uso
				o de análisis) para controlar el pipeline de CI;
				no se necesita scripting adicional para un control básico de aprobado/fallido.
			</p>

			<h2><span lang="en">GitHub Actions</span></h2>
			<h3>Básico: controlar según el código de salida</h3>
			<CodeBlock
				lang="yaml"
				lines={[
					"name: Accessibility scan",
					"on: [pull_request]",
					"",
					"jobs:",
					"  a11y-scan:",
					"    runs-on: ubuntu-latest",
					"    steps:",
					"      - uses: actions/checkout@v4",
					"      - uses: actions/setup-node@v4",
					"        with:",
					"          node-version: 20",
					"      - run: npm ci && npm run build   # produce whatever static HTML you're scanning",
					"      - run: npx @surea11y/cli scan ./dist/index.html",
				]}
			/>
			<p>
				Esto hace que el <code>job</code> falle en el momento en que se encuentra cualquier resultado <code>fail</code>.
				Para un sitio existente con violaciones preexistentes, consulta la variante con baseline más
				abajo en lugar de deshabilitar el paso.
			</p>

			<h3>Con un baseline (sitio existente, controlar solo las violaciones nuevas)</h3>
			<CodeBlock
				lines={[
					"# Once, locally: record every current fail occurrence, commit the file.",
					{ text: "surea11y scan ./dist/index.html --write-baseline a11y-baseline.json", command: true },
					{ text: "git add a11y-baseline.json", command: true },
				]}
			/>
			<CodeBlock
				lang="yaml"
				lines={[
					"      - run: npm ci && npm run build",
					"      - run: npx @surea11y/cli scan ./dist/index.html --baseline a11y-baseline.json",
				]}
			/>
			<p>
				Consulta <a href="/conformance/baseline/">Baseline / allowlist</a> para ver qué cuenta como
				"conocido" frente a "nuevo", y cómo regenerar el archivo a medida que se corrigen violaciones.
			</p>

			<h3>Subir SARIF a <span lang="en">GitHub Code Scanning</span></h3>
			<p>
				<code>upload-sarif</code> necesita el permiso <code>security-events: write</code> y{" "}
				<strong>no hace fallar el <code>job</code> por sí mismo</strong>: combínalo con un paso de control
				independiente (o <code>continue-on-error</code> + tu propia comprobación) si también quieres
				que la compilación falle ante violaciones nuevas.
			</p>
			<CodeBlock
				lang="yaml"
				lines={[
					"name: Accessibility scan",
					"on: [pull_request]",
					"",
					"permissions:",
					"  contents: read",
					"  security-events: write",
					"",
					"jobs:",
					"  a11y-scan:",
					"    runs-on: ubuntu-latest",
					"    steps:",
					"      - uses: actions/checkout@v4",
					"      - uses: actions/setup-node@v4",
					"        with:",
					"          node-version: 20",
					"      - run: npm ci && npm run build",
					"      - name: Scan (report, don't fail the job here)",
					"        run: npx @surea11y/cli scan ./dist/index.html --baseline a11y-baseline.json --sarif results.sarif",
					"        continue-on-error: true",
					"        id: scan",
					"      - name: Upload SARIF to Code Scanning",
					"        uses: github/codeql-action/upload-sarif@v3",
					"        with:",
					"          sarif_file: results.sarif",
					"      - name: Fail the job on new violations",
					"        if: steps.scan.outcome == 'failure'",
					"        run: exit 1",
				]}
			/>
			<p>
				Consulta <a href="/results-reports/sarif-report/">el formato del informe SARIF</a> y una
				limitación conocida: un análisis de un <strong>archivo local</strong> en tu checkout obtiene
				anotaciones en línea en la interfaz de <span lang="en">Code Scanning</span>; un análisis de una{" "}
				<strong>URL en vivo</strong> no las obtiene (SARIF/<span lang="en">Code Scanning</span> solo puede asociar un hallazgo
				con un archivo real del repositorio).
			</p>

			<h2><span lang="en">Bitbucket Pipelines</span></h2>
			<p>
				<span lang="en">Bitbucket Pipelines</span> no tiene un panel integrado que consuma SARIF equivalente a <span lang="en">GitHub Code
				Scanning</span>, así que el código de salida de la CLI (más, opcionalmente, <code>--html</code> como
				artefacto descargable del pipeline de CI) es el punto de integración práctico en lugar de{" "}
				<code>--sarif</code>.
			</p>
			<CodeBlock
				lang="yaml"
				lines={[
					"pipelines:",
					"  pull-requests:",
					"    '**':",
					"      - step:",
					"          name: Accessibility scan",
					"          image: node:20",
					"          script:",
					"            - npm ci",
					"            - npm run build",
					"            - npx @surea11y/cli scan ./dist/index.html --baseline a11y-baseline.json --html a11y-report.html",
					"          artifacts:",
					"            - a11y-report.html",
				]}
			/>
			<p>
				El paso hace fallar el pipeline de CI según el código de salida de la CLI, exactamente igual que
				cualquier otra entrada de <code>script</code>; <code>a11y-report.html</code> (consulta{" "}
				<a href="/results-reports/html-report/">el informe HTML</a>) se adjunta como artefacto de
				compilación descargable para que quien revise pueda abrirlo sin volver a ejecutar el análisis
				localmente.
			</p>

			<h2>Límites de minutos en el nivel gratuito/repos privados</h2>
			<p>
				Si el nivel gratuito de tu proveedor de pipelines de CI tiene un límite de minutos (el nivel
				gratuito de <span lang="en">Bitbucket Pipelines</span> es de 50 minutos de compilación al mes en workspaces privados,
				por ejemplo), un análisis basado en <code>jsdom</code> de HTML estático/renderizado en el
				servidor (lo que hace la CLI) es mucho más económico que controlar un navegador real mediante
				automatización. Consulta{" "}
				<a href="https://github.com/SureA11y/cli/blob/main/docs/CLI.md#what-it-can-and-cant-scan">
					la documentación de la CLI
				</a>{" "}
				para ver qué se sacrifica con eso (sin contenido renderizado en el cliente ni un motor de
				diseño CSS real).
			</p>
		</>
	);
}
