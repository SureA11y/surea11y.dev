import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function CiIntegrationContent() {
	return (
		<>
			<p>
				Des modèles prêts à copier qui encapsulent la{" "}
				<a href="https://github.com/SureA11y/cli#readme">CLI</a> (
				<code>npx @surea11y/cli scan ...</code>) dans <span lang="en">GitHub Actions</span> et <span lang="en">Bitbucket Pipelines</span>. Si
				vous appelez la bibliothèque directement depuis votre propre script Node plutôt que via la
				CLI, consultez plutôt{" "}
				<a href={`${core}/docs/INTEGRATION.md#ci-gating-a-build-on-the-result`}>
					<code>INTEGRATION.md</code>
				</a>{"\u00a0"}: cette page porte spécifiquement sur la CLI utilisée comme étape de pipeline.
			</p>
			<p>
				Tous reposent sur les codes de sortie de la CLI (<code>0</code> si aucun <code>fail</code>,{" "}
				<code>1</code> s’il y a au moins un résultat <code>fail</code> (ou au moins un{" "}
				<em>nouveau</em> avec <code>--baseline</code>), <code>2</code> en cas d’erreur
				d’utilisation ou d’analyse) pour contrôler le pipeline ; aucun script supplémentaire n’est
				nécessaire pour un contrôle réussite/échec de base.
			</p>

			<h2><span lang="en">GitHub Actions</span></h2>
			<h3>Base : contrôle par le code de sortie</h3>
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
				Le job échoue dès qu’un résultat <code>fail</code> est trouvé. Pour un site existant qui
				comporte déjà des violations, utilisez la variante avec baseline ci-dessous plutôt que de
				désactiver l’étape.
			</p>

			<h3>Avec une baseline (site existant, contrôle uniquement sur les nouvelles violations)</h3>
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
				Voir <a href="/conformance/baseline/">Baseline / allowlist</a> pour ce qui compte comme
				« connu » ou « nouveau », et pour régénérer le fichier au fil des corrections.
			</p>

			<h3>Envoyer le SARIF vers <span lang="en">GitHub Code Scanning</span></h3>
			<p>
				<code>upload-sarif</code> nécessite la permission <code>security-events: write</code> et{" "}
				<strong>ne fait pas échouer le job lui-même</strong> : associez-le à une étape de contrôle
				distincte (ou à <code>continue-on-error</code> et votre propre vérification) si vous voulez
				aussi que le build échoue sur les nouvelles violations.
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
				Voir <a href="/results-reports/sarif-report/">le format du rapport SARIF</a>, ainsi qu’une
				limite connue : l’analyse d’un <strong>fichier local</strong> de votre checkout produit des
				annotations en ligne dans l’interface de <span lang="en">Code Scanning</span>, celle d’une{" "}
				<strong>URL en ligne</strong> non (SARIF/<span lang="en">Code Scanning</span> ne peut associer un résultat qu’à un
				vrai fichier du dépôt).
			</p>

			<h2><span lang="en">Bitbucket Pipelines</span></h2>
			<p>
				<span lang="en">Bitbucket Pipelines</span> n’a pas de tableau de bord intégré exploitant SARIF équivalent à{" "}
				<span lang="en">GitHub Code Scanning</span> ; le point d’intégration pratique est donc le code de sortie de la CLI (plus,
				éventuellement, <code>--html</code> comme artefact de pipeline téléchargeable) plutôt que{" "}
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
				L’étape fait échouer le pipeline selon le code de sortie de la CLI, exactement comme toute
				autre entrée <code>script</code> ; <code>a11y-report.html</code> (voir{" "}
				<a href="/results-reports/html-report/">le rapport HTML</a>) est joint comme artefact de build
				téléchargeable, pour qu’un relecteur puisse l’ouvrir sans relancer l’analyse en local.
			</p>

			<h2>Limites de minutes des offres gratuites et dépôts privés</h2>
			<p>
				Si l’offre gratuite de votre fournisseur de pipelines est limitée en minutes (celle de{" "}
				<span lang="en">Bitbucket Pipelines</span> est par exemple de 50 minutes de build par mois sur les espaces de
				travail privés), une analyse basée sur <code>jsdom</code> de HTML statique ou rendu côté
				serveur (ce que fait la CLI) coûte bien moins cher que de piloter un vrai navigateur ; voir{" "}
				<a href="https://github.com/SureA11y/cli/blob/main/docs/CLI.md#what-it-can-and-cant-scan">
					la documentation de la CLI
				</a>{" "}
				pour ce à quoi vous renoncez (pas de contenu rendu côté client, pas de vraie mise en page
				CSS).
			</p>
		</>
	);
}
