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
				label="どれを選ぶか"
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
					"  engine: @surea11y/core 1.12.0",
					"  pass: 13   fail: 3   cantTell: 3   notApplicable: 115",
					"",
					"  occurrences by tier: fail: 3   cantTell: 4",
					"",
					"FAIL (3 rule(s)):",
					"",
					"  contrast-enhanced  (serious, 1 fail occurrence(s))",
					"    - html > body > main > p",
					"      Element has insufficient color contrast (AAA) of 2.85:1 (foreground:",
					"      #999999, background: #ffffff, font size: 16px, font weight: normal).",
					"      Expected contrast ratio of 7:1 (normal text).",
					"      hint: Change the text color, the background color, or both, so the",
					"      contrast ratio reaches at least 7:1.",
					"",
					"  contrast-minimum  (serious, 1 fail occurrence(s))",
					"    - html > body > main > p",
					"      Element has insufficient color contrast of 2.85:1 (foreground: #999999,",
					"      background: #ffffff, font size: 16px, font weight: normal). Expected",
					"      contrast ratio of 4.5:1 (normal text).",
					"      hint: Change the text color, the background color, or both, so the",
					"      contrast ratio reaches at least 4.5:1.",
					"",
					"  page-title-present  (serious, 1 fail occurrence(s))",
					"    - head > title",
					"      This page has no <title> element.",
					"      hint: Add a <title> that says what the page is about or what it is for.",
					"",
					"cantTell — needs human review (3 rule(s)): contrast-computable, link-name-quality,",
					"manual-review",
					"",
					"criteria (WCAG 2.2):",
					"  fail       1.4.3 Contrast: minimum; 1.4.6 Contrast: enhanced;",
					"             2.4.2 Page titled",
					"  cantTell   2.1.1 Keyboard; 2.4.3 Focus order;",
					"             2.4.4 Link Purpose (In Context); 2.4.7 Focus visible;",
					"             2.4.9 Link Purpose (Link Only)",
					"  pass       1.3.1 Info and Relationships; 2.2.2 Pause, Stop, Hide;",
					"             2.4.1 Bypass Blocks; 3.1.1 Language of page;",
					"             4.1.2 Name, role, value: accessible name;",
					"             4.1.2 Name, role, value: ARIA validity",
					"  notApplicable: 20",
					"  A criterion that passes here means the checks that ran found nothing in it,",
					"  not that the page conforms.",
				]}
			/>
			<p>
				エンジンが確信を持っている問題が2つあり、
				<code>fail</code>
				になっています。AAとAAAの両方の比率で不合格になった低コントラストのテキストと、欠けている
				<code>&lt;title&gt;</code>
				です。次に、人がレビューするための
				<code>cantTell</code>
				の一覧（「<span lang="en">Click here</span>」はリンク名として適切か、同じ低コントラストのテキストが別のチェックでは合格するか、手動で確認すべきものがないか）、そして115件の
				<code>notApplicable</code>
				の中に
				<code>target-size-minimum</code>
				があります。このルールは実際のCSSレイアウトがないと実行できず、静的なHTMLのスキャンにはそれがないためです。
			</p>
			<p>
				最後のブロックは、同じ結果をWCAG 2.2の達成基準ごとに示しています。1.4.3、1.4.6、2.4.2は
				<code>fail</code>
				、2.1.1、2.4.3、2.4.4、2.4.7、2.4.9は人が判断する
				<code>cantTell</code>
				、1.3.1、2.2.2、2.4.1、3.1.1と4.1.2の2項目は
				<code>pass</code>
				です。判断する対象のなかった20の達成基準は件数だけが示されます。覚えておきたいのは最終行です。ここで合格した達成基準は、実行されたチェックがその中に何も見つけなかったという意味であり、ページが適合しているという意味ではありません。完全な結果の各フィールドの意味は
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
				／
				<code>notApplicable</code>
				もすべて含み、「違反だけ」のリストではありません）と
				<code>rulesResults</code>
				（WCAG達成基準の集約）です。これはほかの広く使われているアクセシビリティテストツールの
				<code>violations</code>
				／
				<code>passes</code>
				／
				<code>incomplete</code>
				／
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
