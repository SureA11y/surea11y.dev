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
				<strong>Le bundle ne contient que l’anglais.</strong> Chaque autre langue est fournie à
				côté, dans son propre fichier : chargez ce fichier après le bundle et la langue devient
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
				Si vous demandez une langue dont vous n’avez pas chargé le fichier, vous obtenez
				l’anglais, pas une erreur. Voir <a href="/configuration/locales/">Langues</a>.
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
				l’autre voie autonome : ce sont les <span lang="en">Pattern 1</span> et <span lang="en">Pattern 2</span> de{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>, à savoir jsdom
				dans Node sans vrai navigateur, ou piloter vous-même Puppeteer/Playwright au lieu de
				passer par un binding.
			</p>

			<h2 id="waiting-for-the-page">Attendre la page avant une analyse</h2>
			<p>
				Une analyse lit la page telle qu’elle est à cet instant. Sur une page qui vient de
				s’ouvrir, les polices web peuvent encore se charger et les images ne pas être arrivées :
				la même page analysée une seconde plus tard peut donner un autre résultat. L’analyse le
				consigne dans <code>engine.environment.fonts</code> et <code>.images</code> (voir{" "}
				<a href="/results-reports/output-schema/">le schéma de sortie</a>), mais le mieux est de
				ne pas analyser avant que la page se soit stabilisée.
			</p>
			<p>
				<code>waitForPageReady(options)</code> se charge de cette attente, et le bundle la place
				sur le même global. L’analyse ne l’appelle jamais elle-même ; appelez-la juste avant
				d’analyser. Elle attend l’évènement <code>load</code> de la fenêtre,{" "}
				<code>document.fonts.ready</code> et chaque image encore en cours de chargement (sauf
				celles en <code>loading="lazy"</code>), pendant au plus <code>timeoutMs</code> (par
				défaut <code>5000</code>). Elle ne rejette jamais : quand le temps est écoulé, elle se
				résout quand même avec <code>ready: false</code> et indique ce qui était encore en
				attente.
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const ready = await a11ycore.waitForPageReady({ timeoutMs: 3000 });",
					"const result = a11ycore.runa11yCoreInPage(location.href, null, {}, null);",
				]}
			/>
			<p>
				Un driver que vous pilotez vous-même peut l’envoyer dans la page comme{" "}
				<code>runa11yCoreInPage</code> :{" "}
				<code>page.evaluate(waitForPageReady, {"{ timeoutMs: 5000 }"})</code>. Sous jsdom, il n’y
				a rien à attendre : elle se résout aussitôt avec <code>ready: true</code>. Les autres
				options (<code>quietMs</code>, <code>document</code>) et la valeur de retour complète
				sont dans{" "}
				<a href={`${core}/docs/INTEGRATION.md#waiting-for-the-page-before-a-scan`}>
					<code>INTEGRATION.md</code>
				</a>
				, le guide d’intégration sur GitHub.
			</p>
		</>
	);
}
