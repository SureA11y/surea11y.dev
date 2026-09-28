import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function CliUsageContent() {
	return (
		<>
			<p>
				Une commande plutôt que du code : pas de framework de test ni de script Node nécessaire,
				idéal pour une étape de pipeline ou une vérification rapide d’un artefact de build.
			</p>

			<h2>Première analyse</h2>
			<CodeBlock
				lines={[
					{ text: "npm install -g @surea11y/cli", command: true },
					{ text: "surea11y scan ./index.html", command: true },
					{ text: "surea11y scan https://example.com/ --tags wcag2a,wcag2aa", command: true },
				]}
			/>
			<p>
				Nécessite Node.js <code>^20.19.0 || ^22.13.0 || &gt;=24.0.0</code>.
			</p>
			<CodeBlock
				lines={[
					"$ surea11y scan ./index.html",
					"",
					"surea11y scan: file:///path/to/index.html",
					"  pass: 6   fail: 3   cantTell: 4   notApplicable: 112",
					"",
					"  occurrences by tier: fail: 3   cantTell: 5",
					"",
					"FAIL (3 rule(s)):",
					"",
					"  contrast-minimum  (serious, 1 fail occurrence(s))",
					"    - html > body > main > p",
					"      Element has insufficient color contrast of 2.85:1 (foreground: #999999,",
					"      background: #ffffff, font size: 0px, font weight: normal). Expected",
					"      contrast ratio of 4.5:1 (normal text).",
					"",
					"cantTell — needs human review (4 rule(s)): contrast-computable, link-name-quality,",
					"manual-review, page-title-patterns",
				]}
			/>
			<h2>Limites</h2>
			<p>
				<code>cantTell</code> n’affecte jamais le code de sortie : <code>0</code> si tout est
				propre, <code>1</code> s’il y a au moins un <code>fail</code> (ou, avec{" "}
				<code>--baseline</code>, au moins un <code>fail</code> <em>nouveau</em> : c’est le cas du
				contrôle en CI ; voir <a href="/conformance/baseline/">Baseline / allowlist</a> pour ce
				qui compte comme « connu » ou « nouveau »), <code>2</code> en cas d’erreur d’utilisation
				ou d’analyse. La CLI lit <strong>uniquement du HTML statique</strong>, qu’il s’agisse d’un
				fichier local ou du corps brut d’une requête HTTP(S) GET, et n’exécute jamais le
				JavaScript de la page. Pour les pages rendues côté client, utilisez plutôt l’un des
				bindings, ou appelez directement le moteur dans un vrai navigateur piloté (voir{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>, <span lang="en">Pattern 2</span>).
			</p>
			<p>
				Référence complète des flags, contrat des règles personnalisées et recettes de CI :{" "}
				<a href="https://github.com/SureA11y/cli/blob/main/docs/CLI.md"><code>docs/CLI.md</code></a>.
				Pour les modèles de pipeline de CI en particulier, voir{" "}
				<a href="/configuration/ci-integration/">Intégration CI</a>.
			</p>
		</>
	);
}
