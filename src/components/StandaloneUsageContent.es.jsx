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
				Los argumentos son los mismos que en cualquier otro sitio. Un análisis limitado
				a una región y a WCAG 2.2 A y AA, que deja fuera dos widgets ruidosos:
			</p>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="node_modules/@surea11y/core/surea11y.browser.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(",
					"    location.href,",
					"    '#main', // contextSelector: scan only this region",
					"    {",
					"      excludeSelectors: ['#cookie-banner', '.intercom-launcher'],",
					"      contrast: { mode: 'auditorAssist' } // trade some false-positive protection for more findings",
					"    },",
					"    { wcag: { version: '2.2', level: 'AA' } } // runOnly",
					"  );",
					"</script>",
				]}
			/>
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
				Para pruebas, <code>runa11yCoreOnHtml(html, options)</code> de{" "}
				<code>@surea11y/core/testing</code> analiza una cadena HTML en jsdom y prepara
				el documento por ti; desde core 1.12, su opción <code>contentType</code>{" "}
				interpreta un documento SVG o XHTML como lo que es.
			</p>

			<h2 id="packs-in-a-page">Packs en una página</h2>
			<p>
				Un <a href="/configuration/packs/">pack</a> se prepara en Node, así que llega a una página
				como script. Para una página que carga sus scripts como archivos (una etiqueta{" "}
				<code>&lt;script&gt;</code>, un bookmarklet, una extensión), genera un solo archivo en Node:{" "}
				<code>buildBrowserBundle({"{ packs }"})</code>, de <code>@surea11y/core/pack</code>, es el
				bundle con los packs registrados a continuación. Luego nombra los packs en{" "}
				<code>engineOptions.packs</code> como <code>name@version</code>. El código de las reglas se
				escribe en el script como funciones, así que se ejecuta donde una Content Security Policy
				prohíbe <code>eval</code>.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// In Node, once per release of core or of a pack.",
					"const fs = require('node:fs');",
					"const { buildBrowserBundle } = require('@surea11y/core/pack');",
					"const acmePolicy = require('./acme-policy-pack');",
					"fs.writeFileSync('surea11y-acme.js', buildBrowserBundle({ packs: [acmePolicy] }));",
				]}
			/>
			<CodeBlock
				lang="html"
				lines={[
					'<script src="surea11y-acme.js"></script>',
					"<script>",
					"  const result = a11ycore.runa11yCoreInPage(location.href, null, {",
					"    packs: ['@acme/a11y-policy@1.0.0'],",
					"    profile: 'acme-web-2026'",
					"  }, null);",
					"</script>",
				]}
			/>
			<p>
				El script de un pack solo se ejecuta con el core que lo escribió: lleva el catálogo que
				forman core y los packs, comprobado en Node. Una página cuyo bundle es de otra versión de
				core ejecuta el análisis sin los packs y enumera cada uno en <code>skippedPacks</code>,
				nombrando las dos versiones. Un solo archivo contiene ambos, así que no pueden desfasarse.
				Vuelve a generarlo cuando actualices core o un pack, y actualiza el{" "}
				<code>name@version</code> que nombra la página.
			</p>
			<p>
				Si el bundle de core ya está en la página, escribe <code>packScript(packs)</code> en un
				archivo con el mismo core y cárgalo después del bundle (y en cada frame que analices):
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// In Node, with the core whose bundle the page loads.",
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
				Analizar de todos modos, esperar más o detenerse es decisión tuya; si analizas,
				guarda junto al resultado lo que seguía pendiente.
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
				cuando pase el límite: tu límite de tiempo detiene la espera, no el script que se ejecuta en la página. 60 segundos está muy por encima de lo que tarda una página normal, así
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

			<h2 id="internals-hook">Componentes web con internals privados</h2>
			<p>
				Un elemento personalizado puede darse un nombre, fijar sus estados y asignarse
				un rol a través de <code>ElementInternals</code>. Muchos guardan sus internals
				en un campo privado, donde ningún script puede volver a leerlos, así que el
				análisis pregunta por ese elemento (<code>cantTell</code>) en lugar de juzgarlo,
				y no ve en absoluto un rol asignado así.
			</p>
			<p>
				<code>internalsHookScript()</code>, de <code>@surea11y/core</code> (no del
				bundle), devuelve un script que registra los internals de cada elemento a medida
				que la página los adjunta, para que el análisis pueda leerlos. Es opcional: core
				nunca lo instala. Instálalo antes de los scripts propios de la página, en cada
				frame que analices: con la API de scripts de inicio de tu driver o, en una
				página que construyas tú, como el primer <code>&lt;script&gt;</code> de{" "}
				<code>&lt;head&gt;</code>. En un archivo de configuración de jsdom, que se
				ejecuta cuando el documento ya se ha cargado pero antes de que se defina ningún
				componente, pasa <code>{"{ early: true }"}</code>:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { internalsHookScript } = require('@surea11y/core');",
					"",
					"// Playwright",
					"await page.addInitScript({ content: internalsHookScript() });",
					"",
					"// Puppeteer",
					"await page.evaluateOnNewDocument(internalsHookScript());",
					"",
					"// jest.setup.js or vitest.setup.js, before any component is imported",
					"window.eval(internalsHookScript({ early: true }));",
				]}
			/>
			<p>
				El resultado indica si estaba, en <code>engine.environment.internalsHook</code>:{" "}
				<code>'early'</code> cuando se instaló antes de los scripts de la página,{" "}
				<code>'late'</code> cuando se instaló después y solo ve lo que la página adjunta
				a partir de entonces. Cualquier script de la página puede leer lo que registra
				el hook, así que los internals privados de un componente dejan de serlo:
				instálalo para ejecuciones de prueba y de auditoría, no en páginas que sirvas a
				usuarios. Las demás formas de instalarlo, y lo que una página puede notar, están
				en{" "}
				<a href={`${core}/docs/INTEGRATION.md#reading-private-elementinternals-the-internals-hook`}><code>INTEGRATION.md</code></a>.
			</p>

			<h2 id="what-a-scan-covers">Saber qué cubre un análisis</h2>
			<p>
				Una herramienta que informa por criterio de WCAG y permite a sus usuarios elegir
				comprobaciones puede indicar para qué objetivo es el análisis:{" "}
				<code>engineOptions.wcagLevel</code>, junto a <code>wcagVersion</code>, deja
				fuera los criterios por encima de ese nivel sin cambiar qué comprobaciones se
				ejecutan. <code>getRulesForRunOnly(runOnly, engineOptions)</code> enumera los
				criterios de los que informa un análisis con esa selección, antes de ejecutarlo,
				con la misma lógica del análisis:
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { getRulesForRunOnly, runDomRulesInPage } = require('@surea11y/core');",
					"",
					"const engineOptions = { wcagVersion: '2.2', wcagLevel: 'AA' };",
					"const runOnly = { includeRuleIds: ['contrast-computable'] };",
					"",
					"getRulesForRunOnly(runOnly, engineOptions).map((r) => r.id); // before the scan",
					"const result = runDomRulesInPage(url, null, engineOptions, runOnly);",
				]}
			/>
			<p>
				Un criterio del que solo se ejecutaron algunas comprobaciones vuelve como{" "}
				<code>cantTell</code>, con cada comprobación que no se ejecutó marcada como{" "}
				<code>notSelected: true</code>: muéstralo como comprobado en parte, nunca como
				superado. Cómo crear una herramienta propia sobre core (una CLI, una integración
				de CI, un panel, un generador de informes de conformidad) se explica en{" "}
				<a href={`${core}/docs/BUILDING_ON_CORE.md`}><code>BUILDING_ON_CORE.md</code></a>,
				en GitHub: en qué puedes confiar, cómo ejecutar análisis, elegir comprobaciones,
				presentar los resultados con honestidad y comparar ejecuciones.
			</p>
		</>
	);
}
