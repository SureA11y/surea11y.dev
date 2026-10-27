import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

export function CiIntegrationContent() {
	return (
		<>
			<p>
				Des modèles prêts à copier qui encapsulent la{" "}
				<a href="https://github.com/SureA11y/cli#readme">CLI</a> (
				<code>npx @surea11y/cli scan ...</code>) dans <span lang="en">GitHub Actions</span>, <span lang="en">Bitbucket Pipelines</span>, <span lang="en">GitLab CI</span> et <span lang="en">Azure DevOps</span>. Si
				vous appelez la bibliothèque directement depuis votre propre script Node plutôt que via la
				CLI, consultez plutôt{" "}
				<a href={`${core}/docs/INTEGRATION.md#ci-gating-a-build-on-the-result`}>
					<code>INTEGRATION.md</code>
				</a>{"\u00a0"}: cette page porte spécifiquement sur la CLI utilisée comme étape de pipeline.
			</p>
			<p>
				La CLI analyse du HTML statique : elle n’exécute pas le JavaScript de la page. Cela convient
				aux pages générées ou rendues côté serveur ; pour une application rendue côté client, ou
				pour les règles qui ont besoin de la mise en page, analysez plutôt dans un navigateur avec
				l’un des <a href="/getting-started/">bindings de navigateur</a>.
			</p>
			<p>
				Tous reposent sur les codes de sortie de la CLI (<code>0</code> si aucun <code>fail</code>,{" "}
				<code>1</code> s’il y a au moins un résultat <code>fail</code> (ou au moins un{" "}
				<em>nouveau</em> avec <code>--baseline</code>), <code>2</code> en cas d’erreur
				d’utilisation ou d’analyse) pour contrôler le pipeline ; aucun script supplémentaire n’est
				nécessaire pour un contrôle réussite/échec de base. Un pipeline au vert signifie qu’aucune
				vérification n’a échoué, ou qu’aucune nouvelle n’a échoué. Ce n’est pas une déclaration de
				conformité, et les constats <code>cantTell</code> ne le font pas échouer.
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
					"          node-version: 22",
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
				Une baseline empêche les violations connues de faire échouer le build ; elle ne les rend
				pas acceptables. Corrigez-les et réduisez le fichier au fil du temps. Voir{" "}
				<a href="/conformance/baseline/">Baseline / allowlist</a> pour ce qui compte comme
				« connu » ou « nouveau », et pour régénérer le fichier au fil des corrections.
			</p>

			<h3>Envoyer le SARIF vers <span lang="en">GitHub Code Scanning</span></h3>
			<p>
				<code>upload-sarif</code> nécessite la permission <code>security-events: write</code> et{" "}
				<strong>ne fait pas échouer le job lui-même</strong> : associez-le à une étape de contrôle
				distincte (ou à <code>continue-on-error</code> et votre propre vérification) si vous voulez
				aussi que le build échoue sur les nouvelles violations.
			</p>
			<p>
				Les constats qui penchent vers l’échec sont par défaut des alertes <code>warning</code>.
				Rendus avec <code>{"renderSarifReport(result, { leanFailAs: 'error' })"}</code> depuis{" "}
				<code>@surea11y/core/sarif</code>, ce sont des <code>error</code>, si bien qu’un contrôle
				sur les erreurs s’arrête aussi sur les échecs probables (
				<a href="/results-reports/sarif-report/#options">options SARIF</a>) ; une baseline écrite
				avec <code>{"buildBaselineEntries(result, { leanFail: true })"}</code> accepte ceux
				qu’une page a déjà (
				<a href="/conformance/baseline/#findings-that-lean-fail">constats qui penchent vers
				l’échec</a>).
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
					"          node-version: 22",
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
					"          image: node:22",
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

			<h2 id="junit-test-reports">Rapports de tests JUnit</h2>
			<p>
				GitLab, Azure DevOps, Jenkins et CircleCI affichent le JUnit XML dans leurs propres vues de
				tests : chaque critère WCAG devient une suite et chaque règle un test (voir{" "}
				<a href="/results-reports/junit-report/">le rapport JUnit</a>). La CLI l’écrit avec{" "}
				<code>--junit &lt;path&gt;</code> (<code>@surea11y/cli</code> 1.1.0 ou ultérieure), à
				partir de la même analyse que ses autres sorties, et le rapport ne change jamais son code
				de sortie : l’étape contrôle donc toujours le build.
			</p>
			<h3><span lang="en">GitLab CI</span></h3>
			<CodeBlock
				lang="yaml"
				lines={[
					"a11y:",
					"  image: node:22",
					"  script:",
					"    - npm ci",
					"    - npm run build",
					"    - npx @surea11y/cli scan ./dist/index.html --junit a11y.junit.xml",
					"  artifacts:",
					"    when: always",
					"    reports:",
					"      junit: a11y.junit.xml",
				]}
			/>
			<p>
				<code>when: always</code> envoie le rapport même quand le code de sortie de l’analyse fait
				échouer le job, c’est-à-dire précisément quand le widget de la merge request mérite d’être
				lu.
			</p>
			<h3><span lang="en">Azure DevOps</span></h3>
			<CodeBlock
				lang="yaml"
				lines={[
					"steps:",
					"  - script: |",
					"      npm ci",
					"      npm run build",
					"      npx @surea11y/cli scan ./dist/index.html --junit a11y.junit.xml",
					"    displayName: Accessibility scan",
					"  - task: PublishTestResults@2",
					"    condition: succeededOrFailed()",
					"    inputs:",
					"      testResultsFormat: JUnit",
					"      testResultsFiles: a11y.junit.xml",
				]}
			/>
			<p>
				Les règles <code>cantTell</code> arrivent sous forme de tests ignorés, jamais d’échecs. Avec{" "}
				<code>--baseline</code>, les échecs déjà présents dans la baseline sont aussi des tests
				ignorés. Pour afficher les règles <code>cantTell</code> comme des échecs, la CLI n’a pas
				d’option : enregistrez l’analyse avec <code>--json</code> et produisez le rapport avec{" "}
				<code>{"renderJunitReport(result, { cantTellAs: 'failure' })"}</code> depuis{" "}
				<code>@surea11y/core/junit</code> (voir{" "}
				<a href="/results-reports/junit-report/">le rapport JUnit</a>), ce qui demande{" "}
				<code>@surea11y/core</code> dans les <code>devDependencies</code> du projet lui-même.{" "}
				<code>{"{ leanFailAs: 'failure' }"}</code> est le choix le plus étroit : seuls les
				constats <code>cantTell</code> qui{" "}
				<a href="/results-reports/output-schema/#leans">penchent vers l’échec</a> deviennent des
				échecs, chacun avec sa raison et les étapes pour le confirmer. L’un comme l’autre
				modifie le rapport, pas le code de sortie de la CLI.
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
