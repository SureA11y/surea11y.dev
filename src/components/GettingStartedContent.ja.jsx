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
		reason: (
			<>
				連携のコードを書く必要がありません。ファイル、URL、サイトマップ、CIのステップに対してコマンドを1つ実行するだけです。
				<code>--browser</code>
				を付ければ、JavaScriptでレンダリングされるページもスキャンします。
			</>
		),
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
					"",
					"surea11y scan: file:///path/to/index.html",
					"  engine: @surea11y/core 1.15.0",
					"  pass: 14   fail: 3   cantTell: 2   notApplicable: 126",
					"",
					"  occurrences by tier: fail: 3   cantTell: 2",
					"  needs review: likely fail: 0   likely pass: 0   needs a person: 2",
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
					"      Element has insufficient color contrast of 2.85:1 (foreground:",
					"      #999999, background: #ffffff, font size: 16px, font weight: normal).",
					"      Expected contrast ratio of 4.5:1 (normal text).",
					"      hint: Change the text color, the background color, or both, so the",
					"      contrast ratio reaches at least 4.5:1.",
					"",
					"  page-title-present  (serious, 1 fail occurrence(s))",
					"    - head > title",
					"      This page has no <title> element.",
					"      hint: Add a <title> that says what the page is about or what it is for.",
					"",
					"cantTell — needs human review (2 rule(s)): link-name-quality,",
					"manual-review",
					"",
					"criteria (WCAG 2.2):",
					"  fail       1.4.3 Contrast: minimum; 1.4.6 Contrast: enhanced; 2.4.2 Page",
					"             titled",
					"  cantTell   1.1.1 Non-text content: text alternatives; 1.2.1 Audio-only",
					"             and video-only (prerecorded): transcript; 1.2.2 Captions",
					"             (Prerecorded); 1.3.1 Info and Relationships; 1.3.4",
					"             Orientation; 1.3.5 Identify Input Purpose; 1.4.1 Use of",
					"             Color; 1.4.2 Audio Control; 1.4.4 Resize Text; 1.4.5 Images",
					"             of Text; 1.4.12 Text Spacing; 2.1.1 Keyboard; 2.1.3 Keyboard",
					"             (No Exception); 2.2.1 Timing Adjustable; 2.2.2 Pause, Stop,",
					"             Hide; 2.2.4 Interruptions; 2.4.1 Bypass Blocks; 2.4.3 Focus",
					"             order; 2.4.4 Link Purpose (In Context); 2.4.6 Headings and",
					"             Labels; 2.4.7 Focus visible; 2.4.9 Link Purpose (Link Only);",
					"             2.5.8 Target size: minimum; 3.1.1 Language of page; 3.1.2",
					"             Language of Parts; 3.2.5 Change on Request; 3.3.1 Error",
					"             Identification; 3.3.2 Labels or Instructions; 3.3.8",
					"             Accessible Authentication (Minimum); 4.1.2 Name, role, value:",
					"             accessible name; 4.1.2 Name, role, value: ARIA validity;",
					"             4.1.3 Status Messages",
					"  notApplicable: 2",
					"  A criterion that passes here means the checks that ran found nothing in",
					"  it, not that the page conforms.",
				]}
			/>
			<p>
				エンジンが確信を持っている問題が2つあり、
				<code>fail</code>
				になっています。AAとAAAの両方の比率で不合格になった低コントラストのテキストと、欠けている
				<code>&lt;title&gt;</code>
				です。次に、人がレビューするための
				<code>cantTell</code>
				の一覧（「<span lang="en">Click here</span>」はリンク名として適切か、手動で確認すべきものがないか）があります。
				<code>needs review</code>
				の行は、どちらの問いもどちらにも傾いておらず、どちらも人の確認が必要なことを示しています。126件の
				<code>notApplicable</code>
				の中には
				<code>target-size-minimum</code>
				があります。このルールは実際のCSSレイアウトがないと実行できず、静的なHTMLのスキャンにはそれがないためです（
				<code>--browser</code>
				を付ければレイアウトがあります）。
			</p>
			<p>
				最後のブロックは、同じ結果をWCAG 2.2の達成基準ごとに示しています。1.4.3、1.4.6、2.4.2は
				<code>fail</code>
				、スキャンがチェックするほかの達成基準はすべて人が判断する
				<code>cantTell</code>
				で、判断する対象のなかった2つの達成基準は件数だけが示されます。
				<code>pass</code>
				として示される達成基準はありません。
				<code>@surea11y/core</code>
				1.14から、達成基準が合格になるのは、そのルールが基準の求めることをすべてチェックする場合だけで、まだそうした基準はないため、ルールがすべて合格しても残りは人が確認します。完全な結果の各フィールドの意味は
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
					<strong>ターミナルやCIパイプラインから、静的なHTMLとして、またはブラウザーでページをチェックする：</strong>
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
