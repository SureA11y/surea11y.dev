import React from "react";
import { CodeBlock } from "./design-system/core/CodeBlock.jsx";

const core = "https://github.com/SureA11y/core/blob/main";

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
					{ text: "surea11y scan https://example.com/ --tags wcag2a,wcag2aa", command: true },
				]}
			/>
			<p>
				Node.js
				<code>^20.19.0 || ^22.13.0 || &gt;=24.0.0</code>
				が必要です。
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
			<h2>制限事項</h2>
			<p>
				<code>cantTell</code>
				は終了コードに影響しません。
				<code>0</code>
				は問題なし、
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
				は使い方の誤りまたはスキャンのエラーです。CLIが読むのは
				<strong>静的なHTMLだけ</strong>
				です。ローカルファイルか、HTTP(S) GETで取得した生のレスポンスボディを読み、ページのJavaScriptは一切実行しません。クライアントサイドでレンダリングされるページには、いずれかのバインディングを使うか、実際に操作しているブラウザーに対してエンジンを直接呼び出してください（
				<a href={`${core}/docs/INTEGRATION.md`}><code>INTEGRATION.md</code></a>
				の<span lang="en">Pattern 2</span>を参照）。
			</p>
			<p>
				フラグの完全なリファレンス、カスタムルールの契約、CIのレシピは
				<a href="https://github.com/SureA11y/cli/blob/main/docs/CLI.md"><code>docs/CLI.md</code></a>
				にあります。CIパイプラインのテンプレートについては
				<a href="/configuration/ci-integration/">CI連携</a>
				を参照してください。
			</p>
		</>
	);
}
