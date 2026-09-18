import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function StandaloneUsageContent() {
	return (
		<>
			<p>
				Para una comprobación manual contra una página abierta en un navegador real, un
				bookmarklet, o cualquier otro contexto sin driver de automatización y sin paso de
				compilación al que recurrir.
			</p>
			<p>
				<code>@surea11y/core</code> incluye <code>surea11y.browser.js</code> en la raíz del
				paquete, un bundle generado a partir de las mismas fuentes de reglas que el paquete de Node.
				Cargarlo directamente define una única variable global, <code>a11ycore</code>:
			</p>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="node_modules/@surea11y/core/surea11y.browser.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(location.href, null, {}, null);",
					"  console.log(result.checksResults.filter((r) => r.outcome === 'fail'));",
					"</script>",
				]}
			/>
			<p>
				<code>a11ycore.runa11yCoreInPage</code> es exactamente la misma función que llaman los
				bindings por debajo — el bundle existe solo para resolver el problema de <em>cargarla</em>{" "}
				sin <code>require</code>/un sistema de módulos, no para añadir una superficie de API
				separada.
			</p>
			<p>
				<strong>El bundle solo lleva inglés.</strong> Cualquier otro idioma se distribuye junto a
				él como su propio archivo — carga uno después del bundle y ese idioma queda disponible:
			</p>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="node_modules/@surea11y/core/surea11y.browser.js"></script>',
					'<script src="node_modules/@surea11y/core/surea11y.i18n.de.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(location.href, null, { locale: 'de' }, null);",
					"</script>",
				]}
			/>
			<p>
				Pide un idioma cuyo archivo no hayas cargado y obtienes inglés, no un error — ver{" "}
				<a href="/configuration/locales/">Locales</a>.
			</p>
			<p>
				<strong>Excluido deliberadamente del bundle</strong>: <code>runa11yCoreAcrossFrames</code>/
				<code>a11yCoreEnableFrameResponder</code> (el análisis entre frames necesita que el frame
				incrustado también cargue el motor y se adhiera — no encaja con una sola etiqueta de script
				suelta). Usa el paquete npm directamente si lo necesitas — ver{" "}
				<a href={`${core}/docs/INTEGRATION.md#cross-frame-scanning-including-cross-origin`}>
					<code>INTEGRATION.md</code>
				</a>
				.
			</p>
			<p>
				<code>require('@surea11y/core')</code> directamente, sin ningún binding, es la otra vía
				independiente — esto es el Patrón 1/Patrón 2 en{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>: jsdom en Node sin
				navegador real, o manejar tú mismo Puppeteer/Playwright en lugar de pasar por un binding.
			</p>
		</>
	);
}
