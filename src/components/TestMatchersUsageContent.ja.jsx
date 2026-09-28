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
				<code>Element</code>
				、
				<code>Document</code>
				、またはスキャン結果
			</>
		),
		meaning: (
			<>
				チェック対象です。DOMの
				<code>Element</code>
				／
				<code>Document</code>
				は自動的にスキャンされます。
				<code>{"{ checksResults: [...] }"}</code>
				の形をしたオブジェクトはスキャンせず、そのままアサーションの対象になります。それ以外を渡すと
				<code>TypeError</code>
				が投げられます。
			</>
		),
	},
	{
		id: "engineOptions",
		param: <code>engineOptions</code>,
		type: "object（省略可）",
		meaning: (
			<>
				<code>@surea11y/core</code>
				のスキャンにそのまま渡されます。エコシステムのほかの場所で使うものと同じオプションオブジェクトです（
				<a href="/configuration/engine-options/">エンジンオプション</a>
				を参照）。
				<code>received</code>
				がすでにスキャン結果の場合は無視されます。
			</>
		),
	},
];

export function TestMatchersUsageContent() {
	return (
		<>
			<p>
				ユニットテストやコンポーネントテスト向けです。実際のブラウザーやヘッドレスブラウザーを操作するのではなく、JestやVitestのテストの中で、テストがすでに持っているDOMに対してアクセシビリティをその場でアサーションします。レンダリングされたページ全体をテストする場合は、
				<a href="/getting-started/">ブラウザーを操作するバインディング</a>
				を参照してください。
			</p>
			<p>
				<a href="https://github.com/SureA11y/test-matchers"><code>@surea11y/test-matchers</code></a>
				は
				<code>toHaveNoA11yViolations()</code>
				という1つのマッチャーで、手を加えずにそのまま、どちらのフレームワークの
				<code>expect.extend()</code>
				にも組み込めます。フレームワーク固有のコードは持っていません。テストがすでに動いているjsdomベースの環境をスキャンするもので、
				<code>jsdom</code>
				自体に依存したり、環境を用意したりはしません。surea11yのエンジンは同期的に動くので、このマッチャーも同期的です。
				<code>await</code>
				は不要で、書き忘れて解決済みのPromiseに対して黙って成功してしまうこともありません。
			</p>
			<CodeBlock lines={[{ text: "npm install --save-dev @surea11y/test-matchers", command: true }]} />

			<h2>セットアップ</h2>
			<p>
				テスト環境はあらかじめjsdomベースになっている必要があります。このマッチャーは、その環境が提供する
				<code>document</code>
				／
				<code>window</code>
				をスキャンします。テストランナーがすでに読み込んでいるセットアップファイルで、マッチャーを1度だけ登録してください。
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
				同梱の
				<code>.d.ts</code>
				は、Jestのグローバルな
				<code>jest.Matchers</code>
				インターフェースと、Vitestの
				<code>@vitest/expect</code>
				インターフェースの両方を拡張します。そのために
				<code>@types/jest</code>
				や
				<code>vitest</code>
				をimportする必要はありません。実際にインストールされているフレームワークに対応する拡張だけが有効になります。
			</p>

			<h2>使い方</h2>
			<p>通常のDOMノードに対して使えます。</p>
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
				<span lang="en">Testing Library</span>系の
				<code>container</code>
				にも使えます。<span lang="en">React Testing Library</span>、<span lang="en">Vue Test Utils</span>の
				<code>wrapper.element</code>
				、<span lang="en">Angular Testing Library</span>、<span lang="en">Svelte Testing Library</span>のいずれも、レンダリングされたDOM要素を同じ形で公開しているからです。
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
				テストランナーの側でもフレームワークを問いません。マッチャーを登録すれば、上のコードはJestでもVitestでもまったく同じです。
			</p>

			<h3><code>.not</code>によるアサーション</h3>
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

			<h3>1回のスキャン結果を複数のアサーションで使い回す</h3>
			<p>
				複数の
				<code>it()</code>
				ブロックで特定のルールを毎回スキャンし直さずに確認するため、surea11yのスキャン結果を自分で計算している場合は、DOMノードの代わりにその結果オブジェクトを直接渡してください。
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

			<h2>スキャンの絞り込みと設定</h2>
			<p>
				第2引数には
				<code>@surea11y/core</code>
				が受け付けるものなら何でも渡せます。全体は
				<a href="/configuration/engine-options/">エンジンオプション</a>
				を参照してください。よくある例をいくつか挙げます。
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
				rowKey="id"
				columns={[
					{ key: "param", label: "引数", width: "18%" },
					{ key: "type", label: "型", width: "26%" },
					{ key: "meaning", label: "意味", wrap: true },
				]}
				rows={apiRows}
			/>
			<p>
				どちらのフレームワークの
				<code>expect.extend()</code>
				も期待する
				<code>{"{ pass, message }"}</code>
				の形を返します。これを直接呼ぶことはありません。上の「セットアップ」で示したとおり、
				<code>expect.extend()</code>
				で1度登録するだけです。
			</p>

			<h2>チェックすること、しないこと</h2>
			<p>
				<strong>
					アサーションを失敗させるのは
					<code>fail</code>
					の判定結果だけです
				</strong>
				。これは、
				<code>cantTell</code>
				の結果は失敗ではなく参考情報とする、ほかのすべてのsurea11yバインディングの慣例に合わせています。
				<code>&lt;a href="/pricing"&gt;Click here&lt;/a&gt;</code>
				のようなあいまいなリンクは
				<code>fail</code>
				ではなく
				<code>cantTell</code>
				なので、それだけで成功しているテストが壊れることはありません。ただし、ほかの理由でアサーションが
				<em>実際に</em>
				失敗した場合は、
				<code>cantTell</code>
				の結果が失敗メッセージに別の注記として追加されるので、見落とすことはありません。このエンジンがまったく自動化しないことについては
				<a href="/help/known-limitations/">既知の制限事項</a>
				を参照してください。
			</p>
			<p>
				<strong>要素に範囲を絞ると、その内側のことだけが報告されます</strong>
				。ページのほかの場所にある問題で、1つの
				<code>container</code>
				に絞ったアサーションが失敗することはありません。内部的には、スキャン対象の要素に一時的に固有の属性を付け、そのセレクターでスキャンしています。テストからは見えません。
			</p>
			<p>
				<strong>いくつかのルールはページ全体についての事実をチェックします</strong>
				。特定のサブツリーの中身ではありません。
				<code>page-title-present</code>
				、
				<code>html-lang-attr-present</code>
				などは
				<code>document.title</code>
				／
				<code>document.documentElement</code>
				を直接チェックします。任意のコンポーネントの断片に対して、
				<em>ページ</em>
				にタイトルがあるかを問うのは意味がないからです。
				<code>Element</code>
				（<span lang="en">Testing Library</span>の
				<code>container</code>
				や
				<code>document.body</code>
				）を渡すと、これらは
				<code>fail</code>
				ではなく
				<code>notApplicable</code>
				と報告されるので、
				<code>&lt;title&gt;</code>
				がなくてもコンポーネント単位のテストが壊れることはありません。
				<code>document</code>
				そのものを渡すと、実際に評価されます。
				<code>document</code>
				を直接スキャンする場合は、テストごとではなくセットアップファイルで1度だけ
				<code>document.title</code>
				と
				<code>document.documentElement</code>
				の
				<code>lang</code>
				を設定してください。
			</p>

			<h2>失敗メッセージ</h2>
			<p>
				ルール単位ではなく検出箇所ごとにすべて列挙します（1つのルールが複数の要素を検出することがあるためです）。各項目には、ルールID、重大度、読みやすい要約、問題のある要素のセレクター、そして可能な場合は修正のヒントが含まれます。
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
				失敗と一緒に
				<code>cantTell</code>
				の結果がある場合は別の注記として追加されるので、
				<code>pass</code>
				／
				<code>fail</code>
				に影響を与えずに目に入るようになっています。
			</p>
			<CodeBlock lines={["2 rule(s) need manual review (cantTell, not counted as failures): link-name-quality-manual, color-contrast-computable"]} />

			<p>
				両フレームワークの実行可能な例を並べて用意しています：
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/basic.test.js">Jest</a>
				、
				<a href="https://github.com/SureA11y/test-matchers/blob/main/examples/basic.vitest.test.js">
					Vitest
				</a>
				。
				<code>engineOptions</code>
				の全体（ロケール、コントラストのモード、Shadow DOM、カスタムルール、WCAGバージョンのタグの組み合わせ）については
				<a href={`${core}/docs/ENGINE_OPTIONS.md`}><code>ENGINE_OPTIONS.md</code></a>
				を参照してください。このパッケージは、そのリファレンスを重複して持つのではなく、渡されたものをそのまま転送します。
			</p>
		</>
	);
}
