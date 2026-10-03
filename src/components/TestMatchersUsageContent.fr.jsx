import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

const apiRows = [
	{
		id: "received",
		param: <code>received</code>,
		type: (
			<>
				<code>Element</code>, <code>Document</code> ou résultat d’analyse
			</>
		),
		meaning: (
			<>
				Ce qu’il faut vérifier. Un <code>Element</code>/<code>Document</code> DOM est analysé
				automatiquement ; un objet de la forme <code>{"{ checksResults: [...] }"}</code> est
				vérifié directement, sans analyse. Toute autre valeur lève une <code>TypeError</code>.
			</>
		),
	},
	{
		id: "engineOptions",
		param: <code>engineOptions</code>,
		type: "objet (facultatif)",
		meaning: (
			<>
				Transmis tel quel à l’analyse de <code>@surea11y/core</code> : le même objet d’options
				que partout ailleurs dans l’écosystème (voir <a href="/configuration/engine-options/">Options du moteur</a>). Ignoré
				lorsque <code>received</code> est déjà un résultat d’analyse.
			</>
		),
	},
];

export function TestMatchersUsageContent() {
	return (
		<>
			<p>
				Pour les tests unitaires et de composants : vérifiez l’accessibilité directement dans une
				suite Jest ou Vitest, sur le DOM dont le test dispose déjà, plutôt que de piloter un
				navigateur réel ou headless. Si vous testez plutôt des pages entièrement rendues, voir{" "}
				<a href="/getting-started/">les bindings pilotant un navigateur</a>.
			</p>
			<p>
				<a href="https://github.com/SureA11y/test-matchers"><code>@surea11y/test-matchers</code></a>{" "}
				est un unique matcher, <code>toHaveNoA11yViolations()</code>,
				qui se branche tel quel sur le <code>expect.extend()</code> de l’un ou l’autre framework :
				il ne contient aucun code propre à un framework. Il analyse l’environnement basé sur jsdom
				dans lequel votre test tourne déjà ; il ne dépend pas lui-même de <code>jsdom</code> et
				n’en met pas en place pour vous. Le moteur de surea11y est synchrone, donc ce matcher
				l’est aussi : pas de <code>await</code>, et donc pas de risque d’en oublier un et de voir
				le test passer en silence sur une promesse résolue.
			</p>
			<CodeBlock lines={[{ text: "npm install --save-dev @surea11y/test-matchers", command: true }]} />

			<h2>Mise en place</h2>
			<p>
				Votre environnement de test doit déjà être basé sur jsdom : ce matcher analyse le{" "}
				<code>document</code>/<code>window</code> qu’il fournit. Enregistrez le matcher une seule
				fois, dans le fichier de setup que votre lanceur de tests charge déjà :
			</p>
			<h3>Jest</h3>
			<CodeBlock
				lang="js"
				lines={[
					"// jest.setup.js",
					"expect.extend({",
					"  toHaveNoA11yViolations: require('@surea11y/test-matchers').toHaveNoA11yViolations",
					"});",
					"",
					"// jest.config.js",
					"module.exports = {",
					"  testEnvironment: 'jsdom',   // or the explicit jest-environment-jsdom package, depending on your Jest version",
					"  setupFilesAfterEnv: ['./jest.setup.js']",
					"};",
				]}
			/>
			<h3>Vitest</h3>
			<CodeBlock
				lang="js"
				lines={[
					"// vitest.setup.js",
					"import { expect } from 'vitest';",
					"import { toHaveNoA11yViolations } from '@surea11y/test-matchers';",
					"",
					"expect.extend({ toHaveNoA11yViolations });",
					"",
					"// vitest.config.js",
					"export default {",
					"  test: {",
					"    environment: 'jsdom',   // Vitest doesn't bundle jsdom -- install it as a devDependency too",
					"    setupFiles: ['./vitest.setup.js']",
					"  }",
					"};",
				]}
			/>
			<p>
				Le <code>.d.ts</code> fourni étend à la fois l’interface globale <code>jest.Matchers</code>{" "}
				de Jest et les interfaces <code>@vitest/expect</code> de Vitest, sans qu’un import de{" "}
				<code>@types/jest</code> ou de <code>vitest</code> soit nécessaire pour le livrer : quel
				que soit le framework réellement installé, seule l’extension correspondante s’applique.
			</p>

			<h2>Utilisation</h2>
			<p>Fonctionne sur un simple nœud DOM :</p>
			<CodeBlock
				lang="js"
				lines={[
					"test('no accessibility violations', () => {",
					"  document.body.innerHTML = '<img src=\"logo.png\">';",
					"",
					"  expect(document.body).toHaveNoA11yViolations(); // fails: missing alt",
					"});",
				]}
			/>
			<p>
				… ou sur n’importe quel <code>container</code> de testing-library (celui de <span lang="en">React Testing
				Library</span>, le <code>wrapper.element</code> de <span lang="en">Vue Test Utils</span>, ceux d’<span lang="en">Angular Testing Library</span>{" "}
				et de <span lang="en">Svelte Testing Library</span>), puisque tous exposent un élément DOM rendu de la même façon :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { render } = require('@testing-library/react');",
					"",
					"test('MyComponent has no accessibility violations', () => {",
					"  const { container } = render(<MyComponent />);",
					"",
					"  expect(container).toHaveNoA11yViolations();",
					"});",
				]}
			/>
			<p>
				Côté lanceur de tests aussi, rien ne dépend du framework : une fois le matcher enregistré,
				les extraits ci-dessus sont identiques sous Jest et sous Vitest.
			</p>

			<h3>Vérifier avec <code>.not</code></h3>
			<CodeBlock
				lang="js"
				lines={[
					"test('a page with a violation fails the assertion', () => {",
					"  document.body.innerHTML = '<main><img src=\"logo.png\"></main>';",
					"",
					"  expect(document.body).not.toHaveNoA11yViolations();",
					"});",
				]}
			/>

			<h3>Réutiliser une analyse pour plusieurs assertions</h3>
			<p>
				Si vous calculez déjà vous-même un résultat d’analyse surea11y (pour vérifier des règles
				précises dans plusieurs blocs <code>it()</code> sans relancer l’analyse à chaque fois),
				passez directement l’objet résultat au lieu d’un nœud DOM :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"const { runDomRulesInPage } = require('@surea11y/core');",
					"",
					"const result = runDomRulesInPage(null, '#main', {}, null);",
					"expect(result).toHaveNoA11yViolations();",
				]}
			/>

			<h2>Filtrer et configurer les analyses</h2>
			<p>
				Le deuxième argument accepte tout ce qu’accepte <code>@surea11y/core</code> ; voir{" "}
				<a href="/configuration/engine-options/">Options du moteur</a> pour l’ensemble des options. Quelques cas courants :
			</p>
			<CodeBlock
				lang="js"
				lines={[
					"// Only run rules relevant to WCAG 2.0 A",
					"expect(container).toHaveNoA11yViolations({ tags: { include: 'wcag2a' } });",
					"",
					"// Skip a rule you've decided not to enforce yet",
					"expect(container).toHaveNoA11yViolations({ rules: { exclude: 'target-size-minimum' } });",
					"",
					"// Ignore a third-party widget you don't control",
					"expect(container).toHaveNoA11yViolations({ excludeSelectors: ['.intercom-launcher'] });",
				]}
			/>

			<h2>API</h2>
			<DataTable
				label="Paramètres du matcher"
				rowKey="id"
				columns={[
					{ key: "param", label: "Paramètre", width: "18%" },
					{ key: "type", label: "Type", width: "26%" },
					{ key: "meaning", label: "Signification", wrap: true },
				]}
				rows={apiRows}
			/>
			<p>
				Renvoie la forme <code>{"{ pass, message }"}</code> qu’attend le <code>expect.extend()</code>{" "}
				des deux frameworks. Vous ne l’appelez jamais directement : il est branché une fois via{" "}
				<code>expect.extend()</code>, comme indiqué dans « Mise en place » ci-dessus.
			</p>

			<h2>Ce qu’il vérifie, et ce qu’il ne vérifie pas</h2>
			<p>
				<strong>Seuls les résultats <code>fail</code> font échouer l’assertion</strong>, conformément à la
				convention de tous les autres bindings surea11y selon laquelle les résultats <code>cantTell</code>{" "}
				sont indicatifs et non des échecs. Un lien vague comme{" "}
				<code>&lt;a href="/pricing"&gt;Click here&lt;/a&gt;</code> est <code>cantTell</code>, pas{" "}
				<code>fail</code> : à lui seul, il ne fait donc jamais échouer un test qui passe. En revanche,
				lorsqu’une assertion échoue <em>bel et bien</em> pour d’autres raisons, les éventuels
				résultats <code>cantTell</code> sont ajoutés au message d’échec dans une note séparée, pour
				rester visibles. Voir <a href="/help/known-limitations/">Limites connues</a> pour ce que
				ce moteur n’automatise pas du tout.
			</p>
			<p>
				<strong>Limiter l’analyse à un élément ne rapporte que ce qu’il contient</strong> : un échec
				ailleurs dans la page ne fait jamais échouer une assertion limitée à un{" "}
				<code>container</code>. En interne, l’élément analysé reçoit temporairement un attribut
				unique et est analysé via ce sélecteur, de façon invisible pour votre test.
			</p>
			<p>
				<strong>Quelques règles vérifient une propriété de la page entière</strong>, et non d’un
				sous-arbre précis : <code>page-title-present</code>, <code>html-lang-attr-present</code> et
				quelques autres vérifient directement <code>document.title</code>/<code>document.documentElement</code>,
				car se demander si <em>la page</em> a un titre n’a pas de sens pour un fragment de composant
				quelconque. Si vous passez un <code>Element</code> (un <code>container</code> de
				testing-library, <code>document.body</code>), ces règles renvoient <code>notApplicable</code>{" "}
				plutôt que <code>fail</code>, donc un <code>&lt;title&gt;</code> absent ne fait jamais
				échouer un test de composant ; si vous passez <code>document</code> lui-même, elles sont
				réellement évaluées. Si vous analysez directement <code>document</code>, définissez{" "}
				<code>document.title</code> et le <code>lang</code> de{" "}
				<code>document.documentElement</code> une seule fois dans votre fichier de setup plutôt que
				dans chaque test.
			</p>

			<h2>Messages d’échec</h2>
			<p>
				Le message liste chaque occurrence, pas seulement chaque règle (une règle peut signaler
				plusieurs éléments), avec l’ID de la règle, la gravité, un résumé lisible, le sélecteur
				de l’élément en échec et une piste de correction lorsqu’elle existe :
			</p>
			<CodeBlock
				lines={[
					"expected no accessibility violations, but found 1:",
					"",
					"1) img-alt-present (serious): Missing alt attribute on <img>.",
					"   at html > body > img",
					"   Add an alt attribute or use alt=\"\" for decorative images.",
				]}
			/>
			<p>
				Les éventuels résultats <code>cantTell</code> présents à côté des échecs sont ajoutés dans
				une note séparée, pour rester visibles sans influer sur <code>pass</code>/<code>fail</code> :
			</p>
			<CodeBlock lines={["2 rule(s) need manual review (cantTell, not counted as failures): link-name-quality-manual, color-contrast-computable"]} />

			<p>
				Des exemples exécutables, côte à côte, pour les deux frameworks :{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/basic.test.js">Jest</a>{" "}
				et{" "}
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/basic.vitest.test.js">
					Vitest
				</a>
				. Pour l’ensemble des <code>engineOptions</code> (locale, modes de contraste, shadow DOM,
				règles personnalisées, combinaisons de tags de version WCAG), voir{" "}
				<a href={`${core}/docs/ENGINE_OPTIONS.md`}><code>ENGINE_OPTIONS.md</code></a> : ce paquet
				transmet tout ce que vous lui passez au lieu de dupliquer cette référence.
			</p>
		</>
	);
}
