import React from "react";
import { Callout } from "./design-system/feedback/Callout.jsx";
import { DataTable } from "./design-system/data/DataTable.jsx";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const choiceRows = [
	{
		need: "実際のWebアプリケーションを分析する",
		recommended: <a href="/getting-started/playwright/">Playwright</a>,
		reason: "実際のブラウザーを操作し、最近のテストスイートがすでに使っている連携方法なので、結果に実際のレイアウトとレンダリングが反映されます。",
	},
	{
		need: "静的なHTMLを分析する",
		recommended: <a href="/getting-started/cli/">CLI</a>,
		reason: "連携のコードを書く必要がありません。ファイル、URL、CIのステップに対してコマンドを1つ実行するだけです。",
	},
	{
		need: "Cypress、Selenium、Puppeteer、WebdriverIOをすでに使っている",
		recommended: "対応するバインディング",
		reason: "すでにあるテスト環境にそのまま組み込めます。",
	},
	{
		need: "ユニットテスト、コンポーネントテスト",
		recommended: <a href="/getting-started/test-matchers/">test-matchers</a>,
		reason: "jsdomを対象にJest/Vitestと直接連携します。",
	},
	{
		need: "独自の連携、またはエンジンへの直接アクセス",
		recommended: <a href="/getting-started/standalone/"><code>@surea11y/core</code></a>,
		reason: "実行と結果を最大限に制御できます。",
	},
];

export function GettingStartedContent() {
	return (
		<>
			<h2>インストール</h2>
			<p>
				インストールのコマンドは1つではありません。surea11yはコアエンジンと、個別に公開されているバインディング群で構成されているため、どのパッケージをインストールするかは、テストやスクリプトを現在どう実行しているかによって決まります。使っている環境に合わせて選んでください。
			</p>
			<Callout tone="note" title="どこから始めればよいかわからない場合">
				<p>
					実際のWebアプリケーションをスキャンするなら
					<a href="/getting-started/playwright/">Playwright</a>
					、ターミナルやCIパイプラインから静的なHTMLをチェックするなら
					<a href="/getting-started/cli/">CLI</a>
					を使ってください。
				</p>
			</Callout>
			<DataTable
				rowKey="need"
				columns={[
					{ key: "need", label: "目的", wrap: true },
					{ key: "recommended", label: "おすすめ" },
					{ key: "reason", label: "理由", wrap: true },
				]}
				rows={choiceRows}
			/>

			<h2>5分でわかる例</h2>
			<p>
				実際の結果を見るいちばん速い方法はCLIです。ブラウザーの準備もテストフレームワークも要りません。最小限のページをスキャンしてみます。
			</p>
			<CodeBlock lang="html" lines={[
				"<html lang=\"en\">",
				"  <body>",
				"    <main>",
				"      <h1>Welcome</h1>",
				"      <p style=\"color: #999999; background-color: #ffffff;\">This text has low contrast.</p>",
				"      <a href=\"/details\">Click here</a>",
				"    </main>",
				"  </body>",
				"</html>",
			]} />
			<CodeBlock
				lines={[
					{ text: "npm install -g @surea11y/cli", command: true },
					{ text: "surea11y scan ./index.html", command: true },
				]}
			/>
			<CodeBlock
				lines={[
					"surea11y scan: file:///path/to/index.html",
					"  pass: 6   fail: 2   cantTell: 3   notApplicable: 114",
					"",
					"  occurrences by tier: fail: 2   cantTell: 4",
					"",
					"FAIL (2 rule(s)):",
					"",
					"  contrast-enhanced  (serious, 1 fail occurrence(s))",
					"    - html > body > main > p",
					"      Element has insufficient color contrast (AAA) of 2.85:1 (foreground: #999999,",
					"      background: #ffffff, font size: 0px, font weight: normal). Expected contrast",
					"      ratio of 7:1 (normal text).",
					"",
					"  contrast-minimum  (serious, 1 fail occurrence(s))",
					"    - html > body > main > p",
					"      Element has insufficient color contrast of 2.85:1 (foreground: #999999,",
					"      background: #ffffff, font size: 0px, font weight: normal). Expected contrast",
					"      ratio of 4.5:1 (normal text).",
					"",
					"cantTell — needs human review (3 rule(s)): contrast-computable, link-name-quality,",
					"manual-review",
				]}
			/>
			<p>
				エンジンが確信を持っている
				<code>fail</code>
				が1つ（コントラスト）、人がレビューするための
				<code>cantTell</code>
				の一覧（「<span lang="en">Click here</span>」はリンク名として適切か、同じ低コントラストのテキストが別のチェックでは合格するか、手動で確認すべきものがないか）、そして114件の
				<code>notApplicable</code>
				の中に
				<code>target-size-minimum</code>
				があります。このルールは実際のCSSレイアウトがないと実行できず、静的なHTMLのスキャンにはそれがないためです。完全な結果の各フィールドの意味は
				<a href="/results-reports/output-schema/">結果とレポート</a>
				を参照してください。
			</p>
			<ul>
				<li>
					<strong>実際のブラウザーまたはヘッドレスブラウザーを操作するE2Eテスト：</strong>
					<a href="/getting-started/cypress/">Cypress</a>
					、
					<a href="/getting-started/playwright/">Playwright</a>
					、
					<a href="/getting-started/puppeteer/">Puppeteer</a>
					、
					<a href="/getting-started/selenium/">Selenium</a>
					、
					<a href="/getting-started/webdriverio/">WebdriverIO</a>
					。
				</li>
				<li>
					<strong>jsdomを対象にしたユニットテスト、コンポーネントテスト：</strong>
					Jest/Vitest向けの
					<a href="/getting-started/test-matchers/">test-matchers</a>
					。
				</li>
				<li>
					<strong>ターミナルやCIパイプラインから静的なHTMLをチェックする：</strong>
					<a href="/getting-started/cli/">CLI</a>
					。
				</li>
				<li>
					<strong>テストフレームワークもビルド手順もない場合：</strong>
					<a href="/getting-started/standalone/">スタンドアロン</a>
					。
					<code>@surea11y/core</code>
					を直接インストールするか、ブラウザー用バンドルを読み込みます。
				</li>
			</ul>

			<h2>使い方</h2>
			<p>
				jsdom、実際のブラウザー、どのバインディング、CLIと、スキャンをどう実行しても、返ってくるのは同じネイティブの結果の形です。
				<code>checksResults</code>
				（ルールごとに1件のエントリー。
				<code>pass</code>
				/
				<code>notApplicable</code>
				もすべて含み、「違反だけ」のリストではありません）と
				<code>rulesResults</code>
				（WCAG達成基準の集約）です。これはほかの広く使われているアクセシビリティテストツールの
				<code>violations</code>
				/
				<code>passes</code>
				/
				<code>incomplete</code>
				/
				<code>inapplicable</code>
				という形とは
				<strong>異なります</strong>
				。各バインディングのメソッド名は、移行しやすいようにこの分野でよく使われる慣例にならっていますが、より情報量の多い結果のスキーマはそのまま保っています。スキーマの全体は
				<a href="/results-reports/output-schema/">結果とレポート</a>
				を参照してください。
			</p>
		</>
	);
}
