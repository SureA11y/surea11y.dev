import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";
const cliDocs = "https://github.com/SureA11y/cli/blob/main/docs/CLI.md";

export function CliUsageContent() {
	return (
		<>
			<p>
				コードの代わりにコマンドで実行します。テストフレームワークもNodeスクリプトも不要なので、パイプラインの1ステップや、ビルド成果物の簡単なチェックに向いています。
			</p>

			<h2>最初のスキャン</h2>
			<CodeBlock
				lines={[
					{ text: "npm install -g @surea11y/cli", command: true },
					{ text: "surea11y scan ./index.html", command: true },
					{ text: "surea11y scan https://example.com/ --wcag 2.2", command: true },
				]}
			/>
			<p>
				Node.js
				<code>^20.19.0 || ^22.13.0 || &gt;=24.0.0</code>
				が必要です。概要には、スキャンを実行した
				<code>@surea11y/core</code>
				のリリースが示されます。
			</p>
			<CodeBlock
				lines={[
					"$ surea11y scan ./index.html",
					"",
					"surea11y scan: file:///path/to/index.html",
					"  engine: @surea11y/core 1.11.1",
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
				]}
			/>

			<h2 id="choosing-what-runs">実行するものを選ぶ</h2>
			<p>
				<code>--wcag</code>
				は、WCAGの適合性の目標に対応するルールを、各達成基準がそのバージョンで持つレベルに従って選択します。
				<code>--wcag-level</code>
				はレベルを設定します（指定しなければ
				<code>AA</code>
				）。
				<code>--best-practices</code>
				は、
				<code>region</code>
				や
				<code>heading-order</code>
				など、WCAGの達成基準を検査しないルールを追加します。単独で使うと、それらのルールだけを実行します。
				<code>--profile</code>
				は、
				<code>en301549-v4.1.1</code>
				やパック独自のものなど、適合性プロファイルを実行します。
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --wcag 2.2                    # WCAG 2.2, Level A and AA", command: true },
					{ text: "surea11y scan ./dist/index.html --wcag 2.1 --wcag-level A     # WCAG 2.1, Level A", command: true },
					{ text: "surea11y scan ./dist/index.html --wcag 2.2 --best-practices   # and the best practices", command: true },
				]}
			/>
			<p>
				WCAG 2.2で削除された4.1.1「構文解析」は、
				<code>2.1</code>
				の目標には含まれ、
				<code>2.2</code>
				の目標には含まれません。
				<code>--rules</code>
				と
				<code>--tags</code>
				は目標のルールに追加され、
				<code>--exclude-rules</code>
				はその後に適用されます。
				<code>--profile</code>
				と併用すると、
				<code>--best-practices</code>
				はそのルールを追加し、プロファイルも引き続き適用されます。
				<code>--wcag</code>
				、
				<code>--rules</code>
				、
				<code>--tags</code>
				はプロファイルの代わりにルールを選ぶため、
				<code>--profile</code>
				をこれらのいずれかと併用すると終了コード
				<code>2</code>
				で終了します。これらは
				<code>runOnly.wcag</code>
				、
				<code>runOnly.bestPractices</code>
				、
				<code>engineOptions.profile</code>
				に対応します（
				<a href="/configuration/engine-options/#selecting-which-rules-run">エンジンオプション</a>
				を参照）。
			</p>

			<h2 id="packs">パック</h2>
			<p>
				<code>--pack</code>
				は、
				<a href="/configuration/packs/">パック</a>
				（ルール、規格、チェックリストと、それらのプロファイル）を、作業ディレクトリのプロジェクトから解決されるパッケージ名か、パスで読み込みます。
				<code>--profile</code>
				はそのプロファイルの1つを実行します。複数のパックでスキャンするには
				<code>--pack</code>
				を繰り返します。
			</p>
			<CodeBlock
				lines={[
					{ text: "surea11y scan ./dist/index.html --pack @acme/a11y-policy --profile acme-web-2026", command: true },
					{ text: "surea11y scan ./dist/index.html --pack ./acme-policy-pack.js --profile acme-web-2026", command: true },
				]}
			/>
			<p>
				概要には、実行されたプロファイルとパックが示され、
				<code>--json</code>
				ではそれらが
				<code>engine.profile</code>
				と
				<code>engine.packs</code>
				に入ります。見つからない、読み込めない、またはエンジンがスキップしたパックは、レポートを書き出さずに終了コード
				<code>2</code>
				で終了します。そのため、パックのチェックが実行されないままスキャンが合格することはありません。
			</p>

			<h2 id="compact-results">コンパクトな結果</h2>
			<p>
				<code>--compact</code>
				は、
				<code>pass</code>
				と
				<code>notApplicable</code>
				の各結果を、ルール、判定結果、種類だけにします（
				<code>engineOptions.output.detail: 'findings'</code>
				）。CIのアーティファクトとして結果を保存するための、より小さな
				<code>--json</code>
				です。概要、終了コード、ベースライン、HTML・SARIF・JUnitのレポートは、付けない場合と同じです。
			</p>
			<CodeBlock lines={[{ text: "surea11y scan ./dist/index.html --compact --json > result.json", command: true }]} />

			<h2>終了コードと制限事項</h2>
			<p>
				<code>cantTell</code>
				は終了コードに影響しません。
				<code>0</code>
				は失敗となる判定結果なし、
				<code>1</code>
				は
				<code>fail</code>
				が1件以上ある場合（
				<code>--baseline</code>
				を付けてスキャンした場合は、
				<em>新しい</em>
				<code>fail</code>
				が1件以上ある場合。CIゲートで使うケースです。何が「既知」で何が「新規」とみなされるかは
				<a href="/conformance/baseline/">ベースライン／許可リスト</a>
				を参照）、
				<code>2</code>
				は使い方の誤りまたはスキャンのエラー、あるいは何もチェックしないか、求められたより少なくしかチェックしないスキャンです。既知のルールやタグを1つも示さない
				<code>--rules</code>
				／
				<code>--tags</code>
				のリスト、何にも一致しない
				<code>--context</code>
				のセレクター、実行されなかったカスタムルールやパック、適用されなかった
				<code>--profile</code>
				がこれに当たります。CLIが読むのは
				<strong>静的なHTMLだけ</strong>
				です。ローカルファイルか、HTTP(S) GETで取得した生のレスポンスボディを読み、ページのJavaScriptは一切実行しません。クライアントサイドでレンダリングされるページには、いずれかのバインディングを使うか、実際に操作しているブラウザーに対してエンジンを直接呼び出してください（
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>
				の<span lang="en">Pattern 2</span>を参照）。
			</p>
			<p>
				フラグの完全なリファレンス、カスタムルールの契約、パック、CIのレシピは
				<a href={cliDocs}><code>docs/CLI.md</code></a>
				にあります。CIパイプラインのテンプレートについては
				<a href="/configuration/ci-integration/">CI連携</a>
				を参照してください。
			</p>
		</>
	);
}
