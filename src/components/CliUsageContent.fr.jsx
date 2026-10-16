import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";
const cliDocs = "https://github.com/SureA11y/cli/blob/main/docs/CLI.md";

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
					{ text: "surea11y scan https://example.com/ --wcag 2.2", command: true },
				]}
			/>
			<p>
				Nécessite Node.js <code>^20.19.0 || ^22.13.0 || &gt;=24.0.0</code>. Le résumé nomme la
				version de <code>@surea11y/core</code> qui a exécuté l’analyse :
			</p>
			<CodeBlock
				lines={[
					"$ surea11y scan ./index.html",
					"",
					"surea11y scan: file:///path/to/index.html",
					"  engine: @surea11y/core 1.12.0",
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
					"",
					"criteria (WCAG 2.2):",
					"  fail       1.1.1 Non-text content: text alternatives; 1.4.3 Contrast: minimum;",
					"             1.4.6 Contrast: enhanced; 4.1.2 Name, role, value: accessible name",
					"  cantTell   2.1.1 Keyboard; 2.4.2 Page titled; 2.4.3 Focus order; 2.4.4 Link",
					"             Purpose (In Context); 2.4.7 Focus visible; 2.4.9 Link Purpose (Link Only)",
					"  pass       1.3.1 Info and Relationships; 2.2.2 Pause, Stop, Hide; 2.4.1 Bypass",
					"             Blocks; 3.1.1 Language of page; 4.1.2 Name, role, value: ARIA validity",
					"  notApplicable: 19",
					"  A criterion that passes here means the checks that ran found nothing in it, not",
					"  that the page conforms.",
				]}
			/>
			<p>
				Le bloc <code>criteria</code> lit la même analyse par critère WCAG, comme on
				pose d’habitude la question (« échoue-t-elle au 1.4.3 ? ») : d’abord{" "}
				<code>fail</code>, puis <code>cantTell</code> et <code>pass</code>, et le nombre
				de critères <code>notApplicable</code>. Un critère qui passe signifie que les
				vérifications exécutées n’y ont rien trouvé, pas que la page le respecte : la
				plupart des critères demandent qu’une personne les vérifie. Le bloc ne change
				jamais le code de sortie, et <code>--compact</code> l’affiche sous forme de
				décomptes.
			</p>

			<h2 id="choosing-what-runs">Choisir ce qui s’exécute</h2>
			<p>
				<code>--wcag</code> sélectionne les règles d’une cible de conformité WCAG, selon le niveau
				de chaque critère dans cette version ; <code>--wcag-level</code> fixe son niveau (
				<code>AA</code> sauf indication contraire). <code>--best-practices</code> ajoute les règles
				qui ne testent aucun critère WCAG, comme <code>region</code> et{" "}
				<code>heading-order</code> ; seule, elle n’exécute que celles-ci. <code>--profile</code>{" "}
				exécute un profil de conformité, comme <code>en301549-v4.1.1</code> ou celui d’un pack.
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --wcag 2.2                    # WCAG 2.2, Level A and AA", command: true },
					{ text: "surea11y scan ./dist/index.html --wcag 2.1 --wcag-level A     # WCAG 2.1, Level A", command: true },
					{ text: "surea11y scan ./dist/index.html --wcag 2.2 --best-practices   # and the best practices", command: true },
				]}
			/>
			<p>
				4.1.1 Analyse syntaxique, que WCAG 2.2 a retiré, fait partie d’une cible <code>2.1</code>{" "}
				et non d’une cible <code>2.2</code>. <code>--rules</code> et <code>--tags</code> s’ajoutent
				aux règles d’une cible, et <code>--exclude-rules</code> s’applique ensuite. À côté de{" "}
				<code>--profile</code>, <code>--best-practices</code> ajoute ses règles et le profil
				s’applique toujours ; <code>--wcag</code>, <code>--rules</code> et <code>--tags</code>{" "}
				choisissent les règles à la place d’un profil : <code>--profile</code> combiné à l’un
				d’eux se termine donc avec le code <code>2</code>. Ces flags correspondent à{" "}
				<code>runOnly.wcag</code>, <code>runOnly.bestPractices</code> et{" "}
				<code>engineOptions.profile</code> (voir{" "}
				<a href="/configuration/engine-options/#selecting-which-rules-run">Options du moteur</a>).
			</p>

			<h2 id="naming-checks">Nommer vous-même les vérifications</h2>
			<p>
				Quand les deux sont donnés, <code>--rules</code> et <code>--tags</code>{" "}
				exécutent les règles qui correspondent aux deux. Pour dire « ce domaine, plus
				ces vérifications », passez <code>--include-mode or</code>, qui exécute les
				règles qui correspondent à l’un ou à l’autre. Sans lui, l’analyse ci-dessous
				n’exécute aucune règle, puisque <code>contrast-computable</code> ne porte pas
				l’étiquette <code>forms</code>, et se termine avec <code>2</code> plutôt que de
				réussir sans rien vérifier.
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/form.html --tags forms --rules contrast-computable --include-mode or", command: true },
				]}
			/>
			<p>
				Une analyse qui nomme des vérifications rapporte les critères WCAG auxquels
				elles appartiennent, à tous les niveaux. <code>contrast-computable</code>{" "}
				vérifie le 1.4.3 (AA) et le 1.4.6 (AAA), si bien qu’un site conforme au niveau
				AA peut afficher en échec un critère AAA qu’il n’a jamais visé. Sans{" "}
				<code>--wcag</code>, <code>--wcag-level</code> fixe le niveau des critères
				rapportés, sans changer les règles exécutées :
			</p>
			<CodeBlock
				lines={[
					"$ surea11y scan ./index.html --rules contrast-computable --wcag-level AA",
					"",
					"surea11y scan: file:///path/to/index.html",
					"  engine: @surea11y/core 1.12.0",
					"  WCAG level reported: AA",
					"  pass: 0   fail: 0   cantTell: 1   notApplicable: 0",
					"",
					"  occurrences by tier: fail: 0   cantTell: 2",
					"",
					"cantTell — needs human review (1 rule(s)): contrast-computable",
					"",
					"criteria (WCAG 2.2 AA):",
					"  cantTell   1.4.3 Contrast: minimum (partly checked: 1 of 2 checks not selected)",
					"  A criterion that passes here means the checks that ran found nothing in it, not",
					"  that the page conforms.",
				]}
			/>
			<p>
				Le 1.4.3 est <em>vérifié en partie</em> : son autre vérification,{" "}
				<code>contrast-minimum</code>, n’a pas été sélectionnée, donc son résultat ne
				couvre que la vérification exécutée. Les identifiants de règle et les niveaux
				sont lus sans tenir compte de la casse (<code>--rules IMG-ALT-PRESENT</code>,{" "}
				<code>--wcag-level aa</code>). <code>--include-mode</code> correspond à{" "}
				<code>engineOptions.includeMode</code>, et <code>--wcag-level</code> sans{" "}
				<code>--wcag</code> à <code>engineOptions.wcagLevel</code>.
			</p>

			<h2 id="packs">Packs</h2>
			<p>
				<code>--pack</code> charge un <a href="/configuration/packs/">pack</a> (des règles, une
				norme ou une liste de contrôle, avec leurs profils) par nom de paquet, résolu depuis le
				projet du répertoire de travail, ou par chemin ; <code>--profile</code> exécute l’un de
				ses profils. Répétez <code>--pack</code> pour analyser avec plusieurs packs.
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --pack @acme/a11y-policy --profile acme-web-2026", command: true },
					{ text: "surea11y scan ./dist/index.html --pack ./acme-policy-pack.js --profile acme-web-2026", command: true },
				]}
			/>
			<p>
				Le résumé nomme le profil et les packs qui se sont exécutés, et <code>--json</code> les
				contient sous <code>engine.profile</code> et <code>engine.packs</code>. Un pack
				introuvable ou impossible à charger, ou que le moteur ignore, termine la commande avec le
				code <code>2</code> sans écrire de rapport, si bien qu’une analyse ne réussit jamais sans
				que les vérifications du pack aient été exécutées.
			</p>

			<h2 id="compact-results">Résultats compacts</h2>
			<p>
				<code>--compact</code> réduit chaque résultat <code>pass</code> et{" "}
				<code>notApplicable</code> à sa règle, son résultat et son type (
				<code>engineOptions.output.detail: 'findings'</code>) : un <code>--json</code> plus léger,
				pour un résultat conservé comme artefact de CI. Le résumé, le code de sortie, la baseline
				et les rapports HTML, SARIF et JUnit sont les mêmes que sans cette option.
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --compact --json > result.json", command: true }]} />

			<h2>Codes de sortie et limites</h2>
			<p>
				<code>cantTell</code> n’affecte jamais le code de sortie : <code>0</code> si aucun{" "}
				<code>fail</code>, <code>1</code> s’il y a au moins un <code>fail</code> (ou, avec{" "}
				<code>--baseline</code>, au moins un <code>fail</code> <em>nouveau</em> : c’est le cas du
				contrôle en CI ; voir <a href="/conformance/baseline/">Baseline / allowlist</a> pour ce
				qui compte comme « connu » ou « nouveau »), <code>2</code> en cas d’erreur d’utilisation
				ou d’analyse, ou pour une analyse qui n’aurait rien vérifié ou moins que demandé : une
				liste <code>--rules</code>/<code>--tags</code> qui ne nomme aucune règle ni aucun tag
				connu, un sélecteur <code>--context</code> qui ne correspond à rien, une règle
				personnalisée ou un pack qui ne s’est pas exécuté, un <code>--profile</code> qui n’a pas
				été appliqué. La CLI lit <strong>uniquement du HTML statique</strong>, qu’il s’agisse d’un
				fichier local ou du corps brut d’une requête HTTP(S) GET, et n’exécute jamais le
				JavaScript de la page. Pour les pages rendues côté client, utilisez plutôt l’un des
				bindings, ou appelez directement le moteur dans un vrai navigateur piloté (voir{" "}
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>, <span lang="en">Pattern 2</span>).
			</p>
			<p>
				Référence complète des flags, contrat des règles personnalisées, packs et recettes de CI :{" "}
				<a href={cliDocs}><code>docs/CLI.md</code></a>. Pour les modèles de pipeline de CI en
				particulier, voir <a href="/configuration/ci-integration/">Intégration CI</a>.
			</p>
		</>
	);
}
