import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function StandaloneUsageContent() {
	return (
		<>
			<h2>Cuándo usarla</h2>
			<p>
				Para una comprobación manual contra una página abierta en un navegador real, un
				bookmarklet o cualquier otro contexto sin driver de automatización y sin paso de
				compilación al que recurrir.
			</p>

			<h2>Uso</h2>
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
				<code>a11ycore.runa11yCoreInPage</code> es exactamente la misma función que utilizan
				internamente las integraciones. El bundle existe solo para resolver el problema de <em>cargarla</em>{" "}
				sin <code>require</code>/un sistema de módulos, no para añadir una superficie de API
				separada.
			</p>
			<p>
				<strong>El bundle solo lleva inglés.</strong> Cualquier otro idioma se distribuye junto a
				él como su propio archivo. Carga uno después del bundle y ese idioma queda disponible:
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
				Pide un idioma cuyo archivo no hayas cargado y obtienes inglés, no un error (consulta{" "}
				<a href="/configuration/locales/">Locales</a>).
			</p>
			<p>
				El bundle también se carga como módulo:{" "}
				<code>import a11ycore from '@surea11y/core/browser'</code>, una importación con nombre de{" "}
				<code>runa11yCoreInPage</code> y <code>require()</code> obtienen todos su API, y el global
				sigue definido.
			</p>
			<p>
				<strong>Excluido deliberadamente del bundle</strong>: <code>runa11yCoreAcrossFrames</code>/
				<code>a11yCoreEnableFrameResponder</code> (el análisis entre frames necesita que el frame
				incrustado también cargue el motor y se adhiera. No puede resolverse con una única etiqueta{" "}
				<code>&lt;script&gt;</code> aislada). Usa el paquete npm directamente si lo necesitas (consulta{" "}
				<a href={`${core}/docs/INTEGRATION.md#cross-frame-scanning-including-cross-origin`}>
					<code>INTEGRATION.md</code>
				</a>
				).
			</p>
			<p>
				<code>require('@surea11y/core')</code> directamente, sin ninguna integración (<code>binding</code>),
				es la otra vía independiente. Esto es el Patrón 1/Patrón 2 en{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>: jsdom en Node sin
				navegador real, o bien manejar tú mismo Puppeteer/Playwright en lugar de pasar por una integración.
			</p>

			<h2 id="packs-in-a-page">Packs en una página</h2>
			<p>
				Un <a href="/configuration/packs/">pack</a> se prepara en Node, así que llega a una página
				como script. <code>packScript(packs)</code>, de <code>@surea11y/core/pack</code>, devuelve uno
				que registra los packs; cárgalo después del bundle (y en cada frame que analices), y luego
				nombra los packs en <code>engineOptions.packs</code> como <code>name@version</code>. O bien
				distribuye un solo archivo con <code>buildBrowserBundle({"{ packs }"})</code>: el bundle con
				los packs registrados a continuación. El código de las reglas se escribe en el script como
				funciones, así que se ejecuta donde una Content Security Policy prohíbe <code>eval</code>.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// In Node: write the script once, beside the bundle.",
					"const fs = require('node:fs');",
					"const { packScript } = require('@surea11y/core/pack');",
					"const acmePolicy = require('./acme-policy-pack');",
					"fs.writeFileSync('acme-pack.js', packScript([acmePolicy]));",
				]}
			/>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="node_modules/@surea11y/core/surea11y.browser.js"></script>',
					'<script src="acme-pack.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(location.href, null, {",
					"    packs: ['@acme/a11y-policy@1.0.0'],",
					"    profile: 'acme-web-2026'",
					"  }, null);",
					"</script>",
				]}
			/>
			<p>
				La página ejecuta exactamente el conjunto de packs que registró una llamada a{" "}
				<code>packScript</code>, con el core con el que se preparó: pasa a una sola llamada todos
				los packs que necesita un análisis. Los packs nombrados que la página no ejecuta se
				enumeran en <code>skippedPacks</code> con el motivo. Las integraciones hacen todo esto por ti
				con <code>.withPacks()</code>.
			</p>

			<h2 id="waiting-for-the-page">Esperar a la página antes de un análisis</h2>
			<p>
				Un análisis lee la página tal como está en ese momento. En una página recién abierta, las
				fuentes web pueden seguir cargándose y las imágenes pueden no haber llegado, así que la
				misma página analizada un segundo después puede dar otro resultado. El análisis lo registra
				en <code>engine.environment.fonts</code> y <code>.images</code> (consulta{" "}
				<a href="/results-reports/output-schema/">el esquema de salida</a>), pero la mejor
				solución es no analizar hasta que la página se haya asentado.
			</p>
			<p>
				<code>waitForPageReady(options)</code> se encarga de esa espera, y el bundle la expone en
				el mismo global. El análisis nunca la llama por sí mismo; llámala justo antes de analizar.
				Espera al evento <code>load</code> de la ventana, a <code>document.fonts.ready</code> y a
				cada imagen que siga cargándose (salvo las de <code>loading="lazy"</code>), como máximo{" "}
				<code>timeoutMs</code> (por defecto <code>5000</code>). Nunca se rechaza: cuando se agota
				el tiempo, se resuelve igualmente con <code>ready: false</code> e indica qué seguía
				pendiente.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const ready = await a11ycore.waitForPageReady({ timeoutMs: 3000 });",
					"const result = a11ycore.runa11yCoreInPage(location.href, null, {}, null);",
				]}
			/>
			<p>
				Un driver que manejes tú mismo puede enviarla a la página igual que{" "}
				<code>runa11yCoreInPage</code>: <code>page.evaluate(waitForPageReady, {"{ timeoutMs: 5000 }"})</code>.
				En jsdom no hay nada que esperar, así que se resuelve de inmediato con{" "}
				<code>ready: true</code>. Las demás opciones (<code>quietMs</code>, <code>document</code>)
				y el valor de retorno completo están en{" "}
				<a href={`${core}/docs/INTEGRATION.md#waiting-for-the-page-before-a-scan`}>
					<code>INTEGRATION.md</code>
				</a>
				, la guía de integración en GitHub.
			</p>

			<h2 id="a-time-limit-on-a-scan">Un límite de tiempo para un análisis</h2>
			<p>
				Un análisis se ejecuta de una sola vez dentro de la página, y nada en la página puede
				detenerlo una vez iniciado: un getter de la página o una regla que nunca termina bloquea esa
				pestaña para siempre. Limita el tiempo desde donde inicias el análisis, y abandona la pestaña
				cuando pase el límite. 60 segundos está muy por encima de lo que tarda una página normal, así
				que solo atrapa las que están rotas:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// Playwright or Puppeteer: page.evaluate has no time limit of its own.",
					"async function scanWithin(page, ms, scan) {",
					"  let timer;",
					"  const late = new Promise((_, reject) => {",
					"    timer = setTimeout(() => reject(new Error(`the scan took longer than ${ms} ms`)), ms);",
					"  });",
					"  try {",
					"    return await Promise.race([scan(), late]);",
					"  } catch (err) {",
					"    // The tab may still be busy with the scan: close it, and use a new one.",
					"    await page.close().catch(() => {});",
					"    throw err;",
					"  } finally {",
					"    clearTimeout(timer);",
					"  }",
					"}",
					"",
					"const fs = require('node:fs');",
					"await page.evaluate(fs.readFileSync(require.resolve('@surea11y/core/browser'), 'utf8'));",
					"const result = await scanWithin(page, 60_000, () =>",
					"  page.evaluate(() => window.a11ycore.runa11yCoreInPage(location.href, null, {}, null))",
					");",
				]}
			/>
			<p>
				En jsdom el análisis se ejecuta en el propio hilo de Node, así que un temporizador ahí no
				puede dispararse hasta que termine: ejecuta el análisis en un worker thread o en un proceso
				hijo, y termínalo cuando pase el límite. El propio límite de tiempo de un trabajo de CI es el
				último recurso en ambos casos.
			</p>
		</>
	);
}
