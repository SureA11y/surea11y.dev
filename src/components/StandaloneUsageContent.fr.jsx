import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function StandaloneUsageContent() {
	return (
		<>
			<h2>Quand l’utiliser</h2>
			<p>
				Pour une vérification manuelle d’une page ouverte dans un vrai navigateur, un
				bookmarklet, ou tout autre contexte sans pilote d’automatisation ni étape de build à
				disposition.
			</p>

			<h2>Utilisation</h2>
			<p>
				<code>@surea11y/core</code> fournit <code>surea11y.browser.js</code> à la racine du
				paquet, un bundle généré à partir des mêmes sources de règles que le paquet Node. Le
				charger directement définit une seule variable globale, <code>a11ycore</code> :
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
				<code>a11ycore.runa11yCoreInPage</code> est exactement la même fonction que celle
				qu’appellent les bindings en interne : le bundle sert uniquement à la <em>charger</em>{" "}
				sans <code>require</code> ni système de modules, pas à ajouter une API distincte.
			</p>
			<p>
				<strong>Le bundle ne contient que l’anglais.</strong> Chaque autre locale est fournie à
				côté dans son propre fichier : chargez-en une après le bundle et cette langue devient
				disponible :
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
				Si vous demandez une locale dont vous n’avez pas chargé le fichier, vous obtenez
				l’anglais, pas une erreur. Voir <a href="/configuration/locales/">Paramètres régionaux</a>.
			</p>
			<p>
				<strong>Délibérément exclus du bundle</strong> :{" "}
				<code>runa11yCoreAcrossFrames</code>/<code>a11yCoreEnableFrameResponder</code> (l’analyse
				entre frames exige que la frame intégrée charge elle aussi le moteur et donne son accord,
				ce qui ne convient pas à une simple balise script ajoutée à la page). Utilisez directement
				le paquet npm si vous en avez besoin : voir{" "}
				<a href={`${core}/docs/INTEGRATION.md#cross-frame-scanning-including-cross-origin`}>
					<code>INTEGRATION.md</code>
				</a>
				.
			</p>
			<p>
				Appeler directement <code>require('@surea11y/core')</code>, sans aucun binding, est
				l’autre voie standalone : ce sont les <span lang="en">Pattern 1</span> et <span lang="en">Pattern 2</span> de{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>, à savoir jsdom
				dans Node sans vrai navigateur, ou piloter vous-même Puppeteer/Playwright au lieu de
				passer par un binding.
			</p>
		</>
	);
}
